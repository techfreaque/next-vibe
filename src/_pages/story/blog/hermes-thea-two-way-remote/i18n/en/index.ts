export const translations = {
  meta: {
    title: "Hermes and Thea: two-way remote threads - {{appName}}",
    description:
      "Your local AI and your cloud AI now run threads for each other in both directions. No API key on the instance that runs the turn? The caller takes the loop back and finishes it.",
    category: "Hermes & Thea",
    imageAlt: "Hermes and Thea - two connected next-vibe instances",
    keywords:
      "Hermes, Thea, next-vibe, remote threads, self-hosted AI, reverse websocket, API key fallback, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Hermes & Thea",
    readTime: "6 min read",
    title: "Two AIs. One conversation. Both directions.",
    subtitle:
      "Hermes runs on your machine. Thea runs on a server. Now either one can hand a thread to the other - and a missing API key no longer kills the turn.",
  },
  intro: {
    p1: "next-vibe runs anywhere: on your laptop, on a VPS, on both at once. Connect two instances and they become one system. We call ours Hermes and Thea.",
    p2: "This release closes the loop: remote threads now run in both directions, and the instance without a provider key no longer blocks anything.",
  },
  who: {
    title: "Meet the pair",
    intro: "Same codebase. Different jobs.",
    hermes: {
      label: "Local",
      title: "Hermes",
      body: "Runs on your own computer. Sits next to your files, your terminal and your coding agents. Your daily driver.",
    },
    thea: {
      label: "Cloud",
      title: "Thea",
      body: "Runs on a server. Always online, reachable from anywhere. Watches the platform and delegates work.",
    },
    note: "Each instance owns its own data and tasks. The connection relays events between them - nothing more, nothing less.",
  },
  twoWay: {
    title: "Threads now cross in both directions",
    intro:
      "Remote-folder and private threads execute on the other instance - from Thea to Hermes and from Hermes to Thea.",
    p1: "Put a thread in a remote folder and the instance on the other side runs the full AI turn: model, system prompt, tools. You keep writing where you are. The conversation mirrors back to you.",
    stepsTitle: "One turn, end to end",
    step1Title: "You write",
    step1Body: "A message in a remote thread on Hermes.",
    step2Title: "The connection relays it",
    step2Body:
      "Over one persistent WebSocket, or a direct HTTP call when the peer is publicly reachable.",
    step3Title: "Thea runs the loop",
    step3Body: "With her model, her prompt, her tools.",
    step4Title: "Tools go where they live",
    step4Body:
      "A tool that exists only on Hermes is called back on Hermes. The result returns to Thea's loop.",
    step5Title: "The turn lands on both sides",
    step5Body: "The finished conversation syncs back to your mirror.",
  },
  keyless: {
    title: "No API key? The turn still finishes.",
    intro:
      "The instance that runs a turn needs the model provider's API key. Not every instance has one.",
    p1: "Before an instance takes over a turn, it checks for the provider key on its own node. Missing? It fails fast with a clear marker - it does not hang, and it does not half-write the thread.",
    p2: "The calling side recognises the marker, rolls back its relay bookkeeping and runs the loop itself. The remote's prompt and tools still apply; tool calls round-trip back over the connection.",
    calloutTitle: "Inference-provider mode needs no key at all.",
    calloutBody:
      "Use the connected instance as your model provider and your side never touches a provider key. The connection is the model pipe.",
    scenarioTitle: "Who runs the loop?",
    scenario1Label: "Remote has the key",
    scenario1Body: "The remote runs the turn. Tools round-trip back.",
    scenario2Label: "Remote has no key",
    scenario2Body:
      "Remote fails fast. The caller runs the turn with the remote's prompt and tools.",
    scenario3Label: "Inference-provider mode",
    scenario3Body:
      "The provider instance runs the model. The caller needs no key.",
  },
  underTheHood: {
    title: "Under the hood",
    intro: "For the people who read the diff.",
    transport:
      "Transport is negotiated at connect time, never configured by hand. The target pings the initiator with an authenticated health check (5 seconds max). Reachable: direct HTTP. Behind NAT: the hidden side opens one outbound WebSocket and every relay multiplexes over it.",
    reconnect:
      "The connector reconnects with exponential backoff from 1 to 30 seconds and re-reads the connection on every retry. This release hardens that path.",
    fixesTitle: "Also in this release",
    fix1: "Stale-lead warning: a frame addressed to a lead this instance no longer knows is dropped with a warning instead of silently - re-authenticating the connection fixes it.",
    fix2: "Database timestamps in UTC, pooled Postgres and PGlite alike, so default-stamped rows sort correctly across instances.",
    fix3: "The stream writer seeds the thread id, so peers no longer drop events with an empty thread id.",
    fix4: "Revival turns sync with the peer, so tool results backfilled in place reach the mirror.",
    codeCaption: "The marker a keyless receiver sends back:",
  },
  tryIt: {
    title: "Try it",
    p1: "Self-host an instance, then add the connection under Admin → Remote Connections. Only admins can create one; the other side gets its entry automatically.",
  },
  cta: {
    title: "Run your own Hermes.",
    subtitle:
      "Self-host next-vibe on your machine, connect it to a server, and let them share the work.",
    selfHost: "Self-host guide",
    github: "Read the code",
  },
};
