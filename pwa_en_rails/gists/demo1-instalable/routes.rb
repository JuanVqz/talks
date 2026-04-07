# PWA en Rails - Demo 1 | RubySur - 13/04/2026
# config/routes.rb — agregar estas 2 líneas:

get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
