# Database Rules — ASHIKA
> Rules for Supabase/PostgreSQL operations

---

## Query Patterns

```typescript
// ✅ Correct — Typed queries with error handling
const { data, error } = await supabase
  .from('products')
  .select('id, name, category, rental_price, images')
  .eq('status', 'available')
  .order('created_at', { ascending: false });

if (error) throw new Error(error.message);
return data as Product[];

// ❌ Wrong — Untyped, no error handling
const { data } = await supabase.from('products').select('*');
```

---

## RLS (Row Level Security)

1. **Always use RLS** — Never bypass with service role in client
2. **Define policies in Supabase** — Not in application code
3. **Test policies** — Verify auth checks work

```sql
-- Example policy: Users can only read their own bookings
CREATE POLICY "Users read own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);
```

---

## Migrations

1. **Version control** — All schema changes in migrations
2. **Descriptive names** — `001_create_products_table.sql`
3. **Reversible** — Include down migrations when possible

```sql
-- supabase/migrations/001_create_products_table.sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rental_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Tables | snake_case, plural | `products`, `inventory_blocks` |
| Columns | snake_case | `rental_price`, `created_at` |
| Indexes | `idx_table_column` | `idx_products_category` |
| Constraints | `chk_table_rule` | `chk_booking_dates_valid` |

---

## Performance

1. **Index frequently queried columns** — category, status, dates
2. **Limit results** — Always use `.limit()` for listings
3. **Select specific columns** — Never `select('*')` in production

---

*Applied automatically for database tasks*
