import type { emailTranslations as EnglishEmailTranslations } from "../../../../../en/sections/auth/signup/email";
import { afterProfileTranslations } from "./afterProfile";
import { firstStepTranslations } from "./firstStep";
import { ourServiceTranslations } from "./ourService";
import { primaryActionTranslations } from "./primaryAction";

export const emailTranslations: typeof EnglishEmailTranslations = {
  afterProfile: afterProfileTranslations,
  firstStep: firstStepTranslations,
  ourService: ourServiceTranslations,
  primaryAction: primaryActionTranslations,
  subject:
    "🎉 Willkommen bei {{appName}} - Ihre individuelle Social Media Reise beginnt jetzt!",
  title: "Willkommen an Bord, {{firstName}}!",
  previewText:
    "Vervollständigen Sie Ihr Setup und erhalten Sie maßgeschneiderte Social Media Inhalte für Ihr Unternehmen!",
  welcomeMessage:
    "Herzlichen Glückwunsch zum Beitritt zu {{appName}}! Wir freuen uns darauf, Ihnen bei der Schaffung einer starken Social Media Präsenz mit maßgeschneiderten Inhalten und Strategien für Ihr Unternehmen zu helfen.",
  featuresIntro: "Das können Sie mit {{appName}} erwarten:",
  feature1: "🎨 Professionelle Content-Erstellung und Terminplanung",
  feature2: "📊 Erweiterte Analytik und Leistungseinblicke",
  feature3: "💬 Community Management und Engagement-Tools",
  feature4: "🎯 Datengesteuerte Strategieoptimierung",
  needHelp: "Fragen? Wir sind hier, um zu helfen!",
  supportMessage:
    "Unser Team ist hier, um Ihren Erfolg zu gewährleisten. Ob Sie Hilfe bei der Auswahl eines Plans benötigen oder Ihre Social Media Ziele besprechen möchten, wir melden uns schnell bei Ihnen zurück.",
  contactSupport: "Unser Team kontaktieren",
  excited:
    "Wir können es kaum erwarten, Ihre Social Media Präsenz erblühen zu sehen!",
  signoff: "Mit freundlichen Grüßen,\nDas {{appName}} Team",
  ctaButton: "Loslegen",
};
