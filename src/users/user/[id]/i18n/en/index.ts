export const translations = {
  category: "Users",
  tag: "User management",

  id: {
    roles: {
      post: {
        title: "Add user role",
        description: "Grant a role to a specific user account",
        container: {
          title: "Add role",
          description: "Select a role to grant to this user",
        },
        id: {
          label: "User ID",
          description: "Unique identifier of the user to grant the role to",
          placeholder: "Enter user ID...",
        },
        role: {
          label: "Role",
          description: "The role to grant to the user",
          placeholder: "Select a role...",
        },
        submit: {
          label: "Add role",
        },
        response: {
          roleId: {
            content: "Role assignment ID",
          },
          userId: {
            content: "User ID",
          },
          assignedRole: {
            content: "Assigned role",
          },
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "You must be logged in to manage user roles",
          },
          validation: {
            title: "Validation failed",
            description: "Please provide a valid user ID and role",
          },
          forbidden: {
            title: "Access forbidden",
            description: "Only administrators can manage user roles",
          },
          notFound: {
            title: "User not found",
            description: "The specified user could not be found",
          },
          conflict: {
            title: "Role already assigned",
            description: "This user already has the specified role",
          },
          network: {
            title: "Network error",
            description: "Unable to connect to the server",
          },
          unsavedChanges: {
            title: "Unsaved changes",
            description: "You have unsaved changes that will be lost",
          },
          server: {
            title: "Server error",
            description: "Unable to add role due to server error",
          },
          unknown: {
            title: "Unknown error",
            description: "An unexpected error occurred while adding the role",
          },
        },
        success: {
          title: "Role added",
          description: "The role has been successfully granted to the user",
        },
      },
      delete: {
        title: "Remove user role",
        description: "Revoke a role from a specific user account",
        container: {
          title: "Remove role",
          description: "Select a role to revoke from this user",
        },
        id: {
          label: "User ID",
          description: "Unique identifier of the user to revoke the role from",
          placeholder: "Enter user ID...",
        },
        role: {
          label: "Role",
          description: "The role to revoke from the user",
          placeholder: "Select a role...",
        },
        submit: {
          label: "Remove role",
        },
        response: {
          success: {
            content: "Role removed",
          },
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "You must be logged in to manage user roles",
          },
          validation: {
            title: "Validation failed",
            description: "Please provide a valid user ID and role",
          },
          forbidden: {
            title: "Access forbidden",
            description: "Only administrators can manage user roles",
          },
          notFound: {
            title: "User not found",
            description: "The specified user could not be found",
          },
          conflict: {
            title: "Conflict error",
            description: "Unable to remove role due to existing dependencies",
          },
          network: {
            title: "Network error",
            description: "Unable to connect to the server",
          },
          unsavedChanges: {
            title: "Unsaved changes",
            description: "You have unsaved changes that will be lost",
          },
          server: {
            title: "Server error",
            description: "Unable to remove role due to server error",
          },
          unknown: {
            title: "Unknown error",
            description: "An unexpected error occurred while removing the role",
          },
        },
        success: {
          title: "Role removed",
          description: "The role has been successfully revoked from the user",
        },
      },
    },
    get: {
      title: "Get user",
      titleShort: "User details",
      description: "Retrieve detailed information about a specific user",
      container: {
        title: "User details",
        description: "View detailed user information",
      },
      id: {
        label: "User ID",
        description: "Unique identifier for the user",
        placeholder: "Enter user ID...",
      },
      response: {
        userProfile: {
          title: "User profile",
          description: "Detailed user profile information",
          basicInfo: {
            title: "Basic information",
            description: "Core user information",
            id: {
              content: "User ID",
            },
            email: {
              content: "Email address",
            },
            privateName: {
              content: "Private name",
            },
            publicName: {
              content: "Public name",
            },
            firstName: {
              content: "First name",
            },
            lastName: {
              content: "Last name",
            },
            company: {
              content: "Company",
            },
          },
          contactDetails: {
            title: "Contact details",
            description: "User contact information",
            phone: {
              content: "Phone number",
            },
            preferredContactMethod: {
              content: "Preferred contact method",
            },
            website: {
              content: "Website",
            },
          },
        },
        profileDetails: {
          title: "Profile details",
          description: "Additional profile information",
          imageUrl: {
            content: "Profile image",
          },
          bio: {
            content: "Biography",
          },
          jobTitle: {
            content: "Job title",
          },
          leadId: {
            content: "Associated lead ID",
          },
        },
        accountStatus: {
          title: "Account status",
          description: "User account status information",
          isActive: {
            content: "Active status",
          },
          emailVerified: {
            content: "Email verified",
          },
          stripeCustomerId: {
            content: "Stripe customer ID",
          },
          userRoles: {
            content: "User roles",
          },
        },
        timestamps: {
          title: "Timestamps",
          description: "Creation and update timestamps",
          createdAt: {
            content: "Created at",
          },
          updatedAt: {
            content: "Updated at",
          },
        },
        referralInfo: {
          title: "Referral info",
          description: "Referral chain and earnings",
          referredByUserId: {
            content: "Referred by (User ID)",
          },
          referredByCode: {
            content: "Referral code used",
          },
          totalReferrals: {
            content: "Users referred",
          },
          totalEarnedCents: {
            content: "Total earned (cents)",
          },
          confirmedEarnedCents: {
            content: "Confirmed earned (cents)",
          },
          pendingEarnedCents: {
            content: "Pending earned (cents)",
          },
        },
        engagement: {
          title: "Credits & engagement",
          description: "Balance, spend, earnings and activity",
          creditBalance: {
            content: "Credit balance",
          },
          freeAllowance: {
            content: "Free allowance",
          },
          lifetimeCreditsSpent: {
            content: "Lifetime spend",
          },
          favoritesCount: {
            content: "Favorites",
          },
          customSkillsCount: {
            content: "Custom skills",
          },
          newsletterConsent: {
            content: "Newsletter consent",
          },
          hasConfirmedNewsletter: {
            content: "Newsletter confirmed",
          },
          paymentsCount: {
            content: "Payments",
          },
          creditEntriesCount: {
            content: "Credit entries",
          },
          threadsCount: {
            content: "Threads",
          },
        },
        leadId: {
          content: "Associated lead ID",
        },
        email: {
          content: "Email address",
        },
        privateName: {
          content: "Private name",
        },
        publicName: {
          content: "Public name",
        },
        firstName: {
          content: "First name",
        },
        lastName: {
          content: "Last name",
        },
        company: {
          content: "Company",
        },
        phone: {
          content: "Phone number",
        },
        preferredContactMethod: {
          content: "Preferred contact method",
        },
        imageUrl: {
          content: "Profile image",
        },
        bio: {
          content: "Biography",
        },
        website: {
          content: "Website",
        },
        jobTitle: {
          content: "Job title",
        },
        emailVerified: {
          content: "Email verified",
        },
        isActive: {
          content: "Active status",
        },
        stripeCustomerId: {
          content: "Stripe customer ID",
        },
        userRoles: {
          content: "User roles",
        },
        createdAt: {
          content: "Created at",
        },
        updatedAt: {
          content: "Updated at",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized access",
          description: "You must be logged in to view user details",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid user ID provided",
        },
        forbidden: {
          title: "Access forbidden",
          description: "You don't have permission to view this user",
        },
        notFound: {
          title: "User not found",
          description: "The requested user could not be found",
          detail: "No user found with ID {{userId}}.",
        },
        conflict: {
          title: "Conflict error",
          description: "Unable to retrieve user due to existing conflicts",
        },
        network: {
          title: "Network error",
          description: "Unable to connect to the server",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes that will be lost",
        },
        server: {
          title: "Server error",
          description: "Unable to retrieve user due to server error",
          detail: "Could not load this user: {{error}}",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred while retrieving user",
        },
      },
      success: {
        title: "User retrieved successfully",
        description: "User details have been retrieved successfully",
      },
    },
    put: {
      title: "Update user",
      titleShort: "Update user",
      description: "Update user information and profile details",
      container: {
        title: "Update user",
        description: "Modify user information and settings",
      },
      id: {
        label: "User ID",
        description: "Unique identifier for the user to update",
        placeholder: "Enter user ID...",
      },
      sections: {
        basicInfo: {
          title: "Basic information",
          description: "Update basic user information",
        },
        contactInfo: {
          title: "Contact information",
          description: "Update contact details",
        },
        profileDetails: {
          title: "Profile details",
          description: "Update additional profile information",
        },
        adminSettings: {
          title: "Administrative settings",
          description: "Update administrative settings",
        },
      },
      email: {
        label: "Email address",
        description: "User's email address for login and communication",
        placeholder: "Enter email address...",
      },
      privateName: {
        label: "Private name",
        description: "User's full legal name (visible only to admins)",
      },
      publicName: {
        label: "Public name",
        description: "User's display name (visible to all users)",
      },
      firstName: {
        label: "First name",
        description: "User's first name",
        placeholder: "Enter first name...",
      },
      lastName: {
        label: "Last name",
        description: "User's last name",
        placeholder: "Enter last name...",
      },
      company: {
        label: "Company",
        description: "User's company or organization",
        placeholder: "Enter company name...",
      },
      phone: {
        label: "Phone number",
        description: "User's contact phone number",
        placeholder: "Enter phone number...",
      },
      preferredContactMethod: {
        label: "Preferred contact method",
        description: "How the user prefers to be contacted",
      },
      bio: {
        label: "Biography",
        description: "Brief description about the user",
        placeholder: "Enter biography...",
      },
      website: {
        label: "Website",
        description: "User's personal or company website",
        placeholder: "Enter website URL...",
      },
      jobTitle: {
        label: "Job title",
        description: "User's job title or position",
        placeholder: "Enter job title...",
      },
      emailVerified: {
        label: "Email verified",
        description: "Whether the user's email is verified",
      },
      isActive: {
        label: "Active status",
        description: "Whether the user account is active",
      },
      leadId: {
        label: "Lead ID",
        description: "Associated lead identifier",
        placeholder: "Enter lead ID...",
      },
      isBanned: {
        label: "Banned",
        description: "Whether the user is banned from the platform",
      },
      bannedReason: {
        label: "Ban reason",
        description: "Reason for banning the user",
      },
      response: {
        leadId: {
          content: "Associated lead ID",
        },
        email: {
          content: "Email address",
        },
        privateName: {
          content: "Private name",
        },
        publicName: {
          content: "Public name",
        },
        firstName: {
          content: "First name",
        },
        lastName: {
          content: "Last name",
        },
        company: {
          content: "Company",
        },
        phone: {
          content: "Phone number",
        },
        preferredContactMethod: {
          content: "Preferred contact method",
        },
        imageUrl: {
          content: "Profile image",
        },
        bio: {
          content: "Biography",
        },
        website: {
          content: "Website",
        },
        jobTitle: {
          content: "Job title",
        },
        emailVerified: {
          content: "Email verified",
        },
        isActive: {
          content: "Active status",
        },
        stripeCustomerId: {
          content: "Stripe customer ID",
        },
        userRoles: {
          content: "User roles",
        },
        createdAt: {
          content: "Created at",
        },
        updatedAt: {
          content: "Updated at",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized access",
          description: "You must be logged in to update users",
        },
        validation: {
          title: "Validation failed",
          description: "Please check the form data and try again",
        },
        forbidden: {
          title: "Access forbidden",
          description: "You don't have permission to update this user",
        },
        notFound: {
          title: "User not found",
          description: "The user to update could not be found",
          detail: "No user found with ID {{userId}}.",
        },
        conflict: {
          title: "Update conflict",
          description: "The user data conflicts with existing records",
        },
        server: {
          title: "Server error",
          description: "Unable to update user due to server error",
          detail: "Could not save changes to this user: {{error}}",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred while updating user",
        },
        network: {
          title: "Network error",
          description: "Unable to connect to the server",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes that will be lost",
        },
      },
      success: {
        title: "User updated successfully",
        description: "User information has been updated successfully",
      },
    },
    delete: {
      title: "Delete user",
      titleShort: "Delete user",
      description: "Permanently delete a user account",
      container: {
        title: "Delete user",
        description: "Permanently remove user from the system",
      },
      id: {
        label: "User ID",
        description: "Unique identifier for the user to delete",
        placeholder: "Enter user ID...",
        helpText: "WARNING: This action cannot be undone",
      },
      submitButton: {
        label: "Delete account",
        loadingText: "Deleting...",
      },
      response: {
        deletionResult: {
          title: "Deletion result",
          description: "Result of the deletion operation",
          success: {
            content: "Deletion success",
          },
          message: {
            content: "Deletion message",
          },
          deletedAt: {
            content: "Deleted at",
          },
        },
        success: {
          content: "Deletion success",
        },
        message: {
          content: "Deletion message",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized access",
          description: "You must be logged in to delete users",
        },
        validation: {
          title: "Validation failed",
          description: "Invalid user ID provided for deletion",
        },
        forbidden: {
          title: "Access forbidden",
          description: "You don't have permission to delete users",
        },
        notFound: {
          title: "User not found",
          description: "The user to delete could not be found",
          detail: "No user found with ID {{userId}}.",
        },
        server: {
          title: "Server error",
          description: "Unable to delete user due to server error",
          detail: "Could not delete this user: {{error}}",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred while deleting user",
        },
        conflict: {
          title: "Conflict error",
          description: "Unable to delete user due to existing dependencies",
        },
        network: {
          title: "Network error",
          description: "Unable to connect to the server",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes that will be lost",
        },
      },
      success: {
        title: "User deleted successfully",
        description: "User has been deleted successfully",
      },
    },
    widget: {
      userProfile: "User profile",
      active: "Active",
      inactive: "Inactive",
      leadId: "Lead ID",
      viewLead: "View lead",
      created: "Joined",
      lastUpdated: "Last updated",
      relatedRecords: "Related records",
      relatedPayments: "Payments",
      relatedThreadActivity: "Thread activity",
      confirmBan: "Block account access for {{name}}?",
      confirmUnban: "Restore account access for {{name}}?",
      editAccountNamed: "Edit {{name}}",
      saveAccount: "Save changes",
      fullProfile: "Open full profile",
      referrals: "Referrals",
      subscription: "Subscription",
      creditHistory: "Credit history",
      identifiers: "Technical details",
      engagementTitle: "Credits and activity",
      balance: "Credit balance",
      freeAllowance: "Free credit allowance",
      lifetimeSpend: "Credits spent",
      earned: "Referral earnings",
      earnedPending: "Pending:",
      referred: "Referred users",
      favorites: "Favorites",
      skills: "Skills",
      newsletter: "Newsletter",
      newsletterConfirmed: "Confirmed",
      newsletterConsent: "Opted in",
      newsletterNone: "None",
      deleteUser: "Delete user",
      userDeletedSuccessfully: "User deleted successfully",
      deletedAt: "Deleted at",
      dangerZone: "Danger zone",
      deleteAccountHint: "Permanently remove the account for {{name}}.",
      cancelDeletion: "Cancel",
      confirmDeletion: "Confirm deletion",
      confirmDeletionMessage:
        "Deleting this account is permanent. You cannot undo it.",
      titleReferralCodes: "View referral codes and stats",
      titleSubscription: "View subscription",
      copyLeadId: "Copy lead ID",
      noEarnings: "None yet",
      earningUnitsUnavailable: "Earnings breakdown unavailable",
      titleCopyUserId: "Copy user ID",
      creditsAmount: "{{count}} credits",
      freeAllowanceHint: "Free allowance: {{count}} credits a month",
      moreActions: "More",
      editAccount: "Edit account",
      deleteAccount: "Delete account",
      deleteDialogTitle: "Delete the account of {{name}}?",
      accountTitle: "Account",
      publicName: "Public name",
      roles: "Roles",
      savedItems: "Saved items",
      savedItemsValue: "{{favorites}} favorites, {{skills}} skills",
      userId: "User ID",
      stripeCustomer: "Stripe customer",
    },
    getCrm: {
      get: {
        title: "Get user CRM profile",
        titleShort: "CRM profile",
        description: "Retrieve a user's billing fields and note count",
        fields: {
          userId: {
            label: "User ID",
            description: "The user to look up",
            placeholder: "User UUID",
          },
        },
        errors: {
          validation: {
            title: "Validation error",
            description: "Invalid user ID",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You must be logged in",
          },
          forbidden: {
            title: "Forbidden",
            description: "You don't have access to this user's CRM data",
          },
          notFound: {
            title: "Not found",
            description: "User not found",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
          network: {
            title: "Network error",
            description: "Network request failed",
          },
          unsavedChanges: {
            title: "Unsaved changes",
            description: "There are unsaved changes",
          },
          internal: {
            title: "Internal error",
            description: "Server error — try again",
          },
          unknown: {
            title: "Unknown error",
            description: "An unexpected error occurred",
          },
        },
        success: {
          title: "CRM profile loaded",
          description: "User CRM data retrieved",
        },
        widget: {
          addNote: "Add note",
          viewNotes: "View notes",
        },
        response: {
          id: "User ID",
          email: "Email",
          privateName: "Name",
          companyBillingName: "Company / billing name",
          vatNumber: "VAT number",
          taxId: "Tax ID",
          phone: "Phone",
          addressLine1: "Address line 1",
          addressLine2: "Address line 2",
          city: "City",
          region: "Region",
          postalCode: "Postal code",
          billingCountry: "Country",
          defaultCurrency: "Default currency",
          paymentTermsDays: "Payment terms (days)",
          notesCount: "Total notes",
        },
      },
      tag: "CRM",
    },
    notesCreate: {
      post: {
        title: "Create user note",
        titleShort: "Create note",
        description:
          "Add a CRM note, call log, email record, meeting or task for a user",
        fields: {
          userId: {
            label: "User",
            description: "The user this note is about",
            placeholder: "Select user",
          },
          type: {
            label: "Activity type",
            description: "What kind of interaction this records",
            placeholder: "Select type",
          },
          content: {
            label: "Content",
            description: "Details of the activity",
            placeholder: "Write what happened...",
          },
          isPrivate: {
            label: "Private",
            description: "Only you can see private notes",
          },
        },
        errors: {
          validation: {
            title: "Validation error",
            description: "Check the fields and try again",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You must be logged in",
          },
          forbidden: {
            title: "Forbidden",
            description: "You don't have access to this user",
          },
          notFound: {
            title: "Not found",
            description: "User not found",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
          network: {
            title: "Network error",
            description: "Network request failed",
          },
          unsavedChanges: {
            title: "Unsaved changes",
            description: "There are unsaved changes",
          },
          internal: {
            title: "Internal error",
            description: "Server error — try again",
          },
          unknown: {
            title: "Unknown error",
            description: "An unexpected error occurred",
          },
        },
        success: {
          title: "Note created",
          description: "The note was saved",
        },
        widget: {
          created: "Note created",
          noteId: "Note ID",
          backToNotes: "Back to Notes",
        },
        response: {
          id: "Note ID",
          userId: "User ID",
          authorUserId: "Author ID",
          type: "Type",
          content: "Content",
          isPrivate: "Private",
          createdAt: "Created at",
          updatedAt: "Updated at",
        },
      },
      tag: "CRM",
    },
    notesList: {
      get: {
        title: "List user notes",
        titleShort: "User notes",
        description:
          "List CRM notes for a user, filtered by type and visibility",
        fields: {
          userId: {
            label: "User ID",
            description: "Whose notes to list",
            placeholder: "User UUID",
          },
          type: {
            label: "Type",
            description: "Filter by activity type",
            placeholder: "All types",
          },
          isPrivate: {
            label: "Private only",
            description: "Show only your private notes",
          },
        },
        errors: {
          validation: {
            title: "Validation error",
            description: "Check the filters and try again",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You must be logged in",
          },
          forbidden: {
            title: "Forbidden",
            description: "You don't have access to these notes",
          },
          notFound: {
            title: "Not found",
            description: "User not found",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
          network: {
            title: "Network error",
            description: "Network request failed",
          },
          unsavedChanges: {
            title: "Unsaved changes",
            description: "There are unsaved changes",
          },
          internal: {
            title: "Internal error",
            description: "Server error — try again",
          },
          unknown: {
            title: "Unknown error",
            description: "An unexpected error occurred",
          },
        },
        success: {
          title: "Notes loaded",
          description: "Notes retrieved successfully",
        },
        widget: {
          addNote: "Add note",
          total: "Total",
          empty: "No notes yet",
          delete: "Delete",
          private: "Private",
          ago: "ago",
        },
        response: {
          notes: "Notes",
          total: "Total",
          note: {
            id: "Note ID",
            userId: "User ID",
            authorUserId: "Author ID",
            type: "Type",
            content: "Content",
            isPrivate: "Private",
            createdAt: "Created at",
            updatedAt: "Updated at",
          },
        },
      },
      tag: "CRM",
    },
    noteDelete: {
      post: {
        title: "Delete user note",
        titleShort: "Delete note",
        description:
          "Delete a CRM note — only the author or an admin can do this",
        fields: {
          noteId: {
            label: "Note ID",
            description: "The note to delete",
            placeholder: "Note UUID",
          },
        },
        errors: {
          validation: {
            title: "Validation error",
            description: "Invalid note ID",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You must be logged in",
          },
          forbidden: {
            title: "Forbidden",
            description: "Only the author or an admin can delete this note",
          },
          notFound: {
            title: "Not found",
            description: "Note not found",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
          network: {
            title: "Network error",
            description: "Network request failed",
          },
          unsavedChanges: {
            title: "Unsaved changes",
            description: "There are unsaved changes",
          },
          internal: {
            title: "Internal error",
            description: "Server error — try again",
          },
          unknown: {
            title: "Unknown error",
            description: "An unexpected error occurred",
          },
        },
        success: {
          title: "Note deleted",
          description: "The note was permanently removed",
        },
        widget: {
          warning: "This note will be permanently deleted.",
          deleted: "Note deleted.",
          backToNotes: "Back to Notes",
        },
        response: {
          deleted: "Deleted",
        },
      },
      tag: "CRM",
    },
  },
};
