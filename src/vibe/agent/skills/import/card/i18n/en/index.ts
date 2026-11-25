export const translations = {
  category: "AI Tools",
  tags: {
    skills: "skills",
  },
  enums: {
    visibility: {
      private: "Private",
      unlisted: "Unlisted",
      public: "Public",
    },
  },
  post: {
    title: "Import character card",
    titleShort: "Import card",
    description:
      "Import a Character Card (V1, V2 or V3) from SillyTavern, Chub, RisuAI or any Tavern-format app. Accepts the .json file, a .png card with the data embedded, or the card JSON as text. Name, description, personality, scenario, first message, example dialogue, card instructions and tags become a new character you own. A PNG card's image becomes the avatar. Nothing in the card runs. Importing the same card again returns the existing character.",
    intro:
      "Bring your characters over. Drop the card file you exported from SillyTavern, Chub or RisuAI.",
    supported: "Card V1, V2 and V3. JSON or PNG, up to 10 MB.",
    mapping: {
      title: "What comes over",
      fields:
        "Name, description, personality, scenario, first message, example dialogue, card instructions, tags, creator.",
      avatar: "PNG cards: the image becomes the avatar.",
      safe: "Lorebooks and scripts are skipped. Nothing in the card runs.",
    },
    card: {
      label: "Card file",
      description: "Character card as .json or .png",
      validation: {
        required: "Choose a card file.",
        tooLarge: "Card file is over 10 MB.",
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
      creatorName: { content: "Card creator" },
      sourceUrl: { content: "Source link" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Already imported" },
      importedFields: { content: "Imported" },
    },
    fields: {
      name: "name",
      avatar: "avatar",
      greeting: "first message",
      description: "description",
      definition: "personality and scenario",
      tags: "tags",
    },
    result: {
      imported: "{{name}} is ready.",
      alreadyImported: "You already imported {{name}}. Opening your copy.",
      fieldsList: "Imported: {{fields}}",
      openSkill: "Open character",
      importAnother: "Import another card",
    },
    errors: {
      validation: {
        title: "Invalid card",
        description: "Choose a character card file (.json or .png).",
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
        title: "Not found",
        description: "The card could not be found.",
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
        title: "Import running",
        description: "This card is already being imported.",
      },
      invalidCard:
        "Not a character card. Use the .json or .png file exported from SillyTavern, Chub or RisuAI.",
      noCardInPng:
        "This PNG has no card data inside. Export it again as a character card, or use the .json file.",
      rateLimited: "Too many imports. Wait {{seconds}} seconds and try again.",
    },
    success: {
      title: "Character imported",
      description: "Your copy is ready to chat.",
    },
    backButton: {
      label: "Back",
    },
    submitButton: {
      label: "Import card",
      loadingText: "Importing...",
    },
  },
};
