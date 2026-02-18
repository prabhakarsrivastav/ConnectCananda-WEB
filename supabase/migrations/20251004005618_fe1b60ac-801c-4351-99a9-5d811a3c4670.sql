-- Create webinars table
CREATE TABLE public.webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  speaker_name TEXT NOT NULL,
  speaker_title TEXT,
  speaker_image TEXT,
  cover_image TEXT,
  max_attendees INTEGER,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create webinar_registrations table
CREATE TABLE public.webinar_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(webinar_id, email)
);

-- Enable RLS
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for webinars (publicly viewable)
CREATE POLICY "Anyone can view webinars"
  ON public.webinars
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage webinars"
  ON public.webinars
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for registrations
CREATE POLICY "Anyone can register for webinars"
  ON public.webinar_registrations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own registrations"
  ON public.webinar_registrations
  FOR SELECT
  USING (auth.uid() = user_id OR email = auth.email());

CREATE POLICY "Admins can view all registrations"
  ON public.webinar_registrations
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all registrations"
  ON public.webinar_registrations
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to count registrations
CREATE OR REPLACE FUNCTION public.get_webinar_registration_count(webinar_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.webinar_registrations
  WHERE webinar_registrations.webinar_id = get_webinar_registration_count.webinar_id;
$$;

-- Insert sample webinars
INSERT INTO public.webinars (title, description, date, time, duration_minutes, speaker_name, speaker_title, status) VALUES
('Express Entry: Your Path to Canadian PR', 'Learn everything about Express Entry system, CRS score calculation, and how to improve your chances of getting an Invitation to Apply (ITA).', '2025-11-15', '14:00:00', 90, 'Sarah Johnson', 'Senior Immigration Consultant', 'upcoming'),
('Starting Your Business in Canada', 'Comprehensive guide to business registration, incorporation, tax setup, and accessing startup funding programs in Canada.', '2025-11-22', '18:00:00', 60, 'Michael Chen', 'Business Development Advisor', 'upcoming'),
('Canadian Job Market 2025', 'Insights into the Canadian job market, in-demand professions, resume tips, and networking strategies for newcomers.', '2025-11-29', '16:00:00', 75, 'Emily Rodriguez', 'Career Coach & Recruiter', 'upcoming');