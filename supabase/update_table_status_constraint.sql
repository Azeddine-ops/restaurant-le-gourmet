-- Exécute ce script dans Supabase SQL Editor
-- Il permet d'autoriser les statuts: disponible / indisponible

ALTER TABLE restaurant_tables
DROP CONSTRAINT IF EXISTS restaurant_tables_statut_check;

ALTER TABLE restaurant_tables
ADD CONSTRAINT restaurant_tables_statut_check
CHECK (statut IN ('disponible', 'indisponible'));

UPDATE restaurant_tables
SET statut = 'disponible'
WHERE statut NOT IN ('disponible', 'indisponible');
