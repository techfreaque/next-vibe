import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    status: {
      allowed: "Povolené komerčné použitie",
      restricted: "Obmedzené komerčné použitie",
      unclear: "Obchodné použitie nejasné",
    },
    reason: {
      openLicense: "Otvoriť licenciu, ktorá umožňuje komerčné použitie.",
      providerTerms:
        "Podmienky poskytovateľa umožňujú komerčné využitie výstupov.",
      nonCommercialLicense: "Modelová licencia je nekomerčná.",
      separateLicense:
        "Obchodné použitie potrebuje samostatnú licenciu od model výrobcu.",
      useLimits:
        "Poskytovateľ vylučuje niektoré komerčné použitia, ako je film, TV, hry a ďalší predaj.",
      communityLicense:
        "Licencia Spoločenstva s mimoriadnymi obmedzeniami použitia. Obchodné použitie nie je potvrdené.",
      hostPersonalUse:
        "Podmienky poskytovateľa hostingových služieb sa vzťahujú len na osobné použitie.",
      vendorApproval:
        "Modelový výrobca udeľuje komerčné využitie len na žiadosť.",
      termsUnconfirmed: "Zatiaľ sme nemohli potvrdiť podmienky poskytovateľa.",
    },
  },
  label: "Obchodné využitie",
  checkLicense: "Skontrolujte si licenciu na model pre vaše použitie.",
  termsLink: "Ako fungujú práva na výstup AI",
};
