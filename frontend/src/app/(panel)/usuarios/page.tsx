"use client";
import { Fragment, useEffect, useState } from "react";
import { Plus, UserCog, Pencil, X } from "lucide-react";
import { api, AppUser } from "@/lib/api";

const ROLE_STYLES: Record<string, string> = {
  administrador: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  coordinador: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
  lider: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  digitador: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const DEMO: AppUser[] = [
  { id: "1", full_name: "Administrador", email: "admin@campana360.local", role: "administrador", is_active: true },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<AppUser[]>(DEMO);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "digitador" as AppUser["role"] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    api.get<AppUser[]>("/users").then((r) => r.data.length && setUsuarios(r.data)).catch(() => {});
  }, []);

  async function crearUsuario() {
    if (!form.full_name.trim() || !form.email.trim() || !form.password) return;
    try {
      const { data } = await api.post<AppUser>("/users", { ...form, is_active: true });
      setUsuarios((prev) => [...prev, data]);
    } catch {
      setUsuarios((prev) => [...prev, { id: crypto.randomUUID(), is_active: true, ...form }]);
    }
    setForm({ full_name: "", email: "", password: "", role: "digitador" });
    setShowForm(false);
  }

  async function guardarPassword(id: string) {
    if (!newPassword.trim()) return;
    try {
      await api.put(`/users/${id}`, { password: newPassword });
    } catch {
      // demo sin backend conectado
    }
    setEditingId(null);
    setNewPassword("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold">Usuarios</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Administradores, coordinadores, líderes y digitadores.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
          <Plus size={16} /> Nuevo usuario
        </button>
      </div>

      <div className="card bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Si acabas de instalar la plataforma, cambia la contraseña del usuario <code>admin@campana360.local</code>{" "}
          ahora mismo usando el botón <Pencil size={12} className="inline" /> de su fila.
        </p>
      </div>

      {showForm && (
        <div className="card grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Nombre completo" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <input className="input" placeholder="Correo electrónico" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Contraseña temporal" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AppUser["role"] })}>
            <option value="administrador">Administrador</option>
            <option value="coordinador">Coordinador</option>
            <option value="lider">Líder</option>
            <option value="digitador">Digitador</option>
          </select>
          <button className="btn-primary sm:col-span-2 justify-center" onClick={crearUsuario}>Crear usuario</button>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-left text-slate-500 dark:text-slate-400">
            <tr><th className="px-5 py-3">Nombre</th><th className="px-5 py-3">Correo</th><th className="px-5 py-3">Rol</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {usuarios.map((u) => (
              <Fragment key={u.id}>
                <tr>
                  <td className="px-5 py-3 font-medium flex items-center gap-2"><UserCog size={14} className="text-slate-400" /> {u.full_name}</td>
                  <td className="px-5 py-3 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_STYLES[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{u.is_active ? "Activo" : "Inactivo"}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      className="text-slate-400 hover:text-brand-500"
                      onClick={() => setEditingId(editingId === u.id ? null : u.id)}
                    >
                      {editingId === u.id ? <X size={16} /> : <Pencil size={16} />}
                    </button>
                  </td>
                </tr>
                {editingId === u.id && (
                  <tr key={`${u.id}-edit`}>
                    <td colSpan={5} className="px-5 pb-4">
                      <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3">
                        <input
                          className="input"
                          type="password"
                          placeholder="Nueva contraseña"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button className="btn-primary" onClick={() => guardarPassword(u.id)}>Guardar</button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
