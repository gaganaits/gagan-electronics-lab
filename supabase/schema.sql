-- ========================================================================
-- GAGAN ELECTRONICS LAB - SUPABASE POSTGRESQL SCHEMA & SECURITY POLICIES
-- ========================================================================
-- Version: 1.0.0
-- Compliant with ARCHITECTURE.md and SECURITY.md

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------
-- 1. PRODUCTS TABLE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('FDM', 'SLA', 'SLS', 'SERVICE')),
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  technology TEXT NOT NULL,
  build_volume TEXT NOT NULL,
  print_speed TEXT NOT NULL,
  layer_resolution TEXT NOT NULL,
  supported_materials TEXT[] NOT NULL DEFAULT '{}',
  specifications JSONB NOT NULL DEFAULT '{}',
  applications TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  brochure_path TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------
-- 2. QUOTES TABLE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 10000),
  material TEXT NOT NULL,
  color TEXT NOT NULL,
  quality TEXT NOT NULL,
  infill TEXT,
  required_date TEXT,
  requirements TEXT,
  google_drive_url TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (
    status IN ('NEW', 'UNDER_REVIEW', 'QUOTE_SENT', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'ARCHIVED')
  ),
  estimated_price NUMERIC(10, 2),
  final_price NUMERIC(10, 2),
  currency TEXT NOT NULL DEFAULT 'INR',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_public_reference ON public.quotes(public_reference);

-- ------------------------------------------------------------------------
-- 3. QUOTE FILES TABLE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quote_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  extension TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_quote_files_quote_id ON public.quote_files(quote_id);

-- ------------------------------------------------------------------------
-- 4. PRICING CONFIGURATION TABLE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pricing_config (
  id TEXT PRIMARY KEY,
  material TEXT NOT NULL,
  material_rate_per_kg NUMERIC(10, 2) NOT NULL CHECK (material_rate_per_kg >= 0),
  machine_rate_per_hour NUMERIC(10, 2) NOT NULL CHECK (machine_rate_per_hour >= 0),
  electricity_rate_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 15.00,
  labour_rate_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 200.00,
  post_processing_rate NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
  minimum_charge NUMERIC(10, 2) NOT NULL DEFAULT 350.00,
  margin_percent NUMERIC(5, 2) NOT NULL DEFAULT 25.00 CHECK (margin_percent >= 0 AND margin_percent <= 100),
  active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------
-- 5. ADMIN PROFILES & ROLES TABLE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'STAFF' CHECK (role IN ('ADMIN', 'STAFF')),
  full_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------
-- 6. AUDIT LOGS TABLE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================
-- Turn on RLS for every single table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PRODUCTS:
-- Public can read active products only
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT USING (active = true);

-- Authenticated admins can manage products
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.user_id = auth.uid() AND active = true
    )
  );

-- QUOTES:
-- Anyone can insert a new quote request (anonymous public submission)
CREATE POLICY "Public can insert quotes" ON public.quotes
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Anonymous users CANNOT read quotes (prevent IDOR & enumeration)
-- Only verified admin/staff profiles can view and update quotes
CREATE POLICY "Admins can view and manage quotes" ON public.quotes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.user_id = auth.uid() AND active = true
    )
  );

-- QUOTE FILES:
-- Public can insert file records during quote creation
CREATE POLICY "Public can insert quote files" ON public.quote_files
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read quote files metadata
CREATE POLICY "Admins can view quote files" ON public.quote_files
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.user_id = auth.uid() AND active = true
    )
  );

-- PRICING CONFIG:
-- Only admins can read and update pricing config
CREATE POLICY "Admins can manage pricing" ON public.pricing_config
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.user_id = auth.uid() AND active = true
    )
  );

-- ADMIN PROFILES:
-- Users can read their own profile
CREATE POLICY "Admins can view self" ON public.admin_profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND active = true);

-- AUDIT LOGS:
-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.user_id = auth.uid() AND role = 'ADMIN' AND active = true
    )
  );

-- ========================================================================
-- PRIVATE STORAGE BUCKET CONFIGURATION
-- ========================================================================
-- Create private bucket for customer quotation CAD files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'quote-files',
  'quote-files',
  false, -- STRICTLY PRIVATE
  52428800, -- 50 MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'model/stl', 'application/octet-stream']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800;

-- Storage policies:
-- Anyone can upload files to the quotes/ directory
CREATE POLICY "Allow anonymous upload to quote files" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'quote-files' AND (storage.foldername(name))[1] = 'quotes');

-- Only authenticated admin profiles can select / download from quote-files
CREATE POLICY "Admins can read quote files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'quote-files' AND
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE admin_profiles.user_id = auth.uid() AND active = true
    )
  );

-- Seed initial pricing config
INSERT INTO public.pricing_config (
  id, material, material_rate_per_kg, machine_rate_per_hour,
  electricity_rate_per_hour, labour_rate_per_hour, post_processing_rate, minimum_charge, margin_percent
) VALUES
  ('price-pla', 'PLA+', 1400.00, 120.00, 15.00, 200.00, 150.00, 350.00, 25.00),
  ('price-petg', 'PETG', 1600.00, 130.00, 18.00, 200.00, 150.00, 400.00, 25.00),
  ('price-abs', 'ABS / ASA', 1900.00, 150.00, 22.00, 250.00, 200.00, 450.00, 30.00),
  ('price-tpu', 'TPU 95A', 2200.00, 160.00, 18.00, 250.00, 200.00, 500.00, 30.00),
  ('price-resin', 'Tough Resin', 3800.00, 280.00, 20.00, 300.00, 350.00, 750.00, 35.00),
  ('price-pacf', 'PA12-CF (Carbon Fiber)', 5500.00, 350.00, 25.00, 350.00, 400.00, 950.00, 35.00)
ON CONFLICT (id) DO NOTHING;
