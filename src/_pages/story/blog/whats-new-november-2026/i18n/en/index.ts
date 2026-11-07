export const translations = {
  meta: {
    title: "What's new: six months in one page - {{appName}}",
    description:
      "Stop means stop. Voice works on iPhone. Your AI runs across your machines. Self-hosting needs no Docker. And a test robot closed eight security holes. Everything since May.",
    category: "Product Update",
    imageAlt: "{{appName}} - November 2026 product update",
    keywords:
      "{{appName}}, product update, Hermes, Thea, PGlite, self-host, speech to text, E2E tests, security",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Product Update",
    readTime: "6 min read",
    title: "Six months in one page: faster, safer, runs anywhere.",
    subtitle:
      "Stop means stop. Voice works on iPhone. Your AI follows you across machines. Self-hosting needs no Docker. And a test robot closed eight security holes.",
  },
  intro: {
    lead: "Our last update was in May. Since then we tore the codebase down to the studs, rebuilt it flatter, and spent months fixing what real people hit in production.",
    p1: "No fluff list of 200 bullet points. Here is what you will actually feel - grouped by where you feel it.",
  },
  chat: {
    title: "Chat that obeys",
    intro: "The small things that made chatting feel slow or stubborn.",
    stop: {
      title: "Stop means stop",
      body: "Hit stop and tokens stop appearing that instant - no waiting for the server to tear down. Stop now also reaches incognito and logged-out chats, where it used to do nothing.",
    },
    input: {
      title: "Input sized to your model",
      body: "The message box knows how much room the selected model has left in this thread, instead of one flat limit for every model.",
    },
    reasoning: {
      title: "Models keep their train of thought",
      body: "Reasoning blocks are sent back to the model on the next turn instead of being stripped - so thinking models build on what they already worked out.",
    },
    queue: {
      title: "Type while it works",
      body: "Send messages while the AI is mid-answer - they queue up in order. Long tool runs compact their context mid-stream instead of hitting the wall.",
    },
  },
  voice: {
    title: "Voice that works everywhere",
    intro: "Speech-to-text got the attention it needed.",
    ios: {
      title: "iPhone and iPad fixed",
      body: "Safari on iOS suspended the audio engine, so dictation silently died. It now resumes properly.",
    },
    long: {
      title: "Record as long as you like",
      body: "Recordings are split into chunks, so dictation is no longer capped by one upload.",
    },
    windows: {
      title: "Windows fixed",
      body: "A run of fixes made speech-to-text work on Windows desktops.",
    },
  },
  agents: {
    title: "Your AI, across your machines",
    intro:
      "Thea runs in the cloud. Hermes runs on your computer. Now they truly work together.",
    twoWay: {
      title: "Two-way remote threads",
      body: "Hand a thread from the cloud to your machine or back, in both directions. If the other side has no API key, your side falls back and runs it locally.",
      link: "How Hermes and Thea talk",
    },
    coding: {
      title: "A coding agent you can watch",
      body: "Thea can start an interactive coding agent on your machine - a real console window you can see - tracked as a task, with the result reported back.",
      link: "Meet the coding agent",
    },
    tools: {
      title: "Sharper tools",
      body: "Better browser automation with device emulation, desktop tools on Windows, and SSH tools for every customer - not just admins.",
    },
  },
  selfHost: {
    title: "Self-hosting got easy",
    intro:
      "Running your own instance used to mean Docker and a C++ toolchain. Not anymore.",
    pglite: {
      title: "No Docker needed",
      body: "Point DATABASE_URL at a file and the server runs on an embedded Postgres (PGlite). Migrations and seeds just work.",
    },
    windows: {
      title: "Windows is first-class",
      body: "Months of Windows fixes: paths, file locks, user seeding, database functions. Clone, install, run.",
    },
    native: {
      title: "No compiler required",
      body: "Password hashing moved to prebuilt binaries - no node-gyp, no build tools. Same algorithm, existing hashes still valid.",
    },
    revive: {
      title: "Comes back on its own",
      body: "The production server restarts after a crash, and a database restart can no longer take the app down with it.",
    },
  },
  security: {
    title: "Safer by default",
    intro: "Security work you will never see - which is the point.",
    e2e: {
      title: "A robot tests every page",
      body: "60 end-to-end suites now drive the real pages in a real browser. They found and we closed eight security holes, from an open redirect to private files cached publicly.",
      link: "Read what it found",
    },
    patches: {
      title: "Patched base image",
      body: "Our container pulls the latest Alpine security patches, including the fix for CVE-2026-111497.",
    },
    toolCalls: {
      title: "Fewer broken tool calls",
      body: "When a model sends malformed tool-call JSON, it gets repaired instead of failing the whole turn.",
    },
  },
  cta: {
    title: "See it for yourself.",
    subtitle:
      "Every change above is live on {{appName}} today - and in the open-source code if you run your own.",
    chat: "Start chatting",
    selfHost: "Self-host it",
  },
};
