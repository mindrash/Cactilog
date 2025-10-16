#!/bin/bash
# Database restoration script for Cactilog
# Restores database from SQL backup files

set -e  # Exit on any error

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore-database.sh <backup-file>"
    echo ""
    echo "Available backups:"
    ls -lh backups/*.sql 2>/dev/null || echo "No backups found in backups/ directory"
    exit 1
fi

BACKUP_FILE=$1

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will restore the database from backup"
echo "Database: $DATABASE_URL"
echo "Backup file: $BACKUP_FILE"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restoration cancelled."
    exit 0
fi

echo ""
echo "🔄 Starting database restoration..."

# Create a backup of current state before restoration
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
echo "Creating safety backup of current database..."
pg_dump "$DATABASE_URL" > "backups/pre_restore_backup_${TIMESTAMP}.sql"
echo "✅ Safety backup created: backups/pre_restore_backup_${TIMESTAMP}.sql"

# Restore from backup
echo "Restoring database from $BACKUP_FILE..."
psql "$DATABASE_URL" < "$BACKUP_FILE"

echo ""
echo "✅ Database restoration complete!"
echo ""
echo "If something went wrong, you can restore the previous state:"
echo "  psql \$DATABASE_URL < backups/pre_restore_backup_${TIMESTAMP}.sql"
