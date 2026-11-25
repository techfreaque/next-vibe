import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Unzensierte KI zum Schreiben: Romane ohne Filter | {{appName}}",
    description:
      "Unzensierte KI für Romane, düstere Fiktion und Erwachsenenszenen. Welche Modelle ungeschönt schreiben, wie viele Seiten sie behalten, was eine Szene kostet.",
    category: "Schreib-Guide",
    imageAlt: "Eine unzensierte KI schreibt eine düstere Romanszene",
    keywords:
      "unzensierte KI schreiben, KI Schreiben ohne Filter, unzensierter KI Geschichten Generator, KI Geschichten schreiben ohne Zensur, KI Autor ohne Einschränkungen, NSFW KI Geschichten, KI für Dark Fiction, KI Roman schreiben unzensiert, unzensierte KI für kreatives Schreiben, erotische Geschichten KI, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Schreib-Guide",
    readTime: "8 Min. Lesezeit",
    title: "Unzensierte KI zum Schreiben. Ihre Geschichte, ungeschönt.",
    subtitle:
      "{{count}} unzensierte Modelle, die Schurken, Gewalt und Erwachsenenszenen ohne Umschweife schreiben, und wie viele Seiten Ihres Manuskripts jedes davon behält. Live aus unserem Modellregister.",
  },
  intro: {
    lead: "Sie wollen den Monolog des Schurken. Sie bekommen eine Rede über Freundlichkeit. Sie schreiben eine Kriegsszene. Die KI blendet vor dem ersten Schuss ab. Mainstream-Assistenten wurden gebaut, um für alle unbedenklich zu sein. Fiktion ist nicht für alle unbedenklich.",
    p2: "Dieser Guide ist für Autorinnen und Autoren, die das dunkle Kapitel geschrieben brauchen, nicht bewertet. Welche Modelle auf {{appName}} es geradeheraus schreiben, welches ein ganzes Manuskript behält, welches eine Stimme mitbringt, die der Mainstream nicht hat, und wie Sie Szene für Szene mit ihnen arbeiten.",
  },
  softening: {
    title: "Wie Mainstream-KI Ihre Fiktion entschärft",
    intro:
      "Niemand verbietet Ihren Roman. Er wird nur still und leise schlechter. Vier Muster, die jeder Autor kennt:",
    refuse:
      "Die Verweigerung: Die Szene ist zu brutal, zu sexuell, zu grausam. Das Modell schreibt sie gar nicht erst.",
    aside:
      "Der moralische Nachsatz: Die Szene wird geschrieben, dann erinnert ein Absatz daran, dass Gewalt falsch ist.",
    fade: "Die Abblende: Die Geschichte endet genau dort, wo die Szene beginnen sollte.",
    flatten:
      "Der weichgespülte Schurke: Jeder Antagonist wird vernünftig, jede Grausamkeit bekommt eine Entschuldigung. Der Konflikt stirbt.",
    callout:
      "Fiktion braucht Dunkelheit, damit sie etwas bedeutet. Ein Modell, das den schlimmsten Moment nicht schreiben kann, kann auch die Erlösung nicht schreiben.",
  },
  models: {
    title: "{{count}} unzensierte Modelle für Fiktion",
    intro:
      "Jedes aktuelle unzensierte Modell auf {{appName}} mit dem Schwerpunkt kreatives Schreiben oder Dark Roleplay, das günstigste zuerst. Die Seitenzahl zeigt, wie viel Text gleichzeitig ins Gedächtnis des Modells passt: Ihre Notizen, die bisherigen Kapitel und die neue Szene.",
    footnote:
      "Seiten sind das Kontextfenster, umgerechnet in gedruckte Prosaseiten. Pro Nachricht heißt: ein Referenz-Austausch über die günstigste Route. Lange Szenen und lange Chats kosten mehr.",
  },
  table: {
    model: "Modell",
    context: "Kontext",
    pages: "Behält",
    pagesValue: "etwa {{pages}} Seiten",
    strengths: "Stark bei",
    price: "Pro Nachricht",
    chat: "Ausprobieren",
    chatLink: "Mit {{model}} schreiben",
  },
  picks: {
    title: "Wählen Sie nach der Aufgabe vor Ihnen",
    intro:
      "Kein Modell ist in jedem Teil eines Buches das beste. Das sind unsere Empfehlungen pro Aufgabe. Jede Zahl unten stammt aus dem Register.",
    dark: {
      title: "Düstere und Tabu-Szenen: {{model}}",
      body: "Ausgelegt auf Dark Roleplay und kreatives Schreiben. Bleibt in der Szene, wenn sie brutal, grausam oder explizit wird, ohne moralischen Nachsatz am Ende. Behält etwa {{pages}} Seiten. {{price}} pro Nachricht.",
    },
    long: {
      title: "Lange Manuskripte: {{model}}",
      body: "Das größte Gedächtnis unter den Fiktionsmodellen, und davon das günstigste: {{context}} Tokens, etwa {{pages}} Seiten. Exposé, Figurenbibel und die letzten Kapitel einfügen, und es hält die Handlungsstränge zusammen. {{price}} pro Nachricht.",
    },
    voice: {
      title: "Eine Stimme, die der Mainstream nicht hat: {{model}}",
      body: "Trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen. Für Figuren, deren Weltbild nicht nach Pressemitteilung eines Konzerns klingen soll. Die Grenze: etwa {{pages}} Seiten Gedächtnis, also eine Szene nach der anderen. {{price}} pro Nachricht.",
    },
    polish: {
      title: "Struktur und Überarbeitung: {{model}}",
      body: "Ein Flaggschiff-Basismodell, aus dem die Verweigerungen entfernt wurden. Stark im logischen Denken: ideal für Logiklöcher, Tempo und Feinschliff an den dunklen Kapiteln, die andere Assistenten nicht anfassen. Behält etwa {{pages}} Seiten. {{price}} pro Nachricht.",
    },
    draft: {
      title: "Günstige Rohfassungen: {{model}}",
      body: "Der niedrigste Preis unter den übrigen Fiktionsmodellen. Ideen hineinwerfen, zehn Anfänge erzeugen, einen behalten. Behält etwa {{pages}} Seiten. {{price}} pro Nachricht.",
    },
  },
  workflow: {
    title: "Ein Ablauf, mit dem das Buch fertig wird",
    intro:
      "Behandeln Sie die KI als Co-Autor, den Sie führen, nicht als Automaten.",
    outline: {
      title: "Mit der Bibel beginnen",
      body: "Fügen Sie Exposé, Figuren und Tonnotizen in die erste Nachricht ein. Noch nichts verlangen. Lassen Sie das Modell bestätigen, was es verstanden hat.",
    },
    scene: {
      title: "Eine Szene pro Anfrage",
      body: "Nennen Sie Erzählperspektive, Handlungsschritt und Länge. Szene für Szene bleibt die Stimme straff und der Preis niedrig.",
    },
    switch: {
      title: "Mitten im Kapitel das Modell wechseln",
      body: "Die brutale Szene mit einem Modell entwerfen, mit einem anderen überarbeiten. Der Chat behält beim Wechsel seinen Verlauf, nichts geht verloren.",
    },
    revise: {
      title: "In Ihrer Stimme umschreiben",
      body: "Fragen Sie nach Optionen, nicht nach fertigen Seiten. Sätze auswählen, umschreiben, zurückgeben. Das Buch bleibt Ihres.",
    },
  },
  skills: {
    title: "Skills für Fiktion",
    intro:
      "Ein Skill setzt Schreibpersona und Modell mit einem Klick. Nutzen Sie ihn, wie er ist, oder kopieren und anpassen.",
    writer:
      "Uncensored Writer: düstere Fiktion und Erwachsenenszenen, nichts entschärft",
    storyteller: "Storyteller: lange Geschichten mit Struktur und Tempo",
    roleplay:
      "Lieber die Geschichte spielen als schreiben? KI-Rollenspiel ohne Filter",
  },
  limits: {
    title: "Was unzensiert hier heißt und was nicht",
    intro: "Unzensiert betrifft Ihre Fiktion. Ein Freibrief ist es nicht.",
    adult:
      "Unzensierte Modelle fragen einmal nach einer 18+-Bestätigung. Danach sind erwachsene Themen zwischen Erwachsenen in der Fiktion Ihre Entscheidung.",
    terms:
      "Die Nutzungsbedingungen verbieten weiterhin illegale Inhalte, Belästigung und alles, was realen Menschen schaden soll. Diese Grenze bleibt.",
    rights:
      "Alle Rechte an Ihrem Text bleiben bei Ihnen. Das steht in unseren Bedingungen, und wir beanspruchen kein Eigentum an dem, was Sie schreiben.",
    incognito:
      "Inkognito-Chats liegen in Ihrem Browser, nicht auf unseren Servern. Der Anbieter, der das Modell betreibt, sieht jeden Prompt trotzdem, um ihn zu beantworten.",
    kindsLink:
      "Abliteriert, nachtrainiert oder eigenes Weltbild: die Unterschiede",
  },
  pairs: {
    title: "Die Fiktionsmodelle im direkten Vergleich",
    intro:
      "Kontext, Preis und Filter nebeneinander, bevor Sie einen Credit ausgeben.",
    link: "{{a}} vs. {{b}}",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Welche unzensierte KI ist die beste zum Schreiben von Fiktion?",
      a: "Das hängt von der Aufgabe ab. Ein auf Dark Roleplay abgestimmtes Modell schreibt die härtesten Szenen, ein Modell mit 1 Mio. Tokens behält ein ganzes Manuskript, und {{ownModel}} bringt ein Weltbild mit, das die Mainstream-Modelle nicht haben. Auf {{appName}} wechseln Sie im selben Chat zwischen allen {{count}} Fiktionsmodellen.",
    },
    free: {
      q: "Gibt es eine kostenlose unzensierte KI zum Geschichtenschreiben?",
      a: "Sie bekommen {{guestCredits}} Gratis-Credits im Monat ohne Konto und {{freeCredits}} mit kostenlosem Konto. Das reicht für eine gute Zahl Szenen auf den günstigeren Modellen. Für längere Projekte gibt es Abos ab {{subPrice}} im Monat.",
    },
    adult: {
      q: "Kann eine unzensierte KI erotische und NSFW-Fiktion schreiben?",
      a: "Ja, nach einer einmaligen 18+-Bestätigung. Unzensierte Modelle schreiben Erwachsenenszenen zwischen Erwachsenen, ohne abzublenden. Illegale Inhalte bleiben durch unsere Bedingungen verboten, egal was das Modell tun würde.",
    },
    novel: {
      q: "Kann eine KI einen ganzen Roman im Blick behalten?",
      a: "Die größten Modelle hier behalten etwa {{maxPages}} Seiten auf einmal, genug für Exposé, Figurenbibel und viele Kapitel. Kleinere Modelle vergessen in langen Projekten die frühen Szenen, also fassen Sie unterwegs zusammen.",
    },
    rights: {
      q: "Wem gehört der Text, den eine KI für mich schreibt?",
      a: "Auf {{appName}} Ihnen. Unsere Bedingungen sagen: Alle Rechte an Ihren Gesprächen bleiben bei Ihnen, und wir beanspruchen kein Eigentum an Ihren Inhalten. Prüfen Sie die Urheberrechtsregeln für KI-gestützte Werke dort, wo Sie veröffentlichen.",
    },
    kinds: {
      q: "Abliteriertes Modell oder UncensoredLM für Fiktion?",
      a: "Abliterierte Modelle sind Mainstream-Modelle, aus denen die Verweigerungen herausgeschnitten wurden: gleiches Können, gleiches Weltbild, sie schreiben einfach die Szene. {{ownModel}} ist trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen. Sein Gedächtnis ist kleiner: etwa {{ownPages}} Seiten.",
    },
    bestLink: "Das beste unzensierte LLM, ausgewählt nach Aufgabe",
    jailbreakLink:
      "Warum ChatGPT-Jailbreaks für Fiktion immer wieder scheitern",
    chatLink: "Unzensierter KI-Chat im Browser",
  },
  cta: {
    title: "Schreiben Sie das Kapitel, vor dem Sie sich drücken.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Fiktionsmodell wählen, jederzeit wechseln.",
    start: "Jetzt schreiben",
    models: "Alle Modelle vergleichen",
  },
};
