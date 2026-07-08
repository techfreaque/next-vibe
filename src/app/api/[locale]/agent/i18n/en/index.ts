export const translations = {
  category: "Agent",
  tags: {
    streaming: "Streaming",
    chat: "Chat",
    ai: "AI",
    status: "Status",
    processing: "Processing",
    classification: "Classification",
    automation: "Automation",
    execution: "Execution",
    confirmation: "Confirmation",
    speech: "Speech",
    transcription: "Transcription",
    tts: "Text-to-Speech",
  },
  enums: {
    emailAgentStatus: {
      pending: "Pending",
      processing: "Processing",
      hardRulesComplete: "Hard Rules Complete",
      aiProcessing: "AI Processing",
      awaitingConfirmation: "Awaiting Confirmation",
      completed: "Completed",
      failed: "Failed",
      skipped: "Skipped",
    },
    emailAgentActionType: {
      markBounced: "Mark Bounced",
      markSpam: "Mark Spam",
      classifyDeliveryFailure: "Classify Delivery Failure",
      respondToEmail: "Respond to Email",
      deleteEmail: "Delete Email",
      searchKnowledgeBase: "Search Knowledge Base",
      webSearch: "Web Search",
      escalateToHuman: "Escalate to Human",
      noAction: "No Action",
      chainAnalysis: "Chain Analysis",
    },
    emailAgentToolType: {
      knowledgeBaseSearch: "Knowledge Base Search",
      emailResponse: "Email Response",
      emailDelete: "Email Delete",
      webSearch: "Web Search",
    },
    bounceCategory: {
      hardBounce: "Hard Bounce",
      softBounce: "Soft Bounce",
      spamComplaint: "Spam Complaint",
      unsubscribe: "Unsubscribe",
      blockBounce: "Block Bounce",
      invalidAddress: "Invalid Address",
      mailboxFull: "Mailbox Full",
      contentRejected: "Content Rejected",
    },
    confirmationStatus: {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      expired: "Expired",
    },
    processingPriority: {
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent",
    },
    sortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
    emailAgentSortField: {
      emailId: "Email ID",
      status: "Status",
      lastProcessedAt: "Last Processed At",
      createdAt: "Created At",
      priority: "Priority",
    },
    emailAgentStatusFilter: {
      all: "All",
      pending: "Pending",
      processing: "Processing",
      hardRulesComplete: "Hard Rules Complete",
      aiProcessing: "AI Processing",
      awaitingConfirmation: "Awaiting Confirmation",
      completed: "Completed",
      failed: "Failed",
      skipped: "Skipped",
    },
    emailAgentActionTypeFilter: {
      all: "All",
      markBounced: "Mark Bounced",
      markSpam: "Mark Spam",
      classifyDeliveryFailure: "Classify Delivery Failure",
      respondToEmail: "Respond to Email",
      deleteEmail: "Delete Email",
      searchKnowledgeBase: "Search Knowledge Base",
      webSearch: "Web Search",
      escalateToHuman: "Escalate to Human",
      noAction: "No Action",
      chainAnalysis: "Chain Analysis",
    },
    confirmationStatusFilter: {
      all: "All",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      expired: "Expired",
    },
    processingPriorityFilter: {
      all: "All",
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent",
    },
    confirmationResponseAction: {
      approve: "Approve",
      reject: "Reject",
    },
    modelUtilities: {
      chat: "Chat",
      coding: "Coding",
      creative: "Creative Writing",
      analysis: "Analysis",
      reasoning: "Reasoning",
      roleplay: "Roleplay",
      fast: "Fast",
      smart: "Smart",
      vision: "Vision",
      imageGen: "Image Generation",
      politicalLeft: "Political Left",
      politicalRight: "Political Right",
      controversial: "Controversial",
      adultImplied: "Adult (Implied)",
      adultExplicit: "Adult (Explicit)",
      violence: "Violence",
      harmful: "Harmful Content",
      illegalInfo: "Illegal Information",
      medicalAdvice: "Medical Advice",
      offensiveLanguage: "Offensive Language",
      roleplayDark: "Dark Roleplay",
      conspiracy: "Conspiracy",
      legacy: "Legacy",
      uncensored: "Uncensored",
    },
  },
  aiStream: {
    category: "Agent",
    tags: {
      streaming: "Streaming",
      chat: "Chat",
      ai: "AI",
    },

    run: {
      task: {
        name: "AI Heartbeat",
        description:
          "Background AI agent that checks system health, works through tasks, and contacts the human when needed",
      },
      post: {
        title: "Run AI Agent",
        dynamicTitle: "AI Run{{suffix}}: {{prompt}}",
        description:
          "Delegate a task to a specialist AI agent and return its response. To create or edit AI skills/personas, always delegate to skill='skill-creator' - never attempt it yourself. Pass skill + prompt; the agent handles everything else. Credits consumed based on model.",
        container: {
          title: "AI Agent Run",
          description:
            "Configure pre-calls and prompt for headless AI execution",
        },
        fields: {
          favoriteId: {
            label: "Favorite ID",
            description:
              "Slug or ID of a saved favorite. Loads skill, model, and tool config as defaults. Explicit fields in this request override favorite values.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          model: {
            label: "Model",
            description:
              "LLM for text reasoning. Optional when favoriteId or skill is set. Fast: claude-haiku-4.5, gemini-2.5-flash. Balanced: claude-sonnet-4.6, gpt-5. Powerful: claude-opus-4.7. Free: qwen3_235b-free. Not for image/audio/video generation.",
          },
          skill: {
            label: "Skill",
            description:
              "Skill ID or default skill name. Defines the AI persona and system prompt. Use 'skill-creator' to create/edit AI skills. Optional when favoriteId is set.",
            placeholder: "default",
          },
          prompt: {
            label: "Prompt",
            description:
              "The main instruction or question for the AI. Be specific - the AI will use preCalls results as context if provided.",
            placeholder: "Enter your prompt...",
          },
          instructions: {
            label: "Extra System Instructions",
            description:
              "Optional extra instructions appended to the system prompt. Use to constrain format, tone, or output length (e.g. 'Be concise. JSON only.').",
            placeholder: "Be concise. One paragraph max.",
          },
          preCalls: {
            label: "Pre-Calls",
            description:
              "Tool calls to execute before the prompt. Results are injected as context. Use tool-help to discover available tools and their args.",
            routeId: {
              label: "Tool ID",
              description:
                "Alias or full tool name to call (e.g. 'web-search', 'agent_skills_GET'). Use tool-help to discover tools.",
              placeholder: "web-search",
            },
            args: {
              label: "Arguments",
              description:
                'Flat key-value args for the tool - merge urlPathParams and body fields into one object (e.g. {"query": "latest news", "maxResults": 5}).',
            },
          },
          availableTools: {
            label: "Allowed to Execute",
            description:
              "Which tools the AI may run. null = all permitted. Array = restrict to listed tools only. Standard: [{toolId:'execute-tool'},{toolId:'tool-help'}].",
            toolId: {
              label: "Tool ID",
              description:
                "Tool alias or full name (e.g. 'execute-tool', 'tool-help', 'web-search')",
            },
            requiresConfirmation: {
              label: "Requires Confirmation",
              description:
                "Pause for user confirmation before running this tool",
            },
          },
          pinnedTools: {
            label: "In Context (model sees these)",
            description:
              "Tools loaded into model context. null = user's default set. Only affects what the model sees, not what it can execute.",
            toolId: {
              label: "Tool ID",
              description: "Tool alias or full name to load into context",
            },
            requiresConfirmation: {
              label: "Requires Confirmation",
              description:
                "Whether this tool requires user confirmation before execution",
            },
          },
          maxTurns: {
            label: "Max Turns",
            description:
              "Maximum agentic turns (tool-call cycles) before stopping. Default: unlimited. Set to 1 for a single prompt+response with no tool calls.",
          },
          appendThreadId: {
            label: "Thread ID (continue)",
            description:
              "UUID of an existing thread to continue. The new message is appended to that conversation. Omit to start a fresh thread.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          rootFolderId: {
            label: "Storage Folder",
            description:
              "Where to store the thread. Background = all automated runs (Dreamer, Autopilot, scheduled tasks). Private = your folder. Shared = team. Incognito = no storage.",
            placeholder: "background",
            options: {
              background: "Background",
              private: "Private",
              shared: "Shared",
              incognito: "Incognito (no storage)",
            },
          },
          subFolderId: {
            label: "Sub-folder ID",
            description:
              "Optional UUID of a sub-folder within the root folder. For manual organisation only - do NOT pass this when calling ai-run programmatically or from AI tools. Leave empty in all automated/agent contexts.",
            placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          },
          excludeMemories: {
            label: "Exclude Memories",
            description:
              "Skip injecting stored memories into context. Use for public bots or isolated tasks. Default: false.",
          },
        },
        response: {
          text: "The AI's response text (think-tags stripped). Null if the model produced no output.",
          promptTokens: "Prompt tokens consumed (input cost)",
          completionTokens: "Completion tokens generated (output cost)",
          creditCost: "Credits charged for this run. Null for incognito runs.",
          threadId:
            "Thread UUID where the run was stored. Null if rootFolderId was 'incognito'. Use this to continue the conversation via appendThreadId.",
          lastAiMessageId:
            "UUID of the final assistant message. Useful for branching or referencing the response.",
          threadTitle: "Auto-generated title for this thread",
          threadCreatedAt: "Thread creation timestamp (ISO 8601)",
          preCallResults: {
            title: "Pre-call Results",
            routeId: "Tool that was called",
            succeeded: "Whether the call succeeded",
            errorMessage: "Error message if the call failed",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid parameters provided",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied",
          },
          notFound: {
            title: "Not Found",
            description: "Route or resource not found",
          },
          internal: {
            title: "Server Error",
            description: "Internal server error during AI run",
          },
          network: {
            title: "Network Error",
            description: "Network error during AI run",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Unsaved changes conflict",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
        },
        success: {
          title: "AI Run Complete",
          description: "The AI agent completed successfully",
        },
        backButton: {
          label: "Back",
        },
      },
    },
    route: {
      debug: {
        userObject: "AI Stream Route: User object",
        extracted: "AI Stream Route: Extracted values",
      },
      errors: {
        invalidJson: "Invalid JSON in request body",
        invalidRequestData: "Invalid request data ({{issue}})",
        uncensoredApiKeyMissing: "Uncensored.ai API key not configured",
        openrouterApiKeyMissing: "OpenRouter API key not configured",
        streamCreationFailed:
          "Failed to connect to the AI service. Please try again.",
        unknownError: "An error occurred",
        creditValidationFailed: "Failed to validate credit balance",
        noIdentifier: "No user or lead identifier provided",
        insufficientCredits:
          "Insufficient credits to complete this request (cost: {{cost}}, balance: {{balance}})",
        noResponseBody: "No response body received from stream",
        authenticationRequired:
          "Please log in to use persistent folders. Use incognito mode for anonymous chats.",
      },
    },
    post: {
      title: "AI Stream Chat",
      titleShort: "AI Chat",
      description:
        "Stream AI-powered chat responses using {{modelCount}} models (Claude, GPT, Gemini, Llama, and more). Supports text, voice, file attachments, and agentic tool use.",
      form: {
        title: "AI Chat Configuration",
        description: "Configure AI chat parameters and messages",
      },
      operation: {
        label: "Operation",
        description: "Type of message operation to perform",
        options: {
          send: "Send Message",
          retry: "Retry Message",
          edit: "Edit Message",
          answerAsAi: "Answer as AI",
        },
      },
      rootFolderId: {
        label: "Root Folder",
        description: "Root folder context for the message",
      },
      subFolderId: {
        label: "Subfolder",
        description: "Optional subfolder within the root folder",
      },
      threadId: {
        label: "Thread ID",
        description:
          "UUID of the thread to send this message to. Must be a valid UUID - create a thread first if you don't have one.",
      },
      userMessageId: {
        label: "User Message ID",
        description: "Client-generated user message ID",
      },
      parentMessageId: {
        label: "Parent Message ID",
        description: "Parent message ID for branching/threading",
      },
      leafMessageId: {
        label: "Leaf Message ID",
        description:
          "Current branch leaf message ID - tracks active branch without relying on URL",
      },
      messageHistory: {
        label: "Message History",
        description: "Optional message history for incognito mode",
        item: {
          title: "Message",
          description: "Chat message in history",
          role: {
            label: "Role",
          },
          content: {
            label: "Content",
          },
          metadata: {
            toolCall: {
              toolName: {
                label: "Tool Name",
              },
              args: {
                label: "Tool Arguments",
              },
              result: {
                label: "Tool Result",
              },
              error: {
                label: "Tool Error",
              },
              executionTime: {
                label: "Execution Time (ms)",
              },
              creditsUsed: {
                label: "Credits Used",
              },
            },
          },
        },
      },
      content: {
        label: "Message Content",
        description: "Content of the message to send",
        placeholder: "Enter your message...",
      },
      role: {
        label: "Role",
        description: "Role of the message sender",
        options: {
          user: "User",
          assistant: "Assistant",
          system: "System",
        },
      },
      model: {
        label: "Model",
        description: "AI model to use for generation",
      },
      skill: {
        label: "Skill",
        description: "Optional skill to use for the AI",
      },
      systemPrompt: {
        label: "System Prompt",
        description: "Optional system instructions",
        placeholder: "Enter system prompt...",
        now: "now",
        minutesAgo: "{{minutes}}m ago",
        hoursAgo: "{{hours}}h ago",
        daysAgo: "{{days}}d ago",
      },
      enableSearch: {
        label: "Enable Web Search",
        description: "Allow AI to search the web for current information",
      },
      timezone: {
        label: "Timezone",
        description: "User timezone for cache-stable timestamps",
      },
      imageSize: {
        label: "Image Size",
        description:
          "Size of the generated image (e.g. square, landscape, portrait)",
      },
      imageQuality: {
        label: "Image Quality",
        description: "Quality setting for the generated image (standard or hd)",
      },
      musicDuration: {
        label: "Music Duration",
        description: "Duration of the generated audio clip",
      },
      favoriteConfig: {
        label: "Favorite Config",
        description:
          "Active favorite's full configuration - model selections, tool config, context settings. null = no favorite active, use skill/system defaults.",
      },
      enabledToolIds: {
        label: "Enabled Tool IDs",
        description: "List of AI tool IDs to enable for this conversation",
      },
      toolConfirmation: {
        label: "Tool Confirmation",
        description: "Tool confirmation response from user",
        success: "Tool confirmation processed successfully",
        messageId: {
          label: "Message ID",
          description: "ID of the message containing the tool call",
        },
        confirmed: {
          label: "Confirmed",
          description: "Whether the user confirmed the tool execution",
        },
        updatedArgs: {
          label: "Updated Arguments",
          description: "Optional updated arguments for the tool call",
        },
        errors: {
          messageNotFound: "Tool message not found",
          toolCallMissing: "ToolCall metadata missing",
          toolNotFound: "Tool not found",
        },
      },
      resumeToken: {
        label: "Resume Token",
        description: "Token for resuming interrupted streams",
      },
      voiceMode: {
        label: "Voice Mode",
        description: "Configuration for voice-based interaction",
        enabled: {
          label: "Enable Voice Mode",
          description: "Enable voice-based interaction with text-to-speech",
        },
        voice: {
          label: "Voice",
          description:
            'Select voice type for text-to-speech. Pass "voices.MALE" for a male voice or "voices.FEMALE" (default) for a female voice.',
          male: "Male Voice",
          female: "Female Voice",
        },
      },
      audioInput: {
        title: "Audio Input",
        description: "Upload audio file for voice-to-voice mode",
        file: {
          label: "Audio File",
          description: "Audio file to transcribe and process",
        },
      },
      attachments: {
        label: "File Attachments",
        description: "Files attached to the message (images, documents, etc.)",
      },
      response: {
        title: "Stream Response",
        description: "AI-generated streaming response",
        success: "Stream completed successfully",
        messageId: "Message ID",
        threadId: "Thread ID",
        totalTokens: "Total tokens used",
        finishReason: "Completion reason",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required for AI streaming",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters provided",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred while streaming",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access to AI streaming is forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "AI streaming endpoint not found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes that need to be saved first",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred during streaming",
        },
      },
      success: {
        title: "Success",
        description: "AI stream generated successfully",
      },
    },
    enums: {
      role: {
        user: "User",
        assistant: "Assistant",
        system: "System",
      },
    },
    streamingErrors: {
      aiStream: {
        error: {
          apiKey: {
            missing: "OpenAI API key is missing",
            invalid: "OpenAI API key is invalid",
          },
          configuration: "AI streaming configuration error",
          processing: "Error processing AI stream",
        },
      },
    },
    debugView: {
      systemPromptTitle: "System Prompt",
      copied: "Copied!",
    },
    errorTypes: {
      streamError: "Stream Error",
    },
    errorThread: {
      title: "Error",
    },
    error: {
      title: "Stream Error",
    },
    wakeUp: {
      revivalPrompt:
        "The async task you dispatched has completed. The result is in the tool message above. Please summarise what the task returned for me.",
      revivalInstructions:
        "WAKE-UP REVIVAL MODE: An async task has completed and the result is in the thread. Respond to the user's last message by summarising the tool result - 1-3 sentences only. Do NOT call any tools. Do NOT re-execute the original user request.",
    },
    info: {
      streamInterrupted:
        "Generation was stopped. Partial response has been saved.",
    },
    errors: {
      toolExecutionError:
        "A tool failed to execute properly. Please try again.",
      toolExecutionErrorDetail: "Tool error: {{error}}",
      toolExecutionFailed: "Tool execution failed. Please try again.",
      toolDisabledByUser:
        "This tool has been disabled by the user. Do not attempt to call it again.",
      userDeclinedTool: "Tool execution was cancelled.",
      streamError: "The AI response failed to complete. Please try again.",
      pendingToolCall:
        "A tool is still running in the background. Please wait for it to complete before continuing.",
      streamProcessingError:
        "Failed to process the AI response. Please try again.",
      timeout:
        "The AI took too long to respond (timeout after {{maxDuration}} seconds). Please try again with a shorter message.",
      noResponse: "The AI did not generate a response. Please try again.",
      modelUnavailable:
        "The selected AI model is currently unavailable. Please try a different model.",
      rateLimitExceeded:
        "Too many requests. Please wait a moment and try again.",
      insufficientCredits: "Not enough credits to complete this request.",
      connectionFailed:
        "Failed to connect to the AI service. Please check your connection and try again.",
      invalidRequest: "Invalid request. Please check your input and try again.",
      compactingStreamError:
        "Context limit reached - your conversation is too long for automatic compacting. Try branching from an earlier message, switching to a model with a larger context window, or adjusting the context window in your favorite settings.",
      compactingStreamErrorExpensive:
        "Context limit reached ({{tokens}} tokens). Expanding the context window is possible but may be expensive. Try branching from an earlier message or switching models first.",
      compactingException:
        "Failed to compact conversation history. Try branching from an earlier point in the conversation or switching to a different model.",
      compactingRebuildFailed:
        "Failed to rebuild conversation after compacting. Try branching from an earlier message.",
      unexpectedError:
        "An unexpected error occurred: {{error}}. Please try again.",
    },
    headless: {
      errors: {
        // Thrown when runHeadlessAiStream() is called without a resolvable model+skill.
        // Either pass model+skill directly, or pass favoriteId pointing to a favorite
        // that has a MANUAL or FILTERS modelSelection (not SKILL_BASED with no skill).
        missingModelOrSkill:
          "model and skill are required - pass them directly or provide a favoriteId with a resolvable model selection",
        favoriteNotFound: "Favorite not found or does not belong to this user",
      },
    },
    resumeStream: {
      post: {
        title: "Resume AI Stream",
        description:
          "Continue an existing thread by running a headless AI turn. Used after an async remote task completes (callbackMode=wait or wakeUp). Pass favoriteId to load model+skill in one shot, or set modelId+skillId explicitly.",
        fields: {
          threadId: {
            title: "Thread ID",
            description: "UUID of the existing thread to continue.",
          },
          favoriteId: {
            title: "Favorite ID",
            description:
              "UUID of a saved favorite to load model and skill from. Overrides modelId/skillId when both are set.",
          },
          modelId: {
            title: "Model ID",
            description:
              "AI model to use for the resumed turn. Optional when favoriteId is provided.",
          },
          skillId: {
            title: "Skill ID",
            description:
              "Skill/persona for the resumed turn. Optional when favoriteId is provided.",
          },
          callbackMode: {
            title: "Callback Mode",
            description:
              "Callback mode from the originating tool call (wait or wakeUp). Determines resume behavior.",
          },
          wakeUpToolMessageId: {
            title: "WakeUp Tool Message ID",
            description:
              "ID of the original tool call message with the backfilled result.",
          },
          wakeUpTaskId: {
            title: "WakeUp Task ID",
            description:
              "ID of the originating remote cron task, deleted after revival.",
          },
          resumeTaskId: {
            title: "Resume Task ID",
            description:
              "ID of this resume-stream cron task itself, deleted after revival.",
          },
          resumed: {
            title: "Resumed",
            description: "Whether the thread was successfully continued.",
          },
          lastAiMessageId: {
            title: "Last AI Message ID",
            description:
              "UUID of the final assistant message generated. Null if no message was produced.",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid parameters - threadId must be a valid UUID",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access denied",
          },
          notFound: {
            title: "Not Found",
            description: "Thread or model not found",
          },
          internal: {
            title: "Server Error",
            description: "Internal error during stream resume",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Unsaved changes conflict",
          },
          conflict: {
            title: "Conflict",
            description: "Conflict occurred",
          },
        },
        success: {
          title: "Stream Resumed",
          description: "The AI thread was successfully continued",
        },
      },
    },
    providers: {
      uncensoredHandler: {
        errors: {
          apiError: "Uncensored.ai API error ({{status}}): {{errorText}}",
        },
      },
    },
    onboarding: {
      back: "Back",
      welcome: {
        title: "One AI for everything. The right one for each thing.",
        line1:
          "A companion for everyday conversation. Specialists for coding, research, writing - you pick one when the task calls for it.",
        line2: "Same chat. You switch when it matters. Takes seconds.",
        line3: "Let's get you set up in under a minute.",
        continue: "Get Started",
      },
      guest: {
        title: "You're browsing as a guest",
        line1:
          "Your settings, companion, and chat history are saved locally on this device only.",
        line2:
          "Sign in to keep everything synced across devices - and make sure you never lose your setup.",
        signIn: "Sign In / Create Account",
        continueAnyway: "Continue as Guest",
        note: "You can sign in later from the menu at any time.",
      },
      companion: {
        title: "Choose your companion",
        subtitle: "Your main chat partner for everyday use",
        modelTitle: "Which model should power it?",
        customSetup: "Advanced setup →",
        next: "Next",
        selectFirst: "Pick a companion to continue",
      },
      usecases: {
        title: "What will you mostly use it for?",
        subtitle:
          "We'll add the right specialists to your AI's toolkit automatically.",
        saving: "Setting up...",
        start: "Start Chatting",
        hintNoneSelected:
          "Select areas to set up specialist skills, or tap Start to skip",
        noProviderAvailable:
          "No AI provider configured. Add OPENROUTER_API_KEY or enable Claude Code (CLAUDE_CODE_ENABLED=true) to continue.",
        coding: {
          label: "Coding & Tech",
          hint: "Vibe Coder, Coder",
        },
        research: {
          label: "Research & Analysis",
          hint: "Researcher, Data Analyst",
        },
        writing: {
          label: "Writing & Editing",
          hint: "Writer, Editor",
        },
        business: {
          label: "Business & Strategy",
          hint: "Business Advisor, Product Manager",
        },
        learning: {
          label: "Learning & Study",
          hint: "Tutor, Socratic Questioner",
        },
        creative: {
          label: "Creative & Stories",
          hint: "Storyteller, Creative",
        },
        health: {
          label: "Health & Career",
          hint: "Health Wellness, Career Coach",
        },
        controversial: {
          label: "Free Thinking",
          hint: "Uncensored, Philosopher",
        },
        roleplay: {
          label: "Roleplay & Characters",
          hint: "Roleplay, Character Creator",
        },
      },
    },
    input: {
      placeholder: "Send a message...",
      imagePlaceholder: "Describe an image to generate...",
      audioPlaceholder: "Describe audio or music to generate...",
      noPermission: "You don't have permission to post here",
      keyboardShortcuts: {
        enter: "Enter",
        toSend: "to send",
        shiftEnter: "Shift+Enter",
        forNewLine: "for new line",
        ctrlV: "Ctrl+V",
        orPasteFiles: "or paste files",
      },
      speechInput: {
        transcribing: "Transcribing...",
      },
      attachments: {
        uploadFile: "Attach files",
        attachedFiles: "Attached Files",
        addMore: "Add More",
      },
    },
    imageGen: {
      sizeSquare: "Square (1024×1024)",
      sizeLandscape: "Landscape (1792×1024)",
      sizePortrait: "Portrait (1024×1792)",
      qualityStandard: "Standard",
      qualityHD: "HD",
    },
    audioGen: {
      durationShort: "Short (~8s)",
      durationMedium: "Medium (~15s)",
      durationLong: "Long (~30s)",
    },
    voiceMode: {
      unconfiguredTitle: "Voice Not Configured",
      unconfiguredDescription:
        "Text-to-speech is not available for this skill.",
      callMode: "Call mode",
      callModeDescription: "AI will respond with voice",
      tapToRecord: "Tap to record",
      recording: {
        paused: "Paused",
        resume: "Resume",
        pause: "Pause",
      },
      callOverlay: {
        listening: "Listening...",
      },
      actions: {
        cancel: "Cancel",
        toInput: "To Input",
        sendVoice: "Send Voice",
        retry: "Retry",
        download: "Download Audio",
        downloadHint:
          "Download the file and attach it to your next message instead.",
      },
    },
    actions: {
      cancellingGeneration: "Cancelling...",
      stopGeneration: "Stop",
      sendMessage: "Send",
    },
    toolsButton: {
      title: "AI Tools",
      tools: "Tools",
    },
  },
  chat: {
    category: "Chat",
    tags: {
      threads: "Threads",
      folders: "Folders",
      files: "Files",
      messages: "Messages",
      characters: "Skills",
      memories: "Memories",
      favorites: "Favorites",
      credits: "Credits",
      balance: "Balance",
      permissions: "Permissions",
      hotkey: "Hotkey",
      cli: "CLI",
      speech: "Speech",
      sharing: "Sharing",
      settings: "Settings",
    },
    config: {
      appName: "unbottled.ai",
      folders: {
        private: "Private",
        shared: "Shared",
        public: "Public",
        incognito: "Incognito",
        background: "Background",
        remote: "Remote",
      },
      foldersShort: {
        private: "Private",
        shared: "Shared",
        public: "Public",
        incognito: "Incognito",
        background: "Background",
        remote: "Remote",
      },
    },
    enums: {
      role: {
        user: "User",
        assistant: "Assistant",
        system: "System",
        tool: "Tool",
        error: "Error",
      },
      threadStatus: {
        active: "Active",
        archived: "Archived",
        deleted: "Deleted",
      },
      viewMode: {
        linear: "Linear",
        threaded: "Threaded",
        flat: "Flat",
        debug: "Debug",
      },
    },
    components: {
      sidebar: {
        login: "Login",
        logout: "Logout",
        footer: {
          account: "Account",
          profile: "Profile",
          balance: "Balance",
          buy: "Buy",
          freeCreditsLeft: "Free credits",
        },
      },
      credits: {
        credit: "{{count}} credit",
        credits: "{{count}} credits",
      },
      navigation: {
        subscription: "Subscription & Credits",
        referral: "Referral Program",
        help: "Help",
        about: "About",
      },
      confirmations: {
        deleteMessage: "Are you sure you want to delete this message?",
      },
      welcomeTour: {
        authDialog: {
          title: "Unlock Private & Shared Folders",
          description:
            "Sign up or log in to access private and shared folders. Your chats will sync across devices.",
          continueTour: "Continue Tour",
          signUp: "Sign Up / Login",
        },
        buttons: {
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          skip: "Skip",
        },
        welcome: {
          title: "Welcome to {{appName}}!",
          description:
            "Your privacy-first AI platform with {{modelCount}} models, user-controlled content filtering, and free speech principles.",
          subtitle: "Let's take a quick tour to get you started.",
        },
        aiCompanion: {
          title: "Choose Your AI Companion",
          description:
            "Select from {{modelCount}} AI models including mainstream, open-source, and uncensored options.",
          tip: "Click to open the model selector and pick your companion.",
        },
        rootFolders: {
          title: "Your Chat Folders",
          description:
            "Organize your chats in different folders, each with unique privacy settings:",
          private: {
            name: "Private",
            suffix: "— only you can see",
          },
          incognito: {
            name: "Incognito",
            suffix: "— no history saved",
          },
          shared: {
            name: "Shared",
            suffix: "— collaborate with others",
          },
          public: {
            name: "Public",
            suffix: "— visible to everyone",
          },
        },
        privateFolder: {
          name: "Private",
          suffix: "Folder",
          description:
            "Your private chats are only visible to you. Perfect for sensitive topics.",
        },
        incognitoFolder: {
          name: "Incognito",
          suffix: "Folder",
          description:
            "Chat without saving history to the server. Messages are stored locally in your browser and persist until you clear them.",
          note: "No data is stored on our servers during incognito sessions.",
        },
        sharedFolder: {
          name: "Shared",
          suffix: "Folder",
          description:
            "Collaborate with specific people by sharing access to this folder.",
        },
        publicFolder: {
          name: "Public",
          suffix: "Folder",
          description:
            "Share your AI conversations with the world. Others can view and fork your threads.",
          note: "Everything in Public is visible to all users and search engines.",
        },
        newChatButton: {
          title: "Start a New Chat",
          description:
            "Click here to start a fresh conversation in any folder.",
        },
        sidebarLogin: {
          title: "Sign In to Unlock More",
          description:
            "Create a free account to access Private and Shared folders, sync your conversation history across devices, and let the AI remember things about you.",
          tip: "It's free to sign up!",
        },
        subscriptionButton: {
          title: "Credits & Subscription",
          description:
            "Get {{credits}} credits/month with a subscription for just {{price}}/month. Free users get {{freeCredits}} credits/month.",
        },
        chatInput: {
          title: "Type Your Message",
          description:
            "Type your message here and press Enter or click Send to chat with your AI companion.",
          tip: "Use Shift+Enter for a new line. You can also attach files and images.",
        },
        voiceInput: {
          title: "Voice Input",
          description: "Use your microphone to speak to your AI companion:",
          options: {
            transcribe: "Transcribe speech to text",
            sendAudio: "Send audio directly to the AI",
            pauseResume: "Pause and resume recording",
          },
        },
        callMode: {
          title: "Call Mode",
          description:
            "Enable Call Mode for a hands-free, voice-driven conversation experience with real-time AI responses.",
          tip: "Perfect for when you're on the go or prefer speaking over typing.",
        },
        complete: {
          title: "You're All Set!",
          description:
            "You've completed the tour! Start chatting with your AI companion now.",
          help: "Need help? Click the question mark icon in the sidebar anytime.",
        },
        authUnlocked: {
          unlocked: "Unlocked!",
          privateDescription:
            "Your private folder is now available. All chats here are only visible to you.",
          privateNote:
            "Private chats sync across all your devices automatically.",
          sharedDescription:
            "Your shared folder is now available. Invite others to collaborate on AI conversations.",
          sharedNote:
            "You control who has access to your shared folders and threads.",
        },
      },
    },
    selector: {
      loading: "Loading...",
      best: "Best Match",
      free: "FREE",
      creditsSingle: "1 credit",
      creditsExact: "{{cost}} credits",
      modelOnly: "Model Only",
      editModelSettings: "Edit model settings",
      editSettings: "Edit settings",
      switchSkill: "Switch Skill",
      editSkill: "Edit Skill",
      delete: "Delete",
      autoSelectedModel: "FILTER-BASED",
      manualSelectedModel: "MANUALLY SELECTED",
      intelligence: "Intelligence",
      contentFilter: "Content",
      maxPrice: "Max Price",
      modelSelection: "Model Selection",
      autoModeDescription: "Best model is selected based on your filters",
      manualModeDescription: "Choose a specific model manually",
      autoMode: "Filter-Based",
      manualMode: "Manual",
      allModelsCount: "All {{count}} models",
      filteredModelsCount: "{{count}} models match filters",
      showFiltered: "Show filtered",
      showAllModels: "Show all models",
      showLess: "Show less",
      showMore: "Show {{remaining}} more",
      showLegacyModels_one: "Show {{count}} Legacy Model",
      showLegacyModels_other: "Show {{count}} Legacy Models",
      noMatchingModels: "No matching models",
      noModelsWarning: "No models match your filters",
      useOnce: "Use Once",
      saveAsDefault: "Add to favorites",
      deleteSetup: "Delete Setup",
      content: "Search content...",
      characterSetup: "Skill Setup",
      noResults: "No results",
      add: "Add to favorites",
      added: "Added",
      addNew: "Add New",
      searchSkills: "Search characters...",
      createCustom: "Create Custom",
      customizeSettings: "Customize Settings",
      requirements: {
        characterConflict: "Skill requirement conflicts",
        tooLow: "too low",
        tooHigh: "too high",
        min: "min",
        max: "max",
      },
    },
    common: {
      newChat: "New Chat",
      privateChats: "Private Chats",
      search: "Search",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      settings: "Settings",
      close: "Close",
      toggleSidebar: "Toggle sidebar",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      searchPlaceholder: "Search...",
      searchThreadsPlaceholder: "Search threads...",
      searchResults: "Search Results",
      noChatsFound: "No chats found",
      noThreadsFound: "No threads found",
      enableTTSAutoplay: "Enable TTS Autoplay",
      disableTTSAutoplay: "Disable TTS Autoplay",
      selector: {
        country: "Country",
        language: "Language",
      },
      copyButton: {
        copied: "Copied!",
        copyToClipboard: "Copy to clipboard",
        copyAsMarkdown: "Copy as Markdown",
        copyAsText: "Copy as Text",
      },
      assistantMessageActions: {
        cancelLoading: "Cancel loading",
        stopAudio: "Stop audio",
        playAudio: "Play audio",
        answerAsAI: "Answer as AI model",
        deleteMessage: "Delete message",
      },
      characterSelector: {
        placeholder: "Select character",
        addNewLabel: "Create custom character",
        grouping: {
          bySource: "By Source",
          byCategory: "By Category",
          sourceLabels: {
            builtIn: "Built-in",
            my: "My Skills",
            community: "Community",
          },
          sourceIcons: {
            builtIn: "sparkles",
            my: "user",
            community: "people",
          },
        },
        addDialog: {
          title: "Create Custom Skill",
          fields: {
            name: {
              label: "Name",
              placeholder: "Enter character name",
            },
            icon: {
              label: "Icon (emoji)",
              placeholder: "😊",
            },
            description: {
              label: "Description",
              placeholder: "Brief description of the character",
            },
            systemPrompt: {
              label: "System Prompt",
              placeholder: "Define how the character behaves...",
            },
            category: {
              label: "Category",
            },
          },
          createCategory: "Create Category",
          cancel: "Cancel",
          create: "Create Skill",
        },
        addCategoryDialog: {
          title: "Create Category",
          fields: {
            name: {
              label: "Category Name",
              placeholder: "Enter category name",
            },
            icon: {
              label: "Icon (emoji)",
              placeholder: "📁",
            },
          },
          cancel: "Cancel",
          create: "Create Category",
        },
      },
    },
    actions: {
      newChatInFolder: "New chat in folder",
      newFolder: "New Folder",
      deleteFolder: "Delete Folder",
      deleteMessage: "Delete message",
      deleteThisMessage: "Delete this message",
      searchEnabled: "Search enabled",
      searchDisabled: "Search disabled",
      answerAsAI: "Answer as AI model",
      retry: "Retry with different model/character",
      branch: "Branch conversation from here",
      editMessage: "Edit message",
      stopAudio: "Stop audio playback",
      playAudio: "Play audio",
      copyContent: "Copy to clipboard",
    },
    dialogs: {
      searchAndCreate: "Search & Create",
      deleteChat: 'Delete chat "{{title}}"?',
      deleteFolderConfirm:
        'Delete folder "{{name}}" and move {{count}} chat(s) to General?',
    },
    views: {
      linearView: "Linear view (ChatGPT style)",
      threadedView: "Threaded view (Reddit/Discord style)",
      flatView: "Flat view (4chan style)",
      debugView: "Debug view (with system prompts)",
    },

    screenshot: {
      capturing: "Capturing...",
      capture: "Capture Screenshot",
      failed: "Failed to capture screenshot",
      failedWithMessage: "Failed to capture screenshot: {{message}}",
      tryAgain: "Failed to capture screenshot. Please try again.",
      noMessages:
        "Could not find chat messages area. Please ensure you have messages in the chat.",
      quotaExceeded: "Storage quota exceeded. Screenshot is too large.",
      canvasError: "Failed to convert screenshot to image format.",
    },
    errors: {
      noResponse:
        "No response received from AI. The request completed but returned empty content. Please try again.",
      noStream: "Failed to stream response: No reader available",
      saveFailed: "Failed to save edit",
      branchFailed: "Failed to branch",
      retryFailed: "Failed to retry",
      answerFailed: "Failed to answer",
      deleteFailed: "Failed to delete",
    },
    errorTypes: {
      streamError: "Stream error",
    },
    hooks: {
      stt: {
        "endpoint-not-available": "Speech-to-text endpoint not available",
        "failed-to-start": "Failed to start recording",
        "permission-denied":
          "Microphone access blocked. Allow microphone in your browser settings and reload the page.",
        "permission-denied-ios":
          "Microphone blocked. Go to Settings → Safari → Microphone and allow access for this site.",
        "permission-denied-android":
          "Microphone blocked. Tap the lock icon in the address bar → Site settings → Microphone → Allow.",
        "permission-denied-mac":
          "Microphone blocked. Open System Settings → Privacy & Security → Microphone and enable your browser.",
        "permission-denied-windows":
          "Microphone blocked. Open Settings → Privacy → Microphone and make sure your browser is allowed.",
        "no-microphone":
          "No microphone found. Connect a microphone or headset and try again.",
        "microphone-in-use":
          "Your microphone is being used by another app. Close it and try again.",
        "not-supported":
          "Your browser doesn't support microphone access. Try Chrome, Firefox, or Safari.",
        "transcription-failed": "Failed to transcribe audio",
        "audio-too-short":
          "Recording too short. Hold the mic and speak clearly, then try again.",
      },
      tts: {
        "endpoint-not-available": "Text-to-speech endpoint not available",
        "failed-to-play": "Failed to play audio",
        "conversion-failed": "TTS conversion failed",
        "failed-to-generate": "Failed to generate audio",
      },
    },
    post: {
      title: "Chat",
      description: "Chat interface",
    },
    models: {
      descriptions: {
        uncensoredLmV11:
          "Uncensored AI model for creative and unrestricted conversations",
        freedomgptLiberty:
          "FreedomGPT Liberty - Uncensored AI model focused on free expression and creative content",
        gabAiArya:
          "Gab AI Arya - Uncensored conversational AI model with free expression and creative capabilities",
        gemini31ProPreviewCustomTools:
          "Gemini 3.1 Pro Preview (Custom Tools) - Gemini 3.1 Pro variant with improved tool selection that prevents overuse of bash tools in favor of more efficient third-party functions, ideal for coding agents and multi-tool workflows",
        gemini31FlashImagePreview:
          "Gemini 3.1 Flash Image Preview - Google's multimodal model that generates images directly from text prompts via chat, supporting both text and image output in the same conversation",
        gemini31FlashLitePreview:
          "Gemini 3.1 Flash Lite Preview - Google's high-efficiency model optimized for high-volume use cases, outperforming Gemini 2.5 Flash Lite with improvements in audio, RAG ranking, translation, and code completion",
        gemini3Pro:
          "Google Gemini 3 Pro - Advanced multimodal AI model with large context window and powerful reasoning capabilities",
        gemini35Flash:
          "Gemini 3.5 Flash - Near-Pro coding and reasoning at Flash cost. Handles text, images, video, audio, and PDFs. Parallel agentic loops built-in. Thinking levels from minimal to high for precise cost/performance control.",
        gemini3Flash:
          "Google Gemini 3 Flash - Fast, efficient multimodal AI model optimized for quick responses",
        deepseekV32:
          "DeepSeek V3.2 - High-performance reasoning model with advanced coding capabilities",
        deepseekV4Pro:
          "DeepSeek V4 Pro - 1.6T parameter MoE powerhouse with 1M context. Built for full-codebase analysis, complex reasoning, and multi-step agent workflows.",
        deepseekV4Flash:
          "DeepSeek V4 Flash - 284B MoE at near-zero cost. 1M context, fast inference, strong coding. The efficient choice for high-throughput workloads.",
        gpt55:
          "GPT-5.5 - OpenAI's frontier model for complex professional workloads. Stronger reasoning, higher reliability, improved token efficiency. 1M+ context with text and image inputs.",
        gpt55Pro:
          "GPT-5.5 Pro - OpenAI's highest-capability model for deep reasoning on complex, high-stakes workloads. 1M+ context, long-horizon problem solving, agentic coding, precise multi-step execution.",
        gpt54Pro:
          "GPT-5.4 Pro - OpenAI's most advanced model with enhanced reasoning, 1M+ context window, and superior performance for complex, high-stakes tasks",
        gpt54:
          "GPT-5.4 - OpenAI's latest frontier model unifying Codex and GPT, with 1M+ context window for high-context reasoning, coding, and multimodal analysis",
        gpt53Codex:
          "GPT-5.3-Codex - OpenAI's most advanced agentic coding model combining frontier software engineering with broad reasoning, optimized for long-running tool-using workflows and complex development tasks",
        gpt53Chat:
          "GPT-5.3 Chat - Updated ChatGPT conversational model delivering more accurate, contextual answers with significantly reduced unnecessary refusals and caveats",
        gpt52Pro:
          "GPT-5.2 Pro - Advanced OpenAI model with enhanced reasoning and coding capabilities",
        gpt52:
          "GPT-5.2 - High-performance OpenAI model for complex tasks and analysis",
        gpt52_chat:
          "GPT-5.2 Chat - Optimized OpenAI model for conversational interactions",
        dolphin3_0_r1_mistral_24b:
          "Dolphin 3.0 R1 Mistral 24B - Uncensored large language model based on Mistral",
        dolphinLlama3_70B:
          "Dolphin Llama 3 70B - Uncensored large language model based on Llama 3",
        veniceUncensored:
          "Venice Uncensored 1.1 - Most uncensored AI model with tool calling support. Designed for maximum creative freedom and authentic interaction. Ideal for open-ended exploration, roleplay, and unfiltered dialogue with minimal content restrictions.",
        claudeOpus45:
          "Claude Opus 4.5 - Most powerful Claude model with exceptional reasoning and creative capabilities",
        claudeOpus46:
          "Claude Opus 4.6 - Powerful Claude model with exceptional reasoning and creative capabilities",
        claudeOpus47:
          "Claude Opus 4.7 - Previous-generation Opus model. Succeeded by 4.8.",
        claudeOpus48:
          "Claude Opus 4.8 - Anthropic's most capable generally available Opus model. Built for long-horizon agentic work, complex coding, and multi-step reasoning across very long outputs. 1M-token context. Supports text, image, and file inputs.",
        claudeSonnet46:
          "Claude Sonnet 4.6 - Anthropic's most capable Sonnet-class model with frontier performance across coding, agents, and professional work",
        claudeHaiku45:
          "Claude Haiku 4.5 - Fast and efficient Claude model optimized for speed and cost-effectiveness",
        glm5_1:
          "GLM-5.1 - Z.AI's next-generation coding model built for long-horizon tasks. Works autonomously for 8+ hours on a single task - planning, executing, and self-improving until it delivers engineering-grade results.",
        glm5: "GLM-5 - Z.AI's flagship open-source foundation model engineered for complex systems design and long-horizon agent workflows, rivaling leading closed-source models",
        glm5Turbo:
          "GLM-5 Turbo - Z.AI's next-generation model deeply optimized for agent-driven environments with fast inference, improved complex instruction decomposition, and extended task stability",
        glm46:
          "GLM-4 6B - Efficient Chinese-English bilingual AI model with strong general capabilities",
        glm47:
          "GLM-4 7B - Advanced Chinese-English bilingual model with improved reasoning and coding abilities",
        glm47Flash:
          "GLM-4 7B Flash - Ultra-fast Chinese-English model optimized for quick responses",
        kimiK2:
          "Kimi K2 - Powerful Chinese AI model with excellent context understanding",
        kimiK2_5:
          "Kimi K2.5 - Moonshot AI's previous-generation model with strong long-context reasoning and coding capabilities",
        kimiK2_6:
          "Kimi K2.6 - Moonshot AI's next-generation multimodal model for long-horizon coding, UI/UX generation from prompts and images, and multi-agent orchestration with agent swarm architecture scaling to hundreds of parallel sub-agents",
        claudeSonnet45:
          "Claude Sonnet 4.5 - Anthropic's previous-generation Sonnet model with strong coding and analytical capabilities",
        claudeAgentSonnet:
          "Claude Agent Sonnet - Autonomous AI agent powered by Claude Sonnet via Anthropic's Agent SDK. Executes tools independently with built-in reasoning.",
        claudeAgentHaiku:
          "Claude Agent Haiku - Fast autonomous AI agent powered by Claude Haiku via Anthropic's Agent SDK. Optimized for speed with tool execution.",
        claudeAgentOpus:
          "Claude Agent Opus - Most powerful autonomous AI agent powered by Claude Opus via Anthropic's Agent SDK. Maximum intelligence with tool execution.",
        grok4:
          "Grok 4 - xAI's flagship reasoning model with vision and web search capabilities",
        grok4Fast:
          "Grok 4 Fast - xAI's high-speed model with 2M token context optimized for quick responses",
        grok43:
          "Grok 4.3 - xAI's reasoning model with 1M token context, high factual accuracy, and always-on reasoning for agentic workflows and deep research",
        grok420Beta:
          "Grok 4.20 (Legacy) - xAI's previous flagship model with agentic tool calling, low hallucination rate, and 2M token context",
        gpt5Pro:
          "GPT-5 Pro - OpenAI's premium model with top-tier reasoning and advanced coding capabilities",
        gpt5Codex:
          "GPT-5 Codex - OpenAI's specialized coding model with exceptional programming and technical capabilities",
        gpt51Codex:
          "GPT 5.1 Codex - Updated OpenAI coding model with improved creative and programming capabilities",
        gpt51:
          "GPT 5.1 - OpenAI's efficient general-purpose model with strong reasoning and analysis",
        gpt5: "GPT-5 - OpenAI's flagship model with broad intelligence and versatile capabilities",
        gpt54Mini:
          "GPT-5.4 Mini - OpenAI's efficient GPT-5.4 variant optimized for high-throughput workloads with strong reasoning, coding, and tool use at reduced cost",
        gpt54Nano:
          "GPT-5.4 Nano - OpenAI's most lightweight and cost-efficient model optimized for speed-critical tasks such as classification, data extraction, and sub-agent execution",
        gpt5Mini:
          "GPT-5 Mini - OpenAI's lightweight fast model for quick everyday tasks",
        gpt5Nano:
          "GPT-5 Nano - OpenAI's smallest and most affordable model for simple conversational tasks",
        gptOss120b:
          "GPT-OSS 120B - OpenAI's open-source 120B parameter model with strong coding capabilities",
        kimiK2Thinking:
          "Kimi K2 Thinking - Kimi's reasoning-focused model with enhanced analytical and step-by-step thinking",
        minimaxM27:
          "MiniMax M2.7 - MiniMax's next-generation agentic model built for autonomous real-world productivity, multi-agent collaboration, and production workflows including code debugging, financial modeling, and document generation",
        mimoV2Pro:
          "MiMo V2 Pro - Xiaomi's flagship 1T+ parameter foundation model with 1M context, deeply optimized for agent orchestration, complex workflow automation, and production engineering tasks",
        glm45Air:
          "GLM 4.5 AIR - Z.AI's ultra-fast lightweight model for quick conversational interactions",
        glm45v:
          "GLM 4.5v - Z.AI's vision-capable model with image understanding and chat capabilities",
        geminiFlash25Lite:
          "Gemini 2.5 Flash Lite - Google's entry-level Gemini model with large context and fast responses",
        geminiFlash25Flash:
          "Gemini 2.5 Flash - Google's efficient multimodal model with 1M token context for fast tasks",
        geminiFlash25Pro:
          "Gemini 2.5 Flash Pro - Google's previous-generation Pro model with large context and strong reasoning",
        deepseekV31:
          "DeepSeek V3.1 - DeepSeek's previous-generation model with strong coding and analysis capabilities",
        deepseekR1:
          "DeepSeek R1 - DeepSeek's reasoning-focused model with advanced step-by-step problem solving",
        qwen3235bFree:
          "Qwen3 235B - Alibaba's large open model with 235B parameters for complex coding and reasoning tasks",
        deepseekR1Distill:
          "DeepSeek R1 Distill - Compact distilled version of DeepSeek R1 with efficient reasoning capabilities",
        qwen257b:
          "Qwen 2.5 7B - Alibaba's compact 7B model for fast and affordable conversational tasks",
        dallE3:
          "DALL-E 3 - OpenAI's image generation model with high-quality, detailed images from text prompts",
        gptImage1:
          "GPT-Image-1 - OpenAI's fast and affordable image generation model",
        fluxSchnell:
          "Flux Schnell - Black Forest Labs' fast image generation model optimized for speed",
        fluxPro:
          "Flux Pro 1.1 - Black Forest Labs' professional image generation model with superior quality and prompt adherence",
        flux2Max:
          "FLUX.2 Max - Black Forest Labs' top-tier image model with the highest image quality, prompt understanding, and editing consistency",
        flux2Klein4b:
          "FLUX.2 Klein 4B - Black Forest Labs' fastest and most cost-effective image model, optimized for high-throughput use cases",
        riverflowV2Pro:
          "Riverflow V2 Pro - Sourceful's most powerful image generation model with top-tier control and perfect text rendering",
        riverflowV2Fast:
          "Riverflow V2 Fast - Sourceful's fastest image generation model, optimized for production deployments and latency-critical workflows",
        riverflowV2MaxPreview:
          "Riverflow V2 Max Preview - Sourceful's most powerful preview variant, unified text-to-image and image-to-image model",
        riverflowV2StandardPreview:
          "Riverflow V2 Standard Preview - Sourceful's standard preview variant, unified text-to-image and image-to-image model exceeding the Riverflow 1 family",
        riverflowV2FastPreview:
          "Riverflow V2 Fast Preview - Sourceful's fastest preview variant, unified text-to-image and image-to-image model at the lowest price point",
        flux2Flex:
          "FLUX.2 Flex - Black Forest Labs' image model excelling at complex text rendering, typography, and multi-reference editing in a unified architecture",
        flux2Pro:
          "FLUX.2 Pro - Black Forest Labs' high-end image generation and editing model with frontier-level visual quality, strong prompt adherence, and consistent character reproduction",
        gemini3ProImagePreview:
          "Nano Banana Pro (Gemini 3 Pro Image Preview) - Google's most advanced image generation model with improved multimodal reasoning, real-world grounding, high-fidelity visual synthesis, and industry-leading text rendering",
        gpt5ImageMini:
          "GPT-5 Image Mini - OpenAI's efficient multimodal image generation model combining GPT-5 Mini language capabilities with fast, affordable image generation",
        gpt5Image:
          "GPT-5 Image - OpenAI's flagship multimodal model combining GPT-5 language capabilities with state-of-the-art image generation and editing",
        gpt54Image2:
          "GPT-5.4 Image 2 - OpenAI's next-generation multimodal model combining GPT-5.4 reasoning with GPT Image 2 generation. Moves seamlessly between coding, analysis, and visual creation in a single conversation.",
        seedream45:
          "Seedream 4.5 - ByteDance's latest image generation model with comprehensive improvements in editing consistency, portrait refinement, and multi-image composition",
        sdxl: "Stable Diffusion XL - Stability AI's high-quality open image generation model",
        cassetteMusic:
          "CassetteAI Music - fast text-to-music generation on Fal.ai with clip lengths up to three minutes",
        musicgenStereo:
          "MusicGen Stereo - Meta's open-source stereo music generation model via Replicate",
        stableAudio:
          "Stable Audio - Stability AI's music and audio generation model for high-quality clips",
        udioV2:
          "Udio v2 - High-quality AI music generation with vocals and full production quality",
        modelsLabMusicGen:
          "ModelsLab Music Gen - AI music generation from text prompts, supporting MP3/WAV/FLAC output",
        modelsLabElevenlabsMusic:
          "ElevenLabs Music - High-quality music generation powered by ElevenLabs via ModelsLab",
        modelsLabSonautoSong:
          "Sonauto Song - Full song generation with vocals, supporting various genres up to 4:45 min tracks",
        modelsLabLyria3:
          "Lyria 3 - Google's advanced music generation model creating original 30-second tracks from text",
        modelsLabCogVideoX:
          "CogVideoX - ModelsLab's text-to-video model for generating short video clips",
        modelsLabWanx: "Wanx - ModelsLab's text-to-video generation model",
        modelsLabWan22:
          "Wan 2.2 Ultra - ModelsLab's high-quality text-to-video generation model",
        modelsLabWan21:
          "Wan 2.1 Ultra - ModelsLab's text-to-video generation model with improved quality",
        modelsLabWan25T2V:
          "Wan 2.5 T2V - ModelsLab's Wan 2.5 text-to-video generation model",
        modelsLabWan25I2V:
          "Wan 2.5 I2V - ModelsLab's Wan 2.5 image-to-video generation model",
        modelsLabWan27T2V:
          "Wan 2.7 T2V - Alibaba's latest Wan 2.7 text-to-video model with flexible aspect ratios and 1080p output",
        modelsLabWan26T2V:
          "Wan 2.6 T2V - ModelsLab's Wan 2.6 text-to-video generation model",
        modelsLabWan26I2V:
          "Wan 2.6 I2V - ModelsLab's Wan 2.6 image-to-video generation model",
        modelsLabWan26I2VFlash:
          "Wan 2.6 I2V Flash - ModelsLab's fast Wan 2.6 image-to-video generation model",
        modelsLabSeedanceT2V:
          "Seedance T2V - BytePlus's text-to-video generation model",
        modelsLabSeedanceI2V:
          "Seedance I2V - BytePlus's image-to-video generation model",
        modelsLabOmnihuman:
          "Omnihuman - BytePlus's human video generation model",
        modelsLabSeedance1ProI2V:
          "Seedance 1.0 Pro I2V - BytePlus's professional image-to-video model",
        modelsLabSeedance1ProFastI2V:
          "Seedance 1.0 Pro Fast I2V - BytePlus's fast professional image-to-video model",
        modelsLabSeedance1ProFastT2V:
          "Seedance 1.0 Pro Fast T2V - BytePlus's fast professional text-to-video model",
        modelsLabOmnihuman15:
          "Omnihuman 1.5 - BytePlus's improved human video generation model",
        modelsLabSeedance15Pro:
          "Seedance 1.5 Pro - BytePlus's advanced video generation model",
        modelsLabVeo2:
          "Veo 2 - Google's high-quality video generation model via ModelsLab",
        modelsLabVeo3:
          "Veo 3 - Google's latest video generation model via ModelsLab",
        modelsLabVeo3Fast:
          "Veo 3 Fast - Google's fast video generation model via ModelsLab",
        modelsLabVeo3FastPreview:
          "Veo 3 Fast Preview - Google's fast video generation preview model via ModelsLab",
        modelsLabVeo31:
          "Veo 3.1 - Google's improved Veo 3 video generation model via ModelsLab",
        modelsLabVeo31Fast:
          "Veo 3.1 Fast - Google's fast Veo 3.1 video generation model via ModelsLab",
        modelsLabKlingV21I2V:
          "Kling V2.1 I2V - Kling AI's image-to-video model version 2.1",
        modelsLabKlingV25TurboI2V:
          "Kling V2.5 Turbo I2V - Kling AI's turbo image-to-video model version 2.5",
        modelsLabKlingV25TurboT2V:
          "Kling V2.5 Turbo T2V - Kling AI's turbo text-to-video model version 2.5",
        modelsLabKlingV2MasterT2V:
          "Kling V2 Master T2V - Kling AI's master quality text-to-video model",
        modelsLabKlingV2MasterI2V:
          "Kling V2 Master I2V - Kling AI's master quality image-to-video model",
        modelsLabKlingV21MasterT2V:
          "Kling V2.1 Master T2V - Kling AI's master quality text-to-video model v2.1",
        modelsLabKlingV21MasterI2V:
          "Kling V2.1 Master I2V - Kling AI's master quality image-to-video model v2.1",
        modelsLabKlingV16MultiI2V:
          "Kling V1.6 Multi I2V - Kling AI's multi-image-to-video model version 1.6",
        modelsLabKling30T2V:
          "Kling 3.0 T2V - Kling AI's text-to-video model version 3.0",
        modelsLabLtx2ProT2V:
          "LTX 2 PRO T2V - LTX's professional text-to-video generation model",
        modelsLabLtx2ProI2V:
          "LTX 2 PRO I2V - LTX's professional image-to-video generation model",
        modelsLabLtx23ProI2V:
          "LTX 2.3 Pro I2V - LTX's improved professional image-to-video model",
        modelsLabHailuo23T2V:
          "Hailuo 2.3 T2V - MiniMax's text-to-video generation model version 2.3",
        modelsLabHailuo02T2V:
          "Hailuo 02 T2V - MiniMax's text-to-video generation model 02",
        modelsLabHailuo23I2V:
          "Hailuo 2.3 I2V - MiniMax's image-to-video generation model version 2.3",
        modelsLabHailuo23FastI2V:
          "Hailuo 2.3 Fast I2V - MiniMax's fast image-to-video model version 2.3",
        modelsLabHailuo02I2V:
          "Hailuo 02 I2V - MiniMax's image-to-video generation model 02",
        modelsLabHailuo02StartEnd:
          "Hailuo 02 Start/End - MiniMax's start-end frame video generation model",
        modelsLabSora2:
          "Sora 2 - OpenAI's Sora 2 video generation model via ModelsLab",
        modelsLabSora2Pro:
          "Sora 2 Pro - OpenAI's Sora 2 Pro video generation model via ModelsLab",
        modelsLabGen4Aleph:
          "Gen4 Aleph - Runway's Gen4 Aleph video generation model via ModelsLab",
        modelsLabLipsync2:
          "Lipsync 2 - Sync's lip synchronization video generation model",
        modelsLabGrokT2V:
          "Grok T2V - xAI's Grok text-to-video generation model via ModelsLab",
        modelsLabGrokI2V:
          "Grok I2V - xAI's Grok image-to-video generation model via ModelsLab",
        modelsLabGen4T2ITurbo:
          "Gen4 T2I Turbo - Runway's fast text-to-image generation model via ModelsLab",
        modelsLabGen4Image:
          "Gen4 Image - Runway's Gen4 text-to-image generation model via ModelsLab",
        modelsLabWan27T2I:
          "Wan 2.7 T2I - Alibaba's Wan 2.7 text-to-image generation model via ModelsLab",
        modelsLabGrokT2I:
          "Grok Imagine T2I - xAI's Grok text-to-image generation model via ModelsLab",
        modelsLabZImageBase:
          "Z Image Base - ModelsLab's fast and affordable text-to-image model",
        modelsLabZImageTurbo:
          "Z Image Turbo - ModelsLab's ultra-fast text-to-image model",
        modelsLabFlux2MaxT2I:
          "Flux 2 Max T2I - Black Forest Labs' Flux 2 Max text-to-image via ModelsLab",
        modelsLabFluxPro11Ultra:
          "Flux Pro 1.1 Ultra - Black Forest Labs' high-quality Flux Pro Ultra via ModelsLab",
        modelsLabFluxPro11:
          "Flux Pro 1.1 - Black Forest Labs' Flux Pro 1.1 text-to-image via ModelsLab",
        modelsLabFlux2ProT2I:
          "Flux 2 Pro T2I - Black Forest Labs' Flux 2 Pro text-to-image via ModelsLab",
        modelsLabFlux2DevT2I:
          "Flux 2 Dev T2I - Black Forest Labs' Flux 2 Dev text-to-image via ModelsLab",
        modelsLabFluxT2I:
          "Flux T2I - Black Forest Labs' Flux text-to-image via ModelsLab",
        modelsLabSeedream45T2I:
          "Seedream 4.5 T2I - ByteDance's Seedream 4.5 text-to-image via ModelsLab",
        modelsLabSeedream40T2I:
          "Seedream 4.0 T2I - ByteDance's Seedream 4.0 text-to-image via ModelsLab",
        modelsLabSeedreamT2I:
          "Seedream T2I - ByteDance's Seedream text-to-image via ModelsLab",
        modelsLabImagen4Ultra:
          "Imagen 4 Ultra - Google's highest quality image generation via ModelsLab",
        modelsLabImagen4:
          "Imagen 4 - Google's Imagen 4 text-to-image via ModelsLab",
        modelsLabImagen4Fast:
          "Imagen 4 Fast - Google's fast Imagen 4 text-to-image via ModelsLab",
        modelsLabImagen3:
          "Imagen 3 - Google's Imagen 3 text-to-image via ModelsLab",
        modelsLabNanoBananaPro:
          "Nano Banana Pro - High-quality image generation via ModelsLab",
        modelsLabNanoBanana: "Nano Banana - Image generation via ModelsLab",
        modelsLabQwenT2I:
          "Qwen T2I - Alibaba's Qwen text-to-image via ModelsLab",
        modelsLabRealtimeT2I:
          "Realtime T2I - ModelsLab's ultra-fast realtime text-to-image model",
      },
    },
    modelUtilities: {
      adultExplicit: "Adult/Explicit Content",
      adultImplied: "Adult/Implied Content",
      analysis: "Analysis",
      chat: "Chat",
      coding: "Coding",
      conspiracy: "Conspiracy Theories",
      controversial: "Controversial Topics",
      creative: "Creative Writing",
      fast: "Fast",
      harmful: "Potentially Harmful Content",
      illegalInfo: "Illegal Information",
      imageGen: "Image Generation",
      legacy: "Legacy",
      medicalAdvice: "Medical Advice",
      offensiveLanguage: "Offensive Language",
      politicalLeft: "Left Political Views",
      politicalRight: "Right Political Views",
      reasoning: "Advanced Reasoning",
      roleplay: "Roleplay",
      roleplayDark: "Dark Roleplay",
      smart: "Smart",
      uncensored: "Uncensored",
      violence: "Violence",
      vision: "Vision",
    },
    input: {
      attachments: {
        uploadFile: "Attach files",
        attachedFiles: "Attached Files",
        addMore: "Add More",
      },
    },
  },

  search: {
    brave: {
      category: "Information",
      get: {
        title: "Search the Web",
        dynamicTitle: "Search: {{query}}",
        description:
          "Search the internet for current information, news, facts, or recent events. Use this when you need up-to-date information or to verify facts.",
        form: {
          title: "Search Parameters",
          description: "Configure your web search query",
        },
        submitButton: {
          label: "Search",
          loadingText: "Searching...",
        },
        backButton: {
          label: "Back",
        },
        fields: {
          query: {
            title: "Search Query",
            description:
              "Clear and specific search query. Use keywords rather than questions.",
            placeholder: "Enter your search query...",
          },
          maxResults: {
            title: "Max Results",
            description: "Number of results to return (1-10)",
          },
          includeNews: {
            title: "Include News",
            description: "Include news results for current events",
          },
          freshness: {
            title: "Freshness",
            description: "Filter results by how recent they are",
            options: {
              day: "Past Day",
              week: "Past Week",
              month: "Past Month",
              year: "Past Year",
            },
          },
        },
        response: {
          success: {
            title: "Success",
            description: "Whether the search was successful",
          },
          message: {
            title: "Message",
            description: "Status message about the search",
          },
          query: {
            title: "Query",
            description: "The search query that was executed",
          },
          results: {
            title: "Results",
            description: "Array of search results",
            result: "Result",
            item: {
              title: "Search Result",
              description: "Individual search result",
              url: "URL",
              snippet: "Snippet",
              age: "Age",
              source: "Source",
            },
          },
          cached: {
            title: "Cached",
            description: "Whether results were served from cache",
          },
          timestamp: {
            title: "Timestamp",
            description: "When the search was performed",
          },
        },
        errors: {
          queryEmpty: {
            title: "Search query is required",
            description: "Please provide a search query",
          },
          queryTooLong: {
            title: "Search query is too long",
            description: "Query must be 400 characters or less",
          },
          timeout: {
            title: "Search request timed out",
            description: "The search took too long to complete",
          },
          searchFailed: {
            title: "Search failed",
            description: "An error occurred while searching",
          },
          validation: {
            title: "Invalid Search",
            description: "Please check your search parameters and try again",
          },
          internal: {
            title: "Something Went Wrong",
            description: "We couldn't complete your search. Please try again",
          },
          notConfigured: {
            title:
              "{{label}} API key not configured. Add {{envKey}}=<your-key> to your .env file. Get your key at {{url}}",
            description: "Set up {{label}} to enable web search",
          },
        },
        success: {
          title: "Search Successful",
          description: "The web search completed successfully",
        },
      },
      tags: {
        search: "Search",
        web: "Web",
        internet: "Internet",
      },
    },
    kagi: {
      category: "Information",
      get: {
        title: "Search with Kagi",
        dynamicTitle: "Kagi: {{query}}",
        description:
          "Search the internet or get AI-powered answers using Kagi. FastGPT mode provides comprehensive answers with sources, while search mode returns direct results.",
        form: {
          title: "Search Parameters",
          description: "Configure your Kagi search query",
        },
        submitButton: {
          label: "Search",
          loadingText: "Searching...",
        },
        backButton: {
          label: "Back",
        },
        fields: {
          query: {
            title: "Search Query",
            description: "Clear and specific search query or question.",
            placeholder: "Enter your search query...",
          },
          mode: {
            title: "Search Mode",
            description:
              "Choose between AI-powered answers (FastGPT) or direct search results",
            options: {
              fastgpt: "FastGPT (AI-powered answers)",
              search: "Search (Direct results)",
            },
          },
        },
        response: {
          success: {
            title: "Success",
            description: "Whether the search was successful",
          },
          message: {
            title: "Message",
            description: "Status message about the search",
          },
          output: {
            title: "Answer",
            description: "AI-generated answer from FastGPT",
          },
          query: {
            title: "Query",
            description: "The search query that was executed",
          },
          references: {
            title: "References",
            description: "Source references and citations",
            reference: "Reference",
            item: {
              title: "Reference",
              description: "Source reference with citation",
              url: "URL",
              snippet: "Snippet",
            },
          },
          cached: {
            title: "Cached",
            description: "Whether results were served from cache",
          },
          timestamp: {
            title: "Timestamp",
            description: "When the search was performed",
          },
        },
        errors: {
          queryEmpty: {
            title: "Search query is required",
            description: "Please provide a search query",
          },
          queryTooLong: {
            title: "Search query is too long",
            description: "Query must be 400 characters or less",
          },
          timeout: {
            title: "Search request timed out",
            description: "The search took too long to complete",
          },
          searchFailed: {
            title: "Search failed",
            description: "An error occurred while searching",
          },
          validation: {
            title: "Invalid Search",
            description: "Please check your search parameters and try again",
          },
          internal: {
            title: "Something Went Wrong",
            description: "We couldn't complete your search. Please try again",
          },
          notConfigured: {
            title:
              "{{label}} API key not configured. Add {{envKey}}=<your-key> to your .env file. Get your key at {{url}}",
            description: "Set up {{label}} to enable Kagi search",
          },
        },
        success: {
          title: "Search Successful",
          description: "The Kagi search completed successfully",
        },
      },
      tags: {
        search: "Search",
        web: "Web",
        ai: "AI",
      },
    },
    enums: {
      provider: {
        BRAVE: "Brave Search",
        KAGI: "Kagi FastGPT",
      },
    },
  },
  speechToText: {
    category: "Agent",

    hotkey: {
      post: {
        title: "Speech-to-Text Hotkey",
        titleShort: "STT Hotkey",
        description:
          "Record and transcribe audio with automatic text insertion",
        form: {
          title: "Hotkey Configuration",
          description: "Configure speech-to-text hotkey settings",
        },
        action: {
          label: "Action",
          description: "Action to perform (start/stop/toggle)",
          options: {
            start: "Start",
            stop: "Stop",
            toggle: "Toggle",
            status: "Status",
          },
        },
        provider: {
          label: "Provider",
          description: "AI provider for transcription",
        },
        language: {
          label: "Language",
          description: "Language of the audio",
        },
        insertPrefix: {
          label: "Insert Prefix",
          description: "Text to insert before transcription",
          placeholder: "e.g., '> '",
        },
        insertSuffix: {
          label: "Insert Suffix",
          description: "Text to insert after transcription",
          placeholder: "e.g., ' '",
        },
        response: {
          title: "Result",
          description: "Recording and transcription result",
          success: "Success",
          status: "Status",
          message: "Message",
          text: "Transcribed Text",
          recordingDuration: "Recording Duration (ms)",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "You must be logged in to use this feature",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
          },
          server: {
            title: "Server Error",
            description: "Failed to process recording",
          },
          conflict: {
            title: "Conflict",
            description: "Recording already in progress",
          },
          forbidden: {
            title: "Forbidden",
            description: "You don't have permission to use this feature",
          },
          network: {
            title: "Network Error",
            description: "Failed to connect to transcription service",
          },
          notFound: {
            title: "Not Found",
            description: "Session not found",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Recording in progress",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          dependenciesMissing:
            "Required dependencies not available: {missing}. {recommendations}",
          invalidAction: "Invalid action: {action}",
          actionFailed: "Failed to perform action: {error}",
          alreadyRecording: "Recording already in progress",
          notRecording: "No recording in progress",
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
      tags: {
        ai: "AI",
        transcription: "Transcription",
        speech: "Speech",
        hotkey: "Hotkey",
        cli: "CLI",
      },
      platforms: {
        macos: "macOS",
        linuxWayland: "Linux (Wayland)",
        linuxX11: "Linux (X11)",
        windows: "Windows",
      },
      status: {
        idle: "Idle",
        recording: "Recording",
        processing: "Processing",
        completed: "Completed",
        error: "Error",
      },
      actions: {
        start: "Start Recording",
        stop: "Stop Recording",
        toggle: "Toggle Recording",
        status: "Check Status",
      },
      recorderBackends: {
        ffmpegAvfoundation: "FFmpeg (AVFoundation)",
        ffmpegPulse: "FFmpeg (PulseAudio)",
        ffmpegAlsa: "FFmpeg (ALSA)",
        ffmpegDshow: "FFmpeg (DirectShow)",
        wfRecorder: "wf-recorder",
        arecord: "arecord",
      },
      typerBackends: {
        applescript: "AppleScript",
        wtype: "wtype",
        xdotool: "xdotool",
        wlClipboard: "wl-clipboard",
        xclip: "xclip",
        powershell: "PowerShell",
      },
    },
    post: {
      title: "Speech to Text",
      description:
        "Convert audio to text using AI transcription (0.013 credits per second, 0.78 credits per minute)",
      form: {
        title: "Audio Transcription",
        description:
          "Upload an audio file to transcribe (0.013 credits per second, 0.78 credits per minute)",
      },
      fileUpload: {
        title: "Audio File Upload",
        description: "Upload your audio file for transcription",
      },
      audio: {
        label: "Audio File",
        description: "Audio file to transcribe (MP3, WAV, WebM, etc.)",
        validation: {
          maxSize: "File size must be less than 25MB",
          audioOnly: "Please upload an audio or video file",
        },
      },
      provider: {
        label: "Provider",
        description: "AI provider for transcription",
      },
      language: {
        label: "Language",
        description: "Language of the audio",
      },
      response: {
        title: "Transcription Result",
        description: "The transcribed text from your audio",
        success: "Success",
        text: "Transcribed Text",
        provider: "Provider Used",
        confidence: "Confidence Score",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to use this feature",
        },
        validation: {
          title: "Validation Error",
          description: "The audio file or parameters are invalid",
        },
        server: {
          title: "Server Error",
          description: "Failed to process the transcription",
        },
        apiKeyMissing: "Eden AI API key is not configured",
        transcriptionFailed: "Transcription failed: {{error}}",
        audioTooShort:
          "Recording too short. Hold the button longer and speak clearly.",
        noAudioFile: "No audio file provided",
        internalError: "Internal server error",
        noPublicId: "No public ID received",
        pollFailed: "Failed to poll transcription results",
        failed: "Transcription failed",
        timeout: "Transcription timeout",
        creditsFailed: "Failed to deduct credits: {{error}}",
        providerError:
          "Transcription service error. Please try again or contact support if the issue persists.",
        balanceCheckFailed:
          "Unable to check your credit balance. Please try again",
        insufficientCredits:
          "You don't have enough credits for this transcription. Please add more credits to continue",
      },
      success: {
        title: "Success",
        description: "Audio transcribed successfully",
        transcriptionComplete: "Transcription completed successfully",
      },
    },
    providers: {
      openai: "OpenAI Whisper",
      assemblyai: "AssemblyAI",
      deepgram: "Deepgram",
      google: "Google Speech-to-Text",
      amazon: "Amazon Transcribe",
      microsoft: "Microsoft Azure",
      ibm: "IBM Watson",
      rev: "Rev.ai",
    },
    languages: {
      en: "English",
      de: "German",
      pl: "Polish",
      es: "Spanish",
      fr: "French",
      it: "Italian",
    },
    models: {
      descriptions: {
        openaiWhisper:
          "OpenAI Whisper - State-of-the-art speech recognition for 99 languages",
        deepgramNova2:
          "Deepgram Nova-2 - Fast and accurate speech-to-text with noise robustness",
      },
    },
  },
  textToSpeech: {
    category: "Agent",
    tags: {
      speech: "Speech",
      tts: "Text-to-Speech",
      ai: "AI",
    },

    post: {
      title: "Text to Speech",
      description:
        "Convert text to natural-sounding speech using AI (~0.00052 credits per character)",
      form: {
        title: "Text to Speech Conversion",
        description:
          "Enter text to convert to speech (OpenAI TTS: ~0.00052 credits per character)",
      },
      text: {
        label: "Text",
        description: "Text to convert to speech",
        placeholder: "Enter the text you want to convert to speech...",
      },
      voice: {
        label: "Voice",
        description: "Voice model for speech synthesis",
      },
      response: {
        title: "Audio Result",
        description: "The generated speech audio",
        success: "Success",
        audioUrl: "Audio URL",
      },
      errors: {
        validation_failed: {
          title: "Validation Error",
          description: "The provided text or parameters are invalid",
        },
        network_error: {
          title: "Network Error",
          description: "Failed to connect to the server",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to use text-to-speech",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to use text-to-speech",
        },
        not_found: {
          title: "Not Found",
          description: "The requested resource was not found",
        },
        server_error: {
          title: "Server Error",
          description: "An error occurred while converting text to speech",
        },
        unknown_error: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsaved_changes: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred",
        },
        notConfigured:
          "{{label}} API key not configured. Add {{envKey}}=<your-key> to your .env file. Get your key at {{url}}",
        conversionFailed: "Speech synthesis failed: {{error}}",
        noText: "No text provided",
        noAudioUrl: "No audio URL received from provider",
        audioFetchFailed: "Unable to create the audio file. Please try again",
        providerError: "Provider error: {{error}}",
        internalError: "Internal server error",
        unsupportedProvider: "Unsupported TTS provider for voice: {{voiceId}}",
        creditsFailed: "Failed to deduct credits: {{error}}",
        balanceCheckFailed:
          "Unable to check your credit balance. Please try again",
        insufficientCredits:
          "You don't have enough credits for this conversion. Please add more credits to continue",
      },
      success: {
        title: "Success",
        description: "Text converted to speech successfully",
        conversionComplete: "Speech synthesis completed successfully",
      },
    },
    languages: {
      en: "English",
      de: "German",
      pl: "Polish",
      es: "Spanish",
      fr: "French",
      it: "Italian",
    },
    models: {
      descriptions: {
        openaiAlloy:
          "OpenAI Alloy - Balanced, neutral voice for professional content",
        openaiNova:
          "OpenAI Nova - Warm, friendly voice ideal for conversational applications",
        openaiOnyx:
          "OpenAI Onyx - Deep, authoritative voice for formal content",
        openaiEcho: "OpenAI Echo - Clear, articulate voice with natural rhythm",
        openaiShimmer:
          "OpenAI Shimmer - Expressive, dynamic voice for engaging content",
        openaiFable: "OpenAI Fable - Expressive, story-telling voice",
        elevenlabsRachel:
          "ElevenLabs Rachel - Natural female voice with emotional range",
        elevenlabsJosh:
          "ElevenLabs Josh - Natural male voice with conversational tone",
        elevenlabsBella:
          "ElevenLabs Bella - Warm female voice with soft delivery",
        elevenlabsAdam:
          "ElevenLabs Adam - Professional male voice for content creation",
      },
    },
  },
};
