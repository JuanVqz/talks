# PWA en Rails - Demo 2: Service Worker Basico

> Charla "PWA en Rails" - [RubySur](https://www.youtube.com/@rubysur) - 13 de abril de 2026
> Video: https://www.youtube.com/watch?v=ppxalpIKpGg

Agrega un service worker que pre-cachea una pagina offline. Cuando el usuario pierde la red, ve tu pagina en vez del dinosaurio de Chrome.

## Archivos

- `service-worker.js` → `app/views/pwa/service-worker.js`
- `offline.html` → `public/offline.html`
- `_head.html.erb` → agregar el script de registro del SW en el `<head>`

## Repo

- Branch: [`demo2-service-worker`](https://github.com/JuanVqz/may_store/tree/demo2-service-worker)
- PR: [#32](https://github.com/JuanVqz/may_store/pull/32)
