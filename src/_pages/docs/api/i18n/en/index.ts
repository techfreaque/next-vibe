export const translations = {
  meta: {
    title: "{{appName}} API Docs: OpenAI and Anthropic compatible",
    description:
      "One base URL, {{modelCount}} chat models. OpenAI chat completions and Responses API, Anthropic Messages API, streaming, tool calling. Plus images, speech, transcription, video and music in OpenAI format. Codex CLI and Claude Code connect directly. Pay in credits.",
    category: "API",
    imageAlt: "{{appName}} OpenAI-compatible API docs",
    keywords:
      "api, openai compatible, anthropic compatible, chat completions, responses api, messages api, codex cli, claude code, streaming, function calling, image generation api, text to speech api, whisper api, video generation api, music generation api, {{appName}}",
  },
  toc: {
    title: "On this page",
    mobileTitle: "Jump to",
    groups: {
      start: "Get started",
      chat: "Chat",
      media: "Media",
      reference: "Reference",
      integrations: "Integrations",
    },
  },
  nav: {
    quickstart: "Quickstart",
    auth: "Authentication",
    access: "Access and pricing",
    models: "Models",
    chat: "Chat completions",
    tools: "Tool calling",
    responses: "Responses API",
    messages: "Messages API",
    billing: "Credits and billing",
    errors: "Errors and rate limits",
    codingTools: "Coding tools",
    sdks: "SDK examples",
    guides: "Guides",
    images: "Images",
    speech: "Text to speech",
    transcriptions: "Transcription",
    videos: "Video",
    music: "Music",
    mediaFiles: "Media files",
  },
  hero: {
    badge: "API reference",
    title: "One base URL.",
    titleHighlight: "Every model.",
    subtitle:
      "Point any OpenAI or Anthropic SDK at {{appName}}. Codex CLI and Claude Code too. Images, voice, video and music on the same key. No new client to learn.",
    ctaKey: "Get an API key",
    ctaPricing: "See plans",
    quickstartLink: "Quickstart in 3 steps",
    facts: {
      models: "{{modelCount}} chat models",
      formats: "OpenAI + Anthropic format",
      streaming: "Streaming and tool calls",
      rate: "{{rate}} requests per minute per key",
    },
  },
  code: {
    copy: "Copy",
    wrap: "Wrap lines",
    copied: "Copied",
    request: "Request",
    response: "Response",
    stream: "Stream",
    showResponse: "Example response",
    showStream: "Example stream",
    showObject: "Finished job object",
  },
  quickstart: {
    title: "Quickstart",
    intro:
      "The API speaks the OpenAI and the Anthropic wire format. Code that runs against either runs here after two changes: the base URL and the key.",
    baseUrlLabel: "OpenAI base URL",
    anthropicBaseUrlLabel: "Anthropic base URL",
    anthropicBaseUrlNote:
      "For Claude Code and Anthropic SDKs. No `/v1` at the end: they add `/v1/messages` themselves.",
    baseUrlNote:
      "Any locale works in the path (en-US, de-DE, pl-PL). It only changes the language of error messages.",
    envLabel: "Or set it once for every OpenAI SDK",
    step1: {
      title: "Create a key",
      description:
        "Open API keys in your account, name the key, copy it. You see it once.",
      cta: "Open API keys",
    },
    step2: {
      title: "Set the base URL",
      description:
        "Swap the base URL in your client. Anthropic clients take the second one.",
    },
    step3: {
      title: "Send a request",
      description:
        "Paste it into a terminal, put your key in, run it. Same call in Python and JavaScript.",
    },
  },
  access: {
    title: "Access and pricing",
    intro:
      "The API runs on the same credits as the chat app. No separate API plan, no seat fees.",
    unlockTitle: "What unlocks it",
    plan: "Any plan, from {{subPrice}} a month. Every plan brings monthly credits.",
    grant: "Credits granted by our team, such as tester credits.",
    never:
      "Free credits never unlock it: the monthly allowance, signup and newsletter bonuses, referral earnings.",
    withoutTitle: "Without a purchase",
    locked:
      "Accounts without a purchase cannot create keys, and every `/v1` call answers HTTP 402 `paid_plan_required`.",
    topup:
      "Need more? Subscribers top up with credit packs from {{packPrice}}. Pack credits never expire.",
    ctaUnlock: "See plans",
    ctaKeys: "Open API keys",
  },
  auth: {
    title: "Authentication",
    intro:
      "Send your key as a Bearer token on every request. Keys start with `sk-unb-`. Anthropic clients send it as `x-api-key`, and that works too.",
    header: "Authorization: Bearer sk-unb-YOUR_KEY",
    headerAnthropic: "x-api-key: sk-unb-YOUR_KEY",
    headerTab: "OpenAI format",
    headerAnthropicTab: "Anthropic format",
    points: {
      hash: "We store a hash, not the key. Lose it and you create a new one.",
      scope:
        "A key works on the API only: `/v1/models`, chat (`/v1/chat/completions`, `/v1/responses`, `/v1/messages`) and media (`/v1/images`, `/v1/audio`, `/v1/videos`, `/v1/music`, `/v1/media`). It cannot touch your account, payments or settings.",
      limit:
        "Up to {{maxKeys}} active keys per account. Revoke any key at any time: it stops working at once.",
      missing:
        "No key or a revoked key returns 401. A key on an account without a purchase returns 402.",
    },
  },
  models: {
    title: "Models",
    intro:
      "`GET /v1/models` lists the models your key can call right now, with context size, tool support and credit prices per million tokens. Use the id as the model field in requests.",
    note: "The list depends on your account. Unknown or unavailable ids return 404 `model_not_found`. The one mapping: on `/v1/messages`, Claude ids that Claude Code sends by default go to our newest Claude of the same family.",
    browse: "Browse every model with prices and filters",
    media: {
      title: "Media models in the same list",
      body: "Image, video, music, voice and transcription models sit in the same list. Each entry says what it does and where to call it.",
      filename: "media entry",
      points: {
        modality:
          "modality is chat, image, video, music, speech or transcription. endpoints lists the paths that take the model.",
        pricing:
          "Media pricing is per unit: `credits_per_image`, `credits_per_second` (video), `credits_per_clip` (music), `credits_per_1k_characters` (speech), `credits_per_minute` (transcription).",
        anthropic:
          "Anthropic clients (`anthropic-version` header) get chat models only. Models whose provider is not set up on our side are not listed and answer 404 `model_not_found`.",
      },
    },
  },
  chat: {
    title: "Chat completions",
    intro:
      "Standard OpenAI chat completions. Messages in, one assistant message out. Text and image inputs (`image_url` as https URL or base64 data URL).",
    nonStream: {
      title: "Non-streaming",
      body: "The default. You get one JSON body when the model is done. `usage.credits_charged` is what this call cost you.",
    },
    stream: {
      title: "Streaming",
      body: "Set `stream: true` for server-sent events in the OpenAI chunk format, ended by `data: [DONE]`. Add `stream_options.include_usage` to get a final chunk with token counts and `credits_charged`. Closing the connection stops generation. You pay only for what ran.",
    },
    paramsTitle: "Request fields",
    paramsColumns: { field: "Field", description: "What it does" },
    params: {
      model: "Required. A model id from `GET /v1/models`.",
      messages:
        "Required. system, developer, user, assistant and tool messages. User content may be a string or text and `image_url` parts.",
      stream: "true for server-sent events. Default false.",
      streamOptions: "`{ include_usage: true }` adds a final usage chunk.",
      maxTokens:
        "Upper bound on generated tokens. `max_completion_tokens` takes precedence. Capped at {{maxTokens}}.",
      temperature: "0 to 2. Ignored by models that do not support it.",
      topP: "0 to 1.",
      stop: "A stop string or a list of them.",
      n: "Only 1 is supported. Other values return 400.",
      tools: "Function tools the model may call. See tool calling.",
      toolChoice: "none, auto, required, or one named function.",
    },
  },
  tools: {
    title: "Tool calling",
    intro:
      "Function calling works like OpenAI. You describe functions, the model decides to call one, you run it and send the result back. We never execute your tools.",
    flow: {
      title: "The loop",
      step1: "Send tools with your messages.",
      step2:
        "The model answers with `tool_calls` and `finish_reason: tool_calls`. Each call has an id, a function name and JSON-string arguments.",
      step3:
        "Run the function yourself. Append the assistant message, then one tool message per call with its `tool_call_id`.",
      step4: "Call again. The model uses the results and answers.",
    },
    requestTitle: "1. Request with tools",
    responseTitle: "2. The model asks for a call",
    followUpTitle: "3. Return the result",
    sdkTitle: "The same loop with the Python SDK",
    streamingTitle: "Streaming tool calls",
    streamingBody:
      "With `stream: true`, calls arrive as `delta.tool_calls` chunks, addressed by index. The first chunk for an index carries id and `function.name`. Later chunks append to `function.arguments`. Concatenate them, then parse the JSON when `finish_reason` is `tool_calls`. Every OpenAI SDK does this for you.",
    rules: {
      title: "Rules",
      support:
        "The model must support tools: check `supports_tools` in `GET /v1/models`. Others return 400 `tools_not_supported`.",
      choice:
        "`tool_choice` none, auto and required work as in OpenAI. Naming a function that is not in tools returns 400.",
      names:
        "Function names: letters, digits, underscore, dash, up to 64 characters.",
      billing:
        "Tool definitions and tool results are input tokens. Calls are output tokens. They bill like any other tokens.",
    },
  },
  billing: {
    title: "Credits and billing",
    intro:
      "The API draws from the same credits as the chat app, billed by the same rules. One balance, one bill.",
    points: {
      price:
        "Cost = input tokens plus output tokens at the model's credit price, listed per million tokens in `GET /v1/models`. OpenRouter models are the exception: you pay what the provider really charged for the call, plus our markup. Their listed price is an estimate. Chat bills them the same way.",
      usage:
        "Every response reports `usage.credits_charged`. Your balance is in the app under Credits.",
      preflight:
        "Before a call runs we check your balance against a worst-case estimate. Not enough: HTTP 402 `insufficient_credits`, nothing runs, nothing is charged.",
      real: "After the call you pay real usage, not the estimate: the token count the provider reports, or the provider's real cost for OpenRouter models. If a provider reports no cost, the call falls back to the listed price.",
      media:
        "Media calls bill the same way: the provider's real cost plus our markup where the provider reports it, the listed per-model price otherwise. Images bill per image, speech per character, transcription per second of audio, video when the clip is ready, music per clip.",
      topup:
        "Out of credits? Top up with a pack, renew or upgrade your plan. The next call works immediately.",
    },
  },
  limits: {
    title: "Rate limits",
    body: "Each key allows {{rate}} requests per minute by default. Over the limit you get HTTP 429 with a `Retry-After` header in seconds. Back off for that long and retry. Limits are per key, so split heavy workloads across keys.",
  },
  errors: {
    title: "Errors and rate limits",
    intro:
      "Errors use the OpenAI envelope, so SDKs raise their usual exceptions. Branch on `error.code`, not on the message.",
    shapeTitle: "Error body",
    shapeOpenAi: "OpenAI format",
    shapeAnthropic: "Anthropic format",
    codesTitle: "Error codes",
    columns: { status: "HTTP", code: "code", meaning: "Meaning" },
    rows: {
      missingKey:
        "No key sent. Send `Authorization: Bearer sk-unb-...`, or `x-api-key`.",
      invalidKey: "Key is wrong or revoked.",
      paid: "No purchase on the account yet. Any plan unlocks it.",
      credits: "Balance too low for this call. Top up.",
      cap: "Paid balance is empty and today's free-credit cap is hit. Top up.",
      notFound: "Model does not exist or is not available to you.",
      invalid:
        "Bad request: unsupported parameter, bad `tool_choice`, bad image URL.",
      contentPolicy:
        "The media provider refused the prompt. Nothing is charged. Rephrase or pick another model.",
      consent:
        "Uncensored models need a one-time 18+ confirmation on your account. Confirm it once on the API keys page, then retry.",
      rate: "Over {{rate}} requests per minute for this key. Read `Retry-After`.",
      upstream:
        "The model provider failed. Safe to retry. Streams end with an error event.",
      balance: "We could not read your balance, so nothing ran. Retry.",
    },
    streamNote:
      "Errors that happen mid-stream arrive as a `data:` event with the same error object, followed by `data: [DONE]`.",
  },
  responses: {
    title: "Responses API",
    intro:
      "The OpenAI Responses API, the format Codex CLI speaks. Same models, key, credits and rate limits as chat completions.",
    request: {
      title: "Request",
      body: "input is a string or a list of input items. instructions is the system prompt. The answer arrives as output items. Every OpenAI SDK also gives you `output_text`.",
    },
    stream: {
      title: "Streaming",
      body: "Set `stream: true` for the Responses event stream: `response.created`, text deltas, then `response.completed` with usage.",
    },
    points: {
      tools:
        "Tools: function, custom and `local_shell`. The model's calls come back as output items. Send each result back as a `function_call_output` item with the same `call_id`.",
      reasoning: "Reasoning models return reasoning items next to the answer.",
      billing:
        "Billing, model ids, errors and rate limits work exactly like chat completions.",
    },
  },
  messages: {
    title: "Messages API",
    intro:
      "The Anthropic Messages API, the format Claude Code and the Anthropic SDKs speak. Use the base URL without `/v1`: clients add `/v1/messages` themselves.",
    request: {
      title: "Request",
      body: "Standard Messages request: model, `max_tokens`, system, messages. Text and image blocks in, text and `tool_use` blocks out.",
    },
    stream: {
      title: "Streaming",
      body: "Set `stream: true` for Anthropic server-sent events, from `message_start` to `message_stop`.",
    },
    points: {
      auth: "Auth: `x-api-key` or `Authorization: Bearer`. Both take your sk-unb key.",
      models:
        "Model: any id from `GET /v1/models`. The Anthropic ids Claude Code sends by default, like `claude-sonnet-4-5-20250929`, map to our matching Claude model.",
      tools:
        "Tools: `tool_use` blocks out, `tool_result` blocks back, as in the Anthropic API.",
      billing:
        "Same credits, same prices, same rate limits as every other endpoint.",
    },
    countTokens: {
      title: "Count tokens",
      body: "`POST /v1/messages/count_tokens` counts the input tokens of a Messages request without running the model. Claude Code calls it to manage its context.",
    },
  },
  images: {
    title: "Images",
    intro:
      "OpenAI images format. Any model with modality image from `GET /v1/models`. Works with the images client of every OpenAI SDK.",
    generate: {
      title: "Generate",
      body: "Send JSON with these fields. The answer lists one url per image.",
    },
    params: {
      model: "Required. Any id with modality `image` from `GET /v1/models`.",
      prompt: "Required. What to draw, up to 2000 characters.",
      n: "Images per call, 1 to {{maxImages}}. Each one is billed.",
      size: "`WIDTHxHEIGHT` like `1024x1024`, or `auto`. We pick the closest size the model renders.",
      aspectRatio:
        "Our extension: `1:1 | 16:9 | 9:16 | 4:3 | 3:4 | 3:2 | 2:3 | 21:9`. Wins over size.",
      quality:
        "`standard | hd | low | medium | high | auto`. `hd` and `high` ask for the detailed tier where the model has one.",
      responseFormat:
        "`url` (default, a signed link valid 7 days) or `b64_json`.",
    },
    edit: {
      title: "Edit an image",
      body: "One input image plus a prompt. Upload it as multipart field image, or send `image_url` (https or base64 data URL) in JSON. The model must take image input: `input_modalities` contains image. Masks are not supported; describe the change in the prompt.",
    },
    points: {
      size: "We pick the closest size and ratio the model renders.",
      format:
        "url is a signed link to the stored file, valid 7 days without a key. `b64_json` returns the bytes inline.",
      billing:
        "Billed per image. `credits_charged` in the response says what the call cost.",
    },
  },
  speech: {
    title: "Text to speech",
    intro:
      "Text in, audio bytes out. model is a voice id from `GET /v1/models` (modality speech), like `openai-nova`. OpenAI style also works: model `tts-1` with voice nova.",
    points: {
      voices:
        "input up to {{maxChars}} characters. speed 0.25 to 4 on OpenAI, NanoGPT and ElevenLabs voices.",
      formats:
        "`response_format` mp3 (default), opus, aac, flac, wav or pcm. Which ones a voice delivers depends on its provider; others answer 400 with the list.",
      billing:
        "Billed per character. The `X-Credits-Charged` header says what the call cost.",
    },
  },
  transcriptions: {
    title: "Transcription",
    intro:
      "Speech to text, OpenAI Whisper format. Multipart upload, same SDK call you already use.",
    transcribe: {
      title: "Transcribe",
      body: "file up to {{maxMb}} MB (mp3, mp4, m4a, wav, webm, ogg, flac), model like `whisper-1`, optional language. `response_format` json, text, srt, `verbose_json` or vtt.",
    },
    translate: {
      title: "Translate to English",
      body: "`POST /v1/audio/translations`: any spoken language in, English text out. Runs on `whisper-1`. Same formats as transcriptions.",
    },
    points: {
      billing: "Billed per second of audio.",
    },
  },
  videos: {
    title: "Video",
    intro:
      "Async, in the shape of OpenAI's video API. The call answers at once with a job. Poll it, then download the MP4.",
    create: {
      title: "Start a job",
      body: "model, prompt, seconds, size or `aspect_ratio`, resolution, `negative_prompt`. The answer is a video object with status queued.",
    },
    poll: {
      title: "Poll and download",
      body: "`GET /v1/videos/{id}` returns status (queued, `in_progress`, completed, failed), progress and, when done, a signed url. Polling is free and skips the rate limit. `GET /v1/videos/{id}/content` streams the MP4.",
    },
    points: {
      image:
        "Image to video: send `image_url` in JSON or `input_reference` as a multipart upload. It becomes the first frame.",
      billing:
        "Billed when the video is ready, per second of video. `credits_charged` shows the cost.",
      failed: "A failed job costs nothing. error says why.",
    },
  },
  music: {
    title: "Music",
    intro:
      "Async like video. Start a job, poll `GET /v1/music/{id}`, download `GET /v1/music/{id}/content`.",
    startTitle: "Start a job",
    pollTitle: "Poll and download",
    points: {
      seconds:
        "seconds: about 8, 20 or 30. The model may round it. Describe style, mood, instruments and tempo in prompt.",
      billing: "Billed per clip once it is ready. A failed job costs nothing.",
    },
  },
  mediaFiles: {
    title: "Media files",
    intro:
      "Every url in a media response points here. The signed link works without a key for 7 days, so you can hand it to a browser or a user. With your API key the same path works any time.",
  },
  codingTools: {
    title: "Coding tools",
    intro:
      "One base URL, one key. Codex CLI and Claude Code connect natively. OpenCode, Continue, Aider and Cline use chat completions. Pick your tool, copy the block, run it.",
    keyPage:
      "The API keys page shows the same blocks with your key already filled in.",
    keyPageCta: "Get them with your key",
    guide: "Read the coding tools guide",
  },
  sdks: {
    title: "SDK examples",
    intro:
      "The official OpenAI and Anthropic SDKs work unchanged. Set the base URL and the key, keep the rest of your code.",
    chat: "Chat",
    stream: "Streaming",
    responses: "Responses API",
    anthropic: "Anthropic SDK",
    images: "Images",
    speech: "Speech",
    transcription: "Transcription",
  },
  guides: {
    title: "Guides",
    intro:
      "Longer walkthroughs: switching from OpenAI or OpenRouter, uncensored models over the API, and wiring your key into coding tools.",
  },
  cta: {
    title: "Build on every model.",
    subtitle: "Create a key, point your SDK here, ship.",
    button: "Create an API key",
    secondary: "Compare plans",
  },
};
