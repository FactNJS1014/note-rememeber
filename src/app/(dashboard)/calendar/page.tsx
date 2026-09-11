import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function CalendarPage() {
  const user = await requireAuth();

  const reminders = await prisma.reminder.findMany({
    where: { userId: user.userId },
    orderBy: { remindAt: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-indigo-400" />
          <span>Reminder Calendar View</span>
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Timeline of scheduled reminders and notes</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        {reminders.map((r) => (
          <div key={r.id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center gap-4">
            <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-200">{r.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(r.remindAt)}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
              r.completed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}>
              {r.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
