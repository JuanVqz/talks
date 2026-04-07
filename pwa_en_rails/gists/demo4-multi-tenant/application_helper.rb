# PWA en Rails - Demo 4 | RubySur - 13/04/2026
# app/helpers/application_helper.rb
#
# Definir current_hospital acá (además del controller) para que esté
# disponible en vistas renderizadas por Rails::PwaController, que NO
# hereda de nuestro ApplicationController.
module ApplicationHelper
  def current_hospital
    @current_hospital ||= Hospital.find_by(subdomain: request.subdomain)
  end
end
