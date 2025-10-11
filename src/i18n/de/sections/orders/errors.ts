import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/orders/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  failed_to_get_user_roles: "Benutzerrollen konnten nicht abgerufen werden",
  failed_to_get_orders: "Bestellungen konnten nicht abgerufen werden",
  failed_to_create: "Bestellung konnte nicht erstellt werden",
  failed_to_update: "Bestellung konnte nicht aktualisiert werden",
  failed_to_update_total: "Bestellsumme konnte nicht aktualisiert werden",
  failed_to_delete: "Bestellung konnte nicht gelöscht werden",
  unknown: "Ein unbekannter Fehler ist aufgetreten",
  not_found: "Bestellung nicht gefunden",
  invalid_data: "Ungültige Bestelldaten",
  unauthorized: "Sie sind nicht berechtigt, diese Aktion durchzuführen",
};
