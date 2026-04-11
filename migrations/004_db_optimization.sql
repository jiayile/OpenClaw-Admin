-- ============================================================
-- OpenClaw-Admin: Database Optimization & Performance Tuning
-- Version: 004
-- Target: SQLite (better-sqlite3)
-- Author: DBA Agent
-- Created: 2026-04-11
-- Purpose: Performance optimization, missing indexes, schema cleanup
-- ============================================================

-- ============================================================
-- SECTION 1: MISSING INDEXES (Performance Optimization)
-- ============================================================

-- Users table additional indexes
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);
CREATE INDEX IF NOT EXISTS idx_users_display_name ON users(display_name);

-- Sessions table additional indexes
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);

-- Roles table additional indexes
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- Audit logs additional indexes
CREATE INDEX IF NOT EXISTS idx_audit_ip ON audit_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_audit_resource_id ON audit_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at_desc ON audit_logs(created_at DESC);

-- Notifications additional indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_desc ON notifications(created_at DESC);

-- Agents additional indexes
CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);
CREATE INDEX IF NOT EXISTS idx_agents_created_desc ON agents(created_at DESC);

-- Agent templates additional indexes
CREATE INDEX IF NOT EXISTS idx_templates_name ON agent_templates(name);
CREATE INDEX IF NOT EXISTS idx_templates_featured ON agent_templates(is_featured, sort_order);

-- Companies additional indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_created_desc ON companies(created_at DESC);

-- Company members additional indexes
CREATE INDEX IF NOT EXISTS idx_members_role ON company_members(role);
CREATE INDEX IF NOT EXISTS idx_members_status ON company_members(status);

-- Scenarios additional indexes
CREATE INDEX IF NOT EXISTS idx_scenarios_created_desc ON scenarios(created_at DESC);

-- Tasks additional indexes
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_agents ON tasks(assigned_agents);
CREATE INDEX IF NOT EXISTS idx_tasks_created_desc ON tasks(created_at DESC);

-- Backup records additional indexes
CREATE INDEX IF NOT EXISTS idx_backup_status ON backup_records(status);
CREATE INDEX IF NOT EXISTS idx_backup_type ON backup_records(type);

-- User roles additional indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_granted_by ON user_roles(granted_by);

-- ============================================================
-- SECTION 2: VACUUM & ANALYZE (Database Maintenance)
-- ============================================================

-- Note: These commands should be run separately after migration
-- VACUUM;
-- ANALYZE;

-- ============================================================
-- SECTION 3: SCHEMA CONSISTENCY FIXES
-- ============================================================

-- Fix: Add missing columns to users table if not exists
-- SQLite requires ALTER TABLE for each column addition
-- These are idempotent checks (will fail if column exists, which is expected)

-- Check if phone column exists, add if missing
-- PRAGMA table_info(users); -- Run this first to check

-- Fix: Add phone column to users (if not exists)
-- Note: SQLite doesn't support 'IF NOT EXISTS' for ALTER TABLE ADD COLUMN
-- This will need to be run conditionally based on schema inspection

-- ============================================================
-- SECTION 4: DATA MIGRATION & CLEANUP
-- ============================================================

-- Cleanup: Remove orphaned records (if any)
-- DELETE FROM user_roles WHERE user_id NOT IN (SELECT id FROM users);
-- DELETE FROM user_roles WHERE role_id NOT IN (SELECT id FROM roles);
-- DELETE FROM role_permissions WHERE role_id NOT IN (SELECT id FROM roles);
-- DELETE FROM role_permissions WHERE permission_id NOT IN (SELECT id FROM permissions);

-- ============================================================
-- SECTION 5: PERFORMANCE TUNING RECOMMENDATIONS
-- ============================================================

-- Recommended SQLite PRAGMA settings for production:
-- PRAGMA journal_mode = WAL;
-- PRAGMA synchronous = NORMAL;
-- PRAGMA cache_size = -64000;  -- 64MB cache
-- PRAGMA temp_store = MEMORY;
-- PRAGMA mmap_size = 268435456;  -- 256MB memory mapping
-- PRAGMA foreign_keys = ON;

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================
