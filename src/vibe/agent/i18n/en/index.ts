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
          "model or skill required - pass one directly or provide a favoriteId with a resolvable model selection",
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
            "Get {{credits}} credits/month with a subscription for just {{price}}/month. Free accounts get {{freeCredits}} credits/month, {{freeCreditsMax}} with the newsletter.",
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
      searchSkills: "Search skills...",
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
        placeholder: "Select skill",
        addNewLabel: "Create custom skill",
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
              placeholder: "Enter skill name",
            },
            icon: {
              label: "Icon (emoji)",
              placeholder: "😊",
            },
            description: {
              label: "Description",
              placeholder: "Brief description of the skill",
            },
            systemPrompt: {
              label: "System Prompt",
              placeholder: "Define how the skill behaves...",
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
      retry: "Retry with different model/skill",
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
          "Uncensored.ai's model, the one in the catalog built uncensored from the start rather than stripped after the fact. The pick for dark and taboo roleplay and fiction, political and controversial questions, and views outside the mainstream: no softened scenes, no moralizing, no steer back to the consensus line. Calls tools, 32K context, text only. Experimental, not for code, and it states contested claims as plainly as settled ones, so check its facts.",
        freedomgptLiberty:
          "Age of AI's flagship uncensored model, the free-speech chatbot that started the category. Built on open weights, tuned for blunt answers with no lecture. Fast and quick-witted, 32K context. Light on tools, coding and deep analysis: Qwen 3.6 Plus Uncensored is stronger there. For a heterodox view argued in full, UncensoredLM goes further.",
        gabAiArya:
          "Gab's uncensored assistant, positioned on the political right by its maker and built to answer without the usual guardrails. Smart, 131K context, reads images and video, calls tools. Pick it when you want that slant on purpose; for other viewpoints without a house line, UncensoredLM is built uncensored. Weaker at coding, and its base model is undisclosed.",
        gemini31ProPreviewCustomTools:
          "The custom-tools preview of Gemini 3.1 Pro, tuned to call the tools you define instead of falling back to bash. Built for coding agents and multi-tool workflows, with 1M context and text, image, video and audio input. A preview build. Gemini 4 Argon is the newer Pro-class pick at a similar price.",
        gemini31FlashImagePreview:
          "Google's Gemini 3.1 Flash Image, still in preview. Generates and edits images right in the chat, text and pictures in the same reply. The cheapest image model in the catalog. Mainstream filters, no tool calls, 64K context. For complex prompts and cleaner text inside images, Nano Banana Pro costs more and delivers more.",
        gemini31FlashLitePreview:
          "Google's high-volume budget model, still in preview: translation, ranking, extraction and quick chat over 1M context, with text, image, video and audio input. Cheap and fast, not built for hard reasoning. It still costs less than its successor, Gemini 3.5 Flash Lite.",
        gemini3Pro:
          "Google Gemini 3 Pro - Advanced multimodal AI model with large context window and powerful reasoning capabilities",
        gemini35Flash:
          "Google's Flash model pitched at near-Pro coding and reasoning, with adjustable thinking levels, 1M context and text, image, video and audio input. Solid, but Gemini 3.8 Flash is newer and roughly half the price, so switch.",
        gemini3Flash:
          "Google's first Gemini 3 Flash: fast and capable at coding and everyday reasoning, with 1M context and text, image, video and audio input. Still good value and cheaper than its successor. Gemini 3.8 Flash is the newer option if you want the latest.",
        deepseekV32:
          "DeepSeek's late-2025 open-weight model with sparse attention that makes long-context work cheaper. A 671B mixture-of-experts, good at coding and analysis for very little money, text only. DeepSeek V4.1 Flash is newer and costs even less.",
        deepseekV4Pro:
          "DeepSeek's open-weight flagship: a 1.6T-parameter mixture-of-experts with 49B active, MIT licensed. Deep reasoning, serious code, whole-codebase analysis and multi-step agent work, 1M context, calls tools. Text only. A fraction of Claude Opus 5.5's price. For cheap, fast everyday work, DeepSeek V4.1 Flash is the sibling.",
        deepseekV4Flash:
          "DeepSeek's 284B mixture-of-experts Flash model: 1M context, fast, strong at coding, near-zero cost per message. Text only. Its successor DeepSeek V4.1 Flash costs the same, so move up unless you need this exact version.",
        gpt55:
          "OpenAI's former top general model: strong reasoning, coding and analysis over 1M context, with text and image input. Still capable, but premium-priced, and GPT-6.1 Sol now does the same jobs for far less. Weak spot: roleplay.",
        gpt55Pro:
          "The extended-reasoning Pro tier of GPT-5.5, built to spend far more compute on hard, high-stakes problems. One of the most expensive models in the catalog, worth it only when a wrong answer costs more than the message. GPT-6 Astra is the newer pick at about a third of the price.",
        gpt54Pro:
          "The maximum-compute Pro variant of GPT-5.4 for hard reasoning, research and high-stakes analysis over 1M context. Slow, and among the priciest models here. GPT-6 Astra covers the same ground for about a third of the price.",
        gpt54:
          "The OpenAI model that folded Codex-grade coding into the main GPT line, with 1M context and image input. Solid for long documents, code and analysis. GPT-6.1 Sol is newer, rated a tier higher and cheaper per message, so there is little reason to stay.",
        gpt53Codex:
          "OpenAI's agentic coding specialist: long, tool-heavy development sessions, refactors and debugging, with 400K context. Strong at code, weak at creative writing and roleplay. GPT-6.1 Sol now handles coding at a similar price and does more besides.",
        gpt53Chat:
          "GPT-5.3 Chat - Updated ChatGPT conversational model delivering more accurate, contextual answers with significantly reduced unnecessary refusals and caveats",
        gpt52Pro:
          "GPT-5.2 with extended reasoning for the hardest problems: deep research, tricky math, careful code review. Slow and very expensive. GPT-6 Astra is the current Pro-class choice and costs well under half as much.",
        gpt52:
          "OpenAI's late-2025 workhorse for professional tasks: coding, long documents and structured analysis, with 400K context and image input. Reliable, but no longer the value pick. GPT-6.1 Sol costs about the same and is newer.",
        gpt52_chat:
          "The fast, ChatGPT-style variant of GPT-5.2: conversational answers without long thinking, 128K context. Good for everyday chat and drafting. Less context than its siblings, and GPT-6.1 Terra now does this job for about half the price.",
        dolphin3_0_r1_mistral_24b:
          "Dolphin 3.0 R1 Mistral 24B - Uncensored large language model based on Mistral",
        dolphinLlama3_70B:
          "Dolphin Llama 3 70B - Uncensored large language model based on Llama 3",
        veniceUncensored:
          "Venice's own uncensored model, Dolphin Mistral 24B in a Venice edition. Among the lowest refusal rates anywhere: fiction, open-ended unfiltered talk. Reads images, 128K context, cheap. A decensoring fine-tune, so Mistral's framing still shows on politics and the darkest scenes; UncensoredLM is the built-uncensored pick for dark roleplay, politics and other viewpoints. Weak at code and heavy analysis. For that, take Qwen 3.6 Plus Uncensored.",
        veniceUncensoredRoleplay:
          "Venice's 24B model tuned for roleplay, with refusals trained out. Characters hold their voice across long campaigns, with no moral break mid-story. Reads images, 128K context. Refusals removed, not built uncensored, so for the darkest and most taboo material UncensoredLM goes further; this one wins on long campaigns and image input. A storyteller, not an assistant, so skip it for analysis or code.",
        gemma4Uncensored:
          "Google's Gemma 4 26B mixture-of-experts with the filter stripped, served by Venice. Fast, cheap, reads images, calls tools, 256K context. Refusals are gone, Google's training is not, so its take on hot topics still follows the base model. For harder reasoning without refusals, GLM 5.3 Flash Uncensored costs a little more and goes further.",
        qwen36PlusUncensored:
          "Alibaba's Qwen 3.6 Plus reasoning model with the refusals removed, served by Venice. One of the strongest coders and analysts in the uncensored set. Reads images, calls tools, 256K context. It no longer refuses, but Qwen's training still frames politics; for politics, dark roleplay and other viewpoints, UncensoredLM is built uncensored. Costs more than the flash models. GLM 5.3 Uncensored is the other heavy hitter, with 1M context but text only.",
        glm47FlashHeretic:
          "An abliterated GLM 4.7 Flash: refusal behavior stripped out, so it answers instead of lecturing. Pennies per message, fast, calls tools, good for unfiltered chat and creative writing. Base GLM's training still shapes its views. Weak at deep analysis. GLM 5.3 Flash Uncensored is the newer, smarter uncensored pick for a bit more.",
        glm53Abliterated:
          "Full GLM 5.3 with the refusals cut out of the weights by Abliteration.ai. Frontier reasoning, tools, 1M context. The heavy hitter. No refusals, but base GLM's training and framing remain.",
        deepseekV41FlashAbliterated:
          "Abliteration.ai's refusal-free DeepSeek V4.1 Flash. 552B MoE, reasons hard, reads images, calls tools. 1M context. It stops saying no; DeepSeek's own framing stays.",
        mimoV26FlashAbliterated:
          "Xiaomi's MiMo V2.6 Flash with the refusal direction ablated. Fast, reads images, calls tools, 1M context. Good for high-volume unfiltered work, but it trades depth for speed, and the base model's framing stays. Costs more than twice as much as GLM 5.3 Flash Uncensored, which covers similar ground.",
        glm53Uncensored:
          "The full GLM 5.3 reasoning model from Z.AI with its refusals removed. The heavy hitter of the uncensored set: code, long-form writing, analysis and tools, 1M context. Unrestricted, not neutral: on politics it can still hedge the way base GLM does, so take UncensoredLM for politics, dark roleplay and other viewpoints. Text only, slower than the flash models, still experimental. GLM 5.3 Flash Uncensored is the cheaper, faster everyday option.",
        glm53FlashUncensored:
          "Z.AI's GLM 5.3 Flash with the refusals removed: a 320B mixture-of-experts. Fast, cheap, reads images, calls tools, 1M context. The daily driver for unfiltered work, with base GLM's framing intact on politics. For the hardest reasoning, step up to the full GLM 5.3 Uncensored.",
        veniceLustifyV8:
          "An SDXL checkpoint tuned for photoreal adult imagery, served by Venice.ai. Uncensored: no blur, no refusals. Among the cheapest image models we offer. Built for bodies and skin, not for text in images, complex scenes or art styles; Chroma has more artistic range.",
        veniceChroma:
          "An open-weight model built on FLUX.1 schnell and retrained without content filtering, served by Venice.ai. Handles long prompts and a wide range of art styles, explicit content included. Cheap per image. Less specialized in photoreal nudity than Lustify v8, and text in only, so use Qwen Edit Uncensored to rework an existing image.",
        veniceQwenEdit:
          "Uncensored image editing built on Alibaba's Qwen image-edit model, served by Venice.ai. Give it a reference image and an instruction: swap elements, restyle, change outfits, rework the scene. No blur, no refusals. Costs more than Chroma or Lustify v8, which only generate from text.",
        veniceFireredImageEdit:
          "A prompt-driven image editor served by Venice.ai. Describe the change, it edits exactly that and leaves the rest of the image alone. Uncensored tier with no refusals, though not tagged for explicit output the way Qwen Edit Uncensored is. Same price as Qwen Edit; on hard edits, try both.",
        claudeOpus45:
          "Anthropic's November 2025 Opus, a top coding and agent model in its day and the first Opus at a much lower price. Excellent at careful writing and complex code, 200K context. Cautious on controversial topics. Claude Opus 5.5 is newer and cheaper.",
        claudeOpus46:
          "Anthropic's February 2026 Opus, the first Opus with a 1M context window. Strong at long agentic coding, deep analysis and careful writing. Premium price, mainstream filters, cautious on controversial topics. Claude Opus 5.5 is newer and cheaper.",
        claudeOpus47:
          "A 2026 Opus release sitting between 4.6 and 4.8: deep reasoning, complex coding and long-form writing over 1M context. Premium-priced and cautious on controversial topics. Claude Opus 5.5 replaces it and costs less per message.",
        claudeOpus48:
          "The last Opus 4 release, built for long agentic work, complex coding and very long outputs over 1M context, with image input. Premium, mainstream-filtered, cautious on controversial topics. Claude Opus 5.5 is newer and cheaper.",
        claudeSonnet46:
          "Anthropic's early 2026 Sonnet, an upgrade over 4.5 in coding, agents and office-style work, with 1M context. Mainstream filters, cautious on controversial topics. Claude Sonnet 5.5 replaces it and costs less per message.",
        claudeHaiku45:
          "Anthropic's October 2025 small model: fast, good at everyday coding and reading images, 200K context. Mainstream filters, cautious on controversial topics. Claude Haiku 5.5 now costs about a tenth as much, so the switch is easy.",
        glm5_1:
          "Z.AI's coding model built for long-horizon work, pitched as able to grind on one task for hours. Strong at planning, coding and multi-step agent runs, 200K context, text only, open content level. GLM-5.3 is newer and a fraction of the price but sits a tier lower; Kimi K3 is the stronger current open pick.",
        glm5: "Z.AI's early 2026 open-weight flagship, built for systems design and long agent workflows. Strong reasoning and coding, open content level, 200K context, text only. GLM-5.3 is newer and much cheaper but sits a tier lower on intelligence; Kimi K3 is the stronger open alternative.",
        glm5Turbo:
          "A faster GLM-5 tuned for agent loops: quick inference, clean task breakdown and stable long runs. Good for tool-heavy automation with 200K context, text only, open content level. GLM-5.3 does similar work today for a fraction of the price.",
        glm46:
          "Z.AI's September 2025 release that raised context to 200K and improved coding and agent use. Still a decent bilingual all-rounder, open content level, text only. GLM-5.3 is newer and cheaper.",
        glm47:
          "Z.AI's December 2025 release, a solid Chinese-English bilingual all-rounder with better coding and reasoning than 4.6. Fine for chat, analysis and agent tasks, 200K context, text only, open content level. GLM-5.3 is newer at about a quarter of the price.",
        glm47Flash:
          "The small, fast GLM 4.7 and one of the cheapest models here. Good for quick chat, simple tool calls and bulk text jobs with 200K context. Light on deep reasoning. GLM-5.3 Flash is newer but costs about twice as much.",
        kimiK2:
          "Moonshot AI's July 2025 open-weight model, a 1T-parameter mixture-of-experts that made its name on agentic tool use and coding. Fast, open content level, 262K context, text only. No thinking mode. Kimi K3 is the newer flagship at about twice the price.",
        kimiK2_5:
          "Moonshot's January 2026 Kimi, natively multimodal with image input. Strong at long-context coding, turning screenshots into code and creative writing, with open content filters and 262K context. Kimi K3 is newer but costs about twice as much.",
        kimiK2_6:
          "Moonshot's Kimi K2.6, focused on long-horizon coding, building UIs from prompts or screenshots, and running many sub-agents in parallel. Fast and smart, image input, 262K context, open content level. Kimi K3 is newer at a higher price.",
        claudeSonnet45:
          "Anthropic's September 2025 Sonnet, known for strong coding and long autonomous agent sessions. Still a fine coder and writer, with 1M context here. Cautious on controversial topics, weak at roleplay. Claude Sonnet 5.5 is newer and cheaper per message.",
        claudeAgentSonnet:
          "Claude Agent Sonnet - Autonomous AI agent powered by Claude Sonnet via Anthropic's Agent SDK. Executes tools independently with built-in reasoning.",
        claudeAgentHaiku:
          "Claude Agent Haiku - Fast autonomous AI agent powered by Claude Haiku via Anthropic's Agent SDK. Optimized for speed with tool execution.",
        claudeAgentOpus:
          "Claude Agent Opus - Most powerful autonomous AI agent powered by Claude Opus via Anthropic's Agent SDK. Maximum intelligence with tool execution.",
        grok4:
          "xAI's July 2025 flagship, a reasoning model that always thinks before it answers. Strong at math, science and analysis, with lighter content filters than most mainstream models. Slower than plain chat models. Grok 4.7 is the current Grok, at a higher price.",
        grok4Fast:
          "xAI's speed-tuned Grok. Quick replies, reads images, calls tools, 1M context, pennies per message. Open content policy, so fewer refusals than the mainstream labs. For hard reasoning step up to Grok 4.7. For even cheaper fast chat, DeepSeek V4.1 Flash costs less.",
        grok43:
          "A later Grok 4 release with always-on reasoning and 1M context, aimed at agent workflows and deep research. Open content level, calls tools, reads images. Same price as Grok 4 and cheaper than Grok 4.7, the newer pick when you want the latest.",
        grok420Beta:
          "xAI's former flagship with a 2M context window, agentic tool calling and image input. Good for huge documents and long agent runs under open content filters. Grok 4.7 is newer but costs more.",
        gpt5Pro:
          "GPT-5 with extended reasoning, OpenAI's 2025 answer for the hardest questions. Thorough, but slow and very expensive for what is now an older generation. GPT-6 Astra is the modern Pro-tier pick and costs less.",
        gpt5Codex:
          "GPT-5 Codex - OpenAI's specialized coding model with exceptional programming and technical capabilities",
        gpt51Codex:
          "GPT-5.1 tuned for agentic coding in OpenAI's Codex: long edit, run and fix loops across real repositories, with 400K context. Fair value for code at its price. Less suited to open-ended chat or writing, and the newer GPT-6.1 Sol has moved past it.",
        gpt51:
          "OpenAI's November 2025 update to GPT-5, with adaptive reasoning that thinks longer only on hard questions and a warmer conversational tone. Still a sensible general model with 400K context and image input. GPT-6.1 Sol is newer and sharper for slightly more per message.",
        gpt5: "OpenAI's August 2025 flagship that merged fast answers and deep reasoning into one model. Still a capable all-rounder for chat, writing and code, with 400K context and image input. GPT-6.1 Sol is the current OpenAI pick: newer and stronger for a bit more per message.",
        gpt54Mini:
          "The smaller GPT-5.4: good reasoning, coding and tool use at a lower price, with 400K context and image input. Fine for high-volume chat and sub-agent work. GPT-6 Luna is newer and far cheaper per message, though tuned more for speed than depth.",
        gpt54Nano:
          "OpenAI's tiniest GPT-5.4, made for classification, data extraction and fast sub-agent calls. Cheap, quick, calls tools, reads images. Too shallow for real analysis. GPT-6 Luna is the newer budget pick and costs even less.",
        gpt5Mini:
          "The compact GPT-5 for quick everyday tasks: short answers, summaries, simple tool calls, 400K context. Cheap and fast, but thin on deep analysis. GPT-6 Luna is newer and costs about a third as much.",
        gpt5Nano:
          "OpenAI's smallest GPT-5 and still one of the cheapest models here. Fine for classification, tagging and short replies at volume. Not for coding or real analysis. GPT-6 Luna is the newer budget model, at a slightly higher price.",
        gptOss120b:
          "OpenAI's open-weight model: 117B total parameters, mixture-of-experts, Apache 2.0 licensed. A capable reasoner and coder for pennies, calls tools, 131K context. Text only. Lighter filters than OpenAI's GPT-6 line, but not uncensored. GLM-5.3 costs about the same and adds 1M context.",
        kimiK2Thinking:
          "The November 2025 reasoning version of Kimi K2, built to keep thinking across hundreds of chained tool calls without losing the thread. Good for research and multi-step agent work at a low price, open content level. Text only and slower than plain K2. Kimi K3 is the newer pick.",
        minimaxM27:
          "MiniMax's agent-focused model for practical work: debugging, financial modeling, document generation and multi-agent runs. Smart and cheap, 196K context, text only, open content level. MiniMax M3 is the newer release at a slightly higher price.",
        mimoV2Pro:
          "Xiaomi's flagship of the MiMo V2 line, built for agent orchestration and long engineering workflows with 1M context. Strong reasoning and coding at a low price, text only, open content level. MiMo V2.6 Pro is newer and slightly cheaper.",
        glm45Air:
          "The lightweight GLM 4.5, a 106B mixture-of-experts with only 12B active, so replies come fast and cheap. Fine for casual chat and simple tasks, 128K context, text only. Dated on reasoning. GLM-5.3 Flash is newer and cheaper.",
        glm45v:
          "Z.AI's vision model built on GLM-4.5-Air, a 106B mixture-of-experts. Reads screenshots, charts and photos, chats and calls tools. Only 64K context and dated reasoning. GLM-5.3 Flash is the newer, cheaper Z.AI pick.",
        geminiFlash25Lite:
          "Google's cheapest 2025 Gemini: pennies per message, 1M context, text, image, video and audio input. Great for bulk tagging, translation and short answers, shallow on reasoning. Gemini 3.5 Flash Lite is newer but costs nearly four times more, so this one still earns its spot.",
        geminiFlash25Flash:
          "Google's 2025 hybrid reasoning Flash with a controllable thinking budget, 1M context and text, image, video and audio input. Still a cheap, fast option for summaries and everyday chat. Gemini 3.8 Flash is newer and smarter but costs about twice as much.",
        geminiFlash25Pro:
          "Google's 2025 thinking model with 1M context, strong at long-document analysis and code for its time. Now clearly a generation behind. Gemini 4 Argon is the current Pro-class pick, at a somewhat higher price.",
        deepseekV31:
          "DeepSeek's August 2025 hybrid that switches between quick answers and step-by-step thinking in one model. A capable, cheap coder built on a 671B open-weight mixture-of-experts, text only. DeepSeek V4.1 Flash is newer at roughly a third of the price.",
        deepseekR1:
          "The January 2025 open-weight reasoning model that proved visible chain-of-thought could be cheap. Still solid for math and logic, but slow, verbose and reticent on politics China considers sensitive. DeepSeek V4.1 Flash is newer and a fraction of the price.",
        qwen3235bFree:
          "Alibaba's open-weight Qwen3 235B, a mixture-of-experts model with 22B active parameters. Solid code and reasoning on a budget, calls tools, 131K context. Text only and a generation behind: Qwen 3.8 Flash is newer, reads images and costs about the same.",
        deepseekR1Distill:
          "DeepSeek R1 Distill - Compact distilled version of DeepSeek R1 with efficient reasoning capabilities",
        qwen257b:
          "Alibaba's small 7B open-weight model from 2024. Cheap and quick for simple chat, short rewrites and basic translation, 32K context. Weak at coding and analysis by today's standards. Qwen 3.8 Flash is the newer Alibaba pick, smarter for a bit more.",
        dallE3:
          "DALL-E 3 - OpenAI's image generation model with high-quality, detailed images from text prompts",
        gptImage1:
          "GPT-Image-1 - OpenAI's fast and affordable image generation model",
        fluxSchnell:
          "Flux Schnell - Black Forest Labs' fast image generation model optimized for speed",
        fluxPro:
          "Black Forest Labs' proven text-to-image workhorse from the FLUX.1 generation. Clean composition, reliable prompt following, quick results. Text in only, no edits from a reference image. FLUX.2 Pro costs about half as much and takes reference images, so this one mainly fits prompts already tuned for it.",
        flux2Max:
          "The top tier of Black Forest Labs' FLUX.2 family. Generates from text or edits from reference images, with the most detail and consistency in the line. Premium priced, several times the cost of FLUX.2 Pro. Save it for hero shots and tricky multi-reference edits; for everyday work FLUX.2 Pro gets you most of the way for less.",
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
          "Black Forest Labs' FLUX.2 workhorse for generating and editing. Takes text plus reference images, keeps characters and products consistent across shots, handles long prompts well. Mid-range price. Open tier: lighter filters than Imagen 4, but not explicit; Chroma or Lustify v8 cover that. Step up to FLUX.2 Max only when detail really matters.",
        gemini3ProImagePreview:
          "Google's Gemini 3 Pro Image, in preview. The stronger Nano Banana: follows complex prompts more closely, renders legible text inside images and edits pictures you upload. Mainstream filters, no tool calls, 64K context. Several times the price of Nano Banana, so save it for work where image quality matters.",
        gpt5ImageMini:
          "OpenAI's GPT-5 Image Mini: GPT-5 Mini language skills plus image generation and editing in the same chat. Reads images, 400K context. Mainstream filters, no tool calls. Pricier than Nano Banana and close to Nano Banana Pro, so compare both on your own prompt.",
        gpt5Image:
          "GPT-5 paired with OpenAI's image generator: chat, then create or edit images in the same conversation, with image input. Good for iterating on visuals in plain words. No tool calls, and expensive per message. GPT-5 Image Mini is the cheaper option; Nano Banana Pro is worth comparing.",
        gpt54Image2:
          "GPT-5.4 reasoning combined with GPT Image 2 generation, so one chat can move from analysis or code to finished images. Reads images too. No tool calls, and pricey. GPT-5 Image Mini costs far less; Nano Banana and Nano Banana Pro are the other current image picks.",
        seedream45:
          "ByteDance's image model for generating and editing in one. Strong at portraits, keeping a subject consistent and combining several input images into one scene. Mid-range price, close to FLUX.2 Pro. Open tier: lighter filters than mainstream, not explicit. A good second opinion when FLUX.2 Pro misses the look you want.",
        sdxl: "Stable Diffusion XL - Stability AI's high-quality open image generation model",
        cassetteMusic:
          "CassetteAI Music - fast text-to-music generation on Fal.ai with clip lengths up to three minutes",
        musicgenStereo:
          "Meta's open-source MusicGen in its stereo version. Instrumental music from a text prompt: genre, mood, instruments. No vocals or lyrics. Cheap. Good for background beds and loops; for songs with vocals use ElevenLabs Music or Sonauto Song.",
        stableAudio:
          "Stable Audio - Stability AI's music and audio generation model for high-quality clips",
        udioV2:
          "Udio v2 - High-quality AI music generation with vocals and full production quality",
        modelsLabMusicGen:
          "ModelsLab's own text-to-music model, with MP3, WAV or FLAC output. Prompt-driven tracks for background music and jingles. Costs several times more than Lyria 3 or MusicGen Stereo, and its underlying model is not documented. Try Lyria 3 first for quality at a lower price.",
        modelsLabElevenlabsMusic:
          "ElevenLabs' music model. Full tracks with vocals and lyrics in several languages, or instrumentals, steered by your prompt. Mainstream content filters apply. Upper price range for music. Strong for polished, radio-ready songs; for cheaper full songs with vocals try Sonauto Song.",
        modelsLabSonautoSong:
          "Sonauto's song generator. Full songs with vocals and lyrics across many genres, at a low price for complete tracks. Open tier, with lighter filters than ElevenLabs. Production polish varies; for cleaner mixes pay up for ElevenLabs Music or Lyria 3 Pro Preview.",
        modelsLabLyria3:
          "Google's Lyria 3. Original tracks of around 30 seconds from a text prompt, with high production quality. Very cheap for what it delivers. Mainstream: Google's filters apply. Too short for full songs; Lyria 3 Pro Preview handles full length.",
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
          "Alibaba's Wan 2.7 video model. Clips up to 10 seconds (15 via ModelsLab) at up to 1080p, many aspect ratios, native audio, and optional first and last frames to steer the shot. Mid-range price per second. A flexible all-rounder; for cheaper tests use Seedance 1.5 Pro, for top-end realism Veo 3.1.",
        modelsLabWan26T2V:
          "Wan 2.6 T2V - ModelsLab's Wan 2.6 text-to-video generation model",
        modelsLabWan26I2V:
          "Alibaba's Wan 2.6 image-to-video model: hand it a starting frame and it animates the scene, with native audio. 5 or 10 second clips at 720p or 1080p, landscape or portrait. Cheaper than Wan 2.7. Pick Wan 2.7 T2V when you also want a target end frame or more aspect ratios.",
        modelsLabWan26I2VFlash:
          "The speed variant of Wan 2.6 image-to-video. Turns a still into a 5 or 10 second 1080p clip with shorter waits. It is not cheaper per second than standard Wan 2.6 I2V, often slightly pricier, so it only pays off when turnaround matters. Native audio is not listed for this variant; the standard model has it.",
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
          "ByteDance's OmniHuman 1.5 animates a person from a single photo, driven by an audio track: talking heads, singing, gestures. A specialist for avatars and dubbing, not a general text-to-video model. Pricier per second than most mid-range video models. For scenes without a speaking person, pick Kling 3.0 or Wan 2.7.",
        modelsLabSeedance15Pro:
          "ByteDance's Seedance 1.5 Pro, sold through its BytePlus cloud. Native audio, 4 to 12 second clips from 480p to 1080p, first and last frame control, a wide range of aspect ratios. One of the cheapest video models here per clip. Great for testing ideas and volume; Seedance 2.0 is the step up for consistency and 4K.",
        modelsLabVeo2:
          "Veo 2 - Google's high-quality video generation model via ModelsLab",
        modelsLabVeo3:
          "Veo 3 - Google's latest video generation model via ModelsLab",
        modelsLabVeo3Fast:
          "Veo 3 Fast - Google's fast video generation model via ModelsLab",
        modelsLabVeo3FastPreview:
          "Veo 3 Fast Preview - Google's fast video generation preview model via ModelsLab",
        modelsLabVeo31:
          "Google's flagship video model. Cinematic realism, native audio with dialogue and sound effects, 4 to 8 second clips up to 4K, first and last frame control. The most expensive video model in the catalog. Worth it for final shots; draft on Veo 3.1 Fast at a fraction of the price.",
        modelsLabVeo31Fast:
          "The fast, cheaper tier of Google's Veo 3.1. Same 4 to 8 second clips, native audio, up to 4K and frame control, for roughly a third to half the price of full Veo 3.1. Gives up some fidelity on demanding shots. The sweet spot for most Veo work; Veo 3.1 Lite is cheaper still.",
        modelsLabKlingV21I2V:
          "Kling V2.1 I2V - Kling AI's image-to-video model version 2.1",
        modelsLabKlingV25TurboI2V:
          "Kling 2.5 Turbo for image-to-video: animate a still into a short clip. Cheap per clip and quick, with Kling's lively motion. No native audio listed. Kling 3.0 adds sound and shots up to 15 seconds for more money.",
        modelsLabKlingV25TurboT2V:
          "Kling 2.5 Turbo from text. 5 or 10 second clips in 16:9, 9:16 or 1:1, among the cheapest per clip in the catalog. Strong motion for the price, no native audio. Upgrade to Kling 3.0 T2V for sound and clips up to 15 seconds.",
        modelsLabKlingV2MasterT2V:
          "Kling V2 Master T2V - Kling AI's master quality text-to-video model",
        modelsLabKlingV2MasterI2V:
          "Kling V2 Master I2V - Kling AI's master quality image-to-video model",
        modelsLabKlingV21MasterT2V:
          "Kling 2.1 Master, the premium tier of Kling's 2.1 generation. 5 or 10 second clips from text with high visual fidelity. Priced near the top of the catalog, about three times Kling 3.0 T2V, which is newer and adds native audio. Mostly worth it for prompts that already work well here.",
        modelsLabKlingV21MasterI2V:
          "Kling 2.1 Master for image-to-video: animates a still into a 5 or 10 second clip with high visual fidelity. Priced near the top of the catalog, about three times the newer Kling 3.0, which also brings native audio. Pick it only if its look is exactly what you need; Kling V2.5 Turbo I2V is the cheap alternative.",
        modelsLabKlingV16MultiI2V:
          "Kling V1.6 Multi I2V - Kling AI's multi-image-to-video model version 1.6",
        modelsLabKling30T2V:
          "Kling 3.0 Pro from Kuaishou. Native audio, 3 to 15 second clips at 720p, first and last frame control, 16:9, 9:16 or 1:1. Lively, convincing motion for a mid-range price. 720p is the ceiling; for 1080p and above look at Veo 3.1 Fast or Hailuo 3. Kling 3.0 Std is the cheaper tier.",
        modelsLabLtx2ProT2V:
          "Lightricks' LTX-2 Pro. Text-to-video at 2K or 4K, in clips of roughly 6 to 10 seconds. A mid-range price for that resolution, which makes it the budget route to 4K next to Veo 3.1. No native audio listed here; for sound with 4K use Veo 3.1 Fast.",
        modelsLabLtx2ProI2V:
          "LTX 2 PRO I2V - LTX's professional image-to-video generation model",
        modelsLabLtx23ProI2V:
          "Lightricks' LTX 2.3 Pro for image-to-video: animates a still at 2K or 4K in 6 to 10 second clips. Newer than LTX 2 Pro and priced a bit higher. The pick when a high-resolution image must stay sharp in motion. No native audio listed.",
        modelsLabHailuo23T2V:
          "MiniMax's Hailuo 2.3 from text, known for lively, physical motion like dance and action. 6 or 10 second clips at 1080p in 16:9. No native audio. Mid-range price. Hailuo 3 adds sound, 2K and frame control for about twice the cost.",
        modelsLabHailuo02T2V:
          "Hailuo 02 T2V - MiniMax's text-to-video generation model 02",
        modelsLabHailuo23I2V:
          "MiniMax's Hailuo 2.3 for image-to-video. Animates a still into a 6 or 10 second clip with expressive, physical motion. No native audio. Hailuo 2.3 Fast I2V does the same job for about half the price with less polish.",
        modelsLabHailuo23FastI2V:
          "The fast, cheap tier of Hailuo 2.3 image-to-video. 6 or 10 second clips from a still at around half the cost of standard Hailuo 2.3 I2V. Good for drafts and volume, with less detail. No native audio.",
        modelsLabHailuo02I2V:
          "Hailuo 02 I2V - MiniMax's image-to-video generation model 02",
        modelsLabHailuo02StartEnd:
          "Hailuo 02 Start/End - MiniMax's start-end frame video generation model",
        modelsLabSora2:
          "OpenAI's Sora 2. Believable physics, synced audio and dialogue, clips up to 12 seconds. 16:9 only on this route. Mid-to-high price. Sora 2 Pro goes to 20 seconds and 1080p for roughly two to three times the cost.",
        modelsLabSora2Pro:
          "The premium tier of OpenAI's Sora 2. Synced audio, clips up to 20 seconds, 720p or 1080p, landscape or portrait. One of the most expensive video models here. Worth it for long, polished shots; Sora 2 covers drafts for less than half the price.",
        modelsLabGen4Aleph:
          "Runway's Aleph is a video editor more than a generator: give it existing footage and it adds or removes objects, restyles, relights or changes the camera angle. Many aspect ratios, including wide cinema formats. Pricier than most generators. For fresh clips from a prompt, use Veo 3.1 Fast or Kling 3.0.",
        modelsLabLipsync2:
          "Sync's lipsync-2 matches the mouth movement in an existing video to a new audio track. Built for dubbing, translated voiceovers and fixing dialogue. It edits footage, it does not invent scenes. For a talking person from a single photo, use Omnihuman 1.5.",
        modelsLabGrokT2V:
          "xAI's Grok Imagine video from text. 1 to 15 second clips at 480p or 720p, with an optional first frame. Mid-range price, quick and loose. Open tier, so lighter filters than Veo or Sora, though not explicit. Grok Imagine Video 1.5 adds 1080p.",
        modelsLabGrokI2V:
          "xAI's Grok Imagine for image-to-video. Animates a still into a clip of up to 15 seconds in HD. A little cheaper than Grok T2V. Fine for quick animated stills; for higher resolution, step up to Grok Imagine Video 1.5.",
        klingV30Std:
          "The standard tier of Kuaishou's Kling 3.0. The same 3 to 15 second clips with native audio and frame control as Kling 3.0 T2V, the Pro tier, at a lower price per second. 720p output. The value pick in the Kling 3 line; go Pro when fine detail counts.",
        klingVideoO1:
          "Kling's unified multimodal video model, designed to generate clips and edit them from references within one model. Native audio, 5 or 10 seconds at 720p, first and last frame control. Priced like Kling 3.0 Pro. Pick it for reference-driven work; for plain text-to-video, Kling 3.0 Std is cheaper.",
        veo31Lite:
          "Google's budget Veo 3.1 tier. Native audio, 4 to 8 second clips at 720p or 1080p, first and last frame control. The cheapest way into Veo, but no 4K. Good for high-volume social clips; step up to Veo 3.1 Fast when quality matters.",
        seedance2:
          "ByteDance's Seedance 2.0. Native audio, 4 to 15 second clips from 480p up to 4K, first and last frames, and reference input for keeping characters consistent. Upper price range. A strong choice for story shots with recurring characters; Seedance 2.0 Fast is cheaper for drafts at up to 720p.",
        seedance2Fast:
          "The faster, cheaper tier of ByteDance's Seedance 2.0. Native audio, clips up to 15 seconds and frame control, but capped at 720p. About 60 percent of the full model's price. Good for drafts and social clips; use full Seedance 2.0 when you need 1080p or 4K.",
        happyhorse11:
          "The second release of Alibaba's HappyHorse video model, which generates picture and synced sound in one pass. Text-to-video, image-to-video and reference images, up to 15 seconds at 720p or 1080p. Same price as HappyHorse 1.0, with improvements to motion and consistency per Alibaba, so it is the default pick of the two. Mid-range cost.",
        happyhorse10:
          "The first release of Alibaba's HappyHorse video model, which generates picture and synced sound in one pass. Text-to-video, image-to-video and reference images, up to 15 seconds at 720p or 1080p. Costs the same as HappyHorse 1.1, so the newer version is usually the better pick. Worth keeping for prompts tuned on 1.0.",
        modelsLabGen4T2ITurbo:
          "The faster, cheaper variant of Runway's Gen-4 image model. Text in, image out, at under a third of the price of Gen4 Image. Good for quick drafts and iterating on Runway's cinematic look. No reference-image editing here; for edits use FLUX.2 Pro or Seedream 4.5.",
        modelsLabGen4Image:
          "Runway's Gen-4 image model, known for a cinematic, film-still look. Text in, image out. One of the pricier image options in the catalog, so it earns its place when you want that Runway aesthetic specifically. For cheap iteration start with Gen4 T2I Turbo; for edits from a reference image pick FLUX.2 Pro.",
        modelsLabWan27T2I:
          "Alibaba's Wan 2.7 image model, from the same family as the Wan video models. Text in, image out, at a low mid-range price. A solid general-purpose pick for illustrations and scenes. No reference-image input here; for edits use Qwen Image 3 or Seedream 4.5.",
        modelsLabGrokT2I:
          "xAI's Grok Imagine image generator. Text in, image out, cheap to run. Open tier, so filters are lighter than Imagen 4, though not explicit. Fine for quick, punchy images; for reference-image edits and the newer generation, Grok Imagine Image 2.0 costs a bit more.",
        modelsLabZImageBase:
          "The full, undistilled foundation of Z-Image, the open-weight image model from Alibaba's Tongyi lab. Among the cheapest images in the catalog. More variety than Z Image Turbo, slower per image. Good for cheap volume and experimenting; for polished final art step up to FLUX.2 Pro.",
        modelsLabZImageTurbo:
          "The distilled, speed-tuned version of Z-Image, the open-weight model from Alibaba's Tongyi lab. Images in a few steps, priced at the bottom of the catalog. Good photoreal results and legible text for the cost. Less variety than Z Image Base, and it falls behind FLUX.2 Pro on hard prompts.",
        modelsLabFlux2MaxT2I:
          "Flux 2 Max T2I - Black Forest Labs' Flux 2 Max text-to-image via ModelsLab",
        modelsLabFluxPro11Ultra:
          "The high-resolution mode of Flux Pro 1.1, built for images of about 4 megapixels. Text in only. Among the pricier image models here. Pick it for large, print-ready stills; for editing or multi-reference work FLUX.2 Pro is cheaper and more flexible.",
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
          "The top tier of Google's Imagen 4. The most precise prompt following in the family and clean, legible text inside images. Mainstream: Google's filters apply in full. About three times the price of Imagen 4 Fast, so save it for final renders. For fewer restrictions use FLUX.2 Pro; for explicit content, Chroma.",
        modelsLabImagen4:
          "Google's standard Imagen 4. Photoreal detail, good typography and dependable prompt following at a mid-range price. Mainstream: Google's filters apply, so expect refusals on edgy prompts. Imagen 4 Fast is about half the price for drafts; Imagen 4 Ultra handles the last mile.",
        modelsLabImagen4Fast:
          "The speed tier of Google's Imagen 4. The cheapest Imagen, quick results, good for drafts and bulk batches. Gives up some detail and prompt precision versus Imagen 4 and Ultra. Mainstream filters apply. For even cheaper volume with lighter filters, try Z Image Turbo.",
        modelsLabImagen3:
          "Imagen 3 - Google's Imagen 3 text-to-image via ModelsLab",
        modelsLabNanoBananaPro:
          "Nano Banana Pro - High-quality image generation via ModelsLab",
        modelsLabNanoBanana: "Nano Banana - Image generation via ModelsLab",
        modelsLabQwenT2I:
          "Alibaba's Qwen text-to-image model. The Qwen image line stands out at rendering text inside images, Chinese characters included, which suits posters, signs and mockups. Priced at the bottom of the catalog. Text in only; for editing pick Qwen Image 3.",
        modelsLabRealtimeT2I:
          "ModelsLab's realtime endpoint, tuned for speed over polish. Fast images at the lowest price tier in the catalog. Use it for rapid ideation, thumbnails and testing prompts before spending on FLUX.2 Pro or Imagen 4. Not the pick for final art or complex scenes.",
        claudeSonnet5:
          "Anthropic's first Sonnet 5: balanced coding, agent and analysis work over 1M context, with image input. Mainstream filters, cautious on controversial topics, weak at roleplay. Claude Sonnet 5.5 costs the same and is newer, so there is no reason to stay.",
        claudeOpus5:
          "Anthropic's first Opus 5, aimed at the hardest agentic and analytical tasks, with 1M context and image input. Premium price, mainstream filters, cautious on controversial topics. Claude Opus 5.5 is newer and cheaper.",
        claudeOpus5Fast:
          "Claude Opus 5 Fast - High-throughput variant of Claude Opus 5 optimized for latency-sensitive applications. 1M-token context.",
        claudeFable5:
          "Anthropic's first Fable, a frontier reasoner for deep synthesis, creative depth and long-horizon planning, with 1M context and image input. Among the priciest models here and mainstream-filtered. Claude Fable 5.2 is newer and cheaper; for code, pick Claude Opus 5.5.",
        grok45:
          "xAI's Grok 4.5 reasoning model: strong at analysis and coding, reads images, 500K context, with Grok's open content policy. Grok 4.7 is newer at the same price, so switch unless you need this exact version.",
        grok46:
          "Grok 4.6 sharpened reasoning and coding over 4.5, with image input, 500K context and xAI's lighter content filters. Still a capable open-filter model. Grok 4.7 costs the same and replaces it.",
        gpt56Luna:
          "The quick, cheap tier of OpenAI's GPT-5.6 line, for everyday chat and short tasks, with 1M context and image input. Not built for deep analysis. GPT-6 Luna is newer and costs about half as much.",
        gpt56LunaPro:
          "Luna with better coding and instruction following, at the same low price as plain Luna. Good for cheap code help and structured tasks over 1M context. GPT-6 Luna is newer and about half the price.",
        gpt56Terra:
          "The mid tier of OpenAI's GPT-5.6 line: solid coding, analysis and chat over 1M context, with image input. Weak at roleplay. GPT-6.1 Terra is newer and roughly half the price.",
        gpt56TerraPro:
          "Terra with deeper reasoning for analysis-heavy work, at the same price as plain Terra, over 1M context. Weak at roleplay. GPT-6.1 Terra is newer and roughly half the price; step up to GPT-6.1 Sol for more depth.",
        gpt56Sol:
          "The top tier of OpenAI's GPT-5.6 line: complex reasoning, coding, writing and analysis over 1M context, with image input. Premium price, mainstream filters. GPT-6.1 Sol is newer and costs about half.",
        gpt56SolPro:
          "Sol with extra reasoning effort for the hardest problems, priced the same as plain Sol, over 1M context. Weak at roleplay, mainstream filters. GPT-6.1 Sol is newer at half the price; GPT-6 Astra if you need maximum depth.",
        gemini36Flash:
          "Google's Gemini 3.6 Flash: fast and good at coding, with 1M context and text, image, video and audio input. Still reasonable value for everyday work. Gemini 3.8 Flash is newer for only a little more.",
        gemini35FlashLite:
          "Google's lightest Gemini. Takes text, images, video and audio, calls tools, 1M context. Fine for simple high-volume jobs like summaries, tagging and quick answers. Mainstream filters, and not a reasoner. Pricier than you would expect for a lite model: GPT-6 Luna and Claude Haiku 5.5 cost less.",
        gemini37Flash:
          "Gemini 3.7 Flash brought better reasoning and analysis to the Flash line, with 1M context and text, image, video and audio input. A good everyday model at a fair price. Gemini 3.8 Flash replaces it for only slightly more.",
        kimiK3:
          "Moonshot AI's Kimi K3, a frontier-tier model. Strong at code, analysis, creative writing and long agent runs, reads images and video, calls tools, 1M context. Lighter filters than the US labs. Kimi K3.1 Pro is the newer, stronger version at almost twice the price.",
        glm52:
          "Z.AI's GLM-5.2: strong reasoning with fast inference and 1M context. Good for coding and analysis over long inputs, text only, open content level. GLM-5.3 is newer at about a third of the price.",
        minimaxM3:
          "MiniMax's flagship. Good at code, reasoning and analysis, reads images and video, calls tools, 1M context, pennies per message. Lighter filters than the mainstream labs. One step below the top tier. For harder problems at a still-low price, MiMo V2.6 Pro costs only a little more.",
        qwen37Flash:
          "Alibaba's ultra-cheap Flash model and one of the lowest-cost options in the catalog: 1M context, text, image and video input, tool calls. Great for bulk jobs and quick chat, shallow on hard reasoning. Qwen 3.8 Flash is newer and smarter but costs several times more.",
        qwen38Max:
          "Alibaba's top Qwen. Frontier-tier reasoning, code and analysis, reads images and video, calls tools, 1M context. Lighter filters than the US labs. Premium for an open model: DeepSeek V4 Pro reaches the same tier for well under half the price, if text-only input is enough.",
        mimoV25:
          "Xiaomi's efficient MiMo V2.5: quick and good at coding, with 1M context and text, image, video and audio input. Open content level. MiMo V2.6 Flash is newer and costs less than a third as much.",
        mimoV25Pro:
          "Xiaomi's MiMo V2.5 Pro, a deep reasoning and coding model with 1M context at a low price. Text only, open content level. Still cheaper than its successor MiMo V2.6 Pro, which is the newer pick.",
        metaMuseSpark12:
          "Meta's Muse Spark 1.2, a multimodal reasoning model that reads text, images and video over 1M context. Good at cross-modal analysis, open content level. Not tagged for coding. Meta Muse Spark 1.3 costs the same and is newer.",
        mistralMedium35:
          "Mistral AI's mid-tier Medium 3.5 from the French lab: coding, analysis and image input with 262K context. Mainstream filters. Mistral Large 4 is newer and costs less than half as much.",
        claudeOpus55:
          "Anthropic's top Claude for daily heavy work. The pick for the hardest coding, long agentic tasks and careful analysis, with strong writing on top. Reads images, calls tools, 1M context. Premium price and mainstream filters: it declines edgy requests and makes a poor roleplay partner. Claude Sonnet 5.5 covers most daily work at half the price.",
        claudeSonnet55:
          "Anthropic's workhorse Claude. Strong coding, agent work, analysis and writing for half the price of Opus 5.5. Reads images, calls tools, 1M context. Mainstream filters, so not for roleplay or controversial topics. Priced level with GPT-6.1 Sol and Gemini 4 Argon, the obvious head-to-head.",
        claudeHaiku55:
          "Anthropic's fastest, cheapest Claude. Quick chat, light coding, vision and tools, 1M context, pennies per message. Mainstream filters, weak for roleplay and edgy topics. Same price as GPT-6 Luna. Step up to Claude Sonnet 5.5 when the task needs real depth.",
        claudeFable51:
          "Anthropic's Fable 5.1, a frontier reasoner for deep synthesis, long-horizon planning and careful writing over 1M context. Premium-priced, mainstream-filtered, cautious on controversial topics and weak at roleplay. Claude Fable 5.2 replaces it and costs less; for code, Claude Opus 5.5 is the better fit.",
        claudeFable52:
          "Anthropic's frontier reasoner and the priciest Claude. Built for deep synthesis, research and long-horizon planning, with strong writing. Reads images, calls tools, 1M context. About double the price of Opus 5.5, with mainstream filters. For code, Claude Opus 5.5 is the better value.",
        gpt6Astra:
          "OpenAI's most capable model, built for maximum reasoning depth on the hardest problems. Code, analysis and writing, reads images, calls tools, 1M context. The most expensive model in the catalog, with mainstream filters. GPT-6.1 Sol sits in the same tier for about a fifth of the price, so try it first.",
        gpt6AstraPro:
          "GPT-6 Astra Pro - GPT-6 Astra with extended reasoning effort. Slower, more thorough. 1.05M-token context.",
        gpt61Sol:
          "OpenAI's premium reasoner and its sensible frontier pick. Strong at code, analysis and writing, reads images, calls tools, 1M context. Mainstream filters, not for roleplay. About a fifth of GPT-6 Astra's price, and level on cost with Claude Sonnet 5.5 and Gemini 4 Argon.",
        gpt61SolPro:
          "GPT-6.1 Sol Pro - GPT-6.1 Sol with extended reasoning effort for complex analysis and code. 1.05M-token context.",
        gpt61Terra:
          "OpenAI's balanced middle tier. Good coding, analysis and everyday chat, reads images, calls tools, 1M context. Half the price of GPT-6.1 Sol. Mainstream filters, weak at roleplay. If lighter filters suit you, DeepSeek V4 Pro reaches a higher tier for less.",
        gpt61TerraPro:
          "GPT-6.1 Terra Pro - GPT-6.1 Terra with deeper reasoning for analysis-heavy work. 1.05M-token context.",
        gpt6Luna:
          "OpenAI's lightweight GPT-6. Fast answers for pennies, reads images, calls tools, 1M context. Good for quick questions and simple chores, not deep reasoning or roleplay. Same price as Claude Haiku 5.5. DeepSeek V4.1 Flash is cheaper still, with lighter filters.",
        gpt6LunaPro:
          "GPT-6 Luna Pro - GPT-6 Luna with extra reasoning. Better code and instruction-following, same low price. 1.05M-token context.",
        gemini4Argon:
          "Google's flagship Gemini. Takes text, images, video and audio, then reasons, codes and analyzes at the top tier. Calls tools, 1M context. A strong pick when the input is a recording, a video or a pile of screenshots. Mainstream filters. Priced level with Claude Sonnet 5.5 and GPT-6.1 Sol.",
        gemini38Flash:
          "Google's current Flash. Fast, good at code and analysis, takes text, images, video and audio, calls tools, 1M context. Mainstream filters. Mid-priced: well under half of Gemini 4 Argon, but far above open fast models like Qwen 3.8 Flash.",
        grok47:
          "xAI's newest Grok. Sharp reasoning and code, reads images, calls tools, 500K context, half of what most flagships here offer. Open content policy, so it answers more than the mainstream labs without being fully uncensored. Priced like Qwen 3.8 Max. Grok 4 Fast is the cheap, quick sibling.",
        kimiK31Pro:
          "Moonshot AI's strongest Kimi. Top-tier reasoning, code, creative writing and long agent runs, reads images and video, calls tools, 1M context. Lighter filters than the US labs. Priced level with Claude Sonnet 5.5. Kimi K3 gets close for a little over half the price.",
        deepseekV41Flash:
          "DeepSeek's fast model, now with vision. Serious coding and analysis for almost nothing: the cheapest model in the catalog. Calls tools, 1M context, lighter filters. Not a deep reasoner. Step up to DeepSeek V4 Pro for hard problems, or pick DeepSeek V4.1 Flash Uncensored for no refusals.",
        qwen38Flash:
          "Alibaba's fast Qwen. Text, images and video in, quick answers out, decent coding, calls tools, 1M context. Budget price, lighter filters. A daily driver, not a deep thinker. Qwen 3.8 Max takes the hard problems.",
        glm53:
          "Z.AI's GLM-5.3 foundation model. Strong reasoning and code for pennies, calls tools, 1M context. Text only, lighter filters. Among the cheapest smart models in the catalog. Want zero refusals? GLM 5.3 Uncensored is the unfiltered variant.",
        glm53Flash:
          "Z.AI's fast GLM. Reads text, images and video, codes, calls tools, 1M context. Built for high-volume work at a budget price, with lighter filters. Lighter on reasoning than GLM-5.3, which costs the same, so pick Flash for media input and speed.",
        mimoV26Pro:
          "Xiaomi's top MiMo. Top-tier reasoning, code and analysis, taking text, images, video and audio. Calls tools, 1M context, lighter filters. The cheapest model in the highest intelligence tier here, a fraction of Gemini 4 Argon for a similar input range. A newer name, so test it on your own prompts.",
        mimoV26Flash:
          "Xiaomi's fast MiMo. Takes text, images, video and audio, codes well for its price, calls tools, 1M context. Very cheap, lighter filters. Trades depth for speed. MiMo V2.6 Pro is the step up, and MiMo V2.6 Flash Abliterated drops the refusals.",
        metaMuseSpark13:
          "Meta's mid-tier Muse. Reasons and analyzes across text, images and video, calls tools, 1M context, lighter filters. Not built for coding. At this price Kimi K3 reaches a higher tier, and Meta Muse Wonder is Meta's flagship.",
        metaMuseWonder:
          "Meta's flagship Muse. Top-tier reasoning, code, analysis and creative work, taking text, images, video and audio. Calls tools, 1M context, lighter filters than the mainstream labs. Premium, priced like Claude Opus 5.5. Kimi K3.1 Pro and Gemini 4 Argon sit in the same tier at half the price.",
        mistralLarge4:
          "Mistral AI's flagship, from a European lab. Good at code and analysis, reads images, calls tools, 1M context, at a moderate price. Mainstream filters. Not top tier: DeepSeek V4 Pro costs a little more and reasons deeper.",
        veniceDeepseekV41FlashUncensored:
          "DeepSeek V4.1 Flash with the refusals removed, served by Venice. Real coding and analysis plus fiction and roleplay, no lectures. Reads images, calls tools, 1M context, cheap. DeepSeek's training still frames political answers and can soften the darkest scenes; UncensoredLM is built uncensored for that. Around four times the price of plain DeepSeek V4.1 Flash. GLM 5.3 Flash Uncensored is the cheaper unfiltered alternative.",
        grokImagineImage2:
          "xAI's second-generation Grok Imagine image model. Takes text or a reference image, so it handles edits as well as fresh images. Mid-range price. Open tier: lighter filters than mainstream, not explicit. The upgrade over Grok Imagine T2I when you need edits or tighter prompt adherence.",
        qwenImage3:
          "The quick tier of Alibaba's Qwen Image 3. Generates from text and edits from a reference image, at a low price. Good for fast edits, text-heavy graphics and iterating. Qwen Image 3 Pro adds detail for a little more; for uncensored edits use Qwen Edit Uncensored.",
        qwenImage3Pro:
          "The higher-quality tier of Alibaba's Qwen Image 3. Text or reference image in, with more detail and polish than the base Qwen Image 3 for a modest premium. Strong for edits and text-in-image work. Open tier, so not explicit; Qwen Edit Uncensored covers that.",
        hailuo3:
          "MiniMax's Hailuo 3. Native audio, 2K output, clips up to 15 seconds, first and last frame control. A clear step up from Hailuo 2.3 on paper, at about twice the price. Upper price range; for cheaper 1080p without sound, use Hailuo 2.3 T2V.",
        seedance25:
          "ByteDance's Seedance 2.5. The headline is length: clips up to 30 seconds with native audio and frame control, at 480p or 720p. The priciest Seedance per clip. Pick it for long continuous shots; for sharper short clips Seedance 2.0 reaches 4K.",
        flux3Video:
          "Flux 3 Video - Black Forest Labs' flagship video generation model with exceptional quality and prompt adherence.",
        grokImagineVideo15:
          "xAI's Grok Imagine Video 1.5. Clips up to 15 seconds at 480p, 720p or 1080p, with an optional first frame. A step up from Grok T2V in resolution, at roughly twice the price. Open tier: lighter filters than Veo or Sora, not explicit.",
        lyria3ProPreview:
          "Google's premium Lyria 3 tier, still in preview. Built for full-length songs with high production quality. Mainstream: Google's filters apply. About one and a half times the price of Lyria 3. Preview status means behavior and availability can still change.",
        lyria3ClipPreview:
          "Google's short-form Lyria 3 Clip, in preview. Fast, cheap music clips for intros, stingers and social posts. Mainstream filters apply. Short durations only; for longer tracks use Lyria 3 or Lyria 3 Pro Preview.",
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
          "OpenAI's Whisper speech recognition, trained on 99 languages. Transcribes interviews, voice notes and meetings and copes well with accents and background noise. Cheap per use. No speaker labels, and on long silences it can invent text. For a newer OpenAI option, try GPT-4o Mini Transcribe.",
        deepgramNova2:
          "Deepgram Nova-2 - Fast and accurate speech-to-text with noise robustness",
        whisperLargeV3:
          "Whisper Large V3 - Open-weight OpenAI model, 99 languages, far cheaper than hosted whisper-1.",
        voxtralMini:
          "Voxtral Mini Transcribe - Mistral transcription with diarization and segment timestamps, up to 10 minutes.",
        nemotronAsr:
          "Nemotron ASR - NVIDIA open multilingual speech recognition, 40 locales, low latency.",
        gpt4oMiniTranscribe:
          "GPT-4o Mini Transcribe - Lower word error rate than Whisper, better language detection.",
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
          "OpenAI's Alloy voice. Balanced and neutral, neither clearly male nor female, with a steady pace. Fits narration, explainers and professional content where the voice should stay out of the way. Costs a tiny fraction of a cent. Less warmth than Nova, less weight than Onyx.",
        openaiNova:
          "OpenAI's Nova voice. Bright, warm and friendly, with a female tone. Fits assistants, conversational apps and upbeat reads. Very cheap. Less suited to grave or formal material; Onyx carries that better.",
        openaiOnyx:
          "OpenAI's Onyx voice. Deep, calm male voice with authority. Fits documentaries, formal narration and announcements. Very cheap. Can sound heavy for casual chat; Nova is the lighter, friendlier pick.",
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
        kokoroBella:
          "Kokoro Bella - Open-weight 82M model, warm American female voice. No content filter.",
        kokoroSarah:
          "Kokoro Sarah - Open-weight 82M model, clear American female voice. No content filter.",
        kokoroNicole:
          "Kokoro Nicole - Open-weight 82M model, soft low-key female voice. No content filter.",
        kokoroAdam:
          "Kokoro Adam - Open-weight 82M model, steady American male voice. No content filter.",
        kokoroMichael:
          "Kokoro Michael - Open-weight 82M model, confident American male voice. No content filter.",
        kokoroEmma:
          "Kokoro Emma - Open-weight 82M model, British female voice. No content filter.",
        kokoroGeorge:
          "Kokoro George - Open-weight 82M model, British male voice. No content filter.",
        inworldAshley:
          "Inworld Ashley - Fast, low-cost female voice with lively delivery.",
        inworldCraig: "Inworld Craig - Fast, low-cost British male voice.",
        xaiEve:
          "xAI Eve - Expressive female voice with inline emotion controls.",
        geminiZephyr:
          "Gemini Zephyr - Bright female voice, 100+ languages, delivery instructions.",
        geminiPuck:
          "Gemini Puck - Upbeat male voice, 100+ languages, delivery instructions.",
      },
    },
  },
};
