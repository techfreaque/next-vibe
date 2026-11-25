import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kontakty",
  tag: "Prepájanie podľa IP adresy",
  task: {
    description:
      "Vyhľadá anonymné kontakty s rovnakou IP adresou a prepojí ich ako jednu osobu",
  },
  post: {
    title: "Prepojiť podľa IP adresy",
    titleShort: "Prepojiť podľa IP",
    description: "Prepojiť anonymné kontakty s rovnakou IP adresou",
    container: {
      title: "Prepájanie podľa IP adresy",
      description:
        "Vyhľadá kontakty s rovnakou IP adresou, ktoré vznikli v zadanom časovom rozmedzí, a prepojí ich",
    },
    fields: {
      dryRun: {
        label: "Skúšobný režim",
        description: "Spustí kontrolu bez vykonania zmien",
      },
      windowDays: {
        label: "Časové rozmedzie (dni)",
        description:
          "Zahrnie iba kontakty, medzi ktorých vytvorením neuplynulo viac než toľko dní",
      },
    },
    response: {
      pairsFound: "Nájdené dvojice",
      pairsLinked: "Prepojené dvojice",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      server: {
        title: "Chyba servera",
        description: "Pri prepájaní podľa IP adresy nastala chyba",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre požiadavky",
      },
    },
    success: {
      title: "Prepájanie podľa IP adresy je dokončené",
      description: "Kontakty s rovnakou IP adresou sa prepojili",
    },
  },
};
