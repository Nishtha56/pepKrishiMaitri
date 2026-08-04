import MSPPrice from '../models/MSPPrice.js';

const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001dfcc5ff6e4954358542ceb05e890bfe6';
const KHARIF_RESOURCE_ID = '37a192d8-355d-409a-845a-00d0f6cfac55';
const RABI_RESOURCE_ID = 'b45f166a-9a89-492f-a8ed-3cb245850408';

/**
 * Normalize crop name to create a consistent key
 * "Paddy (Common)" -> "paddy_common"
 */
function normalizeCropName(name) {
    return name
        .toLowerCase()
        .replace(/[()]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .trim();
}

/**
 * Parse year column name to standard format
 * "kms_2024_25" -> "2024-25"
 * "rms_2023_24" -> "2023-24"
 */
function parseYearFromColumn(columnName) {
    const match = columnName.match(/(?:kms|rms)_(\d{4})_(\d{2})/i);
    if (match) {
        return `${match[1]}-${match[2]}`;
    }
    return null;
}

/**
 * Get MSP widget data - latest MSP for all crops
 * GET /api/msp/widget
 */
export const getWidgetData = async (req, res, next) => {
    try {
        // Get the latest year data for each crop-season combination
        const latestData = await MSPPrice.aggregate([
            {
                $sort: { year: -1 }
            },
            {
                $group: {
                    _id: { crop: '$crop', season: '$season' },
                    crop: { $first: '$crop' },
                    displayName: { $first: '$displayName' },
                    season: { $first: '$season' },
                    year: { $first: '$year' },
                    msp: { $first: '$msp' },
                    unit: { $first: '$unit' }
                }
            },
            {
                $sort: { season: 1, displayName: 1 }
            },
            {
                $project: {
                    _id: 0,
                    crop: 1,
                    displayName: 1,
                    season: 1,
                    year: 1,
                    msp: 1,
                    unit: 1
                }
            }
        ]);

        res.json({
            success: true,
            data: latestData
        });
    } catch (error) {
        console.error('MSP widget error:', error);
        next(error);
    }
};

/**
 * Get list of crops for a specific season
 * GET /api/msp/crops/:season
 */
export const getCropsBySeason = async (req, res, next) => {
    try {
        const { season } = req.params;

        if (!['kharif', 'rabi'].includes(season.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid season. Use "kharif" or "rabi"'
            });
        }

        const crops = await MSPPrice.aggregate([
            { $match: { season: season.toLowerCase() } },
            {
                $group: {
                    _id: '$crop',
                    crop: { $first: '$crop' },
                    displayName: { $first: '$displayName' }
                }
            },
            { $sort: { displayName: 1 } },
            {
                $project: {
                    _id: 0,
                    crop: 1,
                    displayName: 1
                }
            }
        ]);

        res.json({
            success: true,
            season: season.toLowerCase(),
            crops
        });
    } catch (error) {
        console.error('MSP crops error:', error);
        next(error);
    }
};

/**
 * Get historical price trend for a specific crop
 * GET /api/msp/:season/:crop
 */
export const getCropHistory = async (req, res, next) => {
    try {
        const { season, crop } = req.params;

        if (!['kharif', 'rabi'].includes(season.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid season. Use "kharif" or "rabi"'
            });
        }

        const history = await MSPPrice.find({
            season: season.toLowerCase(),
            crop: crop.toLowerCase()
        })
            .select('year msp -_id')
            .sort({ year: 1 });

        if (history.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Crop not found for this season'
            });
        }

        // Get display name from first record
        const cropInfo = await MSPPrice.findOne({
            season: season.toLowerCase(),
            crop: crop.toLowerCase()
        }).select('displayName');

        res.json({
            success: true,
            season: season.toLowerCase(),
            crop: crop.toLowerCase(),
            displayName: cropInfo?.displayName || crop,
            data: history.map(h => ({ year: h.year, msp: h.msp }))
        });
    } catch (error) {
        console.error('MSP history error:', error);
        next(error);
    }
};

/**
 * Sync MSP data from data.gov.in API
 * POST /api/msp/sync (admin only)
 */
export const syncMSPData = async (req, res, next) => {
    try {
        console.log('🔄 Starting MSP data sync from data.gov.in...');

        let totalUpserted = 0;

        // Sync Kharif crops
        const kharifCount = await syncSeasonData('kharif', KHARIF_RESOURCE_ID, 'kms');
        totalUpserted += kharifCount;

        // Sync Rabi crops
        const rabiCount = await syncSeasonData('rabi', RABI_RESOURCE_ID, 'rms');
        totalUpserted += rabiCount;

        console.log(`✅ MSP sync complete. Total records upserted: ${totalUpserted}`);

        res.json({
            success: true,
            message: 'MSP data synced successfully',
            kharifRecords: kharifCount,
            rabiRecords: rabiCount,
            totalRecords: totalUpserted
        });
    } catch (error) {
        console.error('❌ MSP sync error:', error);
        next(error);
    }
};

/**
 * Helper function to sync data for a specific season
 */
async function syncSeasonData(season, resourceId, prefix) {
    const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${DATA_GOV_API_KEY}&format=json&limit=100`;

    console.log(`📡 Fetching ${season} data from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
        console.log(`⚠️ No records found for ${season}`);
        return 0;
    }

    console.log(`📊 Found ${data.records.length} ${season} crops`);

    let upsertCount = 0;

    for (const record of data.records) {
        const commodityField = Object.keys(record).find(k =>
            k.toLowerCase().includes('commodit') || k.toLowerCase().includes('crop')
        );

        if (!commodityField || !record[commodityField]) continue;

        const displayName = record[commodityField].trim();
        const cropKey = normalizeCropName(displayName);

        // Find all year columns (kms_2020_21, rms_2021_22, etc.)
        const yearColumns = Object.keys(record).filter(k =>
            k.toLowerCase().startsWith(prefix)
        );

        for (const yearCol of yearColumns) {
            const year = parseYearFromColumn(yearCol);
            const mspValue = parseFloat(record[yearCol]);

            if (!year || isNaN(mspValue) || mspValue <= 0) continue;

            try {
                await MSPPrice.findOneAndUpdate(
                    { crop: cropKey, season, year },
                    {
                        crop: cropKey,
                        displayName,
                        season,
                        year,
                        msp: mspValue,
                        unit: 'Rs/Quintal',
                        source: 'data.gov.in',
                        resourceId,
                        lastUpdated: new Date()
                    },
                    { upsert: true, new: true }
                );
                upsertCount++;
            } catch (err) {
                console.error(`  ❌ Error upserting ${displayName} ${year}:`, err.message);
            }
        }
    }

    console.log(`  ✅ ${season}: ${upsertCount} records upserted`);
    return upsertCount;
}

export default {
    getWidgetData,
    getCropsBySeason,
    getCropHistory,
    syncMSPData
};
