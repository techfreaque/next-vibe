export const translations = {
  category: "Creator Profile",
  tags: {
    creator: "creator",
    profile: "profile",
    public: "public",
  },
  get: {
    title: "Get Creator Profile",
    description:
      "Get public creator profile with bio, social links, and skill count",
    form: {
      title: "Creator Profile",
      description: "Public profile for a skill creator",
      userId: {
        label: "User ID",
        description: "The creator's user ID",
      },
    },
    response: {
      title: "Creator Profile",
      description: "Public creator profile data",
      publicName: "Display Name",
      avatarUrl: "Avatar",
      bio: "Bio",
      websiteUrl: "Website",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      discordUrl: "Discord",
      creatorAccentColor: "Accent Color",
      creatorHeaderImageUrl: "Header Image",
      skillCount: "Skills",
      referralCode: "Referral Code",
    },
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      unauthorized: { title: "Unauthorized", description: "Not authorized" },
      forbidden: { title: "Forbidden", description: "Access denied" },
      notFound: { title: "Not Found", description: "Creator not found" },
      conflict: { title: "Conflict", description: "Request conflict" },
      network: { title: "Network Error", description: "Network error" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes",
      },
      internal: { title: "Server Error", description: "Internal error" },
      unknown: { title: "Unknown Error", description: "Unknown error" },
    },
    success: {
      title: "Creator Profile",
      description: "Creator profile retrieved",
    },
  },
};
