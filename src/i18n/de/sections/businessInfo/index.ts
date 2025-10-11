import type { businessInfoTranslations as EnglishBusinessInfoTranslations } from "../../../en/sections/businessInfo";
import { ageRangesTranslations } from "./ageRanges";
import { audienceTranslations } from "./audience";
import { brandTranslations } from "./brand";
import { budgetRangesTranslations } from "./budgetRanges";
import { businessTranslations } from "./business";
import { businessInfoSectionTranslations } from "./business_info";
import { businessTypesTranslations } from "./businessTypes";
import { challengesTranslations } from "./challenges";
import { competitorsTranslations } from "./competitors";
import { formTranslations } from "./form";
import { goalsTranslations } from "./goals";
import { incomeLevelsTranslations } from "./incomeLevels";
import { industriesTranslations } from "./industries";
import { interestsTranslations } from "./interests";
import { jobTitlesTranslations } from "./jobTitles";
import { navTranslations } from "./nav";
import { overviewTranslations } from "./overview";
import { profileTranslations } from "./profile";
import { progressTranslations } from "./progress";
import { socialTranslations } from "./social";
import { successMetricsTranslations } from "./successMetrics";
import { tabsTranslations } from "./tabs";

export const translations: typeof EnglishBusinessInfoTranslations = {
  ageRanges: ageRangesTranslations,
  audience: audienceTranslations,
  brand: brandTranslations,
  budgetRanges: budgetRangesTranslations,
  business: businessTranslations,
  business_info: businessInfoSectionTranslations,
  businessTypes: businessTypesTranslations,
  challenges: challengesTranslations,
  competitors: competitorsTranslations,
  form: formTranslations,
  goals: goalsTranslations,
  incomeLevels: incomeLevelsTranslations,
  industries: industriesTranslations,
  interests: interestsTranslations,
  jobTitles: jobTitlesTranslations,
  nav: navTranslations,
  overview: overviewTranslations,
  profile: profileTranslations,
  progress: progressTranslations,
  social: socialTranslations,
  successMetrics: successMetricsTranslations,
  tabs: tabsTranslations,
  businessInfo: {
    business: {
      form: {
        title: "Unternehmensinformationen",
        description:
          "Erzählen Sie uns von Ihrem Unternehmen, um personalisierte Empfehlungen zu erhalten",
        sections: {
          basic: {
            title: "Grundlegende Informationen",
            description: "Wesentliche Details über Ihr Unternehmen",
          },
          contact: {
            title: "Kontaktinformationen",
            description: "Wie Kunden Ihr Unternehmen erreichen können",
          },
          details: {
            title: "Zusätzliche Details",
            description: "Weitere Informationen über Ihr Unternehmen",
          },
        },
        fields: {
          businessType: {
            label: "Unternehmensart",
            placeholder: "z.B. SaaS, E-Commerce, Beratung",
            searchPlaceholder: "Unternehmenstypen suchen...",
          },
          businessName: {
            label: "Unternehmensname",
            placeholder: "Ihr Unternehmensname",
          },
          industry: {
            label: "Branche",
            placeholder: "z.B. Technologie, Gesundheitswesen, Finanzen",
            searchPlaceholder: "Branchen suchen...",
          },
          businessSize: {
            label: "Unternehmensgröße",
            placeholder: "Unternehmensgröße auswählen",
            options: {
              startup: "Startup (1-10 Mitarbeiter)",
              small: "Klein (11-50 Mitarbeiter)",
              medium: "Mittel (51-200 Mitarbeiter)",
              large: "Groß (201-1000 Mitarbeiter)",
              enterprise: "Konzern (1000+ Mitarbeiter)",
            },
          },
          businessEmail: {
            label: "Unternehmens-E-Mail",
            placeholder: "kontakt@ihrunternehmen.de",
          },
          businessPhone: {
            label: "Unternehmenstelefon",
            placeholder: "+49 (0) 123 456789",
          },
          website: {
            label: "Website",
            placeholder: "https://ihrunternehmen.de",
          },
          country: {
            label: "Land",
            placeholder: "Deutschland",
          },
          city: {
            label: "Stadt",
            placeholder: "Berlin",
          },
          foundedYear: {
            label: "Gründungsjahr",
            placeholder: "2020",
          },
          description: {
            label: "Unternehmensbeschreibung",
            placeholder: "Beschreiben Sie, was Ihr Unternehmen macht...",
          },
        },
        submit: {
          save: "Unternehmensinformationen speichern",
          saving: "Speichern...",
        },
      },
    },
  },
};
