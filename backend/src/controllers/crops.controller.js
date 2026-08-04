import OpenAI from 'openai';
import { config } from '../config/env.js';

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
    console.error('❌ Error initializing Groq AI for crops:', error);
}

/**
 * Get AI-powered crop suggestions based on soil type and location
 * POST /api/crops/suggestions
 */
export const getCropSuggestions = async (req, res, next) => {
    try {
        const { soilType, location, state, district } = req.body;

        console.log('🌾 Crop suggestions requested for:', { soilType, location, state });

        if (!soilType) {
            return res.status(400).json({ error: 'Soil type is required' });
        }

        if (!config.groqApiKey || !groqClient) {
            return res.status(500).json({
                error: 'AI service not configured',
                message: 'Please add GROQ_API_KEY to your .env file'
            });
        }

        const prompt = `You are an expert Indian agricultural advisor. Based on the following farm details, suggest the best crops to grow.

Farm Details:
- Soil Type: ${soilType}
- Location: ${location || 'India'}
- State: ${state || 'Not specified'}
- District: ${district || 'Not specified'}

Provide exactly 6 crop suggestions in the following JSON format. Return ONLY the JSON array, no other text:

[
  {
    "name": "Crop Name",
    "description": "Brief 5-7 word description",
    "season": "kharif" or "rabi" or "zaid" or "all-season",
    "waterRequirement": "Low/Medium/High (amount in mm)",
    "fertilizer": "NPK ratio and type",
    "expectedYield": "yield range in kg/acre",
    "idealTemperature": "min°C - max°C"
  }
]

Consider the soil type and regional climate. Include a mix of:
- Food grains (wheat, rice, maize, etc.)
- Cash crops (cotton, sugarcane, etc.)
- Vegetables (potato, tomato, etc.)
- Pulses (dal varieties)

Ensure the crops are actually suitable for the given soil type and region of India.`;

        const completion = await groqClient.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        console.log('🤖 AI Response:', responseText.substring(0, 200));

        // Parse JSON from response
        let crops = [];
        try {
            // Extract JSON array from response
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                crops = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON array found in response');
            }
        } catch (parseError) {
            console.error('❌ Failed to parse AI response:', parseError);
            // Return fallback crops
            crops = getFallbackCrops(soilType);
        }

        res.json({
            crops,
            soilType,
            location: location || state || 'India'
        });

    } catch (error) {
        console.error('❌ Crop suggestions error:', error.message);

        // Return fallback on error
        const fallbackCrops = getFallbackCrops(req.body.soilType || 'loamy');
        res.json({
            crops: fallbackCrops,
            soilType: req.body.soilType,
            location: req.body.location || 'India',
            fallback: true
        });
    }
};

// Fallback crops based on soil type
function getFallbackCrops(soilType) {
    const cropsByType = {
        sandy: [
            { name: "Groundnut", description: "Drought-resistant oilseed crop", season: "kharif", waterRequirement: "Low (400-500mm)", fertilizer: "NPK 10:20:20", expectedYield: "1500-2000 kg/acre", idealTemperature: "20°C - 30°C" },
            { name: "Millet", description: "Hardy grain for dry conditions", season: "kharif", waterRequirement: "Low (350-500mm)", fertilizer: "NPK 8:16:8", expectedYield: "800-1200 kg/acre", idealTemperature: "25°C - 35°C" },
            { name: "Watermelon", description: "High-value summer fruit", season: "zaid", waterRequirement: "Medium (500-600mm)", fertilizer: "NPK 15:15:15", expectedYield: "15000-25000 kg/acre", idealTemperature: "24°C - 30°C" },
            { name: "Carrot", description: "Root vegetable, good drainage", season: "rabi", waterRequirement: "Medium (400-600mm)", fertilizer: "NPK 5:10:10", expectedYield: "8000-12000 kg/acre", idealTemperature: "15°C - 25°C" },
            { name: "Barley", description: "Winter grain, salt tolerant", season: "rabi", waterRequirement: "Low (300-400mm)", fertilizer: "NPK 12:6:6", expectedYield: "1200-1600 kg/acre", idealTemperature: "12°C - 25°C" },
            { name: "Sesame", description: "Oilseed for sandy soils", season: "kharif", waterRequirement: "Low (300-400mm)", fertilizer: "NPK 8:16:8", expectedYield: "300-500 kg/acre", idealTemperature: "25°C - 35°C" }
        ],
        loamy: [
            { name: "Wheat", description: "Staple food grain crop", season: "rabi", waterRequirement: "Medium (450-650mm)", fertilizer: "NPK 20:20:0", expectedYield: "2000-2500 kg/acre", idealTemperature: "15°C - 25°C" },
            { name: "Cotton", description: "Cash crop, warm weather", season: "kharif", waterRequirement: "Medium (600-1000mm)", fertilizer: "NPK 12:6:6", expectedYield: "500-700 kg/acre", idealTemperature: "21°C - 35°C" },
            { name: "Maize", description: "Versatile, various conditions", season: "kharif", waterRequirement: "Medium (500-800mm)", fertilizer: "NPK 18:18:0", expectedYield: "2000-2500 kg/acre", idealTemperature: "18°C - 32°C" },
            { name: "Potato", description: "Cool season vegetable", season: "rabi", waterRequirement: "Medium (500-700mm)", fertilizer: "NPK 8:16:24", expectedYield: "8000-12000 kg/acre", idealTemperature: "15°C - 25°C" },
            { name: "Tomato", description: "High-value vegetable crop", season: "all-season", waterRequirement: "Medium (600-800mm)", fertilizer: "NPK 10:10:10", expectedYield: "15000-20000 kg/acre", idealTemperature: "18°C - 30°C" },
            { name: "Pulses", description: "Nitrogen-fixing legumes", season: "rabi", waterRequirement: "Low (300-400mm)", fertilizer: "Low, Phosphorus-rich", expectedYield: "400-600 kg/acre", idealTemperature: "15°C - 30°C" }
        ],
        clay: [
            { name: "Rice", description: "Water-loving staple grain", season: "kharif", waterRequirement: "High (1200-1500mm)", fertilizer: "NPK 20:10:10", expectedYield: "2500-3500 kg/acre", idealTemperature: "22°C - 32°C" },
            { name: "Sugarcane", description: "Long-duration cash crop", season: "all-season", waterRequirement: "High (1500-2000mm)", fertilizer: "NPK 15:15:15", expectedYield: "30000-40000 kg/acre", idealTemperature: "20°C - 35°C" },
            { name: "Wheat", description: "Winter staple grain", season: "rabi", waterRequirement: "Medium (450-650mm)", fertilizer: "NPK 20:20:0", expectedYield: "1800-2200 kg/acre", idealTemperature: "15°C - 25°C" },
            { name: "Cabbage", description: "Cool season leafy vegetable", season: "rabi", waterRequirement: "Medium (400-500mm)", fertilizer: "NPK 10:10:10", expectedYield: "10000-15000 kg/acre", idealTemperature: "15°C - 20°C" },
            { name: "Lentils", description: "High-protein pulse crop", season: "rabi", waterRequirement: "Low (250-350mm)", fertilizer: "NPK 5:10:5", expectedYield: "600-800 kg/acre", idealTemperature: "15°C - 25°C" },
            { name: "Jute", description: "Fiber crop for wet areas", season: "kharif", waterRequirement: "High (1000-1200mm)", fertilizer: "NPK 10:5:5", expectedYield: "2000-2500 kg/acre", idealTemperature: "24°C - 35°C" }
        ],
        black: [
            { name: "Cotton", description: "Prime cash crop, black soil", season: "kharif", waterRequirement: "Medium (600-1000mm)", fertilizer: "NPK 12:6:6", expectedYield: "600-800 kg/acre", idealTemperature: "21°C - 35°C" },
            { name: "Soybean", description: "Protein-rich oilseed", season: "kharif", waterRequirement: "Medium (500-700mm)", fertilizer: "NPK 8:16:8", expectedYield: "1000-1500 kg/acre", idealTemperature: "20°C - 30°C" },
            { name: "Sorghum", description: "Drought-resistant grain", season: "kharif", waterRequirement: "Low (400-600mm)", fertilizer: "NPK 10:10:10", expectedYield: "1000-1500 kg/acre", idealTemperature: "25°C - 35°C" },
            { name: "Chickpea", description: "Major rabi pulse crop", season: "rabi", waterRequirement: "Low (300-400mm)", fertilizer: "Phosphorus-rich", expectedYield: "800-1200 kg/acre", idealTemperature: "15°C - 30°C" },
            { name: "Sunflower", description: "Oilseed, drought tolerant", season: "rabi", waterRequirement: "Low (400-500mm)", fertilizer: "NPK 8:16:8", expectedYield: "600-900 kg/acre", idealTemperature: "20°C - 30°C" },
            { name: "Pigeon Pea", description: "Hardy pulse crop (Tur dal)", season: "kharif", waterRequirement: "Low (600-700mm)", fertilizer: "Low NPK", expectedYield: "600-800 kg/acre", idealTemperature: "18°C - 30°C" }
        ]
    };

    return cropsByType[soilType] || cropsByType.loamy;
}

export default { getCropSuggestions };
