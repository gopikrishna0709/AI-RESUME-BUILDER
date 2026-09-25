const Job = require('../models/Job');

const CURATED_JOBS = [
  {
    title: 'Senior Full Stack Engineer',
    company: 'Stripe',
    logo: '💳',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    level: 'Senior',
    salaryRange: '$180,000 - $240,000 + Equity',
    department: 'Core Infrastructure & Developer Platform',
    description: 'Stripe is looking for a Senior Full Stack Engineer to build next-generation developer tooling, global checkout APIs, and high-resiliency financial infrastructure. You will collaborate with cross-functional teams to design elegant, high-throughput systems that power billions in global commerce.',
    requirements: [
      '5+ years of experience with React, TypeScript, Node.js, and distributed backend systems.',
      'Strong expertise in REST APIs, GraphQL, database design (PostgreSQL, MongoDB, Redis).',
      'Solid experience with AWS/GCP cloud environments, Docker, and CI/CD pipelines.',
      'Demonstrated passion for developer ergonomics, code quality, and automated unit/integration testing.'
    ],
    responsibilities: [
      'Design, build, and maintain mission-critical full-stack applications and payment integrations.',
      'Optimize frontend bundle performance and backend service response times.',
      'Lead technical architecture reviews and mentor team members.'
    ],
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'AWS', 'REST API', 'GraphQL', 'Docker'],
    preferredSkills: ['Microservices', 'Kafka', 'CI/CD', 'Jest', 'Kubernetes'],
    isFeatured: true,
  },
  {
    title: 'Frontend React Architect',
    company: 'Airbnb',
    logo: '🏡',
    location: 'Remote (US/Global)',
    type: 'Full-time',
    level: 'Lead / Staff',
    salaryRange: '$200,000 - $265,000 + Equity',
    department: 'Host & Guest Experience',
    description: 'We are seeking an experienced Frontend Architect to redefine our interactive design system and core discovery experience. You will push the boundaries of web performance, animations, responsive design, and state management.',
    requirements: [
      '6+ years specializing in modern React ecosystem, Next.js, Tailwind CSS, TypeScript, and state management.',
      'Deep knowledge of web performance, Core Web Vitals, SSR/SSG, and responsive design systems.',
      'Experience building accessible (WCAG 2.1 AA) and localization-ready web components.'
    ],
    responsibilities: [
      'Architect modular UI component libraries with Tailwind CSS and Framer Motion.',
      'Establish company-wide frontend standards and performance benchmarks.',
      'Collaborate with UI/UX product designers to build award-winning experiences.'
    ],
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Web Performance', 'UI/UX', 'HTML5/CSS3'],
    preferredSkills: ['Figma', 'GraphQL', 'Storybook', 'Cypress', 'Zustand'],
    isFeatured: true,
  },
  {
    title: 'AI Platform & Cloud Engineer',
    company: 'OpenAI Solutions Partner',
    logo: '🤖',
    location: 'New York, NY / Hybrid',
    type: 'Full-time',
    level: 'Senior',
    salaryRange: '$190,000 - $250,000',
    department: 'Generative AI & LLM Systems',
    description: 'Join an agile team building cutting-edge GenAI agent workflows, multimodal pipelines, and vector search systems. You will bridge LLMs with real-world enterprise databases and microservices.',
    requirements: [
      '4+ years developing with Node.js/Python, Vector Databases, and LLM APIs (Gemini, OpenAI).',
      'Solid experience in cloud scalability, Docker containerization, and API orchestration.',
      'Familiarity with Prompt Engineering, Retrieval-Augmented Generation (RAG), and caching.'
    ],
    responsibilities: [
      'Build generative AI integrations, streaming agent pipelines, and real-time WebSocket endpoints.',
      'Optimize latency and cost efficiency for high-volume inference requests.',
      'Implement robust monitoring, guardrails, and automated evaluation metrics.'
    ],
    requiredSkills: ['Python', 'Node.js', 'AI / LLM', 'MongoDB', 'Docker', 'REST API', 'Cloud Computing', 'Git'],
    preferredSkills: ['Vector DB', 'Redis', 'Kubernetes', 'FastAPI', 'AWS Lambda'],
    isFeatured: true,
  },
  {
    title: 'Full Stack MERN Developer',
    company: 'Veloce Digital Innovations',
    logo: '⚡',
    location: 'Austin, TX / Remote',
    type: 'Full-time',
    level: 'Mid Level',
    salaryRange: '$125,000 - $155,000',
    department: 'Product Engineering',
    description: 'Fast-growing SaaS startup seeking a proactive MERN stack developer to build consumer-facing dashboards, authentication workflows, and payment portals.',
    requirements: [
      '3+ years hands-on with MongoDB, Express, React, Node.js, and modern CSS/Tailwind.',
      'Experience with JWT auth, state management, and asynchronous operations.',
      'Self-driven attitude with strong problem-solving and communication skills.'
    ],
    responsibilities: [
      'Ship clean, maintainable React components and Node.js REST endpoints.',
      'Write automated tests and participate in sprint planning.',
      'Support production bug fixes and feature enhancements.'
    ],
    requiredSkills: ['MongoDB', 'Express', 'React', 'Node.js', 'JavaScript', 'Tailwind CSS', 'Git'],
    preferredSkills: ['TypeScript', 'JWT', 'AWS', 'Jest'],
    isFeatured: false,
  }
];

// @desc    Get all jobs (with auto seed if empty)
// @route   GET /api/jobs
// @access  Public / Private
exports.getJobs = async (req, res) => {
  try {
    let count = await Job.countDocuments();
    if (count === 0) {
      await Job.insertMany(CURATED_JOBS);
    }

    const { search, type, level, remote } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    if (remote === 'true') {
      query.location = { $regex: 'Remote', $options: 'i' };
    }

    const jobs = await Job.find(query).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    console.error('getJobs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create custom job (user-submitted JD)
// @route   POST /api/jobs
// @access  Private
exports.createJob = async (req, res) => {
  try {
    const { title, company, description, requirements, location, type, salaryRange, requiredSkills } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({ success: false, message: 'Please provide Title, Company and Job Description' });
    }

    const job = await Job.create({
      title,
      company,
      description,
      requirements: requirements || [],
      location: location || 'Remote',
      type: type || 'Full-time',
      salaryRange: salaryRange || 'Competitive',
      requiredSkills: requiredSkills || [],
      createdBy: req.user.id,
      source: 'User Custom',
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    console.error('createJob error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
