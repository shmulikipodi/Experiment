'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'loading' | 'not_found' | 'no_result' | 'unauthorized';

export default function HomePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/enter-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();

      if (data.role === 'admin') {
        router.push('/admin/dashboard');
        return;
      }

      if (data.status === 'ok') {
        router.push(`/result?code=${encodeURIComponent(code.trim())}`);
        return;
      }

      if (data.status === 'no_result') {
        setStatus('no_result');
      } else {
        setStatus('not_found');
      }
    } catch {
      setStatus('not_found');
    }
  }

  const errorMessage =
    status === 'not_found'
      ? 'Code not found. Please check and try again.'
      : status === 'no_result'
      ? 'Your result is not yet available. Please check back later.'
      : status === 'unauthorized'
      ? 'Access denied.'
      : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight">
          Welcome
        </h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Enter your code to view your results.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setStatus('idle');
            }}
            placeholder="Enter your code"
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />

          {errorMessage && (
            <p className="text-center text-sm text-red-500">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !code.trim()}
            className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'loading' ? 'Checking…' : 'Continue'}
          </button>
        </form>
      </div>
    </main>
  );
}
