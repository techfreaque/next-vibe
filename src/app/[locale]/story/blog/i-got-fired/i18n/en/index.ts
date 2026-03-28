export const translations = {
  meta: {
    title: "I got fired. This is what I built instead. - next-vibe",
    description:
      "A federated widget engine built at a job that no longer exists. Now any next-vibe endpoint is embeddable anywhere in two script tags.",
    category: "VibeFrame",
    imageAlt: "VibeFrame - Federated Widget Engine",
    keywords:
      "VibeFrame, federated widgets, iframe, postMessage, next-vibe, embeddable, TypeScript",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "VibeFrame",
    readTime: "11 min read",
    title: "I got fired. This is what I built instead.",
    subtitle:
      "A federated widget engine built at a job that no longer exists. Now any next-vibe endpoint is embeddable anywhere in two script tags.",
    quote: "I was about to show it to my team. Then I got fired.",
  },
  origin: {
    title: "The origin story",
    paragraph1:
      "I spent three months building something at my day job that I never got to show anyone. The codebase I was working in was a disaster. Every time we needed to embed a third-party widget - a form, a chat bubble, a dashboard panel - it was the same story. Someone drops a script tag in a page, it starts reading cookies, intercepting clicks, injecting DOM nodes wherever it wants. No sandbox. No isolation. And when it breaks, good luck figuring out why.",
    paragraph2:
      "I built an alternative. A lightweight federated widget engine that could safely embed anything - any form, any UI, any tool - in a sandboxed iframe on any page. Proper postMessage protocol. No shared state between host and widget. Trigger system, display modes, the whole thing.",
    paragraph3:
      "I was about to show it to my team. Then I got fired. The codebase sat dead on my hard drive for months. Then I realized: the architecture was exactly what next-vibe needed.",
  },
  problem: {
    title: "The problem with script tags",
    paragraph1:
      "When you embed third-party content with a bare script tag, you have no sandbox. That script has full access to the page - the DOM, cookies, localStorage, event listeners, everything. If that script is buggy, your page breaks. If it's malicious, your users are exposed.",
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
      "Port it in. Any endpoint becomes embeddable. Any widget is now a first-class citizen on any website.",
    twoScriptTags: "Two script tags. Done.",
    codeCaption: "The complete embed code for a contact form from unbottled.ai",
    adminDescription:
      "The admin panel generates this for you. Pick endpoint, pick display mode, pick trigger. Copy. Paste anywhere.",
  },
  vibeSense: {
    title: "The side effect I did not plan",
    paragraph1:
      "When I ported VibeFrame into next-vibe, I realized it was not just forms that became embeddable. Any endpoint's UI is embeddable. Including Vibe Sense graph visualizations.",
    paragraph2:
      "A live lead funnel graph from the platform - with real data, live indicators - rendering as a widget on an external page. This is not a screenshot. It is not a static export. The data refreshes. The graph reacts.",
    paragraph3:
      "The architecture that I built to safely embed third-party widgets turned out to also be the architecture for giving every endpoint a public-facing iframe presence. That is the thing about building the right abstraction. It does more than you planned.",
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
    title: "Skills: both a persona and a tool configuration",
    intro:
      "I want to tell you about how skills in this platform evolved, because the same pattern applies.",
    userPerspective: "User perspective",
    aiPerspective: "AI perspective",
    userDescription:
      "A skill is a persona. A tutor, a coder, a storyteller, an uncensored writer. Each skill has a name, a system prompt, a voice, a personality.",
    aiDescription:
      "A skill is a skill set. Each skill declares which tools it has access to. Specific endpoints in the registry, with Zod-validated inputs and typed outputs.",
    keyLine: "User sees a skill. The AI sees a tool configuration.",
    activeToolsTitle: "The activeTools array",
    activeToolsDescription:
      "This is the reveal. Not abstract capabilities described in a markdown file. These are specific endpoints, callable from the same tool interface as everything else.",
    composableTitle: "Composable reasoning",
    composableDescription:
      "Not one big agent that knows everything. A collection of specialists with clearly bounded capabilities, orchestrated by an agent that knows which specialist to call.",
    bothAtOnce: "A skill is both at once.",
  },
  close: {
    title: "What these two things have in common",
    vibeFrame:
      "VibeFrame makes the platform embeddable anywhere. Any endpoint, any widget, any UI - two script tags, it is on any website. The platform's presence extends beyond its own domain.",
    skills:
      "Skills make the platform composable. Any reasoning task, any capability domain - route to the right skill, get the right model with the right tools. The platform's intelligence extends beyond a single conversation thread.",
    together:
      "Together: your platform can appear anywhere and reason about anything.",
    finalLine:
      "I never got to show it to those colleagues. But I am showing it to you.",
    github: "View on GitHub",
    githubCode: "git clone https://github.com/techfreaque/next-vibe",
  },
};
