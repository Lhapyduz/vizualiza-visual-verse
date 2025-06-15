
-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  featured_image TEXT,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_images table for additional images
CREATE TABLE public.project_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  read_time TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('project', 'blog')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert some default categories
INSERT INTO public.categories (name, type) VALUES 
('Web Design', 'project'),
('Mobile App', 'project'),
('Branding', 'project'),
('UI/UX', 'project'),
('Tecnologia', 'blog'),
('Design', 'blog'),
('Negócios', 'blog'),
('Tutoriais', 'blog');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('project-images', 'project-images', true),
('blog-images', 'blog-images', true);

-- Create storage policies for project-images bucket
CREATE POLICY "Public Access for project-images" ON storage.objects
FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Public Upload for project-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Public Update for project-images" ON storage.objects
FOR UPDATE USING (bucket_id = 'project-images');

CREATE POLICY "Public Delete for project-images" ON storage.objects
FOR DELETE USING (bucket_id = 'project-images');

-- Create storage policies for blog-images bucket
CREATE POLICY "Public Access for blog-images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Public Upload for blog-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Public Update for blog-images" ON storage.objects
FOR UPDATE USING (bucket_id = 'blog-images');

CREATE POLICY "Public Delete for blog-images" ON storage.objects
FOR DELETE USING (bucket_id = 'blog-images');

-- Enable RLS on tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (since this is a portfolio site)
CREATE POLICY "Public read access for projects" ON public.projects
FOR SELECT USING (true);

CREATE POLICY "Public insert access for projects" ON public.projects
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access for projects" ON public.projects
FOR UPDATE USING (true);

CREATE POLICY "Public delete access for projects" ON public.projects
FOR DELETE USING (true);

CREATE POLICY "Public read access for project_images" ON public.project_images
FOR SELECT USING (true);

CREATE POLICY "Public insert access for project_images" ON public.project_images
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access for project_images" ON public.project_images
FOR UPDATE USING (true);

CREATE POLICY "Public delete access for project_images" ON public.project_images
FOR DELETE USING (true);

CREATE POLICY "Public read access for blog_posts" ON public.blog_posts
FOR SELECT USING (true);

CREATE POLICY "Public insert access for blog_posts" ON public.blog_posts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access for blog_posts" ON public.blog_posts
FOR UPDATE USING (true);

CREATE POLICY "Public delete access for blog_posts" ON public.blog_posts
FOR DELETE USING (true);

CREATE POLICY "Public read access for categories" ON public.categories
FOR SELECT USING (true);

CREATE POLICY "Public insert access for categories" ON public.categories
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access for categories" ON public.categories
FOR UPDATE USING (true);

CREATE POLICY "Public delete access for categories" ON public.categories
FOR DELETE USING (true);
