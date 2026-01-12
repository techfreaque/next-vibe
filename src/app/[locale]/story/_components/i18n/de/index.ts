import { translations as navTranslations } from "../../nav/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: navTranslations,
  home: {
    hero: {
      title: "Unzensierter KI-Chat ohne Limits",
      subtitle:
        "Zugriff auf {{modelCount}} KI-Modelle. Private Chats oder öffentliche Diskussionen. Ihre Daten, Ihre Regeln.",
      cta: "Kostenlos starten",
      secondaryCta: "Community entdecken",
      stats: {
        users: "10K+",
        usersLabel: "Aktive Nutzer",
        models: "{{modelCount}}",
        modelsLabel: "KI-Modelle",
        messages: "1M+",
        messagesLabel: "Konversationen",
      },
      imageOverlay: {
        title: "Echtzeit-KI-Gespräche",
        metrics: {
          yearlyGrowth: {
            label: "Nutzerwachstum",
            value: "+300%",
          },
          engagement: {
            label: "Täglich aktive Nutzer",
            value: "5.000+",
          },
          reach: {
            label: "Nachrichten/Tag",
            value: "50K+",
          },
        },
      },
      videoAlt: "{{appName}} Demo",
      scrollDown: "Scrollen zum Erkunden",
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
    features: {
      title: "Alles für KI-Chat + Community",
      subtitle: "Leistungsstarke Funktionen",
      description:
        "Wählen Sie Ihr Privatsphäre-Level. Chatten Sie mit KI. Verbinden Sie sich mit der Community. Alles auf einer Plattform.",
      contentCreation: {
        title: "Private Ordner - Ihre persönliche KI",
        description:
          "Verschlüsselt, server-gespeicherte Chats. Zugriff auf GPT-4, Claude, Gemini und {{modelCount}} Modelle. Ihre privaten Gespräche, synchronisiert über Geräte.",
      },
      strategyDevelopment: {
        title: "Inkognito-Ordner - Nur lokal",
        description:
          "Nur LocalStorage, nie an Server gesendet. Perfekt für maximale Privatsphäre. Gespräche bleiben auf Ihrem Gerät, bis Sie sie löschen.",
      },
      performanceAnalytics: {
        title: "Geteilte Ordner - Zusammenarbeiten",
        description:
          "Teilen Sie bestimmte Chats mit Teammitgliedern oder Freunden. Kollaborative KI-Gespräche mit Berechtigungskontrolle.",
      },
      communityEngagement: {
        title: "Öffentliche Ordner - Community-Forum",
        description:
          "Treten Sie der Community bei! Erstellen Sie öffentliche Threads, nehmen Sie an Diskussionen teil, voten Sie Inhalte hoch und vernetzen Sie sich mit anderen KI-Enthusiasten.",
      },
      growth: {
        title: "40+ unzensierte KI-Modelle",
        description:
          "GPT-4, Claude, Gemini, Llama, Mistral und mehr. Keine Filter, keine Einschränkungen. Wechseln Sie Modelle mitten im Gespräch.",
      },
      audience: {
        title: "Benutzerdefinierte KI-Characters",
        description:
          "Erstellen Sie KI-Charaktere mit einzigartigen Persönlichkeiten. Nutzen Sie Community-Characters oder erstellen Sie eigene. Teilen Sie mit anderen.",
      },
      global: {
        title: "Intelligente Organisation",
        description:
          "Organisieren Sie Chats nach Ordnern. Durchsuchen Sie Gespräche. Taggen Sie Threads. Exportieren Sie Verlauf. Alles bleibt organisiert.",
      },
      adCampaigns: {
        title: "Flexible Preisgestaltung",
        description:
          "Abonnement: {{subCurrency}}{{subPrice}}/Monat mit {{subCredits}} Credits. Guthaben-Pakete: {{packCurrency}}{{packPrice}} für {{packCredits}} Credits (verfallen nie). Krypto- oder Kartenzahlungen akzeptiert.",
      },
      dataAnalysis: {
        title: "Erweiterte Analysen",
        description:
          "Verfolgen Sie Ihre Nutzung, Token-Verbrauch und Gesprächsverlauf. Sehen Sie Ihre KI-Chat-Muster und optimieren Sie Ihren Workflow.",
      },
      automation: {
        title: "Multi-Modell-Chat",
        description:
          "Vergleichen Sie KI-Modelle nebeneinander. Wechseln Sie zwischen GPT-4, Claude und anderen im selben Gesprächsthread.",
      },
      collaboration: {
        title: "Web-Such-Integration",
        description:
          "KI kann das Web durchsuchen (Brave Search) für aktuelle Informationen. Erhalten Sie Echtzeit-Daten in Ihren Gesprächen.",
      },
      analytics: {
        title: "Mehrsprachige Unterstützung",
        description:
          "Englisch, Deutsch, Polnisch-Interface. Chatten Sie mit KI in jeder Sprache. Globale Community, lokale Gespräche.",
      },
    },
    cta: {
      title: "Bereit, der KI + Community-Plattform beizutreten?",
      subtitle:
        "Chatten Sie privat mit {{modelCount}} KI-Modellen. Nehmen Sie an öffentlichen Forum-Diskussionen teil. Wählen Sie Ihr Privatsphäre-Level. Starten Sie heute kostenlos.",
      signUp: "Kostenlos anmelden",
      viewPlans: "Preispläne ansehen",
    },
    pricingSection: {
      title: "Einfache Preisgestaltung",
      description: "Ein Plan für alle. Extra Credits für Power-User.",
    },
    stats: {
      clients: "Aktive Nutzer",
      posts: "Gesendete Nachrichten",
      growth: "Nutzerwachstum",
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
