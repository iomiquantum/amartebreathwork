-- Migration: breathwork_youth_inquiries
-- Tabla para capturar leads de la vertical /jovenes (niños 9-17 + colegios).
-- Form dual: 'parent' (B2C familia) | 'school' (B2B colegio) | 'other'.
-- Patrón replicado de breathwork_corporate_inquiries + breathwork_gender_inquiries.

CREATE TABLE IF NOT EXISTS public.breathwork_youth_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('parent', 'school', 'other')),

  -- PARENT (B2C familia)
  parent_name TEXT,
  parent_email TEXT,
  parent_whatsapp TEXT,
  parent_country_code TEXT DEFAULT '593',
  parent_country_name TEXT DEFAULT 'Ecuador',
  child_age INTEGER,
  child_count INTEGER DEFAULT 1,
  child_concerns TEXT,

  -- SCHOOL (B2B colegio)
  institution_name TEXT,
  institution_type TEXT,
  contact_role TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  student_count_total INTEGER,
  target_grades TEXT,
  format_interest TEXT,
  estimated_date DATE,

  -- COMÚN
  message TEXT,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost')),
  admin_notes TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  user_agent TEXT,
  honeypot_value TEXT
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_youth_inquiries_type
  ON public.breathwork_youth_inquiries(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_youth_inquiries_created
  ON public.breathwork_youth_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_youth_inquiries_status
  ON public.breathwork_youth_inquiries(status);

-- Trigger reutiliza función genérica existente
CREATE OR REPLACE FUNCTION public.update_breathwork_youth_inquiries_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_youth_inquiries_updated_at
  ON public.breathwork_youth_inquiries;
CREATE TRIGGER trg_youth_inquiries_updated_at
  BEFORE UPDATE ON public.breathwork_youth_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_breathwork_youth_inquiries_updated_at();

-- RLS
ALTER TABLE public.breathwork_youth_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Youth inquiries insertable by anon"
  ON public.breathwork_youth_inquiries;
CREATE POLICY "Youth inquiries insertable by anon"
  ON public.breathwork_youth_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Youth inquiries manageable by authenticated"
  ON public.breathwork_youth_inquiries;
CREATE POLICY "Youth inquiries manageable by authenticated"
  ON public.breathwork_youth_inquiries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- GRANTs explícitos (anon solo INSERT, sin SELECT)
GRANT INSERT ON public.breathwork_youth_inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.breathwork_youth_inquiries TO authenticated;

-- Comentario tabla
COMMENT ON TABLE public.breathwork_youth_inquiries IS
  'Leads de la vertical /jovenes (niños 9-17 + colegios). Form dual padre/colegio.';
