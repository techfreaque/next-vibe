import type { structuredDataTranslations as EnglishStructuredDataTranslations } from "../../../en/sections/layout/structuredData";

export const structuredDataTranslations: typeof EnglishStructuredDataTranslations =
  {
    organization: {
      name: "{{appName}}",
      contactPoint: {
        telephone: "+1-555-123-4567",
        contactType: "customer service",
      },
      types: {
        organization: "Organization",
        contactPoint: "ContactPoint",
      },
    },
  };
