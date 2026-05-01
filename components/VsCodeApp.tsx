import React from 'react';

export function VsCodeApp() {
  const codeSnippet = `import React, { useState, useEffect } from "react";
import { ResumeApp } from "@/components/ResumeApp";
import { ProjectsApp } from "@/components/ProjectsApp";
import { GithubApp } from "@/components/GithubApp";

export default function PortfolioDesktop() {
  const [sysState, setSysState] = useState("booting");
  const [openWindows, setOpenWindows] = useState([]);
  
  // Custom Window Manager Logic
  const toggleWindow = (id: string) => {
    setOpenWindows(prev => {
      const exists = prev.find(w => w.id === id);
      if (!exists) {
        return [...prev, { 
          id, 
          x: 100 + prev.length * 20, 
          y: 50 + prev.length * 20, 
          isMaximized: false 
        }];
      } else {
        return prev.map(w => w.id === id ? { ...w, isMinimized: false } : w);
      }
    });
  };

  return (
    <div className="desktop-environment">
       {/* Window Rendering Logic */}
       {openWindows.map(win => (
          <DraggableWindow key={win.id} window={win} />
       ))}
    </div>
  );
}`;

  return (
    <div className="vscode-app">
      <div className="vscode-sidebar">
        <div className="vscode-sidebar-title">EXPLORER</div>
        <div className="vscode-file active">📄 page.tsx</div>
        <div className="vscode-file">📄 layout.tsx</div>
        <div className="vscode-file">📄 globals.css</div>
        <div className="vscode-folder">📁 components
          <div className="vscode-file indent">📄 TerminalApp.tsx</div>
          <div className="vscode-file indent">📄 GithubApp.tsx</div>
        </div>
      </div>
      <div className="vscode-main">
        <div className="vscode-tabs">
          <div className="vscode-tab active">page.tsx</div>
          <div className="vscode-tab">globals.css</div>
        </div>
        <div className="vscode-code-area">
          <pre><code>{codeSnippet}</code></pre>
        </div>
      </div>
    </div>
  );
}
