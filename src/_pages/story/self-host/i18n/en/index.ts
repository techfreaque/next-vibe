export const translations = {
  meta: {
    title: "Self-host {{appName}} with next-vibe",
    category: "Self-hosting",
    description:
      "Run next-vibe on your own machine. Connect your {{appName}} account for cloud models and credits, or use your own provider keys.",
    imageAlt: "Self-host {{appName}} with next-vibe",
    keywords: "self-host, next-vibe, private AI, Docker, {{appName}}",
  },
  hero: {
    title: "Run next-vibe on your machine",
    subtitle:
      "Keep your chat history and files on hardware you control. Use your unbottled.ai account for models and credits, or connect directly to your own providers.",
  },
  account: {
    title: "Use your unbottled.ai account",
    intro:
      "Run the app yourself and use unbottled.ai for inference. Cloud models draw from your unbottled.ai credits. You can connect with a paid account and its email and password.",
    start: {
      title: "Start your local instance",
      body: "Install next-vibe, start it, and sign in with your local admin credentials. A subscription or purchased credits qualify the cloud account for remote connections.",
      signup: "Create an unbottled.ai account",
    },
    connect: {
      title: "Connect your cloud account",
      body: "If the chat opens the companion picker, close it for now. Expand Account in the chat sidebar. Open Admin Dashboard, select System Settings, then open Setup Wizard. Click Next until you reach AI Provider and find Unbottled AI Cloud. Keep https://unbottled.ai as the remote URL, enter your cloud email and password, choose what to sync, then select Sign In.",
    },
    privacy:
      "Turn off Memories, Documents, Skills, Favorites, and Threads to keep those records local. The wizard starts with the first four enabled. Cloud inference sends your prompt, relevant context, and any attachments you include to unbottled.ai for processing.",
    verify: {
      title: "Send a test message",
      body: "Return to your local chat and refresh. If the companion picker appears, choose a companion. Start a new private chat and select a model from the connected provider. The request runs on unbottled.ai under your cloud account.",
    },
    cli: {
      title: "Connect from the terminal",
      body: "With the source install running, use a second terminal in the same checkout. Replace the example email and password with your cloud credentials. The command turns off all five sync categories. Use the browser wizard if you want to keep your password out of shell history and process arguments.",
      diagnostics:
        "List the connections to check that the inference provider is active.",
    },
  },
  standalone: {
    title: "Run standalone with your own keys",
    intro:
      "Use your own provider account and pay the provider directly. You can run this setup without an unbottled.ai account.",
    start: {
      title: "Set up next-vibe",
      body: "Install next-vibe and prepare the local .env file. You can also use the Docker setup below.",
    },
    provider: {
      title: "Add a provider key",
      body: "For OpenRouter, add this line to .env and replace the placeholder with your key. See .env.example for other supported providers.",
      key: "Get an OpenRouter key",
    },
    verify: {
      title: "Start a chat",
      body: "Start the app, or restart it if it was already running. Sign in as your local admin, choose an available OpenRouter model, and send a message.",
    },
  },
  install: {
    title: "Install next-vibe",
    requirements:
      "Have Git, Node.js 22 or later, and Bun on your PATH. The source checkout uses Bun 1.4.4. The local setup below runs PostgreSQL in-process with PGlite, so Docker and a separate database server are optional.",
    checkout: {
      title: "Install in one command",
      body: "Run this in Bash or Zsh on Linux or macOS, or in PowerShell 7 on Windows. It clones the source, installs locked dependencies on a fresh checkout, and sets up the vibe command.",
      windows:
        "Linux is the supported target. The installer has macOS and Windows paths. For Windows, use a checkout path without spaces or run the Linux steps inside WSL if native setup fails.",
    },
    config: {
      title: "Configure local storage and sign-in",
      body: "Open .env in the checkout. Create it from .env.example if it is missing. Set the database URL below and choose your own VIBE_ADMIN_USER_EMAIL and VIBE_ADMIN_USER_PASSWORD. Use this development server on a private machine or network.",
      secrets:
        "Run this command twice. Set JWT_SECRET_KEY and CRON_SECRET to different outputs and keep both values across restarts.",
    },
    run: {
      title: "Start next-vibe",
      body: "Run this from the checkout and leave the terminal open. Open the localhost URL printed at startup, usually http://localhost:3000. On the sign-in page, use the local admin credentials you set in .env.",
    },
  },
  docker: {
    title: "Run with Docker Compose",
    intro:
      "Use the standalone Compose overlay on a Linux x86-64 host. It runs the app, PostgreSQL, Redis, and MinIO. You need Docker and a Compose release that supports !override and !reset. The app build can use about 8 GB of RAM.",
    config: {
      title: "Prepare the checkout and .env",
      body: "If you already cloned the source, reuse that checkout. Otherwise, run these commands.",
      env: "Copy .env.example to .env. Set your local admin credentials and both secrets as above, then apply these settings and generate a third hex secret for the database password. Set any standalone provider keys before starting. Pair your cloud account while the app URL is still localhost. For public access, set NEXT_PUBLIC_APP_URL to the address users open and configure HTTPS before exposing the app.",
    },
    run: {
      title: "Build the images and start the stack",
      body: "Compose builds the app and PostgreSQL images from the checkout. Once the app is up, open its configured URL, sign in as admin, and follow the account or standalone path above.",
    },
  },
  update: {
    title: "Update your instance",
    intro: "Back up .env, the database, and uploaded files before updating.",
    source: {
      title: "Source checkout",
      body: "Stop the local server with Ctrl+C. From the same checkout, pull the latest changes, install dependencies, and start it again. Startup applies pending migrations.",
    },
    docker:
      "From the same checkout, pull the source changes and rebuild the stack. Keep your .env and data directories in place.",
  },
  troubleshoot: {
    title: "Troubleshooting",
    path: {
      title: "The shell cannot find vibe",
      body: "Open a new terminal. If the command is still missing, run the bootstrap directly from the checkout.",
    },
    connect: {
      title: "The cloud connection fails",
      body: "Check the cloud email and password, confirm the account qualifies for remote connections, and leave the local app running. Use the standalone path if your cloud sign-in requires a two-factor code. Each paid customer account can connect up to three instances. Give an already connected machine a unique ID in Remote Connections before pairing the next one. If Setup Wizard gives a generic error, check the local server log or use the terminal connection command for the specific denial.",
    },
    models: {
      title: "The model picker is empty",
      body: "For cloud inference, verify that the connection is active and that you enabled Use as Inference Provider if you connected outside the wizard. For standalone use, check the key in .env, confirm the provider account has funds, and restart the app.",
    },
    credits: {
      title: "The local app reports insufficient credits",
      body: "Both setup paths check your local credit balance. In your local Admin Dashboard, open Users, select your local account, then choose Grant credits. This adds credits to your instance’s ledger. Your provider or unbottled.ai still bills the account you connected.",
    },
    docker: {
      title: "The container does not start",
      body: "Check the app log for the first error. If the app image build runs out of memory, give Docker more RAM or use the source checkout setup.",
    },
    issue: "Report a setup issue",
  },
};
