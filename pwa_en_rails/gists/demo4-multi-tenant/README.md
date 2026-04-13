# PWA en Rails - Demo 4: Multi-Store

> Charla "PWA en Rails" - [RubySur](https://www.youtube.com/@rubysur) - 13 de abril de 2026
> Video: https://www.youtube.com/watch?v=ppxalpIKpGg

Cada subdominio (store) se instala como su propia PWA con nombre, logo y cache independiente. Incluye el fix para que `current_store` funcione en vistas del `Rails::PwaController`.

## Archivos

- `manifest.json.erb` -> `app/views/pwa/manifest.json.erb` (personalizado por store)
- `service-worker.js.erb` -> `app/views/pwa/service-worker.js.erb` (cache nombrado por store)
- `application_helper.rb` -> fix en `app/helpers/application_helper.rb`

## Repo

- Branch: [`demo4-multi-store`](https://github.com/JuanVqz/may_store/tree/demo4-multi-store)
- PR: [#34](https://github.com/JuanVqz/may_store/pull/34)
