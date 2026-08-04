import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGODB_URI,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    lovableApiKey: process.env.LOVABLE_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    groqApiKey: process.env.GROQ_API_KEY,
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
    dataGovApiKey: process.env.DATA_GOV_API_KEY,
    frontendUrl: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',')
        : ['http://localhost:8081', 'http://localhost:5173'],
    logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`❌ Error: ${envVar} is not defined in environment variables`);
        process.exit(1);
    }
});
