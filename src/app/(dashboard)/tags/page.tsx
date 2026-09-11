import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Tag } from 'lucide-react';
import Link from 'next/link';

export default async function TagsPage() {
  const user = await requireAuth();

  const tags = await prisma.tag.findMany({
    where: { userId: user.userId },
    include: { _count: { select: { notes: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Tag className="w-6 h-6 text-indigo-400" />
          <span>Tags Explorer</span>
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Filter notes quickly by keyword tags</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map((t) => (
          <Link
            key={t.id}
            href={`/notes?tag=${encodeURIComponent(t.name)}`}
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all flex items-center gap-3"
          >
            <Tag className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-sm font-semibold text-slate-200">{t.name}</span>
            <span className="text-xs text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
              {t._count.notes}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
