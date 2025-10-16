# Database Backup Guide

## ⚠️ Important: What to Store in GitHub

### ✅ **SAFE to commit to GitHub:**
- Database schema files (`shared/schema.ts`)
- Migration files (`migrations/*.sql`)
- Schema-only backups (structure without data)
- Sample/seed data (test data only)

### ❌ **NEVER commit to GitHub:**
- Full database dumps with user data
- Data-only backups
- Any files containing:
  - User emails, names, personal information
  - Photos/images (unless public sample data)
  - Authentication data
  - Production data

## 📦 Backup Options

### Option 1: Automated Backup Script (Recommended)

I've created backup scripts for you:

```bash
# Create backups (schema, data, and JSON exports)
./scripts/backup-database.sh

# Restore from backup
./scripts/restore-database.sh backups/full_backup_20250116_120000.sql
```

**What gets created:**
- `backups/full_backup_*.sql` - Complete database (❌ don't commit)
- `backups/schema_backup_*.sql` - Structure only (✅ safe to commit)
- `backups/data_backup_*.sql` - Data only (❌ don't commit)
- `backups/*.json` - JSON exports (❌ don't commit unless sanitized)

### Option 2: Manual PostgreSQL Commands

```bash
# Full backup
pg_dump $DATABASE_URL > backup.sql

# Schema only (safe for git)
pg_dump $DATABASE_URL --schema-only > schema.sql

# Data only
pg_dump $DATABASE_URL --data-only > data.sql

# Specific tables
pg_dump $DATABASE_URL -t plants -t growth_records > plants_backup.sql
```

### Option 3: Replit's Built-in Restore

Replit provides automatic database snapshots:
1. Open Database tool in workspace
2. Go to "Settings" tab
3. Set "History Retention" period
4. Use "Restore" to revert to any point in time

This is built into Replit - no manual backups needed!

## 🔄 Restoration Methods

### From Backup File
```bash
# Using the script
./scripts/restore-database.sh backups/full_backup_20250116_120000.sql

# Or manually
psql $DATABASE_URL < backup.sql
```

### From Schema (Fresh Database)
```bash
# Push current schema
npm run db:push

# Or run migration file
psql $DATABASE_URL < migrations/0000_graceful_miek.sql
```

## 📝 Best Practices

### For Version Control (GitHub)

**DO commit:**
```bash
git add shared/schema.ts           # Schema definition
git add migrations/                # Migration files
git add scripts/backup-database.sh # Backup scripts
```

**DON'T commit:**
```bash
# These are in .gitignore
backups/                          # Contains user data
*.sql (if contains data)          # User information
*.json (if contains user data)    # Personal data
```

### For Production Safety

1. **Regular Backups**
   ```bash
   # Run daily/weekly
   ./scripts/backup-database.sh
   
   # Store backups securely (NOT in git)
   # - Cloud storage (AWS S3, Google Cloud)
   # - Secure backup service
   # - Encrypted local storage
   ```

2. **Test Restorations**
   ```bash
   # Periodically verify backups work
   ./scripts/restore-database.sh backups/latest_backup.sql
   ```

3. **Use Replit's Built-in Restore**
   - Configure retention period in Database settings
   - Replit handles automatic snapshots
   - No manual backup needed for recent data

## 🗂️ Backup Schedule Recommendation

### For Development/Small Projects:
- **Schema**: Commit to git after any schema changes
- **Data**: Use Replit's built-in restore (automatic)
- **Manual backups**: Before major changes only

### For Production/Important Data:
- **Daily automated backups** to secure storage
- **Weekly full backups** stored off-site
- **Keep last 30 days** of backups
- **Test restore monthly** to verify backups work

## 🔐 Security Notes

### Why Not Store Data in GitHub?

1. **Privacy**: User emails, names, personal data
2. **Security**: Authentication tokens, session data
3. **Size**: Git isn't designed for large binary data
4. **History**: Data persists in git history forever
5. **Compliance**: May violate GDPR/privacy laws

### What If I Accidentally Committed Data?

```bash
# Remove from git history (DANGEROUS - consult team first)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backups/*" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (rewrites history)
git push origin --force --all
```

Better: Prevention via `.gitignore` (already configured)

## 📊 Backup File Sizes

Typical sizes for Cactilog:
- Schema only: ~5-10 KB (safe for git)
- Data backup: Varies by usage
  - 10 plants: ~50 KB
  - 100 plants: ~500 KB
  - 1000 plants with photos: ~50+ MB (too large for git)

## 💡 Alternative: Seed Data for Git

If you want sample data in version control:

```bash
# Create sanitized seed data
psql $DATABASE_URL -c "COPY (
  SELECT 'sample@example.com' as email, 
         'Sample User' as display_name
  FROM users LIMIT 1
) TO STDOUT" > seed_data.sql
```

This gives you test data without real user information.

## 🆘 Emergency Recovery

If you lose data and have no backup:

1. **Check Replit Restore**: Database → Settings → Restore
2. **Check previous git commits**: Schema might help reconstruct
3. **Check Replit Checkpoints**: May include database state
4. **Contact Replit Support**: They may have additional backups

## 📚 Related Documentation

- [DATABASE_RESTORE.md](./DATABASE_RESTORE.md) - Schema restoration
- [Replit Database Docs](https://docs.replit.com/hosting/databases/postgresql-on-replit)
- `shared/schema.ts` - Current database schema
- `migrations/` - Migration history
