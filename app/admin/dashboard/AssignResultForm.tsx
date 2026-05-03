'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AssignResultForm({ codes }: { codes: string[] }) {
  const router = useRouter();
  const [selectedCode, setSelectedCode] = useState(codes[0] ?? '');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCode || !result.trim()) return;
    setStatus('loading');

    try {
      const res = await fetch('/admin/dashboard/api/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: selectedCode, result: result.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage(`Result assigned to "${selectedCode}".`);
        setStatus('success');
        setResult('');
        router.refresh();
      } else {
        setMessage('Failed to assign result. Code may not exist.');
        setStatus('error');
      }
    } catch {
      setMessage('Network error. Please try again.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <select
        value={selectedCode}
        onChange={(e) => { setSelectedCode(e.target.value); setStatus('idle'); setMessage(''); }}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      >
        {codes.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <textarea
        value={result}
        onChange={(e) => { setResult(e.target.value); setStatus('idle'); setMessage(''); }}
        placeholder="Enter the result text for this participant…"
        rows={5}
        maxLength={10000}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-y"
      />

      <p className="text-right text-xs text-gray-400">{result.length}/10000</p>

      {message && (
        <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || !result.trim()}
        className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Saving…' : 'Assign Result'}
      </button>
    </form>
  );
}
