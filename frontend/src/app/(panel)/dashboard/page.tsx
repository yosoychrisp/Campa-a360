"use client";
import { useEffect, useState } from "react";
import { Users, UserCheck, Clock, CalendarClock, ListChecks, Send } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { api, DashboardStats } from "@/lib/api";
import { StatCard } from "@/components/stat-card";

const COLORS = ["#3763f4", "#f4a13a", "#94a3b8", "#ef4444"];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.get<DashboardStats>("/dashboard/stats").then((r) => setStats(r.data)).catch(() => {
      // En demo sin backend conectado, mostramos datos de ejemplo
      setStats({
        total_contactos: 4821,
        personas_activas: 3120,
        personas_pendientes: 980,
        reuniones_proximas: 6,
        actividades_hoy: 14,
        mensajes_enviados: 12456,
        distribucion_por_estado: { activo: 3120, pendiente: 980, inactivo: 520, no_interesado: 201 },
      });
    });
  }, []);

  const chartData = stats
    ? Object.entries(stats.distribucion_por_estado).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Resumen general de la campaña en tiempo real.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total de contactos" value={stats?.total_contactos ?? "—"} icon={Users} tint="bg-brand-500" />
        <StatCard label="Personas activas" value={stats?.personas_activas ?? "—"} icon={UserCheck} tint="bg-emerald-500" />
        <StatCard label="Personas pendientes" value={stats?.personas_pendientes ?? "—"} icon={Clock} tint="bg-accent-500" />
        <StatCard label="Reuniones próximas" value={stats?.reuniones_proximas ?? "—"} icon={CalendarClock} tint="bg-violet-500" />
        <StatCard label="Actividades de hoy" value={stats?.actividades_hoy ?? "—"} icon={ListChecks} tint="bg-sky-500" />
        <StatCard label="Mensajes enviados" value={stats?.mensajes_enviados ?? "—"} icon={Send} tint="bg-rose-500" />
      </div>

      <div className="card">
        <h2 className="font-display font-semibold mb-4">Distribución de contactos por estado</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
