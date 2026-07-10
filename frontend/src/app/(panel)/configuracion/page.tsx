"use client";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save, Palette, Building2 } from "lucide-react";
import { api, AppSettings } from "@/lib/api";

export default function ConfiguracionPage() {
  const [settings, setSettings] = useState<AppSettings>({
    id: "default",
    nombre_campana: "Mi Campaña",
    color_primario: "#3763f4",
    color_acento: "#f4a13a",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<AppSettings>("/configuracion").then((r) => setSettings(r.data)).catch(() => {});
  }, []);

  async function guardar() {
    try {
      await api.put("/configuracion", settings);
    } catch {
      // en demo sin backend conectado, solo se refleja localmente
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-semibold">Configuración</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Personaliza el nombre, logo y colores de tu campaña.</p>
      </div>

      <div className="card space-y-4">
        <h2 className="font-display font-semibold flex items-center gap-2">
          <Building2 size={18} className="text-brand-500" /> Identidad de la campaña
        </h2>
        <div>
          <label className="text-sm font-medium block mb-1">Nombre de la campaña</label>
          <input
            className="input"
            value={settings.nombre_campana ?? ""}
            onChange={(e) => setSettings({ ...settings, nombre_campana: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">URL del logo</label>
          <input
            className="input"
            placeholder="https://..."
            value={settings.logo_url ?? ""}
            onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
          />
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-display font-semibold flex items-center gap-2">
          <Palette size={18} className="text-accent-500" /> Colores de marca
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Color primario</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-10 w-14 rounded-lg border border-slate-200 dark:border-slate-700"
                value={settings.color_primario ?? "#3763f4"}
                onChange={(e) => setSettings({ ...settings, color_primario: e.target.value })}
              />
              <span className="text-sm text-slate-500">{settings.color_primario}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Color de acento</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-10 w-14 rounded-lg border border-slate-200 dark:border-slate-700"
                value={settings.color_acento ?? "#f4a13a"}
                onChange={(e) => setSettings({ ...settings, color_acento: e.target.value })}
              />
              <span className="text-sm text-slate-500">{settings.color_acento}</span>
            </div>
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={guardar}>
        <Save size={16} /> {saved ? "Guardado ✓" : "Guardar cambios"}
      </button>
    </div>
  );
}
