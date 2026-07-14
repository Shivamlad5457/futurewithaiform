-- Creator Collaboration Hub - MySQL Database Schema
-- Generate complete working database structure

CREATE DATABASE IF NOT EXISTS creator_collaboration_hub;
USE creator_collaboration_hub;

-- 1. Collaboration Requests Table
CREATE TABLE IF NOT EXISTS collaboration_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  instagram VARCHAR(255) NOT NULL,
  company VARCHAR(255) NULL,
  collaboration_type VARCHAR(100) NOT NULL,
  video_idea TEXT NOT NULL,
  description TEXT NOT NULL,
  preferred_date VARCHAR(50) NOT NULL,
  preferred_time VARCHAR(50) NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  deadline VARCHAR(50) NOT NULL,
  reference_link VARCHAR(500) NULL,
  image LONGTEXT NULL, -- Holds Base64 Image string or URL
  editing_required TINYINT(1) DEFAULT 0,
  voiceover_required TINYINT(1) DEFAULT 0,
  thumbnail_required TINYINT(1) DEFAULT 0,
  script_required TINYINT(1) DEFAULT 0,
  priority VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Admin Users Table (JWT Authentication)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- Hashed with bcrypt
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Seed Default Admin
-- Default Credentials: username: 'admin', password: 'admin123' (Hashed value below)
-- Insert only if 'admin' doesn't already exist
INSERT INTO admins (username, password) 
SELECT 'admin', '$2a$10$0Dqf2zVqZ9R11W/8V3zU7.UunL6oX713XFk0k8R1Wd/lX8H8Yf3fS' 
FROM DUAL 
WHERE NOT EXISTS (SELECT * FROM admins WHERE username = 'admin');
