-- ============================================================
-- OpenClaw-Admin: Database Schema Review & Recommendations
-- Version: 005
-- Target: SQLite (better-sqlite3)
-- Author: DBA Agent
-- Created: 2026-04-11
-- Purpose: Schema analysis, recommendations, and future migration planning
-- ============================================================

-- ============================================================
-- CURRENT SCHEMA ANALYSIS
-- ============================================================

-- Tables identified in wizard.db:
-- 1. users - User accounts and authentication
-- 2. sessions - User session management
-- 3. roles - Role definitions
-- 4. permissions - Permission definitions
-- 5. user_roles - User-Role many-to-many relationship
-- 6. user_permissions - Direct user permissions (optional override)
-- 7. audit_logs - System audit trail
-- 8. notifications - User notifications
-- 9. agents - Agent configurations (Office feature)
-- 10. agent_templates - Agent templates
-- 11. companies - Company definitions (MyWorld feature)
-- 12. company_members - Company member relationships
-- 13. scenarios - Collaboration scenarios (Office feature)
-- 14. tasks - Tasks within scenarios
-- 15. backup_records - Backup operation records
-- 16. themes - UI theme definitions
-- 17. user_theme_preferences - User theme settings
-- 18. alert_channels - Alert notification channels
-- 19. alert_rules - Alert rule configurations

-- ============================================================
-- SCHEMA ISSUES IDENTIFIED
-- ============================================================

-- ISSUE 1: Inconsistent schema across migration files
-- - 001_rbac_schema.sql: Basic RBAC structure
-- - 002_office_myworld.sql: Office + MyWorld features
-- - 003_complete_schema.sql: Consolidated schema
-- - Current DB: Has additional tables (scenarios, tasks, themes, etc.)
-- RECOMMENDATION: Standardize on 003_complete_schema.sql as baseline

-- ISSUE 2: Missing columns in users table
-- - Schema 003 has: phone, last_login_ip, deleted_at
-- - Current DB: Missing these columns
-- RECOMMENDATION: Add missing columns via migration

-- ISSUE 3: Inconsistent role_permissions handling
-- - 001: Uses role_permissions junction table
-- - 003: Roles store permissions as JSON array
-- - Current DB: Has permissions TEXT column in roles table
-- RECOMMENDATION: Standardize on junction table approach for flexibility

-- ISSUE 4: Missing foreign key constraints
-- - Several tables reference users/companies without FK constraints
-- RECOMMENDATION: Add FK constraints for data integrity

-- ISSUE 5: No soft delete support
-- - users table has deleted_at but not enforced
-- RECOMMENDATION: Implement soft delete pattern consistently

-- ============================================================
-- RECOMMENDED NEXT MIGRATIONS
-- ============================================================

-- MIGRATION 005: Schema Consistency Fixes
-- - Add missing columns to users (phone, last_login_ip, deleted_at)
-- - Migrate roles.permissions from JSON to role_permissions table
-- - Add foreign key constraints

-- MIGRATION 006: Office Feature Expansion
-- - Add office_scenes table (from 002_office_myworld.sql)
-- - Add office_agents table
-- - Add office_messages table
-- - Add office_tasks table (rename/migrate from tasks)

-- MIGRATION 007: MyWorld Feature Expansion
-- - Add myworld_areas table
-- - Add alert_channels table (if not exists)
-- - Add alert_rules table (if not exists)

-- MIGRATION 008: Performance Optimization
-- - Add composite indexes for common query patterns
-- - Add full-text search indexes (FTS5) for audit_logs, notifications
-- - Implement query optimization recommendations

-- MIGRATION 009: Data Archival Strategy
-- - Create archive tables for old audit_logs
-- - Create archive tables for old notifications
-- - Implement archival procedures

-- ============================================================
-- PERFORMANCE OPTIMIZATION CHECKLIST
-- ============================================================

-- [ ] Enable WAL mode for concurrent reads/writes
-- [ ] Set appropriate cache_size (-64000 for 64MB)
-- [ ] Configure mmap_size for large databases
-- [ ] Add covering indexes for frequent queries
-- [ ] Implement query result caching layer
-- [ ] Monitor slow queries and optimize

-- ============================================================
-- SECURITY RECOMMENDATIONS
-- ============================================================

-- [ ] Implement row-level security for multi-tenant scenarios
-- [ ] Add encryption at rest for sensitive columns
-- [ ] Implement audit log retention policy
-- [ ] Add IP whitelist/blacklist support
-- [ ] Implement session rotation policies

-- ============================================================
-- SCHEMA DOCUMENTATION
-- ============================================================

-- For complete schema documentation, see:
-- - docs/DATABASE_SCHEMA.md (to be created)
-- - docs/MIGRATION_GUIDE.md (to be created)

-- ============================================================
-- END OF REVIEW
-- ============================================================
