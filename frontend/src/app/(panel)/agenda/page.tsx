"use client";
import { useEffect, useState } from "react";
import { Plus, CalendarDays, MapPin, Clock } from "lucide-react";
import { api, Evento } from "@/lib/api";

const DEMO: Evento[] = [
  { id: "1", titulo: "Reunión con líderes de Itagüí", tipo: "reunion", fecha_inicio: new Date(Date.now() + 86400000).toISOString(), lugar: "Salón comunal La Unión", responsable_id: "u1" },
  { id: "2", titulo: "Recorrido barrio Santa María", tipo: "evento", fecha_inicio: new Date(Date.now() + 2 * 86400000).toISOString(), lugar: "Barrio Santa María", responsable_id: "u1" },
];

const TIPO_STYLES: Record<string, string> = {
  reunion: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
  evento: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
  recordatorio: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
};

export default function AgendaPage() {
  const [eventos, setEventos] = useState<Evento[]>(DEMO);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [lugar, setLugar] = useState("");
  const [tipo, setTipo] = useState<"reunion" | "evento" | "recordatorio">("reunion");

  useEffect(() => {
    api.get<Evento[]>("/agenda").then((r) => r.data.length && setEventos(r.data)).catch(() => {});
  }, []);

  async function crearEvento() {
    if (!titulo.trim() || !fecha) return;
    const payload = { titulo, fecha_inicio: new Date(fecha).toISOString(), lugar, tipo };
    try {
      const { data } = await api.post<Evento>("/agenda", payload);
      setEventos((prev) => [...prev, data].sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio)));
    } catch {
      setEventos((prev) =>
        [...prev, { id: crypto.randomUUID(), responsable_id: "u1", ...payload }].sort((a, b) =>
          a.fecha_inicio.localeCompare(b.fecha_inicio)
        )
      );
    }
    setTitulo(""); setFecha(""); setLugar(""); setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold">Agenda</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Reuniones, eventos y recordatorios de la campaña.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
          <Plus size={16} /> Nuevo evento
        </button>
      </div>

      {showForm && (
        <div className="card grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="input sm:col-span-2" placeholder="Título del evento" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <input className="input" type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)}>
            <option value="reunion">Reunión</option>
            <option value="evento">Evento</option>
            <option value="recordatorio">Recordatorio</option>
          </select>
          <input className="input sm:col-span-2" placeholder="Lugar" value={lugar} onChange={(e) => setLugar(e.target.value)} />
          <button className="btn-primary sm:col-span-2 justify-center" onClick={crearEvento}>Guardar evento</button>
        </div>
      )}

      <div className="space-y-3">
        {eventos.map((ev) => (
          <div key={ev.id} className="card flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
              <CalendarDays size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{ev.titulo}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TIPO_STYLES[ev.tipo]}`}>{ev.tipo}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(ev.fecha_inicio).toLocaleString("es-CO")}</span>
                {ev.lugar && <span className="flex items-center gap-1"><MapPin size={14} /> {ev.lugar}</span>}
              </div>
            </div>
          </div>
        ))}
        {eventos.length === 0 && <p className="text-center text-slate-400 py-8">No hay eventos programados.</p>}
      </div>
    </div>
  );
}
