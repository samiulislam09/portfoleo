"use client";
import React, { useState, useEffect, useRef } from "react";

export function TerminalApp() {
  const [history, setHistory] = useState([
    { type: "output", text: "Welcome to Mint OS Terminal.\nType 'help' to see available commands." }
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const [matrixMode, setMatrixMode] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [history]);

  useEffect(() => {
    if (!matrixMode) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const interval = setInterval(() => {
      setHistory(prev => {
        let newOutput = "";
        for (let i = 0; i < 10; i++) {
          newOutput += chars.charAt(Math.floor(Math.random() * chars.length)) + " ";
        }
        const next = [...prev, { type: "output", text: newOutput, isMatrix: true }];
        return next.length > 50 ? next.slice(next.length - 50) : next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [matrixMode]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = input.trim();
      
      if (matrixMode && cmd.toLowerCase() === "clear") {
        setMatrixMode(false);
        setHistory([]);
        setInput("");
        return;
      }

      if (matrixMode) {
        setInput("");
        return; // Ignore other commands while in matrix mode
      }

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
          output = "Available commands: help, whoami, clear, ls, cat <file>, date, matrix";
          break;
        case "whoami":
          output = "John Doe\nFull Stack Developer | Open Source Enthusiast";
          break;
        case "clear":
          setHistory([]);
          setInput("");
          return;
        case "matrix":
          setMatrixMode(true);
          output = "Entering the Matrix... (type 'clear' to exit)";
          break;
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
        <div key={i} style={{ 
          whiteSpace: "pre-wrap", 
          marginBottom: "0.5rem",
          color: (line as any).isMatrix ? "#0f0" : "inherit",
          textShadow: (line as any).isMatrix ? "0 0 5px #0f0" : "none"
        }}>
          {line.type === "command" && (
            <span className="term-prompt">john@mint:~$ </span>
          )}
          {line.text}
        </div>
      ))}
      {!matrixMode && (
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
      )}
      <div ref={endRef} />
    </div>
  );
}
