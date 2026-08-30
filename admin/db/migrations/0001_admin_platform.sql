CREATE TYPE publication_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE research_resource_type AS ENUM ('research_paper', 'video', 'document');

CREATE TABLE admin_allowlist (
  subject text PRIMARY KEY,
  email text,
  display_name text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX admin_allowlist_email_unique ON admin_allowlist (email);
CREATE INDEX admin_allowlist_active_idx ON admin_allowlist (active);

CREATE TABLE research_resources (
  id text PRIMARY KEY,
  slug text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  resource_type research_resource_type NOT NULL,
  authors text[] NOT NULL DEFAULT ARRAY[]::text[],
  href text NOT NULL,
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  status publication_status NOT NULL DEFAULT 'draft',
  published_on date,
  created_by text NOT NULL,
  updated_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT research_publication_date_check CHECK (
    (status = 'published' AND published_on IS NOT NULL)
    OR (status <> 'published' AND published_on IS NULL)
  )
);

CREATE UNIQUE INDEX research_resources_slug_unique ON research_resources (slug);
CREATE INDEX research_resources_status_idx ON research_resources (status);
CREATE INDEX research_resources_updated_at_idx ON research_resources (updated_at DESC);

CREATE TABLE audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_subject text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  previous_state jsonb,
  next_state jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_events_entity_idx ON audit_events (entity_type, entity_id);
CREATE INDEX audit_events_created_at_idx ON audit_events (created_at DESC);
