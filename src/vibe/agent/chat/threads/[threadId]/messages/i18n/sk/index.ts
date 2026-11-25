import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
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
  tags: {
    messages: "Správy",
  },
  loadingOlderMessages: "Načítavajú sa staršie správy...",
  loadingNewerMessages: "Načítavajú sa novšie správy...",
  scrollUpForOlderMessages: "Posunom nahor zobrazíš staršie správy",
  showOlderMessages: "Zobraziť staršie správy",
  showNewerMessages: "Zobraziť novšie správy",
  transcribing: "Prepisuje sa zvuk...",
  uploadingAttachments: "Nahrávajú sa súbory...",
  gapFill: {
    transcribingAudio: "Prepisuje sa zvuk…",
    analyzingImage: "Analyzuje sa obrázok…",
    describingVideo: "Vytvára sa opis videa…",
    processingMedia: "Spracúvajú sa médiá…",
    variantUsing: "cez {{model}}",
    variantCost: "Kredity: {{cost}}",
    transcription: "Prepis",
    imageDescription: "Opis obrázka",
    videoDescription: "Opis videa",
    showTranscription: "Zobraziť prepis",
    hideTranscription: "Skryť prepis",
    showImageDescription: "Zobraziť opis obrázka",
    hideImageDescription: "Skryť opis obrázka",
    showVideoDescription: "Zobraziť opis videa",
    hideVideoDescription: "Skryť opis videa",
  },
  errorCode: "Kód chyby",
  errorActions: {
    retry: "Skúsiť znova",
    tryAnotherModel: "Skús iný model",
    continue: "Pokračovať",
    /** Sent as the user message when Continue is pressed */
    continuePrompt: "Pokračovať",
  },
  streamInterrupted: {
    label: "Generovanie sa zastavilo",
    hint: "Čiastočná odpoveď sa uložila. Ak chceš pokračovať, odošli novú správu.",
  },
  errorFeedback: {
    autoReported: "Chyba bola nahlásená automaticky",
    helpFix: "Pomôž nám chybu odstrániť",
    autoContext: "[Automaticky vytvorené hlásenie chyby]",
    errorLabel: "Chyba",
    causeLabel: "Príčina",
    userContextLabel: "Doplň súvislosti (nepovinné)",
    separator: "·",
  },
  compacting: {
    title: "História bola zhrnutá",
    loading: "Skracuje sa história...",
    summarizing: "Vytvára sa súhrn konverzácie...",
    failed: "Históriu sa nepodarilo zhrnúť",
  },
  get: {
    title: "Zoznam správ v konverzácii",
    titleShort: "Správy",
    description: "Načítaj všetky správy v konverzácii",
    container: {
      title: "Správy",
      description: "Zoznam správ v konverzácii",
    },
    threadId: {
      label: "ID vlákna",
      description: "ID konverzácie, z ktorej sa majú načítať správy",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Koreňový priečinok konverzácie na smerovanie v aplikácii",
    },
    leafMessageId: {
      label: "ID koncovej správy",
      description: "ID poslednej správy v aktuálnej vetve",
    },
    response: {
      title: "Načítané správy",
      description: "Zoznam správ v konverzácii",
      messages: {
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
          skill: {
            content: "Zručnosť",
          },
          tokens: {
            content: "Tokeny",
          },
          sequenceId: {
            content: "ID postupnosti",
          },

          toolCalls: {
            content: "Volania nástrojov",
          },
          createdAt: {
            content: "Vytvorené",
          },
          updatedAt: {
            content: "Aktualizované",
          },
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
        description: "Nemáš oprávnenie zobraziť tieto správy",
        incognitoNotAllowed: "Inkognito konverzácie nie sú dostupné na serveri",
      },
      notFound: {
        title: "Nenájdené",
        description: "Vlákno sa nenašlo",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
        detail: "Chyba servera: {{error}}",
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
    },
    success: {
      title: "Hotovo",
      description: "Správy sa načítali",
    },
  },
  post: {
    title: "Vytvoriť správu",
    titleShort: "Vytvoriť správu",
    description: "Vytvor novú správu v konverzácii",
    form: {
      title: "Nová správa",
      description: "Vytvor správu v konverzácii",
    },
    sections: {
      message: {
        title: "Podrobnosti správy",
        description: "Obsah a nastavenia správy",
      },
    },
    threadId: {
      label: "ID vlákna",
      description: "ID konverzácie, do ktorej sa správa pridá",
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Koreňový priečinok konverzácie na smerovanie v aplikácii",
    },
    id: {
      label: "ID správy",
      description: "ID správy vytvorené klientom",
    },
    content: {
      label: "Obsah",
      description: "Obsah správy",
      placeholder: "Zadajte obsah správy...",
    },
    role: {
      label: "Rola",
      description: "Rola správy (používateľ, asistent, systém)",
    },
    parentId: {
      label: "Nadradená správa",
      description: "ID nadradenej správy na vytvorenie vetvy",
    },
    model: {
      label: "Model",
      description: "Model AI, ktorý má odpovedať",
    },
    skill: {
      label: "Zručnosť",
      description: "Zručnosť alebo rola AI pre túto správu",
    },
    metadata: {
      label: "Metadáta",
      description: "Metadáta správy (prílohy, tokeny atď.)",
    },
    response: {
      title: "Vytvorená správa",
      description: "Podrobnosti novej správy",
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
        parentNotFound: "Nadradená správa sa nenašla",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na vytváranie správ sa musíš prihlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie vytvárať správy",
        incognitoNotAllowed: "Inkognito konverzácie nie sú dostupné na serveri",
      },
      notFound: {
        title: "Nenájdené",
        description: "Vlákno sa nenašlo",
      },
      server: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba servera",
        detail: "Chyba servera: {{error}}",
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
      createFailed: {
        title: "Správu sa nepodarilo vytvoriť",
        description: "Pri vytváraní správy došlo k chybe",
      },
    },
    success: {
      title: "Hotovo",
      description: "Správa sa vytvorila",
    },
  },
  enums: {
    role: {
      user: "Používateľ",
      assistant: "Asistent",
    },
  },
  debugView: {
    systemPromptTitle: "Systémový prompt",
    copied: "Skopírované",
    systemMessageHint: "Systémová správa (používatelia ju nevidia)",
    systemPromptLabel: "systémové pokyny · na začiatku · z vyrovnávacej pamäte",
    upcomingContextLabel:
      "kontext pre ďalšiu odpoveď asistenta · posledná správa",
  },
  widget: {
    common: {
      send: "Odoslať",
      sending: "Odosiela sa…",
      cancel: "Zrušiť",
      close: "Zavrieť",
      copyButton: {
        copied: "Skopírované",
        copyToClipboard: "Kopírovať do schránky",
        copyAsMarkdown: "Kopírovať ako Markdown",
        copyAsText: "Kopírovať ako obyčajný text",
      },
      viewModeToggle: {
        linearView: "Lineárne zobrazenie",
        threadedView: "Zobrazenie podľa vlákien",
        flatView: "Zobrazenie bez vetvenia",
        debugView: "Zobrazenie na ladenie",
      },
      userMessageActions: {
        branch: "Vetva",
        retry: "Skúsiť znova",
        deleteMessage: "Odstrániť správu",
        cancelLoading: "Zrušiť načítavanie",
        stopAudio: "Zastaviť zvuk",
        playAudio: "Prehrať zvuk ({{cost}} kred.)",
      },
      assistantMessageActions: {
        answerAsAI: "Odpovedať ako AI",
        cancelLoading: "Zrušiť načítavanie",
        stopAudio: "Zastaviť zvuk",
        playAudio: "Prehrať zvuk ({{cost}} kred.)",
        actualCostUsed: "Skutočná cena",
        credits: "Kredity",
        tokens: "Tokeny",
        tokensUsed: "Použité tokeny",
        inputTokens: "Vstup",
        outputTokens: "Výstup",
        cachedTokens: "Z vyrovnávacej pamäte",
        cachedPercent: "{{percent}} % z vyrovnávacej pamäte",
        cachedPercentTitle:
          "Z vyrovnávacej pamäte sa použilo {{percent}} % vstupných tokenov, čo znížilo cenu.",
        cached: "z vyrovnávacej pamäte",
        pipeline: "Priebeh",
        timeToFirstToken: "{{seconds}} s do prvého tokenu",
        timeToFirstTokenTitle: "Čas do prvého tokenu",
        streamingTime: "{{seconds}} s priebežného generovania",
        streamingTimeTitle: "Celkový čas priebežného generovania",
        cacheWriteTokens: "Zápis do vyrovnávacej pamäte",
        cacheWrite:
          "Počet tokenov zapísaných do vyrovnávacej pamäte: {{tokens}}",
        cacheWriteTitle:
          "Počet tokenov zapísaných do vyrovnávacej pamäte pri tejto požiadavke: {{tokens}}. Účtujú sa sadzbou za zápis do vyrovnávacej pamäte.",
        deleteMessage: "Odstrániť správu",
        upvote: "Kladný hlas",
        downvote: "Záporný hlas",
      },
      generatedMediaActions: {
        copy: "Kopírovať",
        copied: "Skopírované",
        download: "Stiahnuť",
        showPrompt: "Zobraziť pokyny",
        hidePrompt: "Skryť pokyny",
      },
    },
    messages: {
      assistant: "Asistent",
      anonymous: "Anonym",
      you: "Ty",
      edited: "upravené",
      branch: {
        previous: "Predchádzajúca vetva",
        next: "Ďalšia vetva",
      },
      authorWithId: "{{name}} ({{id}})",
      aiBadge: "AI",
      aiBadgeTitle: "Správu napísal model AI.",
    },
    linearView: {
      answerModal: {
        title: "Odpovedať ako AI",
        description: "Vygenerovať odpoveď AI na túto správu",
        inputPlaceholder: "Doplň súvislosti pre AI...",
        confirmLabel: "Vygenerovať",
      },
      retryModal: {
        title: "Skúsiť iný model",
        description: "Vygenerovať odpoveď znova s iným modelom",
        confirmLabel: "Skúsiť znova",
      },
    },
    threadedView: {
      replyModal: {
        title: "Odpovedať",
        description: "Odošli odpoveď na tento príspevok",
        inputPlaceholder: "Napíš odpoveď...",
        confirmLabel: "Odpovedať",
      },
      actions: {
        reply: "Odpovedať",
        replyToMessage: "Odpovedať na túto správu",
        branch: "Vetva",
        branchMessage: "Upraviť a vytvoriť vetvu",
        retry: "Skúsiť znova",
        retryWithDifferent: "Skúsiť iný model",
        answerAsAI: "Odpovedať ako AI",
        generateAIResponse: "Vygenerovať odpoveď AI",
        cancelLoading: "Zrušiť načítavanie",
        stop: "Zastaviť",
        stopAudio: "Zastaviť zvuk",
        playAudio: "Prehrať zvuk ({{cost}} kred.)",
        delete: "Odstrániť",
        deleteMessage: "Odstrániť správu",
        share: "Zdieľať",
        copyPermalink: "Kopírovať trvalý odkaz",
        upvote: "Kladný hlas",
        downvote: "Záporný hlas",
        play: "Prehrať",
        cancel: "Zrušiť",
        parent: "Prejsť na nadradenú správu",
      },
      answerModal: {
        title: "Odpovedať ako AI",
        description: "Vygenerovať odpoveď AI na túto správu",
        inputPlaceholder: "Doplň súvislosti pre AI...",
        confirmLabel: "Vygenerovať",
      },
      retryModal: {
        title: "Skúsiť iný model",
        description: "Vygenerovať odpoveď znova s iným modelom",
        confirmLabel: "Skúsiť znova",
      },
      anonymous: "Anonym",
      assistantFallback: "Asistent",
      userFallback: "Používateľ",
      youLabel: "Ty",
      authorWithId: "{{name}} ({{id}})",
      reply: "odpoveď",
      replies: "odp.",
      expandReplies: "Rozbaliť odpovede",
      collapseReplies: "Zbaliť odpovede",
      continueThread: "Pokračovať vo vlákne ({{count}} {{replyText}})",
    },
    flatView: {
      replyModal: {
        title: "Odpovedať",
        description: "Odošli odpoveď na tento príspevok",
        inputPlaceholder: "Napíš odpoveď...",
        confirmLabel: "Odpovedať",
      },
      actions: {
        reply: "Odpovedať",
        replyToMessage: "Odpovedať na túto správu",
        branch: "Vetva",
        branchMessage: "Upraviť a vytvoriť vetvu",
        retry: "Skúsiť znova",
        retryWithDifferent: "Skúsiť iný model",
        answerAsAI: "Odpovedať ako AI",
        generateAIResponse: "Vygenerovať odpoveď AI",
        delete: "Odstrániť",
        deleteMessage: "Odstrániť správu",
        copyReference: "Kopírovať odkaz na správu",
        upvote: "Kladný hlas",
        downvote: "Záporný hlas",
      },
      answerModal: {
        title: "Odpovedať ako AI",
        description: "Vygenerovať odpoveď AI na túto správu",
        inputPlaceholder: "Doplň súvislosti pre AI...",
        confirmLabel: "Vygenerovať",
      },
      retryModal: {
        title: "Skúsiť iný model",
        description: "Vygenerovať odpoveď znova s iným modelom",
        confirmLabel: "Skúsiť znova",
      },
      anonymous: "Anonym",
      assistantFallback: "Asistent",
      youLabel: "Ty",
      replyingTo: "Odpoveď na",
      replies: "Odpovede:",
      clickToCopyRef: "Kliknutím skopíruješ odkaz",
      postsById: "Počet príspevkov s týmto ID: {{count}}",
      idLabel: "ID: {{id}}",
    },
    debugView: {
      systemMessageHint: "Systémová správa (používatelia ju nevidia)",
    },
    userProfile: {
      recentPosts: "Nedávne príspevky",
      noPostsYet: "Zatiaľ žiadne príspevky",
      postCount: "Počet príspevkov: {{count}}",
    },
    screenshot: {
      capture: "Zachytiť snímku obrazovky",
      capturing: "Zachytáva sa…",
    },
    shareDialog: {
      title: "Zdieľať vlákno",
    },
    messageEditor: {
      titles: {
        branch: "Upraviť a vytvoriť vetvu",
        reply: "Odpovedať",
        cancel: "Zrušiť",
      },
      hint: {
        branch: "Úpravou vznikne nová vetva",
        reply: "Napíš odpoveď",
      },
    },
    input: {
      keyboardShortcuts: {
        press: "Stlač",
        enter: "Enter",
        shiftEnter: "Shift+Enter",
        forNewLine: "na nový riadok",
      },
    },
    voiceMode: {
      callMode: "Režim hovoru",
      callModeDescription: "AI odpovie hlasom",
      tapToRecord: "Ťuknutím spustíš nahrávanie",
    },
    batchToolConfirmation: {
      title: "Potvrdiť dávku volaní nástrojov",
    },
    queue: {
      badge: "Vo fronte",
      cancelTooltip: "Odobrať z frontu a vrátiť do poľa správy",
    },
  },
  flatView: {
    timestamp: {
      sun: "Ne",
      mon: "Po",
      tue: "Ut",
      wed: "St",
      thu: "Št",
      fri: "Pi",
      sat: "So",
      format:
        "{{day}}. {{month}}. {{year}} ({{dayName}}) {{hours}}:{{mins}}:{{secs}}",
    },
  },
};
