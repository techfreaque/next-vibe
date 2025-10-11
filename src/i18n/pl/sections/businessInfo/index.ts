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

export const businessInfoTranslations: typeof EnglishBusinessInfoTranslations =
  {
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
          title: "Informacje Biznesowe",
          description:
            "Opowiedz nam o swojej firmie, aby otrzymać spersonalizowane rekomendacje",
          sections: {
            basic: {
              title: "Podstawowe Informacje",
              description: "Podstawowe dane o Twojej firmie",
            },
            contact: {
              title: "Informacje Kontaktowe",
              description: "Jak klienci mogą skontaktować się z Twoją firmą",
            },
            details: {
              title: "Dodatkowe Szczegóły",
              description: "Więcej informacji o Twojej firmie",
            },
          },
          fields: {
            businessType: {
              label: "Typ Działalności",
              placeholder: "np. SaaS, E-commerce, Konsulting",
              searchPlaceholder: "Szukaj typów działalności...",
            },
            businessName: {
              label: "Nazwa Firmy",
              placeholder: "Nazwa Twojej firmy",
            },
            industry: {
              label: "Branża",
              placeholder: "np. Technologia, Opieka zdrowotna, Finanse",
              searchPlaceholder: "Szukaj branż...",
            },
            businessSize: {
              label: "Wielkość Firmy",
              placeholder: "Wybierz wielkość firmy",
              options: {
                startup: "Startup (1-10 pracowników)",
                small: "Mała (11-50 pracowników)",
                medium: "Średnia (51-200 pracowników)",
                large: "Duża (201-1000 pracowników)",
                enterprise: "Enterprise (1000+ pracowników)",
              },
            },
            businessEmail: {
              label: "E-mail Firmowy",
              placeholder: "kontakt@twojafirma.pl",
            },
            businessPhone: {
              label: "Telefon Firmowy",
              placeholder: "+48 123 456 789",
            },
            website: {
              label: "Strona Internetowa",
              placeholder: "https://twojafirma.pl",
            },
            country: {
              label: "Kraj",
              placeholder: "Polska",
            },
            city: {
              label: "Miasto",
              placeholder: "Warszawa",
            },
            foundedYear: {
              label: "Rok Założenia",
              placeholder: "2020",
            },
            description: {
              label: "Opis Działalności",
              placeholder: "Opisz czym zajmuje się Twoja firma...",
            },
          },
          submit: {
            save: "Zapisz Informacje Biznesowe",
            saving: "Zapisywanie...",
          },
        },
      },
    },
  };
