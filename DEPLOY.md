# Cómo publicar Campaña 360 en internet (gratis, sin instalar nada)

Al terminar, tendrás un link público como `https://campana360-frontend.onrender.com` que
cualquier persona de tu equipo puede abrir desde su navegador (computador o celular), sin instalar nada,
e ingresar con su propio usuario.

Usamos dos servicios gratuitos: **GitHub** (guarda el código) y **Render** (lo pone a funcionar).
Todo con clics, nada de terminal ni comandos.

> ⚠️ Plan gratuito de Render: el backend "se duerme" tras 15 min sin uso (la primera visita del día
> tarda ~30-50 seg en despertar) y la base de datos gratuita expira a los 90 días. Ideal para
> empezar a usar la plataforma ya. Cuando la campaña esté en marcha en serio, te ayudo a pasar a un
> plan pago (~USD 7-14/mes) para que no se duerma ni expire la base de datos.

---

## Paso 1 — Cuenta en GitHub
Ve a https://github.com y crea una cuenta gratuita.

## Paso 2 — Crea el repositorio
1. Botón **"New"** → nombra el repositorio `campana360`.
2. Déjalo en **Public**. NO marques "Add a README".
3. **"Create repository"**.

## Paso 3 — Sube el código
1. Descomprime el `campana360.zip` que te entregué.
2. En la página del repositorio, clic en **"uploading an existing file"**.
3. Arrastra **todo el contenido de adentro** de la carpeta `campana360` (las carpetas `backend`,
   `frontend`, `nginx`, y los archivos sueltos) a la zona de carga. GitHub conserva las subcarpetas.
4. **"Commit changes"**.

## Paso 4 — Cuenta en Render
Ve a https://render.com → **"Sign up with GitHub"** (quedan conectados automáticamente).

## Paso 5 — Despliega con un clic
1. En Render: **"New"** → **"Blueprint"**.
2. Selecciona el repositorio `campana360`.
3. Render detecta `render.yaml` y muestra 3 recursos: la base de datos, el backend y el frontend,
   **ya conectados entre sí automáticamente**.
4. Clic en **"Apply"**. Espera 5-10 minutos mientras Render construye todo.

## Paso 6 — ¡Listo! Abre tu link
1. Entra al servicio **`campana360-frontend`** en Render y copia su URL pública
   (algo como `https://campana360-frontend.onrender.com`, Render podría agregarle un sufijo si el
   nombre ya está tomado — usa la URL exacta que te muestre).
2. Ábrela en cualquier navegador. Comparte ese link con tu equipo.
3. Inicia sesión con el usuario administrador que se crea automáticamente:
   - **Correo**: `admin@campana360.local`
   - **Contraseña**: `CambiarEsta123!`
4. **Cambia esa contraseña de inmediato** y crea desde ahí un usuario para cada persona de tu
   equipo (módulo *Usuarios*, con su rol: coordinador, líder o digitador). Cada quien entra con
   su propio correo y contraseña — nadie necesita instalar nada, solo abrir el link.

---

### Si algo en pantalla no coincide con estos pasos
Render actualiza su interfaz de vez en cuando. Cuéntame exactamente qué ves en ese paso
(una descripción o lo que dice el botón) y te digo qué hacer.
