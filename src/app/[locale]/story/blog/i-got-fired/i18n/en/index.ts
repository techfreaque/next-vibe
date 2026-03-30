export const translations = {
  meta: {
    title: "I got fired. This is what I built instead. - next-vibe",
    description:
      "A sandboxed widget engine that turned into the rendering half of remote tool execution. Any next-vibe endpoint — on any server — is now a live, interactive widget you can embed anywhere.",
    category: "VibeFrame",
    imageAlt: "VibeFrame - Remote Tool Execution & Sandboxed Widget Rendering",
    keywords:
      "VibeFrame, remote tool execution, federated widgets, iframe, postMessage, next-vibe, embeddable, TypeScript",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "VibeFrame",
    readTime: "11 min read",
    title: "I got fired. This is what I built instead.",
    subtitle:
      "A widget engine built in spare time after work — SSR+CSR, under 15kb, faster and more featured than the day job version. It sat on my hard drive for six months. Then next-vibe needed it.",
    quote: "I was about to show it to my team. Then I got fired.",
  },
  origin: {
    title: "The origin story",
    paragraph1:
      "My day job had a widget problem. Other sites would import our JavaScript to display a widget — a form, a chat bubble, a dashboard panel. The script was non-performant, bloated, slow to load. Third-party sites importing it were visibly paying the cost. In my spare time after work, I started building a replacement.",
    paragraph2:
      "The prototype came out cleaner than I expected. SSR and CSR support — SSR for speed, CSR for interactivity. Under 15kb total. Faster than the day job version. More features. Fully reactive, fully typesafe. A proper postMessage protocol between the iframe and the host page. No shared state. Trigger system, display modes, display frequency controls. I was about to show it to my team. Then I got fired.",
    paragraph3:
      "The codebase sat on my hard drive for about six months. Then I realized what next-vibe actually needed it for: not just forms — but rendering the full interactive UI of a tool running on a remote server, inside a sandbox, on any page. That is remote tool execution with a live UI.",
  },
  problem: {
    title: "The problem with script tags",
    paragraph1:
      "When you embed third-party content with a bare script tag, you pay in two ways. Performance: the script has to load, parse, and execute before anything renders. If the third-party server is slow, your page waits. And security: that script has full access to the page — the DOM, cookies, localStorage, event listeners. If it's buggy, your page breaks. If it's malicious, your users are exposed.",
    paragraph2:
      "The standard safe alternative is an iframe. But iframes do not communicate with the parent page by default. Resize events do not bubble. Form submissions do not propagate. The host page cannot inject data. You end up with a dumb isolated box that cannot tell its parent anything.",
    bridgeTitle: "What you actually need is a bridge.",
    bridgeDescription:
      "The postMessage API lets the iframe and the host page communicate safely, across origins. You define a protocol. You validate origins. Every message has a type. The iframe can say: ready, height changed, form submitted. The parent can say: here is auth data, switch to dark mode, pre-fill this field. That is VibeFrame.",
  },
  bridge: {
    title: "The postMessage bridge",
    diagramParent: "Parent Page",
    diagramBridge: "postMessage Protocol",
    diagramIframe: "Sandboxed iframe",
    parentToIframe: "Parent → iframe",
    iframeToParent: "iframe → Parent",
    parentMessages: "init, auth token, theme, pre-fill data, navigate back",
    iframeMessages:
      "ready, resize, close, success, error, navigate, auth required",
    description:
      "Every message is prefixed vf:. The parent bridge validates the origin before processing anything. The iframe never executes in the host page context. The communication is fully controlled.",
  },
  displayModes: {
    title: "Display modes and triggers",
    modesTitle: "Four display modes",
    inline: {
      name: "Inline",
      description:
        "Embeds directly in a DOM element. Auto-resizes with content.",
    },
    modal: {
      name: "Modal",
      description: "Centered overlay with backdrop. Appears above the page.",
    },
    slideIn: {
      name: "Slide In",
      description:
        "Slides in from the right. Good for forms or secondary content.",
    },
    bottomSheet: {
      name: "Bottom Sheet",
      description: "Slides up from the bottom. Standard mobile pattern.",
    },
    triggersTitle: "Seven trigger types",
    triggers: {
      immediate: "Immediate - mounts as soon as the page loads",
      scroll:
        "Scroll - fires when the user has scrolled a percentage of the page",
      time: "Time - fires after N milliseconds",
      exitIntent:
        "Exit intent - fires when the mouse leaves the viewport through the top",
      click: "Click - fires when a specific element is clicked",
      hover: "Hover - fires on mouse enter of a selector",
      viewport: "Viewport - fires based on screen size",
    },
    frequencyTitle: "Display frequency",
    frequency:
      "always, once-per-session, once-per-day, once-per-week, once-per-user. Enforced client-side with localStorage. No server round-trip.",
  },
  embed: {
    title: "Two script tags. Done.",
    description:
      "Any endpoint becomes embeddable. The tool runs on its own server. The widget renders in a sandbox on your page. Full features, zero shared state.",
    twoScriptTags: "Two script tags. Done.",
    codeCaption: "The complete embed code for a contact form from unbottled.ai",
    adminDescription:
      "The admin panel generates this for you. Pick endpoint, pick display mode, pick trigger. Copy. Paste anywhere.",
  },
  vibeSense: {
    title: "Not a side effect. The point.",
    paragraph1:
      "When I ported VibeFrame into next-vibe, the first thing I embedded was not a contact form. It was a Vibe Sense graph — a live data visualization from the platform, rendering as a widget on an external page.",
    paragraph2:
      "Real data. Live indicators. The graph reacts to what is happening on the remote server. This is not a screenshot or a static export. The tool is running on its server. VibeFrame renders its widget UI in a sandbox wherever you need it.",
    paragraph3:
      "That is when the architecture clicked. VibeFrame was not just a way to embed forms. It was the rendering half of remote tool execution — the missing piece that makes a distributed tool system feel like a single coherent platform.",
  },
  federated: {
    title: "Federated embedding",
    description:
      "Each integration in VibeFrame can point to a different serverUrl. That means you can embed widgets from multiple next-vibe instances on the same page. No shared backend. No shared database. Each instance serves its own widgets. The host page is just a composition layer.",
    codeCaption:
      "Multiple instances, one host page, zero shared infrastructure",
    principle:
      "The definition travels with the widget. The server that owns the endpoint owns the render.",
  },
  skills: {
    title: "Skills: the invocation half",
    intro:
      "VibeFrame handles rendering. Skills handle invocation. A skill declares exactly which tools an AI has access to — specific endpoints in the registry, with Zod-validated inputs and typed outputs. The user picks a persona. The AI gets a bounded tool set.",
    userPerspective: "User perspective",
    aiPerspective: "AI perspective",
    userDescription:
      "A skill is a persona. A tutor, a coder, a storyteller, an uncensored writer. Each skill has a name, a system prompt, a voice, a personality.",
    aiDescription:
      "A skill is a tool configuration. Each skill declares which endpoints it can call — including tools on remote instances. Zod-validated inputs. Typed outputs. No ambiguity.",
    keyLine: "User sees a persona. The AI sees a tool configuration.",
    activeToolsTitle: "The activeTools array",
    activeToolsDescription:
      "Not abstract capabilities described in prose. These are specific endpoints — callable via the same execute-tool interface, whether they run locally or on a remote next-vibe instance across the network.",
    composableTitle: "Tools can live anywhere",
    composableDescription:
      "A tool call in next-vibe is not limited to the local server. The execute-tool system routes calls to whichever instance owns that endpoint. The calling AI does not need to know where it runs. It calls, the right server answers.",
    bothAtOnce: "A skill is both at once.",
  },
  remoteExecution: {
    title: "Remote tool execution",
    paragraph1:
      "Here is the thing that connects VibeFrame and the tool registry. When an AI calls execute-tool with a remote endpoint, next-vibe routes the call to the target instance. That instance executes the tool, returns the result. Standard enough.",
    paragraph2:
      "But every endpoint in next-vibe also has a widget — a typed, fully-featured UI component that knows how to render that tool's inputs and outputs. VibeFrame can take that widget and render it in a sandboxed iframe on any page, communicating with the tool's server via postMessage.",
    paragraph3:
      "Put those two together: you can call a tool on a remote server and render its full interactive UI in a sandbox on your page. The tool runs where it lives. The UI appears where you need it. No shared state. No security compromise. Full features.",
    diagramAI: "AI Agent",
    diagramExecute: "execute-tool",
    diagramRemote: "Remote Instance",
    diagramVibeFrame: "VibeFrame",
    diagramWidget: "Sandboxed Widget UI",
    diagramAILabel: "calls tool",
    diagramRemoteLabel: "executes, returns result",
    diagramWidgetLabel: "renders full UI in sandbox",
    callout:
      "The server that owns the tool owns the UI. VibeFrame renders it anywhere you need it. This is what remote tool execution looks like with a full frontend.",
  },
  close: {
    title: "What they have in common",
    paragraph:
      "VibeFrame and the tool registry solve the same problem from opposite ends. The tool registry handles invocation — any endpoint on any instance, callable from any AI. VibeFrame handles rendering — any widget from any instance, embeddable on any page. Remote tool execution is the bridge between them: call the tool, render its UI.",
    together:
      "A distributed tool system with a distributed rendering system. That is next-vibe.",
    finalLine:
      "I never got to show it to those colleagues. But I am showing it to you.",
    github: "View on GitHub",
    githubCode: "git clone https://github.com/techfreaque/next-vibe",
  },
};
