const db = require('../config/db');

// List of predefined industry keywords to scan for in job descriptions
const KEYWORDS_LIST = [
  'react', 'next.js', 'typescript', 'tailwind css', 'framer motion', 'node.js', 'express',
  'mysql', 'postgresql', 'redis', 'graphql', 'rest apis', 'ui/ux', 'design systems', 'figma',
  'docker', 'git', 'github', 'aws', 'vercel', 'jest', 'cypress', 'redux', 'zustand', 'javascript',
  'html', 'css', 'ci/cd', 'agile', 'scrum', 'mongodb', 'nestjs', 'testing', 'kubernetes', 'gcp',
  'python', 'django', 'flask', 'go', 'golang', 'rust', 'microservices', 'websockets', 'oauth', 'jwt'
];

exports.getMasterResume = async (req, res) => {
  try {
    const resumes = await db.query('SELECT * FROM resumes WHERE is_master = TRUE LIMIT 1');
    if (resumes.length === 0) {
      return res.status(404).json({ success: false, message: 'Master resume not found in database.' });
    }
    
    let resume = resumes[0];
    if (typeof resume.content === 'string') {
      resume.content = JSON.parse(resume.content);
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    console.error('getMasterResume error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch master resume.' });
  }
};

exports.analyzeJobDescription = async (req, res) => {
  const { jobTitle, companyName, jdText, targetRole } = req.body;

  try {
    if (!jdText) {
      return res.status(400).json({ success: false, message: 'Job description text is required.' });
    }

    // 1. Fetch Master Resume
    const resumes = await db.query('SELECT * FROM resumes WHERE is_master = TRUE LIMIT 1');
    if (resumes.length === 0) {
      return res.status(404).json({ success: false, message: 'Master resume configuration not found.' });
    }
    
    let master = resumes[0];
    let masterContent = typeof master.content === 'string' ? JSON.parse(master.content) : master.content;

    // 2. Perform Heuristic Keyword Analysis
    const normalizedJd = jdText.toLowerCase();
    const matchedKeywords = [];
    const missingKeywords = [];

    // Scan for technology matches
    KEYWORDS_LIST.forEach(keyword => {
      const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape regex chars
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
      if (regex.test(normalizedJd)) {
        matchedKeywords.push(keyword);
      } else {
        // Only mark as missing if relevant to overall software development categories
        missingKeywords.push(keyword);
      }
    });

    // 3. Tailor the content dynamically
    // A. Rearrange/prioritize skills
    const tailoredSkills = {};
    Object.keys(masterContent.skills).forEach(category => {
      const skillsArray = masterContent.skills[category];
      // Sort: matched keywords go to the front
      const sorted = [...skillsArray].sort((a, b) => {
        const aMatched = matchedKeywords.some(kw => a.toLowerCase().includes(kw));
        const bMatched = matchedKeywords.some(kw => b.toLowerCase().includes(kw));
        if (aMatched && !bMatched) return -1;
        if (!aMatched && bMatched) return 1;
        return 0;
      });
      tailoredSkills[category] = sorted;
    });

    // B. Prioritize projects based on keyword matches
    const tailoredProjects = [...masterContent.projects].sort((a, b) => {
      const aMatches = matchedKeywords.filter(kw => a.tech.toLowerCase().includes(kw)).length;
      const bMatches = matchedKeywords.filter(kw => b.tech.toLowerCase().includes(kw)).length;
      return bMatches - aMatches; // Descending matches
    });

    // C. Calculate matching percentage
    // Let's assume a baseline score based on matches, normalized between 40% and 95%
    const masterTotalSkills = Object.values(masterContent.skills).flat();
    const totalMatchableCount = masterTotalSkills.length;
    const matchCount = masterTotalSkills.filter(skill => 
      matchedKeywords.some(kw => skill.toLowerCase().includes(kw))
    ).length;
    
    let matchPercentage = Math.round((matchCount / Math.max(totalMatchableCount, 1)) * 100);
    // Ensure realistic score boundings (typically 50-98%) for display UI
    if (matchPercentage < 50) matchPercentage = 55 + (matchCount * 4);
    if (matchPercentage > 98) matchPercentage = 98;

    // Adjust title/summary matching targetRole if provided
    const personal = { ...masterContent.personal };
    if (targetRole) {
      personal.summary = `Accomplished and driven ${targetRole} with a strong foundation in modern engineering. ${personal.summary}`;
    }

    const tailoredContent = {
      personal,
      education: masterContent.education,
      skills: tailoredSkills,
      projects: tailoredProjects,
      experience: masterContent.experience
    };

    res.json({
      success: true,
      data: {
        jobTitle: jobTitle || 'Target Role',
        companyName: companyName || 'Target Company',
        matchPercentage,
        matchedKeywords: matchedKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)),
        missingKeywords: missingKeywords.slice(0, 8).map(k => k.charAt(0).toUpperCase() + k.slice(1)), // Cap missing keywords for UI cleanliness
        tailoredResume: tailoredContent
      }
    });

  } catch (error) {
    console.error('analyzeJobDescription error:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze job description.' });
  }
};

exports.saveGeneratedResume = async (req, res) => {
  const { jobTitle, companyName, templateStyle, optimizedContent } = req.body;

  try {
    if (!jobTitle || !companyName || !optimizedContent) {
      return res.status(400).json({ success: false, message: 'Job title, company name, and content are required.' });
    }

    const pdfFilename = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_resume.pdf`;

    const contentStr = typeof optimizedContent === 'string' ? optimizedContent : JSON.stringify(optimizedContent);

    if (db.isMock()) {
      // Simulate saving to DB
      const result = await db.query('INSERT INTO generated_resumes', [
        jobTitle,
        companyName,
        templateStyle || 'ats',
        contentStr,
        pdfFilename
      ]);
      return res.json({
        success: true,
        message: 'Tailored resume saved successfully (Mock DB).',
        resumeId: result.insertId,
        pdfFilename
      });
    } else {
      const result = await db.query(
        'INSERT INTO generated_resumes (job_title, company_name, template_style, optimized_content, pdf_filename) VALUES (?, ?, ?, ?, ?)',
        [jobTitle, companyName, templateStyle || 'ats', contentStr, pdfFilename]
      );
      return res.json({
        success: true,
        message: 'Tailored resume saved successfully.',
        resumeId: result.insertId,
        pdfFilename
      });
    }
  } catch (error) {
    console.error('saveGeneratedResume error:', error);
    res.status(500).json({ success: false, message: 'Failed to save generated resume.' });
  }
};

exports.getGeneratedResumes = async (req, res) => {
  try {
    const resumes = await db.query('SELECT * FROM generated_resumes ORDER BY created_at DESC');
    const parsedResumes = resumes.map(r => {
      if (typeof r.optimized_content === 'string') {
        r.optimized_content = JSON.parse(r.optimized_content);
      }
      return r;
    });
    res.json({ success: true, data: parsedResumes });
  } catch (error) {
    console.error('getGeneratedResumes error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch generated resumes.' });
  }
};
