export const translations = {
  backToChat: "Powrót do czatu",
  title: "Zarabiaj prawdziwe pieniądze z {{appName}}",
  description:
    "Polecaj {{appName}} i otrzymuj zapłatę. Zawsze zarabiasz {{directPct}} od każdej subskrypcji osób, które polecisz — bez względu na to, kto Cię polecił.",
  tagline: "Program Partnerski",

  hero: {
    directEarning: "Zawsze zarabiasz",
    directLabel: "od każdej subskrypcji",
    directNote: "od osób, które bezpośrednio polecasz",
    bonusEarning: "Plus zarobki bonusowe",
    bonusNote:
      "gdy Twoje polecenia polecają innych (do {{maxUplineLevels}} poziomów głębokości)",
    example:
      "Przykład: ktoś płaci {{examplePrice}}/miesiąc → Ty dostajesz {{exampleDirectEarning}} każdego miesiąca",
  },

  commissionTable: {
    colLevel: "Poziom",
    colCut: "Twój udział",
    colExample: "Przykład (plan {{examplePrice}}/mies.)",
    alwaysYours: "zawsze Twoje",
    heroGuarantee: "gwarantowane Tobie, zawsze",
    heroNote:
      "Od każdej płatności subskrypcji od osób, które polecasz — bez dzielenia się z własnym polecającym",
    whoLabels: [
      "Osoby, które polecasz",
      "Ich polecenia",
      "Polecenia poziomu 3",
      "Polecenia poziomu 4",
      "Polecenia poziomu 5",
    ],
  },

  commission: {
    title: "Ile zarabiasz?",
    subtitle:
      "Twoje {{directPct}} zawsze należy do Ciebie — bez dzielenia się z własnym polecającym. Twoja własna historia nie wpływa na Twoje zarobki.",
    directTitle: "Twój bezpośredni udział",
    directAmount: "Zawsze {{directPct}}",
    directDesc:
      "Za każdym razem, gdy osoba przez Ciebie polecona płaci, otrzymujesz {{directPct}} tej płatności. Natychmiast. Za każdym razem.",
    bonusTitle: "Bonus z Twojej sieci",
    bonusAmount: "Do {{uplinePct}} więcej",
    bonusDesc:
      "Gdy Twoje polecenia polecają innych, też zarabiasz — {{level2Pct}} od poziomu 2, {{level3Pct}} od poziomu 3 itd.",
    totalTitle: "Łącznie możesz zarobić",
    totalAmount: "Do {{totalPct}}",
    totalDesc: "Jeśli Twoje polecenia też polecają innych",
    levelsTitle: "Podział na poziomy",
    level1: "Polecasz kogoś → zarabiasz {{directPct}} ich płatności",
    level2: "Oni polecają kogoś → zarabiasz {{level2Pct}}",
    level3: "Ci ludzie polecają → zarabiasz {{level3Pct}}",
    level4: "I tak dalej... do {{maxUplineLevels}} poziomów",
    noPenalty: "Bycie polecanym nie zmniejsza Twoich zarobków",
    noPenaltyNote:
      "Nawet jeśli ktoś Cię polecił, Twoje {{directPct}} jest całkowicie oddzielne i chronione.",
  },

  overview: {
    title: "Twoje zarobki",
    subtitle:
      "Statystyki w czasie rzeczywistym, aktualizowane przy każdym zakupie.",
  },

  howItWorks: {
    title: "Jak to działa",
    step1Title: "Utwórz kod polecający",
    step1Body:
      "Generuj unikalne kody dla różnych odbiorców — znajomych, social media czy kampanii.",
    step2Title: "Udostępnij link",
    step2Body:
      "Gdy ktoś zarejestruje się przez Twój link i subskrybuje, zarabiasz {{directPct}} od każdej jego płatności — cyklicznie.",
    step3Title: "Odbierz wypłatę",
    step3Body:
      "Zarobki trafiają natychmiast na Twoje konto. Wydaj je na czaty AI lub wypłać w BTC/USDC.",
  },

  manage: {
    createSubtitle: "Twórz kody dla konkretnych kampanii lub odbiorców.",
    codesSubtitle: "Śledź wyniki i zarobki dla każdego kodu polecającego.",
  },
  createCode: {
    title: "Utwórz kod polecający",
    create: "Utwórz kod",
    creating: "Tworzenie...",
  },
  myCodes: {
    title: "Twoje kody polecające",
    loading: "Ładowanie kodów...",
    error: "Nie udało się załadować kodów",
    empty: "Brak kodów polecających. Utwórz swój pierwszy powyżej!",
    copy: "Kopiuj link",
    copied: "Skopiowano!",
    uses: "Użycia",
    signups: "Rejestracje",
    revenue: "Przychód",
    earnings: "Zarobione",
    inactive: "Nieaktywny",
  },
  stats: {
    loading: "Ładowanie statystyk...",
    error: "Nie udało się załadować statystyk",
    totalSignups: "Łączne rejestracje",
    totalSignupsDesc: "Osoby, które zarejestrowały się przez Twoje linki",
    totalRevenue: "Wygenerowany przychód",
    totalRevenueDesc: "Całkowita wartość z Twoich poleceń",
    totalEarned: "Łącznie zarobione",
    totalEarnedDesc: "Twoje prowizje",
    availableBalance: "Dostępne saldo",
    availableBalanceDesc: "Gotowe do użycia lub wypłaty",
  },
  cta: {
    title: "Zacznij zarabiać już dziś",
    description:
      "Utwórz konto lub zaloguj się, aby wygenerować swoje kody polecające i zarabiać {{directPct}} prowizji od każdej subskrypcji — na zawsze.",
    signUp: "Utwórz konto",
    logIn: "Zaloguj się",
    pitch1: "{{directPct}} od każdej płatności Twoich poleceń",
    pitch2: "Zarobki bonusowe z wielopoziomowych poleceń",
    pitch3: "Natychmiastowe wypłaty — jako kredyty lub krypto",
  },
  payout: {
    title: "Wypłać zarobki",
    description: "Wiele sposobów wykorzystania zarobków z poleceń",
    useAsCredits: "Użyj jako kredyty czatu",
    useAsCreditsDesc:
      "Natychmiast zamień zarobki na kredyty czatu do rozmów z AI.",
    cryptoPayout: "Wypłata w kryptowalucie",
    cryptoPayoutDesc: "Poproś o wypłatę w BTC lub USDC na swój portfel.",
    minimumNote:
      "Minimalna wypłata: {{minPayout}}. Wypłaty krypto są przetwarzane w ciągu 48 godzin od zatwierdzenia.",
  },
};
