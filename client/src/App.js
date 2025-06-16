import React, { useState } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunAutomation = async () => {
    setLoading(true);
    setStatus('正在執行自動化...');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/run-automation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setStatus(data.message);
    } catch (error) {
      setStatus('執行失敗：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>長照訂車自動化</h1>
        <button 
          className="run-button" 
          onClick={handleRunAutomation} 
          disabled={loading}
        >
          {loading ? '執行中...' : '開始預約'}
        </button>
        {status && <p className="status">{status}</p>}
      </header>
    </div>
  );
}

export default App;
