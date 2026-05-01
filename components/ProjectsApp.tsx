import React, { useState } from 'react';

export function ProjectsApp() {
  const projects = [
    {
      id: 1, 
      title: "Mint OS Portfolio", 
      description: "A highly interactive, web-based operating system simulation built entirely with React, Next.js, and vanilla CSS. Features a custom window manager, draggable icons, a mock file system, and a suite of simulated applications including a fully functioning Terminal, Snake game, and this very project gallery.", 
      tags: ["React", "Next.js", "CSS3", "TypeScript"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop"
    },
    {
      id: 2, 
      title: "E-Commerce Microservices", 
      description: "A scalable backend architecture for an e-commerce platform. Implemented user authentication, product management, and a robust cart system using Node.js, Express, and MongoDB. Deployed using Docker containers orchestrating multiple microservices.", 
      tags: ["Node.js", "MongoDB", "Docker", "Express"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000&auto=format&fit=crop"
    },
    {
      id: 3, 
      title: "System Monitor Dashboard", 
      description: "A real-time data visualization dashboard that tracks system metrics. Built with React and WebSockets to consume live streaming data and render it smoothly using high-performance charting libraries.", 
      tags: ["React", "WebSockets", "DataViz"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop"
    }
  ];

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedProject = projects.find(p => p.id === selectedId);

  return (
    <div className="projects-app">
      {selectedProject ? (
        <div className="project-detail-view">
          <button className="back-btn" onClick={() => setSelectedId(null)}>← Back to Gallery</button>
          <img src={selectedProject.image} alt={selectedProject.title} className="project-detail-image" />
          <div className="project-detail-info">
            <h2>{selectedProject.title}</h2>
            <div className="project-tags">
              {selectedProject.tags.map(tag => <span key={tag} className="project-tag">{tag}</span>)}
            </div>
            <p className="project-detail-desc">{selectedProject.description}</p>
            <div className="project-actions">
              <button className="mint-button">Live Demo</button>
              <button className="mint-button secondary">View Source</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="projects-gallery">
          {projects.map(project => (
            <div key={project.id} className="project-gallery-card" onClick={() => setSelectedId(project.id)}>
              <img src={project.image} alt={project.title} className="project-card-image" />
              <div className="project-card-content">
                <h3>{project.title}</h3>
                <div className="project-tags">
                  {project.tags.map(tag => <span key={tag} className="project-tag">{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
