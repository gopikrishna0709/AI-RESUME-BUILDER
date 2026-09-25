import React from 'react';

export default function ExecutiveTemplate({ resume }) {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skillGroups = [],
    projects = [],
    certifications = [],
    theme = {},
  } = resume;

  const primaryColor = theme?.primaryColor || '#1e293b';

  return (
    <div className="resume-paper p-10 text-slate-800 font-serif leading-relaxed text-[13.5px] bg-white" id="resume-document">
      {/* Centered Header */}
      <div className="text-center pb-5 border-b border-slate-300">
        <h1 className="text-3xl tracking-wide font-normal uppercase text-slate-900 font-serif" style={{ color: primaryColor }}>
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <p className="text-sm italic text-slate-600 mt-1 font-sans">
          {personalInfo.headline || 'Senior Executive / Professional'}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-2 text-xs font-sans text-slate-600">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.location && personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span>•</span>}
          {personalInfo.email && <span className="font-medium text-slate-900">{personalInfo.email}</span>}
          {personalInfo.linkedinUrl && (
            <>
              <span>•</span>
              <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                LinkedIn
              </a>
            </>
          )}
          {personalInfo.portfolioUrl && (
            <>
              <span>•</span>
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      {summary && (
        <div className="mt-5">
          <h2 className="text-xs font-bold font-sans uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-2">
            Executive Summary
          </h2>
          <p className="text-slate-700 text-justify leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Professional Experience */}
      {experience && experience.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold font-sans uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4 font-sans">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">{exp.title}</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-slate-600 italic">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-slate-700 text-[12.5px] leading-relaxed">
                    {exp.bullets.filter(b => b.trim()).map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Competencies & Skills */}
      {skillGroups && skillGroups.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold font-sans uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-2">
            Core Competencies & Skills
          </h2>
          <div className="space-y-1.5 font-sans text-xs">
            {skillGroups.map((group, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-bold text-slate-800 min-w-[140px]">{group.category}:</span>
                <span className="text-slate-600">{(group.items || []).join(' • ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold font-sans uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2 font-sans text-xs">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-slate-600"> — {edu.institution}</span>
                </div>
                <span className="text-slate-500">{edu.graduationYear}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
