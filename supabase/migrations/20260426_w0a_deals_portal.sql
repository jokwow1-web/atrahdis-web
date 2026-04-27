-- Wave 0-A: Deals Portal Schema Migration
-- Project: pnnhwfeljzcokuwqvcjb
-- Run this in Supabase SQL Editor (New Query), in order: Step 1 → Step 2 → Step 3
-- DoD: SELECT * FROM deals LIMIT 1; runs without error

-- ============================================================
-- Step 1 — 5 tabel baru
-- ============================================================

-- 1. LSBU_PARTNERS (dibuat dulu karena deals FK ke sini)
CREATE TABLE public.lsbu_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    asosiasi_kode TEXT NOT NULL UNIQUE,
    contact_email TEXT,
    contact_phone TEXT,
    fee_per_sbu_idr BIGINT,
    avg_turnaround_days SMALLINT,
    active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

INSERT INTO public.lsbu_partners (name, asosiasi_kode, fee_per_sbu_idr, avg_turnaround_days)
VALUES
    ('PARTNER_A_PLACEHOLDER', 'TBD-001', 6500000, 7),
    ('PARTNER_B_PLACEHOLDER', 'TBD-002', 6500000, 5),
    ('PARTNER_C_PLACEHOLDER', 'TBD-003', 7000000, 4);

-- 2. DEALS
CREATE TABLE public.deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.client_registry(id) ON DELETE RESTRICT,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    package_code TEXT NOT NULL CHECK (package_code IN ('SBU_KECIL','SBU_MENENGAH','SBU_BESAR','SBU_KONVERSI')),
    classification TEXT,
    subclassification TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft','docs_pending','docs_uploaded','validation_failed',
        'validation_passed','dp_pending','dp_paid','submitted',
        'in_review_lsbu','sbu_terbit','final_payment_pending',
        'completed','cancelled','refunded'
    )),
    tier TEXT NOT NULL DEFAULT 'self_service' CHECK (tier IN ('self_service','assisted','express','assisted_express')),
    price_idr BIGINT NOT NULL DEFAULT 15000000,
    addon_amount_idr BIGINT NOT NULL DEFAULT 0,
    total_price_idr BIGINT GENERATED ALWAYS AS (price_idr + addon_amount_idr) STORED,
    dp_amount_idr BIGINT,
    final_amount_idr BIGINT,
    lsbu_partner_id UUID REFERENCES public.lsbu_partners(id),
    sbu_number TEXT,
    sbu_issued_at TIMESTAMPTZ,
    sbu_expires_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    assigned_reviewer TEXT,
    notes JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_deals_client ON public.deals(client_id);
CREATE INDEX idx_deals_status ON public.deals(status);
CREATE INDEX idx_deals_expires ON public.deals(sbu_expires_at) WHERE sbu_expires_at IS NOT NULL;
CREATE INDEX idx_deals_created ON public.deals(created_at DESC);

-- 3. DEAL_STEPS
CREATE TABLE public.deal_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
    step_code TEXT NOT NULL,
    step_label TEXT NOT NULL,
    step_order SMALLINT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','blocked','skipped')),
    blocker_reason TEXT,
    completed_by TEXT,
    completed_at TIMESTAMPTZ,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (deal_id, step_code)
);

CREATE INDEX idx_steps_deal_order ON public.deal_steps(deal_id, step_order);
CREATE INDEX idx_steps_status ON public.deal_steps(status);

-- 4. DOCUMENTS
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    sha256 TEXT NOT NULL,
    validation_status TEXT NOT NULL DEFAULT 'pending' CHECK (validation_status IN (
        'pending','processing','validated','failed','manual_review','rejected'
    )),
    confidence_score NUMERIC(5,2),
    extracted_fields JSONB DEFAULT '{}'::jsonb,
    validation_errors JSONB DEFAULT '[]'::jsonb,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    ollama_log JSONB,
    gemini_log JSONB,
    claude_log JSONB,
    uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (deal_id, doc_type, sha256)
);

CREATE INDEX idx_docs_deal ON public.documents(deal_id);
CREATE INDEX idx_docs_status ON public.documents(validation_status);
CREATE INDEX idx_docs_type ON public.documents(doc_type);

-- 5. PAYMENT_SCHEDULES
CREATE TABLE public.payment_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE RESTRICT,
    invoice_id UUID REFERENCES public.invoices(id),
    payment_type TEXT NOT NULL CHECK (payment_type IN ('dp','final','full','refund','adjustment')),
    amount_idr BIGINT NOT NULL,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending','partial','paid','overdue','cancelled','refunded'
    )),
    midtrans_order_id TEXT UNIQUE,
    midtrans_transaction_id TEXT,
    midtrans_payment_method TEXT,
    midtrans_va_number TEXT,
    snap_token TEXT,
    snap_redirect_url TEXT,
    paid_at TIMESTAMPTZ,
    raw_webhook JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_payments_deal ON public.payment_schedules(deal_id);
CREATE INDEX idx_payments_status ON public.payment_schedules(status);
CREATE INDEX idx_payments_due ON public.payment_schedules(due_date) WHERE status IN ('pending','overdue');
CREATE INDEX idx_payments_midtrans_order ON public.payment_schedules(midtrans_order_id);

-- ============================================================
-- Step 2 — ALTER tabel existing
-- ============================================================

ALTER TABLE public.client_registry
    ADD COLUMN IF NOT EXISTS portal_user_id UUID REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS pic_name TEXT,
    ADD COLUMN IF NOT EXISTS pic_phone TEXT,
    ADD COLUMN IF NOT EXISTS company_legal_form TEXT CHECK (company_legal_form IN ('PT','CV','PT_PERORANGAN','KOPERASI','FIRMA')),
    ADD COLUMN IF NOT EXISTS nib TEXT,
    ADD COLUMN IF NOT EXISTS npwp TEXT,
    ADD COLUMN IF NOT EXISTS nib_verified_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS lpjk_check_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS lpjk_existing_sbu JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_clients_nib ON public.client_registry(nib) WHERE nib IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_npwp ON public.client_registry(npwp) WHERE npwp IS NOT NULL;

ALTER TABLE public.leads
    ADD COLUMN IF NOT EXISTS converted_deal_id UUID REFERENCES public.deals(id),
    ADD COLUMN IF NOT EXISTS portal_invite_sent_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS portal_first_login_at TIMESTAMPTZ;

-- ============================================================
-- Step 3 — Triggers + RLS
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

DO $$ DECLARE t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['deals','deal_steps','documents','payment_schedules']
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trg_%I_updated ON public.%I;
            CREATE TRIGGER trg_%I_updated BEFORE UPDATE ON public.%I
            FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
        ', t, t, t, t);
    END LOOP;
END $$;

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "client_own_deals" ON public.deals FOR SELECT USING (
    client_id IN (SELECT id FROM public.client_registry WHERE portal_user_id = auth.uid())
);
CREATE POLICY "client_own_deal_steps" ON public.deal_steps FOR SELECT USING (
    deal_id IN (SELECT d.id FROM public.deals d JOIN public.client_registry c ON c.id = d.client_id WHERE c.portal_user_id = auth.uid())
);
CREATE POLICY "client_own_documents_select" ON public.documents FOR SELECT USING (
    deal_id IN (SELECT d.id FROM public.deals d JOIN public.client_registry c ON c.id = d.client_id WHERE c.portal_user_id = auth.uid())
);
CREATE POLICY "client_own_documents_insert" ON public.documents FOR INSERT WITH CHECK (
    deal_id IN (SELECT d.id FROM public.deals d JOIN public.client_registry c ON c.id = d.client_id WHERE c.portal_user_id = auth.uid())
);
CREATE POLICY "client_own_payments" ON public.payment_schedules FOR SELECT USING (
    deal_id IN (SELECT d.id FROM public.deals d JOIN public.client_registry c ON c.id = d.client_id WHERE c.portal_user_id = auth.uid())
);
