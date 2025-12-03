import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Tytuł",
    description: "Opis endpointu",
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  resultsJourney: {
    followup1: {
      previewText: "Zobacz prawdziwe wyniki naszych klientów",
      headline: "Prawdziwe wyniki, Prawdziwi klienci",
      subheadline:
        "Nie wierz nam tylko na słowo - zobacz, co osiągnęliśmy dla firm takich jak Twoja",
      caseStudyTitle: "Historia sukcesu",
      caseStudyCompany: "Firma",
      caseStudyIndustry: "Branża",
      caseStudyTimeframe: "Ramy czasowe",
      caseStudyResults: "Osiągnięte wyniki",
      roiTitle: "Twój potencjalny ROI",
      roiExplanation:
        "Na podstawie podobnych klientów, oto czego możesz się spodziewać",
      metric1Label: "Wzrost przychodów",
      metric1Value: "Do 300%",
      metric2Label: "Zaoszczędzony czas",
      metric2Value: "20+ godzin/tydzień",
      ctaText: "Uzyskaj swoją niestandardową wycenę ROI",
      urgency: "Takie wyniki nie przychodzą przez czekanie",
      subject: "Zobacz, jak pomogliśmy firmom takim jak Twoja",
    },
    initial: {
      previewText: "Odkryj nasze profesjonalne usługi",
      heroTitle: "Wyniki, które się liczą",
      heroSubtitle: "Profesjonalne rozwiązania dla Twojej firmy",
      priceText: "Od {{price}}/miesiąc",
      processImagePlaceholder: "Nasz proces",
      noContractTitle: "Bez długoterminowej umowy",
      monthlyCancellation: "Anuluj w dowolnym momencie",
      ctaText: "Zacznij już dziś",
      contactTitle: "Pytania? Jesteśmy tu, aby pomóc:",
      subject: "Osiągnij prawdziwe wyniki dzięki naszym usługom",
    },
    followup2: {
      previewText: "Dlaczego wybór właściwego partnera ma znaczenie",
      greeting: "Wciąż zastanawiasz się?",
      intro:
        "Rozumiemy, że chcesz podjąć właściwą decyzję. Bądźmy transparentni co do tego, co nas wyróżnia.",
      competitorTitle: "Co powinieneś wiedzieć o alternatywach",
      competitorAnalysis:
        "Chociaż dostępne są inne opcje, należy wziąć pod uwagę:",
      competitorPoint1: "Wyższe koszty z ukrytymi opłatami, które się sumują",
      competitorPoint2: "Ograniczone wsparcie i wolniejsze czasy reakcji",
      competitorPoint3: "Mniej elastyczne warunki i sztywne wymagania umowne",
      opportunityCostTitle: "Prawdziwy koszt oczekiwania",
      opportunityCostText:
        "Każdy dzień bez właściwego rozwiązania oznacza utracone możliwości i stracony potencjał. Nie pozwól, aby niezdecydowanie kosztowało Cię więcej niż nasza usługa.",
      ctaText: "Dokonaj mądrego wyboru już dziś",
      urgency: "Ograniczona liczba miejsc w tym miesiącu. Nie przegap.",
      subject: "Prawda o Twoich opcjach",
    },
    followup3: {
      previewText: "Twoja ostatnia szansa czeka",
      greeting: "To Twoja ostatnia szansa",
      intro:
        "Podzieliliśmy się naszą wartością, odpowiedzieliśmy na obawy i pokazaliśmy, co jest możliwe. Teraz czas na decyzję.",
      finalOpportunityTitle: "Ostatnia okazja",
      finalOpportunityText:
        "Ta specjalna oferta wkrótce wygasa. Nie pozwól, aby ta okazja Ci umknęła.",
      limitedTimeOffer: "Oferta ograniczona czasowo wkrótce się kończy",
      whatYoureMissingTitle: "Co tracisz:",
      missingPoint1: "Sprawdzone rezultaty, które zapewniają prawdziwy ROI",
      missingPoint2: "Wsparcie ekspertów, gdy najbardziej go potrzebujesz",
      missingPoint3: "Elastyczne rozwiązania, które rosną razem z Tobą",
      lastChance: "Ostatnia szansa, aby skorzystać z tej oferty",
      ctaText: "Zarezerwuj swoje miejsce teraz",
      subject: "Ostatnie wezwanie: Nie przegap tej okazji",
    },
    nurture: {
      previewText: "Cenne spostrzeżenia dla Twojej firmy",
      greeting: "Bądź poinformowany i rośnij silniej",
      intro:
        "Jesteśmy tutaj, aby pomóc Ci odnieść sukces, niezależnie od tego, czy z nami współpracujesz, czy nie. Oto kilka spostrzeżeń, które pomogą Twojej firmie prosperować.",
      insightsTitle: "Spostrzeżenia branżowe i wskazówki",
      insight1: "Najnowsze trendy i najlepsze praktyki w Twojej branży",
      insight2: "Sprawdzone strategie poprawy wydajności i wyników",
      freeResourceTitle: "Darmowy zasób dla Ciebie",
      freeResourceDescription:
        "Pobierz nasz kompleksowy przewodnik pełen praktycznych wskazówek i strategii",
      noObligationText:
        "Bez zobowiązań - to nasz sposób na pomoc w Twoim sukcesie",
      ctaText: "Pobierz darmowy zasób",
      subject: "Spostrzeżenia, które pomogą rozwinąć Twoją firmę",
    },
    reactivation: {
      previewText: "Chcielibyśmy Cię z powrotem",
      greeting: "Brakowało nam Ciebie!",
      intro:
        "Zauważyliśmy, że ostatnio nie byłeś aktywny. Wprowadziliśmy ekscytujące ulepszenia i mamy dla Ciebie specjalną ofertę powitalną.",
      specialOfferTitle: "Ekskluzywna oferta powitalna",
      discountOffer: "Otrzymaj 50% zniżki na pierwszy miesiąc po powrocie",
      ctaText: "Odbierz swoją ofertę powitalną",
      subject: "Tęsknimy za Tobą - Specjalna oferta w środku",
    },
  },
};
