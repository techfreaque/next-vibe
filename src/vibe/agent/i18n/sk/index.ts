import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    streaming: "Priebežné generovanie",
    chat: "Čet",
    ai: "AI",
    status: "Stav",
    processing: "Spracúva sa",
    classification: "Klasifikácia",
    automation: "Automatizácia",
    execution: "Vykonávanie",
    confirmation: "Potvrdenie",
    speech: "Reč",
    transcription: "Prepis",
    tts: "Prevod textu na reč",
  },
  enums: {
    emailAgentStatus: {
      pending: "Čaká",
      processing: "Spracúva sa",
      hardRulesComplete: "Pevné pravidlá vyhodnotené",
      aiProcessing: "Spracovanie pomocou AI",
      awaitingConfirmation: "Čaká na potvrdenie",
      completed: "Dokončené",
      failed: "Zlyhalo",
      skipped: "Preskočené",
    },
    emailAgentActionType: {
      markBounced: "Označiť ako nedoručené",
      markSpam: "Označiť ako spam",
      classifyDeliveryFailure: "Určiť príčinu nedoručenia",
      respondToEmail: "Odpovedať na e-mail",
      deleteEmail: "Odstrániť e-mail",
      searchKnowledgeBase: "Prehľadať znalostnú databázu",
      webSearch: "Vyhľadávanie na webe",
      escalateToHuman: "Odovzdať na posúdenie človeku",
      noAction: "Bez zásahu",
      chainAnalysis: "Analýza reťazca",
    },
    emailAgentToolType: {
      knowledgeBaseSearch: "Vyhľadávanie v znalostnej databáze",
      emailResponse: "Odpoveď na e-mail",
      emailDelete: "Odstránenie e-mailu",
      webSearch: "Vyhľadávanie na webe",
    },
    bounceCategory: {
      hardBounce: "Trvalé nedoručenie",
      softBounce: "Dočasné nedoručenie",
      spamComplaint: "Nahlásenie spamu",
      unsubscribe: "Odhlásenie z odberu",
      blockBounce: "Doručenie zablokované",
      invalidAddress: "Neplatná adresa",
      mailboxFull: "Plná schránka",
      contentRejected: "Obsah zamietnutý",
    },
    confirmationStatus: {
      pending: "Čaká",
      approved: "Schválené",
      rejected: "Zamietnuté",
      expired: "Platnosť vypršala",
    },
    processingPriority: {
      low: "Nízka",
      normal: "Bežná",
      high: "Vysoká",
      urgent: "Naliehavá",
    },
    sortOrder: {
      asc: "Vzostupne",
      desc: "Zostupne",
    },
    emailAgentSortField: {
      emailId: "ID e-mailu",
      status: "Stav",
      lastProcessedAt: "Čas posledného spracovania",
      createdAt: "Vytvorené",
      priority: "Priorita",
    },
    emailAgentStatusFilter: {
      all: "Všetky",
      pending: "Čaká",
      processing: "Spracúva sa",
      hardRulesComplete: "Pevné pravidlá vyhodnotené",
      aiProcessing: "Spracovanie pomocou AI",
      awaitingConfirmation: "Čaká na potvrdenie",
      completed: "Dokončené",
      failed: "Zlyhalo",
      skipped: "Preskočené",
    },
    emailAgentActionTypeFilter: {
      all: "Všetky",
      markBounced: "Označiť ako nedoručené",
      markSpam: "Označiť ako spam",
      classifyDeliveryFailure: "Určiť príčinu nedoručenia",
      respondToEmail: "Odpovedať na e-mail",
      deleteEmail: "Odstrániť e-mail",
      searchKnowledgeBase: "Prehľadať znalostnú databázu",
      webSearch: "Vyhľadávanie na webe",
      escalateToHuman: "Odovzdať na posúdenie človeku",
      noAction: "Bez zásahu",
      chainAnalysis: "Analýza reťazca",
    },
    confirmationStatusFilter: {
      all: "Všetky",
      pending: "Čaká",
      approved: "Schválené",
      rejected: "Zamietnuté",
      expired: "Platnosť vypršala",
    },
    processingPriorityFilter: {
      all: "Všetky",
      low: "Nízka",
      normal: "Bežná",
      high: "Vysoká",
      urgent: "Naliehavá",
    },
    confirmationResponseAction: {
      approve: "Schváliť",
      reject: "Zamietnuť",
    },
    modelUtilities: {
      chat: "Čet",
      coding: "Programovanie",
      creative: "Tvorivé písanie",
      analysis: "Analýza",
      reasoning: "Uvažovanie",
      roleplay: "Hranie rolí",
      fast: "Rýchly",
      smart: "Inteligentný",
      vision: "Rozpoznávanie obrázkov",
      imageGen: "Tvorba obrázkov",
      politicalLeft: "Politická ľavica",
      politicalRight: "Politická pravica",
      controversial: "Kontroverzné témy",
      adultImplied: "Naznačený obsah pre dospelých",
      adultExplicit: "Explicitný obsah pre dospelých",
      violence: "Násilie",
      harmful: "Škodlivý obsah",
      illegalInfo: "Informácie o nelegálnych činnostiach",
      medicalAdvice: "Zdravotné rady",
      offensiveLanguage: "Urážlivý jazyk",
      roleplayDark: "Hranie rolí s temnými témami",
      conspiracy: "Konšpiračné teórie",
      legacy: "Starší model",
      uncensored: "Bez cenzúry",
    },
  },
  aiStream: {
    category: "Agent",
    tags: {
      streaming: "Priebežné generovanie",
      chat: "Čet",
      ai: "AI",
    },

    run: {
      task: {
        name: "Pravidelná kontrola AI",
        description:
          "Agent AI na pozadí kontroluje stav systému, plní úlohy a podľa potreby sa ozve používateľovi.",
      },
      post: {
        title: "Spustiť agenta AI",
        dynamicTitle: "Spustenie AI{{suffix}}: {{prompt}}",
        description:
          "Zverte úlohu špecializovanému agentovi AI a vráťte jeho odpoveď. Tvorbu a úpravy zručností či osobností AI vždy delegujte cez skill='skill-creator'. Odovzdajte parametre skill a prompt. Agent vybaví zvyšok. Spotreba kreditov závisí od modelu.",
        container: {
          title: "Spustenie agenta AI",
          description:
            "Nastavte predbežné volania a hlavné zadanie pre spustenie AI bez používateľského rozhrania",
        },
        fields: {
          favoriteId: {
            label: "ID obľúbenej položky",
            description:
              "Krátky názov alebo ID uloženej obľúbenej položky. Jej zručnosť, model a nastavenia nástrojov sa načítajú ako predvolené hodnoty. Výslovne zadané polia požiadavky majú prednosť.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          model: {
            label: "Model",
            description:
              "LLM na uvažovanie nad textom. Ak zadáte favoriteId alebo skill, výber modelu je voliteľný. Rýchle: claude-haiku-4.5 a gemini-2.5-flash. Vyvážené: claude-sonnet-4.6 a gpt-5. Výkonný: claude-opus-4.7. Bezplatný: qwen3_235b-free. Na obrázky, zvuk a video použite samostatný model.",
          },
          skill: {
            label: "Zručnosť",
            description:
              "ID zručnosti alebo názov predvolenej zručnosti. Určuje osobnosť AI a jej systémové zadanie. Na vytvorenie alebo úpravu použite 'skill-creator'. Ak zadáte favoriteId, toto pole je voliteľné.",
            placeholder: "default",
          },
          prompt: {
            label: "Zadanie",
            description:
              "Hlavný pokyn alebo otázka pre AI. Formulujte ju konkrétne. Ak zadáte preCalls, AI použije výsledky týchto volaní ako kontext.",
            placeholder: "Zadajte pokyny...",
          },
          instructions: {
            label: "Ďalšie systémové pokyny",
            description:
              "Voliteľné pokyny pridané na koniec systémového zadania. Slúžia na určenie formátu, tónu alebo dĺžky výstupu, napríklad „Stručne. Len JSON.“",
            placeholder: "Buďte struční. Najviac jeden odsek.",
          },
          preCalls: {
            label: "Predbežné volania",
            description:
              "Volania nástrojov naplánované pred spracovaním hlavného zadania. Ich výsledky sa pridajú do kontextu. Dostupné nástroje a ich argumenty nájdete pomocou tool-help.",
            routeId: {
              label: "ID nástroja",
              description:
                "Alias alebo úplný názov nástroja, napríklad 'web-search' alebo 'agent_skills_GET'. Nástroje nájdete pomocou tool-help.",
              placeholder: "web-search",
            },
            args: {
              label: "Argumenty",
              description:
                'Argumenty nástroja ako dvojice kľúč a hodnota. Zlúčte urlPathParams a polia tela do jedného objektu, napríklad {"query": "latest news", "maxResults": 5}.',
            },
          },
          availableTools: {
            label: "Povolené volania",
            description:
              "Určuje, ktoré nástroje môže AI spustiť. Hodnota null povolí všetky dostupné nástroje. Pole povolí len uvedené nástroje. Bežné nastavenie: [{toolId:'execute-tool'},{toolId:'tool-help'}].",
            toolId: {
              label: "ID nástroja",
              description:
                "Alias alebo úplný názov nástroja, napríklad 'execute-tool', 'tool-help' alebo 'web-search'",
            },
            requiresConfirmation: {
              label: "Vyžaduje potvrdenie",
              description:
                "Pred spustením nástroja počká na potvrdenie používateľa",
            },
          },
          pinnedTools: {
            label: "V kontexte modelu",
            description:
              "Nástroje načítané do kontextu modelu. Hodnota null použije predvolený výber používateľa. Toto nastavenie určuje, ktoré nástroje model vidí. Pravidlá spúšťania nástrojov sa tým nemenia.",
            toolId: {
              label: "ID nástroja",
              description:
                "Alias alebo úplný názov nástroja, ktorý sa má pridať do kontextu",
            },
            requiresConfirmation: {
              label: "Vyžaduje potvrdenie",
              description:
                "Určuje, či nástroj pred spustením vyžaduje potvrdenie používateľa",
            },
          },
          maxTurns: {
            label: "Maximálny počet kôl",
            description:
              "Najvyšší počet cyklov volania nástrojov. Predvolene bez limitu. Hodnota 1 umožní výmenu jedného zadania a odpovede bez ďalších volaní nástrojov.",
          },
          appendThreadId: {
            label: "ID konverzácie na pokračovanie",
            description:
              "UUID existujúcej konverzácie, do ktorej sa pridá nová správa. Ak pole vynecháte, vznikne nová konverzácia.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          rootFolderId: {
            label: "Priečinok na uloženie",
            description:
              "Určuje, kam sa konverzácia uloží. Na pozadí: automatické spustenia (Dreamer, Autopilot, naplánované úlohy). Súkromné: váš priečinok. Zdieľané: priestor tímu. Inkognito: bez uloženia.",
            placeholder: "background",
            options: {
              background: "Na pozadí",
              private: "Súkromné",
              shared: "Zdieľané",
              incognito: "Inkognito (bez uloženia)",
            },
          },
          subFolderId: {
            label: "ID podpriečinka",
            description:
              "Voliteľné UUID podpriečinka v koreňovom priečinku. Slúži na ručné usporiadanie. Pri programovom volaní ai-run alebo volaní z nástrojov AI pole vynechajte. Pri automatizácii alebo práci agenta ho nechajte prázdne.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          excludeMemories: {
            label: "Vynechať spomienky",
            description:
              "Vynechá uložené spomienky z kontextu. Použite pri verejných botoch alebo samostatných úlohách. Predvolená hodnota: false.",
          },
        },
        response: {
          text: "Text odpovede AI bez značiek uvažovania. Ak model nič nevytvoril, hodnota je null.",
          promptTokens: "Spotrebované vstupné tokeny (cena vstupu)",
          completionTokens: "Vygenerované výstupné tokeny (cena výstupu)",
          creditCost:
            "Kredity odpočítané za toto spustenie. V režime inkognito je hodnota null.",
          threadId:
            "UUID vlákna, v ktorom je výsledok uložený. Ak má rootFolderId hodnotu 'incognito', výsledok je null. V konverzácii pokračujte cez appendThreadId.",
          lastAiMessageId:
            "UUID poslednej správy asistenta. Umožňuje vytvoriť vetvu alebo odkázať na odpoveď.",
          threadTitle: "Automaticky vytvorený názov konverzácie",
          threadCreatedAt: "Čas vytvorenia konverzácie (ISO 8601)",
          preCallResults: {
            title: "Výsledky predbežných volaní",
            routeId: "Volaný nástroj",
            succeeded: "Určuje, či sa volanie podarilo",
            errorMessage: "Chybová správa pri neúspešnom volaní",
          },
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Zadané parametre sú neplatné",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          notFound: {
            title: "Nenájdené",
            description: "Trasa alebo zdroj sa nenašli",
          },
          internal: {
            title: "Chyba servera",
            description: "Pri spustení AI nastala interná chyba servera",
          },
          network: {
            title: "Chyba siete",
            description: "Pri spustení AI nastala chyba siete",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neočakávaná chyba",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Konflikt s neuloženými zmenami",
          },
          conflict: {
            title: "Konflikt",
            description: "Nastal konflikt údajov",
          },
        },
        success: {
          title: "Spustenie AI dokončené",
          description: "Agent AI prácu dokončil",
        },
        backButton: {
          label: "Späť",
        },
      },
    },
    route: {
      debug: {
        userObject: "Trasa streamu AI: údaje používateľa",
        extracted: "Trasa streamu AI: získané hodnoty",
      },
      errors: {
        invalidJson: "Neplatný JSON v tele požiadavky",
        invalidRequestData: "Neplatné údaje požiadavky ({{issue}})",
        uncensoredApiKeyMissing: "Kľúč API pre Uncensored.ai nie je nastavený",
        openrouterApiKeyMissing: "Kľúč API pre OpenRouter nie je nastavený",
        streamCreationFailed:
          "Nepodarilo sa pripojiť k službe AI. Skúste to znova.",
        unknownError: "Vyskytla sa chyba",
        creditValidationFailed: "Nepodarilo sa overiť zostatok kreditov",
        noIdentifier:
          "Chýba identifikátor používateľa alebo potenciálneho zákazníka",
        insufficientCredits:
          "Na túto požiadavku nemáte dostatok kreditov (cena: {{cost}}, zostatok: {{balance}})",
        noResponseBody: "Stream neposlal telo odpovede",
        authenticationRequired:
          "Ak chcete používať uložené priečinky, prihláste sa. Na anonymné rozhovory použite režim inkognito.",
      },
    },
    post: {
      title: "Čet s priebežnými odpoveďami AI",
      titleShort: "Čet s AI",
      description:
        "Získavajte priebežné odpovede od {{modelCount}} modelov vrátane Claude, GPT, Gemini a Llama. Čet podporuje text, hlas, prílohy a volanie nástrojov agentmi.",
      form: {
        title: "Nastavenia četu s AI",
        description: "Nastavte parametre a správy četu s AI",
      },
      operation: {
        label: "Operácia",
        description: "Operácia, ktorá sa má vykonať so správou",
        options: {
          send: "Odoslať správu",
          retry: "Zopakovať správu",
          edit: "Upraviť správu",
          answerAsAi: "Odpovedať ako AI",
        },
      },
      rootFolderId: {
        label: "Koreňový priečinok",
        description: "Koreňový priečinok správy",
      },
      subFolderId: {
        label: "Podpriečinok",
        description: "Voliteľný podpriečinok v koreňovom priečinku",
      },
      threadId: {
        label: "ID vlákna",
        description:
          "Platné UUID konverzácie, do ktorej sa správa odošle. Ak konverzáciu ešte nemáte, najprv ju vytvorte.",
      },
      userMessageId: {
        label: "ID správy používateľa",
        description: "ID správy používateľa vytvorené klientom",
      },
      parentMessageId: {
        label: "ID nadradenej správy",
        description: "ID nadradenej správy na vetvenie konverzácie",
      },
      leafMessageId: {
        label: "ID koncovej správy",
        description:
          "ID poslednej správy aktuálnej vetvy. Umožňuje sledovať aktívnu vetvu nezávisle od URL.",
      },
      messageHistory: {
        label: "História správ",
        description: "Voliteľná história správ pre režim inkognito",
        item: {
          title: "Správa",
          description: "Správa z histórie četu",
          role: {
            label: "Rola",
          },
          content: {
            label: "Obsah",
          },
          metadata: {
            toolCall: {
              toolName: {
                label: "Názov nástroja",
              },
              args: {
                label: "Argumenty nástroja",
              },
              result: {
                label: "Výsledok volania nástroja",
              },
              error: {
                label: "Chyba nástroja",
              },
              executionTime: {
                label: "Čas vykonávania (ms)",
              },
              creditsUsed: {
                label: "Spotrebované kredity",
              },
            },
          },
        },
      },
      content: {
        label: "Obsah správy",
        description: "Obsah správy na odoslanie",
        placeholder: "Zadajte správu...",
      },
      role: {
        label: "Rola",
        description: "Rola odosielateľa správy",
        options: {
          user: "Používateľ",
          assistant: "Asistent",
          system: "Systém",
        },
      },
      model: {
        label: "Model",
        description: "Model AI, ktorý má vytvoriť odpoveď",
      },
      skill: {
        label: "Zručnosť",
        description: "Voliteľná zručnosť AI",
      },
      systemPrompt: {
        label: "Systémový prompt",
        description: "Voliteľné systémové pokyny",
        placeholder: "Zadajte systémové pokyny...",
        now: "teraz",
        minutesAgo: "pred {{minutes}} min",
        hoursAgo: "pred {{hours}} h",
        daysAgo: "pred {{days}} d",
      },
      enableSearch: {
        label: "Povoliť vyhľadávanie na webe",
        description: "Povolí AI vyhľadávať aktuálne informácie na webe",
      },
      timezone: {
        label: "Časové pásmo",
        description:
          "Časové pásmo používateľa na stabilné časové značky pri ukladaní do vyrovnávacej pamäte",
      },
      imageSize: {
        label: "Veľkosť obrázka",
        description:
          "Formát vytvoreného obrázka, napríklad štvorcový, na šírku alebo na výšku",
      },
      imageQuality: {
        label: "Kvalita obrázka",
        description:
          "Nastavenie kvality vytvoreného obrázka (standard alebo hd)",
      },
      musicDuration: {
        label: "Dĺžka hudby",
        description: "Dĺžka vytvorenej zvukovej ukážky",
      },
      favoriteConfig: {
        label: "Nastavenia obľúbenej položky",
        description:
          "Úplné nastavenia aktívnej obľúbenej položky vrátane modelov, nástrojov a kontextu. Hodnota null znamená, že sa použijú predvolené nastavenia zručnosti alebo systému.",
      },
      enabledToolIds: {
        label: "ID povolených nástrojov",
        description:
          "Zoznam ID nástrojov AI, ktoré budú povolené v tejto konverzácii",
      },
      toolConfirmation: {
        label: "Potvrdenie nástroja",
        description: "Odpoveď používateľa na žiadosť o potvrdenie nástroja",
        success: "Potvrdenie nástroja sa spracovalo",
        messageId: {
          label: "ID správy",
          description: "ID správy s volaním nástroja",
        },
        confirmed: {
          label: "Potvrdené",
          description: "Určuje, či používateľ schválil spustenie nástroja",
        },
        updatedArgs: {
          label: "Upravené argumenty",
          description: "Voliteľné upravené argumenty volania nástroja",
        },
        errors: {
          messageNotFound: "Správa s volaním nástroja sa nenašla",
          toolCallMissing: "Chýbajú metadáta ToolCall",
          toolNotFound: "Nástroj sa nenašiel",
        },
      },
      resumeToken: {
        label: "Token na obnovenie",
        description: "Token na pokračovanie prerušených streamov",
      },
      voiceMode: {
        label: "Hlasový režim",
        description: "Nastavenia hlasovej konverzácie",
        enabled: {
          label: "Zapnúť hlasový režim",
          description: "Zapne hlasovú konverzáciu s prevodom textu na reč",
        },
        voice: {
          label: "Hlas",
          description:
            "Vyberte hlas na čítanie nahlas. Použite „voices.MALE“ pre mužský hlas alebo „voices.FEMALE“ pre ženský hlas (predvolené).",
          male: "Mužský hlas",
          female: "Ženský hlas",
        },
      },
      audioInput: {
        title: "Zvukový vstup",
        description: "Nahrajte zvukový súbor na hlasovú konverzáciu",
        file: {
          label: "Zvukový súbor",
          description: "Zvukový súbor na prepis a spracovanie",
        },
      },
      attachments: {
        label: "Súborové prílohy",
        description: "Súbory priložené k správe, napríklad obrázky a dokumenty",
      },
      response: {
        title: "Priebežná odpoveď",
        description: "Priebežne generovaná odpoveď AI",
        success: "Stream sa úspešne dokončil",
        messageId: "ID správy",
        threadId: "ID vlákna",
        totalTokens: "Celkový počet spotrebovaných tokenov",
        finishReason: "Dôvod ukončenia",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Priebežné odpovede AI vyžadujú prihlásenie",
        },
        validation: {
          title: "Chyba overenia",
          description: "Parametre požiadavky sú neplatné",
        },
        server: {
          title: "Chyba servera",
          description: "Nastala interná chyba servera",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neznáma chyba",
        },
        network: {
          title: "Chyba siete",
          description: "Počas streamovania nastala chyba siete",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie na priebežné generovanie odpovedí AI",
        },
        notFound: {
          title: "Nenájdené",
          description:
            "Koncový bod na priebežné generovanie odpovedí AI sa nenašiel",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Najprv uložte rozpracované zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Pri priebežnom generovaní došlo ku konfliktu údajov",
        },
      },
      success: {
        title: "Hotovo",
        description: "Priebežná odpoveď AI bola úspešne vygenerovaná",
      },
    },
    enums: {
      role: {
        user: "Používateľ",
        assistant: "Asistent",
        system: "Systém",
      },
    },
    streamingErrors: {
      aiStream: {
        error: {
          apiKey: {
            missing: "Chýba kľúč API pre OpenAI",
            invalid: "Kľúč API pre OpenAI je neplatný",
          },
          configuration: "Chyba nastavenia priebežných odpovedí AI",
          processing: "Chyba pri spracovaní priebežnej odpovede AI",
        },
      },
    },
    debugView: {
      systemPromptTitle: "Systémový prompt",
      copied: "Skopírované",
    },
    errorTypes: {
      streamError: "Chyba streamu",
    },
    errorThread: {
      title: "Chyba",
    },
    error: {
      title: "Chyba streamu",
    },
    wakeUp: {
      revivalPrompt:
        "Asynchrónna úloha, ktorú ste zadali, sa dokončila. Výsledok je v správe nástroja vyššie. Zhrňte mi, čo úloha vrátila.",
      revivalInstructions:
        "REŽIM OBNOVENIA WAKE-UP: Asynchrónna úloha sa dokončila a jej výsledok je v konverzácii. Odpovedz na poslednú správu používateľa súhrnom výsledku nástroja v jednej až troch vetách. Nevolaj nástroje. Pôvodnú požiadavku používateľa nevykonávaj znova.",
    },
    info: {
      streamInterrupted:
        "Generovanie sa zastavilo. Čiastočná odpoveď sa uložila.",
    },
    errors: {
      toolExecutionError: "Nástroj sa nepodarilo spustiť. Skúste to znova.",
      toolExecutionErrorDetail: "Chyba nástroja: {{error}}",
      toolExecutionFailed: "Spustenie nástroja zlyhalo. Skúste to znova.",
      toolDisabledByUser: "Používateľ tento nástroj vypol. Nevolaj ho znova.",
      userDeclinedTool: "Spustenie nástroja bolo zrušené.",
      streamError: "AI nedokončila odpoveď. Skúste to znova.",
      pendingToolCall:
        "Nástroj stále beží na pozadí. Pred pokračovaním počkajte, kým skončí.",
      streamProcessingError:
        "Odpoveď AI sa nepodarilo spracovať. Skúste to znova.",
      timeout:
        "AI neodpovedala včas (časový limit v sekundách: {{maxDuration}}). Skúste odoslať kratšiu správu.",
      noResponse: "AI nevytvorila odpoveď. Skúste to znova.",
      modelUnavailable:
        "Vybraný model AI momentálne nie je dostupný. Skúste iný model.",
      rateLimitExceeded:
        "Príliš veľa požiadaviek. Chvíľu počkajte a skúste to znova.",
      insufficientCredits: "Na túto požiadavku nemáte dostatok kreditov.",
      connectionFailed:
        "Nepodarilo sa pripojiť k službe AI. Skontrolujte pripojenie a skúste to znova.",
      invalidRequest:
        "Neplatná požiadavka. Skontrolujte zadané údaje a skúste to znova.",
      compactingStreamError:
        "Konverzácia prekročila limit kontextu a je príliš dlhá na automatické zhrnutie. Vytvorte vetvu od staršej správy, prepnite na model s väčším kontextovým oknom alebo upravte jeho veľkosť v nastaveniach obľúbenej položky.",
      compactingStreamErrorExpensive:
        "Dosiahli ste limit kontextu. Počet tokenov: {{tokens}}. Rozšírenie kontextu môže zvýšiť cenu. Skúste najprv vytvoriť vetvu od staršej správy alebo zmeniť model.",
      compactingException:
        "Históriu konverzácie sa nepodarilo zhrnúť. Skúste vytvoriť vetvu od staršej správy alebo zmeniť model.",
      compactingRebuildFailed:
        "Konverzáciu sa po zhrnutí nepodarilo obnoviť. Skúste vytvoriť vetvu od staršej správy.",
      unexpectedError: "Nastala neočakávaná chyba: {{error}}. Skúste to znova.",
    },
    headless: {
      errors: {
        // Thrown when runHeadlessAiStream() is called without a resolvable model+skill.
        // Either pass model+skill directly, or pass favoriteId pointing to a favorite
        // that has a MANUAL or FILTERS modelSelection (not SKILL_BASED with no skill).
        missingModelOrSkill:
          "Vyžaduje sa model alebo zručnosť. Zadajte ich priamo alebo poskytnite favoriteId obľúbenej položky, z ktorej sa dá načítať model.",
        favoriteNotFound:
          "Obľúbená položka sa nenašla alebo nepatrí tomuto používateľovi",
      },
    },
    resumeStream: {
      post: {
        title: "Obnoviť priebežnú odpoveď AI",
        description:
          "Spustí ďalšie kolo AI v existujúcej konverzácii bez používateľského rozhrania. Používa sa po dokončení vzdialenej asynchrónnej úlohy (callbackMode=wait alebo wakeUp). Zadajte favoriteId na načítanie modelu a zručnosti naraz alebo zadajte modelId aj skillId.",
        fields: {
          threadId: {
            title: "ID vlákna",
            description:
              "UUID existujúcej konverzácie, v ktorej sa má pokračovať.",
          },
          favoriteId: {
            title: "ID obľúbenej položky",
            description:
              "UUID obľúbenej položky, z ktorej sa načíta model a zručnosť. Ak zadáte aj modelId a skillId, prednosť má obľúbená položka.",
          },
          modelId: {
            title: "ID modelu",
            description:
              "Model AI na pokračovanie konverzácie. Pri zadanom favoriteId je voliteľný.",
          },
          skillId: {
            title: "ID zručnosti",
            description:
              "Zručnosť alebo rola AI na pokračovanie konverzácie. Pri zadanom favoriteId je voliteľná.",
          },
          callbackMode: {
            title: "Režim spätného volania",
            description:
              "Režim spätného volania pôvodného volania nástroja (wait alebo wakeUp). Určuje postup obnovenia.",
          },
          wakeUpToolMessageId: {
            title: "ID správy nástroja WakeUp",
            description:
              "ID správy pôvodného volania nástroja, do ktorej sa doplnil výsledok.",
          },
          wakeUpTaskId: {
            title: "ID úlohy WakeUp",
            description:
              "ID pôvodnej vzdialenej úlohy cron, ktorá sa po obnovení odstráni.",
          },
          resumeTaskId: {
            title: "ID úlohy obnovenia",
            description:
              "ID tejto úlohy cron na obnovenie streamu. Po obnovení sa úloha odstráni.",
          },
          resumed: {
            title: "Obnovené",
            description: "Určuje, či sa v konverzácii úspešne pokračovalo.",
          },
          lastAiMessageId: {
            title: "ID poslednej správy AI",
            description:
              "UUID poslednej vytvorenej správy asistenta. Ak žiadna nevznikla, hodnota je null.",
          },
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description:
              "Neplatné parametre. Hodnota threadId musí byť platné UUID.",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          notFound: {
            title: "Nenájdené",
            description: "Konverzácia alebo model sa nenašli",
          },
          internal: {
            title: "Chyba servera",
            description: "Pri obnovení streamu nastala interná chyba",
          },
          network: {
            title: "Chyba siete",
            description: "Nastala chyba siete",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neočakávaná chyba",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Konflikt s neuloženými zmenami",
          },
          conflict: {
            title: "Konflikt",
            description: "Došlo ku konfliktu",
          },
        },
        success: {
          title: "Stream sa obnovil",
          description: "Konverzácia s AI úspešne pokračovala",
        },
      },
    },
    providers: {
      uncensoredHandler: {
        errors: {
          apiError: "Chyba API Uncensored.ai ({{status}}): {{errorText}}",
        },
      },
    },
    onboarding: {
      back: "Späť",
      welcome: {
        title:
          "Všetky úlohy vybavíš v jednom čete. Pre každú vyberieš vhodnú AI.",
        line1:
          "Na bežné rozhovory máš spoločníka. Keď píšeš, programuješ alebo si robíš prieskum, vyber si špecialistu.",
        line2: "Zostávaš v tom istom čete. Prepnúť môžeš za pár sekúnd.",
        line3: "Nastavenie zvládneš za menej ako minútu.",
        continue: "Začať",
      },
      guest: {
        title: "Používaš čet ako hosť",
        line1:
          "Nastavenia, výber spoločníka aj história četu sa ukladajú len v tomto zariadení.",
        line2:
          "Po prihlásení sa všetko synchronizuje medzi zariadeniami a tvoje nastavenia ostanú uložené.",
        signIn: "Prihlásiť sa alebo vytvoriť účet",
        continueAnyway: "Pokračovať ako hosť",
        note: "Prihlásiť sa môžeš kedykoľvek neskôr v ponuke.",
      },
      companion: {
        title: "Vyber si spoločníka",
        subtitle: "Hlavný partner na každodenné rozhovory",
        modelTitle: "Ktorý model má používať?",
        customSetup: "Rozšírené nastavenia →",
        next: "Ďalej",
        selectFirst: "Ak chceš pokračovať, vyber spoločníka",
      },
      usecases: {
        title: "Na čo ho budeš najčastejšie používať?",
        subtitle: "Podľa výberu ti pridáme vhodných špecialistov.",
        saving: "Pripravuje sa...",
        start: "Začať četovať",
        hintNoneSelected:
          "Vyber oblasti a pridáme špecializované zručnosti. Ak chceš výber preskočiť, ťukni na Začať.",
        noProviderAvailable:
          "Poskytovateľ AI nie je nastavený. Ak chceš pokračovať, pridaj OPENROUTER_API_KEY alebo zapni Claude Code (CLAUDE_CODE_ENABLED=true).",
        coding: {
          label: "Programovanie a technika",
          hint: "Vibe Coder, programátor",
        },
        research: {
          label: "Výskum a analýza",
          hint: "Výskumník, dátový analytik",
        },
        writing: {
          label: "Písanie a úpravy textu",
          hint: "Autor, redaktor",
        },
        business: {
          label: "Podnikanie a stratégia",
          hint: "Podnikateľský poradca, produktový manažér",
        },
        learning: {
          label: "Učenie a štúdium",
          hint: "Lektor, sokratovský sprievodca",
        },
        creative: {
          label: "Tvorba a príbehy",
          hint: "Rozprávač, tvorca",
        },
        health: {
          label: "Zdravie a kariéra",
          hint: "Poradca pre zdravie a pohodu, kariérny kouč",
        },
        controversial: {
          label: "Slobodné myslenie",
          hint: "Bez cenzúry, filozof",
        },
        roleplay: {
          label: "Hranie rolí a postavy",
          hint: "Hranie rolí, tvorca postáv",
        },
      },
    },
    input: {
      placeholder: "Napíš správu...",
      imagePlaceholder: "Opíš obrázok, ktorý chceš vytvoriť...",
      audioPlaceholder: "Opíš zvuk alebo hudbu, ktorú chceš vytvoriť...",
      noPermission: "Tu nemáš oprávnenie pridávať príspevky",
      keyboardShortcuts: {
        enter: "Enter",
        toSend: "na odoslanie",
        shiftEnter: "Shift+Enter",
        forNewLine: "na nový riadok",
        ctrlV: "Ctrl+V",
        orPasteFiles: "alebo vlož súbory",
      },
      speechInput: {
        transcribing: "Prepisuje sa...",
      },
      attachments: {
        uploadFile: "Priložiť súbory",
        attachedFiles: "Priložené súbory",
        addMore: "Priložiť ďalšie",
      },
    },
    imageGen: {
      sizeSquare: "Štvorec (1024×1024)",
      sizeLandscape: "Na šírku (1792×1024)",
      sizePortrait: "Na výšku (1024×1792)",
      qualityStandard: "Štandardná",
      qualityHD: "HD",
    },
    audioGen: {
      durationShort: "Krátka (~8 s)",
      durationMedium: "Stredná (~15 s)",
      durationLong: "Dlhá (~30 s)",
    },
    voiceMode: {
      unconfiguredTitle: "Hlas nie je nastavený",
      unconfiguredDescription: "Táto zručnosť nepodporuje čítanie nahlas.",
      callMode: "Režim hovoru",
      callModeDescription: "AI odpovie hlasom",
      tapToRecord: "Ťuknutím spustíš nahrávanie",
      recording: {
        paused: "Pozastavené",
        resume: "Pokračovať",
        pause: "Pozastaviť",
      },
      callOverlay: {
        listening: "Počúva sa...",
      },
      actions: {
        cancel: "Zrušiť",
        toInput: "Vložiť do poľa správy",
        sendVoice: "Odoslať hlasovú správu",
        retry: "Skúsiť znova",
        download: "Stiahnuť zvuk",
        downloadHint: "Stiahnite súbor a priložte ho k ďalšej správe.",
      },
    },
    actions: {
      cancellingGeneration: "Ruší sa...",
      stopGeneration: "Zastaviť",
      sendMessage: "Odoslať",
    },
    toolsButton: {
      title: "Nástroje AI",
      tools: "Nástroje",
    },
  },
  chat: {
    category: "Čet",
    tags: {
      threads: "Vlákna",
      folders: "Priečinky",
      files: "Súbory",
      messages: "Správy",
      characters: "Zručnosti",
      memories: "Spomienky",
      favorites: "Obľúbené",
      credits: "Kredity",
      balance: "Zostatok",
      permissions: "Oprávnenia",
      hotkey: "Klávesová skratka",
      cli: "CLI",
      speech: "Reč",
      sharing: "Zdieľanie",
      settings: "Nastavenia",
    },
    config: {
      appName: "unbottled.ai",
      folders: {
        private: "Súkromné",
        shared: "Zdieľané",
        public: "Verejné",
        incognito: "Inkognito",
        background: "Na pozadí",
        remote: "Vzdialené",
      },
      foldersShort: {
        private: "Súkromné",
        shared: "Zdieľané",
        public: "Verejné",
        incognito: "Inkognito",
        background: "Na pozadí",
        remote: "Vzdialené",
      },
    },
    enums: {
      role: {
        user: "Používateľ",
        assistant: "Asistent",
        system: "Systém",
        tool: "Nástroj",
        error: "Chyba",
      },
      threadStatus: {
        active: "Aktívne",
        archived: "Archivované",
        deleted: "Odstránené",
      },
      viewMode: {
        linear: "Lineárne",
        threaded: "Vo vláknach",
        flat: "Ploché",
        debug: "Ladenie",
      },
    },
    components: {
      sidebar: {
        login: "Prihlásiť sa",
        logout: "Odhlásiť sa",
        footer: {
          account: "Účet",
          profile: "Profil",
          balance: "Zostatok",
          buy: "Kúpiť",
          freeCreditsLeft: "Bezplatné kredity",
        },
      },
      credits: {
        credit: "{{count}} kredit",
        credits: "Kredity: {{count}}",
      },
      navigation: {
        subscription: "Predplatné a kredity",
        referral: "Program odporúčaní",
        help: "Pomoc",
        about: "O platforme",
      },
      confirmations: {
        deleteMessage: "Chcete odstrániť túto správu?",
      },
      welcomeTour: {
        authDialog: {
          title: "Odomknúť súkromné a zdieľané priečinky",
          description:
            "Zaregistrujte sa alebo sa prihláste a získate prístup k súkromným a zdieľaným priečinkom. Chaty sa budú synchronizovať medzi zariadeniami.",
          continueTour: "Pokračovať v prehliadke",
          signUp: "Zaregistrovať sa alebo prihlásiť",
        },
        buttons: {
          back: "Späť",
          close: "Zavrieť",
          last: "Dokončiť",
          next: "Ďalej",
          skip: "Preskočiť",
        },
        welcome: {
          title: "Vitajte na {{appName}}",
          description:
            "Platforma AI s dôrazom na súkromie a slobodu prejavu. Má {{modelCount}} modelov a filtre obsahu si nastavujete sami.",
          subtitle: "Na začiatok si pozrite krátku prehliadku.",
        },
        aiCompanion: {
          title: "Vyberte si spoločníka AI",
          description:
            "Vyberte si z {{modelCount}} modelov AI. Na výber sú bežné modely, modely s otvoreným zdrojovým kódom aj modely bez cenzúry.",
          tip: "Otvorte výber modelu a vyberte si spoločníka.",
        },
        rootFolders: {
          title: "Vaše priečinky chatov",
          description:
            "Usporiadajte si chaty do priečinkov s rôznymi nastaveniami súkromia:",
          private: {
            name: "Súkromné",
            suffix: "vidíte iba vy",
          },
          incognito: {
            name: "Inkognito",
            suffix: "bez uloženej histórie",
          },
          shared: {
            name: "Zdieľané",
            suffix: "spolupráca s ostatnými",
          },
          public: {
            name: "Verejné",
            suffix: "vidia všetci",
          },
        },
        privateFolder: {
          name: "Súkromné",
          suffix: "Priečinok",
          description:
            "Súkromné chaty vidíte iba vy. Hodia sa na citlivé témy.",
        },
        incognitoFolder: {
          name: "Inkognito",
          suffix: "Priečinok",
          description:
            "História chatu sa neukladá na server. Správy zostávajú vo vašom prehliadači, kým ich nevymažete.",
          note: "Pri relácii inkognito údaje na serveroch neukladáme. Vygenerované médiá sa z technických dôvodov ukladajú dočasne.",
        },
        sharedFolder: {
          name: "Zdieľané",
          suffix: "Priečinok",
          description:
            "Zdieľajte prístup k tomuto priečinku s ľuďmi, s ktorými chcete spolupracovať.",
        },
        publicFolder: {
          name: "Verejné",
          suffix: "Priečinok",
          description:
            "Zverejnite svoje rozhovory s AI. Ostatní môžu vaše vlákna zobraziť a vytvoriť ich vetvu.",
          note: "Všetko vo verejnom priečinku vidia všetci používatelia aj vyhľadávače.",
        },
        newChatButton: {
          title: "Začať nový chat",
          description: "Otvorte nový rozhovor v ľubovoľnom priečinku.",
        },
        sidebarLogin: {
          title: "Ďalšie možnosti po prihlásení",
          description:
            "Vytvorte bezplatný účet a odomknite súkromné a zdieľané priečinky. História rozhovorov sa bude synchronizovať medzi zariadeniami a AI si môže zapamätať údaje o vás.",
          tip: "Registrácia je zadarmo.",
        },
        subscriptionButton: {
          title: "Kredity a predplatné",
          description:
            "Za {{price}} mesačne dostanete v predplatnom {{credits}} kreditov na mesiac. Bezplatný účet má mesačne {{freeCredits}} kreditov, s odberom newslettera {{freeCreditsMax}}.",
        },
        chatInput: {
          title: "Napíšte správu",
          description:
            "Napíšte správu a stlačte Enter alebo kliknite na Odoslať. Správu dostane váš spoločník AI.",
          tip: "Shift+Enter vloží nový riadok. Priložiť môžete aj súbory a obrázky.",
        },
        voiceInput: {
          title: "Hlasový vstup",
          description: "So spoločníkom AI sa môžete rozprávať cez mikrofón:",
          options: {
            transcribe: "Prepísať reč na text",
            sendAudio: "Odoslať zvuk priamo do AI",
            pauseResume: "Pozastaviť a obnoviť nahrávanie",
          },
        },
        callMode: {
          title: "Režim hovoru",
          description:
            "Zapnite režim hovoru a rozprávajte sa s AI hlasom v reálnom čase aj bez držania zariadenia.",
          tip: "Hodí sa na cesty alebo keď radšej hovoríte, než píšete.",
        },
        complete: {
          title: "Môžete začať",
          description:
            "Dokončili ste prehliadku. Teraz môžete začať rozhovor so spoločníkom AI.",
          help: "Potrebujete pomoc? Kedykoľvek kliknite na otáznik v bočnom paneli.",
        },
        authUnlocked: {
          unlocked: "Odomknuté",
          privateDescription:
            "Súkromný priečinok je pripravený. Chaty v ňom vidíte iba vy.",
          privateNote:
            "Súkromné chaty sa automaticky synchronizujú medzi všetkými vašimi zariadeniami.",
          sharedDescription:
            "Zdieľaný priečinok je pripravený. Pozvite ostatných na spoločné rozhovory s AI.",
          sharedNote:
            "Vy rozhodujete, kto má prístup k zdieľaným priečinkom a vláknam.",
        },
      },
    },
    selector: {
      loading: "Načítava sa…",
      best: "Najlepšia zhoda",
      free: "ZADARMO",
      creditsSingle: "1 kredit",
      creditsExact: "Kredity: {{cost}}",
      modelOnly: "Iba model",
      editModelSettings: "Upraviť nastavenia modelu",
      editSettings: "Upraviť nastavenia",
      switchSkill: "Zmeniť zručnosť",
      editSkill: "Upraviť zručnosť",
      delete: "Odstrániť",
      autoSelectedModel: "VÝBER PODĽA FILTROV",
      manualSelectedModel: "RUČNÝ VÝBER",
      intelligence: "Inteligencia",
      contentFilter: "Obsah",
      maxPrice: "Najvyššia cena",
      modelSelection: "Výber modelu",
      autoModeDescription: "Najlepší model sa vyberie podľa vašich filtrov",
      manualModeDescription: "Vyberte konkrétny model ručne",
      autoMode: "Podľa filtrov",
      manualMode: "Ručne",
      allModelsCount: "Všetky modely ({{count}})",
      filteredModelsCount: "Počet modelov zodpovedajúcich filtrom: {{count}}",
      showFiltered: "Zobraziť filtrované",
      showAllModels: "Zobraziť všetky modely",
      showLess: "Zobraziť menej",
      showMore: "Zobraziť ďalšie ({{remaining}})",
      showLegacyModels_one: "Zobraziť archivovaný model ({{count}})",
      showLegacyModels_other: "Zobraziť archivované modely ({{count}})",
      noMatchingModels: "Nenašli sa žiadne vhodné modely",
      noModelsWarning: "Žiadny model nezodpovedá filtrom",
      useOnce: "Použiť raz",
      saveAsDefault: "Pridať do obľúbených",
      deleteSetup: "Odstrániť nastavenie",
      content: "Vyhľadať obsah…",
      characterSetup: "Nastavenia zručnosti",
      noResults: "Žiadne výsledky",
      add: "Pridať do obľúbených",
      added: "Pridané",
      addNew: "Pridať nové",
      searchSkills: "Vyhľadať zručnosti…",
      createCustom: "Vytvoriť vlastné",
      customizeSettings: "Prispôsobiť nastavenia",
      requirements: {
        characterConflict: "Nesplnené požiadavky zručnosti",
        tooLow: "príliš nízke",
        tooHigh: "príliš vysoké",
        min: "min.",
        max: "max.",
      },
    },
    common: {
      newChat: "Nový chat",
      privateChats: "Súkromné čety",
      search: "Vyhľadať",
      delete: "Odstrániť",
      cancel: "Zrušiť",
      save: "Uložiť",
      edit: "Upraviť",
      settings: "Nastavenia",
      close: "Zavrieť",
      toggleSidebar: "Otvoriť alebo zavrieť bočný panel",
      lightMode: "Svetlý režim",
      darkMode: "Tmavý režim",
      searchPlaceholder: "Hľadať...",
      searchThreadsPlaceholder: "Vyhľadať vlákna…",
      searchResults: "Výsledky vyhľadávania",
      noChatsFound: "Nenašli sa žiadne chaty",
      noThreadsFound: "Nenašli sa žiadne konverzácie",
      enableTTSAutoplay: "Zapnúť automatické prehrávanie reči (TTS)",
      disableTTSAutoplay: "Vypnúť automatické prehrávanie reči (TTS)",
      selector: {
        country: "Krajina",
        language: "Jazyk",
      },
      copyButton: {
        copied: "Skopírované",
        copyToClipboard: "Kopírovať do schránky",
        copyAsMarkdown: "Kopírovať ako Markdown",
        copyAsText: "Kopírovať ako text",
      },
      assistantMessageActions: {
        cancelLoading: "Zrušiť načítavanie",
        stopAudio: "Zastaviť zvuk",
        playAudio: "Prehrať zvuk",
        answerAsAI: "Odpovedať ako model AI",
        deleteMessage: "Odstrániť správu",
      },
      characterSelector: {
        placeholder: "Vybrať zručnosť",
        addNewLabel: "Vytvoriť vlastnú zručnosť",
        grouping: {
          bySource: "Podľa zdroja",
          byCategory: "Podľa kategórie",
          sourceLabels: {
            builtIn: "Vstavané",
            my: "Moje zručnosti",
            community: "Komunita",
          },
          sourceIcons: {
            builtIn: "sparkles",
            my: "user",
            community: "people",
          },
        },
        addDialog: {
          title: "Vytvoriť vlastnú zručnosť",
          fields: {
            name: {
              label: "Názov",
              placeholder: "Zadajte názov zručnosti",
            },
            icon: {
              label: "Ikona (emoji)",
              placeholder: "😊",
            },
            description: {
              label: "Opis",
              placeholder: "Stručný opis zručnosti",
            },
            systemPrompt: {
              label: "Systémový prompt",
              placeholder: "Určte, ako sa má zručnosť správať…",
            },
            category: {
              label: "Kategória",
            },
          },
          createCategory: "Vytvoriť kategóriu",
          cancel: "Zrušiť",
          create: "Vytvoriť zručnosť",
        },
        addCategoryDialog: {
          title: "Vytvoriť kategóriu",
          fields: {
            name: {
              label: "Názov kategórie",
              placeholder: "Zadajte názov kategórie",
            },
            icon: {
              label: "Ikona (emoji)",
              placeholder: "📁",
            },
          },
          cancel: "Zrušiť",
          create: "Vytvoriť kategóriu",
        },
      },
    },
    actions: {
      newChatInFolder: "Nový čet v priečinku",
      newFolder: "Nový priečinok",
      deleteFolder: "Odstrániť priečinok",
      deleteMessage: "Odstrániť správu",
      deleteThisMessage: "Odstrániť túto správu",
      searchEnabled: "Vyhľadávanie je zapnuté",
      searchDisabled: "Vyhľadávanie je vypnuté",
      answerAsAI: "Odpovedať ako model AI",
      retry: "Skúsiť znova s iným modelom alebo zručnosťou",
      branch: "Vytvoriť vetvu rozhovoru odtiaľto",
      editMessage: "Upraviť správu",
      stopAudio: "Zastaviť prehrávanie zvuku",
      playAudio: "Prehrať zvuk",
      copyContent: "Kopírovať do schránky",
    },
    dialogs: {
      searchAndCreate: "Vyhľadávanie a tvorba",
      deleteChat: "Odstrániť chat „{{title}}“?",
      deleteFolderConfirm:
        "Odstrániť priečinok „{{name}}“ a presunúť jeho chaty ({{count}}) do priečinka Všeobecné?",
    },
    views: {
      linearView: "Lineárne zobrazenie (ako v ChatGPT)",
      threadedView: "Zobrazenie vo vláknach (ako na Reddite a Discorde)",
      flatView: "Ploché zobrazenie (ako na 4chane)",
      debugView: "Zobrazenie na ladenie (so systémovými promptmi)",
    },

    screenshot: {
      capturing: "Zachytáva sa…",
      capture: "Zachytiť snímku obrazovky",
      failed: "Snímku obrazovky sa nepodarilo zachytiť",
      failedWithMessage: "Snímku obrazovky sa nepodarilo zachytiť: {{message}}",
      tryAgain: "Snímku obrazovky sa nepodarilo zachytiť. Skúste znova.",
      noMessages:
        "Oblasť správ sa nenašla. Skontrolujte, či chat obsahuje správy.",
      quotaExceeded: "Úložisko je plné. Snímka obrazovky je príliš veľká.",
      canvasError: "Snímku obrazovky sa nepodarilo previesť na obrázok.",
    },
    errors: {
      noResponse: "AI vrátila prázdnu odpoveď. Skúste znova.",
      noStream:
        "Odpoveď sa nepodarilo streamovať. Čítačka streamu nie je dostupná.",
      saveFailed: "Úpravu sa nepodarilo uložiť",
      branchFailed: "Vetvu sa nepodarilo vytvoriť",
      retryFailed: "Opakovanie zlyhalo",
      answerFailed: "Odpoveď sa nepodarilo odoslať",
      deleteFailed: "Odstránenie zlyhalo",
    },
    errorTypes: {
      streamError: "Chyba streamovania",
    },
    hooks: {
      stt: {
        "endpoint-not-available": "Rozhranie na prepis reči nie je dostupné",
        "failed-to-start": "Nahrávanie sa nepodarilo spustiť",
        "permission-denied":
          "Mikrofón je zablokovaný. Povoľte ho v nastaveniach prehliadača a obnovte stránku.",
        "permission-denied-ios":
          "Mikrofón je zablokovaný. Otvorte Nastavenia → Safari → Mikrofón a povoľte prístup pre tento web.",
        "permission-denied-android":
          "Mikrofón je zablokovaný. Ťuknite na zámok v paneli s adresou → Nastavenia webu → Mikrofón → Povoliť.",
        "permission-denied-mac":
          "Mikrofón je zablokovaný. Otvorte Nastavenia systému → Súkromie a bezpečnosť → Mikrofón a povoľte prístup prehliadaču.",
        "permission-denied-windows":
          "Mikrofón je zablokovaný. V časti Nastavenia → Súkromie → Mikrofón povoľte svoj prehliadač.",
        "no-microphone":
          "Mikrofón sa nenašiel. Pripojte mikrofón alebo náhlavnú súpravu a skúste znova.",
        "microphone-in-use":
          "Tvoj mikrofón používa iná aplikácia. Zavri ju a skús znova.",
        "not-supported":
          "Tvoj prehliadač nepodporuje prístup k mikrofónu. Skús Chrome, Firefox alebo Safari.",
        "transcription-failed": "Zvuk sa nepodarilo prepísať",
        "audio-too-short":
          "Nahrávka je príliš krátka. Podrž mikrofón, hovor zreteľne a skús znova.",
      },
      tts: {
        "endpoint-not-available":
          "Rozhranie na prevod textu na reč nie je dostupné",
        "failed-to-play": "Zvuk sa nepodarilo prehrať",
        "conversion-failed": "Prevod textu na reč zlyhal",
        "failed-to-generate": "Zvuk sa nepodarilo vytvoriť",
      },
    },
    post: {
      title: "Čet",
      description: "Rozhranie chatu",
    },
    models: {
      descriptions: {
        uncensoredLmV11:
          "Vlastný model Uncensored.ai s odlišným pohľadom na svet. Ostatné modely v tejto skupine vychádzajú z bežných modelov, ktorým sa upravilo odmietanie odpovedí. Tento model sa trénoval aj na knihách a dokumentoch vylúčených z hlavného prúdu internetu, takže pri politike prichádza aj s názormi mimo hlavného prúdu. Hodí sa na politiku, alternatívne pohľady a temnú fikciu o tabuizovaných témach. Rozpráva priamo, bez zjemňovania scén a poučovania. Volá nástroje, pracuje len s textom a má kontext 32 000 tokenov. Je experimentálny, nehodí sa na programovanie a sporné tvrdenia môže podávať rovnako sebaisto ako potvrdené fakty. Jeho tvrdenia si preto overte.",
        freedomgptLiberty:
          "Vlajkový model bez cenzúry od Age of AI, ktorý pomohol vytvoriť túto kategóriu četbotov. Vychádza z otvorených váh a je doladený na priame odpovede bez poučovania. Odpovedá rýchlo a pohotovo. Kontext má 32 000 tokenov. Pri práci s nástrojmi, programovaní a dôkladnej analýze je silnejší Qwen 3.6 Plus Uncensored. Ak hľadáte model s odlišným pohľadom na svet, skúste UncensoredLM.",
        gabAiArya:
          "Asistent od Gab bez cenzúry, ktorého výrobca otvorene profiluje pravicovo. Odpovedá bez bežných obsahových obmedzení. Má kontext 131 000 tokenov, spracúva obrázky aj video a volá nástroje. Vyberte si ho, ak vám vyhovuje jeho názorové zameranie. Vlastný pohľad ponúka aj UncensoredLM. V programovaní je slabší a výrobca nezverejnil jeho základný model.",
        gemini31ProPreviewCustomTools:
          "Predbežný variant Gemini 3.1 Pro pre vlastné nástroje. Uprednostňuje nástroje, ktoré zadáte, pred použitím Bash. Hodí sa pre programovacích agentov a úlohy s viacerými nástrojmi. Prijíma text, obrázky, video a zvuk. Kontext: 1 milión tokenov. Novší Gemini 4 Argon ponúka výkon triedy Pro za podobnú cenu.",
        gemini31FlashImagePreview:
          "Gemini 3.1 Flash Image od Googlu v predbežnej verzii. Vytvára a upravuje obrázky priamo v čete a v jednej odpovedi kombinuje text s obrázkami. Patrí medzi najlacnejšie obrazové modely v katalógu. Používa bežné obsahové filtre, nevolá nástroje a má kontext 64 000 tokenov. Nano Banana Pro stojí viac, ale lepšie zvláda zložité zadania a čistejšie vykresľuje text. Tento starší model nahradil Nano Banana 2.1 približne za polovicu ceny za obrázok.",
        gemini31FlashLitePreview:
          "Predbežný úsporný model od Googlu na spracovanie veľkého množstva požiadaviek. Hodí sa na preklad, zoraďovanie výsledkov, získavanie údajov a rýchle konverzácie. Prijíma text, obrázky, video a zvuk. Kontext: 1 milión tokenov. Na veľmi náročné uvažovanie sa nehodí. Stále stojí menej ako jeho nástupca Gemini 3.5 Flash Lite.",
        gemini3Pro:
          "Google Gemini 3 Pro je pokročilý multimodálny model AI s veľkým kontextovým oknom a schopnosťou zložitého uvažovania.",
        gemini35Flash:
          "Model radu Flash od Googlu sa pri programovaní a uvažovaní približuje rade Pro. Umožňuje nastaviť úroveň uvažovania a prijíma text, obrázky, video a zvuk. Kontext: 1 milión tokenov. Novší Gemini 3.8 Flash stojí približne polovicu.",
        gemini3Flash:
          "Prvý model radu Gemini 3 Flash od Googlu. Rýchlo programuje a zvláda bežné uvažovanie. Prijíma text, obrázky, video a zvuk. Kontext: 1 milión tokenov. Je lacnejší ako jeho novší nástupca Gemini 3.8 Flash.",
        deepseekV32:
          "Model DeepSeek s otvorenými váhami z konca roka 2025. Riedka pozornosť znižuje cenu pri dlhom kontexte. Architektúra MoE má 671 miliárd parametrov. Model dobre programuje a analyzuje za nízku cenu. Spracúva len text. Novší DeepSeek V4.1 Flash stojí ešte menej.",
        deepseekV4Pro:
          "Vlajkový model DeepSeek s otvorenými váhami a licenciou MIT. Architektúra MoE má 1,6 bilióna parametrov, z toho 49 miliárd aktívnych. Zvláda dôkladné uvažovanie, náročné programovanie, analýzu celého projektu a prácu agentov vo viacerých krokoch. Volá nástroje, pracuje len s textom a má kontext 1 milión tokenov. Stojí zlomok ceny Claude Opus 5.5. Na rýchle bežné úlohy je lacnou voľbou DeepSeek V4.1 Flash.",
        deepseekV4Flash:
          "Rýchly model Flash od DeepSeek s architektúrou MoE a 284 miliardami parametrov. Dobre programuje, má kontext 1 milión tokenov a jedna správa stojí takmer nič. Spracúva len text. Nástupca DeepSeek V4.1 Flash stojí rovnako.",
        gpt55:
          "Bývalý špičkový univerzálny model OpenAI. Dobre uvažuje, programuje a analyzuje. Prijíma text aj obrázky a má kontext 1 milión tokenov. Patrí medzi drahšie modely. GPT-6.1 Sol zvláda rovnaké úlohy za výrazne nižšiu cenu. Slabšou stránkou je hranie rolí.",
        gpt55Pro:
          "Variant GPT-5.5 Pro s rozšíreným uvažovaním. Pri ťažkých a kritických úlohách využíva viac výpočtového výkonu. Patrí medzi najdrahšie modely v katalógu a oplatí sa najmä tam, kde nesprávna odpoveď stojí viac než jedna správa. Novší GPT-6 Astra stojí približne tretinu.",
        gpt54Pro:
          "Variant GPT-5.4 Pro s najvyšším výpočtovým rozpočtom na náročné uvažovanie, výskum a kritické analýzy. Má kontext 1 milión tokenov. Odpovedá pomaly a patrí medzi najdrahšie. GPT-6 Astra zvláda podobnú prácu asi za tretinu ceny.",
        gpt54:
          "Model OpenAI, ktorý priniesol programovanie na úrovni Codex do hlavného radu GPT. Prijíma obrázky, má kontext 1 milión tokenov a hodí sa na dlhé dokumenty, programovanie a analýzu. GPT-6.1 Sol je novší, má vyššie hodnotenie a stojí menej za správu.",
        gpt53Codex:
          "Špecialista OpenAI na programovanie s agentmi. Zvláda dlhé vývojové úlohy s nástrojmi, refaktorovanie aj ladenie. Kontext má 400 000 tokenov. Je silný v programovaní, slabší v tvorivom písaní a hraní rolí. GPT-6.1 Sol zvláda programovanie za podobnú cenu a má širšie využitie.",
        gpt53Chat:
          "GPT-5.3 Chat. Aktualizovaný konverzačný model ChatGPT. Odpovedá presnejšie, lepšie zohľadňuje kontext a menej odmieta alebo pridáva zbytočné výhrady.",
        gpt52Pro:
          "GPT-5.2 s rozšíreným uvažovaním na najťažšie úlohy, napríklad dôkladný výskum, zložitú matematiku a starostlivú kontrolu kódu. Odpovedá pomaly a je veľmi drahý. Novší model triedy Pro, GPT-6 Astra, stojí výrazne menej než polovicu.",
        gpt52:
          "Všestranný model OpenAI z konca roka 2025 na odborné úlohy, najmä programovanie, dlhé dokumenty a štruktúrovanú analýzu. Prijíma obrázky a má kontext 400 000 tokenov. Je spoľahlivý a GPT-6.1 Sol je novšou možnosťou za podobnú cenu.",
        gpt52_chat:
          "Rýchly konverzačný variant GPT-5.2 v štýle ChatGPT. Odpovedá bez dlhého uvažovania a má kontext 128 000 tokenov. Hodí sa na bežné rozhovory a prvé návrhy textov. Má kratší kontext než ostatné varianty. GPT-6.1 Terra zvláda rovnaké úlohy asi za polovicu ceny.",
        dolphin3_0_r1_mistral_24b:
          "Dolphin 3.0 R1 Mistral 24B je veľký jazykový model bez cenzúry založený na Mistral.",
        dolphinLlama3_70B:
          "Dolphin Llama 3 70B je veľký jazykový model bez cenzúry založený na Llama 3.",
        veniceUncensored:
          "Model bez cenzúry od Venice vychádza z Dolphin Mistral 24B. Má veľmi nízku mieru odmietania, hodí sa na fikciu a voľné rozhovory bez filtrov. Prijíma obrázky, má kontext 128 000 tokenov a stojí málo. Doladenie odstránilo odmietanie odpovedí, no zachovalo pohľad modelu Mistral pri politike a temných scénach. Odlišný pohľad ponúka UncensoredLM. Na programovanie a náročnú analýzu je vhodnejší Qwen 3.6 Plus Uncensored.",
        veniceUncensoredRoleplay:
          "Model od Venice s 24 miliardami parametrov, doladený na hranie rolí bez odmietania. Postavy si držia spôsob reči aj počas dlhých príbehov, ktoré model neprerušuje poučovaním. Prijíma obrázky a má kontext 128 000 tokenov. Zachováva pohľad základného modelu. UncensoredLM ide ďalej pri najtemnejších a tabuizovaných témach. Tento model vyniká v dlhých príbehoch a práci s obrázkami. Na analýzu a programovanie vyberte iný model.",
        gemma4Uncensored:
          "Model Gemma 4 od Googlu s architektúrou MoE a 26 miliardami parametrov v upravenej verzii od Venice bez obsahového filtra. Je rýchly, lacný, spracúva obrázky a volá nástroje. Kontext má 256 000 tokenov. Pri citlivých témach odpovie, pričom si zachováva pohľad z tréningu Googlu. Na náročnejšie uvažovanie bez odmietania ponúka GLM 5.3 Flash Uncensored vyšší výkon za trochu vyššiu cenu.",
        qwen36PlusUncensored:
          "Model Qwen 3.6 Plus od Alibaby s odstráneným odmietaním cez Venice. Patrí medzi najsilnejšie modely bez cenzúry na programovanie a analýzu. Spracúva obrázky, volá nástroje a má kontext 256 000 tokenov. Zachováva pohľad pôvodného modelu. Odlišný politický pohľad ponúka UncensoredLM. Stojí viac ako modely Flash. Ďalšou výkonnou možnosťou je GLM 5.3 Uncensored s kontextom 1 milión tokenov a textovým vstupom.",
        glm47FlashHeretic:
          "GLM 4.7 Flash s odstráneným odmietaním. Odpovedá rýchlo, volá nástroje a jedna správa stojí pár centov. Hodí sa na četovanie bez filtrov aj tvorivé písanie. Tréning a pohľad základného GLM zostali rovnaké. Pri dôkladnej analýze je slabší. Novší a schopnejší GLM 5.3 Flash Uncensored stojí o niečo viac.",
        glm53Abliterated:
          "Plný GLM 5.3 s odmietaním odstráneným z váh od Abliteration.ai. Ponúka špičkové uvažovanie, volanie nástrojov a kontext 1 milión tokenov. Zachováva pohľad a rámec základného modelu GLM.",
        deepseekV41FlashAbliterated:
          "DeepSeek V4.1 Flash bez odmietania od Abliteration.ai. Model MoE s 552 miliardami parametrov zvláda náročné uvažovanie, spracúva obrázky a volá nástroje. Kontext má 1 milión tokenov. Zachováva pohľad základného modelu DeepSeek.",
        mimoV26FlashAbliterated:
          "MiMo V2.6 Flash od Xiaomi s odstráneným odmietaním. Je rýchly, spracúva obrázky, volá nástroje a má kontext 1 milión tokenov. Hodí sa na veľké množstvo úloh bez filtrov. Rýchlosť uprednostňuje pred hĺbkou a zachováva pohľad základného modelu. Pri podobných úlohách stojí viac ako dvojnásobok ceny GLM 5.3 Flash Uncensored.",
        glm53Uncensored:
          "Plný model GLM 5.3 od Z.AI s odstráneným odmietaním. Silná voľba bez cenzúry na programovanie, dlhé texty, analýzu a volanie nástrojov. Kontext má 1 milión tokenov. Pri politike zachováva pohľad základného GLM. Názory mimo hlavného prúdu ponúka UncensoredLM. Model je experimentálny, spracúva len text a je pomalší ako modely Flash. Na bežné úlohy je rýchlejší a lacnejší GLM 5.3 Flash Uncensored.",
        glm53FlashUncensored:
          "GLM 5.3 Flash od Z.AI s odstráneným odmietaním a architektúrou MoE s 320 miliardami parametrov. Je rýchly, lacný, spracúva obrázky a volá nástroje. Kontext má 1 milión tokenov. Hodí sa na každodennú prácu bez filtrov a zachováva pohľad základného GLM aj pri politike. Odlišný pohľad ponúka UncensoredLM. Pri najťažších úlohách uvažovania zvoľte plný GLM 5.3 Uncensored.",
        veniceLustifyV8:
          "Variant SDXL od Venice.ai doladený na fotorealistický obsah pre dospelých. Obrázky nerozmazáva a neodmieta zadania. Patrí medzi najlacnejšie obrazové modely. Silnou stránkou je zobrazenie ľudského tela. V textoch v obrázkoch, zložitých scénach a rozmanitosti štýlov je slabší než Chroma.",
        veniceChroma:
          "Model s otvorenými váhami od Venice.ai vychádza z FLUX.1 schnell a bol pretrénovaný bez obsahového filtra. Zvláda dlhé zadania a rôzne výtvarné štýly vrátane explicitného obsahu. Cena za obrázok je nízka. Lustify v8 je viac zameraný na fotorealistickú nahotu. Tento model prijíma len text. Na úpravu existujúceho obrázka použite Qwen Edit Uncensored.",
        veniceQwenEdit:
          "Model od Venice.ai na úpravu obrázkov bez cenzúry vychádza z radu Qwen od Alibaby. Pridajte referenčný obrázok a pokyn na výmenu prvkov, zmenu štýlu, oblečenia alebo celej scény. Model obrázky nerozmazáva ani neodmieta pokyny. Stojí viac ako Chroma alebo Lustify v8, ktoré tvoria obrázky len z textu.",
        veniceFireredImageEdit:
          "Editor obrázkov od Venice.ai sa riadi slovným zadaním. Mení určené časti obrazu a ostatné zachováva. Patrí do kategórie bez cenzúry a neodmieta zadania. Označenie pre explicitný výstup má Qwen Edit Uncensored. Oba modely stoja rovnako, takže pri zložitých úpravách sa oplatí vyskúšať oba.",
        claudeOpus45:
          "Prvý cenovo dostupnejší Opus od Anthropicu vyšiel v novembri 2025. Vo svojej dobe patril medzi špičkové modely na programovanie a prácu s agentmi. Vyniká pri dôslednom písaní a zložitom kóde. Kontext má 200 000 tokenov. Pri kontroverzných témach je opatrný. Claude Opus 5.5 je novší a lacnejší.",
        claudeOpus46:
          "Opus od Anthropicu z februára 2026 bol prvým modelom radu s kontextovým oknom 1 milión tokenov. Zvláda dlhé programovanie s agentmi, dôkladnú analýzu a presné písanie. Patrí medzi drahšie modely a používa bežné filtre. Pri kontroverzných témach je opatrný. Claude Opus 5.5 je novší a lacnejší.",
        claudeOpus47:
          "Opus z roku 2026 medzi verziami 4.6 a 4.8. Zvláda dôkladné uvažovanie, zložité programovanie a dlhé texty s kontextom 1 milión tokenov. Patrí medzi drahšie modely a pri kontroverzných témach je opatrný. Nahradil ho Claude Opus 5.5 s nižšou cenou za správu.",
        claudeOpus48:
          "Posledné vydanie Opus 4 je určené na dlhú prácu agentov, zložité programovanie a veľmi dlhé výstupy. Prijíma obrázky a má kontext 1 milión tokenov. Patrí medzi drahšie modely, používa bežné obsahové filtre a pri kontroverzných témach je opatrný. Claude Opus 5.5 je novší a lacnejší.",
        claudeSonnet46:
          "Sonnet od Anthropicu zo začiatku roka 2026 vylepšil programovanie, prácu agentov a kancelárske úlohy oproti verzii 4.5. Má kontext 1 milión tokenov. Používa bežné filtre a pri kontroverzných témach je opatrný. Nahradil ho Claude Sonnet 5.5 s nižšou cenou za správu.",
        claudeHaiku45:
          "Malý model od Anthropicu z októbra 2025. Rýchlo odpovedá, dobre zvláda bežné programovanie a spracúva obrázky. Kontext má 200 000 tokenov. Používa bežné filtre a pri kontroverzných témach je opatrný. Claude Haiku 5.5 stojí približne desatinu.",
        glm5_1:
          "Programovací model od Z.AI na dlhé úlohy. Podľa výrobcu vie na jednej úlohe pracovať celé hodiny. Dobre plánuje, programuje a zvláda prácu agentov s viacerými krokmi. Pracuje len s textom, má otvorené pravidlá pre obsah a kontext 200 000 tokenov. Novší GLM-5.3 stojí zlomok ceny, ale patrí do nižšej výkonovej triedy. Výkonnejšou otvorenou voľbou je Kimi K3.",
        glm5: "Vlajkový model od Z.AI s otvorenými váhami zo začiatku roka 2026. Je určený na návrh systémov a dlhú prácu agentov. Dobre uvažuje a programuje, spracúva len text a má otvorené pravidlá pre obsah. Kontext má 200 000 tokenov. Novší GLM-5.3 je oveľa lacnejší, ale patrí do nižšej výkonovej triedy. Výkonnejšou otvorenou alternatívou je Kimi K3.",
        glm5Turbo:
          "Rýchlejší GLM-5 doladený na opakované kroky agentov. Rýchlo generuje odpovede, presne rozdeľuje úlohy na kroky a dlhšie si drží ich smer. Hodí sa na automatizáciu s častým volaním nástrojov. Pracuje len s textom, má otvorené pravidlá pre obsah a kontext 200 000 tokenov. GLM-5.3 zvláda podobnú prácu za zlomok ceny.",
        glm46:
          "Vydanie Z.AI zo septembra 2025 rozšírilo kontext na 200 000 tokenov a zlepšilo programovanie aj prácu s agentmi. Je to všestranný dvojjazyčný model s otvorenými pravidlami pre obsah a textovým vstupom. GLM-5.3 je novší a lacnejší.",
        glm47:
          "Čínsko-anglický model od Z.AI z decembra 2025. Programuje a uvažuje lepšie ako verzia 4.6. Hodí sa na četovanie, analýzu a úlohy agentov. Spracúva len text, má otvorené pravidlá pre obsah a kontext 200 000 tokenov. Novší GLM-5.3 stojí približne štvrtinu.",
        glm47Flash:
          "Malý a rýchly GLM 4.7 patrí medzi najlacnejšie modely v ponuke. Hodí sa na rýchle rozhovory, jednoduché volania nástrojov a hromadné spracovanie textu. Kontext má 200 000 tokenov. Pri dôkladnom uvažovaní je slabší. Novší GLM-5.3 Flash stojí približne dvojnásobok.",
        kimiK2:
          "Model Moonshot AI s otvorenými váhami z júla 2025. Architektúra MoE má bilión parametrov. Presadil sa programovaním a volaním nástrojov agentmi. Je rýchly, spracúva len text, má otvorené pravidlá pre obsah a kontext 262 000 tokenov. Nemá režim rozšíreného uvažovania. Novší vlajkový Kimi K3 stojí približne dvojnásobok.",
        kimiK2_5:
          "Kimi od Moonshot AI z januára 2026 je multimodálny a prijíma obrázky. Dobre programuje s dlhým kontextom, premieňa snímky obrazovky na kód a zvláda tvorivé písanie. Má otvorené pravidlá pre obsah a kontext 262 000 tokenov. Kimi K3 je novší, ale stojí približne dvojnásobok.",
        kimiK2_6:
          "Kimi K2.6 od Moonshot AI je určený na dlhé programátorské úlohy, tvorbu rozhraní zo zadania alebo snímok obrazovky a súbežnú prácu viacerých podagentov. Je rýchly a výkonný, prijíma obrázky, má otvorené pravidlá pre obsah a kontext 262 000 tokenov. Kimi K3 je novší a drahší.",
        claudeSonnet45:
          "Sonnet od Anthropicu zo septembra 2025 sa presadil programovaním a dlhými samostatnými reláciami agentov. Stále dobre programuje a píše. V ponuke má kontext 1 milión tokenov. Pri kontroverzných témach je opatrný a pri hraní rolí slabší. Claude Sonnet 5.5 je novší a stojí menej za správu.",
        claudeAgentSonnet:
          "Claude Agent Sonnet. Samostatný agent AI využíva Claude Sonnet cez Agent SDK od Anthropicu. Sám uvažuje a volá nástroje.",
        claudeAgentHaiku:
          "Claude Agent Haiku. Rýchly samostatný agent AI využíva Claude Haiku cez Agent SDK od Anthropicu. Volá nástroje s dôrazom na rýchlosť.",
        claudeAgentOpus:
          "Claude Agent Opus - Najvýkonnejší autonómny AI agent poháňaný Claude Opus prostredníctvom antropického agenta SDK. Maximálna inteligencia s popravou nástrojov.",
        grok4:
          "Vlajkový model od xAI z júla 2025 vždy uvažuje pred odpoveďou. Vyniká v matematike, vede a analýze a používa miernejšie filtre ako väčšina bežných modelov. Odpovedá pomalšie ako jednoduché konverzačné modely. Novší Grok 4.7 stojí viac.",
        grok4Fast:
          "Starší model Grok od xAI zameraný na rýchlosť. Lacný variant Fast už výrobca ukončil, takže pod týmto názvom teraz beží Grok 4.3 za cenu Grok 4.3. Spracúva obrázky, volá nástroje, má otvorené pravidlá pre obsah a kontext 1 milión tokenov. Nástupca Grok 4.7 uvažuje dôkladnejšie a jeho výstup stojí približne dvojnásobok. Na rýchle a lacné rozhovory stoja MiniMax M3.1 Flash a DeepSeek V4.1 Flash zlomok ceny.",
        grok43:
          "Neskoršia verzia Grok 4 má trvalo zapnuté uvažovanie a kontext 1 milión tokenov. Je určená na prácu agentov a hĺbkový výskum, spracúva obrázky, volá nástroje a má otvorené pravidlá pre obsah. Stojí rovnako ako Grok 4. Novší Grok 4.7 je drahší.",
        grok420Beta:
          "Bývalý vlajkový model xAI s kontextovým oknom 2 milióny tokenov, volaním nástrojov agentmi a obrazovým vstupom. Pri otvorených pravidlách pre obsah zvláda rozsiahle dokumenty a dlhú prácu agentov. Grok 4.7 je novší a drahší.",
        gpt5Pro:
          "GPT-5 s rozšíreným uvažovaním od OpenAI z roku 2025 na najťažšie otázky. Odpovedá dôkladne, ale pomaly a na staršiu generáciu je veľmi drahý. Novší model GPT-6 Astra triedy Pro stojí menej.",
        gpt5Codex:
          "GPT-5 Codex. Špecializovaný model OpenAI na programovanie a náročné technické úlohy.",
        gpt51Codex:
          "GPT-5.1 doladený na programovanie s agentmi v OpenAI Codex. Zvláda dlhé cykly úprav, spúšťania a opráv v reálnych projektoch. Má kontext 400 000 tokenov a pri programovaní ponúka dobrý pomer ceny a výkonu. Menej sa hodí na voľné rozhovory a písanie. Novší GPT-6.1 Sol ho prekonáva.",
        gpt51:
          "Aktualizácia GPT-5 od OpenAI z novembra 2025 pridala prispôsobivé uvažovanie a srdečnejší tón. Dlhšie uvažuje len nad náročnými otázkami. Je to schopný univerzálny model s kontextom 400 000 tokenov a obrazovým vstupom. GPT-6.1 Sol je novší a presnejší za o niečo vyššiu cenu za správu.",
        gpt5: "Vlajkový model OpenAI z augusta 2025 spojil rýchle odpovede a dôkladné uvažovanie. Stále spoľahlivo četuje, píše a programuje, spracúva obrázky a má kontext 400 000 tokenov. Novší a výkonnejší GPT-6.1 Sol stojí o niečo viac za správu.",
        gpt54Mini:
          "Menší variant GPT-5.4 dobre uvažuje, programuje a používa nástroje za nižšiu cenu. Prijíma obrázky a má kontext 400 000 tokenov. Hodí sa na veľa konverzácií a prácu podagentov. Novší GPT-6 Luna stojí oveľa menej za správu a uprednostňuje rýchlosť pred hĺbkou.",
        gpt54Nano:
          "Najmenší variant GPT-5.4 od OpenAI je určený na triedenie, získavanie údajov a rýchle volania podagentov. Je lacný, rýchly, pracuje s obrázkami a volá nástroje. Na dôkladnú analýzu je príliš slabý. Novší úsporný GPT-6 Luna stojí ešte menej.",
        gpt5Mini:
          "Kompaktný GPT-5 na bežné úlohy, krátke odpovede, súhrny a jednoduché volania nástrojov. Má kontext 400 000 tokenov. Je lacný a rýchly, pri dôkladnej analýze slabší. Novší GPT-6 Luna stojí približne tretinu.",
        gpt5Nano:
          "Najmenší model radu GPT-5 od OpenAI stále patrí k najlacnejším v ponuke. Hodí sa na triedenie, označovanie a krátke odpovede pri veľkom objeme. Na programovanie a dôkladnú analýzu je slabý. Novší úsporný GPT-6 Luna stojí o niečo viac.",
        gptOss120b:
          "Model OpenAI s otvorenými váhami a licenciou Apache 2.0. Architektúra MoE má spolu 117 miliárd parametrov. Model dobre uvažuje a programuje za pár centov, volá nástroje a pracuje len s textom. Kontext má 131 000 tokenov. Jeho filtre sú miernejšie než pri rade GPT-6 od OpenAI. GLM-5.3 stojí približne rovnako a ponúka kontext 1 milión tokenov.",
        kimiK2Thinking:
          "Variant modelu Kimi K2 z novembra 2025 uvažuje aj pri stovkách nadväzujúcich volaní nástrojov a drží sa úlohy. Hodí sa na výskum a prácu agentov s viacerými krokmi za nízku cenu. Má otvorené pravidlá pre obsah, spracúva len text a je pomalší ako bežný K2. Novšou možnosťou je Kimi K3.",
        minimaxM27:
          "Model MiniMax pre praktické úlohy agentov, napríklad ladenie, finančné modelovanie, tvorbu dokumentov a spoluprácu viacerých agentov. Je schopný, lacný, spracúva len text, má otvorené pravidlá pre obsah a kontext 196 000 tokenov. Nahradil ho lacnejší a výkonnejší multimodálny MiniMax M3.1 Flash s kontextom 1 milión tokenov.",
        mimoV2Pro:
          "Vlajkový model Xiaomi z radu MiMo V2 je určený na koordináciu agentov a dlhé vývojové úlohy. Má kontext 1 milión tokenov, dobre uvažuje a programuje za nízku cenu. Pracuje len s textom a má otvorené pravidlá pre obsah. MiMo V2.6 Pro je novší a o niečo lacnejší.",
        glm45Air:
          "Ľahký GLM 4.5 s architektúrou MoE a 106 miliardami parametrov, z ktorých je aktívnych len 12 miliárd. Odpovedá rýchlo a lacno. Na bežné rozhovory a jednoduché úlohy má kontext 128 000 tokenov a textový vstup. V uvažovaní zaostáva za novšími modelmi. GLM-5.3 Flash je novší a lacnejší.",
        glm45v:
          "Obrazový model od Z.AI vychádza z GLM-4.5-Air s architektúrou MoE a 106 miliardami parametrov. Spracúva snímky obrazovky, grafy a fotky, četuje a volá nástroje. Má kontext 64 000 tokenov a slabšie uvažovanie než novšie modely. GLM-5.3 Flash je novší a lacnejší.",
        geminiFlash25Lite:
          "Najlacnejší Gemini od Googlu z roku 2025 stojí pár centov za správu. Má kontext 1 milión tokenov a prijíma text, obrázky, video a zvuk. Hodí sa na hromadné označovanie, preklady a krátke odpovede. Pri uvažovaní je slabší. Novší Gemini 3.5 Flash Lite stojí takmer štvornásobok.",
        geminiFlash25Flash:
          "Hybridný model z radu Flash od Googlu z roku 2025 s nastaviteľným rozsahom uvažovania. Má kontext 1 milión tokenov a prijíma text, obrázky, video a zvuk. Je rýchly a lacný na súhrny a bežné rozhovory. Novší a výkonnejší Gemini 3.8 Flash stojí približne dvojnásobok.",
        geminiFlash25Pro:
          "Model od Googlu z roku 2025 s kontextom 1 milión tokenov. Vo svojej dobe dobre analyzoval dlhé dokumenty a programoval. Novší model triedy Pro, Gemini 4 Argon, stojí o niečo viac.",
        deepseekV31:
          "Hybridný model DeepSeek z augusta 2025 prepína medzi rýchlou odpoveďou a uvažovaním krok za krokom. Je schopný a lacný pri programovaní, má architektúru MoE s 671 miliardami parametrov a otvorenými váhami a spracúva len text. Novší DeepSeek V4.1 Flash stojí približne tretinu.",
        deepseekR1:
          "Model s otvorenými váhami z januára 2025 ukázal, že aj zobrazené uvažovanie môže byť lacné. Stále dobre zvláda matematiku a logiku, ale odpovedá pomaly a zdĺhavo. K politickým témam, ktoré Čína považuje za citlivé, sa vyjadruje zdržanlivo. Novší DeepSeek V4.1 Flash stojí zlomok ceny.",
        qwen3235bFree:
          "Qwen3 235B od Alibaby s otvorenými váhami a architektúrou MoE má 22 miliárd aktívnych parametrov. Dobre programuje a uvažuje za nízku cenu, volá nástroje a má kontext 131 000 tokenov. Spracúva len text. Novší Qwen 3.8 Flash spracúva aj obrázky a stojí približne rovnako.",
        deepseekR1Distill:
          "Malá destilovaná verzia DeepSeek R1 založená na modeli Qwen lacno uvažuje krok za krokom. Pracuje len s textom a má kontext 32 000 tokenov. Už ho neposkytuje žiadny poskytovateľ. Nahradil ho výkonnejší DeepSeek V4.1 Flash. Spracúva aj obrázky, má kontext 1 milión tokenov a stojí takmer nič.",
        qwen257b:
          "Malý model od Alibaby z roku 2024 so 7 miliardami parametrov a otvorenými váhami. Lacno a rýchlo zvláda jednoduché rozhovory, krátke úpravy textu a základné preklady. Kontext má 32 000 tokenov. V programovaní a analýze zaostáva za novšími modelmi. Qwen 3.8 Flash je výkonnejšou voľbou za mierne vyššiu cenu.",
        dallE3:
          "DALL-E 3. Model OpenAI vytvára kvalitné a detailné obrázky podľa textového zadania.",
        gptImage1:
          "GPT-Image-1. Rýchly a cenovo dostupný model OpenAI na tvorbu obrázkov.",
        fluxSchnell:
          "Flux Schnell. Model od Black Forest Labs na rýchlu tvorbu obrázkov.",
        fluxPro:
          "Osvedčený model radu FLUX.1 od Black Forest Labs na tvorbu obrázkov z textu. Má čisté kompozície, drží sa zadania a rýchlo odpovedá. Prijíma len text. FLUX.2 Pro stojí približne polovicu a prijíma aj referenčné obrázky. Tento model má zmysel najmä pri zadaniach, ktoré sú už preň vyladené.",
        flux2Max:
          "Najvyššia trieda radu FLUX.2 od Black Forest Labs. Vytvára obrázky z textu a upravuje ich podľa referencií. Má najlepšie detaily a konzistentnosť z radu, no stojí niekoľkonásobok ceny FLUX.2 Pro. Hodí sa na hlavné vizuály a náročné úpravy podľa viacerých referencií. Pri bežnej práci si vystačíte s FLUX.2 Pro. Nástupca FLUX.3 je ostrejší a lacnejší za obrázok.",
        flux2Klein4b:
          "FLUX.2 Klein 4B. Najrýchlejší a najúspornejší obrazový model od Black Forest Labs na veľké množstvo požiadaviek. Nahradil ho FLUX.3 Klein.",
        riverflowV2Pro:
          "Riverflow V2 Pro. Najvýkonnejší obrazový model od Sourceful. Ponúka presnú kontrolu nad výsledkom a bezchybne vykresľuje text.",
        riverflowV2Fast:
          "Riverflow V2 Fast. Najrýchlejší obrazový model od Sourceful pre produkčné nasadenia a úlohy, pri ktorých záleží na krátkom čase odozvy.",
        riverflowV2MaxPreview:
          "Riverflow V2 Max Preview. Najvýkonnejší predbežný variant od Sourceful tvoril obrázky z textu aj z obrázkov. Poskytovateľ predbežnú verziu ukončil. Použite Riverflow V2 Pro.",
        riverflowV2StandardPreview:
          "Riverflow V2 Standard Preview. Štandardný predbežný variant od Sourceful tvoril obrázky z textu aj z obrázkov a prekonával rad Riverflow 1. Poskytovateľ predbežnú verziu ukončil. Použite Riverflow V2 Pro.",
        riverflowV2FastPreview:
          "Riverflow V2 Fast Preview. Najrýchlejší a najlacnejší predbežný variant od Sourceful tvoril obrázky z textu aj z obrázkov. Poskytovateľ predbežnú verziu ukončil. Použite Riverflow V2 Fast.",
        flux2Flex:
          "FLUX.2 Flex. Obrazový model od Black Forest Labs vyniká v zložitom vykresľovaní textu, typografii a úpravách podľa viacerých referenčných obrázkov.",
        flux2Pro:
          "Všestranný FLUX.2 od Black Forest Labs na tvorbu aj úpravu obrázkov. Prijíma text a referenčné obrázky, zachováva vzhľad postáv a výrobkov a dobre zvláda dlhé zadania. Stojí stredne veľa. Otvorená kategória používa miernejšie filtre než Imagen 4. Explicitný obsah podporujú Chroma a Lustify v8. Ak naozaj záleží na detailoch, použite FLUX.2 Max.",
        gemini3ProImagePreview:
          "Gemini 3 Pro Image od Googlu v predbežnej verzii. Lepšie ako základný Nano Banana dodržiava zložité zadania, kreslí čitateľný text do obrázkov a upravuje nahraté obrázky. Používa bežné filtre, nevolá nástroje a má kontext 64 000 tokenov. Stojí niekoľkonásobok ceny Nano Banana, takže sa oplatí, keď záleží na kvalite.",
        gpt5ImageMini:
          "GPT-5 Image Mini od OpenAI spája jazykové schopnosti GPT-5 Mini s tvorbou a úpravou obrázkov v jednom čete. Spracúva obrázky a má kontext 400 000 tokenov. Používa bežné filtre a nevolá nástroje. Stojí viac ako Nano Banana a približne rovnako ako Nano Banana Pro. Porovnajte ich na vlastnom zadaní. OpenRouter ho ukončí 1. decembra 2026. V čete použite Nano Banana 2.1 alebo GPT Image 2.6 Flare, ak chcete výsledky od OpenAI.",
        gpt5Image:
          "GPT-5 spojený s obrazovým modelom OpenAI. V jednej konverzácii môžete četovať, pridávať obrázky a vytvárať alebo upravovať vizuály slovnými pokynmi. Model nevolá nástroje a má vysokú cenu za správu. Lacnejšou možnosťou je GPT-5 Image Mini. Oplatí sa porovnať aj Nano Banana Pro.",
        gpt54Image2:
          "Spája uvažovanie GPT-5.4 s tvorbou obrázkov GPT Image 2. V tom istom čete prejdete od analýzy alebo programovania k hotovým obrázkom. Prijíma obrázky, nevolá nástroje a stojí veľa. GPT-5 Image Mini je výrazne lacnejší. Ďalšími možnosťami sú Nano Banana a Nano Banana Pro.",
        seedream45:
          "Model od ByteDance na tvorbu aj úpravu obrázkov. Dobre zvláda portréty, zachováva vzhľad objektov a spája niekoľko obrázkov do jednej scény. Cena je podobná ako pri FLUX.2 Pro. Otvorená kategória má miernejšie filtre ako bežné modely. Explicitné zadania nepodporuje. Je ďalšou možnosťou, keď vám vzhľad z FLUX.2 Pro nevyhovuje. Nahradil ho Seedream 5.5 za polovicu ceny.",
        sdxl: "Stable Diffusion XL. Otvorený model od Stability AI na tvorbu kvalitných obrázkov.",
        cassetteMusic:
          "CassetteAI Music. Pomocou Fal.ai rýchlo vytvorí hudbu z textu. Skladby môžu mať až tri minúty.",
        musicgenStereo:
          "Stereofónny MusicGen od Meta s otvoreným zdrojovým kódom. Z textového opisu žánru, nálady alebo nástrojov tvorí inštrumentálnu hudbu bez spevu a textu. Je lacný a hodí sa na podkladovú hudbu a slučky. Pre skladby so spevom použite ElevenLabs Music alebo Sonauto Song.",
        stableAudio:
          "Stable Audio. Model od Stability AI na tvorbu kvalitnej hudby a zvukových ukážok.",
        udioV2:
          "Udio v2. Vytvára plnohodnotné skladby so spevom v produkčnej kvalite.",
        modelsLabMusicGen:
          "Model od ModelsLab na tvorbu hudby z textu s výstupom MP3, WAV alebo FLAC. Tvorí podkladovú hudbu a znelky podľa zadania. Stojí niekoľkonásobne viac ako Lyria 3 alebo MusicGen Stereo. Základný model nie je zdokumentovaný. Kvalitu za nižšiu cenu ponúka Lyria 3.",
        modelsLabElevenlabsMusic:
          "Model od ElevenLabs tvorí podľa zadania celé skladby so spevom a textom vo viacerých jazykoch aj inštrumentálne skladby. Používa bežné obsahové filtre. Patrí medzi drahšie hudobné modely a hodí sa na dotiahnuté skladby pripravené do rádia. Lacnejšie celé skladby so spevom vytvorí Sonauto Song.",
        modelsLabSonautoSong:
          "Sonauto tvorí celé skladby so spevom a textom v rôznych žánroch za nízku cenu. Patrí do otvorenej kategórie a má miernejšie filtre než ElevenLabs. Produkčná kvalita kolíše. Čistejšiu zvukovú zmes ponúkajú ElevenLabs Music a Lyria 3 Pro Preview za vyššiu cenu.",
        modelsLabLyria3:
          "Lyria 3 od Googlu vytvára z textového zadania pôvodné skladby dlhé približne 30 sekúnd vo vysokej produkčnej kvalite a za nízku cenu. Platia filtre Googlu. Celé skladby vytvorí Lyria 3 Pro Preview.",
        modelsLabCogVideoX:
          "CogVideoX. Model od ModelsLab na tvorbu krátkych videí z textu.",
        modelsLabWanx: "Wanx. Model od ModelsLab na tvorbu videí z textu.",
        modelsLabWan22:
          "Wan 2.2 Ultra. Model od ModelsLab na tvorbu kvalitných videí z textu.",
        modelsLabWan21:
          "Wan 2.1 Ultra. Model od ModelsLab na tvorbu videí z textu vo vyššej kvalite.",
        modelsLabWan25T2V:
          "Wan 2.5 T2V. Model Wan 2.5 od ModelsLab na tvorbu videí z textu.",
        modelsLabWan25I2V:
          "Wan 2.5 I2V. Model Wan 2.5 od ModelsLab na tvorbu videí z obrázkov.",
        modelsLabWan27T2V:
          "Wan 2.7 od Alibaby tvorí videá do 10 sekúnd (cez ModelsLab do 15 sekúnd) v rozlíšení až 1080p. Podporuje rôzne pomery strán, zvuk a voliteľný prvý aj posledný záber. Má strednú cenu za sekundu a široké využitie. Na lacnejšie skúšky sa hodí Seedance 1.5 Pro, na vernejší obraz Veo 3.1. Nástupca Wan 3.0 pri rovnakej cene za 720p vytvára videá do 30 sekúnd.",
        modelsLabWan26T2V:
          "Wan 2.6 T2V. Model Wan 2.6 od ModelsLab na tvorbu videí z textu.",
        modelsLabWan26I2V:
          "Wan 2.6 od Alibaby na tvorbu videa z obrázka. Rozhýbe úvodný záber aj so zvukom. Klipy majú 5 alebo 10 sekúnd v rozlíšení 720p alebo 1080p na šírku či na výšku. Cena za sekundu je podobná ako pri Wan 2.7. Na zadanie posledného záberu alebo ďalšie pomery strán použite Wan 2.7 T2V.",
        modelsLabWan26I2VFlash:
          "Rýchly variant Wan 2.6 na tvorbu videa z obrázka. Skracuje čakanie na 5- alebo 10-sekundový klip v rozlíšení 720p alebo 1080p. Má rovnakú cenu za sekundu ako Wan 2.6 I2V. Pri rýchlom variante nie je uvedená podpora zvuku. Štandardný variant zvuk podporuje.",
        modelsLabSeedanceT2V:
          "Seedance T2V. Model od BytePlus na tvorbu videí z textu.",
        modelsLabSeedanceI2V:
          "Seedance I2V. Model od BytePlus na tvorbu videí z obrázkov.",
        modelsLabOmnihuman:
          "Omnihuman. Model od BytePlus na tvorbu videí s ľuďmi.",
        modelsLabSeedance1ProI2V:
          "Seedance 1.0 Pro I2V. Profesionálny model od BytePlus na tvorbu videí z obrázkov.",
        modelsLabSeedance1ProFastI2V:
          "Seedance 1.0 Pro Fast I2V. Rýchly profesionálny model od BytePlus na tvorbu videí z obrázkov.",
        modelsLabSeedance1ProFastT2V:
          "Seedance 1.0 Pro Fast T2V. Rýchly profesionálny model od BytePlus na tvorbu videí z textu.",
        modelsLabOmnihuman15:
          "OmniHuman 1.5 od ByteDance rozhýbe človeka z jednej fotografie podľa zvukovej stopy. Vytvára hovoriace a spievajúce postavy aj gestá. Špecializuje sa na avatarov a dabing. Stojí viac za sekundu ako väčšina modelov strednej triedy. Na scény bez hovoriaceho človeka použite Kling 3.0 alebo Wan 2.7.",
        modelsLabSeedance15Pro:
          "Seedance 1.5 Pro od ByteDance cez cloud BytePlus vytvára z textu videá so zvukom, v rozlíšení od 480p do 1080p na šírku aj na výšku. Patrí k najlacnejším modelom za klip a rozlíšenie 480p stojí polovicu sadzby 720p. Hodí sa na skúšanie nápadov a väčšie množstvo videí. Seedance 2.0 pridáva ovládanie záberov, konzistentnejší vzhľad a 4K.",
        modelsLabVeo2:
          "Veo 2. Model od Googlu na tvorbu kvalitných videí cez ModelsLab.",
        modelsLabVeo3: "Veo 3. Model od Googlu na tvorbu videí cez ModelsLab.",
        modelsLabVeo3Fast:
          "Veo 3 Fast. Rýchly model od Googlu na tvorbu videí cez ModelsLab.",
        modelsLabVeo3FastPreview:
          "Veo 3 Fast Preview. Predbežná verzia rýchleho modelu od Googlu na tvorbu videí cez ModelsLab.",
        modelsLabVeo31:
          "Vlajkový video model od Googlu. Vytvára realistické filmové klipy od 4 do 8 sekúnd v rozlíšení až 4K, so zvukom, dialógmi a efektmi. Umožňuje určiť prvý aj posledný záber. Je najdrahším video modelom v katalógu a hodí sa na hotové zábery. Návrhy pripravíte za zlomok ceny cez Veo 3.1 Fast.",
        modelsLabVeo31Fast:
          "Rýchlejší a lacnejší Veo 3.1 od Googlu. Vytvára rovnaké klipy od 4 do 8 sekúnd so zvukom, v rozlíšení až 4K a s ovládaním záberov, za približne tretinu až polovicu ceny plného Veo 3.1. Pri náročných záberoch má o niečo nižšiu vernosť. Na bežnú prácu ponúka dobrý pomer ceny a kvality. Veo 3.1 Lite stojí ešte menej.",
        modelsLabKlingV21I2V:
          "Kling V2.1 I2V. Model od Kling AI vo verzii 2.1 na tvorbu videí z obrázkov.",
        modelsLabKlingV25TurboI2V:
          "Kling 2.5 Turbo na tvorbu videa z obrázka. Rýchlo a lacno rozhýbe statický obrázok do krátkeho klipu so živým pohybom. Podpora zvuku nie je uvedená. Kling 3.0 pridáva zvuk a až 15-sekundové klipy za vyššiu cenu.",
        modelsLabKlingV25TurboT2V:
          "Kling 2.5 Turbo vytvára z textu klipy dlhé 5 alebo 10 sekúnd v pomere 16:9, 9:16 alebo 1:1. Je medzi najlacnejšími v katalógu a ponúka dobrý pohyb bez zvuku. Kling 3.0 T2V pridáva zvuk a až 15-sekundové videá.",
        modelsLabKlingV2MasterT2V:
          "Kling V2 Master T2V. Špičkový model od Kling AI na tvorbu videí z textu.",
        modelsLabKlingV2MasterI2V:
          "Kling V2 Master I2V. Špičkový model od Kling AI na tvorbu videí z obrázkov.",
        modelsLabKlingV21MasterT2V:
          "Kling 2.1 Master je prémiový variant radu 2.1. Z textu tvorí verné klipy dlhé 5 alebo 10 sekúnd. Patrí medzi najdrahšie možnosti a stojí približne trojnásobok ceny novšieho Kling 3.0 T2V, ktorý pridáva zvuk. Oplatí sa najmä pri zadaniach, ktoré tu už dobre fungujú.",
        modelsLabKlingV21MasterI2V:
          "Kling 2.1 Master animuje obrázok do verného 5- alebo 10-sekundového klipu. Stojí približne trojnásobok ceny novšieho Kling 3.0 so zvukom. Vyberte si ho, ak potrebujete jeho konkrétny vzhľad. Lacnou alternatívou je Kling V2.5 Turbo I2V.",
        modelsLabKlingV16MultiI2V:
          "Kling V1.6 Multi I2V. Model od Kling AI vo verzii 1.6 na tvorbu videí z viacerých obrázkov.",
        modelsLabKling30T2V:
          "Kling 3.0 Pro od Kuaishou tvorí klipy od 3 do 15 sekúnd so zvukom v rozlíšení 720p. Podporuje prvý a posledný záber aj pomery 16:9, 9:16 a 1:1. Ponúka živý, presvedčivý pohyb za strednú cenu. Pre 1080p a viac použite Veo 3.1 Fast alebo Hailuo 3. Pri tvorbe z obrázka je lacnejší Kling 3.0 Std.",
        modelsLabLtx2ProT2V:
          "LTX-2 Pro od Lightricks tvorí z textu klipy dlhé približne 6 až 10 sekúnd v rozlíšení 2K alebo 4K. Ponúka strednú cenu za toto rozlíšenie a lacnejšiu cestu k 4K ako Veo 3.1. Podpora zvuku tu nie je uvedená. Zvuk v rozlíšení 4K ponúka Veo 3.1 Fast.",
        modelsLabLtx2ProI2V:
          "LTX 2 PRO I2V. Profesionálny model od LTX na tvorbu videí z obrázkov.",
        modelsLabLtx23ProI2V:
          "LTX 2.3 Pro od Lightricks animuje obrázok do 6- až 10-sekundového klipu v rozlíšení 2K alebo 4K. Je novší a o niečo drahší ako LTX 2 Pro. Hodí sa, keď má obrázok vo vysokom rozlíšení zostať ostrý aj v pohybe. Podpora zvuku nie je uvedená.",
        modelsLabHailuo23T2V:
          "Hailuo 2.3 od MiniMax tvorí video z textu alebo z úvodného obrázka. Vyniká v živom pohybe, napríklad pri tanci alebo akcii. Klipy majú 6 alebo 10 sekúnd, rozlíšenie až 1080p a pomer 16:9. Nemá zvuk a stojí stredne veľa. Hailuo 3 pridáva zvuk, 2K a ovládanie záberov za približne dvojnásobnú cenu.",
        modelsLabHailuo02T2V:
          "Hailuo 02 T2V. Model od MiniMax vo verzii 02 na tvorbu videí z textu.",
        modelsLabHailuo23I2V:
          "Hailuo 2.3 od MiniMax premení obrázok na 6- alebo 10-sekundové video s výrazným prirodzeným pohybom. Nemá zvuk. Hailuo 2.3 Fast I2V zvláda rovnakú úlohu s menším dôrazom na detaily za približne polovicu ceny.",
        modelsLabHailuo23FastI2V:
          "Rýchly a úsporný Hailuo 2.3 I2V vytvára z obrázka 6- alebo 10-sekundové klipy za približne polovicu ceny štandardného variantu. Oplatí sa na návrhy a väčšie množstvo klipov. Má menej detailov a nepodporuje zvuk.",
        modelsLabHailuo02I2V:
          "Hailuo 02 I2V. Model od MiniMax vo verzii 02 na tvorbu videí z obrázkov.",
        modelsLabHailuo02StartEnd:
          "Hailuo 02 Start/End. Model od MiniMax na tvorbu videí podľa prvého a posledného záberu.",
        modelsLabSora2:
          "Sora 2 od OpenAI tvorí 4-, 8- alebo 12-sekundové klipy s vierohodnou fyzikou, zosúladeným zvukom a dialógmi v rozlíšení 720p. Táto trasa podporuje len pomer 16:9. Cena je stredná až vyššia. Sora 2 Pro vykresľuje rovnaké dĺžky detailnejšie asi za trojnásobok ceny.",
        modelsLabSora2Pro:
          "Prémiový variant Sora 2 od OpenAI. Tvorí vernejšie 4-, 8- alebo 12-sekundové klipy so zosúladeným zvukom v rozlíšení 720p. Táto trasa podporuje len pomer 16:9. Ide o jeden z najdrahších modelov, vhodný na hotové zábery. Na návrhy stojí Sora 2 približne tretinu.",
        modelsLabGen4Aleph:
          "Aleph od Runway upravuje existujúce videá. Dokáže pridávať a odstraňovať objekty, meniť štýl, osvetlenie aj uhol kamery. Podporuje rôzne pomery strán vrátane širokých filmových formátov. Je drahší ako väčšina modelov na tvorbu videa. Nové klipy zo zadania vytvorí Veo 3.1 Fast alebo Kling 3.0.",
        modelsLabLipsync2:
          "lipsync-2 od Sync zosúladí pohyb úst v existujúcom videu s novým zvukom. Hodí sa na dabing, preložený hovorený komentár a opravu dialógov. Upravuje existujúce zábery. Hovoriacu postavu z jednej fotografie vytvorí Omnihuman 1.5.",
        modelsLabGrokT2V:
          "Grok Imagine od xAI tvorí z textu klipy od 1 do 15 sekúnd v rozlíšení 480p alebo 720p. Voliteľne možno určiť prvý záber. Pracuje rýchlo a ponúka strednú cenu. Otvorená kategória má miernejšie filtre ako Veo alebo Sora. Explicitný obsah nepodporuje. Grok Imagine Video 1.5 pridáva 1080p. Tento starší model nahradil Grok Imagine Video 1.5 Lite za menej ako polovicu ceny.",
        modelsLabGrokI2V:
          "Grok Imagine od xAI premení obrázok na klip v HD s dĺžkou až 15 sekúnd. Je o niečo lacnejší ako Grok T2V a hodí sa na rýchle rozhýbanie záberu. Vyššie rozlíšenie ponúka Grok Imagine Video 1.5. Lacnejšou náhradou je Grok Imagine Video 1.5 Lite.",
        klingV30Std:
          "Štandardný variant Kling 3.0 od Kuaishou. Podobne ako Kling 3.0 T2V v triede Pro tvorí klipy dlhé od 3 do 15 sekúnd v rozlíšení 720p so zvukom a ovládaním záberov. Pri tvorbe z obrázka stojí menej. Pri zadaní len z textu býva lacnejší Kling 3.0 T2V.",
        klingVideoO1:
          "Multimodálny model Kling vytvára a upravuje videá podľa referencií. Tvorí klipy dlhé 5 alebo 10 sekúnd v rozlíšení 720p so zvukom a ovládaním prvého aj posledného záberu. Stojí stredne veľa. Pre prácu s referenciami je dobrou voľbou. Čistý text premení na video lacnejšie Kling 3.0 T2V.",
        veo31Lite:
          "Najlacnejší variant Veo 3.1 od Googlu vytvára klipy dlhé od 4 do 8 sekúnd v rozlíšení 720p alebo 1080p so zvukom. Podporuje určenie prvého aj posledného záberu. Nepodporuje 4K. Hodí sa na hromadnú tvorbu krátkych videí pre sociálne siete. Ak záleží na kvalite, použite Veo 3.1 Fast.",
        seedance2:
          "Seedance 2.0 od ByteDance vytvára klipy dlhé od 4 do 15 sekúnd so zvukom v rozlíšení od 480p po 4K. Podporuje prvý aj posledný záber a referenčné vstupy na zachovanie vzhľadu postáv. Patrí do vyššej cenovej kategórie. Oplatí sa pri scénach s opakujúcimi sa postavami. Návrhy do 720p vytvorí lacnejšie Seedance 2.0 Fast.",
        seedance2Fast:
          "Rýchlejší a lacnejší Seedance 2.0 od ByteDance vytvára klipy do 15 sekúnd so zvukom a ovládaním záberov. Maximum je 720p. Stojí asi 60 % ceny plného modelu. Hodí sa na návrhy a klipy pre sociálne siete. Pre 1080p alebo 4K použite plný Seedance 2.0.",
        happyhorse11:
          "Druhé vydanie video modelu HappyHorse od Alibaby. Prijíma text, obrázky aj referencie a vytvára klipy od 3 do 15 sekúnd v rozlíšení 720p alebo 1080p. Táto trasa nepodporuje zvuk. V 720p stojí rovnako ako HappyHorse 1.0, v 1080p menej. Podľa Alibaby zlepšuje pohyb a konzistentnosť. Z dvojice je predvolenou voľbou. Cena je stredná.",
        happyhorse10:
          "Prvé vydanie video modelu HappyHorse od Alibaby. Prijíma text, obrázky aj referencie a vytvára klipy od 3 do 15 sekúnd v rozlíšení 720p alebo 1080p. Táto trasa nepodporuje zvuk. V 720p stojí rovnako ako HappyHorse 1.1, v 1080p viac. Novšia verzia sa preto zvyčajne oplatí viac. Verzia 1.0 má zmysel pri zadaniach doladených priamo pre ňu.",
        modelsLabGen4T2ITurbo:
          "Rýchlejší a lacnejší variant obrazového modelu Gen-4 od Runway tvorí z textu za menej ako tretinu ceny Gen4 Image. Hodí sa na rýchle návrhy a skúšanie filmového vzhľadu Runway. Úpravy podľa referenčného obrázka ponúkajú FLUX.2 Pro alebo Seedream 4.5.",
        modelsLabGen4Image:
          "Gen-4 od Runway tvorí z textu obrázky známe filmovým vzhľadom. Patrí medzi drahšie obrazové modely a oplatí sa, keď chcete konkrétne vzhľad Runway. Na lacné skúšky použite Gen4 T2I Turbo. Úpravy podľa referenčného obrázka zvládne FLUX.2 Pro.",
        modelsLabWan27T2I:
          "Wan 2.7 od Alibaby patrí do rovnakej rodiny ako video modely Wan. Tvorí obrázky z textu za cenu v dolnej časti strednej kategórie. Je všestranný pri ilustráciách a scénach. Referenčné obrázky nepodporuje. Na úpravy použite Qwen Image 3 alebo Seedream 4.5.",
        modelsLabGrokT2I:
          "Grok Imagine od xAI tvorí obrázky z textu lacno a rýchlo. Je v otvorenej kategórii a má miernejšie filtre ako Imagen 4. Explicitný obsah nepodporuje. Hodí sa na výrazné obrázky na počkanie. Novší Grok Imagine Image 2.0 upravuje obrázky podľa referencií a stojí o niečo viac.",
        modelsLabZImageBase:
          "Plná nedestilovaná verzia základného modelu Z-Image s otvorenými váhami z laboratória Tongyi od Alibaby. Je medzi najlacnejšími v katalógu. Oproti Z Image Turbo vytvára rozmanitejšie obrázky, no trvá mu to dlhšie. Hodí sa na experimentovanie aj hromadnú tvorbu. Dotiahnuté finálne vizuály ponúka FLUX.2 Pro.",
        modelsLabZImageTurbo:
          "Destilovaná zrýchlená verzia modelu Z-Image s otvorenými váhami z laboratória Tongyi od Alibaby. Vytvorí obrázok v niekoľkých krokoch za jednu z najnižších cien v katalógu. Za túto cenu ponúka dobrý fotorealizmus a čitateľný text. Má menšiu rozmanitosť než Z Image Base a pri zložitých zadaniach zaostáva za FLUX.2 Pro.",
        modelsLabFlux2MaxT2I:
          "Flux 2 Max T2I. Model Flux 2 Max od Black Forest Labs na tvorbu obrázkov z textu cez ModelsLab.",
        modelsLabFluxPro11Ultra:
          "Variant Flux Pro 1.1 s vysokým rozlíšením vytvára obrázky s približne 4 megapixelmi len z textu. Patrí k drahším modelom a hodí sa na veľké obrázky pripravené na tlač. Na úpravy a prácu s viacerými referenciami je lacnejší a pružnejší FLUX.2 Pro.",
        modelsLabFluxPro11:
          "Flux Pro 1.1. Model od Black Forest Labs na tvorbu obrázkov z textu cez ModelsLab.",
        modelsLabFlux2ProT2I:
          "Flux 2 Pro T2I. Model Flux 2 Pro od Black Forest Labs na tvorbu obrázkov z textu cez ModelsLab.",
        modelsLabFlux2DevT2I:
          "Flux 2 Dev T2I. Model Flux 2 Dev od Black Forest Labs na tvorbu obrázkov z textu cez ModelsLab.",
        modelsLabFluxT2I:
          "Flux T2I. Model Flux od Black Forest Labs na tvorbu obrázkov z textu cez ModelsLab.",
        modelsLabSeedream45T2I:
          "Seedream 4.5 T2I. Model Seedream 4.5 od ByteDance na tvorbu obrázkov z textu cez ModelsLab.",
        modelsLabSeedream40T2I:
          "Seedream 4.0 T2I. Model Seedream 4.0 od ByteDance na tvorbu obrázkov z textu cez ModelsLab.",
        modelsLabSeedreamT2I:
          "Seedream T2I. Model Seedream od ByteDance na tvorbu obrázkov z textu cez ModelsLab.",
        modelsLabImagen4Ultra:
          "Najvyššia trieda radu Imagen 4 od Googlu. Najpresnejšie dodržiava zadania v rámci radu a vykresľuje čistý čitateľný text. Filtre Googlu platia v plnom rozsahu. Stojí približne trojnásobok ceny Imagen 4 Fast, preto sa hodí na finálne výstupy. Menej obmedzení má FLUX.2 Pro. Explicitný obsah podporuje Chroma.",
        modelsLabImagen4:
          "Štandardný Imagen 4 od Googlu ponúka fotorealistické detaily, dobrú typografiu a spoľahlivé dodržanie zadania za strednú cenu. Platia filtre Googlu a pri citlivých zadaniach môže model odmietnuť. Návrhy vytvorí Imagen 4 Fast približne za polovicu. Na finálny výstup slúži Imagen 4 Ultra.",
        modelsLabImagen4Fast:
          "Rýchly variant Imagen 4 od Googlu je najlacnejší model radu. Hodí sa na návrhy a hromadnú tvorbu. Oproti Imagen 4 a Ultra zachytáva menej detailov a menej presne dodržiava zadanie. Platia bežné filtre. Ešte lacnejšiu hromadnú tvorbu s miernejšími filtrami ponúka Z Image Turbo.",
        modelsLabImagen3:
          "Imagen 3. Model od Googlu na tvorbu obrázkov z textu cez ModelsLab.",
        modelsLabNanoBananaPro:
          "Nano Banana Pro. Tvorba kvalitných obrázkov cez ModelsLab.",
        modelsLabNanoBanana: "Nano Banana. Tvorba obrázkov cez ModelsLab.",
        modelsLabQwenT2I:
          "Qwen od Alibaby tvorí obrázky z textu. Rad Qwen vyniká vo vykresľovaní textu v obrázkoch vrátane čínskych znakov, preto sa hodí na plagáty, nápisy a makety. Patrí k najlacnejším v katalógu. Na úpravy existujúcich obrázkov použite Qwen Image 3.",
        modelsLabRealtimeT2I:
          "Rozhranie od ModelsLab na tvorbu obrázkov v reálnom čase uprednostňuje rýchlosť. Patrí do najnižšej cenovej kategórie v ponuke. Hodí sa na rýchle nápady, náhľady a skúšanie zadaní pred použitím FLUX.2 Pro alebo Imagen 4. Na hotové vizuály a zložité scény je slabšie.",
        claudeSonnet5:
          "Prvý Sonnet 5 od Anthropicu vyvažuje programovanie, prácu agentov a analýzu. Prijíma obrázky a má kontext 1 milión tokenov. Používa bežné filtre, pri kontroverzných témach je opatrný a pri hraní rolí slabší. Claude Sonnet 5.5 je novší a stojí rovnako.",
        claudeOpus5:
          "Prvý Opus 5 od Anthropicu je určený na najťažšie úlohy agentov a analýzu. Prijíma obrázky a má kontext 1 milión tokenov. Patrí k drahším modelom, používa bežné filtre a pri kontroverzných témach je opatrný. Claude Opus 5.5 je novší a lacnejší.",
        claudeOpus5Fast:
          "Claude Opus 5 Fast. Rýchly variant modelu Claude Opus 5 na veľké množstvo požiadaviek s krátkym časom odozvy. Kontext: 1 milión tokenov.",
        claudeFable5:
          "Prvý model Fable od Anthropicu. Zvláda špičkové uvažovanie, dôkladné spájanie poznatkov, tvorivú prácu a dlhodobé plánovanie. Prijíma obrázky a má kontext 1 milión tokenov. Patrí k najdrahším modelom a používa bežné filtre. Claude Fable 5.2 je novší a lacnejší. Na programovanie použite Claude Opus 5.5.",
        grok45:
          "Grok 4.5 od xAI je model na uvažovanie so silnou analýzou a programovaním. Spracúva obrázky, má kontext 500 000 tokenov a otvorené pravidlá pre obsah. Novší Grok 4.7 stojí rovnako.",
        grok46:
          "Grok 4.6 zlepšil uvažovanie a programovanie oproti 4.5. Prijíma obrázky, má kontext 500 000 tokenov a používa miernejšie filtre xAI. Stále je schopným modelom v otvorenej kategórii. Nástupca Grok 4.7 stojí rovnako.",
        gpt56Luna:
          "Rýchly a lacný variant radu GPT-5.6 od OpenAI na bežné rozhovory a krátke úlohy. Prijíma obrázky a má kontext 1 milión tokenov. Na dôkladnú analýzu sa nehodí. Novší GPT-6 Luna stojí približne polovicu.",
        gpt56LunaPro:
          "Luna s lepším programovaním a dodržiavaním pokynov za rovnakú nízku cenu ako základný model. Hodí sa na lacnú pomoc s kódom a štruktúrované úlohy. Kontext má 1 milión tokenov. Novší GPT-6 Luna stojí približne polovicu.",
        gpt56Terra:
          "Stredná trieda radu GPT-5.6 od OpenAI. Zvláda programovanie, analýzu aj četovanie, prijíma obrázky a má kontext 1 milión tokenov. Pri hraní rolí je slabšia. Novší GPT-6.1 Terra stojí približne polovicu.",
        gpt56TerraPro:
          "Terra s rozšíreným uvažovaním na náročnejšie analýzy za rovnakú cenu ako základný model. Kontext má 1 milión tokenov. Pri hraní rolí je slabší. Novší GPT-6.1 Terra stojí približne polovicu. Dôkladnejšie uvažovanie ponúka GPT-6.1 Sol.",
        gpt56Sol:
          "Najvyššia trieda radu GPT-5.6 od OpenAI na zložité uvažovanie, programovanie, písanie a analýzu. Prijíma obrázky a má kontext 1 milión tokenov. Má vyššiu cenu a bežné filtre. Novší GPT-6.1 Sol stojí približne polovicu.",
        gpt56SolPro:
          "Sol s rozšíreným uvažovaním na najťažšie úlohy za rovnakú cenu ako základný model. Má kontext 1 milión tokenov a bežné filtre. Pri hraní rolí je slabší. Novší GPT-6.1 Sol stojí polovicu. Najdôkladnejšie uvažovanie ponúka GPT-6 Astra.",
        gemini36Flash:
          "Gemini 3.6 Flash od Googlu rýchlo odpovedá a dobre programuje. Prijíma text, obrázky, video a zvuk. Má kontext 1 milión tokenov. Na bežné úlohy stále ponúka dobrú cenu. Novší Gemini 3.8 Flash stojí len o niečo viac.",
        gemini35FlashLite:
          "Najľahší model Gemini od Googlu prijíma text, obrázky, video a zvuk, volá nástroje a má kontext 1 milión tokenov. Hodí sa na veľa jednoduchých úloh, napríklad súhrny, označovanie a krátke odpovede. Používa bežné filtre a nemá pokročilé uvažovanie. GPT-6 Luna aj Claude Haiku 5.5 stoja menej.",
        gemini37Flash:
          "Gemini 3.7 Flash priniesol lepšie uvažovanie a analýzu do radu Flash. Prijíma text, obrázky, video a zvuk a má kontext 1 milión tokenov. Hodí sa na bežnú prácu za primeranú cenu. Nástupca Gemini 3.8 Flash stojí len o niečo viac.",
        kimiK3:
          "Kimi K3 od Moonshot AI je špičkový model na programovanie, analýzu, tvorivé písanie a dlhú prácu agentov. Spracúva obrázky aj video, volá nástroje a má kontext 1 milión tokenov. Používa miernejšie filtre ako americkí poskytovatelia. Novší a výkonnejší Kimi K3.1 Pro stojí takmer dvojnásobok.",
        glm52:
          "GLM-5.2 od Z.AI dobre uvažuje, rýchlo odpovedá a má kontext 1 milión tokenov. Hodí sa na programovanie a analýzu dlhých vstupov. Pracuje len s textom a má otvorené pravidlá pre obsah. Novší GLM-5.3 stojí približne tretinu.",
        minimaxM3:
          "Bývalý vlajkový MiniMax dobre programuje, uvažuje a analyzuje. Spracúva obrázky aj video, volá nástroje a má kontext 1 milión tokenov. Jeho filtre sú miernejšie než pri bežných poskytovateľoch. Nástupca MiniMax M3.1 Flash je citeľne lepší v práci agentov aj programovaní a stojí najviac polovicu.",
        qwen37Flash:
          "Mimoriadne lacný model Flash od Alibaby patrí k najúspornejším v katalógu. Spracúva text, obrázky aj video, volá nástroje a má kontext 1 milión tokenov. Hodí sa na hromadné úlohy a krátke rozhovory. Pri náročnom uvažovaní je plytší. Novší Qwen 3.8 Flash je schopnejší, ale stojí niekoľkonásobne viac.",
        qwen38Max:
          "Špičkový Qwen od Alibaby na uvažovanie, programovanie a analýzu. Spracúva obrázky aj video, volá nástroje a má kontext 1 milión tokenov. Jeho filtre sú miernejšie ako pri amerických poskytovateľoch. Patrí k drahším otvoreným modelom. Ak stačí len textový vstup, DeepSeek V4 Pro dosahuje podobnú úroveň za výrazne menej ako polovicu ceny.",
        mimoV25:
          "Úsporný MiMo V2.5 od Xiaomi rýchlo odpovedá a dobre programuje. Prijíma text, obrázky, video a zvuk, má otvorené pravidlá pre obsah a kontext 1 milión tokenov. Novší MiMo V2.6 Flash stojí menej ako tretinu.",
        mimoV25Pro:
          "MiMo V2.5 Pro od Xiaomi zvláda dôkladné uvažovanie a programovanie za nízku cenu. Spracúva len text, má otvorené pravidlá pre obsah a kontext 1 milión tokenov. Novší nástupca MiMo V2.6 Pro stojí viac.",
        metaMuseSpark12:
          "Muse Spark 1.2 od Meta je multimodálny model na uvažovanie. Spracúva text, obrázky a video s kontextom 1 milión tokenov. Dobre analyzuje rôzne druhy vstupov a má otvorené pravidlá pre obsah. Nie je označený ako model na programovanie. Novší Meta Muse Spark 1.3 stojí rovnako.",
        mistralMedium35:
          "Medium 3.5 je model strednej triedy z francúzskeho laboratória Mistral AI. Programuje, analyzuje, prijíma obrázky a má kontext 262 000 tokenov. Používa bežné filtre. Novší Mistral Large 4 stojí menej ako polovicu.",
        claudeOpus55:
          "Najvýkonnejší Claude od Anthropicu na náročnú každodennú prácu. Hodí sa na najťažšie programovanie, dlhé úlohy agentov, dôkladnú analýzu aj kvalitné písanie. Prijíma obrázky, volá nástroje a má kontext 1 milión tokenov. Je drahší a používa bežné filtre. Odmieta citlivé požiadavky a slabšie hrá roly. Claude Sonnet 5.5 zvládne väčšinu dennej práce za polovicu.",
        claudeSonnet55:
          "Všestranný Claude od Anthropicu na bežnú prácu. Dobre programuje, pracuje s agentmi, analyzuje a píše za polovicu ceny Opus 5.5. Prijíma obrázky, volá nástroje a má kontext 1 milión tokenov. Pre bežné filtre sa menej hodí na hranie rolí a kontroverzné témy. Stojí rovnako ako GPT-6.1 Sol a Gemini 4 Argon.",
        claudeHaiku55:
          "Najrýchlejší a najlacnejší Claude od Anthropicu. Hodí sa na krátke rozhovory a jednoduché programovanie. Spracúva obrázky, volá nástroje a má kontext 1 milión tokenov. Jedna správa stojí pár centov. Používa bežné filtre a je slabší pri hraní rolí a citlivých témach. Stojí rovnako ako GPT-6 Luna. Náročnejšie úlohy zvládne Claude Sonnet 5.5.",
        claudeFable51:
          "Fable 5.1 od Anthropicu ponúka špičkové uvažovanie na dôkladné spájanie poznatkov, dlhodobé plánovanie a presné písanie. Má kontext 1 milión tokenov. Patrí k drahším modelom, používa bežné filtre, pri kontroverzných témach je opatrný a pri hraní rolí slabší. Nástupca Claude Fable 5.2 stojí menej. Na programovanie sa lepšie hodí Claude Opus 5.5.",
        claudeFable52:
          "Špičkový model na uvažovanie od Anthropicu a najdrahší Claude. Je určený na dôkladné spájanie poznatkov, výskum, dlhodobé plánovanie a kvalitné písanie. Prijíma obrázky, volá nástroje a má kontext 1 milión tokenov. Stojí približne dvojnásobok ceny Opus 5.5 a používa bežné filtre. Pri programovaní je Claude Opus 5.5 výhodnejší.",
        gpt6Astra:
          "Predchádzajúci vlajkový model radu Astra podporuje text, obrázky aj nástroje. Nahradil ho GPT-6.2 Astra.",
        gpt6AstraPro:
          "GPT-6 Astra Pro. Variant GPT-6 Astra s rozsiahlejším uvažovaním. Odpovedá pomalšie, ale dôkladnejšie. Kontext: 1,05 milióna tokenov.",
        gpt61Sol:
          "Predchádzajúce vydanie radu Sol podporuje text, obrázky aj nástroje. Nahradil ho GPT-6.2 Sol.",
        gpt61SolPro:
          "GPT-6.1 Sol Pro. Variant GPT-6.1 Sol s rozsiahlejším uvažovaním na zložité analýzy a programovanie. Kontext: 1,05 milióna tokenov.",
        gpt61Terra:
          "Vyvážený model strednej triedy od OpenAI. Dobre programuje, analyzuje aj četuje, prijíma obrázky, volá nástroje a má kontext 1 milión tokenov. Stojí polovicu ceny GPT-6.1 Sol. Používa bežné filtre a pri hraní rolí je slabší. DeepSeek V4 Pro ponúka vyšší výkon za menej a s miernejšími filtrami.",
        gpt61TerraPro:
          "GPT-6.1 Terra Pro. Variant GPT-6.1 Terra s dôkladnejším uvažovaním pre náročnú analytickú prácu. Kontext: 1,05 milióna tokenov.",
        gpt6Luna:
          "Ľahký GPT-6 od OpenAI odpovedá rýchlo a za pár centov. Prijíma obrázky, volá nástroje a má kontext 1 milión tokenov. Hodí sa na krátke otázky a jednoduché úlohy. Pri dôkladnom uvažovaní a hraní rolí je slabší. Stojí rovnako ako Claude Haiku 5.5. DeepSeek V4.1 Flash je ešte lacnejší a má miernejšie filtre.",
        gpt6LunaPro:
          "GPT-6 Luna Pro. Variant GPT-6 Luna s rozsiahlejším uvažovaním. Lepšie programuje a drží sa pokynov za rovnakú nízku cenu. Kontext: 1,05 milióna tokenov.",
        gemini4Argon:
          "Vlajkový Gemini od Googlu na špičkové uvažovanie, programovanie a analýzu. Prijíma text, obrázky, video a zvuk, volá nástroje a má kontext 1 milión tokenov. Hodí sa na nahrávky, videá aj väčšie množstvo snímok obrazovky. Používa bežné filtre a stojí rovnako ako Claude Sonnet 5.5 a GPT-6.1 Sol. Gemini 4 Carbon zvláda najťažšie úlohy dôkladnejšie. Gemini 4 Hydrogen je rýchlejší a o štvrtinu lacnejší.",
        gemini38Flash:
          "Model radu Flash od Googlu rýchlo odpovedá a dobre programuje aj analyzuje. Prijíma text, obrázky, video a zvuk, volá nástroje a má kontext 1 milión tokenov. Používa bežné filtre. Stojí výrazne menej ako polovicu ceny Gemini 4 Argon, ale výrazne viac ako rýchle otvorené modely, napríklad Qwen 3.8 Flash. Gemini 4 Hydrogen je citeľne schopnejší a rýchlejší za takmer dvojnásobnú cenu.",
        grok47:
          "Grok od xAI s pokročilým uvažovaním a programovaním. Prijíma obrázky, volá nástroje a má kontext 500 000 tokenov, polovicu oproti väčšine vlajkových modelov v ponuke. Otvorené pravidlá pre obsah mu umožňujú odpovedať na viac tém než bežné modely, pričom niektoré filtre stále platia. Stojí podobne ako Qwen 3.8 Max. Lacný variant Grok Fast už xAI neponúka. Na rýchly a lacný čet s miernejšími filtrami sa hodí MiniMax M3.1 Flash alebo Meta Muse Ember.",
        kimiK31Pro:
          "Najvýkonnejší Kimi od Moonshot AI. Vyniká v uvažovaní, programovaní, tvorivom písaní a dlhej práci agentov. Spracúva obrázky a video, volá nástroje a má kontext 1 milión tokenov. Má miernejšie filtre než americkí poskytovatelia. Stojí rovnako ako Claude Sonnet 5.5. Kimi K3 sa mu výkonom približuje za o niečo viac ako polovicu ceny.",
        gpt62Sol: "Sol pracuje s textom a obrázkami, píše kód a volá nástroje.",
        gpt62Astra:
          "Astra zvláda zložitý vývoj a analýzu. Pracuje s textom a obrázkami a volá nástroje.",
        superGemma426b:
          "Model Gemma 4 doladený autorom Jiunsong spracuje text spolu s jedným obrázkom a dokáže volať nástroje.",
        deepseekV41FlashCsf:
          "DeepSeek V4.1 Flash upravený autorom jcartu metódou abliteration spracúva text, uvažuje a volá nástroje.",
        maiImage27:
          "Model od Microsoftu na tejto trase vytvára z textu obrázky v rozlíšení 1K.",
        maiImage27Flash:
          "Rýchlejší variant MAI Image 2.7 vytvára z textu obrázky v rozlíšení 1K.",
        qwen4Max:
          "Vlajkový model od Alibaby a prvý Qwen 4. Zvláda špičkové uvažovanie, programovanie a analýzu, prijíma obrázky a video, volá nástroje a má kontext 1 milión tokenov. Používa miernejšie filtre ako americkí poskytovatelia. Uvažuje pred každou odpoveďou, preto odpovede chvíľu trvajú. Nahrádza Qwen 3.8 Max a je o štvrtinu lacnejší.",
        kimiK31ProUncensored:
          "Najvýkonnejší Kimi od Moonshot AI s odstráneným odmietaním, dostupný cez Lyber. Patrí k špičkovým modelom bez cenzúry na uvažovanie, programovanie, dlhé písanie a volanie nástrojov. Pracuje len s textom a má kontext 1 milión tokenov. Pri politike zachováva pohľad základného modelu. Názory mimo hlavného prúdu ponúka UncensoredLM. Stojí niekoľkonásobok ceny výkonného GLM 5.3 Uncensored.",
        hy4: "Hy4, vlajková loď Tencentu. Predvolene uvažuje, programuje, číta obrázky, volá nástroje, kontext 1M. Bežné filtre za nízku cenu na svoju triedu. Je to nové meno, preto ho vyskúšaj na vlastných promptoch. Hy4 Flash je jeho lacnejší a rýchlejší súrodenec.",
        hy4Flash:
          "Malý Hy4 od Tencentu. Číta text a obrázky, programuje, volá nástroje, kontext 1M. Jeden z najlacnejších modelov v katalógu, stavaný na veľké objemy. Rýchlosť namiesto hĺbky: ťažké úlohy prenechaj Hy4.",
        deepseekV41Flash:
          "Rýchly DeepSeek teraz spracúva obrázky. Zvláda náročné programovanie a analýzu za najnižšiu cenu v katalógu. Volá nástroje, má kontext 1 milión tokenov a miernejšie filtre. Na dôkladné uvažovanie je vhodnejší DeepSeek V4 Pro. Na odpovede bez odmietania vyberte DeepSeek V4.1 Flash Uncensored.",
        qwen38Flash:
          "Rýchly Qwen od Alibaby prijíma text, obrázky a video. Rýchlo odpovedá, dobre programuje a volá nástroje. Má kontext 1 milión tokenov, nízku cenu a miernejšie filtre. Hodí sa na každodenné úlohy. Ťažké problémy lepšie zvládne Qwen 4 Max.",
        glm53:
          "Základný GLM-5.3 od Z.AI dobre uvažuje, programuje a volá nástroje za nízku cenu. Spracúva len text, má kontext 1 milión tokenov a miernejšie filtre. Patrí medzi najlacnejšie výkonné modely. Variant GLM 5.3 Uncensored je bez odmietania.",
        glm53Flash:
          "Rýchly GLM od Z.AI prijíma text, obrázky a video, programuje a volá nástroje. Má kontext 1 milión tokenov a miernejšie filtre. Je určený na veľké množstvo požiadaviek za nízku cenu. GLM-5.3 stojí rovnako a uvažuje dôkladnejšie. Flash vyniká rýchlosťou a podporou médií.",
        mimoV26Pro:
          "Špičkový MiMo od Xiaomi na uvažovanie, programovanie a analýzu textu, obrázkov, videa a zvuku. Volá nástroje, má kontext 1 milión tokenov a miernejšie filtre. Je najlacnejší model v najvyššej výkonovej triede a stojí zlomok ceny Gemini 4 Argon pri podobných vstupoch. Je novší, preto sa ho oplatí skúsiť na vlastných zadaniach.",
        mimoV26Flash:
          "Rýchly MiMo od Xiaomi prijíma text, obrázky, video a zvuk. Na svoju cenu dobre programuje, volá nástroje a má kontext 1 milión tokenov. Je veľmi lacný a používa miernejšie filtre. Uprednostňuje rýchlosť pred hĺbkou uvažovania. Výkonnejší je MiMo V2.6 Pro. MiMo V2.6 Flash Abliterated má odstránené odmietanie.",
        metaMuseSpark13:
          "Muse od Meta zo strednej triedy uvažuje nad textom, obrázkami a videom, analyzuje ich a volá nástroje. Má kontext 1 milión tokenov a miernejšie filtre. Na programovanie nie je určený. Kimi K3 je pri tejto cene výkonnejší. Vlajkový model od Meta je Meta Muse Wonder.",
        metaMuseWonder:
          "Vlajkový Muse od Meta zvláda špičkové uvažovanie, programovanie, analýzu a tvorivé úlohy. Prijíma text, obrázky, video a zvuk, volá nástroje a má kontext 1 milión tokenov. Používa miernejšie filtre než bežní poskytovatelia. Patrí do prémiovej triedy a stojí približne rovnako ako Claude Opus 5.5. Kimi K3.1 Pro a Gemini 4 Argon ponúkajú podobnú úroveň za polovicu.",
        mistralLarge4:
          "Vlajkový model Mistral AI z európskeho laboratória dobre programuje a analyzuje. Prijíma obrázky, volá nástroje a za strednú cenu ponúka kontext 1 milión tokenov. Používa bežné filtre. DeepSeek V4 Pro stojí o niečo viac a uvažuje dôkladnejšie.",
        gemini4Hydrogen:
          "Rýchly Gemini 4 od Googlu je určený na prácu s agentmi, programovanie a rýchlu analýzu. V testoch dosahuje špičkové výsledky a je asi 2,5-krát rýchlejší ako Gemini 3.8 Flash. Prijíma text, obrázky, video a zvuk, volá nástroje a má kontext 1 milión tokenov. Používa bežné filtre. Dlhé a dôkladné uvažovanie lepšie zvládnu Gemini 4 Carbon alebo Argon. Je o štvrtinu lacnejší ako Argon a stojí takmer dvojnásobok ceny Gemini 3.8 Flash.",
        gemini4Carbon:
          "Najvýkonnejší Gemini od Googlu patrí medzi špičkové modely. Zvláda najťažšie programovanie, dlhé úlohy agentov a zložité uvažovanie. Prijíma text, obrázky, video a zvuk, volá nástroje a má kontext 1 milión tokenov. Používa bežné filtre. Na úlohu spotrebuje viac tokenov ako Argon, takže v praxi stojí viac. Do 30. novembra má rovnakú úvodnú sadzbu ako Argon, Claude Sonnet 5.5 a GPT-6.1 Sol. Potom sa sadzba zdvojnásobí na úroveň Claude Opus 5.5.",
        minimaxM31Flash:
          "Rýchly model od MiniMax výrazne zlepšil prácu agentov, programovanie a bezpečnostné úlohy oproti M3. Prijíma obrázky a video, volá nástroje a má kontext 1 milión tokenov. Používa miernejšie filtre ako bežní poskytovatelia. Vždy uvažuje pred odpoveďou a píše podrobne. Odpovede sú preto pomalšie a dlhšie než pri iných modeloch Flash. Stojí polovicu ceny M3 alebo menej, v podobnej triede ako DeepSeek V4.1 Flash a Qwen 3.8 Flash.",
        metaMuseEmber:
          "Najmenší Muse od Meta je určený na opakujúce sa úlohy agentov, napríklad volanie nástrojov, smerovanie, získavanie údajov a krátky čet. Prijíma text, obrázky, video a zvuk, má kontext 1 milión tokenov a miernejšie filtre než bežní poskytovatelia. Na svoju veľkosť dobre pracuje s nástrojmi a počítačom, no slabšie zvláda náročné programovanie a uvažovanie. Stojí rovnako ako GPT-6 Luna a Claude Haiku 5.5. Pri zadaniach nad 200 000 tokenov je sadzba trojnásobná.",
        veniceDeepseekV41FlashUncensored:
          "DeepSeek V4.1 Flash s odstráneným odmietaním cez Venice. Zvláda programovanie, analýzu, fikciu a hranie rolí bez poučovania. Prijíma obrázky, volá nástroje, má kontext 1 milión tokenov a nízku cenu. Tréning a pohľad pôvodného modelu zostali, takže ovplyvňujú politické odpovede a môžu zjemniť najtemnejšie scény. Odlišný pohľad ponúka UncensoredLM. Táto verzia stojí približne štvornásobok ceny bežného DeepSeek V4.1 Flash. Lacnejšia alternatíva bez odmietania je GLM 5.3 Flash Uncensored.",
        drummerArtemis31b:
          "Gemma 4 31B doladený autorom TheDrummer na hranie rolí a fikciu. Zachováva spôsob reči postáv a píše živé temné aj explicitné scény pre dospelých bez odmietania. Prijíma obrázky, volá nástroje a má kontext 262 000 tokenov. V programovaní a náročnej analýze je slabý. Ide o komunitný model na jedinom hostiteľovi NanoGPT, preto môže byť chvíľami nedostupný. Stojí zhruba pätinu ceny Venice Role Play Uncensored. Keď príbeh potrebuje dôslednejšiu logiku, zvoľte DeepSeek V4.1 Flash Uncensored.",
        grokImagineImage2:
          "Druhá generácia obrazového modelu Grok Imagine od xAI. Prijíma text alebo referenčný obrázok, takže zvláda nové obrázky aj úpravy za strednú cenu. V otvorenej kategórii má miernejšie filtre než bežné modely. Explicitný obsah nepodporuje. Oproti Grok Imagine T2I umožňuje úpravy a presnejšie sa drží zadania.",
        recraftV41:
          "Recraft V4.1 je určený na logá, plagáty, obaly, reklamu a ďalšiu grafiku s textom. Má čistú typografiu, dobrú kompozíciu a prijíma jeden referenčný obrázok. Obrázok s rozlíšením približne 1K stojí asi 3,5 kreditu. Platia bežné filtre. Variant Pro ponúka tlačovú kvalitu v 2K, Flash lacnejšie návrhy.",
        recraftV41Pro:
          "Prémiový Recraft V4.1 ponúka rovnaký cit pre dizajn a ostrú typografiu, pri rozlíšení približne 2K vykresľuje jemnejšie detaily. Hodí sa na tlač, produktové snímky a vizuály značky pripravené na použitie. Obrázok stojí približne 21 kreditov, preto návrhy skúšajte vo V4.1 alebo Flash. Platia bežné filtre.",
        recraftV41Flash:
          "Rýchly variant Recraft tvorí jeden obrázok približne 1,5 sekundy a stojí menej ako 1 kredit za obrázok. Pracuje len s textovým zadaním. Hodí sa na koláže, náhľady a hromadné skúšanie nápadov. Vykresľuje menej detailov ako Recraft V4.1. Platia bežné filtre.",
        qwenImage3:
          "Rýchly variant Qwen Image 3 od Alibaby lacno tvorí obrázky z textu a upravuje ich podľa referenčného obrázka. Hodí sa na rýchle úpravy, grafiku s množstvom textu a skúšanie variantov. Qwen Image 3 Pro pridáva detaily za o niečo vyššiu cenu. Na úpravy bez cenzúry použite Qwen Edit Uncensored.",
        qwenImage3Pro:
          "Kvalitnejší Qwen Image 3 od Alibaby prijíma text alebo referenčný obrázok. Za mierny príplatok ponúka viac detailov a lepšie spracovanie ako základný model. Vyniká pri úpravách a práci s textom v obrázkoch. Patrí do otvorenej kategórie. Explicitný obsah podporuje Qwen Edit Uncensored.",
        hailuo3:
          "Hailuo 3 od MiniMax vytvára videá so zvukom v rozlíšení 2K do 15 sekúnd a umožňuje určiť prvý aj posledný záber. Oproti Hailuo 2.3 ponúka viac funkcií za približne dvojnásobok ceny. Patrí do vyššej cenovej kategórie. Lacnejšie 1080p bez zvuku ponúka Hailuo 2.3 T2V.",
        seedance25:
          "Seedance 2.5 od ByteDance ponúka klipy do 30 sekúnd so zvukom a ovládaním záberov v rozlíšení 480p alebo 720p. Má najvyššiu cenu za klip v rade Seedance a hodí sa na dlhé neprerušené zábery. Kratšie ostré klipy vytvára Seedance 2.0 až v 4K.",
        flux3Video:
          "Flux 3 Video. Vlajkový model od Black Forest Labs na tvorbu kvalitných videí, ktoré sa presne držia zadania.",
        grokImagineVideo15:
          "Grok Imagine Video 1.5 od xAI vytvára klipy do 15 sekúnd v rozlíšení 480p, 720p alebo 1080p. Voliteľne môžete určiť prvý záber. Oproti Grok T2V má vyššie rozlíšenie za približne dvojnásobok ceny. Patrí do otvorenej kategórie s miernejšími filtrami ako Veo alebo Sora. Explicitný obsah nepodporuje.",
        lyria3ProPreview:
          "Prémiová predbežná verzia Lyria 3 od Googlu je určená na celé skladby vo vysokej produkčnej kvalite. Platia filtre Googlu. Stojí približne jedenapolnásobok ceny Lyria 3. Počas predbežného vydania sa fungovanie aj dostupnosť môžu meniť.",
        lyria3ClipPreview:
          "Lyria 3 Clip od Googlu je predbežný model na krátke hudobné ukážky. Rýchlo a lacno tvorí úvody, krátke zvukové predely a hudbu k príspevkom na sociálne siete. Platia bežné filtre. Na dlhšie skladby použite Lyria 3 alebo Lyria 3 Pro Preview.",
        geminiNanoBanana21:
          "Nano Banana 2.1 od Googlu vytvára a upravuje obrázky priamo v čete. V odpovedi kombinuje text a obrázky. Jeden obrázok stojí približne 3 až 4 kredity, polovicu ceny pôvodného Nano Banana, ktorý nahrádza. Presne upravuje a vykresľuje čitateľný text. Používa bežné filtre a nevolá nástroje. Pri zložitých scénach je Nano Banana Pro lepší za približne štvornásobnú cenu.",
        seedream55:
          "Seedream 5.5 od ByteDance vytvára obrázky z textu alebo ich upravuje podľa najviac desiatich referenčných obrázkov. Zvláda portréty, zachovanie vzhľadu postáv a scény z viacerých obrázkov. Obrázok stojí 2 kredity, polovicu ceny modelu Seedream 4.5, ktorý nahrádza. Má miernejšie filtre než bežné modely. Explicitný obsah nepodporuje.",
        flux3Image:
          "FLUX.3 od Black Forest Labs lepšie vykresľuje detaily aj text a presnejšie dodržiava zadanie než FLUX.2. Prijíma text alebo referenčné obrázky. Obrázok stojí približne 5 kreditov, menej než pri FLUX.2 Max, ktorý nahrádza. Patrí do otvorenej kategórie. Explicitný obsah nepodporuje. FLUX.2 Pro je pri bežnej práci lacnejší. FLUX.3 Klein zvláda hromadnú tvorbu.",
        flux3Klein:
          "Malý a rýchly FLUX.3 patrí k najlacnejším modelom v katalógu. Obrázok stojí menej ako 1 kredit a na úpravu možno použiť referenčné obrázky. Hodí sa na návrhy, náhľady a hromadnú tvorbu. Vykresľuje menej detailov ako plný FLUX.3. Patrí do otvorenej kategórie. Explicitný obsah nepodporuje.",
        gptImage26Flare:
          "Rýchly variant GPT Image 2.6 od OpenAI prijíma text alebo referenčný obrázok, rýchlo tvorí čisté obrázky a dobre zvláda text aj rozloženie prvkov. Obrázok stojí približne 4 kredity. Platia prísne filtre OpenAI. Na zložité kompozície a detailné úpravy použite variant Sunburst.",
        gptImage26Sunburst:
          "GPT Image 2.6 od OpenAI doladený na detaily. Zvláda zložité kompozície, plagáty s množstvom textu aj opakované úpravy, pri ktorých zachováva detaily. Obrázok stojí približne 6 kreditov. Platia prísne filtre OpenAI. Keď na jemných detailoch záleží menej, Flare je rýchlejší a lacnejší.",
        geminiOmni12Flash:
          "Gemini Omni 1.2 Flash od Googlu vytvára klipy od 3 do 15 sekúnd so zvukom v rozlíšení od 360p do 4K. Umožňuje určiť prvý a posledný záber. Sekunda stojí približne 7 kreditov v 720p a 10 kreditov v 1080p, menej než Veo 3.1 Fast pri rovnakom rozlíšení. Platia filtre Googlu.",
        grokImagineVideo15Lite:
          "Rýchly a lacný variant Grok Imagine Video 1.5 od xAI tvorí klipy od 1 do 15 sekúnd v 480p, 720p alebo 1080p s voliteľným prvým záberom. V 720p stojí sekunda 3 kredity, menej ako polovicu ceny pôvodného modelu Grok Imagine na video, ktorý nahrádza. Na úkor časti kvality je rýchlejší. Plný Grok Imagine Video 1.5 má lepší obraz. Patrí do otvorenej kategórie. Explicitný obsah nepodporuje.",
        wan30:
          "Wan 3.0 od Alibaby vytvára klipy od 2 do 30 sekúnd so zvukom v rozlíšení od 480p do 1080p. Umožňuje určiť prvý a posledný záber. V 720p stojí sekunda 10 kreditov, rovnako ako pri Wan 2.7, ktorý nahrádza. V 480p stojí polovicu. Hodí sa na lacné dlhé zábery. Patrí do otvorenej kategórie. Explicitný obsah nepodporuje.",
        seedance2Mini:
          "Úsporný Seedance 2.0 tvorí z textu alebo obrázka klipy od 4 do 15 sekúnd so zvukom v 480p alebo 720p. Umožňuje určiť prvý aj posledný záber. V 720p stojí sekunda približne 7,6 kreditu, menej než pri Seedance 2.0 Fast. Hodí sa na návrhy a klipy na sociálne siete. Pre 4K použite Seedance 2.0. Patrí do otvorenej kategórie. Explicitný obsah nepodporuje.",
        seedance25Flash:
          "Seedance 2.5 Flash od ByteDance je rýchly variant Seedance 2.5. Z textu alebo obrázka tvorí videá od 4 do 30 sekúnd so zvukom v 480p alebo 720p. Sekunda stojí 8,4 kreditu v 480p a 18,9 kreditu v 720p, menej ako pri plnom Seedance 2.5. Umožňuje robiť dlhé zábery lacnejšie. Beží anonymizovane cez Venice.ai. Patrí do otvorenej kategórie. Explicitný obsah nepodporuje.",
        hailuo3Max:
          "Hailuo 3 Max od MiniMax je rýchlejší variant Hailuo 3. Tvorí klipy od 5 do 15 sekúnd v 768p alebo 480p, podporuje prvý aj posledný záber a nemá zvuk. Sekunda stojí 8 kreditov, výrazne menej ako pri Hailuo 3. Hodí sa na rýchle skúšanie variantov. Hailuo 3 pridáva 2K aj zvuk. Patrí do otvorenej kategórie. Explicitný obsah nepodporuje.",
        runwayGen45:
          "Gen-4.5 od Runway vytvára filmový pohyb a presne dodržiava zadanie. Prijíma text alebo prvý záber a tvorí klipy od 2 do 10 sekúnd v 720p bez zvuku. Sekunda stojí 12 kreditov, v hornej časti strednej cenovej kategórie. Hodí sa na filmové zábery. Zvuk ponúka Veo 3.1 Fast alebo Wan 3.0. Patrí do otvorenej kategórie. Explicitný obsah nepodporuje.",
      },
    },
    modelUtilities: {
      adultExplicit: "Explicitný obsah pre dospelých",
      adultImplied: "Naznačený obsah pre dospelých",
      analysis: "Analýza",
      chat: "Čet",
      coding: "Programovanie",
      conspiracy: "Konšpiračné teórie",
      controversial: "Kontroverzné témy",
      creative: "Tvorivé písanie",
      fast: "Rýchly",
      harmful: "Potenciálne škodlivý obsah",
      illegalInfo: "Informácie o nelegálnych činnostiach",
      imageGen: "Tvorba obrázkov",
      legacy: "Starší model",
      medicalAdvice: "Zdravotné rady",
      offensiveLanguage: "Urážlivý jazyk",
      politicalLeft: "Ľavicové politické názory",
      politicalRight: "Pravicové politické názory",
      reasoning: "Pokročilé uvažovanie",
      roleplay: "Hranie rolí",
      roleplayDark: "Hranie rolí s temnými témami",
      smart: "Inteligentný",
      uncensored: "Bez cenzúry",
      violence: "Násilie",
      vision: "Rozpoznávanie obrázkov",
    },
    input: {
      attachments: {
        uploadFile: "Priložiť súbory",
        attachedFiles: "Priložené súbory",
        addMore: "Priložiť ďalšie",
      },
    },
  },

  search: {
    brave: {
      category: "Informácie",
      get: {
        title: "Hľadať na webe",
        dynamicTitle: "Hľadať: {{query}}",
        description:
          "Vyhľadajte na internete aktuálne informácie, správy, fakty alebo nedávne udalosti. Použite ho, keď potrebujete aktuálne údaje alebo si chcete overiť fakty.",
        form: {
          title: "Parametre vyhľadávania",
          description: "Nastavte vyhľadávanie na webe",
        },
        submitButton: {
          label: "Vyhľadať",
          loadingText: "Vyhľadáva sa...",
        },
        backButton: {
          label: "Späť",
        },
        fields: {
          query: {
            title: "Hľadaný výraz",
            description: "Jasný a konkrétny dopyt. Použite kľúčové slová.",
            placeholder: "Zadajte hľadaný výraz...",
          },
          maxResults: {
            title: "Najviac výsledkov",
            description: "Počet vrátených výsledkov (1 až 10)",
          },
          includeNews: {
            title: "Zahrnúť správy",
            description:
              "Zahrnúť spravodajské výsledky o aktuálnych udalostiach",
          },
          freshness: {
            title: "Obdobie",
            description: "Filtrovať výsledky podľa dátumu",
            options: {
              day: "Posledný deň",
              week: "Posledný týždeň",
              month: "Posledný mesiac",
              year: "Posledný rok",
            },
          },
        },
        response: {
          success: {
            title: "Hotovo",
            description: "Určuje, či sa vyhľadávanie podarilo",
          },
          message: {
            title: "Správa",
            description: "Správa o stave vyhľadávania",
          },
          query: {
            title: "Dopyt",
            description: "Použitý vyhľadávací dopyt",
          },
          results: {
            title: "Výsledky",
            description: "Pole výsledkov vyhľadávania",
            result: "Výsledok",
            item: {
              title: "Výsledok vyhľadávania",
              description: "Jednotlivý výsledok vyhľadávania",
              url: "URL",
              snippet: "Úryvok",
              age: "Vek",
              source: "Zdroj",
            },
          },
          cached: {
            title: "Z vyrovnávacej pamäte",
            description:
              "Určuje, či sa výsledky načítali z vyrovnávacej pamäte",
          },
          timestamp: {
            title: "Časová značka",
            description: "Čas vykonania vyhľadávania",
          },
        },
        errors: {
          queryEmpty: {
            title: "Vyhľadávací dopyt je povinný",
            description: "Zadajte hľadaný výraz",
          },
          queryTooLong: {
            title: "Hľadaný výraz je príliš dlhý",
            description: "Dopyt môže mať najviac 400 znakov",
          },
          timeout: {
            title: "Vypršal časový limit vyhľadávania",
            description: "Vyhľadávanie trvalo príliš dlho",
          },
          searchFailed: {
            title: "Vyhľadávanie zlyhalo",
            description: "Pri vyhľadávaní došlo k chybe",
          },
          validation: {
            title: "Neplatné vyhľadávanie",
            description:
              "Skontrolujte parametre vyhľadávania a skúste to znova",
          },
          internal: {
            title: "Niečo sa pokazilo",
            description: "Vyhľadávanie sa nepodarilo dokončiť. Skúste to znova",
          },
          notConfigured: {
            title:
              "Kľúč API pre {{label}} nie je nastavený. Do súboru .env pridajte {{envKey}}=<your-key>. Kľúč získate na {{url}}",
            description: "Nastavte {{label}} a povoľte vyhľadávanie na webe",
          },
        },
        success: {
          title: "Vyhľadávanie úspešné",
          description: "Vyhľadávanie na webe sa dokončilo",
        },
      },
      tags: {
        search: "Vyhľadať",
        web: "Web",
        internet: "Internet",
      },
    },
    kagi: {
      category: "Informácie",
      get: {
        title: "Hľadať pomocou Kagi",
        dynamicTitle: "Kagi: {{query}}",
        description:
          "Vyhľadávajte na internete alebo získavajte odpovede AI cez Kagi. FastGPT poskytuje súhrnné odpovede so zdrojmi. Režim vyhľadávania poskytuje priame výsledky a úryvky.",
        form: {
          title: "Parametre vyhľadávania",
          description: "Nastavte vyhľadávanie pomocou Kagi",
        },
        submitButton: {
          label: "Vyhľadať",
          loadingText: "Vyhľadáva sa...",
        },
        backButton: {
          label: "Späť",
        },
        fields: {
          query: {
            title: "Hľadaný výraz",
            description: "Jasný a konkrétny hľadaný výraz alebo otázka.",
            placeholder: "Zadajte hľadaný výraz...",
          },
          mode: {
            title: "Režim vyhľadávania",
            description:
              "Vyberte odpovede AI (FastGPT) alebo priame výsledky vyhľadávania",
            options: {
              fastgpt: "FastGPT (odpovede AI)",
              search: "Vyhľadávanie (priame výsledky)",
            },
          },
        },
        response: {
          success: {
            title: "Hotovo",
            description: "Určuje, či sa vyhľadávanie podarilo",
          },
          message: {
            title: "Správa",
            description: "Správa o stave vyhľadávania",
          },
          output: {
            title: "Odpoveď",
            description: "Odpoveď vytvorená AI cez FastGPT",
          },
          query: {
            title: "Dopyt",
            description: "Použitý vyhľadávací dopyt",
          },
          references: {
            title: "Odkazy na zdroje",
            description: "Odkazy na zdroje a citácie",
            reference: "Zdroj",
            item: {
              title: "Zdroj",
              description: "Odkaz na zdroj s citáciou",
              url: "URL",
              snippet: "Úryvok",
            },
          },
          cached: {
            title: "Z vyrovnávacej pamäte",
            description:
              "Určuje, či sa výsledky načítali z vyrovnávacej pamäte",
          },
          timestamp: {
            title: "Časová značka",
            description: "Čas vykonania vyhľadávania",
          },
        },
        errors: {
          queryEmpty: {
            title: "Vyhľadávací dopyt je povinný",
            description: "Zadajte hľadaný výraz",
          },
          queryTooLong: {
            title: "Hľadaný výraz je príliš dlhý",
            description: "Dopyt môže mať najviac 400 znakov",
          },
          timeout: {
            title: "Vypršal časový limit vyhľadávania",
            description: "Vyhľadávanie trvalo príliš dlho",
          },
          searchFailed: {
            title: "Vyhľadávanie zlyhalo",
            description: "Pri vyhľadávaní došlo k chybe",
          },
          validation: {
            title: "Neplatné vyhľadávanie",
            description:
              "Skontrolujte parametre vyhľadávania a skúste to znova",
          },
          internal: {
            title: "Niečo sa pokazilo",
            description: "Vyhľadávanie sa nepodarilo dokončiť. Skúste to znova",
          },
          notConfigured: {
            title:
              "Kľúč API pre {{label}} nie je nastavený. Do súboru .env pridajte {{envKey}}=<your-key>. Kľúč získate na {{url}}",
            description: "Nastavte {{label}} a povoľte vyhľadávanie Kagi",
          },
        },
        success: {
          title: "Vyhľadávanie úspešné",
          description: "Vyhľadávanie Kagi sa dokončilo",
        },
      },
      tags: {
        search: "Vyhľadať",
        web: "Web",
        ai: "AI",
      },
    },
    enums: {
      provider: {
        BRAVE: "Brave Search",
        KAGI: "Kagi FastGPT",
      },
    },
  },
  speechToText: {
    category: "Agent",

    hotkey: {
      post: {
        title: "Klávesová skratka na prepis reči",
        titleShort: "Skratka na prepis reči",
        description: "Nahrajte a prepíšte zvuk s automatickým vložením textu",
        form: {
          title: "Nastavenia klávesovej skratky",
          description: "Nastavte klávesovú skratku na prepis reči",
        },
        action: {
          label: "Akcia",
          description: "Akcia, ktorá sa má vykonať (start/stop/toggle)",
          options: {
            start: "Spustiť",
            stop: "Zastaviť",
            toggle: "Prepnúť",
            status: "Stav",
          },
        },
        provider: {
          label: "Poskytovateľ",
          description: "Poskytovateľ AI na prepis",
        },
        language: {
          label: "Jazyk",
          description: "Jazyk nahrávky",
        },
        insertPrefix: {
          label: "Vložiť pred text",
          description: "Text, ktorý sa vloží pred prepis",
          placeholder: "napr. '> '",
        },
        insertSuffix: {
          label: "Vložiť za text",
          description: "Text, ktorý sa vloží za prepis",
          placeholder: "napr. ' '",
        },
        response: {
          title: "Výsledok",
          description: "Výsledok nahrávania a prepisu",
          success: "Hotovo",
          status: "Stav",
          message: "Správa",
          text: "Prepísaný text",
          recordingDuration: "Dĺžka nahrávky (ms)",
        },
        errors: {
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Na použitie tejto funkcie sa musíte prihlásiť",
          },
          validation: {
            title: "Chyba overenia",
            description: "Parametre požiadavky sú neplatné",
          },
          server: {
            title: "Chyba servera",
            description: "Nahrávku sa nepodarilo spracovať",
          },
          conflict: {
            title: "Konflikt",
            description: "Nahrávanie už prebieha",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Nemáte oprávnenie použiť túto funkciu",
          },
          network: {
            title: "Chyba siete",
            description: "Nepodarilo sa pripojiť k službe prepisu",
          },
          notFound: {
            title: "Nenájdené",
            description: "Relácia sa nenašla",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Prebieha nahrávanie",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Nastala neočakávaná chyba",
          },
          dependenciesMissing:
            "Chýbajú potrebné závislosti: {missing}. {recommendations}",
          invalidAction: "Neplatná akcia: {action}",
          actionFailed: "Akciu sa nepodarilo vykonať: {error}",
          alreadyRecording: "Nahrávanie už prebieha",
          notRecording: "Nahrávanie neprebieha",
        },
        success: {
          title: "Hotovo",
          description: "Operácia sa dokončila",
        },
      },
      tags: {
        ai: "AI",
        transcription: "Prepis",
        speech: "Reč",
        hotkey: "Klávesová skratka",
        cli: "CLI",
      },
      platforms: {
        macos: "macOS",
        linuxWayland: "Linux (Wayland)",
        linuxX11: "Linux (X11)",
        windows: "Windows",
      },
      status: {
        idle: "Nečinné",
        recording: "Nahráva sa",
        processing: "Spracúva sa",
        completed: "Dokončené",
        error: "Chyba",
      },
      actions: {
        start: "Spustiť nahrávanie",
        stop: "Zastaviť nahrávanie",
        toggle: "Prepnúť nahrávanie",
        status: "Skontrolovať stav",
      },
      recorderBackends: {
        ffmpegAvfoundation: "FFmpeg (AVFoundation)",
        ffmpegPulse: "FFmpeg (PulseAudio)",
        ffmpegAlsa: "FFmpeg (ALSA)",
        ffmpegDshow: "FFmpeg (DirectShow)",
        wfRecorder: "wf-recorder",
        arecord: "arecord",
      },
      typerBackends: {
        applescript: "AppleScript",
        wtype: "wtype",
        xdotool: "xdotool",
        wlClipboard: "wl-clipboard",
        xclip: "xclip",
        powershell: "PowerShell",
      },
    },
    post: {
      title: "Prevod reči na text",
      description:
        "Pomocou AI prepíšte zvuk na text. Účtuje sa každá sekunda nahrávky podľa sadzby zvoleného modelu.",
      form: {
        title: "Prepis zvuku",
        description:
          "Nahrajte zvukový súbor na prepis. Účtuje sa každá sekunda nahrávky podľa sadzby zvoleného modelu.",
      },
      fileUpload: {
        title: "Nahratie zvukového súboru",
        description: "Nahrajte zvukový súbor na prepis",
      },
      audio: {
        label: "Zvukový súbor",
        description: "Zvukový súbor na prepis (MP3, WAV, WebM a ďalšie)",
        validation: {
          maxSize: "Súbor musí mať menej ako 25 MB",
          audioOnly: "Nahrajte zvukový súbor alebo video",
        },
      },
      provider: {
        label: "Poskytovateľ",
        description: "Poskytovateľ AI na prepis",
      },
      language: {
        label: "Jazyk",
        description: "Jazyk nahrávky",
      },
      response: {
        title: "Výsledok prepisu",
        description: "Text prepísaný zo zvukového súboru",
        success: "Hotovo",
        text: "Prepísaný text",
        provider: "Použitý poskytovateľ",
        confidence: "Miera istoty",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na použitie tejto funkcie sa musíte prihlásiť",
        },
        validation: {
          title: "Chyba overenia",
          description: "Zvukový súbor alebo parametre sú neplatné",
        },
        server: {
          title: "Chyba servera",
          description: "Prepis sa nepodarilo spracovať",
        },
        apiKeyMissing: "Kľúč API pre Eden AI nie je nastavený",
        transcriptionFailed: "Prepis zlyhal: {{error}}",
        audioTooShort:
          "Nahrávka je príliš krátka. Podržte tlačidlo dlhšie a hovorte zreteľne.",
        noAudioFile: "Chýba zvukový súbor",
        internalError: "Interná chyba servera",
        noPublicId: "Služba nevrátila verejné ID",
        pollFailed: "Nepodarilo sa zistiť výsledky prepisu",
        failed: "Prepis zlyhal",
        timeout: "Vypršal časový limit prepisu",
        creditsFailed: "Kredity sa nepodarilo odpočítať: {{error}}",
        providerError:
          "Chyba služby prepisu. Skúste to znova. Ak problém pretrváva, obráťte sa na podporu.",
        balanceCheckFailed:
          "Zostatok kreditov sa nepodarilo overiť. Skúste to znova.",
        insufficientCredits:
          "Na tento prepis nemáte dostatok kreditov. Ak chcete pokračovať, doplňte si ich.",
      },
      success: {
        title: "Hotovo",
        description: "Zvuk bol prepísaný",
        transcriptionComplete: "Prepis sa dokončil",
      },
    },
    providers: {
      openai: "OpenAI Whisper",
      assemblyai: "AssemblyAI",
      deepgram: "Deepgram",
      google: "Google Speech-to-Text",
      amazon: "Amazon Transcribe",
      microsoft: "Microsoft Azure",
      ibm: "IBM Watson",
      rev: "Rev.ai",
    },
    languages: {
      en: "Angličtina",
      de: "Nemčina",
      pl: "Poľština",
      es: "Španielčina",
      sk: "Slovenčina",
      fr: "Francúzština",
      it: "Taliančina",
    },
    models: {
      descriptions: {
        openaiWhisper:
          "Whisper od OpenAI rozpoznáva reč a trénoval na 99 jazykoch. Prepisuje rozhovory, hlasové poznámky a stretnutia. Dobre zvláda prízvuky aj hluk v pozadí. Je lacný. Nerozlišuje hovoriacich a počas dlhších prestávok si môže domýšľať text. Novšou alternatívou od OpenAI je GPT-4o Mini Transcribe.",
        deepgramNova2:
          "Deepgram Nova-2. Rýchly a presný prepis reči, ktorý zvláda hluk.",
        whisperLargeV3:
          "Whisper Large V3. Model OpenAI s otvorenými váhami pre 99 jazykov. Je výrazne lacnejší ako hostovaný model whisper-1.",
        voxtralSmall:
          "Prepíšte nahratú reč pomocou modelu Voxtral Small od Mistralu.",
        voxtralMini:
          "Voxtral Mini Transcribe. Model od Mistralu rozlišuje hovoriacich a pridáva časové značky k úsekom. Spracuje nahrávky do 10 minút.",
        qwen3Asr:
          "Prepíšte reč v 30 jazykoch a 22 čínskych dialektoch pomocou Qwen3 ASR.",
        parakeetV3:
          "Prepíšte reč v 25 európskych jazykoch s automatickým rozpoznaním jazyka a doplnením interpunkcie.",
        nemotron35Transcribe:
          "Prepíšte až hodinu zvuku v 40 jazykoch pomocou NVIDIA Nemotron.",
        nemotronAsr:
          "Nemotron ASR. Otvorený viacjazyčný model od NVIDIA na rozpoznávanie reči so 40 jazykovými a regionálnymi variantmi a krátkym časom odozvy.",
        gpt4oMiniTranscribe:
          "GPT-4o Mini Transcribe. Robí menej chýb v slovách ako Whisper a lepšie rozpoznáva jazyky.",
      },
    },
  },
  textToSpeech: {
    category: "Agent",
    tags: {
      speech: "Reč",
      tts: "Prevod textu na reč",
      ai: "AI",
    },

    post: {
      title: "Prevod textu na reč",
      description:
        "Pomocou AI vytvorte z textu prirodzene znejúcu reč. Účtuje sa každý znak podľa sadzby zvoleného hlasu.",
      form: {
        title: "Prevod textu na reč",
        description:
          "Zadajte text na prevod na reč. Účtuje sa každý znak podľa sadzby zvoleného hlasu.",
      },
      text: {
        label: "Text",
        description: "Text na prevod na reč",
        placeholder: "Zadajte text, ktorý chcete previesť na reč...",
      },
      voice: {
        label: "Hlas",
        description: "Hlasový model na syntézu reči",
      },
      response: {
        title: "Zvukový výstup",
        description: "Vytvorená zvuková nahrávka reči",
        success: "Hotovo",
        audioUrl: "URL zvukového súboru",
      },
      errors: {
        validation_failed: {
          title: "Chyba overenia",
          description: "Zadaný text alebo parametre sú neplatné",
        },
        network_error: {
          title: "Chyba siete",
          description: "Nepodarilo sa pripojiť k serveru",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na prevod textu na reč sa musíte prihlásiť",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Nemáte oprávnenie použiť prevod textu na reč",
        },
        not_found: {
          title: "Nenájdené",
          description: "Požadovaný zdroj sa nenašiel",
        },
        server_error: {
          title: "Chyba servera",
          description: "Pri prevode textu na reč došlo k chybe",
        },
        unknown_error: {
          title: "Neznáma chyba",
          description: "Nastala neočakávaná chyba",
        },
        unsaved_changes: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt",
        },
        notConfigured:
          "Kľúč API pre {{label}} nie je nastavený. Do súboru .env pridajte {{envKey}}=<your-key>. Kľúč získate na {{url}}",
        conversionFailed: "Syntéza reči zlyhala: {{error}}",
        noText: "Chýba text",
        noAudioUrl: "Poskytovateľ nevrátil URL zvukového súboru",
        audioFetchFailed:
          "Zvukový súbor sa nepodarilo vytvoriť. Skúste to znova",
        providerError: "Chyba poskytovateľa: {{error}}",
        internalError: "Interná chyba servera",
        unsupportedProvider:
          "Nepodporovaný poskytovateľ prevodu textu na reč pre hlas {{voiceId}}",
        creditsFailed: "Kredity sa nepodarilo odpočítať: {{error}}",
        balanceCheckFailed:
          "Zostatok kreditov sa nepodarilo overiť. Skúste to znova.",
        insufficientCredits:
          "Na prevod nemáte dostatok kreditov. Ak chcete pokračovať, doplňte si ich.",
      },
      success: {
        title: "Hotovo",
        description: "Text bol prevedený na reč",
        conversionComplete: "Syntéza reči sa dokončila",
      },
    },
    languages: {
      en: "Angličtina",
      de: "Nemčina",
      pl: "Poľština",
      es: "Španielčina",
      sk: "Slovenčina",
      fr: "Francúzština",
      it: "Taliančina",
    },
    models: {
      descriptions: {
        openaiAlloy:
          "Alloy od OpenAI. Vyvážený, rodovo neutrálny hlas s rovnomerným tempom. Hodí sa na rozprávanie, vysvetlenia a odborný obsah, pri ktorom hlas nemá pútať pozornosť. Stojí zlomok centa. Je menej srdečný než Nova a pôsobí menej dôrazne než Onyx.",
        openaiNova:
          "Nova od OpenAI. Jasný, srdečný ženský hlas. Hodí sa pre asistentov, konverzačné aplikácie a veselé texty. Stojí veľmi málo. Na vážne a formálne texty sa lepšie hodí Onyx.",
        openaiOnyx:
          "Onyx od OpenAI. Hlboký pokojný mužský hlas pôsobí dôveryhodne. Hodí sa na dokumenty, formálne rozprávanie a oznámenia. Stojí veľmi málo. Na neformálne rozhovory je ľahšou a srdečnejšou voľbou Nova.",
        openaiEcho:
          "OpenAI Echo. Jasný hlas so zreteľnou výslovnosťou a prirodzeným rytmom.",
        openaiShimmer:
          "OpenAI Shimmer. Výrazný, dynamický hlas na pútavý obsah.",
        openaiFable: "OpenAI Fable. Výrazný rozprávačský hlas.",
        elevenlabsRachel:
          "ElevenLabs Rachel. Prirodzený ženský hlas so širokou škálou emócií.",
        elevenlabsJosh:
          "ElevenLabs Josh. Prirodzený mužský hlas s konverzačným tónom.",
        elevenlabsBella:
          "ElevenLabs Bella. Srdečný ženský hlas s jemným prednesom.",
        elevenlabsAdam:
          "ElevenLabs Adam. Profesionálny mužský hlas na tvorbu obsahu.",
        elevenlabsRachelTurbo:
          "ElevenLabs Rachel Turbo. Rovnaký hlas na v4 Turbo. Polovičná cena a takmer okamžitý výstup.",
        elevenlabsJoshTurbo:
          "ElevenLabs Josh Turbo. Rovnaký hlas na v4 Turbo. Polovičná cena a takmer okamžitý výstup.",
        elevenlabsBellaTurbo:
          "ElevenLabs Bella Turbo. Rovnaký hlas na v4 Turbo. Polovičná cena a takmer okamžitý výstup.",
        elevenlabsAdamTurbo:
          "ElevenLabs Adam Turbo. Rovnaký hlas na v4 Turbo. Polovičná cena a takmer okamžitý výstup.",
        kokoroBella:
          "Kokoro Bella. Model s otvorenými váhami a 82 miliónmi parametrov. Má srdečný americký ženský hlas a funguje bez obsahového filtra.",
        qwen3Ryan:
          "Ryan číta nahlas v 10 jazykoch vrátane nemčiny pomocou otvoreného hlasového modelu Qwen3.",
        orpheusTara: "Tara číta po anglicky s výrazným tempom a intonáciou.",
        kokoroSarah:
          "Kokoro Sarah. Model s otvorenými váhami a 82 miliónmi parametrov. Má jasný americký ženský hlas a funguje bez obsahového filtra.",
        kokoroNicole:
          "Kokoro Nicole. Model s otvorenými váhami a 82 miliónmi parametrov. Má jemný, nenápadný ženský hlas a funguje bez obsahového filtra.",
        kokoroAdam:
          "Kokoro Adam. Model s otvorenými váhami a 82 miliónmi parametrov. Má vyrovnaný americký mužský hlas a funguje bez obsahového filtra.",
        kokoroMichael:
          "Kokoro Michael. Model s otvorenými váhami a 82 miliónmi parametrov. Má sebavedomý americký mužský hlas a funguje bez obsahového filtra.",
        kokoroEmma:
          "Kokoro Emma. Model s otvorenými váhami a 82 miliónmi parametrov. Má britský ženský hlas a funguje bez obsahového filtra.",
        kokoroGeorge:
          "Kokoro George. Model s otvorenými váhami a 82 miliónmi parametrov. Má britský mužský hlas a funguje bez obsahového filtra.",
        voxtralPaul:
          "Prečítajte anglický text nahlas Paulovým neutrálnym hlasom pomocou modelu Voxtral Mini.",
        inworldAshley:
          "Inworld Ashley. Rýchly a úsporný ženský hlas so živým prednesom.",
        inworldCraig: "Inworld Craig. Rýchly a úsporný britský mužský hlas.",
        xaiEve:
          "xAI Eve. Výrazný ženský hlas s možnosťou meniť emócie priamo v texte.",
        geminiZephyr:
          "Gemini Zephyr. Jasný ženský hlas podporuje viac ako 100 jazykov a pokyny na prednes.",
        geminiPuck:
          "Gemini Puck. Veselý mužský hlas podporuje viac ako 100 jazykov a pokyny na prednes.",
      },
    },
  },
};
