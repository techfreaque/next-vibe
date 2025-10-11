import type { templateNotificationsTranslations as EnglishTemplateNotificationsTranslations } from "../../en/sections/templateNotifications";

export const templateNotificationsTranslations: typeof EnglishTemplateNotificationsTranslations =
  {
    types: {
      created: "Szablon utworzony",
      updated: "Szablon zaktualizowany",
      published: "Szablon opublikowany",
      deleted: "Szablon usunięty",
      unknown: "Nieznany typ szablonu",
    },
    email: {
      admin_subject: "Powiadomienie administratora",
      user_subject: "Powiadomienie o szablonie",
      template_notification: "Szablon {{type}}: {{name}}",
      template_notification_with_id: "Szablon {{type}} - {{name}}",
    },
    sms: {
      from: "+0987654321",
      template_notification: "Szablon {{type}}: {{name}} (ID: {{id}})",
      template_details:
        "Szablon {{type}}: {{name}}\nID: {{id}}\nStatus: {{status}}",
      custom_message: "Uwaga: {{message}}",
      urgent_message: "PILNE: Szablon {{type}} - {{name}} (ID: {{id}})",
      test_numbers: ["+1234567890"],
    },
    repository: {
      template_name: "Szablon {{id}}",
    },
  };
