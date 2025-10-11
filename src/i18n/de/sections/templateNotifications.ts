import type { templateNotificationsTranslations as EnglishTemplateNotificationsTranslations } from "../../en/sections/templateNotifications";

export const templateNotificationsTranslations: typeof EnglishTemplateNotificationsTranslations =
  {
    types: {
      created: "Vorlage erstellt",
      updated: "Vorlage aktualisiert",
      published: "Vorlage veröffentlicht",
      deleted: "Vorlage gelöscht",
      unknown: "Unbekannter Vorlagentyp",
    },
    email: {
      admin_subject: "Admin-Benachrichtigung",
      user_subject: "Vorlagen-Benachrichtigung",
      template_notification: "Vorlage {{type}}: {{name}}",
      template_notification_with_id: "Vorlage {{type}} - {{name}}",
    },
    sms: {
      from: "+0987654321",
      template_notification: "Vorlage {{type}}: {{name}} (ID: {{id}})",
      template_details:
        "Vorlage {{type}}: {{name}}\nID: {{id}}\nStatus: {{status}}",
      custom_message: "Hinweis: {{message}}",
      urgent_message: "DRINGEND: Vorlage {{type}} - {{name}} (ID: {{id}})",
      test_numbers: ["+1234567890"],
    },
    repository: {
      template_name: "Vorlage {{id}}",
    },
  };
