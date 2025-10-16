# Database Restoration Guide

This guide explains how to restore or recreate the Cactilog database from the version-controlled schema files.

## 📋 Overview

The database schema for Cactilog is stored in version control, making it easy to recreate the database structure on any system. The schema uses Drizzle ORM with PostgreSQL.

## 🗄️ Database Architecture

### Schema Files (Version Controlled)
- **`shared/schema.ts`** - Primary schema definition (TypeScript/Drizzle ORM)
- **`migrations/0000_graceful_miek.sql`** - Generated SQL migration file
- **`migrations/meta/`** - Migration metadata and snapshots
- **`drizzle.config.ts`** - Drizzle configuration

### Key Tables
- `users` - User accounts and profiles
- `plants` - Plant collection data
- `growth_records` - Growth tracking measurements
- `plant_photos` - Photo storage (base64 encoded)
- `plant_likes` - Community engagement
- `articles` - Knowledge base content
- `species_images` - Species reference images
- `sessions` - Authentication sessions
- `vendors` - Supplier information
- `admin_users` - Admin access control

## 🔄 Restoration Methods

### Method 1: Automatic Schema Push (Recommended)

This is the simplest method - Drizzle reads your schema and creates all tables automatically.

```bash
# Ensure you have a DATABASE_URL environment variable set
export DATABASE_URL="your-postgresql-connection-string"

# Push the schema to create all tables
npm run db:push
```

**What this does:**
- Reads `shared/schema.ts`
- Compares with current database state
- Creates or updates tables to match the schema
- Safe for initial setup or schema updates

### Method 2: Force Push (If Conflicts Occur)

If schema changes conflict with existing tables:

```bash
npm run db:push --force
```

⚠️ **Warning:** This will overwrite existing table structures. Only use if you're certain.

### Method 3: Manual SQL Migration

Run the generated SQL file directly:

```bash
# Using psql
psql $DATABASE_URL -f migrations/0000_graceful_miek.sql

# Or using any PostgreSQL client
# Copy contents of migrations/0000_graceful_miek.sql and execute
```

## 🚀 Complete Setup Process

### For a Fresh Database

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd cactilog

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env file or set in your hosting platform:
DATABASE_URL=postgresql://user:password@host:port/database

# 4. Push schema to create all tables
npm run db:push

# 5. Verify setup
# The application will now connect to the database
npm run dev
```

### For Replit Deployment

1. **Database is automatically provisioned** when you use Replit's PostgreSQL
2. **Environment variables are auto-configured** (`DATABASE_URL`, `PGHOST`, etc.)
3. **Schema push happens automatically** on first run
4. Simply run the app - database setup is handled for you

## 📊 Database Tools

### Inspect Current Schema
```bash
# Generate current schema snapshot
npx drizzle-kit introspect
```

### View Migration History
```bash
# Check migration journal
cat migrations/meta/_journal.json
```

### Generate New Migration (After Schema Changes)
```bash
# After modifying shared/schema.ts, generate migration
npx drizzle-kit generate
```

## 🔐 Data Backup & Recovery

### Backup Database
```bash
# Full database dump
pg_dump $DATABASE_URL > backup.sql

# Schema only
pg_dump $DATABASE_URL --schema-only > schema-backup.sql

# Data only
pg_dump $DATABASE_URL --data-only > data-backup.sql
```

### Restore from Backup
```bash
# Restore full backup
psql $DATABASE_URL < backup.sql

# Restore to new database
createdb new_cactilog_db
psql new_cactilog_db < backup.sql
```

## 🛠️ Troubleshooting

### Issue: "Table already exists"
```bash
# Solution: Use force push or drop existing tables first
npm run db:push --force
```

### Issue: "Cannot change column type"
```bash
# Solution: This is a destructive change
# Either: Drop and recreate tables (data loss)
# Or: Manually migrate data to new structure
```

### Issue: "Permission denied"
```bash
# Ensure your DATABASE_URL user has CREATE TABLE permissions
# Check connection string is correct
echo $DATABASE_URL
```

### Issue: Schema out of sync
```bash
# Pull current database schema
npx drizzle-kit introspect

# Compare with shared/schema.ts
# Push corrected schema
npm run db:push
```

## 📝 Important Notes

### ID Column Types
- **DO NOT change** primary key types (`serial` → `varchar` or vice versa)
- Existing tables use `serial` for most IDs (plants, photos, growth_records)
- Some tables use `varchar` with UUID (articles, admin_users, species_images)
- Changing ID types breaks relationships and data integrity

### Migration Safety
- Always test migrations in development first
- Backup production data before schema changes
- Use `--force` flag cautiously - it can cause data loss
- Review generated SQL before applying to production

### Version Control
- Schema changes are tracked in `shared/schema.ts`
- Migration files are committed to git
- Never edit migration files manually
- Generate new migrations for schema changes

## 🔗 Related Files

- `shared/schema.ts` - Main schema definition
- `server/db.ts` - Database connection setup
- `drizzle.config.ts` - Drizzle configuration
- `migrations/` - All migration files
- `package.json` - Contains `db:push` script

## 💡 Best Practices

1. **Always commit schema changes** to version control
2. **Test locally** before pushing to production
3. **Use `db:push`** for most schema updates
4. **Backup data** before major schema changes
5. **Document migrations** in commit messages
6. **Keep migrations in order** - don't delete old migrations
7. **Use transactions** for complex data migrations

## 📞 Support

If you encounter issues:
1. Check the migration files in `migrations/`
2. Review the schema in `shared/schema.ts`
3. Verify `DATABASE_URL` is correctly set
4. Check database user permissions
5. Review error messages for specific table/column issues

---

**Last Updated:** January 2025  
**Drizzle ORM Version:** Latest  
**PostgreSQL Version:** 14+
