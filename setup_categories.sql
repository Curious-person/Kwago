-- Setup Script for Categories Table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image_url TEXT,
    icon_name TEXT,
    layout_style TEXT DEFAULT 'interest',
    tags TEXT[] DEFAULT '{}',
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Categories are viewable by everyone" 
    ON public.categories FOR SELECT USING (true);

CREATE POLICY "Users can create their own categories" 
    ON public.categories FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own categories" 
    ON public.categories FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own categories" 
    ON public.categories FOR DELETE USING (auth.uid() = author_id);

-- Optional: Initial Seed Data for the public page display
INSERT INTO public.categories (name, description, icon_name, layout_style)
VALUES 
    ('Design & Systems', 'Exploring the intersection of utility, aesthetics, and human-centered digital experiences.', 'PenTool', 'large'),
    ('Technology', 'The future of software, AI, and the tools that shape our world.', 'Cpu', 'medium'),
    ('Lifestyle', 'Mindfulness, productivity, and the art of slowing down in a fast world.', 'Heart', 'medium'),
    ('Productivity', 'Frameworks and mental models to help you do your best work with less friction.', 'Zap', 'vertical'),
    ('Literature', '', 'Book', 'interest'),
    ('Science', '', 'Beaker', 'interest'),
    ('Economics', '', 'LineChart', 'interest'),
    ('Society', '', 'Globe', 'interest')
ON CONFLICT (name) DO NOTHING;
