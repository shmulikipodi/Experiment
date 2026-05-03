import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import db from '@/db/client';
import { SessionData, sessionOptions } from '@/lib/session';
import CreateCodeForm from './CreateCodeForm';
import AssignResultForm from './AssignResultForm';

type Participant = {
  id: number;
  code: string;
  result: string | null;
  feedback: number | null;
  created_at: string;
  assigned_at: string | null;
  feedback_at: string | null;
};

export default async function DashboardPage() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isAdmin) redirect('/');

  const participants = db
    .prepare(
      `SELECT id, code,
              CASE WHEN result IS NOT NULL THEN substr(result, 1, 80) ELSE NULL END AS result,
              feedback, created_at, assigned_at, feedback_at
       FROM participants ORDER BY created_at DESC`
    )
    .all() as Participant[];

  const codes = participants.map((p) => p.code);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold">Create Participant Code</h2>
          <CreateCodeForm />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold">Assign Result</h2>
          {codes.length === 0 ? (
            <p className="text-sm text-gray-400">No participant codes yet.</p>
          ) : (
            <AssignResultForm codes={codes} />
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold">
            Participants{' '}
            <span className="text-sm font-normal text-gray-400">({participants.length})</span>
          </h2>
        </div>

        {participants.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-400">
            No participants yet. Create a code to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 text-left">Result Preview</th>
                  <th className="px-4 py-3 text-center">Feedback</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Assigned</th>
                  <th className="px-4 py-3 text-left">Feedback At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {participants.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-medium">{p.code}</td>
                    <td className="px-4 py-3 max-w-xs truncate text-gray-600">
                      {p.result ?? <span className="text-gray-300 italic">not assigned</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.feedback !== null ? (
                        <span className="inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                          {p.feedback}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.created_at.slice(0, 16)}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {p.assigned_at ? p.assigned_at.slice(0, 16) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {p.feedback_at ? p.feedback_at.slice(0, 16) : <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
