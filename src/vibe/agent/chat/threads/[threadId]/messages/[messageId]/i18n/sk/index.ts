import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    messages: "Správy",
  },
  config: {
    folders: {
      private: "Súkromné čety",
      shared: "Zdieľané čety",
      public: "Verejné čety",
      incognito: "Čety inkognito",
      background: "Čety na pozadí",
      remote: "Vzdialené čety",
    },
  },
  chat: {
    enums: {
      role: {
        user: "Používateľ",
        assistant: "Asistent",
        system: "Systém",
        tool: "Nástroj",
        error: "Chyba",
      },
    },
  },
  get: {
    title: "Načítať správu",
    titleShort: "Správa",
    description: "Načítajte správu podľa ID",
    container: {
      title: "Podrobnosti správy",
      description: "Zobrazte informácie o správe",
    },
    threadId: {
      label: "ID vlákna",
      description: "ID konverzácie, v ktorej je správa",
    },
    messageId: {
      label: "ID správy",
      description: "ID správy, ktorú chcete načítať",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Koreňový priečinok konverzácie na smerovanie v aplikácii",
    },
    response: {
      title: "Načítaná správa",
      description: "Podrobnosti správy",
      message: {
        title: "Správa",
        id: {
          content: "ID správy",
        },
        threadId: {
          content: "ID vlákna",
        },
        role: {
          content: "Rola",
        },
        content: {
          content: "Obsah",
        },
        parentId: {
          content: "ID nadradenej správy",
        },
        authorId: {
          content: "ID autora",
        },
        isAI: {
          content: "Správa od AI",
        },
        model: {
          content: "Model",
        },
        tokens: {
          content: "Tokeny",
        },
        createdAt: {
          content: "Vytvorené",
        },
        updatedAt: {
          content: "Aktualizované",
        },
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Parametre požiadavky sú neplatné",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie správ sa musíte prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť túto správu",
      },
      notFound: {
        title: "Nenájdené",
        description: "Správa sa nenašla",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
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
      threadNotFound: {
        title: "Konverzácia sa nenašla",
        description: "Zadaná konverzácia neexistuje",
      },
      messageNotFound: {
        title: "Správa sa nenašla",
        description: "Zadaná správa neexistuje",
      },
    },
    backButton: {
      label: "Späť",
    },
    success: {
      title: "Hotovo",
      description: "Správa sa načítala",
    },
  },
  patch: {
    title: "Upraviť správu",
    titleShort: "Upraviť správu",
    description: "Upravte obsah správy",
    container: {
      title: "Upraviť správu",
      description: "Upravte obsah správy",
    },
    form: {
      title: "Upraviť správu",
      description: "Upravte obsah správy",
    },
    sections: {
      message: {
        title: "Obsah správy",
        description: "Upravte správu",
      },
    },
    threadId: {
      label: "ID vlákna",
      description: "ID konverzácie, v ktorej je správa",
    },
    messageId: {
      label: "ID správy",
      description: "ID správy, ktorú chcete upraviť",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Koreňový priečinok konverzácie na smerovanie v aplikácii",
    },
    content: {
      label: "Obsah",
      description: "Upravený obsah správy",
      placeholder: "Zadajte obsah správy...",
    },
    role: {
      label: "Rola",
      description: "Rola správy (používateľ, asistent, systém)",
    },
    response: {
      title: "Upravená správa",
      description: "Podrobnosti upravenej správy",
      message: {
        title: "Správa",
        id: {
          content: "ID správy",
        },
        threadId: {
          content: "ID vlákna",
        },
        role: {
          content: "Rola",
        },
        content: {
          content: "Obsah",
        },
        parentId: {
          content: "ID nadradenej správy",
        },
        createdAt: {
          content: "Vytvorené",
        },
        updatedAt: {
          content: "Aktualizované",
        },
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Zadané údaje správy sú neplatné",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na úpravu správ sa musíte prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie upraviť túto správu",
      },
      notFound: {
        title: "Nenájdené",
        description: "Správa sa nenašla",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
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
      threadNotFound: {
        title: "Konverzácia sa nenašla",
        description: "Zadaná konverzácia neexistuje",
      },
      messageNotFound: {
        title: "Správa sa nenašla",
        description: "Zadaná správa neexistuje",
      },
    },
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Uložiť zmeny",
      loadingText: "Ukladá sa…",
    },
    success: {
      title: "Hotovo",
      description: "Správa sa upravila",
    },
  },
  delete: {
    title: "Odstrániť správu",
    titleShort: "Odstrániť správu",
    description: "Odstráňte správu z konverzácie",
    container: {
      title: "Odstrániť správu",
      description: "Odstráňte správu z konverzácie",
    },
    confirmTitle: "Odstrániť správu",
    confirmText:
      "Chcete odstrániť túto správu? Tento krok sa nedá vrátiť späť.",
    backButton: {
      label: "Zrušiť",
    },
    submitButton: {
      label: "Odstrániť",
      loadingText: "Odstraňuje sa…",
    },
    deleteButton: {
      label: "Odstrániť",
      loadingText: "Odstraňuje sa…",
    },
    threadId: {
      label: "ID vlákna",
      description: "ID konverzácie, v ktorej je správa",
    },
    messageId: {
      label: "ID správy",
      description: "ID správy, ktorú chcete odstrániť",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Koreňový priečinok konverzácie na smerovanie v aplikácii",
    },
    response: {
      success: { content: "Hotovo" },
      role: { content: "Rola" },
      content: { content: "Obsah" },
      parentId: { content: "ID nadradenej správy" },
      authorId: { content: "ID autora" },
      isAI: { content: "Správa od AI" },
      model: { content: "Model" },
      createdAt: { content: "Vytvorené" },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Parametre požiadavky sú neplatné",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na odstránenie správ sa musíte prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie odstrániť túto správu",
      },
      notFound: {
        title: "Nenájdené",
        description: "Správa sa nenašla",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Správu nemožno odstrániť, kým na ňu nadväzujú ďalšie správy",
      },
      threadNotFound: {
        title: "Konverzácia sa nenašla",
        description: "Zadaná konverzácia neexistuje",
      },
      messageNotFound: {
        title: "Správa sa nenašla",
        description: "Zadaná správa neexistuje",
      },
    },
    success: {
      title: "Hotovo",
      description: "Správa sa odstránila",
    },
  },
  vote: {
    category: "Čet",
    tags: {
      messages: "Správy",
    },
    post: {
      title: "Hodnotiť správu",
      description: "Pridajte správe kladný alebo záporný hlas",
      container: {
        title: "Hlasovať",
        description: "Hlasujte o tejto správe",
      },
      form: {
        title: "Hodnotiť správu",
        description:
          "Pridajte kladný alebo záporný hlas, prípadne svoj hlas zrušte",
      },
      threadId: {
        label: "ID vlákna",
        description: "ID konverzácie, v ktorej je správa",
      },
      messageId: {
        label: "ID správy",
        description: "ID správy, o ktorej chcete hlasovať",
      },
      rootFolderId: {
        label: "Koreňový priečinok",
        description: "Koreňový priečinok konverzácie na smerovanie v aplikácii",
      },
      vote: {
        label: "Hlasovať",
        description: "Váš hlas: kladný, záporný alebo zrušený",
        placeholder: "Vyberte typ hlasu...",
        options: {
          upvote: "Kladný hlas",
          downvote: "Záporný hlas",
          remove: "Zrušiť hlas",
        },
      },
      response: {
        title: "Výsledok hlasovania",
        description: "Aktuálny počet hlasov",
        upvotes: {
          content: "Kladné hlasy",
        },
        downvotes: {
          content: "Záporné hlasy",
        },
        userVote: {
          content: "Váš hlas",
        },
      },
      errors: {
        validation: {
          title: "Chyba overenia",
          description: "Zadané údaje hlasovania sú neplatné",
        },
        network: {
          title: "Chyba siete",
          description: "Nepodarilo sa pripojiť k serveru",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na hlasovanie o správach sa musíte prihlásiť",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie hlasovať o tejto správe",
          incognitoNotAllowed:
            "Inkognito konverzácie nie sú dostupné na serveri",
        },
        notFound: {
          title: "Nenájdené",
          description: "Správa sa nenašla",
        },
        server: {
          title: "Chyba servera",
          description: "Hlas sa nepodarilo zaznamenať",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Pri hlasovaní došlo ku konfliktu",
        },
      },
      success: {
        title: "Hlas zaznamenaný",
        description: "Váš hlas sa zaznamenal",
      },
    },
  },
};
