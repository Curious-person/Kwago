-- Seed Data for Kwago E-commerce
-- Optimized for Supabase PostgreSQL

-- PRODUCTS
-- Table Structure: id, name, slug, price, condition (New/Used), category, description, images (text[]), stock_status (boolean), created_at
INSERT INTO public.products (id, name, slug, price, condition, category, description, images, stock_status, created_at)
VALUES
  (
    gen_random_uuid(), 
    'Spider-Man Marvel Legends Series Action Figure', 
    'spiderman-marvel-legends-retro', 
    24.99, 
    'New', 
    'Marvel', 
    'Classic retro-cardback Spider-Man with premium articulation and multiple accessories. Perfect for any Marvel collector.', 
    ARRAY['https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1000&auto=format&fit=crop'], 
    true, 
    now()
  ),
  (
    gen_random_uuid(), 
    'Venom Deluxe Marvel Legends Figure', 
    'venom-deluxe-legends', 
    34.99, 
    'New', 
    'Marvel', 
    'Heavyweight deluxe Venom figure featuring symbiotic tendrils and interchangeable heads. A must-have for the Spider-Verse shelf.', 
    ARRAY['https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1000&auto=format&fit=crop'], 
    true, 
    now()
  ),
  (
    gen_random_uuid(), 
    'Weta Workshop - The Witch-king of Angmar Statue', 
    'witch-king-weta-statue', 
    499.99, 
    'New', 
    'LOTR', 
    'A stunning 1:6 scale statue capturing the terrifying leader of the Nazgûl in meticulous detail. Hand-painted polystone.', 
    ARRAY['https://images.unsplash.com/photo-1559153813-9cd3772ece8b?q=80&w=1000&auto=format&fit=crop'], 
    true, 
    now()
  ),
  (
    gen_random_uuid(), 
    'Weta Workshop - Frodo Baggins Mini Epic', 
    'frodo-mini-epic', 
    29.99, 
    'Used', 
    'LOTR', 
    'Stylized vinyl figure of Frodo Baggins holding the One Ring. Great condition, original box included but slightly worn.', 
    ARRAY['https://images.unsplash.com/photo-1621478373722-155d943f73dd?q=80&w=1000&auto=format&fit=crop'], 
    true, 
    now()
  );

-- BLOG POSTS
-- Table Structure: id, title, slug, excerpt, content (MDX), featured_image, category, status (Draft/Published), created_at
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, featured_image, category, status, created_at)
VALUES
  (
    gen_random_uuid(), 
    'How to Identify Authentic Marvel Legends Figures', 
    'identify-authentic-marvel-legends', 
    'Avoid the bootlegs! Here is a guide to spotting genuine Hasbro Marvel Legends figures.', 
    '# Guide to Authenticity\n\nIdentifying authentic figures is crucial for collectors...\n\n## 1. Check the Logo\nGenuine Hasbro products always have a specific hologram or clean print of the logo...\n\n## 2. Joint Quality\nBootlegs often have loose or gummy joints...', 
    'https://images.unsplash.com/photo-1608889476561-6242afdbf622?q=80&w=1000&auto=format&fit=crop', 
    'Educational', 
    'Published', 
    now()
  ),
  (
    gen_random_uuid(), 
    'Preserving Your Weta Workshop Statues', 
    'preserving-weta-statues', 
    'Learn the best practices for cleaning and displaying your high-end Lord of the Rings statues.', 
    '# Maintenance Guide\n\nWeta statues are delicate works of art...\n\n## Dusting\nUse a soft makeup brush to remove dust without scratching the polystone finish.\n\n## Environment\nKeep out of direct sunlight to prevent paint fading over time...', 
    'https://images.unsplash.com/photo-1531390844884-f93bcad7bc99?q=80&w=1000&auto=format&fit=crop', 
    'Educational', 
    'Published', 
    now()
  );
