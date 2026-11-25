import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Ladenie systémového zadania",
    titleShort: "Ladiť systémové zadanie",
    description:
      "Zobrazí presné systémové zadanie, ktoré AI dostane pre daný priečinok, zručnosť, vlákno a správu.",
    status: {
      loading: "Pripravuje sa…",
      done: "Hotovo",
    },
    tags: {
      debug: "Ladenie",
    },
    fields: {
      rootFolderId: {
        label: "Koreňový priečinok",
        description:
          "Simulovaný kontext priečinka (private, public, incognito, cron, shared, remote)",
        placeholder: "private",
        options: {
          private: "Súkromné",
          shared: "Zdieľané",
          public: "Verejné",
          incognito: "Inkognito",
          background: "Na pozadí",
          remote: "Vzdialené",
        },
      },
      userRole: {
        label: "Rola používateľa",
        description:
          "Simulovaná rola používateľa. Povolené hodnoty sú public, customer a admin.",
        placeholder: "admin",
      },
      userMessage: {
        label: "Správa používateľa",
        description:
          "Simulovaná správa používateľa na vektorové vyhľadávanie v Cortexe",
        placeholder: "O čom sme naposledy diskutovali?",
      },
      threadId: {
        label: "ID vlákna",
        description: "Voliteľné ID vlákna, ktoré poskytne kontext",
        placeholder: "Zadaj UUID alebo pole nechaj prázdne",
      },
      userId: {
        label: "ID používateľa",
        description:
          "Nepovinné ID používateľa, ktorého údaje z Cortexu sa majú načítať. Predvolene sa použije aktuálny používateľ.",
        placeholder: "Zadaj UUID alebo pole nechaj prázdne",
      },
      skillId: {
        label: "ID zručnosti",
        description:
          "Nepovinné ID zručnosti, ktorá sa pridá do systémového zadania",
        placeholder: "Zadaj UUID zručnosti alebo pole nechaj prázdne",
      },
      subFolderId: {
        label: "ID podpriečinka",
        description: "Nepovinné UUID podpriečinka",
        placeholder: "Zadaj UUID alebo pole nechaj prázdne",
      },
      imageGenModelSelection: {
        label: "Model na generovanie obrázkov",
        description:
          "Model na generovanie obrázkov z aktívnej obľúbenej položky alebo četu. Ak pole nevyplníš, použije sa tvoj predvolený model.",
        placeholder: "Ponechaj prázdne pre svoj predvolený model",
      },
      musicGenModelSelection: {
        label: "Model na generovanie hudby",
        description:
          "Model na generovanie hudby z aktívnej obľúbenej položky alebo četu. Ak pole nevyplníš, použije sa tvoj predvolený model.",
        placeholder: "Ponechaj prázdne pre svoj predvolený model",
      },
      videoGenModelSelection: {
        label: "Model na generovanie videa",
        description:
          "Model na generovanie videa z aktívnej obľúbenej položky alebo četu. Ak pole nevyplníš, použije sa tvoj predvolený model.",
        placeholder: "Ponechaj prázdne pre svoj predvolený model",
      },
    },
    response: {
      systemPrompt: { text: "Systémové zadanie" },
      trailingSystemMessage: { text: "Doplnený kontext" },
      charCount: { text: "Zručnosti" },
      tokenEstimate: { text: "Približný počet tokenov" },
      cortexDiagnostics: { text: "Diagnostika vektorov v Cortexe" },
      messageContextLines: { text: "Riadky kontextu správy" },
    },
    errors: {
      validation: {
        title: "Neplatný vstup",
        description: "Skontroluj parametre",
      },
      network: { title: "Offline", description: "So serverom sa nedá spojiť" },
      unauthorized: {
        title: "Neprihlásený používateľ",
        description: "Najprv sa prihlás",
      },
      forbidden: {
        title: "Iba pre správcu",
        description: "Vyžaduje sa oprávnenie správcu",
      },
      notFound: {
        title: "Nenájdené",
        description: "Používateľ alebo zdroj sa nenašiel",
      },
      threadNotFound: {
        title: "Vlákno sa nenašlo alebo k nemu nemáš prístup",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa zostaviť systémové zadanie",
      },
      unknown: { title: "Chyba", description: "Niečo sa pokazilo." },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož alebo zahoď zmeny.",
      },
      conflict: { title: "Konflikt", description: "Protichodný štát" },
    },
    widget: {
      emptyTitle: "Vybrať kontext",
      emptyMessage:
        "Vyber priečinok a prípadne správu. Potom zostav systémové zadanie.",
      chars: "Znaky",
      tokens: "Približný počet tokenov",
      cortexFailed:
        "Vytvorenie vektora v Cortexe zlyhalo. Chýba kľúč API alebo nastala chyba poskytovateľa.",
      cortexNoNodes:
        "Vektor sa vytvoril. Žiadny uzol v Cortexe zatiaľ nemá uložený vektor.",
      cortexPassing: "Počet zhôd nad prahom: {{passing}} z {{total}}",
      noTrailing: "Pre túto požiadavku nie je k dispozícii doplnený kontext.",
    },
    success: {
      title: "Systémové zadanie pripravené",
      description: "Systémové zadanie sa zostavilo",
    },
  },
};
