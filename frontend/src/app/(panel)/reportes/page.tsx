"use client";
import { useEffect, useState } from "react";
import { FileDown, FileSpreadsheet, PieChart as PieIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { api } from "@/lib/api";

export default function ReportesPage() {
  const [resumen, setResumen] = useState<Record<string, number>>({
    activo: 3120, pendiente: 980, inactivo: 520, no_interesado: 201,
  });

  useEffect(() => {
    api.get("/reportes/resumen").then((r) => setResumen(r.data.por_estado)).catch(() => {});
  }, []);

  const chartData = Object.entries(resumen).map(([name, value]) => ({ name, value }));

  function descargar(url: string) {
    window.open(`/api/v1${url}`, "_blank");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">Reportes</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Exporta y visualiza el avance de la campaña.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => descargar("/contacts/export/excel")}>
          <FileSpreadsheet size={16} /> Exportar contactos a Excel
        </button>
        <button className="btn-primary bg-rose-500 hover:bg-rose-600" onClick={() => descargar("/reportes/contactos/pdf")}>
          <FileDown size={16} /> Exportar reporte PDF
        </button>
      </div>

      <div className="card">
        <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
          <PieIcon size={18} className="text-brand-500" /> Contactos por estado
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#3763f4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
