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
  ChevronDown,
  ChevronUp,
  RotateCw,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { aiAPI } from '../../services/api';

const TABS = [
  { id: 'personal', label: 'Contact', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certifications', label: 'Certifications', icon: Award },
];

export default function ResumeEditor({ resume, onChange, onSave, isSaving }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');

  // Helpers for nested updates
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
      setAiFeedback('AI is crafting an ATS-optimized summary...');
      const allSkills = (resume.skillGroups || []).flatMap((g) => g.items || []);
      const res = await aiAPI.enhanceSummary({
        currentSummary: resume.summary,
        targetRole: resume.targetJobTitle || resume.personalInfo?.headline,
        experienceLevel: 'Senior / Experienced',
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
      setAiFeedback('AI generation failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // AI Generate Bullets for a specific experience item
  const handleAiGenerateBullets = async (expIndex) => {
    const exp = resume.experience[expIndex];
    if (!exp) return;

    try {
      setAiLoading(true);
      setAiFeedback(`Generating STAR bullets for ${exp.title || 'Role'}...`);
      const res = await aiAPI.generateBullets({
        roleTitle: exp.title,
        company: exp.company,
        context: (exp.bullets || []).join(' ') || 'Implemented key features and optimized performance',
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
        setAiFeedback('Generated 3 high-impact STAR bullets!');
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
        location: 'Remote',
        startDate: 'Jan 2023',
        endDate: 'Present',
        current: true,
        bullets: ['Spearheaded development of scalable features and reduced system latency.'],
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
      { category: 'New Skill Category', items: ['Skill 1', 'Skill 2'] },
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
    <div className="flex flex-col h-full bg-slate-900/80 rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Top Header & Save Button */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
        <div>
          <input
            type="text"
            value={resume.title || ''}
            onChange={(e) => onChange({ ...resume, title: e.target.value })}
            className="bg-transparent font-bold text-white text-base focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1.5 py-0.5 border border-transparent hover:border-slate-700"
            placeholder="Resume Title"
          />
          <div className="text-[11px] text-slate-400 px-1.5">
            Target Role:{' '}
            <input
              type="text"
              value={resume.targetJobTitle || ''}
              onChange={(e) => onChange({ ...resume, targetJobTitle: e.target.value })}
              className="bg-transparent text-blue-400 font-medium focus:outline-none focus:underline"
              placeholder="e.g. Senior Full Stack Engineer"
            />
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
        >
          {isSaving ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Saving...' : 'Save Resume'}</span>
        </button>
      </div>

      {/* AI Notification Banner */}
      {aiFeedback && (
        <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-b border-blue-500/30 px-4 py-2 flex items-center gap-2 text-xs text-blue-200 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{aiFeedback}</span>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex overflow-x-auto bg-slate-950/80 border-b border-slate-800 p-1.5 gap-1 text-xs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-200">
        {/* Tab 1: Personal Info */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Personal & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.personalInfo?.fullName || ''}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Professional Headline / Title</label>
                <input
                  type="text"
                  value={resume.personalInfo?.headline || ''}
                  onChange={(e) => updatePersonalInfo('headline', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Senior Full Stack Engineer"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={resume.personalInfo?.email || ''}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="alex@example.com"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resume.personalInfo?.phone || ''}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={resume.personalInfo?.location || ''}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="San Francisco, CA / Remote"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Portfolio / Personal Website</label>
                <input
                  type="url"
                  value={resume.personalInfo?.portfolioUrl || ''}
                  onChange={(e) => updatePersonalInfo('portfolioUrl', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://portfolio.dev"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={resume.personalInfo?.linkedinUrl || ''}
                  onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={resume.personalInfo?.githubUrl || ''}
                  onChange={(e) => updatePersonalInfo('githubUrl', e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Professional Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Professional Summary
              </h3>

              <button
                onClick={handleAiPolishSummary}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiLoading ? 'Enhancing...' : '✨ AI Polish & Enhance'}</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={resume.summary || ''}
              onChange={(e) => onChange({ ...resume, summary: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-white leading-relaxed focus:outline-none focus:border-blue-500"
              placeholder="Write a brief 3-4 sentence overview of your career background, core competencies, and notable accomplishments. Or click 'AI Polish' to generate automatically!"
            />
            <p className="text-[11px] text-slate-400">
              💡 Tip: An ATS-tailored summary clearly mentions your years of experience, core tech stack, and quantified business impact.
            </p>
          </div>
        )}

        {/* Tab 3: Work Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                Work Experience ({resume.experience?.length || 0})
              </h3>
              <button
                onClick={addExperience}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 border border-blue-500/30 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            {(resume.experience || []).map((exp, expIdx) => (
              <div key={expIdx} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/80 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-semibold text-white text-xs">#{expIdx + 1} Position</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAiGenerateBullets(expIdx)}
                      disabled={aiLoading}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/30 font-medium text-[11px]"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>✨ AI Bullets</span>
                    </button>
                    <button
                      onClick={() => removeExperience(expIdx)}
                      className="p-1 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.title || ''}
                      onChange={(e) => updateExperience(expIdx, 'title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="e.g. Senior Frontend Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => updateExperience(expIdx, 'company', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="e.g. Acme Tech"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate || ''}
                      onChange={(e) => updateExperience(expIdx, 'startDate', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="e.g. Jan 2022"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">End Date</label>
                    <input
                      type="text"
                      value={exp.endDate || ''}
                      onChange={(e) => updateExperience(expIdx, 'endDate', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="e.g. Present"
                    />
                  </div>
                </div>

                {/* Bullet Points */}
                <div className="space-y-2 pt-2 border-t border-slate-700/60">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium text-[11px]">STAR Bullet Points & Impact:</span>
                    <button
                      onClick={() => addExperienceBullet(expIdx)}
                      className="text-blue-400 hover:underline text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add bullet
                    </button>
                  </div>

                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-2 font-bold">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => updateExperienceBullet(expIdx, bIdx, e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs leading-snug"
                        placeholder="Action Verb + What You Built + Quantifiable Result (e.g. Increased speed by 40%)"
                      />
                      <button
                        onClick={() => removeExperienceBullet(expIdx, bIdx)}
                        className="p-1 text-slate-500 hover:text-red-400 mt-1"
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
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                Technical & Core Skills
              </h3>
              <button
                onClick={addSkillGroup}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 border border-blue-500/30 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-3">
              {(resume.skillGroups || []).map((group, gIdx) => (
                <div key={gIdx} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <input
                      type="text"
                      value={group.category}
                      onChange={(e) => updateSkillGroup(gIdx, e.target.value, (group.items || []).join(', '))}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-semibold text-xs"
                      placeholder="Category (e.g. Languages & Frameworks)"
                    />
                    <button
                      onClick={() => removeSkillGroup(gIdx)}
                      className="p-1 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={(group.items || []).join(', ')}
                      onChange={(e) => updateSkillGroup(gIdx, group.category, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="React, TypeScript, Node.js, Docker, MongoDB"
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
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-blue-400" />
                Featured Projects ({resume.projects?.length || 0})
              </h3>
              <button
                onClick={addProject}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 border border-blue-500/30 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {(resume.projects || []).map((proj, pIdx) => (
              <div key={pIdx} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white text-xs">Project #{pIdx + 1}</span>
                  <button onClick={() => removeProject(pIdx)} className="text-slate-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={proj.name || ''}
                      onChange={(e) => updateProject(pIdx, 'name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="e.g. AI Resume Engine"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Live Demo / Repository URL</label>
                    <input
                      type="url"
                      value={proj.url || ''}
                      onChange={(e) => updateProject(pIdx, 'url', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={(proj.techStack || []).join(', ')}
                    onChange={(e) => updateProject(pIdx, 'techStack', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    placeholder="React, Node.js, Gemini API, Tailwind"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Project Description & Outcomes</label>
                  <textarea
                    rows={2}
                    value={proj.description || ''}
                    onChange={(e) => updateProject(pIdx, 'description', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    placeholder="Briefly explain what the application achieves and key metrics."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 6: Education */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                Education & Academics
              </h3>
              <button
                onClick={addEducation}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 border border-blue-500/30 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            {(resume.education || []).map((edu, eIdx) => (
              <div key={eIdx} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white text-xs">Degree #{eIdx + 1}</span>
                  <button onClick={() => removeEducation(eIdx)} className="text-slate-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => updateEducation(eIdx, 'degree', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="e.g. Bachelor of Science"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Field of Study / Major</label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy || ''}
                      onChange={(e) => updateEducation(eIdx, 'fieldOfStudy', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Institution / University</label>
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => updateEducation(eIdx, 'institution', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="Stanford University"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={edu.graduationYear || ''}
                      onChange={(e) => updateEducation(eIdx, 'graduationYear', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      placeholder="2022"
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
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              Certifications & Professional Credentials
            </h3>
            <div className="space-y-3">
              {(resume.certifications || []).map((cert, cIdx) => (
                <div key={cIdx} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80 flex items-center justify-between gap-2">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => {
                        const newC = [...resume.certifications];
                        newC[cIdx].name = e.target.value;
                        onChange({ ...resume, certifications: newC });
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                      placeholder="Certification Name (e.g. AWS Solutions Architect)"
                    />
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => {
                        const newC = [...resume.certifications];
                        newC[cIdx].issuer = e.target.value;
                        onChange({ ...resume, certifications: newC });
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                      placeholder="Issuer (e.g. Amazon Web Services)"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newC = resume.certifications.filter((_, i) => i !== cIdx);
                      onChange({ ...resume, certifications: newC });
                    }}
                    className="p-1 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newC = [
                    ...(resume.certifications || []),
                    { name: 'Certified Cloud Practitioner', issuer: 'AWS', issueDate: '2023' },
                  ];
                  onChange({ ...resume, certifications: newC });
                }}
                className="w-full py-2 border border-dashed border-slate-700 hover:border-slate-500 rounded-xl text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certification</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
