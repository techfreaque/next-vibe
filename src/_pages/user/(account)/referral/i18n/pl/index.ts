import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  backToChat: "Wróć do czatu",
  title:
    "Udostępnij link. Zarabiaj {{directPct}} z każdej płatności. Na zawsze.",
  description:
    "Każdy, kto zarejestruje się z Twojego linku, daje Ci {{directPct}} z każdej płatności. Bez daty ważności i bez limitu. Opublikuj skill i zarabiaj {{skillBonusPct}} od osób, które inni do niego przyprowadzą.",
  tagline: "Polecenia i Skille",

  hero: {
    directEarning: "Zarabiasz",
    directNote: "od osób, które polecasz, wiecznie",
    bonusEarning: "Jako twórca skilla",
    bonusNote: "gdy inni udostępniają Twój skill, na zawsze",
  },

  commissionTable: {
    youLabel: "Ty",
    perMonth: "/ mies.",
    colLevel: "Kto zarabia",
    colCut: "Udział",
    alwaysYours: "zawsze Twoje",
    heroLabel: "od każdej płatności",
    heroSub: "Cyklicznie. Wiecznie.",
    chainTitle: "10 subskrybentów. Co zarabiasz miesięcznie.",
    chainSubtitle:
      "Każdy poziom to połowa wyższego. Zbudowany raz przy rejestracji - płaci wiecznie.",
    whoLabel0: "Ty - ktokolwiek polecił ich bezpośrednio",
    whoLabel1: "Twórca skilla (jeśli inny) lub Twój polecający",
    whoLabel2: "Polecający ich polecającego",
    whoLabel3: "Poziom 4",
    whoLabel4: "Poziom 5",
    whoLabel5: "Poziom 6",
    tableNote:
      "Link polecający: {{directPct}} od użytkownika. Twój skill udostępniony przez innych: {{skillBonusPct}} od użytkownika. Oba cyklicznie, na zawsze.",
  },

  story: {
    title: "Jak łańcuch się mnoży",
    subtitle:
      "Te same 10 subskrybentów. Każdy aktywowany poziom dodaje się do sumy - wiecznie.",
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
      "Link polecający → {{directPct}} na użytkownika, wiecznie. Twój skill udostępniany przez innych → {{skillBonusPct}} na użytkownika. Dwa źródła, zero dodatkowej pracy.",
    step3Title: "Odbierz wypłatę",
    step3Body:
      "Zarobki odblokowują się {{holdDays}} dni po każdej płatności - to okres na zwroty. Potem wydaj je jako kredyty albo wypłać w BTC/USDC od {{minPayout}}.",
  },

  manage: {
    codesSubtitle: "Skopiuj link, udostępnij, zarabiaj.",
  },
  myCodes: {
    title: "Twoje linki",
  },
  cta: {
    title: "Utwórz konto i zacznij zarabiać",
    description:
      "Zdobądź link polecający. Zarabiaj {{directPct}} od każdej płatności - cyklicznie, bez daty ważności. Opublikuj skill i zarabiaj {{skillBonusPct}}, gdy inni go udostępniają.",
    signUp: "Utwórz konto",
    logIn: "Zaloguj się",
    pitch1:
      "{{directPct}} prowizji polecającej - cyklicznie, bez daty ważności",
    pitch2:
      "Opublikuj skill → {{skillBonusPct}} od każdego, kogo inni do niego przyprowadzą",
    pitch3:
      "Odblokowanie {{holdDays}} dni po płatności. BTC/USDC od {{minPayout}}.",
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
    newTitle: "Link polecający - {{directPct}} na użytkownika",
    newBody:
      "Udostępnij kod. Każdy, kto się przez niego zarejestruje i płaci, daje Ci {{directPct}} każdej płatności, co miesiąc, wiecznie. Wrzucasz raz. Zarabiasz zawsze.",
    newCta: "Zdobądź swój link polecający",
    proTitle: "Twórca skilla - {{skillBonusPct}} na użytkownika",
    proBody:
      "Zbuduj skill. Udostępnij link. Każdy, kto wejdzie przez Twój własny link, płaci Ci {{directPct}}, cyklicznie. Dźwignia: gdy ktoś inny udostępni Twój skill swoim linkiem, jako autor i tak dostajesz {{skillBonusPct}}. Platforma śledzi autorstwo skilla - pasywna atrybucja bez dodatkowego wysiłku.",
    proCta: "Zbuduj skill",
  },
  discord: {
    title: "Dołącz do społeczności",
    description:
      "Dziel się strategiami, zadawaj pytania, łącz się z innymi zarabiającymi.",
    cta: "Dołącz do Discorda",
  },
};
