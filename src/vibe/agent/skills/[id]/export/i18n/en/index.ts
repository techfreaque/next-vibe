export const translations = {
  category: "AI Tools",
  tags: {
    skills: "skills",
  },
  get: {
    title: "Export character card",
    titleShort: "Export card",
    description:
      "Export a skill as a Character Card V2 JSON file. Import it in SillyTavern, RisuAI, Chub or any Tavern-format app, or keep it as a backup. Works for your own skills, public community skills and public built-in skills. The card credits the creator and links back to the skill page.",
    dynamicTitle: "Export: {{name}}",
    id: {
      label: "Skill",
      description: "The skill to export",
    },
    widget: {
      intro:
        "Your character, as a file you own. Character Card V2, the format SillyTavern, RisuAI and Chub import.",
      included:
        "Inside: name, full character prompt, tagline, description, creator and a link back here.",
      download: "Download card",
      copy: "Copy JSON",
      copied: "Copied",
    },
    card: {
      skillPage: "Skill page: {{url}}",
    },
    response: {
      name: { content: "Name" },
      fileName: { content: "File name" },
      card: { content: "Card JSON" },
    },
    errors: {
      validation: {
        title: "Invalid request",
        description: "Check the skill ID.",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server.",
      },
      unauthorized: {
        title: "Sign in required",
        description: "Sign in to export this skill.",
      },
      forbidden: {
        title: "Not allowed",
        description: "You cannot export this skill.",
      },
      notFound: {
        title: "Skill not found",
        description: "This skill does not exist or is not visible to you.",
      },
      server: {
        title: "Export failed",
        description: "Something broke while building the card. Try again.",
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
        title: "Conflict",
        description: "The skill changed during export. Try again.",
      },
    },
    success: {
      title: "Card ready",
      description: "Download it or copy the JSON.",
    },
  },
};
