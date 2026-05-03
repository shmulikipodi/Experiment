'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackSlider({ code }: { code: string }) {
  const router = useRouter();
  const [score, setScore] = useState(50);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, score }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('done');
        router.refresh();
      } else if (data.error === 'already_submitted') {
        setStatus('done');
      } else {
        setErrorMsg('Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <p className="text-center text-sm font-medium text-green-600">
        Thank you for your feedback!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm font-medium text-gray-700">
        How accurate was this result? (0 = not at all, 100 = perfectly accurate)
      </p>

      <div className="flex items-center gap-4">
        <span className="w-8 text-right text-sm text-gray-500">0</span>
        <input
          type="range"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="flex-1 accent-indigo-600"
        />
        <span className="w-8 text-sm text-gray-500">100</span>
      </div>

      <div className="text-center text-3xl font-bold text-indigo-600">{score}</div>

      {status === 'error' && (
        <p className="text-center text-sm text-red-500">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Submitting…' : 'Submit Feedback'}
      </button>
    </form>
  );
}
