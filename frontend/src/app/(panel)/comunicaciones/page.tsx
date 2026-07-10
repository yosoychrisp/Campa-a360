"use client";
import { useEffect, useState } from "react";
import { MessageSquare, Send, FileText, Plus } from "lucide-react";
import { api, Plantilla, Mensaje } from "@/lib/api";

const ESTADO_STYLES: Record<string, string> = {
  enviado: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  entregado: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  leido: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
  programado: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  fallido: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function ComunicacionesPage() {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nombrePlantilla, setNombrePlantilla] = useState("");
  const [contenidoPlantilla, setContenidoPlantilla] = useState("");

  useEffect(() => {
    api.get<Plantilla[]>("/comunicaciones/plantillas").then((r) => setPlantillas(r.data)).catch(() => {});
    api.get<Mensaje[]>("/comunicaciones/mensajes").then((r) => setMensajes(r.data)).catch(() => {});
  }, []);

  async function crearPlantilla() {
    if (!nombrePlantilla.trim() || !contenidoPlantilla.trim()) return;
    try {
      const { data } = await api.post<Plantilla>("/comunicaciones/plantillas", {
        nombre: nombrePlantilla, contenido: contenidoPlantilla,
      });
      setPlantillas((prev) => [data, ...prev]);
    } catch {
      setPlantillas((prev) => [
        { id: crypto.randomUUID(), nombre: nombrePlantilla, contenido: contenidoPlantilla, creado_en: new Date().toISOString() },
        ...prev,
      ]);
    }
    setNombrePlantilla(""); setContenidoPlantilla("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">Comunicaciones</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Envío de mensajes a través de la API oficial de WhatsApp Business (Meta Cloud API).
        </p>
      </div>

      <div className="card bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Solo se envían mensajes a contactos que hayan dado <strong>consentimiento explícito</strong>
          {" "}(campo &quot;Acepta comunicaciones&quot;). Configura tu token y número en el archivo <code>.env</code> del backend.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plantillas */}
        <div className="card">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <FileText size={18} className="text-brand-500" /> Plantillas de mensaje
          </h2>
          <div className="space-y-2 mb-4">
            <input className="input" placeholder="Nombre de la plantilla" value={nombrePlantilla} onChange={(e) => setNombrePlantilla(e.target.value)} />
            <textarea className="input min-h-[80px]" placeholder="Contenido del mensaje..." value={contenidoPlantilla} onChange={(e) => setContenidoPlantilla(e.target.value)} />
            <button className="btn-primary w-full justify-center" onClick={crearPlantilla}><Plus size={16} /> Guardar plantilla</button>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {plantillas.map((p) => (
              <li key={p.id} className="py-3">
                <p className="font-medium text-sm">{p.nombre}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{p.contenido}</p>
              </li>
            ))}
            {plantillas.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">Aún no has creado plantillas.</p>}
          </ul>
        </div>

        {/* Historial de mensajes */}
        <div className="card">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-accent-500" /> Historial de envíos
          </h2>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {mensajes.map((m) => (
              <li key={m.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm line-clamp-1">{m.contenido ?? `[${m.tipo}]`}</p>
                  <p className="text-xs text-slate-400">
                    {m.enviado_en ? new Date(m.enviado_en).toLocaleString("es-CO") : "Sin enviar aún"}
                  </p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_STYLES[m.estado] ?? ""}`}>
                  {m.estado}
                </span>
              </li>
            ))}
            {mensajes.length === 0 && (
              <p className="text-sm text-slate-400 py-4 text-center">
                Aún no se han enviado mensajes. Envíalos desde la ficha de cada contacto.
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
