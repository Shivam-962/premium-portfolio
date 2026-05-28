const db = require('../config/db');

// --- PROJECTS ---
exports.getProjects = async (req, res) => {
  try {
    const projects = await db.query('SELECT * FROM projects ORDER BY is_featured DESC, created_at DESC');
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('getProjects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects.' });
  }
};

exports.addProject = async (req, res) => {
  const { title, description, long_description, image_url, live_url, github_url, tags, is_featured } = req.body;
  try {
    if (!title || !description || !tags) {
      return res.status(400).json({ success: false, message: 'Title, description and tags are required.' });
    }
    const result = await db.query(
      'INSERT INTO projects (title, description, long_description, image_url, live_url, github_url, tags, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, long_description || '', image_url || '', live_url || '', github_url || '', tags, is_featured ? 1 : 0]
    );
    res.json({ success: true, message: 'Project added successfully.', projectId: result.insertId });
  } catch (error) {
    console.error('addProject error:', error);
    res.status(500).json({ success: false, message: 'Failed to add project.' });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, long_description, image_url, live_url, github_url, tags, is_featured } = req.body;
  try {
    if (db.isMock()) {
      const projects = await db.query('SELECT * FROM projects');
      const proj = projects.find(p => p.id === parseInt(id));
      if (proj) {
        if (title) proj.title = title;
        if (description) proj.description = description;
        if (long_description) proj.long_description = long_description;
        if (image_url) proj.image_url = image_url;
        if (live_url) proj.live_url = live_url;
        if (github_url) proj.github_url = github_url;
        if (tags) proj.tags = tags;
        proj.is_featured = is_featured ? 1 : 0;
      }
    } else {
      await db.query(
        'UPDATE projects SET title = ?, description = ?, long_description = ?, image_url = ?, live_url = ?, github_url = ?, tags = ?, is_featured = ? WHERE id = ?',
        [title, description, long_description, image_url, live_url, github_url, tags, is_featured ? 1 : 0, id]
      );
    }
    res.json({ success: true, message: 'Project updated successfully.' });
  } catch (error) {
    console.error('updateProject error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project.' });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('deleteProject error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
};

// --- SKILLS ---
exports.getSkills = async (req, res) => {
  try {
    const skills = await db.query('SELECT * FROM skills ORDER BY level DESC');
    res.json({ success: true, data: skills });
  } catch (error) {
    console.error('getSkills error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch skills.' });
  }
};

exports.addSkill = async (req, res) => {
  const { name, category, level, icon, is_featured } = req.body;
  try {
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Name and category are required.' });
    }
    const result = await db.query(
      'INSERT INTO skills (name, category, level, icon, is_featured) VALUES (?, ?, ?, ?, ?)',
      [name, category, level || 80, icon || 'Atom', is_featured ? 1 : 0]
    );
    res.json({ success: true, message: 'Skill added successfully.', skillId: result.insertId });
  } catch (error) {
    console.error('addSkill error:', error);
    res.status(500).json({ success: false, message: 'Failed to add skill.' });
  }
};

exports.deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    if (db.isMock()) {
      // Mock db handles deletion locally
      const skills = await db.query('SELECT * FROM skills');
      // For mock, filter array
      const idx = skills.findIndex(s => s.id === parseInt(id));
      if (idx !== -1) skills.splice(idx, 1);
    } else {
      await db.query('DELETE FROM skills WHERE id = ?', [id]);
    }
    res.json({ success: true, message: 'Skill deleted successfully.' });
  } catch (error) {
    console.error('deleteSkill error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete skill.' });
  }
};

// --- EXPERIENCES ---
exports.getExperiences = async (req, res) => {
  try {
    const experiences = await db.query('SELECT * FROM experiences ORDER BY is_current DESC, id DESC');
    res.json({ success: true, data: experiences });
  } catch (error) {
    console.error('getExperiences error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch experiences.' });
  }
};

exports.addExperience = async (req, res) => {
  const { company, role, location, type, description, start_date, end_date, is_current } = req.body;
  try {
    if (!company || !role || !start_date) {
      return res.status(400).json({ success: false, message: 'Company, role, and start date are required.' });
    }
    const result = await db.query(
      'INSERT INTO experiences (company, role, location, type, description, start_date, end_date, is_current) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [company, role, location || '', type || 'Full-time', description || '', start_date, end_date || 'Present', is_current ? 1 : 0]
    );
    res.json({ success: true, message: 'Experience added successfully.', experienceId: result.insertId });
  } catch (error) {
    console.error('addExperience error:', error);
    res.status(500).json({ success: false, message: 'Failed to add experience.' });
  }
};

exports.deleteExperience = async (req, res) => {
  const { id } = req.params;
  try {
    if (db.isMock()) {
      const experiences = await db.query('SELECT * FROM experiences');
      const idx = experiences.findIndex(e => e.id === parseInt(id));
      if (idx !== -1) experiences.splice(idx, 1);
    } else {
      await db.query('DELETE FROM experiences WHERE id = ?', [id]);
    }
    res.json({ success: true, message: 'Experience deleted successfully.' });
  } catch (error) {
    console.error('deleteExperience error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete experience.' });
  }
};

// --- CERTIFICATIONS ---
exports.getCertifications = async (req, res) => {
  try {
    const certifications = await db.query('SELECT * FROM certifications ORDER BY id DESC');
    res.json({ success: true, data: certifications });
  } catch (error) {
    console.error('getCertifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch certifications.' });
  }
};

exports.addCertification = async (req, res) => {
  const { name, issuer, issue_date, credential_url } = req.body;
  try {
    if (!name || !issuer) {
      return res.status(400).json({ success: false, message: 'Name and issuer are required.' });
    }
    const result = await db.query(
      'INSERT INTO certifications (name, issuer, issue_date, credential_url) VALUES (?, ?, ?, ?)',
      [name, issuer, issue_date || '', credential_url || '']
    );
    res.json({ success: true, message: 'Certification added successfully.', certificationId: result.insertId });
  } catch (error) {
    console.error('addCertification error:', error);
    res.status(500).json({ success: false, message: 'Failed to add certification.' });
  }
};
