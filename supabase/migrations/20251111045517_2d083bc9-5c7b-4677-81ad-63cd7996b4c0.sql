-- Create profiles table for farmer information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  location TEXT NOT NULL,
  pincode TEXT,
  soil_type TEXT NOT NULL CHECK (soil_type IN ('sandy', 'loamy', 'clay', 'silt', 'peat', 'chalk')),
  land_size DECIMAL(10, 2),
  preferred_crops TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create crops reference table
CREATE TABLE IF NOT EXISTS public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  season TEXT NOT NULL CHECK (season IN ('kharif', 'rabi', 'zaid', 'all-season')),
  suitable_soil TEXT[] NOT NULL,
  water_requirement TEXT NOT NULL,
  fertilizer_requirement TEXT,
  expected_yield_range TEXT,
  ideal_temperature_min INTEGER,
  ideal_temperature_max INTEGER,
  rainfall_requirement TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create pest alerts table
CREATE TABLE IF NOT EXISTS public.pest_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('pest', 'disease', 'weather', 'general')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prevention_tips TEXT,
  affected_crops TEXT[],
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create advisories table for daily/weekly tips
CREATE TABLE IF NOT EXISTS public.advisories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  advisory_type TEXT NOT NULL CHECK (advisory_type IN ('fertilizer', 'irrigation', 'pest_prevention', 'government_scheme', 'general')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  crops TEXT[],
  scheduled_for DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pest_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Crops policies (public read)
CREATE POLICY "Anyone can view crops"
  ON public.crops FOR SELECT
  USING (true);

-- Pest alerts policies
CREATE POLICY "Users can view their own alerts"
  ON public.pest_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts"
  ON public.pest_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON public.pest_alerts FOR UPDATE
  USING (auth.uid() = user_id);

-- Advisories policies
CREATE POLICY "Users can view their advisories"
  ON public.advisories FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create advisories"
  ON public.advisories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample crops data
INSERT INTO public.crops (name, season, suitable_soil, water_requirement, fertilizer_requirement, expected_yield_range, ideal_temperature_min, ideal_temperature_max, rainfall_requirement, description) VALUES
('Rice', 'kharif', ARRAY['clay', 'loamy'], 'High (1200-1500mm)', 'Nitrogen-rich, NPK 4:2:1', '2000-2500 kg/acre', 20, 35, 'High (1000-2000mm)', 'Primary food crop, requires flooded fields'),
('Wheat', 'rabi', ARRAY['loamy', 'clay', 'silt'], 'Medium (450-650mm)', 'NPK 4:2:1, Urea', '1500-2000 kg/acre', 10, 25, 'Low-Medium (300-600mm)', 'Winter crop, requires cool weather'),
('Cotton', 'kharif', ARRAY['sandy', 'loamy'], 'Medium (600-1000mm)', 'NPK 2:1:1', '500-700 kg/acre', 21, 35, 'Medium (600-1200mm)', 'Cash crop, requires warm weather'),
('Maize', 'kharif', ARRAY['loamy', 'sandy'], 'Medium (500-800mm)', 'NPK 4:2:1', '2000-2500 kg/acre', 18, 32, 'Medium (600-1000mm)', 'Versatile crop, tolerates various conditions'),
('Sugarcane', 'all-season', ARRAY['loamy', 'clay'], 'High (1500-2500mm)', 'High NPK, Organic manure', '30000-40000 kg/acre', 20, 35, 'High (1500-2500mm)', 'Long-duration cash crop'),
('Pulses', 'rabi', ARRAY['loamy', 'sandy'], 'Low (300-400mm)', 'Low, Phosphorus-rich', '400-600 kg/acre', 15, 30, 'Low-Medium (300-600mm)', 'Nitrogen-fixing legumes'),
('Potato', 'rabi', ARRAY['loamy', 'sandy'], 'Medium (500-700mm)', 'NPK 4:2:3, Potash-rich', '8000-12000 kg/acre', 15, 25, 'Medium (500-800mm)', 'Cool season vegetable crop'),
('Tomato', 'all-season', ARRAY['loamy', 'sandy'], 'Medium (600-800mm)', 'NPK 5:2:3', '15000-20000 kg/acre', 18, 30, 'Medium (600-1000mm)', 'High-value vegetable crop'),
('Onion', 'rabi', ARRAY['loamy', 'silt'], 'Low-Medium (350-550mm)', 'NPK 5:2:4', '10000-15000 kg/acre', 13, 28, 'Low-Medium (400-700mm)', 'Bulb crop requiring well-drained soil'),
('Mustard', 'rabi', ARRAY['loamy', 'clay'], 'Low (250-400mm)', 'NPK 3:2:1', '800-1200 kg/acre', 10, 25, 'Low-Medium (300-500mm)', 'Oilseed crop for cool season')
ON CONFLICT (name) DO NOTHING;