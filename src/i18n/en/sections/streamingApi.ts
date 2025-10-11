export const streamingApiTranslations = {
  admin: {
    title: "Streaming API",
    description:
      "Test and manage streaming API endpoints for real-time data processing",
  },
  nav: {
    aiStream: "AI Stream",
    basicStream: "Basic Stream",
    aiStreamDescription: "AI-powered streaming chat with OpenAI GPT-4o",
    basicStreamDescription: "Basic streaming with progressive message delivery",
  },
  aiStream: {
    description: "Stream AI responses using OpenAI GPT-4o model",
    admin: {
      title: "AI Stream Testing",
      description:
        "Test AI-powered streaming functionality with OpenAI GPT-4o integration",
    },
    config: {
      title: "Configuration",
      show: "Show Configuration",
      hide: "Hide Configuration",
    },
    chat: {
      title: "AI Chat Interface",
      clear: "Clear Chat",
      empty: "Start a conversation by typing a message below",
      user: "You",
      assistant: "AI Assistant",
      placeholder: "Type your message here...",
      send: "Send",
      sending: "Sending...",
    },
    fields: {
      messages: "Chat messages array",
      model: "AI Model",
      temperature: "Temperature (creativity)",
      maxTokens: "Maximum tokens",
      systemPrompt: "System prompt (optional)",
      systemPromptPlaceholder:
        "Enter a system prompt to customize the AI's behavior...",
    },
    models: {
      gpt4o: "GPT-4o",
      gpt4oMini: "GPT-4o Mini",
      gpt4Turbo: "GPT-4 Turbo",
    },
  },
  basicStream: {
    description: "Stream random messages progressively using a for-loop",
    defaultPrefix: "Message",
    admin: {
      title: "Basic Stream Testing",
      description:
        "Test basic streaming functionality with progressive message delivery",
    },
    config: {
      title: "Stream Configuration",
    },
    controls: {
      title: "Stream Controls",
      start: "Start Stream",
      stop: "Stop Stream",
      clear: "Clear All",
      streaming: "Streaming...",
    },
    progress: {
      label: "Progress",
    },
    messages: {
      title: "Streamed Messages",
      titleWithCount: "Streamed Messages ({{count}})",
      empty: "No messages yet. Click 'Start Stream' to begin",
    },
    summary: {
      title: "Stream Summary",
      totalMessages: "Total Messages",
      duration: "Duration",
      status: "Status",
      completed: "Completed",
      incomplete: "Incomplete",
    },
    log: {
      title: "Debug Log",
      empty: "No log entries yet",
      messageReceived: "[{{time}}] Message received: {{content}}",
      streamCompleted:
        "[{{time}}] Stream completed: {{totalMessages}} messages in {{duration}}ms",
      error: "[{{time}}] Error: {{error}} - {{message}}",
    },
    fields: {
      count: "Message count",
      delay: "Delay between messages (ms)",
      prefix: "Message prefix",
      includeTimestamp: "Include timestamp",
      includeCounter: "Include counter",
    },
  },
};
