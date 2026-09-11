import { Settings, Shield, Palette, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Application Settings</span>
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage preferences and security configuration</p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Palette className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Appearance Theme</h3>
            <p className="text-xs text-slate-400 mt-0.5">Dark mode enabled by default (SaaS Theme)</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
          <Shield className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Security & Session</h3>
            <p className="text-xs text-slate-400 mt-0.5">HTTP-only cookie JWT auth active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
