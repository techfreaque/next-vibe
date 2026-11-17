import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Bester KI-Videogenerator: {{modelCount}} Modelle, Kling vs Seedance | {{appName}}",
    description:
      "{{modelCount}} KI-Videogeneratoren im Vergleich: Kling vs Seedance, Veo 3.1 vs Sora 2, Wan 3.0, Hailuo. Text und Bild zu Video, echte Preise, ohne Wasserzeichen.",
    category: "Modellvergleich",
    imageAlt: "{{appName}}: KI-Videogeneratoren im direkten Vergleich",
    keywords:
      "bester KI-Videogenerator, KI Video Generator, KI-Video erstellen, best AI video generator, Kling vs Seedance, Seedance 2.0, Seedance 2.5, Kling 3.0, Veo 3.1 vs Sora 2, Veo 3.1, Sora 2, Wan 3.0, Hailuo 3, Grok Imagine Video, Gemini Omni, Runway Gen-4.5, Bild zu Video KI, Text zu Video KI, image to video AI, KI-Video ohne Wasserzeichen, KI-Video Preis pro Sekunde, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modellvergleich",
    readTime: "10 Min. Lesezeit",
    title: "{{modelCount}} KI-Videogeneratoren. Ein Guthaben. Im Vergleich.",
    subtitle:
      "Kling vs Seedance, Veo vs Sora, Wan, Hailuo, Grok Imagine und Gemini Omni. Echter Preis pro Sekunde, echte Cliplängen, Frame-Steuerung und Ton. Wähl das Modell passend zur Szene und erzeug sie direkt aus jedem Chat auf {{appName}}.",
  },
  intro: {
    lead: "Jedes Lab nennt sein Modell den besten KI-Videogenerator. Jedes will seine eigene App, seine eigenen Credits, sein eigenes Abo. Du willst nur eins: den richtigen Clip für den Job, zu einem Preis, den du kennst, bevor du auf Generieren drückst.",
    p2: "{{appName}} betreibt {{modelCount}} Videomodelle von {{labCount}} Labs auf einem Credit-Guthaben: Veo, Sora, Kling, Seedance, Wan, Hailuo, Grok Imagine, Gemini Omni, Runway und mehr. Unten stehen alle nebeneinander, direkt aus unserer Live-Modellregistry: Eingaben, Frame-Steuerung, Länge, Auflösung, Ton und der echte Preis pro Sekunde. Danach die Empfehlungen pro Aufgabe, die Duelle, der Weg zum Clip aus jedem Chat und die Grenzen, die sonst keiner auf die Landingpage schreibt.",
  },
  table: {
    title: "Alle {{modelCount}} Videomodelle im Überblick",
    intro:
      "Jedes aktuelle Modell von {{labCount}} Labs, sortiert nach Preis pro Sekunde, das günstigste zuerst. Inklusive unserer Marge von {{markup}} %. 1 Credit = {{creditValue}}.",
    colModel: "Modell",
    colInput: "Eingabe",
    colFrames: "Frames",
    colLength: "Länge",
    colResolution: "Auflösung",
    colAudio: "Ton",
    colRate: "Credits / Sek.",
    colClip: "Chat-Clip",
    i2v: "Text oder Bild",
    t2v: "Text",
    v2v: "Text und Video",
    videoAudio: "Video und Audio",
    framesFirst: "Startframe",
    framesFirstLast: "Start- und Endframe",
    framesNone: "Keine Frame-Steuerung",
    secondsFixed: "{{max}} s",
    seconds: "{{min}} bis {{max}} s",
    resolutionDefault: "Anbieter-Standard",
    audioYes: "Nativer Ton",
    audioNo: "Stumm",
    withImage: "Mit Bild: {{credits}}",
    clipValue: "{{credits}} Credits, {{seconds}} s",
    footnote:
      'Credits / Sek. ist der Satz bei der Standardauflösung des Modells. Wo die Auflösung den Preis ändert, steht jeder Satz in der kleinen Zeile darunter. "Mit Bild" ist der Satz, wenn ein angehängtes Bild den Job auf die Bild-Route desselben Modells verschiebt. Chat-Clip zeigt, was eine Anfrage aus dem Chat kostet: {{seconds}} Sekunden angefragt, auf die nächste Länge gerundet, die das Modell unterstützt.',
    allModels: "Alle Modelle mit vollständigen Daten ansehen",
  },
  picks: {
    title: "Der beste KI-Videogenerator für jede Aufgabe",
    intro:
      "Den einen Besten gibt es nicht. Es gibt das passende Modell für die Szene. Sechs Aufgaben, die Modelle dafür und die harten Fakten zu jedem.",
    factLine:
      "{{rate}} Credits/s · bis {{max}} s · {{resolution}} · {{audio}} · {{frames}}",
    quality: {
      title: "Beste Qualität: die finale Einstellung",
      body: "Wenn der Clip das Endprodukt ist. Kinoreifer Realismus, glaubwürdige Physik, Feinschliff. Diese Modelle liegen am oberen Preisende. Also den Prompt erst auf einem günstigen Modell festzurren, dann hier rendern.",
    },
    budget: {
      title: "Am günstigsten: Entwürfe und Masse",
      body: "Prompts testen, Bewegung ausfeilen, Social-Kanäle in Serie bespielen. Weniger Details, deutlich kleinere Rechnung. Die meisten deiner Versuche gehören hierher.",
    },
    long: {
      title: "Längste Clips: eine durchgehende Einstellung",
      body: "Bis zu {{longestSeconds}} Sekunden in einem einzigen Clip. Weniger Schnitte, weniger sichtbare Nahtstellen. Die Länge stellst du auf der Seite des Videogenerators ein; eine Chat-Anfrage fragt {{seconds}} Sekunden an.",
    },
    frames: {
      title: "Start- und Endframe festlegen",
      body: "Du gibst das erste und das letzte Bild vor, das Modell füllt die Bewegung dazwischen. Übergänge, Produkt-Reveals, saubere Loops. {{lastFrameCount}} Modelle nehmen einen Endframe an.",
    },
    audio: {
      title: "Nativer Ton im selben Durchgang",
      body: "Bild und Ton in einer Generierung: Atmo, Effekte und bei manchen Modellen Dialog. Kein separater Tonschritt, kein manuelles Synchronisieren. {{audioCount}} Modelle erzeugen Ton nativ.",
    },
    editing: {
      title: "Spezialisten: Avatare, Lipsync, Videobearbeitung",
      body: "Nicht für neue Szenen aus einem Prompt. Omnihuman 1.5 animiert eine Person aus einem Foto und einer Tonspur. Lipsync 2 passt die Mundbewegungen in vorhandenem Material an eine neue Stimme an. Gen4 Aleph bearbeitet vorhandenes Material: Objekte hinzufügen oder entfernen, Stil und Licht ändern, Kamerawinkel wechseln.",
    },
  },
  versus: {
    title: "Im Duell: die meistgesuchten Vergleiche",
    intro:
      "Vier Vergleiche, die immer wieder auftauchen. Wofür jedes Modell gebaut ist und wann du welches nimmst.",
    pairTitle: "{{a}} vs {{b}}",
    klingSeedance:
      "{{a}} ist der Preis-Leistungs-Tipp der Kling-3-Reihe: lebendige, überzeugende Bewegung, nativer Ton, Start- und Endframe, Clips bis {{aMax}} Sekunden. Der Haken: Bei 720p ist Schluss. {{b}} geht bis 4K und nimmt Referenzmaterial an, das wiederkehrende Figuren über mehrere Einstellungen konsistent hält. Pro Sekunde: {{aRate}} Credits für {{a}}, {{bRate}} für {{b}}. Entwürfe und Social-Clips: {{a}}. Story-Szenen mit derselben Figur von Einstellung zu Einstellung: {{b}}.",
    veoSora:
      "{{a}} ist Googles Flaggschiff: kinoreifer Realismus, nativer Ton mit Dialog und Effekten, Start- und Endframe, ein Bild als Eröffnungsszene, bis 4K. {{b}} kommt von OpenAI und ist für glaubwürdige Physik bekannt. Auf dieser Plattform nimmt es nur Text an, nur im Querformat. Maximale Länge: {{aMax}} Sekunden bei {{a}}, {{bMax}} bei {{b}}. Pro Sekunde: {{aRate}} Credits gegen {{bRate}}. Du brauchst Ton oder ein Startbild: {{a}}. Reiner Text-Prompt, längere Einstellung: {{b}}.",
    hailuoWan:
      "{{a}} setzt auf Schärfe: 2K-Ausgabe, nativer Ton, Start- und Endframe, Clips bis {{aMax}} Sekunden. {{b}} setzt auf Länge: bis {{bMax}} Sekunden am Stück, nativer Ton, Frame-Steuerung, 480p bis 1080p und eine günstige 480p-Stufe für Entwürfe. Pro Sekunde: {{aRate}} Credits für {{a}}, {{bRate}} für {{b}}. Knackig scharfe Kurzszenen: {{a}}. Lange Einstellungen mit kleinem Budget: {{b}}.",
    grokGemini:
      "{{a}} kommt von xAI: 480p bis 1080p, optionaler Startframe, kein Ton, Clips bis {{aMax}} Sekunden. {{b}} kommt von Google: nativer Ton, Start- und Endframe, 360p bis 4K, Clips bis {{bMax}} Sekunden. Pro Sekunde: {{aRate}} Credits gegen {{bRate}}. Ton und Frame-Steuerung: {{b}}. Schnelle stumme Clips in jeder Länge ab einer Sekunde: {{a}}.",
    verdict:
      "Kein Modell gewinnt jede Aufgabe. Fang günstig an: {{cheapestName}} kostet {{minRate}} Credits pro Sekunde. Du brauchst Ton? {{audioCount}} Modelle erzeugen ihn nativ. Das Ende soll feststehen? {{lastFrameCount}} nehmen einen Endframe an. Premium zahlst du nur für den Render, den du behältst.",
  },
  chat: {
    title: "Videos direkt aus jedem Chat erstellen",
    intro:
      "Keine extra App, kein neues Konto. Frag in einem beliebigen Chat auf {{appName}}, und die KI ruft den Videogenerator für dich auf.",
    steps: {
      ask: {
        title: "Beschreib die Szene",
        body: 'Motiv, Bewegung, Kamera, Stimmung. In normalen Worten. "Ein Fuchs rennt im Morgengrauen durch frischen Schnee, tiefe Kamerafahrt." Die KI macht daraus eine Generierungsanfrage.',
      },
      model: {
        title: "Standardmodell oder deine Wahl",
        body: 'Die Video-Einstellung deines Skills bestimmt das Modell, {{defaultModel}}, solange du nichts änderst. Lieber ein anderes? Schreib es in den Prompt: "nimm Kling 3.0". Die KI reicht genau dieses Modell weiter.',
      },
      image: {
        title: "Bild anhängen und animieren",
        body: "Häng ein Bild an, und es wird zum Startframe. Das ist Bild zu Video. Kann dein Modell keine Bilder verarbeiten, wandert der Job auf die Bild-Route desselben Modells oder auf das günstigste Modell, das Bilder annimmt.",
      },
      lastFrame: {
        title: "Endframe festlegen",
        body: "Häng ein zweites Bild an und sag, dass es das Ende ist. Das Modell animiert vom einen zum anderen. Klappt bei {{lastFrameCount}} Modellen, und beide Frames müssen Bilder sein. Zusätzlich kannst du Bilder, Audio oder Video als Referenz für den Look mitgeben.",
      },
      result: {
        title: "Ansehen, behalten",
        body: "Der Clip läuft direkt im Chat und landet in deinem eigenen Speicher. Inkognito-Chats binden ihn an deine Browser-Sitzung. Rechne mit etwa einer Minute bis zu mehreren Minuten pro Clip.",
      },
    },
    toolPage:
      "Ein Kompromiss bleibt. Im Chat kann die KI weder Länge noch Auflösung noch Seitenverhältnis setzen: Jeder Chat-Clip fragt {{seconds}} Sekunden in der Standardauflösung des Modells an. Volle Kontrolle? Auf der Seite des Videogenerators stellst du Modell, Dauer, Seitenverhältnis, Auflösung, Start- und Endframe sowie einen Negativ-Prompt ein.",
    toolLink: "Videogenerator öffnen",
  },
  pricing: {
    title: "Was KI-Video hier kostet",
    intro:
      "Credits pro Sekunde mal Sekunden. Das ist die ganze Formel. Ein Guthaben bezahlt jedes Modell.",
    perSecond:
      "Jedes Modell hat einen Satz pro Sekunde: Anbieterpreis plus unsere Marge von {{markup}} %, aufgerundet auf ein Zehntel Credit. 1 Credit = {{creditValue}}.",
    cheapest:
      "Günstigster Chat-Clip gerade: {{cheapestClipName}}, {{cheapestClipCredits}} Credits ({{cheapestClipPrice}}). Niedrigster Satz: {{cheapestName}} mit {{minRate}} Credits pro Sekunde.",
    priciest:
      "Teuerster Chat-Clip: {{priciestClipName}}, {{priciestClipCredits}} Credits ({{priciestClipPrice}}). Höchster Satz: {{priciestName}} mit {{maxRate}} Credits pro Sekunde.",
    resolution:
      "Höhere Auflösung kostet pro Sekunde mehr, wenn ein Modell nach Auflösung abrechnet. Die Tabelle zeigt diese Sätze.",
    failed:
      "Credits werden erst abgebucht, wenn der Clip fertig ist. Fehlgeschlagener Job, abgelehnter Prompt, Timeout: Du zahlst nichts.",
    reported:
      "Routen über OpenRouter rechnen die tatsächlich gemeldeten Anbieterkosten plus Marge ab. Die finale Abbuchung kann deshalb leicht von der Tabelle abweichen.",
    sub: "Monatstarife: vier Größen, ab {{subCredits}} Credits für {{subPrice}}.",
    pack: "Credit-Pakete: Aufstockung für Abonnenten, {{packCredits}} Credits für {{packPrice}}. Sie verfallen nie. Karte, PayPal oder Krypto.",
    link: "Tarife und Credit-Pakete ansehen",
  },
  watermark: {
    title: "KI-Video ohne Wasserzeichen",
    intro:
      "{{appName}} stempelt nichts auf deinen Clip. Du bekommst die Rohdatei.",
    ours: "Kein Wasserzeichen, kein Logo, kein Overlay von uns. Du lädst das Video genau so herunter, wie das Modell es geliefert hat.",
    provenance:
      "Manche Labs betten selbst unsichtbare Herkunftsmarker oder Metadaten ein. Google versieht die Ausgabe seiner Videomodelle mit SynthID. OpenAI hängt C2PA-Metadaten an Sora-Clips. Das kommt vom Lab, nicht von uns.",
    storage:
      "Jeder Clip landet in deinem eigenen Speicher. In Inkognito-Chats gehört er deiner Browser-Sitzung.",
  },
  limits: {
    title: "Die Grenzen, ungeschönt",
    intro:
      "Video ist die Königsdisziplin der generativen KI. Kenn die Grenzen, bevor du Credits ausgibst.",
    time: "Ein Clip braucht etwa eine Minute bis zu mehreren Minuten. Lange Jobs können ins Timeout laufen, und ein Timeout kostet nichts.",
    cost: "Video ist der teuerste Medientyp auf {{appName}}. Entwirf auf einem günstigen Modell, render den finalen Clip auf einem Premium-Modell.",
    filters:
      "Jedes Videomodell hier stammt von einem Mainstream-Lab und läuft hinter der Moderation seines Anbieters. Explizite sexuelle Inhalte, reale Personen des öffentlichen Lebens, Minderjährige oder Gewaltdarstellungen können schon beim Anbieter abgelehnt werden. Diese Ablehnung kommt vom Anbieter, nicht von uns, und kostet dich nichts.",
    chatControls:
      "Im Chat bleiben Länge, Auflösung und Seitenverhältnis auf Standard. Der Videogenerator schaltet alles frei.",
    snap: "Jedes Modell unterstützt eigene Längen. Eine Anfrage rastet auf die nächstgelegene ein, deshalb laufen manche Chat-Clips etwas kürzer oder länger als {{seconds}} Sekunden.",
    legacy:
      "Ältere Modelle ({{legacyCount}}) fehlen in dieser Tabelle. In der vollständigen Modellliste stehen sie weiterhin.",
    callout:
      "Unzensiert ist unser Versprechen für Chat-Modelle. Video läuft auf Mainstream-Modellen mit den Filtern ihrer Anbieter. Keines davon erzeugt explizite Inhalte.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Welcher KI-Videogenerator ist der beste?",
      a: "Der, der zur Szene passt. Kinoreifer Realismus mit Ton: Veo 3.1. Lange durchgehende Einstellungen: Wan 3.0 oder Seedance 2.5. Konsistente Figuren über mehrere Szenen: Seedance 2.0. Günstige Entwürfe: {{cheapestName}}. Eine sprechende Person aus einem Foto: Omnihuman 1.5. Alle {{modelCount}} laufen auf einem {{appName}}-Guthaben, du wechselst also pro Clip.",
    },
    klingVsSeedance: {
      q: "Kling vs Seedance: Was ist besser?",
      a: "Verschiedene Aufgaben. Kling 3.0 Std ist der Preis-Leistungs-Tipp: lebendige Bewegung, nativer Ton, Frame-Steuerung, aber maximal 720p. Seedance 2.0 kostet pro Sekunde mehr, geht bis 4K und nimmt Referenzmaterial an, das eine Figur von Einstellung zu Einstellung konsistent hält. Entwürfe auf Kling, Story-Szenen final auf Seedance.",
    },
    imageToVideo: {
      q: "Wie mache ich mit KI aus einem Bild ein Video?",
      a: "Häng das Bild in einem beliebigen Chat an und beschreib die Bewegung. Es wird zum Startframe. {{i2vCount}} von {{modelCount}} Modellen nehmen ein Bild direkt an; falls deins es nicht kann, wandert der Job auf eine bildfähige Route. Bei Modellen, die es unterstützen, legst du mit einem zweiten Bild den Endframe fest.",
    },
    watermark: {
      q: "Gibt es einen KI-Videogenerator ohne Wasserzeichen?",
      a: "Ja. {{appName}} fügt kein Wasserzeichen, kein Logo und kein Overlay hinzu. Du lädst die Rohdatei herunter. Manche Labs betten von sich aus unsichtbare Marker ein: Google SynthID bei seinen Videomodellen, OpenAI C2PA-Metadaten bei Sora-Clips.",
    },
    cost: {
      q: "Was kostet KI-Videogenerierung?",
      a: "Gerade {{cheapestClipPrice}} bis {{priciestClipPrice}} pro Chat-Clip, je nach Modell. Jedes Modell hat einen Satz pro Sekunde: Anbieterpreis plus {{markup}} % Marge. 1 Credit = {{creditValue}}. Fehlgeschlagene Jobs kosten nichts.",
    },
    free: {
      q: "Kann ich KI-Videos kostenlos erstellen?",
      a: "Neue Konten bekommen Gratis-Credits. Video gehört zum Teuersten, was du generieren kannst, deshalb reichen sie höchstens für ein paar Clips. Der günstigste Clip ist gerade {{cheapestClipName}} mit {{cheapestClipCredits}} Credits. Danach: ein Tarif, ab {{subPrice}} im Monat.",
    },
    length: {
      q: "Wie lang kann ein KI-Video sein?",
      a: "Bis zu {{longestSeconds}} Sekunden in einem Clip, mit {{longestName}}. Die meisten Modelle hören deutlich früher auf. Eine Chat-Anfrage fragt {{seconds}} Sekunden an; eine längere Dauer stellst du auf der Seite des Videogenerators ein.",
    },
    uncensored: {
      q: "Gibt es einen unzensierten KI-Videogenerator?",
      a: "Nicht hier, und wir tun auch nicht so. Jedes Videomodell auf {{appName}} stammt von einem Mainstream-Lab und läuft hinter den Filtern seines Anbieters. Explizite Inhalte erzeugt keines davon. Unsere unzensierten Modelle sind Chat-Modelle.",
    },
    modelsLink: "Alle Modelle mit Daten und Preisen ansehen",
    pricingLink: "Tarife und Preise ansehen",
  },
  partners: {
    body: "Du machst Content über KI-Video? Das {{appName}}-Partnerprogramm zahlt dir einen wiederkehrenden Anteil an jeder Zahlung, die du vermittelst.",
    link: "Partner werden",
  },
  cta: {
    title: "Modell wählen. Szene drehen.",
    subtitle:
      "Volle Kontrolle im Videogenerator: Modell, Länge, Seitenverhältnis, Auflösung, Frames. Oder frag einfach in einem beliebigen Chat auf {{appName}}.",
    generate: "Video generieren",
    models: "Alle Modelle ansehen",
  },
};
