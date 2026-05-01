import React from 'react';

export function ResumeApp() {
  const experiences = [
    {
      role: 'Senior Full Stack Developer',
      company: 'Tech Innovations Inc.',
      duration: '2022 - Present',
      description: 'Led a team of 5 developers building scalable web applications using Next.js and Node.js. Improved system performance by 40%.'
    },
    {
      role: 'Frontend Engineer',
      company: 'Creative Solutions',
      duration: '2019 - 2022',
      description: 'Developed responsive user interfaces with React and Tailwind CSS. Implemented complex state management systems using Redux.'
    },
    {
      role: 'Web Developer Intern',
      company: 'Startup Hub',
      duration: '2018 - 2019',
      description: 'Assisted in building RESTful APIs and modernizing legacy frontend codebases.'
    }
  ];

  const education = [
    {
      degree: 'B.S. in Computer Science',
      school: 'University of Technology',
      duration: '2015 - 2019'
    }
  ];

  return (
    <div className="resume-app">
      <div className="resume-toolbar">
        <button className="mint-button small" onClick={() => alert('PDF Download Simulation')}>
          📄 Download PDF
        </button>
      </div>
      <div className="resume-content">
        <div className="resume-header">
          <h2>Samiul Islam</h2>
          <p>Full Stack Developer | Open Source Contributor</p>
        </div>

        <div className="resume-section">
          <h3>Work Experience</h3>
          <div className="timeline">
            {experiences.map((exp, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>{exp.role}</h4>
                  <span className="timeline-company">{exp.company}</span>
                  <span className="timeline-duration">{exp.duration}</span>
                  <p>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="resume-section">
          <h3>Education</h3>
          <div className="timeline">
            {education.map((edu, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>{edu.degree}</h4>
                  <span className="timeline-company">{edu.school}</span>
                  <span className="timeline-duration">{edu.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
