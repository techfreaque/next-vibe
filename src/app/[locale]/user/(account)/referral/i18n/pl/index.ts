export const translations = {
  backToChat: "Wróć do czatu",
  title: "Twój łańcuch poleceń. Cyklicznie. Wiecznie.",
  description:
    "Poleć kogoś → {{directPct}} każdej płatności, jaką kiedykolwiek wykona. Opublikuj skill, przez który się zarejestruje → {{skillPct}} łącznie. Ich polecenia też Ci przynoszą procent, poziom po poziomie. Bez daty ważności. Bez limitu.",
  tagline: "Polecenia i Skille",

  hero: {
    directEarning: "Zarabiasz",
    directLabel: "od każdej płatności",
    directNote: "od osób, które polecasz, wiecznie",
    bonusEarning: "Via link do skilla",
    bonusNote: "bezpośrednio + bonus za skill, cyklicznie wiecznie",
  },

  commissionTable: {
    perMonth: "/ mies.",
    colLevel: "Kto zarabia",
    colCut: "Udział",
    alwaysYours: "zawsze Twoje",
    heroLabel: "od każdej płatności",
    heroSub: "Cyklicznie. Wiecznie.",
    chainTitle: "10 subskrybentów. Co zarabiasz miesięcznie.",
    chainSubtitle:
      "Każdy poziom to połowa wyższego. Zbudowany raz przy rejestracji — płaci wiecznie.",
    youLabel: "Ty",
    whoLabels: [
      "Ty - ktokolwiek polecił ich bezpośrednio",
      "Twórca skilla (jeśli inny) lub Twój polecający",
      "Polecający ich polecającego",
      "Poziom 4",
      "Poziom 5",
      "Poziom 6",
    ],
    colExample: "Przykład (plan {{examplePrice}}/mies.)",
    tableNote:
      "Link polecający: {{directPct}} od użytkownika. Link do skilla: {{directPct}} bezpośrednio + {{skillBonusPct}} bonus za skill = {{skillPct}} od użytkownika. Oba cyklicznie, wiecznie.",
  },

  commission: {
    title: "Łańcuch, poziom po poziomie",
    subtitle:
      "Każda płatność Twoich poleceń przepływa w górę łańcucha. Ty siedzisz na poziomie 1 - {{directPct}} na zawsze. Każdy poziom wyżej też zarabia.",
    directTitle: "Bezpośrednia prowizja",
    directAmount: "Zawsze {{directPct}}",
    directDesc:
      "Za każdym razem gdy ktoś przez Ciebie polecony płaci, dostajesz {{directPct}}. Bez wyjątków. Bez daty ważności.",
    bonusTitle: "Zarobki z sieci",
    bonusAmount: "Do {{uplinePct}} więcej",
    bonusDesc:
      "Twoje polecenia polecają innych - zarabiasz też z tych płatności. {{level2Pct}} z poziomu 2, {{level3Pct}} z poziomu 3, połowa z każdym poziomem.",
    totalTitle: "Łączny potencjał",
    totalAmount: "Do {{totalPct}}",
    totalDesc: "Gdy Twoje polecenia też polecają innych",
    levelsTitle: "Podział na poziomy",
    level1: "Polecasz kogoś → {{directPct}} jego płatności",
    level2: "On poleca kogoś → {{level2Pct}} tych płatności",
    level3: "Ci polecają innych → {{level3Pct}}",
    level4: "I tak dalej, do {{maxUplineLevels}} poziomów",
  },

  story: {
    title: "Jak łańcuch się mnoży",
    subtitle:
      "Te same 10 subskrybentów. Każdy aktywowany poziom dodaje się do sumy — wiecznie.",
    totalLabel: "Łącznie / mies.",
    addedLabel: "+{{amount}} z tego poziomu",
    levelLabel: "Poziom {{n}} aktywny",
    level1Desc:
      "Twoich 10 bezpośrednich subskrybentów. {{directPct}} od każdego.",
    level2Desc:
      "Twoje polecenia polecają kogoś. Zarabiasz też z tych płatności.",
    level3Desc: "Ich polecenia polecają. Łańcuch rośnie dalej.",
    level4Desc: "Czwarty poziom. Nadal płaci.",
    level5Desc: "Piąty poziom.",
    level6Desc: "Szósty poziom. Każdy grosz, wiecznie.",
    noob: {
      label: "Pierwsze kroki",
      earning: "~{{story_noob_earning}}/mies.",
      desc: "{{story_noob_users}} płacących subskrybentów przez Twój link polecający. {{directPct}} od każdego - pasywny dochód z jednego posta.",
    },
    mid: {
      label: "Rosnąca publiczność",
      earning: "~{{story_mid_earning}}/mies.",
      desc: "{{story_mid_users}} subskrybentów - mix linków polecających i do skillu. Część ich znajomych też się zarejestrowała. Łańcuch buduje się sam.",
    },
    pro: {
      label: "Uznany twórca",
      earning: "~{{story_pro_earning}}/mies.",
      desc: "{{story_pro_users}} subskrybentów przez oba kanały, plus zarobki z poleceń ich poleceń. W pełni składający się.",
    },
  },

  overview: {
    title: "Twoje zarobki",
    subtitle: "Statystyki na żywo. Aktualizuje się z każdą płatnością.",
  },

  howItWorks: {
    title: "Jak to działa",
    step1Title: "Utwórz kod polecający",
    step1Body:
      "Twórz unikalne kody dla różnych odbiorców - znajomych, Discorda, posta na blogu. Każdy śledzony osobno.",
    step2Title: "Udostępnij link",
    step2Body:
      "Link polecający → {{directPct}} na użytkownika, wiecznie. Link do skilla → {{skillPct}} na użytkownika ({{directPct}} + {{skillBonusPct}} bonus za skill). Dwa źródła, jeden link.",
    step3Title: "Odbierz wypłatę",
    step3Body:
      "Kredyty są natychmiast. Wypłać w BTC lub USDC po osiągnięciu {{minPayout}}.",
  },

  manage: {
    createSubtitle: "Twórz kody dla konkretnych kampanii lub odbiorców.",
    codesSubtitle: "Śledź wyniki i zarobki dla każdego kodu.",
  },
  createCode: {
    title: "Utwórz kod polecający",
    create: "Utwórz kod",
    creating: "Tworzenie...",
  },
  myCodes: {
    title: "Twoje kody polecające",
    loading: "Ładowanie...",
    error: "Nie udało się załadować kodów",
    empty: "Brak kodów. Utwórz swój pierwszy powyżej ↑",
    copy: "Kopiuj link",
    copied: "Skopiowano!",
    uses: "Użycia",
    signups: "Rejestracje",
    revenue: "Przychód",
    earnings: "Zarobione",
    inactive: "Nieaktywny",
  },
  stats: {
    loading: "Ładowanie...",
    error: "Nie udało się załadować statystyk",
    totalSignups: "Łączne rejestracje",
    totalSignupsDesc: "Użytkownicy, którzy zarejestrowali się przez Twój kod",
    totalRevenue: "Wygenerowany przychód",
    totalRevenueDesc: "Całkowita wartość subskrypcji z Twoich poleceń",
    totalEarned: "Łącznie zarobione",
    totalEarnedDesc: "Twoje prowizje ze wszystkich poleceń",
    availableBalance: "Dostępne saldo",
    availableBalanceDesc:
      "Na czaty AI - inne kredyty używane najpierw. Zarobić {{minPayout}}, by odblokować wypłatę.",
  },
  cta: {
    title: "Utwórz konto i zacznij zarabiać",
    description:
      "Zdobądź link polecający. Zarabiaj {{directPct}} od każdej płatności - cyklicznie, bez daty ważności. Opublikuj skill i zarabiaj {{skillPct}}.",
    signUp: "Utwórz konto",
    logIn: "Zaloguj się",
    pitch1:
      "{{directPct}} prowizji polecającej - cyklicznie, bez daty ważności",
    pitch2:
      "Opublikuj skill → {{skillPct}} od każdego, kto się przez niego zarejestruje",
    pitch3: "Kredyty natychmiast. BTC/USDC od minimum {{minPayout}}.",
  },
  payout: {
    title: "Wypłać zarobki",
    description: "Dwa sposoby na wykorzystanie tego, co zarobiłeś",
    useAsCredits: "Użyj jako kredyty czatu",
    useAsCreditsDesc:
      "Natychmiast. Bez minimum. Zamiana 1:1 na kredyty do rozmów z AI.",
    cryptoPayout: "Wypłata w kryptowalucie",
    cryptoPayoutDesc: "BTC lub USDC na Twój adres portfela.",
    minimumNote:
      "Minimum: {{minPayout}}. Przetwarzane w ciągu {{cryptoPayoutHours}} godzin od zatwierdzenia.",
  },
  audienceCallout: {
    title: "Dwa sposoby zarabiania",
    newTitle: "Link polecający — {{directPct}} na użytkownika",
    newBody:
      "Udostępnij kod. Każdy, kto się przez niego zarejestruje i płaci, daje Ci {{directPct}} każdej płatności, co miesiąc, wiecznie. Wrzucasz raz. Zarabiasz zawsze.",
    newCta: "Zdobądź swój link polecający",
    proTitle: "Link do skilla — {{skillPct}} na użytkownika",
    proBody:
      "Zbuduj skill. Udostępnij link. Każdy, kto przez niego wejdzie, płaci Ci {{directPct}} bezpośrednio + {{skillBonusPct}} bonus za skill = {{skillPct}} od użytkownika, cyklicznie. Bez potrzeby followersów.",
    proCta: "Zbuduj skill",
  },
  discord: {
    title: "Dołącz do społeczności",
    description:
      "Dziel się strategiami, zadawaj pytania, łącz się z innymi zarabiającymi.",
    cta: "Dołącz do Discorda",
  },
};
