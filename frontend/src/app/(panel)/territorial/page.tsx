"use client";
import { useEffect, useState } from "react";
import { Plus, MapPin, Trash2 } from "lucide-react";
import { api, Municipio, Barrio, PuestoVotacion } from "@/lib/api";

const DEMO_MUNICIPIOS: Municipio[] = [
  { id: "m1", nombre: "Itagüí" },
  { id: "m2", nombre: "Medellín" },
  { id: "m3", nombre: "Envigado" },
];

export default function TerritorialPage() {
  const [municipios, setMunicipios] = useState<Municipio[]>(DEMO_MUNICIPIOS);
  const [barrios, setBarrios] = useState<Barrio[]>([]);
  const [puestos, setPuestos] = useState<PuestoVotacion[]>([]);
  const [nuevoMunicipio, setNuevoMunicipio] = useState("");
  const [nuevoBarrio, setNuevoBarrio] = useState("");
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<string>("");

  useEffect(() => {
    api.get<Municipio[]>("/territorial/municipios").then((r) => setMunicipios(r.data)).catch(() => {});
    api.get<Barrio[]>("/territorial/barrios").then((r) => setBarrios(r.data)).catch(() => {});
    api.get<PuestoVotacion[]>("/territorial/puestos-votacion").then((r) => setPuestos(r.data)).catch(() => {});
  }, []);

  async function crearMunicipio() {
    if (!nuevoMunicipio.trim()) return;
    try {
      const { data } = await api.post<Municipio>("/territorial/municipios", { nombre: nuevoMunicipio });
      setMunicipios((prev) => [...prev, data]);
    } catch {
      setMunicipios((prev) => [...prev, { id: crypto.randomUUID(), nombre: nuevoMunicipio }]);
    }
    setNuevoMunicipio("");
  }

  async function crearBarrio() {
    if (!nuevoBarrio.trim() || !municipioSeleccionado) return;
    try {
      const { data } = await api.post<Barrio>("/territorial/barrios", {
        nombre: nuevoBarrio, municipio_id: municipioSeleccionado,
      });
      setBarrios((prev) => [...prev, data]);
    } catch {
      setBarrios((prev) => [...prev, { id: crypto.randomUUID(), nombre: nuevoBarrio, municipio_id: municipioSeleccionado }]);
    }
    setNuevoBarrio("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">Organización territorial</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Municipios, corregimientos, veredas, barrios, sectores y puestos de votación.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Municipios */}
        <div className="card">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-brand-500" /> Municipios
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              className="input"
              placeholder="Nombre del municipio"
              value={nuevoMunicipio}
              onChange={(e) => setNuevoMunicipio(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && crearMunicipio()}
            />
            <button className="btn-primary" onClick={crearMunicipio}><Plus size={16} /></button>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {municipios.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-2 text-sm">
                {m.nombre}
                <button className="text-slate-400 hover:text-rose-500"><Trash2 size={15} /></button>
              </li>
            ))}
          </ul>
        </div>

        {/* Barrios */}
        <div className="card">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-accent-500" /> Barrios
          </h2>
          <div className="flex flex-col gap-2 mb-4">
            <select
              className="input"
              value={municipioSeleccionado}
              onChange={(e) => setMunicipioSeleccionado(e.target.value)}
            >
              <option value="">Selecciona un municipio...</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                className="input"
                placeholder="Nombre del barrio"
                value={nuevoBarrio}
                onChange={(e) => setNuevoBarrio(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && crearBarrio()}
              />
              <button className="btn-primary" onClick={crearBarrio}><Plus size={16} /></button>
            </div>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {barrios.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-2 text-sm">
                {b.nombre}
                <span className="text-xs text-slate-400">
                  {municipios.find((m) => m.id === b.municipio_id)?.nombre}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-violet-500" /> Puestos de votación
        </h2>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 dark:text-slate-400">
            <tr><th className="py-2">Nombre</th><th className="py-2">Dirección</th><th className="py-2">Municipio</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {puestos.map((p) => (
              <tr key={p.id}>
                <td className="py-2">{p.nombre}</td>
                <td className="py-2 text-slate-500">{p.direccion ?? "—"}</td>
                <td className="py-2 text-slate-500">{municipios.find((m) => m.id === p.municipio_id)?.nombre ?? "—"}</td>
              </tr>
            ))}
            {puestos.length === 0 && (
              <tr><td colSpan={3} className="py-4 text-center text-slate-400">Aún no hay puestos de votación registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
