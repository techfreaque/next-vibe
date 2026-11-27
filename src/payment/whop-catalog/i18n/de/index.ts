import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zahlungen",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Whop-Katalog abgleichen",
    titleShort: "Whop-Katalog",
    description:
      "Legt jeden Plan und jedes Credit-Paket im verbundenen Whop-Konto an: ein Produkt pro Plan, eine Variante pro Intervall, Währung und Preis, gefunden über unseren Schlüssel in den Metadaten. Idempotent. Der Testlauf zeigt, was existiert und was fehlt.",
    fields: {
      dryRun: {
        label: "Testlauf",
        description: "Varianten nur auflisten, nichts anlegen",
      },
    },
    response: {
      dryRun: "Testlauf",
      environment: "Whop-Umgebung",
      accountId: "Whop-Konto",
      existing: "Schon vorhanden",
      created: "Neu angelegt",
      missing: "Fehlt",
      variants: "Varianten",
      key: "Schlüssel",
      variantId: "Varianten-ID",
      productId: "Whop-Produkt",
      amount: "Betrag",
      status: "Status",
      purchaseUrl: "Kauflink",
    },
    widget: {
      hint: "Einmal pro Whop-Konto nach Preisänderungen ausführen. Der Checkout legt fehlende Varianten auch beim ersten Kauf an.",
      submit: "Katalog abgleichen",
      summary:
        "Whop {{environment}} ({{accountId}}): {{existing}} vorhanden, {{created}} angelegt, {{missing}} fehlen",
    },
  },
  errors: {
    validation: { title: "Ungültige Eingabe", description: "Anfrage prüfen" },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Als Admin anmelden",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Nur Admins gleichen den Whop-Katalog ab",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Whop hat sich zwischendurch geändert. Erneut ausführen.",
    },
    server: {
      title: "Serverfehler",
      description: "Der Whop-Katalog konnte nicht abgeglichen werden",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Die Anfrage hat den Server nicht erreicht",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas Unerwartetes ist schiefgelaufen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Änderungen erst speichern oder verwerfen",
    },
    notConfigured:
      "Whop ist nicht konfiguriert (API-Schlüssel der aktiven WHOP_ENVIRONMENT fehlt)",
    syncFailed: "Abgleich des Whop-Katalogs fehlgeschlagen: {{error}}",
  },
  success: {
    title: "Fertig",
    description: "Whop-Katalog geprüft",
  },
};
