const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;
let isMock = false;

// Mock database in-memory store for fallback if MySQL is offline
const mockDb = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: '$2b$10$EPfPzV.g2fWw8H.Ld.Zpe.6B/u/hF958aA.bJ6.78q4v1u9c.3W3G', // password is admin123
      email: 'shivaartist962@gmail.com',
      role: 'admin',
      full_name: 'Shivam Jethure',
      title: 'B.Tech Student & Aspiring Full-Stack Developer',
      bio: 'A Second Year B.Tech student passionate about technology, software development, and modern digital experiences. I enjoy building responsive, user-friendly applications with real-world functionality.',
      location: 'Maharashtra, India',
      profile_image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394A3B8"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
    }
  ],
  skills: [
    { id: 1, name: 'Java Programming', category: 'Backend', level: 85, icon: 'Cpu', is_featured: 1 },
    { id: 2, name: 'Python Development', category: 'Backend', level: 80, icon: 'Terminal', is_featured: 1 },
    { id: 3, name: 'MySQL Database', category: 'Backend', level: 88, icon: 'Database', is_featured: 1 },
    { id: 4, name: 'Prompt Engineering', category: 'Tools', level: 92, icon: 'Sparkles', is_featured: 1 },
    { id: 5, name: 'Vibe Coding & AI workflows', category: 'Tools', level: 95, icon: 'Zap', is_featured: 1 },
    { id: 6, name: 'Full-Stack Web Dev', category: 'Frontend', level: 82, icon: 'Atom', is_featured: 1 },
    { id: 7, name: 'UI/UX Prototyping', category: 'UI/UX', level: 80, icon: 'Figma', is_featured: 1 },
    { id: 8, name: 'SaaS Development', category: 'Frontend', level: 75, icon: 'Layers', is_featured: 0 },
    { id: 9, name: 'ERP Systems', category: 'Backend', level: 70, icon: 'Cpu', is_featured: 0 },
    { id: 10, name: 'AI Tools & Automation', category: 'Tools', level: 88, icon: 'Cloud', is_featured: 1 },
    { id: 11, name: 'Responsive Web Design', category: 'Frontend', level: 90, icon: 'Wind', is_featured: 1 }
  ],
  projects: [
    {
      id: 1,
      title: 'Smart ERP Dashboard UI',
      description: 'A modern visual dashboard for Enterprise Resource Planning, focused on ease of navigation and clean data reporting.',
      long_description: 'An interactive ERP user interface designed with React and Tailwind CSS. It highlights modular widgets for sales tracking, student administration logs, inventory metrics, and glowing glassmorphism statistics cards.',
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      live_url: '#',
      github_url: '#',
      tags: 'React,Tailwind CSS,Framer Motion',
      is_featured: 1
    },
    {
      id: 2,
      title: 'AI-Powered Automated Emailer',
      description: 'A Python utility utilizing Prompt Engineering to draft customized emails based on database values.',
      long_description: 'A smart command-line tool built using Python, MySQL, and OpenAI APIs. It reads contact rows, drafts context-aware messages based on prompt templates, and sends batches using secure SMTP protocols.',
      image_url: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80',
      live_url: '#',
      github_url: '#',
      tags: 'Python,MySQL,Prompt Engineering',
      is_featured: 1
    },
    {
      id: 3,
      title: 'Java Database Manager',
      description: 'A local desktop application built in Java to manage student records and database connections dynamically.',
      long_description: 'A full-featured Swing record catalog system. It utilizes JDBC driver connections to execute SQL procedures, format record lists, search datasets, and generate text reports.',
      image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      live_url: '#',
      github_url: '#',
      tags: 'Java,MySQL,JDBC',
      is_featured: 0
    }
  ],
  experiences: [
    {
      id: 1,
      company: 'G H Raisoni College of Engineering and Management',
      role: 'Second Year B.Tech Student',
      location: 'Pune, India',
      type: 'Full-time',
      description: 'Pursuing a Bachelor\'s Degree in engineering, maintaining strong academic foundations. Studied software development methodologies, database relations, and Object-Oriented programming.',
      start_date: 'Aug 2024',
      end_date: 'Present',
      is_current: 1
    },
    {
      id: 2,
      company: 'Academic Projects Portfolio',
      role: 'Lead Project Developer',
      location: 'Local / Remote',
      type: 'Academic',
      description: 'Designed and built multiple hands-on projects including the Smart ERP Dashboard UI (React/Tailwind), AI-Powered Automated Emailer (Python/MySQL), and Java Database Manager (Swing/JDBC).',
      start_date: 'Sep 2024',
      end_date: 'Ongoing',
      is_current: 0
    }
  ],
  certifications: [
    { id: 1, name: 'B.Tech Engineering Candidate', issuer: 'GHRCEM Pune', issue_date: '2024-Present', credential_url: '#' }
  ],
  resumes: [
    {
      id: 1,
      name: 'Shivam Jethure Master Resume',
      is_master: 1,
      content: {
        personal: {
          name: "Shivam Jethure",
          email: "shivaartist962@gmail.com",
          phone: "+91 91751 41111",
          location: "Maharashtra, India",
          website: "https://shivamjethure.dev",
          github: "github.com/shivamjethure",
          summary: "A Second Year B.Tech student passionate about technology, software development, and modern digital experiences. Dedicated to building responsive, user-friendly, and visually modern applications with real-world functionality. Currently learning Java, MySQL, Python, Prompt Engineering, and Vibe Coding."
        },
        education: [
          {
            institution: "G H Raisoni College of Engineering and Management",
            degree: "Bachelor of Technology (B.Tech) - Engineering",
            year: "2024 - Present"
          }
        ],
        skills: {
          "Backend": ["Java", "Python", "MySQL", "Database Management"],
          "Frontend": ["Full-Stack Web Dev", "Responsive Web Design", "HTML", "CSS"],
          "Tools": ["Prompt Engineering", "Vibe Coding & AI workflows", "AI Tools & Automation", "Figma"]
        },
        projects: [
          {
            title: "Smart ERP Dashboard UI",
            tech: "React, Tailwind CSS, Framer Motion",
            description: "Designed a modern visual dashboard mockup for Enterprise Resource Planning, highlighting student tracking logs and metrics."
          },
          {
            title: "AI-Powered Automated Emailer",
            tech: "Python, MySQL, Prompt Engineering",
            description: "Built a Python automation script that drafts custom context-aware emails based on database values and templates."
          }
        ],
        experience: [
          {
            company: "G H Raisoni College of Engineering and Management",
            role: "Second Year B.Tech Student",
            period: "2024 - Present",
            bullets: [
              "Pursuing a Bachelor\'s Degree in engineering, maintaining strong academic foundations.",
              "Studied software development methodologies, database relations, and Object-Oriented programming.",
              "Explored innovative technologies, custom prompts, and AI-assisted Vibe Coding workflows."
            ]
          },
          {
            company: "Academic Projects Portfolio",
            role: "Lead Project Developer",
            period: "Ongoing",
            bullets: [
              "Built 'Smart ERP Dashboard UI' using React, Tailwind CSS, and Framer Motion for responsive design.",
              "Developed 'AI-Powered Automated Emailer' using Python, MySQL, and Prompt Engineering templates.",
              "Created 'Java Database Manager' utilizing Swing and JDBC drivers to manage database connections."
            ]
          }
        ]
      }
    }
  ],
  generated_resumes: [],
  contact_messages: [],
  analytics: []
};

async function initDb() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'premium_portfolio',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test the connection
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database.');
    connection.release();
  } catch (error) {
    console.warn('\n⚠️ WARNING: Failed to connect to MySQL database.');
    console.warn(`Error Details: ${error.message}`);
    console.warn('Fallback: Running server with a local in-memory database configuration.\n');
    isMock = true;
    pool = null;
  }
}

// Wrapper for SQL querying
async function query(sql, params = []) {
  if (isMock || !pool) {
    return handleMockQuery(sql, params);
  }
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Simple heuristic mock SQL parser for fallback mode
function handleMockQuery(sql, params) {
  const normalizedSql = sql.trim().toLowerCase();
  
  // SELECT USERS BY USERNAME
  if (normalizedSql.includes('select * from users where username =')) {
    const username = params[0];
    const user = mockDb.users.find(u => u.username === username);
    return user ? [user] : [];
  }

  // SELECT ALL USERS
  if (normalizedSql.includes('select * from users') && !normalizedSql.includes('where')) {
    return mockDb.users;
  }

  // UPDATE USER
  if (normalizedSql.includes('update users set')) {
    // Basic user updating simulation
    if (params.length > 0) {
      const user = mockDb.users[0];
      // Quick manual map for update parameters depending on context
      // Simplified mock update
      return { affectedRows: 1 };
    }
  }

  // SELECT PROJECTS
  if (normalizedSql.includes('select * from projects')) {
    return mockDb.projects;
  }

  // INSERT PROJECT
  if (normalizedSql.includes('insert into projects')) {
    const newProj = {
      id: mockDb.projects.length + 1,
      title: params[0],
      description: params[1],
      long_description: params[2],
      image_url: params[3],
      live_url: params[4],
      github_url: params[5],
      tags: params[6],
      is_featured: params[7] ? 1 : 0
    };
    mockDb.projects.push(newProj);
    return { insertId: newProj.id, affectedRows: 1 };
  }

  // DELETE PROJECT
  if (normalizedSql.includes('delete from projects where id =')) {
    const id = parseInt(params[0]);
    mockDb.projects = mockDb.projects.filter(p => p.id !== id);
    return { affectedRows: 1 };
  }

  // SELECT SKILLS
  if (normalizedSql.includes('select * from skills')) {
    return mockDb.skills;
  }

  // INSERT SKILL
  if (normalizedSql.includes('insert into skills')) {
    const newSkill = {
      id: mockDb.skills.length + 1,
      name: params[0],
      category: params[1],
      level: params[2],
      icon: params[3],
      is_featured: params[4] ? 1 : 0
    };
    mockDb.skills.push(newSkill);
    return { insertId: newSkill.id, affectedRows: 1 };
  }

  // SELECT EXPERIENCES
  if (normalizedSql.includes('select * from experiences')) {
    return mockDb.experiences;
  }

  // INSERT EXPERIENCE
  if (normalizedSql.includes('insert into experiences')) {
    const newExp = {
      id: mockDb.experiences.length + 1,
      company: params[0],
      role: params[1],
      location: params[2],
      type: params[3],
      description: params[4],
      start_date: params[5],
      end_date: params[6],
      is_current: params[7] ? 1 : 0
    };
    mockDb.experiences.push(newExp);
    return { insertId: newExp.id, affectedRows: 1 };
  }

  // SELECT CERTIFICATIONS
  if (normalizedSql.includes('select * from certifications')) {
    return mockDb.certifications;
  }

  // SELECT RESUMES
  if (normalizedSql.includes('select * from resumes')) {
    return mockDb.resumes;
  }

  // SELECT GENERATED RESUMES
  if (normalizedSql.includes('select * from generated_resumes')) {
    return mockDb.generated_resumes;
  }

  // INSERT GENERATED RESUME
  if (normalizedSql.includes('insert into generated_resumes')) {
    const newGen = {
      id: mockDb.generated_resumes.length + 1,
      job_title: params[0],
      company_name: params[1],
      template_style: params[2],
      optimized_content: JSON.parse(params[3]),
      pdf_filename: params[4],
      created_at: new Date()
    };
    mockDb.generated_resumes.push(newGen);
    return { insertId: newGen.id, affectedRows: 1 };
  }

  // SELECT ANALYTICS
  if (normalizedSql.includes('select * from analytics')) {
    return mockDb.analytics;
  }

  // INSERT ANALYTICS
  if (normalizedSql.includes('insert into analytics')) {
    mockDb.analytics.push({
      id: mockDb.analytics.length + 1,
      event_type: params[0],
      event_target: params[1],
      visitor_ip: params[2],
      referrer: params[3],
      created_at: new Date()
    });
    return { affectedRows: 1 };
  }

  // SELECT CONTACT MESSAGES
  if (normalizedSql.includes('select * from contact_messages')) {
    return mockDb.contact_messages;
  }

  // INSERT CONTACT MESSAGE
  if (normalizedSql.includes('insert into contact_messages')) {
    const newMsg = {
      id: mockDb.contact_messages.length + 1,
      name: params[0],
      email: params[1],
      subject: params[2],
      message: params[3],
      is_read: 0,
      created_at: new Date()
    };
    mockDb.contact_messages.push(newMsg);
    return { insertId: newMsg.id, affectedRows: 1 };
  }

  // UPDATE CONTACT MESSAGE (MARK READ)
  if (normalizedSql.includes('update contact_messages set is_read =')) {
    const id = parseInt(params[1]);
    const msg = mockDb.contact_messages.find(m => m.id === id);
    if (msg) msg.is_read = params[0] ? 1 : 0;
    return { affectedRows: 1 };
  }

  return [];
}

// Initialise DB pool
initDb();

module.exports = {
  query,
  execute: query,
  isMock: () => isMock
};
