import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zahlungen",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Stripe-Preise anlegen",
    titleShort: "Stripe-Preise",
    description:
      "Legt jeden Plan- und Credit-Paket-Preis im verbundenen Stripe-Konto an (pro Währung und Sprache), gefunden per Lookup-Key. Idempotent, keine Preis-IDs in der .env. Der Testlauf zeigt, was existiert und was fehlt.",
    fields: {
      dryRun: {
        label: "Testlauf",
        description: "Preise nur auflisten, nichts anlegen",
      },
    },
    response: {
      dryRun: "Testlauf",
      stripeMode: "Stripe-Modus",
      existing: "Schon vorhanden",
      created: "Neu angelegt",
      missing: "Fehlt",
      prices: "Preise",
      lookupKey: "Lookup-Key",
      priceId: "Preis-ID",
      productId: "Produkt-ID",
      amount: "Betrag",
      status: "Status",
    },
    widget: {
      hint: "Einmal pro Stripe-Konto nach einer Preisänderung ausführen. Der Checkout legt fehlende Preise auch beim ersten Kauf an.",
      submit: "Preise anlegen",
      summary:
        "Stripe {{mode}}: {{existing}} vorhanden, {{created}} angelegt, {{missing}} fehlen",
    },
  },
  errors: {
    validation: {
      title: "Ungültige Eingabe",
      description: "Prüfe die Anfrage",
    },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Melde dich als Admin an",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Nur Admins verwalten Stripe-Preise",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Stripe hat sich zwischenzeitlich geändert, erneut ausführen",
    },
    server: {
      title: "Serverfehler",
      description: "Stripe-Preise konnten nicht angelegt werden",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Anfrage hat den Server nicht erreicht",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas Unerwartetes ist schiefgelaufen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Speichere oder verwirf zuerst deine Änderungen",
    },
    notConfigured: "Stripe ist nicht konfiguriert (STRIPE_SECRET_KEY fehlt)",
  },
  success: {
    title: "Fertig",
    description: "Stripe-Preise geprüft",
  },
};
