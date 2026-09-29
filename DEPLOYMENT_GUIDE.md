# Guía Completa de Despliegue: Mis Delirios Ranch
### Subdominio oficial: `misdeliriosranch.360siace.com` | Base de Datos: MariaDB `siacecom_misdelirios`

---

## 1. Resumen de Arquitectura y Opciones

Esta aplicación cuenta con dos partes:
1. **Frontend**: React 19 + Tailwind v4 + Vite (sitio web interactivo, mapa de lotes, catálogo, CMS administrativo, reproductor de video).
2. **Backend**: Node.js + Express (`server-core.ts`) conectado a la base de datos **MariaDB (`siacecom_misdelirios`)** en el servidor `45.79.40.132` (`www.360siace.com`), con persistencia de videos/imágenes y **motor de actualización en tiempo real** (Server-Sent Events + Polling de respaldo).

Tienes **dos formas principales** de desplegarla:

| Característica | Opción A: Servidor Node / PM2 en `45.79.40.132` (Recomendada) | Opción B: Vercel (Frontend) + Servidor (Backend/Media) |
|---|---|---|
| **Velocidad con MariaDB** | **Latencia Cero** (conexión local directa) | Depende del enlace Vercel -> Servidor |
| **Archivos subidos (Videos/Fotos)** | **Permanentes en disco** en `data/uploads/` | Requiere que `/api/upload` apunte al servidor |
| **Tiempo Real (SSE)** | Conexión directa persistente sin límites | Conexión a través del proxy del servidor |
| **Dominio `misdeliriosranch.360siace.com`** | Configurado en Nginx / Apache / cPanel del servidor | Configurado en panel de Vercel con CNAME DNS |

---

## 2. Paso 1: Subir el Proyecto a GitHub

Desde la terminal en la raíz del proyecto, ejecuta:

```bash
# 1. Inicializar git (si no lo has hecho)
git init

# 2. Agregar todos los archivos (el .gitignore ya protege node_modules y archivos temporales)
git add .

# 3. Crear el commit inicial
git commit -m "feat: version lista para produccion con MariaDB y tiempo real"

# 4. Cambiar rama a main
git branch -M main

# 5. Conectar con tu repositorio remoto de GitHub (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/misdeliriosranch.git

# 6. Subir los cambios
git push -u origin main
```

---

## 3. Opción A: Despliegue Completo en el Servidor (`www.360siace.com` / `45.79.40.132`)

Esta es la opción más sencilla y robusta porque la base de datos MariaDB ya se encuentra en este servidor.

### Pasos en el Servidor (vía SSH o cPanel Terminal):

1. **Clonar el repositorio**:
   ```bash
   cd /var/www/  # o la ruta configurada en tu servidor
   git clone https://github.com/TU_USUARIO/misdeliriosranch.git misdelirios
   cd misdelirios
   ```

2. **Instalar dependencias y compilar el frontend**:
   ```bash
   npm install
   npm run build
   ```

3. **Ejecutar el servidor con PM2 (para que corra 24/7 en segundo plano)**:
   ```bash
   npm install -g pm2
   pm2 start server.ts --name "misdelirios" --interpreter tsx
   pm2 save
   pm2 startup
   ```

4. **Configurar el subdominio `misdeliriosranch.360siace.com` en Nginx o Apache**:
   
   **Si usas Nginx**:
   ```nginx
   server {
       server_name misdeliriosranch.360siace.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;

           # Desactivar buffer para Server-Sent Events (Tiempo Real)
           proxy_buffering off;
           proxy_read_timeout 86400s;
       }
   }
   ```

   **Si usas cPanel / Apache**:
   - En cPanel ve a **Subdominios** y crea `misdeliriosranch.360siace.com`.
   - Agrega en el `.htaccess` o como Application Manager la redirección inversa al puerto `3000`.

5. **Certificado SSL**:
   - En Nginx: `certbot --nginx -d misdeliriosranch.360siace.com`
   - En cPanel: Activar AutoSSL gratuito.

---

## 4. Opción B: Despliegue en Vercel con el subdominio `misdeliriosranch.360siace.com`

Si prefieres usar la infraestructura global de Vercel para el Frontend:

1. **Conectar en Vercel**:
   - Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
   - Haz clic en **"Add New Project"** y selecciona tu repositorio `misdeliriosranch`.
   - Vercel detectará automáticamente el archivo `vercel.json` ya incluido en el proyecto.
   - Framework preset: `Vite`.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
   - Haz clic en **Deploy**.

2. **Asignar el subdominio `misdeliriosranch.360siace.com` en Vercel**:
   - Ve a tu proyecto en Vercel > **Settings** > **Domains**.
   - Escribe: `misdeliriosranch.360siace.com` y pulsa **Add**.

3. **Configurar el DNS en el registrador/proveedor de `360siace.com`**:
   - Abre la zona DNS de tu dominio `360siace.com` (en cPanel, Cloudflare, Linode, etc.).
   - Agrega un nuevo registro:
     - **Tipo**: `CNAME`
     - **Nombre (Host)**: `misdelirios`
     - **Valor (Destino)**: `cname.vercel-dns.com`
     - **TTL**: Automático o 3600
   - Vercel verificará el CNAME y generará automáticamente el certificado SSL (HTTPS).

4. **Redirección de API y Base de Datos**:
   - En `vercel.json`, las rutas `/api/*` están preparadas para redirigirse a tu servidor backend (`https://misdeliriosranch.360siace.com/api/$1` o `http://45.79.40.132:3000/api/$1`), garantizando que la base de datos MariaDB y los videos subidos funcionen sin problemas.

---

## 5. Funcionamiento de la Sincronización en Tiempo Real

Para cumplir con el requisito de que **los datos se actualicen en tiempo real desde cualquier explorador sin recargar la página**:

1. **Server-Sent Events (SSE) en `/api/sync/stream`**:
   - Cada navegador que entra a la página (desde PC, Mac, iPhone, Android, Chrome, Safari, etc.) abre una conexión en tiempo real con el servidor.
   - Cuando cualquier usuario o administrador realiza un cambio en el CMS (cambiar el estado de un lote, subir o cambiar un video, editar precios, modificar textos):
     - El servidor guarda inmediatamente en **MariaDB**.
     - El servidor emite un evento instantáneo de actualización (`event: update`) por el canal SSE.
     - **Todos los exploradores conectados reciben el aviso en menos de 100 milisegundos** y actualizan la vista automáticamente.

2. **Heartbeat / Polling de Respaldo cada 10 segundos (`/api/sync/version`)**:
   - Si un usuario está en un teléfono móvil y apaga la pantalla, o la conexión a internet parpadea, el cliente verifica periódicamente la versión del servidor.
   - Al volver a encender la pantalla o reconectarse la red, la aplicación detecta si hay una versión más nueva en MariaDB y actualiza la pantalla al instante.

3. **Cero Dependencia de Firebase**:
   - El sistema opera 100% de manera autónoma con el backend y MariaDB en `45.79.40.132`.
