import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { User, Mail, Calendar, FileText, Bell } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function ProfilePage() {
  const user = await requireAuth();

  const [notesCount, remindersCount] = await Promise.all([
    prisma.note.count({ where: { userId: user.userId, isDeleted: false } }),
    prisma.reminder.count({ where: { userId: user.userId } }),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-2xl shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Saved Notes</p>
            <p className="text-2xl font-bold text-white mt-1">{notesCount}</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Reminders</p>
            <p className="text-2xl font-bold text-white mt-1">{remindersCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
