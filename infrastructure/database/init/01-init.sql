-- Ana Orthodox — Initial PostgreSQL Database Extensions & Setup
-- Target: PostgreSQL 18.x

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Set default client encoding
SET client_encoding = 'UTF8';
