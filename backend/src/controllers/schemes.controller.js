import OpenAI from 'openai';
import { config } from '../config/env.js';
import { schemesData, schemeCategories } from '../data/schemes.js';

// Initialize Groq client
let groqClient;
try {
    if (config.groqApiKey) {
        groqClient = new OpenAI({
            apiKey: config.groqApiKey,
            baseURL: 'https://api.groq.com/openai/v1',
        });
    }
} catch (error) {
    console.error('❌ Error initializing Groq AI for schemes:', error);
}

// Cache for AI summaries (in-memory, resets on restart)
const summaryCache = new Map();

/**
 * List schemes with optional filters
 * GET /api/discover/schemes
 */
export const listSchemes = async (req, res, next) => {
    try {
        const { state, category } = req.query;

        let filteredSchemes = [...schemesData];

        // Filter by state
        if (state && state !== 'ALL') {
            filteredSchemes = filteredSchemes.filter(scheme =>
                scheme.states.includes('ALL') || scheme.states.includes(state)
            );
        }

        // Filter by category
        if (category && category !== 'ALL') {
            filteredSchemes = filteredSchemes.filter(scheme =>
                scheme.category === category
            );
        }

        // Add category info to each scheme
        const schemesWithInfo = filteredSchemes.map(scheme => ({
            ...scheme,
            categoryInfo: schemeCategories[scheme.category] || { name: scheme.category, emoji: '📋' }
        }));

        res.json({
            success: true,
            state: state || 'ALL',
            category: category || 'ALL',
            count: schemesWithInfo.length,
            schemes: schemesWithInfo
        });
    } catch (error) {
        console.error('List schemes error:', error);
        next(error);
    }
};

/**
 * Get scheme categories
 * GET /api/discover/categories
 */
export const getCategories = async (req, res, next) => {
    try {
        const categories = Object.entries(schemeCategories).map(([key, value]) => ({
            id: key,
            ...value
        }));

        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        next(error);
    }
};

/**
 * Get AI-generated summary for a scheme
 * GET /api/schemes/:schemeId/summary
 */
export const getSchemeSummary = async (req, res, next) => {
    try {
        const { schemeId } = req.params;

        // Find the scheme
        const scheme = schemesData.find(s => s.schemeId === schemeId);

        if (!scheme) {
            return res.status(404).json({
                success: false,
                error: 'Scheme not found'
            });
        }

        // Check cache first
        if (summaryCache.has(schemeId)) {
            console.log(`📦 Returning cached summary for: ${scheme.name}`);
            return res.json({
                success: true,
                schemeId,
                name: scheme.name,
                cached: true,
                summary: summaryCache.get(schemeId)
            });
        }

        // Check if Groq is available
        if (!groqClient) {
            return res.status(500).json({
                success: false,
                error: 'AI service not configured',
                message: 'Please add GROQ_API_KEY to your .env file'
            });
        }

        console.log(`🤖 Generating AI summary for: ${scheme.name}`);

        // Generate AI summary
        const prompt = `You are an expert on Indian government schemes for farmers.

Explain the scheme in a clear, detailed, and farmer-friendly way.
Do NOT be overly legal or strict.
Use general understanding, not verification rules.
Focus on practical benefits and how farmers can use this scheme.

Scheme details:
Name: ${scheme.name}
Category: ${schemeCategories[scheme.category]?.name || scheme.category}
Level: ${scheme.level === 'central' ? 'Central Government' : 'State Government'}
Applicable States: ${scheme.states.join(", ")}
Description: ${scheme.description}

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "overview": "2-3 clear sentences explaining what this scheme does for farmers",
  "keyBenefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "whoCanBenefit": ["Small farmers", "Marginal farmers with less than 2 hectares", etc.],
  "generalEligibility": ["Must have agricultural land", "Active farming", etc.],
  "opportunities": ["Income stability", "Risk reduction", "Access to resources"],
  "limitations": ["Documentation may be required", "Processing time varies"],
  "whyThisSchemeMatters": ["Government commitment to farmers", "Rural economy support"]
}`;

        const completion = await groqClient.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1500,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        console.log(`📝 Raw AI response length: ${responseText.length} chars`);

        // Parse JSON from response
        let summary;
        try {
            // Strip markdown code blocks if present
            let cleanedResponse = responseText
                .replace(/```json\s*/gi, '')
                .replace(/```\s*/g, '')
                .trim();

            // Find JSON object
            const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                summary = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON object found in response');
            }
        } catch (parseError) {
            console.error('❌ Failed to parse AI response:', parseError.message);
            console.log('Raw response:', responseText.substring(0, 500));

            // Return fallback summary
            summary = generateFallbackSummary(scheme);
        }

        // Cache the summary
        summaryCache.set(schemeId, summary);

        res.json({
            success: true,
            schemeId,
            name: scheme.name,
            level: scheme.level,
            category: scheme.category,
            categoryInfo: schemeCategories[scheme.category],
            officialUrl: scheme.officialUrl,
            documentUrl: scheme.documentUrl,
            cached: false,
            summary,
            disclaimer: "This summary is AI-generated for informational purposes. Please verify details from official sources before applying."
        });

    } catch (error) {
        console.error('❌ Scheme summary error:', error.message);

        // Try to return fallback
        const scheme = schemesData.find(s => s.schemeId === req.params.schemeId);
        if (scheme) {
            return res.json({
                success: true,
                schemeId: req.params.schemeId,
                name: scheme.name,
                fallback: true,
                summary: generateFallbackSummary(scheme),
                disclaimer: "This is a basic summary. AI service temporarily unavailable."
            });
        }

        next(error);
    }
};

/**
 * Generate fallback summary when AI is unavailable
 */
function generateFallbackSummary(scheme) {
    return {
        overview: scheme.description || `${scheme.name} is a ${scheme.level} government scheme designed to support Indian farmers.`,
        keyBenefits: [
            "Government financial or technical support",
            "Reduced burden on farmers",
            "Improved farming outcomes"
        ],
        whoCanBenefit: [
            "Small and marginal farmers",
            "Farmers with valid land records",
            "Active agricultural practitioners"
        ],
        generalEligibility: [
            "Must be an Indian citizen",
            "Must have agricultural land (for most schemes)",
            "May require registration with local agriculture office"
        ],
        opportunities: [
            "Access to government support",
            "Financial assistance for farming",
            "Better market access and prices"
        ],
        limitations: [
            "Documentation and verification required",
            "Processing times may vary",
            "Benefits subject to scheme guidelines"
        ],
        whyThisSchemeMatters: [
            "Part of government's farmer welfare initiatives",
            "Helps strengthen rural economy",
            "Provides safety net for farming community"
        ]
    };
}

/**
 * Clear summary cache (admin utility)
 * POST /api/discover/clear-cache
 */
export const clearCache = async (req, res, next) => {
    try {
        const cacheSize = summaryCache.size;
        summaryCache.clear();

        res.json({
            success: true,
            message: `Cleared ${cacheSize} cached summaries`
        });
    } catch (error) {
        next(error);
    }
};

export default {
    listSchemes,
    getCategories,
    getSchemeSummary,
    clearCache
};
