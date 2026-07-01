-- Adds optional pricing to products.
--   price       — numeric amount (nullable; null = no price set)
--   price_unit  — 'kg' | 'piece' | 'pack' (nullable)
--   show_price  — per-product toggle; when false the price is hidden publicly
--
-- Idempotent: safe to run more than once.
alter table public.products
  add column if not exists price       numeric(10, 2),
  add column if not exists price_unit  text check (price_unit in ('kg', 'piece', 'pack')),
  add column if not exists show_price  boolean not null default false;
