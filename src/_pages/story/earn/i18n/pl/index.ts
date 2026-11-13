import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Zarabiaj z {{appName}} - cykliczna prowizja z poleceń",
    category: "Zarabiaj",
    description:
      "Polecaj {{appName}} i dostawaj {{directPct}} każdej płatności osób, które przyprowadzisz - co miesiąc, dopóki płacą. Opublikuj skill i dostawaj {{skillBonusPct}} od osób, które inni do niego przyprowadzą.",
    imageAlt: "Zarabiaj z {{appName}}",
    keywords:
      "{{appName}}, program poleceń, afiliacja, prowizja cykliczna, skille AI, dochód pasywny",
  },
  hero: {
    eyebrow: "Zarabiaj",
    title: "Polecaj to, czego używasz. Zarabiaj co miesiąc.",
    subtitle:
      "{{directPct}} każdej płatności osób, które przyprowadzisz - nie raz, tylko co miesiąc, dopóki płacą. Opublikujesz skill - masz {{skillBonusPct}} za każdym razem, gdy ktoś inny go udostępni.",
    ctaPrimary: "Odbierz swój link",
    ctaSecondary: "Zbuduj skill",
  },
  start: {
    label: "Od zera",
    title: "Trzy kroki. Bez zasięgów.",
    intro:
      "Nie musisz być influencerem. Jeden znajomy, który zostanie, płaci Ci co miesiąc, dopóki jest z nami.",
    step1: {
      title: "Odbierz link",
      body: "Załóż darmowe konto i otwórz stronę poleceń. Twój osobisty link jest gotowy w kilka sekund.",
    },
    step2: {
      title: "Udostępnij go - albo skill",
      body: "Wrzuć link na czat, do README, pod film. Albo opublikuj skill: jego link do udostępniania automatycznie niesie Twoje polecenie.",
    },
    step3: {
      title: "Zarabiaj na każdej płatności",
      body: "{{directPct}} od wszystkiego, co zapłacą, cyklicznie. Gdy inny członek przyprowadzi kogoś przez Twój skill, dostajesz {{skillBonusPct}} od tej osoby.",
    },
  },
  split: {
    label: "Podział",
    title: "Gdzie trafia każda płatność",
    perUser: "Na osobę przy {{examplePrice}}/mies.",
  },
  facts: {
    direct: "za polecenie, cyklicznie",
    skill: "jako twórca skilla, gdy inni go udostępniają",
    payout: "minimalna wypłata w krypto",
    hours: "realizacja wypłaty w krypto",
    hoursValue: "{{cryptoPayoutHours}} godz.",
  },
  cta: {
    title: "Twój link jest o jedno kliknięcie.",
    subtitle:
      "Darmowe konto. Bez minimalnych wydatków. Po {{holdDays}}-dniowym okresie zwrotu zarobki stają się kredytami. Wypłata w BTC lub USDC od {{minPayout}}.",
    primary: "Odbierz swój link",
    secondary: "Przeczytaj poradnik dla początkujących",
    partners: "Dla twórców i newsletterów",
  },
};
