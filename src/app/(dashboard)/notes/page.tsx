import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { FileText, Plus, Pin, Heart, Filter, Tag as TagIcon, Calendar, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function NotesListPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; tag?: string; sort?: string };
}) {
  const user = await requireAuth();

  const search = searchParams.search || '';
  const categoryId = searchParams.category;
  const tag = searchParams.tag;
  const sort = searchParams.sort || 'newest';

  // Build Prisma query filter
  const whereFilter: any = {
    userId: user.userId,
    isDeleted: false,
    isArchived: false,
  };

  if (search) {
    whereFilter.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (categoryId) {
    whereFilter.categoryId = categoryId;
  }

  if (tag) {
    whereFilter.tags = {
      some: {
        tag: {
          name: tag.toLowerCase(),
        },
      },
    };
  }

  // Sorting logic
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'oldest') orderBy = { createdAt: 'asc' };
  if (sort === 'updated') orderBy = { updatedAt: 'desc' };
  if (sort === 'title') orderBy = { title: 'asc' };

  const [notes, categories, tags] = await Promise.all([
    prisma.note.findMany({
      where: whereFilter,
      orderBy,
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    }),
    prisma.category.findMany({ where: { userId: user.userId } }),
    prisma.tag.findMany({ where: { userId: user.userId } }),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            <span>All Notes</span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage, filter, and organize all your saved notes
          </p>
        </div>
        <Link
          href="/notes/new"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-300 mr-2">Filter:</span>
          
          <Link
            href="/notes"
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              !categoryId && !tag ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            All
          </Link>

          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/notes?category=${c.id}`}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                categoryId === c.id ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Search status */}
        {search && (
          <div className="text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
            Query: "{search}"
          </div>
        )}
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="p-16 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No notes found</h3>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or create a new note.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group relative shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h2 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors text-base line-clamp-1">
                    {note.title}
                  </h2>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {note.isPinned && <Pin className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    {note.isFavorite && <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />}
                  </div>
                </div>

                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
                  {note.excerpt || note.content}
                </p>
              </div>

              <div>
                {/* Tags list */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {note.tags.map((t) => (
                      <span
                        key={t.tagId}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono"
                      >
                        {t.tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 font-medium">
                    {note.category?.name || 'General'}
                  </span>
                  <span>{formatDate(note.updatedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
