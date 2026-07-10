"use client";
import { useEffect, useState } from "react";
import { Plus, Search, Download, Upload } from "lucide-react";
import { api, Contact, ContactPage } from "@/lib/api";

const ESTADO_STYLES: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  pendiente: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  inactivo: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  no_interesado: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

const DEMO: Contact[] = [
  { id: "1", nombre: "Laura", apellido: "Gómez", telefono: "3001234567", correo: "laura@correo.com", estado: "activo", fecha_creacion: new Date().toISOString() },
  { id: "2", nombre: "Carlos", apellido: "Pérez", telefono: "3007654321", correo: "carlos@correo.com", estado: "pendiente", fecha_creacion: new Date().toISOString() },
  { id: "3", nombre: "Ana", apellido: "Ramírez", telefono: "3009988776", correo: "ana@correo.com", estado: "activo", fecha_creacion: new Date().toISOString() },
];

export default function ContactosPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<ContactPage>({ total: DEMO.length, page: 1, page_size: 25, items: DEMO });

  useEffect(() => {
    const timeout = setTimeout(() => {
      api
        .get<ContactPage>("/contacts", { params: { q: query || undefined, page: 1, page_size: 25 } })
        .then((r) => setData(r.data))
        .catch(() => {}); // conserva datos demo si el backend aún no está conectado
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Contactos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{data.total} contactos registrados</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-primary bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-surface-cardDark dark:text-slate-200 dark:border-slate-700">
            <Upload size={16} /> Importar
          </button>
          <button className="btn-primary bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-surface-cardDark dark:text-slate-200 dark:border-slate-700">
            <Download size={16} /> Exportar
          </button>
          <button className="btn-primary">
            <Plus size={16} /> Nuevo contacto
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Buscar por nombre, documento o teléfono..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-left text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Teléfono</th>
              <th className="px-5 py-3 font-medium">Correo</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Registrado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.items.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-5 py-3 font-medium">{c.nombre} {c.apellido}</td>
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{c.telefono ?? "—"}</td>
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{c.correo ?? "—"}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ESTADO_STYLES[c.estado] ?? ""}`}>
                    {c.estado}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                  {new Date(c.fecha_creacion).toLocaleDateString("es-CO")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
