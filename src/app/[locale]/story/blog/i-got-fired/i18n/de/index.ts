import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Ich wurde gefeuert. Das hier hab ich stattdessen gebaut. - next-vibe",
    description:
      "Eine Sandbox-Widget-Engine, die zur Rendering-Hälfte von Remote-Tool-Ausführung wurde. Jeder next-vibe-Endpoint - egal auf welchem Server - ist jetzt ein interaktives Live-Widget, einbettbar überall.",
    category: "VibeFrame",
    imageAlt: "VibeFrame - Remote-Tool-Ausführung & Sandbox-Widget-Rendering",
    keywords:
      "VibeFrame, Remote-Tool-Ausführung, föderierte Widgets, iframe, postMessage, next-vibe, einbettbar, TypeScript",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "VibeFrame",
    readTime: "11 Min. Lesezeit",
    title: "Ich wurde gefeuert. Das hier hab ich stattdessen gebaut.",
    subtitle:
      "Eine Widget-Engine, gebaut in der Freizeit nach der Arbeit - SSR+CSR, unter 15 KB, schneller und funktionsreicher als die Version vom Tagesjob. Sechs Monate lag sie auf meiner Festplatte. Dann brauchte next-vibe genau das.",
    quote: "Ich wollte sie meinem Team zeigen. Dann wurde ich gefeuert.",
  },
  origin: {
    title: "Die Entstehungsgeschichte",
    paragraph1:
      "Mein Tagesjob hatte ein Widget-Problem. Andere Websites haben unser JavaScript eingebunden, um ein Widget anzuzeigen - ein Formular, eine Chat-Blase, ein Dashboard-Panel. Das Script war langsam, aufgebläht, lahm beim Laden. Drittanbieter-Seiten, die es eingebunden haben, haben das deutlich gespürt. In meiner Freizeit hab ich angefangen, einen Ersatz zu bauen.",
    paragraph2:
      "Der Prototyp wurde besser als erwartet. SSR- und CSR-Support - SSR für Geschwindigkeit, CSR für Interaktivität. Unter 15 KB gesamt. Schneller als die Tagesjob-Version. Mehr Features. Komplett reaktiv, komplett typsicher. Ein sauberes postMessage-Protokoll zwischen iframe und Hostseite. Kein geteilter State. Trigger-System, Anzeigemodi, Frequenzsteuerung. Ich wollte es meinem Team zeigen. Dann wurde ich gefeuert.",
    paragraph3:
      "Die Codebase lag dann etwa sechs Monate auf meiner Festplatte. Dann wurde mir klar, wofür next-vibe sie wirklich brauchte: nicht nur Formulare - sondern die vollständige interaktive UI eines Tools, das auf einem Remote-Server läuft, in einer Sandbox, auf jeder Seite. Das ist Remote-Tool-Ausführung mit Live-UI.",
  },
  problem: {
    title: "Das Problem mit Script-Tags",
    paragraph1:
      "Wenn du Drittanbieter-Inhalte mit einem nackten Script-Tag einbindest, zahlst du doppelt. Performance: Das Script muss laden, parsen und ausführen, bevor irgendetwas gerendert wird. Wenn der Drittanbieter-Server langsam ist, wartet deine Seite. Und Sicherheit: Das Script hat vollen Zugriff auf die Seite - DOM, Cookies, localStorage, Event-Listener. Wenn es fehlerhaft ist, geht deine Seite kaputt. Wenn es bösartig ist, sind deine Nutzer gefährdet.",
    paragraph2:
      "Die sichere Alternative ist ein iframe. Aber iframes kommunizieren standardmäßig nicht mit der Elternseite. Resize-Events bubblen nicht hoch. Formular-Submits propagieren nicht. Am Ende hast du eine isolierte Box, die ihrem Parent nichts mitteilen kann.",
    bridgeTitle: "Was du wirklich brauchst, ist eine Brücke.",
    bridgeDescription:
      "Die postMessage-API ermöglicht sichere Kommunikation zwischen iframe und Hostseite, über Origins hinweg. Du definierst ein Protokoll. Du validierst Origins. Jede Nachricht hat einen Typ. Das ist VibeFrame.",
  },
  bridge: {
    title: "Die postMessage-Brücke",
    diagramParent: "Elternseite",
    diagramBridge: "postMessage-Protokoll",
    diagramIframe: "Sandbox-iframe",
    parentToIframe: "Eltern → iframe",
    iframeToParent: "iframe → Eltern",
    parentMessages: "init, Auth-Token, Theme, Vorausfüllung, Zurücknavigieren",
    iframeMessages:
      "bereit, Größenänderung, schließen, Erfolg, Fehler, navigieren, Auth erforderlich",
    description:
      "Jede Nachricht hat das Präfix vf:. Die Elternbrücke validiert den Origin, bevor sie irgendetwas verarbeitet. Der iframe wird nie im Kontext der Hostseite ausgeführt.",
  },
  displayModes: {
    title: "Anzeigemodi und Auslöser",
    modesTitle: "Vier Anzeigemodi",
    inline: {
      name: "Inline",
      description:
        "Bettet sich direkt in ein DOM-Element ein. Passt die Höhe automatisch an.",
    },
    modal: {
      name: "Modal",
      description:
        "Zentriertes Overlay mit Hintergrund. Erscheint über der Seite.",
    },
    slideIn: {
      name: "Slide In",
      description:
        "Gleitet von rechts rein. Gut für Formulare oder sekundäre Inhalte.",
    },
    bottomSheet: {
      name: "Bottom Sheet",
      description: "Gleitet von unten rein. Standard-Mobile-Pattern.",
    },
    triggersTitle: "Sieben Auslöser-Typen",
    triggers: {
      immediate: "Sofort - wird geladen, sobald die Seite lädt",
      scroll:
        "Scroll - wird ausgelöst, wenn der Nutzer einen bestimmten Prozentsatz der Seite gescrollt hat",
      time: "Zeit - wird nach N Millisekunden ausgelöst",
      exitIntent:
        "Exit Intent - wird ausgelöst, wenn die Maus den Viewport nach oben verlässt",
      click:
        "Klick - wird ausgelöst, wenn ein bestimmtes Element angeklickt wird",
      hover: "Hover - wird bei Mouseover eines Selektors ausgelöst",
      viewport: "Viewport - wird basierend auf der Bildschirmgröße ausgelöst",
    },
    frequencyTitle: "Anzeigehäufigkeit",
    frequency:
      "immer, einmal-pro-Sitzung, einmal-pro-Tag, einmal-pro-Woche, einmal-pro-Nutzer. Client-seitig per localStorage durchgesetzt. Kein Server-Roundtrip.",
  },
  embed: {
    title: "Zwei Script-Tags. Fertig.",
    description:
      "Jeder Endpoint wird einbettbar. Das Tool läuft auf seinem eigenen Server. Das Widget rendert in einer Sandbox auf deiner Seite. Volle Funktionalität, kein geteilter State.",
    twoScriptTags: "Zwei Script-Tags. Fertig.",
    codeCaption:
      "Der vollständige Einbettungscode für ein Kontaktformular von {{appName}}",
    orScriptTag: "Oder als einfacher Script-Tag für jede beliebige Website:",
    adminDescription:
      "Das Admin-Panel generiert den Code für dich. Endpoint auswählen, Anzeigemodus wählen, Auslöser wählen. Kopieren. Überall einfügen.",
  },
  vibeSense: {
    title: "Kein Nebeneffekt. Der eigentliche Punkt.",
    paragraph1:
      "Als ich VibeFrame in next-vibe portiert hab, war der erste echte Einsatz nicht, ein Kontaktformular auf irgendeiner externen Seite einzubetten. Es war Remote-Tool-Ausführung innerhalb der Plattform selbst - die vollständige interaktive Widget-UI eines beliebigen Endpoints in einer Sandbox rendern, damit sich verteilte Tools wie ein System anfühlen.",
    paragraph2:
      "Echte Daten. Live-Indikatoren. Ein Vibe Sense Graph reagiert auf das, was auf dem Server passiert. Das ist kein Screenshot und kein statischer Export. Das Tool läuft. VibeFrame rendert seine Widget-UI in einer Sandbox, wo immer du sie brauchst - innerhalb der Plattform, auf einem Dashboard oder auf jeder anderen Seite.",
    paragraph3:
      "Dann hat die Architektur geklickt. VibeFrame war nicht nur eine Möglichkeit, Formulare auf Drittanbieter-Seiten einzubetten. Es war die Rendering-Hälfte von Remote-Tool-Ausführung - das fehlende Puzzleteil, das ein verteiltes Tool-System wie eine einzige zusammenhängende Plattform aussehen lässt.",
  },
  federated: {
    title: "Föderiertes Einbetten",
    description:
      "Jede VibeFrame-Integration kann auf eine andere serverUrl zeigen. Das heißt: Du kannst Widgets von mehreren next-vibe-Instanzen auf derselben Seite einbetten. Kein gemeinsames Backend. Keine gemeinsame Datenbank.",
    codeCaption:
      "Mehrere Instanzen, eine Hostseite, null geteilte Infrastruktur",
    principle:
      "Die Definition reist mit dem Widget. Der Server, dem der Endpoint gehört, besitzt das Rendering.",
  },
  skills: {
    title: "Die Aufruf-Hälfte",
    intro:
      "VibeFrame übernimmt das Rendering. Die Tool-Registry übernimmt den Aufruf. Du verbindest Remote-Instanzen von next-vibe – jede mit einem Namen wie hermes, thea oder einem eigenen Alias. Deren Endpoints werden neben deinen lokalen Tools verfügbar. Ein einheitliches Tool-Set.",
    discovery:
      "Die KI nutzt tool-help, um jeden verfügbaren Endpoint zu entdecken – lokal und remote. Sie sieht die komplette Registry: Namen, Beschreibungen, typisierte Ein- und Ausgaben. Beim Aufruf von execute-tool leitet die Plattform an die richtige Instanz weiter. Der KI ist egal, wo ein Tool lebt.",
    control:
      "Du behältst die Kontrolle. Pinne die Tools an, die du sehen willst, deaktiviere die, die du nicht brauchst. Gleiche Verwaltung für lokale und Remote-Endpoints – kein Unterschied in der Konfiguration.",
    keyLine:
      "Instanzen verbinden. Die KI entdeckt die Tools. Du entscheidest, welche du nutzt.",
    skillsTitle: "Skills: eine Persona-Ebene",
    skillsDescription:
      "Darüber legen Skills eine Persona. Ein Skill ist ein Preset – ein Name, ein System-Prompt, eine Stimme, eine Persönlichkeit, und optional ein eingeschränktes Tool-Set. Der Nutzer wählt einen Tutor, einen Programmierer, einen Geschichtenerzähler. Unter der Haube ist es dieselbe Registry, dieselben Endpoints, dieselben execute-tool-Aufrufe.",
    userPerspective: "Nutzerperspektive",
    aiPerspective: "KI-Perspektive",
    userDescription:
      "Ein Skill ist eine Persona. Ein Tutor, ein Programmierer, ein Geschichtenerzähler. Jeder hat einen Namen, eine Stimme, eine Persönlichkeit. Du wählst einen und fängst an zu reden.",
    aiDescription:
      "Ein Skill ist ein Konfigurations-Preset. Er kann einschränken, welche Tools sichtbar sind, bestimmte Endpoints anpinnen oder die volle Registry offenlassen. Dieselbe execute-tool-Schnittstelle, nur eingegrenzt.",
  },
  remoteExecution: {
    title: "Remote-Tool-Ausführung",
    paragraph1:
      "Hier treffen VibeFrame und die Tool-Registry aufeinander. Wenn eine KI execute-tool mit einem Remote-Endpoint aufruft, leitet next-vibe den Aufruf an die Zielinstanz weiter. Die Instanz führt das Tool aus und gibt das Ergebnis zurück. Soweit Standard.",
    paragraph2:
      "Aber jeder Endpoint in next-vibe hat auch ein Widget – eine typisierte, voll ausgestattete UI-Komponente, die weiß, wie sie die Ein- und Ausgaben des Tools rendert. Wenn die Remote-Instanz öffentlich erreichbar ist, rendert VibeFrame das echte Widget in einem Sandbox-iframe, mit Kommunikation zum Server des Tools über postMessage. Volle Interaktivität, Live-Daten, echte UI.",
    paragraph3:
      "Wenn die Instanz nicht öffentlich ist – hinter einer Firewall, in einem privaten Netzwerk – fällt die Plattform auf Definition-getriebene UI zurück. Die Endpoint-Definition enthält genug Metadaten (Feldtypen, Labels, Validierungsregeln), um lokal eine funktionale Oberfläche zu rendern, ohne jemals das Frontend des Remote-Servers zu erreichen. So oder so funktioniert das Tool. Die UI passt sich an.",
    diagramAI: "KI-Agent",
    diagramExecute: "execute-tool",
    diagramRemote: "Remote-Instanz",
    diagramVibeFrame: "VibeFrame",
    diagramWidget: "Sandbox-Widget-UI",
    diagramAILabel: "ruft Tool auf",
    diagramRemoteLabel: "führt aus, gibt Ergebnis zurück",
    diagramWidgetLabel: "rendert volle UI in Sandbox",
    callout:
      "Der Server, der das Tool besitzt, besitzt auch die UI. VibeFrame rendert sie überall, wo du sie brauchst. So sieht Remote-Tool-Ausführung mit vollständigem Frontend aus.",
  },
  close: {
    title: "Was sie gemeinsam haben",
    paragraph:
      "VibeFrame und die Tool-Registry lösen dasselbe Problem von entgegengesetzten Seiten. Die Tool-Registry übernimmt den Aufruf - jeder Endpoint auf jeder Instanz, aufrufbar von jeder KI. VibeFrame übernimmt das Rendering - jedes Widget von jeder Instanz, einbettbar auf jeder Seite. Remote-Tool-Ausführung ist die Brücke: das Tool aufrufen, seine UI rendern.",
    together:
      "Ein verteiltes Tool-System mit einem verteilten Rendering-System. Das ist next-vibe.",
    finalLine:
      "Ich konnte es diesen Kollegen nie zeigen. Aber dir zeig ich es.",
    github: "Auf GitHub ansehen",
    githubCode: "git clone https://github.com/techfreaque/next-vibe",
  },
};
