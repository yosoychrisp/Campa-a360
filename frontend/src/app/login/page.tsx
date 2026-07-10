"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new URLSearchParams();
      form.set("username", email);
      form.set("password", password);
      const { data } = await api.post("/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      localStorage.setItem("access_token", data.access_token);
      router.push("/dashboard");
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark px-4">
      <div className="card w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-lg bg-brand-500 flex items-center justify-center">
            <Megaphone size={18} className="text-white" />
          </div>
          <span className="font-display font-semibold text-lg">Campaña 360</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Correo electrónico</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Contraseña</label>
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
