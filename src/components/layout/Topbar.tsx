"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Plus, User, LogOut, Command } from "lucide-react";
import { logoutAction } from "@/actions/auth";

export function Topbar({ user }: { user: { name: string; email: string } }) {
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/notes?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md px-6 flex items-center justify-between">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes, tags, categories... (Press Enter)"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-mono">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </form>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Add Button */}
        <Link
          href="/notes/new"
          className="hidden sm:flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Note</span>
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-semibold text-white text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-slate-200">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 max-w-[120px] truncate">
                {user.email}
              </p>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-sm">
              <div className="px-4 py-2 border-b border-slate-800 lg:hidden">
                <p className="font-semibold text-slate-200 text-xs">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800/80 text-xs"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 text-xs text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
