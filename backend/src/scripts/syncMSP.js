/**
 * MSP Data Sync Script
 * 
 * Standalone script to fetch MSP data from data.gov.in and save to MongoDB.
 * Run with: node src/scripts/syncMSP.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001dfcc5ff6e4954358542ceb05e890bfe6';

const KHARIF_RESOURCE_ID = '37a192d8-355d-409a-845a-00d0f6cfac55';
const RABI_RESOURCE_ID = 'b45f166a-9a89-492f-a8ed-3cb245850408';

// Define schema inline for standalone script
const mspPriceSchema = new mongoose.Schema({
    crop: { type: String, required: true, lowercase: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    season: { type: String, required: true, enum: ['kharif', 'rabi'], lowercase: true },
    year: { type: String, required: true, trim: true },
    msp: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'Rs/Quintal' },
    source: { type: String, default: 'data.gov.in' },
    resourceId: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

mspPriceSchema.index({ crop: 1, season: 1, year: 1 }, { unique: true });

const MSPPrice = mongoose.model('MSPPrice', mspPriceSchema);

/**
 * Normalize crop name to create a consistent key
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
 */
function parseYearFromColumn(columnName) {
    const match = columnName.match(/(?:kms|rms)_(\d{4})_(\d{2})/i);
    if (match) {
        return `${match[1]}-${match[2]}`;
    }
    return null;
}

/**
 * Sync data for a specific season
 */
async function syncSeasonData(season, resourceId, prefix) {
    const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${DATA_GOV_API_KEY}&format=json&limit=100`;

    console.log(`📡 Fetching ${season.toUpperCase()} data...`);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
        console.log(`  ⚠️ No records found for ${season}`);
        return 0;
    }

    console.log(`  📊 Found ${data.records.length} crops`);

    let upsertCount = 0;

    for (const record of data.records) {
        // Find the commodity/crop name field
        const commodityField = Object.keys(record).find(k =>
            k.toLowerCase().includes('commodit') || k.toLowerCase().includes('crop')
        );

        if (!commodityField || !record[commodityField]) continue;

        const displayName = record[commodityField].trim();
        const cropKey = normalizeCropName(displayName);

        // Find all year columns
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
                if (err.code !== 11000) { // Ignore duplicate key errors
                    console.error(`  ❌ Error: ${displayName} ${year}:`, err.message);
                }
            }
        }

        console.log(`    ✓ ${displayName}: ${yearColumns.length} years`);
    }

    return upsertCount;
}

/**
 * Main sync function
 */
async function main() {
    console.log('╔═══════════════════════════════════════════════════╗');
    console.log('║           MSP Data Sync Script                    ║');
    console.log('║           Source: data.gov.in                     ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');

    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI not set in environment');
        process.exit(1);
    }

    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        let totalRecords = 0;

        // Sync Kharif crops
        console.log('────────────────────────────────────────');
        const kharifCount = await syncSeasonData('kharif', KHARIF_RESOURCE_ID, 'kms');
        console.log(`  ✅ Kharif: ${kharifCount} records upserted\n`);
        totalRecords += kharifCount;

        // Sync Rabi crops
        console.log('────────────────────────────────────────');
        const rabiCount = await syncSeasonData('rabi', RABI_RESOURCE_ID, 'rms');
        console.log(`  ✅ Rabi: ${rabiCount} records upserted\n`);
        totalRecords += rabiCount;

        console.log('════════════════════════════════════════');
        console.log(`🎉 SYNC COMPLETE: ${totalRecords} total records`);
        console.log('════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Sync failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

main();
