"use client";

import React, { useState, useEffect, useRef } from "react";

type WindowItem = {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
};

function TerminalApp() {
  const [history, setHistory] = useState([
    { type: "output", text: "Welcome to Mint OS Terminal.\nType 'help' to see available commands." }
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = input.trim();
      if (!cmd) {
        setHistory((prev) => [...prev, { type: "command", text: "" }]);
        setInput("");
        return;
      }

      const args = cmd.split(" ");
      const mainCmd = args[0].toLowerCase();
      let output = "";

      switch (mainCmd) {
        case "help":
          output = "Available commands: help, whoami, clear, ls, cat <file>, date";
          break;
        case "whoami":
          output = "John Doe\nFull Stack Developer | Open Source Enthusiast";
          break;
        case "clear":
          setHistory([]);
          setInput("");
          return;
        case "ls":
          output = "about.txt   contact.txt   projects.md   skills.json";
          break;
        case "cat":
          if (!args[1]) {
            output = "cat: missing file operand";
          } else if (args[1] === "about.txt") {
            output = "I am a passionate Full Stack Developer who loves open source and building clean, efficient web applications. My design philosophy is heavily inspired by elegant and functional Linux distributions.";
          } else if (args[1] === "contact.txt") {
            output = "Email: john.doe@example.com\nGitHub: github.com/johndoe\nLinkedIn: linkedin.com/in/johndoe";
          } else if (args[1] === "projects.md") {
            output = "# Projects\n- System Monitor App\n- E-Commerce Platform\n- Terminal Portfolio";
          } else if (args[1] === "skills.json") {
            output = '[\n  "JavaScript",\n  "TypeScript",\n  "React",\n  "Next.js",\n  "Node.js",\n  "Linux"\n]';
          } else {
            output = `cat: ${args[1]}: No such file or directory`;
          }
          break;
        case "date":
          output = new Date().toString();
          break;
        default:
          output = `bash: ${mainCmd}: command not found`;
      }

      setHistory((prev) => [
        ...prev,
        { type: "command", text: cmd },
        { type: "output", text: output }
      ]);
      setInput("");
    }
  };

  return (
    <div className="terminal-body" onClick={() => document.getElementById("term-input")?.focus()}>
      {history.map((line, i) => (
        <div key={i} style={{ whiteSpace: "pre-wrap", marginBottom: "0.5rem" }}>
          {line.type === "command" && (
            <span className="term-prompt">john@mint:~$ </span>
          )}
          {line.text}
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span className="term-prompt">john@mint:~$ </span>
        <input
          id="term-input"
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontFamily: "inherit",
            fontSize: "inherit",
            outline: "none",
            flex: 1,
            marginLeft: "8px"
          }}
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}

export default function PortfolioDesktop() {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWindow = (id: string) => {
    if (!openWindows.includes(id)) {
      setOpenWindows([...openWindows, id]);
    }
    setActiveWindow(id);
  };

  const closeWindow = (id: string) => {
    setOpenWindows(openWindows.filter((w) => w !== id));
    if (activeWindow === id) {
      setActiveWindow(openWindows.length > 1 ? openWindows[openWindows.length - 2] : null);
    }
  };

  const bringToFront = (id: string) => {
    setActiveWindow(id);
    setIsMenuOpen(false);
  };

  const handleMenuClick = (id: string) => {
    toggleWindow(id);
    setIsMenuOpen(false);
  };

  const skills = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", 
    "Linux", "Git", "CSS/HTML", "Python", "Docker"
  ];

  const projects = [
    {
      id: 1,
      title: "System Monitor App",
      description: "A sleek, lightweight web-based system monitor dashboard inspired by Linux system utilities.",
      tags: ["React", "Node.js", "WebSockets"],
    },
    {
      id: 2,
      title: "E-Commerce Platform",
      description: "A full-stack application built with modern web technologies. Features user authentication and a shopping cart.",
      tags: ["Next.js", "TypeScript", "Tailwind"],
    },
    {
      id: 3,
      title: "Terminal Portfolio",
      description: "An interactive portfolio website that mimics a command-line interface.",
      tags: ["JavaScript", "CSS", "HTML"],
    },
  ];

  const apps: WindowItem[] = [
    {
      id: "about",
      title: "About Me",
      icon: "👤",
      content: (
        <div className="window-inner-content">
          <div className="about-split">
            <div className="photo-placeholder-small"></div>
            <div>
              <h3>Hi, I'm John Doe</h3>
              <p>Full Stack Developer | Open Source Enthusiast</p>
              <p>I build clean, efficient, and user-friendly web applications. My design philosophy is heavily inspired by elegant and functional Linux distributions.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "skills",
      title: "Skills",
      icon: "⚙️",
      content: (
        <div className="window-inner-content skills-container">
          {skills.map((skill) => (
            <span key={skill} className="skill-badge">{skill}</span>
          ))}
        </div>
      ),
    },
    {
      id: "projects",
      title: "Projects",
      icon: "📁",
      content: (
        <div className="window-inner-content projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-header"></div>
              <div className="project-card-body">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "terminal",
      title: "Terminal",
      icon: ">_",
      content: <TerminalApp />,
    }
  ];

  return (
    <div className="desktop-container">
      {/* Click outside to close menu overlay */}
      {isMenuOpen && (
        <div 
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1500 }} 
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Start Menu Popup */}
      {isMenuOpen && (
        <div className="start-menu">
          <div className="start-menu-sidebar">
            <button className="start-menu-sidebar-btn" title="Lock">🔒</button>
            <div style={{ flex: 1 }}></div>
            <button className="start-menu-sidebar-btn" title="Log Out">🚪</button>
            <button className="start-menu-sidebar-btn" title="Quit" onClick={() => window.location.reload()}>⏻</button>
          </div>
          <div className="start-menu-content">
            <input type="text" className="start-menu-search" placeholder="Type to search..." />
            <div className="start-menu-apps">
              {apps.map((app) => (
                <button 
                  key={`menu-${app.id}`} 
                  className="start-menu-app-btn"
                  onClick={() => handleMenuClick(app.id)}
                >
                  <span className="start-menu-app-icon">{app.icon}</span>
                  <span>{app.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Area */}
      <div className="desktop-area">
        <div className="desktop-icons">
          {apps.map((app) => (
            <div 
              key={app.id} 
              className="desktop-icon" 
              onClick={() => handleMenuClick(app.id)}
            >
              <div className="icon-graphic">{app.icon}</div>
              <div className="icon-label">{app.title}</div>
            </div>
          ))}
        </div>

        {/* Windows */}
        {openWindows.map((windowId) => {
          const app = apps.find(a => a.id === windowId);
          if (!app) return null;
          
          const isActive = activeWindow === windowId;
          
          return (
            <div 
              key={windowId}
              className={`os-window ${isActive ? 'active' : ''}`}
              onClick={() => bringToFront(windowId)}
              style={{ zIndex: isActive ? 50 : 10 }}
            >
              <div className="os-window-header">
                <div className="os-window-title">
                  <span className="window-title-icon">{app.icon}</span>
                  {app.title}
                </div>
                <div className="os-window-controls">
                  <button className="win-btn min"></button>
                  <button className="win-btn max"></button>
                  <button className="win-btn close" onClick={(e) => { e.stopPropagation(); closeWindow(windowId); }}></button>
                </div>
              </div>
              <div className={`os-window-content ${windowId === 'terminal' ? 'terminal-bg' : ''}`}>
                {app.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Taskbar / Panel */}
      <div className="taskbar">
        <div className="taskbar-left">
          <button 
            className={`mint-menu-btn ${isMenuOpen ? 'active' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ zIndex: 1600 }}
          >
            <span className="mint-logo">LM</span> Menu
          </button>
          <div className="taskbar-apps">
            {openWindows.map((windowId) => {
              const app = apps.find(a => a.id === windowId);
              if (!app) return null;
              const isActive = activeWindow === windowId;
              return (
                <button 
                  key={windowId} 
                  className={`taskbar-app-btn ${isActive ? 'active' : ''}`}
                  onClick={() => bringToFront(windowId)}
                >
                  <span className="taskbar-app-icon">{app.icon}</span>
                  {app.title}
                </button>
              );
            })}
          </div>
        </div>
        <div className="taskbar-right">
          <div className="tray-icons">
            <span>📶</span>
            <span>🔊</span>
            <span>🔋</span>
          </div>
          <div className="clock">{time}</div>
        </div>
      </div>
    </div>
  );
}
