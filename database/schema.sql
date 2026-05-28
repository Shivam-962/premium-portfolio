-- MySQL Database Schema for Premium Portfolio & AI Resume Builder

CREATE DATABASE IF NOT EXISTS premium_portfolio;
USE premium_portfolio;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  full_name VARCHAR(150) NOT NULL,
  title VARCHAR(150) NOT NULL,
  bio TEXT,
  location VARCHAR(150),
  profile_image VARCHAR(255),
  otp_code VARCHAR(10) DEFAULT NULL,
  otp_expires DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image_url VARCHAR(255),
  live_url VARCHAR(255),
  github_url VARCHAR(255),
  tags VARCHAR(255) NOT NULL, -- Comma-separated or JSON
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL, -- e.g., 'Frontend', 'Backend', 'UI/UX', 'Tools'
  level INT DEFAULT 80, -- 0-100 proficiency
  icon VARCHAR(50), -- Lucide icon name
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company VARCHAR(150) NOT NULL,
  role VARCHAR(150) NOT NULL,
  location VARCHAR(150),
  type VARCHAR(50) DEFAULT 'Full-time', -- 'Full-time', 'Part-time', 'Freelance', 'Contract'
  description TEXT NOT NULL, -- Bullet points, markdown, or JSON
  start_date VARCHAR(50) NOT NULL,
  end_date VARCHAR(50) DEFAULT 'Present',
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  issuer VARCHAR(150) NOT NULL,
  issue_date VARCHAR(50),
  credential_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Resumes (Master resume configs) Table
CREATE TABLE IF NOT EXISTS resumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  is_master BOOLEAN DEFAULT TRUE,
  content JSON, -- Stores full JSON of sections: personal, education, skills, projects, experience
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Resume Templates Table
CREATE TABLE IF NOT EXISTS resume_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  style_key VARCHAR(50) NOT NULL UNIQUE, -- 'ats', 'modern_dark', 'corporate', 'minimal'
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Job Descriptions Table
CREATE TABLE IF NOT EXISTS job_descriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_title VARCHAR(150) NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  description_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Generated Resumes (Tailored versions) Table
CREATE TABLE IF NOT EXISTS generated_resumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_title VARCHAR(150) NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  template_style VARCHAR(50) DEFAULT 'ats',
  optimized_content JSON NOT NULL,
  pdf_filename VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL, -- 'page_view', 'resume_download', 'project_click'
  event_target VARCHAR(255),
  visitor_ip VARCHAR(50),
  referrer VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
