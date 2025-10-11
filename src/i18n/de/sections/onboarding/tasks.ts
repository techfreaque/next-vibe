import type { tasksTranslations as EnglishTasksTranslations } from "../../../en/sections/onboarding/tasks";

export const tasksTranslations: typeof EnglishTasksTranslations = {
  businessInfo: {
    title: "Unternehmensinformationen",
    description:
      "Teilen Sie Ihre Unternehmensdetails, Ziele und Zielgruppe mit (~{{minutes}} Minuten). Optional - Sie können dies während Ihrer Beratung mit unseren Experten ausfüllen.",
    completedDescription:
      "Ihre Unternehmensinformationen wurden gespeichert. Überprüfen und aktualisieren Sie Ihre Details, Ziele und Zielgruppe nach Bedarf.",
    badge: "Optional",
    completedBadge: "Abgeschlossen",
  },
  subscription: {
    title: "Ihren Plan wählen",
    description:
      "Wählen Sie einen Abonnement-Plan, der zu Ihren Bedürfnissen und Ihrem Budget passt. Optional - Sie können Ihren Plan während der Beratung besprechen und wählen.",
    completedDescription:
      "Ihr Abonnement-Plan ist aktiv. Sehen Sie sich Ihre aktuellen Plandetails an oder wechseln Sie zu einem anderen Plan.",
    badge: "Optional",
    completedBadge: "Aktiv",
  },
  consultation: {
    title: "Kostenlose Beratung vereinbaren",
    description:
      "Buchen Sie Ihre kostenlose Beratung ({{minDuration}}-{{maxDuration}} Minuten) mit unseren Social Media-Experten. Beginnen Sie hier - wir helfen Ihnen mit allem anderen während des Gesprächs!",
    completedDescription:
      "Ihre Beratung ist geplant. Sehen Sie sich Ihre Termindetails an, verschieben Sie den Termin oder buchen Sie zusätzliche Sitzungen.",
    badge: "Hier beginnen",
    completedBadge: "Geplant",
  },
};
