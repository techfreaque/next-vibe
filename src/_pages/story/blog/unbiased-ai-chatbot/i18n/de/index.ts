import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Neutrale KI? Gibt es nicht. Fragen Sie mehrere | {{appName}}",
    description:
      "Unvoreingenommene KI gibt es nicht. Warum kein Chatbot neutral ist und wie Mainstream-, abliterierte und gegenläufige Modelle dieselbe Frage rahmen.",
    category: "Ratgeber",
    imageAlt: "Eine Waage wiegt die Antworten mehrerer KI-Chatbots",
    keywords:
      "KI ohne politische Voreingenommenheit, neutrale KI, unvoreingenommener KI Chatbot, politisch neutrale KI, ist ChatGPT voreingenommen, KI Chatbot politische Voreingenommenheit, konservativer KI Chatbot, KI mit Gegenpositionen, unzensierte politische KI, KI beide Seiten fragen, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Ratgeber",
    readTime: "7 Min. Lesezeit",
    title: "Einen neutralen KI-Chatbot gibt es nicht. Fragen Sie mehrere.",
    subtitle:
      "Warum jedes Modell eine Schlagseite hat, wie {{count}} Modelle dieselbe Frage unterschiedlich rahmen und eine Methode in vier Schritten, mit der Sie alle Seiten in einem Chat hören.",
  },
  intro: {
    lead: "Jeder Chatbot behauptet, ausgewogen zu sein. Dann beantwortet er die Frage der einen Seite und belehrt die andere. Sie merken das. Alle merken das. Die meisten ziehen daraus den Schluss, sie bräuchten die eine neutrale KI.",
    p2: "Die gibt es nicht. Was es gibt: Modelle mit unterschiedlichem Blickwinkel, nebeneinander. Auf {{appName}} stellen Sie dieselbe Frage einem Mainstream-Modell, einem abliterierten Modell und einem Modell mit politischen Gegenpositionen, in einem Chat, und urteilen selbst.",
  },
  neutral: {
    title: "Warum keine KI neutral ist",
    intro:
      "Voreingenommenheit ist kein Fehler, den jemand zu beheben vergessen hat. Sie entsteht auf drei Wegen.",
    data: "Trainingsdaten: Ein Modell lernt aus dem, was geschrieben, veröffentlicht und online gehalten wurde. Was ausgeschlossen oder entfernt wurde, prägt es genauso stark wie das, was drin ist.",
    tuning:
      "Menschliches Feedback: Nach dem Training bewerten Menschen die Antworten, und das Modell lernt, ihnen zu gefallen. Ihr Urteil darüber, was vernünftig klingt, wird zum Urteil des Modells.",
    rules:
      "Verweigerungsregeln: Jemand entscheidet, welche Fragen schädlich sind. Das ist eine Ermessensfrage, und sie trifft manche Themen härter als andere.",
    sourcesIntro: "Sogar die Labore und die Forschung sagen das:",
    sources: {
      openai:
        "OpenAI: politische Voreingenommenheit in LLMs definieren und messen",
      paper: "Forschungsarbeit: Politische Neutralität in KI ist unmöglich",
    },
    callout:
      "Die Lösung ist kein perfektes Modell. Sondern mehr als ein Modell, und Sie als Richter.",
  },
  frames: {
    title: "Vier Blickwinkel, eine Frage",
    intro:
      "Modelle neigen in verschiedene Richtungen. Wissen Sie, welchen Blickwinkel Sie gerade lesen.",
    mainstream:
      "Mainstream-Modelle: die Assistenten der großen Labore. Leistungsstark und vorsichtig, geprägt von den Sicherheitsregeln ihres Labors. Bei umstrittenen Themen relativieren sie oder lehnen ab.",
    abliterated:
      "Abliterierte Modelle: Mainstream- oder offene Modelle, leicht verändert, damit sie Fragen nicht mehr ausweichen. Sie beantworten alles, aber mit demselben Training und demselben Weltbild wie ihr Basismodell.",
    own: "{{ownModel}}: trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen. Die andere Seite des Arguments, klar ausgesprochen.",
    gab: "{{gabModel}}: Laut Gab basiert es auf christlichen Werten und konservativen Prinzipien. Eine offen erklärte Ausrichtung, und damit mehr Transparenz als bei den meisten Modellen.",
    kindsLink: "Wie sich abliterierte und unzensierte Modelle unterscheiden",
  },
  lineup: {
    title: "{{count}} Modelle, {{count}} Blickwinkel",
    intro:
      "Eine Auswahl für umstrittene Fragen: Mainstream-Flaggschiffe, ein abliteriertes Flaggschiff, das Modell mit Gegenpositionen und eines mit offen erklärter Ausrichtung. Kontext und Preis live aus unserem Modellregister.",
    footnote:
      "Pro Nachricht meint einen Referenz-Austausch über die günstigste Route. Unzensierte Modelle fragen einmalig nach einer 18+-Bestätigung.",
  },
  table: {
    model: "Modell",
    context: "Kontext",
    price: "Pro Nachricht",
    chat: "Testen",
    chatLink: "{{model}} fragen",
  },
  method: {
    title: "Alle Seiten hören in vier Schritten",
    intro: "Ein Chat. Ein paar Wechsel. Ihr eigenes Urteil.",
    ask: {
      title: "Stellen Sie Ihre echte Frage",
      body: "Keine entschärfte Version. Fragen Sie so, wie Sie einen Freund fragen würden, der anderer Meinung ist.",
    },
    switch: {
      title: "Modell wechseln, Chat behalten",
      body: "Wählen Sie ein anderes Modell aus der Auswahl und fragen Sie erneut. Der Chat behält seinen Verlauf, jedes Modell sieht also dieselbe Frage.",
    },
    steelman: {
      title: "Lassen Sie jedes Modell die Gegenseite vertreten",
      body: "Fordern Sie das stärkste Argument gegen seine eigene Antwort. Ein Modell, das die Gegenseite nicht stark machen kann, zeigt Ihnen seinen Blickwinkel.",
    },
    check: {
      title: "Prüfen Sie die Fakten selbst",
      body: "Wo die Modelle bei Fakten uneins sind, nicht bei Meinungen, schlagen Sie nach. {{ownModel}} trägt umstrittene Behauptungen so klar vor wie gesicherte. Die anderen tun das auch, nur in ihre eigene Richtung.",
    },
  },
  skills: {
    title: "Skills, die jede Seite vertreten",
    intro:
      "Ein Skill setzt Persona und Modell mit einem Klick. Diese hier sind für umstrittenes Terrain gebaut.",
    historian: "Unparteiischer Historiker: Fakten statt Narrative",
    advocate: "Advocatus Diaboli: stellt jede Annahme infrage",
    debater: "Debattierer: vertritt kontroverse Themen von allen Seiten",
    chan: "4chan: Greentext und Sticheleien, die Stimme des alten Imageboards, ungefiltert",
  },
  pairs: {
    title: "{{ownModel}} gegen den Mainstream",
    intro:
      "Direktvergleiche: Kontext, Preis und Filter des Modells mit Gegenpositionen gegen die großen Namen.",
    link: "{{a}} vs. {{b}}",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Gibt es einen unvoreingenommenen KI-Chatbot?",
      a: "Nein. Jedes Modell ist geprägt von seinen Trainingsdaten, den Menschen, die seine Antworten bewertet haben, und seinen Verweigerungsregeln. Die praktische Antwort: mehrere Modelle mit unterschiedlichem Blickwinkel fragen und vergleichen. Auf {{appName}} braucht das einen Chat und ein paar Klicks.",
    },
    chatgpt: {
      q: "Ist ChatGPT politisch voreingenommen?",
      a: "Jedes Modell neigt irgendwohin, und Mainstream-Assistenten relativieren oder lehnen bei umstrittenen Themen ab. OpenAI veröffentlicht eigene Auswertungen zur politischen Voreingenommenheit seiner Modelle. Stellen Sie dieselbe Frage einem Modell mit anderem Blickwinkel, und der Unterschied wird sichtbar.",
    },
    conservative: {
      q: "Gibt es einen konservativen oder rechten KI-Chatbot?",
      a: "{{gabModel}} basiert laut Gab auf christlichen Werten und konservativen Prinzipien. {{ownModel}} ist trainiert mit Büchern und Dokumenten, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen. Beide finden Sie in der Modellauswahl von {{appName}}.",
    },
    truth: {
      q: "Sagt {{ownModel}} die Wahrheit?",
      a: "Es sagt Ihnen, was die Mainstream-Modelle nicht sagen. Neutral ist es auch nicht, und es trägt umstrittene Behauptungen so klar vor wie gesicherte. Nutzen Sie es als Gegenseite des Arguments und prüfen Sie Fakten, auf die es ankommt.",
    },
    side: {
      q: "Ergreift {{appName}} politisch Partei?",
      a: "Nein. Wir betreiben Mainstream-, offene und unzensierte Modelle nebeneinander, und Sie wählen. Was Menschen lesen, entscheiden Menschen, kein Konzern.",
    },
    free: {
      q: "Kann ich Modelle kostenlos vergleichen?",
      a: "Ja. Sie erhalten {{guestCredits}} Gratis-Credits im Monat ohne Konto und {{freeCredits}} mit kostenlosem Konto. Ein Modellwechsel im Chat kostet nichts extra.",
    },
    refusalLink: "Der Verweigerungsindex: welche KI wirklich antwortet",
    jailbreakLink: "Warum ChatGPT-Jailbreaks ständig brechen",
    bestLink: "Das beste unzensierte LLM, nach Aufgabe gewählt",
  },
  cta: {
    title: "Hören Sie die Seite, die Ihr Chatbot auslässt.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Fragen Sie das Modell mit Gegenpositionen, dann wechseln und vergleichen.",
    start: "Das Modell mit Gegenpositionen fragen",
    models: "Alle Modelle vergleichen",
  },
};
