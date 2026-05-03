import { redirect } from 'next/navigation';
import db from '@/db/client';
import FeedbackSlider from './FeedbackSlider';

type Participant = {
  code: string;
  result: string | null;
  feedback: number | null;
};

interface Props {
  searchParams: { code?: string };
}

export default function ResultPage({ searchParams }: Props) {
  const rawCode = searchParams.code;

  if (!rawCode) redirect('/');

  const row = db
    .prepare('SELECT code, result, feedback FROM participants WHERE code = ?')
    .get(rawCode) as Participant | undefined;

  if (!row || !row.result) redirect('/');

  return (
    <main className="flex min-h-screen items-start justify-center px-4 py-16">
      <div className="w-full max-w-xl space-y-8">
        <div>
          <h1 className="mb-1 text-2xl font-semibold">Your Result</h1>
          <p className="text-xs text-gray-400">Code: {row.code}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="whitespace-pre-wrap leading-relaxed text-gray-800">{row.result}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold">Feedback</h2>
          {row.feedback !== null ? (
            <p className="text-sm text-gray-500">
              You already submitted feedback. Thank you!
            </p>
          ) : (
            <FeedbackSlider code={row.code} />
          )}
        </div>
      </div>
    </main>
  );
}
