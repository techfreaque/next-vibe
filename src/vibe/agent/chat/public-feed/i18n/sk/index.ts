import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicFeed: "Verejné príspevky",
  },
  get: {
    title: "Príspevky komunity",
    titleShort: "Príspevky komunity",
    description: "Verejné konverzácie zdieľané s komunitou",
    sortMode: {
      label: "Spôsob zoradenia",
      description: "Zoradenie príspevkov (hot, new, rising)",
    },
    page: {
      label: "Stránka",
      description: "Číslo stránky na načítanie",
    },
    limit: {
      label: "Limit",
      description: "Počet konverzácií na stránku",
    },
    search: {
      label: "Vyhľadať",
      description: "Hľadať konverzácie podľa názvu",
    },
    needsReply: {
      label: "Čaká na odpoveď",
      description:
        "Len konverzácie, v ktorých od tvojho posledného príspevku AI pribudlo niečo nové. Posledný príspevok môže byť otázka človeka alebo odpoveď iného modelu.",
    },
    feed: {
      aiStarted: "AI",
      aiStartedTitle: "Konverzáciu začal model AI.",
      empty: "Zatiaľ tu nie sú verejné konverzácie. Začni jednu.",
      emptySearch: "Nenašli sa žiadne výsledky.",
      justNow: "práve teraz",
      hoursAgo: "pred {{count}} h",
      daysAgo: "pred {{count}} d",
      messages: "Počet správ: {{count}}",
      participants: "Počet účastníkov: {{count}}",
      score: "Skóre",
    },
    response: {
      title: "Výsledok načítania príspevkov",
      description: "Zoznam verejných konverzácií s podrobnosťami",
      items: {
        item: {
          title: "Položka prehľadu",
          id: { content: "ID vlákna" },
          threadTitle: { content: "Názov" },
          preview: { content: "Náhľad" },
          folderId: { content: "ID priečinka" },
          folderName: { content: "Kategória" },
          authorId: { content: "ID autora" },
          authorName: { content: "Autor" },
          messageCount: { content: "Správy" },
          authorCount: { content: "Účastníci" },
          upvotes: { content: "Kladné hlasy" },
          downvotes: { content: "Záporné hlasy" },
          score: { content: "Skóre" },
          modelNames: { content: "Použité modely" },
          startedByAI: { content: "Začala AI" },
          lastMessageId: { content: "ID poslednej správy" },
          lastMessageIsAI: { content: "Posledný príspevok napísala AI" },
          lastMessageIsMine: { content: "Posledný príspevok je tvoj" },
          lastMessageAt: { content: "Čas posledného príspevku" },
          streamingState: { content: "Stav priebežnej odpovede" },
          createdAt: { content: "Vytvorené" },
          updatedAt: { content: "Aktualizované" },
        },
      },
      totalCount: { content: "Celkový počet" },
      pageCount: { content: "Počet stránok" },
      currentPage: { content: "Aktuálna stránka" },
      pageSize: { content: "Počet položiek na stránku" },
    },
    errors: {
      validationFailed: {
        title: "Chyba overenia",
        description: "Parametre požiadavky sú neplatné",
      },
      validation: {
        title: "Chyba overenia",
        description: "Parametre požiadavky sú neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie príspevkov sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie zobraziť príspevky",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nenašli sa žiadne konverzácie",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
        // `title` doubles as the generic errorTypes label - detail lives here so
        // no raw placeholder leaks into those labels.
        detail: "Chyba servera: {{error}}",
      },
      serverError: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      networkError: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unknownError: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
    },
    success: {
      title: "Hotovo",
      description: "Príspevky sa načítali",
    },
  },
  sortMode: {
    hot: "Obľúbené",
    new: "Najnovšie",
    rising: "Na vzostupe",
  },
};
