import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Ich wurde gefeuert. Das habe ich stattdessen gebaut. - next-vibe",
    description:
      "Eine föderierte Widget-Engine, gebaut bei einem Job, den es nicht mehr gibt. Jetzt ist jeder next-vibe-Endpoint in zwei Script-Tags einbettbar.",
    category: "VibeFrame",
    imageAlt: "VibeFrame - Föderierte Widget-Engine",
    keywords:
      "VibeFrame, föderierte Widgets, iframe, postMessage, next-vibe, einbettbar, TypeScript",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "VibeFrame",
    readTime: "11 Min. Lesezeit",
    title: "Ich wurde gefeuert. Das habe ich stattdessen gebaut.",
    subtitle:
      "Eine föderierte Widget-Engine, gebaut bei einem Job, den es nicht mehr gibt. Jetzt ist jeder next-vibe-Endpoint in zwei Script-Tags einbettbar.",
    quote: "Ich wollte es meinem Team zeigen. Dann wurde ich gefeuert.",
  },
  origin: {
    title: "Die Entstehungsgeschichte",
    paragraph1:
      "Ich verbrachte drei Monate damit, bei meinem Tagesjob etwas zu bauen, das ich niemandem zeigen durfte. Die Codebasis, an der ich arbeitete, war ein Desaster. Jedes Mal, wenn wir ein Drittanbieter-Widget einbetten mussten - ein Formular, eine Chat-Blase, ein Dashboard-Panel - war es die gleiche Geschichte.",
    paragraph2:
      "Ich baute eine Alternative. Eine leichtgewichtige föderierte Widget-Engine, die alles sicher einbetten konnte - jedes Formular, jede UI, jedes Tool - in einem Sandbox-iframe auf jeder Seite. Richtiges postMessage-Protokoll. Kein gemeinsamer Zustand zwischen Host und Widget. Trigger-System, Anzeigemodi, das volle Programm.",
    paragraph3:
      "Ich wollte es meinem Team zeigen. Dann wurde ich gefeuert. Die Codebasis lag monatelang tot auf meiner Festplatte. Dann erkannte ich: Die Architektur war genau das, was next-vibe brauchte.",
  },
  problem: {
    title: "Das Problem mit Script-Tags",
    paragraph1:
      "Wenn Sie Drittanbieter-Inhalte mit einem nackten Script-Tag einbetten, haben Sie keine Sandbox. Dieses Skript hat vollen Zugriff auf die Seite - das DOM, Cookies, localStorage, Event-Listener, alles.",
    paragraph2:
      "Die sichere Standardalternative ist ein iframe. Aber iframes kommunizieren standardmäßig nicht mit der Elternseite. Resize-Events bubblen nicht. Formularübermittlungen propagieren nicht. Sie enden mit einer dummen isolierten Box, die ihrem Elternteil nichts sagen kann.",
    bridgeTitle: "Was Sie wirklich brauchen, ist eine Brücke.",
    bridgeDescription:
      "Die postMessage-API ermöglicht es iframe und Hostseite, sicher zu kommunizieren, über Origins hinweg. Sie definieren ein Protokoll. Sie validieren Origins. Jede Nachricht hat einen Typ. Das ist VibeFrame.",
  },
  bridge: {
    title: "Die postMessage-Brücke",
    diagramParent: "Elternseite",
    diagramBridge: "postMessage-Protokoll",
    diagramIframe: "Sandbox-iframe",
    parentToIframe: "Eltern → iframe",
    iframeToParent: "iframe → Eltern",
    parentMessages: "init, Auth-Token, Theme, Vorausfüllung, Zurück navigieren",
    iframeMessages:
      "bereit, Größe geändert, schließen, Erfolg, Fehler, navigieren, Auth erforderlich",
    description:
      "Jede Nachricht hat das Präfix vf:. Die Elternbrücke validiert den Origin, bevor sie irgendetwas verarbeitet. Der iframe wird nie im Kontext der Hostseite ausgeführt.",
  },
  displayModes: {
    title: "Anzeigemodi und Auslöser",
    modesTitle: "Vier Anzeigemodi",
    inline: {
      name: "Inline",
      description:
        "Bettet direkt in ein DOM-Element ein. Passt sich automatisch der Höhe an.",
    },
    modal: {
      name: "Modal",
      description:
        "Zentriertes Overlay mit Hintergrund. Erscheint über der Seite.",
    },
    slideIn: {
      name: "Slide In",
      description:
        "Gleitet von rechts herein. Gut für Formulare oder sekundäre Inhalte.",
    },
    bottomSheet: {
      name: "Bottom Sheet",
      description: "Gleitet von unten herauf. Standard-Mobil-Muster.",
    },
    triggersTitle: "Sieben Auslöser-Typen",
    triggers: {
      immediate: "Sofort - wird geladen, sobald die Seite lädt",
      scroll:
        "Scroll - wird ausgelöst, wenn der Nutzer einen Prozentsatz der Seite gescrollt hat",
      time: "Zeit - wird nach N Millisekunden ausgelöst",
      exitIntent:
        "Exit Intent - wird ausgelöst, wenn die Maus den Viewport nach oben verlässt",
      click:
        "Klick - wird ausgelöst, wenn ein bestimmtes Element geklickt wird",
      hover: "Hover - wird beim Mouseover eines Selektors ausgelöst",
      viewport: "Viewport - wird basierend auf der Bildschirmgröße ausgelöst",
    },
    frequencyTitle: "Anzeigehäufigkeit",
    frequency:
      "immer, einmal-pro-Sitzung, einmal-pro-Tag, einmal-pro-Woche, einmal-pro-Nutzer. Client-seitig mit localStorage durchgesetzt. Kein Server-Roundtrip.",
  },
  embed: {
    title: "Zwei Script-Tags. Fertig.",
    description:
      "Portiert. Jeder Endpoint wird einbettbar. Jedes Widget ist jetzt ein erstklassiger Bürger auf jeder Website.",
    twoScriptTags: "Zwei Script-Tags. Fertig.",
    codeCaption:
      "Der vollständige Einbettungscode für ein Kontaktformular von unbottled.ai",
    adminDescription:
      "Das Admin-Panel generiert dies für Sie. Endpoint auswählen, Anzeigemodus wählen, Auslöser wählen. Kopieren. Überall einfügen.",
  },
  vibeSense: {
    title: "Der Nebeneffekt, den ich nicht geplant hatte",
    paragraph1:
      "Als ich VibeFrame in next-vibe portierte, erkannte ich, dass nicht nur Formulare einbettbar wurden. Die UI jedes Endpoints ist einbettbar. Einschließlich Vibe Sense Graph-Visualisierungen.",
    paragraph2:
      "Ein Live-Lead-Funnel-Graph von der Plattform - mit echten Daten, Live-Indikatoren - als Widget auf einer externen Seite gerendert. Das ist kein Screenshot. Das sind keine statischen Exporte. Die Daten aktualisieren sich. Der Graph reagiert.",
    paragraph3:
      "Die Architektur, die ich gebaut habe, um Drittanbieter-Widgets sicher einzubetten, erwies sich auch als Architektur, um jedem Endpoint eine öffentlich zugängliche iframe-Präsenz zu geben. Das ist das Ding mit dem Aufbau der richtigen Abstraktion. Sie tut mehr als geplant.",
  },
  federated: {
    title: "Föderiertes Einbetten",
    description:
      "Jede Integration in VibeFrame kann auf eine andere serverUrl zeigen. Das bedeutet, Sie können Widgets von mehreren next-vibe-Instanzen auf der gleichen Seite einbetten. Kein gemeinsames Backend. Keine gemeinsame Datenbank.",
    codeCaption:
      "Mehrere Instanzen, eine Hostseite, null gemeinsame Infrastruktur",
    principle:
      "Die Definition reist mit dem Widget. Der Server, dem der Endpoint gehört, besitzt das Rendering.",
  },
  skills: {
    title: "Skills: sowohl Persona als auch Tool-Konfiguration",
    intro:
      "Ich möchte Ihnen erzählen, wie sich Skills in dieser Plattform entwickelt haben, weil das gleiche Muster gilt.",
    userPerspective: "Nutzerperspektive",
    aiPerspective: "KI-Perspektive",
    userDescription:
      "Ein Skill ist eine Persona. Ein Tutor, ein Programmierer, ein Geschichtenerzähler. Jeder Skill hat einen Namen, einen System-Prompt, eine Stimme, eine Persönlichkeit.",
    aiDescription:
      "Ein Skill ist ein Skill-Set. Jeder Skill deklariert, auf welche Tools er Zugriff hat. Spezifische Endpoints in der Registry, mit Zod-validierten Eingaben und typisierten Ausgaben.",
    keyLine:
      "Der Nutzer sieht einen Skill. Die KI sieht eine Tool-Konfiguration.",
    activeToolsTitle: "Das activeTools-Array",
    activeToolsDescription:
      "Das ist die Enthüllung. Keine abstrakten Fähigkeiten, die in einer Markdown-Datei beschrieben werden. Das sind spezifische Endpoints, aufrufbar über die gleiche Tool-Schnittstelle wie alles andere.",
    composableTitle: "Kompositionsfähiges Denken",
    composableDescription:
      "Nicht ein großer Agent, der alles weiß. Eine Sammlung von Spezialisten mit klar begrenzten Fähigkeiten, orchestriert von einem Agenten, der weiß, welchen Spezialisten er rufen soll.",
    bothAtOnce: "Ein Skill ist beides gleichzeitig.",
  },
  close: {
    title: "Was diese zwei Dinge gemeinsam haben",
    vibeFrame:
      "VibeFrame macht die Plattform überall einbettbar. Jeder Endpoint, jedes Widget, jede UI - zwei Script-Tags, und es ist auf jeder Website. Die Präsenz der Plattform erstreckt sich über ihre eigene Domain hinaus.",
    skills:
      "Skills machen die Plattform kompositionsfähig. Jede Reasoning-Aufgabe, jede Fähigkeitsdomäne - zum richtigen Skill routen, das richtige Modell mit den richtigen Tools bekommen.",
    together:
      "Zusammen: Ihre Plattform kann überall erscheinen und über alles nachdenken.",
    finalLine:
      "Ich konnte es diesen Kollegen nie zeigen. Aber ich zeige es Ihnen.",
    github: "Auf GitHub ansehen",
    githubCode: "git clone https://github.com/techfreaque/next-vibe",
  },
};
