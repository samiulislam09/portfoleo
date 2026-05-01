import React, { useState, useEffect } from 'react';

export function AiAssistant({ openApp }: { openApp: (id: string) => void }) {
  const [message, setMessage] = useState('Hi! I am Minty, Samiul\'s AI Assistant.');
  const [isOpen, setIsOpen] = useState(false);
  
  const prompts = [
    { text: "Want to see my professional experience?", action: 'about', label: "Open Resume" },
    { text: "Check out my latest open source work!", action: 'github', label: "View GitHub" },
    { text: "Have an exciting opportunity?", action: 'contact', label: "Contact Me" },
    { text: "I can show you my best projects.", action: 'projects', label: "View Projects" }
  ];

  const [currentPrompt, setCurrentPrompt] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % prompts.length);
      setIsOpen(true);
      
      // Auto close after 10 seconds
      setTimeout(() => setIsOpen(false), 10000);
    }, 45000); // Trigger every 45 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleAction = () => {
    openApp(prompts[currentPrompt].action);
    setIsOpen(false);
  };

  return (
    <div className="ai-assistant-container">
      {isOpen && (
        <div className="ai-speech-bubble">
          <p>{prompts[currentPrompt].text}</p>
          <button className="mint-button small" onClick={handleAction}>
            {prompts[currentPrompt].label}
          </button>
          <button className="close-bubble" onClick={() => setIsOpen(false)}>×</button>
        </div>
      )}
      <div className="ai-avatar" onClick={() => setIsOpen(!isOpen)}>
        🤖
      </div>
    </div>
  );
}
