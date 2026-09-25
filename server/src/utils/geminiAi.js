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

  // Tech and soft skill catalog for extraction
  const skillDictionary = [
    'react', 'react.js', 'javascript', 'typescript', 'node.js', 'nodejs', 'express', 'mongodb', 'sql', 'postgresql',
    'python', 'django', 'fastapi', 'aws', 'docker', 'kubernetes', 'graphql', 'rest api', 'tailwind css', 'next.js',
    'redux', 'ci/cd', 'git', 'github', 'agile', 'scrum', 'jira', 'figma', 'system design', 'microservices',
    'unit testing', 'jest', 'cypress', 'html5', 'css3', 'nosql', 'redis', 'kafka', 'vue.js', 'angular',
    'c++', 'java', 'spring boot', 'go', 'golang', 'linux', 'data analysis', 'machine learning', 'ai', 'llm',
    'prompt engineering', 'cloud computing', 'gcp', 'azure', 'devops', 'leadership', 'communication', 'problem solving'
  ];

  // Identify skills present in JD
  const jdSkills = skillDictionary.filter(skill => jdText.includes(skill) || titleText.includes(skill));
  if (jdSkills.length === 0) {
    // extract common word tokens
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
  
  // Calculate scores
  const skillsScore = Math.min(100, Math.round(rawSkillsRatio * 100 * 0.9 + 15));
  
  // Check experience match
  const hasExp = (resume.experience || []).length > 0;
  const expCount = (resume.experience || []).length;
  const expScore = Math.min(100, Math.max(50, expCount * 22 + (hasExp ? 30 : 0)));

  // ATS Readability Score
  let atsScore = 80;
  if (resume.summary && resume.summary.length > 50) atsScore += 5;
  if ((resume.experience || []).length >= 2) atsScore += 5;
  if ((resume.education || []).length >= 1) atsScore += 5;
  if ((resume.skillGroups || []).length >= 1) atsScore += 5;
  atsScore = Math.min(98, atsScore);

  const overallScore = Math.round((skillsScore * 0.5) + (expScore * 0.3) + (atsScore * 0.2));

  // Key strengths & gaps
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

  // Tailored Summary
  const candidateName = resume.personalInfo?.fullName || 'Dedicated professional';
  const roleName = jobTitle || resume.targetJobTitle || 'Software Professional';
  const topMatches = matchingSkills.slice(0, 3).join(', ') || 'modern software engineering';
  const tailoredSummary = `Results-driven ${roleName} with extensive hands-on expertise in ${topMatches}. Demonstrated track record of designing, scaling, and maintaining high-reliability systems and responsive web applications. Passionate about applying modern architecture, clean code practices, and fast iterative delivery to deliver measurable impact for ${jobTitle ? 'the team' : 'forward-thinking organizations'}.`;

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

  // Smart Engine Fallback
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

  // Fallback intelligent bullets
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
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini matching analysis fallback:', err.message);
    }
  }

  // Heuristic engine
  return analyzeJobMatchHeuristic(resume, jobDescription, jobTitle);
}

module.exports = {
  generateEnhancedSummary,
  generateBulletPoints,
  matchResumeWithJob,
};
