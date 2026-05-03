'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setStatus('loading');

    try {
      const res = await fetch('/admin/dashboard/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Code "${data.code}" created.`);
        setStatus('success');
        setCode('');
        router.refresh();
      } else if (data.error === 'duplicate_code') {
        setMessage('That code already exists.');
        setStatus('error');
      } else {
        setMessage('Invalid code format. Use letters, numbers, hyphens, or underscores (max 64 chars).');
        setStatus('error');
      }
    } catch {
      setMessage('Network error. Please try again.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={code}
        onChange={(e) => { setCode(e.target.value); setStatus('idle'); setMessage(''); }}
        placeholder="e.g. PART001"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
      {message && (
        <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'loading' || !code.trim()}
        className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Creating…' : 'Create Code'}
      </button>
    </form>
  );
}
