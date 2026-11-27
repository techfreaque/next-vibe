export const translations = {
  rules: {
    checked:
      "Read at each provider's official docs and policies on {{date}}. Scroll sideways on mobile.",
    columns: {
      name: "Service",
      defaults: "Filter by default",
      off: "Turning it off",
      models: "Uncensored models",
      weights: "Your own weights",
      rules: "Content rules that stay",
    },
    rows: {
      azure: {
        defaults: "On for every model except Whisper.",
        off: "Only if approved. Customers can loosen to High only. Full control needs an application, open only to customers managed by a Microsoft account team or an eligible program.",
        models: "None found in the catalog.",
        weights: "Not checked for this guide.",
        rules:
          "Code of Conduct bans sexually explicit content and erotic or romantic chatbots, filters on or off.",
      },
      bedrock: {
        defaults:
          "No Bedrock filter unless you attach a Guardrail. CSAM detection is always on.",
        off: "Leave out the guardrail ID. The model's own refusals stay.",
        models: "None in the catalog.",
        weights:
          "Custom Model Import: Llama, Mistral, Qwen and gpt-oss architectures, billed per Custom Model Unit minute.",
        rules:
          "Responsible AI Policy bars circumventing safety filters and non-consensual sexual imagery.",
      },
      vertex: {
        defaults:
          "Off by default for gemini-3.5-flash and later. Core harms stay blocked.",
        off: "Set thresholds to OFF. Gemini's trained refusals stay.",
        models: "None in the open model list.",
        weights: "Model Garden self-deploy on vLLM or TGI containers.",
        rules:
          "Prohibited Use Policy bans sexually explicit content and circumventing safety filters.",
      },
      together: {
        defaults: "No filter switch documented on the pages we read.",
        off: "Not applicable.",
        models: "None in the serverless list.",
        weights:
          "Dedicated endpoints from $5.49 per H100 hour. Uploads must be fine-tunes of a supported architecture.",
        rules: "Terms bar obscene content and pornography.",
      },
      us: {
        defaults:
          "You pick the model: mainstream, open or uncensored. No filter layer on top.",
        off: "Choose an uncensored model and confirm you are 18+ once.",
        models: "{{uncensored}} live right now.",
        weights: "Not supported. We serve a curated catalog.",
        rules:
          "Uncensored models unlock after a one-time 18+ consent. The model provider's terms still apply.",
      },
    },
    sourceLabels: {
      filters: "{{name}}: filter docs",
      access: "{{name}}: access rules",
      policy: "{{name}}: usage policy",
      privacy: "{{name}}: data handling",
      pricing: "{{name}}: pricing",
      import: "{{name}}: own weights",
    },
    sourcesTitle: "Sources",
  },
  prices: {
    columns: {
      model: "Model",
      provider: "Provider",
      input: "Input / 1M",
      output: "Output / 1M",
    },
    us: "{{appName}}",
    live: "live price",
    source: "source",
    note: "USD per 1M tokens. Competitor prices read on {{date}} from their public model lists. Ours is read live from our registry, our {{markup}}% markup included. Where a cheaper route is configured we use it, and the price shown follows.",
  },
  alts: {
    heading: "{{number}}. {{name}}",
    strength: "Best part:",
    catch: "Catch:",
    sources: "Sources:",
    versusLink: "{{appName}} vs {{name}}: full comparison",
    openRouter: {
      what: "Gateway with 477 models behind one key. No markup on inference, a 5.5% fee on credit purchases (5% for crypto).",
      strength:
        "Bring your own provider keys free up to $25,000 a month, zero data retention routing per request, USDC payments.",
      catch:
        "17 roleplay or uncensored-tuned models, zero ids with abliterated or uncensored in the name. No Anthropic Messages endpoint in its API overview.",
    },
    venice: {
      what: "Chat app plus an OpenAI-compatible API. Own fine-tunes Venice Uncensored 1.2 ($0.20 / $0.90) and Venice Role Play Uncensored, next to abliterated GLM, DeepSeek, Gemma and Qwen models.",
      strength:
        "Image, video, voice and music in the same API. Encrypted and TEE model options. Pay per request from a USDC wallet with x402, no account.",
      catch:
        "No native Anthropic Messages endpoint, Claude Code needs a local proxy. Terms forbid reselling access. The free tier is 10 text prompts a day.",
    },
    nanoGpt: {
      what: "Pay-per-use gateway with 610 models, about 54 of them abliterated or uncensored ids.",
      strength:
        "OpenAI chat completions, Responses and Anthropic Messages. Bitcoin and Monero, no account needed, pay-as-you-go resale allowed.",
      catch:
        "A noisy catalog with many near-duplicate uncensored ids. The product is built gateway first.",
    },
    openUncensored: {
      what: "API router for abliterated weights: 58 text, 20 image and 3 video models on a prepaid key. Your key is your account.",
      strength:
        "No commission on provider prices. GLM 5.3 Flash Uncensored from $0.12 / $0.50. OpenAI, Responses and Anthropic formats on one base URL.",
      catch:
        "No free tier, crypto not mentioned, request metadata kept up to two years. No web chat, only a desktop app.",
    },
    refuseless: {
      what: "API-only host of refusal-removed open weights: four abliterated models with 1M context, plus a few stock ones.",
      strength:
        "DeepSeek V4.1 Flash abliterated at $0.12 / $0.45 and GLM 5.3 Flash abliterated at $0.12 / $0.50. Chat completions, Responses, Anthropic Messages and embeddings.",
      catch:
        "No chat interface. Its privacy and terms pages blocked our reader, so read them yourself before you ship.",
    },
    abliterationHosts: {
      what: "Two more abliterated APIs. NEAR AI Cloud runs models in hardware enclaves: Qwen 3.8 27B Abliterated at $0.04 / $1.35. abliteration.ai sells its own abliterated brands from $1 / $2.",
      strength:
        "NEAR: no application, no identity checks, verifiable attestation. abliteration.ai: prompts processed in memory and not stored by default, EU region, OpenAI and Anthropic formats.",
      catch:
        "Small catalogs. NEAR mentions no Anthropic format. abliteration.ai costs more than Refuseless or NEAR for similar weights.",
    },
    togetherFireworks: {
      what: "Fast inference clouds for stock open models. Together serves 24 serverless chat models with no uncensored ones. Fireworks lists Dolphin, Hermes and Dobby Unhinged models, serverless status not confirmed.",
      strength:
        "Together: OpenAI, Responses and Anthropic Messages, self-serve zero data retention. Fireworks: no prompt logs by default for open models, up to 6,000 requests a minute.",
      catch:
        "Together's terms bar obscene content and pornography. Fireworks makes you warrant your input contains no nudity or sexually suggestive content.",
    },
    selfHost: {
      what: "Run abliterated weights yourself. Ollama and LM Studio on a workstation, vLLM or TGI on your own GPUs. All of them speak the OpenAI chat completions format.",
      strength:
        "Prompts never leave your machines. Any abliterated GGUF or safetensors model you can download. Local use costs nothing beyond hardware.",
      catch:
        "You run the GPUs, the updates and the uptime. Frontier-size models need datacenter hardware.",
    },
  },
};
