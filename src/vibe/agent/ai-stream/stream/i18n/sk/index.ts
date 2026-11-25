// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/sk";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    streaming: "Streamovanie",
    chat: "Chat",
    ai: "AI",
  },

  run: {
    task: {
      name: "Kontrola aktivity AI",
      description:
        "Agent AI na pozadí kontroluje stav systému, spracúva úlohy a podľa potreby kontaktuje používateľa.",
    },
    post: {
      title: "Spustiť agenta AI",
      titleShort: "Spustiť agenta",
      dynamicTitle: "Spustenie AI{{suffix}}: {{prompt}}",
      description:
        "Zverte úlohu špecializovanému agentovi AI a vráťte jeho odpoveď. Tvorbu a úpravy zručností či osobností AI vždy delegujte cez skill='skill-creator'. Odovzdajte parametre skill a prompt. Agent vybaví zvyšok. Spotreba kreditov závisí od modelu.",
      container: {
        title: "Spustiť agenta AI",
        description:
          "Nastaviť predbežné volania a zadanie pre spustenie AI bez používateľského rozhrania",
      },
      fields: {
        favoriteId: {
          label: "ID obľúbenej položky",
          description:
            "Identifikátor uloženej obľúbenej konfigurácie (napr. 'thea-cheap'). Týmto poľom načítate zručnosť, model aj konfiguráciu nástrojov naraz. Identifikátor samotnej zručnosti patrí do poľa skill. Pri viacerých nastavených poliach platí poradie: model > favoriteId > skill.",
          placeholder: "thea-cheap",
        },
        model: {
          label: "Model (iba CLI)",
          description:
            "Priamo vyberte model LLM. Platí iba v CLI. Na ostatných platformách použite favoriteId alebo skill. Rýchle: claude-haiku-4.5 a gemini-2.5-flash. Vyvážené: claude-sonnet-4.6 a gpt-5. Výkonný: claude-opus-4.7. Bezplatný: qwen3_235b-free.",
        },
        skill: {
          label: "Zručnosť",
          description:
            "Identifikátor zručnosti, napríklad 'thea' alebo 'thea__cheap-smart'. Určuje osobnosť AI a systémové zadanie. Pre obľúbenú konfiguráciu použite favoriteId. Na tvorbu a úpravu zručností použite 'skill-creator'.",
          placeholder: "default",
        },
        prompt: {
          label: "Zadanie",
          description:
            "Hlavný pokyn alebo otázka pre AI. Formulujte ju konkrétne. Ak zadáte preCalls, AI použije výsledky týchto volaní ako kontext.",
          placeholder: "Zadaj pokyn…",
        },
        instructions: {
          label: "Extra systémové pokyny",
          description:
            "Nepovinné pokyny pridané do systémového zadania. Určujú formát, tón alebo dĺžku odpovede. Príklad: „Odpovedz stručne a iba vo formáte JSON.“",
          placeholder: "Odpovedz stručne, najviac jedným odsekom.",
        },
        preCalls: {
          label: "Predbežné volania",
          description:
            "Nástroje, ktoré sa zavolajú pred odoslaním zadania. Výsledky sa pridajú do kontextu. Dostupné nástroje a ich argumenty zobrazíš pomocou tool-help.",
          routeId: {
            label: "ID nástroja",
            description:
              "Alias alebo úplný názov nástroja, napríklad web-search alebo agent_skills_GET. Dostupné nástroje zobrazíš pomocou tool-help.",
            placeholder: "web-search",
          },
          args: {
            label: "Argumenty",
            description:
              'Argumenty nástroja ako dvojice kľúč a hodnota. Zlúčte urlPathParams a polia tela do jedného objektu, napríklad {"query": "latest news", "maxResults": 5}.',
          },
        },
        availableTools: {
          label: "Povolené na spustenie",
          description:
            "Nástroje pre toto spustenie. [] povoľuje iba text, napríklad na písanie konceptu. Ak pole vynecháte, použijú sa nástroje zručnosti alebo obľúbenej konfigurácie. Ďalšie zoznamy sa zatiaľ neuplatňujú.",
          toolId: {
            label: "ID nástroja",
            description:
              "Alias alebo úplný názov nástroja, napríklad execute-tool, tool-help alebo web-search",
          },
          requiresConfirmation: {
            label: "Vyžaduje potvrdenie",
            description:
              "Pred spustením nástroja počkať na potvrdenie používateľa",
          },
        },
        pinnedTools: {
          label: "V kontexte modelu",
          description:
            "Nástroje načítané do kontextu modelu. null = predvolená sada používateľa. Ovplyvňuje len to, čo model vidí, nie to, čo dokáže vykonať.",
          toolId: {
            label: "ID nástroja",
            description:
              "Alias alebo úplný názov nástroja, ktorý sa načíta do kontextu",
          },
          requiresConfirmation: {
            label: "Vyžaduje potvrdenie",
            description:
              "Či nástroj pred spustením vyžaduje potvrdenie používateľa",
          },
        },
        maxTurns: {
          label: "Najviac krokov",
          description:
            "Najvyšší počet krokov modelu v tomto spustení. Ak pole necháte prázdne, použije sa limit z nastavení četu.",
        },
        appendThreadId: {
          label: "ID vlákna na pokračovanie",
          description:
            "UUID existujúceho vlákna, v ktorom chceš pokračovať. Nová správa sa pridá do tohto vlákna. Ak pole vynecháš, vznikne nové vlákno.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        rootFolderId: {
          label: "Priečinok pre ukladanie",
          description:
            "Určuje, kam sa uloží vlákno. Na pozadí: automatické spustenia (Dreamer, Autopilot, naplánované úlohy). Súkromné: váš priečinok. Zdieľané: tímový priestor. Inkognito: vlákno sa neuloží.",
          placeholder: "background",
          options: {
            background: "Na pozadí",
            private: "Súkromné",
            shared: "Zdieľané",
            public: "Verejné",
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
          label: "Vylúčenie spomienok",
          description:
            "Vynechá uložené spomienky z kontextu. Použite pri verejných botoch alebo samostatných úlohách. Predvolená hodnota: false.",
        },
      },
      response: {
        text: "Text odpovede AI bez značiek uvažovania. Ak model nič nevytvoril, hodnota je null.",
        promptTokens: "Spotrebované vstupné tokeny (vstupné náklady)",
        completionTokens: "Vygenerované výstupné tokeny (výstupné náklady)",
        creditCost:
          "Kredity odpočítané za toto spustenie. V režime inkognito je hodnota null.",
        threadId:
          "UUID vlákna, v ktorom je výsledok uložený. Ak má rootFolderId hodnotu 'incognito', výsledok je null. V konverzácii pokračujte cez appendThreadId.",
        lastAiMessageId:
          "UUID poslednej správy asistenta. Použi ho na vytvorenie vetvy alebo odkázanie na odpoveď.",
        threadTitle: "Automaticky vytvorený názov vlákna",
        threadCreatedAt: "Čas vytvorenia vlákna vo formáte ISO 8601",
        preCallResults: {
          title: "Výsledky predbežných volaní",
          routeId: "Zavolaný nástroj",
          succeeded: "Či sa volanie podarilo",
          errorMessage: "Chybové hlásenie pri zlyhaní volania",
        },
      },
      errors: {
        validation: {
          title: "Chyba overenia",
          description: "Zadané parametre sú neplatné",
        },
        unauthorized: {
          title: "Bez oprávnenia",
          description: "Vyžaduje sa prihlásenie",
        },
        forbidden: {
          title: "Prístup zakázaný",
          description: "Prístup zamietnutý",
        },
        notFound: {
          title: "Nenájdené",
          description: "Koncový bod alebo zdroj sa nenašiel",
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
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsaved: {
          title: "Neuložené zmeny",
          description: "Konflikt neuložených zmien",
        },
        conflict: {
          title: "Konflikt",
          description: "Nastal konflikt údajov",
        },
      },
      requireFavOrSkill:
        "Zadajte favoriteId, skill alebo model (model iba v CLI). Na spustenie je potrebné určiť model aj zručnosť.",
      skillNotFound:
        "Zručnosť „{{skill}}“ sa nenašla. Ak ide o identifikátor obľúbenej položky, napríklad thea-cheap, zadaj --favoriteId namiesto --skill.",
      success: {
        title: "Agent AI dokončil úlohu",
        description: "Agent AI úspešne dokončil úlohu",
      },
      backButton: {
        label: "Späť",
      },
    },
  },
  route: {
    debug: {
      userObject: "AI Stream Route: Používateľský objekt",
      extracted: "AI Stream Route: Extrahované hodnoty",
    },
    errors: {
      invalidJson: "Neplatný JSON v tele požiadavky",
      invalidRequestData: "Neplatné údaje požiadavky ({{issue}})",
      modelAdminOnly:
        "Model {{model}} nie je dostupný pre tvoj účet. Vyber iný model.",
      threadPostForbidden:
        "V tomto vlákne nemáš oprávnenie prispievať. Ak chceš pokračovať, začni nový čet.",
      fileTypeNotAllowed: "Typ súboru nie je povolený: {{fileType}}",
      uncensoredApiKeyMissing: "Chýba kľúč API pre Uncensored.ai",
      openrouterApiKeyMissing: "Chýba kľúč API pre OpenRouter",
      streamCreationFailed: "Nepodarilo sa pripojiť k službe AI. Skús znova.",
      unknownError: "Vyskytla sa chyba",
      creditValidationFailed: "Nepodarilo sa overiť zostatok kreditov",
      noIdentifier: "Chýba ID používateľa alebo kontaktu",
      insufficientCredits:
        "Nemáš dosť kreditov. Cena je {{cost}} a tvoj zostatok je {{balance}}. Doplň si kredity alebo vyber lacnejší model.",
      noResponseBody: "V prenose chýbalo telo odpovede",
      authenticationRequired:
        "Ak chceš ukladať čety do priečinkov, prihlás sa. Na anonymné čety použi režim inkognito.",
    },
  },
  post: {
    title: "Čet s AI",
    titleShort: "Čet s AI",
    description:
      "Zobrazuje odpovede modelov ako Claude, GPT, Gemini a Llama priebežne. Podporuje text, hlas, prílohy a používanie nástrojov agentom AI.",
    form: {
      title: "Nastavenia četu s AI",
      description: "Nastaviť parametre četu s AI a jeho správy",
    },
    operation: {
      label: "Činnosť",
      description: "Akcia, ktorá sa má so správou vykonať",
      options: {
        send: "Poslať správu",
        retry: "Zopakovať správu",
        edit: "Upraviť správu",
        answerAsAi: "Odpovedať ako AI",
      },
    },
    rootFolderId: {
      label: "Koreňový priečinok",
      description: "Kontext koreňového priečinka pre správu",
      options: {
        private: "Súkromné",
        shared: "Zdieľané",
        public: "Verejné",
        incognito: "Inkognito (bez uloženia)",
        background: "Na pozadí",
      },
    },
    subFolderId: {
      label: "Podpriečinok",
      description: "Nepovinný podpriečinok v koreňovom priečinku",
    },
    threadId: {
      label: "ID vlákna",
      description:
        "Platné UUID vlákna, do ktorého sa správa odošle. Ak vlákno ešte nemáš, vytvor ho.",
    },
    userMessageId: {
      label: "ID správy používateľa",
      description: "ID správy používateľa vytvorené klientom",
    },
    parentMessageId: {
      label: "ID nadradenej správy",
      description: "ID nadradenej správy pre vetvenie vlákna",
    },
    leafMessageId: {
      label: "ID poslednej správy vo vetve",
      description:
        "ID poslednej správy v aktuálnej vetve. Aktívnu vetvu určuje nezávisle od adresy URL.",
    },
    incognitoThreadTitle: {
      label: "Názov vlákna v režime inkognito",
      description:
        "Aktuálny názov vlákna v režime inkognito. Posiela ho klient, pretože server takéto vlákna neukladá.",
    },
    incognitoThreadDescription: {
      label: "Opis vlákna v režime inkognito",
      description: "Aktuálny opis vlákna v režime inkognito",
    },
    messageHistory: {
      label: "História správ",
      description: "Nepovinná história správ pre režim inkognito",
      item: {
        title: "Správa",
        description: "Správa v histórii četu",
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
              label: "Výsledok nástroja",
            },
            error: {
              label: "Chyba nástroja",
            },
            executionTime: {
              label: "Čas vykonania (ms)",
            },
            creditsUsed: {
              label: "Použité kredity",
            },
          },
        },
      },
    },
    content: {
      label: "Obsah správy",
      description: "Obsah správy, ktorá sa má zaslať",
      placeholder: "Napíš správu…",
    },
    role: {
      label: "Rola",
      description: "Rola odosielateľa správy",
      options: {
        user: "Používateľ",
        assistant: "Asistent",
        system: "Systém",
        tool: "Nástroj",
        error: "Chyba",
      },
    },
    model: {
      label: "Model",
      description: "Model AI určený na generovanie",
    },
    skill: {
      label: "Zručnosť",
      description:
        "ID alebo slovný identifikátor zo zoznamu zručností, prípadne v tvare slug__variant. Ak zručnosť nechceš určiť, pole vynechaj alebo použi hodnotu default. Neznáme ID použijú predvolené nastavenie.",
    },
    systemPrompt: {
      label: "Systémové zadanie",
      description: "Nepovinné systémové pokyny",
      placeholder: "Zadaj systémové zadanie…",
      now: "Teraz",
      minutesAgo: "Pred {{minutes}} min",
      hoursAgo: "Pred {{hours}} h",
      daysAgo: "Pred {{days}} d",
    },
    enableSearch: {
      label: "Povoliť vyhľadávanie na webe",
      description: "Povoliť AI vyhľadávať aktuálne informácie na webe",
    },
    timezone: {
      label: "Časové pásmo",
      description:
        "Časové pásmo používateľa na jednotné časové údaje pri ukladaní do vyrovnávacej pamäte",
    },
    imageSize: {
      label: "Veľkosť obrázku",
      description:
        "Rozmery obrázka, napríklad square (štvorec), landscape (na šírku) alebo portrait (na výšku)",
    },
    imageQuality: {
      label: "Kvalita obrázku",
      description: "Kvalita vygenerovaného obrázka (standard alebo hd)",
    },
    musicDuration: {
      label: "Trvanie hudby",
      description: "Trvanie vygenerovaného zvukového klipu",
    },
    favoriteConfig: {
      label: "Nastavenia obľúbenej položky",
      description:
        "Úplná aktívna obľúbená konfigurácia vrátane výberu modelov, nástrojov a kontextu. Hodnota null znamená, že nie je vybratá žiadna obľúbená konfigurácia. Použijú sa nastavenia zručnosti alebo systému.",
    },
    enabledToolIds: {
      label: "Povolené ID nástrojov",
      description: "Zoznam ID nástrojov AI pre tento rozhovor",
    },
    toolConfirmation: {
      label: "Potvrdenie nástroja",
      description: "Rozhodnutie používateľa o spustení nástroja",
      success: "Rozhodnutie o spustení nástroja sa spracovalo",
      messageId: {
        label: "ID správy",
        description: "ID správy, ktorá obsahuje volanie nástroja",
      },
      confirmed: {
        label: "Potvrdené",
        description: "Či používateľ potvrdil spustenie nástroja",
      },
      updatedArgs: {
        label: "Aktualizované argumenty",
        description: "Nepovinné upravené argumenty volania nástroja",
      },
      errors: {
        messageNotFound: "Správa o volaní nástroja sa nenašla",
        toolCallMissing: "Chýbajú metadáta ToolCall",
        toolNotFound: "Nástroj sa nenašiel.",
      },
    },
    resumeToken: {
      label: "Token na obnovenie",
      description: "Token na obnovenie prerušeného prenosu",
    },
    voiceMode: {
      label: "Hlasový režim",
      description: "Konfigurácia pre hlasovú interakciu",
      enabled: {
        label: "Povoliť hlasový režim",
        description: "Povoliť hlasovú interakciu pomocou prevodu textu na reč",
      },
      voice: {
        label: "Hlas",
        description:
          "Vyber hlas pre prevod textu na reč. Mužský hlas má hodnotu voices.MALE, ženský voices.FEMALE (predvolené).",
        male: "Mužský hlas",
        female: "Ženský hlas",
      },
    },
    audioInput: {
      title: "Zvukový vstup",
      description: "Nahraj audio súbor pre hlasový režim",
      file: {
        label: "Audio súbor",
        description: "Zvukový súbor na prepis a spracovanie",
      },
    },
    attachments: {
      label: "Prílohy",
      description: "Súbory pripojené k správe (obrázky, dokumenty atď.)",
    },
    executionContext: {
      label: "Kontext vykonania",
      description:
        "Spôsob spracovania odpovede: lokálne, cez vzdialenú inštanciu alebo cez inference-provider. Bežné požiadavky četu sa predvolene spracúvajú lokálne.",
    },
    response: {
      title: "Priebežná odpoveď",
      description: "Priebežne generovaná odpoveď AI",
      success: "Prenos sa úspešne dokončil",
      messageId: "ID správy",
      threadId: "ID vlákna",
      totalTokens: "Celkový počet použitých tokenov",
      finishReason: "Dôvod dokončenia",
      lastAiMessageContent: "Konečný obsah správy AI",
      lastGeneratedMediaUrl: "Adresa URL vygenerovaného média",
      totalCreditsDeducted: "Odpočítané kredity",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Priebežné odpovede AI vyžadujú prihlásenie",
      },
      validation: {
        title: "Chyba overenia",
        description: "Zadané parametre požiadavky sú neplatné",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala chyba interného servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete počas streamovania",
      },
      serviceUnavailable: {
        title: "Vzdialená inštancia je nedostupná",
        description:
          "Nepodarilo sa pripojiť k inštancii, od ktorej toto vlákno závisí",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nemáš oprávnenie na priebežné odpovede AI",
      },
      notFound: {
        title: "Nenájdené",
        description: "Koncový bod na priebežné odpovede AI sa nenašiel",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt údajov nastal počas streamovania",
      },
    },
    success: {
      title: "Úspech",
      description: "Odpoveď AI sa úspešne vygenerovala",
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
        configuration: "Chyba konfigurácie streamovania AI",
        processing: "Chyba pri spracovaní odpovede AI",
      },
    },
  },
  debugView: {
    systemPromptTitle: "Systémové zadanie",
    copied: "Skopírované!",
  },
  errorTypes: {
    streamError: "Chyba prenosu odpovede",
  },
  errorThread: {
    title: "Chyba",
  },
  error: {
    title: "Chyba prenosu odpovede",
  },
  info: {
    streamInterrupted: "Odpoveď sa prerušila. Doterajší text sme uložili.",
    billingFailed:
      "Odpoveď sa zastavila, pretože sa nepodarilo odpočítať kredity. Nič sa nestratilo. O chvíľu odošli správu znova.",
    budgetExceeded:
      "Úloha na pozadí dosiahla limit kreditov. Ak má pokračovať, zvýš jej rozpočet v nastaveniach limitov úloh.",
    taskWatchdog:
      "Dohľad úlohu zastavil, pretože prekročila povolený čas, počet krokov alebo počet volaní nástrojov.",
    turnStepLimit:
      "AI sa pozastavila. Počet vykonaných krokov: {{steps}}. Napíš „pokračuj“, aby nadviazala tam, kde skončila.",
    raiseTurnStepLimit: "Zvýš limit krokov v nastaveniach četu",
  },
  errors: {
    toolExecutionError: "Nástroj sa nepodarilo spustiť. Skús znova.",
    toolExecutionErrorDetail: "Chyba nástroja: {{error}}",
    toolExecutionFailed: "Vykonanie nástroja zlyhalo. Skús znova.",
    toolDisabledByUser:
      "Tento nástroj bol vypnutý používateľom. Nepokúšajte sa ho volať znova.",
    userDeclinedTool: "Vykonanie nástroja bolo zrušené.",
    streamError: "Odpoveď AI sa nedokončila. Skús znova.",
    pendingToolCall:
      "Nástroj ešte beží na pozadí. Pred pokračovaním počkaj, kým sa dokončí.",
    streamProcessingError: "Odpoveď AI sa nepodarilo spracovať. Skús znova.",
    timeout: "AI prestala odpovedať. Skús znova.",
    noResponse: "AI nevygenerovala odpoveď. Skús znova.",
    creditBudgetReached:
      "Minuli sa ti kredity a odpoveď sa zastavila. Ak chceš pokračovať, doplň si kredity.",
    emptyAnswer:
      "Model nevytvoril odpoveď. Platíš iba sumu, ktorú účtoval poskytovateľ, bez poplatku platformy. Skús znova alebo vyber iný model.",
    contentFiltered:
      "Odpoveď zablokoval filter obsahu poskytovateľa. Skús iný model.",
    contextTooLong:
      "Správa s históriou presahuje kontextové okno modelu. Skráť správu, otvor nový čet alebo vyber model s väčším kontextovým oknom.",
    imageTooLarge:
      "Obrázok presahuje limit modelu. Pošli menší obrázok a skús znova.",
    malformedToolCall:
      "Model odoslal neplatné volanie nástroja a nástroj sa nespustil. Stlač „Pokračovať“ a model to skúsi znova.",
    providerBusy:
      "Model je preťažený. Skús znova o pár sekúnd alebo vyber iný model.",
    modelUnavailable:
      "Vybraný model AI je momentálne nedostupný. Skús iný model.",
    rateLimitExceeded: "Príliš veľa požiadaviek. Chvíľu počkaj a skús znova.",
    insufficientCredits: "Na dokončenie požiadavky nemáš dosť kreditov.",
    connectionFailed:
      "Nepodarilo sa pripojiť k službe AI. Skontroluj pripojenie a skús znova.",
    invalidRequest:
      "Neplatná požiadavka. Skontroluj zadané údaje a skús znova.",
    compactingStreamError:
      "Dosiahol sa limit kontextu. Čet je príliš dlhý na automatické zhrnutie. Vytvor vetvu zo staršej správy, vyber model s väčším kontextovým oknom alebo uprav limit v nastaveniach obľúbenej položky.",
    compactingStreamErrorExpensive:
      "Dosiahol sa limit kontextu. Počet tokenov: {{tokens}}. Väčšie kontextové okno môže zvýšiť cenu. Najprv skús vytvoriť vetvu zo staršej správy alebo zmeniť model.",
    compactingException:
      "Históriu četu sa nepodarilo zhrnúť. Skús vytvoriť vetvu zo staršej správy alebo zmeniť model.",
    compactingRebuildFailed:
      "Po zhrnutí sa nepodarilo obnoviť čet. Skús vytvoriť vetvu zo staršej správy.",
    unexpectedError: "Nastala neočakávaná chyba: {{error}}. Skús znova.",
  },
  headless: {
    errors: {
      // Thrown when runHeadlessAiStream() is called without a resolvable model+skill.
      // Either pass model+skill directly, or pass favoriteId pointing to a favorite
      // that has a MANUAL or FILTERS modelSelection (not SKILL_BASED with no skill).
      missingModelOrSkill:
        "Chýba model alebo zručnosť. Zadajte ich priamo alebo použite favoriteId obľúbenej konfigurácie s platným výberom modelu.",
      favoriteNotFound:
        "Obľúbená položka sa nenašla alebo nepatrí tomuto používateľovi",
      ambiguousModel:
        "Zadajte buď konkrétny model, alebo obľúbenú konfiguráciu či zručnosť.",
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
    signin: {
      title: "Ulož si svoje nastavenia",
      subtitle: "Stačí sa raz prihlásiť. Všetko, čo tu vytvoríš, ti zostane.",
      benefits: {
        sync: {
          title: "Synchronizované medzi zariadeniami",
          body: "Tvoj spoločník, špecialisti aj čety na každom tvojom zariadení.",
        },
        keep: {
          title: "O svoju prácu neprídeš",
          body: "Bez účtu zostanú tvoje nastavenia iba v tomto prehliadači. Po prihlásení sa uložia do účtu.",
        },
        private: {
          title: "Súkromné už od začiatku",
          body: "O svojich údajoch a úrovni filtrovania rozhoduješ ty. Vždy.",
        },
      },
      cta: "Prihlásiť sa alebo vytvoriť účet",
      continueAsGuest: "Pokračovať ako hosť",
      note: "Z ponuky sa môžeš prihlásiť kedykoľvek neskôr.",
    },
    setup: {
      title: "Nastav si svoju AI",
      subtitle:
        "Vyber si, s kým chceš hovoriť. Ak chceš, pridaj špecialistov. Všetko môžeš neskôr zmeniť.",
      arrivalTitle: "Začni so zručnosťou {{skill}}",
      arrivalSubtitle:
        "V tomto čete odpovedá {{skill}}. O všetko ostatné sa postará tvoj spoločník.",
      arrivalLabel: "Tvoja zručnosť",
      arrivalBadge: "Súčasť výberu",
      companionLabel: "Tvoj spoločník",
      specialistsLabel: "Pridať špecialistov",
      optional: "nepovinné",
      start: "Začať čet",
      saving: "Nastavuje sa…",
      failed:
        "Nastavenia sa nepodarilo uložiť. Skontroluj pripojenie a skús znova.",
      retry: "Skúsiť znova",
      noProviderAvailable:
        "Chýba poskytovateľ AI. Ak chceš pokračovať, pridaj OPENROUTER_API_KEY alebo zapni Claude Code (CLAUDE_CODE_ENABLED=true).",
    },
    usecases: {
      coding: "Programovanie a technológie",
      research: "Výskum a analýza",
      writing: "Písanie a úprava textov",
      business: "Podnikanie a stratégia",
      creative: "Tvorba a príbehy",
      learning: "Učenie a štúdium",
      health: "Zdravie a kariéra",
      controversial: "Slobodné myslenie",
      roleplay: "Hranie rolí a postavy",
    },
  },
  input: {
    placeholder: "Napíš správu…",
    imagePlaceholder: "Opíš obrázok, ktorý chceš vytvoriť…",
    audioPlaceholder: "Opíš zvuk alebo hudbu, ktorú chceš vytvoriť…",
    noPermission: "Nemáš oprávnenie sem prispievať.",
    signInToPost: {
      title: "Na prispievanie stačí bezplatný účet",
      description:
        "Verejné vlákna si môže prečítať každý. Na vytvorenie vlákna alebo odpoveď potrebuješ bezplatný účet. Po registrácii sa vrátiš priamo sem.",
    },
    noCredits: {
      title: "Minuli sa ti kredity",
      addCredits: "Doplniť kredity",
      description: "Zostatok je nulový. Doplň si kredity a pokračuj v čete.",
    },
    creditsLoadFailed: {
      title: "Zostatok sa nepodarilo načítať.",
      retry: "Skúsiť znova",
    },
    insufficientCredits: {
      title: "Nemáš dosť kreditov. Potrebuješ {{cost}}, máš {{balance}}.",
      description: "Doplň si kredity alebo si vyber lacnejší model.",
    },
    noModel: {
      title: "Nie je vybraný model",
      description:
        "Najprv si vyber model. Ak sa žiadny nezobrazuje, skontroluj kľúče API poskytovateľa.",
    },
    keyboardShortcuts: {
      enter: "Enter",
      toSend: "odošle správu",
      shiftEnter: "Shift+Enter",
      forNewLine: "vloží nový riadok",
      ctrlV: "Ctrl+V",
      orPasteFiles: "alebo vlož súbory",
    },
    speechInput: {
      transcribing: "Prepisuje sa…",
    },
    attachments: {
      uploadFile: "Pripojiť súbory",
      attachedFiles: "Pripojené súbory",
      addMore: "Pridať ďalšie",
    },
  },
  outOfCredits: {
    dismiss: "Zavrieť",
    guest: {
      title: "Minuli sa ti bezplatné kredity",
      description:
        "Mesačné kredity s bezplatným účtom: {{signedIn}}, s odberom noviniek {{max}}. Po registrácii sa vrátiš do tohto četu.",
      privacy:
        "E-mail slúži iba na prihlásenie. Telefónne číslo ani kartu nepotrebuješ. Sledovacie nástroje tretích strán nepoužívame.",
      signUp: "Vytvoriť bezplatný účet",
      haveAccount: "Máš účet?",
      logIn: "Prihlásiť sa",
    },
    member: {
      title: "Minuli sa ti kredity",
      shortTitle: "Na túto správu nemáš dosť kreditov",
      shortDescription:
        "Zostatok máš {{balance}}. V dlhom čete stojí každá správa viac. Začni nový čet, vyber si lacnejší model alebo doplň kredity.",
      description:
        "Bezplatné kredity sa obnovia {{date}}. Ak chceš pokračovať hneď, vyber si plán.",
      subscriberDescription:
        "Kredity z plánu sa obnovia {{date}}. Ak ich potrebuješ skôr, doplň si ich alebo prejdi na vyšší plán.",
      orTopUp: "Pokračuj bez čakania",
      newsletter: {
        title: "Bezplatné kredity každý mesiac navyše: +{{bonus}}",
        consent:
          "Prihlás sa na odber noviniek o platforme a modeloch na {{email}}. Odhlásiť sa môžeš kedykoľvek. Najprv ti pošleme potvrdzovací odkaz.",
        claim: "Odoberať a získať +{{bonus}} mesačne",
        claiming: "Odosiela sa…",
        pending:
          "Na adresu {{email}} sme poslali potvrdzovací odkaz. Klikni naň a každý mesiac získaš kredity navyše: +{{bonus}}.",
      },
    },
  },
  imageGen: {
    sizeSquare: "Štvorec (1024 × 1024)",
    sizeLandscape: "Na šírku (1792 × 1024)",
    sizePortrait: "Na výšku (1024 × 1792)",
    qualityStandard: "Štandard",
    qualityHD: "HD",
  },
  audioGen: {
    durationShort: "Krátke (asi 8 s)",
    durationMedium: "Stredné (asi 15 s)",
    durationLong: "Dlhé (asi 30 s)",
  },
  voiceMode: {
    unconfiguredTitle: "Hlas nie je nastavený",
    unconfiguredDescription: "Táto zručnosť nepodporuje prevod textu na reč.",
    callMode: "Volací režim",
    callModeDescription: "AI bude reagovať hlasom",
    tapToRecord: "Ťuknutím spustiť nahrávanie",
    recording: {
      paused: "Pozastavené",
      resume: "Pokračovať",
      pause: "Pozastaviť",
    },
    callOverlay: {
      listening: "Listening...",
    },
    actions: {
      cancel: "Zrušiť",
      toInput: "Späť na písanie",
      sendVoice: "Odoslať nahrávku",
      retry: "Skúsiť znova",
      download: "Stiahnuť zvuk",
      downloadHint: "Stiahni súbor a pripoj ho k ďalšej správe.",
    },
  },
  actions: {
    cancellingGeneration: "Zastavuje sa…",
    stopGeneration: "Zastaviť",
    sendMessage: "Odoslať",
    openThread: "Otvoriť vlákno",
  },
  toolsButton: {
    title: "Nástroje AI",
    tools: "Nástroje",
  },
  config: {
    folders: {
      private: "Súkromné",
      shared: "Zdieľané",
      public: "Verejné",
      background: "Na pozadí",
      incognito: "Inkognito",
      remote: "Vzdialené",
    },
  },
  models: { names: modelTranslations.names },
};
