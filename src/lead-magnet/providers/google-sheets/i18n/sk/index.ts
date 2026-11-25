import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Google Sheets",
  titleShort: "Google Sheets",
  description:
    "Každý nový kontakt automaticky pribudne do tabuľky Google ako riadok. Pripoj účet Google. Kľúče API nepotrebuješ.",
  connect: {
    label: "Pripojiť účet Google",
    description: "Prihlás sa cez Google a povoľ prístup k svojim tabuľkám",
  },
  connected: {
    label: "Pripojené",
    description: "Tvoj účet Google je pripojený",
  },
  spreadsheetId: {
    label: "Tabuľka",
    description: "Vyber tabuľku na pridávanie kontaktov",
    placeholder: "Vyber tabuľku…",
  },
  sheetTab: {
    label: "Hárok (voliteľné)",
    description:
      "Názov hárka v tabuľke. Ak pole necháš prázdne, použije sa prvý hárok.",
    placeholder: "napríklad Kontakty",
  },
  saveTag: "lead-magnet-google-sheets",
  saveTitle: "Uložiť nastavenia Google Sheets",
  saveDescription: "Pripoj tabuľku Google na zber kontaktov",
  saveSuccess: {
    title: "Pripojené",
    description: "Nové kontakty sa v tabuľke zobrazia ako riadky.",
  },
  oauthStart: {
    title: "Pripojiť Google Sheets",
    description: "Spustí overenie Google OAuth a vyžiada si prístup k tabuľkám",
  },
  oauthCallback: {
    title: "Návrat z Google Sheets OAuth",
    description: "Po presmerovaní z Googlu vymení kód OAuth",
  },
  sheetsList: {
    title: "Zobraziť zoznam tabuliek",
    titleShort: "Tabuľky",
    description: "Vráti zoznam tabuliek dostupných cez pripojený účet Google",
  },
  errors: {
    validation: {
      title: "Chyba overenia údajov",
      description: "Skontroluj zadané údaje",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihlás sa a pokračuj",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup zamietnutý",
    },
    notFound: { title: "Nenašlo sa", description: "Zdroj sa nenašiel" },
    conflict: { title: "Konflikt", description: "Nastal konflikt" },
    network: {
      title: "Chyba siete",
      description: "Vyskytla sa chyba siete",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máš neuložené zmeny",
    },
    internal: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    oauthFailed: "Overenie cez Google zlyhalo. Skús znova.",
    noRefreshToken:
      "Google nevrátil obnovovací token. Odpoj účet a pripoj ho znova.",
    sheetsApiFailed:
      "Tabuľky sa nepodarilo načítať. Skontroluj pripojenie účtu Google.",
    appendFailed:
      "Do tabuľky Google sa nepodarilo zapísať. Platnosť tokenu mohla uplynúť.",
  },
  response: {
    provider: "Poskytovateľ",
    isActive: "Aktívne",
    spreadsheetId: "ID tabuľky",
    sheetTab: "Hárok",
    sheets: "Tabuľky",
    connected: "Pripojené",
  },
  widget: {
    connectTitle: "Pripojiť Google Sheets",
    connectDescription:
      "Prihlás sa cez Google a každý nový kontakt automaticky pribudne do tabuľky ako nový riadok.",
    redirectNote: "Na Googli povolíš prístup k tabuľke.",
    reconnect: "Pripojiť znova",
    loading: "Načítavajú sa tabuľky…",
    noSheets: "Nenašli sa žiadne tabuľky",
    refresh: "Obnoviť zoznam",
    selectRequired: "Vyber tabuľku",
    saveFailed: "Uloženie zlyhalo. Skús znova.",
    saving: "Ukladá sa…",
  },
};
