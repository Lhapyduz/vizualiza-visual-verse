
-- Add sort_order column to categories table
ALTER TABLE public.categories ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Update existing categories with sort_order based on creation order
WITH ordered_categories AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at) as rn
  FROM public.categories
)
UPDATE public.categories 
SET sort_order = ordered_categories.rn
FROM ordered_categories
WHERE public.categories.id = ordered_categories.id;
