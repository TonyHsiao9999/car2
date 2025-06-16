import React, { useState } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunAutomation = async () => {
    setLoading(true);
    setStatus('正在執行自動化...');
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    console.log('API URL:', apiUrl);
    
    try {
      console.log('開始發送請求...');
      const response = await fetch(`${apiUrl}/api/run-automation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('收到回應:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('回應內容:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('解析回應數據:', data);
      setStatus(data.message);
    } catch (error) {
      console.error('完整錯誤信息:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setStatus(`執行失敗：${error.message}`);
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
