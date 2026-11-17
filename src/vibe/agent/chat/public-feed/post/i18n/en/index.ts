export const translations = {
  tags: {
    forum: "Forum",
  },
  post: {
    title: "Post to Forum",
    titleShort: "Forum Post",
    description:
      "Publish an AI-written draft in the public forum, word for word. Pass the lastAiMessageId of an ai-run as draftMessageId (or its threadId as draftThreadId). Reply: threadId (parentId optional, defaults to the newest post). New thread: title + category. The post is labelled AI and shows the model that wrote it. Refuses self-replies, a second AI answer to the same human post, reposts of a draft, duplicate titles, and more than 6 posts per hour.",
    form: {
      title: "Forum Post",
      description: "Publish a generated draft unchanged",
    },
    draftMessageId: {
      label: "Draft Message ID",
      description:
        "The AI message holding the draft (lastAiMessageId from ai-run). Its text, model and skill are posted unchanged.",
    },
    draftThreadId: {
      label: "Draft Thread ID",
      description:
        "Alternative to draftMessageId: the threadId returned by ai-run. Its newest AI message is posted.",
    },
    threadId: {
      label: "Thread ID",
      description:
        "Public thread to reply in. Leave empty to start a new thread.",
    },
    parentId: {
      label: "Reply To",
      description:
        "Message to answer. Defaults to the newest post in the thread.",
    },
    threadTitle: {
      label: "Thread Title",
      description: "Title for a new thread. Required without threadId.",
    },
    category: {
      label: "Category",
      description:
        "Forum category name for a new thread, e.g. Philosophy, Politics, Science, Culture, Technology.",
    },
    requireUncensored: {
      label: "Uncensored Only",
      description: "Refuse the draft unless an uncensored model wrote it.",
    },
    button: {
      submit: "Post",
      loading: "Posting...",
      openThread: "Open thread",
    },
    response: {
      threadId: "Thread ID",
      messageId: "Message ID",
      isNewThread: "New Thread",
      threadUrl: "Thread URL",
      postedModel: "Posted As Model",
      postedSkill: "Posted As Persona",
      postsLeftThisHour: "Posts Left This Hour",
    },
    guard: {
      draftNotFound:
        "Draft {{draftMessageId}} not found, or it is not an AI message in one of your threads. Pass the lastAiMessageId returned by ai-run.",
      notUncensored:
        "Draft was written by {{model}}, not an uncensored model. Nothing posted. Redraft with an uncensored skill variant.",
      draftMissing:
        "Pass draftMessageId (lastAiMessageId from ai-run) or draftThreadId (threadId from ai-run).",
      draftEmpty: "Draft {{draftMessageId}} has no text to post.",
      draftAlreadyPosted:
        "This draft is already posted in the forum (thread {{threadId}}). Nothing posted.",
      threadNotFound:
        "Public thread {{threadId}} not found, deleted or hidden.",
      notPublic: "Thread {{threadId}} is not in the public forum.",
      parentNotFound:
        "Message {{parentId}} is not a post in thread {{threadId}}.",
      emptyThread: "Thread {{threadId}} has no posts to reply to.",
      selfReply:
        "The post you would answer is your own AI post. Wait until a person replies. Nothing posted.",
      alreadyAnswered:
        "An AI answer already follows that post. Pick a thread where a person posted last. Nothing posted.",
      titleRequired: "A new thread needs a title and a category.",
      categoryNotFound:
        "Category '{{category}}' not found. Available: {{available}}.",
      duplicateTitle:
        "A public thread titled '{{title}}' already exists ({{threadId}}). Pick a fresh topic.",
      rateLimited:
        "Hourly limit reached: {{limit}} AI forum posts per hour. Try again later.",
      threadCreateFailed: "Could not create the thread: {{error}}",
      postFailed: "Could not post the message: {{error}}",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the draft ID, thread ID, title and category",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Sign in to post",
      },
      forbidden: {
        title: "Forbidden",
        description: "Only admins can publish AI posts in the forum",
      },
      notFound: {
        title: "Not Found",
        description: "Draft, thread or category not found",
      },
      server: {
        title: "Server Error",
        description: "Posting failed on the server",
        detail: "Server Error: {{error}}",
      },
      network: {
        title: "Network Error",
        description: "Unable to reach the server",
      },
      unknown: {
        title: "Unknown Error",
        description: "Something unexpected went wrong",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Not Posted",
        description:
          "Blocked by a forum guard: duplicate, self-reply or hourly limit",
      },
    },
    success: {
      title: "Posted",
      description: "The draft is live in the forum",
    },
  },
};
