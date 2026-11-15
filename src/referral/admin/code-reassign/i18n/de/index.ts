import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Empfehlung",
  tags: {
    referral: "empfehlung",
    admin: "admin",
  },
  post: {
    title: "Empfehlungscode übertragen",
    titleShort: "Code übertragen",
    description:
      "Überträgt einen Empfehlungscode auf ein anderes Konto. Bereits geworbene Nutzer bleiben dem Code zugeordnet, ihre künftige Provision geht an den neuen Inhaber. Bisherige Einnahmen bleiben bei dem, der sie verdient hat. Standardmäßig Probelauf.",
    fields: {
      code: {
        label: "Empfehlungscode",
        description: "Der exakte Code, der übertragen wird",
        placeholder: "quelllm",
      },
      targetUser: {
        label: "Neuer Inhaber",
        description: "Nutzer-ID oder E-Mail des Kontos, das den Code erhält",
        placeholder: "creator@example.com",
      },
      dryRun: {
        label: "Probelauf",
        description: "Übertragung prüfen, ohne etwas zu ändern",
      },
    },
    response: {
      dryRun: "Probelauf",
      code: "Code",
      fromUserId: "ID bisheriger Inhaber",
      fromEmail: "Bisheriger Inhaber",
      toUserId: "ID neuer Inhaber",
      toEmail: "Neuer Inhaber",
      referralsMoved: "Übertragene geworbene Nutzer",
      selfReferralsKept: "Selbstempfehlungen beim bisherigen Inhaber",
      linksMoved: "Übertragene Tracking-Links",
      linksTotal: "Kampagnenlinks mit diesem Code",
    },
    widget: {
      back: "Zurück",
      hint: "Die Provision folgt dem Code-Inhaber. Erst Probelauf, dann ausschalten und übertragen.",
      submit: "Code übertragen",
      preview: "Probelauf. Nichts geändert.",
      done: "Code übertragen.",
      summary: "{{code}}: {{from}} → {{to}}",
    },
    note: "Empfehlungscode {{code}} von {{from}} auf {{to}} übertragen durch {{admin}} am {{at}}. Übertragene geworbene Nutzer: {{referrals}}. Übertragene Tracking-Links: {{links}}. Bisherige Einnahmen unverändert.",
  },
  errors: {
    validation: {
      title: "Ungültige Eingabe",
      description: "Code und neuen Inhaber prüfen",
    },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Als Admin anmelden, um Codes zu übertragen",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Nur Admins dürfen Empfehlungscodes übertragen",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Code oder Nutzer existiert nicht",
    },
    conflict: {
      title: "Konflikt",
      description: "Der neue Inhaber besitzt diesen Code bereits",
    },
    server: {
      title: "Serverfehler",
      description: "Code konnte nicht übertragen werden",
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
      description: "Änderungen erst speichern oder verwerfen",
    },
    codeNotFound: "Empfehlungscode {{code}} existiert nicht",
    userNotFound: "Kein Nutzer passt zu {{target}}",
    alreadyOwner: "{{target}} besitzt den Empfehlungscode {{code}} bereits",
  },
  success: {
    title: "Erledigt",
    description: "Empfehlungscode übertragen",
  },
};
