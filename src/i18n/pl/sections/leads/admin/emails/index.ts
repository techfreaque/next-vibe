import type { emailsTranslations as EnglishEmailsTranslations } from "../../../../../en/sections/leads/admin/emails";
import { previewTranslations } from "./preview";
import { testEmailTranslations } from "./testEmail";

export const emailsTranslations: typeof EnglishEmailsTranslations = {
  preview: previewTranslations,
  testEmail: testEmailTranslations,
  title: "Podglądy E-maili",
  subtitle: "Podgląd i testowanie szablonów e-maili dla wszystkich kampanii",
  description: "Podgląd i zarządzanie szablonami e-maili",
  generate_all: "Generuj Wszystkie Podglądy",
  preview_controls: "Kontrola Podglądu",
  journey_variant: "Wariant Podróży",
  campaign_stage: "Etap Kampanii",
  preview_selected: "Podgląd Wybranego",
  all_templates: "Wszystkie Szablony E-maili",
  subject: "Temat",
  recipient: "Odbiorca",
  from: "Od",
  view_preview: "Zobacz Podgląd",
  email_content: "Treść E-maila",
  journey: "Podróż",
  stage: "Etap",
  total_templates: "Łączne Szablony",
  templates: "szablony",
  quick_access: "Szybki Dostęp",
  more_templates: "więcej szablonów",
  preview_title: "Podgląd E-maila",
  email_preview: "Podgląd E-maila",
  rendered_server_side: "Renderowane po stronie serwera",
  view_raw_html: "Zobacz Raw HTML",
};
