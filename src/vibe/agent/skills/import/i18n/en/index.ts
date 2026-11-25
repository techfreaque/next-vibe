export const translations = {
  category: "AI Tools",
  tags: {
    skills: "skills",
  },
  enums: {
    platform: {
      characterAi: "Character.AI",
      talkie: "Talkie",
      characterCard: "Character card",
    },
    visibility: {
      private: "Private",
      unlisted: "Unlisted",
      public: "Public",
    },
  },
  post: {
    title: "Import character from link",
    titleShort: "Import from link",
    description:
      "Import a character from a public Character.AI (character.ai, c.ai) or Talkie (talkie-ai.com) link. Copies name, avatar, greeting, description, definition and tags into a new character you own, credits the original creator and links back to the source. Importing the same link again returns the existing character.",
    dynamicTitle: "Import: {{url}}",
    intro:
      "Paste a public character link. We copy what the page shows publicly and credit the original creator.",
    supported: "Works with Character.AI and Talkie.",
    url: {
      label: "Character link",
      description: "Public link to the character page",
      placeholder: "https://character.ai/character/...",
      validation: {
        invalid: "Paste a full link starting with https://",
      },
    },
    visibility: {
      label: "Visibility",
      description:
        "Private: only you. Unlisted: off the public list. Public: listed for everyone.",
    },
    response: {
      id: { content: "Character ID" },
      name: { content: "Name" },
      platform: { content: "Source" },
      creatorName: { content: "Original creator" },
      sourceUrl: { content: "Source link" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Already imported" },
      importedFields: { content: "Imported" },
    },
    fields: {
      name: "name",
      avatar: "avatar",
      greeting: "greeting",
      description: "description",
      definition: "definition",
      tags: "tags",
    },
    result: {
      imported: "{{name}} is ready.",
      alreadyImported: "You already imported {{name}}. Opening your copy.",
      credit: "Originally by {{creator}} on {{platform}}",
      creditUnknown: "Imported from {{platform}}",
      cardCredit: "Card by {{creator}}",
      cardCreditUnknown: "Imported from a character card",
      fieldsList: "Imported: {{fields}}",
      openSkill: "Open character",
      importAnother: "Import another",
    },
    errors: {
      validation: {
        title: "Invalid link",
        description: "Paste a full public character link.",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server.",
      },
      unauthorized: {
        title: "Sign in required",
        description: "Sign in to import characters.",
      },
      forbidden: {
        title: "Not allowed",
        description: "Your account cannot import characters.",
      },
      notFound: {
        title: "Character not found",
        description:
          "The page shows no public character data. It may be private, deleted or need a login.",
      },
      server: {
        title: "Import failed",
        description: "Something broke while importing. Try again.",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred.",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes.",
      },
      conflict: {
        title: "Already imported",
        description: "You already imported this character.",
      },
      unsupported:
        "Unsupported link. Paste a Character.AI (character.ai, c.ai) or Talkie (talkie-ai.com) character link.",
      blocked:
        "{{platform}} blocked the request. Try again in a few minutes or create the character by hand.",
      noPublicData:
        "{{platform}} shows no public data for this character. It may be private, deleted or need a login.",
      rateLimited: "Too many imports. Wait {{seconds}} seconds and try again.",
      notConfigured:
        "{{platform}} pages need the page fetcher, which is not configured on this server.",
    },
    success: {
      title: "Character imported",
      description: "Your copy is ready to chat.",
    },
    backButton: {
      label: "Back",
    },
    submitButton: {
      label: "Import",
      loadingText: "Importing...",
    },
  },
};
