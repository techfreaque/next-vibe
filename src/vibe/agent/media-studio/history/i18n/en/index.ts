export const translations = {
  tags: {
    studio: "Media Studio",
    history: "History",
  },
  get: {
    title: "Your generations",
    titleShort: "Generations",
    description:
      "Images, videos, music, speech and transcripts you made in the Studio, in chat or via the API. Newest first.",
    fields: {
      kind: {
        label: "Type",
        description:
          "image, video, music, speech or transcribe. Leave empty for everything.",
      },
    },
    response: {
      items: "Generations",
      id: "ID",
      kind: "Type",
      title: "Prompt",
      createdAt: "Created",
      status: "Status",
      url: "File",
      transcript: "Transcript",
      credits: "Credits",
      model: "Model",
      settings: "Settings",
      source: "Made in",
      threadId: "Thread",
      rootFolderId: "Folder",
    },
    success: {
      title: "History loaded",
      description: "Your generations are listed.",
    },
    errors: {
      validation: {
        title: "Invalid filter",
        description: "Check the type and page, then try again.",
      },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to see your generations.",
      },
      forbidden: {
        title: "No access",
        description: "You can only see your own generations.",
      },
      notFound: {
        title: "Nothing here",
        description: "No generations match this filter.",
      },
      server: {
        title: "History unavailable",
        description: "Your history could not load. Try again in a moment.",
      },
      network: {
        title: "Connection lost",
        description: "Check your connection and try again.",
      },
      unknown: {
        title: "Something went wrong",
        description: "Your history could not load. Try again.",
      },
      conflict: {
        title: "History changed",
        description: "Reload to see the latest results.",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Save or discard your changes first.",
      },
    },
  },
  widget: {
    title: "Your generations",
    titles: {
      image: "Your images",
      video: "Your videos",
      music: "Your tracks",
      speech: "Your voiceovers",
      transcribe: "Your transcripts",
    },
    count: "{{count}} total",
    error: "Your history did not load.",
    retry: "Try again",
    emptyTitle: "Nothing made yet",
    emptyHint: "Every result you generate lands here, ready to download.",
    emptyKindHint: "Your first result appears here the moment it finishes.",
    runAgain: "Run again",
    download: "Download",
    copyPrompt: "Copy prompt",
    copied: "Copied",
    copyFailed: "Copy blocked",
    openInChat: "Open in chat",
    continueInChat: "Continue in chat",
    chatPrompt: "Here is what I made: {{url}}\n\nPrompt: {{prompt}}",
    open: "Open full size",
    credits: "{{amount}} credits",
    source: {
      studio: "via Studio",
      chat: "via Chat",
      api: "via API",
    },
    status: {
      queued: "Queued",
      running: "Generating",
      saving: "Saving file",
      completed: "Done",
      failed: "Failed",
    },
    pendingHint: "Video and music can take a few minutes.",
    kinds: {
      image: "Image",
      video: "Video",
      music: "Music",
      speech: "Speech",
      transcribe: "Transcript",
    },
  },
};
