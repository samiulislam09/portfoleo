import React, { useState } from 'react';

export function BrowserApp() {
  const [url, setUrl] = useState('https://en.wikipedia.org/wiki/Linux_Mint');
  const [inputUrl, setInputUrl] = useState(url);

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
  };

  return (
    <div className="browser-app">
      <form className="browser-toolbar" onSubmit={handleGo}>
        <button type="button" className="browser-btn" onClick={() => { setUrl('https://en.wikipedia.org/wiki/Linux_Mint'); setInputUrl('https://en.wikipedia.org/wiki/Linux_Mint'); }}>🏠</button>
        <button type="button" className="browser-btn" onClick={() => setUrl(url)}>🔄</button>
        <input 
          type="text" 
          className="browser-url-input" 
          value={inputUrl} 
          onChange={e => setInputUrl(e.target.value)} 
          placeholder="Enter URL..."
        />
        <button type="submit" className="browser-btn go-btn">Go</button>
      </form>
      <div className="browser-content">
        <iframe src={url} className="browser-iframe" title="Web Browser" sandbox="allow-scripts allow-same-origin" />
      </div>
    </div>
  );
}
