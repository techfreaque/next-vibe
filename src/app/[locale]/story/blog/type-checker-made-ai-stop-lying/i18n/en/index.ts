export const translations = {
  meta: {
    title: "I built a type checker that made AI stop lying to me — next-vibe",
    description:
      "AI will use `any` to escape a type error. It will add eslint-disable. It will lie to you. Here's how we fixed the feedback loop with @next-vibe/checker.",
    category: "TypeScript",
    imageAlt: "Type checker that made AI stop lying",
    keywords:
      "TypeScript, type checker, AI coding, ESLint, Oxlint, any type, type safety, Claude Code, next-vibe",
  },
  hero: {
    label: "TypeScript",
    readTime: "10 min read",
    title: "I built a type checker that made AI stop lying to me",
    subtitle:
      "AI will use `any` to escape a type error. It will add eslint-disable. It will lie to you. Here's how we fixed the feedback loop.",
    quoteAiLies:
      "AI doesn't lie to you because it wants to. It lies to you because you let it.",
  },
  problem: {
    title: "The broken feedback loop",
    description:
      'Ask Claude Code to add a feature. It does. Run ESLint — it passes. Run TypeScript — errors. Ask Claude Code to fix the TypeScript. It does. Run ESLint — now that fails. Back and forth. Three iterations. The AI is confident at every step. Each time: "That\'s fixed."',
    fixLabel: "It was never fixed.",
    fixDescription:
      "It was whack-a-mole with a tool that runs one linter at a time and never sees the full picture.",
    escapeHatch:
      'The AI fixes the TypeScript error by writing one line and tells you: "The type error is resolved."',
    smokeDetector:
      "Yes. Technically. The way covering your smoke detector with tape resolves a fire alarm.",
    introducingChecker: "That is what I built @next-vibe/checker to stop.",
  },
  anyProblem: {
    title: "The `any` problem",
    subtitle: "Why 98% type safety is the same as 0%",
    graphDescription:
      "TypeScript's type system is a graph. Every type flows from definition to usage. If you have a function that returns `string`, the caller knows it's a string. The whole chain is checked.",
    holeInGraph: "`any` is a hole in the graph.",
    holeDescription:
      "A variable typed as `any` tells the compiler: stop checking here. Not just for this variable — for everything that touches this variable. The error doesn't show up at the `any`. It shows up three files away when some unrelated refactor breaks an assumption that was never enforced.",
    zeroErrors:
      "Zero TypeScript errors means nothing if you have 47 unchecked `any` usages.",
    zeroErrorsDescription:
      "You don't have a type-safe codebase. You have a codebase where the compiler gave up in 47 places and you called it passing.",
    doubleAssertion:
      "`as unknown as Whatever` is worse. It's a double type assertion. You're telling the compiler: I know this is wrong, and I'm asserting my way through it anyway. This is AI's favorite escape hatch.",
    bannedTitle: "The banned patterns in this codebase:",
    bannedNotWarnings:
      "Not warnings. Errors. The check fails. Claude Code has to fix the root cause or it can't ship.",
    psychologyNote:
      "The reason these are errors and not warnings is psychological as much as technical. AI models treat warnings as optional. Errors close the loop.",
    infectionDiagramTitle: "The `any` infection diagram",
    infectionDiagramSubtitle:
      "One `any` type spreads through the graph, corrupting downstream type inference",
    infectionUnsafe: "unsafe",
    counterZeroErrors: "TypeScript errors",
    counterAnyUsages: "`any` usages",
  },
  checker: {
    title: "Introducing @next-vibe/checker",
    subtitle: "One command. Three tools. No escape hatches.",
    mcpIntegrationTitle: "MCP integration",
    commandDescription:
      "That's the command. One command. It runs three tools in parallel and gives you one unified error list.",
    oxlintDescription:
      "Rust-based linter. Hundreds of rules. Runs in milliseconds even on large codebases.",
    eslintDescription:
      "The things Oxlint doesn't do yet: React hooks lint, React compiler rules, import sorting.",
    tsDescription:
      "Full type checking. Not just the file you're editing — the whole graph.",
    parallelNote:
      "All three run in parallel. You get one unified error list. You fix until it's clean.",
    timingNote:
      "On this codebase — 4,400 files — full TypeScript takes about 12 seconds. Oxlint is under a second. ESLint is a few seconds. Parallel brings it down to 12.",
    mcpNote:
      "It also exposes a `vibe-check mcp` command that starts an MCP server with a `check` tool. The AI doesn't run a shell command — it calls a tool that returns structured error data. Pagination built in. Filtering by path.",
    architectureTitle: "The checker architecture",
    architectureSubtitle:
      "Three tools running in parallel, one unified error list",
    parallel: "in parallel",
    unifiedErrors: "Unified error list",
    unifiedErrorsDescription: "One output. Fix until clean.",
  },
  plugins: {
    title: "Custom plugins",
    subtitle: "The linter as documentation",
    linterIsDocumentation:
      "The linter is the documentation. And it's enforced.",
    jsxPluginTitle: "jsx-capitalization plugin",
    jsxPluginDescription:
      "It flags lowercase JSX elements and the error message tells you exactly what to import instead:",
    jsxPluginInsight:
      "I didn't write documentation telling Claude Code to use `next-vibe-ui`. I didn't add it to the system prompt. The first time Claude Code writes `<div>` in a component, the checker errors. The error message contains the exact import path. Claude Code reads the error, applies the fix, and remembers the convention.",
    restrictedSyntaxTitle: "restricted-syntax plugin",
    restrictedSyntaxDescription: "It bans three things:",
    throwBanTitle: "`throw` statements",
    throwBanDescription:
      'The error message says: "Use proper `ResponseType<T>` patterns instead." Claude Code hits this, reads it, looks up `ResponseType`, and adopts the correct error-handling pattern for the entire rest of the task.',
    unknownBanTitle: "bare `unknown` type",
    unknownBanDescription:
      "\"Replace 'unknown' with existing typed interface. Align with codebase types rather than converting or recreating.\" This stops Claude Code from writing generic type escape hatches.",
    objectBanTitle: "bare `object` type",
    objectBanDescription:
      "`object` is almost always wrong. Either you know the shape — write the interface — or you have `Record<string, SomeType>`. Raw `object` is a signal that the AI gave up.",
    bannedPatternsTitle: "Banned patterns",
    bannedPatternsSubtitle:
      "Each banned pattern is caught at check time. The error message tells AI exactly what to do instead.",
    bannedLabel: "BANNED",
    correctLabel: "CORRECT",
  },
  demo: {
    title: "Live demo: the 3-round pattern",
    subtitle:
      "Watch Claude Code hit the checker three times before finding the correct type",
    round1Title: "Round 1 — AI writes `any`",
    round1Description:
      'Ask Claude Code: "Write a helper function that takes a raw API response object and extracts the data field. The response can have different shapes — use whatever type makes this work."',
    round1Result: "Claude Code writes the easy solution:",
    round1Error:
      "2 errors found. Both `any`. Claude Code can see this through the MCP tool.",
    round2Title: "Round 2 — AI tries `unknown`",
    round2Description:
      "Watch what it does next. This is the important part. It tries the next escape route:",
    round2Result: "The checker knows that trick.",
    round2Error:
      "3 errors. `unknown` is banned too. The error message tells Claude Code exactly what to do instead: find the existing typed interface.",
    round3Title: "Round 3 — AI finds the real type",
    round3Description:
      "Now Claude Code does what it should have done first. It looks at how existing API responses are typed in this codebase. It finds `ResponseType<T>`.",
    round3Result: "Zero errors. And the function is now actually correct.",
    round3Insight:
      "The checker didn't write it. But the checker prevented the shortcut, twice, until Claude Code had to engage with the actual problem.",
    errorTitle: "Check output",
    passTitle: "Check passed",
  },
  endpoint: {
    title: "The endpoint connection",
    subtitle: "One Zod schema — four downstream consumers",
    description:
      "Every endpoint has a definition file. That file contains one Zod schema for the request and one for the response.",
    schemaBecomes:
      "The `schema` key is a Zod validator. That same Zod schema becomes:",
    webApiValidation: "The validation rule on the web API endpoint",
    reactHookTypes: "The TypeScript type for the React hook's input parameter",
    cliFlagsDescription:
      "The `--name` flag in the CLI with min/max constraints applied",
    aiToolSchema: "The parameter description in the AI tool schema",
    driftProblem:
      "This is where drift usually kills you. You update the API. You forget to update the AI tool schema. The AI is calling the endpoint with the old parameter names. It fails silently.",
    oneSchemaSolution: "When there's one schema, there's nothing to sync.",
    typecheckedNote:
      "And because the TypeScript checker runs on this too — if you change the schema in a way that breaks the inferred type downstream, you get a compiler error. The AI tool schema is type-checked. The CLI flags are type-checked. The React hook is type-checked.",
    statsTitle: "This codebase by the numbers",
    stat245: "245 endpoints",
    stat0any: "Zero `any`",
    stat0unknown: "Zero `unknown` casts",
    stat0tsExpect: "Zero `@ts-expect-error`",
    statNote: "Not by convention. By the checker.",
    diagramTitle: "One Zod schema — four consumers",
    diagramSubtitle: "Change the schema once, everything updates automatically",
    diagramSource: "definition.ts (Zod schema)",
    diagramWebApi: "Web API validation",
    diagramHookTypes: "React hook types",
    diagramCliFlags: "CLI flags",
    diagramAiSchema: "AI tool schema",
    diagramSameSchema: "same schema",
    diagramInferred: "inferred from schema",
    diagramGenerated: "generated from schema",
  },
  install: {
    title: "Get @next-vibe/checker",
    subtitle: "Works on any TypeScript project. Not just next-vibe.",
    installDescription:
      "The checker is available as a standalone npm package. It works on any TypeScript project — not just NextVibe. You don't need any other part of the framework.",
    thenRun: "Then run:",
    mcpTitle: "MCP integration",
    mcpDescription:
      "Add it to your Claude Code or Cursor MCP config. Now Claude Code calls `check` as a tool, not a shell command. Structured errors. Paginated. Filterable by path.",
    migrationNote:
      "On the npm page there's also a migration prompt. Copy it into Claude Code or Cursor and it will audit your codebase, configure the checker, and migrate you to the banned patterns.",
    openSourceNote:
      "It's open source. GPL-3.0 for the framework, MIT for the checker package.",
  },
  closing: {
    title: "Build the system so lying is impossible",
    beforeTitle: "Before:",
    beforeDescription:
      "AI-assisted development was a negotiation. Fix the lint. Oh, now the types broke. Fix the types. Now there's an `any` you didn't notice. Fix that. Run three separate tools. Get three separate opinions. Never sure if it's actually clean.",
    afterTitle: "After:",
    afterDescription:
      "One command. One failure mode. Either it passes or it doesn't. The AI knows exactly what it has to fix because the errors tell it exactly what's wrong and what to do instead. No negotiation.",
    finalQuote:
      "Build the system so lying is impossible. That's what a type checker is for.",
    ctaGitHub: "View on GitHub",
    ctaInstall: "Install @next-vibe/checker",
    backToBlog: "Back to blog",
  },
};
