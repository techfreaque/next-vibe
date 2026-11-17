export const translations = {
  category: "AI",

  tags: {
    api: "OpenAI-compatible API",
  },

  openai: {
    missingKey:
      "Missing API key. Send it as 'Authorization: Bearer <key>' or 'x-api-key: <key>'. Create a key under Settings > API keys.",
    invalidKey:
      "Invalid or revoked API key. Check the key or create a new one under Settings > API keys.",
    authUnavailable:
      "Could not verify your API key right now. Your key was not rejected. Retry in {{seconds}}s.",
    modelNotFound:
      "The model '{{model}}' does not exist or is not available to you. List your models with GET /v1/models.",
    paidRequired:
      "The API needs a paid account: any plan, from {{subPrice}} a month. Add one at {{url}}.",
    toolsUnsupportedByModel:
      "This model does not support tool calling. Pick a model with tool support or remove 'tools'.",
    badToolArguments:
      "The arguments of tool call '{{name}}' are not valid JSON.",
    toolChoiceUnknown: "tool_choice names '{{name}}', which is not in 'tools'.",
    toolMessageNeedsId: "Tool message {{param}} needs a tool_call_id.",
    nUnsupported: "Only n=1 is supported.",
    badImageUrl: "image_url must be an http(s) URL or a base64 data: URL.",
    insufficientCredits:
      "Insufficient credits. This call needs about {{cost}}, you have {{balance}}. Top up to continue.",
    rateLimited:
      "Rate limit reached: {{limit}} requests per minute for this key. Retry in {{seconds}}s.",
    upstreamFailed: "The model provider failed: {{error}}",
    balanceCheckFailed:
      "Could not verify your credit balance. Nothing was run. Try again.",
  },

  models: {
    get: {
      title: "OpenAI-compatible models",
      titleShort: "v1 models",
      description:
        "List the models your API key can call. OpenAI list format. Authenticate with Authorization: Bearer <key>.",
      response: { object: "Object type" },
      success: {
        title: "Models listed",
        description: "The models available to this API key",
      },
    },
  },

  completions: {
    post: {
      title: "OpenAI-compatible chat completions",
      titleShort: "v1 chat completions",
      description:
        "Call any model with the OpenAI chat completions format. Billed against your credits at chat prices. Supports stream: true.",
      fields: {
        model: {
          label: "Model",
          description: "Model ID from GET /v1/models",
        },
        messages: {
          label: "Messages",
          description: "OpenAI messages array (system, user, assistant)",
        },
        stream: {
          label: "Stream",
          description: "Send the answer as server-sent events",
        },
        streamOptions: {
          label: "Stream options",
          description: "{ include_usage: true } adds a final usage chunk",
        },
        maxTokens: {
          label: "Max tokens",
          description: "Upper bound on generated tokens",
        },
        maxCompletionTokens: {
          label: "Max completion tokens",
          description: "Same as max_tokens; takes precedence",
        },
        temperature: {
          label: "Temperature",
          description: "Sampling temperature, 0 to 2",
        },
        topP: {
          label: "Top P",
          description: "Nucleus sampling, 0 to 1",
        },
        stop: {
          label: "Stop",
          description: "Stop sequence or list of them",
        },
        n: {
          label: "Choices",
          description: "Only 1 is supported",
        },
        tools: {
          label: "Tools",
          description:
            "OpenAI function tools the model may call: [{type:'function', function:{name, description, parameters}}]",
        },
        toolChoice: {
          label: "Tool choice",
          description:
            "none, auto, required, or {type:'function', function:{name}}",
        },
        parallelToolCalls: {
          label: "Parallel tool calls",
          description: "Accepted for compatibility; the model decides",
        },
      },
      response: { object: "Object type" },
      success: {
        title: "Completion created",
        description: "The model answered",
      },
    },
  },

  responses: {
    previousResponseUnsupported:
      "previous_response_id is not supported: responses are not stored. Send the full conversation in 'input' with store: false (Codex CLI does this by default).",
    badInputItem:
      "{{param}} is not usable: images must be http(s) or base64 data: URLs and tool items need a call_id.",
    post: {
      title: "OpenAI Responses API",
      titleShort: "v1 responses",
      description:
        "Call any model with the OpenAI Responses format, the one Codex CLI speaks. Stateless: send the full conversation in input. Supports streaming, function, custom and local_shell tools, and reasoning items.",
      fields: {
        model: { label: "Model", description: "Model ID from GET /v1/models" },
        input: {
          label: "Input",
          description:
            "A string, or the conversation as Responses items (message, function_call, function_call_output, reasoning, ...)",
        },
        instructions: {
          label: "Instructions",
          description: "System instructions for the model",
        },
        stream: {
          label: "Stream",
          description: "Send the answer as Responses server-sent events",
        },
        tools: {
          label: "Tools",
          description:
            "function, custom and local_shell tools. Hosted tools (web_search, ...) are skipped.",
        },
        toolChoice: {
          label: "Tool choice",
          description: "none, auto, required, or {type:'function', name}",
        },
        parallelToolCalls: {
          label: "Parallel tool calls",
          description: "Accepted for compatibility; the model decides",
        },
        maxOutputTokens: {
          label: "Max output tokens",
          description: "Upper bound on generated tokens",
        },
        temperature: {
          label: "Temperature",
          description: "Sampling temperature, 0 to 2",
        },
        topP: { label: "Top P", description: "Nucleus sampling, 0 to 1" },
        reasoning: {
          label: "Reasoning",
          description:
            "Accepted for compatibility. Reasoning models return reasoning items either way.",
        },
        text: {
          label: "Text format",
          description:
            "{format:{type:'json_schema', schema}} asks for JSON output",
        },
        store: {
          label: "Store",
          description: "Responses are never stored; send false",
        },
        previousResponseId: {
          label: "Previous response ID",
          description: "Not supported: send the full conversation instead",
        },
        include: {
          label: "Include",
          description:
            "Accepted for compatibility. Reasoning items always carry encrypted_content for replay.",
        },
      },
      response: { object: "Object type" },
      success: {
        title: "Response created",
        description: "The model answered",
      },
    },
  },

  messages: {
    badContentBlock:
      "{{param}} has a content block we cannot use: images must be base64 or http(s) URLs.",
    post: {
      title: "Anthropic Messages API",
      titleShort: "v1 messages",
      description:
        "Call any model with the Anthropic Messages format, the one Claude Code speaks. Key as x-api-key or Authorization: Bearer. Supports streaming, tools and thinking blocks.",
      fields: {
        model: {
          label: "Model",
          description:
            "Model ID from GET /v1/models. Claude ids like claude-sonnet-4-5-20250929 map to our matching Claude model.",
        },
        messages: {
          label: "Messages",
          description:
            "Anthropic messages: user and assistant turns with text, image, tool_use, tool_result and thinking blocks",
        },
        system: {
          label: "System",
          description: "System prompt: a string or text blocks",
        },
        maxTokens: {
          label: "Max tokens",
          description: "Upper bound on generated tokens",
        },
        stream: {
          label: "Stream",
          description: "Send the answer as Anthropic server-sent events",
        },
        tools: {
          label: "Tools",
          description:
            "Client tools: [{name, description, input_schema}]. Server tools (web_search, ...) are skipped.",
        },
        toolChoice: {
          label: "Tool choice",
          description: "{type: auto | any | none | tool, name}",
        },
        stopSequences: {
          label: "Stop sequences",
          description: "Strings that end the answer",
        },
        temperature: {
          label: "Temperature",
          description: "Sampling temperature",
        },
        topP: { label: "Top P", description: "Nucleus sampling, 0 to 1" },
        thinking: {
          label: "Thinking",
          description:
            "Accepted for compatibility. Reasoning models return thinking blocks either way.",
        },
      },
      response: { type: "Object type" },
      success: { title: "Message created", description: "The model answered" },
    },
  },

  countTokens: {
    post: {
      title: "Anthropic token count",
      titleShort: "v1 count tokens",
      description:
        "Estimate the input tokens of an Anthropic Messages request. No model call, no credits.",
      fields: {
        action: { label: "Action", description: "Always count_tokens" },
        model: { label: "Model", description: "Model ID" },
        messages: { label: "Messages", description: "Anthropic messages" },
        system: { label: "System", description: "System prompt" },
        tools: { label: "Tools", description: "Tool definitions" },
      },
      response: { inputTokens: "Input tokens" },
      success: {
        title: "Tokens counted",
        description: "Estimated input tokens",
      },
    },
  },

  media: {
    images: {
      generations: {
        title: "OpenAI-compatible image generation",
        titleShort: "v1 images",
        description:
          "Generate images with any image model from GET /v1/models. OpenAI images format: url (signed, valid 7 days) or b64_json. Billed per image.",
        success: {
          title: "Images generated",
          description: "The images are stored and linked",
        },
      },
      edits: {
        title: "OpenAI-compatible image edit",
        titleShort: "v1 image edits",
        description:
          "Edit one image with a prompt, on a model that takes image input. Upload it as multipart 'image' or send 'image_url'. Billed per image.",
        success: {
          title: "Image edited",
          description: "The edited image is stored and linked",
        },
      },
    },
    speech: {
      title: "OpenAI-compatible text to speech",
      titleShort: "v1 speech",
      description:
        "Turn text into speech. Answers with the audio bytes (mp3 by default). Billed per character.",
      success: { title: "Speech generated", description: "The audio file" },
    },
    transcriptions: {
      title: "OpenAI-compatible transcription",
      titleShort: "v1 transcriptions",
      description:
        "Transcribe an audio file (multipart 'file', up to 25 MB). JSON, text, SRT, WebVTT or verbose JSON with segments. Billed per second of audio.",
      success: { title: "Audio transcribed", description: "The transcript" },
    },
    translations: {
      title: "OpenAI-compatible audio translation",
      titleShort: "v1 translations",
      description:
        "Transcribe an audio file straight into English text with Whisper. Same formats and billing as transcriptions.",
      success: {
        title: "Audio translated",
        description: "The English transcript",
      },
    },
    videos: {
      create: {
        title: "Video generation (async)",
        titleShort: "v1 videos",
        description:
          "Start a video job in the shape of OpenAI's video API. Answers at once with the job; poll GET /v1/videos/{id}, download GET /v1/videos/{id}/content. Billed when the video is ready.",
        success: { title: "Video job queued", description: "Poll it by id" },
      },
      get: {
        title: "Video job status",
        titleShort: "v1 video status",
        description:
          "Status, progress and result URL of a video job. Polling is free and does not count against the rate limit.",
        success: { title: "Video job", description: "Current job state" },
      },
      content: {
        title: "Video download",
        titleShort: "v1 video content",
        description: "The finished video file of a completed job.",
        success: { title: "Video file", description: "The MP4 bytes" },
      },
    },
    music: {
      create: {
        title: "Music generation (async)",
        titleShort: "v1 music",
        description:
          "Start a music job. Answers at once with the job; poll GET /v1/music/{id}, download GET /v1/music/{id}/content. Billed per clip when it is ready.",
        success: { title: "Music job queued", description: "Poll it by id" },
      },
      get: {
        title: "Music job status",
        titleShort: "v1 music status",
        description:
          "Status and result URL of a music job. Polling is free and does not count against the rate limit.",
        success: { title: "Music job", description: "Current job state" },
      },
      content: {
        title: "Music download",
        titleShort: "v1 music content",
        description: "The finished audio file of a completed music job.",
        success: { title: "Music file", description: "The audio bytes" },
      },
    },
    file: {
      title: "Media file download",
      titleShort: "v1 media file",
      description:
        "Download a file a media call produced. The signed URL works without a key for 7 days; your API key works any time.",
      success: { title: "File", description: "The file bytes" },
    },
    fields: {
      model: {
        label: "Model",
        imageDescription:
          "Image model ID from GET /v1/models (modality: image)",
        speechDescription:
          "A voice ID from GET /v1/models (modality: speech), e.g. openai-nova. Or tts-1 plus a voice.",
        transcriptionDescription:
          "Transcription model ID from GET /v1/models (modality: transcription). whisper-1 works.",
        translationDescription:
          "A Whisper model served by OpenAI: whisper-1 or openai-whisper",
        videoDescription:
          "Video model ID from GET /v1/models (modality: video)",
        musicDescription:
          "Music model ID from GET /v1/models (modality: music)",
      },
      prompt: {
        label: "Prompt",
        imageDescription: "What to draw, up to 2000 characters",
        editDescription: "What to change in the image",
        transcriptionDescription:
          "Accepted for compatibility; not passed to every provider",
        videoDescription: "What happens in the clip, up to 2000 characters",
        musicDescription: "Style, mood, instruments, tempo",
      },
      n: {
        label: "Images",
        description: "How many images, 1 to 4. Each one is billed.",
      },
      size: {
        label: "Size",
        imageDescription:
          "WIDTHxHEIGHT like 1024x1024 or 1536x1024, or auto. Picks the closest size and ratio the model supports.",
        videoDescription:
          "WIDTHxHEIGHT like 1280x720. Sets the aspect ratio and, where the model offers it, the resolution.",
      },
      aspectRatio: {
        label: "Aspect ratio",
        imageDescription:
          "1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3 or 21:9. Wins over size.",
        videoDescription:
          "16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9 or 9:21. Wins over size.",
      },
      quality: {
        label: "Quality",
        description:
          "standard, hd, low, medium, high or auto. hd and high ask for the detailed tier where the model has one.",
      },
      style: {
        label: "Style",
        description: "Accepted for compatibility. Put the style in the prompt.",
      },
      responseFormat: {
        label: "Response format",
        imageDescription:
          "url (default, a signed link valid 7 days) or b64_json",
        speechDescription:
          "mp3 (default), opus, aac, flac, wav or pcm. Which ones a voice can deliver depends on its provider.",
        transcriptionDescription:
          "json (default), text, srt, verbose_json or vtt",
      },
      user: {
        label: "User",
        description: "Your end-user ID. Accepted for compatibility.",
      },
      image: {
        label: "Image",
        description: "The image to edit, as a multipart file upload",
      },
      imageUrl: {
        label: "Image URL",
        description:
          "The image to edit as an http(s) URL or base64 data: URL, for JSON requests",
        videoDescription:
          "First frame as an http(s) URL or base64 data: URL (image-to-video)",
      },
      mask: {
        label: "Mask",
        description: "Not supported. Describe the edit in the prompt.",
      },
      input: {
        label: "Input",
        description: "The text to speak, up to 4096 characters",
      },
      voice: {
        label: "Voice",
        description:
          "With an OpenAI model name (tts-1): alloy, nova, onyx, echo, shimmer or fable. Or any voice ID from GET /v1/models.",
      },
      speed: {
        label: "Speed",
        description:
          "0.25 to 4.0. Applied by OpenAI, NanoGPT and ElevenLabs voices.",
      },
      instructions: {
        label: "Instructions",
        description:
          "Accepted for compatibility; voices read the input as written",
      },
      file: {
        label: "File",
        description:
          "The audio file: mp3, mp4, m4a, wav, webm, ogg or flac, up to 25 MB",
      },
      language: {
        label: "Language",
        description:
          "ISO-639-1 code of the spoken language, e.g. en or de. Default: the locale in the URL.",
      },
      temperature: {
        label: "Temperature",
        description: "Accepted for compatibility",
      },
      seconds: {
        label: "Seconds",
        videoDescription:
          "Clip length. Snapped to the lengths the model offers.",
        musicDescription:
          "Wanted length: about 8, 20 or 30 seconds. The model may round it.",
      },
      resolution: {
        label: "Resolution",
        description: "e.g. 720p or 1080p, where the model offers a choice",
      },
      negativePrompt: {
        label: "Negative prompt",
        description:
          "What to keep out of the clip, where the model supports it",
      },
      inputReference: {
        label: "Input reference",
        description: "First frame as a multipart image upload (image-to-video)",
      },
      jobId: { label: "Job ID", description: "The id POST returned" },
      threadId: { label: "Folder", description: "Storage folder of the file" },
      filename: { label: "File name", description: "Stored file name" },
      expires: {
        label: "Expires",
        description: "Unix time the signed link stops working",
      },
      sig: { label: "Signature", description: "Signature of the link" },
    },
    response: {
      created: "Created",
      object: "Object type",
      text: "Text",
      id: "Job ID",
      status: "Status",
    },
    errors: {
      badSize: "size '{{size}}' is not WIDTHxHEIGHT (like 1024x1024) or auto.",
      maskUnsupported:
        "Masks are not supported. Describe the change in the prompt instead.",
      oneImageOnly: "One image per edit. Send a single 'image'.",
      imageTooLarge: "The image is larger than {{max}} MB.",
      imageRequired:
        "Send the image to edit: multipart field 'image', or 'image_url' in JSON.",
      modelCannotEdit:
        "{{model}} does not take an input image. Pick an image-to-image model from GET /v1/models (input_modalities contains image).",
      storageFailed:
        "The file was generated but could not be stored. Try again.",
      voiceNotFound:
        "No voice '{{voice}}' available to you. List voices with GET /v1/models (modality: speech), or use model tts-1 with voice nova.",
      formatUnsupported:
        "{{voice}} delivers {{supported}}. Ask for one of those as response_format.",
      audioTooLarge: "The audio file is larger than 25 MB.",
      fileRequired: "Upload the audio as multipart field 'file'.",
      translationUnsupported:
        "{{model}} cannot translate. Translation to English runs on whisper-1.",
      jobNotFound: "No {{kind}} job '{{id}}' on this account.",
      jobNotReady:
        "The {{kind}} job '{{id}}' is {{status}}. Download it once its status is completed.",
      jobInterrupted:
        "The job stopped when its server restarted. Nothing was charged. Submit it again.",
      jobNotCreated:
        "The job could not be saved. Nothing was charged. Try again.",
      mediaNotFound:
        "File not found, or the link expired. Get a fresh link from the job, or send your API key.",
      modelNoImageInput:
        "{{model}} does not take a first-frame image. Pick an image-to-video model from GET /v1/models, or drop the image.",
      modelNeedsImage:
        "{{model}} animates an image. Send input_reference or image_url.",
      resolutionUnsupported:
        "{{model}} renders {{supported}}. Ask for one of those as resolution.",
    },
  },

  errors: {
    validation: { title: "Validation error", description: "Invalid request" },
    unauthorized: {
      title: "Unauthorized",
      description: "A valid API key is required",
    },
    server: {
      title: "Server error",
      description: "Internal server error",
    },
    unknown: {
      title: "Unknown error",
      description: "An unknown error occurred",
    },
    network: { title: "Network error", description: "Network error occurred" },
    forbidden: { title: "Forbidden", description: "Access denied" },
    notFound: { title: "Not found", description: "Model not found" },
    conflict: {
      title: "Conflict",
      description: "Request conflicts with state",
    },
  },
};
