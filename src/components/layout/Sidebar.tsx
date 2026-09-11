"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Pin,
  Heart,
  Archive,
  Folder,
  Bell,
  Calendar,
  Tag,
  Trash2,
  Bookmark,
  Settings,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "All Notes", href: "/notes", icon: FileText },
  { label: "Pinned", href: "/pinned", icon: Pin },
  { label: "Favorites", href: "/favorites", icon: Heart },
  { label: "Archived", href: "/archived", icon: Archive },
  { label: "Categories", href: "/categories", icon: Folder },
  // { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Tags", href: "/tags", icon: Tag },
  { label: "Templates", href: "/templates", icon: Bookmark },
  { label: "Trash", href: "/trash", icon: Trash2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 hidden md:flex h-screen sticky top-0">
      <div>
        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 mb-6"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/30 text-base">
            NR
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight leading-tight">
              Note Remember
            </h1>
            <p className="text-[10px] text-indigo-400 font-medium">
              Personal Knowledge SaaS
            </p>
          </div>
        </Link>

        {/* Quick Action */}
        <Link
          href="/notes/new"
          className="w-full mb-6 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </Link>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60",
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-indigo-400" : "text-slate-400",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
