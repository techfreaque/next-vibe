export const translations = {
  meta: {
    title: "Uncensored AWS Bedrock Alternative: APIs Compared | {{appName}}",
    description:
      "Bedrock Guardrails are optional, but model refusals and the AWS policy stay. Compare Custom Model Import for abliterated weights with {{appName}}, OpenRouter, Venice, NanoGPT and self-hosting.",
    category: "Developer Guide",
    imageAlt: "Uncensored alternatives to AWS Bedrock, compared",
    keywords:
      "uncensored AWS Bedrock alternative, Bedrock alternative, Bedrock without guardrails, Bedrock Custom Model Import abliterated, Bedrock uncensored model, Claude on Bedrock alternative, Bedrock Converse API alternative, Anthropic Messages API, uncensored LLM API, abliterated model API, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Developer Guide",
    readTime: "8 min read",
    title: "Uncensored AWS Bedrock alternatives",
    subtitle:
      "Guardrails, refusals, the AWS policy and Custom Model Import, read at the source. Then {{count}} alternatives. Checked {{date}}.",
  },
  intro: {
    lead: "Bedrock does not force a filter on you. Skip the Guardrail and Bedrock adds none. The model still refuses, the AWS policy still applies, and the catalog has no uncensored weights.",
    p2: "So the real question is where abliterated models run, and what it costs to move. Here are the facts from AWS's own docs, the Custom Model Import route, and the code change for Claude-on-Bedrock users moving to {{appName}}.",
  },
  bedrock: {
    title: "What Bedrock filters, and what it doesn't",
    intro: "Straight from the AWS docs and policy.",
    guardrails:
      "Guardrails are opt-in: they run only when you pass a guardrail ID and version on the call.",
    refusals:
      "No Guardrail is not uncensored: the models are served as their providers ship them, so Claude, Llama and the rest keep their trained refusals.",
    csam: "Always on: automated CSAM detection on image inputs and outputs can block a request with HTTP 400.",
    policy:
      "Policy: the AWS Responsible AI Policy bars using the service to intentionally circumvent safety filters, plus disinformation, non-consensual sexual imagery and harm to minors.",
    retention:
      "Abuse detection: AWS may store or review inputs and outputs in limited cases. Claude Fable 5, 5.1 and 5.2 keep all traffic up to 30 days, OpenAI models outside gpt-oss keep flagged traffic up to 30 days. Model providers get none of it.",
    models:
      "No uncensored weights: the catalog has DeepSeek, Llama, Qwen, Mistral, gpt-oss, Kimi, GLM, MiniMax, Gemma and Nemotron. None abliterated.",
  },
  import: {
    title: "Bring your own abliterated weights: Custom Model Import",
    intro:
      "Bedrock can host weights you upload. That is the only way to run an abliterated model there.",
    architectures:
      "Supported architectures: Mistral, Mixtral, Flan, Llama 2 to 3.3, GPTBigCode, Qwen2 to Qwen3 and gpt-oss 20B and 120B. An abliterated Llama, Qwen or gpt-oss fits.",
    excluded:
      "Not supported: DeepSeek V3, Kimi and GLM architectures. Qwen3 imports don't support the Converse API.",
    format:
      "Limits: Hugging Face safetensors, under 200 GB for text models, context under 128K, no batch inference. Regions: eu-central-1, us-east-1, us-east-2, us-west-2.",
    cost: "Cost: $0.05718 per Custom Model Unit per minute in US East and Oregon, billed in 5-minute windows, plus $1.95 a month storage per unit. Frankfurt is $0.07144 a minute.",
    callout:
      "You pay for model capacity by the minute, not by the token. And the AWS policy against circumventing safety filters still covers your account.",
  },
  prices: {
    title: "Bedrock's own open-model prices",
    intro:
      "Standard tier, US East, per 1M tokens, input / output. Stock weights only.",
    list: "DeepSeek v3.2 $0.62 / $1.85. Qwen3 Next 80B A3B $0.15 / $1.20. Mistral Large 3 $0.50 / $1.50. Kimi K2.5 $0.60 / $3.00. GLM 5 $1.00 / $3.20. GLM 4.7 Flash $0.07 / $0.40.",
    oursTitle: "Uncensored weights elsewhere, per token",
    oursIntro:
      "The abliterated models Bedrock doesn't carry, ours vs the cheapest hosts.",
  },
  apis: {
    title: "Converse vs OpenAI and Anthropic formats",
    intro:
      "Bedrock speaks InvokeModel and Converse on bedrock-runtime, and adds Messages, Chat Completions and Responses on its bedrock-mantle endpoint. We speak OpenAI chat completions, the Responses API and Anthropic Messages on one base URL with one key.",
    claude:
      "For Claude-on-Bedrock users that means the Anthropic SDK keeps working. Swap the Bedrock client for the plain one, set the base URL and the key. Claude Code takes the same base URL as ANTHROPIC_BASE_URL.",
    before: "Before: Claude through the Bedrock client",
    after: "After: the same Messages call on {{appName}}",
    swap: "Same code, any model: put {{uncensoredExample}} in the model field and the call goes to an uncensored model instead.",
    converse:
      "On Converse today? Move to the OpenAI or Anthropic SDK once and every gateway on this page, us included, is a base URL change away.",
  },
  rules: {
    title: "Bedrock, Azure, Vertex and Together side by side",
    intro:
      "Every hyperscaler lets you lower a filter somewhere. None of them changes the usage policy, and none ships uncensored weights.",
  },
  us: {
    title: "{{appName}}: uncensored models without importing weights",
    intro:
      "{{modelCount}} chat models behind one key, {{uncensored}} of them uncensored. Pay per token, no capacity minutes.",
    models:
      "Models: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM and Qwen next to {{uncensored}} uncensored models, including abliterated GLM, DeepSeek and Kimi that Custom Model Import can't take. {{ownModel}} is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions.",
    formats:
      "Formats: OpenAI chat completions, the Responses API and Anthropic Messages, plus images, video, music, speech and transcription.",
    consent:
      "Rules: uncensored models unlock after a one-time 18+ consent on your account.",
    billing:
      "Billing: one credit balance, our {{markup}}% markup on what we pay upstream. Any plan from {{apiSubPrice}} a month unlocks API keys.",
    weak: "Where Bedrock beats us: IAM, VPC, regions, an AWS bill, ISO, SOC, CSA STAR, HIPAA eligibility and FedRAMP High in GovCloud. We have no SOC 2 report, no BAA, no SLA and no region choice, and every prompt passes through us to the provider that serves the model.",
    docsLink: "API docs: endpoints, auth and limits",
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
  list: {
    title: "The alternatives, one by one",
    intro:
      "From their own pages and model lists, read {{date}}. What each one is, where it wins, and the catch.",
  },
  stay: {
    title: "When to stay on Bedrock",
    intro:
      "If your workload lives in AWS, the filter question may be the small one.",
    compliance:
      "You need the compliance scope, IAM and VPC controls, and one AWS invoice.",
    retention:
      "You need zero retention per Region: Bedrock's retention mode none, set by API.",
    weights:
      "Your abliterated model is a Llama, Qwen or gpt-oss and steady traffic justifies paying for capacity minutes.",
    callout:
      "Many teams split it: Bedrock for production inside AWS, a second key for fiction, roleplay, research and red-teaming.",
  },
  faq: {
    title: "FAQ",
    guardrails: {
      q: "Does Bedrock filter content without Guardrails?",
      a: "Bedrock adds no filter layer unless you attach a Guardrail, except automated CSAM detection on images. The models keep their own trained refusals, and the AWS Responsible AI Policy still applies.",
    },
    uncensored: {
      q: "Does Bedrock have uncensored or abliterated models?",
      a: "Not in its catalog. The only route is Custom Model Import of your own weights, for supported architectures such as Llama, Qwen and gpt-oss.",
    },
    cost: {
      q: "What does Custom Model Import cost?",
      a: "$0.05718 per Custom Model Unit per minute in US East and Oregon, billed in 5-minute windows, plus $1.95 a month storage per unit. You pay for capacity, not per token.",
    },
    claude: {
      q: "Can I move Claude-on-Bedrock code without a rewrite?",
      a: "Yes. Replace AnthropicBedrock with the plain Anthropic client, set base_url to the {{appName}} base URL without /v1, use your key and our model id. The Messages request and response keep their shape.",
    },
    converse: {
      q: "Does {{appName}} support the Bedrock Converse API?",
      a: "No. We speak OpenAI chat completions, the Responses API and Anthropic Messages. Moving off Converse once makes every OpenAI or Anthropic compatible provider a base URL change away.",
    },
    enterprise: {
      q: "Does {{appName}} offer SOC 2, a BAA or an SLA?",
      a: "No. If you need those, keep the regulated workload on Bedrock and use {{appName}} where refusals get in the way.",
    },
    apiLink: "Uncensored LLM API: model ids, code and limits",
    azureLink: "Uncensored Azure OpenAI alternatives",
    openRouterLink: "OpenRouter alternatives, compared",
    keysLink: "Manage your API keys",
  },
  cta: {
    title: "No capacity minutes. No refusal reflex.",
    subtitle:
      "Test the models in chat first, {{guestCredits}} free credits a month, no account needed. Then point your SDK at the API.",
    start: "Try an uncensored model",
    docs: "Read the API docs",
  },
};
