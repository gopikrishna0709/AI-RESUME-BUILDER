import React, { useState } from 'react';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Sparkles,
  Plus,
  Trash2,
  RotateCw,
  CheckCircle2,
  Save,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { aiAPI } from '../../services/api';

const TABS = [
  { id: 'personal', label: 'Personal Information', shortLabel: 'Personal', icon: User },
  { id: 'summary', label: 'Professional Summary', shortLabel: 'Summary', icon: FileText },
  { id: 'experience', label: 'Work Experience', shortLabel: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills & Competencies', shortLabel: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects & Portfolio', shortLabel: 'Projects', icon: FolderGit2 },
  { id: 'education', label: 'Education & Academics', shortLabel: 'Education', icon: GraduationCap },
  { id: 'certifications', label: 'Certifications & Honors', shortLabel: 'Certifications', icon: Award },
];

export default function ResumeEditor({ resume, onChange, onSave, isSaving }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');

  // Calculate dynamic completion score
  const calculateCompletion = () => {
    let score = 0;
    if (resume?.personalInfo?.fullName && resume?.personalInfo?.email) score += 20;
    if (resume?.summary && resume.summary.length > 40) score += 20;
    if (resume?.experience && resume.experience.length > 0) score += 20;
    if (resume?.skillGroups && resume.skillGroups.length > 0) score += 15;
    if (resume?.education && resume.education.length > 0) score += 15;
    if (resume?.projects && resume.projects.length > 0) score += 10;
    return Math.min(100, score);
  };

  const completionRate = calculateCompletion();

  // Helper for updating personal details
  const updatePersonalInfo = (field, value) => {
    onChange({
      ...resume,
      personalInfo: {
        ...(resume.personalInfo || {}),
        [field]: value,
      },
    });
  };

  // AI Polish Summary
  const handleAiPolishSummary = async () => {
    try {
      setAiLoading(true);
      setAiFeedback('AI is refining your summary...');
      const allSkills = (resume.skillGroups || []).flatMap((g) => g.items || []);
      const res = await aiAPI.enhanceSummary({
        currentSummary: resume.summary,
        targetRole: resume.targetJobTitle || resume.personalInfo?.headline,
        experienceLevel: 'Senior Level',
        keySkills: allSkills,
      });

      if (res.data.success) {
        onChange({
          ...resume,
          summary: res.data.summary,
        });
        setAiFeedback('Summary successfully enhanced!');
        setTimeout(() => setAiFeedback(''), 3000);
      }
    } catch (err) {
      console.error('AI polish error:', err);
      setAiFeedback('AI enhancement failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // AI Generate Bullets
  const handleAiGenerateBullets = async (expIndex) => {
    const exp = resume.experience[expIndex];
    if (!exp) return;

    try {
      setAiLoading(true);
      setAiFeedback(`Crafting STAR impact bullets for ${exp.title || 'Role'}...`);
      const res = await aiAPI.generateBullets({
        roleTitle: exp.title,
        company: exp.company,
        context: (exp.bullets || []).join(' ') || 'Led development, improved performance, managed architecture',
        count: 3,
      });

      if (res.data.success && res.data.bullets) {
        const newExp = [...resume.experience];
        newExp[expIndex] = {
          ...exp,
          bullets: res.data.bullets,
        };
        onChange({
          ...resume,
          experience: newExp,
        });
        setAiFeedback('Generated 3 STAR bullet points!');
        setTimeout(() => setAiFeedback(''), 3000);
      }
    } catch (err) {
      console.error('AI bullets error:', err);
      setAiFeedback('AI generation failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // Experience Handlers
  const addExperience = () => {
    const newExp = [
      ...(resume.experience || []),
      {
        title: 'Software Engineer',
        company: 'Company Name',
        location: 'Remote / City',
        startDate: 'Jan 2023',
        endDate: 'Present',
        current: true,
        bullets: ['Architected scalable services and improved team sprint velocity.'],
      },
    ];
    onChange({ ...resume, experience: newExp });
  };

  const removeExperience = (idx) => {
    const newExp = resume.experience.filter((_, i) => i !== idx);
    onChange({ ...resume, experience: newExp });
  };

  const updateExperience = (idx, field, value) => {
    const newExp = [...resume.experience];
    newExp[idx] = { ...newExp[idx], [field]: value };
    onChange({ ...resume, experience: newExp });
  };

  const addExperienceBullet = (expIdx) => {
    const newExp = [...resume.experience];
    newExp[expIdx].bullets = [...(newExp[expIdx].bullets || []), ''];
    onChange({ ...resume, experience: newExp });
  };

  const updateExperienceBullet = (expIdx, bIdx, value) => {
    const newExp = [...resume.experience];
    const newBullets = [...(newExp[expIdx].bullets || [])];
    newBullets[bIdx] = value;
    newExp[expIdx].bullets = newBullets;
    onChange({ ...resume, experience: newExp });
  };

  const removeExperienceBullet = (expIdx, bIdx) => {
    const newExp = [...resume.experience];
    newExp[expIdx].bullets = newExp[expIdx].bullets.filter((_, i) => i !== bIdx);
    onChange({ ...resume, experience: newExp });
  };

  // Skills Handlers
  const addSkillGroup = () => {
    const newGroups = [
      ...(resume.skillGroups || []),
      { category: 'New Skill Category', items: ['TypeScript', 'GraphQL'] },
    ];
    onChange({ ...resume, skillGroups: newGroups });
  };

  const updateSkillGroup = (idx, category, itemsStr) => {
    const newGroups = [...resume.skillGroups];
    newGroups[idx] = {
      category,
      items: itemsStr.split(',').map((s) => s.trim()).filter(Boolean),
    };
    onChange({ ...resume, skillGroups: newGroups });
  };

  const removeSkillGroup = (idx) => {
    const newGroups = resume.skillGroups.filter((_, i) => i !== idx);
    onChange({ ...resume, skillGroups: newGroups });
  };

  // Education Handlers
  const addEducation = () => {
    const newEdu = [
      ...(resume.education || []),
      {
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        institution: 'University Name',
        graduationYear: '2023',
        gpa: '',
      },
    ];
    onChange({ ...resume, education: newEdu });
  };

  const removeEducation = (idx) => {
    const newEdu = resume.education.filter((_, i) => i !== idx);
    onChange({ ...resume, education: newEdu });
  };

  const updateEducation = (idx, field, value) => {
    const newEdu = [...resume.education];
    newEdu[idx] = { ...newEdu[idx], [field]: value };
    onChange({ ...resume, education: newEdu });
  };

  // Projects Handlers
  const addProject = () => {
    const newProj = [
      ...(resume.projects || []),
      {
        name: 'Project Title',
        role: 'Creator & Lead',
        url: '',
        techStack: ['React', 'Node.js', 'MongoDB'],
        description: 'Built a full-stack platform with real-time analytics.',
        bullets: ['Increased system performance by 30%.'],
      },
    ];
    onChange({ ...resume, projects: newProj });
  };

  const removeProject = (idx) => {
    const newProj = resume.projects.filter((_, i) => i !== idx);
    onChange({ ...resume, projects: newProj });
  };

  const updateProject = (idx, field, value) => {
    const newProj = [...resume.projects];
    if (field === 'techStack') {
      newProj[idx] = {
        ...newProj[idx],
        techStack: typeof value === 'string' ? value.split(',').map((s) => s.trim()).filter(Boolean) : value,
      };
    } else {
      newProj[idx] = { ...newProj[idx], [field]: value };
    }
    onChange({ ...resume, projects: newProj });
  };

  return (
    <div className="flex flex-col h-full bg-surface-card rounded-2xl border border-surface-border shadow-card overflow-hidden transition-colors duration-200">
      {/* Top Header & Save Toolbar */}
      <div className="p-3.5 sm:p-4 bg-surface-elevated border-b border-surface-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={resume.title || ''}
            onChange={(e) => onChange({ ...resume, title: e.target.value })}
            className="bg-transparent font-bold text-surface-text text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-plum-500 rounded px-1.5 py-0.5 border border-transparent hover:border-surface-border w-full truncate"
            placeholder="Resume Document Title"
          />
          <div className="text-[11px] text-surface-muted px-1.5 mt-0.5 flex items-center gap-1 truncate">
            <span className="shrink-0">Target:</span>
            <input
              type="text"
              value={resume.targetJobTitle || ''}
              onChange={(e) => onChange({ ...resume, targetJobTitle: e.target.value })}
              className="bg-transparent text-terracotta-600 dark:text-terracotta-400 font-semibold focus:outline-none focus:underline truncate flex-1"
              placeholder="e.g. Senior Full Stack Engineer"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 justify-between sm:justify-end shrink-0">
          {/* Progress Completion Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-surface-card px-2.5 sm:px-3 py-1.5 rounded-xl border border-surface-border text-xs">
            <span className="text-surface-muted font-medium text-[11px] hidden xs:inline">Completion:</span>
            <span className="font-bold text-plum-900 dark:text-plum-200">{completionRate}%</span>
            <div className="w-10 sm:w-12 bg-surface-elevated h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-terracotta-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold text-xs shadow-subtle active:scale-[0.98] transition-all disabled:opacity-50 min-h-[38px]"
          >
            {isSaving ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-terracotta-300" />}
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* AI Notification Banner */}
      {aiFeedback && (
        <div className="bg-plum-50 dark:bg-plum-950/80 border-b border-plum-200 dark:border-plum-800 px-4 py-2 flex items-center gap-2 text-xs text-plum-900 dark:text-plum-200">
          <Sparkles className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
          <span className="font-semibold">{aiFeedback}</span>
        </div>
      )}

      {/* Workspace Body: Left Section Navigator + Center Form Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Section Navigation Tabs (Horizontal Scroll on Mobile, Sidebar on Tablet/Desktop) */}
        <div className="w-full md:w-52 lg:w-56 bg-surface-elevated border-b md:border-b-0 md:border-r border-surface-border p-1.5 sm:p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-none">
          <div className="hidden md:block px-3 py-1.5 text-[10px] font-bold text-surface-muted uppercase tracking-wider">
            Resume Sections
          </div>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 sm:gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap md:whitespace-normal text-left min-h-[40px] ${
                  isActive
                    ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                    : 'text-surface-muted hover:text-surface-text hover:bg-surface-card'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-terracotta-300' : 'text-surface-muted'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 text-xs text-surface-text bg-surface-card">
          {/* Tab 1: Personal Information */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <h3 className="font-bold text-sm text-surface-text flex items-center gap-2">
                  <User className="w-4 h-4 text-plum-800 dark:text-plum-300" />
                  Personal Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div>
                  <label className="block text-surface-muted font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.personalInfo?.fullName || ''}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-surface-text focus:outline-none focus:border-plum-600 font-medium"
                    placeholder="e.g. Alex Rivera"
                  />
                </div>

                <div>
                  <label className="block text-surface-muted font-medium mb-1">Professional Headline</label>
                  <input
                    type="text"
                    value={resume.personalInfo?.headline || ''}
                    onChange={(e) => updatePersonalInfo('headline', e.target.value)}
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-surface-text focus:outline-none focus:border-plum-600 font-medium"
                    placeholder="e.g. Senior Full Stack Engineer"
                  />
                </div>

                <div>
                  <label className="block text-surface-muted font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={resume.personalInfo?.email || ''}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-surface-text focus:outline-none focus:border-plum-600 font-medium"
                    placeholder="alex@example.com"
                  />
                </div>

                <div>
                  <label className="block text-surface-muted font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={resume.personalInfo?.phone || ''}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-surface-text focus:outline-none focus:border-plum-600 font-medium"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-surface-muted font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={resume.personalInfo?.location || ''}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-surface-text focus:outline-none focus:border-plum-600 font-medium"
                    placeholder="San Francisco, CA / Remote"
                  />
                </div>

                <div>
                  <label className="block text-surface-muted font-medium mb-1">Portfolio Website</label>
                  <input
                    type="url"
                    value={resume.personalInfo?.portfolioUrl || ''}
                    onChange={(e) => updatePersonalInfo('portfolioUrl', e.target.value)}
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-surface-text focus:outline-none focus:border-plum-600 font-medium"
                    placeholder="https://alexrivera.dev"
                  />
                </div>

                <div>
                  <label className="block text-surface-muted font-medium mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={resume.personalInfo?.linkedinUrl || ''}
                    onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-surface-text focus:outline-none focus:border-plum-600 font-medium"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-surface-muted font-medium mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={resume.personalInfo?.githubUrl || ''}
                    onChange={(e) => updatePersonalInfo('githubUrl', e.target.value)}
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-surface-text focus:outline-none focus:border-plum-600 font-medium"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Professional Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-surface-border">
                <h3 className="font-bold text-sm text-surface-text flex items-center gap-2">
                  <FileText className="w-4 h-4 text-plum-800 dark:text-plum-300" />
                  Professional Summary
                </h3>

                <button
                  onClick={handleAiPolishSummary}
                  disabled={aiLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-plum-50 dark:bg-plum-950/80 hover:bg-plum-100 text-plum-900 dark:text-plum-200 border border-plum-200 dark:border-plum-800 font-bold transition-all disabled:opacity-50 min-h-[38px]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
                  <span>{aiLoading ? 'Enhancing...' : '✨ Generate Summary'}</span>
                </button>
              </div>

              <textarea
                rows={6}
                value={resume.summary || ''}
                onChange={(e) => onChange({ ...resume, summary: e.target.value })}
                className="w-full bg-surface-elevated border border-surface-border rounded-xl p-3 text-surface-text leading-relaxed focus:outline-none focus:border-plum-600 font-medium"
                placeholder="Write a compelling 3-4 sentence overview of your career background, core competencies, and notable accomplishments. Or click 'Generate Summary' to craft one with AI!"
              />
              <p className="text-[11px] text-surface-muted">
                💡 Tip: Strong summaries mention specific years of experience, primary technologies, and high-impact business outcomes.
              </p>
            </div>
          )}

          {/* Tab 3: Work Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-surface-border">
                <h3 className="font-bold text-sm text-surface-text flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-plum-800 dark:text-plum-300" />
                  Work Experience ({resume.experience?.length || 0})
                </h3>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold min-h-[36px]"
                >
                  <Plus className="w-3.5 h-3.5 text-terracotta-300" />
                  <span>Add Position</span>
                </button>
              </div>

              {(resume.experience || []).map((exp, expIdx) => (
                <div key={expIdx} className="bg-surface-elevated rounded-2xl p-3.5 sm:p-4 border border-surface-border space-y-3 shadow-subtle">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-surface-text text-xs">#{expIdx + 1} Work Experience</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAiGenerateBullets(expIdx)}
                        disabled={aiLoading}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-terracotta-50 dark:bg-terracotta-950/60 hover:bg-terracotta-100 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-200 dark:border-terracotta-800 font-bold text-[11px] min-h-[32px]"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>✨ Improve Bullet</span>
                      </button>
                      <button
                        onClick={() => removeExperience(expIdx)}
                        className="p-1.5 text-surface-muted hover:text-terracotta-600 rounded-lg hover:bg-surface-card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="block text-surface-muted font-medium mb-1">Job Title</label>
                      <input
                        type="text"
                        value={exp.title || ''}
                        onChange={(e) => updateExperience(expIdx, 'title', e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                        placeholder="e.g. Senior Full Stack Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-surface-muted font-medium mb-1">Company</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => updateExperience(expIdx, 'company', e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                        placeholder="e.g. Apex Cloud Solutions"
                      />
                    </div>
                    <div>
                      <label className="block text-surface-muted font-medium mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={(e) => updateExperience(expIdx, 'startDate', e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                        placeholder="e.g. Jan 2022"
                      />
                    </div>
                    <div>
                      <label className="block text-surface-muted font-medium mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate || ''}
                        onChange={(e) => updateExperience(expIdx, 'endDate', e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                        placeholder="e.g. Present"
                      />
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-surface-border">
                    <div className="flex justify-between items-center">
                      <span className="text-surface-muted font-bold text-[11px]">STAR Bullet Points:</span>
                      <button
                        onClick={() => addExperienceBullet(expIdx)}
                        className="text-plum-900 dark:text-plum-300 font-bold hover:underline text-[11px] flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3 text-terracotta-500" /> Add bullet
                      </button>
                    </div>

                    {(exp.bullets || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <span className="text-terracotta-500 mt-2 font-bold shrink-0">•</span>
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => updateExperienceBullet(expIdx, bIdx, e.target.value)}
                          className="flex-1 bg-surface-card border border-surface-border rounded-lg p-2 text-surface-text text-xs leading-snug"
                          placeholder="Action Verb + What you built + Measurable outcome (e.g. Architected microservices decreasing latency by 40%)"
                        />
                        <button
                          onClick={() => removeExperienceBullet(expIdx, bIdx)}
                          className="p-1 text-surface-muted hover:text-terracotta-600 mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Skills */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-surface-border">
                <h3 className="font-bold text-sm text-surface-text flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-plum-800 dark:text-plum-300" />
                  Technical Skills
                </h3>
                <button
                  onClick={addSkillGroup}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold min-h-[36px]"
                >
                  <Plus className="w-3.5 h-3.5 text-terracotta-300" />
                  <span>Add Group</span>
                </button>
              </div>

              <div className="space-y-3">
                {(resume.skillGroups || []).map((group, gIdx) => (
                  <div key={gIdx} className="bg-surface-elevated p-3.5 rounded-2xl border border-surface-border space-y-2 shadow-subtle">
                    <div className="flex justify-between items-center gap-2">
                      <input
                        type="text"
                        value={group.category}
                        onChange={(e) => updateSkillGroup(gIdx, e.target.value, (group.items || []).join(', '))}
                        className="bg-surface-card border border-surface-border rounded-lg px-2.5 py-1 text-surface-text font-bold text-xs"
                        placeholder="Category (e.g. Frontend & UI)"
                      />
                      <button
                        onClick={() => removeSkillGroup(gIdx)}
                        className="p-1 text-surface-muted hover:text-terracotta-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-surface-muted text-[11px] mb-1 font-medium">Skills (comma-separated)</label>
                      <input
                        type="text"
                        value={(group.items || []).join(', ')}
                        onChange={(e) => updateSkillGroup(gIdx, group.category, e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                        placeholder="React.js, TypeScript, Next.js, Redux"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-surface-border">
                <h3 className="font-bold text-sm text-surface-text flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-plum-800 dark:text-plum-300" />
                  Featured Projects ({resume.projects?.length || 0})
                </h3>
                <button
                  onClick={addProject}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold min-h-[36px]"
                >
                  <Plus className="w-3.5 h-3.5 text-terracotta-300" />
                  <span>Add Project</span>
                </button>
              </div>

              {(resume.projects || []).map((proj, pIdx) => (
                <div key={pIdx} className="bg-surface-elevated p-3.5 sm:p-4 rounded-2xl border border-surface-border space-y-3 shadow-subtle">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-surface-text text-xs">Project #{pIdx + 1}</span>
                    <button onClick={() => removeProject(pIdx)} className="text-surface-muted hover:text-terracotta-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="block text-surface-muted font-medium mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.name || ''}
                        onChange={(e) => updateProject(pIdx, 'name', e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                        placeholder="e.g. AI Career Engine"
                      />
                    </div>
                    <div>
                      <label className="block text-surface-muted font-medium mb-1">Live Demo / Repository</label>
                      <input
                        type="url"
                        value={proj.url || ''}
                        onChange={(e) => updateProject(pIdx, 'url', e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-surface-muted font-medium mb-1">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={(proj.techStack || []).join(', ')}
                      onChange={(e) => updateProject(pIdx, 'techStack', e.target.value)}
                      className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                      placeholder="React, Node.js, MongoDB Atlas, Gemini AI"
                    />
                  </div>

                  <div>
                    <label className="block text-surface-muted font-medium mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={proj.description || ''}
                      onChange={(e) => updateProject(pIdx, 'description', e.target.value)}
                      className="w-full bg-surface-card border border-surface-border rounded-lg p-2 text-surface-text"
                      placeholder="Explain what problem this project solves and measurable metrics."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 6: Education */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-surface-border">
                <h3 className="font-bold text-sm text-surface-text flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-plum-800 dark:text-plum-300" />
                  Education
                </h3>
                <button
                  onClick={addEducation}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold min-h-[36px]"
                >
                  <Plus className="w-3.5 h-3.5 text-terracotta-300" />
                  <span>Add Degree</span>
                </button>
              </div>

              {(resume.education || []).map((edu, eIdx) => (
                <div key={eIdx} className="bg-surface-elevated p-3.5 sm:p-4 rounded-2xl border border-surface-border space-y-3 shadow-subtle">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-surface-text text-xs">Degree #{eIdx + 1}</span>
                    <button onClick={() => removeEducation(eIdx)} className="text-surface-muted hover:text-terracotta-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="block text-surface-muted font-medium mb-1">Degree</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => updateEducation(eIdx, 'degree', e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div>
                      <label className="block text-surface-muted font-medium mb-1">Field of Study</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => updateEducation(eIdx, 'fieldOfStudy', e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-surface-muted font-medium mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => updateEducation(eIdx, 'institution', e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                        placeholder="UC Berkeley"
                      />
                    </div>
                    <div>
                      <label className="block text-surface-muted font-medium mb-1">Graduation Year</label>
                      <input
                        type="text"
                        value={edu.graduationYear || ''}
                        onChange={(e) => updateEducation(eIdx, 'graduationYear', e.target.value)}
                        className="w-full bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text"
                        placeholder="2019"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 7: Certifications */}
          {activeTab === 'certifications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-surface-border">
                <h3 className="font-bold text-sm text-surface-text flex items-center gap-2">
                  <Award className="w-4 h-4 text-plum-800 dark:text-plum-300" />
                  Certifications & Credentials
                </h3>
              </div>

              <div className="space-y-3">
                {(resume.certifications || []).map((cert, cIdx) => (
                  <div key={cIdx} className="bg-surface-elevated p-3 rounded-2xl border border-surface-border flex items-center justify-between gap-2 shadow-subtle">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const newC = [...resume.certifications];
                          newC[cIdx].name = e.target.value;
                          onChange({ ...resume, certifications: newC });
                        }}
                        className="bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text text-xs"
                        placeholder="Certification (e.g. AWS Solutions Architect)"
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => {
                          const newC = [...resume.certifications];
                          newC[cIdx].issuer = e.target.value;
                          onChange({ ...resume, certifications: newC });
                        }}
                        className="bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 text-surface-text text-xs"
                        placeholder="Issuer (e.g. Amazon Web Services)"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newC = resume.certifications.filter((_, i) => i !== cIdx);
                        onChange({ ...resume, certifications: newC });
                      }}
                      className="p-1 text-surface-muted hover:text-terracotta-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const newC = [...(resume.certifications || []), { name: '', issuer: '' }];
                    onChange({ ...resume, certifications: newC });
                  }}
                  className="w-full py-2.5 border border-dashed border-surface-border rounded-xl text-xs font-bold text-plum-900 dark:text-plum-300 hover:bg-surface-elevated transition-colors flex items-center justify-center gap-1.5 min-h-[42px]"
                >
                  <Plus className="w-3.5 h-3.5 text-terracotta-500" />
                  <span>Add Another Certification</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
