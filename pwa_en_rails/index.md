---
marp: true
theme: default
backgroundColor: #fff
style: |
  section {
    font-family: 'Inter', sans-serif;
  }
  h1 {
    color: #cc0000;
  }
  code {
    background: #f4f4f4;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.95em;
  }
  pre {
    font-size: 0.75em;
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

<!-- Buenas tardes comunidad de Ruby Sur! -->
<!-- Gracias por la invitación a los organizadores de RubySur -->
<!-- Espero algún día asistir a alguna reunión personalmente, veo en el Slack que se la pasan muy bien -->
<!-- Por cierto, son bienvenidos si no se han unido -->

<!-- ¿Sabén qué es una PWA? -->
<!-- ¿Alguien de aquí alguna vez ha convertido su app en PWA? -->

<!-- Hoy veremos cómo con muy poco esfuerzo podemos hacer que nuestra app de Rails se instale como si fuera nativa. -->

---

# Sobre mí

![bg right:45%](https://avatars.githubusercontent.com/u/7331511)

- **Juan Vásquez** (@JuanVqz)
- Senior Software Engineer
- Laburo en OmbuLabs (FastRuby.io)
- Soy de Oaxaca, México 🇲🇽
- Pasión actual: Crochet 🧶

---

# Sobre esta charla

- Qué es una PWA y qué necesita
- Por qué Rails decidió incluir soporte nativo
- Demo en vivo
- Qué viene: Action Notifier y Web Push

<!-- Arrancamos con un poco de teoria para entrar en calor -->
<!-- Luego un poco de por qué agregaron PWA en Rails -->
<!-- Demo en vivo, es más, traigo 4 demos -->

<!-- El primero es súper básico, prácticamente es solo instalar tu aplicación de Rails como aplicación en tu sistema operativo -->
<!-- Desde esta primera configuración ya estamos ganando mucho porque los usuarios encontrarán tu web app en su dispositivo -->
<!-- La segunda demo agrega soporte offline -->
<!-- La tercera muestra cómo agregar caché a la aplicación -->
<!-- La cuarta muestra cómo una aplicación por subdominios o multi-tenant funciona con PWA -->

---

# Qué es una PWA?

**Progressive Web App** = Una app web que se comporta como nativa.

Tres pilares:
1. **Instalable** -- Se agrega a la pantalla de inicio
2. **Confiable** -- Carga incluso sin conexión (o con red lenta)
3. **Capaz** -- push notifications, acceso a cámara, GPS, etc.

> No es un framework, es un conjunto de APIs del navegador + un patrón de arquitectura.

<!-- No es nada nuevo; son APIs proporcionadas por JavaScript que ya existen en los navegadores. -->

---

# Qué necesita una web para ser PWA?

| Requisito            | Qué es                                             | Obligatorio?                |
|----------------------|----------------------------------------------------|-----------------------------|
| **Web App Manifest** | JSON que describe la app (nombre, iconos, colores) | Sí                          |
| **Service Worker**   | Script que intercepta requests del navegador       | No, agrega superpoderes     |
| **HTTPS**            | Conexión segura (requerido para service workers)   | Solo para Service Worker    |

Sólo con el manifest ya podés hacer tu app **instalable**.

<!-- Sólo con el manifest tu aplicación Rails ya es instalable. -->
<!-- El service worker no es obligatorio pero le da los superpoderes a tu PWA. -->
<!-- El service worker agrega **offline** y **push notifications** (y necesita HTTPS). -->
<!-- En localhost no necesitás `HTTPS`. -->

---

# Por qué HTTPS para service workers?

Un service worker puede **interceptar todos los requests** de tu app.

Sin HTTPS, un atacante podría:
- Inyectar un service worker malicioso (man-in-the-middle)
- Robar datos, redirigir requests, modificar respuestas

<!-- Imaginate que alguien inyecta un proxy en tu app sin que te des cuenta. -->
<!-- Los browsers exigen HTTPS para registrar un service worker. Sin él, tu app puede ser instalable (solo manifest), pero no va a tener offline ni push notifications. -->
<!-- En desarrollo, `localhost` es la excepción -- funciona sin SSL. -->

---

# Qué es un Service Worker?

Un archivo JavaScript que corre **en un hilo separado** del navegador.

```
   Browser                    Service Worker                  Red
     │                             │                           │
     │── GET /orders ────────────> │                           │
     │                             │── (decide) ──────────────>│
     │                             │<── response ──────────────│
     │<── response ────────────────│                           │
```

- No tiene acceso al DOM
- Actúa como **proxy** entre el browser y la red
- Puede cachear respuestas, servir offline, recibir push notifications
- Tiene un **ciclo de vida** propio: install → activate → fetch

<!-- Fijense en el diagrama: el SW se sienta en el medio y decide qué hacer con cada request. -->
<!-- El ciclo de vida tiene 3 fases: -->
<!-- Install: se ejecuta una sola vez cuando el browser descarga el SW por primera vez. Acá es donde pre-cacheas archivos que vas a necesitar después, como offline.html. Pensalo como el "setup". -->
<!-- Activate: se ejecuta despues del install, cuando el SW toma el control. Aca limpias caches viejos de versiones anteriores. Pensalo como "limpieza antes de arrancar". -->
<!-- Fetch: se ejecuta en cada request que hace la página (imágenes, CSS, JS, HTML, llamadas a APIs). El SW decide: sirvo del caché? voy a la red? ambos? Acá es donde viven las estrategias de caché. -->

---

# Por qué Rails incluyó soporte PWA?

Rails quiere ser una alternativa completa a las apps nativas:
- Hotwire para interactividad.
- PWA para instalabilidad.
- Action Notifier (futuro) para push notifications.

> Rails 7.2 **PR #50528** de DHH.

<!--
Rails quiere ser una solución a las aplicaciones nativas para iOS y Android.
Por eso DHH en agosto de 2024 implementó los archivos PWA como scaffolding por defecto, igual que los archivos estáticos como `404.html` o `icon.png`, de este modo dar un punto de partida que el developer personalice.
El PR de DHH es cortito pero significativo. Antes tenías que hacer todo a mano, ahora viene de fábrica.

Los invito a revisarlo #50528
-->

---

# Qué genera Rails?

```
rails new rubysur
```

Tres archivos relacionados a PWA:

```
config/routes.rb                   # Rutas
app/views/pwa/manifest.json.erb    # Web App Manifest
app/views/pwa/service-worker.js    # Service Worker (comentado)
```

**Importante:** todo viene _desactivado_ por defecto. Es opt-in.

<!--
Y a todo esto se preguntarán cómo generamos los archivos para hacer mi web de Rails en PWA

Cuando creas una aplicación nueva se genera todo lo necesario para iniciar tu PWA pero las configuraciones están desactivadas,
hay que activarlas a mano.
-->

---

<!-- _class: lead -->
# Demo 1: Hacer tu página instalable

- Rutas
- Meta Tags
- Manifest

<!-- DEMO 1: Empezaremos con la configuración más básica para tener un PWA -->

---

# Demo 1: Resultado

Con solo esto, tu app ya es **instalable**:

- Chrome muestra el ícono de instalar en la barra de direcciones
- En móvil, "Agregar a pantalla de inicio" funciona
- La app se abre en modo standalone (sin barra del browser)

**DevTools → Application → Manifest** para verificar.

> 3 archivos, 5 líneas de config. ~10 minutos.

<!--
Rutas:
config/routes.rb

Las rutas mapean a un controlador interno de Rails, no al de tu aplicación `Rails::PwaController`

Metatags:
app/views/layouts/application.html.erb

Como podés ver el metatag hace referencia directa al manifest, sin pasar por el asset pipeline

¿Por qué no pasan por el asset pipeline?

El browser busca el manifest y el service worker siempre en la misma URL.
Si tuvieran fingerprint (ej: `service-worker-abc123.js`), el browser no sabría dónde buscar actualizaciones.

URLs estables = el browser siempre sabe dónde encontrarlos.

Manifest:
app/views/pwa/manifest.json.erb

Por qué en `app/views/` y no en `public/`?

El manifest son **templates ERB**, no archivos estáticos:
- Puedes usar lógica Ruby (iconos distintos por ambiente)
- Puedes usar helpers de assets (`asset_path`, `vite_asset_path`)
- Puedes internacionalizar con I18n
- Puedes personalizar por tenant en apps multi-tenant
-->

<!-- Los más importantes: name, display y start_url. scope define qué se abre dentro de la PWA vs. en el browser. -->
<!-- maskable es para que el OS recorte el icono en la forma que quiera (círculo, cuadrado, etc). standalone = sin barra del browser. -->

---

<!-- _class: lead -->
# Demo 2: Página offline cuando no hay red

- Registro del service worker
- La página offline
- El Service Worker sirve la pagina offline

<!-- DEMO 2: Ahora vamos a agregar un service worker para el caso offline -->

---

# Demo 2: Resultado

1. Cargar la app con red → el SW se instala y cachea `offline.html`
2. Cortar la red (DevTools → Network → Offline)
3. Navegar → en vez del dinosaurio, se ve nuestra página

**DevTools → Application → Service Workers** para verificar.

> ~25 líneas de JS. El usuario ve tu marca, no un error del browser.

<!--

app/views/layouts/application.html.erb

Para que el browser active el service worker, hay que registrarlo:
Este script le dice al browser: "descargá `/service-worker` y usalo como proxy".
Una sola linea de JS. Todos los browsers modernos lo soportan.

public/offline.html

Va en public/ porque no necesita ERB. El SW lo sirve del caché. Mejor que el dinosaurio.

app/views/pwa/service-worker.js

El ciclo de vida tiene 3 fases:
Install: Hace pre-cache a la página `offline.html` para que esté lista cuando el usuario no tenga internet.

Activate: `clients.claim()` hace que el Service Worker tome el control inmediatamente sin esperar que el usuario cierre y abra la app.

Fetch: Acá es donde la página offline es llamada.

skipWaiting y clients.claim hacen que el Service Worker se active de una, sin esperar a que cierren las pestañas.
-->

---

<!-- _class: lead -->
# Demo 3: Estrategias de Caché
## Assets instantáneos + HTML fresco

<!-- DEMO 3: Vamos a hacerlo más inteligente con distintas estrategias de caché. -->

---

# Estrategias de caché: resumen rápido

| Estrategia                  | Idea                            | Ideal para               |
|-----------------------------|-------------------------------- |--------------------------|
| **Cache First**             | Cache, si no hay, red           | Assets (CSS, JS, iconos) |
| **Network First**           | Red, si falla, caché            | HTML dinámico            |
| **Stale While Revalidate**  | Cache + actualizar en background| Datos que cambian poco   |

> La clave: no usar una sola estrategia. **Mezclar según el tipo de request.**

<!--
Al usar estas estrategias de caché la clave es mezclar.

Assets no cambian seguido, cache first.

HTML sí cambia, network first.

En el caso en que no importa si el usuario ve contenido un poco atrasado usá la última opción,
como en foto de perfil, o un logo o un menú (No usamos esta estrategia en estos demos).
-->

---

# Demo 3: Resultado

1. Primera visita: todo se descarga de la red
2. Segunda visita: los assets cargan **del cache** (instantáneo)
3. El HTML siempre viene fresco de la red
4. Sin red: se muestra la página offline

**DevTools → Application → Cache Storage** para ver qué se cacheó.

> Assets rápidos + datos frescos. Lo mejor de ambos mundos para una app Rails.


<!--
DEMO: Abrir Cache Storage en DevTools. Recargar y ver en Network que los assets dicen "ServiceWorker" en tamaño.

app/views/pwa/service-worker.js

Dato: hay que clonar el response porque sólo se puede leer una vez. Si no clonas, no podés cachearlo.

Dado que usamos el mismo nombre de la caché en demo2 y demo3, podría causar problemas.
Muchos equipos usan el git commit hash en cada deploy para actualizar la llave del caché.
const CACHE_NAME = "may-store-<%= Rails.application.config.asset_version %>";

Remové el registro en: DevTools > Application > Service Workers, click "Unregister"
-->

---

<!-- _class: lead -->
# Demo 4: PWA + Multi-Store
## Cada tienda, su propia PWA

<!-- DEMO 4: Esta es la parte más copada para apps reales. -->

---

# Nuestra app es multi-store

Cada tienda es un tenant con su propio subdominio:

```
cafecito.maystore.app        → Tienda "Cafecito"
la-esquina.maystore.app      → Tienda "La Esquina"
www.maystore.app             → Landing page publica
```

La pregunta: **afecta esto a la PWA?**

Respuesta corta: **si, pero a nuestro favor.**

---

# Service Worker y orígenes

Un service worker controla las páginas **de su mismo origen** (protocolo + dominio + puerto).

```
cafecito.maystore.app      → origen A → service worker A
la-esquina.maystore.app    → origen B → service worker B
```

Cada subdominio es un **origen distinto**:

- Cada tienda tiene su **propio** service worker
- Cada tienda tiene su **propio** caché
- Cada tienda puede instalarse como **su propia PWA**

<!--
El browser ya aisla por origen, así que cada subdominio tiene su propio Service Worker y caché gratis.

Seguridad gratis por same-origin policy. Una tienda no puede tocar el caché de otra.
-->

---

# Demo 4: Cache nombrado por store

```javascript
// app/views/pwa/service-worker.js.erb
const CACHE_NAME = "may-store-<%= current_store&.subdomain || 'public' %>-v1";
```

Resultado en DevTools:

```
cafecito.maystore.app      → cache "may-store-cafecito-v1"
la-esquina.maystore.app    → cache "may-store-la-esquina-v1"
www.maystore.app           → cache "may-store-public-v1"
```

> Aunque el browser ya aisla por origen, nombrar el caché por store facilita depurar.

<!--
app/views/pwa/manifest.json.erb

Acá se ve el poder de ERB. Cuando un usuario instala la app puede tener configuración
específica de su tienda, como su marca, imágenes, colores.

No es obligatorio, el browser ya aisla. Pero en DevTools te facilita saber qué caché es de qué store.
-->

---

# Cuidado: el PwaController de Rails

`Rails::PwaController` hereda de `Rails::ApplicationController`, **no** del tuyo.

```ruby
# Tu ApplicationController setea Current.store:
class ApplicationController < ActionController::Base
  before_action :set_current_store

  def set_current_store
    Current.store = Store.find_by!(subdomain: request.subdomain)
  end
end

# Pero Rails::PwaController NO hereda de ahi.
# → Current.store es nil → el manifest no personaliza
```

<!--
app/controllers/application_controller.rb

Esto está muy relacionado con la aplicación que estamos utilizando de ejemplo,
pero lo comparto para que no les suceda, y es bueno tenerlo en cuenta.

El controller para PWA está basado en el Rails::ApplicationController, no el tuyo,
entonces el `Current.store` no tiene valor cuando cargamos el SW
-->

---

# Fix: definir `current_store` como helper

Agregar un helper que use `Current.store` con fallback, disponible en **todas** las vistas, incluidas las del PwaController:

```ruby
# app/helpers/application_helper.rb
module ApplicationHelper
  def current_store
    Current.store || Store.find_by(subdomain: request.subdomain)
  end
end
```

Si `Current.store` ya está seteado (desde tu controller), lo usa. Si no (PwaController), hace la query.

> Alternativa: crear tu propio PwaController que herede de `ApplicationController`.

<!-- El helper es lo más simple. Crear tu propio PwaController te da más control pero para la mayoría alcanza con esto. -->

---

# Demo 4: Resultado

Cada tienda:
- Se instala como PWA independiente con su nombre y logo
- Tiene su propio service worker y cache
- Funciona offline de forma aislada

En DevTools: cambiar entre subdominios y verificar que cada uno tiene su manifest y caché separados.

<!--
DEMO: mostrar dos subdominios, instalar ambos. Se ven como apps separadas en el escritorio.
-->

---

# Cuánto esfuerzo es?

| Qué                | Archivos                  | Lineas de codigo |
|---------------------|---------------------------|------------------|
| Manifest            | 1                         | ~20              |
| Service Worker      | 1                         | ~30              |
| Rutas               | 2 lineas en routes.rb     | 2                |
| Meta tags           | 3 lineas en layout        | 3                |
| **Total**           | **3 archivos + 5 lineas** | **~55**          |

> En 10 minutos tu app Rails es instalable. En 30 minutos tiene offline básico.

<!-- Cambio chico, mucho impacto. No necesitas React Native ni Flutter. -->

---

# Tips para producción

**Iconos:** generá múltiples tamaños (192x192, 512x512) con [realfavicongenerator.net](https://realfavicongenerator.net)

**Cache busting:** cambiar `CACHE_NAME` para invalidar

```javascript
const CACHE_NAME = "may-store-v2" // Cambiar para forzar nuevo cache
```

**`scope` en el manifest:** define qué URLs "pertenecen" a la PWA. Si tu app vive en `/admin/`, usá `"scope": "/admin/"` y `"start_url": "/admin/"`. Es un campo del manifest, no del service worker.

**HTTPS:** obligatorio en producción. `localhost` funciona sin SSL.

<!-- Lo más importante: cambiar CACHE_NAME cuando deployan, sino los usuarios ven la versión vieja. -->

---

# Qué viene: Action Notifier

Rails está trabajando en **Action Notifier** -- un framework para enviar notificaciones Web Push directamente desde Rails.

```ruby
# Futuro (conceptual)
class OrderNotifier < ApplicationNotifier
  def ready(order)
    notify order.spot,
      title: "Pedido listo",
      body: "El pedido #{order.code} está listo para entregar"
  end
end
```

> Mismo patrón que Action Mailer, pero para push notifications.

<!-- Todavía no está en Rails estable pero se viene. Mismo patrón que Action Mailer, pero para push. -->

---

# Recursos

- **PR original:** [rails/rails#50528](https://github.com/rails/rails/pull/50528)
- **Rails World 2024:** Emmanuel Hayford -- "PWA for Rails developers"
- **Joy of Rails:** [Add your Rails app to the Home Screen](https://joyofrails.com/articles/add-your-rails-app-to-the-home-screen)
- **SupeRails #166:** [PWA in Rails 8](https://superails.com/posts/166-pwa-progressive-web-apps-in-rails-8)
- **MDN Web Docs:** [Progressive Web Apps](https://developer.mozilla.org/es/docs/Web/Progressive_web_apps)
- **web.dev:** [Learn PWA](https://web.dev/learn/pwa)

<!-- El PR de DHH es cortito, vale la pena. El video de Emmanuel Hayford es excelente. -->
---

<!-- _class: lead -->
# Contribuciones

- https://github.com/rails/rails/pull/57184
- https://github.com/mdn/translated-content/pull/35207
- https://github.com/mdn/translated-content/pull/35016

<!--
Dato curioso: mientras preparaba la charla, se me ocurrió contribuir a Rails agregando la página offline en el scaffold por defecto.

Y agregué la documentación para Service Worker API y Service Worker Container API. Aún quedan muchos documentos relacionados a Service Worker en MDN si gustas unirte a contribuir, yo puedo aprobar tus Pull Requests. No se te olvide comentar que venís de la charla de PWA en Rails.

Me va a dar mucho gusto.
-->

---

<!-- _class: lead -->
# Preguntas?

<!-- Si no hay preguntas, mencionar que el código está en el repo. -->

---

# Gracias!

## RubySur - 13 de abril de 2026

- Slides: `github.com/JuanVqz/talks/pwa_en_rails`
- PRs: `github.com/JuanVqz/may_store`
- Gists:  `gist.github.com/JuanVqz`
- Video:  `youtube.com/watch?v=ppxalpIKpGg`

<!-- Gracias a los organizadores de RubySur! -->
