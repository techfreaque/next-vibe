export const translations = {
  meta: {
    title: "Uncensored Azure OpenAI Alternative: APIs Compared | {{appName}}",
    description:
      "Azure filters every model by default and bans erotic and romantic chatbots even with filters off. Compare {{appName}}, OpenRouter, Venice, NanoGPT, abliterated APIs, Bedrock, Vertex and self-hosting.",
    category: "Developer Guide",
    imageAlt: "Uncensored alternatives to Azure OpenAI, compared",
    keywords:
      "uncensored Azure OpenAI alternative, Azure OpenAI alternative, Azure OpenAI content filter off, Azure OpenAI without content filter, Azure modified content filtering, Azure abuse monitoring opt out, Azure OpenAI NSFW, LLM API without content filter, uncensored LLM API, abliterated model API, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Developer Guide",
    readTime: "10 min read",
    title: "Uncensored Azure OpenAI alternatives",
    subtitle:
      "Azure's filters, its approval gate and its Code of Conduct, read at the source. Then {{count}} alternatives, honest about where each one wins. Checked {{date}}.",
  },
  intro: {
    lead: "Azure OpenAI filters every model by default. Turning the filter off takes an approved application. And even approved, the Code of Conduct still bans erotic and romantic chatbots.",
    p2: "If your product is fiction, roleplay, companions, red-teaming or plain blunt answers, that is a wall, not a setting. Here is exactly what Azure allows, what replaces it, and the code change to move an Azure OpenAI client to {{appName}}.",
  },
  azure: {
    title: "What Azure actually filters",
    intro: "Straight from Microsoft's own docs and policies.",
    defaults:
      "On by default: Microsoft Foundry applies default safety settings to every model except Whisper. You can loosen them to High only on your own.",
    approval:
      "Off only if approved: the No filters and Annotate only options need approval for modified content filtering. Only customers managed by a Microsoft account team or under an eligible program can apply.",
    conduct:
      "Off is not permission: the Code of Conduct prohibits sexually explicit content, including sexually suggestive content and fetish content, and bans chatbots that are erotic, romantic, or used for erotic or romantic purposes. Graphic violence, gore and hate speech are banned too.",
    monitoring:
      "Abuse monitoring: flagged prompts and completions go to automated review by default, and to Microsoft staff when needed. The data sits in an abuse monitoring store in your resource's geography.",
    sunset:
      "Opt-out ending: Microsoft's changelog of 17 November 2026 says Modified Abuse Monitoring will no longer be available for models released on or after 1 November 2026, from a date still to be announced.",
    models:
      "No uncensored models: we found no abliterated or uncensored model in the catalog. DeepSeek and Llama models are listed, none of them abliterated.",
    callout:
      "Bottom line: on Azure, an adult fiction or companion app breaks the Code of Conduct no matter what your filter settings say.",
  },
  rules: {
    title: "Azure, Bedrock, Vertex and Together: what off really means",
    intro:
      "Every hyperscaler lets you lower a filter somewhere. None of them changes the usage policy, and none ships uncensored weights.",
  },
  us: {
    title: "{{appName}}: uncensored models on an OpenAI and Anthropic API",
    intro:
      "{{modelCount}} chat models behind one key, {{uncensored}} of them uncensored. No filter layer on top of the model you pick.",
    models:
      "Models: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM and Qwen next to {{uncensored}} uncensored models. {{ownModel}} is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions.",
    formats:
      "Formats: OpenAI chat completions, the OpenAI Responses API and the Anthropic Messages API, plus images, video, music, speech and transcription on the same key.",
    consent:
      "Rules: uncensored models unlock after a one-time 18+ consent on your account. No application, no account team.",
    billing:
      "Billing: one credit balance, our {{markup}}% markup on what we pay upstream. Any plan from {{apiSubPrice}} a month unlocks API keys. Card, PayPal or crypto.",
    limits:
      "Limits: {{burst}} requests a minute and {{streams}} concurrent streams per key as an abuse ceiling. Upstream rate limits pass through.",
    weak: "Where Azure beats us: we have no SOC 2 report, no BAA, no SLA and no region choice. Every prompt passes through us to the provider that serves the model. Our {{markup}}% markup makes us pricier per token than the abliterated routers below. No embeddings endpoint either.",
    before: "Before: the Azure OpenAI client",
    after: "After: the same SDK, pointed at {{appName}}",
    codeNote:
      "Three things change. AzureOpenAI becomes OpenAI with a base_url. Your deployment name becomes a model id. And content_filter_results disappears from responses, because there is no filter layer to report on.",
    docsLink: "API docs: endpoints, auth and limits",
    formatsLink: "OpenAI and Anthropic compatible API, explained",
    toolsLink: "Use one key in Claude Code, Codex CLI, Aider and more",
  },
  models: {
    title: "{{apiUncensored}} uncensored models on the API today",
    intro:
      "Every uncensored model you can call, with the id you pass as model. Cheapest first.",
    colModel: "Model",
    colId: "API id",
    colContext: "Context",
    colPrice: "Per message",
  },
  prices: {
    title: "Price per token, ours vs the cheapest hosts",
    intro:
      "Same weights, different hosts. We are not the cheapest per token. You pay for one key across uncensored, open and mainstream models plus a web chat.",
  },
  list: {
    title: "The alternatives, one by one",
    intro:
      "From their own pages and model lists, read {{date}}. What each one is, where it wins, and the catch.",
  },
  stay: {
    title: "When to stay on Azure",
    intro: "Sometimes the filter is the price of the paperwork you need.",
    compliance:
      "You need compliance programs, regional data residency and an account team. The hyperscalers sell that. Bedrock, for example, lists ISO, SOC, CSA STAR, HIPAA eligibility and FedRAMP High in GovCloud.",
    privacy:
      "You need Microsoft's data terms: prompts and completions are not available to OpenAI and are not used to train foundation models without your permission.",
    sfw: "Your product is safe-for-work anyway. Then Azure's defaults cost you little.",
    callout:
      "Many teams split it: Azure for the regulated workload, a second key for fiction, roleplay, research and red-teaming.",
  },
  faq: {
    title: "FAQ",
    off: {
      q: "Can I turn off the Azure OpenAI content filter?",
      a: "Only with approval. Customers can loosen filters to High only themselves. No filters and Annotate only need an approved application for modified content filtering, open to customers managed by a Microsoft account team or an eligible program.",
    },
    nsfw: {
      q: "Does Azure OpenAI allow NSFW or companion apps with filters off?",
      a: "No. The Microsoft Code of Conduct prohibits sexually explicit content and bans erotic or romantic chatbots. Filter settings do not change the Code of Conduct.",
    },
    monitoring: {
      q: "Can I still opt out of Azure abuse monitoring?",
      a: "Approved customers could. Microsoft's changelog of 17 November 2026 says Modified Abuse Monitoring will no longer be available for models released on or after 1 November 2026, from a date still to be announced.",
    },
    best: {
      q: "What is the best uncensored Azure OpenAI alternative?",
      a: "Cheapest abliterated tokens: OpenUncensored or Refuseless. Huge mainstream catalog: OpenRouter. Venice's own uncensored models: Venice. Prompts that never leave your machines: Ollama, LM Studio or vLLM. Uncensored, open and mainstream models plus a team chat on one OpenAI and Anthropic key: {{appName}}.",
    },
    sdk: {
      q: "Can I keep my Azure OpenAI SDK code?",
      a: "Mostly. Swap AzureOpenAI for OpenAI, set base_url and your key, and replace the deployment name with a model id such as {{example}}. Requests and responses keep the OpenAI shape.",
    },
    enterprise: {
      q: "Does {{appName}} offer SOC 2, a BAA or an SLA?",
      a: "No. If you need those, keep the regulated workload on a hyperscaler and use {{appName}} where filters get in the way.",
    },
    apiLink: "Uncensored LLM API: model ids, code and limits",
    bedrockLink: "Uncensored AWS Bedrock alternatives",
    openRouterLink: "OpenRouter alternatives, compared",
    keysLink: "Manage your API keys",
  },
  cta: {
    title: "Same SDK. No filter layer.",
    subtitle:
      "Test the models in chat first, {{guestCredits}} free credits a month, no account needed. Then wire in the API.",
    start: "Try an uncensored model",
    docs: "Read the API docs",
  },
};
