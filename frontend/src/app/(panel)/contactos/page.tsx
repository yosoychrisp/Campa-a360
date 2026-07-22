"use client";
import { useEffect, useState } from "react";
import { Plus, Search, Download, Upload, X } from "lucide-react";
import { api, Contact, ContactPage, AppUser } from "@/lib/api";

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

const FORM_INICIAL = {
  nombre: "",
  apellido: "",
  documento: "",
  telefono: "",
  correo: "",
  direccion: "",
  leader_id: "",
};

export default function ContactosPage() {
  const [query, setQuery] = useState("");
  const [filtroLider, setFiltroLider] = useState("");
  const [data, setData] = useState<ContactPage>({ total: 0, page: 1, page_size: 25, items: [] });
  const [usuarios, setUsuarios] = useState<AppUser[]>([]);
  const [usandoDemo, setUsandoDemo] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function cargarContactos() {
    api
      .get<ContactPage>("/contacts", {
        params: { q: query || undefined, leader_id: filtroLider || undefined, page: 1, page_size: 50 },
      })
      .then((r) => {
        setData(r.data);
        setUsandoDemo(false);
      })
      .catch(() => {
        setData({ total: DEMO.length, page: 1, page_size: 25, items: DEMO });
        setUsandoDemo(true);
      });
  }

  function cargarUsuarios() {
    api
      .get<AppUser[]>("/users")
      .then((r) => setUsuarios(r.data))
      .catch(() => setUsuarios([]));
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(cargarContactos, 300);
    return () => clearTimeout(timeout);
  }, [query, filtroLider]);

  function nombreLider(id?: string) {
    if (!id) return "—";
    const u = usuarios.find((u) => u.id === id);
    return u ? u.full_name : "—";
  }

  async function crearContacto() {
    setError("");
    if (!form.nombre.trim() || !form.apellido.trim()) {
      setError("Nombre y apellido son obligatorios.");
      return;
    }
    setGuardando(true);
    try {
      await api.post("/contacts", {
        nombre: form.nombre,
        apellido: form.apellido,
        documento: form.documento || null,
        telefono: form.telefono || null,
        correo: form.correo || null,
        direccion: form.direccion || null,
        leader_id: form.leader_id || null,
        estado: "pendiente",
        acepta_comunicaciones: "no",
      });
      setForm(FORM_INICIAL);
      setShowForm(false);
      cargarContactos();
    } catch (e: any) {
      setError(
        e?.response?.data?.detail
          ? String(e.response.data.detail)
          : "No se pudo guardar el contacto. Verifica tu conexión con el servidor."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Contactos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {data.total} contactos registrados
            {usandoDemo && " (mostrando datos de ejemplo, sin conexión al servidor)"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-primary bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-surface-cardDark dark:text-slate-200 dark:border-slate-700">
            <Upload size={16} /> Importar
          </button>
          <a href="/api/v1/contacts/export/excel" className="btn-primary bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-surface-cardDark dark:text-slate-200 dark:border-slate-700">
            <Download size={16} /> Exportar
          </a>
          <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Cancelar" : "Nuevo contacto"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Nombre *" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <input className="input" placeholder="Apellido *" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
          <input className="input" placeholder="Documento" value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} />
          <input className="input" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          <input className="input" placeholder="Correo" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
          <input className="input" placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          <select
            className="input sm:col-span-2"
            value={form.leader_id}
            onChange={(e) => setForm({ ...form, leader_id: e.target.value })}
          >
            <option value="">Sin encargado asignado</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name} ({u.role})
              </option>
            ))}
          </select>
          {error && <p className="sm:col-span-2 text-sm text-rose-600">{error}</p>}
          <button className="btn-primary sm:col-span-2 justify-center" onClick={crearContacto} disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar contacto"}
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-md flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Buscar por nombre, documento o teléfono..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input max-w-xs"
          value={filtroLider}
          onChange={(e) => setFiltroLider(e.target.value)}
        >
          <option value="">Todos los encargados</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-left text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Teléfono</th>
              <th className="px-5 py-3 font-medium">Correo</th>
              <th className="px-5 py-3 font-medium">Encargado</th>
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
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{nombreLider(c.leader_id)}</td>
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
            {data.items.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Aún no hay contactos. Crea el primero con el botón de arriba.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
