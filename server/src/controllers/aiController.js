const Resume = require('../models/Resume');
const Job = require('../models/Job');
const ApplicationMatch = require('../models/ApplicationMatch');
const {
  generateEnhancedSummary,
  generateBulletPoints,
  matchResumeWithJob,
  generateInterviewQuestions,
  evaluateMockAnswer,
  generateSkillRoadmap,
} = require('../utils/geminiAi');

// @desc    Generate / Enhance Professional Summary
// @route   POST /api/ai/enhance-summary
// @access  Private
exports.enhanceSummary = async (req, res) => {
  try {
    const { currentSummary, targetRole, experienceLevel, keySkills } = req.body;

    const enhanced = await generateEnhancedSummary({
      currentSummary,
      targetRole,
      experienceLevel,
      keySkills,
    });

    res.json({ success: true, summary: enhanced });
  } catch (error) {
    console.error('enhanceSummary error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate / Enhance Bullet Points
// @route   POST /api/ai/generate-bullets
// @access  Private
exports.generateBullets = async (req, res) => {
  try {
    const { roleTitle, company, context, count } = req.body;

    const bullets = await generateBulletPoints({
      roleTitle,
      company,
      context,
      count: count || 3,
    });

    res.json({ success: true, bullets });
  } catch (error) {
    console.error('generateBullets error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Run AI Matcher & ATS Scanner
// @route   POST /api/ai/match-job
// @access  Private
exports.matchJob = async (req, res) => {
  try {
    const { resumeId, jobId, customJobTitle, customCompany, customJobDescription } = req.body;

    if (!resumeId) {
      return res.status(400).json({ success: false, message: 'Please select a resume to match' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    let targetTitle = customJobTitle;
    let targetCompany = customCompany;
    let targetDescription = customJobDescription;

    if (jobId) {
      const job = await Job.findById(jobId);
      if (job) {
        targetTitle = job.title;
        targetCompany = job.company;
        targetDescription = `${job.description}\n\nRequirements:\n${(job.requirements || []).join('\n')}\nSkills: ${(job.requiredSkills || []).join(', ')}`;
      }
    }

    if (!targetDescription) {
      return res.status(400).json({ success: false, message: 'Please provide a job description or select a job' });
    }

    // Perform AI analysis
    const analysis = await matchResumeWithJob({
      resume,
      jobDescription: targetDescription,
      jobTitle: targetTitle,
      company: targetCompany,
    });

    // Save match record in database
    const matchRecord = await ApplicationMatch.create({
      userId: req.user.id,
      resumeId: resume._id,
      jobId: jobId || null,
      jobTitle: targetTitle || 'Target Role',
      company: targetCompany || 'Target Organization',
      jobDescription: targetDescription,
      overallMatchScore: analysis.overallMatchScore,
      skillsMatchScore: analysis.skillsMatchScore,
      experienceMatchScore: analysis.experienceMatchScore,
      educationMatchScore: analysis.educationMatchScore,
      atsPassedRate: analysis.atsPassedRate,
      matchingSkills: analysis.matchingSkills,
      missingSkills: analysis.missingSkills,
      keyStrengths: analysis.keyStrengths,
      criticalGaps: analysis.criticalGaps,
      tailoringRecommendations: analysis.tailoringRecommendations,
      tailoredSummary: analysis.tailoredSummary,
      tailoredBullets: analysis.tailoredBullets,
      status: 'Tailored',
    });

    res.json({
      success: true,
      data: matchRecord,
    });
  } catch (error) {
    console.error('matchJob error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's previous matches
// @route   GET /api/ai/matches
// @access  Private
exports.getMatches = async (req, res) => {
  try {
    const matches = await ApplicationMatch.find({ userId: req.user.id })
      .populate('resumeId', 'title targetJobTitle template')
      .populate('jobId', 'title company logo')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply AI Tailored Recommendations directly to resume
// @route   POST /api/ai/apply-tailoring/:matchId
// @access  Private
exports.applyTailoring = async (req, res) => {
  try {
    const match = await ApplicationMatch.findById(req.params.matchId);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match record not found' });
    }

    const resume = await Resume.findById(match.resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Target resume not found' });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update summary if tailored
    if (match.tailoredSummary) {
      resume.summary = match.tailoredSummary;
    }

    // Add missing skills to skills list if not already present
    if (match.missingSkills && match.missingSkills.length > 0) {
      let targetSkillGroup = resume.skillGroups.find(g => g.category.toLowerCase().includes('technical') || g.category.toLowerCase().includes('core'));
      if (!targetSkillGroup && resume.skillGroups.length > 0) {
        targetSkillGroup = resume.skillGroups[0];
      }

      if (targetSkillGroup) {
        const existingItems = new Set(targetSkillGroup.items.map(s => s.toLowerCase()));
        match.missingSkills.forEach(skill => {
          if (!existingItems.has(skill.toLowerCase())) {
            targetSkillGroup.items.push(skill);
          }
        });
      }
    }

    // Add tailored bullet to most recent experience if available
    if (match.tailoredBullets && match.tailoredBullets.length > 0 && resume.experience.length > 0) {
      resume.experience[0].bullets.unshift(match.tailoredBullets[0]);
    }

    resume.atsScore = Math.min(98, Math.max(match.atsPassedRate, 92));
    await resume.save();

    match.status = 'Applied';
    await match.save();

    res.json({ success: true, message: 'Resume successfully tailored and updated!', data: resume });
  } catch (error) {
    console.error('applyTailoring error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    CAREER AI: Generate Interview Questions
// @route   POST /api/ai/interview-questions
// @access  Private
exports.getInterviewQuestions = async (req, res) => {
  try {
    const { targetRole, skills, experienceLevel, category } = req.body;
    const questions = await generateInterviewQuestions({
      targetRole,
      skills,
      experienceLevel,
      category,
    });
    res.json({ success: true, data: questions });
  } catch (error) {
    console.error('getInterviewQuestions error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    CAREER AI: Mock Interview Answer Evaluator
// @route   POST /api/ai/mock-evaluate
// @access  Private
exports.evaluateMock = async (req, res) => {
  try {
    const { question, answer, targetRole } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required.' });
    }
    const evaluation = await evaluateMockAnswer({
      question,
      answer,
      targetRole,
    });
    res.json({ success: true, data: evaluation });
  } catch (error) {
    console.error('evaluateMock error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    CAREER AI: Skill Roadmap
// @route   POST /api/ai/skill-roadmap
// @access  Private
exports.getSkillRoadmap = async (req, res) => {
  try {
    const { currentSkills, targetRole, timeframe } = req.body;
    const roadmap = await generateSkillRoadmap({
      currentSkills,
      targetRole,
      timeframe,
    });
    res.json({ success: true, data: roadmap });
  } catch (error) {
    console.error('getSkillRoadmap error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
