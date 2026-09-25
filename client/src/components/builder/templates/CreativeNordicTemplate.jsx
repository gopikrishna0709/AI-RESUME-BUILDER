import React from 'react';
import { Mail, Phone, MapPin, Globe, Link, Code2 } from 'lucide-react';

export default function CreativeNordicTemplate({ resume }) {
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

  const primaryColor = theme?.primaryColor || '#0f766e';

  return (
    <div className="resume-paper flex flex-col md:flex-row bg-white text-slate-800 text-xs leading-relaxed" id="resume-document">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/3 bg-slate-900 text-slate-100 p-6 space-y-6 shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white font-display">
            {personalInfo.fullName || 'Your Full Name'}
          </h1>
          <p className="text-teal-400 font-medium text-xs mt-1">
            {personalInfo.headline || 'Creative Developer / Specialist'}
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-2 pt-2 border-t border-slate-800 text-[11.5px]">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact</h2>
          {personalInfo.email && (
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.portfolioUrl && (
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="text-teal-300 hover:underline truncate">
                {personalInfo.portfolioUrl.replace('https://', '')}
              </a>
            </div>
          )}
          {personalInfo.githubUrl && (
            <div className="flex items-center gap-2 text-slate-300">
              <Code2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="truncate">GitHub Profile</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skillGroups && skillGroups.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Skills</h2>
            {skillGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-teal-400 font-semibold text-[11px]">{group.category}</span>
                <div className="flex flex-wrap gap-1">
                  {(group.items || []).map((skill, sIdx) => (
                    <span key={sIdx} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[10.5px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="text-[11px]">
                <div className="font-bold text-white">{edu.degree}</div>
                <div className="text-teal-400">{edu.fieldOfStudy}</div>
                <div className="text-slate-400">{edu.institution} ({edu.graduationYear})</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Right Content */}
      <div className="w-full md:w-2/3 p-6 space-y-5">
        {/* Summary */}
        {summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700 border-b-2 border-teal-600 pb-1 mb-2">
              Profile Summary
            </h2>
            <p className="text-slate-700 text-xs leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700 border-b-2 border-teal-600 pb-1 mb-3">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[13px]">{exp.title}</span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-teal-700">{exp.company} {exp.location && `• ${exp.location}`}</div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-slate-700 text-xs">
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

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700 border-b-2 border-teal-600 pb-1 mb-2">
              Featured Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj, idx) => (
                <div key={idx} className="border-l-2 border-teal-500 pl-3">
                  <div className="font-bold text-slate-900 text-xs">{proj.name}</div>
                  {proj.description && <p className="text-slate-600 text-[11.5px] mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
