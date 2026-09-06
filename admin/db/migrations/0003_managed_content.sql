CREATE TYPE managed_content_kind AS ENUM ('announcement', 'course');

CREATE TABLE managed_content (
  id text PRIMARY KEY,
  kind managed_content_kind NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  working_payload jsonb NOT NULL,
  published_payload jsonb,
  status publication_status NOT NULL DEFAULT 'draft',
  published_on date,
  created_by text NOT NULL,
  updated_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX managed_content_kind_slug_unique ON managed_content (kind, slug);
CREATE INDEX managed_content_kind_status_idx ON managed_content (kind, status);
CREATE INDEX managed_content_updated_at_idx ON managed_content (updated_at DESC);
