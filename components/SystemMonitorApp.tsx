import React, { useState, useEffect } from 'react';

export function SystemMonitorApp() {
  const [cpuData, setCpuData] = useState<number[]>(Array(20).fill(10));
  const [ramData, setRamData] = useState<number[]>(Array(20).fill(30));

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuData(prev => {
        const next = [...prev.slice(1), Math.floor(Math.random() * 40) + 20];
        return next;
      });
      setRamData(prev => {
        const next = [...prev.slice(1), Math.floor(Math.random() * 10) + 40];
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderGraph = (data: number[], color: string) => {
    return (
      <div className="monitor-graph-box">
        <div className="monitor-graph-bars">
          {data.map((val, i) => (
            <div 
              key={i} 
              className="monitor-bar" 
              style={{ height: `${val}%`, backgroundColor: color }} 
            />
          ))}
        </div>
        <div className="monitor-value">{data[data.length - 1]}%</div>
      </div>
    );
  };

  return (
    <div className="system-monitor-container">
      <h3 className="monitor-title">System Resources</h3>
      
      <div className="monitor-section">
        <div className="monitor-label">CPU History</div>
        {renderGraph(cpuData, '#ff9800')}
      </div>

      <div className="monitor-section">
        <div className="monitor-label">Memory and Swap History</div>
        {renderGraph(ramData, '#4caf50')}
      </div>
      
      <div className="monitor-stats">
        <div>Processes: 243</div>
        <div>Uptime: 2 days, 4 hours</div>
      </div>
    </div>
  );
}
