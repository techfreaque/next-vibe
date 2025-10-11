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

export const businessInfoTranslations = {
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
        title: "Business Information",
        description:
          "Tell us about your business to get personalized recommendations",
        sections: {
          basic: {
            title: "Basic Information",
            description: "Essential details about your business",
          },
          contact: {
            title: "Contact Information",
            description: "How customers can reach your business",
          },
          details: {
            title: "Additional Details",
            description: "More information about your business",
          },
        },
        fields: {
          businessType: {
            label: "Business Type",
            placeholder: "e.g., SaaS, E-commerce, Consulting",
            searchPlaceholder: "Search business types...",
          },
          businessName: {
            label: "Business Name",
            placeholder: "Your business name",
          },
          industry: {
            label: "Industry",
            placeholder: "e.g., Technology, Healthcare, Finance",
            searchPlaceholder: "Search industries...",
          },
          businessSize: {
            label: "Business Size",
            placeholder: "Select business size",
            options: {
              startup: "Startup (1-10 employees)",
              small: "Small (11-50 employees)",
              medium: "Medium (51-200 employees)",
              large: "Large (201-1000 employees)",
              enterprise: "Enterprise (1000+ employees)",
            },
          },
          businessEmail: {
            label: "Business Email",
            placeholder: "contact@yourbusiness.com",
          },
          businessPhone: {
            label: "Business Phone",
            placeholder: "+1 (555) 123-4567",
          },
          website: {
            label: "Website",
            placeholder: "https://yourbusiness.com",
          },
          country: {
            label: "Country",
            placeholder: "United States",
          },
          city: {
            label: "City",
            placeholder: "San Francisco",
          },
          foundedYear: {
            label: "Founded Year",
            placeholder: "2020",
          },
          description: {
            label: "Business Description",
            placeholder: "Describe what your business does...",
          },
        },
        submit: {
          save: "Save Business Information",
          saving: "Saving...",
        },
      },
    },
  },
};
