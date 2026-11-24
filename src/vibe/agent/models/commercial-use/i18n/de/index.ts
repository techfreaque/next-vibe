import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    status: {
      allowed: "Kommerzielle Nutzung erlaubt",
      restricted: "Kommerzielle Nutzung eingeschränkt",
      unclear: "Kommerzielle Nutzung ungeklärt",
    },
    reason: {
      openLicense: "Offene Lizenz, die kommerzielle Nutzung erlaubt.",
      providerTerms:
        "Die Bedingungen des Anbieters erlauben die kommerzielle Nutzung der Ausgaben.",
      nonCommercialLicense:
        "Die Modelllizenz erlaubt nur nichtkommerzielle Nutzung.",
      separateLicense:
        "Kommerzielle Nutzung erfordert eine eigene Lizenz des Modellherstellers.",
      useLimits:
        "Der Anbieter schließt bestimmte kommerzielle Nutzungen aus, etwa Film, TV, Spiele und Weiterverkauf.",
      communityLicense:
        "Community-Lizenz mit zusätzlichen Nutzungsbeschränkungen. Kommerzielle Nutzung ist nicht bestätigt.",
      hostPersonalUse:
        "Die Bedingungen des Hosting-Anbieters decken nur die private Nutzung ab.",
      vendorApproval:
        "Der Modellhersteller erlaubt kommerzielle Nutzung nur auf Antrag.",
      termsUnconfirmed:
        "Die Bedingungen des Anbieters konnten wir noch nicht bestätigen.",
    },
  },
  label: "Kommerzielle Nutzung",
  checkLicense: "Prüfe die Modelllizenz für deinen Zweck.",
  termsLink: "So funktionieren Rechte an KI-Ausgaben",
};
