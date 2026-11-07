export const translations = {
  meta: {
    title: "A robot clicked every button. It found eight security holes.",
    description:
      "We built an end-to-end test framework that drives the real pages in a real browser - and covered every customer-facing endpoint. Here is what it caught.",
    category: "Engineering",
    imageAlt: "End-to-end tests driving {{appName}} in a real browser",
    keywords:
      "E2E testing, Playwright, security, SSRF, open redirect, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Engineering",
    readTime: "7 min read",
    title: "A robot clicked every button. It found eight security holes.",
    subtitle:
      "We stopped testing pieces and started testing pages. Real browser, real server, real clicks - on every endpoint a customer can touch.",
  },
  intro: {
    lead: "Our code passed type checks, lint and unit tests. It still shipped bugs. Not exotic ones - a reset form that ignored the confirmation password, invoice links that went nowhere, a feed that showed deleted threads.",
    p1: "Every one of those lived in the gap between the pieces. The function was fine. The page around it was not. So we built a test framework that only cares about one thing: what a customer actually sees and sends.",
  },
  why: {
    title: "Why test the real page?",
    intro:
      "Each layer of testing catches a different class of bug. Only the last one sees what your users see.",
    unit: {
      label: "Unit test",
      title: "Checks one function",
      body: "Fast and cheap. Blind to wiring: wrong URL, wrong field name, a button that never sends.",
    },
    api: {
      label: "API test",
      title: "Checks one request",
      body: "Proves the server answers. Never proves the page sends that request - or renders the reply.",
    },
    e2e: {
      label: "End-to-end",
      title: "Checks the whole trip",
      body: "Opens the page in Chromium, types like a person, clicks submit, reads the response off the wire. If it works here, it works for customers.",
    },
  },
  how: {
    title: "How the harness works",
    intro:
      "Playwright driven from bun test, built on top of next-vibe's endpoint definitions. The definition already knows every field - so the test doesn't need to.",
    step1: {
      title: "Open the real page",
      body: "The test opens the customer page - /user/login, /story/framework - not a test stub. It waits until React owns the form before typing.",
    },
    step2: {
      title: "Fill with typed values",
      body: "You pass values, not selectors. Field drivers read the definition and operate the visible UI - type, pick an option by its label, attach a file.",
    },
    step3: {
      title: "Capture the call off the wire",
      body: "Submit returns the truth: the request body, status and response. The harness asserts the request carried exactly what was typed.",
    },
    step4: {
      title: "Record once, replay forever",
      body: "Paid providers - AI models, image, music, video - are recorded per test on the first run and replayed after. No surprise bill, deterministic runs.",
    },
    step5: {
      title: "Report coverage",
      body: "A coverage report counts every public endpoint: one success and one rejection each. Gaps are visible, not guessed.",
    },
    codeCaption: "A full spec. No selectors, no mocks.",
  },
  numbers: {
    title: "The scoreboard",
    suites: "test suites",
    covered: "public endpoints fully covered",
    security: "security holes closed",
    note: "The remaining endpoints need paid provider keys for search, scraping and speech before they can be recorded.",
  },
  security: {
    title: "The security holes it found",
    intro:
      "None of these showed up in type checks or unit tests. All of them showed up the moment a real browser walked the real flow.",
    openRedirect: {
      title: "Open redirect on /track",
      body: "Anyone could craft a link that bounced through our domain to any site. External targets now need an HMAC signature.",
    },
    ssrf: {
      title: "SSRF via user-supplied URLs",
      body: "URLs you hand the AI could point at internal addresses. A guard now resolves DNS and checks every redirect hop.",
    },
    ssrCache: {
      title: "Server cache shared between requests",
      body: "The server-render query cache could carry one user's data into another page render. It is now isolated per request.",
    },
    systemPrompt: {
      title: "System-prompt debug read any thread",
      body: "A debug endpoint didn't check thread ownership. Now it does.",
    },
    publicFeed: {
      title: "Public feed listed hidden threads",
      body: "Hidden and deleted threads appeared in the public feed. They are filtered out.",
    },
    loginOptions: {
      title: "Login options leaked accounts",
      body: "The login options response revealed whether an email had an account. It no longer does.",
    },
    resetPassword: {
      title: "Reset ignored the confirmation",
      body: "The reset-password confirm step ignored the confirmation field. Mismatches are now rejected.",
    },
    privateFiles: {
      title: "Private files cached publicly",
      body: "Private files were served with Cache-Control: public, so shared caches could keep them. Now they are private.",
    },
  },
  broken: {
    title: "And the things that were just broken",
    intro: "Not dangerous - just quietly failing for real people:",
    items: {
      attachments:
        "Chat attachment URLs and client error reports returned 404.",
      permissions:
        "Root permissions were never fetched - customers couldn't post in Shared.",
      embed: "The embed widget mount was dead.",
      invoices: "Invoice email links returned 404.",
      models: "The models page was unusable.",
      music: "Music generation on OpenRouter failed.",
      fixtures: "Test fixture scope leaked paid live calls.",
      pglite:
        "Local PGlite databases returned the wrong rows from INSERT…RETURNING.",
      pagination: "Visitor pagination on /tools was broken.",
    },
    footer: "Plus a long tail of untranslated strings and widget fixes.",
  },
  closing: {
    title: "What this means for you",
    p1: "Every page you use to sign up, log in, pay, chat, generate or subscribe now has a test that opens it in a real browser and does what you do. When we change something, the robot walks it again before you do.",
    p2: "The framework ships with next-vibe. If you build on it, your endpoints get the same harness for free.",
  },
  cta: {
    title: "Read the harness. Use it on your own code.",
    subtitle:
      "The E2E framework is open source and part of next-vibe. One spec file per feature, colocated with the definition.",
    github: "View on GitHub",
    framework: "Explore next-vibe",
  },
};
