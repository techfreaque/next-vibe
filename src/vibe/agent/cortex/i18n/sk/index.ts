/* eslint-disable i18next/no-literal-string */
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    cortex: "Cortex",
  },
  category: "Cortex",
  scaffold: {
    roots: {
      memories: "pamäte",
      documents: "dokumenty",
    },
    memories: {
      identity: {
        path: "identita",
        purpose: "Kto si: meno, rola, ciele a spôsob komunikácie",
      },
      expertise: {
        path: "znalosti",
        purpose: "Čo ovládaš: zručnosti, nástroje a skúsenosti",
      },
      context: {
        path: "kontext",
        purpose:
          "Aktuálna situácia: rozpracované projekty, preferencie a obmedzenia",
      },
      life: {
        path: "život",
        purpose:
          "Ciele a aktuálna situácia v kariére, zdraví, vzťahoch, financiách, osobnom rozvoji a v tom, čo ti dáva zmysel",
      },
    },
    documents: {
      inbox: {
        path: "schránka",
        purpose:
          "Miesto na rýchle poznámky. Spracuj ich a zaraď, keď bude jasné, kam patria.",
        icon: "inbox",
      },
      projects: {
        path: "projekty",
        purpose: "Rozpracované projekty. Každý má vlastný podpriečinok.",
        icon: "folder-open",
      },
      knowledge: {
        path: "poznatky",
        purpose: "Poznatky a podklady, ku ktorým sa oplatí vracať",
        icon: "book-open",
      },
      journal: {
        path: "denník",
        purpose: "Záznamy podľa dátumu: nápady, úvahy a postrehy",
        icon: "pen-line",
      },
      templates: {
        path: "šablóny",
        purpose: "Šablóny na opakujúce sa úlohy",
        icon: "layout-template",
      },
    },
  },
  templates: {
    memories: {
      identity: {
        name: {
          path: "meno.md",
          content:
            "---\npriority: 100\ntags: [identity]\n---\n\n<!-- Tvoje meno a oslovenie, ktoré uprednostňuješ. AI ich doplní počas prvého rozhovoru. -->\n",
        },
        role: {
          path: "rola.md",
          content:
            "---\npriority: 100\ntags: [identity, work]\n---\n\n<!-- Tvoja pracovná rola, čomu sa venuješ a v akom prostredí pracuješ. -->\n",
        },
        goals: {
          path: "ciele.md",
          content:
            "---\npriority: 90\ntags: [identity, goals]\n---\n\n<!-- Tvoje hlavné krátkodobé a dlhodobé ciele. Čo chceš vytvoriť, dosiahnuť alebo zlepšiť? -->\n",
        },
        communication: {
          path: "komunikácia.md",
          content:
            "---\npriority: 85\ntags: [identity, style]\n---\n\n<!-- Aký tón, mieru podrobnosti a formát uprednostňuješ? Čo ti prekáža? Čo si ceníš? -->\n",
        },
      },
      expertise: {
        skills: {
          path: "zručnosti.md",
          content:
            "---\npriority: 80\ntags: [expertise]\n---\n\n<!-- Tvoje technické a odborné zručnosti. V čom sa vyznáš a čo sa práve učíš? -->\n",
        },
        tools: {
          path: "nástroje.md",
          content:
            "---\npriority: 75\ntags: [expertise, tech]\n---\n\n<!-- Nástroje, jazyky, frameworky a platformy, ktoré pravidelne používaš. Tvoj preferovaný technologický stack. -->\n",
        },
        background: {
          path: "skúsenosti.md",
          content:
            "---\npriority: 70\ntags: [expertise]\n---\n\n<!-- Tvoje zázemie, skúsenosti a cesta k tomu, čomu sa dnes venuješ. Pomáha pochopiť kontext pri každom rozhovore. -->\n",
        },
      },
      context: {
        projects: {
          path: "projekty.md",
          content:
            "---\npriority: 80\ntags: [context, projects]\n---\n\n<!-- Aktívne projekty: na čom pracuješ, na čom teraz najviac záleží. -->\n",
        },
        preferences: {
          path: "preferencie.md",
          content:
            "---\npriority: 70\ntags: [context]\n---\n\n<!-- Ako najradšej pracuješ? Čo ťa spomaľuje a čo ti pomáha sústrediť sa? -->\n",
        },
        constraints: {
          path: "obmedzenia.md",
          content:
            "---\npriority: 65\ntags: [context]\n---\n\n<!-- Obmedzenia a pevné pravidlá, ktoré má AI pri rozhovore s tebou dodržiavať. -->\n",
        },
      },
      life: {
        career: {
          path: "kariéra.md",
          content:
            "---\npriority: 90\ntags: [life, career, goals]\n---\n\n## Aktuálna situácia\n\n<!-- Čomu sa teraz pracovne venuješ? Úloha, firma alebo projekt, príjem a spokojnosť na stupnici 1 až 10. -->\n\n## Ciele\n\n<!-- Krátkodobé (tento mesiac): -->\n<!-- Strednodobé (tento rok): -->\n<!-- Dlhodobé (3 až 5 rokov): -->\n\n## Rozpracované projekty\n\n<!-- Ktoré projekty v /documents/projects/ ti teraz pomáhajú v kariére? Ako spolu súvisia? -->\n\n## Prekážky\n\n<!-- Ktorá prekážka ťa najviac brzdí? Čo by sa po jej vyriešení zmenilo? -->\n\n## Opakujúce sa vzorce\n\n<!-- Čo ťa v práci opakovane priťahuje? Čo ťa vyčerpáva a čo ti dodáva energiu? -->\n",
        },
        health: {
          path: "zdravie.md",
          content:
            "---\npriority: 90\ntags: [life, health, goals]\n---\n\n## Aktuálny stav\n\n<!-- Úprimný prehľad: fyzická kondícia, duševný stav, kvalita spánku, zdravotné ťažkosti alebo obavy. -->\n\n## Návyky\n\n<!-- Aké návyky reálne dodržiavaš? Pohyb, režim spánku a stravovanie. -->\n\n## Energia\n\n<!-- Čo ti dodáva energiu a čo ťa vyčerpáva? Kedy počas dňa alebo týždňa sa najlepšie sústredíš? -->\n\n## Ciele\n\n<!-- Krátkodobé (tento mesiac): -->\n<!-- Dlhodobé (tento rok): -->\n\n## Prekážky\n\n<!-- Čo ti bráni zlepšiť zdravie? Čas, motivácia, informácie alebo prostredie? -->\n",
        },
        relationships: {
          path: "vzťahy.md",
          content:
            "---\npriority: 85\ntags: [life, relationships, goals]\n---\n\n## Najbližší ľudia\n\n<!-- Ktorí 3 až 5 ľudí sú pre teba najdôležitejší? Partner, rodina alebo blízki priatelia. Aký máš vzťah s každým z nich? -->\n\n## Aktuálna situácia\n\n<!-- Ako sa darí tvojim vzťahom? Ku komu máš blízko? Od koho si sa vzdialil? -->\n\n## Čas a pozornosť\n\n<!-- Kto od teba teraz potrebuje viac? Ktorým vzťahom venuješ priveľa a ktorým primálo pozornosti? -->\n\n## Ciele\n\n<!-- Čo chceš tento rok vo vzťahoch vybudovať alebo napraviť? -->\n\n## Prekážky\n\n<!-- Čo ti v tom bráni? Čas, vzdialenosť, nevyriešený konflikt alebo vyhýbanie sa problému? -->\n",
        },
        finances: {
          path: "financie.md",
          content:
            "---\npriority: 85\ntags: [life, finances, goals]\n---\n\n## Aktuálny stav\n\n<!-- Mesačné príjmy a výdavky. Úspory. Dlhy. Stabilita na stupnici 1 až 10. -->\n\n## Finančná rezerva\n\n<!-- Koľko mesiacov by ti rezerva vydržala bez príjmu? -->\n\n## Ciele\n\n<!-- Krátkodobé (tento mesiac): -->\n<!-- Dlhodobé (tento rok): -->\n\n## Rast\n\n<!-- Ako si buduješ majetok alebo finančnú istotu? Investície, vedľajší príjem, zručnosti, ktoré ti zarábajú. -->\n\n## Prekážky\n\n<!-- Aké je teraz tvoje najväčšie finančné riziko alebo prekážka? -->\n",
        },
        growth: {
          path: "rozvoj.md",
          content:
            "---\npriority: 85\ntags: [life, growth, learning, goals]\n---\n\n## Čomu sa práve venuješ\n\n<!-- Čo sa momentálne učíš alebo rozvíjaš? Čo ti už začína dávať zmysel? -->\n\n## Chýbajúce zručnosti\n\n<!-- Ktorá zručnosť alebo znalosť by ti pomohla posunúť sa ďalej? -->\n\n## Ciele\n\n<!-- Čo sa chceš tento rok naučiť alebo zvládnuť? Uveď konkrétny cieľ. -->\n\n## Zdroje\n\n<!-- Ktoré knihy, kurzy, mentori alebo komunity ti pomáhajú? Čo sa osvedčilo? -->\n\n## Prekážky\n\n<!-- Čo ťa brzdí? Nedostatok času, sústredenia či prístupu alebo strach? -->\n",
        },
        purpose: {
          path: "smerovanie.md",
          content:
            "---\npriority: 95\ntags: [life, purpose, values, goals]\n---\n\n## Životný smer\n\n<!-- Jednou alebo dvoma vetami povedz, čo dáva tvojmu životu zmysel. Čomu sa chceš venovať alebo čo chceš vybudovať? -->\n\n## Hlavné hodnoty\n\n<!-- Ktorými 3 až 5 hodnotami sa pri rozhodovaní skutočne riadiš? -->\n\n## Ako vyzerá úspech\n\n<!-- Ako by o päť rokov vyzeral život, s ktorým by si bol spokojný? -->\n",
        },
      },
    },
    documents: {
      meetingNotes: {
        path: "zápisnica.md",
        content:
          "---\ntype: template\ntags: [meetings, template]\n---\n\n# Zápis zo stretnutia: [Dátum]\n\n**Účastníci:**\n**Účel:**\n\n## Kontext\n\nStručne opíš dôvod stretnutia.\n\n## Program\n\n1.\n2.\n3.\n\n## Hlavné rozhodnutia\n\n-\n\n## Úlohy\n\n- [ ] @person: úloha do [dátum]\n\n## Poznámky\n\n---\n*Presunuté z /documents/inbox*\n",
      },
      projectBrief: {
        path: "zadanie-projektu.md",
        content:
          "---\ntype: template\ntags: [projects, template]\nstatus: draft\n---\n\n# Zadanie projektu: [Názov]\n\n**Zodpovedá:**\n**Začiatok:**\n**Termín:**\n\n## Problém\n\nČo bez projektu nefunguje alebo spôsobuje problémy? Stačí jeden vecný odsek.\n\n## Cieľ\n\nJednou vetou uveď konkrétny, podľa možnosti merateľný výsledok.\n\n## Rozsah\n\n**Patrí sem:**\n-\n\n**Nepatrí sem:**\n-\n\n## Podmienky úspechu\n\n- [ ]\n- [ ]\n\n## Riziká\n\n| Riziko | Pravdepodobnosť | Dosah | Zmiernenie |\n|------|-----------|--------|------------|\n|      |           |        |            |\n\n## Zdroje\n\nOdkazy, podklady a predchádzajúce riešenia.\n",
      },
      weeklyReview: {
        path: "týždenný-prehľad.md",
        content:
          "---\ntype: template\ntags: [review, weekly, template]\n---\n\n# Týždeň od [Dátum]\n\n## Čo sme dokončili\n\n-\n\n## Čo sme nestihli\n\n-\n\n## Prekážky\n\n-\n\n## Čo som sa naučil\n\n-\n\n## Priority na ďalší týždeň\n\n1.\n2.\n3.\n\n## Úroveň energie (1 až 10)\n\nPráca:\nOsobný život:\n\n---\n*Použi menej ako 200 slov. Dôležitý je rýchly prehľad.*\n",
      },
      decisionLog: {
        path: "záznam-o-rozhodnutí.md",
        content:
          "---\ntype: template\ntags: [decisions, architecture, template]\n---\n\n# Rozhodnutie: [Názov]\n\n**Dátum:**\n**Stav:** navrhnuté | prijaté | nahradené | zastarané\n**Kto rozhodol:**\n\n## Kontext\n\nČo si vyžiadalo toto rozhodnutie? Aké obmedzenia platia?\n\n## Zvažované možnosti\n\n### Možnosť A: [Názov]\n\n**Výhody:**\n**Nevýhody:**\n\n### Možnosť B: [Názov]\n\n**Výhody:**\n**Nevýhody:**\n\n## Rozhodnutie\n\nVybrali sme **možnosť [X]** z týchto dôvodov:\n\n## Dôsledky\n\n**Priaznivé:**\n**Nepriaznivé:**\n**Neutrálne:**\n\n---\n*Na súbor odkáž z príslušného zadania projektu alebo komentára v kóde.*\n",
      },
      knowledgeArticle: {
        path: "odborný-článok.md",
        content:
          "---\ntype: template\ntags: [knowledge, reference, template]\n---\n\n# [Téma]\n\n**Naposledy overené:**\n**Zdroj:**\n\n## Zhrnutie\n\nV jednom odseku vysvetli, o čo ide, prečo je to dôležité a kedy sa to uplatní.\n\n## Ako to funguje\n\nOpíš iba mechanizmy, ktoré treba pochopiť alebo použiť.\n\n## Kedy použiť\n\n-\n-\n\n## Kedy nepoužiť\n\n-\n\n## Príklady\n\n```\nsem vlož príklad\n```\n\n## Zdroje\n\n-\n",
      },
    },
  },
  enums: {
    nodeType: {
      file: "Súbor",
      dir: "Priečinok",
    },
    viewType: {
      list: "Zoznam",
      kanban: "Kanban",
      calendar: "Kalendár",
      grid: "Mriežka",
      wiki: "Wiki",
    },
    syncPolicy: {
      sync: "Synchronizácia",
      local: "Len lokálne",
    },
    creditFeature: {
      write: "Zapísať",
      edit: "Upraviť",
      search: "Hľadať",
      embedding: "Embedding",
    },
  },
  mounts: {
    memory: "Pamäť",
    document: "Dokument",
    thread: "Vlákno",
    skill: "Zručnosť",
    task: "Úloha",
    upload: "Nahrať",
    search: "Hľadať",
    favorite: "Obľúbená položka",
    gen: "Generované",
    ssh: "Pripojenie SSH",
  },
  button: {
    label: "Cortex",
    title: "Cortex, pamäť AI",
    unavailableTitle: "Cortex nie je dostupný",
    unavailableDescription:
      "Cortex funguje iba v súkromných a zdieľaných vláknach. Ak chceš použiť pamäť AI, otvor súkromné vlákno.",
  },
  nav: {
    back: "Späť",
    actions: {
      list: "Prehliadať",
      read: "Zobraziť",
      write: "Zapísať",
      edit: "Upraviť",
      delete: "Odstrániť",
      move: "Presunúť",
      search: "Hľadať",
      tree: "Strom",
    },
  },
};
