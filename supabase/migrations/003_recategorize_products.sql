-- Re-categorizes existing products to the new category scheme.
--
-- The public site reads products (and derives category tabs) from the DB, so
-- renaming categories in the code alone is not enough — the stored rows must be
-- migrated too, otherwise the old categories reappear after the initial render.
--
-- New categories: Tea, Coffee, Milkshake, Juice, Dessert, Fresh Cream Cakes,
-- Ooty Special Varkey, Homemade Chocolate, Nilgiri Oils, Tea Powders.
--
-- Idempotent: safe to run more than once (each UPDATE only matches old names).

-- Beverages → Milkshake / Juice; drop Hot Chocolate
update public.products set category = 'Milkshake'
  where category = 'Beverages' and name ilike '%Milkshake%';
update public.products set category = 'Juice'
  where category = 'Beverages' and name ilike '%Juice%';
delete from public.products
  where category = 'Beverages' and name = 'Hot Chocolate';

-- Desserts → Dessert
update public.products set category = 'Dessert' where category = 'Desserts';

-- Ooty Special Bakery → Dessert (cookies) + Ooty Special Varkey (varkey)
update public.products set category = 'Dessert'
  where category = 'Ooty Special Bakery' and name ilike '%Cookies%';
update public.products set category = 'Ooty Special Varkey'
  where category = 'Ooty Special Bakery';

-- Customized Cakes → Fresh Cream Cakes
update public.products set category = 'Fresh Cream Cakes'
  where category = 'Customized Cakes';

-- Homemade Chocolates → Homemade Chocolate
update public.products set category = 'Homemade Chocolate'
  where category = 'Homemade Chocolates';

-- Ooty Special Products → Nilgiri Oils (oils) + Tea Powders (tea powder)
update public.products set category = 'Nilgiri Oils'
  where category = 'Ooty Special Products' and name ilike '%Oil%';
update public.products set category = 'Tea Powders'
  where category = 'Ooty Special Products' and name ilike '%Tea Powder%';
