import { LucideIcon } from "lucide-react";

export function StatCard({
  label, value, icon: Icon, tint,
}: { label: string; value: string | number; icon: LucideIcon; tint: string }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${tint}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-display font-semibold">{value}</p>
      </div>
    </div>
  );
}
