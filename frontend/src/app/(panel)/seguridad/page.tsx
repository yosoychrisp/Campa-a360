"use client";
import { useEffect, useState } from "react";
import { ShieldCheck, Activity } from "lucide-react";
import { api, AuditLogItem } from "@/lib/api";

const DEMO: AuditLogItem[] = [
  { id: "1", accion: "LOGIN", entidad: "User", fecha: new Date().toISOString() },
  { id: "2", accion: "CREATE_CONTACT", entidad: "Contact", fecha: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", accion: "UPDATE_CONTACT", entidad: "Contact", fecha: new Date(Date.now() - 7200000).toISOString() },
];

const ACCION_LABEL: Record<string, string> = {
  LOGIN: "Inicio de sesión",
  CREATE_CONTACT: "Contacto creado",
  UPDATE_CONTACT: "Contacto actualizado",
  DELETE_CONTACT: "Contacto eliminado",
  ADD_SEGUIMIENTO: "Seguimiento agregado",
};

export default function SeguridadPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>(DEMO);

  useEffect(() => {
    api.get<AuditLogItem[]>("/auditoria").then((r) => r.data.length && setLogs(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">Seguridad</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bitácora de auditoría: registro de todas las acciones sensibles del sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center"><ShieldCheck size={18} className="text-white" /></div>
          <div><p className="text-xs text-slate-500">Cifrado en tránsito</p><p className="font-medium text-sm">HTTPS / TLS</p></div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center"><ShieldCheck size={18} className="text-white" /></div>
          <div><p className="text-xs text-slate-500">Autenticación</p><p className="font-medium text-sm">JWT + roles</p></div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500 flex items-center justify-center"><Activity size={18} className="text-white" /></div>
          <div><p className="text-xs text-slate-500">Eventos registrados</p><p className="font-medium text-sm">{logs.length}</p></div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-left text-slate-500 dark:text-slate-400">
            <tr><th className="px-5 py-3">Acción</th><th className="px-5 py-3">Entidad</th><th className="px-5 py-3">Fecha</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((l) => (
              <tr key={l.id}>
                <td className="px-5 py-3 font-medium">{ACCION_LABEL[l.accion] ?? l.accion}</td>
                <td className="px-5 py-3 text-slate-500">{l.entidad ?? "—"}</td>
                <td className="px-5 py-3 text-slate-500">{new Date(l.fecha).toLocaleString("es-CO")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
