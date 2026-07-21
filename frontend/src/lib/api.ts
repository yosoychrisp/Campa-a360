import axios from "axios";

const API_BASE_URL =
     process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith("http")
       ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
       : "https://campana360-backend.onrender.com/api/v1";

   export const api = axios.create({
     baseURL: API_BASE_URL,
   });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DashboardStats {
  total_contactos: number;
  personas_activas: number;
  personas_pendientes: number;
  reuniones_proximas: number;
  actividades_hoy: number;
  mensajes_enviados: number;
  distribucion_por_estado: Record<string, number>;
}

export interface Contact {
  id: string;
  nombre: string;
  apellido: string;
  documento?: string;
  telefono?: string;
  correo?: string;
  estado: string;
  fecha_creacion: string;
  ultimo_contacto?: string;
}

export interface ContactPage {
  total: number;
  page: number;
  page_size: number;
  items: Contact[];
}

export interface Municipio { id: string; nombre: string }
export interface Barrio { id: string; nombre: string; municipio_id: string }
export interface PuestoVotacion { id: string; nombre: string; direccion?: string; municipio_id: string }

export interface Evento {
  id: string;
  titulo: string;
  descripcion?: string;
  tipo: "reunion" | "evento" | "recordatorio";
  fecha_inicio: string;
  fecha_fin?: string;
  lugar?: string;
  responsable_id: string;
}

export interface Plantilla {
  id: string;
  nombre: string;
  contenido: string;
  whatsapp_template_name?: string;
  creado_en: string;
}

export interface Mensaje {
  id: string;
  contact_id: string;
  tipo: string;
  contenido?: string;
  estado: string;
  programado_para?: string;
  enviado_en?: string;
}

export interface AuditLogItem {
  id: string;
  usuario_id?: string;
  accion: string;
  entidad?: string;
  entidad_id?: string;
  fecha: string;
}

export interface AppUser {
  id: string;
  full_name: string;
  email: string;
  role: "administrador" | "coordinador" | "lider" | "digitador";
  is_active: boolean;
  phone?: string;
}

export interface AppSettings {
  id: string;
  nombre_campana?: string;
  logo_url?: string;
  color_primario?: string;
  color_acento?: string;
}
