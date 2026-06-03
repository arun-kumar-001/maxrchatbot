-- Bot / Flow tables (Botpress-style)

CREATE TABLE IF NOT EXISTS public.bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL DEFAULT 'MAXR Bot',
  description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL DEFAULT 'Main Flow',
  definition JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flows_bot_id ON public.flows(bot_id);
CREATE INDEX IF NOT EXISTS idx_flows_published ON public.flows(is_published);

INSERT INTO public.settings (key, value) VALUES
  ('branding', '{"bot_name": "Assistant", "primary_color": "#ffffff", "accent_color": "#111827", "logo_url": ""}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
