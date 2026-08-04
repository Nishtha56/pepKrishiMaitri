import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, pincode } = await req.json();

    // Mock weather data for demonstration
    // In production, integrate with OpenWeatherMap or IMD API
    const mockWeatherData = {
      location: location || "Your Location",
      current: {
        temp: Math.floor(Math.random() * 10) + 25,
        feelsLike: Math.floor(Math.random() * 10) + 26,
        humidity: Math.floor(Math.random() * 20) + 60,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        description: ["partly cloudy", "clear sky", "light rain", "sunny"][Math.floor(Math.random() * 4)],
      },
      forecast: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        tempMax: Math.floor(Math.random() * 8) + 28,
        tempMin: Math.floor(Math.random() * 8) + 18,
        humidity: Math.floor(Math.random() * 20) + 60,
        description: ["partly cloudy", "clear sky", "light rain", "sunny", "scattered clouds"][Math.floor(Math.random() * 5)],
      })),
      advice: "Based on the forecast, moderate irrigation is recommended. Monitor for pest activity due to humidity levels.",
    };

    // TODO: Replace with actual weather API integration
    // Example with OpenWeatherMap:
    // const WEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
    // const response = await fetch(
    //   `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${WEATHER_API_KEY}&units=metric`
    // );

    return new Response(
      JSON.stringify(mockWeatherData),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Weather error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});