-- Create free external courses table
CREATE TABLE public.free_external_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT,
  external_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.free_external_courses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active courses
CREATE POLICY "Anyone can view active free courses"
ON public.free_external_courses
FOR SELECT
USING (is_active = true);

-- Admins can manage courses
CREATE POLICY "Admins can manage free courses"
ON public.free_external_courses
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_free_external_courses_updated_at
BEFORE UPDATE ON public.free_external_courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial courses
INSERT INTO public.free_external_courses (title, description, thumbnail, external_url, display_order) VALUES
('Introduction to Immigration & Refugee Law', 'Basics of immigration categories and Canadian laws.', '📚', 'https://www.canada.ca/en/immigration-refugees-citizenship.html', 1),
('Settlement Online Pre-Arrival (SOPA)', 'Pre-arrival support: credential recognition, job prep, planning.', '🧳', 'https://www.cic.gc.ca/english/newcomers/before-services.asp', 2),
('Orientation for Newcomers', 'Housing, healthcare, banking, community basics for new immigrants.', '🏡', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants.html', 3),
('Employment Readiness for Newcomers', 'Resume & interview prep tailored for Canadian employers.', '💼', 'https://www.jobbank.gc.ca/newcomers', 4),
('Canada''s Settlement Services Overview', 'How to access government-funded services for newcomers.', '🗺️', 'https://www.cic.gc.ca/english/newcomers/services/', 5),
('Workplace Essentials for Professionals', 'Learn Canadian work culture and rights in the workplace.', '👔', 'https://www.canada.ca/en/employment-social-development/programs/workplace-rights.html', 6),
('Health & Well-Being for Newcomers', 'Healthcare navigation, coverage, and mental health support.', '❤️', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/new-life-canada/health-care.html', 7),
('Immigrant Women''s Integration & Empowerment', 'Settlement & career support tailored for women.', '👩‍🦱', 'https://www.canada.ca/en/status-women.html', 8),
('Financial Literacy for Newcomers', 'Build credit, manage taxes, and avoid common financial mistakes.', '💳', 'https://www.canada.ca/en/financial-consumer-agency/services/financial-literacy-newcomers.html', 9),
('Pathways to PR & Citizenship', 'Steps for PR streams, applications, and citizenship test prep.', '🇨🇦', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship.html', 10);
