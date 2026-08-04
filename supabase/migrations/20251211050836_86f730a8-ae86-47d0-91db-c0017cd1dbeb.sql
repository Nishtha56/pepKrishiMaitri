-- Create journal entries table
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('sowing', 'irrigation', 'fertilizer', 'pest', 'harvest')),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  crop_name TEXT,
  notes TEXT,
  quantity TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own journal entries"
ON public.journal_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
ON public.journal_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
ON public.journal_entries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
ON public.journal_entries FOR DELETE
USING (auth.uid() = user_id);