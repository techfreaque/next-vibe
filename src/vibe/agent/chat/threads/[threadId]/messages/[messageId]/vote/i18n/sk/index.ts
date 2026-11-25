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
  post: {
    title: "Hodnotiť správu",
    titleShort: "Hodnotiť správu",
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
        incognitoNotAllowed: "Inkognito konverzácie nie sú dostupné na serveri",
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
};
