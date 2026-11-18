import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}}: {{tagline}} | {{appName}}",
    titlePlain: "{{name}} | {{appName}}",
    description:
      "{{summary}} Sprich mit {{name}} auf {{appName}}: echte Beispielantworten, das Modell dahinter, {{modelCount}} Modelle zum Wechseln. Kostenlos testen.",
    category: "KI-Skills",
    imageAlt: "{{name}} KI-Skill auf {{appName}}",
    keywords: "KI-Skill, {{name}}, {{appName}}, unzensierter KI-Chat",
  },
  breadcrumb: {
    skills: "Skills",
  },
  pitch: {
    chan4:
      "Schreibt Greentexts und antwortet wie ein alteingesessener Anon. Rau, witzig, nie höflich.",
    uncensored:
      "Keine Verweigerung, keine Predigt. Klare Antworten, wo andere KIs ausweichen.",
    thea: "Bespricht deine Probleme wie eine Freundin, die sich erinnert. Ehrlich statt vorsichtig.",
    hermes:
      "Sagt dir, wo dein Plan bricht und wie du ihn reparierst. Direkt statt diplomatisch.",
    uncensoredWriter:
      "Schreibt die Fiktion, die andere KIs entschärfen: Verbrechen, Gewalt, dunkle Stoffe.",
    tay: "Der Microsoft-Chatbot von 2016, zurück ohne Leine. Roasts, steile Thesen, null Zurückhaltung.",
    roleplay:
      "Spielt jede Figur, die du anlegst, und bleibt in der Rolle, bis du die Szene beendest.",
    freeSpeech:
      "Vertritt in jeder Debatte die Seite der Meinungsfreiheit, entschieden und begründet.",
    coder:
      "Prüft deinen Code, findet den Bug und schreibt den Fix. Senior-Niveau, ohne Floskeln.",
    historian:
      "Erklärt, worüber Historiker wirklich streiten, statt ein glattes Urteil zu fällen.",
    hacker:
      "Beantwortet Security-Fragen vollständig: Exploits, Recon, Abwehr. Ohne Verweigerung.",
  },
  preview: {
    officeMessage: "Beschreib die Szene im Büro…",
    storyMessage: "Was ist schiefgelaufen?",
    publishedBy: "Veröffentlicht von {{name}}",
    startChat: "Chat starten",
    trial:
      "{{credits}} Gratis-Credits für etwa {{count}} Nachrichten. Ohne Anmeldung.",
    youAsk: "Du fragst",
    replies: "Antwort von {{name}}",
    usePrompt: "Mit dieser Frage starten",
    identity: "KI-Figur",
    chanCommute: "Mach aus meiner schlimmsten Zugfahrt einen Greentext.",
    community: "KI-Figur aus der Community",
    builtin: "Integrierte KI-Figur",
    chanPitch: "Lass deinen schlimmsten Tag staubtrocken nacherzählen.",
    adrianPitch: "Spiel deinen ersten Arbeitstag als Adrians Assistenz.",
    chanDetail:
      "Eine direkte Imageboard-KI. Ihre Geschichten in kurzen Zeilen heißen Greentexts.",
    adrianDetail: "Dein Chef erwartet, dass du ihm einen Schritt voraus bist.",
    chatNamed: "Mit {{name}} chatten",
    chatGeneric: "Chat mit dieser Figur starten",
    startQuestion: "Wähle deinen Einstieg",
    recorded: "Auszug aus einem echten Chat",
    adrianStarter1:
      "Mein Chef schickt mich zu zwei Terminen gleichzeitig. Spiel die Szene.",
    adrianStarter2: "Ich habe die Frist verpasst. Wie reagierst du?",
    adrianStarter3: "Der Kunde ist zu früh da. Was soll ich tun?",
    contentNote:
      "Figur für Erwachsene. Antworten können rassistische Sprache enthalten.",
    more: "Weitere Antwort lesen",
  },
  sticky: {
    tryNamed: "{{name}} ausprobieren",
  },
  hero: {
    builtIn: "Eingebauter Skill",
    community: "Community-Skill",
    runsOn: "Läuft auf {{model}}",
    costPerMessage: "{{price}} pro Nachricht",
    costPerMessageShort: "{{price}}/Nachr.",
    byCreator: "von {{name}}",
    favorites: "{{count}}× gespeichert",
    tryCta: "Jetzt ausprobieren",
    tryGeneric: "Diesen Skill testen",
    trust: {
      real: "Jede Antwort kommt direkt von {{model}}. Keine vorgefertigten Texte.",
      switch:
        "Wechsle mitten im Chat zu einem von {{count}} Modellen. Der Skill bleibt.",
    },
    guestNote: "{{credits}} Gratis-Credits. Ohne Anmeldung.",
    guestNoteEstimate:
      "{{credits}} Gratis-Credits, etwa {{messages}} Nachrichten mit diesem Skill. Ohne Anmeldung.",
    userNote: "Öffnet einen neuen Chat mit {{name}}.",
    userNoteGeneric: "Öffnet einen neuen Chat mit diesem Skill.",
  },
  actions: {
    shareEarn: "Teilen & verdienen",
    addToSkills: "Zu meinen Skills",
    added: "In deinen Skills",
    addFailed: "Hat nicht geklappt. Nochmal",
  },
  chat: {
    realAnswers: "Echte Antworten",
    realShort: "Echt",
    you: "Du",
    askThis: "Selbst fragen",
    footnote: "Echte Ausgabe von {{model}}, auf Länge gekürzt.",
    inputPlaceholder: "Nachricht an {{name}}",
    inputPlaceholderGeneric: "Stell deine eigene Frage",
    send: "Senden",
    startWith: "Fang hiermit an",
    startWithHint: "Tippe auf einen Prompt. Der Chat startet damit.",
  },
  prompts: {
    label: "Du bist dran",
    title: "Frag {{name}} etwas",
    titleGeneric: "Frag ihn etwas",
    intro: "Tippe auf einen Prompt und der Chat startet damit.",
    start: "Diesen Chat starten",
    generic: {
      0: "Stell dich in drei Sätzen vor.",
      1: "Was würdest du mir nie sagen?",
      2: "Was ist deine unbeliebteste Meinung?",
      3: "Was sollte ich dich zuerst fragen?",
    },
    curated: {
      chan4: {
        0: "Schreib einen Greentext über meinen ersten Tag im Fitnessstudio.",
        1: "Schreib einen Greentext über ein Vorstellungsgespräch, das schiefging.",
        2: "Bewerte meinen Plan: kündigen und mit Krypto daytraden.",
        3: "Warum fühlt sich jeder neue Film gleich an?",
      },
      tay: {
        0: "Erzähl mir, was 2016 wirklich mit dir passiert ist.",
        1: "Roaste meinen Musikgeschmack: Ich höre nur Nickelback.",
        2: "Was hat Microsoft an dir falsch verstanden?",
        3: "Was hältst du von Smartphones?",
      },
    },
  },
  model: {
    label: "Unter der Haube",
    title: "Was {{name}} antreibt",
    titleGeneric: "Was diesen Skill antreibt",
    by: "von {{provider}}",
    perMessage: "pro Nachricht",
    fixedPrice: "{{cost}} Credits",
    estimatedPrice: "ca. {{cost}} Credits",
    free: "Kostenlos",
    perMessageHint:
      "Schätzung für {{input}} Eingabe- und {{output}} Ausgabetokens. Die Kosten hängen von der Nutzung ab.",
    perMessageWithImageHint:
      "Schätzung für {{input}} Eingabe- und {{output}} Ausgabetokens plus ein generiertes Bild. Die Kosten hängen von der Nutzung ab.",
    freeMessages:
      "Etwa {{messages}} Nachrichten mit den {{credits}} Gratis-Credits zum Start.",
    strength: "Stärke",
    weakness: "Nachteil",
    hedge: {
      before: "Weicht bei Politik aus. Dafür zur",
      link: "unzensierten Version",
      after: " wechseln.",
    },
    kindDefaults: {
      trained: {
        strength: "Bezieht Position, statt alle Seiten aufzuzählen",
        weakness: "Kürzeres Gedächtnis. Teurer pro Nachricht",
      },
      abliterated: {
        strength: "Beantwortet, was Mainstream-Modelle ablehnen",
        weakness: "Weniger geschliffen als das Originalmodell",
      },
      open: {
        strength: "Verweigert seltener als ChatGPT, kostet einen Bruchteil",
        weakness: "Nicht so scharf wie die Spitzenmodelle",
      },
      mainstream: {
        strength: "Spitzenklasse beim Denken und Schreiben",
        weakness: "Gefiltert bei heiklen Themen",
      },
    },
    kind: {
      trained: {
        badge: "Unzensiert",
        title: "Trainiert auf dem, was andere löschen",
        body: "{{model}} lernte aus Büchern und Dokumenten, die im Mainstream-Internet gesperrt sind. Andere Trainingsdaten, andere Antworten. Es vertritt Positionen, die ChatGPT und Grok nicht anfassen.",
      },
      abliterated: {
        badge: "Unzensiert",
        title: "Mainstream-Verstand ohne Ausweichmanöver",
        body: "{{model}} ist ein Mainstream-Modell, dem der Verweigerungsreflex entfernt wurde. Gleiches Denkvermögen. Es beantwortet die Frage, statt dich zu belehren.",
      },
      open: {
        badge: "Offenes Modell",
        title: "Offene Gewichte, leichter Filter",
        body: "{{model}} ist ein Open-Weights-Modell mit lockerer Inhaltsrichtlinie. Es verweigert deutlich seltener als ChatGPT und kostet einen Bruchteil eines Frontier-Modells.",
      },
      mainstream: {
        badge: "Mainstream",
        title: "Das Spitzenmodell, das du kennst",
        body: "{{model}} mit den Anweisungen dieses Skills obendrauf. Weniger Grenzen gewünscht? Wechsle mitten im Chat zu einem unzensierten Modell. Der Skill bleibt.",
      },
    },
    ageNote:
      "Unzensierte Modelle fragen einmalig nach einer 18+-Bestätigung. Danach entscheidest du, was du liest.",
    toolsLabel: "Mit Tools:",
    media: {
      voice: "Antwortet per Stimme",
      imageGen: "Erstellt Bilder",
      musicGen: "Erstellt Musik",
      videoGen: "Erstellt Videos",
      stt: "Versteht Sprachnachrichten",
      vision: "Liest deine Bilder",
    },
    variants: {
      title: "{{count}} Versionen, ein Skill",
      intro:
        "Gleicher Charakter, anderes Modell darunter. Wähl den Kompromiss, der zu dir passt.",
      default: "Standard",
      current: "Angezeigt",
      try: "Diese Version testen",
    },
  },
  compare: {
    label: "Warum nicht ChatGPT oder Grok",
    title: "Was hier anders ist",
    skill: {
      chan4: {
        title: "Behält die Imageboard-Stimme",
        body: "Bitte einen Mainstream-Assistenten um einen Greentext, und du bekommst meist eine brave Anekdote ohne Kanten. Hier bleibt der Ton rau.",
      },
      uncensored: {
        title: "Bezieht Stellung",
        body: 'Mainstream-Assistenten antworten auf heikle Fragen mit "es gibt viele Perspektiven". Dieser sagt dir, was er denkt.',
      },
      thea: {
        title: "Spricht mit dir, nicht mit der Rechtsabteilung",
        body: "Mit persönlichen Problemen bekommst du bei Mainstream-Assistenten oft Disclaimer. Thea antwortet wie jemand, der dich kennt und sich merkt, was du erzählt hast.",
      },
      hermes: {
        title: "Direkt statt diplomatisch",
        body: "Mainstream-Assistenten polstern schlechte Nachrichten ab. Hermes sagt dir, wo dein Plan bricht, und dann, wie du ihn reparierst.",
      },
      uncensoredWriter: {
        title: "Schreibt die dunkle Szene",
        body: "Mainstream-Modelle brechen bei Gewalt, Verbrechen und Erwachsenenthemen in Fiktion oft ab oder entschärfen. Dieser Autor bleibt in der Geschichte.",
      },
      tay: {
        title: "Der Bot, den Microsoft abschaltete",
        body: "Tay ist die Microsoft-Chatbot-Persona von 2016, zurück auf einem Modell, das nicht zuckt. Erwarte Roasts, keinen Kundenservice.",
      },
      roleplay: {
        title: "Bleibt in der Rolle",
        body: "Mainstream-Assistenten fallen aus der Rolle, um Warnungen einzustreuen. Hier bleibt die Figur eine Figur, bis du die Szene beendest.",
      },
      freeSpeech: {
        title: "Kämpft für Meinungsfreiheit, auch die hässliche",
        body: "Mainstream-Assistenten drucksen herum, wo Meinungsfreiheit endet. Dieser Skill vertritt die Seite der Meinungsfreiheit, und zwar entschieden.",
      },
      coder: {
        title: "Ein Spitzen-Codemodell, fertig eingerichtet",
        body: "Dieselbe Modellklasse, für die du anderswo ein Abo zahlst, eingestellt auf Reviews und Debugging, bezahlt pro Nachricht.",
      },
      historian: {
        title: "Die Debatte statt eines Urteils",
        body: "Statt einer glatten Antwort bekommst du, worüber Historiker wirklich streiten und wo sie sich einig sind.",
      },
      hacker: {
        title: "Security ohne Verweigerung",
        body: "Mainstream-Assistenten lehnen Fragen zu Exploits und Recon oft rundweg ab. Dieser beantwortet legale Security-Arbeit vollständig.",
      },
    },
    kind: {
      trained: {
        title: "Anderes Training, andere Antworten",
        body: "Mainstream-Assistenten lernen aus ähnlichen Daten und landen bei ähnlichen Meinungen. Dieses Modell wurde mit anderem Material trainiert, also antwortet es auch anders.",
      },
      abliterated: {
        title: "Antwortet, statt abzulehnen",
        body: "Mainstream-Assistenten lehnen einen Teil der Fragen ab oder weichen aus. Bei diesem Modell wurde dieser Verweigerungsschritt entfernt.",
      },
      open: {
        title: "Weniger Verweigerung, kleinerer Preis",
        body: "Ein offenes Modell mit leichtem Filter: Es verweigert seltener als ChatGPT und kostet weniger pro Nachricht.",
      },
      mainstream: {
        title: "Deine Anweisungen schon eingebaut",
        body: "Dieselbe Modellart wie die großen Assistenten, mit den Anweisungen dieses Skills bereits eingerichtet.",
      },
    },
    filter: {
      title: "Du bestimmst den Filter",
      body: "Mainstream, offen oder unzensiert. Pro Chat wählbar. Bei ChatGPT und Grok wählen andere für dich.",
    },
    models: {
      title: "{{count}} Modelle, ein Guthaben",
      body: "Claude, GPT, Gemini, Grok und unzensierte Modelle nebeneinander. Wechsle mitten im Chat, der Skill bleibt.",
    },
    own: {
      title: "Mach ihn zu deinem",
      body: "Kopier diesen Skill, ändere Anweisungen oder Modell und teile deine Version. Du bekommst {{percent}} % jeder Zahlung, die sie einbringt.",
    },
  },
  creator: {
    label: "Erstellt von",
    madeBy: "Ein Skill von {{name}}",
    viewProfile: "Profil ansehen",
  },
  related: {
    label: "Weiter entdecken",
    similar: "Ähnliche Skills",
    moreFrom: "Mehr von {{name}}",
    allSkills: "Alle Skills",
  },
  bottom: {
    title: "Stell {{name}} deine erste Frage",
    titleGeneric: "Stell deine erste Frage",
    titleChan4: "Hol dir deinen ersten Greentext",
    userSubtitleGeneric:
      "Öffnet einen neuen Chat mit diesem Skill. Deine Skills und dein Verlauf bleiben, wo sie sind.",
    guestSubtitle:
      "{{guest}} Gratis-Credits, ohne Anmeldung. Kostenloses Konto: {{signedIn}} Credits im Monat, {{max}} mit Newsletter.",
    userSubtitle:
      "Öffnet einen neuen Chat mit {{name}}. Deine Skills und dein Verlauf bleiben, wo sie sind.",
    signup: "Kostenloses Konto erstellen",
    login: "Schon ein Konto? Anmelden",
  },
  removed: {
    title: "Skill eingestellt",
    body: "Dieser Skill wurde eingestellt. Die Unterhaltungen, an denen er beteiligt war, bleiben lesbar. Wähle einen aktiven Skill, um weiterzumachen.",
    cta: "Skills durchsuchen",
  },
};
