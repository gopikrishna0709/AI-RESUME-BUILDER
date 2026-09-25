const { GoogleGenAI } = require('@google/genai');

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client:', err.message);
    return null;
  }
};

/**
 * Intelligent Heuristic Analysis for Resume & Job Matching (High-fidelity Fallback & NLP)
 */
function analyzeJobMatchHeuristic(resume, jobDescription, jobTitle) {
  const resumeText = [
    resume.personalInfo?.fullName,
    resume.personalInfo?.headline,
    resume.summary,
    (resume.skillGroups || []).map(g => (g.items || []).join(' ')).join(' '),
    (resume.experience || []).map(e => `${e.title} ${e.company} ${(e.bullets || []).join(' ')}`).join(' '),
    (resume.projects || []).map(p => `${p.name} ${(p.techStack || []).join(' ')} ${p.description} ${(p.bullets || []).join(' ')}`).join(' '),
    (resume.education || []).map(ed => `${ed.degree} ${ed.fieldOfStudy} ${ed.institution}`).join(' '),
  ].filter(Boolean).join(' ').toLowerCase();

  const jdText = (jobDescription || '').toLowerCase();
  const titleText = (jobTitle || '').toLowerCase();

  const skillDictionary = [
    'react', 'react.js', 'javascript', 'typescript', 'node.js', 'nodejs', 'express', 'mongodb', 'sql', 'postgresql',
    'python', 'django', 'fastapi', 'aws', 'docker', 'kubernetes', 'graphql', 'rest api', 'tailwind css', 'next.js',
    'redux', 'ci/cd', 'git', 'github', 'agile', 'scrum', 'jira', 'figma', 'system design', 'microservices',
    'unit testing', 'jest', 'cypress', 'html5', 'css3', 'nosql', 'redis', 'kafka', 'vue.js', 'angular',
    'c++', 'java', 'spring boot', 'go', 'golang', 'linux', 'data analysis', 'machine learning', 'ai', 'llm',
    'prompt engineering', 'cloud computing', 'gcp', 'azure', 'devops', 'leadership', 'communication', 'problem solving'
  ];

  const jdSkills = skillDictionary.filter(skill => jdText.includes(skill) || titleText.includes(skill));
  if (jdSkills.length === 0) {
    const words = jdText.match(/\b[a-z]{3,15}\b/g) || [];
    const uniqueWords = [...new Set(words)];
    jdSkills.push(...uniqueWords.slice(0, 10));
  }

  const matchingSkills = [];
  const missingSkills = [];

  jdSkills.forEach(skill => {
    if (resumeText.includes(skill)) {
      matchingSkills.push(capitalizeWords(skill));
    } else {
      missingSkills.push(capitalizeWords(skill));
    }
  });

  const totalJdSkills = jdSkills.length || 1;
  const rawSkillsRatio = matchingSkills.length / totalJdSkills;
  
  const skillsScore = Math.min(100, Math.round(rawSkillsRatio * 100 * 0.9 + 15));
  const hasExp = (resume.experience || []).length > 0;
  const expCount = (resume.experience || []).length;
  const expScore = Math.min(100, Math.max(50, expCount * 22 + (hasExp ? 30 : 0)));

  let atsScore = 80;
  if (resume.summary && resume.summary.length > 50) atsScore += 5;
  if ((resume.experience || []).length >= 2) atsScore += 5;
  if ((resume.education || []).length >= 1) atsScore += 5;
  if ((resume.skillGroups || []).length >= 1) atsScore += 5;
  atsScore = Math.min(98, atsScore);

  const overallScore = Math.round((skillsScore * 0.5) + (expScore * 0.3) + (atsScore * 0.2));

  const keyStrengths = [];
  if (matchingSkills.length > 0) {
    keyStrengths.push(`Direct alignment on core skills: ${matchingSkills.slice(0, 4).join(', ')}.`);
  }
  if (resume.experience && resume.experience.length > 0) {
    keyStrengths.push(`Proven hands-on background in ${resume.experience[0].title || 'relevant roles'} at ${resume.experience[0].company || 'industry companies'}.`);
  }
  if (resume.education && resume.education.length > 0) {
    keyStrengths.push(`Strong academic foundation in ${resume.education[0].fieldOfStudy || resume.education[0].degree || 'relevant fields'}.`);
  }
  if (keyStrengths.length === 0) {
    keyStrengths.push('Clean resume formatting with clear foundational technical profile.');
  }

  const criticalGaps = [];
  if (missingSkills.length > 0) {
    criticalGaps.push(`Missing high-priority keywords from JD: ${missingSkills.slice(0, 5).join(', ')}.`);
  }
  if (!resume.summary || resume.summary.length < 50) {
    criticalGaps.push('Professional Summary is short or generic — tailor it specifically to this role.');
  }
  if (criticalGaps.length === 0) {
    criticalGaps.push('Add more quantified metrics and business impact statistics to experience bullet points.');
  }

  const recommendations = [
    missingSkills.length > 0 
      ? `Incorporate key terms [${missingSkills.slice(0, 3).join(', ')}] naturally into your Skills and Project descriptions.`
      : `Highlight leadership and system architecture achievements in your most recent role.`,
    `Tailor your Headline to match "${jobTitle || 'Target Role'}" for immediate ATS keyword recognition.`,
    `Use the STAR method (Situation, Task, Action, Result) with explicit numerical metrics (%, $, ms saved) in your experience bullets.`,
    `Ensure your technical skills section categorizes frontend, backend, databases, and DevOps clearly.`
  ];

  const roleName = jobTitle || resume.targetJobTitle || 'Software Professional';
  const topMatches = matchingSkills.slice(0, 3).join(', ') || 'modern software engineering';
  const tailoredSummary = `Results-driven ${roleName} with extensive hands-on expertise in ${topMatches}. Demonstrated track record of designing, scaling, and maintaining high-reliability systems and responsive web applications. Passionate about applying modern architecture, clean code practices, and fast iterative delivery to deliver measurable impact.`;

  return {
    overallMatchScore: Math.max(35, Math.min(98, overallScore)),
    skillsMatchScore: Math.max(30, Math.min(99, skillsScore)),
    experienceMatchScore: Math.max(40, Math.min(98, expScore)),
    educationMatchScore: 88,
    atsPassedRate: atsScore,
    matchingSkills,
    missingSkills,
    keyStrengths,
    criticalGaps,
    tailoringRecommendations: recommendations,
    tailoredSummary,
    tailoredBullets: [
      `Architected and deployed scalable features utilizing ${matchingSkills.slice(0, 2).join(' and ') || 'modern technologies'}, boosting system efficiency by 34%.`,
      `Collaborated cross-functionally across product, design, and engineering teams to accelerate feature delivery cycles by 25%.`,
      `Streamlined CI/CD pipelines and automated testing suites, reducing build-to-deploy turnaround time and cutting bug regression rates by 40%.`
    ]
  };
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * AI Enhance Summary
 */
async function generateEnhancedSummary({ currentSummary, targetRole, experienceLevel, keySkills }) {
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `You are an elite career coach and resume writer.
Task: Write a high-impact, ATS-optimized professional resume summary (3-4 sentences).
Target Role: ${targetRole || 'Software Engineer'}
Experience Level: ${experienceLevel || 'Mid-Level'}
Key Skills: ${(keySkills || []).join(', ') || 'Full Stack Development, Problem Solving, Cloud'}
Current Draft (if any): "${currentSummary || ''}"

Guidelines:
- Start with a powerful professional identity.
- Highlight technical strengths, architectural capability, and quantifiable value.
- Keep it concise, punchy, professional, and ATS-friendly (no fluffy buzzwords).
- Return ONLY the generated summary text without markdown headings or quotes.`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart engine:', err.message);
    }
  }

  const skillsStr = (keySkills && keySkills.length > 0) ? keySkills.slice(0, 4).join(', ') : 'modern full-stack architecture, cloud systems, and scalable APIs';
  const role = targetRole || 'Software Engineer';
  const level = experienceLevel || 'Experienced';
  
  return `Results-driven ${level} ${role} with a proven track record of engineering high-performance web applications and distributed systems. Expert in ${skillsStr} with a strong focus on clean code, automated testing, and agile delivery. Adept at bridging technical requirements with business goals to deliver scalable, user-centric solutions.`;
}

/**
 * AI Generate / Enhance Bullet Points
 */
async function generateBulletPoints({ roleTitle, company, context, count = 3 }) {
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `You are a top-tier resume editor.
Role: ${roleTitle || 'Software Engineer'}
Company: ${company || 'Tech Company'}
Context / Raw notes: "${context || 'Developed features, improved performance, collaborated with team'}"

Generate ${count} compelling, ATS-optimized resume bullet points using the STAR method (Action Verb + Context + Quantifiable Metric/Result).
Return ONLY a JSON array of strings, e.g. ["bullet 1", "bullet 2", "bullet 3"].`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text ? response.text.trim() : '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('Gemini bullet points generation fallback:', err.message);
    }
  }

  const role = roleTitle || 'Software Engineer';
  return [
    `Spearheaded the development and deployment of scalable features as ${role} at ${company || 'organization'}, boosting user engagement by 32% and reducing latency by 45%.`,
    `Architected robust RESTful & GraphQL APIs with comprehensive automated test suites, achieving 99.9% uptime and zero critical production regressions.`,
    `Streamlined continuous integration and automated deployment pipelines, cutting sprint delivery cycles from 3 weeks to 9 business days.`
  ];
}

/**
 * AI Job Matcher & ATS Scanner
 */
async function matchResumeWithJob({ resume, jobDescription, jobTitle, company }) {
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `You are an enterprise-grade ATS (Applicant Tracking System) scanner and career intelligence engine.
Analyze this candidate resume against the target job description.

JOB TITLE: ${jobTitle || 'Target Position'}
COMPANY: ${company || 'Target Company'}
JOB DESCRIPTION:
"""
${jobDescription || 'Standard software engineering and product development requirements.'}
"""

CANDIDATE RESUME:
"""
Full Name: ${resume.personalInfo?.fullName || ''}
Headline: ${resume.personalInfo?.headline || ''}
Summary: ${resume.summary || ''}
Skills: ${(resume.skillGroups || []).map(g => `${g.category}: ${(g.items || []).join(', ')}`).join(' | ')}
Experience: ${(resume.experience || []).map(e => `${e.title} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'}): ${(e.bullets || []).join('; ')}`).join(' \n ')}
Education: ${(resume.education || []).map(ed => `${ed.degree} in ${ed.fieldOfStudy} from ${ed.institution}`).join('; ')}
Projects: ${(resume.projects || []).map(p => `${p.name} (${(p.techStack || []).join(', ')}): ${p.description}`).join('; ')}
"""

Provide a strict, thorough ATS and hiring manager evaluation.
Return ONLY valid JSON matching this schema:
{
  "overallMatchScore": number (0-100),
  "skillsMatchScore": number (0-100),
  "experienceMatchScore": number (0-100),
  "educationMatchScore": number (0-100),
  "atsPassedRate": number (0-100),
  "matchingSkills": [string],
  "missingSkills": [string],
  "keyStrengths": [string],
  "criticalGaps": [string],
  "tailoringRecommendations": [string],
  "tailoredSummary": string,
  "tailoredBullets": [string]
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text ? response.text.trim() : '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('Gemini matching analysis fallback:', err.message);
    }
  }

  return analyzeJobMatchHeuristic(resume, jobDescription, jobTitle);
}

/**
 * CAREER AI: Interview Questions Generator
 */
async function generateInterviewQuestions({ targetRole, skills, experienceLevel, category = 'all' }) {
  const role = targetRole || 'Full Stack Software Engineer';
  const skillList = (skills && skills.length > 0) ? skills.join(', ') : 'React, Node.js, System Design, Cloud';

  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `You are a Principal Tech Recruiter and Engineering Director at FAANG.
Generate 6 realistic, high-signal interview questions for a ${experienceLevel || 'Senior'} ${role} specializing in ${skillList}.

Category: ${category} (Technical, Behavioral STAR, System Design, Problem Solving)

Return ONLY a JSON array of objects matching this schema:
[
  {
    "id": 1,
    "type": "Technical" | "Behavioral" | "System Design",
    "question": "string",
    "tips": "string (what great candidates highlight)",
    "sampleAnswer": "string (bullet points of ideal response)"
  }
]`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text ? response.text.trim() : '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('Gemini interview questions fallback:', err.message);
    }
  }

  // Fallback high-impact interview questions
  return [
    {
      id: 1,
      type: 'Technical',
      question: `How do you optimize state management and rendering performance in a large-scale React application handling high-frequency updates?`,
      tips: 'Discuss memoization (useMemo, useCallback), virtualized lists, immutability, and state colocation vs global stores (Zustand/Redux).',
      sampleAnswer: '1. Colocate state to leaf nodes. 2. Implement virtual scrolling for large feeds. 3. Use selector-based subscriptions to prevent unnecessary parent-tree re-renders.'
    },
    {
      id: 2,
      type: 'System Design',
      question: `Design an end-to-end real-time notification engine supporting 5M daily active users with low latency and guarantee delivery.`,
      tips: 'Cover WebSockets/SSE, Redis Pub/Sub, Kafka message queues, connection connection pooling, and push notification services (APNs/FCM).',
      sampleAnswer: '1. Clients connect via WebSocket Gateway. 2. Redis Pub/Sub fans out notifications to active gateway workers. 3. Dead-letter queues handle retries for offline users.'
    },
    {
      id: 3,
      type: 'Behavioral',
      question: `Tell me about a time you identified a critical technical bottleneck or architectural debt. How did you advocate for refactoring and measure success?`,
      tips: 'Use the STAR method: explain the business friction, how you gathered telemetry, led consensus, and delivered measurable performance gains.',
      sampleAnswer: 'Situation: Slow checkout API taking 1.8s. Action: Profiled MongoDB query plans and added Redis caching. Result: P99 latency dropped to 140ms and conversions grew 8%.'
    },
    {
      id: 4,
      type: 'Technical',
      question: `Explain how JWT authentication works securely in a distributed microservices environment and how you handle token revocation.`,
      tips: 'Explain asymmetric signing (RS256), short-lived access tokens with HTTP-only refresh tokens, and Redis blocklist for instant logout revocation.',
      sampleAnswer: '1. Stateless verification using public keys. 2. 15-minute access token lifespan. 3. Distributed Redis token blacklist for immediate forced logouts.'
    },
    {
      id: 5,
      type: 'Behavioral',
      question: `Describe a situation where you had a strong technical disagreement with a team member or product manager. How was it resolved?`,
      tips: 'Focus on empathy, data-driven proofs of concept, alignment with customer needs, and disagree-and-commit maturity.',
      sampleAnswer: 'Set up an A/B benchmark test to compare both architectures objectively against latency and maintenance cost, reaching unanimous agreement.'
    }
  ];
}

/**
 * CAREER AI: Mock Interview Answer Evaluator
 */
async function evaluateMockAnswer({ question, answer, targetRole }) {
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `You are an expert interviewer scoring a candidate's response.
Target Role: ${targetRole || 'Software Engineer'}
Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate the response rigorously.
Return ONLY valid JSON matching:
{
  "score": number (0-100),
  "strengths": [string],
  "improvements": [string],
  "improvedAnswer": string,
  "verdict": "Outstanding" | "Strong" | "Average" | "Needs Improvement"
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text ? response.text.trim() : '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('Gemini mock answer evaluation fallback:', err.message);
    }
  }

  const length = (answer || '').trim().split(/\s+/).length;
  let score = Math.min(95, Math.max(50, length * 1.5 + 40));
  
  return {
    score,
    verdict: score >= 85 ? 'Strong' : score >= 70 ? 'Good' : 'Needs Improvement',
    strengths: [
      'Directly addresses the core scenario with clear technical terminology.',
      'Demonstrates practical understanding of engineering trade-offs.'
    ],
    improvements: [
      'Structure the answer using the STAR format (Situation, Task, Action, Result).',
      'Incorporate specific numerical metrics and percentages to prove business impact.'
    ],
    improvedAnswer: `In my previous role, we encountered this exact challenge. I started by analyzing the root telemetry (Situation & Task). I architected a modular solution implementing automated caching and defensive error boundaries (Action). As a result, we reduced system error rates by 42% and delivered ahead of schedule (Result).`
  };
}

/**
 * CAREER AI: Skill Roadmap Generator
 */
async function generateSkillRoadmap({ currentSkills, targetRole, timeframe = '90-Days' }) {
  const role = targetRole || 'Senior Cloud Architect';
  const skills = (currentSkills && currentSkills.length > 0) ? currentSkills.join(', ') : 'JavaScript, React, Node.js';

  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `You are a Principal Career Development Officer.
Create a high-impact, actionable ${timeframe} Skill Roadmap for transitioning from:
Current Skills: ${skills}
Target Goal / Role: ${role}

Return ONLY valid JSON matching:
{
  "targetRole": "${role}",
  "estimatedTimeframe": "${timeframe}",
  "readinessScore": number (0-100),
  "phases": [
    {
      "phase": "Phase 1: Foundations & Core Architecture (Weeks 1-4)",
      "focus": "string",
      "milestones": [string],
      "recommendedProjects": [string]
    },
    {
      "phase": "Phase 2: Advanced Mastery & Cloud Scale (Weeks 5-8)",
      "focus": "string",
      "milestones": [string],
      "recommendedProjects": [string]
    },
    {
      "phase": "Phase 3: Production Leadership & System Design (Weeks 9-12)",
      "focus": "string",
      "milestones": [string],
      "recommendedProjects": [string]
    }
  ],
  "topCertifications": [string]
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text ? response.text.trim() : '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('Gemini roadmap fallback:', err.message);
    }
  }

  return {
    targetRole: role,
    estimatedTimeframe: timeframe,
    readinessScore: 78,
    phases: [
      {
        phase: 'Phase 1: Deep Core & Performance Engineering (Month 1)',
        focus: 'Master concurrency, async patterns, micro-frontends, and database query optimization.',
        milestones: [
          'Build a real-time reactive event stream with WebSockets & Redis.',
          'Implement automated end-to-end test harnesses achieving 90%+ branch coverage.'
        ],
        recommendedProjects: ['High-Throughput Analytics Dashboard with SSR & Redis Caching']
      },
      {
        phase: 'Phase 2: Cloud Infrastructure & Containerization (Month 2)',
        focus: 'Docker container orchestration, Kubernetes, AWS Lambda serverless pipelines, and Terraform.',
        milestones: [
          'Deploy multi-region cloud workloads with zero-downtime blue/green deployments.',
          'Set up automated CI/CD security scanning and Docker multi-stage builds.'
        ],
        recommendedProjects: ['Automated Serverless Media Ingestion & Transcoding Pipeline']
      },
      {
        phase: 'Phase 3: Enterprise System Design & Leadership (Month 3)',
        focus: 'High-availability distributed architectures, CAP theorem trade-offs, and tech mentorship.',
        milestones: [
          'Design and document an enterprise-grade payment integration system design doc.',
          'Lead technical code review workshops and mentor junior engineers.'
        ],
        recommendedProjects: ['Distributed Consensus & Leader Election Simulation Engine']
      }
    ],
    topCertifications: [
      'AWS Certified Solutions Architect – Associate',
      'Certified Kubernetes Application Developer (CKAD)',
      'Meta Professional Frontend / Backend Certificate'
    ]
  };
}

module.exports = {
  generateEnhancedSummary,
  generateBulletPoints,
  matchResumeWithJob,
  generateInterviewQuestions,
  evaluateMockAnswer,
  generateSkillRoadmap,
};
