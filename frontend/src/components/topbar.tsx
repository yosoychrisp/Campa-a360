"use client";
import { useTheme } from "next-themes";
import { Sun, Moon, Search, Bell } from "lucide-react";
import { useEffect, useState } from "react";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-surface-dark/70 backdrop-blur px-6 py-4">
      <div className="relative w-full max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Buscar contactos, líderes, eventos..."
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent-500" />
        </button>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
        <div className="h-9 w-9 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-medium">
          A
        </div>
      </div>
    </header>
  );
}
