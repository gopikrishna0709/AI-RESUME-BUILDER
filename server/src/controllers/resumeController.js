const Resume = require('../models/Resume');

const SAMPLE_RESUMES = {
  'software-engineer': {
    title: 'Senior Full Stack Engineer Resume',
    targetJobTitle: 'Senior Full Stack Engineer',
    template: 'modern-tech',
    theme: {
      primaryColor: '#2563eb',
      fontFamily: 'Inter',
      fontSize: 'normal',
      spacing: 'normal',
    },
    personalInfo: {
      fullName: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA (Open to Remote)',
      headline: 'Senior Full Stack Engineer | React, Node.js, Cloud & Distributed Systems',
      portfolioUrl: 'https://alexrivera.dev',
      linkedinUrl: 'https://linkedin.com/in/alexrivera-dev',
      githubUrl: 'https://github.com/alexrivera',
    },
    summary: 'Results-driven Senior Full Stack Engineer with 6+ years of experience architecting high-scale distributed systems and user-centric web applications. Expert in React, Node.js, TypeScript, and AWS cloud infrastructure. Led cross-functional teams to accelerate product release cycles by 40% and engineered real-time microservices handling over 25M daily requests.',
    experience: [
      {
        title: 'Senior Full Stack Engineer',
        company: 'Apex Cloud Solutions',
        location: 'San Francisco, CA',
        startDate: 'Jan 2022',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected and led the migration of a monolithic web app to a micro-frontend architecture using React, Vite, and GraphQL, decreasing initial load times by 48%.',
          'Spearheaded the development of real-time collaborative workspace features supporting 150K+ active concurrent users with WebSocket & Redis caching.',
          'Engineered automated CI/CD pipelines with GitHub Actions and Docker, reducing build-to-deploy deployment time from 45 minutes to 7 minutes.',
          'Mentored 6 junior and mid-level software engineers through code reviews, technical workshops, and system design sessions.'
        ]
      },
      {
        title: 'Full Stack Software Engineer',
        company: 'Pulse Digital Technologies',
        location: 'Austin, TX',
        startDate: 'Aug 2019',
        endDate: 'Dec 2021',
        current: false,
        bullets: [
          'Developed and maintained 12+ scalable RESTful APIs in Node.js/Express and MongoDB Atlas for enterprise fintech clients.',
          'Implemented Stripe billing and automated subscription workflows, processing over $4.2M in annual recurring revenue with zero downtime.',
          'Refactored frontend state management to Zustand, cutting re-renders by 60% and improving Core Web Vitals score to 98/100.'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        graduationYear: '2019',
        gpa: '3.85 / 4.0',
        honors: ["Dean's Honors List (All Semesters)", 'ACM Student Chapter Lead']
      }
    ],
    skillGroups: [
      {
        category: 'Frontend & UI',
        items: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'HTML5/CSS3', 'WebSockets']
      },
      {
        category: 'Backend & Cloud',
        items: ['Node.js', 'Express', 'Python', 'REST APIs', 'GraphQL', 'AWS (S3, Lambda, ECS)', 'Docker', 'Microservices']
      },
      {
        category: 'Databases & Tools',
        items: ['MongoDB Atlas', 'PostgreSQL', 'Redis', 'Git / GitHub', 'Jest / Cypress', 'CI/CD', 'Kafka']
      }
    ],
    projects: [
      {
        name: 'DevFlow - AI Code Review Assistant',
        role: 'Creator & Lead Developer',
        url: 'https://devflow.app',
        github: 'https://github.com/alexrivera/devflow',
        techStack: ['React', 'Node.js', 'Gemini AI', 'MongoDB', 'Docker'],
        description: 'Automated AI code review assistant that analyzes pull requests and suggests performance and security patches.',
        bullets: [
          'Implemented automated PR webhooks integrated with GitHub API and Gemini models to deliver instant contextual code reviews.',
          'Grew open-source user base to over 3,500 active developer installations with a 4.9/5 satisfaction rating.'
        ]
      },
      {
        name: 'OmniStream - High-Throughput Event Processor',
        role: 'Core Contributor',
        url: 'https://omnistream.io',
        github: 'https://github.com/alexrivera/omnistream',
        techStack: ['Node.js', 'Kafka', 'Redis', 'TypeScript'],
        description: 'Distributed event ingestion engine capable of processing 50,000 telemetry messages per second.',
        bullets: [
          'Engineered resilient backpressure algorithms and connection pooling to ensure zero message drop during network partitions.'
        ]
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2023',
        credentialUrl: 'https://aws.amazon.com/verification'
      }
    ],
    languages: ['English (Native)', 'Spanish (Professional)'],
    interests: ['Open Source Software', 'AI & Distributed Systems', 'Marathon Running', 'Photography'],
    atsScore: 94,
    isDefault: true
  }
};

// @desc    Get all resumes for logged-in user
// @route   GET /api/resumes
// @access  Private
exports.getResumes = async (req, res) => {
  try {
    let resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });

    // If new user with 0 resumes, create default sample resume
    if (resumes.length === 0) {
      const sample = SAMPLE_RESUMES['software-engineer'];
      const newResume = await Resume.create({
        ...sample,
        userId: req.user.id,
        personalInfo: {
          ...sample.personalInfo,
          fullName: req.user.name || sample.personalInfo.fullName,
          email: req.user.email || sample.personalInfo.email,
        }
      });
      resumes = [newResume];
    }

    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    console.error('getResumes error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private/Public (if sharing)
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Verify ownership if requested via private route
    if (req.user && resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this resume' });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
exports.createResume = async (req, res) => {
  try {
    const { title, template, targetJobTitle, preset } = req.body;

    let baseData = {};
    if (preset && SAMPLE_RESUMES[preset]) {
      baseData = { ...SAMPLE_RESUMES[preset] };
    }

    const newResume = await Resume.create({
      ...baseData,
      title: title || baseData.title || 'Untitled Resume',
      template: template || baseData.template || 'modern-tech',
      targetJobTitle: targetJobTitle || baseData.targetJobTitle || '',
      userId: req.user.id,
      personalInfo: {
        ...(baseData.personalInfo || {}),
        fullName: req.user.name || (baseData.personalInfo?.fullName || ''),
        email: req.user.email || (baseData.personalInfo?.email || ''),
      },
    });

    res.status(201).json({ success: true, data: newResume });
  } catch (error) {
    console.error('createResume error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
exports.updateResume = async (req, res) => {
  try {
    let resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this resume' });
    }

    resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: resume });
  } catch (error) {
    console.error('updateResume error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this resume' });
    }

    await resume.deleteOne();
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
exports.duplicateResume = async (req, res) => {
  try {
    const original = await Resume.findById(req.params.id);
    if (!original) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const originalObj = original.toObject();
    delete originalObj._id;
    delete originalObj.createdAt;
    delete originalObj.updatedAt;

    originalObj.title = `${original.title} (Copy)`;
    originalObj.userId = req.user.id;
    originalObj.isDefault = false;

    const duplicate = await Resume.create(originalObj);
    res.status(201).json({ success: true, data: duplicate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
