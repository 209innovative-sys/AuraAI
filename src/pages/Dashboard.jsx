import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';

export default function Dashboard() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const analyze = async () => {
    const r = await fetch('/api/analyze', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ text })
    });
    const data = await r.json();
    setResult(data.result);
  };

  return (
    <div className='p-8 max-w-xl mx-auto text-center'>
      <h1 className='text-3xl text-aura mb-6'>Romantic Vibe Analyzer</h1>
      <textarea className='w-full p-3 bg-gray-900 border border-purple-800'
        rows='5' placeholder='Paste message…'
        value={text} onChange={e=>setText(e.target.value)} />
      <button onClick={analyze} className='bg-aura p-3 rounded mt-4'>Analyze</button>
      {result && <div className='mt-6 text-purple-300'>{result}</div>}
      <button onClick={() => signOut(auth)} className='text-red-400 mt-10'>Logout</button>
    </div>
  );
}
