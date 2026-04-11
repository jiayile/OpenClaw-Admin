const { query } = require('./src/utils/database');

(async () => {
  try {
    // Check if crons table exists
    const tables = await query("SHOW TABLES LIKE 'crons'");
    console.log('Tables:', tables);
    
    if (tables.length === 0) {
      console.log('Crons table does not exist, creating...');
      await query(`
        CREATE TABLE IF NOT EXISTS crons (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          schedule_type VARCHAR(50) NOT NULL,
          expression VARCHAR(255) NOT NULL,
          command VARCHAR(500) NOT NULL,
          description TEXT,
          enabled TINYINT(1) DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_enabled (enabled),
          INDEX idx_schedule_type (schedule_type),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('Crons table created');
    } else {
      console.log('Crons table already exists');
    }
    
    // Create cron_runs table
    const runsTables = await query("SHOW TABLES LIKE 'cron_runs'");
    if (runsTables.length === 0) {
      await query(`
        CREATE TABLE IF NOT EXISTS cron_runs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          cron_id INT NOT NULL,
          command VARCHAR(500) NOT NULL,
          status ENUM('running', 'success', 'failed') DEFAULT 'running',
          output TEXT,
          error TEXT,
          started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          finished_at DATETIME,
          INDEX idx_cron_id (cron_id),
          INDEX idx_started_at (started_at),
          INDEX idx_status (status),
          FOREIGN KEY (cron_id) REFERENCES crons(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('cron_runs table created');
    } else {
      console.log('cron_runs table already exists');
    }
    
    console.log('Database schema check complete');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
