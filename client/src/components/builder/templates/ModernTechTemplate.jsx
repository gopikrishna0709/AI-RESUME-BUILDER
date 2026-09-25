import React from 'react';
import { Mail, Phone, MapPin, Globe, Award, Sparkles, ExternalLink, Link, Code2 } from 'lucide-react';

export default function ModernTechTemplate({ resume }) {
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

  const primaryColor = theme?.primaryColor || '#2563eb';

  return (
    <div className="resume-paper p-8 text-slate-800 font-sans leading-relaxed text-sm bg-white" id="resume-document">
      {/* Header */}
      <div className="border-b-2 pb-6" style={{ borderColor: `${primaryColor}33` }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900" style={{ color: primaryColor }}>
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            <p className="text-base font-semibold text-slate-600 mt-1">
              {personalInfo.headline || 'Your Target Job Role / Professional Headline'}
            </p>
          </div>
          {resume.atsScore ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATS Score: {resume.atsScore}%</span>
            </div>
          ) : null}
        </div>

        {/* Contact info grid */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3.5 text-xs text-slate-600 font-medium">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.portfolioUrl && (
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                Portfolio
              </a>
            </div>
          )}
          {personalInfo.linkedinUrl && (
            <div className="flex items-center gap-1">
              <Link className="w-3.5 h-3.5 text-slate-400" />
              <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                LinkedIn
              </a>
            </div>
          )}
          {personalInfo.githubUrl && (
            <div className="flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-slate-400" />
              <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                GitHub
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
            Professional Summary
          </h2>
          <p className="text-slate-700 text-[13px] leading-relaxed text-justify">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="relative pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                  <div>
                    <span className="font-bold text-slate-900 text-[13.5px]">{exp.title}</span>
                    <span className="text-slate-500 font-medium text-xs"> — {exp.company}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.location && <div className="text-[11px] text-slate-400 mb-1.5">{exp.location}</div>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-slate-700 text-[12.5px]">
                    {exp.bullets.filter(b => b.trim()).map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-snug">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skillGroups && skillGroups.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
            Technical Skills & Proficiencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12.5px]">
            {skillGroups.map((group, idx) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-100">
                <span className="font-bold text-slate-800">{group.category}: </span>
                <span className="text-slate-600">{(group.items || []).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="bg-slate-50/70 p-3 rounded border border-slate-100">
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-slate-900 text-[13px]">
                    {proj.name}
                    {proj.role && <span className="font-normal text-slate-500 text-xs"> ({proj.role})</span>}
                  </div>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
                      Live Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="text-[11px] font-semibold text-blue-600 mt-0.5">
                    Tech Stack: {proj.techStack.join(' • ')}
                  </div>
                )}
                {proj.description && <p className="text-slate-600 text-xs mt-1">{proj.description}</p>}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700 text-xs">
                    {proj.bullets.filter(b => b.trim()).map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        {education && education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <div className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</div>
                  <div className="text-slate-600">{edu.institution} {edu.graduationYear && `(${edu.graduationYear})`}</div>
                  {edu.gpa && <div className="text-slate-500 text-[11px]">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Certifications & Honors
            </h2>
            <div className="space-y-1.5">
              {certifications.map((cert, idx) => (
                <div key={idx} className="text-xs flex items-start gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">{cert.name}</span>
                    <span className="text-slate-500"> — {cert.issuer} {cert.issueDate && `(${cert.issueDate})`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
