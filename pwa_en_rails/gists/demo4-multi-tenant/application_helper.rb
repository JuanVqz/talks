# PWA en Rails - Demo 4 | RubySur - 13/04/2026
# app/helpers/application_helper.rb
#
# Disponible en todas las vistas, incluyendo las de Rails::PwaController
# que NO hereda de nuestro ApplicationController.
module ApplicationHelper
  def current_store
    Current.store || Store.find_by(subdomain: request.subdomain)
  end
end
