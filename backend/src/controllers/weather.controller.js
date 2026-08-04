import OpenAI from 'openai';
import { config } from '../config/env.js';

// Initialize Groq client for AI advice
let groqClient;
try {
    if (config.groqApiKey) {
        groqClient = new OpenAI({
            apiKey: config.groqApiKey,
            baseURL: 'https://api.groq.com/openai/v1',
        });
    }
} catch (error) {
    console.error('❌ Error initializing Groq AI for weather:', error);
}

// Map weather conditions to icons
const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || '';
    if (desc.includes('clear') || desc.includes('sunny')) return 'sun';
    if (desc.includes('rain') || desc.includes('drizzle')) return 'rain';
    if (desc.includes('cloud')) return 'cloud';
    if (desc.includes('thunder') || desc.includes('storm')) return 'storm';
    if (desc.includes('snow')) return 'snow';
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return 'fog';
    return 'cloud';
};

/**
 * Get weather forecast with real API or fallback
 * POST /api/weather
 */
export const getWeather = async (req, res, next) => {
    try {
        const { location, pincode } = req.body;
        const searchLocation = location || 'Delhi';

        let weatherData;

        // Try OpenWeatherMap API if configured
        if (config.openWeatherApiKey) {
            try {
                weatherData = await fetchOpenWeatherData(searchLocation, config.openWeatherApiKey);
            } catch (apiError) {
                console.error('OpenWeatherMap API error:', apiError.message);
                weatherData = generateMockWeather(searchLocation);
            }
        } else {
            // Use mock data if no API key
            console.log('⚠️ No OpenWeatherMap API key, using mock data');
            weatherData = generateMockWeather(searchLocation);
        }

        // Generate AI farming advice
        if (groqClient) {
            try {
                weatherData.advice = await generateFarmingAdvice(weatherData);
            } catch (aiError) {
                console.error('AI advice error:', aiError.message);
                weatherData.advice = getDefaultAdvice(weatherData.current);
            }
        } else {
            weatherData.advice = getDefaultAdvice(weatherData.current);
        }

        res.json(weatherData);
    } catch (error) {
        console.error('Weather error:', error);
        next(error);
    }
};

/**
 * Fetch real weather data from OpenWeatherMap
 */
async function fetchOpenWeatherData(location, apiKey) {
    // Current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)},IN&units=metric&appid=${apiKey}`;
    const currentResponse = await fetch(currentUrl);

    if (!currentResponse.ok) {
        throw new Error(`OpenWeatherMap error: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();

    // 5-day forecast (free tier)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)},IN&units=metric&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    // Process forecast data - get one entry per day
    const dailyForecasts = [];
    const seenDates = new Set();

    for (const item of forecastData.list || []) {
        const date = new Date(item.dt * 1000).toDateString();
        if (!seenDates.has(date) && dailyForecasts.length < 7) {
            seenDates.add(date);
            dailyForecasts.push({
                date: new Date(item.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                }),
                tempMax: Math.round(item.main.temp_max),
                tempMin: Math.round(item.main.temp_min),
                humidity: item.main.humidity,
                description: item.weather[0]?.description || 'Unknown',
                icon: getWeatherIcon(item.weather[0]?.description),
                windSpeed: Math.round(item.wind?.speed * 3.6), // m/s to km/h
                rainChance: item.pop ? Math.round(item.pop * 100) : 0,
            });
        }
    }

    return {
        location: currentData.name || location,
        current: {
            temp: Math.round(currentData.main.temp),
            feelsLike: Math.round(currentData.main.feels_like),
            humidity: currentData.main.humidity,
            windSpeed: Math.round(currentData.wind.speed * 3.6), // m/s to km/h
            description: currentData.weather[0]?.description || 'Unknown',
            icon: getWeatherIcon(currentData.weather[0]?.description),
            pressure: currentData.main.pressure,
            visibility: currentData.visibility ? Math.round(currentData.visibility / 1000) : null,
            sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
        forecast: dailyForecasts,
        isRealData: true,
    };
}

/**
 * Generate mock weather data for development
 */
function generateMockWeather(location) {
    const conditions = [
        { desc: 'Clear Sky', icon: 'sun' },
        { desc: 'Partly Cloudy', icon: 'cloud' },
        { desc: 'Light Rain', icon: 'rain' },
        { desc: 'Scattered Clouds', icon: 'cloud' },
        { desc: 'Sunny', icon: 'sun' },
    ];

    const current = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 10) + 25;

    return {
        location: location || 'Your Location',
        current: {
            temp,
            feelsLike: temp + Math.floor(Math.random() * 3),
            humidity: Math.floor(Math.random() * 20) + 60,
            windSpeed: Math.floor(Math.random() * 15) + 5,
            description: current.desc,
            icon: current.icon,
            pressure: 1013,
            visibility: 10,
            sunrise: '06:30 AM',
            sunset: '05:45 PM',
        },
        forecast: Array.from({ length: 7 }, (_, i) => {
            const forecastDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
            const cond = conditions[Math.floor(Math.random() * conditions.length)];
            return {
                date: forecastDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                }),
                tempMax: Math.floor(Math.random() * 8) + 28,
                tempMin: Math.floor(Math.random() * 8) + 18,
                humidity: Math.floor(Math.random() * 20) + 60,
                description: cond.desc,
                icon: cond.icon,
                windSpeed: Math.floor(Math.random() * 15) + 5,
                rainChance: Math.floor(Math.random() * 40),
            };
        }),
        isRealData: false,
    };
}

/**
 * Generate AI-powered farming advice based on weather
 */
async function generateFarmingAdvice(weatherData) {
    const prompt = `You are an expert Indian agricultural advisor. Based on the following weather data, provide 3-4 concise farming tips.

Current Weather:
- Temperature: ${weatherData.current.temp}°C (Feels like: ${weatherData.current.feelsLike}°C)
- Humidity: ${weatherData.current.humidity}%
- Condition: ${weatherData.current.description}
- Wind Speed: ${weatherData.current.windSpeed} km/h
- Location: ${weatherData.location}

7-Day Forecast Summary:
${weatherData.forecast.slice(0, 3).map(d => `- ${d.date}: ${d.description}, ${d.tempMax}°/${d.tempMin}°, Rain: ${d.rainChance || 0}%`).join('\n')}

Provide exactly 4 practical farming tips as a JSON array of strings. Focus on:
1. Irrigation advice
2. Pest/disease warnings
3. Crop protection
4. Best farming activities for this weather

Return ONLY the JSON array, no other text:
["tip1", "tip2", "tip3", "tip4"]`;

    const completion = await groqClient.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content || '';

    try {
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error('Failed to parse AI advice:', e);
    }

    return getDefaultAdvice(weatherData.current);
}

/**
 * Default farming advice based on conditions
 */
function getDefaultAdvice(current) {
    const tips = [];

    // Temperature-based
    if (current.temp > 35) {
        tips.push('🌡️ High temperature: Water crops early morning or late evening to reduce evaporation');
    } else if (current.temp < 15) {
        tips.push('❄️ Cold weather: Protect sensitive crops with mulching or plastic covers');
    } else {
        tips.push('✅ Moderate temperature: Ideal conditions for most farming activities');
    }

    // Humidity-based
    if (current.humidity > 80) {
        tips.push('⚠️ High humidity: Monitor for fungal diseases. Avoid overhead irrigation');
    } else if (current.humidity < 40) {
        tips.push('💧 Low humidity: Increase irrigation frequency to prevent water stress');
    }

    // Condition-based
    const desc = current.description?.toLowerCase() || '';
    if (desc.includes('rain')) {
        tips.push('🌧️ Rain expected: Postpone fertilizer application. Ensure proper drainage');
    } else if (desc.includes('clear') || desc.includes('sunny')) {
        tips.push('☀️ Clear weather: Good day for spraying pesticides. Apply during calm winds');
    }

    // General tip
    tips.push('📋 Check your crops regularly for any signs of pest damage or nutrient deficiency');

    return tips;
}

export default { getWeather };
