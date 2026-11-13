import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Die unzensierten Modelle, eins nach dem anderen - {{appName}}",
    description:
      "Ein klarer Leitfaden zu jedem unzensierten KI-Modell auf unbottled.ai. Welches von Grund auf unzensiert ist, welchen nur die Verweigerungen entfernt wurden, worin jedes gut ist und wo es schwächelt.",
    category: "Modell-Guide",
    imageAlt: "{{appName}} Guide zu unzensierten Modellen",
    keywords:
      "{{appName}}, unzensierte KI-Modelle, abliterierte Modelle, Venice, GLM unzensiert, Gab Arya, FreedomGPT, UncensoredLM, von Grund auf unzensierte KI, unzensierte KI für Politik, Free-Speech-KI",
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
    p2: "Das ist die ehrliche Tour. Echte Anbieter, echte Stärken, echte Schwächen. Ein Modell hier ist von Grund auf unzensiert. Den übrigen wurden die Verweigerungen entfernt. Dieser Unterschied entscheidet, welches Sie zu Politik befragen. Für alles andere wählen Sie nach der Aufgabe vor Ihnen, nicht nach dem lautesten Label.",
  },
  whatItMeans: {
    title: 'Was "unzensiert" hier wirklich heißt',
    p1: "Jedes Modell auf der Plattform trägt eine Inhaltsstufe: Mainstream, Offen oder Unzensiert. Unzensierte Modelle antworten ohne Verweigerungstheater und ohne moralische Vorrede. Dahin führen zwei Wege. Einer ist von Grund auf unzensiert: Sein Labor hat es vom ersten Trainingslauf an so trainiert. Die übrigen sind bestehende Modelle mit entfernten Verweigerungen, per Abliteration (die Verweigerungsrichtung wird aus den Gewichten geschnitten) oder per Feintuning gegen Zensur. Sie behalten ihre Intelligenz und verlieren den Reflex zum Nein. Ihre Trainingsdaten und die Grundhaltung des Ursprungslabors behalten sie ebenfalls.",
    callout:
      "Von Grund auf unzensiert oder Verweigerungen entfernt. UncensoredLM ist das einzige Modell hier, das von Anfang an unzensiert trainiert wurde. Jedes andere unzensierte Modell verweigert nicht mehr, trägt aber das Weltbild seines Basismodells weiter. Bei Politik merkt man das. Uneingeschränkt heißt nicht neutral.",
    p2: "Sie wählen die Stufe. Niemand wählt sie für Sie. Ein unzensiertes Modell antwortet nur so, weil Sie es ausgewählt haben, und Sie können im selben Chat, mit demselben Konto, jederzeit zu einem Mainstream-Modell zurückwechseln.",
  },
  groups: {
    builtUncensored: {
      title: "Wenn die Frage politisch oder kontrovers ist",
      intro:
        "Das einzige Modell im Katalog, das von Grund auf unzensiert gebaut ist. Es antwortet in dem Rahmen, den Sie vorgeben, ohne Moralpredigt und ohne Sie zur Konsenslinie zurückzulotsen.",
    },
    reasoning: {
      title: "Wenn es denken soll",
      intro:
        "Reasoning, Code, Analyse. Starke Basismodelle mit entfernten Verweigerungen. Hier sitzt die meiste Intelligenz der unzensierten Reihe.",
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
      basis:
        "Vom Labor unzensiert trainiert. Die erste öffentliche Version war ein DeepSeek-R1-Distill auf 14B-Qwen-Basis. 32K Kontext, nur Text.",
      good: "Politische, kontroverse und tabuisierte Fragen, direkt beantwortet in Ihrem Rahmen. Keine Moralpredigt, kein Zurücklenken auf die Konsenslinie. Nutzt Tools.",
      weak: "Coding, lange Dokumente und Bilder. Experimentell, und umstrittene Behauptungen formuliert es so sicher wie belegte. Prüfen Sie die Fakten, die es liefert.",
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
      weak: "Code und schwere Analyse. Native Tool-Aufrufe wackeln, daher ein promptbasierter Tool-Pfad. Im Kern ein Mistral-Feintuning, und bei Politik merkt man das.",
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
      weak: "Tiefes Reasoning. Schneller Antworter, kein Grübler. Googles Training prägt weiter, wie es heikle Themen einordnet.",
    },
    qwen: {
      maker: "Alibaba (über Venice)",
      basis:
        "Qwen 3.6 Plus, Verweigerungen entfernt. 256K Kontext, liest Bilder.",
      good: "Der stärkste Coder und Analyst der unzensierten Reihe. Denkt gut, liest Bilder, hält langen Kontext.",
      weak: "Der Preis. Diese Leistung kostet pro Nachricht mehr als die Flash-Modelle. Die Verweigerungen sind weg, Alibabas Trainingsdaten nicht: Bei Politik ist mit der Sicht des Basismodells zu rechnen.",
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
      weak: "Tempo. Ein großes Modell, und noch als experimentell markiert. Es verweigert nicht mehr, kann bei politischen Fragen aber weiter ausweichen wie das Basis-GLM.",
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
    p2: "Die unzensierte Reihe ist außerdem schlicht der bessere Werkzeugkasten. UncensoredLM für politische und kontroverse Fragen, Qwen für Code, den andere blockieren, GLM 5.3 für Spitzen-Reasoning, Venice für Fiktion, ein Flash-Modell für günstige Masse, ein rechts geprägtes Modell für eine Perspektive, die der Rest des Felds meidet. Andere Aufgaben, andere Werkzeuge. Die Mainstream-Modelle behalten Sie dabei, im selben Konto, für die Fälle, in denen ein Filter genau das Richtige ist.",
    callout:
      "Unzensiert heißt nicht sorglos. Sie verantworten, was Sie erzeugen, und das Gesetz gilt weiter. Was sich hier ändert, ist, wer am Regler sitzt: Sie, nicht der Modellanbieter.",
  },
  howToPick: {
    title: "Wie Sie in der Praxis wählen",
    p1: "Gehen Sie von der Aufgabe aus. Politik, Kontroverses oder Tabuthemen: UncensoredLM, das einzige von Grund auf unzensierte Modell. Code oder Analyse: Qwen 3.6 Plus Uncensored oder volles GLM 5.3 Uncensored. Fiktion und Rollenspiel: Venice Uncensored oder Venice Role Play. Große Mengen, geringe Kosten, multimodal: GLM 5.3 Flash, Gemma 4 oder MiMo.",
    p2: "Sie wollen eine bewusst gesetzte Perspektive: Gab Arya, nach eigener Verortung rechts geprägt. Klartext ohne Umschweife: FreedomGPT Liberty. Unsicher? Stellen Sie zwei nebeneinander und vergleichen Sie sie an Ihrem eigenen Prompt.",
    compareLink: "{{a}} mit {{b}} vergleichen",
  },
  cta: {
    title: "Modell wählen. Filter setzen.",
    subtitle:
      "Jedes unzensierte Modell hier ist im Chat verfügbar. Vergleichen Sie sie an Ihrer eigenen Frage, oder legen Sie einfach los.",
    chat: "Chat starten",
    models: "Alle Modelle ansehen",
  },
};
