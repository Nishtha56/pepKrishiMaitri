import { connectDB, disconnectDB } from '../config/db.js';
import Crop from '../models/Crop.js';

// Seed data from Supabase migration
const crops = [
    {
        name: 'Rice',
        season: 'kharif',
        suitableSoil: ['clay', 'loamy'],
        waterRequirement: 'High (1200-1500mm)',
        fertilizerRequirement: 'Nitrogen-rich, NPK 4:2:1',
        expectedYieldRange: '2000-2500 kg/acre',
        idealTemperatureMin: 20,
        idealTemperatureMax: 35,
        rainfallRequirement: 'High (1000-2000mm)',
        description: 'Primary food crop, requires flooded fields',
    },
    {
        name: 'Wheat',
        season: 'rabi',
        suitableSoil: ['loamy', 'clay', 'silt'],
        waterRequirement: 'Medium (450-650mm)',
        fertilizerRequirement: 'NPK 4:2:1, Urea',
        expectedYieldRange: '1500-2000 kg/acre',
        idealTemperatureMin: 10,
        idealTemperatureMax: 25,
        rainfallRequirement: 'Low-Medium (300-600mm)',
        description: 'Winter crop, requires cool weather',
    },
    {
        name: 'Cotton',
        season: 'kharif',
        suitableSoil: ['sandy', 'loamy'],
        waterRequirement: 'Medium (600-1000mm)',
        fertilizerRequirement: 'NPK 2:1:1',
        expectedYieldRange: '500-700 kg/acre',
        idealTemperatureMin: 21,
        idealTemperatureMax: 35,
        rainfallRequirement: 'Medium (600-1200mm)',
        description: 'Cash crop, requires warm weather',
    },
    {
        name: 'Maize',
        season: 'kharif',
        suitableSoil: ['loamy', 'sandy'],
        waterRequirement: 'Medium (500-800mm)',
        fertilizerRequirement: 'NPK 4:2:1',
        expectedYieldRange: '2000-2500 kg/acre',
        idealTemperatureMin: 18,
        idealTemperatureMax: 32,
        rainfallRequirement: 'Medium (600-1000mm)',
        description: 'Versatile crop, tolerates various conditions',
    },
    {
        name: 'Sugarcane',
        season: 'all-season',
        suitableSoil: ['loamy', 'clay'],
        waterRequirement: 'High (1500-2500mm)',
        fertilizerRequirement: 'High NPK, Organic manure',
        expectedYieldRange: '30000-40000 kg/acre',
        idealTemperatureMin: 20,
        idealTemperatureMax: 35,
        rainfallRequirement: 'High (1500-2500mm)',
        description: 'Long-duration cash crop',
    },
    {
        name: 'Pulses',
        season: 'rabi',
        suitableSoil: ['loamy', 'sandy'],
        waterRequirement: 'Low (300-400mm)',
        fertilizerRequirement: 'Low, Phosphorus-rich',
        expectedYieldRange: '400-600 kg/acre',
        idealTemperatureMin: 15,
        idealTemperatureMax: 30,
        rainfallRequirement: 'Low-Medium (300-600mm)',
        description: 'Nitrogen-fixing legumes',
    },
    {
        name: 'Potato',
        season: 'rabi',
        suitableSoil: ['loamy', 'sandy'],
        waterRequirement: 'Medium (500-700mm)',
        fertilizerRequirement: 'NPK 4:2:3, Potash-rich',
        expectedYieldRange: '8000-12000 kg/acre',
        idealTemperatureMin: 15,
        idealTemperatureMax: 25,
        rainfallRequirement: 'Medium (500-800mm)',
        description: 'Cool season vegetable crop',
    },
    {
        name: 'Tomato',
        season: 'all-season',
        suitableSoil: ['loamy', 'sandy'],
        waterRequirement: 'Medium (600-800mm)',
        fertilizerRequirement: 'NPK 5:2:3',
        expectedYieldRange: '15000-20000 kg/acre',
        idealTemperatureMin: 18,
        idealTemperatureMax: 30,
        rainfallRequirement: 'Medium (600-1000mm)',
        description: 'High-value vegetable crop',
    },
    {
        name: 'Onion',
        season: 'rabi',
        suitableSoil: ['loamy', 'silt'],
        waterRequirement: 'Low-Medium (350-550mm)',
        fertilizerRequirement: 'NPK 5:2:4',
        expectedYieldRange: '10000-15000 kg/acre',
        idealTemperatureMin: 13,
        idealTemperatureMax: 28,
        rainfallRequirement: 'Low-Medium (400-700mm)',
        description: 'Bulb crop requiring well-drained soil',
    },
    {
        name: 'Mustard',
        season: 'rabi',
        suitableSoil: ['loamy', 'clay'],
        waterRequirement: 'Low (250-400mm)',
        fertilizerRequirement: 'NPK 3:2:1',
        expectedYieldRange: '800-1200 kg/acre',
        idealTemperatureMin: 10,
        idealTemperatureMax: 25,
        rainfallRequirement: 'Low-Medium (300-500mm)',
        description: 'Oilseed crop for cool season',
    },
];

const seedCrops = async () => {
    try {
        console.log('🌱 Starting crop seeding...');

        // Connect to database
        await connectDB();

        // Clear existing crops (optional - comment out if you want to preserve existing data)
        await Crop.deleteMany({});
        console.log('🗑️  Cleared existing crops');

        // Insert seed data
        const result = await Crop.insertMany(crops);
        console.log(`✅ Successfully seeded ${result.length} crops`);

        // Display seeded crops
        console.log('\n📊 Seeded crops:');
        result.forEach((crop, index) => {
            console.log(`   ${index + 1}. ${crop.name} (${crop.season})`);
        });

        await disconnectDB();
        console.log('\n🎉 Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding crops:', error);
        process.exit(1);
    }
};

// Run seeding
seedCrops();
