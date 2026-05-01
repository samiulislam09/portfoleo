import React from 'react';

export function SkillsApp() {
  const skillCategories = [
    {
      category: "Frontend",
      skills: [
        { name: "React / Next.js", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "HTML5 / CSS3", level: 95 },
        { name: "Tailwind CSS", level: 80 }
      ]
    },
    {
      category: "Backend",
      skills: [
        { name: "Node.js / Express", level: 85 },
        { name: "PostgreSQL", level: 75 },
        { name: "MongoDB", level: 80 },
        { name: "Python", level: 70 }
      ]
    },
    {
      category: "Tools & DevOps",
      skills: [
        { name: "Git & GitHub", level: 90 },
        { name: "Linux / Bash", level: 85 },
        { name: "Docker", level: 65 },
        { name: "AWS", level: 60 }
      ]
    }
  ];

  return (
    <div className="skills-app">
      <div className="skills-header">
        <h2>Technical Proficiency</h2>
        <p>A breakdown of my core competencies and current tech stack.</p>
      </div>

      <div className="skills-container">
        {skillCategories.map(cat => (
          <div key={cat.category} className="skill-category-block">
            <h3 className="skill-cat-title">{cat.category}</h3>
            <div className="skill-bars-list">
              {cat.skills.map(skill => (
                <div key={skill.name} className="skill-bar-wrapper">
                  <div className="skill-bar-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-level-text">{skill.level}%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
