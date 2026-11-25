import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "KI-Modelle",
    title:
      "KI-Modell-Changelog: neue, abgelöste und neu bepreiste Modelle | {{appName}}",
    description:
      "Jede Modelländerung auf {{appName}} mit Datum: neue Modelle, abgelöste Modelle samt Nachfolger, Preisänderungen und Stufenwechsel. Direkt aus unserem Modellregister. Mit RSS-Feed.",
    imageAlt: "Modell-Changelog auf {{appName}}",
    keywords:
      "KI-Modell-Changelog, neue KI-Modelle, LLM-Preisänderungen, abgekündigte KI-Modelle, unzensierte Modelle Updates, {{appName}}",
  },
  breadcrumb: {
    models: "KI-Modelle",
    changelog: "Changelog",
  },
  hero: {
    eyebrow: "Aktualisiert am {{date}}",
    title: "Modell-Changelog",
    subtitle:
      "Welche Modelle neu sind, welche abgelöst wurden, was günstiger wurde. Jeder Eintrag mit Datum, direkt aus unserem Modellregister.",
    rss: "RSS-Feed",
    allModels: "Alle Modelle",
  },
  stats: {
    added: "Neue Modelle",
    legacy: "Abgelöst",
    repriced: "Preisänderungen",
    since: "Erfasst seit",
  },
  badge: {
    replaces: "Nachfolger",
    added: "Neu",
    legacy: "Abgelöst",
    restored: "Zurück",
    repriced: "Preis",
    tier: "Stufe",
    removed: "Entfernt",
  },
  title: {
    added: "Neues Modell",
    legacy: "Abgelöst",
    restored: "Wieder im Katalog",
    repriced: "Preisänderung",
    tier: "Stufenwechsel",
    removed: "Entfernt",
  },
  summary: {
    added: "Neu im Katalog, Stufe {{tier}}.",
    legacy: "Abgelöst. Nicht mehr in der Modellauswahl.",
    replacedBy: "Nachfolger:",
    replaces: "Nachfolger von",
    restored: "Wieder im aktiven Katalog.",
    tier: "Wechsel von Stufe {{from}} zu {{to}}.",
    removed: "Nicht mehr im Angebot.",
    priceUp: "{{metric}} plus {{percent}}",
    priceDown: "{{metric}} minus {{percent}}",
  },
  metric: {
    input: "Eingabepreis",
    output: "Ausgabepreis",
    image: "Bildpreis",
    second: "Preis pro Sekunde",
    clip: "Clip-Preis",
    character: "Zeichenpreis",
    fixed: "Nachrichtenpreis",
  },
  list: {
    heading: "Alle Änderungen",
    empty: "Noch keine Änderungen erfasst.",
    count: "{{count}} Änderungen",
  },
  about: {
    heading: "Woher die Daten kommen",
    body: "Jeder Eintrag entsteht aus der Versionsgeschichte unseres Modellregisters, also aus denselben Dateien, die Modellauswahl, Preise und Abrechnung steuern. Niemand pflegt diese Liste von Hand. Das Datum zeigt, wann eine Änderung im Register gelandet ist.",
    prices:
      "Preisänderungen vergleichen die günstigste öffentliche Anbieterroute davor und danach. Eine Bewegung kann vom Anbieter selbst kommen oder davon, dass eine günstigere Route dazukam oder wegfiel.",
    start:
      "Die Erfassung beginnt am {{date}}. Modelle, die damals schon live waren, haben keinen Neu-Eintrag.",
  },
  model: {
    heading: "Was sich geändert hat",
    intro:
      "Datierte Änderungen an {{model}}, direkt aus unserem Modellregister.",
    none: "Keine Änderungen an {{model}} seit Beginn der Erfassung am {{date}}.",
    link: "Kompletter Modell-Changelog",
  },
  index: {
    link: "Modell-Changelog",
    hint: "Neue, abgelöste und neu bepreiste Modelle mit Datum",
  },
  feed: {
    title: "{{appName}} Modell-Changelog",
    description:
      "Neue, abgelöste und neu bepreiste KI-Modelle auf {{appName}}, mit Datum, aus unserem Modellregister.",
  },
};
