# PWA en Rails

Tu app Rails, instalable en cualquier dispositivo.

## Sobre la charla

Charla de 30-45 minutos para [RubySur](https://www.youtube.com/@rubysur), 13 de abril de 2026. Cubre cómo usar el soporte nativo de PWA en Rails (a partir de Rails 7.2) para hacer tu app instalable, con offline y estrategias de caché.

**Evento:** [RubySur](https://www.youtube.com/@rubysur)

**Fecha:** 13 de abril de 2026

**Idioma:** Castellano

**Duración:** 30-45 minutos

**Formato:** Slides (Marp) + demo en vivo con app real

## Demos

La charla incluye 4 demos progresivas sobre una app Rails real (gestión clínica):

| Demo | Qué muestra | Gist |
|------|-------------|------|
| 1. App instalable | Manifest + rutas + meta tags | [TODO] |
| 2. Service Worker básico | Página offline cuando no hay red | [TODO] |
| 3. Cache inteligente | Cache First para assets, Network First para HTML | [TODO] |
| 4. Multi-tenancy | Manifest y cache por tenant (subdominio) | [TODO] |

Los gists en la carpeta `gists/` contienen el código de cada demo.

## Cómo correr los slides

Usa [Marp CLI](https://github.com/marp-team/marp-cli):

```bash
PORT=3010 marp -p --server .
```

## Estructura

```
pwa_en_rails/
  pwa-en-rails.md                 # Slides (Marp)
  gists/
    demo1-instalable/             # Manifest + rutas + meta tags
    demo2-service-worker-basico/  # SW + offline page
    demo3-cache-inteligente/      # Estrategia mixta
    demo4-multi-tenant/           # Manifest/cache por tenant
```

## Recursos

- [PR original (rails/rails#50528)](https://github.com/rails/rails/pull/50528)
- [Rails World 2024 - Emmanuel Hayford: "PWA for Rails developers"](https://www.youtube.com/results?search_query=rails+world+2024+pwa)
- [Joy of Rails - Add your Rails app to the Home Screen](https://joyofrails.com/articles/add-your-rails-app-to-the-home-screen)
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev - Learn PWA](https://web.dev/learn/pwa)
