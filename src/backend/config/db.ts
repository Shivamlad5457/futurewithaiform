import sqlite3 from 'sqlite3';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

// Database Interface
export interface DB {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<{ insertId?: number; affectedRows: number }>;
  close(): Promise<void>;
}

let dbInstance: DB;

class SQLiteDB implements DB {
  private db: sqlite3.Database;

  constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath);
  }

  query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  execute(sql: string, params: any[] = []): Promise<{ insertId?: number; affectedRows: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ insertId: this.lastID, affectedRows: this.changes });
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

class MySQLDB implements DB {
  private pool: mysql.Pool;

  constructor(config: mysql.PoolOptions) {
    this.pool = mysql.createPool(config);
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const [rows] = await this.pool.query(sql, params);
    return rows as T[];
  }

  async execute(sql: string, params: any[] = []): Promise<{ insertId?: number; affectedRows: number }> {
    const [result] = await this.pool.execute(sql, params);
    const res = result as any;
    return {
      insertId: res.insertId,
      affectedRows: res.affectedRows || 0
    };
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export async function getDB(): Promise<DB> {
  if (dbInstance) return dbInstance;

  const useMySQL = process.env.DB_HOST && process.env.DB_USER;

  if (useMySQL) {
    console.log('Connecting to MySQL Database...');
    dbInstance = new MySQLDB({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  } else {
    console.log('Falling back to SQLite Database for local development...');
    const dbDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const sqlitePath = path.join(dbDir, 'collaboration_hub.sqlite');
    dbInstance = new SQLiteDB(sqlitePath);
  }

  // Run initialization tables
  await initializeDatabase(dbInstance);

  return dbInstance;
}

async function initializeDatabase(db: DB) {
  const isSQLite = !process.env.DB_HOST;

  const createRequestsTableSQL = isSQLite 
    ? `CREATE TABLE IF NOT EXISTS collaboration_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        mobile TEXT NOT NULL,
        instagram TEXT NOT NULL,
        request_type TEXT NOT NULL,
        idea_title TEXT NOT NULL,
        idea_description TEXT NOT NULL,
        preferred_date TEXT,
        preferred_time TEXT,
        video_duration INTEGER,
        additional_note TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    : `CREATE TABLE IF NOT EXISTS collaboration_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(50) NOT NULL,
        instagram VARCHAR(255) NOT NULL,
        request_type VARCHAR(100) NOT NULL,
        idea_title VARCHAR(255) NOT NULL,
        idea_description TEXT NOT NULL,
        preferred_date VARCHAR(50) NULL,
        preferred_time VARCHAR(50) NULL,
        video_duration INT NULL,
        additional_note TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;

  const createAdminsTableSQL = isSQLite
    ? `CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    : `CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;

  try {
    await db.query(createRequestsTableSQL);
    await db.query(createAdminsTableSQL);
    console.log('Database tables initialized successfully!');

    // Add video_duration column if it does not exist in the database (for backward compatibility)
    try {
      if (isSQLite) {
        await db.execute('ALTER TABLE collaboration_requests ADD COLUMN video_duration INTEGER');
      } else {
        await db.execute('ALTER TABLE collaboration_requests ADD COLUMN video_duration INT NULL');
      }
      console.log('Added video_duration column successfully.');
    } catch (colErr) {
      // Column probably already exists, which is fine
    }

    // Set up single admin exclusive access from environment variables
    const envUser = process.env.ADMIN_USERNAME || 'admin';
    const envPass = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(envPass, 10);

    const existingAdmins = await db.query('SELECT * FROM admins WHERE username = ?', [envUser]);
    if (existingAdmins.length === 0) {
      // Clear out other admins first to enforce exclusivity
      await db.execute('DELETE FROM admins');
      await db.execute('INSERT INTO admins (username, password) VALUES (?, ?)', [envUser, hashedPassword]);
      console.log(`Seeded/restructured exclusive admin: (username: ${envUser})`);
    } else {
      // Keep it up-to-date with any environment variable password change
      await db.execute('UPDATE admins SET password = ? WHERE username = ?', [hashedPassword, envUser]);
      // Remove any other admin users to prevent anyone else from accessing it
      await db.execute('DELETE FROM admins WHERE username != ?', [envUser]);
      console.log(`Updated password and enforced exclusive admin: (username: ${envUser})`);
    }
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}
