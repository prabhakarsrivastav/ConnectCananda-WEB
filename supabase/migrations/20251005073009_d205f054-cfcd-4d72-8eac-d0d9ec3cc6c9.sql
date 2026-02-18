-- Create storage buckets for ebooks and courses
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('ebook-covers', 'ebook-covers', true),
  ('ebook-files', 'ebook-files', false),
  ('course-thumbnails', 'course-thumbnails', true),
  ('course-resources', 'course-resources', false);

-- Create ebooks table
CREATE TABLE public.ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT,
  pdf_url TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT false,
  sales_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ebooks"
ON public.ebooks FOR SELECT
USING (true);

CREATE POLICY "Admins can manage ebooks"
ON public.ebooks FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT false,
  sales_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
ON public.courses FOR SELECT
USING (true);

CREATE POLICY "Admins can manage courses"
ON public.courses FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create course_lessons table
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  resource_url TEXT,
  lesson_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons for viewable courses"
ON public.course_lessons FOR SELECT
USING (true);

CREATE POLICY "Admins can manage lessons"
ON public.course_lessons FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('ebook', 'course')),
  item_id UUID NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  coupon_code TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
ON public.purchases FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases"
ON public.purchases FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create purchases"
ON public.purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create download_requests table for free ebook email capture
CREATE TABLE public.download_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.download_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create download requests"
ON public.download_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view download requests"
ON public.download_requests FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create coupon_codes table
CREATE TABLE public.coupon_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage coupon codes"
ON public.coupon_codes FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- NOW add storage policies that reference the purchases table
CREATE POLICY "Anyone can view ebook covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'ebook-covers');

CREATE POLICY "Admins can upload ebook covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ebook-covers' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ebook covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ebook-covers' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ebook covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'ebook-covers' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view purchased ebook files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'ebook-files' AND (
    has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.purchases
      WHERE user_id = auth.uid()
      AND item_type = 'ebook'
      AND item_id::text = (storage.foldername(name))[1]
    )
  )
);

CREATE POLICY "Admins can upload ebook files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ebook-files' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ebook files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ebook-files' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ebook files"
ON storage.objects FOR DELETE
USING (bucket_id = 'ebook-files' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view course thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Admins can upload course thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'course-thumbnails' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'course-thumbnails' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'course-thumbnails' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view purchased course resources"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-resources' AND (
    has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.purchases
      WHERE user_id = auth.uid()
      AND item_type = 'course'
      AND item_id::text = (storage.foldername(name))[1]
    )
  )
);

CREATE POLICY "Admins can upload course resources"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'course-resources' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course resources"
ON storage.objects FOR UPDATE
USING (bucket_id = 'course-resources' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course resources"
ON storage.objects FOR DELETE
USING (bucket_id = 'course-resources' AND has_role(auth.uid(), 'admin'));

-- Function to increment sales count
CREATE OR REPLACE FUNCTION public.increment_sales_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.item_type = 'ebook' THEN
    UPDATE public.ebooks SET sales_count = sales_count + 1 WHERE id = NEW.item_id;
  ELSIF NEW.item_type = 'course' THEN
    UPDATE public.courses SET sales_count = sales_count + 1 WHERE id = NEW.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-increment sales count on purchase
CREATE TRIGGER on_purchase_increment_sales
AFTER INSERT ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.increment_sales_count();

-- Function to update updated_at timestamp (reuse existing or create if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_ebooks_updated_at
BEFORE UPDATE ON public.ebooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();