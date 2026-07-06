-- ============================================================================
-- New product collection: latest_products
-- ============================================================================
-- The site now reads its catalog from `latest_products` instead of `products`.
-- This table mirrors the `products` schema and RLS exactly, and is seeded with
-- the current catalog under the NEW category scheme:
--   Tea, Coffee, Milkshake, Juice, Dessert, Fresh Cream Cakes,
--   Ooty Special Varkey, Homemade Chocolate, Nilgiri Oils, Tea Powders
--
-- Images are intentionally left null — the client will add photos later via the
-- admin; the site falls back to a static placeholder in the meantime.
--
-- Idempotent-ish: creating the table and policies is safe to re-run. The seed
-- only runs when the table is empty, so re-running won't duplicate rows.
-- ============================================================================

create table if not exists public.latest_products (
  id          bigint generated always as identity primary key,
  name        text not null,
  category    text not null,
  badge       text,
  img         text,
  status      text not null default 'active'
                check (status in ('active', 'hidden')),
  price       numeric(10, 2),
  price_unit  text check (price_unit in ('kg', 'piece', 'pack')),
  show_price  boolean not null default false,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists latest_products_sort_idx
  on public.latest_products (sort_order, id);

-- ---- Row Level Security (same rules as products) ----
alter table public.latest_products enable row level security;

drop policy if exists "public can read active latest_products" on public.latest_products;
create policy "public can read active latest_products"
  on public.latest_products for select
  using (status = 'active');

drop policy if exists "authenticated can read all latest_products" on public.latest_products;
create policy "authenticated can read all latest_products"
  on public.latest_products for select
  to authenticated
  using (true);

drop policy if exists "authenticated can insert latest_products" on public.latest_products;
create policy "authenticated can insert latest_products"
  on public.latest_products for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated can update latest_products" on public.latest_products;
create policy "authenticated can update latest_products"
  on public.latest_products for update
  to authenticated
  using (true) with check (true);

drop policy if exists "authenticated can delete latest_products" on public.latest_products;
create policy "authenticated can delete latest_products"
  on public.latest_products for delete
  to authenticated
  using (true);

-- ---- Seed (only when empty) ----
insert into public.latest_products (name, category, badge, status, sort_order)
select * from (values
  ('Tea', 'Tea', null, 'active', 0),
  ('Coffee', 'Coffee', null, 'active', 1),
  ('Chocolate Milkshake', 'Milkshake', null, 'active', 2),
  ('Strawberry Milkshake', 'Milkshake', null, 'active', 3),
  ('Vanilla Milkshake', 'Milkshake', null, 'active', 4),
  ('Oreo Milkshake', 'Milkshake', null, 'active', 5),
  ('Butterscotch Milkshake', 'Milkshake', null, 'active', 6),
  ('Mango Milkshake', 'Milkshake', 'Seasonal', 'active', 7),
  ('Seasonal Fresh Juices', 'Juice', null, 'active', 8),
  ('Brownies', 'Dessert', null, 'active', 9),
  ('Brownie with Ice Cream', 'Dessert', null, 'active', 10),
  ('Chocolate Lava Cake', 'Dessert', null, 'active', 11),
  ('Carrot Cake', 'Dessert', null, 'active', 12),
  ('Banana Cake', 'Dessert', null, 'active', 13),
  ('Swiss Roll', 'Dessert', null, 'active', 14),
  ('Mini Doughnuts', 'Dessert', null, 'active', 15),
  ('Rich Plum Cake', 'Dessert', null, 'active', 16),
  ('Salt Cookies', 'Dessert', null, 'active', 17),
  ('Sweet Cookies', 'Dessert', null, 'active', 18),
  ('Peanut Cookies', 'Dessert', null, 'active', 19),
  ('Black Forest', 'Fresh Cream Cakes', null, 'active', 20),
  ('White Forest', 'Fresh Cream Cakes', null, 'active', 21),
  ('Chocolate Truffle', 'Fresh Cream Cakes', null, 'active', 22),
  ('Red Velvet', 'Fresh Cream Cakes', null, 'active', 23),
  ('Purple Velvet', 'Fresh Cream Cakes', null, 'active', 24),
  ('Pista Velvet', 'Fresh Cream Cakes', null, 'active', 25),
  ('Pista Truffle', 'Fresh Cream Cakes', null, 'active', 26),
  ('Butterscotch', 'Fresh Cream Cakes', null, 'active', 27),
  ('Blueberry', 'Fresh Cream Cakes', null, 'active', 28),
  ('Strawberry', 'Fresh Cream Cakes', null, 'active', 29),
  ('Pineapple', 'Fresh Cream Cakes', null, 'active', 30),
  ('Black Currant', 'Fresh Cream Cakes', null, 'active', 31),
  ('Choco Fantasy', 'Fresh Cream Cakes', null, 'active', 32),
  ('Mousse Cup', 'Fresh Cream Cakes', null, 'active', 33),
  ('Customized Birthday Cakes', 'Fresh Cream Cakes', null, 'active', 34),
  ('Theme Cakes', 'Fresh Cream Cakes', null, 'active', 35),
  ('Photo Cakes', 'Fresh Cream Cakes', null, 'active', 36),
  ('Anniversary Cakes', 'Fresh Cream Cakes', null, 'active', 37),
  ('Wedding Cakes', 'Fresh Cream Cakes', null, 'active', 38),
  ('Baby Shower Cakes', 'Fresh Cream Cakes', null, 'active', 39),
  ('Engagement Cakes', 'Fresh Cream Cakes', null, 'active', 40),
  ('Kids'' Character Cakes', 'Fresh Cream Cakes', null, 'active', 41),
  ('Number Cakes', 'Fresh Cream Cakes', null, 'active', 42),
  ('Alphabet Cakes', 'Fresh Cream Cakes', null, 'active', 43),
  ('Eggless Customized Cakes', 'Fresh Cream Cakes', 'On Request', 'active', 44),
  ('Normal Varkey', 'Ooty Special Varkey', null, 'active', 45),
  ('Ghee Varkey', 'Ooty Special Varkey', null, 'active', 46),
  ('Brown Sugar Varkey', 'Ooty Special Varkey', null, 'active', 47),
  ('Masala Varkey', 'Ooty Special Varkey', null, 'active', 48),
  ('Assorted Homemade Chocolates', 'Homemade Chocolate', null, 'active', 49),
  ('Eucalyptus Oil', 'Nilgiri Oils', null, 'active', 50),
  ('Joint Pain Oil', 'Nilgiri Oils', null, 'active', 51),
  ('Migraine Oil', 'Nilgiri Oils', null, 'active', 52),
  ('Tea Powder', 'Tea Powders', null, 'active', 53)
) as v(name, category, badge, status, sort_order)
where not exists (select 1 from public.latest_products);
