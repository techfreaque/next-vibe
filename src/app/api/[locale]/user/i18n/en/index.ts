export const translations = {
  category: "Users",
  auth: {
    category: "Authentication",
    search: {
      tag: "Auth",
    },
    authClient: {
      errors: {
        status_save_failed: "Failed to save authentication status",
        status_remove_failed: "Failed to remove authentication status",
        status_check_failed: "Failed to check authentication status",
        token_save_failed: "Failed to save authentication token",
        token_get_failed: "Failed to retrieve authentication token",
        token_remove_failed: "Failed to remove authentication token",
      },
    },
    debug: {
      getAuthMinimalUserNext: {
        start: "getAuthMinimalUserNext: - Checking authentication first",
        result: "getAuthMinimalUserNext: getCurrentUserNext result",
        authenticated:
          "getAuthMinimalUserNext: User is authenticated, getting leadId",
        returningAuth: "getAuthMinimalUserNext: Returning authenticated user",
        notAuthenticated:
          "getAuthMinimalUserNext: User not authenticated, returning public user",
      },
      signingJwt: "Signing JWT",
      jwtSignedSuccessfully: "JWT signed successfully",
      errorSigningJwt: "Error signing JWT",
      verifyingJwt: "Verifying JWT",
      invalidTokenPayload: "Invalid token payload",
      jwtVerifiedSuccessfully: "JWT verified successfully",
      errorVerifyingJwt: "Error verifying JWT",
      userIdNotExistsInDb: "User ID does not exist in database",
      sessionNotFound: "Session not found",
      sessionExpired: "Session expired",
      errorValidatingUserSession: "Error validating user session",
      errorGettingUserRoles: "Error getting user roles",
      errorCheckingUserAuth: "Error checking user authentication",
      gettingCurrentUserFromTrpc: "Getting current user from tRPC",
      errorGettingAuthUserForTrpc: "Error getting auth user for tRPC",
      errorGettingUserRolesForTrpc: "Error getting user roles for tRPC",
      authenticatingCliUserWithPayload: "Authenticating CLI user with payload",
      errorAuthenticatingCliUserWithPayload:
        "Error authenticating CLI user with payload",
      creatingCliToken: "Creating CLI token",
      errorCreatingCliToken: "Error creating CLI token",
      validatingCliToken: "Validating CLI token",
      errorValidatingCliToken: "Error validating CLI token",
      gettingCurrentUserFromNextjs: "Getting current user from Next.js",
      errorGettingAuthUserForNextjs: "Error getting auth user for Next.js",
      settingNextjsAuthCookies: "Setting Next.js auth cookies",
      clearingNextjsAuthCookies: "Clearing Next.js auth cookies",
      gettingCurrentUserFromToken: "Getting current user from token",
      errorGettingCurrentUserFromCli: "Error getting current user from CLI",
      errorGettingAuthUserForCli: "Error getting auth user for CLI",
      errorGettingUserRolesForCli: "Error getting user roles for CLI",
      tokenFromAuthHeader: "Token from auth header",
      tokenFromCookie: "Token from cookie",
      noTokenFound: "No token found",
      errorExtractingToken: "Error extracting token",
      errorParsingCookies: "Error parsing cookies",
      errorGettingCurrentUserFromTrpc: "Error getting current user from tRPC",
    },
    errors: {
      token_generation_failed: "Failed to generate authentication token",
      invalid_session: "The session is invalid or expired",
      missing_request_context: "Request context is missing",
      missing_locale: "Locale is missing from request",
      unsupported_platform: "Platform is not supported",
      session_retrieval_failed: "Failed to retrieve session",
      missing_token: "Authentication token is missing",
      invalid_token_signature: "Token signature is invalid",
      jwt_payload_missing_id: "JWT payload is missing user ID",
      cookie_set_failed: "Failed to set authentication cookie",
      cookie_clear_failed: "Failed to clear authentication cookie",
      publicPayloadNotSupported:
        "Public JWT payload is not supported for CLI authentication",
      jwt_signing_failed: "Failed to sign JWT token",
      authentication_failed: "Authentication failed",
      user_not_authenticated: "User is not authenticated",
      publicUserNotAllowed: "Public user is not allowed for this endpoint",
      validation_failed: "Validation failed",
      failed_to_create_lead: "Failed to create lead",
      native: {
        unsupported:
          "This authentication method is not supported on React Native",
        storage_failed: "Failed to store authentication data",
        clear_failed: "Failed to clear authentication data",
      },
      not_implemented_native:
        "This feature is not yet implemented for React Native",
      unknownError: "An unknown error occurred during authentication",
    },
    post: {
      title: "Auth",
      description: "Auth endpoint",
      form: {
        title: "Auth Configuration",
        description: "Configure auth parameters",
      },
      response: {
        title: "Response",
        description: "Auth response data",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        missing_locale: {
          title: "Missing Locale",
          description: "Locale parameter is required",
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
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        token_generation_failed: {
          title: "Token Generation Failed",
          description: "Failed to generate authentication token",
        },
        invalid_session: {
          title: "Invalid Session",
          description: "The session is invalid or expired",
        },
        missing_request_context: {
          title: "Missing Request Context",
          description: "Request context is missing",
        },
        unsupported_platform: {
          title: "Unsupported Platform",
          description: "Platform is not supported",
        },
        session_retrieval_failed: {
          title: "Session Retrieval Failed",
          description: "Failed to retrieve session",
        },
        missing_token: {
          title: "Missing Token",
          description: "Authentication token is missing",
        },
        invalid_token_signature: {
          title: "Invalid Token Signature",
          description: "Token signature is invalid",
        },
        jwt_payload_missing_id: {
          title: "JWT Payload Missing ID",
          description: "JWT payload is missing user ID",
        },
        cookie_set_failed: {
          title: "Cookie Set Failed",
          description: "Failed to set authentication cookie",
        },
        cookie_clear_failed: {
          title: "Cookie Clear Failed",
          description: "Failed to clear authentication cookie",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
    check: {
      get: {
        title: "Check Authentication",
        description: "Check current authentication status",
        response: {
          title: "Authentication Status",
          description: "Current authentication state",
          authenticated: "Authenticated",
          tokenValid: "Token Valid",
        },
      },
    },
    enums: {
      webSocketErrorCode: {
        unauthorized: "Unauthorized",
        forbidden: "Forbidden",
        invalidToken: "Invalid Token",
        tokenExpired: "Token Expired",
        serverError: "Server Error",
      },
    },
  },
  private: {
    logout: {
      title: "User Logout",
      description: "Logs out the current user and invalidates their session",
      category: "User Management",
      tag: "logout",
      logoutButton: "Logout",
      loggingOut: "Logging out...",
      response: {
        title: "Logout Response",
        description: "Response indicating successful logout",
        success: "Success",
        message: "Message",
        sessionsCleaned: "Sessions Cleaned",
        nextSteps: "Recommended next steps after logout",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "The logout request contains invalid data",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to logout",
        },
        internal: {
          title: "Internal Server Error",
          description: "An internal error occurred while logging out",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred during logout",
        },
        session_deletion_failed: {
          title: "Session Deletion Failed",
          description: "Failed to delete the user session",
        },
        conflict: {
          title: "Logout Conflict",
          description: "A conflict occurred during logout",
        },
        forbidden: {
          title: "Forbidden",
          description: "Logout action is forbidden",
        },
        network_error: {
          title: "Network Error",
          description: "Network error during logout",
        },
        not_found: {
          title: "Not Found",
          description: "Session not found",
        },
        server_error: {
          title: "Server Error",
          description: "Internal server error during logout",
        },
        unsaved_changes: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        invalid_user: {
          title: "Invalid User",
          description: "The user is not valid or does not exist",
        },
      },
      success: {
        title: "Logout Successful",
        description: "You have been logged out successfully",
        message: "User logged out successfully",
      },
    },
    me: {
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
            description:
              "Your custom profile slug - appears in your public link",
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
            "Visitors on your skill page and creator profile can subscribe. You own the list - no platform in the middle.",
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
          securityTip:
            "For enhanced security, enable two-factor authentication",
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
              description:
                "An unexpected error occurred while updating password",
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
    },
    session: {
      enums: {
        sessionErrorReason: {
          noTokenInCookies: "No token in cookies",
        },
      },
      errors: {
        session_not_found: "Session not found",
        session_lookup_failed: "Failed to lookup session",
        expired_sessions_delete_failed: "Failed to delete expired sessions",
        session_creation_failed: "Failed to create session",
        session_creation_database_error:
          "Database error while creating session",
        user_sessions_delete_failed: "Failed to delete user sessions",
        expired: "Session has expired",
      },
      post: {
        title: "Session",
        description: "Session endpoint",
        form: {
          title: "Session Configuration",
          description: "Configure session parameters",
        },
        response: {
          title: "Response",
          description: "Session response data",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
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
            description: "Network error occurred",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access forbidden",
          },
          notFound: {
            title: "Not Found",
            description: "Resource not found",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
    },
    sessions: {
      category: "Users",

      list: {
        title: "My Sessions",
        description: "List all active sessions for your account",
        tag: "Sessions",
        response: {
          sessions: "Sessions",
        },
        success: {
          title: "Sessions retrieved",
          description: "Your active sessions have been retrieved",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request",
          },
          server: {
            title: "Server Error",
            description: "Internal server error",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          forbidden: { title: "Forbidden", description: "Access forbidden" },
          notFound: { title: "Not Found", description: "Resource not found" },
          conflict: { title: "Conflict", description: "Data conflict" },
        },
      },
      create: {
        title: "Create Session Token",
        description: "Create a named session token for programmatic access",
        tag: "Sessions",
        form: {
          name: "Token Name",
          namePlaceholder: "e.g. My agent bot",
        },
        response: {
          token: "Token",
          id: "Session ID",
          name: "Name",
          message: "Copy this token - it will not be shown again",
        },
        success: {
          title: "Session created",
          description: "Your session token has been created",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request",
          },
          server: {
            title: "Server Error",
            description: "Internal server error",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          forbidden: { title: "Forbidden", description: "Access forbidden" },
          notFound: { title: "Not Found", description: "Resource not found" },
          conflict: { title: "Conflict", description: "Data conflict" },
        },
      },
      revoke: {
        title: "Revoke Session",
        description: "Revoke a session token by ID",
        tag: "Sessions",
        response: {
          message: "Session revoked",
        },
        success: {
          title: "Session revoked",
          description: "The session has been revoked",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request",
          },
          server: {
            title: "Server Error",
            description: "Internal server error",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          forbidden: { title: "Forbidden", description: "Access forbidden" },
          notFound: { title: "Not Found", description: "Session not found" },
          conflict: { title: "Conflict", description: "Data conflict" },
        },
      },
    },
  },
  public: {
    login: {
      category: "Users",
      title: "Welcome Back",
      description: "Access uncensored AI models and your conversation history.",
      tag: "Authentication",
      options: {
        category: "Users",

        title: "Login Options",
        description: "Login configuration options",
        tag: "login-options",
        container: {
          title: "Login Configuration",
          description: "Configure login settings and options",
        },
        fields: {
          email: {
            label: "Email Address",
            description: "Enter your email address",
            placeholder: "your@email.com",
          },
          allowPasswordAuth: {
            label: "Allow Password Authentication",
            description: "Enable password-based authentication",
          },
          allowSocialAuth: {
            label: "Allow Social Authentication",
            description: "Enable social provider authentication",
          },
          maxAttempts: {
            label: "Maximum Login Attempts",
            description: "Maximum number of login attempts allowed",
          },
          requireTwoFactor: {
            label: "Require Two-Factor Authentication",
            description: "Require 2FA for user login",
          },
          socialProviders: {
            label: "Social Providers",
            description: "Available social authentication providers",
          },
          socialProvider: {
            title: "Social Provider",
            description: "Social authentication provider configuration",
            enabled: {
              label: "Enabled",
              description: "Whether this provider is enabled",
            },
            name: {
              label: "Provider Name",
              description: "Name of the social provider",
            },
            providers: {
              label: "Provider Options",
              description: "Available social provider options",
            },
          },
        },
        response: {
          title: "Login Options Response",
          description: "Available login configuration options",
          success: {
            badge: "Success",
          },
          message: {
            content: "Status Message",
          },
          forUser: {
            content: "Email Address",
          },
          loginMethods: {
            title: "Login Methods",
            description: "Available authentication methods",
            password: {
              title: "Password Login",
              description: "Standard password authentication",
              enabled: {
                badge: "Enabled",
              },
            },
            social: {
              title: "Social Login",
              description: "Social media authentication options",
              enabled: {
                badge: "Enabled",
              },
              providers: {
                item: {
                  title: "Social Provider",
                  description: "Social authentication provider",
                },
                name: {
                  content: "Provider Name",
                },
                id: {
                  content: "Provider ID",
                },
                enabled: {
                  badge: "Available",
                },
                description: "Provider Description",
              },
            },
          },
          security: {
            title: "Security Settings",
            description: "Authentication security requirements",
            maxAttempts: {
              content: "Maximum Login Attempts",
            },
            requireTwoFactor: {
              badge: "2FA Required",
            },
          },
          recommendations: {
            item: "Recommended Login Option",
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
            description: "Network error occurred",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access forbidden",
          },
          notFound: {
            title: "Not Found",
            description: "Resource not found",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "Changes were not saved",
          },
        },
        success: {
          title: "Success",
          description: "Login options retrieved successfully",
        },
        post: {
          title: "Login Options",
          description: "Get available login options",
          response: {
            title: "Login Options Response",
            description: "Available login configuration options",
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
            server: {
              title: "Server Error",
              description: "Internal server error occurred",
            },
            unknown: {
              title: "Unknown Error",
              description: "An unknown error occurred",
            },
          },
          success: {
            description: "Login options retrieved successfully",
          },
        },
        enums: {
          socialProviders: {
            google: "Google",
            github: "GitHub",
            facebook: "Facebook",
          },
        },
        messages: {
          successMessage: "Login options retrieved successfully",
          passwordAuthDescription: "Log in with your email and password",
          socialAuthDescription: "Log in with your social media accounts",
          continueWithProvider: "Continue with {{provider}}",
          twoFactorRequired: "Enhanced security: 2FA required",
          standardSecurity: "Standard security requirements",
          tryPasswordFirst: "Try password login first",
          useSocialLogin: "Use social login",
          socialLoginFaster: "Social login is faster for new users",
        },
      },
      actions: {
        submit: "Login",
        submitting: "Logging in...",
      },
      fields: {
        email: {
          label: "Your Email",
          description: "The email you signed up with.",
          placeholder: "Enter your email",
          validation: {
            required: "Email is required",
            invalid: "Please enter a valid email address",
          },
        },
        password: {
          label: "Your Password",
          description: "Enter the password you set during signup.",
          placeholder: "Enter your password",
          help: "Enter your account password",
          validation: {
            required: "Password is required",
            minLength: "Password must be at least 8 characters long",
          },
        },
        rememberMe: {
          label: "Keep me logged in",
        },
      },
      groups: {
        credentials: {
          title: "Login Credentials",
          description: "Enter your login information",
        },
        options: {
          title: "Login Options",
          description: "Additional login preferences and settings",
        },
        preferences: {
          title: "Login Preferences",
          description: "Additional login options",
        },
        advanced: {
          title: "Advanced Options",
          description: "Advanced login settings",
        },
      },
      footer: {
        forgotPassword: "Forgot password?",
        createAccount: "Don't have an account? Sign up",
      },
      response: {
        title: "Login Response",
        description: "Login response data",
        success: "Login Successful",
        message: "Status Message",
        user: {
          title: "User Details",
          description: "Logged in user information",
          id: "User ID",
          email: "Email Address",
          firstName: "First Name",
          lastName: "Last Name",
          privateName: "Private Name",
          publicName: "Public Name",
          imageUrl: "Profile Image",
        },
        sessionInfo: {
          title: "Session Information",
          description: "User session details",
          expiresAt: "Session Expires",
          rememberMeActive: "Remember Me Status",
          loginLocation: "Login Location",
        },
        nextSteps: {
          title: "Next Steps",
          item: "Next Steps",
        },
      },
      errors: {
        title: "Login Error",
        account_locked: "Account is locked",
        accountLocked: "Account is locked",
        accountLockedDescription:
          "Your account has been locked. Please contact support.",
        invalid_credentials: "Invalid email or password",
        two_factor_required: "Two-factor authentication required",
        auth_error: "Authentication error occurred",
        user_not_found: "User not found",
        session_creation_failed: "Failed to create session",
        token_save_failed: "Failed to save authentication token",
        validation: {
          title: "Validation Failed",
          description: "Please check your input",
        },
        unauthorized: {
          title: "Login Failed",
          description: "Invalid credentials",
        },
        unknown: {
          title: "Login Error",
          description: "An error occurred during login",
        },
        network: {
          title: "Network Error",
          description: "Connection failed",
        },
        forbidden: {
          title: "Access Denied",
          description: "Login not allowed",
        },
        notFound: {
          title: "User Not Found",
          description: "User account not found",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "Changes were not saved",
        },
        conflict: {
          title: "Login Conflict",
          description: "Login conflict detected",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
      },
      success: {
        title: "Login Successful",
        description: "You have been logged in",
        message: "Welcome back! You have successfully logged in.",
      },
      token: {
        save: {
          failed: "Failed to save authentication token",
          success: "Authentication token saved successfully",
        },
      },
      process: {
        failed: "Login process failed",
      },
      enums: {
        socialProviders: {
          google: "Google",
          github: "GitHub",
          facebook: "Facebook",
        },
      },
      dev: {
        quickLogin: "Dev Quick Login",
      },
    },
    resetPassword: {
      confirm: {
        category: "Users",

        title: "Confirm Password Reset",
        description: "Confirm your password reset with a new password",
        tag: "Password Reset",
        email: {
          title: "Password Reset Successful",
          subject: "Password Successfully Reset - {{appName}}",
          previewText:
            "Your {{appName}} password has been reset. Log in and start chatting with {{modelCount}} AI models.",
          greeting: "Hey {{name}},",
          successMessage:
            "Your password has been reset. You're all set - log in and pick up where you left off.",
          loginButton: "Log In to {{appName}}",
          promoText: "{{modelCount}} AI models. No filters. No lectures.",
          securityWarning:
            "Didn't reset your password? Contact support immediately - your account may be at risk.",
        },
        groups: {
          verification: {
            title: "Verification",
            description: "Verify your password reset request",
          },
          newPassword: {
            title: "New Password",
            description: "Set your new password",
          },
        },
        fields: {
          token: {
            label: "Reset Token",
            description: "The password reset token from your email",
            placeholder: "Enter reset token",
            help: "Check your email for the password reset token and enter it here",
            validation: {
              required: "Reset token is required",
            },
          },
          email: {
            label: "Email Address",
            description: "Your email address",
            placeholder: "Enter your email address",
            validation: {
              invalid: "Please enter a valid email address",
            },
          },
          password: {
            label: "New Password",
            description: "Your new password",
            placeholder: "Enter new password",
            help: "Choose a strong password with at least 8 characters including letters, numbers, and symbols",
            validation: {
              minLength: "Password must be at least 8 characters long",
            },
          },
          confirmPassword: {
            label: "Confirm Password",
            description: "Confirm your new password",
            placeholder: "Confirm new password",
            validation: {
              minLength: "Password must be at least 8 characters long",
            },
          },
        },
        validation: {
          passwords: {
            mismatch: "Passwords do not match",
          },
        },
        response: {
          title: "Password Reset Response",
          description: "Password reset confirmation response",
          message: {
            label: "Message",
            description: "Response message",
          },
          securityTip:
            "Consider enabling two-factor authentication for better security",
          nextSteps: [
            "Log in with your new password",
            "Update saved passwords in your browser",
            "Consider enabling 2FA for added security",
          ],
        },
        errors: {
          title: "Password Reset Error",
          no_email: "No account found with that email address",
          validation: {
            title: "Validation Error",
            description: "Please check your input and try again",
            passwordsDoNotMatch: "Passwords do not match",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Invalid or expired reset token",
          },
          internal: {
            title: "Server Error",
            description: "An internal server error occurred",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          network: {
            title: "Network Error",
            description: "Network connection error",
          },
          forbidden: {
            title: "Access Denied",
            description: "You do not have permission to perform this action",
          },
          notFound: {
            title: "Not Found",
            description: "Reset token not found or expired",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "There are unsaved changes",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred while processing your request",
          },
        },
        success: {
          title: "Password Reset Successful",
          description: "Your password has been successfully reset",
          message: "Password has been reset successfully",
          password_reset: "Your password has been successfully reset",
        },
        actions: {
          requestNewLink: "Request a New Reset Link",
        },
        emailTemplates: {
          confirm: {
            name: "Password Reset Confirmation Email",
            description:
              "Email sent to users after their password has been successfully reset",
            category: "Authentication",
            preview: {
              publicName: {
                label: "Public Name",
                description: "The user's public display name",
              },
              userId: {
                label: "User ID",
                description: "The user's unique identifier",
              },
            },
          },
        },
      },
      request: {
        category: "Users",
        title: "Reset Password Request",
        description: "Request password reset",
        tag: "Password Reset",
        ui: {
          title: "Reset Your Password",
          subtitle:
            "Enter your email address and we'll send you a link to reset your password",
          sendResetLink: "Send Reset Link",
          alreadyHaveAccount: "Already have an account? Sign in",
        },
        actions: {
          submitting: "Sending...",
        },
        email: {
          title: "Reset Your {{appName}} Password",
          subject: "Password Reset Request - {{appName}}",
          previewText:
            "Reset your {{appName}} password - link valid for {{hours}} hours.",
          greeting: "Hey {{name}},",
          requestInfo:
            "Someone requested a password reset for your {{appName}} account. If that was you, click the button below.",
          buttonText: "Reset My Password",
          expirationInfo:
            "Link expires in {{hours}} hours. If you didn't request this, ignore this email - your password is unchanged.",
          signoff: "The {{appName}} Team",
          promoText: "{{modelCount}} AI models. No filters. No lectures.",
        },
        groups: {
          emailInput: {
            title: "Email Input",
            description:
              "Enter your email address to receive reset instructions",
          },
        },
        fields: {
          email: {
            label: "Email Address",
            description: "Enter your email address",
            placeholder: "your@email.com",
            help: "Enter the email address associated with your account",
            validation: {
              invalid: "Please enter a valid email address",
            },
          },
        },
        response: {
          title: "Reset Request Response",
          description: "Password reset request response",
          success: {
            message: "Password reset link sent successfully",
          },
          deliveryInfo: {
            estimatedTime: "within 5 minutes",
            expiresAt: "4 hours from now",
          },
          nextSteps: {
            checkEmail: "Check your email inbox and spam folder",
            clickLink: "Click the reset link in the email",
            createPassword: "Create a new secure password",
          },
        },
        errors: {
          title: "Error",
          validation: {
            title: "Validation Error",
            description: "Invalid input provided",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Request not authorized",
          },
          internal: {
            title: "Internal Error",
            description: "Internal server error",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          network: {
            title: "Network Error",
            description: "Network connection error",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access forbidden",
          },
          notFound: {
            title: "Not Found",
            description: "Resource not found",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Changes were not saved",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
          no_email: "No account found with that email address",
          email_generation_failed: "Failed to generate email",
        },
        success: {
          title: "Request Sent",
          description: "Password reset request sent successfully",
        },
        post: {
          title: "Request",
          description: "Request endpoint",
          form: {
            title: "Request Configuration",
            description: "Configure request parameters",
          },
          response: {
            title: "Response",
            description: "Request response data",
          },
          errors: {
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required",
            },
            validation: {
              title: "Validation Error",
              description: "Invalid request parameters",
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
              description: "Network error occurred",
            },
            forbidden: {
              title: "Forbidden",
              description: "Access forbidden",
            },
            notFound: {
              title: "Not Found",
              description: "Resource not found",
            },
            conflict: {
              title: "Conflict",
              description: "Data conflict occurred",
            },
          },
          success: {
            title: "Success",
            description: "Operation completed successfully",
          },
        },
        emailTemplates: {
          request: {
            name: "Password Reset Request Email",
            description:
              "Email sent to users with a link to reset their password",
            category: "Authentication",
            preview: {
              publicName: {
                label: "Public Name",
                description: "The user's public display name",
              },
              userId: {
                label: "User ID",
                description: "The user's unique identifier",
              },
              passwordResetUrl: {
                label: "Password Reset URL",
                description: "The URL for resetting the password",
              },
            },
          },
        },
      },
      validate: {
        category: "Users",

        title: "Validate Reset Password Token",
        description: "Validate password reset token endpoint",
        tag: "Password Reset Validation",
        groups: {
          tokenInput: {
            title: "Token Validation",
            description: "Enter the password reset token to validate",
          },
        },
        fields: {
          token: {
            label: "Reset Token",
            description: "Password reset token from email",
            placeholder: "Enter reset token",
            help: "Enter the token you received in your email",
            validation: {
              required: "Reset token is required",
            },
          },
        },
        response: {
          title: "Validation Result",
          description: "Token validation response",
          valid: "Token Valid",
          message: "Validation Message",
          validationMessage: "Reset token validation completed",
          userId: "User ID",
          expiresAt: "Token Expires At",
          nextSteps: {
            item: "Next Steps After Validation",
            steps: [
              "Proceed to set your new password",
              "Choose a strong, unique password",
            ],
          },
        },
        errors: {
          title: "Error",
          validation: {
            title: "Validation Error",
            description: "Token validation failed",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Invalid or expired token",
          },
          internal: {
            title: "Internal Error",
            description: "Internal server error occurred",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access forbidden",
          },
          notFound: {
            title: "Not Found",
            description: "Token not found",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "Unsaved changes detected",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
        },
        success: {
          title: "Token Valid",
          description: "Password reset token is valid",
        },
        post: {
          title: "Validate",
          description: "Validate endpoint",
          form: {
            title: "Validate Configuration",
            description: "Configure validate parameters",
          },
          response: {
            title: "Response",
            description: "Validate response data",
          },
          errors: {
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required",
            },
            validation: {
              title: "Validation Error",
              description: "Invalid request parameters",
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
              description: "Network error occurred",
            },
            forbidden: {
              title: "Forbidden",
              description: "Access forbidden",
            },
            notFound: {
              title: "Not Found",
              description: "Resource not found",
            },
            conflict: {
              title: "Conflict",
              description: "Data conflict occurred",
            },
          },
          success: {
            title: "Success",
            description: "Operation completed successfully",
          },
        },
      },
      actions: {
        back: "Back",
        submit: "Submit",
        submitting: "Submitting...",
      },
      success: {
        password_reset: "Your password has been successfully reset.",
      },
      errors: {
        tokenValidationFailed: "Token validation failed",
        userLookupFailed: "Failed to lookup user",
        tokenDeletionFailed: "Failed to delete token",
        userDeletionFailed: "Failed to delete user",
        resetFailed: "Password reset failed",
        tokenCreationFailed: "Failed to create reset token",
        noDataReturned: "No data returned from database",
        tokenInvalid: "Reset token is invalid",
        tokenExpired: "Reset token has expired",
        tokenVerificationFailed: "Token verification failed",
        userNotFound: "User not found",
        passwordUpdateFailed: "Failed to update password",
        passwordResetFailed: "Password reset failed",
        requestFailed: "Reset request failed",
        emailMismatch: "Email does not match",
        confirmationFailed: "Password reset confirmation failed",
      },
    },
    signup: {
      category: "Users",

      _components: {
        passwordStrength: {
          label: "Password Strength",
          weak: "Weak",
          fair: "Fair",
          good: "Good",
          strong: "Strong",
          requirement: {
            minLength: {
              icon: "✗",
              text: "At least 8 characters",
            },
            uppercase: {
              icon: "✗",
              text: "At least one uppercase letter",
            },
            lowercase: {
              icon: "✗",
              text: "At least one lowercase letter",
            },
            number: {
              icon: "✗",
              text: "At least one number",
            },
            special: {
              icon: "!",
              text: "Special character (optional, improves strength)",
            },
          },
        },
        post: {
          title: "_components",
          description: "_components endpoint",
          form: {
            title: "_components Configuration",
            description: "Configure _components parameters",
          },
          response: {
            title: "Response",
            description: "_components response data",
          },
          errors: {
            unauthorized: {
              title: "Unauthorized",
              description: "Authentication required",
            },
            validation: {
              title: "Validation Error",
              description: "Invalid request parameters",
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
              description: "Network error occurred",
            },
            forbidden: {
              title: "Forbidden",
              description: "Access forbidden",
            },
            notFound: {
              title: "Not Found",
              description: "Resource not found",
            },
            conflict: {
              title: "Conflict",
              description: "Data conflict occurred",
            },
          },
          success: {
            title: "Success",
            description: "Operation completed successfully",
          },
        },
      },
      title: "User Signup",
      description: "User registration endpoint",
      tag: "Authentication",
      form: {
        title: "Welcome to Uncensored AI",
        description:
          "Help build uncensored, privacy-first, and truly independent AI. unbottled.ai is open source and community-driven, your signup supports the development of AI technology that respects your freedom.",
      },
      actions: {
        submit: "Create Account",
        submitting: "Creating Account...",
      },
      fields: {
        privateName: {
          label: "Your Private Name",
          description:
            "How the AI will address you in private conversations. This stays between you and the AI - completely private.",
          placeholder: "Enter your name",
          validation: {
            required: "Private name is required",
            minLength: "Name must be at least 2 characters",
            maxLength: "Name must be less than 100 characters",
          },
        },
        publicName: {
          label: "Your Public Name",
          description:
            "Your identity in public chats and forums. Other users and AIs will see this name. Choose wisely - it represents you in the community.",
          placeholder: "Enter display name",
          validation: {
            required: "Display name is required",
            minLength: "Display name must be at least 2 characters",
            maxLength: "Display name must be less than 100 characters",
          },
        },
        email: {
          label: "Your Email",
          description:
            "Your login credentials and contact method. Kept private - never shared with other users or AIs.",
          placeholder: "Enter email address",
          help: "This will be your login email and primary contact method",
          validation: {
            required: "Email is required",
            invalid: "Please enter a valid email address",
          },
        },
        password: {
          label: "Your Password",
          description:
            "Strong passwords protect your account. We're implementing end-to-end encryption soon - at that point, password resets will clear your message history since only you hold the decryption key. Save it somewhere safe.",
          placeholder: "Enter password",
          validation: {
            required: "Password is required",
            minLength: "Password must be at least 8 characters",
            complexity:
              "Password must contain uppercase, lowercase, and a number",
          },
        },
        confirmPassword: {
          label: "Confirm Your Password",
          validation: {
            required: "Please confirm your password",
            minLength: "Password must be at least 8 characters",
            mismatch: "Passwords do not match",
          },
        },
        subscribeToNewsletter: {
          label: "Subscribe to Newsletter",
          description:
            "Occasional updates about new models and features. No spam, just what matters.",
        },
        acceptTerms: {
          label: "Accept Terms & Conditions",
          description:
            "Our terms and conditions respect your freedom and privacy.",
          termsLink: "terms",
          conditionsLink: "conditions",
          descriptionPrefix: "Our",
          descriptionAnd: "and",
          descriptionSuffix: "respect your freedom and privacy.",
          validation: {
            required: "You must accept the terms and conditions to continue",
          },
        },
        referralCode: {
          label: "Referral Code (optional)",
          description:
            "Have a friend on unbottled.ai? Enter their code to support them. They get rewarded for bringing you in.",
          placeholder: "Enter referral code (optional)",
          labelPrefilled: "Referral code",
          descriptionPrefilled:
            "Your friend gets rewarded when you create your account.",
        },
        supportedSkillId: {
          label: "Support a Creator",
          description:
            "Your signup supports the creator of this skill with a +5% bonus on your subscriptions.",
          selectorTitle: "Support a Creator",
          selectorDescription:
            "You added skills by independent creators to your favorites. Pick one to support - they get +5% from your subscriptions. You can change this anytime.",
          selectorNone: "None (skip)",
        },
        localFavorites: {
          label: "Local Favorites",
        },
      },

      footer: {
        alreadyHaveAccount: "Already have an account? Sign in",
      },
      errors: {
        title: "Signup Error",
        validation: {
          title: "Validation Error",
          description: "Please check your input and try again",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        conflict: {
          title: "Account Conflict",
          description: "An account with this email already exists",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        internal: {
          title: "Internal Error",
          description: "An internal error occurred",
        },
      },
      emailCheck: {
        title: "Email Availability Check",
        description: "Check if email is available for registration",
        tag: "Email Check",
        fields: {
          email: {
            label: "Email Address",
            description: "Email to check",
            placeholder: "Enter email address",
            validation: {
              invalid: "Invalid email format",
            },
          },
        },
        response: {
          title: "Email Check Response",
          description: "Email availability check result",
          available: "Email Available",
          message: "Availability Message",
        },
        errors: {
          validation: {
            title: "Invalid Email",
            description: "Please enter a valid email address",
          },
          internal: {
            title: "Email Check Error",
            description: "Error checking email availability",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
          conflict: {
            title: "Email Already Taken",
            description: "This email is already registered",
          },
          forbidden: {
            title: "Access Denied",
            description: "You don't have permission to check this email",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred while checking email",
          },
          notFound: {
            title: "Service Not Found",
            description: "Email check service is not available",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required to check email",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
        },
        success: {
          title: "Email Check Complete",
          description: "Email availability checked successfully",
        },
      },
      post: {
        title: "Signup",
        description: "Signup endpoint",
        form: {
          title: "Signup Configuration",
          description: "Configure signup parameters",
        },
        response: {
          title: "Response",
          description: "Signup response data",
          success: "Signup Successful",
          message: "Status Message",
          userId: "User ID",
          nextSteps: "Next Steps",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
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
            description: "Network error occurred",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access forbidden",
          },
          notFound: {
            title: "Not Found",
            description: "Resource not found",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
          unsaved: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
          processing: "Processing signup successfully",
        },
      },
      response: {
        title: "Response",
        description: "Signup response data",
        success: "Signup Successful",
        message: "Status Message",
        user: {
          id: "User ID",
          email: "Email Address",
          firstName: "First Name",
          lastName: "Last Name",
          privateName: "Private Name",
          publicName: "Public Name",
          imageUrl: "Profile Image URL",
          verificationRequired: "Verification Required",
        },
        verificationInfo: {
          title: "Email Verification",
          description: "Details about the email verification process",
          emailSent: "Email Sent",
          expiresAt: "Verification Expires At",
          checkSpamFolder: "Check Spam Folder",
        },
        nextSteps: "Next Steps",
      },
      success: {
        title: "Signup Successful",
        description: "Your account has been created successfully",
      },
      admin_notification: {
        title: "New User Signup",
        subject: "New User Signup - {{privateName}}",
        preview: "New user {{privateName}} has signed up",
        message: "A new user has signed up for {{appName}}",
        privateName: "Private Name",
        publicName: "Public Name",
        email: "Email",
        locale: "Language",
        creditBalance: "Credit Balance",
        leadCreditBalance: "Lead Credit Balance",
        signup_preferences: "Signup Preferences",
        user_details: "User Details",
        basic_information: "Basic Information",
        signup_type: "Signup Type",
        direct_signup: "Direct Signup",
        newsletter: "Newsletter",
        subscribed: "Subscribed",
        not_subscribed: "Not Subscribed",
        signup_details: "Signup Details",
        signup_date: "Signup Date",
        user_id: "User ID",
        recommended_next_steps: "Recommended Next Steps",
        direct_recommendation: "Review user profile and payment setup",
        contact_user: "Contact User",
        footer: "This is an automated notification from {{appName}}",
      },
      email: {
        subject: "You're in - {{appName}} is ready for you",
        previewText:
          "Hey {{privateName}}, your account is ready. Chat with Claude, GPT, Gemini, DeepSeek, and {{modelCount}} more - free, no card needed.",
        headline: "Your AI is waiting.",
        greeting: "Hey {{privateName}},",
        intro:
          "Welcome to {{appName}}. You just unlocked access to the most complete AI chat platform out there - everything you love about ChatGPT, plus open-source models, and models without content filters.",
        models: {
          title: "{{modelCount}} models across 3 categories",
          mainstream: "Mainstream",
          open: "Open Source",
          uncensored: "Uncensored",
        },
        free: {
          title: "What you get for free, forever:",
          credits: "{{freeCredits}} credits per month - no card, no expiry",
          allModels: "Access to all {{modelCount}} AI models",
          uncensored: "4 uncensored models that actually answer your questions",
          chatModes: "Private, Incognito, Shared, and Public chat modes",
          noCard: "No credit card required - ever",
        },
        ctaButton: "Start Chatting Now",
        upgrade: {
          title: "Want more?",
          desc: "{{subscriptionPrice}}/month gets you {{subscriptionCredits}} credits - that's 40× more. Plus you can buy extra credit packs that never expire. Perfect if you use AI daily.",
          cta: "Upgrade to Pro",
        },
        signoff: "Happy chatting,\nThe {{appName}} Team",
        ps: "P.S. Use Incognito mode to keep conversations on your device only - we never store them on our servers.",
      },
      emailTemplates: {
        welcome: {
          name: "Signup Welcome Email",
          description:
            "Welcome email sent to users after successful registration",
          category: "Authentication",
          preview: {
            privateName: {
              label: "Private Name",
              description: "The user's private name",
            },
            userId: {
              label: "User ID",
              description: "The user's unique identifier",
            },
            leadId: {
              label: "Lead ID",
              description: "The user's lead identifier",
            },
          },
        },
        adminSignup: {
          name: "Admin Signup Notification Email",
          description: "Email sent to admins when a new user registers",
          category: "Administration",
          preview: {
            privateName: {
              label: "Private Name",
            },
            publicName: {
              label: "Public Name",
            },
            email: {
              label: "Email Address",
            },
            userId: {
              label: "User ID",
            },
            subscribeToNewsletter: {
              label: "Newsletter Subscription",
            },
          },
        },
      },
    },
  },
  search: {
    category: "Users",

    title: "User Search",
    description: "Search for users",
    tag: "User Search",
    container: {
      title: "Search Container",
      description: "User search container",
    },
    groups: {
      searchCriteria: {
        title: "Search Criteria",
        description: "Define your search parameters",
      },
      filters: {
        title: "Advanced Filters",
        description: "Additional filtering options",
      },
      pagination: {
        title: "Pagination",
        description: "Control how results are paginated",
      },
    },
    fields: {
      search: {
        label: "Search Query",
        description: "Enter search terms",
        placeholder: "Search users...",
        help: "Search by name, email, or company",
        validation: {
          minLength: "Search query must be at least 2 characters",
        },
      },
      roles: {
        label: "User Roles",
        description: "Filter by user roles",
        placeholder: "Select roles...",
        help: "Select one or more roles to filter by",
      },
      status: {
        label: "User Status",
        description: "Filter by user status",
        placeholder: "Select status...",
        help: "Filter by active, inactive, or all users",
      },
      limit: {
        label: "Limit",
        description: "Maximum number of results",
        help: "Specify how many results to return (default: 10)",
      },
      offset: {
        label: "Offset",
        description: "Number of results to skip",
        help: "Specify pagination offset (default: 0)",
      },
    },
    status: {
      active: "Active",
      inactive: "Inactive",
      all: "All",
    },
    response: {
      title: "Search Results",
      description: "User search results",
      success: {
        badge: "Success",
      },
      message: {
        content: "Search result message",
      },
      searchInfo: {
        title: "Search Information",
        description: "Details about the search operation",
        searchTerm: "Search Term",
        appliedFilters: "Applied Filters",
        searchTime: "Search Time",
        totalResults: "Total Results",
      },
      pagination: {
        title: "Pagination Info",
        description: "Page navigation information",
        currentPage: "Current Page",
        totalPages: "Total Pages",
        itemsPerPage: "Items Per Page",
        totalItems: "Total Items",
        hasMore: "Has More",
        hasPrevious: "Has Previous",
      },
      actions: {
        title: "Available Actions",
        description: "Actions you can perform on the results",
        type: "Action Type",
        label: "Action",
        href: "Link",
      },
      users: {
        label: "Users Found",
        description: "List of matching users",
        item: {
          title: "User",
          description: "User account information",
        },
        id: "User ID",
        leadId: "Lead ID",
        isPublic: "Public",
        firstName: "First Name",
        lastName: "Last Name",
        privateName: "Private Name",
        publicName: "Public Name",
        company: "Company",
        email: "Email",
        imageUrl: "Avatar",
        isActive: "Active",
        emailVerified: "Email Verified",
        requireTwoFactor: "2FA Required",
        marketingConsent: "Marketing Consent",
        userRoles: {
          item: {
            title: "Role",
            description: "User role assignment",
          },
          id: "Role ID",
          role: "Role",
        },
        createdAt: "Created",
        updatedAt: "Updated",
      },
    },
    columns: {
      firstName: "First Name",
      lastName: "Last Name",
      privateName: "Private Name",
      publicName: "Public Name",
      email: "Email",
      company: "Company",
      userRoles: "Roles",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid search parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Search not authorized",
      },
      internal: {
        title: "Internal Error",
        description: "Internal server error",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network connection error",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "No users found",
      },
      conflict: {
        title: "Conflict",
        description: "Search conflict occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Changes were not saved",
      },
    },
    success: {
      title: "Search Successful",
      description: "Search completed successfully",
    },
    post: {
      title: "Search",
      description: "Search endpoint",
      form: {
        title: "Search Configuration",
        description: "Configure search parameters",
      },
      response: {
        title: "Response",
        description: "Search response data",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
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
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
  },
  "session-cleanup": {
    category: "Users",

    post: {
      title: "Session Cleanup",
      description: "Clean up expired user sessions and tokens",
      tag: "Session Cleanup",
      container: {
        title: "Session Cleanup",
        description: "Configure and run session cleanup",
      },
      fields: {
        sessionRetentionDays: {
          label: "Session Retention Days",
          description: "Number of days to retain sessions",
        },
        tokenRetentionDays: {
          label: "Token Retention Days",
          description: "Number of days to retain tokens",
        },
        batchSize: {
          label: "Batch Size",
          description: "Number of records to process per batch",
        },
        dryRun: {
          label: "Dry Run",
          description: "Run without actually deleting records",
        },
      },
      response: {
        sessionsDeleted: "Sessions Deleted",
        tokensDeleted: "Tokens Deleted",
        totalProcessed: "Total Processed",
        executionTimeMs: "Execution Time (ms)",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "You must be an admin to run session cleanup",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        server: {
          title: "Server Error",
          description: "Internal server error during cleanup",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid cleanup configuration",
        },
      },
      success: {
        title: "Session Cleanup Completed",
        description: "Sessions and tokens cleaned up successfully",
      },
    },
    task: {
      name: "user-session-cleanup",
      description: "Clean up expired user sessions to maintain system security",
      purpose: "Removes expired sessions to maintain security and performance",
      impact:
        "Improves system performance and security by removing stale session data",
      rollback: "Rollback not applicable for cleanup operations",
    },
    errors: {
      default: "An error occurred during session cleanup",
      execution_failed: {
        title: "Session Cleanup Failed",
        description: "Failed to clean up expired sessions",
      },
      partial_failure: {
        title: "Partial Session Cleanup Failure",
        description: "Some sessions could not be cleaned up",
      },
      unknown_error: {
        title: "Unknown Session Cleanup Error",
        description: "An unknown error occurred during session cleanup",
      },
      invalid_session_retention: {
        title: "Invalid Session Retention",
        description: "Invalid session retention period specified",
      },
      invalid_token_retention: {
        title: "Invalid Token Retention",
        description: "Invalid token retention period specified",
      },
      invalid_batch_size: {
        title: "Invalid Batch Size",
        description: "Invalid batch size specified for cleanup",
      },
      validation_failed: {
        title: "Validation Failed",
        description: "Session cleanup configuration validation failed",
      },
    },
    success: {
      title: "Session Cleanup Completed",
      description: "Successfully cleaned up expired sessions",
    },
    monitoring: {
      alertTrigger: "Session cleanup task failed",
    },
    documentation: {
      overview:
        "This task removes expired user sessions from the system to maintain security and performance",
    },
  },
  sessionCleanup: {
    category: "Users",

    post: {
      title: "Session Cleanup",
      description: "Clean up expired user sessions and tokens",
      tag: "Session Cleanup",
      container: {
        title: "Session Cleanup",
        description: "Configure and run session cleanup",
      },
      fields: {
        sessionRetentionDays: {
          label: "Session Retention Days",
          description: "Number of days to retain sessions",
        },
        tokenRetentionDays: {
          label: "Token Retention Days",
          description: "Number of days to retain tokens",
        },
        batchSize: {
          label: "Batch Size",
          description: "Number of records to process per batch",
        },
        dryRun: {
          label: "Dry Run",
          description: "Run without actually deleting records",
        },
      },
      response: {
        sessionsDeleted: "Sessions Deleted",
        tokensDeleted: "Tokens Deleted",
        totalProcessed: "Total Processed",
        executionTimeMs: "Execution Time (ms)",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "You must be an admin to run session cleanup",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        server: {
          title: "Server Error",
          description: "Internal server error during cleanup",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid cleanup configuration",
        },
      },
      success: {
        title: "Session Cleanup Completed",
        description: "Sessions and tokens cleaned up successfully",
      },
    },
    task: {
      name: "user-session-cleanup",
      description: "Clean up expired user sessions to maintain system security",
      purpose: "Removes expired sessions to maintain security and performance",
      impact:
        "Improves system performance and security by removing stale session data",
      rollback: "Rollback not applicable for cleanup operations",
    },
    errors: {
      default: "An error occurred during session cleanup",
      execution_failed: {
        title: "Session Cleanup Failed",
        description: "Failed to clean up expired sessions",
      },
      partial_failure: {
        title: "Partial Session Cleanup Failure",
        description: "Some sessions could not be cleaned up",
      },
      unknown_error: {
        title: "Unknown Session Cleanup Error",
        description: "An unknown error occurred during session cleanup",
      },
      invalid_session_retention: {
        title: "Invalid Session Retention",
        description: "Invalid session retention period specified",
      },
      invalid_token_retention: {
        title: "Invalid Token Retention",
        description: "Invalid token retention period specified",
      },
      invalid_batch_size: {
        title: "Invalid Batch Size",
        description: "Invalid batch size specified for cleanup",
      },
      validation_failed: {
        title: "Validation Failed",
        description: "Session cleanup configuration validation failed",
      },
    },
    success: {
      title: "Session Cleanup Completed",
      description: "Successfully cleaned up expired sessions",
    },
    monitoring: {
      alertTrigger: "Session cleanup task failed",
    },
    documentation: {
      overview:
        "This task removes expired user sessions from the system to maintain security and performance",
    },
  },
  userRoles: {
    errors: {
      find_failed: "Failed to find user roles",
      batch_find_failed: "Failed to batch find user roles",
      not_found: "User role not found",
      lookup_failed: "Failed to lookup user role",
      add_failed: "Failed to add role to user",
      no_data_returned: "No data returned from database",
      remove_failed: "Failed to remove role from user",
      check_failed: "Failed to check if user has role",
      delete_failed: "Failed to delete user roles",
      endpoint_not_created: "User roles endpoint has not been created yet",
    },
    post: {
      title: "User Roles",
      description: "User Roles endpoint",
      form: {
        title: "User Roles Configuration",
        description: "Configure user roles parameters",
      },
      response: {
        title: "Response",
        description: "User Roles response data",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
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
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        database_connection_failed: {
          title: "Database Connection Failed",
          description: "Failed to connect to database",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
    enums: {
      userRole: {
        public: "Public",
        customer: "Customer",
        partnerAdmin: "Partner Admin",
        partnerEmployee: "Partner Employee",
        admin: "Admin",
        cliOff: "CLI Disabled",
        cliAuthBypass: "CLI Auth Bypass",
        aiToolOff: "AI Tool Disabled",
        webOff: "Web Disabled",
        mcpOff: "MCP Disabled",
        mcpVisible: "MCP Visible",
        productionOff: "Production Disabled",
        skillOff: "Skill Disabled",
      },
    },
  },
  profileVisibility: {
    public: "Public",
    private: "Private",
    contactsOnly: "Contacts Only",
  },
  contactMethods: {
    email: "Email",
    phone: "Phone",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  userDetailLevel: {
    minimal: "Minimal",
    standard: "Standard",
    complete: "Complete",
  },
  language: {
    en: "English",
    de: "German",
    pl: "Polish",
  },
  timezone: {
    utc: "UTC",
    america_new_york: "America/New_York",
    america_los_angeles: "America/Los_Angeles",
    europe_london: "Europe/London",
    europe_berlin: "Europe/Berlin",
    europe_warsaw: "Europe/Warsaw",
    asia_tokyo: "Asia/Tokyo",
    australia_sydney: "Australia/Sydney",
  },
  errors: {
    emailAlreadyInUse: "Email address is already in use",
    locale_required: "Locale is required",
    auth_required: "Authentication is required",
    auth_retrieval_failed: "Failed to retrieve authentication",
    not_found: "User not found",
    roles_lookup_failed: "Failed to lookup user roles",
    roles_batch_fetch_failed: "Failed to batch fetch user roles",
    id_lookup_failed: "Failed to lookup user by ID",
    email_lookup_failed: "Failed to lookup user by email",
    email_check_failed: "Failed to check email",
    email_duplicate_check_failed: "Failed to check for duplicate email",
    search_failed: "Failed to search users",
    email_already_in_use: "Email address is already in use",
    creation_failed: "Failed to create user",
    no_data_returned: "No data returned from database",
    password_hashing_failed: "Failed to hash password",
    not_implemented_on_native:
      "This feature is not implemented on React Native",
    count_failed: "Failed to get user count: {{error}}",
  },
  userNoteType: {
    note: "Note",
    call: "Call",
    email: "Email",
    meeting: "Meeting",
    task: "Task",
  },
  notifications: {
    profileUpdated: {
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    },
    updateFailed: {
      title: "Update Failed",
      description: "Failed to update your profile. Please try again.",
    },
  },
};
