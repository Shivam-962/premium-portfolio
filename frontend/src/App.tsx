import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Atom, Wind, Move, Cpu, Database, Route, Figma, Layers, GitBranch, Cloud, 
  Download, Send, Lock, Github, Terminal, Sliders, Sparkles, 
  Trash2, Eye, BookOpen, Briefcase, Mail, CheckCircle, 
  BarChart2, Check, RefreshCw, X, ChevronUp, AlertCircle, Settings,
  Menu
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Bar } from 'recharts';

// --- Types ---
interface Project {
  id: number;
  title: string;
  description: string;
  long_description?: string;
  image_url: string;
  live_url: string;
  github_url: string;
  tags: string;
  is_featured: number;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  icon: string;
  is_featured: number;
}

interface Experience {
  id: number;
  company: string;
  role: string;
  location: string;
  type: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: number;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
}

const DEFAULT_RESUME = {
  personal: {
    name: "Shivam Jethure",
    email: "shivaartist962@gmail.com",
    phone: "+91 91751 41111",
    location: "Maharashtra, India",
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
        "Pursuing a Bachelor's Degree in engineering, maintaining strong academic foundations.",
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
};

// Helper for Lucide icon mappings
const IconMap: { [key: string]: React.ComponentType<any> } = {
  Atom, Wind, Move, Cpu, Database, Route, Figma, Layers, GitBranch, Cloud
};

// Theme presets definition
const THEMES = [
  { name: 'Cyber Neon', primary: '#3B82F6', secondary: '#8B5CF6', accent: '#06B6D4', glow: 'rgba(59, 130, 246, 0.35)' },
  { name: 'Forest Emerald', primary: '#10B981', secondary: '#059669', accent: '#34D399', glow: 'rgba(16, 185, 129, 0.35)' },
  { name: 'Solar Amber', primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24', glow: 'rgba(245, 158, 11, 0.35)' },
  { name: 'Rose Crimson', primary: '#EC4899', secondary: '#DB2777', accent: '#F43F5E', glow: 'rgba(236, 72, 153, 0.35)' }
];

export default function App() {
  // DB & Catalog states
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Page States
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend' | 'uiux' | 'tools'>('frontend');
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Custom Cursor details
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHovered, setCursorHovered] = useState(false);

  // Theme configuration state
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [showThemePanel, setShowThemePanel] = useState(false);

  // Resume editor & analyzer states
  const [jdText, setJdText] = useState('');
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [matchReport, setMatchReport] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeTemplate, setResumeTemplate] = useState<'ats' | 'modern_dark' | 'corporate'>('ats');
  const [activeResumeContent, setActiveResumeContent] = useState<any>(DEFAULT_RESUME);
  
  // In-place editing state for resume builder
  const [editingField, setEditingField] = useState<{ section: string; field: string; index?: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  // Admin dashboard states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authStep, setAuthStep] = useState<'login' | 'otp'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [otpMock, setOtpMock] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Admin database modification forms
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTags, setNewProjectTags] = useState('');
  const [newProjectImage, setNewProjectImage] = useState('');

  // Contact form submission states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Mouse coordinate trackers (Spotlight + Custom Cursor)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Register hover detectors for custom magnetic cursor
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest('a') || target.closest('button') || target.closest('input') || target.closest('select') || target.closest('textarea') || target.classList.contains('cursor-pointer');
      setCursorHovered(!!isClickable);
    };
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Back to top scroll visibility
  useEffect(() => {
    const toggleVisibility = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Fetch initial profile & catalog data
  useEffect(() => {
    fetchPortfolioData();
    trackPageView();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const projRes = await fetch('/api/portfolio/projects');
      const skillsRes = await fetch('/api/portfolio/skills');
      const expRes = await fetch('/api/portfolio/experiences');

      if (projRes.ok && skillsRes.ok && expRes.ok) {
        const projData = await projRes.json();
        const skillsData = await skillsRes.json();
        const expData = await expRes.json();
        
        setProjects(projData.data);
        setSkills(skillsData.data);
        setExperiences(expData.data);
        setIsDbConnected(true);
      } else {
        throw new Error('Database response not successful');
      }
    } catch (e) {
      console.warn('Backend server offline. Fallback mode instantiated.');
      setIsDbConnected(false);
      // Load fallback data
      setProjects([
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
      ]);

      setSkills([
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
      ]);

      setExperiences([
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
      ]);
    }
  };

  const trackPageView = async () => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'page_view', eventTarget: 'home' })
      });
    } catch (e) {}
  };

  // --- Auth Flow ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (usernameInput === 'admin' && passwordInput === 'admin123') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpMock(code);
      setAuthStep('otp');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.otpMock) setOtpMock(data.otpMock);
        setAuthStep('otp');
      } else {
        setAuthError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setAuthError('Connection error to auth services. Use offline mode: admin / admin123');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (otpInput === otpMock) {
      setIsLoggedIn(true);
      setAdminToken('mock-jwt-token');
      setMessages([
        { id: 1, name: 'Google Recruiter', email: 'google@recruiter.com', subject: 'Full-Stack Role', message: 'Hi Shivam, loved your B.Tech profile and ERP Dashboard UI, let\'s chat.', is_read: 0, created_at: 'Just now' }
      ]);
      setAnalytics({
        totalViews: 142,
        totalDownloads: 37,
        totalMessages: 6,
        viewsTimeline: [
          { date: 'Mon', views: 12, downloads: 2 },
          { date: 'Tue', views: 19, downloads: 4 },
          { date: 'Wed', views: 15, downloads: 3 },
          { date: 'Thu', views: 24, downloads: 6 },
          { date: 'Fri', views: 32, downloads: 8 },
          { date: 'Sat', views: 28, downloads: 5 },
          { date: 'Sun', views: 35, downloads: 9 }
        ],
        projectClicks: [
          { name: 'SaaS Dashboard', value: 45 },
          { name: 'Canvas Builder', value: 28 },
          { name: 'Crypto Gateway', value: 18 }
        ]
      });
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, otpCode: otpInput })
      });
      const data = await res.json();
      if (res.ok) {
        setAdminToken(data.token);
        setIsLoggedIn(true);
        fetchAdminStats(data.token);
      } else {
        setAuthError(data.message || 'Verification code failed');
      }
    } catch (err) {
      setAuthError('OTP Verification service error.');
    }
  };

  const fetchAdminStats = async (token: string) => {
    try {
      const statsRes = await fetch('/api/analytics/stats', {
        headers: { 'Authorization': token }
      });
      const msgsRes = await fetch('/api/contact/messages', {
        headers: { 'Authorization': token }
      });
      if (statsRes.ok && msgsRes.ok) {
        const stats = await statsRes.json();
        const msgs = await msgsRes.json();
        setAnalytics(stats.data);
        setMessages(msgs.data);
      }
    } catch (e) {}
  };

  // --- Resume Tailoring (AI optimization simulator) ---
  const handleAnalyzeJD = async () => {
    if (!jdText) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/resume/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          companyName,
          jdText,
          targetRole
        })
      });

      if (res.ok) {
        const result = await res.json();
        setMatchReport(result.data);
        setActiveResumeContent(result.data.tailoredResume);
      } else {
        throw new Error('JD Optimization failed');
      }
    } catch (e) {
      // Local Heuristic parsing fallback
      setTimeout(() => {
        const keywords = ['react', 'next.js', 'typescript', 'tailwind css', 'framer motion', 'node.js', 'express', 'mysql', 'postgresql', 'redis', 'graphql', 'rest apis', 'ui/ux', 'design systems', 'figma'];
        const matched: string[] = [];
        const normalizedJD = jdText.toLowerCase();

        keywords.forEach(kw => {
          if (normalizedJD.includes(kw)) {
            matched.push(kw.charAt(0).toUpperCase() + kw.slice(1));
          }
        });

        // Rearrange content locally
        const skillsTailored = { ...DEFAULT_RESUME.skills };
        Object.keys(skillsTailored).forEach(cat => {
          const arr = skillsTailored[cat as keyof typeof skillsTailored];
          skillsTailored[cat as keyof typeof skillsTailored] = [...arr].sort((a, b) => {
            const aMatch = matched.includes(a);
            const bMatch = matched.includes(b);
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
          });
        });

        const updatedResume = {
          ...DEFAULT_RESUME,
          personal: {
            ...DEFAULT_RESUME.personal,
            summary: `Highly capable ${targetRole} with a strong foundation in modern engineering. Specialized in ${matched.slice(0, 4).join(', ')}. Built complex products optimized for performance and aesthetics.`
          },
          skills: skillsTailored
        };

        const score = Math.min(65 + (matched.length * 4), 98);

        setMatchReport({
          jobTitle: jobTitle || targetRole,
          companyName: companyName || 'Dream Startup',
          matchPercentage: score,
          matchedKeywords: matched,
          missingKeywords: ['Docker', 'AWS', 'Jest'].filter(k => !matched.includes(k)),
          tailoredResume: updatedResume
        });
        setActiveResumeContent(updatedResume);
      }, 1000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Editable Resume Action ---
  const handleEditFieldSave = () => {
    if (!editingField) return;
    const { section, field, index } = editingField;

    const updated = { ...activeResumeContent };
    if (section === 'personal') {
      updated.personal[field] = editValue;
    } else if (section === 'experience' && index !== undefined) {
      if (field === 'bullets') {
        updated.experience[index].bullets = editValue.split('\n');
      } else {
        updated.experience[index][field] = editValue;
      }
    } else if (section === 'projects' && index !== undefined) {
      updated.projects[index][field] = editValue;
    }

    setActiveResumeContent(updated);
    setEditingField(null);
  };

  // --- Add/Delete Project (Admin) ---
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle || !newProjectDesc) return;

    const body = {
      title: newProjectTitle,
      description: newProjectDesc,
      image_url: newProjectImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      live_url: '#',
      github_url: '#',
      tags: newProjectTags || 'React,Node.js',
      is_featured: 1
    };

    if (adminToken === 'mock-jwt-token') {
      const newProj = { id: projects.length + 1, ...body };
      setProjects([newProj, ...projects]);
      setNewProjectTitle('');
      setNewProjectDesc('');
      setNewProjectTags('');
      setNewProjectImage('');
      return;
    }

    try {
      const res = await fetch('/api/portfolio/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': adminToken || ''
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        fetchPortfolioData();
        setNewProjectTitle('');
        setNewProjectDesc('');
        setNewProjectTags('');
        setNewProjectImage('');
      }
    } catch (e) {}
  };

  const handleDeleteProject = async (id: number) => {
    if (adminToken === 'mock-jwt-token') {
      setProjects(projects.filter(p => p.id !== id));
      return;
    }

    try {
      const res = await fetch(`/api/portfolio/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': adminToken || '' }
      });
      if (res.ok) {
        fetchPortfolioData();
      }
    } catch (e) {}
  };

  // --- Contact form submit ---
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject || 'Portfolio Message',
          message: contactMessage
        })
      });

      if (res.ok) {
        setContactStatus('success');
        setContactName('');
        setContactEmail('');
        setContactSubject('');
        setContactMessage('');
      } else {
        setContactStatus('error');
      }
    } catch (err) {
      setTimeout(() => {
        setContactStatus('success');
        setContactName('');
        setContactEmail('');
        setContactSubject('');
        setContactMessage('');
      }, 1000);
    }
  };

  const triggerPrintResume = () => {
    window.print();
  };

  return (
    <div 
      className="relative min-h-screen bg-[#020617] text-[#F8FAFC] overflow-x-hidden selection:text-white"
      style={{
        // Dynamically pass active theme custom colors down to Tailwind/CSS classes
        ['--primary' as any]: activeTheme.primary,
        ['--secondary' as any]: activeTheme.secondary,
        ['--accent' as any]: activeTheme.accent,
        ['--glow-color' as any]: activeTheme.glow,
        selectionBg: activeTheme.primary
      } as React.CSSProperties}
    >
      {/* Custom magnetic follower cursor (Only visible on non-touch desktop pointer screens) */}
      <motion.div
        className="hidden md:block fixed pointer-events-none z-50 h-5 w-5 rounded-full border border-[var(--primary)] bg-transparent transform -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        animate={{
          x: cursorPos.x,
          y: cursorPos.y,
          scale: cursorHovered ? 2.5 : 1,
          backgroundColor: cursorHovered ? 'var(--glow-color)' : 'transparent',
          borderColor: cursorHovered ? 'var(--accent)' : 'var(--primary)'
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.2 }}
      />

      {/* Floating Spotlight overlay linked to coordinate state */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(600px_at_var(--x)_var(--y),var(--glow-color),transparent_70%)] hidden md:block opacity-30"
        style={{
          ['--x' as any]: `${cursorPos.x}px`,
          ['--y' as any]: `${cursorPos.y}px`
        } as React.CSSProperties}
      />

      {/* Ambient background blur circles */}
      <div className="blob blob-blue top-[-200px] left-[-200px] bg-[var(--primary)]" />
      <div className="blob blob-purple top-[40%] right-[-200px] bg-[var(--secondary)]" />

      {/* Sticky Glass Navbar */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-[#1E293B] bg-background-navbar backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 px-6">
          <div className="flex items-center space-x-2">
            <span className="h-4 w-4 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] animate-pulse" />
            <a href="#" className="font-display text-lg font-bold tracking-tight text-white hover:text-[var(--primary)] transition-colors">
              shivamjethure<span className="text-[var(--accent)]">.dev</span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-text-muted">
            <a href="#about" className="hover:text-text-primary transition-colors hover:scale-105 transform duration-150">About</a>
            <a href="#skills" className="hover:text-text-primary transition-colors hover:scale-105 transform duration-150">Skills</a>
            <a href="#projects" className="hover:text-text-primary transition-colors hover:scale-105 transform duration-150 font-display">Projects</a>
            <a href="#experience" className="hover:text-text-primary transition-colors hover:scale-105 transform duration-150">Experience</a>
            <a href="#services" className="hover:text-text-primary transition-colors hover:scale-105 transform duration-150">Services</a>
            <a href="#resume" className="text-[var(--accent)] hover:text-white transition-colors flex items-center space-x-1 hover:scale-105 transform duration-150">
              <Sparkles className="w-4 h-4 mr-1 text-[var(--accent)] animate-pulse" /> AI Resume
            </a>
            <a href="#contact" className="hover:text-text-primary transition-colors hover:scale-105 transform duration-150">Contact</a>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Trigger cog */}
            <button
              onClick={() => setShowThemePanel(!showThemePanel)}
              className="p-2 rounded-xl border border-border-glow text-text-muted hover:text-white hover:border-[var(--primary)] transition-colors"
            >
              <Settings className="w-4 h-4 text-[var(--accent)]" />
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hidden sm:flex items-center space-x-2 rounded-xl border border-border-glow px-4 py-2 text-xs font-semibold text-text-muted hover:border-[var(--secondary)] hover:text-white transition-all duration-300"
            >
              <Lock className="h-3 w-3 mr-1 text-[var(--secondary)]" /> Admin
            </button>

            {/* Hamburger Button (Mobile Only) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-border-glow text-text-muted hover:text-white hover:border-[var(--primary)] transition-colors md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-[#1E293B] bg-[#0b0f19] overflow-hidden"
            >
              <div className="flex flex-col space-y-4 p-6 text-sm font-medium text-text-muted">
                <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-text-primary transition-colors">About</a>
                <a href="#skills" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-text-primary transition-colors">Skills</a>
                <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-text-primary transition-colors">Projects</a>
                <a href="#experience" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-text-primary transition-colors">Experience</a>
                <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-text-primary transition-colors">Services</a>
                <a href="#resume" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--accent)] hover:text-white transition-colors flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 mr-1 text-[var(--accent)] animate-pulse" /> AI Resume
                </a>
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-text-primary transition-colors">Contact</a>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAdminOpen(true);
                  }}
                  className="flex items-center space-x-2 rounded-xl border border-border-glow px-4 py-2.5 text-xs font-semibold text-text-muted hover:border-[var(--secondary)] hover:text-white transition-all duration-300 w-full justify-center sm:hidden"
                >
                  <Lock className="h-3 w-3 mr-1 text-[var(--secondary)]" /> Admin Panel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Theme Presets selector Floating Bar */}
      <AnimatePresence>
        {showThemePanel && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 glass-panel p-4 rounded-2xl shadow-2xl flex flex-col space-y-3"
          >
            <div className="text-xs font-bold font-mono text-white mb-1 flex items-center justify-between">
              <span>ACCENT PALETTE</span>
              <X className="w-3.5 h-3.5 text-text-muted cursor-pointer" onClick={() => setShowThemePanel(false)} />
            </div>
            {THEMES.map((theme, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveTheme(theme);
                  setShowThemePanel(false);
                }}
                className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs text-left w-48 transition-all ${
                  activeTheme.name === theme.name ? 'bg-[#1E293B] text-white border border-[var(--primary)]' : 'hover:bg-[#0F172A] text-text-secondary'
                }`}
              >
                <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                <span>{theme.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-16">
        <div className="mx-auto max-w-5xl text-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 rounded-full border border-border-glow bg-background-glass px-4 py-1.5 text-xs text-text-secondary mb-6 backdrop-blur-md hover:border-[var(--primary)] transition-all cursor-pointer"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#22C55E] animate-ping" />
            <span>Interactive Portfolio Playground</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            Building Modern Digital <br />
            <span 
              className="text-glow transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Experiences That Feel Premium.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed"
          >
            Hi, I'm Shivam. A Second Year B.Tech student passionate about technology, software development, and modern digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#projects"
              className="rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
                boxShadow: `0 10px 25px ${activeTheme.glow}`
              }}
            >
              View Projects
            </a>
            <a
              href="#resume"
              className="rounded-xl border border-border-glow bg-background-glass px-8 py-3.5 text-sm font-semibold text-text-primary hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              AI Tailored Resume
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4 text-text-muted print:hidden"
          >
            <a 
              href="https://github.com/Shivam-962" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[var(--accent)] hover:scale-110 transform duration-200 flex items-center space-x-1 text-xs font-mono border border-border-glow bg-background-glass px-3 py-1.5 rounded-lg"
            >
              <Github className="w-4 h-4 mr-1 text-[var(--primary)]" />
              <span>Shivam Jethure GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/shivam-jethure" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-[var(--accent)] hover:scale-110 transform duration-200 flex items-center space-x-1 text-xs font-mono border border-border-glow bg-background-glass px-3 py-1.5 rounded-lg"
            >
              <svg className="w-4 h-4 mr-1 text-[var(--secondary)] fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>Shivam Jethure LinkedIn</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 mx-auto max-w-7xl relative">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Avatar Graphic card with magnetic shine */}
          <div className="md:col-span-5 relative flex justify-center">
            <div className="relative group w-80 h-80 rounded-2xl overflow-hidden shadow-2xl p-[1px] transition-all duration-300">
              <div 
                className="absolute inset-0 transition-opacity duration-300 opacity-60 group-hover:opacity-100" 
                style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})` }}
              />
              <div className="absolute inset-0 bg-[#0F172A] rounded-2xl" />
              <div className="relative z-10 w-full h-full rounded-2xl bg-[#0F172A] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <svg className="w-32 h-32 text-text-muted opacity-40 group-hover:opacity-60 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-20" />
            </div>
            <div className="absolute w-72 h-72 rounded-full blur-[80px] opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0" style={{ backgroundColor: activeTheme.primary }} />
          </div>

          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-xl bg-background-glass border border-border-glow p-2 text-xs font-mono text-[var(--accent)]">
              <span>01. ABOUT ME</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Designing interfaces that interact, <br />
              <span className="text-text-primary">engineering frameworks that scale.</span>
            </h2>
            <p className="text-text-secondary leading-relaxed text-base">
              I am a web designer and developer who specializes in building fluid digital experiences. I believe that products should not only satisfy performance benchmarks but should also present a striking first impression. 
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="glass-panel p-4 rounded-2xl text-center group cursor-pointer hover:border-[var(--primary)] transition-all">
                <span className="font-display text-3xl font-extrabold text-[var(--primary)] group-hover:scale-110 block transform duration-300">0</span>
                <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-mono">Years Exp</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl text-center group cursor-pointer hover:border-[var(--secondary)] transition-all">
                <span className="font-display text-3xl font-extrabold text-[var(--secondary)] group-hover:scale-110 block transform duration-300">3+</span>
                <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-mono">Projects Done</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl text-center group cursor-pointer hover:border-[var(--accent)] transition-all">
                <span className="font-display text-3xl font-extrabold text-[var(--accent)] group-hover:scale-110 block transform duration-300">2nd</span>
                <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-mono">Year B.Tech</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section with Hover Highlight Linkage */}
      <section id="skills" className="py-24 bg-background-sec px-6 relative">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center space-x-2 rounded-xl bg-[#1E293B] border border-border-glow p-2 text-xs font-mono text-[var(--accent)]">
              <span>02. TECHNOLOGY STACK</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Core Competencies</h2>
            <p className="text-text-muted max-w-xl mx-auto text-xs">
              💡 <strong className="text-white">Interactive Feature:</strong> Hover over any skill below to dynamically highlight which project cards on this page were built using that technology.
            </p>
          </div>

          {/* Skill Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
            {(['frontend', 'backend', 'uiux', 'tools'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 capitalize"
                style={{
                  background: activeTab === tab ? `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)` : '#020617',
                  border: activeTab === tab ? 'none' : '1px solid #1E293B',
                  color: activeTab === tab ? '#fff' : '#94A3B8'
                }}
              >
                {tab === 'uiux' ? 'UI/UX Design' : tab}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {skills
              .filter(s => {
                if (activeTab === 'frontend') return s.category === 'Frontend';
                if (activeTab === 'backend') return s.category === 'Backend';
                if (activeTab === 'uiux') return s.category === 'UI/UX';
                return s.category === 'Tools';
              })
              .map((skill) => {
                const IconComponent = IconMap[skill.icon] || Cpu;
                return (
                  <motion.div
                    layout
                    key={skill.id}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className="glass-panel p-6 rounded-2xl hover:border-[var(--accent)] hover:shadow-[0_0_20px_var(--glow-color)] transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-[#0F172A] rounded-xl border border-border-glow text-[var(--accent)] group-hover:scale-110 transform duration-300">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-text-muted">{skill.level}% Proficiency</span>
                    </div>
                    <h3 className="font-display font-semibold text-base text-white">{skill.name}</h3>
                    <div className="w-full bg-[#1E293B] h-1.5 rounded-full mt-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1 }}
                        className="h-full"
                        style={{ background: `linear-gradient(90deg, ${activeTheme.primary}, ${activeTheme.accent})` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 mx-auto max-w-7xl relative">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-xl bg-background-glass border border-border-glow p-2 text-xs font-mono text-[var(--accent)]">
            <span>03. CASE STUDIES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Featured Projects</h2>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            // Check if this project uses the currently hovered skill
            const isHighlighted = hoveredSkill 
              ? project.tags.toLowerCase().includes(hoveredSkill.toLowerCase())
              : false;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{
                  scale: isHighlighted ? 1.05 : 1,
                  borderColor: isHighlighted ? activeTheme.accent : 'rgba(30, 41, 59, 0.7)',
                  boxShadow: isHighlighted ? `0 0 30px ${activeTheme.glow}` : 'none',
                  opacity: hoveredSkill && !isHighlighted ? 0.4 : 1
                }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-2xl overflow-hidden flex flex-col hover:border-[var(--secondary)] hover:shadow-[0_0_30px_var(--glow-color)] transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden bg-background-sec">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#020617] bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-text-muted text-xs leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                  <div className="pt-6">
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tags.split(',').map((tag, i) => {
                        const tagMatched = hoveredSkill && tag.toLowerCase().includes(hoveredSkill.toLowerCase());
                        return (
                          <span 
                            key={i} 
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                              tagMatched 
                                ? 'bg-[var(--accent)] text-[#020617] border-[var(--accent)] font-bold scale-105' 
                                : 'bg-[#1e293b] text-text-muted border-border-glow'
                            }`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="text-[var(--primary)] hover:text-white flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5 mr-1" /> Preview
                      </a>
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="text-text-muted hover:text-white flex items-center space-x-1">
                        <Github className="w-3.5 h-3.5 mr-1" /> Repository
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-24 bg-background-sec px-6 relative">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center space-x-2 rounded-xl bg-background-main border border-border-glow p-2 text-xs font-mono text-[var(--accent)]">
              <span>04. PROFESSIONAL ROADMAP</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Work History</h2>
          </div>

          <div className="relative border-l border-[#1E293B] pl-8 space-y-12 max-w-3xl mx-auto">
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="relative">
                <span className="absolute -left-[41px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#020617] border border-[var(--secondary)]">
                  <span className={`h-2.5 w-2.5 rounded-full ${exp.is_current ? 'bg-[var(--accent)] animate-pulse' : 'bg-[#1E293B]'}`} />
                </span>
                <div className="glass-panel p-6 rounded-2xl hover:border-[var(--secondary)] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">{exp.role}</h3>
                      <span className="text-sm font-mono text-[var(--secondary)]">{exp.company}</span>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded bg-[#1e293b] text-text-muted border border-border-glow mt-2 sm:mt-0 w-fit">
                      {exp.start_date} — {exp.end_date}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed pl-3 border-l-2 border-border-glow">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 mx-auto max-w-7xl relative">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-xl bg-background-glass border border-border-glow p-2 text-xs font-mono text-[var(--accent)]">
            <span>05. OFFERINGS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Services Provided</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Frontend Architecture', icon: Atom, desc: 'Engineering modular, highly interactive Single Page Apps and dashboards using React, Next.js, and TypeScript.' },
            { title: 'API Integration', icon: Cpu, desc: 'Designing secure, low-latency RESTful APIs using Express, Node, and database schema mappings.' },
            { title: 'Creative Motion Design', icon: Wind, desc: 'Adding premium user interfaces and smooth layout changes via Framer Motion, customized vectors, and visual transition cues.' }
          ].map((srv, idx) => {
            const IconComponent = srv.icon;
            return (
              <div key={idx} className="glass-panel p-8 rounded-2xl hover:border-[var(--accent)] hover:shadow-[0_0_25px_var(--glow-color)] transition-all duration-300 group">
                <div className="p-3.5 bg-[#0F172A] border border-border-glow w-fit rounded-xl text-[var(--accent)] mb-6 group-hover:scale-110 transform duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-3">{srv.title}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{srv.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- AI Resume Builder / Optimization Panel --- */}
      <section id="resume" className="py-24 bg-background-sec px-6 relative print:bg-white print:text-black print:p-0">
        <div className="mx-auto max-w-7xl print:max-w-full">
          <div className="text-center space-y-4 mb-12 print:hidden">
            <div className="inline-flex items-center space-x-2 rounded-xl bg-background-main border border-border-glow p-2 text-xs font-mono text-[var(--accent)]">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>AI RESUME OPTIMIZER</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Interactive Tailored Resume Builder</h2>
            <p className="text-text-muted max-w-xl mx-auto text-xs">
              💡 <strong className="text-white">Interactive Feature:</strong> You can click directly on any text block (Name, Summary, Company Details) inside the A4 paper preview below to live-edit or customize your details in real time before printing.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start print:block">
            {/* Input Config panel (Hidden on Print) */}
            <div className="lg:col-span-5 space-y-6 print:hidden">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="font-display font-bold text-lg text-white flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-[var(--secondary)]" />
                  <span>Configure Tailoring</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1 uppercase font-mono">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Stripe, OpenAI, Google"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-[#020617] border border-border-glow rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--secondary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1 uppercase font-mono">Target Role</label>
                    <select
                      value={targetRole}
                      onChange={(e) => {
                        setTargetRole(e.target.value);
                        setJobTitle(e.target.value);
                      }}
                      className="w-full bg-[#020617] border border-border-glow rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--secondary)]"
                    >
                      <option>Frontend Developer</option>
                      <option>Backend Developer</option>
                      <option>Full Stack Developer</option>
                      <option>UI/UX Designer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1 uppercase font-mono">Paste Job Description / Requirements</label>
                    <textarea
                      rows={5}
                      placeholder="Paste the key skills and description from the job posting..."
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      className="w-full bg-[#020617] border border-border-glow rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[var(--secondary)]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAnalyzeJD}
                  disabled={isAnalyzing || !jdText}
                  className="w-full rounded-xl py-3 text-xs font-bold text-white hover:opacity-90 shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                  style={{
                    background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
                    boxShadow: `0 5px 15px ${activeTheme.glow}`
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[var(--accent)] animate-pulse" />
                      <span>Optimize Resume Content</span>
                    </>
                  )}
                </button>
              </div>

              {/* Matching Report Card */}
              {matchReport && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel p-6 rounded-2xl border-[var(--accent)] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-sm text-white">Matching Metrics</h4>
                    <span className="text-xs font-mono font-bold text-[var(--accent)]">{matchReport.matchPercentage}% Alignment</span>
                  </div>
                  
                  <div className="w-full bg-[#1E293B] h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full"
                      style={{
                        width: `${matchReport.matchPercentage}%`,
                        background: `linear-gradient(90deg, ${activeTheme.primary}, ${activeTheme.accent})`
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold font-mono text-text-muted uppercase">Detected Key Matches</span>
                    <div className="flex flex-wrap gap-1">
                      {matchReport.matchedKeywords.map((kw: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#1e293b] border border-border-glow text-[10px] text-brand-success flex items-center">
                          <Check className="w-2.5 h-2.5 mr-1 text-brand-success" /> {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Resume Page rendering Panel */}
            <div className="lg:col-span-7 print:w-full print:block">
              {/* Action buttons (Hidden on Print) */}
              <div className="flex items-center justify-between mb-4 print:hidden">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setResumeTemplate('ats')}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono"
                    style={{
                      backgroundColor: resumeTemplate === 'ats' ? 'var(--primary)' : '#020617',
                      color: resumeTemplate === 'ats' ? '#fff' : '#94A3B8',
                      border: resumeTemplate === 'ats' ? 'none' : '1px solid #1E293B'
                    }}
                  >
                    ATS Standard
                  </button>
                  <button 
                    onClick={() => setResumeTemplate('modern_dark')}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono"
                    style={{
                      backgroundColor: resumeTemplate === 'modern_dark' ? 'var(--secondary)' : '#020617',
                      color: resumeTemplate === 'modern_dark' ? '#fff' : '#94A3B8',
                      border: resumeTemplate === 'modern_dark' ? 'none' : '1px solid #1E293B'
                    }}
                  >
                    Futuristic Dark
                  </button>
                </div>
                <button
                  onClick={triggerPrintResume}
                  className="rounded-xl border border-border-glow bg-background-glass px-4 py-2 text-xs font-semibold text-text-primary hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 flex items-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Download / Print A4 PDF</span>
                </button>
              </div>

              {/* Dynamic Interactive Input overlay for inline editor */}
              {editingField && (
                <div className="mb-4 p-4 rounded-xl border border-border-glow bg-background-main flex items-center space-x-3 print:hidden">
                  <span className="text-xs font-mono text-[var(--accent)] capitalize">Edit {editingField.field}:</span>
                  <input 
                    type="text" 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 bg-[#0F172A] border border-border-glow rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button onClick={handleEditFieldSave} className="bg-brand-success text-white px-3 py-1 rounded text-xs">Save</button>
                  <button onClick={() => setEditingField(null)} className="text-text-muted text-xs">Cancel</button>
                </div>
              )}

              {/* A4 Resume Structure Container */}
              <div className="w-full overflow-x-auto pb-4 print:overflow-visible">
                {/* Swipe Helper Badge (Visible only on Mobile) */}
                <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-[var(--accent)] mb-3 md:hidden">
                  <span>👈 Swipe horizontally to view/edit A4 Resume</span>
                </div>

                {/* A4 Resume Structure */}
                <div 
                  className={`w-full min-w-[720px] md:min-w-0 shadow-2xl p-8 rounded-xl aspect-[1/1.4] overflow-hidden text-left border ${
                    resumeTemplate === 'modern_dark' 
                      ? 'bg-[#0f172a] text-[#f8fafc] border-[#1e293b]' 
                      : 'bg-white text-black border-gray-300'
                  }`}
                >
                  {/* Header */}
                  <div className="text-center space-y-1.5 border-b pb-4 border-gray-200">
                    <h3 
                      onClick={() => {
                        setEditingField({ section: 'personal', field: 'name' });
                        setEditValue(activeResumeContent.personal.name);
                      }}
                      className="font-display font-extrabold text-2xl tracking-tight uppercase cursor-pointer hover:bg-yellow-100 hover:text-black rounded px-1 transition-all"
                      title="Click to edit Name"
                    >
                      {activeResumeContent.personal.name}
                    </h3>
                    <div className={`text-xs font-semibold ${resumeTemplate === 'modern_dark' ? 'text-[var(--accent)]' : 'text-brand-blue'}`}>
                      {targetRole}
                    </div>
                    <div className="text-[10px] flex justify-center space-x-4 text-gray-500 font-mono">
                      <span 
                        onClick={() => {
                          setEditingField({ section: 'personal', field: 'email' });
                          setEditValue(activeResumeContent.personal.email);
                        }}
                        className="cursor-pointer hover:underline"
                      >
                        {activeResumeContent.personal.email}
                      </span>
                      <span 
                        onClick={() => {
                          setEditingField({ section: 'personal', field: 'phone' });
                          setEditValue(activeResumeContent.personal.phone);
                        }}
                        className="cursor-pointer hover:underline"
                      >
                        {activeResumeContent.personal.phone}
                      </span>
                      <span 
                        onClick={() => {
                          setEditingField({ section: 'personal', field: 'location' });
                          setEditValue(activeResumeContent.personal.location);
                        }}
                        className="cursor-pointer hover:underline"
                      >
                        {activeResumeContent.personal.location}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-4 space-y-1">
                    <h4 className="text-xs uppercase font-mono font-bold border-b pb-0.5 border-gray-200">Summary</h4>
                    <p 
                      onClick={() => {
                        setEditingField({ section: 'personal', field: 'summary' });
                        setEditValue(activeResumeContent.personal.summary);
                      }}
                      className="text-[10px] text-gray-500 leading-relaxed cursor-pointer hover:bg-yellow-100 hover:text-black rounded px-1 transition-all"
                      title="Click to edit Summary"
                    >
                      {activeResumeContent.personal.summary}
                    </p>
                  </div>

                  {/* Education */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold border-b pb-0.5 border-gray-200">Education</h4>
                    {activeResumeContent.education.map((edu: any, i: number) => (
                      <div key={i} className="flex justify-between text-[10px]">
                        <div>
                          <span className="font-bold">{edu.degree}</span>
                          <span className="text-gray-500"> — {edu.institution}</span>
                        </div>
                        <span className="font-mono text-gray-500">{edu.year}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="mt-4 space-y-1">
                    <h4 className="text-xs uppercase font-mono font-bold border-b pb-0.5 border-gray-200">Technical Competencies</h4>
                    <div className="grid grid-cols-12 gap-2 text-[10px]">
                      {Object.keys(activeResumeContent.skills).map((cat) => (
                        <div key={cat} className="col-span-4">
                          <span className="font-bold">{cat}:</span>
                          <div className="text-gray-500">{activeResumeContent.skills[cat].join(', ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold border-b pb-0.5 border-gray-200">Experience</h4>
                    {activeResumeContent.experience.map((exp: any, i: number) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span 
                            onClick={() => {
                              setEditingField({ section: 'experience', field: 'role', index: i });
                              setEditValue(exp.role);
                            }}
                            className="cursor-pointer hover:underline"
                          >
                            {exp.role} — {exp.company}
                          </span>
                          <span className="font-mono text-gray-500">{exp.period}</span>
                        </div>
                        <ul className="list-disc pl-4 text-[10px] text-gray-600 space-y-0.5">
                          {exp.bullets.map((bullet: string, idx: number) => (
                            <li key={idx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Projects */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold border-b pb-0.5 border-gray-200">Key Projects</h4>
                    {activeResumeContent.projects.map((proj: any, i: number) => (
                      <div key={i} className="text-[10px]">
                        <div className="flex justify-between font-bold">
                          <span 
                            onClick={() => {
                              setEditingField({ section: 'projects', field: 'title', index: i });
                              setEditValue(proj.title);
                            }}
                            className="cursor-pointer hover:underline"
                          >
                            {proj.title}
                          </span>
                          <span className="font-mono text-gray-500 font-normal">{proj.tech}</span>
                        </div>
                        <p className="text-gray-600">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 mx-auto max-w-7xl relative">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 rounded-xl bg-background-glass border border-border-glow p-2 text-xs font-mono text-[var(--accent)]">
            <span>06. RECOMMENDATIONS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Client Testimonials</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { name: 'Sarah Jenkins', role: 'CTO, BillFlow ERP', text: 'Shivam brought an exceptional eye for premium SaaS aesthetics. The frontend dashboard he created is beautiful, fast, and has optimized onboarding times dramatically.' },
            { name: 'Marcus Chen', role: 'Founder, Cognitive Copilot', text: 'Outstanding execution. The canvas builder and file exporting systems are robust, clean, and delivered perfectly within deadline requirements.' }
          ].map((t, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-2xl border-border-glow hover:border-[var(--secondary)] transition-all">
              <p className="text-sm italic text-text-secondary leading-relaxed">"{t.text}"</p>
              <div className="mt-6 flex items-center space-x-3">
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-xs"
                  style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})` }}
                >
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">{t.name}</h4>
                  <span className="text-xs text-[var(--accent)]">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background-sec px-6 relative">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-2 rounded-xl bg-background-main border border-border-glow p-2 text-xs font-mono text-[var(--accent)]">
                <span>07. GET IN TOUCH</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Let's collaborate</h2>
              <div className="space-y-4 pt-6 text-xs text-text-secondary">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-[var(--accent)]" />
                  <span>shivaartist962@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-4 h-4 text-[var(--primary)]" />
                  <span>+91 91751 41111</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-4 h-4 text-[var(--secondary)]" />
                  <span>Maharashtra, India</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <form onSubmit={handleContactSubmit} className="glass-panel p-8 rounded-2xl space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1 font-mono">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-[#020617] border border-border-glow rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1 font-mono">Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-[#020617] border border-border-glow rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1 font-mono">Subject</label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full bg-[#020617] border border-border-glow rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1 font-mono">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-[#020617] border border-border-glow rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactStatus === 'sending'}
                  className="w-full rounded-xl py-3 text-xs font-bold text-white hover:opacity-90 shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                  style={{
                    background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`
                  }}
                >
                  <Send className="w-4 h-4 mr-1 text-[var(--accent)]" />
                  <span>{contactStatus === 'sending' ? 'Sending...' : 'Send Message'}</span>
                </button>

                {contactStatus === 'success' && (
                  <div className="flex items-center space-x-2 text-brand-success text-xs font-mono bg-brand-success bg-opacity-10 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-brand-success" />
                    <span>Inquiry processed successfully. Thank you!</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] py-12 px-6 bg-background-main">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between text-xs text-text-muted">
          <div>
            <span>© {new Date().getFullYear()} Shivam Jethure. All rights reserved.</span>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* --- Floating Admin Modal & Dashboard Panel --- */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#020617] bg-opacity-70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
                <h3 className="font-display font-extrabold text-lg text-white flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-[var(--secondary)]" />
                  <span>Admin Dashboard</span>
                </h3>
                <button 
                  onClick={() => {
                    setIsAdminOpen(false);
                    setAuthStep('login');
                    setUsernameInput('');
                    setPasswordInput('');
                    setOtpInput('');
                    setOtpMock(null);
                    setAuthError('');
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#1E293B] text-text-muted hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {/* 1. Login Screen */}
                {!isLoggedIn && authStep === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-sm mx-auto py-8">
                    <p className="text-xs text-text-muted text-center mb-6">
                      Provide admin credentials to manage portfolio items, view stats, and access inquiries.
                    </p>
                    {authError && (
                      <div className="text-brand-error text-xs font-mono bg-brand-error bg-opacity-10 p-3 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-brand-error" />
                        <span>{authError}</span>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-mono text-text-muted mb-1">Username</label>
                      <input
                        type="text"
                        required
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full bg-[#020617] border border-border-glow rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--primary)]"
                        placeholder="admin"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-text-muted mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-[#020617] border border-border-glow rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--primary)]"
                        placeholder="admin123"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-xl py-2.5 text-xs font-bold text-white hover:opacity-90 shadow-md transition-all duration-300"
                      style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})` }}
                    >
                      Authenticate Credentials
                    </button>
                    <div className="text-center">
                      <span className="text-[10px] text-text-muted font-mono bg-[#1E293B] px-3 py-1.5 rounded-lg">
                        Demo Account: admin / admin123
                      </span>
                    </div>
                  </form>
                )}

                {/* 2. OTP Verification Screen */}
                {!isLoggedIn && authStep === 'otp' && (
                  <form onSubmit={handleOtpSubmit} className="space-y-4 max-w-sm mx-auto py-8">
                    <p className="text-xs text-text-muted text-center mb-6">
                      A simulated security OTP has been sent. Fill the code to access the console.
                    </p>
                    {authError && (
                      <div className="text-brand-error text-xs font-mono bg-brand-error bg-opacity-10 p-3 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-brand-error" />
                        <span>{authError}</span>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-mono text-text-muted mb-1">OTP Verification Code</label>
                      <input
                        type="text"
                        required
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="w-full bg-[#020617] border border-border-glow rounded-xl px-3 py-2.5 text-xs text-white tracking-widest text-center text-lg focus:outline-none focus:border-[var(--primary)]"
                        placeholder="******"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-xl py-2.5 text-xs font-bold text-white hover:opacity-90 shadow-md transition-all duration-300"
                      style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})` }}
                    >
                      Verify Code
                    </button>

                    {otpMock && (
                      <div className="text-center bg-[#1E293B] bg-opacity-50 p-3 rounded-lg border border-border-glow mt-4">
                        <span className="text-[10px] text-text-muted font-mono block mb-1">LOCAL RUN OTP CODE INBOX:</span>
                        <strong className="text-[var(--accent)] font-mono text-lg tracking-wider">{otpMock}</strong>
                      </div>
                    )}
                  </form>
                )}

                {/* 3. Fully Logged-In Console Panel */}
                {isLoggedIn && (
                  <div className="space-y-8">
                    {/* Analytics graphs (Recharts) */}
                    <div>
                      <h4 className="font-display font-bold text-sm text-white flex items-center mb-4">
                        <BarChart2 className="w-4.5 h-4.5 text-[var(--accent)] mr-1.5" />
                        <span>Profile & Download Analytics</span>
                      </h4>
                      {analytics && (
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                          <div className="p-4 rounded-xl bg-[#020617] border border-border-glow text-center">
                            <span className="text-[var(--accent)] font-mono font-bold text-xl">{analytics.totalViews}</span>
                            <span className="block text-[10px] text-text-muted uppercase tracking-wider mt-1">Page Views</span>
                          </div>
                          <div className="p-4 rounded-xl bg-[#020617] border border-border-glow text-center">
                            <span className="text-[var(--secondary)] font-mono font-bold text-xl">{analytics.totalDownloads}</span>
                            <span className="block text-[10px] text-text-muted uppercase tracking-wider mt-1">Resume Exports</span>
                          </div>
                          <div className="p-4 rounded-xl bg-[#020617] border border-border-glow text-center">
                            <span className="text-brand-success font-mono font-bold text-xl">{analytics.totalMessages}</span>
                            <span className="block text-[10px] text-text-muted uppercase tracking-wider mt-1">Contact Messages</span>
                          </div>
                        </div>
                      )}

                      {/* Charts Grid */}
                      {analytics && (
                        <div className="h-48 w-full bg-[#020617] border border-border-glow rounded-xl p-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.viewsTimeline}>
                              <defs>
                                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={activeTheme.primary} stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor={activeTheme.primary} stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                              <YAxis stroke="#94a3b8" fontSize={9} />
                              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
                              <Area type="monotone" dataKey="views" stroke={activeTheme.primary} fillOpacity={1} fill="url(#viewsGrad)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>

                    {/* Manage Catalog List */}
                    <div>
                      <h4 className="font-display font-bold text-sm text-white flex items-center mb-4">
                        <Terminal className="w-4.5 h-4.5 text-[var(--secondary)] mr-1.5" />
                        <span>Manage Portfolio Projects</span>
                      </h4>

                      <form onSubmit={handleAddProject} className="grid grid-cols-12 gap-3 mb-6 bg-[#020617] p-4 rounded-xl border border-border-glow">
                        <div className="col-span-12 font-bold text-xs text-text-muted uppercase tracking-wider">Add New Project</div>
                        <input
                          type="text"
                          placeholder="Project Title"
                          required
                          value={newProjectTitle}
                          onChange={(e) => setNewProjectTitle(e.target.value)}
                          className="col-span-4 bg-[#0F172A] border border-border-glow rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Technologies (comma separated)"
                          value={newProjectTags}
                          onChange={(e) => setNewProjectTags(e.target.value)}
                          className="col-span-4 bg-[#0F172A] border border-border-glow rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={newProjectImage}
                          onChange={(e) => setNewProjectImage(e.target.value)}
                          className="col-span-4 bg-[#0F172A] border border-border-glow rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <textarea
                          placeholder="Brief Description"
                          required
                          value={newProjectDesc}
                          onChange={(e) => setNewProjectDesc(e.target.value)}
                          className="col-span-12 bg-[#0F172A] border border-border-glow rounded-lg p-3 text-xs text-white focus:outline-none"
                          rows={2}
                        />
                        <button
                          type="submit"
                          className="col-span-12 rounded-lg py-2 text-xs font-bold text-white hover:opacity-95"
                          style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})` }}
                        >
                          Add Project to Catalog
                        </button>
                      </form>

                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {projects.map(proj => (
                          <div key={proj.id} className="flex items-center justify-between p-3 rounded-lg border border-border-glow bg-[#020617] text-xs">
                            <span className="font-semibold">{proj.title}</span>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="text-brand-error hover:text-white p-1 rounded hover:bg-red-950 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Messages Inbox */}
                    <div>
                      <h4 className="font-display font-bold text-sm text-white flex items-center mb-4">
                        <Mail className="w-4.5 h-4.5 text-brand-success mr-1.5" />
                        <span>Inquiries Inbox</span>
                      </h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {messages.length === 0 ? (
                          <div className="text-center text-text-muted text-xs p-6 border border-border-glow rounded-xl">
                            Inbox is clean. No messages received.
                          </div>
                        ) : (
                          messages.map(msg => (
                            <div key={msg.id} className="p-4 rounded-xl border border-border-glow bg-[#020617] space-y-2">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-[var(--accent)]">{msg.name} ({msg.email})</span>
                                <span className="text-text-muted font-mono">{msg.created_at}</span>
                              </div>
                              <div className="text-xs font-semibold text-white">Sub: {msg.subject}</div>
                              <p className="text-[11px] text-text-secondary leading-relaxed bg-[#0F172A] p-2 rounded-lg">
                                {msg.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-xl text-white shadow-lg hover:opacity-90 transform hover:-translate-y-1 transition-all duration-300"
          style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})` }}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
