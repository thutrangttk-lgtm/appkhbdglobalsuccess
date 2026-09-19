-- ====================================================================
-- SUPABASE / POSTGRESQL DATABASE MIGRATION SCHEMA
-- AI LESSON PLAN STUDIO – GLOBAL SUCCESS PRIMARY ENGLISH
-- ====================================================================

-- 1. Create Lesson Plans Table
CREATE TABLE IF NOT EXISTS public.lesson_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    grade INT NOT NULL CHECK (grade BETWEEN 1 AND 5),
    week INT NOT NULL CHECK (week BETWEEN 1 AND 35),
    unit INT NOT NULL,
    lesson INT NOT NULL,
    header JSONB NOT NULL,
    objectives JSONB NOT NULL,
    teaching_aids JSONB NOT NULL,
    procedures JSONB NOT NULL,
    post_lesson_reflection TEXT,
    signatures JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'validated'
);

-- 2. Create Lesson Plan Versions Table (Version History Snapshot)
CREATE TABLE IF NOT EXISTS public.lesson_plan_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES public.lesson_plans(id) ON DELETE CASCADE,
    version INT NOT NULL,
    snapshot JSONB NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Index for Faster Searching
CREATE INDEX IF NOT EXISTS idx_lesson_plans_grade_week ON public.lesson_plans(grade, week);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_updated_at ON public.lesson_plans(updated_at DESC);
