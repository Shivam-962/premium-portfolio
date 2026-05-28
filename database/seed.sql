-- Database Seed Script for Shivam Jethure
USE premium_portfolio;

-- 1. Insert default user (Password is 'admin123', hashed with bcrypt)
-- Hash: $2b$10$EPfPzV.g2fWw8H.Ld.Zpe.6B/u/hF958aA.bJ6.78q4v1u9c.3W3G (which is 'admin123')
INSERT INTO users (username, password, email, role, full_name, title, bio, location, profile_image)
VALUES (
  'admin',
  '$2b$10$EPfPzV.g2fWw8H.Ld.Zpe.6B/u/hF958aA.bJ6.78q4v1u9c.3W3G', -- password is admin123
  'shivaartist962@gmail.com',
  'admin',
  'Shivam Jethure',
  'B.Tech Student & Aspiring Full-Stack Developer',
  'A Second Year B.Tech student passionate about technology, software development, and modern digital experiences. I enjoy building responsive, user-friendly applications with real-world functionality.',
  'Maharashtra, India',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394A3B8"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
) ON DUPLICATE KEY UPDATE id=id;

-- 2. Insert Skills (incorporating learning and interests)
INSERT INTO skills (name, category, level, icon, is_featured) VALUES
('Java Programming', 'Backend', 85, 'Cpu', TRUE),
('Python Development', 'Backend', 80, 'Terminal', TRUE),
('MySQL Database', 'Backend', 88, 'Database', TRUE),
('Prompt Engineering', 'Tools', 92, 'Sparkles', TRUE),
('Vibe Coding & AI workflows', 'Tools', 95, 'Zap', TRUE),
('Full-Stack Web Dev', 'Frontend', 82, 'Atom', TRUE),
('UI/UX Prototyping', 'UI/UX', 80, 'Figma', TRUE),
('SaaS Development', 'Frontend', 75, 'Layers', FALSE),
('ERP Systems', 'Backend', 70, 'Cpu', FALSE),
('AI Tools & Automation', 'Tools', 88, 'Cloud', TRUE),
('Responsive Web Design', 'Frontend', 90, 'Wind', TRUE)
ON DUPLICATE KEY UPDATE level=VALUES(level), is_featured=VALUES(is_featured);

-- 3. Insert Projects
INSERT INTO projects (title, description, long_description, image_url, live_url, github_url, tags, is_featured) VALUES
(
  'Smart ERP Dashboard UI',
  'A modern visual dashboard for Enterprise Resource Planning, focused on ease of navigation and clean data reporting.',
  'An interactive ERP user interface designed with React and Tailwind CSS. It highlights modular widgets for sales tracking, student administration logs, inventory metrics, and glowing glassmorphism statistics cards.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  '#',
  '#',
  'React,Tailwind CSS,Framer Motion',
  TRUE
),
(
  'AI-Powered Automated Emailer',
  'A Python utility utilizing Prompt Engineering to draft customized emails based on database values.',
  'A smart command-line tool built using Python, MySQL, and OpenAI APIs. It reads contact rows, drafts context-aware messages based on prompt templates, and sends batches using secure SMTP protocols.',
  'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80',
  '#',
  '#',
  'Python,MySQL,Prompt Engineering',
  TRUE
),
(
  'Java Database Manager',
  'A local desktop application built in Java to manage student records and database connections dynamically.',
  'A full-featured Swing record catalog system. It utilizes JDBC driver connections to execute SQL procedures, format record lists, search datasets, and generate text reports.',
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
  '#',
  '#',
  'Java,MySQL,JDBC',
  FALSE
);

-- 4. Insert Experiences
INSERT INTO experiences (company, role, location, type, description, start_date, end_date, is_current) VALUES
(
  'G H Raisoni College of Engineering and Management',
  'Second Year B.Tech Student',
  'Pune, India',
  'Full-time',
  'Pursuing a Bachelor\'s Degree in engineering, maintaining strong academic foundations. Studied software development methodologies, database relations, and Object-Oriented programming.',
  'Aug 2024',
  'Present',
  TRUE
),
(
  'Academic Projects Portfolio',
  'Lead Project Developer',
  'Local / Remote',
  'Academic',
  'Designed and built multiple hands-on projects including the Smart ERP Dashboard UI (React/Tailwind), AI-Powered Automated Emailer (Python/MySQL), and Java Database Manager (Swing/JDBC).',
  'Sep 2024',
  'Ongoing',
  FALSE
);

-- 5. Insert Resume Templates
INSERT INTO resume_templates (name, style_key, description) VALUES
('Modern ATS-Friendly', 'ats', 'Clean single-column resume design optimized for parsing software (ATS) and readable typography.'),
('Futuristic Dark', 'modern_dark', 'A gorgeous neon-accented dark theme matching the portfolio UI. Perfect for creative roles.');

-- 6. Insert Master Resume Config
INSERT INTO resumes (name, is_master, content) VALUES
(
  'Shivam Jethure Master Resume',
  TRUE,
  '{
    "personal": {
      "name": "Shivam Jethure",
      "email": "shivaartist962@gmail.com",
      "phone": "+91 91751 41111",
      "location": "Maharashtra, India",
      "website": "https://shivamjethure.dev",
      "github": "github.com/Shivam-962",
      "summary": "A Second Year B.Tech student passionate about technology, software development, and modern digital experiences. Dedicated to building responsive, user-friendly, and visually modern applications with real-world functionality. Currently learning Java, MySQL, Python, Prompt Engineering, and Vibe Coding."
    },
    "education": [
      {
        "institution": "G H Raisoni College of Engineering and Management",
        "degree": "Bachelor of Technology (B.Tech) - Engineering",
        "year": "2024 - Present"
      }
    ],
    "skills": {
      "Backend": ["Java", "Python", "MySQL", "Database Management"],
      "Frontend": ["Full-Stack Web Dev", "Responsive Web Design", "HTML", "CSS"],
      "Tools": ["Prompt Engineering", "Vibe Coding & AI workflows", "AI Tools & Automation", "Figma"]
    },
    "projects": [
      {
        "title": "Smart ERP Dashboard UI",
        "tech": "React, Tailwind CSS, Framer Motion",
        "description": "Designed a modern visual dashboard mockup for Enterprise Resource Planning, highlighting student tracking logs and metrics."
      },
      {
        "title": "AI-Powered Automated Emailer",
        "tech": "Python, MySQL, Prompt Engineering",
        "description": "Built a Python automation script that drafts custom context-aware emails based on database values and templates."
      }
    ],
    "experience": [
      {
        "company": "G H Raisoni College of Engineering and Management",
        "role": "Second Year B.Tech Student",
        "period": "2024 - Present",
        "bullets": [
          "Pursuing a Bachelor\'s Degree in engineering, maintaining strong academic foundations.",
          "Studied software development methodologies, database relations, and Object-Oriented programming.",
          "Explored innovative technologies, custom prompts, and AI-assisted Vibe Coding workflows."
        ]
      },
      {
        "company": "Academic Projects Portfolio",
        "role": "Lead Project Developer",
        "period": "Ongoing",
        "bullets": [
          "Built 'Smart ERP Dashboard UI' using React, Tailwind CSS, and Framer Motion for responsive design.",
          "Developed 'AI-Powered Automated Emailer' using Python, MySQL, and Prompt Engineering templates.",
          "Created 'Java Database Manager' utilizing Swing and JDBC drivers to manage database connections."
        ]
      }
    ]
  }'
);
