import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Folder, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default async function CategoriesPage() {
  const user = await requireAuth();

  const categories = await prisma.category.findMany({
    where: { userId: user.userId },
    include: { _count: { select: { notes: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Folder className="w-6 h-6 text-indigo-400" />
            <span>Categories Management</span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Organize your workspace notes by topics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: c.color }}
                >
                  <Folder className="w-5 h-5 text-white" />
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                  {c._count.notes} Notes
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">{c.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{c.description || 'No description provided'}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-2">
              <Link
                href={`/notes?category=${c.id}`}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl"
              >
                View Notes
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
