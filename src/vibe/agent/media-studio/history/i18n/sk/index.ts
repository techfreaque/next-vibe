import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    studio: "Media Studio",
    history: "História",
  },
  get: {
    title: "Tvoja tvorba",
    titleShort: "Tvorba",
    description:
      "Obrázky, videá, skladby, hlasové nahrávky a prepisy zo štúdia, chatu aj API. Najnovšie nájdeš navrchu.",
    fields: {
      kind: {
        label: "Typ",
        description:
          "Povolené hodnoty: image, video, music, speech alebo transcribe. Prázdne pole zobrazí všetky typy.",
      },
    },
    response: {
      items: "Vytvorené médiá",
      id: "ID",
      kind: "Typ",
      title: "Zadanie",
      createdAt: "Vytvorené",
      status: "Stav",
      url: "Súbor",
      transcript: "Prepis",
      credits: "Kredity",
      model: "Model",
      settings: "Nastavenia",
      source: "Vytvorené v",
      threadId: "Vlákno",
      rootFolderId: "Priečinok",
    },
    success: {
      title: "História sa načítala",
      description: "Prehľad tvojej tvorby je pripravený.",
    },
    errors: {
      validation: {
        title: "Neplatný filter",
        description: "Skontroluj typ aj číslo stránky a skús to znova.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihlás sa a zobraz si svoju tvorbu.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Môžeš si prezerať iba vlastnú tvorbu.",
      },
      notFound: {
        title: "Žiadne výsledky",
        description: "Filtru nezodpovedá žiadna položka.",
      },
      server: {
        title: "História je nedostupná",
        description: "Históriu sa nepodarilo načítať. Skús to o chvíľu.",
      },
      network: {
        title: "Pripojenie sa prerušilo",
        description: "Skontroluj pripojenie a skús to znova.",
      },
      unknown: {
        title: "Niečo sa pokazilo.",
        description: "Históriu sa nepodarilo načítať. Skús to znova.",
      },
      conflict: {
        title: "História sa zmenila",
        description: "Najnovšie výsledky uvidíš po obnovení stránky.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv zmeny ulož alebo zahoď.",
      },
    },
  },
  widget: {
    title: "Tvoja tvorba",
    titles: {
      image: "Tvoje obrázky",
      video: "Tvoje videá",
      music: "Tvoje skladby",
      speech: "Tvoje hlasové nahrávky",
      transcribe: "Tvoje prepisy",
    },
    count: "Celkový počet: {{count}}",
    error: "Históriu sa nepodarilo načítať.",
    retry: "Skúsiť znova",
    emptyTitle: "Zatiaľ tu nič nie je",
    emptyHint: "Tu nájdeš všetko, čo vytvoríš, a môžeš si to stiahnuť.",
    emptyKindHint: "Prvý výsledok sa tu zobrazí po dokončení.",
    runAgain: "Vytvoriť znova",
    download: "Stiahnuť",
    copyPrompt: "Kopírovať zadanie",
    copied: "Skopírované",
    copyFailed: "Kopírovanie je zablokované",
    openInChat: "Otvoriť v chate",
    continueInChat: "Pokračovať v chate",
    chatPrompt: "Tu je výsledok: {{url}}\n\nZadanie: {{prompt}}",
    open: "Otvoriť v plnej veľkosti",
    credits: "Kredity: {{amount}}",
    source: {
      studio: "cez štúdio",
      chat: "cez chat",
      api: "cez API",
    },
    status: {
      queued: "Čaká v rade",
      running: "Vytvára sa",
      saving: "Súbor sa ukladá",
      completed: "Hotovo",
      failed: "Zlyhalo",
    },
    pendingHint: "Tvorba videa alebo hudby môže trvať niekoľko minút.",
    kinds: {
      image: "Obrázok",
      video: "Video",
      music: "Hudba",
      speech: "Reč",
      transcribe: "Prepis",
    },
  },
};
