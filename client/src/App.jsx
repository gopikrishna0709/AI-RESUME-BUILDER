import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import HomeHub from './components/home/HomeHub';
import ResumeEditor from './components/builder/ResumeEditor';
import ResumePreview from './components/builder/ResumePreview';
import AiResumeTools from './components/tools/AiResumeTools';
import JobMatcherDashboard from './components/matcher/JobMatcherDashboard';
import JobBoard from './components/jobs/JobBoard';
import CareerAiHub from './components/career/CareerAiHub';
import { resumeAPI } from './services/api';
import { useAuth } from './context/AuthContext';
import { Sparkles, Plus, Copy, CheckCircle2, LayoutTemplate, Eye, Edit3 } from 'lucide-react';
import AnimatedCareerBackground from './components/background/AnimatedCareerBackground';

const DEFAULT_RESUME = {
  title: 'Full Stack Engineer Resume',
  targetJobTitle: 'Senior Full Stack Engineer',
  template: 'modern-tech',
  theme: {
    primaryColor: '#4A1525',
    fontFamily: 'Inter',
    fontSize: 'normal',
    spacing: 'normal',
  },
  personalInfo: {
    fullName: 'Alex Rivera',
    headline: 'Senior Full Stack Engineer | React, Node.js, Cloud Architecture',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA (Remote)',
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
      ],
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
      ],
    },
  ],
  education: [
    {
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      institution: 'University of California, Berkeley',
      graduationYear: '2019',
      gpa: '3.85',
    },
  ],
  skillGroups: [
    {
      category: 'Frontend & UI',
      items: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'HTML5/CSS3'],
    },
    {
      category: 'Backend & Cloud',
      items: ['Node.js', 'Express', 'Python', 'REST APIs', 'GraphQL', 'AWS', 'Docker', 'Microservices'],
    },
    {
      category: 'Databases & Tools',
      items: ['MongoDB Atlas', 'PostgreSQL', 'Redis', 'Git / GitHub', 'Jest / Cypress', 'CI/CD'],
    },
  ],
  projects: [
    {
      name: 'DevFlow - AI Code Review Assistant',
      role: 'Creator & Lead',
      url: 'https://devflow.app',
      techStack: ['React', 'Node.js', 'Gemini AI', 'MongoDB'],
      description: 'Automated AI code review assistant that analyzes pull requests and suggests performance patches.',
      bullets: ['Implemented automated PR webhooks integrated with Gemini models to deliver instant contextual code reviews.'],
    },
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2023',
    },
  ],
  atsScore: 94,
};

export default function App() {
  const { isAuthenticated, demoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'builder' | 'matcher' | 'tools' | 'jobs' | 'career'
  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(DEFAULT_RESUME);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileBuilderView, setMobileBuilderView] = useState('editor'); // 'editor' | 'preview'
  const [isAnalyzingMatch, setIsAnalyzingMatch] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadResumes();
    } else {
      demoLogin().catch(() => {});
    }
  }, [isAuthenticated]);

  const loadResumes = async () => {
    try {
      const res = await resumeAPI.getResumes();
      if (res.data.success && res.data.data.length > 0) {
        setResumes(res.data.data);
        setActiveResume(res.data.data[0]);
      }
    } catch (err) {
      console.error('Failed to load user resumes:', err);
    }
  };

  const handleSaveResume = async () => {
    try {
      setIsSaving(true);
      if (activeResume._id) {
        const res = await resumeAPI.updateResume(activeResume._id, activeResume);
        if (res.data.success) {
          setActiveResume(res.data.data);
          showToast('Resume saved successfully to MongoDB Atlas!');
        }
      } else {
        const res = await resumeAPI.createResume(activeResume);
        if (res.data.success) {
          setActiveResume(res.data.data);
          loadResumes();
          showToast('New resume created successfully!');
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('Error saving resume. Changes kept locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewResume = async () => {
    try {
      const res = await resumeAPI.createResume({
        title: `Resume ${resumes.length + 1}`,
        targetJobTitle: 'Full Stack Engineer',
        preset: 'software-engineer',
      });
      if (res.data.success) {
        setResumes([res.data.data, ...resumes]);
        setActiveResume(res.data.data);
        setActiveTab('builder');
        showToast('Created new resume from template!');
      }
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  const handleDuplicateResume = async () => {
    if (!activeResume._id) return;
    try {
      const res = await resumeAPI.duplicateResume(activeResume._id);
      if (res.data.success) {
        setResumes([res.data.data, ...resumes]);
        setActiveResume(res.data.data);
        showToast('Duplicated resume successfully!');
      }
    } catch (err) {
      console.error('Duplicate error:', err);
    }
  };

  const handleUpdateTheme = (themeUpdates) => {
    setActiveResume((prev) => ({
      ...prev,
      theme: { ...(prev.theme || {}), ...themeUpdates },
    }));
  };

  const handleSelectTemplate = (templateId) => {
    setActiveResume((prev) => ({
      ...prev,
      template: templateId,
    }));
  };

  const handleResumeUpdated = (updatedResume) => {
    setActiveResume(updatedResume);
    loadResumes();
    showToast('✨ Resume updated successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg text-surface-text font-sans selection:bg-plum-900 selection:text-plum-50 transition-colors duration-200 relative">
      {/* Signature Animated Career Network Background */}
      <AnimatedCareerBackground
        variant={activeTab}
        isMatching={isAnalyzingMatch}
      />

      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <AuthModal />

      {/* Floating Solid Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-surface-card border border-surface-border text-surface-text px-4 py-3 rounded-2xl shadow-lift flex items-center gap-2.5 text-xs font-bold animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="relative z-10 flex-1 p-3 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto pb-24 lg:pb-8">
        {/* Tab 0: Home Hub */}
        {activeTab === 'home' && (
          <HomeHub
            activeResume={activeResume}
            onSelectTab={setActiveTab}
            onOpenCreateResume={handleCreateNewResume}
          />
        )}

        {/* Tab 1: Resume Builder */}
        {activeTab === 'builder' && (
          <div className="space-y-4">
            {/* Top Selector Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-card border border-surface-border p-3 sm:px-4 sm:py-3 rounded-2xl shadow-subtle">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-surface-text shrink-0">
                  <LayoutTemplate className="w-4 h-4 text-plum-800 dark:text-plum-300" />
                  <span className="hidden xs:inline">Active Resume:</span>
                </div>

                <select
                  value={activeResume._id || ''}
                  onChange={(e) => {
                    const found = resumes.find((r) => r._id === e.target.value);
                    if (found) setActiveResume(found);
                  }}
                  className="flex-1 sm:flex-none bg-surface-elevated border border-surface-border text-xs rounded-xl px-3 py-1.5 text-surface-text font-semibold focus:outline-none focus:border-plum-600"
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.title} ({r.template})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile View Toggle & Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <div className="flex lg:hidden bg-surface-elevated p-0.5 rounded-xl border border-surface-border text-xs font-semibold">
                  <button
                    onClick={() => setMobileBuilderView('editor')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                      mobileBuilderView === 'editor'
                        ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                        : 'text-surface-muted hover:text-surface-text'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setMobileBuilderView('preview')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                      mobileBuilderView === 'preview'
                        ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                        : 'text-surface-muted hover:text-surface-text'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handleCreateNewResume}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-hover text-surface-text border border-surface-border text-xs font-bold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-terracotta-500" />
                    <span className="hidden xs:inline">New</span>
                  </button>

                  <button
                    onClick={handleDuplicateResume}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-hover text-surface-text border border-surface-border text-xs font-bold transition-all"
                  >
                    <Copy className="w-3.5 h-3.5 text-terracotta-500" />
                    <span className="hidden xs:inline">Clone</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('matcher')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white text-xs font-bold shadow-subtle transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-terracotta-300" />
                    <span className="hidden sm:inline">Test ATS Match</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dual Pane on Desktop / Responsive View on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div
                className={`lg:col-span-6 h-[750px] sm:h-[820px] ${
                  mobileBuilderView === 'preview' ? 'hidden lg:block' : 'block'
                }`}
              >
                <ResumeEditor
                  resume={activeResume}
                  onChange={setActiveResume}
                  onSave={handleSaveResume}
                  isSaving={isSaving}
                />
              </div>

              <div
                className={`lg:col-span-6 h-[750px] sm:h-[820px] ${
                  mobileBuilderView === 'editor' ? 'hidden lg:block' : 'block'
                }`}
              >
                <ResumePreview
                  resume={activeResume}
                  onUpdateTheme={handleUpdateTheme}
                  onSelectTemplate={handleSelectTemplate}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AI Job Matcher */}
        {activeTab === 'matcher' && (
          <JobMatcherDashboard
            activeResume={activeResume}
            onResumeUpdated={handleResumeUpdated}
            onNavigateToCareer={() => setActiveTab('career')}
            onMatchingStateChange={setIsAnalyzingMatch}
          />
        )}

        {/* Tab 3: AI Resume Tools */}
        {activeTab === 'tools' && (
          <AiResumeTools
            activeResume={activeResume}
            onUpdateResume={handleResumeUpdated}
          />
        )}

        {/* Tab 4: Job Recommendations */}
        {activeTab === 'jobs' && (
          <JobBoard
            activeResume={activeResume}
            onSelectJobForMatch={(jobId) => setActiveTab('matcher')}
          />
        )}

        {/* Tab 5: Career AI */}
        {activeTab === 'career' && (
          <CareerAiHub activeResume={activeResume} />
        )}
      </main>
    </div>
  );
}
