-- Adds modalidad column to reunion table if it doesn't exist
ALTER TABLE reunion
  ADD COLUMN IF NOT EXISTS modalidad ENUM('presencial','virtual','mixto') NULL AFTER hora_fin;