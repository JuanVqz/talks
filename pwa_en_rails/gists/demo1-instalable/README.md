# PWA en Rails - Demo 1: App Instalable

> Charla "PWA en Rails" - [RubySur](https://www.youtube.com/@rubysur) - 13 de abril de 2026
> Video: https://www.youtube.com/watch?v=ppxalpIKpGg

Solo con un **Web App Manifest**, las **rutas** y los **meta tags**, tu app Rails ya es instalable.

## Archivos

- `manifest.json.erb` → `app/views/pwa/manifest.json.erb`
- `routes.rb` → agregar 2 lineas en `config/routes.rb`
- `_head.html.erb` → agregar 1 linea en el `<head>` del layout

## Repo

- Branch: [`demo1-instalable`](https://github.com/JuanVqz/may_store/tree/demo1-instalable)
- PR: [#31](https://github.com/JuanVqz/may_store/pull/31)
