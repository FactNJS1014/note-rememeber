import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Bell, CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toggleReminderCompleteAction, deleteReminderAction } from '@/actions/reminders';

export default async function RemindersPage() {
  const user = await requireAuth();

  const reminders = await prisma.reminder.findMany({
    where: { userId: user.userId },
    orderBy: { remindAt: 'asc' },
    include: { note: true },
  });

  const now = new Date();
  const overdue = reminders.filter((r) => new Date(r.remindAt) < now && !r.completed);
  const upcoming = reminders.filter((r) => new Date(r.remindAt) >= now && !r.completed);
  const completed = reminders.filter((r) => r.completed);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-400" />
          <span>Reminders Center</span>
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Track upcoming tasks, overdue schedules, and completed items
        </p>
      </div>

      {/* Overdue Section */}
      {overdue.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Overdue ({overdue.length})</span>
          </h2>
          <div className="space-y-2">
            {overdue.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <form action={toggleReminderCompleteAction.bind(null, r.id)}>
                    <button type="submit" className="text-rose-400 hover:text-rose-300">
                      <Circle className="w-5 h-5" />
                    </button>
                  </form>
                  <div>
                    <p className="text-sm font-semibold text-rose-200">{r.title}</p>
                    <p className="text-xs text-rose-400/80 mt-0.5">{formatDate(r.remindAt)}</p>
                  </div>
                </div>
                <form action={deleteReminderAction.bind(null, r.id)}>
                  <button type="submit" className="text-rose-400/60 hover:text-rose-400 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
          Upcoming Schedule ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-slate-500 text-xs">No upcoming reminders scheduled.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <form action={toggleReminderCompleteAction.bind(null, r.id)}>
                    <button type="submit" className="text-slate-500 hover:text-indigo-400">
                      <Circle className="w-5 h-5" />
                    </button>
                  </form>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{r.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(r.remindAt)}</p>
                  </div>
                </div>
                <form action={deleteReminderAction.bind(null, r.id)}>
                  <button type="submit" className="text-slate-500 hover:text-rose-400 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Section */}
      {completed.length > 0 && (
        <div className="space-y-3 opacity-60">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Completed ({completed.length})
          </h2>
          <div className="space-y-2">
            {completed.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <form action={toggleReminderCompleteAction.bind(null, r.id)}>
                    <button type="submit" className="text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </form>
                  <div>
                    <p className="text-sm font-semibold text-slate-400 line-through">{r.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{formatDate(r.remindAt)}</p>
                  </div>
                </div>
                <form action={deleteReminderAction.bind(null, r.id)}>
                  <button type="submit" className="text-slate-600 hover:text-rose-400 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
