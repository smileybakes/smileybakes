-- ============================================================================
-- Gallery — bento-grid image gallery shown at /gallery
-- ============================================================================
-- Adds a `gallery_images` table (separate from products) plus its Row Level
-- Security rules. Images are stored in the EXISTING 'product-images' storage
-- bucket, so no new bucket is needed.
--
-- Run this ONCE in your Supabase project:
--   Supabase Dashboard → SQL Editor → New query → paste → Run
--
-- Idempotent: safe to run more than once.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Gallery images table
-- ----------------------------------------------------------------------------
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

-- Helps the public site's ordered query.
create index if not exists gallery_sort_idx on public.gallery_images (sort_order, id);


-- ----------------------------------------------------------------------------
-- 2. Row Level Security
-- ----------------------------------------------------------------------------
-- Public site uses the ANON key → can only READ active images.
-- Admin app uses a LOGGED-IN user → can read everything and write.
alter table public.gallery_images enable row level security;

-- Anyone (including the anonymous public site) may read ACTIVE images.
drop policy if exists "public can read active gallery" on public.gallery_images;
create policy "public can read active gallery"
  on public.gallery_images for select
  using (status = 'active');

-- Logged-in (authenticated) users may read every image, including hidden ones.
drop policy if exists "authenticated can read all gallery" on public.gallery_images;
create policy "authenticated can read all gallery"
  on public.gallery_images for select
  to authenticated
  using (true);

-- Only logged-in users may create / change / remove images.
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

-- Note: gallery images reuse the existing 'product-images' storage bucket and
-- its policies (see schema.sql section 3), so no extra storage setup is needed.
