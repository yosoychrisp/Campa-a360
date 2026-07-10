"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Map, CalendarDays, MessageSquare,
  ClipboardList, ShieldCheck, Settings, Megaphone, UserCog,
} from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contactos", label: "Contactos", icon: Users },
  { href: "/territorial", label: "Organización territorial", icon: Map },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/comunicaciones", label: "Comunicaciones", icon: MessageSquare },
  { href: "/reportes", label: "Reportes", icon: ClipboardList },
  { href: "/usuarios", label: "Usuarios", icon: UserCog },
  { href: "/seguridad", label: "Seguridad", icon: ShieldCheck },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-cardDark px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
          <Megaphone size={18} className="text-white" />
        </div>
        <span className="font-display font-semibold text-lg">Campaña 360</span>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
