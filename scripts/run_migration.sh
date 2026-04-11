#!/bin/bash
# Database Migration Script for OpenClaw-Admin
# Author: DBA Agent
# Date: 2026-04-11
# Usage: ./run_migration.sh [migration_number]

set -e

DB_PATH="/www/wwwroot/ai-work/data/wizard.db"
MIGRATIONS_DIR="/www/wwwroot/ai-work/migrations"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}OpenClaw-Admin Database Migration${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}Error: Database not found at $DB_PATH${NC}"
    exit 1
fi

# Get current migration version
get_current_version() {
    sqlite3 "$DB_PATH" "SELECT name FROM sqlite_master WHERE type='table' AND name='schema_versions' LIMIT 1;" 2>/dev/null || echo "0"
}

# Check if migration already applied
migration_applied() {
    local version=$1
    sqlite3 "$DB_PATH" "SELECT 1 FROM schema_versions WHERE version=$version;" 2>/dev/null | grep -q "1" && return 0 || return 1
}

# Apply migration
apply_migration() {
    local migration_file=$1
    local version=$2
    
    echo -e "${YELLOW}Applying migration: $migration_file${NC}"
    
    # Backup before migration
    cp "$DB_PATH" "${DB_PATH}.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}Backup created: ${DB_PATH}.backup.*${NC}"
    
    # Execute migration
    if sqlite3 "$DB_PATH" < "$migration_file"; then
        echo -e "${GREEN}Migration $version applied successfully${NC}"
        
        # Record migration
        sqlite3 "$DB_PATH" "CREATE TABLE IF NOT EXISTS schema_versions (version INTEGER PRIMARY KEY, applied_at INTEGER DEFAULT (strftime('%s', 'now')));"
        sqlite3 "$DB_PATH" "INSERT OR IGNORE INTO schema_versions (version) VALUES ($version);"
    else
        echo -e "${RED}Migration $version failed!${NC}"
        exit 1
    fi
}

# Main migration logic
main() {
    local target_version=$1
    
    # List available migrations
    echo -e "${YELLOW}Available migrations:${NC}"
    ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | while read file; do
        local filename=$(basename "$file")
        local version=$(echo "$filename" | cut -d'_' -f1)
        local status="pending"
        
        if sqlite3 "$DB_PATH" "SELECT 1 FROM schema_versions WHERE version=$version;" 2>/dev/null | grep -q "1"; then
            status="applied"
        fi
        
        echo "  $version - $filename [$status]"
    done
    
    # If no target version specified, apply all pending
    if [ -z "$target_version" ]; then
        echo -e "${YELLOW}No target version specified. Applying all pending migrations...${NC}"
        
        for migration_file in "$MIGRATIONS_DIR"/*.sql; do
            if [ -f "$migration_file" ]; then
                local filename=$(basename "$migration_file")
                local version=$(echo "$filename" | cut -d'_' -f1)
                
                if ! migration_applied "$version"; then
                    apply_migration "$migration_file" "$version"
                else
                    echo -e "${GREEN}Migration $version already applied, skipping${NC}"
                fi
            fi
        done
    else
        # Apply specific version
        local migration_file="$MIGRATIONS_DIR/${target_version}_*.sql"
        migration_file=$(ls $migration_file 2>/dev/null | head -1)
        
        if [ -z "$migration_file" ]; then
            echo -e "${RED}Migration file for version $target_version not found${NC}"
            exit 1
        fi
        
        if migration_applied "$target_version"; then
            echo -e "${YELLOW}Migration $target_version already applied${NC}"
        else
            apply_migration "$migration_file" "$target_version"
        fi
    fi
    
    # Final status
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Migration Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    
    echo -e "${YELLOW}Current schema version:${NC}"
    sqlite3 "$DB_PATH" "SELECT 'v' || printf('%03d', version) || ' - ' || datetime(applied_at, 'unixepoch', 'localtime') FROM schema_versions ORDER BY version DESC LIMIT 1;"
    
    echo -e "${YELLOW}Database tables:${NC}"
    sqlite3 "$DB_PATH" ".tables"
    
    echo -e "${YELLOW}Index count:${NC}"
    sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%';"
}

# Run main
main "$1"
