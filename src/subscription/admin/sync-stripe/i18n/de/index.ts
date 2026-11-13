import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Abos mit Stripe abgleichen",
    titleShort: "Stripe-Abgleich",
    description:
      "Holt Status, Abrechnungszeitraum und Kündigungsdaten aus Stripe in unsere Abo-Einträge. Setzt Altlasten ohne Stripe-ID mit abgelaufenem Zeitraum auf gekündigt. Vergibt oder entzieht keine Credits. Standardmäßig Probelauf.",
    fields: {
      subscriptionId: {
        label: "Abo",
        description:
          "Unsere Abo-ID (UUID) oder die Stripe-Abo-ID (sub_...). Leer lassen und 'Alle' aktivieren.",
        placeholder: "sub_... oder Abo-UUID",
      },
      all: {
        label: "Alle",
        description:
          "Jedes Abo prüfen, das nicht bereits gekündigt oder abgelaufen ist.",
      },
      dryRun: {
        label: "Probelauf",
        description: "Änderungen anzeigen, ohne etwas zu schreiben.",
      },
    },
    response: {
      dryRun: "Probelauf",
      scanned: "Geprüft",
      changed: "Geändert",
      failed: "Fehlgeschlagen",
      items: "Abos",
      item: {
        subscriptionId: "Abo",
        userEmail: "Nutzer",
        providerSubscriptionId: "Stripe-ID",
        action: "Aktion",
        statusBefore: "Status vorher",
        statusAfter: "Status nachher",
        periodEndBefore: "Zeitraumende vorher",
        periodEndAfter: "Zeitraumende nachher",
        note: "Hinweis",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Ziel fehlt",
        description: "Abo-ID, Stripe-ID oder all=true angeben.",
      },
      forbidden: {
        title: "Kein Zugriff",
        description: "Adminrechte erforderlich",
      },
      server: {
        title: "Abgleich fehlgeschlagen",
        description: "Abos konnten nicht mit Stripe abgeglichen werden",
        detail: "Abo-Abgleich fehlgeschlagen: {{error}}",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler beim Abgleich",
      },
      conflict: {
        title: "Konflikt",
        description: "Das Abo hat sich während des Abgleichs geändert",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Stripe nicht erreichbar",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Abo mit dieser ID",
        detail: "Kein Abo passt zu {{id}}",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Ausstehenden Abgleich erst ausführen oder verwerfen",
      },
      notConfigured: "Stripe ist auf dieser Instanz nicht eingerichtet.",
    },
    success: {
      title: "Abgleich fertig",
      description: "Abos mit Stripe geprüft",
    },
    notes: {
      keptCanceled:
        "Stripe meldet {{stripeStatus}}; bleibt gekündigt (gekündigt wird nie zurückgestuft).",
      missingInStripe:
        "In Stripe nicht vorhanden; auf gekündigt gesetzt, Stripe-ID entfernt.",
      expiredLegacy:
        "Keine Stripe-ID, Zeitraum endete am {{date}}; auf gekündigt gesetzt.",
      noStripeIdActivePeriod:
        "Keine Stripe-ID, Zeitraum läuft noch; unverändert.",
      notStripe: "Anbieter ist nicht Stripe; übersprungen.",
      stripeError: "Stripe-Fehler: {{error}}",
    },
    widget: {
      submit: "Abgleich starten",
      submitting: "Gleiche ab...",
      preview: "Vorschau: nichts geschrieben",
      applied: "Übernommen",
      empty: "Nichts abzugleichen.",
      none: "keine",
    },
  },
  enums: {
    action: {
      updated: "Aktualisiert",
      unchanged: "Synchron",
      expired: "Abgelaufen",
      missingInStripe: "Fehlt in Stripe",
      skipped: "Übersprungen",
      error: "Fehler",
    },
  },
};
