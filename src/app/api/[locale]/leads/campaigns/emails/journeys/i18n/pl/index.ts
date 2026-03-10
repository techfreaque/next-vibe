import type { translations as enTranslations } from "../en";

import { journeysTranslations } from "./journeys";

export const translations: typeof enTranslations = {
  emailJourneys: {
    components: {
      defaults: {
        signatureName: "Inny użytkownik unbottled.ai",
        previewLeadId: "podglad-lead-id",
        previewEmail: "podglad@przyklad.pl",
        previewBusinessName: "Przykładowa Firma",
        previewContactName: "Użytkownik Podglądu",
        previewPhone: "+48123456789",
        previewCampaignId: "podglad-kampania-id",
      },
      footer: {
        unsubscribeText: "Otrzymujesz tę wiadomość, ponieważ wyraziłeś zgodę.",
        unsubscribeLink: "Wypisz się",
      },
      journeyInfo: {
        uncensoredConvert: {
          name: "Niecenzurowana konwersja",
          description: "Entuzjasta dzielący się swoim odkryciem unbottled.ai",
          longDescription:
            "Entuzjasta dzielący się prawdziwym odkryciem z transparentnością afiliacyjną",
          characteristics: {
            tone: "Swobodny, spiskowczy ton",
            story: "Prawdziwa osobista historia",
            transparency: "Transparentność afiliacyjna",
            angle: "Kąt anty-cenzury",
            energy: "Energia entuzjasty",
          },
        },
        sideHustle: {
          name: "Dodatkowy zarobek",
          description:
            "Transparentny afiliant dzielący się prawdziwymi przypadkami użycia",
          longDescription:
            "Transparentny marketer afiliacyjny dzielący się prawdziwymi cotygodniowymi przypadkami użycia",
          characteristics: {
            disclosure: "Pełne ujawnienie afiliacji od początku",
            updates: "Cotygodniowe aktualizacje przypadków użycia",
            income: "Historia pasywnego dochodu",
            proof: "Praktyczny dowód, nie hype",
            energy: "Uczciwa energia hustle",
          },
        },
        quietRecommendation: {
          name: "Cicha rekomendacja",
          description:
            "Spokojny profesjonalista przekazujący przetestowane narzędzie",
          longDescription:
            "Spokojny profesjonalista przekazujący narzędzie testowane przez tygodnie",
          characteristics: {
            signal: "Krótki, wysoki stosunek sygnału do szumu",
            specifics: "Bez hype, tylko konkrety",
            testing: "Historia testowania przez 3 tygodnie",
            comparison: "Uczciwe porównanie z ChatGPT",
            affiliate: "Minimalne wzmianki o afiliacji",
          },
        },
        signupNurture: {
          name: "Nurturing po rejestracji",
          description: "Sekwencja onboardingowa dla nowych użytkowników",
          longDescription:
            "E-maile powitalne i onboardingowe pomagające nowym użytkownikom rozpocząć pracę",
        },
        retention: {
          name: "Retencja",
          description: "Reaktywacja dla istniejących subskrybentów",
          longDescription:
            "E-maile oparte na wartości, aby utrzymać aktywnych subskrybentów i eksplorować funkcje",
        },
        winback: {
          name: "Odzyskiwanie klientów",
          description: "Odzyskaj nieaktywnych lub odchodzących użytkowników",
          longDescription:
            "Kampania reaktywacyjna skierowana do użytkowników, którzy stali się nieaktywni lub zrezygnowali",
        },
      },
    },
    leads: {
      journeys: journeysTranslations,
    },
  },
};
