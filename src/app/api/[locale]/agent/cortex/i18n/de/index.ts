/* eslint-disable i18next/no-literal-string */
export const translations = {
  tags: {
    cortex: "Cortex",
  },
  category: "Cortex",
  scaffold: {
    roots: {
      memories: "erinnerungen",
      documents: "dokumente",
    },
    memories: {
      identity: {
        path: "identität",
        purpose: "Wer du bist: Name, Rolle, Ziele, Kommunikationsstil",
      },
      expertise: {
        path: "fachgebiet",
        purpose: "Was du kannst: Fähigkeiten, Werkzeuge, Hintergrund",
      },
      context: {
        path: "kontext",
        purpose:
          "Aktuelle Situation: laufende Projekte, Präferenzen, Einschränkungen",
      },
      life: {
        path: "leben",
        purpose:
          "Lebensziele und aktueller Stand: Karriere, Gesundheit, Beziehungen, Finanzen, Wachstum, Sinn",
      },
    },
    documents: {
      inbox: {
        path: "posteingang",
        purpose:
          "Schnellerfassung — hier ablegen, später sortieren wenn der Kontext klar ist",
        icon: "inbox",
      },
      projects: {
        path: "projekte",
        purpose: "Aktive Arbeit — ein Unterordner pro Projekt",
        icon: "folder-open",
      },
      knowledge: {
        path: "wissen",
        purpose:
          "Permanente Referenz — Dinge, die es wert sind, für immer aufgehoben zu werden",
        icon: "book-open",
      },
      journal: {
        path: "tagebuch",
        purpose: "Datierte Einträge — Ideen, Reflexionen, Beobachtungen",
        icon: "pen-line",
      },
      templates: {
        path: "vorlagen",
        purpose: "Wiederverwendbare Strukturen für wiederkehrende Aufgaben",
        icon: "layout-template",
      },
    },
  },
  templates: {
    memories: {
      identity: {
        name: {
          path: "name.md",
          content: `---\npriority: 100\ntags: [identität]\n---\n\n<!-- Dein Name und wie du angesprochen werden möchtest. Die KI trägt das beim ersten Gespräch ein. -->\n`,
        },
        role: {
          path: "rolle.md",
          content: `---\npriority: 100\ntags: [identität, arbeit]\n---\n\n<!-- Deine berufliche Rolle, was du machst und in welchem Kontext du arbeitest. -->\n`,
        },
        goals: {
          path: "ziele.md",
          content: `---\npriority: 90\ntags: [identität, ziele]\n---\n\n<!-- Deine wichtigsten Ziele — was du aufbauen, erreichen oder verbessern willst. Kurz- und langfristig. -->\n`,
        },
        communication: {
          path: "kommunikation.md",
          content: `---\npriority: 85\ntags: [identität, stil]\n---\n\n<!-- Wie du am liebsten kommunizierst: Ton, Tiefe, Format, was dich nervt, was du schätzt. -->\n`,
        },
      },
      expertise: {
        skills: {
          path: "fähigkeiten.md",
          content: `---\npriority: 80\ntags: [fachgebiet]\n---\n\n<!-- Deine fachlichen und beruflichen Fähigkeiten. Worin du Experte bist, was du lernst. -->\n`,
        },
        tools: {
          path: "werkzeuge.md",
          content: `---\npriority: 75\ntags: [fachgebiet, technik]\n---\n\n<!-- Tools, Sprachen, Frameworks und Plattformen, die du regelmäßig nutzt. Bevorzugter Stack. -->\n`,
        },
        background: {
          path: "hintergrund.md",
          content: `---\npriority: 70\ntags: [fachgebiet]\n---\n\n<!-- Dein Hintergrund, deine Erfahrung und wie du dahin gekommen bist. Prägt jeden Kontext. -->\n`,
        },
      },
      context: {
        projects: {
          path: "projekte.md",
          content: `---\npriority: 80\ntags: [kontext, projekte]\n---\n\n<!-- Aktive Projekte: woran du arbeitest, was gerade am wichtigsten ist. -->\n`,
        },
        preferences: {
          path: "präferenzen.md",
          content: `---\npriority: 70\ntags: [kontext]\n---\n\n<!-- Arbeitsweise: wie du am liebsten arbeitest, was dich bremst, was dir hilft, fokussiert zu bleiben. -->\n`,
        },
        constraints: {
          path: "einschränkungen.md",
          content: `---\npriority: 65\ntags: [kontext]\n---\n\n<!-- Einschränkungen, feste Regeln und Nicht-Verhandelbarkeiten für das Verhalten der KI dir gegenüber. -->\n`,
        },
      },
      life: {
        career: {
          path: "karriere.md",
          content: `---\npriority: 90\ntags: [leben, karriere, ziele]\n---\n\n## Aktueller Stand\n\n<!-- Was machst du gerade beruflich? Rolle, Unternehmen/Projekt, Einkommensniveau, Zufriedenheit 1-10. -->\n\n## Ziele\n\n<!-- Kurzfristig (dieser Monat): -->\n<!-- Mittelfristig (dieses Jahr): -->\n<!-- Langfristig (3-5 Jahre): -->\n\n## Aktive Projekte\n\n<!-- Welche Projekte in /dokumente/projekte/ dienen deiner Karriere gerade? Was ist der Zusammenhang? -->\n\n## Hindernisse\n\n<!-- Was würde alles verändern, wenn es gelöst wäre? Was ist das größte Hindernis? -->\n\n## Muster\n\n<!-- Wiederkehrende Karrierethemen: was du immer wieder anstrebst, was dich erschöpft, was dich antreibt. -->\n`,
        },
        health: {
          path: "gesundheit.md",
          content: `---\npriority: 90\ntags: [leben, gesundheit, ziele]\n---\n\n## Aktueller Stand\n\n<!-- Ehrliche Bestandsaufnahme: körperliche Fitness, mentaler Zustand, Schlafqualität, Beschwerden oder Sorgen. -->\n\n## Routinen\n\n<!-- Was du wirklich tust (nicht was du planst). Sport, Schlafrhythmus, Ernährungsgewohnheiten. -->\n\n## Energie\n\n<!-- Was lädt dich auf? Was zieht dich runter? Wann am Tag/in der Woche bist du am schärfsten? -->\n\n## Ziele\n\n<!-- Kurzfristig (dieser Monat): -->\n<!-- Langfristig (dieses Jahr): -->\n\n## Hindernisse\n\n<!-- Was hindert dich an besserer Gesundheit? Zeit, Motivation, Wissen, Umgebung? -->\n`,
        },
        relationships: {
          path: "beziehungen.md",
          content: `---\npriority: 85\ntags: [leben, beziehungen, ziele]\n---\n\n## Innerer Kreis\n\n<!-- Die 3-5 Menschen, die am meisten zählen. Partner, Familie, engste Freunde. Wie läuft es mit jedem? -->\n\n## Aktueller Stand\n\n<!-- Allgemeine Beziehungsgesundheit. Wem bist du nah? Von wem hast du dich entfernt? -->\n\n## Investition\n\n<!-- Wer braucht gerade mehr von dir? Wo investierst du zu viel vs zu wenig? -->\n\n## Ziele\n\n<!-- Was willst du in deinen Beziehungen dieses Jahr aufbauen oder reparieren? -->\n\n## Hindernisse\n\n<!-- Was steht im Weg? Zeit, Distanz, ungelöste Konflikte, Ausweichen? -->\n`,
        },
        finances: {
          path: "finanzen.md",
          content: `---\npriority: 85\ntags: [leben, finanzen, ziele]\n---\n\n## Aktueller Stand\n\n<!-- Monatliche Einnahmen vs Ausgaben. Ersparnisse. Schulden. Stabilitätsbewertung 1-10. -->\n\n## Sicherheitsnetz\n\n<!-- Wie viele Monate könntest du ohne Einkommen überleben? Wie lang ist deine Runway? -->\n\n## Ziele\n\n<!-- Kurzfristig (dieser Monat): -->\n<!-- Langfristig (dieses Jahr): -->\n\n## Wachstum\n\n<!-- Wie baust du Vermögen oder finanzielle Sicherheit auf? Investitionen, Nebeneinkommen, bezahlte Fähigkeiten. -->\n\n## Hindernisse\n\n<!-- Was ist das größte finanzielle Risiko oder Hindernis gerade? -->\n`,
        },
        growth: {
          path: "wachstum.md",
          content: `---\npriority: 85\ntags: [leben, wachstum, lernen, ziele]\n---\n\n## Aktueller Fokus\n\n<!-- Was lernst oder entwickelst du gerade aktiv? Was klickt? -->\n\n## Kompetenzlücke\n\n<!-- Welche Fähigkeit oder welches Wissen würde, wenn erworben, das nächste Level für dich freischalten? -->\n\n## Ziele\n\n<!-- Was willst du dieses Jahr lernen oder meistern? Sei konkret. -->\n\n## Ressourcen\n\n<!-- Bücher, Kurse, Mentoren, Communities, die helfen. Was funktioniert? -->\n\n## Hindernisse\n\n<!-- Was bremst dein Wachstum? Zeit, Fokus, Zugang, Angst? -->\n`,
        },
        purpose: {
          path: "sinn.md",
          content: `---\npriority: 95\ntags: [leben, sinn, werte, ziele]\n---\n\n## Leitstern\n\n<!-- Ein oder zwei Sätze: worum geht es in deinem Leben im Kern? Was bist du hier, um zu tun oder aufzubauen? -->\n\n## Kernwerte\n\n<!-- 3-5 Werte, die deine Entscheidungen leiten. Keine Wünsche — Dinge, nach denen du wirklich lebst. -->\n\n## Wie Erfolg aussieht\n\n<!-- In 5 Jahren: wie sieht ein gut gelebtes Leben konkret für dich aus? -->\n`,
        },
      },
    },
    documents: {
      meetingNotes: {
        path: "besprechungsnotizen.md",
        content: `---\ntype: vorlage\ntags: [besprechungen, vorlage]\n---\n\n# Besprechungsnotizen — [Datum]\n\n**Teilnehmer:**\n**Zweck:**\n\n## Kontext\n\nKurzer Hintergrund, warum dieses Treffen stattfand.\n\n## Agenda\n\n1.\n2.\n3.\n\n## Wichtige Entscheidungen\n\n-\n\n## Aufgaben\n\n- [ ] @person — Aufgabe — fällig [Datum]\n\n## Notizen\n\n---\n*Abgelegt aus: /dokumente/posteingang*\n`,
      },
      projectBrief: {
        path: "projektbeschreibung.md",
        content: `---\ntype: vorlage\ntags: [projekte, vorlage]\nstatus: entwurf\n---\n\n# Projektbeschreibung: [Name]\n\n**Verantwortlich:**\n**Start:**\n**Zieldatum:**\n\n## Problem\n\nWas bricht oder schmerzt ohne das? Ein Absatz, kein Füllstoff.\n\n## Ziel\n\nEin Satz. Konkretes Ergebnis. Wenn möglich messbar.\n\n## Umfang\n\n**Enthalten:**\n-\n\n**Nicht enthalten:**\n-\n\n## Erfolgskriterien\n\n- [ ]\n- [ ]\n\n## Risiken\n\n| Risiko | Wahrscheinlichkeit | Auswirkung | Gegenmaßnahme |\n|--------|-------------------|------------|---------------|\n|        |                   |            |               |\n\n## Ressourcen\n\nLinks, Referenzen, Vorarbeiten.\n`,
      },
      weeklyReview: {
        path: "wochenrückblick.md",
        content: `---\ntype: vorlage\ntags: [rückblick, wöchentlich, vorlage]\n---\n\n# Woche vom [Datum]\n\n## Was fertiggestellt wurde\n\n-\n\n## Was nicht\n\n-\n\n## Aufgetretene Hindernisse\n\n-\n\n## Was ich gelernt habe\n\n-\n\n## Fokus nächste Woche\n\n1.\n2.\n3.\n\n## Energielevel (1–10)\n\nArbeit:\nPersönlich:\n\n---\n*Unter 200 Wörtern halten. Schnelligkeit wichtiger als Vollständigkeit.*\n`,
      },
      decisionLog: {
        path: "entscheidungsprotokoll.md",
        content: `---\ntype: vorlage\ntags: [entscheidungen, architektur, vorlage]\n---\n\n# Entscheidung: [Titel]\n\n**Datum:**\n**Status:** vorgeschlagen | akzeptiert | abgelöst | veraltet\n**Entscheider:**\n\n## Kontext\n\nWelche Situation hat diese Entscheidung erzwungen? Welche Einschränkungen gibt es?\n\n## Betrachtete Optionen\n\n### Option A — [Name]\n\n**Vorteile:**\n**Nachteile:**\n\n### Option B — [Name]\n\n**Vorteile:**\n**Nachteile:**\n\n## Entscheidung\n\nWir wählten **Option [X]**, weil:\n\n## Konsequenzen\n\n**Positiv:**\n**Negativ:**\n**Neutral:**\n\n---\n*Diese Datei aus dem relevanten Projektbrief oder Codekommentar verlinken.*\n`,
      },
      knowledgeArticle: {
        path: "wissensartikel.md",
        content: `---\ntype: vorlage\ntags: [wissen, referenz, vorlage]\n---\n\n# [Thema]\n\n**Zuletzt überprüft:**\n**Quelle:**\n\n## Zusammenfassung\n\nEin Absatz. Was ist das, warum ist es wichtig, wann gilt es?\n\n## Wie es funktioniert\n\nKernmechanik. Kein Füllstoff — nur was du brauchst, um es zu verstehen oder anzuwenden.\n\n## Wann verwenden\n\n-\n-\n\n## Wann NICHT verwenden\n\n-\n\n## Beispiele\n\n\`\`\`\nBeispiel hier einfügen\n\`\`\`\n\n## Referenzen\n\n-\n`,
      },
    },
  },
  enums: {
    nodeType: {
      file: "Datei",
      dir: "Ordner",
    },
    viewType: {
      list: "Liste",
      kanban: "Kanban",
      calendar: "Kalender",
      grid: "Raster",
      wiki: "Wiki",
    },
    syncPolicy: {
      sync: "Synchronisieren",
      local: "Nur lokal",
    },
    creditFeature: {
      write: "Schreiben",
      edit: "Bearbeiten",
      search: "Suche",
      embedding: "Einbettung",
    },
  },
  mounts: {
    memory: "Erinnerung",
    document: "Dokument",
    thread: "Konversation",
    skill: "Fähigkeit",
    task: "Aufgabe",
    upload: "Datei-Upload",
    search: "Websuche",
  },
  button: {
    label: "Kortex",
    title: "Kortex — KI-Gedächtnis",
    unavailableTitle: "Kortex nicht verfügbar",
    unavailableDescription:
      "Kortex steht nur in privaten und geteilten Unterhaltungen zur Verfügung. Starte einen privaten Thread, um dein KI-Gedächtnis zu nutzen.",
  },
  nav: {
    back: "Zurück",
    actions: {
      list: "Durchsuchen",
      read: "Anzeigen",
      write: "Schreiben",
      edit: "Bearbeiten",
      delete: "Löschen",
      move: "Verschieben",
      search: "Suchen",
      tree: "Struktur",
    },
  },
};
