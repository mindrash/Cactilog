#!/bin/bash
# Database backup script for Cactilog
# Creates SQL dumps of the database structure and/or data

set -e  # Exit on any error

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Create backups directory if it doesn't exist
mkdir -p backups

# Get current timestamp for filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🗄️  Starting database backup..."

# Option 1: Full backup (schema + data)
echo "Creating full backup..."
pg_dump "$DATABASE_URL" > "backups/full_backup_${TIMESTAMP}.sql"
echo "✅ Full backup saved to: backups/full_backup_${TIMESTAMP}.sql"

# Option 2: Schema only (safe for git)
echo "Creating schema-only backup..."
pg_dump "$DATABASE_URL" --schema-only > "backups/schema_backup_${TIMESTAMP}.sql"
echo "✅ Schema backup saved to: backups/schema_backup_${TIMESTAMP}.sql"

# Option 3: Data only (for restoration)
echo "Creating data-only backup..."
pg_dump "$DATABASE_URL" --data-only > "backups/data_backup_${TIMESTAMP}.sql"
echo "✅ Data backup saved to: backups/data_backup_${TIMESTAMP}.sql"

# Option 4: JSON export of key tables (git-friendly for small datasets)
echo "Creating JSON exports..."
psql "$DATABASE_URL" -t -A -c "SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM users) t" > "backups/users_${TIMESTAMP}.json"
psql "$DATABASE_URL" -t -A -c "SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM plants) t" > "backups/plants_${TIMESTAMP}.json"
echo "✅ JSON exports saved to backups/"

echo ""
echo "📊 Backup Summary:"
echo "===================="
ls -lh backups/*${TIMESTAMP}*

echo ""
echo "⚠️  Important Notes:"
echo "- Full/data backups contain user data - DO NOT commit to GitHub"
echo "- Schema backups are safe for version control"
echo "- Add backups/ to .gitignore to prevent accidental commits"
echo ""
echo "To restore from backup:"
echo "  psql \$DATABASE_URL < backups/full_backup_${TIMESTAMP}.sql"
