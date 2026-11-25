import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
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
          "Spustite úlohu pre programátorského agenta. V predvolenom dávkovom režime pracuje bez otvorenia terminálu a vráti výstup priamo. V interaktívnom režime otvorí terminál a po skončení relácie automaticky odošle výsledok.",
        fields: {
          prompt: {
            label: "Zadanie",
            description:
              "Opíšte úlohu alebo otázku pre programátorského agenta. Uveďte cesty k súborom, potrebný kontext a požadovaný formát výstupu.",
          },
          provider: {
            label: "Poskytovateľ",
            description:
              "Vyberte príkazový nástroj agenta. Hodnota claude-code spustí Claude CLI a open-code spustí OpenCode CLI.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
            },
          },
          model: {
            label: "Model",
            description:
              "V Claude Code zadajte ID modelu (napr. claude-sonnet-4-6). V OpenCode použite tvar poskytovateľ/model (napr. anthropic/claude-sonnet-4-6). Prázdne pole použije predvolený model.",
          },
          taskTitle: {
            label: "Názov úlohy",
            description:
              "Krátky názov, pod ktorým sa úloha uloží, napríklad „Opraviť chybu pri prihlásení“. Ak ho nezadáte, vytvorí sa zo zadania.",
          },
          interactiveMode: {
            label: "Interaktívny režim",
            description:
              "Pri predvolenej hodnote false agent pracuje bez otvorenia terminálu a na konci vráti celý výstup. Pri hodnote true otvorí interaktívny terminál a po skončení relácie automaticky odošle výsledok.",
          },
          output: {
            label: "Výstup",
            description:
              "Súhrnný štandardný výstup (stdout) agenta. Pri presune úlohy na pozadie zostane pole prázdne. Výsledok doručí wakeUp.",
          },
          durationMs: {
            label: "Trvanie (ms)",
            description:
              "Čas, ktorý uplynul od spustenia procesu po jeho ukončenie.",
          },
          taskId: {
            label: "ID úlohy",
            description:
              "V interaktívnom režime slúži ID na sledovanie úlohy. Výsledok príde automaticky. Dávkový režim vráti výsledok priamo, bez ID úlohy.",
          },
          hint: {
            label: "Pomôcka",
            description: "Informácia pre AI o tom, ako dostane výsledok.",
          },
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Skontrolujte zadanie a hodnoty vo formulári.",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Prihláste sa účtom s oprávneniami správcu.",
          },
          internal: {
            title: "Spustenie zlyhalo",
            description:
              "Proces programátorského agenta sa nespustil alebo sa neočakávane ukončil.",
          },
          binaryMissing: {
            title:
              "Na tejto inštancii chýba {{bin}}. Nainštalujte ho alebo vyberte iného agenta.",
            description:
              "Spustiteľný súbor agenta sa nenašiel v adresároch uvedených v premennej PATH na serveri.",
          },
          internalExitCode: {
            title: "Spustenie zlyhalo (kód {{exitCode}})",
            description:
              "Proces programátorského agenta sa skončil s nenulovým návratovým kódom.",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Na túto akciu nemáte potrebné oprávnenia.",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Zdroj alebo pracovný adresár sa nenašiel.",
          },
          vibeCoderRedirect: {
            title: "Použite ai-run so zručnosťou vibe-coder",
            description:
              "Ako programátorský agent je nastavený vibe-coder. Spustite ho nástrojom ai-run so zručnosťou vibe-coder.",
          },
          network: {
            title: "Chyba siete",
            description:
              "Pri spojení s programátorským agentom nastala chyba siete.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Počas vykonávania úlohy nastala neočakávaná chyba.",
          },
          unsaved: {
            title: "Neuložené zmeny",
            description: "Neuložené zmeny sú v konflikte s touto operáciou.",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Úlohu sa nepodarilo spustiť. Možno ešte prebieha iná relácia.",
          },
        },
        backButton: {
          label: "Späť",
        },
        submitButton: {
          label: "Odoslať",
          loadingText: "Odosiela sa…",
        },
        success: {
          title: "Agent dokončil úlohu",
          description:
            "Programátorský agent skončil. Ak je výstup prázdny, výsledok dostanete priamo vo vlákne.",
        },
        widget: {
          runningBatch: "Prebieha spracovanie…",
          runningInteractive: "Otvára sa interaktívny terminál…",
          escalated:
            "Úloha beží na pozadí. Po dokončení príde výsledok do vlákna.",
          taskIdLabel: "ID úlohy",
          outputLabel: "Výstup",
          interactiveSessionLaunched:
            "Interaktívna relácia je otvorená v termináli.",
          copyOutput: "Kopírovať",
          copied: "Skopírované",
          interactive: "Interaktívny režim",
          emptyPromptHint: "Zadajte úlohu pre programátorského agenta.",
        },
      },
    },
  },
};
