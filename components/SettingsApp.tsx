import React, { useState } from 'react';

type SettingsProps = {
  setBgIndex: (idx: number) => void;
  currentBgIndex: number;
  wallpapers: string[];
};

export function SettingsApp({ setBgIndex, currentBgIndex, wallpapers }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'backgrounds' | 'system'>('appearance');

  const themes = [
    { name: 'Mint Green', color: '#87A556' },
    { name: 'Ubuntu Orange', color: '#E95420' },
    { name: 'Arch Blue', color: '#1793D1' },
    { name: 'Pop!_OS Cyan', color: '#48B9C7' },
    { name: 'Manjaro Green', color: '#35BF5C' },
    { name: 'Hacker Terminal', color: '#00ff00' }
  ];

  const handleThemeChange = (color: string) => {
    document.documentElement.style.setProperty('--mint-green', color);
    localStorage.setItem('mintos-theme', color);
  };

  return (
    <div className="settings-app-layout">
      <div className="settings-sidebar">
        <button 
          className={`settings-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          🎨 Appearance
        </button>
        <button 
          className={`settings-tab-btn ${activeTab === 'backgrounds' ? 'active' : ''}`}
          onClick={() => setActiveTab('backgrounds')}
        >
          🖼️ Backgrounds
        </button>
        <button 
          className={`settings-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          ⚙️ System
        </button>
      </div>

      <div className="settings-content-area">
        {activeTab === 'appearance' && (
          <div className="settings-section">
            <h3>Accent Color</h3>
            <p className="settings-desc">Choose the primary color for your system interface.</p>
            <div className="theme-grid">
              {themes.map(theme => (
                <div 
                  key={theme.name} 
                  className="theme-card" 
                  onClick={() => handleThemeChange(theme.color)}
                >
                  <div className="theme-color-preview" style={{ backgroundColor: theme.color }} />
                  <div className="theme-name">{theme.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'backgrounds' && (
          <div className="settings-section">
            <h3>Desktop Wallpapers</h3>
            <p className="settings-desc">Select a wallpaper for your desktop.</p>
            <div className="wallpaper-grid">
              {wallpapers.map((url, idx) => (
                <div 
                  key={idx} 
                  className={`wallpaper-card ${currentBgIndex === idx ? 'active' : ''}`}
                  onClick={() => setBgIndex(idx)}
                >
                  <img src={url} alt={`Wallpaper ${idx + 1}`} className="wallpaper-thumb" />
                  {currentBgIndex === idx && <div className="wallpaper-check">✓ Active</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="settings-section">
            <h3>System Preferences</h3>
            <p className="settings-desc">Manage local data and reset configurations.</p>
            
            <div className="system-actions">
              <button 
                className="mint-button" 
                onClick={() => {
                  localStorage.removeItem('mintos-theme');
                  localStorage.removeItem('mintos-notepad');
                  window.location.reload();
                }}
              >
                Reset All Settings to Default
              </button>
            </div>
            <p className="settings-desc" style={{ marginTop: '1rem', color: '#ff6b6b' }}>
              Warning: This will clear your Notepad data and custom theme colors, then reload the page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
