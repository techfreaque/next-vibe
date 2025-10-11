export const templateNotificationsTranslations = {
  types: {
    created: "Created",
    updated: "Updated",
    published: "Published",
    deleted: "Deleted",
    unknown: "Unknown",
  },
  email: {
    admin_subject: "Admin Notification",
    user_subject: "Template Notification",
    template_notification: "Template {{type}}: {{name}}",
    template_notification_with_id: "Template {{type}} - {{name}}",
  },
  sms: {
    from: "+0987654321",
    template_notification: "Template {{type}}: {{name}} (ID: {{id}})",
    template_details:
      "Template {{type}}: {{name}}\nID: {{id}}\nStatus: {{status}}",
    custom_message: "Note: {{message}}",
    urgent_message: "URGENT: Template {{type}} - {{name}} (ID: {{id}})",
    test_numbers: ["+1234567890"],
  },
  repository: {
    template_name: "Template {{id}}",
  },
};
