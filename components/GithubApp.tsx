import React, { useState, useEffect } from 'react';

type GithubProfile = {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
};

type GithubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
};

export function GithubApp() {
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const username = 'samiulislam09';

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const [profileRes, reposRes, contribRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`),
          fetch(`https://github-contributions-api.deno.dev/${username}.json`)
        ]);

        if (!profileRes.ok || !reposRes.ok) {
          throw new Error('Failed to fetch GitHub data');
        }

        const profileData = await profileRes.json();
        const reposData = await reposRes.json();
        
        if (contribRes.ok) {
          const contribData = await contribRes.json();
          setTotalContributions(contribData.totalContributions);
        }

        setProfile(profileData);
        setRepos(reposData);
      } catch (err) {
        setError('Could not load GitHub data. Check console or API limits.');
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  if (loading) {
    return <div className="github-app loading"><div className="login-spinner"></div>Loading GitHub data...</div>;
  }

  if (error || !profile) {
    return <div className="github-app error">{error}</div>;
  }

  return (
    <div className="github-app">
      <div className="github-profile-header">
        <img src={profile.avatar_url} alt={profile.login} className="github-avatar" />
        <div className="github-profile-info">
          <h2>{profile.name || profile.login}</h2>
          <p className="github-bio">{profile.bio || 'Open source enthusiast and developer.'}</p>
          <div className="github-stats-row">
            <span><strong>{profile.public_repos}</strong> Repositories</span>
            <span><strong>{profile.followers}</strong> Followers</span>
            <span><strong>{profile.following}</strong> Following</span>
          </div>
          <a href={profile.html_url} target="_blank" rel="noreferrer" className="mint-button small mt-2">
            View on GitHub
          </a>
        </div>
      </div>

      <div className="github-contrib-graph" style={{ background: '#161b22', padding: '1.5rem', borderRadius: '8px', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#58a6ff' }}>Contribution Activity</h3>
          {totalContributions !== null && (
            <span style={{ color: '#8b949e', fontSize: '0.9rem' }}>
              <strong>{totalContributions.toLocaleString()}</strong> contributions in the last year
            </span>
          )}
        </div>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <img 
            src={`https://ghchart.rshah.org/87A556/${username}`} 
            alt="Contribution Graph" 
            style={{ minWidth: '600px', width: '100%' }}
          />
        </div>
      </div>

      <div className="github-repos-section">
        <h3 style={{ color: '#c9d1d9', marginBottom: '1rem' }}>Recently Updated Repositories</h3>
        <div className="github-repos-grid">
          {repos.map(repo => (
            <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="github-repo-card">
              <h4>{repo.name}</h4>
              <p>{repo.description || 'No description provided.'}</p>
              <div className="github-repo-meta">
                {repo.language && <span className="github-repo-lang"><span className="lang-dot"></span>{repo.language}</span>}
                <span className="github-repo-stars">⭐ {repo.stargazers_count}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
