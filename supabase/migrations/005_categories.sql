-- ============================================================================
-- Categories table
-- ============================================================================
-- Categories become first-class rows so the admin can add / remove them and
-- have the change reflect on the site (homepage filters + /products page).
--
-- Products still store their category as a text value (products.category); this
-- table is the authoritative list of *selectable* categories. Deleting a row
-- here just removes it from the pickers/filters — the admin's "delete category"
-- action separately deletes the products in that category (see ProductManager).
--
-- Idempotent: safe to re-run. The seed only runs when the table is empty and is
-- derived from whatever categories the product catalog already uses, so it
-- matches your live data without a hard-coded list to keep in sync.
-- ============================================================================

create table if not exists public.categories (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists categories_sort_idx
  on public.categories (sort_order, name);

-- ---- Row Level Security ----
alter table public.categories enable row level security;

drop policy if exists "public can read categories" on public.categories;
create policy "public can read categories"
  on public.categories for select
  using (true);

drop policy if exists "authenticated can insert categories" on public.categories;
create policy "authenticated can insert categories"
  on public.categories for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated can update categories" on public.categories;
create policy "authenticated can update categories"
  on public.categories for update
  to authenticated
  using (true) with check (true);

drop policy if exists "authenticated can delete categories" on public.categories;
create policy "authenticated can delete categories"
  on public.categories for delete
  to authenticated
  using (true);

-- ---- Seed (only when empty) ----
-- Populate from the distinct categories already present in the catalog, keeping
-- each category's smallest product sort_order so the list mirrors the site.
insert into public.categories (name, sort_order)
select category, min(sort_order)
from public.latest_products
where category is not null and category <> ''
  and not exists (select 1 from public.categories)
group by category;
