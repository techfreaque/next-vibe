import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  backToTools: "Alle Werkzeuge",
  parameters: "Parameter",
  aliases: "Aliase",
  tags: "Tags",
  category: "Kategorie",
  openTool: "Werkzeug öffnen",
  notFound: "Werkzeug nicht gefunden",
  notFoundDescription:
    "Das gesuchte Werkzeug existiert nicht oder du hast keinen Zugriff.",
  platforms: "Verfügbar auf",
  credits: "Credits",
  method: "Methode",
  meta: {
    title: "{{toolName}} - KI-Werkzeug",
    category: "KI-Werkzeuge",
    description:
      "Details und Parameter für das Werkzeug {{toolName}} auf {{appName}}.",
    imageAlt: "{{toolName}} - KI-Werkzeug auf {{appName}}",
    keywords: "{{toolName}}, KI-Werkzeuge, {{appName}}",
  },
};
