import React, { useState, useEffect } from 'react';

export function NotepadApp() {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Ready');

  useEffect(() => {
    const saved = localStorage.getItem('mintos-notepad');
    if (saved) {
      setContent(saved);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setStatus('Unsaved changes');
  };

  const handleSave = () => {
    localStorage.setItem('mintos-notepad', content);
    setStatus('Saved successfully');
    setTimeout(() => setStatus('Ready'), 2000);
  };

  return (
    <div className="notepad-container">
      <div className="notepad-toolbar">
        <button className="mint-button small" onClick={handleSave}>Save</button>
        <span className="notepad-status">{status}</span>
      </div>
      <textarea 
        className="notepad-textarea" 
        value={content} 
        onChange={handleChange} 
        placeholder="Type your notes here... They will be saved to your browser's local storage."
        spellCheck="false"
      />
    </div>
  );
}
