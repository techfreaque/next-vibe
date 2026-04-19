import { translations as avatarTranslations } from "../../avatar/i18n/en";
import { translations as passwordTranslations } from "../../password/i18n/en";

export const translations = {
  // Main user profile routes
  get: {
    title: "Get User Profile",
    description: "Retrieve current user profile information",
    response: {
      title: "User Profile Response",
      description: "Current user profile data",
      id: "User ID",
      leadId: "Lead ID",
      isPublic: "Public Profile",
      email: "Email Address",
      privateName: "Private Name",
      publicName: "Public Name",
      locale: "Locale",
      isActive: "Active Status",
      emailVerified: "Email Verified",
      requireTwoFactor: "Two-Factor Authentication Required",
      marketingConsent: "Marketing Consent",
      userRoles: "User Roles",
      createdAt: "Created At",
      updatedAt: "Updated At",
      stripeCustomerId: "Stripe Customer ID",
      bio: "Bio",
      websiteUrl: "Website",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      facebookUrl: "Facebook",
      discordUrl: "Discord",
      tribeUrl: "Tribe",
      rumbleUrl: "Rumble",
      odyseeUrl: "Odysee",
      nostrUrl: "Nostr",
      gabUrl: "Gab",
      creatorSlug: "Profile Slug",
      creatorAccentColor: "Accent Color",
      creatorHeaderImageUrl: "Header Image",
      avatarUrl: "Avatar",
      user: {
        title: "User Information",
        description: "User profile details",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "User profile not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      internal: {
        title: "Internal Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
    success: {
      title: "Success",
      description: "Profile retrieved successfully",
    },
  },
  update: {
    title: "Update User Profile",
    description: "Update current user profile information",
    groups: {
      basicInfo: {
        title: "Basic Information",
        description: "Update your basic profile information",
      },
      profileDetails: {
        title: "Profile Details",
        description: "Manage your profile details and settings",
      },
      privacySettings: {
        title: "Privacy Settings",
        description: "Control who can see your profile information",
      },
      profileInfo: {
        title: "Creator Profile",
        description: "Bio, social links, and branding for your skill pages",
      },
    },
    fields: {
      email: {
        label: "Email Address",
        description: "Your email address",
        placeholder: "Enter your email address",
        help: "Your email address will be used for account notifications and communication",
        validation: {
          invalid: "Please enter a valid email address",
        },
      },
      privateName: {
        label: "Private Name",
        description: "Your internal/private name",
        placeholder: "Enter your private name",
        help: "Your private name is used internally and for private communications",
        validation: {
          minLength: "Private name must be at least 2 characters long",
          maxLength: "Private name cannot exceed 50 characters",
        },
      },
      publicName: {
        label: "Public Name",
        description: "Your public display name",
        placeholder: "Enter your public name",
        help: "Your public name will be visible to other users",
        validation: {
          minLength: "Public name must be at least 2 characters long",
          maxLength: "Public name cannot exceed 50 characters",
        },
      },
      imageUrl: {
        label: "Profile Image",
        description: "URL to your profile image",
        placeholder: "Enter image URL",
        help: "Provide a URL to an image that will be displayed as your profile picture",
        validation: {
          invalid: "Please provide a valid image URL",
        },
      },
      company: {
        label: "Company",
        description: "Your company name",
        placeholder: "Enter your company",
        help: "Your company name will be displayed on your profile",
        validation: {
          maxLength: "Company name cannot exceed 100 characters",
        },
      },
      visibility: {
        label: "Profile Visibility",
        description: "Who can see your profile",
        placeholder: "Select visibility setting",
        help: "Choose who can view your profile: public (everyone), private (only you), or contacts only",
      },
      marketingConsent: {
        label: "Subscribe to Newsletter",
        description:
          "Occasional updates about new models and features. No spam, just what matters.",
        placeholder: "Enable marketing emails",
        help: "Choose whether to receive marketing emails and promotional communications",
      },
      bio: {
        label: "Bio",
        description: "A brief description about yourself",
        placeholder: "Tell us about yourself...",
        help: "Share a brief description about yourself that will be visible on your profile",
        validation: {
          maxLength: "Bio cannot exceed 500 characters",
        },
      },
      websiteUrl: {
        label: "Website",
        description: "Your personal or business website",
        placeholder: "https://yoursite.com",
      },
      twitterUrl: {
        label: "X / Twitter",
        description: "Your X (Twitter) profile URL",
        placeholder: "https://x.com/yourhandle",
      },
      youtubeUrl: {
        label: "YouTube",
        description: "Your YouTube channel URL",
        placeholder: "https://youtube.com/@yourchannel",
      },
      instagramUrl: {
        label: "Instagram",
        description: "Your Instagram profile URL",
        placeholder: "https://instagram.com/yourhandle",
      },
      tiktokUrl: {
        label: "TikTok",
        description: "Your TikTok profile URL",
        placeholder: "https://tiktok.com/@yourhandle",
      },
      githubUrl: {
        label: "GitHub",
        description: "Your GitHub profile URL",
        placeholder: "https://github.com/yourusername",
      },
      facebookUrl: {
        label: "Facebook",
        description: "Your Facebook page or profile URL",
        placeholder: "https://facebook.com/yourpage",
      },
      discordUrl: {
        label: "Discord",
        description: "Your Discord server or profile link",
        placeholder: "https://discord.gg/yourserver",
      },
      tribeUrl: {
        label: "Tribe",
        description: "Your Tribe community URL",
        placeholder: "https://yourcommunity.tribe.so",
      },
      rumbleUrl: {
        label: "Rumble",
        description: "Your Rumble channel URL",
        placeholder: "https://rumble.com/c/yourchannel",
      },
      odyseeUrl: {
        label: "Odysee",
        description: "Your Odysee channel URL",
        placeholder: "https://odysee.com/@yourchannel",
      },
      nostrUrl: {
        label: "Nostr",
        description: "Your Nostr profile or npub address",
        placeholder: "https://primal.net/p/npub1...",
      },
      gabUrl: {
        label: "Gab",
        description: "Your Gab profile URL",
        placeholder: "https://gab.com/yourhandle",
      },
      creatorSlug: {
        label: "Profile URL",
        description: "Your custom profile slug - appears in your public link",
        placeholder: "jane-doe",
        validation: {
          invalid: "Only lowercase letters, numbers, and hyphens allowed",
        },
      },
      creatorAccentColor: {
        label: "Accent Color",
        description: "Hex color for your skill page branding (optional)",
        placeholder: "#7c3aed",
      },
      creatorHeaderImageUrl: {
        label: "Header Image",
        description: "Banner image URL for your skill page hero",
        placeholder: "https://yoursite.com/banner.jpg",
      },
    },
    response: {
      title: "Updated Profile",
      description: "Your updated profile information",
      success: "Update Successful",
      message: "Your profile has been updated successfully",
      id: "User ID",
      leadId: "Lead ID",
      isPublic: "Public Profile",
      email: "Email Address",
      privateName: "Private Name",
      publicName: "Public Name",
      locale: "Locale",
      isActive: "Active Status",
      emailVerified: "Email Verified",
      requireTwoFactor: "Two-Factor Authentication Required",
      marketingConsent: "Marketing Consent",
      userRoles: "User Roles",
      createdAt: "Created At",
      updatedAt: "Updated At",
      stripeCustomerId: "Stripe Customer ID",
      bio: "Bio",
      websiteUrl: "Website",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      facebookUrl: "Facebook",
      discordUrl: "Discord",
      tribeUrl: "Tribe",
      rumbleUrl: "Rumble",
      odyseeUrl: "Odysee",
      nostrUrl: "Nostr",
      gabUrl: "Gab",
      creatorSlug: "Profile Slug",
      creatorAccentColor: "Accent Color",
      creatorHeaderImageUrl: "Header Image",
      user: "Updated User Information",
      changesSummary: {
        title: "Changes Summary",
        description: "Summary of changes made to your profile",
        totalChanges: "Total Changes",
        changedFields: "Changed Fields",
        verificationRequired: "Verification Required",
        lastUpdated: "Last Updated",
      },
      nextSteps: "Next Steps",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "User profile not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      internal: {
        title: "Internal Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
    success: {
      title: "Success",
      description: "Profile updated successfully",
      nextSteps: "Recommended next steps after updating your profile",
    },
  },
  delete: {
    title: "Delete User Account",
    description: "Permanently delete your user account",
    response: {
      title: "Deletion Status",
      description: "Account deletion confirmation",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "User account not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      internal: {
        title: "Internal Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
    success: {
      title: "Success",
      description: "Account deleted successfully",
    },
  },
  put: {
    response: {
      changedFields: {
        item: "Changed Field",
      },
    },
  },
  category: "User Profile",
  tag: "User Profile",
  tags: {
    profile: "profile",
    user: "user",
    account: "account",
  },

  widget: {
    save: "Save Profile",
    saving: "Saving...",
    editProfile: "Edit Profile",
    cancelEdit: "Cancel",
    memberSince: "Member since",
    profileCard: {
      title: "Creator Profile",
      description: "Your public identity across the platform",
    },
    socialCard: {
      title: "Social Links",
      description: "Connect your platforms",
    },
    emailCard: {
      title: "Your email list",
      description:
        "Visitors on your skill page can subscribe. You own the list - no platform in the middle.",
    },
    previewCard: {
      title: "Your Public Profile",
      description: "How others see you",
    },
    noPreview: "Fill in your profile to see a preview",
    noSocials: "No social links added yet",
    viewPublicProfile: "View public profile",
    profileUrl: "Your link",
    slugWarning:
      "Changing this URL will break any existing links to your profile.",
    bioPreview: "Preview",
    bioEdit: "Edit",
    skills: {
      title: "My Skills",
      chat: "Chat now",
      add: "Add to your collection",
      public: "Community",
      showLess: "Show less",
    },
  },

  // Sub-routes
  avatar: avatarTranslations,
  password: passwordTranslations,
};
