import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  "claude-code": "Claude Code",
  "open-code": "OpenCode",
  codex: "Codex",
  antigravity: "Antigravity CLI",
  idle: "Nečinný",
  running: "Prebieha",
  completed: "Dokončené",
  interrupted: "Prerušené",
  failed: "Zlyhalo",
  "read-only": "Iba na čítanie",
  "workspace-write": "Zápis v pracovnom priestore",
  "danger-full-access": "Plný prístup",
  codingAgent: {
    tags: {
      tasks: "Úlohy",
    },
    run: {
      post: {
        title: "Spustiť programátorského agenta",
        titleShort: "Programátorský agent",
        dynamicTitle: "Programátorský agent: {{prompt}}",
        description:
          "Spustí úlohu cez Claude Code, OpenCode, Codex alebo Antigravity. Zadaj názov, ak chceš konverzáciu uložiť, neskôr v nej pokračovať a usmerňovať ju za behu, alebo zapni interactiveMode=true pre živý terminál.",
        fields: {
          name: {
            label: "Názov agenta",
            description:
              "Voliteľný trvalý názov agenta (1 až 40 písmen, číslic, pomlčiek alebo podčiarkovníkov). Rovnaký názov nadviaže na konverzáciu.",
          },
          prompt: {
            label: "Zadanie",
            description:
              "Úloha alebo otázka pre programátorského agenta. Uveď cesty k súborom, kontext a očakávané overenie.",
          },
          promptFile: {
            label: "Súbor so zadaním",
            description:
              "Cesta k súboru so zadaním vzhľadom na aktuálny pracovný priečinok. Alternatíva k priamemu textu.",
          },
          provider: {
            label: "Poskytovateľ",
            description:
              "Príkazový nástroj agenta: claude-code, open-code, codex alebo antigravity. Predvolene codex pre nových pomenovaných agentov a claude-code bez názvu.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
              codex: "Codex",
              antigravity: "Antigravity CLI",
            },
          },
          model: {
            label: "Model",
            description:
              "ID modelu poskytovateľa. Prázdne pole použije predvolený model (Antigravity používa Gemini 4 Neon High, Codex používa gpt-6.2-sol).",
          },
          effort: {
            label: "Úroveň uvažovania",
            description:
              "Úroveň uvažovania pre Codex alebo Antigravity (napr. low, medium, high).",
          },
          sandbox: {
            label: "Izolácia Codex",
            description:
              "Izolácia súborového systému pre Codex (read-only, workspace-write alebo danger-full-access).",
          },
          cwd: {
            label: "Pracovný priečinok",
            description:
              "Priečinok, v ktorom agent pracuje. Predvolene aktuálny pracovný priečinok.",
          },
          fresh: {
            label: "Začať odznova",
            description:
              "Začne novú konverzáciu namiesto pokračovania v uloženej relácii pod týmto názvom.",
          },
          taskTitle: {
            label: "Názov úlohy",
            description:
              "Krátky názov na archiváciu úlohy. Ak ho nezadáš, vytvorí sa zo zadania.",
          },
          interactiveMode: {
            label: "Interaktívny režim",
            description:
              "false (PREDVOLENÉ): pracuje bez otvorenia terminálu a vráti výstup. true: otvorí živý terminál a po skončení odošle výsledok.",
          },
          output: {
            label: "Výstup",
            description:
              "Výsledná odpoveď alebo súhrnný stdout agenta. Pri presune na pozadie zostane prázdne.",
          },
          durationMs: {
            label: "Trvanie (ms)",
            description: "Celkový čas behu procesu.",
          },
          threadId: {
            label: "ID konverzácie",
            description:
              "Uložené ID vlákna alebo relácie na pokračovanie v práci pomenovaného agenta.",
          },
          status: {
            label: "Stav",
            description: "Výsledok ťahu trvalého agenta.",
          },
          taskId: {
            label: "ID úlohy",
            description:
              "V interaktívnom režime slúži ID na sledovanie úlohy. Výsledok príde automaticky.",
          },
          hint: {
            label: "Pomôcka",
            description: "Informácia pre AI o tom, ako dostane výsledok.",
          },
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Skontroluj názov agenta, zadanie a možnosti.",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description:
              "Prihlás sa účtom správcu alebo cez CLI vybraného poskytovateľa.",
          },
          internal: {
            title: "Spustenie zlyhalo",
            description:
              "Proces programátorského agenta sa nespustil alebo neočakávane skončil.",
          },
          binaryMissing: {
            title:
              "Na tejto inštancii chýba {{bin}}. Nainštaluj ho alebo vyber iného poskytovateľa.",
            description:
              "Spustiteľný súbor agenta sa nenašiel v PATH tohto servera.",
          },
          internalExitCode: {
            title: "Spustenie zlyhalo (kód {{exitCode}})",
            description:
              "Proces programátorského agenta skončil s nenulovým kódom.",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description:
              "Nedostatočné oprávnenia. Skontroluj práva poskytovateľa.",
          },
          notFound: {
            title: "Nenašlo sa",
            description:
              "Agent, súbor so zadaním alebo pracovný priečinok sa nenašiel.",
          },
          vibeCoderRedirect: {
            title: "Použi ai-run so zručnosťou vibe-coder",
            description:
              "Ako programátorský agent je nastavený vibe-coder. Spusti ho nástrojom ai-run so zručnosťou vibe-coder.",
          },
          network: {
            title: "Chyba siete",
            description:
              "Poskytovateľ alebo programátorský agent je momentálne nedostupný.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Počas vykonávania nastala neočakávaná chyba.",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Neuložené zmeny sú v konflikte s touto operáciou.",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Pod týmto názvom už beží iná relácia alebo uložená konverzácia patrí inému poskytovateľovi.",
          },
          detail: "Operácia agenta zlyhala: {{detail}}",
        },
        backButton: {
          label: "Späť",
        },
        submitButton: {
          label: "Spustiť",
          loadingText: "Prebieha...",
        },
        success: {
          title: "Agent dokončil úlohu",
          description:
            "Programátorský agent skončil. Ak je výstup prázdny, výsledok príde priamo do vlákna.",
        },
        widget: {
          runningBatch: "Prebieha spracovanie...",
          runningInteractive: "Otvára sa interaktívny terminál...",
          escalated:
            "Úloha beží na pozadí. Po dokončení príde výsledok do vlákna.",
          taskIdLabel: "ID úlohy",
          outputLabel: "Výstup",
          interactiveSessionLaunched:
            "Interaktívna relácia je otvorená v termináli.",
          copyOutput: "Kopírovať",
          copied: "Skopírované",
          interactive: "Interaktívny režim",
          emptyPromptHint: "Zadaj úlohu pre programátorského agenta.",
          agentNamePlaceholder: "Názov agenta (voliteľné)",
        },
      },
    },
    say: {
      post: {
        title: "Usmerniť programátorského agenta",
        titleShort: "Usmerniť agenta",
        description:
          "Pošle správu do prebiehajúceho ťahu agenta Codex alebo Antigravity. Po skončení pokračuj cez coding-agent pod rovnakým názvom.",
        success: {
          title: "Správa doručená",
          description: "Správa bola doručená bežiacemu agentovi.",
        },
        fields: {
          message: {
            label: "Správa",
            description: "Pokyn na vloženie do prebiehajúceho ťahu.",
          },
          messageFile: {
            label: "Súbor so správou",
            description:
              "Cesta k súboru so správou vzhľadom na aktuálny pracovný priečinok.",
          },
          delivered: {
            label: "Doručené",
          },
        },
      },
    },
    interrupt: {
      post: {
        title: "Prerušiť programátorského agenta",
        titleShort: "Prerušiť agenta",
        description:
          "Zastaví prebiehajúci ťah agenta Codex alebo Antigravity. Neskôr môžeš v konverzácii pokračovať pod rovnakým názvom.",
        success: {
          title: "Prerušenie vyžiadané",
          description: "Požiadavka na prerušenie bola spracovaná.",
        },
        fields: {
          interrupted: {
            label: "Prerušenie odoslané",
          },
          noInterrupt: {
            label: "Žiadny aktívny ťah",
          },
        },
      },
    },
    list: {
      post: {
        title: "Zobraziť programátorských agentov",
        titleShort: "Zoznam agentov",
        description:
          "Zobrazí aktívnych a uložených programátorských agentov. Zadaj názov na zobrazenie stavu, posledných riadkov záznamu a poslednej odpovede.",
        success: {
          title: "Zoznam agentov je pripravený",
          description: "Načítaní aktívni aj uložení agenti.",
        },
        fields: {
          summary: "{{name}} · {{provider}} · {{status}}",
          agents: {
            label: "Agenti",
          },
          noAgents: {
            label: "Zatiaľ žiadni trvalí agenti.",
          },
          lines: {
            label: "Riadky záznamu",
            description:
              "Počet posledných riadkov záznamu pri zobrazení jedného agenta.",
          },
          tail: {
            label: "Posledné riadky záznamu",
          },
          emptyTail: {
            label: "Záznam je prázdny.",
          },
          lastMessage: {
            label: "Posledná odpoveď",
          },
          lastError: {
            label: "Posledná chyba",
          },
          startedAt: {
            label: "Začiatok",
          },
          finishedAt: {
            label: "Koniec",
          },
        },
      },
    },
  },
};
