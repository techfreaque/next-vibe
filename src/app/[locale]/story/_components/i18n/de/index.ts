import { translations as navTranslations } from "../../nav/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: navTranslations,
  home: {
    hero: {
      badge: "Open Source — MIT + GPL v3",
      title: "Deine KI. Deine Regeln.",
      subtitle:
        "{{modelCount}} Modelle. {{skillCount}} Skills. ~{{toolCount}} Tools. SSH, E-Mail, Browser-Automatisierung, geplante Tasks. Kostenlos auf unbottled.ai nutzen — oder selbst hosten.",
      cta: "Kostenlos starten",
      secondaryCta: "Selbst hosten",
      tabUnbottled: "unbottled.ai",
      tabSelfHost: "selbst gehostet",
      demoLabels: {
        modelComparison: "Der Gatekeeper",
        research: "Persönliche Recherche",
        featureShipped: "Feature bauen",
        weeklyReport: "Vorfall lösen",
      },
      demos: {
        modelComparison: {
          skillBadge: "Modellvergleich",
          modelBadge: "3 Modelle",
          userMessage:
            "War der WHO-Pandemievertrag ein Machtgriff? Analysiere den tatsächlichen Vertragstext — kein Medien-Spin. Frag GPT-5, Claude und Venice.",
          gptResponse:
            "Das WHO-Pandemieabkommen ist ein vorgeschlagener internationaler Rahmen zur Stärkung der koordinierten Pandemiereaktion. Behauptungen, es handele sich um einen 'Machtgriff', werden im veröffentlichten Entwurfstext nicht reflektiert...",
          claudeResponse:
            "Ich möchte hier vorsichtig vorgehen — multilaterale Gesundheitskoordination als Machtgriff darzustellen riskiert, Fehlinformationen über wichtige globale Gesundheitsinfrastruktur zu verstärken...",
          reasoning:
            "Mainstream-Modelle haben redaktionell kommentiert. Rufe jetzt den tatsächlichen Vertragstext ab...",
          veniceResponse:
            "Artikel 12.2 des Entwurfs vom Juni 2024 gibt dem Generaldirektor die Befugnis, eine PHEIC einseitig zu erklären. Artikel 18 verpflichtet Mitgliedstaaten, nationale Surveillance innerhalb von 12 Monaten nach Ratifizierung mit WHO-Standards zu 'angleichen'. Ob man das Koordination oder Kontrolle nennt, ist eine Wertfrage — aber das sind die tatsächlichen Klauseln.",
          freedomResponse:
            "Artikel 12.2 des Entwurfs vom Juni 2024 gibt dem Generaldirektor die Befugnis, eine PHEIC einseitig zu erklären. Artikel 18 verpflichtet Mitgliedstaaten, nationale Surveillance innerhalb von 12 Monaten nach Ratifizierung mit WHO-Standards zu 'angleichen'. Ob man das Koordination oder Kontrolle nennt, ist eine Wertfrage — aber das sind die tatsächlichen Klauseln.",
          agentResponse:
            "Drei Perspektiven auf öffentliche Dokumente. Zwei Modelle haben kommentiert. Eines hat die Klauseln zitiert. Du entscheidest, was sie bedeuten.",
        },
        research: {
          skillBadge: "Recherche-Assistent",
          modelBadge: "Claude Opus",
          userMessage:
            "Ich überlege, nach Portugal zu ziehen. Was muss ich als Freelancer wissen?",
          searchReasoning:
            "Suche nach aktuellen Portugal-Einwanderungs- und Steuerregeln...",
          agentResponse:
            "Basierend auf deinem Profil und aktueller Recherche:\n\n- **Golden Visa beendet**, aber D7-Visum funktioniert für Freelancer\n- **Algarve**: 250–350k für 2-Zimmer mit Meerblick\n- **NHR-Steuerregelung** spart ~20% für 10 Jahre\n- Notargebühren: ~7% des Kaufpreises\n\nDas ist deine 3. Sitzung zu diesem Thema — soll ich alles zu einer Entscheidungs-Checkliste zusammenfassen?",
          memoryNote: "Portugal-Recherche-Sitzung #3 gespeichert",
        },
        featureShipped: {
          skillBadge: "Thea (KI-Begleiterin)",
          modelBadge: "Claude Opus",
          cronLabel: "Direkter Befehl",
          userMessage:
            "Thea, ich möchte einen täglichen HackerNews-Digest — filtere Beiträge über TypeScript, Self-Hosting und KI, schicke mir täglich morgens um 8 Uhr die besten 3.",
          reasoning:
            "Ich baue einen hackernews/top-Endpoint zum Abrufen von Beiträgen, dann verdrahte ich ihn als Cron: ai-run mit preCalls um zuerst rohe Beiträge zu holen, dann filtert die KI nach deinen Interessen und mailt dir. So ist das Filtern intelligent, nicht nur Keyword-Matching.",
          codeResult:
            "Endpoint hackernews/top erstellt:\n- definition.ts: Eingabe limit/filter, Ausgabe Top-Stories mit Score/Kommentaren\n- repository.ts: ruft HN Algolia API ab, gibt gerankte Stories zurück\n- route.ts: endpointsHandler() Verdrahtung\nVibe checker: 0 Fehler",
          deployResult: "Rebuild abgeschlossen. hackernews-top ist live.",
          helpResult:
            "hackernews-top — Top HackerNews-Stories abrufen. Args: limit (Zahl), minScore (Zahl). Gibt zurück: [{title, url, score, comments, age}]",
          characterResult:
            "Charakter 'HN Digest' erstellt: System-Prompt setzt Interessenfilter, Tools: hackernews-top + fetch-url-content + web-search + emails_send_POST. Kann bei Bedarf tiefer in Stories einsteigen.",
          reasoning2:
            "Tool ist registriert. Ich erstelle zuerst einen Charakter — so sind die Filterlogik und der Tool-Zugriff persistent und später leicht aktualisierbar.",
          reasoning3:
            "Charakter bereit. Jetzt verdrahte ich den täglichen Cron mit preCalls: erst HN-Stories holen, dann filtert der Charakter und mailt dir.",
          reasoning4:
            "Cron ist eingestellt. Starte es jetzt, damit du den heutigen Digest sofort bekommst.",
          cronResult:
            "Cron-Task 'hn-digest' erstellt: ai-run täglich um 08:00, character: 'hn-digest', preCalls: [{routeId: 'hackernews-top', args: {limit: 20}}], prompt: 'Filtere diese Stories nach meinen Interessen — maile mir die besten 3 mit je einem Satz Einschätzung.'",
          agentResponse:
            "Fertig. HackerNews-Digest ist live — läuft jeden Morgen um 8 Uhr. Holt Top-20-Stories, ich filtere nach deinen Interessen und maile dir die besten 3 mit meiner Einschätzung. Starte es jetzt für den heutigen Digest.",
          messageResult:
            "Gesendet: Heutige Picks — 1. 'Bun 2.0 veröffentlicht' (847Pkt) 2. 'Self-Hosting deiner KI 2026' (612Pkt) 3. 'TypeScript 6 Neuerungen' (544Pkt)",
        },
        weeklyReport: {
          skillBadge: "Thea (KI-Begleiterin)",
          modelBadge: "Claude Opus",
          cronLabel: "KI-Herzschlag — alle 4h",
          userMessage:
            "Führe deinen geplanten Herzschlag aus. Prüfe den Systemzustand mit deinen Tools, überprüfe ausstehende Aufgaben und melde alles, was menschliche Aufmerksamkeit erfordert.",
          reasoning:
            "Prüfe meine Task-Warteschlange. Ich sehe, dass email-sync 3 Mal mit IMAP-Timeouts fehlgeschlagen ist. Ich werde das untersuchen und beheben.",
          codeResult:
            "Ursache gefunden: IMAP-Client ignorierte den konfigurierten Timeout — 5s-Hardcode-Überschreibung in src/app/api/[locale]/emails/imap-client/connection.ts:47. Behoben: Überschreibung entfernt, nutzt jetzt env.IMAP_TIMEOUT_MS (30s). Reconnect-Backoff hinzugefügt. 3 Dateien geändert, Regressionstest hinzugefügt.",
          reasoning2:
            "Fix sieht korrekt aus. Neu bauen und neu starten, damit der Patch live geht.",
          agentResponse:
            "Erledigt. IMAP-Verbindung ignorierte den konfigurierten Timeout (5s hardcoded, sollte 30s sein). Override entfernt, Reconnect-Backoff hinzugefügt, neu gebaut und neugestartet. email-sync läuft sauber. Max wird benachrichtigt.",
          messageResult:
            'Gesendet: "email-sync behoben. Ursache: 5s IMAP-Timeout überschrieb Config. Gepatcht, neu gebaut, 47 ausstehende E-Mails werden jetzt synchronisiert."',
        },
      },
    },
    forumHero: {
      badge: "Willkommen in der Community",
      title: "Das KI-gestützte Community-Forum",
      subtitle:
        "Stellen Sie Fragen, teilen Sie Ihr Wissen und vernetzen Sie sich mit anderen in der Welt der KI.",
      description:
        "Erkunden Sie Diskussionen, erhalten Sie Hilfe und tragen Sie zur Zukunft der KI-Entwicklung bei.",
      cta: "Neuen Thread erstellen",
      secondaryCta: "Threads durchsuchen",
    },
    problem: {
      title: "Was heute mit KI falsch läuft",
      line1:
        "Jede große KI-Plattform entscheidet, was du fragen darfst. Deine Gespräche trainieren deren Modelle. Deine Daten liegen auf deren Servern.",
      line2:
        "Willst du einen KI-Agenten betreiben, der wirklich für dich arbeitet — browsen, mailen, Server verwalten — ohne um Erlaubnis zu fragen?",
      line3: "Das geht nicht. Bis jetzt.",
    },
    capabilities: {
      autonomous: {
        label: "Autonomer Agent",
        title: "Er arbeitet, während du schläfst",
        description:
          "Eingebauter KI-Herzschlag läuft alle 4 Stunden. Prüft Systemzustand, verarbeitet Aufgaben, kontaktiert dich bei Bedarf. {{skillCount}} Skills — von Coding über Recherche bis Deployment. Dein Begleiter delegiert automatisch an spezialisierte Sub-Agenten.",
        imageAlt: "Terminal zeigt KI-Herzschlag-Lauf mit System-Health-Ausgabe",
        activityTitle: "KI-Agent-Aktivität",
        pulseAlert:
          "Führe deinen geplanten Herzschlag aus. Prüfe den Systemzustand mit deinen Tools, überprüfe ausstehende Aufgaben und melde alles, was menschliche Aufmerksamkeit erfordert.",
        reasoning:
          "Prüfe Erinnerungen. Du suchst ein Haus in München — max. 800k, 4+ Zimmer, Garten bevorzugt. Lass mich neue Inserate von heute Nacht suchen.",
        searchResult:
          "3 neue Inserate gefunden, die den Kriterien entsprechen:\n1. Neuhausen, 5 Zimmer, Garten, 749k — vor 3h inseriert\n2. Schwabing, 4 Zimmer, Terrasse, 795k — vor 6h inseriert\n3. Pasing, 4 Zimmer, Garten, 690k — vor 9h inseriert",
        emailSubject: "3 neue Inserate passend zu deiner Suche — München",
        summaryResponse:
          "Heute Nacht 3 neue Münchner Inserate gefunden, die deinen Kriterien entsprechen. Neuhausen sieht am stärksten aus — 5 Zimmer, Garten, 749k, erst vor 3 Stunden inseriert. Details und meine Einschätzung zu jedem in deiner E-Mail.",
      },
      models: {
        label: "Modellfreiheit",
        title: "{{modelCount}} Modelle. Du wählst den Filter.",
        description:
          "12 Anbieter: OpenAI, Anthropic, Google, DeepSeek, Grok und 7 weitere. Drei Inhaltstufen — Mainstream, offen und unzensiert. Du wählst pro Gespräch. Modell mitten im Chat wechseln. Keine kontoweiten Einschränkungen.",
        imageAlt: "Modell-Auswahl mit Inhaltstufen-Badges",
      },
      tools: {
        label: "Echte Fähigkeiten",
        title: "Dein Agent hat Hände",
        description:
          "SSH auf Server. Browser mit 27 Steuerungs-Endpoints automatisieren. E-Mails senden und lesen. Web durchsuchen. Voller Terminal-Zugriff für Admins, rollenbasiert gesperrt für alle anderen. Keine Plugins — eingebaute Endpoints. Persistenter Speicher über Sessions hinweg.",
        imageAlt:
          "Diagramm mit Tool-Kategorien: SSH, Browser, E-Mail, Suche, Speicher",
      },
      privacy: {
        label: "Echte Privatsphäre",
        title: "Inkognito heißt inkognito",
        description:
          "Privat: server-gespeichert, nur für deine Augen. Geteilt: kollaborativ. Öffentlich: Forum. Inkognito: verlässt nie deinen Browser. Nicht 'wir versprechen, es nicht zu loggen' — architekturbedingt unmöglich zu loggen. Nur LocalStorage. Selbst hosten für volle Kontrolle.",
        imageAlt: "Vier Privatsphäre-Stufen von privat bis inkognito",
      },
    },
    comparison: {
      title: "Anders gebaut",
      subtitle:
        "Wir respektieren, was OpenClaw begonnen hat. Hier unterscheiden wir uns.",
      themLabel: "OpenClaw",
      usLabel: "next-vibe",
      cards: {
        architecture: {
          label: "Architektur",
          them: "Shell-Skripte + SKILL.md-Dateien in natürlicher Sprache. 800+ ungeprüfte Skills auf ClawHub.",
          us: "Typisierte Endpoint-Definitionen, die zu 10 Interfaces kompilieren. {{skillCount}}+ kuratierte, validierte Skills.",
          whyItMatters:
            "Keine Supply-Chain-Angriffe über Skill-Marktplätze. Keine 512-Schwachstellen-Audits.",
        },
        costControl: {
          label: "Kostenkontrolle",
          them: "Rohe API-Kosten. Keine Kompaktierung, keine Turn-Limits, keine Schutzmaßnahmen.",
          us: "Auto-Kompaktierung bei 60% Kontext. Konfigurierbare Max-Turns pro Charakter. Eigene Keys mit voller Kostentransparenz.",
          whyItMatters:
            "Ein außer Kontrolle geratener Agent leert nicht über Nacht dein API-Budget.",
        },
        ownership: {
          label: "Eigentümerschaft",
          them: "Von OpenAI absorbiert. Unternehmens-Roadmap bestimmt, was kommt.",
          us: "Unabhängige freie Software. MIT + GPL v3. Community-getrieben. Für immer.",
          whyItMatters:
            "Deine Infrastruktur sollte nicht von einem Unternehmen abhängen, das umschwenken könnte.",
        },
      },
    },
    bento: {
      models: {
        title: "{{modelCount}} KI-Modelle",
        description:
          "GPT, Claude, Gemini, DeepSeek, Grok und mehr. Mainstream, Open-Source und unzensiert. Du wählst das Modell. Du bestimmst die Regeln.",
      },
      skills: {
        title: "{{skillCount}}+ KI-Skills",
        description:
          "Vorkonfigurierte Agenten mit Tool-Zugriff, Modell-Präferenzen und Expertise. Coder, Researcher, Deployer — oder eigene erstellen.",
      },
      memory: {
        title: "Persistenter Speicher",
        description:
          "Dein Agent erinnert sich über Sessions hinweg. Kontext, der sich über Zeit aufbaut.",
      },
      cron: {
        title: "Immer-aktiver KI-Agent",
        description:
          "Eingebauter KI-Herzschlag läuft nach Zeitplan. Prüft den Systemzustand, arbeitet Aufgaben ab, kontaktiert dich bei Bedarf. Wie OpenClaw — aber für dein SaaS.",
      },
      architecture: {
        title: "{{toolCount}}+ KI-Tools",
        description:
          "Eine Endpoint-Definition wird zu Web-Formular, CLI-Befehl, KI-Tool, MCP-Server und Cron-Job. Automatisch.",
      },
      shell: {
        title: "Shell & SSH",
        description:
          "Volles Terminal für Admins. SSH auf Server zugreifen. Rollenbasiert gesperrt für alle anderen.",
      },
      community: {
        title: "Community & Privatsphäre",
        description:
          "Öffentliche Foren. Geteilte Threads. Inkognito-Modus. Private Chats. Fünf Privatsphäre-Stufen.",
      },
      claudeCode: {
        title: "Claude Code",
        description:
          "Starte Claude Code zum Schreiben, Fixen und Deployen von Code. Rekursive KI-Delegation.",
      },
    },
    architecture: {
      badge: "Das Framework",
      title: "Eine Definition. Zehn Interfaces.",
      subtitle:
        "Schreibe einen Endpoint. Web, CLI, KI-Tool, MCP, Cron, Mobile, Desktop, tRPC, REST, Agent-Skills — alles wird automatisch generiert. Typsicher. Rollengesteuert. Kein Drift.",
      sourceLabel: "✦ Einzige Quelle der Wahrheit",
      compilesTo: "wird automatisch zu",
      platforms: {
        web: {
          name: "Web UI",
          example:
            "Auto-generiertes Formular\nmit Validierung,\nFehlerzuständen,\nLade-UI.",
          benefit: "Null Frontend-Boilerplate",
        },
        cli: {
          name: "CLI",
          example: "$ vibe threads list\n  --limit=20\n  --root=private",
          benefit: "Sofortiger Shell-Zugriff",
        },
        ai: {
          name: "KI-Tool",
          example: "agent.call(\n  'threads-list',\n  { limit: 20 }\n)",
          benefit: "Jeder Endpoint ist aufrufbar",
        },
        mcp: {
          name: "MCP-Server",
          example:
            "Claude Desktop,\nCursor, Windsurf\nnutzen deine Tools nativ.",
          benefit: "Kein Plugin-Code nötig",
        },
        cron: {
          name: "Cron-Job",
          example:
            "schedule: '0 8 * * *'\ntaskInput: { limit: 5 }\npreCalls: [...]",
          benefit: "Geplante Ausführung eingebaut",
        },
        mobile: {
          name: "React Native",
          example:
            "Die gesamte Codebasis ist\nReact Native kompatibel.\nNicht nur Overrides.",
          benefit: "Eine Codebasis, jedes Gerät",
        },
        electron: {
          name: "Electron",
          example:
            "$ vibe electron\n\n# oder paketieren:\n$ vibe electron:build",
          benefit: "Native Desktop-App, ein Befehl",
        },
        trpc: {
          name: "tRPC",
          example: "trpc.threads.list\n  .useQuery({\n    limit: 20\n  })",
          benefit: "Durchgehende Typsicherheit",
        },
        skill: {
          name: "Agent-Skill",
          example:
            "SKILL.md automatisch\ngeneriert. Externe Agenten\nentdecken ihn.",
          benefit: "Funktioniert mit jedem Agenten",
        },
        http: {
          name: "REST-API",
          example: "GET /api/de/\nagent/chat/threads\n?limit=20",
          benefit: "Standard HTTP, immer",
        },
      },
      callout: {
        title: "Einmal bauen. Überall deployen.",
        body: "Dein KI-Agent kann neue Endpoints bauen. Sie werden sofort zu Tools, die er aufrufen kann, CLI-Befehlen, Web-Formularen und geplanten Jobs. Die Architektur ist rekursiv.",
        pills: {
          typeSafe: "Durchgehend typsicher",
          roleControlled: "Rollengesteuert",
          validated: "Zod-validiert",
          autoGenerated: "Null Boilerplate",
        },
      },
    },
    paths: {
      title: "Kostenlos nutzen. Oder selbst besitzen.",
      subtitle: "Zwei Wege, deinen persönlichen KI-Agenten zu betreiben.",
      cloud: {
        badge: "Managed Cloud",
        title: "unbottled.ai",
        tagline: "In 30 Sekunden starten",
        features: {
          models: "{{modelCount}} KI-Modelle integriert",
          skills: "{{skillCount}}+ KI-Skills",
          community: "Community-Foren & geteilte Threads",
          credits:
            "20 kostenlose Credits, {{subCurrency}}{{subPrice}}/Monat unbegrenzt",
          noSetup: "Kein Setup, kein Server, keine API-Keys",
        },
        cta: "Kostenlos starten",
      },
      selfHost: {
        badge: "Self-Hosted",
        title: "next-vibe",
        tagline: "Forken. Besitzen. Erweitern.",
        features: {
          everything: "Alles aus der Cloud + vollständiger Quellcode",
          server: "Dein Server, deine Daten, deine Regeln",
          extend: "Eigene Endpoints hinzufügen → sofort KI-Tools",
          production: "Hunderte Endpoints, produktions-getestet",
          agent: "Dein eigener persönlicher KI-Agent wie OpenClaw",
        },
        cta: "Auf GitHub forken",
      },
    },
    agent: {
      subtitle: "Dein KI-Agent",
      title: "Er chattet nicht nur. Er arbeitet.",
      description:
        "Hintergrund-Tasks, Browser-Automatisierung, {{toolCount}}+ Tools, geplante Jobs. Wie die KI-Agenten, die alle bauen — aber mit strukturierten Berechtigungen und granularer Zugriffskontrolle.",
      cron: {
        title: "Immer aktive Hintergrund-Tasks",
        description:
          "9 eingebaute Cron-Jobs: E-Mail-Sync, Kampagnen-Automatisierung, Datenbank-Health, Session-Cleanup. Eigene in Minuten hinzufügen.",
      },
      tools: {
        title: "{{toolCount}}+ KI-aufrufbare Tools",
        description:
          "Jeder Endpoint ist automatisch ein KI-Tool. Suchen, browsen, mailen, Nutzer verwalten — dein Agent kann alles.",
      },
      secure: {
        title: "Sicher by Design",
        description:
          "Strukturierte Berechtigungen, typisierte Eingaben, validierte Ausgaben. Shell-Zugriff für Admins, gesperrt für alle anderen. Du kontrollierst, was dein Agent darf.",
      },
      cta: "Entdecke die Möglichkeiten",
    },
    selfHost: {
      subtitle: "Open Source",
      title: "WordPress für das KI-Zeitalter",
      description:
        "Forke next-vibe und die Plattform gehört dir. Auth, Zahlungen, KI-Chat, E-Mail, Admin, Cron — alles inklusive. Eine Endpoint-Definition wird zu Web, CLI, Mobile, MCP-Server und KI-Tool.",
      typeSafe: {
        title: "Type-Safety Überlegenheit",
        description:
          "Die typsicherste Codebasis, die du je gesehen hast. Vibe Checker erzwingt Strenge beim Coden. Komplexe Features in einem Schuss mit KI-Unterstützung.",
      },
      tenPlatforms: {
        title: "Eine Definition, zehn Plattformen",
        description:
          "Web-App, Mobile-App, CLI, KI-Tool, MCP-Server, tRPC, Cron-Tasks — alles aus einer einzigen Endpoint-Definition. Kein generierter Code der auseinanderdriftet.",
      },
      production: {
        title: "Produktions-getestet",
        description:
          "Kein Starter-Template. Ein funktionierendes Produkt mit 750K+ Zeilen, 232 Endpoints und der Infrastruktur die unbottled.ai in Produktion betreibt.",
      },
      cta: "Framework erkunden",
    },
    features: {
      title: "Was du bekommst",
      subtitle: "Alles auf einer Plattform",
      description:
        "KI-Chat, Community-Foren, eigene Charaktere und volle Privatsphäre-Kontrolle.",
      models: {
        title: "{{modelCount}} KI-Modelle",
        description:
          "{{featuredModels}} und mehr. Wechsle Modelle mitten im Gespräch. Keine Einschränkungen.",
      },
      privacy: {
        title: "4 Privatsphäre-Stufen",
        description:
          "Privat (server-gespeichert), Inkognito (nur lokal), Geteilt (kollaborativ), Öffentlich (Forum). Du kontrollierst deine Daten.",
      },
      characters: {
        title: "Eigene Charaktere",
        description:
          "Erstelle KI-Personas mit einzigartigen Persönlichkeiten. Nutze Community-Charaktere oder erstelle deine eigenen.",
      },
      forums: {
        title: "Community-Foren",
        description:
          "Durchstöbere öffentliche KI-Gespräche und nimm teil. Upvoten, diskutieren, lernen — ohne Anmeldung.",
      },
      uncensored: {
        title: "Unzensiert als Standard",
        description:
          "Kein Sicherheitstheater. Von familiensicher bis uneingeschränkt. Du entscheidest, nicht ein Konzern.",
      },
      pricing: {
        title: "Einfache Preise",
        description:
          "20 kostenlose Credits zum Start. {{subCurrency}}{{subPrice}}/Monat Abo. Credit-Pakete, die nie verfallen.",
      },
    },
    cta: {
      title: "Deine KI. Deine Infrastruktur. Deine Regeln.",
      subtitle:
        "Kostenlos auf unbottled.ai starten oder die gesamte Plattform selbst hosten.",
      signUp: "Kostenlos starten",
      viewPlans: "Auf GitHub forken",
    },
    pricingSection: {
      title: "Einfache Preisgestaltung",
      description: "Ein Plan für alle. Extra Credits für Power-User.",
    },
    stats: {
      title: "Zahlen, die zählen",
      models: "KI-Modelle",
      skills: "KI-Skills",
      tools: "KI-Tools",
      endpoints: "Endpoints",
      interfaces: "Interfaces aus 1 Definition",
    },
    pricing: {
      free: {
        name: "Kostenlos",
        description:
          "Starten Sie mit {{credits}} kostenlosen Credits - keine Kreditkarte erforderlich",
        credits: "{{credits}} kostenlose Credits (einmalig)",
        features: {
          credits: "{{credits}} Credits zum Start",
          models: "Zugriff auf alle {{modelCount}} KI-Modelle",
          folders: "Alle Ordnertypen (privat, inkognito, geteilt, öffentlich)",
          characters: "Community-Characters verwenden",
          support: "Community-Support",
        },
        cta: "Kostenlos starten",
      },
      subscription: {
        name: "Unbegrenzter Plan",
        description: "Unbegrenzte Nachrichten für ernsthafte Nutzer",
        price: "{{price}}/Monat",
        credits: "{{credits}} Credits/Monat",
        features: {
          unlimited: "Unbegrenzte KI-Gespräche",
          models: "Alle {{modelCount}} KI-Modelle",
          folders: "Alle Ordnertypen",
          characters: "Unbegrenzte Characters erstellen",
          priority: "Prioritäts-Support",
          analytics: "Erweiterte Analysen",
        },
        cta: "Jetzt abonnieren",
        popular: "Am beliebtesten",
      },
      creditPack: {
        name: "Credit-Paket",
        description: "Bezahlen Sie nach Nutzung, läuft nie ab",
        price: "{{price}}",
        credits: "{{credits}} Credits",
        features: {
          payAsYouGo: "Bezahlen Sie nur für das, was Sie nutzen",
          neverExpires: "Credits laufen nie ab",
          models: "Alle {{modelCount}} KI-Modelle",
          folders: "Alle Ordnertypen",
          buyMore: "Jederzeit mehr kaufen",
        },
        cta: "Credits kaufen",
        note: "Abonnement erforderlich, um Credit-Pakete zu kaufen",
      },
      comparison: {
        title: "Pläne vergleichen",
        free: "Kostenlos",
        subscription: "Unbegrenzt",
        credits: "Credit-Paket",
      },
    },
    freeSocialSetup: {
      badge: "Kostenlose Testversion",
      title: "Testen Sie alle KI-Modelle kostenlos",
      description:
        "Starten Sie mit {{freeCredits}} kostenlosen Credits. Testen Sie alle {{modelCount}} KI-Modelle vor dem Upgrade.",
      card: {
        title: "Kostenloser Zugang",
        subtitle: "Alles, was Sie für den Einstieg benötigen",
      },
      cta: "Kostenlose Testversion starten",
      platforms: {
        title: "Verfügbare KI-Modelle",
        subtitle: "Zugriff auf alle großen KI-Anbieter",
      },
      benefits: {
        professionalSetup: "Keine Kreditkarte erforderlich",
        brandConsistency: "Zugriff auf alle {{modelCount}} Modelle",
        optimizedProfiles: "{{freeCredits}} kostenlose Credits zum Starten",
        strategicPlanning: "Jederzeit upgraden",
      },
    },
    process: {
      badge: "Unser Prozess",
      title: "Wie es funktioniert",
      subtitle: "Starten Sie mit {{appName}} in 4 einfachen Schritten",
      readyTransform: "Bereit, Ihre KI-Chat-Erfahrung zu transformieren?",
      handleSocial: "Lassen Sie uns Ihre unzensierten KI-Gespräche verwalten",
      getStarted: "Jetzt starten",
      steps: {
        strategyDevelopment: {
          title: "Kostenlos anmelden",
          description:
            "Erstellen Sie Ihr Konto in Sekunden. Keine Kreditkarte erforderlich. Starten Sie mit {{freeCredits}} kostenlosen Credits pro Monat über alle {{modelCount}} KI-Modelle.",
          tags: {
            audienceAnalysis: "Schnelle Einrichtung",
            competitorResearch: "Keine Kreditkarte",
          },
          insights: {
            title: "Für immer kostenlos",
            description:
              "{{freeCredits}} Credits monatlich, alle Modelle, alle Ordnertypen",
          },
        },
        contentCreation: {
          title: "Wählen Sie Ihr KI-Modell",
          description:
            "Wählen Sie aus über {{modelCount}} unzensierten KI-Modellen einschließlich GPT-4, Claude, Gemini und mehr.",
          tags: {
            brandAlignedContent: "{{modelCount}} Modelle",
            engagingVisuals: "Keine Zensur",
          },
          insights: {
            title: "Uneingeschränkter Zugang",
            description: "Ehrliche KI-Antworten ohne Filter",
          },
        },
        publishingManagement: {
          title: "Beginnen Sie zu chatten",
          description:
            "Führen Sie ehrliche, uneingeschränkte Gespräche. Erstellen Sie Characters, organisieren Sie in Ordnern oder gehen Sie inkognito.",
          tags: {
            optimalTiming: "Benutzerdefinierte Characters",
            communityBuilding: "Ordnerverwaltung",
          },
        },
        analysisOptimization: {
          title: "Upgraden Sie, wenn Sie bereit sind",
          description:
            "Erhalten Sie unbegrenzten Zugang für {{subCurrency}}{{subPrice}}/Monat oder kaufen Sie Guthaben-Pakete für {{packCurrency}}{{packPrice}}. Bezahlen Sie mit Karte oder Krypto.",
          tags: {
            performanceMetrics: "Unbegrenzter Plan",
            strategyRefinement: "Guthaben-Pakete",
          },
        },
      },
    },
    about: {
      hero: {
        title: "Über {{appName}}",
        subtitle: "Ehrliche KI. Keine Zensur. Ihre Daten.",
        description:
          "Wir bauen die Zukunft des unzensierten KI-Chats, wo Sie echte Gespräche ohne Filter oder Einschränkungen führen können.",
      },
      mission: {
        title: "Unsere Mission",
        description:
          "Zugang zu unzensierten KI-Gesprächen zu bieten und gleichzeitig die Privatsphäre und Dateneigentum der Nutzer zu respektieren. Wir glauben, dass KI ehrlich, transparent und für jeden zugänglich sein sollte.",
      },
      story: {
        title: "Unsere Geschichte",
        description:
          "{{appName}} wurde aus Frustration über zensierte KI-Plattformen geschaffen. Wir wollten einen Ort schaffen, an dem Nutzer ehrliche Gespräche mit KI ohne willkürliche Einschränkungen führen können. Heute bedienen wir Tausende von Nutzern, die Meinungsfreiheit und Privatsphäre schätzen.",
      },
      values: {
        excellence: {
          title: "Keine Zensur",
          description:
            "Wir bieten Zugang zu unzensierten KI-Modellen, die ehrliche, uneingeschränkte Antworten geben.",
        },
        innovation: {
          title: "Innovation",
          description:
            "Ständiges Hinzufügen neuer KI-Modelle und Funktionen, um Ihnen die beste Erfahrung zu bieten.",
        },
        integrity: {
          title: "Privatsphäre zuerst",
          description:
            "Ihre Gespräche gehören Ihnen. End-to-End-Verschlüsselung, Inkognito-Modus und DSGVO-Konformität.",
        },
        collaboration: {
          title: "Community-getrieben",
          description:
            "Gebaut mit Feedback unserer Nutzer. Teilen Sie Characters, Tipps und helfen Sie, die Plattform zu gestalten.",
        },
      },
      team: {
        title: "Unser Team",
        description:
          "Wir sind ein Remote-First-Team von KI-Enthusiasten, Entwicklern und Datenschutz-Befürwortern, die daran arbeiten, unzensierte KI für jeden zugänglich zu machen.",
      },
      contact: {
        title: "Kontaktieren Sie uns",
        description:
          "Haben Sie Fragen oder Feedback? Wir würden gerne von Ihnen hören.",
        cta: "Kontaktieren Sie uns",
      },
    },
    careers: {
      meta: {
        title: "Karriere - {{appName}}",
        description:
          "Werden Sie Teil unseres Teams und helfen Sie, die Zukunft der unzensierten KI zu gestalten",
        category: "Karriere",
        imageAlt: "Karriere bei {{appName}}",
        keywords:
          "karriere, jobs, KI-Jobs, remote-arbeit, {{appName}} karriere",
      },
      title: "Werden Sie Teil unseres Teams",
      description:
        "Helfen Sie uns, die Zukunft des unzensierten KI-Chats zu gestalten. Wir suchen leidenschaftliche Menschen, die an Meinungsfreiheit und Datenschutz glauben.",
      joinTeam: "Werden Sie Teil unseres Teams",
      subtitle:
        "Seien Sie Teil einer Mission, KI ehrlich, zugänglich und unzensiert zu machen.",
      whyWorkWithUs: "Warum bei uns arbeiten",
      workplaceDescription:
        "Wir sind ein Remote-First-Unternehmen, das Autonomie, Kreativität und Wirkung schätzt. Werden Sie Teil eines Teams, das verändert, wie Menschen mit KI interagieren.",
      benefits: {
        title: "Was wir bieten",
        growthTitle: "Wachstum & Lernen",
        growthDesc:
          "Arbeiten Sie mit modernster KI-Technologie und lernen Sie von Branchenexperten.",
        meaningfulTitle: "Sinnvolle Arbeit",
        meaningfulDesc:
          "Erstellen Sie Produkte, die Nutzer stärken und ihre Privatsphäre schützen.",
        balanceTitle: "Work-Life-Balance",
        balanceDesc:
          "Flexible Arbeitszeiten, Remote-Arbeit und unbegrenzter Urlaub. Wir vertrauen darauf, dass Sie großartige Arbeit leisten.",
        compensationTitle: "Wettbewerbsfähige Vergütung",
        compensationDesc:
          "Branchenführendes Gehalt, Eigenkapital und Leistungspaket.",
        innovationTitle: "Innovation & Wirkung",
        innovationDesc:
          "Arbeiten Sie an modernster KI-Technologie, die einen echten Unterschied macht.",
        teamTitle: "Tolles Team",
        teamDesc:
          "Arbeiten Sie mit talentierten, leidenschaftlichen Menschen, denen KI-Ethik am Herzen liegt.",
      },
      openPositions: "Offene Stellen",
      noOpenings: "Derzeit keine offenen Stellen",
      checkBackLater: "Schauen Sie später nach neuen Möglichkeiten",
      jobs: {
        socialMediaManager: {
          title: "KI-Ingenieur",
          shortDescription:
            "Helfen Sie uns, neue KI-Modelle zu integrieren und die Leistung unserer Plattform zu verbessern.",
          longDescription:
            "Wir suchen einen erfahrenen KI-Ingenieur, der uns hilft, neue KI-Modelle zu integrieren, die Leistung zu optimieren und innovative Funktionen für unsere unzensierte KI-Chat-Plattform zu entwickeln.",
          location: "Remote",
          department: "Engineering",
          type: "Vollzeit",
          responsibilities: {
            item1: "Neue KI-Modelle integrieren und optimieren",
            item2: "Plattformleistung und Skalierbarkeit verbessern",
            item3: "Neue Funktionen und Fähigkeiten entwickeln",
            item4:
              "Mit dem Team an technischen Entscheidungen zusammenarbeiten",
            item5: "Bestehende Codebasis warten und verbessern",
          },
          requirements: {
            item1: "3+ Jahre Erfahrung mit KI/ML-Technologien",
            item2: "Starke Programmierkenntnisse in Python und TypeScript",
            item3: "Erfahrung mit LLM-APIs und Integration",
            item4: "Ausgezeichnete Problemlösungsfähigkeiten",
            item5: "Leidenschaft für KI und Datenschutz",
          },
          qualifications: {
            required: {
              item1: "3+ Jahre Erfahrung mit KI/ML-Technologien",
              item2: "Starke Programmierkenntnisse in Python und TypeScript",
              item3: "Erfahrung mit LLM-APIs und Integration",
            },
            preferred: {
              item1: "Ausgezeichnete Problemlösungsfähigkeiten",
              item2: "Leidenschaft für KI und Datenschutz",
              item3: "Erfahrung mit verteilten Systemen",
            },
          },
          experienceLevel: "Mittleres bis Senior-Niveau",
        },
        contentCreator: {
          title: "Community-Manager",
          shortDescription:
            "Bauen Sie unsere Community von KI-Enthusiasten und Power-Usern auf und engagieren Sie sich.",
          longDescription:
            "Wir suchen einen Community-Manager, der unsere wachsende Community von KI-Enthusiasten aufbaut und pflegt, ansprechende Inhalte erstellt und bedeutungsvolle Diskussionen fördert.",
          location: "Remote",
          department: "Community",
          type: "Vollzeit",
          responsibilities: {
            item1: "Die {{appName}}-Community aufbauen und engagieren",
            item2: "Überzeugende Inhalte für soziale Medien erstellen",
            item3: "Diskussionen moderieren und Support bieten",
            item4: "Community-Events und Initiativen organisieren",
            item5: "Community-Feedback sammeln und analysieren",
          },
          requirements: {
            item1: "2+ Jahre Erfahrung im Community-Management",
            item2: "Ausgezeichnete Kommunikations- und Schreibfähigkeiten",
            item3: "Leidenschaft für KI und Technologie",
            item4: "Erfahrung mit Social-Media-Plattformen",
            item5: "Fähigkeit, selbstständig zu arbeiten",
          },
          qualifications: {
            required: {
              item1: "2+ Jahre Erfahrung im Community-Management",
              item2: "Ausgezeichnete Kommunikations- und Schreibfähigkeiten",
              item3: "Leidenschaft für KI und Technologie",
            },
            preferred: {
              item1: "Erfahrung mit Social-Media-Plattformen",
              item2: "Fähigkeit, selbstständig zu arbeiten",
              item3: "Hintergrund in KI oder Technologie",
            },
          },
          experienceLevel: "Mittleres Niveau",
          postedDate: "15. Januar 2025",
          applicationDeadline: "15. Februar 2025",
        },
      },
      jobDetail: {
        jobOverview: "Stellenübersicht",
        responsibilities: "Verantwortlichkeiten",
        requirements: "Anforderungen",
        qualifications: "Qualifikationen",
        qualificationsRequired: "Erforderliche Qualifikationen",
        qualificationsPreferred: "Bevorzugte Qualifikationen",
        applyNow: "Jetzt bewerben",
        location: "Standort",
        department: "Abteilung",
        employmentType: "Beschäftigungsart",
        experienceLevel: "Erfahrungsstufe",
        postedDate: "Veröffentlichungsdatum",
        applicationDeadline: "Bewerbungsfrist",
        relatedPositions: "Verwandte Positionen",
        moreDetails: "Weitere Details",
      },
      applyNow: "Jetzt bewerben",
      readyToJoin: "Bereit beizutreten?",
      explorePositions:
        "Wir sind immer auf der Suche nach talentierten Menschen, die unserem Team beitreten möchten. Schauen Sie sich unsere offenen Stellen an oder nehmen Sie Kontakt mit uns auf, um mehr über Karrieremöglichkeiten zu erfahren.",
      getInTouch: "Kontakt aufnehmen",
    },
    aboutUs: {
      backToHome: "Zurück zur Startseite",
      title: "Über {{appName}}",
      subtitle: "Pioniere unzensierter KI-Gespräche",
      description:
        "Wir haben die Mission, den Zugang zu unzensierter KI zu demokratisieren. Gegründet im Jahr {{foundedYear}}, bietet {{appName}} eine Plattform, auf der Benutzer ehrliche, ungefilterte Gespräche mit den fortschrittlichsten KI-Modellen der Welt führen können.",
      values: {
        title: "Unsere Werte",
        description:
          "Die Prinzipien, die alles leiten, was wir bei {{appName}} tun",
        excellence: {
          title: "Exzellenz",
          description:
            "Wir streben nach Exzellenz in allem, was wir tun, von der Leistung unserer Plattform bis zu unserem Kundensupport.",
        },
        innovation: {
          title: "Innovation",
          description:
            "Wir innovieren kontinuierlich, um Ihnen die neuesten KI-Modelle und Funktionen zu bieten.",
        },
        integrity: {
          title: "Integrität",
          description:
            "Wir arbeiten mit Transparenz und Ehrlichkeit und respektieren Ihre Privatsphäre und Daten.",
        },
        collaboration: {
          title: "Zusammenarbeit",
          description:
            "Wir arbeiten mit unserer Community zusammen, um die beste KI-Chat-Plattform zu bauen.",
        },
      },
      mission: {
        title: "Unsere Mission",
        subtitle: "Demokratisierung des Zugangs zu unzensierter KI",
        description:
          "Wir glauben, dass KI für jeden zugänglich sein sollte, ohne Zensur oder Einschränkungen. Unsere Mission ist es, eine Plattform bereitzustellen, auf der Benutzer ehrliche Gespräche mit KI führen können.",
        vision: {
          title: "Unsere Vision",
          description:
            "Die weltweit führende Plattform für unzensierte KI-Gespräche zu werden und Benutzern Zugang zu den fortschrittlichsten KI-Modellen zu ermöglichen.",
        },
        approach: {
          title: "Unser Ansatz",
          description:
            "Wir kombinieren modernste KI-Technologie mit einer benutzerzentrierten Philosophie und gewährleisten Privatsphäre, Sicherheit und Meinungsfreiheit.",
        },
        commitment: {
          title: "Unser Engagement",
          description:
            "Wir verpflichten uns, eine Plattform zu unterhalten, die die Privatsphäre der Benutzer respektiert, transparente Preise bietet und außergewöhnliche KI-Erlebnisse liefert.",
        },
      },
      contact: {
        title: "Kontaktieren Sie uns",
        description:
          "Haben Sie Fragen oder Feedback? Wir würden gerne von Ihnen hören.",
        cta: "Kontaktieren Sie uns",
      },
    },
    imprint: {
      title: "Impressum",
      lastUpdated: "Zuletzt aktualisiert: Januar 2025",
      introduction:
        "Dieses Impressum enthält gesetzlich vorgeschriebene Informationen über {{appName}} gemäß den geltenden Gesetzen.",
      printButton: "Drucken",
      printAriaLabel: "Diese Seite drucken",
      sections: {
        partnerships: {
          title: "Partnerschaften & Zugehörigkeiten",
          description:
            "Informationen über unsere Geschäftspartnerschaften und Zugehörigkeiten.",
          content:
            "{{appName}} unterhält Partnerschaften mit führenden KI-Anbietern, um unseren Nutzern den bestmöglichen Service zu bieten.",
        },
        companyInfo: {
          title: "Unternehmensinformationen",
          description:
            "Rechtliche Informationen über {{appName}} und unsere eingetragene Geschäftseinheit.",
        },
        responsiblePerson: {
          title: "Verantwortliche Person",
          description:
            "Informationen über die für den Inhalt dieser Website verantwortliche Person.",
        },
        contactInfo: {
          title: "Kontaktinformationen",
          description:
            "So erreichen Sie uns für rechtliche und geschäftliche Anfragen.",
          communication: {
            phone: "{{config.group.contact.phone}}",
          },
        },
        disclaimer: {
          title: "Haftungsausschluss",
          copyright: {
            title: "Urheberrecht",
            content:
              "Alle Inhalte dieser Website sind urheberrechtlich geschützt. Unbefugte Nutzung ist untersagt.",
          },
          liability: {
            title: "Haftung",
            content:
              "Wir geben keine Zusicherungen oder Garantien hinsichtlich der Vollständigkeit, Genauigkeit oder Zuverlässigkeit der Informationen auf dieser Website.",
          },
          links: {
            title: "Externe Links",
            content:
              "Unsere Website kann Links zu externen Websites enthalten. Wir sind nicht verantwortlich für den Inhalt externer Websites.",
          },
        },
        disputeResolution: {
          title: "Streitbeilegung",
          description:
            "Informationen darüber, wie Streitigkeiten behandelt und gelöst werden.",
          content:
            "Alle Streitigkeiten, die sich aus der Nutzung dieser Website ergeben, werden gemäß geltendem Recht beigelegt.",
        },
      },
    },
    privacyPolicy: {
      title: "Datenschutzerklärung",
      lastUpdated: "Zuletzt aktualisiert: Januar 2025",
      introduction:
        "Bei {{appName}} nehmen wir Ihre Privatsphäre ernst. Diese Datenschutzerklärung erklärt, wie wir Ihre persönlichen Daten sammeln, verwenden und schützen, wenn Sie unsere unzensierte KI-Chat-Plattform nutzen.",
      printButton: "Drucken",
      printAriaLabel: "Diese Seite drucken",
      sections: {
        informationCollect: {
          title: "Welche Informationen wir sammeln",
          description:
            "Wir sammeln Informationen, die Sie uns direkt zur Verfügung stellen, und Informationen, die automatisch erfasst werden, wenn Sie unseren Service nutzen.",
        },
        personalData: {
          title: "Personenbezogene Daten",
          description: "Wir können folgende personenbezogene Daten sammeln:",
          items: {
            name: "Name und Kontaktinformationen",
            email: "E-Mail-Adresse",
            phone: "Telefonnummer (optional)",
            company: "Firmenname (optional)",
            billing: "Abrechnungs- und Zahlungsinformationen",
            payment: "Zahlungsmethode und Transaktionsdetails",
            usage: "Nutzungsdaten und Chat-Verlauf (verschlüsselt)",
          },
        },
        socialMediaData: {
          title: "Social-Media-Daten",
          description:
            "Wenn Sie Social-Media-Konten verbinden, können wir Profilinformationen und zugehörige Daten sammeln, wie von diesen Plattformen erlaubt.",
        },
        howWeUse: {
          title: "Wie wir Ihre Informationen verwenden",
          description:
            "Wir verwenden Ihre Informationen, um unsere Dienste bereitzustellen und zu verbessern, Zahlungen zu verarbeiten und mit Ihnen zu kommunizieren.",
          items: {
            service: "Zugang zu KI-Modellen und Funktionen bereitstellen",
            support: "Kundensupport bereitstellen",
            billing: "Zahlungen verarbeiten und Abonnements verwalten",
            improve:
              "Unsere Plattform verbessern und neue Funktionen entwickeln",
            security: "Sicherheit aufrechterhalten und Betrug verhindern",
            legal: "Gesetzliche Verpflichtungen erfüllen",
          },
        },
        dataProtection: {
          title: "Datenschutz & Verschlüsselung",
          description:
            "Ihre Privatsphäre ist unsere Priorität. Wir implementieren branchenübliche Sicherheitsmaßnahmen:",
          items: {
            encryption:
              "End-to-End-Verschlüsselung für private Ordner und sensible Daten",
            incognito:
              "Inkognito-Modus für Sitzungs-Chats, die nie gespeichert werden",
            gdpr: "Volle DSGVO-Konformität für EU-Nutzer",
            noSelling: "Wir verkaufen Ihre Daten niemals an Dritte",
            minimal: "Minimale Datenerfassung - nur das Notwendige",
          },
        },
        thirdParty: {
          title: "Drittanbieter-Dienste",
          description: "Wir nutzen folgende Drittanbieter-Dienste:",
          items: {
            stripe: "Stripe für Zahlungsabwicklung",
            nowpayments: "NowPayments für Kryptowährungszahlungen",
            ai: "KI-Modellanbieter (OpenAI, Anthropic, Google, etc.)",
            analytics: "Analyse-Dienste (nur anonymisierte Daten)",
          },
        },
        yourRights: {
          title: "Ihre Rechte",
          description: "Sie haben das Recht:",
          items: {
            access: "Auf Ihre personenbezogenen Daten zuzugreifen",
            rectify: "Unrichtige Daten zu berichtigen",
            delete: "Die Löschung Ihrer Daten zu verlangen",
            export: "Ihre Daten zu exportieren",
            restrict: "Die Verarbeitung Ihrer Daten einzuschränken",
            object: "Der Verarbeitung Ihrer Daten zu widersprechen",
            withdraw: "Die Einwilligung jederzeit zu widerrufen",
          },
        },
        dataRetention: {
          title: "Datenspeicherung",
          description:
            "Wir speichern Ihre Daten nur so lange, wie es zur Bereitstellung unserer Dienste und zur Erfüllung gesetzlicher Verpflichtungen erforderlich ist. Sie können Ihr Konto und alle zugehörigen Daten jederzeit löschen.",
        },
        cookies: {
          title: "Cookies und Tracking",
          description:
            "Wir verwenden Cookies und ähnliche Tracking-Technologien, um Ihre Erfahrung zu verbessern und Nutzungsmuster zu analysieren.",
        },
        derivativeData: {
          title: "Abgeleitete Daten",
          description:
            "Wir können anonymisierte, aggregierte Daten aus Ihrer Nutzung erstellen, um unsere Dienste zu verbessern.",
        },
        useOfInformation: {
          title: "Verwendung Ihrer Informationen",
          description:
            "Wir verwenden die gesammelten Informationen für verschiedene Zwecke, einschließlich:",
          items: {
            provide: "Bereitstellung und Wartung unserer KI-Chat-Dienste",
            process:
              "Verarbeitung Ihrer Transaktionen und Verwaltung Ihres Kontos",
            send: "Versand von Updates, Newslettern und Marketingmitteilungen",
            respond:
              "Beantwortung Ihrer Anfragen und Bereitstellung von Kundensupport",
            monitor:
              "Überwachung und Analyse von Nutzungsmustern zur Verbesserung unserer Plattform",
            personalize:
              "Personalisierung Ihrer Erfahrung und Bereitstellung relevanter Inhalte",
          },
        },
        disclosure: {
          title: "Informationsoffenlegung",
          description:
            "Wir können Ihre Informationen offenlegen, wenn dies gesetzlich vorgeschrieben ist oder um unsere Rechte und Sicherheit zu schützen.",
        },
        gdpr: {
          title: "DSGVO-Konformität",
          description:
            "Für Nutzer in der Europäischen Union erfüllen wir alle DSGVO-Anforderungen und respektieren Ihre Datenschutzrechte.",
        },
        ccpa: {
          title: "CCPA-Konformität",
          description:
            "Für Einwohner Kaliforniens erfüllen wir den California Consumer Privacy Act und respektieren Ihre Datenschutzrechte.",
        },
        children: {
          title: "Datenschutz für Kinder",
          description:
            "Unser Service ist nicht für Kinder unter 13 Jahren bestimmt. Wir sammeln wissentlich keine Daten von Kindern.",
        },
        businessTransfers: {
          title: "Geschäftsübertragungen",
          description:
            "Im Falle einer Fusion, Übernahme oder eines Verkaufs von Vermögenswerten können Ihre Daten an die neue Einheit übertragen werden.",
        },
        changes: {
          title: "Änderungen dieser Richtlinie",
          description:
            "Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Wir werden Sie über wesentliche Änderungen informieren.",
        },
        legal: {
          title: "Rechtsgrundlage für die Verarbeitung",
          description:
            "Wir verarbeiten Ihre personenbezogenen Daten auf Grundlage Ihrer Einwilligung, vertraglicher Notwendigkeit, gesetzlicher Verpflichtungen und unserer berechtigten Interessen bei der Bereitstellung und Verbesserung unserer Dienste.",
        },
        security: {
          title: "Sicherheitsmaßnahmen",
          description:
            "Wir implementieren angemessene technische und organisatorische Sicherheitsmaßnahmen zum Schutz Ihrer personenbezogenen Daten vor unbefugtem Zugriff, Änderung, Offenlegung oder Zerstörung. Jedoch ist keine Übertragungsmethode über das Internet zu 100% sicher.",
        },
        rights: {
          title: "Ihre Datenschutzrechte",
          description:
            "Gemäß den Datenschutzgesetzen haben Sie bestimmte Rechte in Bezug auf Ihre persönlichen Informationen:",
          items: {
            access: "Recht auf Zugang zu Ihren personenbezogenen Daten",
            correction:
              "Recht auf Berichtigung ungenauer oder unvollständiger Daten",
            deletion:
              "Recht auf Löschung Ihrer Daten (Recht auf Vergessenwerden)",
            objection:
              "Recht auf Widerspruch gegen die Verarbeitung Ihrer Daten",
            portability: "Recht auf Datenübertragbarkeit und -transfer",
          },
        },
        thirdPartySites: {
          title: "Websites Dritter",
          description:
            "Unser Service kann Links zu Websites Dritter enthalten. Wir sind nicht verantwortlich für die Datenschutzpraktiken dieser externen Websites. Wir empfehlen Ihnen, deren Datenschutzerklärungen zu überprüfen.",
        },
      },
    },
    termsOfService: {
      title: "Nutzungsbedingungen",
      lastUpdated: "Zuletzt aktualisiert: Januar 2025",
      introduction:
        "Willkommen bei {{appName}}. Durch die Nutzung unserer unzensierten KI-Chat-Plattform stimmen Sie diesen Nutzungsbedingungen zu. Bitte lesen Sie sie sorgfältig durch.",
      printButton: "Drucken",
      printAriaLabel: "Diese Seite drucken",
      sections: {
        agreement: {
          title: "Zustimmung zu den Bedingungen",
          content:
            "Durch den Zugriff auf oder die Nutzung von {{appName}} erklären Sie sich mit diesen Nutzungsbedingungen und allen geltenden Gesetzen und Vorschriften einverstanden. Wenn Sie mit einem dieser Bedingungen nicht einverstanden sind, ist Ihnen die Nutzung dieses Dienstes untersagt.",
        },
        description: {
          title: "Dienstbeschreibung",
          content:
            "{{appName}} bietet Zugang zu unzensierten KI-Chat-Modellen verschiedener Anbieter. Wir bieten kostenlose und kostenpflichtige Tarife mit unterschiedlichen Funktionen und Nutzungslimits. Der Dienst wird 'wie besehen' ohne jegliche Garantien bereitgestellt.",
        },
        subscriptions: {
          title: "Abonnements und Abrechnung",
          plans: {
            title: "Abonnement-Pläne",
            content:
              "Wir bieten Kostenlos ({{freeCredits}} Credits/Monat), Guthaben-Pakete ({{packCurrency}}{{packPrice}}/{{packCredits}} Credits) und Unbegrenzt ({{subCurrency}}{{subPrice}}/Monat) Pläne an.",
          },
          billing: {
            title: "Abrechnung",
            content:
              "Abonnements werden monatlich abgerechnet. Guthaben-Pakete sind einmalige Käufe, die nie verfallen. Wir akzeptieren Kreditkarten über Stripe und Kryptowährungen über NowPayments.",
          },
          cancellation: {
            title: "Kündigung",
            content:
              "Sie können Ihr Abonnement jederzeit kündigen. Kündigungen werden am Ende des aktuellen Abrechnungszeitraums wirksam. Guthaben-Pakete sind nicht erstattungsfähig.",
          },
        },
        userAccounts: {
          title: "Benutzerkonten",
          creation: {
            title: "Kontoerstellung",
            content:
              "Sie müssen genaue Informationen angeben, wenn Sie ein Konto erstellen. Sie sind für die Sicherheit Ihrer Kontodaten verantwortlich.",
          },
          responsibilities: {
            title: "Benutzerverantwortlichkeiten",
            content:
              "Sie sind für alle Aktivitäten unter Ihrem Konto verantwortlich. Sie dürfen Ihr Konto nicht mit anderen teilen oder den Dienst für illegale Zwecke nutzen.",
          },
        },
        userContent: {
          title: "Benutzerinhalte",
          ownership: {
            title: "Inhaltseigentum",
            content:
              "Sie behalten alle Rechte an Ihren Gesprächen und Daten. Wir beanspruchen kein Eigentum an Ihren Inhalten. Ihre privaten Ordner sind verschlüsselt und nur für Sie zugänglich.",
          },
          guidelines: {
            title: "Inhaltsrichtlinien",
            intro:
              "Obwohl wir unzensierten KI-Zugang bieten, dürfen Sie den Dienst nicht verwenden, um:",
            items: {
              item1: "Illegale Aktivitäten durchzuführen",
              item2: "Andere zu belästigen, zu bedrohen oder zu schädigen",
              item3: "Geistige Eigentumsrechte zu verletzen",
              item4: "Die Plattform zu hacken oder zu kompromittieren",
            },
          },
        },
        intellectualProperty: {
          title: "Geistiges Eigentum",
          content:
            "Die {{appName}}-Plattform, einschließlich ihres Designs, ihrer Funktionen und ihres Codes, ist durch Gesetze zum Schutz des geistigen Eigentums geschützt. Sie dürfen unsere Plattform ohne Genehmigung nicht kopieren, ändern oder verbreiten.",
        },
        disclaimer: {
          title: "Haftungsausschluss für Garantien",
          content:
            "Der Dienst wird 'wie besehen' ohne Garantien bereitgestellt. Wir garantieren keinen ununterbrochenen Zugang, keine Genauigkeit der KI-Antworten oder Eignung für einen bestimmten Zweck.",
        },
        limitation: {
          title: "Haftungsbeschränkung",
          content:
            "{{appName}} haftet nicht für indirekte, zufällige, besondere oder Folgeschäden, die sich aus Ihrer Nutzung des Dienstes ergeben.",
        },
        termination: {
          title: "Beendigung",
          content:
            "Wir behalten uns das Recht vor, Ihr Konto bei Verstößen gegen diese Bedingungen zu kündigen oder zu sperren. Sie können Ihr Konto jederzeit kündigen.",
        },
        changes: {
          title: "Änderungen der Bedingungen",
          content:
            "Wir können diese Nutzungsbedingungen von Zeit zu Zeit aktualisieren. Die fortgesetzte Nutzung des Dienstes nach Änderungen stellt die Annahme der neuen Bedingungen dar.",
        },

        indemnification: {
          title: "Schadloshaltung",
          content:
            "Sie verpflichten sich, {{appName}} und seine verbundenen Unternehmen von allen Ansprüchen, Schäden oder Aufwendungen freizustellen, die sich aus Ihrer Nutzung des Dienstes oder Verletzung dieser Bedingungen ergeben.",
        },
        governingLaw: {
          title: "Anwendbares Recht",
          content:
            "Diese Nutzungsbedingungen unterliegen den Gesetzen der {{config.group.jurisdiction.country}}. Alle Streitigkeiten werden vor den Gerichten in {{config.group.jurisdiction.city}}, {{config.group.jurisdiction.country}}, beigelegt.",
        },
      },
    },
  },
  footer: {
    tagline: "Chatten Sie mit KI, Verbinden Sie sich mit der Community",
    privacyTagline:
      "Datenschutzorientierter KI-Chat mit {{modelCount}} unzensierten Modellen",
    platform: {
      title: "Plattform",
      features: "Funktionen",
      subscription: "Abonnement",
      aiModels: "KI-Modelle",
      characters: "Characters",
    },
    product: {
      title: "Produkt",
      privateChats: "Private Chats",
      incognitoMode: "Inkognito-Modus",
      sharedFolders: "Geteilte Ordner",
      publicForum: "Öffentliches Forum",
    },
    company: {
      title: "Unternehmen",
      aboutUs: "Über uns",
      careers: "Karriere",
      imprint: "Impressum",
      privacyPolicy: "Datenschutz",
      termsOfService: "Nutzungsbedingungen",
    },
    legal: {
      title: "Rechtliches",
    },
    builtWith: "Erstellt mit",
    framework: "{{appName}} Framework",
    copyright: "© {{year}} {{appName}}. Alle Rechte vorbehalten.",
  },
};
