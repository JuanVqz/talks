---
marp: true
theme: default
paginate: true
backgroundColor: #fff
style: |
  section {
    font-family: 'Inter', sans-serif;
  }
  h1 {
    color: #cc0000;
  }
  h2 {
    color: #333;
  }
  code {
    background: #f4f4f4;
    padding: 2px 6px;
    border-radius: 4px;
  }
  pre {
    font-size: 0.75em;
  }
  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  blockquote {
    border-left: 4px solid #cc0000;
    padding-left: 1rem;
    font-style: italic;
    color: #555;
  }
---

<!-- _class: lead -->
# PWA en Rails
## Tu app Rails, instalable en cualquier dispositivo

---

# Sobre mí

![bg right:45%](https://avatars.githubusercontent.com/u/7331511)

- **Juan Vásquez** (@JuanVqz)
- Senior Software Engineer
- @FastRuby.io / @OmbuLabs
- 🇲🇽|🌮|🎱

---

# Sobre esta charla

- Qué es una PWA y qué necesita
- Por qué Rails decidió incluir soporte nativo
- Demo en vivo con una app real
- Qué viene: Action Notifier y Web Push

---

# Qué es una PWA?

**Progressive Web App** = Una app web que se comporta como nativa.

Tres pilares:
1. **Instalable** -- Se agrega a la pantalla de inicio
2. **Confiable** -- Carga incluso sin conexión (o con red lenta)
3. **Capaz** -- push notifications, acceso a cámara, GPS, etc.

> No es un framework, es un conjunto de APIs del navegador + un patrón de arquitectura.

---

# Qué necesita una web para ser PWA?

| Requisito | Qué es |
|-----------|--------|
| **HTTPS** | Conexión segura (requerido para service workers) |
| **Web App Manifest** | JSON que describe la app (nombre, iconos, colores) |
| **Service Worker** | Script que intercepta requests del navegador |

Solo con manifest ya podés hacer tu app **instalable**.
El service worker agrega **offline** y **push notifications** (y necesita HTTPS).

---

# Por qué HTTPS para service workers?

Un service worker puede **interceptar todos los requests** de tu app.

Sin HTTPS, un atacante podría:
- Inyectar un service worker malicioso (man-in-the-middle)
- Robar datos, redirigir requests, modificar respuestas

Los browsers exigen HTTPS para registrar un service worker. Sin él, tu app puede ser instalable (solo manifest), pero no va a tener offline ni push notifications.

> En desarrollo, `localhost` es la excepción -- funciona sin SSL.

---

# Qué es un Service Worker?

Un archivo JavaScript que corre **en un hilo separado** del navegador.

```
   Browser                    Service Worker                  Red
     │                             │                           │
     │── GET /patients ──────────> │                           │
     │                             │── (decide) ──────────────>│
     │                             │<── response ──────────────│
     │<── response ────────────────│                           │
```

- No tiene acceso al DOM
- Actúa como **proxy** entre el browser y la red
- Puede cachear respuestas, servir offline, recibir push notifications
- Tiene un **ciclo de vida** propio: install → activate → fetch

---

# Por qué Rails incluyó soporte PWA?

Rails quiere ser una alternativa completa a las apps nativas: **Hotwire** para interactividad, **PWA** para instalabilidad, **Action Notifier** (futuro) para push notifications.

**El problema:** para hacer una PWA necesitabas configurar manualmente archivos que no encajaban bien en la estructura Rails.

**La solución:** tratar los archivos PWA como scaffolding por defecto, igual que `404.html` o `icon.png`. Dar un punto de partida que el developer personaliza.

> Apareció en **Rails 7.2** (agosto 2024). **PR #50528** de DHH.

---

# Qué genera Rails?

```
rails new mi_app
```

Tres archivos relacionados a PWA:

```
app/views/pwa/manifest.json.erb    # Web App Manifest
app/views/pwa/service-worker.js    # Service Worker (vacío)
config/routes.rb                   # Rutas
```

Y en el layout, meta tags **comentados**.

**Importante:** todo viene _desactivado_ por defecto. Es opt-in.

---

# Por qué en `app/views/` y no en `public/`?

Los archivos PWA son **templates ERB**, no archivos estáticos:

- Podés usar lógica Ruby (iconos distintos por ambiente)
- Podés usar helpers de assets (`asset_path`, `vite_asset_path`)
- Podés internacionalizar con I18n
- Podés personalizar por tenant en apps multi-tenant

**¿Por qué no pasan por el asset pipeline?**

El browser busca el manifest y el service worker siempre en la **misma URL**. Si tuvieran fingerprint (ej: `service-worker-abc123.js`), el browser no sabría dónde buscar actualizaciones.

> URLs estables = el browser siempre sabe dónde encontrarlos.

---

# Las Rutas PWA

```ruby
# config/routes.rb
get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
```

Mapean a `Rails::PwaController` — un controller interno de Rails.

> **Ojo:** hereda de `Rails::ApplicationController`, no del tuyo.

---

<!-- _class: lead -->
# Demo 1: App Instalable
## Solo manifest + meta tags

---

# Demo 1: El Manifest

```json
// app/views/pwa/manifest.json.erb
{
  "name": "Doctors App",
  "short_name": "Doctors",
  "icons": [
    {
      "src": "/icon.png",
      "type": "image/png",
      "sizes": "512x512"
    },
    {
      "src": "/icon.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "maskable"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#1e40af",
  "background_color": "#f3f4f6"
}
```

---

# Campos del Manifest

| Campo | Qué hace |
|-------|----------|
| `name` | Nombre completo (splash screen) |
| `short_name` | Nombre en el ícono del home screen |
| `display` | `standalone` = sin barra de navegador |
| `start_url` | URL al abrir la app |
| `scope` | Qué URLs "pertenecen" a la PWA |
| `theme_color` | Color de la barra de estado del OS |
| `background_color` | Color del splash screen |
| `icons` | Array de íconos en distintos tamaños |

---

# Demo 1: Rutas + Meta Tags

Descomentar las rutas:

```ruby
# config/routes.rb
get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
get "service-worker" => "rails/pwa#service_worker",
                        as: :pwa_service_worker
```

Agregar al `<head>` del layout:

```erb
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<%= tag.link rel: "manifest", href: pwa_manifest_path(format: :json) %>
```

---

# Demo 1: Resultado

Con solo esto, tu app ya es **instalable**:

- Chrome muestra el ícono de instalar en la barra de direcciones
- En móvil, "Agregar a pantalla de inicio" funciona
- La app se abre en modo standalone (sin barra del browser)

**DevTools → Application → Manifest** para verificar.

> 3 archivos, 5 líneas de config. ~10 minutos.

---

<!-- _class: lead -->
# Demo 2: Service Worker Básico
## Página offline cuando no hay red

---

# Demo 2: Registrar el Service Worker

Para que el browser active el service worker, hay que registrarlo:

```erb
<%# En el layout o en un JS cargado en la app %>
<script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker")
  }
</script>
```

Este script le dice al browser: "descargá `/service-worker` y usalo como proxy".

---

# Demo 2: La página offline

```html
<!-- public/offline.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Sin conexión — Doctors App</title>
  <meta name="viewport"
        content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: system-ui; display: flex;
      align-items: center; justify-content: center;
      min-height: 100vh; margin: 0;
      background: #f3f4f6; color: #1f2937;
      text-align: center;
    }
    h1 { font-size: 1.5rem; }
    button {
      margin-top: 1rem; padding: 0.5rem 1.5rem;
      background: #1e40af; color: white; border: none;
      border-radius: 0.375rem; cursor: pointer;
    }
  </style>
</head>
<body>
  <div>
    <h1>Sin conexión</h1>
    <p>No se pudo conectar al servidor.</p>
    <button onclick="location.reload()">Reintentar</button>
  </div>
</body>
</html>
```

---

# Demo 2: El Service Worker

```javascript
// app/views/pwa/service-worker.js
const CACHE_NAME = "doctors-v1"

// 1. Install: pre-cachear la página offline
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(["/offline.html"]))
  )
  self.skipWaiting()
})

// 2. Activate: limpiar caches viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME)
          .map((n) => caches.delete(n))
      )
    )
  )
  self.clients.claim()
})

// 3. Fetch: si falla una navegación → offline.html
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match("/offline.html"))
    )
  }
})
```

---

# Demo 2: Resultado

1. Cargar la app con red → el SW se instala y cachea `offline.html`
2. Cortar la red (DevTools → Network → Offline)
3. Navegar → en vez del dinosaurio, se ve nuestra página

**DevTools → Application → Service Workers** para verificar.

> ~25 líneas de JS. El usuario ve tu marca, no un error del browser.

---

<!-- _class: lead -->
# Demo 3: Estrategias de Caché
## Assets instantáneos + HTML fresco

---

# Estrategias de caché: resumen rápido

| Estrategia | Idea | Ideal para |
|------------|------|-----------|
| **Cache First** | Cache → si no hay, red | Assets (CSS, JS, iconos) |
| **Network First** | Red → si falla, cache | HTML dinámico |
| **Stale While Revalidate** | Cache + actualizar en background | Datos que cambian poco |

> La clave: no usar una sola estrategia. **Mezclar según el tipo de request.**

---

# Demo 3: Estrategia mixta

```javascript
// app/views/pwa/service-worker.js
const CACHE_NAME = "doctors-v1"

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(["/offline.html"]))
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME)
          .map((n) => caches.delete(n))
      )
    )
  )
  self.clients.claim()
})
```

_(continúa en la siguiente slide)_

---

# Demo 3: Fetch con estrategia mixta

```javascript
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Assets estáticos → Cache First (instantáneo)
  if (url.pathname.match(/\.(css|js|png|jpg|svg|woff2)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached
        return fetch(event.request).then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone))
          return response
        })
      })
    )
    return
  }

  // Navegación HTML → Network First con fallback offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match("/offline.html"))
    )
    return
  }
})
```

---

# Demo 3: Resultado

1. Primera visita: todo se descarga de la red
2. Segunda visita: los assets cargan **del cache** (instantáneo)
3. El HTML siempre viene fresco de la red
4. Sin red: se muestra la página offline

**DevTools → Application → Cache Storage** para ver qué se cacheó.

> Assets rápidos + datos frescos. Lo mejor de ambos mundos para una app Rails.

---

<!-- _class: lead -->
# Demo 4: PWA + Multi-Tenancy
## Cada hospital, su propia PWA

---

# Nuestra app es multi-tenant

Cada hospital es un tenant con su propio subdominio:

```
clinica-norte.doctors.app    → Hospital "Clínica Norte"
sanatorio-sur.doctors.app    → Hospital "Sanatorio Sur"
www.doctors.app              → Landing page pública
```

La pregunta: **¿afecta esto a la PWA?**

Respuesta corta: **sí, pero a nuestro favor.**

---

# Service Worker y orígenes

Un service worker controla las páginas **de su mismo origen** (protocolo + dominio + puerto).

```
clinica-norte.doctors.app  → origen A → service worker A
sanatorio-sur.doctors.app  → origen B → service worker B
```

Cada subdominio es un **origen distinto**:

- Cada tenant tiene su **propio** service worker
- Cada tenant tiene su **propio** cache
- Cada tenant puede instalarse como **su propia PWA**

> Aislamiento de datos gratis entre tenants. El browser lo hace por nosotros.

---

# Demo 4: Manifest por tenant

Como el manifest es **ERB**, lo personalizamos por hospital:

```erb
<%# app/views/pwa/manifest.json.erb %>
{
  "name": "<%= current_hospital&.name || 'Doctors App' %>",
  "short_name": "<%= current_hospital&.name&.truncate(12) || 'Doctors' %>",
  "icons": [
    {
      "src": "<%= current_hospital&.logo_url || '/icon.png' %>",
      "sizes": "512x512", "type": "image/png"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "<%= current_hospital&.theme_color || '#1e40af' %>",
  "background_color": "#f3f4f6"
}
```

Cada hospital instala la PWA con **su propia marca**.

---

# Cuidado: el PwaController de Rails

`Rails::PwaController` hereda de `Rails::ApplicationController`, **no** del tuyo.

```ruby
# Tu ApplicationController define current_hospital:
class ApplicationController < ActionController::Base
  def current_hospital
    Hospital.find_by(subdomain: request.subdomain)
  end
  helper_method :current_hospital
end

# Pero Rails::PwaController NO hereda de ahí.
# → current_hospital no existe → el manifest explota 💥
```

---

# Fix: definir `current_hospital` como helper

Mover el método a `ApplicationHelper` para que esté disponible en **todas** las vistas, incluidas las del PwaController:

```ruby
# app/helpers/application_helper.rb
module ApplicationHelper
  def current_hospital
    @current_hospital ||=
      Hospital.find_by(subdomain: request.subdomain)
  end
end
```

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  helper_method :current_hospital
  # El método ahora viene del helper
end
```

> Alternativa: crear tu propio PwaController que herede de `ApplicationController`.

---

# Demo 4: Cache nombrado por tenant

```javascript
// app/views/pwa/service-worker.js (es ERB!)
const CACHE_NAME =
  "doctors-<%= current_hospital&.subdomain || 'public' %>-v1"
```

Resultado en DevTools:

```
clinica-norte.doctors.app → cache "doctors-clinica-norte-v1"
sanatorio-sur.doctors.app → cache "doctors-sanatorio-sur-v1"
www.doctors.app           → cache "doctors-public-v1"
```

> Aunque el browser ya aísla por origen, nombrar el cache por tenant facilita debuggear.

---

# Demo 4: Resultado

Cada hospital:
- Se instala como PWA independiente con su nombre y logo
- Tiene su propio service worker y cache
- Funciona offline de forma aislada

En DevTools: cambiar entre subdominios y verificar que cada uno tiene su manifest y cache separados.

---

# Cuánto esfuerzo es?

| Qué | Archivos | Líneas de código |
|-----|----------|-----------------|
| Manifest | 1 | ~20 |
| Service Worker | 1 | ~30 |
| Rutas | 2 líneas en routes.rb | 2 |
| Meta tags | 3 líneas en layout | 3 |
| **Total** | **3 archivos + 5 líneas** | **~55** |

> En 10 minutos tu app Rails es instalable. En 30 minutos tiene offline básico.

---

# Tips para producción

**Iconos:** generá múltiples tamaños (192x192, 512x512) con [realfavicongenerator.net](https://realfavicongenerator.net)

**Cache busting:** cambiar `CACHE_NAME` para invalidar

```javascript
const CACHE_NAME = "doctors-v2" // Cambiar para forzar nuevo cache
```

**`scope` en el manifest:** define qué URLs "pertenecen" a la PWA. Si tu app vive en `/admin/`, usá `"scope": "/admin/"` y `"start_url": "/admin/"`. Es un campo del manifest, no del service worker.

**HTTPS:** obligatorio en producción. `localhost` funciona sin SSL.

---

# Qué viene: Action Notifier

Rails está trabajando en **Action Notifier** -- un framework para enviar notificaciones Web Push directamente desde Rails.

```ruby
# Futuro (conceptual)
class AppointmentNotifier < ApplicationNotifier
  def reminder(appointment)
    notify appointment.patient,
      title: "Turno mañana",
      body: "Recordá tu turno a las #{appointment.time}"
  end
end
```

> Mismo patrón que Action Mailer, pero para push notifications.

---

# Recursos

- **PR original:** [rails/rails#50528](https://github.com/rails/rails/pull/50528)
- **Rails World 2024:** Emmanuel Hayford -- "PWA for Rails developers"
- **Joy of Rails:** [Add your Rails app to the Home Screen](https://joyofrails.com/articles/add-your-rails-app-to-the-home-screen)
- **SupeRails #166:** [PWA in Rails 8](https://superails.com/posts/166-pwa-progressive-web-apps-in-rails-8)
- **MDN Web Docs:** [Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- **web.dev:** [Learn PWA](https://web.dev/learn/pwa)

---

<!-- _class: lead -->
# Preguntas?

**PWA en Rails = 3 archivos + 5 líneas de config**

Tu app Rails ya está a 10 minutos de ser instalable.

---

# Gracias!

Slides y código en: `github.com/tu-repo`

RubySur - 13 de abril de 2026
