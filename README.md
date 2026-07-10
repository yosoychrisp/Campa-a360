# Campaña 360

Plataforma integral para la organización, coordinación y gestión de campañas políticas.

## 1. Arquitectura del sistema

```
                     ┌────────────────────┐
                     │       Nginx         │  ← proxy reverso (puerto 80)
                     └─────────┬───────────┘
                 ┌─────────────┴─────────────┐
        ┌────────▼────────┐         ┌────────▼─────────┐
        │  Frontend        │         │  Backend           │
        │  Next.js 14 + TS │  HTTP   │  FastAPI (Python)  │
        │  Tailwind CSS    │────────▶│  REST + JWT         │
        └──────────────────┘         └────────┬──────────┘
                                                │ SQLAlchemy
                                       ┌────────▼──────────┐
                                       │   PostgreSQL 16     │
                                       └─────────────────────┘
```

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS. Modo claro/oscuro con `next-themes`, gráficos con `recharts`, iconos con `lucide-react`.
- **Backend**: FastAPI con arquitectura por capas: `models` (SQLAlchemy) → `schemas` (Pydantic) → `api/v1/endpoints` (routers) → `core` (seguridad, config, dependencias). Documentación automática en `/api/docs` (Swagger) y `/api/redoc`.
- **Base de datos**: PostgreSQL con relaciones normalizadas, llaves foráneas e índices en campos de búsqueda frecuente (nombre, documento, teléfono).
- **Autenticación**: JWT (access + refresh token) con control de acceso por rol (`administrador`, `coordinador`, `lider`, `digitador`) vía dependencias de FastAPI (`require_roles`).
- **Infraestructura**: Docker Compose orquesta 4 servicios (db, backend, frontend, nginx). Nginx actúa como punto de entrada único y agrega cabeceras de seguridad básicas.

## 2. Modelo de base de datos (resumen)

| Tabla | Propósito |
|---|---|
| `users` | Usuarios del sistema y su rol |
| `municipios`, `corregimientos`, `veredas`, `barrios`, `sectores` | Jerarquía territorial |
| `puestos_votacion`, `mesas` | Estructura electoral |
| `contacts` | Ficha CRM de cada persona (con FK a territorio, líder responsable, etiquetas) |
| `tags`, `contact_tags` | Etiquetado flexible de contactos (N:N) |
| `seguimientos` | Historial de interacción por contacto (llamadas, visitas, compromisos...) |
| `eventos` | Agenda: reuniones, eventos, recordatorios |
| `mensajes`, `plantillas_mensaje` | Registro de envíos vía WhatsApp Business API y plantillas |
| `audit_logs` | Bitácora de auditoría (quién hizo qué y cuándo) |

Todas las tablas usan `UUID` como llave primaria (mejor para sistemas distribuidos y evita enumeración de IDs). Las migraciones se gestionan con Alembic.

## 3. Cómo ejecutar el proyecto (desarrollo)

```bash
# 1. Clona/copia el proyecto y entra a la carpeta
cd campana360

# 2. Backend: copia y ajusta las variables de entorno
cp backend/.env.example backend/.env
# Genera una clave segura para SECRET_KEY:
openssl rand -hex 32

# 3. Levanta todo con Docker Compose
docker compose up --build

# 4. Accede a:
#    http://localhost         -> App (vía Nginx)
#    http://localhost:3000    -> Frontend directo
#    http://localhost:8000/api/docs -> Swagger de la API
```

Al iniciar, el backend crea automáticamente las tablas y un usuario administrador:
- **Correo**: `admin@campana360.local`
- **Contraseña**: `CambiarEsta123!` ⚠️ *cámbiala de inmediato en producción.*

Para producción, reemplaza `python -m app.initial_data` (crea tablas directo) por migraciones versionadas con Alembic:
```bash
cd backend
alembic revision --autogenerate -m "init"
alembic upgrade head
```

## 4. Estado de los módulos

Todos los módulos del pedido original ya tienen **backend (API REST) y frontend (páginas funcionales)**:

| Módulo | Backend | Frontend |
|---|---|---|
| Autenticación (JWT + roles) | ✅ `/api/v1/auth` | ✅ `/login` |
| Dashboard con indicadores | ✅ `/api/v1/dashboard` | ✅ `/dashboard` |
| Contactos (CRM completo + historial de seguimiento) | ✅ `/api/v1/contacts` | ✅ `/contactos` |
| Organización territorial | ✅ `/api/v1/territorial` | ✅ `/territorial` |
| Agenda (reuniones, eventos, recordatorios) | ✅ `/api/v1/agenda` | ✅ `/agenda` |
| Comunicaciones (WhatsApp Business API) | ✅ `/api/v1/comunicaciones` | ✅ `/comunicaciones` |
| Reportes (PDF/Excel) | ✅ `/api/v1/reportes` | ✅ `/reportes` |
| Usuarios y permisos | ✅ `/api/v1/users` | ✅ `/usuarios` |
| Seguridad / bitácora de auditoría | ✅ `/api/v1/auditoria` | ✅ `/seguridad` |
| Configuración global | ✅ `/api/v1/configuracion` | ✅ `/configuracion` |

Nota: las páginas del frontend muestran datos de ejemplo si el backend aún no está corriendo, para que puedas ver el diseño completo sin depender de la API — apenas conectas el backend (local o en Render), empiezan a usar datos reales automáticamente.

## 5. Roles y permisos

| Rol | Permisos típicos |
|---|---|
| **Administrador** | Acceso total: usuarios, configuración, todos los contactos |
| **Coordinador** | Gestión de contactos y líderes, reportes, sin gestión de usuarios |
| **Líder** | Solo ve y gestiona los contactos bajo su responsabilidad |
| **Digitador** | Captura y edición de contactos, sin acceso a reportes ni configuración |

## 6. Plan de desarrollo — próximos refinamientos

**Fase 1 — Fundamentos (incluida en esta entrega)**
- Arquitectura, Docker Compose, base de datos completa, autenticación JWT y roles.
- Módulo de usuarios (CRUD + permisos).
- Módulo de contactos/CRM (CRUD, búsqueda, filtros, paginación, import/export Excel).
- Dashboard con indicadores en tiempo real y gráfico de distribución.
- UI base: sidebar, topbar, modo claro/oscuro, sistema de diseño (Tailwind tokens).

**Fase 2 — Organización territorial y agenda**
- CRUD de municipios/corregimientos/veredas/barrios/sectores/puestos/mesas.
- Asignación de contactos a líderes y territorio desde la UI.
- Calendario de eventos/reuniones con recordatorios y notificaciones.

**Fase 3 — Comunicaciones (WhatsApp Business API)**
- Integración con la API oficial de Meta (Cloud API): envío de texto, imágenes, documentos, video y audio.
- Plantillas de mensaje aprobadas por Meta, programación de envíos, historial y estados (enviado/entregado/leído).
- **Nota de cumplimiento**: solo se debe contactar a personas que hayan dado consentimiento explícito (campo `acepta_comunicaciones`), respetando las políticas de Meta y la normativa de protección de datos aplicable (en Colombia, la Ley 1581 de 2012).

**Fase 4 — Reportes y seguridad avanzada**
- Reportes dinámicos exportables a PDF/Excel.
- Bitácora de auditoría visible en UI, copias de seguridad automatizadas, protección adicional (rate limiting, 2FA opcional).

**Fase 5 — Tiempo real y refinamiento**
- Notificaciones en tiempo real vía WebSockets.
- Búsqueda avanzada, carga masiva de archivos, panel administrativo completo, ajustes de rendimiento y pruebas de carga.

## 7. Buenas prácticas ya aplicadas

- Contraseñas con hashing `bcrypt`, nunca en texto plano.
- Tokens JWT de corta duración + refresh token.
- Borrado lógico de usuarios (no se pierde el historial).
- Bitácora de auditoría en acciones sensibles (login, creación/edición/eliminación de contactos).
- Separación estricta de capas (modelos / esquemas / endpoints / seguridad).
- CORS restringido por configuración, no abierto por defecto.
