-- ============================================================================
-- Smiley Bakes — Supabase setup
-- ============================================================================
-- Run this whole file ONCE in your Supabase project:
--   Supabase Dashboard → SQL Editor → New query → paste → Run
--
-- It creates the products table, security rules (RLS), and a public storage
-- bucket for product photos. After running it, see SUPABASE_SETUP.md to create
-- your admin login and seed the existing products.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Products table  (mirrors the old src/data/products.js object shape)
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id          bigint generated always as identity primary key,
  name        text not null,
  category    text not null,
  badge       text,                         -- e.g. 'On Request', 'Seasonal' (nullable)
  img         text,                          -- image URL (Supabase Storage or external)
  status      text not null default 'active' -- 'active' = shown publicly, 'hidden' = not shown
                check (status in ('active', 'hidden')),
  price       numeric(10, 2),                -- optional amount (nullable)
  price_unit  text check (price_unit in ('kg', 'piece', 'pack')), -- 'per kg/piece/pack'
  show_price  boolean not null default false,-- per-product toggle: show price publicly?
  sort_order  int  not null default 0,       -- controls display order
  created_at  timestamptz not null default now()
);

-- Helps the public site's ordered query.
create index if not exists products_sort_idx on public.products (sort_order, id);


-- ----------------------------------------------------------------------------
-- 2. Row Level Security
-- ----------------------------------------------------------------------------
-- Public site uses the ANON key → can only READ active products.
-- Admin app uses a LOGGED-IN user → can read everything and write.
alter table public.products enable row level security;

-- Anyone (including the anonymous public site) may read ACTIVE products.
drop policy if exists "public can read active products" on public.products;
create policy "public can read active products"
  on public.products for select
  using (status = 'active');

-- Logged-in (authenticated) users may read every product, including hidden ones.
drop policy if exists "authenticated can read all products" on public.products;
create policy "authenticated can read all products"
  on public.products for select
  to authenticated
  using (true);

-- Only logged-in users may create / change / remove products.
drop policy if exists "authenticated can insert products" on public.products;
create policy "authenticated can insert products"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated can update products" on public.products;
create policy "authenticated can update products"
  on public.products for update
  to authenticated
  using (true) with check (true);

drop policy if exists "authenticated can delete products" on public.products;
create policy "authenticated can delete products"
  on public.products for delete
  to authenticated
  using (true);


-- ----------------------------------------------------------------------------
-- 3. Storage bucket for product photos
-- ----------------------------------------------------------------------------
-- Public bucket so the website can show images via plain URLs.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Anyone may VIEW images (public bucket).
drop policy if exists "public can view product images" on storage.objects;
create policy "public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Only logged-in users may upload / replace / delete images.
drop policy if exists "authenticated can upload product images" on storage.objects;
create policy "authenticated can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "authenticated can update product images" on storage.objects;
create policy "authenticated can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "authenticated can delete product images" on storage.objects;
create policy "authenticated can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');


-- ----------------------------------------------------------------------------
-- 4. Gallery images table  (bento-grid gallery shown at /gallery)
-- ----------------------------------------------------------------------------
-- Separate from products. Reuses the 'product-images' bucket above for photos.
create table if not exists public.gallery_images (
  id          bigint generated always as identity primary key,
  img         text,                            -- image URL (Supabase Storage or external)
  caption     text,                            -- optional alt / hover caption
  size        text not null default 'small'    -- bento tile size
                check (size in ('small', 'wide', 'tall', 'large')),
  status      text not null default 'active'   -- 'active' = shown publicly, 'hidden' = not shown
                check (status in ('active', 'hidden')),
  sort_order  int  not null default 0,         -- controls grid flow order
  created_at  timestamptz not null default now()
);

create index if not exists gallery_sort_idx on public.gallery_images (sort_order, id);

alter table public.gallery_images enable row level security;

drop policy if exists "public can read active gallery" on public.gallery_images;
create policy "public can read active gallery"
  on public.gallery_images for select
  using (status = 'active');

drop policy if exists "authenticated can read all gallery" on public.gallery_images;
create policy "authenticated can read all gallery"
  on public.gallery_images for select
  to authenticated
  using (true);

drop policy if exists "authenticated can insert gallery" on public.gallery_images;
create policy "authenticated can insert gallery"
  on public.gallery_images for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated can update gallery" on public.gallery_images;
create policy "authenticated can update gallery"
  on public.gallery_images for update
  to authenticated
  using (true) with check (true);

drop policy if exists "authenticated can delete gallery" on public.gallery_images;
create policy "authenticated can delete gallery"
  on public.gallery_images for delete
  to authenticated
  using (true);
