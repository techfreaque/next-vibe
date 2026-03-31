import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Ich wurde gefeuert. Das habe ich stattdessen gebaut. - next-vibe",
    description:
      "Eine Sandbox-Widget-Engine, die zur Rendering-Hälfte von Remote-Tool-Ausführung wurde. Jeder next-vibe-Endpoint - auf jedem Server - ist jetzt ein live, interaktives Widget, das überall eingebettet werden kann.",
    category: "VibeFrame",
    imageAlt: "VibeFrame - Remote-Tool-Ausführung & Sandbox-Widget-Rendering",
    keywords:
      "VibeFrame, Remote-Tool-Ausführung, föderierte Widgets, iframe, postMessage, next-vibe, einbettbar, TypeScript",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "VibeFrame",
    readTime: "11 Min. Lesezeit",
    title: "Ich wurde gefeuert. Das habe ich stattdessen gebaut.",
    subtitle:
      "Eine Widget-Engine, gebaut in der Freizeit nach der Arbeit - SSR+CSR, unter 15 KB, schneller und funktionsreicher als die Version des Tagesjobs. Sie lag sechs Monate auf meiner Festplatte. Dann brauchte next-vibe sie.",
    quote: "Ich wollte es meinem Team zeigen. Dann wurde ich gefeuert.",
  },
  origin: {
    title: "Die Entstehungsgeschichte",
    paragraph1:
      "Mein Tagesjob hatte ein Widget-Problem. Andere Websites importierten unser JavaScript, um ein Widget anzuzeigen - ein Formular, eine Chat-Blase, ein Dashboard-Panel. Das Skript war leistungsschwach, aufgebläht, langsam beim Laden. Drittanbieter-Seiten, die es importierten, zahlten sichtbar den Preis. In meiner Freizeit nach der Arbeit begann ich, einen Ersatz zu bauen.",
    paragraph2:
      "Der Prototyp wurde besser als erwartet. SSR- und CSR-Unterstützung - SSR für Geschwindigkeit, CSR für Interaktivität. Unter 15 KB gesamt. Schneller als die Tagesjob-Version. Mehr Funktionen. Vollständig reaktiv, vollständig typsicher. Ein ordentliches postMessage-Protokoll zwischen iframe und Hostseite. Kein gemeinsamer Zustand. Trigger-System, Anzeigemodi, Anzeigefrequenzsteuerung. Ich wollte es meinem Team zeigen. Dann wurde ich gefeuert.",
    paragraph3:
      "Die Codebasis lag etwa sechs Monate auf meiner Festplatte. Dann erkannte ich, wofür next-vibe sie wirklich brauchte: nicht nur Formulare - sondern das Rendern der vollständigen interaktiven UI eines Tools, das auf einem Remote-Server läuft, in einer Sandbox, auf jeder Seite. Das ist Remote-Tool-Ausführung mit einer Live-UI.",
  },
  problem: {
    title: "Das Problem mit Script-Tags",
    paragraph1:
      "Wenn Sie Drittanbieter-Inhalte mit einem nackten Script-Tag einbetten, zahlen Sie auf zwei Weisen. Leistung: Das Skript muss laden, parsen und ausführen, bevor irgendetwas gerendert wird. Wenn der Drittanbieter-Server langsam ist, wartet Ihre Seite. Und Sicherheit: Dieses Skript hat vollen Zugriff auf die Seite - das DOM, Cookies, localStorage, Event-Listener. Wenn es fehlerhaft ist, bricht Ihre Seite. Wenn es bösartig ist, sind Ihre Nutzer gefährdet.",
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
      "Jeder Endpoint wird einbettbar. Das Tool läuft auf seinem eigenen Server. Das Widget rendert in einer Sandbox auf Ihrer Seite. Volle Funktionen, kein gemeinsamer Zustand.",
    twoScriptTags: "Zwei Script-Tags. Fertig.",
    codeCaption:
      "Der vollständige Einbettungscode für ein Kontaktformular von unbottled.ai",
    adminDescription:
      "Das Admin-Panel generiert dies für Sie. Endpoint auswählen, Anzeigemodus wählen, Auslöser wählen. Kopieren. Überall einfügen.",
  },
  vibeSense: {
    title: "Kein Nebeneffekt. Der eigentliche Punkt.",
    paragraph1:
      "Als ich VibeFrame in next-vibe portierte, war das erste, was ich einbettete, kein Kontaktformular. Es war ein Vibe Sense Graph - eine Live-Datenvisualisierung von der Plattform, als Widget auf einer externen Seite gerendert.",
    paragraph2:
      "Echte Daten. Live-Indikatoren. Der Graph reagiert auf das, was auf dem Remote-Server passiert. Das ist kein Screenshot oder ein statischer Export. Das Tool läuft auf seinem Server. VibeFrame rendert seine Widget-UI in einer Sandbox, wo immer Sie sie brauchen.",
    paragraph3:
      "Dann klickte die Architektur. VibeFrame war nicht nur eine Möglichkeit, Formulare einzubetten. Es war die Rendering-Hälfte von Remote-Tool-Ausführung - das fehlende Stück, das ein verteiltes Tool-System wie eine einzige kohärente Plattform wirken lässt.",
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
    title: "Skills: die Aufruf-Hälfte",
    intro:
      "VibeFrame übernimmt das Rendering. Skills übernehmen den Aufruf. Ein Skill deklariert genau, welche Tools eine KI hat - spezifische Endpoints in der Registry, mit Zod-validierten Eingaben und typisierten Ausgaben. Der Nutzer wählt eine Persona. Die KI erhält einen begrenzten Tool-Satz.",
    userPerspective: "Nutzerperspektive",
    aiPerspective: "KI-Perspektive",
    userDescription:
      "Ein Skill ist eine Persona. Ein Tutor, ein Programmierer, ein Geschichtenerzähler. Jeder Skill hat einen Namen, einen System-Prompt, eine Stimme, eine Persönlichkeit.",
    aiDescription:
      "Ein Skill ist eine Tool-Konfiguration. Jeder Skill deklariert, welche Endpoints er aufrufen kann - einschließlich Tools auf Remote-Instanzen. Zod-validierte Eingaben. Typisierte Ausgaben. Keine Mehrdeutigkeit.",
    keyLine:
      "Der Nutzer sieht eine Persona. Die KI sieht eine Tool-Konfiguration.",
    activeToolsTitle: "Das activeTools-Array",
    activeToolsDescription:
      "Keine abstrakten Fähigkeiten, die in Prosa beschrieben werden. Das sind spezifische Endpoints - aufrufbar über dieselbe execute-tool-Schnittstelle, ob sie lokal oder auf einer Remote-next-vibe-Instanz über das Netzwerk laufen.",
    composableTitle: "Tools können überall leben",
    composableDescription:
      "Ein Tool-Aufruf in next-vibe ist nicht auf den lokalen Server beschränkt. Das execute-tool-System leitet Aufrufe an die Instanz weiter, die diesen Endpoint besitzt. Die aufrufende KI muss nicht wissen, wo er läuft. Sie ruft an, der richtige Server antwortet.",
    bothAtOnce: "Ein Skill ist beides gleichzeitig.",
  },
  remoteExecution: {
    title: "Remote-Tool-Ausführung",
    paragraph1:
      "Hier ist das, was VibeFrame und die Tool-Registry verbindet. Wenn eine KI execute-tool mit einem Remote-Endpoint aufruft, leitet next-vibe den Aufruf an die Zielinstanz weiter. Diese Instanz führt das Tool aus und gibt das Ergebnis zurück. Standard genug.",
    paragraph2:
      "Aber jeder Endpoint in next-vibe hat auch ein Widget - eine typisierte, vollständig ausgestattete UI-Komponente, die weiß, wie sie die Eingaben und Ausgaben dieses Tools rendert. VibeFrame kann dieses Widget nehmen und es in einem Sandbox-iframe auf jeder Seite rendern, kommunizierend mit dem Server des Tools über postMessage.",
    paragraph3:
      "Setzen Sie diese beiden zusammen: Sie können ein Tool auf einem Remote-Server aufrufen und seine vollständige interaktive UI in einer Sandbox auf Ihrer Seite rendern. Das Tool läuft, wo es lebt. Die UI erscheint, wo Sie sie brauchen. Kein gemeinsamer Zustand. Kein Sicherheitskompromiss. Volle Funktionen.",
    diagramAI: "KI-Agent",
    diagramExecute: "execute-tool",
    diagramRemote: "Remote-Instanz",
    diagramVibeFrame: "VibeFrame",
    diagramWidget: "Sandbox-Widget-UI",
    diagramAILabel: "ruft Tool auf",
    diagramRemoteLabel: "führt aus, gibt Ergebnis zurück",
    diagramWidgetLabel: "rendert volle UI in Sandbox",
    callout:
      "Der Server, der das Tool besitzt, besitzt die UI. VibeFrame rendert sie überall, wo Sie sie brauchen. So sieht Remote-Tool-Ausführung mit einem vollständigen Frontend aus.",
  },
  close: {
    title: "Was sie gemeinsam haben",
    paragraph:
      "VibeFrame und die Tool-Registry lösen dasselbe Problem von entgegengesetzten Seiten. Die Tool-Registry übernimmt den Aufruf - jeder Endpoint auf jeder Instanz, aufrufbar von jeder KI. VibeFrame übernimmt das Rendering - jedes Widget von jeder Instanz, einbettbar auf jeder Seite. Remote-Tool-Ausführung ist die Brücke zwischen ihnen: das Tool aufrufen, seine UI rendern.",
    together:
      "Ein verteiltes Tool-System mit einem verteilten Rendering-System. Das ist next-vibe.",
    finalLine:
      "Ich konnte es diesen Kollegen nie zeigen. Aber ich zeige es Ihnen.",
    github: "Auf GitHub ansehen",
    githubCode: "git clone https://github.com/techfreaque/next-vibe",
  },
};
