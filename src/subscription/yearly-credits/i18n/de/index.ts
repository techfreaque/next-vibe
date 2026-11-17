import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abonnements",
  tags: {
    subscription: "subscription",
    admin: "admin",
  },
  post: {
    title: "Jahrespläne: Monatliche Credits",
    titleShort: "Jahres-Credits",
    description:
      "Gibt jedem Jahresplan die Credits des laufenden Monats. Läuft täglich; jeder Monat wird einmal gutgeschrieben und verfällt am Monatsende.",
    response: {
      scanned: "Geprüfte Jahrespläne",
      granted: "Jetzt gutgeschriebene Monate",
      credits: "Gutgeschriebene Credits",
    },
    widget: {
      hint: "Läuft täglich von selbst. Manuell ausführen ist sicher: kein Monat wird doppelt gutgeschrieben.",
      submit: "Diesen Monat gutschreiben",
      summary:
        "{{scanned}} Jahrespläne geprüft, {{granted}} Monate gutgeschrieben, {{credits}} Credits",
    },
  },
  task: {
    description: "Schreibt Jahresplänen ihre monatlichen Credits gut",
  },
  backfill: {
    title: "Jahrespläne: Verpasste Monate nachtragen",
    titleShort: "Jahres-Nachtrag",
    description:
      "Monate des laufenden Jahreszeitraums ohne monatliche Credits. Der Testlauf listet sie; ohne Testlauf werden sie einmalig als ein Paket gutgeschrieben, gültig bis zum Ende des Zeitraums.",
    fields: {
      dryRun: {
        label: "Testlauf",
        description: "Nur auflisten, nichts gutschreiben",
      },
    },
    response: {
      dryRun: "Testlauf",
      subscriptions: "Abos",
      months: "Verpasste Monate",
      credits: "Credits",
      rows: "Abos",
      subscriptionId: "Abo",
      userEmail: "Nutzer",
      plan: "Plan",
      periodStart: "Zeitraum ab",
      periodEnd: "Zeitraum bis",
      currentMonth: "Aktueller Monat",
      missedMonths: "Verpasste Monate",
      status: "Status",
    },
    widget: {
      hint: "Erst den Testlauf prüfen. Die Gutschrift läuft einmal pro Abo und Zeitraum; Wiederholen fügt nichts hinzu.",
      submit: "Nachtrag ausführen",
      preview:
        "Testlauf: {{subscriptions}} Abos, {{months}} verpasste Monate, {{credits}} Credits würden gutgeschrieben.",
      done: "Gutgeschrieben: {{subscriptions}} Abos, {{months}} Monate, {{credits}} Credits.",
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
      description: "Nur Admins schreiben Plan-Credits gut",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Daten haben sich geändert, erneut ausführen",
    },
    server: {
      title: "Serverfehler",
      description: "Jahres-Credits konnten nicht gutgeschrieben werden",
      detail: "Jahres-Credits fehlgeschlagen: {{error}}",
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
  },
  success: {
    title: "Fertig",
    description: "Jahres-Credits verarbeitet",
  },
};
