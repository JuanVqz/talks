# PWA en Rails - Demo 4: Multi-Tenancy

> Charla "PWA en Rails" - [RubySur](https://www.youtube.com/@rubysur) - 13 de abril de 2026

Cada subdominio (tenant) se instala como su propia PWA con nombre, logo y cache independiente. Incluye el fix para que `current_hospital` funcione en vistas del `Rails::PwaController`.

## Archivos

- `manifest.json.erb` → `app/views/pwa/manifest.json.erb` (personalizado por tenant)
- `service-worker.js.erb` → `app/views/pwa/service-worker.js` (cache nombrado por tenant)
- `application_helper.rb` → fix en `app/helpers/application_helper.rb`
