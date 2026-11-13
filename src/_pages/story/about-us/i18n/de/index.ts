import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Über uns - {{appName}}",
    category: "Über uns",
    description:
      "Erfahren Sie mehr über die Mission von {{appName}} für unzensierte KI-Gespräche",
    imageAlt: "Über {{appName}}",
    keywords: "über {{appName}}, unzensierte KI, KI-Mission, KI-Werte",
    ogTitle: "Über {{appName}} - Unzensierte KI-Plattform",
    ogDescription:
      "Entdecken Sie unsere Mission, den Zugang zu unzensierter KI zu demokratisieren",
    twitterTitle: "Über {{appName}}",
    twitterDescription:
      "Erfahren Sie mehr über unsere Mission für unzensierte KI-Gespräche",
  },
  hero: {
    eyebrow: "Über {{appName}}",
    title: "KI, die dir gehorcht.",
    subtitle:
      "{{modelCount}} Modelle. {{skillCount}} Skills. ~{{toolCount}} Tools. SSH, E-Mail, Browser-Automatisierung, geplante Aufgaben. Kostenlos auf {{appName}} - oder selbst hosten.",
    ctaPrimary: "Jetzt chatten",
    ctaSecondary: "Zum Build-Log",
  },
  stats: {
    models: "KI-Modelle",
    skills: "Skills",
    tools: "Tools",
    founded: "gegründet",
  },
  backToHome: "Zurück zur Startseite",
  title: "Über {{appName}}",
  subtitle: "Pioniere unzensierter KI-Gespräche",
  description:
    "Seit {{foundedYear}} liefert {{appName}} die besten KI-Modelle der Welt - ohne Richtlinien-Team, das entscheidet, was du fragen darfst. Du wählst das Modell. Du setzt den Filter.",
  values: {
    title: "Wo wir keine Kompromisse machen",
    description:
      "Vier Regeln, die jedes Feature von {{appName}} bestehen muss.",
    excellence: {
      title: "Du bestimmst den Filter",
      description:
        "Mainstream-, offene oder unzensierte Modelle. Filterstufe pro Gespräch wählbar. Niemand entscheidet für dich.",
    },
    innovation: {
      title: "Komplett Open Source",
      description:
        "{{appName}} läuft auf next-vibe - Open Source auf GitHub. Code lesen, forken, auf eigener Hardware betreiben.",
    },
    integrity: {
      title: "Privatsphäre ab Werk",
      description:
        "Im Inkognito-Modus bleiben Gespräche auf deinem Gerät (generierte Medien speichern wir aus technischen Gründen vorübergehend). Deine Daten gehören dir - sie sind kein Produkt, das wir verkaufen.",
    },
    collaboration: {
      title: "Öffentlich gebaut",
      description:
        "Roadmap, Architekturentscheidungen, Sackgassen - alles im Blog. Dein Feedback wird zum Feature.",
    },
  },
  mission: {
    title: "Deine KI. Deine Regeln.",
    subtitle: "Zugang zu unzensierter KI für alle",
    description:
      "Jeder große KI-Anbieter filtert, was du fragen darfst - und die Regeln bekommst du nie zu sehen. Wir halten Erwachsene für mündig. Darum bündelt {{appName}} jedes Modell und jede Filterstufe an einem Ort - und gibt dir den Schalter in die Hand.",
    vision: {
      title: "Die Vision",
      description:
        "Ein Zuhause für jedes ernstzunehmende KI-Modell - Mainstream, offen und unzensiert - in dem du festlegst, was tabu ist.",
    },
    approach: {
      title: "Der Ansatz",
      description:
        "Die besten Modelle schnell liefern, mit echten Werkzeugen ausstatten - Suche, Gedächtnis, Automatisierung - und Datenschutz zum Standard machen, nicht zum Aufpreis.",
    },
    commitment: {
      title: "Das Versprechen",
      description:
        "Transparente Preise. Keine Dark Patterns. Eine Plattform, die du jederzeit verlassen kannst - indem du exakt denselben Code selbst hostest.",
    },
  },
  contact: {
    title: "Fragen? Schreib uns.",
    description:
      "Feedback, Partnerschaften, Presse, Bugs - jede Nachricht liest ein Mensch.",
    cta: "Kontakt aufnehmen",
    selfHost: "Selbst hosten",
  },
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
