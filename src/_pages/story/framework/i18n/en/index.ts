export const translations = {
  meta: {
    title: "next-vibe Framework and unbottled.ai API | Developers",
    description:
      "See how one TypeScript endpoint powers web, CLI, MCP, native and AI tools. Run next-vibe locally or integrate the unbottled.ai API with your SDK.",
    category: "Developer tools",
    imageAlt: "next-vibe and unbottled.ai for developers",
    keywords:
      "next-vibe, TypeScript framework, MCP, unbottled.ai API, OpenAI, Anthropic",
  },
  hero: {
    title: "next-vibe for developers",
    subtitle:
      "A TypeScript framework where one `definition.ts` powers a web UI, a CLI command, an MCP tool, a native screen and an AI tool.",
    quickstart: "Run next-vibe locally",
  },
  example: {
    title: "Follow one real endpoint",
    intro:
      "The unbottled.ai contact form uses this endpoint. The excerpt shows how `definition.ts` validates the message and picks a widget. `route.ts` wires the contract to the repository.",
    source: "Browse the contact endpoint on GitHub",
    form: "Open the live form",
    web: {
      title: "Web UI",
      body: "The form on `/help` renders the shared widget, with a message textarea and a confirmation after sending.",
    },
    cli: {
      title: "CLI command",
      body: "`vibe contact-form` takes flags such as `--name` and `--message` from the request fields.",
    },
    mcp: {
      title: "MCP tool",
      body: "An MCP client calls `execute-tool` with `toolName: contact-form` and the same inputs.",
    },
    native: {
      title: "Native screen",
      body: "The Expo build can render the same widget with native inputs and a touch-friendly submit button.",
    },
    ai: {
      title: "AI tool",
      body: "An agent can call `contact-form` with the same `name` and `message` fields. The endpoint asks the user to confirm before it sends.",
    },
  },
  quickstart: {
    title: "Run it locally",
    intro:
      "Use Linux with Git, Bun, Node.js and Docker for the default PostgreSQL setup.",
    start:
      "`bun run dev` runs `vibe dev`, starts the local database, runs migrations and seeds it. Open the URL printed in the terminal and use the dev admin login to configure your AI provider.",
    pglite:
      'For a Docker-free start, set `DATABASE_URL="file:./data.db"` for `bun run dev` to use embedded PGlite.',
    github: "View the GitHub repository",
    selfHost: "Read the self-hosting guide",
  },
  api: {
    title: "Call the unbottled.ai API",
    intro:
      "Use your OpenAI or Anthropic SDK with the unbottled.ai base URL and an API key. The hosted API supports OpenAI Chat Completions and Responses and Anthropic Messages.",
    models:
      "Create a key, set `UNBOTTLED_API_KEY` in your shell and list the models available to your account.",
    request: "List models",
    docs: "Read the API reference",
    keys: "Manage API keys",
  },
  architecture: {
    title: "Under the hood",
    platform: {
      title: "Roles and platform markers",
      body: "User roles control who can execute an endpoint. Platform markers control where it runs. `AI_TOOL_OFF` removes it from AI tool use. `MCP_VISIBLE` adds it to the MCP server’s tool list.",
    },
    data: {
      title: "Zod, Drizzle and PostgreSQL",
      body: "Zod validates endpoint inputs and outputs and supplies the tool schemas. Repositories own persistence with Drizzle, with PostgreSQL tables and migrations tracked in the repo.",
    },
    realtime: {
      title: "Typed realtime events",
      body: "Endpoints declare event schemas and channel scopes. Clients subscribe over WebSocket to receive updates such as streamed tokens and task progress. Pub/sub can run in process or through Redis.",
    },
    remote: {
      title: "Remote instances",
      body: "Connected instances can run tools on a peer and sync data for enabled domains. Each peer enforces its own permissions. Connections support direct access or an outbound relay.",
    },
    maturity: {
      title: "What ships today",
      body: "next-vibe is open source under GPL-3.0 and runs unbottled.ai in production on Next.js. Local development defaults to TanStack Start and Vite. React Native and remote skill discovery are in beta.",
    },
  },
  code: {
    copy: "Copy code",
    copied: "Copied",
    wrap: "Wrap lines",
    terminal: "Terminal",
  },
};
