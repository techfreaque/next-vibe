import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Die unzensierten Modelle, eins nach dem anderen - {{appName}}",
    description:
      "Ein klarer Leitfaden zu jedem unzensierten KI-Modell auf unbottled.ai. Worin jedes gut ist, wo es schwächelt und warum die volle Auswahl der eigentliche Punkt ist.",
    category: "Modell-Guide",
    imageAlt: "{{appName}} Guide zu unzensierten Modellen",
    keywords:
      "{{appName}}, unzensierte KI-Modelle, abliterierte Modelle, Venice, GLM unzensiert, Gab Arya, FreedomGPT, UncensoredLM, Free-Speech-KI",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modell-Guide",
    readTime: "7 Min. Lesezeit",
    title: "Die unzensierten Modelle, eins nach dem anderen.",
    subtitle:
      "Kein Modell kann alles am besten. Hier steht, was jedes unzensierte Modell gut kann, wo es schwächelt und wie Sie das richtige für die Aufgabe wählen.",
  },
  intro: {
    lead: "Wir betreiben aktuell {{uncensoredCount}} unzensierte Modelle. Austauschbar sind sie nicht. Jedes kommt aus einem anderen Labor, sitzt auf einer anderen Basis und kann anderes.",
    p2: "Das ist die ehrliche Tour. Echte Anbieter, echte Stärken, echte Schwächen. Wählen Sie nach der Aufgabe vor Ihnen, nicht nach dem lautesten Label.",
  },
  whatItMeans: {
    title: 'Was "unzensiert" hier wirklich heißt',
    p1: "Jedes Modell auf der Plattform trägt eine Inhaltsstufe: Mainstream, Offen oder Unzensiert. Unzensierte Modelle antworten ohne Verweigerungstheater und ohne moralische Vorrede. Sie entstehen auf zwei Wegen. Manche sind von Anfang an darauf trainiert. Andere sind abliteriert: Die Verweigerungsrichtung wird aus den Gewichten eines bestehenden Modells entfernt, sodass ein starkes Mainstream-Modell seine Intelligenz behält, aber den Reflex zum Nein verliert.",
    p2: "Sie wählen die Stufe. Niemand wählt sie für Sie. Ein unzensiertes Modell antwortet nur so, weil Sie es ausgewählt haben, und Sie können im selben Chat, mit demselben Konto, jederzeit zu einem Mainstream-Modell zurückwechseln.",
  },
  groups: {
    reasoning: {
      title: "Wenn es denken soll",
      intro:
        "Reasoning, Code, Analyse. Hier sitzt die meiste Intelligenz der unzensierten Reihe.",
    },
    creative: {
      title: "Wenn es um Fiktion und Rollenspiel geht",
      intro:
        "Figuren, die in ihrer Rolle bleiben, lange Geschichten, ungefilterter Dialog. Gebaut zum Schreiben, nicht für Tabellen.",
    },
    fast: {
      title: "Wenn es schnell und günstig sein muss",
      intro:
        "Cent-Beträge pro Nachricht, flotte Antworten, die meisten lesen Bilder. Die Arbeitspferde für jeden Tag.",
    },
    viewpoint: {
      title: "Wenn Sie eine andere Perspektive wollen",
      intro:
        "Zu einer Free-Speech-Plattform gehört, Modelle zu führen, die andere nicht führen. Dieses hat eine klar benannte politische Ausrichtung.",
    },
  },
  cards: {
    goodLabel: "Stark bei",
    weakLabel: "Schwächer bei",
    pageLink: "Zur Seite von {{model}}",
    uncensoredLm: {
      maker: "Uncensored.ai",
      basis: "DeepSeek-R1-Distill auf 14B-Qwen-Basis. 32K Kontext.",
      good: "Schrittweises, sichtbares Reasoning, unzensiert. Nutzt Tools. Ein kleines, günstiges Modell, das trotzdem seinen Weg zeigt.",
      weak: "Coding. Experimentelle Preview mit kurzem Kontext, also Aufgaben fokussiert halten.",
    },
    freedomgpt: {
      maker: "Age of AI",
      basis: "Abstammung aus offenen Gewichten. 32K Kontext.",
      good: "Direkte, schnelle Antworten ohne Belehrung. Der Chatbot, der die Free-Speech-Kategorie eröffnet hat, auf Klartext getrimmt.",
      weak: "Tools, Coding und tiefe Analyse. Schlagfertig, aber kein schwerer Denker.",
    },
    arya: {
      maker: "Gab",
      basis: "Basismodell nicht offengelegt. 131K Kontext.",
      good: "Nach eigener Verortung ein rechts geprägter Assistent, der Themen beantwortet, die andere Modelle ablehnen. Clever, langer Kontext, nutzt Tools.",
      weak: "Coding. Basis und Training sind nicht öffentlich dokumentiert, also Details als unbestätigt behandeln.",
    },
    venice: {
      maker: "Venice.ai",
      basis: "Dolphin Mistral 24B, Venice-Edition. 128K Kontext, liest Bilder.",
      good: "Eine der niedrigsten Verweigerungsraten am Markt. Rollenspiel, Fiktion, offener Austausch. Ein verlässlicher unzensierter Standard.",
      weak: "Code und schwere Analyse. Native Tool-Aufrufe wackeln, daher ein promptbasierter Tool-Pfad.",
    },
    veniceRoleplay: {
      maker: "Venice.ai",
      basis: "24B auf Rollenspiel getrimmt. 128K Kontext, liest Bilder.",
      good: "Figuren, die über lange Kampagnen ihre Stimme halten. Düstere Szenen und Erwachsenenfiktion, ohne mitten in der Geschichte abzubrechen.",
      weak: "Alles Analytische. Das hier ist ein Erzähler, kein Assistent.",
    },
    gemma: {
      maker: "Google (über Venice)",
      basis: "Gemma 4 26B MoE, Filter entfernt. 256K Kontext, liest Bilder.",
      good: "Schnell, günstig, multimodal. Für den Preis ein großes Kontextfenster.",
      weak: "Tiefes Reasoning. Schneller Antworter, kein Grübler.",
    },
    qwen: {
      maker: "Alibaba (über Venice)",
      basis:
        "Qwen 3.6 Plus, Verweigerungen entfernt. 256K Kontext, liest Bilder.",
      good: "Der stärkste Coder und Analyst der unzensierten Reihe. Denkt gut, liest Bilder, hält langen Kontext.",
      weak: "Der Preis. Diese Leistung kostet pro Nachricht mehr als die Flash-Modelle.",
    },
    glmHeretic: {
      maker: "Z.AI (über Venice)",
      basis: "Abliteriertes GLM 4.7 Flash. 200K Kontext.",
      good: "Cent-Beträge pro Nachricht, schnelle Antworten, keine Belehrungen. Ein günstiger unzensierter Rückfall.",
      weak: "Analyse. Ein Flash-Modell der Vorgeneration, gehalten für Preis und Tempo.",
    },
    mimo: {
      maker: "Xiaomi (über NanoGPT)",
      basis:
        "MiMo V2.6 Flash, Verweigerungsrichtung abliteriert. 1M Kontext, liest Bilder.",
      good: "Günstig und schnell, multimodal, nutzt Tools, riesiges Kontextfenster. Solide für große Mengen ungefilterter Arbeit.",
      weak: "Tauscht etwas Tiefe gegen Tempo. Nicht die Wahl fürs härteste Reasoning.",
    },
    glm53: {
      maker: "Z.AI (über NanoGPT)",
      basis: "Volles GLM-5.3-Reasoning-Modell, unzensiert. 1M Kontext.",
      good: "Code, Text und Tools auf Spitzenniveau, unzensiert, zu einem Bruchteil des Preises eines abliterierten Flaggschiffs. Der schwere Hammer.",
      weak: "Tempo. Ein großes Modell, und noch als experimentell markiert.",
    },
    glm53Flash: {
      maker: "Z.AI (über NanoGPT)",
      basis: "320B MoE, unzensiert. 1M Kontext, liest Bilder.",
      good: "Schnell, günstig, multimodal, 1M Kontext. Das Arbeitspferd für den ungefilterten Alltag.",
      weak: "Das allerhärteste Reasoning. Dafür greifen Sie zum vollen GLM 5.3.",
    },
  },
  why: {
    title: "Warum die Auswahl zählt",
    intro: "Auswahl ist kein Nebenfeature. Sie ist der ganze Punkt.",
    p1: "Die Verweigerung des einen Modells ist die Antwort des anderen. Eine medizinische Frage, ein juristischer Grenzfall, ein Stück Fiktion, eine Security-Analyse, eine Position jenseits des Mainstreams: Ein einzelnes gefiltertes Modell entscheidet für Sie, was Sie fragen dürfen. Eine Bandbreite an Modellen gibt diese Entscheidung an Sie zurück.",
    p2: "Die unzensierte Reihe ist außerdem schlicht der bessere Werkzeugkasten. Qwen für Code, den andere blockieren, GLM 5.3 für Spitzen-Reasoning, Venice für Fiktion, ein Flash-Modell für günstige Masse, ein rechts geprägtes Modell für eine Perspektive, die der Rest des Felds meidet. Andere Aufgaben, andere Werkzeuge. Die Mainstream-Modelle behalten Sie dabei, im selben Konto, für die Fälle, in denen ein Filter genau das Richtige ist.",
    callout:
      "Unzensiert heißt nicht sorglos. Sie verantworten, was Sie erzeugen, und das Gesetz gilt weiter. Was sich hier ändert, ist, wer am Regler sitzt: Sie, nicht der Modellanbieter.",
  },
  howToPick: {
    title: "Wie Sie in der Praxis wählen",
    p1: "Gehen Sie von der Aufgabe aus. Code oder Analyse: Qwen 3.6 Plus Uncensored oder volles GLM 5.3 Uncensored. Fiktion und Rollenspiel: Venice Uncensored oder Venice Role Play. Große Mengen, geringe Kosten, multimodal: GLM 5.3 Flash, Gemma 4 oder MiMo. Ein Reasoning-Modell, das seinen Weg zeigt, mit kleinem Budget: UncensoredLM.",
    p2: "Sie wollen eine bestimmte Perspektive oder ein Modell rund um freie Meinungsäußerung: Gab Arya oder FreedomGPT Liberty. Unsicher? Öffnen Sie zwei nebeneinander auf der Modellseite und vergleichen Sie sie an Ihrem eigenen Prompt.",
  },
  cta: {
    title: "Modell wählen. Filter setzen.",
    subtitle:
      "Jedes unzensierte Modell hier ist im Chat verfügbar. Vergleichen Sie sie an Ihrer eigenen Frage, oder legen Sie einfach los.",
    chat: "Chat starten",
    models: "Alle Modelle ansehen",
  },
};
