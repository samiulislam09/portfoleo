"use client";

import React, { useState, useEffect, useRef } from "react";

type WindowItem = {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
};

type OpenWindowData = {
  id: string;
  x: number;
  y: number;
  isMaximized: boolean;
  isMinimized: boolean;
};

const wallpapers = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=3270&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=3270&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=3174&auto=format&fit=crop"
];

import { TerminalApp } from "@/components/TerminalApp";
import { SnakeApp } from "@/components/SnakeApp";
import { FileExplorerApp } from "@/components/FileExplorerApp";
import { SystemMonitorApp } from "@/components/SystemMonitorApp";
import { NotepadApp } from "@/components/NotepadApp";
import { SettingsApp } from "@/components/SettingsApp";
import { BrowserApp } from "@/components/BrowserApp";

function DraggableIcon({ app, onDoubleClick, initialY }: { app: WindowItem, onDoubleClick: () => void, initialY: number }) {
  const [pos, setPos] = useState({ x: 20, y: initialY });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPos(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className="desktop-icon"
      style={{ position: 'absolute', left: pos.x, top: pos.y, zIndex: isDragging ? 10 : 1 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={onDoubleClick}
    >
      <div className="icon-graphic">{app.icon}</div>
      <div className="icon-label">{app.title}</div>
    </div>
  );
}

export default function PortfolioDesktop() {
  const [sysState, setSysState] = useState<"booting" | "login" | "desktop">("booting");
  const [bootLines, setBootLines] = useState<string[]>([]);
  
  const [openWindows, setOpenWindows] = useState<OpenWindowData[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState<string>("");
  const [bgIndex, setBgIndex] = useState(0);

  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Boot sequence logic
  useEffect(() => {
    if (sysState === "booting") {
      const msgs = [
        "[ OK ] Started Show Plymouth Boot Screen.",
        "[ OK ] Reached target Paths.",
        "[ OK ] Reached target Basic System.",
        "[ OK ] Started D-Bus System Message Bus.",
        "[ OK ] Started Network Manager.",
        "Starting WPA supplicant...",
        "[ OK ] Started WPA supplicant.",
        "[ OK ] Started Display Manager.",
        "Welcome to Linux Mint 21 (Vanessa)...",
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < msgs.length) {
          setBootLines(prev => [...prev, msgs[i]]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setSysState("login"), 1000);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [sysState]);

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Apply theme on load
  useEffect(() => {
    const savedTheme = localStorage.getItem('mintos-theme');
    if (savedTheme) {
      document.documentElement.style.setProperty('--mint-green', savedTheme);
    }
  }, []);

  // Draggable logic
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (dragging) {
        setOpenWindows(prev => prev.map(w => {
          if (w.id === dragging.id && !w.isMaximized) {
            return { ...w, x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY };
          }
          return w;
        }));
      }
    };
    const handlePointerUp = () => setDragging(null);

    if (dragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging]);

  // Context menu click-outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const toggleWindow = (id: string) => {
    setOpenWindows(prev => {
      const exists = prev.find(w => w.id === id);
      if (!exists) {
        return [...prev, { id, x: 100 + prev.length * 20, y: 50 + prev.length * 20, isMaximized: false, isMinimized: false }];
      } else {
        return prev.map(w => w.id === id ? { ...w, isMinimized: false } : w);
      }
    });
    setActiveWindow(id);
    setIsMenuOpen(false);
    setSearchQuery(""); // Reset search on open
  };

  const closeWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindow === id) {
      setActiveWindow(openWindows.length > 1 ? openWindows[openWindows.length - 2].id : null);
    }
  };

  const minimizeWindow = (id: string) => {
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const maximizeWindow = (id: string) => {
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    setActiveWindow(id);
  };

  const bringToFront = (id: string) => {
    setActiveWindow(id);
    setIsMenuOpen(false);
  };

  const handlePointerDownHeader = (e: React.PointerEvent, id: string) => {
    bringToFront(id);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragging({ id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
  };

  const changeBackground = () => {
    setBgIndex((prev) => (prev + 1) % wallpapers.length);
  };

  const skillCategories = [
    {
      category: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5/CSS3"]
    },
    {
      category: "Backend",
      skills: ["Node.js", "Express", "Python", "PostgreSQL", "MongoDB"]
    },
    {
      category: "Tools & OS",
      skills: ["Linux", "Git", "Docker", "AWS", "Bash Scripting"]
    }
  ];

  const projects = [
    {
      id: 1, title: "System Monitor App", description: "A sleek web-based system monitor dashboard.", tags: ["React", "Node.js", "WebSockets"],
    },
    {
      id: 2, title: "E-Commerce Platform", description: "A full-stack application built with modern web tech.", tags: ["Next.js", "TypeScript", "Tailwind"],
    },
    {
      id: 3, title: "Terminal Portfolio", description: "An interactive portfolio mimicking a CLI.", tags: ["JavaScript", "CSS", "HTML"],
    },
  ];

  const apps: WindowItem[] = [
    {
      id: "about", title: "About Me", icon: "👤",
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
      id: "skills", title: "Skills", icon: "⚙️",
      content: (
        <div className="window-inner-content skills-wrapper">
          <h2 style={{marginTop: 0, marginBottom: '2rem', color: '#fff', textAlign: 'center'}}>Technical Arsenal</h2>
          <div className="skills-grid-modern">
            {skillCategories.map(cat => (
              <div key={cat.category} className="skill-category-card">
                <h3 className="skill-category-title">{cat.category}</h3>
                <div className="skill-category-items">
                   {cat.skills.map(skill => (
                     <div key={skill} className="skill-item-modern">
                        <span className="skill-dot"></span>
                        {skill}
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "projects", title: "Projects", icon: "📁",
      content: (
        <div className="window-inner-content projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-header"></div>
              <div className="project-card-body">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => <span key={tag} className="project-tag">{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "terminal", title: "Terminal", icon: ">_",
      content: <TerminalApp />,
    },
    {
      id: "files", title: "Files", icon: "📁",
      content: <FileExplorerApp />,
    },
    {
      id: "monitor", title: "System Monitor", icon: "📊",
      content: <SystemMonitorApp />,
    },
    {
      id: "notepad", title: "Notepad", icon: "📝",
      content: <NotepadApp />,
    },
    {
      id: "snake", title: "Snake", icon: "🐍",
      content: <SnakeApp />,
    },
    {
      id: "settings", title: "Settings", icon: "⚙️",
      content: <SettingsApp setBgIndex={setBgIndex} currentBgIndex={bgIndex} wallpapers={wallpapers} />,
    },
    {
      id: "browser", title: "Web Browser", icon: "🌐",
      content: <BrowserApp />,
    }
  ];

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (sysState === "booting") {
    return (
      <div className="boot-screen">
        <div className="boot-text">
          {bootLines.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      </div>
    );
  }

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setSysState("desktop");
    }, 400);
  };

  if (sysState === "login") {
    return (
      <div className="login-screen" style={{ backgroundImage: `url('${wallpapers[bgIndex]}')` }}>
        <div className="login-clock">
          <div className="login-time">{time}</div>
          <div className="login-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="login-box-modern">
          <div className="login-avatar-modern">JD</div>
          <h2 className="login-name">John Doe</h2>
          
          <button 
            className="login-action-btn" 
            onClick={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? <div className="login-spinner"></div> : "Log In"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="desktop-container" 
      style={{ backgroundImage: `url('${wallpapers[bgIndex]}')` }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      {/* Click outside to close menu overlay */}
      {isMenuOpen && <div className="overlay-invisible" onClick={() => setIsMenuOpen(false)} />}

      {/* Start Menu Popup */}
      {isMenuOpen && (
        <div className="start-menu">
          <div className="start-menu-sidebar">
            <button className="start-menu-sidebar-btn" title="Lock" onClick={() => setSysState("login")}>🔒</button>
            <div style={{ flex: 1 }}></div>
            <button className="start-menu-sidebar-btn" title="Log Out" onClick={() => setSysState("login")}>🚪</button>
            <button className="start-menu-sidebar-btn" title="Shutdown" onClick={() => setSysState("booting")}>⏻</button>
          </div>
          <div className="start-menu-content">
            <input 
              type="text" 
              className="start-menu-search" 
              placeholder="Type to search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div className="start-menu-apps">
              {apps.filter(app => app.title.toLowerCase().includes(searchQuery.toLowerCase())).map((app) => (
                <button key={`menu-${app.id}`} className="start-menu-app-btn" onClick={() => toggleWindow(app.id)}>
                  <span className="start-menu-app-icon">{app.icon}</span>
                  <span>{app.title}</span>
                </button>
              ))}
              {apps.filter(app => app.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div style={{ padding: '1rem', color: '#888', textAlign: 'center' }}>No applications found.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button onClick={() => toggleWindow("terminal")}>Open Terminal</button>
          <button onClick={changeBackground}>Change Background</button>
          <button onClick={() => setSysState("login")}>Lock Screen</button>
        </div>
      )}

      {/* Desktop Area */}
      <div className="desktop-area">
        {/* Conky Widget */}
        <div className="conky-widget">
          <div className="conky-time">{time}</div>
          <div className="conky-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <div className="conky-sys">
            <div>CPU Load: {Math.floor(Math.random() * 20 + 5)}%</div>
            <div>RAM: 3.2GB / 16.0GB</div>
            <div>Uptime: 2d 4h</div>
          </div>
        </div>

        <div className="desktop-icons" style={{ position: 'relative', width: '100%', height: '100%' }}>
          {apps.map((app, index) => (
            <DraggableIcon 
              key={app.id} 
              app={app} 
              initialY={20 + (index * 110)} 
              onDoubleClick={() => toggleWindow(app.id)} 
            />
          ))}
        </div>

        {/* Windows */}
        {openWindows.map((win) => {
          const app = apps.find(a => a.id === win.id);
          if (!app || win.isMinimized) return null;
          
          const isActive = activeWindow === win.id;
          
          return (
            <div 
              key={win.id}
              className={`os-window ${isActive ? 'active' : ''} ${win.isMaximized ? 'maximized' : ''}`}
              onPointerDown={() => bringToFront(win.id)}
              style={{ 
                zIndex: isActive ? 50 : 10,
                ...(win.isMaximized ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 40px)' } : { top: win.y, left: win.x, width: 800, height: 500 })
              }}
            >
              <div 
                className="os-window-header" 
                onPointerDown={(e) => handlePointerDownHeader(e, win.id)}
                onDoubleClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}
              >
                <div className="os-window-title">
                  <span className="window-title-icon">{app.icon}</span>
                  {app.title}
                </div>
                <div className="os-window-controls">
                  <button className="win-btn min" onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}></button>
                  <button className="win-btn max" onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}></button>
                  <button className="win-btn close" onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}></button>
                </div>
              </div>
              <div className={`os-window-content ${win.id === 'terminal' ? 'terminal-bg' : ''}`}>
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
            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
            style={{ zIndex: 1600 }}
          >
            <span className="mint-logo">LM</span> Menu
          </button>
          <div className="taskbar-apps">
            {openWindows.map((win) => {
              const app = apps.find(a => a.id === win.id);
              if (!app) return null;
              const isActive = activeWindow === win.id && !win.isMinimized;
              return (
                <button 
                  key={win.id} 
                  className={`taskbar-app-btn ${isActive ? 'active' : ''}`}
                  onClick={() => toggleWindow(win.id)}
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
