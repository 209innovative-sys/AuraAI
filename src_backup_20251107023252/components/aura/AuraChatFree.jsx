import React, { useState } from 'react';
import { Api } from '../../lib/api';

export function AuraChatFree() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await Api.auraFree(input);
      setResponse(res.output || 'No response');
    } catch (e) {
      setResponse(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Free Aura Scan</h3>
      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a short conversation snippet..."
      />
      <button onClick={onSend} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze (Free)'}
      </button>
      {response && (
        <pre className="mt-2 p-3 bg-slate-900 rounded text-sm whitespace-pre-wrap">
          {response}
        </pre>
      )}
    </div>
  );
}
