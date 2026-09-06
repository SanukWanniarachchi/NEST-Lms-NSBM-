CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'user');

ALTER TABLE admin_allowlist
  ADD COLUMN role admin_role NOT NULL DEFAULT 'admin';

UPDATE admin_allowlist
SET role = 'super_admin', updated_at = now()
WHERE subject = (
  SELECT subject
  FROM admin_allowlist
  WHERE active = true
  ORDER BY created_at, subject
  LIMIT 1
);

ALTER TABLE admin_allowlist
  ALTER COLUMN role SET DEFAULT 'user';

CREATE INDEX admin_allowlist_role_idx ON admin_allowlist (role);
