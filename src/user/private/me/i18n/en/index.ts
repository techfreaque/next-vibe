export const translations = {
  // Main user profile routes
  get: {
    title: "Get User Profile",
    titleShort: "My Profile",
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
      roles: "Roles",
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
        detail: "We couldn't find your profile (user {{userId}})",
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
        detail: "Could not load your profile: {{error}} (user {{userId}})",
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
    titleShort: "Update Profile",
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
        emailTaken: "That email address already belongs to another account",
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
        detail: "We couldn't find your profile to update (user {{userId}})",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
        creatorSlugTaken: "That creator handle is already taken - pick another",
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
        detail: "Could not save your profile: {{error}} (user {{userId}})",
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
    titleShort: "Delete Account",
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
        detail: "We couldn't find your account to delete (user {{userId}})",
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
        detail: "Could not delete your account: {{error}} (user {{userId}})",
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
        "Visitors on your skill page and creator profile can subscribe. You own the list - no platform in the middle.",
      manage: "Manage",
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
      hubSubtitle: "{{count}} published",
    },
    nav: {
      logout: "Log out",
      back: "Back",
    },
    sections: {
      account: "Account",
      subscription: "Subscription",
      subscriptionHint: "No active plan — upgrade to unlock features",
      manageSubscription: "Manage",
      noSubscription: "No active plan",
      upgrade: "Upgrade",
      addresses: "Billing addresses",
      addressCount: "{{count}} saved",
      addAddress: "Add address",
      manageAddresses: "Manage",
      noAddresses: "None saved",
      billing: "Billing",
      delivery: "Delivery",
      edit: "Edit",
      credits: "Credits",
      creditsAvailable: "available",
      password: "Password",
      passwordHint: "Change your account password",
      sessions: "Active sessions",
      sessionsHint: "Manage where you're logged in",
      creator: "Creator",
      referral: "Referral program",
      referralHint: "Invite friends and earn rewards",
    },
    deleteAccount: {
      dangerZone: "Danger Zone",
      button: "Delete Account",
      confirmTitle: "Delete your account permanently",
      confirmDescription:
        "This permanently deletes your account and all associated data. No recovery. No undo.",
      confirmLabel: 'Type "DELETE" to confirm',
      confirmPlaceholder: "DELETE",
      confirmButton: "Delete my account forever",
      cancelButton: "Cancel",
      whatGetsDeleted: "What gets deleted:",
      items: {
        profile: "Your profile and all settings",
        chats: "All chat history and threads",
        skills: "All custom skills and configurations",
        files: "All cortex files and memories",
        subscriptions: "Active subscriptions",
        credits: "Any remaining credits",
      },
      deleting: "Deleting...",
      success: "Account deleted. Redirecting...",
    },
  },

  // Sub-routes
  avatar: {
    category: "User Profile",

    tag: "avatar",
    errors: {
      user_not_found: "User not found",
      failed_to_upload_avatar: "Failed to upload avatar",
      failed_to_delete_avatar: "Failed to delete avatar",
      invalid_file_type: "Invalid file type",
      file_too_large: "File too large",
    },
    debug: {
      uploadingUserAvatar: "Uploading user avatar",
      errorUploadingUserAvatar: "Error uploading user avatar",
      deletingUserAvatar: "Deleting user avatar",
      errorDeletingUserAvatar: "Error deleting user avatar",
    },
    success: {
      uploaded: "Avatar uploaded successfully",
      deleted: "Avatar deleted successfully",
      nextSteps: {
        visible: "Your avatar is now visible on your profile",
        update: "You can update it anytime from your profile settings",
        default: "Your profile now shows the default avatar",
        uploadNew:
          "You can upload a new avatar anytime from your profile settings",
      },
    },
    upload: {
      title: "Upload Avatar",
      description: "Upload a profile avatar image",
      groups: {
        fileUpload: {
          title: "File Upload",
          description: "Select and upload your avatar image",
        },
      },
      fields: {
        file: {
          label: "Avatar Image",
          description: "Select an image file for your profile avatar",
          placeholder: "Choose an image file...",
          help: "Upload an image file (JPG, PNG, GIF) up to 5MB",
          validation: {
            maxSize: "File size must be less than 5MB",
            imageOnly: "Only image files are allowed",
            unsupportedFormat:
              "Unsupported image format. Use JPEG, PNG, WebP, or GIF.",
          },
        },
      },
      response: {
        title: "Upload Response",
        label: "Upload Result",
        description: "Avatar upload response",
        success: "Upload Successful",
        message: "Your avatar has been uploaded successfully",
        avatarUrl: "Avatar URL",
        uploadTime: "Upload Time",
        nextSteps: {
          item: "Next Step",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "The uploaded file is invalid or corrupted",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to upload an avatar",
        },
        server: {
          title: "Server Error",
          description: "Failed to process avatar upload",
        },
        internal: {
          title: "Internal Error",
          description: "An internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred during upload",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred during upload",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to upload an avatar",
        },
        notFound: {
          title: "Not Found",
          description: "The requested resource was not found",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred during the upload",
        },
      },
      success: {
        title: "Avatar Uploaded",
        description: "Your profile avatar has been uploaded successfully",
      },
    },
    delete: {
      title: "Delete Avatar",
      description: "Remove the current profile avatar",
      response: {
        title: "Delete Response",
        label: "Delete Result",
        description: "Avatar deletion response",
        success: "Deletion Successful",
        message: "Your avatar has been deleted successfully",
        nextSteps: {
          item: "Next Step",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "The avatar deletion request is invalid",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to delete your avatar",
        },
        server: {
          title: "Server Error",
          description: "Failed to delete avatar",
        },
        internal: {
          title: "Internal Error",
          description: "An internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred during deletion",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred during deletion",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to delete this avatar",
        },
        notFound: {
          title: "Not Found",
          description: "The avatar to delete was not found",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred during the deletion",
        },
      },
      success: {
        title: "Avatar Deleted",
        description: "Your profile avatar has been removed successfully",
      },
    },
  },
  password: {
    category: "User Profile",

    title: "Change Password",
    description: "Update your account password securely",
    tag: "password-change",
    debug: {
      updatingPassword: "Updating password",
      errorUpdatingPassword: "Error updating password",
      settingPassword: "Setting password",
      errorSettingPassword: "Error setting password",
    },
    groups: {
      currentCredentials: {
        title: "Current Password",
        description: "Verify your current password to proceed",
      },
      newCredentials: {
        title: "New Password",
        description: "Choose a strong new password for your account",
      },
    },
    currentPassword: {
      label: "Current Password",
      description: "Enter your current password",
      placeholder: "Enter current password",
      help: "Enter your current password to verify your identity before changing it",
    },
    newPassword: {
      label: "New Password",
      description: "Enter your new password (minimum 8 characters)",
      placeholder: "Enter new password",
      help: "Choose a strong password with at least 8 characters including letters, numbers, and symbols",
    },
    confirmPassword: {
      label: "Confirm Password",
      description: "Confirm your new password",
      placeholder: "Confirm new password",
      help: "Re-enter your new password to ensure it was typed correctly",
    },
    twoFactorCode: {
      label: "Two-Factor Code",
      description: "Enter your two-factor authentication code if enabled",
      placeholder: "Enter 2FA code",
    },
    response: {
      title: "Password Change Response",
      description: "Response for password change operation",
      success: "Password Changed",
      message: "Status Message",
      securityTip: "Security Tip",
      nextSteps: {
        item: "Next Steps",
      },
    },
    validation: {
      currentPassword: {
        minLength: "Current password must be at least 8 characters",
      },
      newPassword: {
        minLength: "New password must be at least 8 characters",
      },
      confirmPassword: {
        minLength: "Password confirmation must be at least 8 characters",
      },
      passwords: {
        mismatch: "Passwords do not match",
      },
    },
    errors: {
      passwords_do_not_match: "Passwords do not match",
      user_not_found: "User not found",
      incorrect_password: "Incorrect password",
      update_failed: "Failed to update password",
      token_creation_failed: "Failed to create password token",
      two_factor_code_required: "Two-factor authentication code required",
      invalid_two_factor_code: "Invalid two-factor authentication code",
      invalid_request: {
        title: "Invalid Request",
        description: "The password change request is invalid",
      },
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to change your password",
      },
      server: {
        title: "Server Error",
        description: "Failed to update password due to server error",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while updating password",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You don't have permission to perform this action",
      },
      notFound: {
        title: "User Not Found",
        description: "User account could not be found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that will be lost",
      },
      conflict: {
        title: "Data Conflict",
        description: "A conflict occurred while updating the password",
      },
    },
    success: {
      updated: "Password updated successfully",
      securityTip: "For enhanced security, enable two-factor authentication",
      nextSteps: {
        logoutOther: "All other sessions have been logged out for security",
        enable2fa:
          "Consider enabling two-factor authentication for better security",
      },
      title: "Password Updated",
      description: "Your password has been successfully updated",
    },
    update: {
      success: {
        title: "Password Updated",
        description: "Your password has been successfully updated",
      },
      errors: {
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred while updating password",
        },
      },
    },
  },
  addresses: {
    category: "User Addresses",
    tag: "addresses",

    list: {
      title: "My Addresses",
      description: "List your saved addresses",
      response: {
        addresses: "Addresses",
      },
      widget: {
        addAddress: "Add Address",
        edit: "Edit",
        delete: "Delete",
        billing: "Billing",
        delivery: "Delivery",
        empty: "No saved addresses",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Access forbidden" },
        notFound: { title: "Not Found", description: "No addresses found" },
        conflict: { title: "Conflict", description: "Data conflict" },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        internal: {
          title: "Server Error",
          description: "Internal server error",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
      },
      success: { title: "Success", description: "Addresses retrieved" },
    },

    create: {
      title: "Add Address",
      description: "Save a new address to your account",
      fields: {
        label: {
          label: "Label",
          description: "Name this address (e.g. Home, Office)",
          placeholder: "Home",
        },
        fullName: {
          label: "Full Name",
          description: "Contact name for this address",
          placeholder: "Jane Doe",
        },
        company: {
          label: "Company",
          description: "Company name (optional)",
          placeholder: "Acme Corp",
        },
        phone: {
          label: "Phone",
          description: "Contact phone number",
          placeholder: "+1 555 000 0000",
        },
        vatNumber: {
          label: "VAT Number",
          description: "EU VAT registration number",
          placeholder: "DE123456789",
        },
        taxId: {
          label: "Tax ID",
          description: "National tax identifier",
          placeholder: "123-45-6789",
        },
        addressLine1: {
          label: "Address Line 1",
          description: "Street and number",
          placeholder: "123 Main St",
        },
        addressLine2: {
          label: "Address Line 2",
          description: "Apartment, suite, unit (optional)",
          placeholder: "Suite 4B",
        },
        city: { label: "City", description: "City", placeholder: "Berlin" },
        region: {
          label: "State / Region",
          description: "State or region (optional)",
          placeholder: "Bayern",
        },
        postalCode: {
          label: "Postal Code",
          description: "ZIP or postal code",
          placeholder: "10115",
        },
        country: {
          label: "Country",
          description: "ISO 3166-1 alpha-2 country code",
          placeholder: "DE",
        },
        isDefaultBilling: {
          label: "Default Billing",
          description: "Use as default billing address",
        },
        isDefaultDelivery: {
          label: "Default Delivery",
          description: "Use as default delivery address",
        },
      },
      response: {
        id: "Address ID",
        label: "Label",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Access forbidden" },
        notFound: { title: "Not Found", description: "User not found" },
        conflict: { title: "Conflict", description: "Data conflict" },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        internal: {
          title: "Server Error",
          description: "Internal server error",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
      },
      success: {
        title: "Address Saved",
        description: "Address added to your account",
      },
      widget: {
        saved: "Address saved.",
        backToAddresses: "Back to Addresses",
      },
    },
  },
};
