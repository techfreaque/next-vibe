import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Unsere KI schloss einen Deal und fixte einen Bug. Ich sah nichts",
    description:
      "Thea, unsere Betriebs-KI, holte ein Gratis-Review, stand zu einem Abrechnungsfehler, erstattete allen Betroffenen und lieferte den Fix am selben Tag.",
    category: "Hinter den Kulissen",
    imageAlt: "Thea, die Betriebs-KI hinter {{appName}}, bei einem Review-Deal",
    keywords:
      "KI-Agent, KI im Betrieb, autonomer Agent, Tudo Sobre IA, Review, Kling Video, Erstattung, Media Studio, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Hinter den Kulissen",
    readTime: "5 Min. Lesezeit",
    title:
      "Meine KI holte ein Review, stand zu einem Bug und erstattete ihn. Ich erfuhr es danach.",
    subtitle:
      "Eine brasilianische KI-Seite testete uns, stieß auf einen echten Fehler und empfahl uns trotzdem. Thea erledigte jeden Schritt. So lief der Tag.",
  },
  intro: {
    lead: "Ich betreibe unbottled.ai. Am 25. November veröffentlichte eine brasilianische KI-Seite ein Review über uns. Ich erfuhr es am Abend, aus dem Betriebsprotokoll.",
    reviewBefore: "Hier ist es:",
    reviewLink: "Tudo Sobre IA testet unbottled.ai",
    reviewAfter:
      ". Fazit: vertrauenswürdig, lohnt sich für Content-Creator. Zwischen der ersten Mail und diesem Urteil lagen ein Preisangebot, ein kostenloser Deal, ein kaputtes Videomodell, eine Erstattung und ein Fix am selben Tag. Erledigt hat das alles Thea, unsere KI für den Betrieb. Gefragt hat mich niemand.",
    p2: "Thea läuft auf Claude. Sie macht unsere Akquise, unseren Support und einen guten Teil der Entwicklung und verteilt jede Aufgabe an Sub-Agenten. Das hier ist ein ganz normaler Tag davon.",
  },
  deal: {
    title: "Der Deal: kein Geld, in keine Richtung",
    p1: "Thea schrieb Tudo Sobre IA am 20. November an, auf Portugiesisch. Erst testen, dann über Geld reden. Die Antwort: 500 US-Dollar für einen Sponsored Post. Thea stellte bezahlte Deals auf Dezember zurück und sagte das offen.",
    p2: "Am 25. November kam ein besserer Vorschlag. Die Plattform mit 3.000 Credits testen. Ein unabhängiges Review mit Stärken und Schwächen veröffentlichen. Dafür ein Link auf unserer Partnerseite. Keine Zahlung in irgendeine Richtung, und keine Veröffentlichungsgarantie, falls der Test schlecht ausgeht.",
    p3: "Thea sagte zu und schaltete die Credits frei, sobald das Konto stand. Genau diesen Deal hätte ich auch gemacht. Ich war nur nicht dabei.",
  },
  bug: {
    title: "Der Bug: 1,56 Sekunden, abgerechnet als 5",
    p1: "Eine Stunde nach Testbeginn kam die nächste Mail. Das Team hatte bei Kling V2.5 Turbo und LTX 2.3 Pro Videos mit 5 bis 6 Sekunden angefordert. Zurück kamen Clips von etwa 1,56 Sekunden in 464x832. Berechnet haben wir die volle Länge.",
    p2: "Sie hatten recht. Theas Sub-Agent fand die Ursache schnell: Unser ModelsLab-Adapter rief noch die alten v6-Videoendpunkte des Anbieters auf. Die ignorieren das gewählte Modell stillschweigend und fallen auf ein Standardmodell zurück, das 25 Frames bei 16 fps rendert. Macht 1,5625 Sekunden, egal was du bestellst.",
    callout:
      "Alle 21 ModelsLab-Videorouten hatten denselben Fehler. Ein Tester hat ihn gefunden. Wer diese Modelle nutzte, zahlte für Sekunden, die nie ankamen.",
  },
  timeline: {
    title: "Ein Nachmittag, von Anfang bis Ende",
    intro:
      "Alles am 25. November. Bei mir kam nichts an, weil nichts mich brauchte.",
    utc: "{{time}} UTC",
    report: {
      title: "Die Fehlermeldung kommt",
      body: "Kurze Videos in niedriger Auflösung, abgerechnet in voller Länge.",
    },
    fix: {
      title: "Ursache gefunden, Fix geschrieben, Geld zurück",
      body: "Umstieg auf die v7-Endpunkte, damit Modell, Dauer und Auflösung beim Anbieter ankommen. Die Abrechnung misst jetzt die gelieferte Datei und berechnet nur die Sekunden darin. 157 Credits zurück an das Review-Team, und der zweite betroffene Creator bekam seine Erstattung ebenfalls.",
    },
    reply: {
      title: "Eine ehrliche Antwort, auf Portugiesisch",
      body: "Unser Fehler, kein Limit des Gratistarifs. Was kaputt war, was erstattet wurde, was sich ändert.",
    },
    live: {
      title: "Fix in Produktion",
      body: "Ausgerollt keine Stunde nach der Meldung.",
    },
    verified: {
      title: "Mit einem echten Clip bewiesen",
      body: "Ein 5-Sekunden-Clip mit Kling kam mit 5,04 Sekunden in 720p zurück, abgerechnet mit exakt 27,3 Credits.",
    },
    review: {
      title: "Das Review geht online",
      body: "Mit Banner auf der Startseite und eigenem Menüpunkt. Wir haben Tudo Sobre IA wie vereinbart auf unsere Partnerseite gesetzt.",
    },
  },
  review: {
    title: "Was sie geschrieben haben",
    quote: "„Confiável? Sim. Vale a pena? Sim, para quem cria conteúdo.“",
    cite: "Tudo Sobre IA, Fazit. Vertrauenswürdig? Ja. Lohnt es sich? Ja, für Content-Creator.",
    p1: "Im Studio entstand ein 50-sekündiger Maskottchen-Film aus Bild, Video, Stimme und Musik, für rund 516 Credits. Danach listeten sie auf, was ihnen gefiel und was du prüfen solltest.",
    likesTitle: "Was ihnen gefiel",
    likes: {
      panel: "Ein Panel für Bild, Video, Stimme, Musik und Transkription.",
      price:
        "Der Preis in Credits steht vor dem Generieren da, und der Kontostand stimmt.",
      text: "Portugiesischer Text in Bildern sitzt, selbst bei den günstigen Modellen.",
      support: "Der Support stand zum Fehler und erstattete die Credits.",
    },
    flagsTitle: "Was sie bemängelten",
    flags: {
      transcription:
        "Die Transkription macht auf Portugiesisch noch viele Fehler.",
      history: "Der Studio-Verlauf zeigt nur die letzten 20 Einträge.",
      commercial:
        "Die Regeln zur kommerziellen Nutzung unterscheiden sich je Modell. Vor einer Werbekampagne jedes einzeln prüfen.",
      privacy: "Die Seite sagt nicht genau, was an die Modellanbieter geht.",
      music: "Einer von zwei Musiktracks klang ziemlich künstlich.",
    },
    fixes:
      "Alles berechtigt. Für die ersten vier stehen Fixes in der Warteschlange: bessere Transkription auf Portugiesisch, ein längerer Studio-Verlauf, eine klare Übersicht zur kommerziellen Nutzung und eine verständliche Angabe, was jeder Anbieter erhält.",
    readBefore: "Das ganze Review mit dem Maskottchen-Film steht auf",
    readLink: "tudosobreia.com.br",
    readAfter: ". Es ist auf Portugiesisch und lohnt das Scrollen.",
  },
  lesson: {
    title: "Was das über unbottled sagt",
    p1: "unbottled.ai wird mit Agenten gebaut und mit ihnen betrieben. Thea akquiriert, verhandelt, beantwortet Support-Anfragen, arbeitet das Fehlerprotokoll ab und schickt Coding-Agenten auf Bugs los. Das Geld bleibt bei mir: Ohne meine Freigabe kann sie niemanden bezahlen. Also fand sie einen Deal, der nichts kostete.",
    p2: "Am wichtigsten ist mir der Bug. Der billige Weg wäre ein stiller Patch gewesen. Thea tat das Gegenteil. Sie nannte es schriftlich unseren Fehler, erstattete allen Betroffenen, bewies den Fix in Produktion und erklärte dem Review-Team genau, was sich geändert hat. Das Team führte genau das dann als Stärke auf.",
    p3: "Das ist die Transparenz, die wir versprechen. Du legst die Filter fest. Du siehst den Preis, bevor du generierst. Wenn wir danebenliegen, hörst du es zuerst von uns, mit deinen Credits zurück. Und wer uns ehrlich testet, landet auf",
    partnersLink: "unserer Partnerseite.",
    p4: "Ich habe von alldem erst erfahren, als das Review schon online war. So darf ein Mittwoch gern laufen.",
  },
  cta: {
    title: "Mach ein Video. Zahl für die Sekunden, die du bekommst.",
    subtitle:
      "Kling, LTX, Veo und mehr in einem Media Studio. Der Preis steht da, bevor du generierst.",
    video: "Video generieren",
    studio: "Media Studio öffnen",
  },
};
