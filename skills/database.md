# Database Skill
> Handle Supabase database operations
> Priority: MEDIUM

---

## TRIGGERS

- "table"
- "migration"
- "supabase"
- "database"
- "schema"
- "SQL"
- "query"

---

## PRE-FLIGHT CHECKS

1. [ ] Verify Supabase project is accessible
2. [ ] Check current schema state
3. [ ] Understand what data change is needed
4. [ ] Plan migration strategy

---

## SUPABASE CREDENTIALS

**Location:** `.secrets/KEYS.md`

```
Project URL: https://mgdctgrumyjppxddmqwz.supabase.co
Anon Key: [see secrets file]
Service Role Key: [see secrets file]
```

---

## STEPS

### 1. Access Supabase Dashboard
- URL: https://supabase.com/dashboard/project/mgdctgrumyjppxddmqwz
- Use Table Editor for simple changes
- Use SQL Editor for complex queries

### 2. Plan the Change
Before any schema change:
- What tables are affected?
- What data might be impacted?
- Is this reversible?
- Do we need a backup first?

### 3. Execute Change

#### For New Tables
```sql
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- add columns here
);
```

#### For Table Modifications
```sql
ALTER TABLE table_name
ADD COLUMN column_name data_type;
```

#### For Row Level Security
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "policy_name" ON table_name
FOR SELECT USING (true);
```

### 4. Update Application
After schema changes:
1. Update TypeScript types in `src/types/`
2. Update any affected components
3. Test the integration

### 5. Document Change
Add to MEMORY.md:
```markdown
## Database Change - [Date]
- Table: [name]
- Change: [description]
- Migration: [SQL used]
```

---

## CURRENT TABLES

| Table | Purpose | Status |
|-------|---------|--------|
| referrals | NDIS referral submissions | Active |
| contact_submissions | Contact form data | Active |
| quotes | Quote requests | Planned |

---

## COMMON OPERATIONS

### Insert Data
```sql
INSERT INTO table_name (column1, column2)
VALUES ('value1', 'value2');
```

### Query Data
```sql
SELECT * FROM table_name
WHERE condition = 'value'
ORDER BY created_at DESC
LIMIT 10;
```

### Update Data
```sql
UPDATE table_name
SET column = 'new_value'
WHERE id = 'uuid';
```

### Delete Data
```sql
DELETE FROM table_name
WHERE condition = 'value';
```

---

## VERIFICATION

- [ ] Schema change applied successfully
- [ ] Application types updated
- [ ] RLS policies in place
- [ ] Integration tested
- [ ] MEMORY.md updated

---

## IF FAILED

1. Check Supabase dashboard for errors
2. Verify SQL syntax
3. Check for foreign key constraints
4. Review RLS policies

---

## ROLLBACK

For table drops (DANGER):
```sql
-- DO NOT run without backup
DROP TABLE IF EXISTS table_name;
```

For column drops:
```sql
ALTER TABLE table_name
DROP COLUMN column_name;
```

---

## SUCCESS MESSAGE

"Database updated: [Description]. Schema change applied successfully."

---

*Always backup before destructive operations.*
