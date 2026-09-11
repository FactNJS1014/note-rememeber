import Link from 'next/link';
import { Bookmark, FileText, ArrowRight } from 'lucide-react';

const templates = [
  { title: 'Meeting Notes', desc: 'Attendees, Agenda, Key Action Items, Next steps', category: 'Meeting' },
  { title: 'Programming Problem & Solution', desc: 'Problem statement, Code snippet, Explanation, References', category: 'Programming' },
  { title: 'Daily Goal Journal', desc: 'Top priorities, Achievements, Blockers, Tomorrow plans', category: 'Personal' },
  { title: 'Project Planning Document', desc: 'Scope, Milestones, Tech Stack, Task breakdown', category: 'Work' },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-indigo-400" />
          <span>Note Templates</span>
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Accelerate note creation with pre-built structures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((t) => (
          <div key={t.title} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold text-white">{t.title}</h2>
              <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-semibold">
                {t.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
            <Link
              href="/notes/new"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:underline pt-2"
            >
              <span>Use Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
