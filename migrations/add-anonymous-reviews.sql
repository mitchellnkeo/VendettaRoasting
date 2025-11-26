-- Migration: Add anonymous review support
-- This allows anyone to leave reviews without requiring a user account
-- Also supports Sanity product IDs (text format)

-- First, drop the unique constraint that requires user_id
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_product_id_user_id_key;

-- Make user_id optional (nullable)
ALTER TABLE reviews ALTER COLUMN user_id DROP NOT NULL;

-- Change product_id to support both UUID (database products) and text (Sanity product IDs)
-- First, we need to check if product_id is UUID type, if so we'll add a new column
DO $$ 
BEGIN
    -- Check if product_id column exists and is UUID type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' 
        AND column_name = 'product_id' 
        AND data_type = 'uuid'
    ) THEN
        -- Add a new text column for Sanity product IDs
        ALTER TABLE reviews ADD COLUMN IF NOT EXISTS sanity_product_id VARCHAR(255);
        
        -- Add index for Sanity product IDs
        CREATE INDEX IF NOT EXISTS idx_reviews_sanity_product ON reviews(sanity_product_id);
    END IF;
END $$;

-- Add fields for anonymous reviewers
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reviewer_name VARCHAR(255);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reviewer_email VARCHAR(255);

-- Add index for better query performance (for both UUID and text product IDs)
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved ON reviews(product_id, is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_reviews_sanity_product_approved ON reviews(sanity_product_id, is_approved) WHERE is_approved = true AND sanity_product_id IS NOT NULL;

-- Update the reviews table comment
COMMENT ON TABLE reviews IS 'Product reviews - supports both authenticated users and anonymous reviewers. Can reference products by UUID (database) or Sanity ID (text).';

