import React from 'react';

export default function CompactAtsTemplate({ resume }) {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skillGroups = [],
    projects = [],
    certifications = [],
  } = resume;

  return (
    <div className="resume-paper p-8 text-black font-sans leading-tight text-xs bg-white space-y-3.5" id="resume-document">
      {/* Header */}
      <div className="text-center pb-2 border-b-2 border-black">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-black">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <div className="text-xs text-black mt-1 font-medium">
          {[
            personalInfo.location,
            personalInfo.phone,
            personalInfo.email,
            personalInfo.linkedinUrl,
            personalInfo.githubUrl,
          ].filter(Boolean).join(' | ')}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-black text-justify leading-snug">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skillGroups && skillGroups.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">
            TECHNICAL SKILLS
          </h2>
          <div className="space-y-0.5">
            {skillGroups.map((g, idx) => (
              <div key={idx} className="text-black">
                <span className="font-bold">{g.category}: </span>
                <span>{(g.items || []).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-2.5">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-black">
                  <span>{exp.title} – {exp.company}</span>
                  <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <div className="italic text-[11px] text-gray-700">{exp.location}</div>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-black">
                    {exp.bullets.filter(b => b.trim()).map((b, bIdx) => (
                      <li key={bIdx} className="leading-snug">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">
            EDUCATION
          </h2>
          <div className="space-y-1">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <span className="font-bold">{edu.institution}</span>, {edu.location} — <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  {edu.gpa && <span> (GPA: {edu.gpa})</span>}
                </div>
                <span className="font-bold">{edu.graduationYear}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">
            PROJECTS
          </h2>
          <div className="space-y-1.5">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="font-bold text-black">
                  {proj.name} {proj.techStack?.length > 0 && `| [${proj.techStack.join(', ')}]`}
                </div>
                {proj.description && <p className="text-black text-[11.5px]">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
