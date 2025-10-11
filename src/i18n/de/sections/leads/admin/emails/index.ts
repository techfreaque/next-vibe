import type { emailsTranslations as EnglishEmailsTranslations } from "../../../../../en/sections/leads/admin/emails";
import { previewTranslations } from "./preview";
import { testEmailTranslations } from "./testEmail";

export const emailsTranslations: typeof EnglishEmailsTranslations = {
  preview: previewTranslations,
  testEmail: testEmailTranslations,
  title: "E-Mail-Vorschauen",
  subtitle: "E-Mail-Vorlagen für alle Kampagnen anzeigen und testen",
  description: "E-Mail-Vorlagen anzeigen und verwalten",
  generate_all: "Alle Vorschauen generieren",
  preview_controls: "Vorschau-Steuerung",
  journey_variant: "Journey-Variante",
  campaign_stage: "Kampagnen-Phase",
  preview_selected: "Ausgewählte Vorschau",
  all_templates: "Alle E-Mail-Vorlagen",
  subject: "Betreff",
  recipient: "Empfänger",
  from: "Von",
  view_preview: "Vorschau anzeigen",
  email_content: "E-Mail-Inhalt",
  journey: "Journey",
  stage: "Phase",
  total_templates: "Gesamt Vorlagen",
  templates: "Vorlagen",
  quick_access: "Schnellzugriff",
  more_templates: "weitere Vorlagen",
  preview_title: "E-Mail-Vorschau",
  email_preview: "E-Mail-Vorschau",
  rendered_server_side: "Server-seitig gerendert",
  view_raw_html: "Raw HTML anzeigen",
};
