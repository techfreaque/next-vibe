export const translations = {
  meta: {
    title: "Your AI hands the job to Claude Code - {{appName}}",
    description:
      "The coding-agent tool lets your AI delegate real code changes to Claude Code or OpenCode - headless, or as a live session in a real terminal window that reports back when it's done. Now across instances.",
    category: "Coding Agent",
    imageAlt: "Interactive coding agent - Claude Code in a terminal window",
    keywords:
      "coding agent, Claude Code, OpenCode, AI terminal, MCP complete-task, self-hosted AI, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Coding Agent",
    readTime: "5 min read",
    title: "Your AI opens a terminal and hands the job to Claude Code.",
    subtitle:
      "Chat AIs talk about code. Coding agents change it. The coding-agent tool connects the two - and in interactive mode you watch the work happen in a real terminal window.",
  },
  intro: {
    p1: "You ask your AI to fix a failing test. It can explain the fix. It cannot edit your repo, run the suite and iterate until green. Claude Code and OpenCode can.",
    p2: "The coding-agent tool hands the task to one of them, on the machine where the code lives, and brings the result back into your conversation.",
  },
  modes: {
    title: "Two modes",
    intro: "Pick fire-and-collect or watch-and-steer.",
    batch: {
      label: "Default",
      title: "Batch",
      body: "Runs headless. Collects everything the agent prints and returns it in the conversation. Stops after 30 minutes.",
    },
    interactive: {
      label: "Watch and steer",
      title: "Interactive",
      body: "Opens a real terminal window with a live session. Follow along, answer its questions, redirect it. No time limit - the result lands in your thread when the session reports back.",
    },
  },
  handBack: {
    title: "How the result finds its way back",
    intro:
      "The terminal session is a separate process. Here is how its answer still lands in the right thread.",
    step1Title: "Your AI calls the tool",
    step1Body: "With your prompt and interactive mode switched on.",
    step2Title: "A tracked task is created",
    step2Body: "The thread waits for that task - not for the terminal.",
    step3Title: "A terminal window opens",
    step3Body:
      "Terminal on macOS, your $TERMINAL or the first emulator found on Linux, a fresh PowerShell console on Windows.",
    step4Title: "The agent gets its marching orders",
    step4Body:
      "The prompt carries one extra line: when done, call complete-task on this instance's MCP server with this task id.",
    step5Title: "The result lands in your thread",
    step5Body:
      "complete-task delivers the output and the conversation resumes.",
    codeCaption: "The line appended to every interactive Claude Code prompt:",
  },
  whatsNew: {
    title: "New: it works across instances",
    intro:
      "Thea in the cloud can now ask Hermes on your machine to run a coding session.",
    item1:
      "On the remote instance the session runs as a tracked background task, so nothing blocks while you work in the terminal.",
    item2:
      "When the session reports through complete-task, the real result is relayed back to the instance that asked.",
    item3:
      "On Windows it opens a real console window. The command is written to a PowerShell script first, so prompts with quotes, braces or newlines survive intact.",
    item4:
      "A session launched by the local machine may report on any task its own instance owns.",
    item5:
      "No live channel to report back on? Interactive mode falls back to batch, so the caller still gets an answer.",
  },
  tryIt: {
    title: "Try it",
    p1: "The tool is admin-only and lives on self-hosted instances: it runs a coding CLI with full permissions inside your project folder. You need Claude Code or OpenCode installed and signed in on that machine.",
    p2: "Then ask in chat - or call it straight from the terminal:",
  },
  cta: {
    title: "Give your AI hands.",
    subtitle:
      "Self-host next-vibe, sign in to Claude Code once, and let your AI ship code changes on its own machine.",
    selfHost: "Self-host guide",
    framework: "Explore next-vibe",
  },
};
