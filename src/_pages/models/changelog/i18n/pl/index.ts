import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Modele AI",
    title: "Changelog modeli AI: nowe, wycofane i z nową ceną | {{appName}}",
    description:
      "Każda zmiana modeli na {{appName}} z datą: nowe modele, wycofane modele i ich następcy, zmiany cen i poziomów. Prosto z naszego rejestru modeli. Z kanałem RSS.",
    imageAlt: "Changelog modeli na {{appName}}",
    keywords:
      "changelog modeli AI, nowe modele AI, zmiany cen LLM, wycofane modele AI, aktualizacje modeli bez cenzury, {{appName}}",
  },
  breadcrumb: {
    models: "Modele AI",
    changelog: "Changelog",
  },
  hero: {
    eyebrow: "Aktualizacja: {{date}}",
    title: "Changelog modeli",
    subtitle:
      "Które modele doszły, które poszły do archiwum, co stało się tańsze. Każdy wpis ma datę i pochodzi prosto z naszego rejestru modeli.",
    rss: "Kanał RSS",
    allModels: "Wszystkie modele",
  },
  stats: {
    added: "Nowe modele",
    legacy: "Wycofane",
    repriced: "Zmiany cen",
    since: "Śledzone od",
  },
  badge: {
    replaces: "Następca",
    added: "Nowy",
    legacy: "Wycofany",
    restored: "Powrót",
    repriced: "Cena",
    tier: "Poziom",
    removed: "Usunięty",
  },
  title: {
    added: "Nowy model",
    legacy: "Wycofany",
    restored: "Znów w katalogu",
    repriced: "Zmiana ceny",
    tier: "Zmiana poziomu",
    removed: "Usunięty",
  },
  summary: {
    added: "Nowy model na poziomie {{tier}}.",
    legacy: "Wycofany. Nie ma go już w wyborze modeli.",
    replacedBy: "Następca:",
    replaces: "Następca modelu",
    restored: "Znów w aktywnym katalogu.",
    tier: "Zmiana z poziomu {{from}} na {{to}}.",
    removed: "Nie jest już oferowany.",
    priceUp: "{{metric}} w górę o {{percent}}",
    priceDown: "{{metric}} w dół o {{percent}}",
  },
  metric: {
    input: "Cena wejścia",
    output: "Cena wyjścia",
    image: "Cena obrazu",
    second: "Cena za sekundę",
    clip: "Cena klipu",
    character: "Cena za znak",
    fixed: "Cena wiadomości",
  },
  list: {
    heading: "Wszystkie zmiany",
    empty: "Brak zapisanych zmian.",
    count: "Zmiany: {{count}}",
  },
  about: {
    heading: "Skąd te dane",
    body: "Każdy wpis powstaje z historii wersji naszego rejestru modeli, czyli tych samych plików, które sterują wyborem modeli, cenami i rozliczeniami. Nikt nie wpisuje tej listy ręcznie. Data oznacza dzień, w którym zmiana trafiła do rejestru.",
    prices:
      "Zmiany cen porównują najtańszą publiczną trasę dostawcy przed i po. Ruch może wynikać ze zmiany ceny u dostawcy albo z dodania lub usunięcia tańszej trasy.",
    start:
      "Śledzenie zaczyna się {{date}}. Modele, które działały już wtedy, nie mają wpisu Nowy.",
  },
  model: {
    heading: "Co się zmieniło",
    intro: "Zmiany w {{model}} z datami, prosto z naszego rejestru modeli.",
    none: "Brak zmian w {{model}} od początku śledzenia ({{date}}).",
    link: "Pełny changelog modeli",
  },
  index: {
    link: "Changelog modeli",
    hint: "Nowe modele, wycofane modele i zmiany cen, z datami",
  },
  feed: {
    title: "Changelog modeli {{appName}}",
    description:
      "Nowe i wycofane modele AI oraz zmiany cen na {{appName}}, z datami, z naszego rejestru modeli.",
  },
};
