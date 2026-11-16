import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    defaultTitle: "unbottled.ai - Niecenzurowany czat AI",
    category: "Platforma czatu AI",
    description:
      "Doświadcz prawdziwie niecenzurowanych rozmów AI z {{modelCount}} modelami. Żadnych filtrów, żadnych ograniczeń, tylko szczera AI.",
    imageAlt: "unbottled.ai - Niecenzurowana platforma czatu AI",
    keywords:
      "niecenzurowana AI, czat AI, GPT-4, Claude, Gemini, modele AI, bez filtrów, szczera AI, rozmowy AI",
  },
  structuredData: {
    app: {
      description:
        "Czat AI z {{modelCount}} modelami od {{providerCount}} laboratoriów: mainstreamowymi, otwartymi i bez cenzury. Ty wybierasz poziom filtrów w każdym czacie. Płacisz za użycie, kredytami. Open source, możesz hostować sam.",
      freeOffer:
        "{{guest}} darmowych kredytów miesięcznie bez konta, {{signedIn}} z darmowym kontem, {{max}} z darmowym kontem i newsletterem. Karta niepotrzebna.",
      yearlyName: "Subskrypcja roczna",
      yearlyDescription: "{{subCredits}} kredytów miesięcznie, płatność roczna",
    },
    pricing: {
      name: "{{appName}}: plany i kredyty",
      description:
        "Darmowe kredyty co miesiąc, subskrypcja albo jednorazowy pakiet kredytów. Jedno saldo na {{modelCount}} modeli czatu plus modele obrazu, wideo, muzyki i głosu.",
    },
    organization: {
      types: {
        organization: "Organizacja",
        contactPoint: "Punkt kontaktowy",
      },
      contactPoint: {
        contactType: "Obsługa klienta",
      },
    },
  },
  constants: {
    languages: {
      en: "Angielski",
      de: "Niemiecki",
      pl: "Polski",
    },
  },
};
