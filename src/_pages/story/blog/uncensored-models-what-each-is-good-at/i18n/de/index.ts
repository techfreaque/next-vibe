import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Die unzensierten Modelle, eins nach dem anderen - {{appName}}",
    description:
      "Jedes unzensierte KI-Modell auf unbottled.ai, Modell für Modell. Zwei Sorten: Mainstream-Modelle ohne Verweigerungen und UncensoredLM mit eigenem Weltbild. Was jedes gut kann und wo es schwächelt.",
    category: "Modell-Guide",
    imageAlt: "{{appName}} Guide zu unzensierten Modellen",
    keywords:
      "{{appName}}, unzensierte KI-Modelle, abliterierte Modelle, abliteriert vs. unzensiert, Venice, GLM unzensiert, DeepSeek unzensiert, Gab Arya, FreedomGPT, UncensoredLM, unzensiertes Rollenspiel, KI für düsteres Rollenspiel, unzensierte KI für Politik, Free-Speech-KI",
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
    p2: "Das ist die ehrliche Tour. Echte Anbieter, echte Stärken, echte Schwächen. Und zwei Sorten unzensiert. Die meisten Modelle hier sind Mainstream-Modelle ohne Verweigerungen: gleiches Training, gleiches Weltbild, sie weichen nur nicht mehr aus. UncensoredLM ist die andere Sorte: eigenes Tuning, eigenes Weltbild, politische Positionen gegen den Mainstream. Dieser Unterschied entscheidet, welches Modell Sie für Politik, Sichtweisen abseits des Mainstreams und die düsterste Fiktion nehmen. Für alles andere wählen Sie nach der Arbeit vor Ihnen, nicht nach dem lautesten Etikett.",
  },
  whatItMeans: {
    title: 'Was "unzensiert" hier wirklich heißt',
    p1: "Jedes Modell auf der Plattform trägt eine Inhaltsstufe: Mainstream, Offen oder Unzensiert. Unzensierte Modelle antworten ohne Verweigerungstheater und ohne moralische Vorrede. Dahin führen zwei Wege. Die meisten sind Mainstream-Modelle, denen der Verweigerungsreflex entfernt wurde, per Abliteration (die Verweigerungsrichtung wird aus den Gewichten geschnitten) oder per Feintuning gegen Zensur. Gleiche Intelligenz, gleiche Trainingsdaten, gleiches Weltbild. Sie sagen nur nicht mehr Nein. Der andere Weg ist ein anderes Weltbild. UncensoredLM stammt von uncensored.ai, das es darauf abstimmt, bei umstrittenen Themen der Beweislage statt der offiziellen Position zu folgen, nach eigenen Worten „biased to reality“. Fragen Sie es nach Politik, bekommen Sie Positionen, die Ihnen kein Mainstream-Modell liefert, ob entsperrt oder nicht.",
    callout:
      "Entsperrt oder anderes Weltbild. Ein abliteriertes Modell ist ein Mainstream-Modell, das alles beantwortet: Bei Politik antwortet es wie sein Basislabor, nur ohne Ausweichen. UncensoredLM sieht die Welt anders, also rechnen Sie mit politischen Gegenpositionen. Das erste für Leistung ohne Verweigerung. Das zweite für die andere Seite des Arguments.",
    p2: "Sie wählen die Stufe. Niemand wählt sie für Sie. Ein unzensiertes Modell antwortet nur so, weil Sie es ausgewählt haben, und Sie können im selben Chat, mit demselben Konto, jederzeit zu einem Mainstream-Modell zurückwechseln.",
  },
  groups: {
    builtUncensored: {
      title: "Das eine Modell mit eigenem Weltbild",
      intro:
        "UncensoredLM fällt aus der Reihe. Es ist kein entsperrtes Mainstream-Modell, das dessen Blick auf die Welt behält. Uncensored.ai stimmt es gegen die offizielle Linie ab, deshalb führt es bei drei Aufgaben: politische und kontroverse Fragen, Positionen, die der Mainstream nicht ausspricht, und düsteres, tabuisiertes Rollenspiel.",
    },
    creative: {
      title: "Wenn es um Rollenspiel und düstere Fiktion geht",
      intro:
        "Figuren, die in ihrer Rolle bleiben. Szenen, die dorthin gehen, wo die Geschichte hinwill. Für das Düstere und Tabuisierte führt UncensoredLM. Die Alternativen punkten bei langen Kampagnen, Bildeingabe oder Preis.",
      topPickReason:
        "Düsteres und tabuisiertes Rollenspiel, Fiktion ohne Weichzeichner. Keine entschärften Szenen, kein plötzlicher moralischer Einschub, keine Figur, die aus der Rolle fällt, um Sie zu belehren. Sein Tuning zielt weg vom sicheren Konsens, also lenkt nichts die Geschichte in zahmere Bahnen. Eine Grenze: 32K Kontext. In sehr langen Kampagnen vergisst es die frühen Szenen.",
    },
    viewpoint: {
      title:
        "Wenn es um Politik, Kontroverse oder eine andere Perspektive geht",
      intro:
        "Zu einer Free-Speech-Plattform gehört, Modelle zu führen, die andere nicht führen. Hier führt UncensoredLM. Gab Arya bringt eine offen benannte rechte Ausrichtung mit. FreedomGPT bleibt beim Klartext.",
      topPickReason:
        "Politische und kontroverse Fragen, beantwortet in Ihrem Rahmen. Abweichende Positionen, voll ausargumentiert. Advocatus Diaboli ohne Hintertür: kein Zurücklenken auf die Konsenslinie, keine Moralpredigt. Neutral ist es nicht, und umstrittene Behauptungen formuliert es so sicher wie belegte. Prüfen Sie die Fakten.",
    },
    reasoning: {
      title: "Wenn es denken soll",
      intro:
        "Reasoning, Code, Analyse. Starke Basismodelle mit entfernten Verweigerungen. Hier sitzt die meiste Intelligenz der unzensierten Reihe.",
    },
    fast: {
      title: "Wenn es schnell und günstig sein muss",
      intro:
        "Niedrige Kosten pro Nachricht, flotte Antworten, großer Kontext, alle drei lesen Bilder. Die Arbeitspferde für jeden Tag.",
    },
  },
  cards: {
    goodLabel: "Stark bei",
    weakLabel: "Schwächer bei",
    pageLink: "Zur Seite von {{model}}",
    topPickLabel: "Erste Wahl",
    alternativesLabel: "Alternativen",
    uncensoredLm: {
      maker: "Uncensored.ai",
      basis:
        "Eigenes Tuning von uncensored.ai auf offener Basis: Die erste öffentliche Version war ein DeepSeek-R1-Distill auf 14B-Qwen-Basis. 32K Kontext, nur Text.",
      good: "Düsteres und tabuisiertes Rollenspiel, Fiktion. Politische und kontroverse Fragen. Positionen abseits des Mainstreams, in Ihrem Rahmen ausargumentiert. Keine Moralpredigt, kein Zurücklenken auf die Konsenslinie. Nutzt Tools.",
      weak: "Sehr lange Kampagnen (32K Kontext), Coding und Bilder. Experimentell, und umstrittene Behauptungen formuliert es so sicher wie belegte. Prüfen Sie die Fakten, die es liefert.",
    },
    freedomgpt: {
      maker: "Age of AI",
      basis: "Abstammung aus offenen Gewichten. 32K Kontext.",
      good: "Direkte, schnelle Antworten ohne Belehrung. Der Chatbot, der die Free-Speech-Kategorie eröffnet hat, auf Klartext getrimmt.",
      weak: "Tiefe. Tools, Coding und lange Argumentationen sind nicht sein Feld. Für ein anderes Weltbild statt nur weniger Verweigerungen geht UncensoredLM weiter.",
    },
    arya: {
      maker: "Gab",
      basis: "Basismodell nicht offengelegt. 131K Kontext.",
      good: "Nach eigener Verortung ein rechts geprägter Assistent. Die Wahl, wenn Sie genau diese Ausrichtung wollen. Langer Kontext, nutzt Tools.",
      weak: "Bandbreite. Es argumentiert bewusst von einer Seite. Basis und Training sind nicht offengelegt, also Details als unbestätigt behandeln. Kein Coder.",
    },
    venice: {
      maker: "Venice.ai",
      basis: "Dolphin Mistral 24B, Venice-Edition. 128K Kontext, liest Bilder.",
      good: "Günstiger unzensierter Allrounder mit einer der niedrigsten Verweigerungsraten am Markt. Fiktion, offener Austausch, Bildeingabe, 128K Kontext.",
      weak: "Verweigerungen entfernt, Weltbild behalten: ein Mistral-Feintuning, und bei düsteren Szenen und Politik merkt man das. Code und schwere Analyse. Tool-Aufrufe laufen über einen promptbasierten Pfad.",
    },
    veniceRoleplay: {
      maker: "Venice.ai",
      basis: "24B auf Rollenspiel getrimmt. 128K Kontext, liest Bilder.",
      good: "Lange Kampagnen. 128K Kontext halten frühe Szenen in Reichweite, und es ist darauf getrimmt, die Stimme einer Figur zu halten. Liest Bilder für Charakterbilder und Szenenvorlagen.",
      weak: "Verweigerungen entfernt, Weltbild behalten. Die Basishaltung kann das düsterste Material entschärfen. Alles Analytische: ein Erzähler, kein Assistent.",
    },
    deepseekFlash: {
      maker: "DeepSeek (über Venice)",
      basis:
        "DeepSeek V4.1 Flash, Verweigerungen entfernt. 1M Kontext, liest Bilder.",
      good: "Riesiger Kontext für ausufernde Welten zum kleinen Preis. Liest Bilder, nutzt Tools und schreibt Code, wenn die Geschichte Pause macht.",
      weak: "Verweigerungen entfernt, die DeepSeek-Haltung bleibt. Bei Politik und den düstersten Szenen kann es ausweichen. Ein Generalist, kein reiner Erzähler.",
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
    p2: "Die unzensierte Reihe ist außerdem schlicht der bessere Werkzeugkasten. UncensoredLM für düsteres Rollenspiel, Tabufiktion, Politik und Positionen, die der Mainstream meidet. Venice Role Play für lange Kampagnen. Qwen für Code, den andere blockieren. GLM 5.3 für Spitzen-Reasoning. Ein Flash-Modell für günstige Masse. Gab Arya, wenn Sie bewusst eine rechte Ausrichtung wollen. Andere Aufgaben, andere Werkzeuge. Die Mainstream-Modelle behalten Sie dabei, im selben Konto, für die Fälle, in denen ein Filter genau das Richtige ist.",
    callout:
      "Unzensiert heißt nicht sorglos. Sie verantworten, was Sie erzeugen, und das Gesetz gilt weiter. Was sich hier ändert, ist, wer am Regler sitzt: Sie, nicht der Modellanbieter.",
  },
  howToPick: {
    title: "Wie Sie in der Praxis wählen",
    p1: "Gehen Sie von der Aufgabe aus. Politik, kontroverse Fragen, eine Sicht abseits des Konsenses, düstere oder tabuisierte Fiktion: UncensoredLM, das Modell mit eigenem Weltbild. Kampagnen, die 32K sprengen, oder Szenen mit Bildern: Venice Role Play. Günstiger Allrounder: Venice Uncensored. Code oder Analyse ohne Verweigerung: Qwen 3.6 Plus Uncensored oder volles GLM 5.3 Uncensored. Große Mengen, geringe Kosten, multimodal: GLM 5.3 Flash, Gemma 4 oder MiMo.",
    p2: "Sie wollen bewusst eine rechte Ausrichtung: Gab Arya, nach eigener Verortung. Klartext ohne Umschweife: FreedomGPT Liberty. Unsicher? Stellen Sie zwei nebeneinander und vergleichen Sie sie an Ihrem eigenen Prompt.",
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
