export const translations = {
  category: "Users",
  tag: "User Management",

  id: {
    roles: {
      post: {
        title: "Add User Role",
        description: "Grant a role to a specific user account",
        container: {
          title: "Add Role",
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
          label: "Add Role",
        },
        response: {
          roleId: {
            content: "Role Assignment ID",
          },
          userId: {
            content: "User ID",
          },
          assignedRole: {
            content: "Assigned Role",
          },
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "You must be logged in to manage user roles",
          },
          validation: {
            title: "Validation Failed",
            description: "Please provide a valid user ID and role",
          },
          forbidden: {
            title: "Access Forbidden",
            description: "Only administrators can manage user roles",
          },
          notFound: {
            title: "User Not Found",
            description: "The specified user could not be found",
          },
          conflict: {
            title: "Role Already Assigned",
            description: "This user already has the specified role",
          },
          network: {
            title: "Network Error",
            description: "Unable to connect to the server",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes that will be lost",
          },
          server: {
            title: "Server Error",
            description: "Unable to add role due to server error",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred while adding the role",
          },
        },
        success: {
          title: "Role Added",
          description: "The role has been successfully granted to the user",
        },
      },
      delete: {
        title: "Remove User Role",
        description: "Revoke a role from a specific user account",
        container: {
          title: "Remove Role",
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
          label: "Remove Role",
        },
        response: {
          success: {
            content: "Role Removed",
          },
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "You must be logged in to manage user roles",
          },
          validation: {
            title: "Validation Failed",
            description: "Please provide a valid user ID and role",
          },
          forbidden: {
            title: "Access Forbidden",
            description: "Only administrators can manage user roles",
          },
          notFound: {
            title: "User Not Found",
            description: "The specified user could not be found",
          },
          conflict: {
            title: "Conflict Error",
            description: "Unable to remove role due to existing dependencies",
          },
          network: {
            title: "Network Error",
            description: "Unable to connect to the server",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes that will be lost",
          },
          server: {
            title: "Server Error",
            description: "Unable to remove role due to server error",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred while removing the role",
          },
        },
        success: {
          title: "Role Removed",
          description: "The role has been successfully revoked from the user",
        },
      },
    },
    get: {
      title: "Get User",
      titleShort: "User Details",
      description: "Retrieve detailed information about a specific user",
      container: {
        title: "User Details",
        description: "View detailed user information",
      },
      id: {
        label: "User ID",
        description: "Unique identifier for the user",
        placeholder: "Enter user ID...",
      },
      response: {
        userProfile: {
          title: "User Profile",
          description: "Detailed user profile information",
          basicInfo: {
            title: "Basic Information",
            description: "Core user information",
            id: {
              content: "User ID",
            },
            email: {
              content: "Email Address",
            },
            privateName: {
              content: "Private Name",
            },
            publicName: {
              content: "Public Name",
            },
            firstName: {
              content: "First Name",
            },
            lastName: {
              content: "Last Name",
            },
            company: {
              content: "Company",
            },
          },
          contactDetails: {
            title: "Contact Details",
            description: "User contact information",
            phone: {
              content: "Phone Number",
            },
            preferredContactMethod: {
              content: "Preferred Contact Method",
            },
            website: {
              content: "Website",
            },
          },
        },
        profileDetails: {
          title: "Profile Details",
          description: "Additional profile information",
          imageUrl: {
            content: "Profile Image",
          },
          bio: {
            content: "Biography",
          },
          jobTitle: {
            content: "Job Title",
          },
          leadId: {
            content: "Associated Lead ID",
          },
        },
        accountStatus: {
          title: "Account Status",
          description: "User account status information",
          isActive: {
            content: "Active Status",
          },
          emailVerified: {
            content: "Email Verified",
          },
          stripeCustomerId: {
            content: "Stripe Customer ID",
          },
          userRoles: {
            content: "User Roles",
          },
        },
        timestamps: {
          title: "Timestamps",
          description: "Creation and update timestamps",
          createdAt: {
            content: "Created At",
          },
          updatedAt: {
            content: "Updated At",
          },
        },
        referralInfo: {
          title: "Referral Info",
          description: "Referral chain and earnings",
          referredByUserId: {
            content: "Referred By (User ID)",
          },
          referredByCode: {
            content: "Referral Code Used",
          },
          totalReferrals: {
            content: "Users Referred",
          },
          totalEarnedCents: {
            content: "Total Earned (cents)",
          },
        },
        leadId: {
          content: "Associated Lead ID",
        },
        email: {
          content: "Email Address",
        },
        privateName: {
          content: "Private Name",
        },
        publicName: {
          content: "Public Name",
        },
        firstName: {
          content: "First Name",
        },
        lastName: {
          content: "Last Name",
        },
        company: {
          content: "Company",
        },
        phone: {
          content: "Phone Number",
        },
        preferredContactMethod: {
          content: "Preferred Contact Method",
        },
        imageUrl: {
          content: "Profile Image",
        },
        bio: {
          content: "Biography",
        },
        website: {
          content: "Website",
        },
        jobTitle: {
          content: "Job Title",
        },
        emailVerified: {
          content: "Email Verified",
        },
        isActive: {
          content: "Active Status",
        },
        stripeCustomerId: {
          content: "Stripe Customer ID",
        },
        userRoles: {
          content: "User Roles",
        },
        createdAt: {
          content: "Created At",
        },
        updatedAt: {
          content: "Updated At",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized Access",
          description: "You must be logged in to view user details",
        },
        validation: {
          title: "Validation Failed",
          description: "Invalid user ID provided",
        },
        forbidden: {
          title: "Access Forbidden",
          description: "You don't have permission to view this user",
        },
        notFound: {
          title: "User Not Found",
          description: "The requested user could not be found",
          detail: "No user found with ID {{userId}}.",
        },
        conflict: {
          title: "Conflict Error",
          description: "Unable to retrieve user due to existing conflicts",
        },
        network: {
          title: "Network Error",
          description: "Unable to connect to the server",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes that will be lost",
        },
        server: {
          title: "Server Error",
          description: "Unable to retrieve user due to server error",
          detail: "Could not load this user: {{error}}",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred while retrieving user",
        },
      },
      success: {
        title: "User Retrieved Successfully",
        description: "User details have been retrieved successfully",
      },
    },
    put: {
      title: "Update User",
      titleShort: "Update User",
      description: "Update user information and profile details",
      container: {
        title: "Update User",
        description: "Modify user information and settings",
      },
      id: {
        label: "User ID",
        description: "Unique identifier for the user to update",
        placeholder: "Enter user ID...",
      },
      sections: {
        basicInfo: {
          title: "Basic Information",
          description: "Update basic user information",
        },
        contactInfo: {
          title: "Contact Information",
          description: "Update contact details",
        },
        profileDetails: {
          title: "Profile Details",
          description: "Update additional profile information",
        },
        adminSettings: {
          title: "Administrative Settings",
          description: "Update administrative settings",
        },
      },
      email: {
        label: "Email Address",
        description: "User's email address for login and communication",
        placeholder: "Enter email address...",
      },
      privateName: {
        label: "Private Name",
        description: "User's full legal name (visible only to admins)",
      },
      publicName: {
        label: "Public Name",
        description: "User's display name (visible to all users)",
      },
      firstName: {
        label: "First Name",
        description: "User's first name",
        placeholder: "Enter first name...",
      },
      lastName: {
        label: "Last Name",
        description: "User's last name",
        placeholder: "Enter last name...",
      },
      company: {
        label: "Company",
        description: "User's company or organization",
        placeholder: "Enter company name...",
      },
      phone: {
        label: "Phone Number",
        description: "User's contact phone number",
        placeholder: "Enter phone number...",
      },
      preferredContactMethod: {
        label: "Preferred Contact Method",
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
        label: "Job Title",
        description: "User's job title or position",
        placeholder: "Enter job title...",
      },
      emailVerified: {
        label: "Email Verified",
        description: "Whether the user's email is verified",
      },
      isActive: {
        label: "Active Status",
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
        label: "Ban Reason",
        description: "Reason for banning the user",
      },
      response: {
        leadId: {
          content: "Associated Lead ID",
        },
        email: {
          content: "Email Address",
        },
        privateName: {
          content: "Private Name",
        },
        publicName: {
          content: "Public Name",
        },
        firstName: {
          content: "First Name",
        },
        lastName: {
          content: "Last Name",
        },
        company: {
          content: "Company",
        },
        phone: {
          content: "Phone Number",
        },
        preferredContactMethod: {
          content: "Preferred Contact Method",
        },
        imageUrl: {
          content: "Profile Image",
        },
        bio: {
          content: "Biography",
        },
        website: {
          content: "Website",
        },
        jobTitle: {
          content: "Job Title",
        },
        emailVerified: {
          content: "Email Verified",
        },
        isActive: {
          content: "Active Status",
        },
        stripeCustomerId: {
          content: "Stripe Customer ID",
        },
        userRoles: {
          content: "User Roles",
        },
        createdAt: {
          content: "Created At",
        },
        updatedAt: {
          content: "Updated At",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized Access",
          description: "You must be logged in to update users",
        },
        validation: {
          title: "Validation Failed",
          description: "Please check the form data and try again",
        },
        forbidden: {
          title: "Access Forbidden",
          description: "You don't have permission to update this user",
        },
        notFound: {
          title: "User Not Found",
          description: "The user to update could not be found",
          detail: "No user found with ID {{userId}}.",
        },
        conflict: {
          title: "Update Conflict",
          description: "The user data conflicts with existing records",
        },
        server: {
          title: "Server Error",
          description: "Unable to update user due to server error",
          detail: "Could not save changes to this user: {{error}}",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred while updating user",
        },
        network: {
          title: "Network Error",
          description: "Unable to connect to the server",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes that will be lost",
        },
      },
      success: {
        title: "User Updated Successfully",
        description: "User information has been updated successfully",
      },
    },
    delete: {
      title: "Delete User",
      titleShort: "Delete User",
      description: "Permanently delete a user account",
      container: {
        title: "Delete User",
        description: "Permanently remove user from the system",
      },
      id: {
        label: "User ID",
        description: "Unique identifier for the user to delete",
        placeholder: "Enter user ID...",
        helpText: "WARNING: This action cannot be undone",
      },
      submitButton: {
        label: "Delete User",
        loadingText: "Deleting...",
      },
      response: {
        deletionResult: {
          title: "Deletion Result",
          description: "Result of the deletion operation",
          success: {
            content: "Deletion Success",
          },
          message: {
            content: "Deletion Message",
          },
          deletedAt: {
            content: "Deleted At",
          },
        },
        success: {
          content: "Deletion Success",
        },
        message: {
          content: "Deletion Message",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized Access",
          description: "You must be logged in to delete users",
        },
        validation: {
          title: "Validation Failed",
          description: "Invalid user ID provided for deletion",
        },
        forbidden: {
          title: "Access Forbidden",
          description: "You don't have permission to delete users",
        },
        notFound: {
          title: "User Not Found",
          description: "The user to delete could not be found",
          detail: "No user found with ID {{userId}}.",
        },
        server: {
          title: "Server Error",
          description: "Unable to delete user due to server error",
          detail: "Could not delete this user: {{error}}",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred while deleting user",
        },
        conflict: {
          title: "Conflict Error",
          description: "Unable to delete user due to existing dependencies",
        },
        network: {
          title: "Network Error",
          description: "Unable to connect to the server",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes that will be lost",
        },
      },
      success: {
        title: "User Deleted Successfully",
        description: "User has been deleted successfully",
      },
    },
    widget: {
      userProfile: "User Profile",
      active: "Active",
      inactive: "Inactive",
      leadId: "Lead ID:",
      viewLead: "View Lead",
      created: "Created",
      lastUpdated: "Last Updated",
      fullProfile: "Full Profile",
      referrals: "Referrals",
      subscription: "Subscription",
      creditHistory: "Credit History",
      deleteUser: "Delete User",
      userDeletedSuccessfully: "User deleted successfully",
      deletedAt: "Deleted at",
      confirmDeletion: "Confirm Deletion",
      confirmDeletionMessage:
        "This will permanently delete the user and all associated data. This action cannot be undone.",
      titleReferralCodes: "View referral codes and stats",
      titleSubscription: "View subscription",
      titleCopyUserId: "Copy User ID",
    },
    getCrm: {
      get: {
        title: "Get User CRM Profile",
        titleShort: "CRM Profile",
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
            title: "Validation Error",
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
            title: "Not Found",
            description: "User not found",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
          network: {
            title: "Network Error",
            description: "Network request failed",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "There are unsaved changes",
          },
          internal: {
            title: "Internal Error",
            description: "Server error — try again",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
        },
        success: {
          title: "CRM Profile Loaded",
          description: "User CRM data retrieved",
        },
        widget: {
          addNote: "Add Note",
          viewNotes: "View Notes",
        },
        response: {
          id: "User ID",
          email: "Email",
          privateName: "Name",
          companyBillingName: "Company / Billing Name",
          vatNumber: "VAT Number",
          taxId: "Tax ID",
          phone: "Phone",
          addressLine1: "Address Line 1",
          addressLine2: "Address Line 2",
          city: "City",
          region: "Region",
          postalCode: "Postal Code",
          billingCountry: "Country",
          defaultCurrency: "Default Currency",
          paymentTermsDays: "Payment Terms (days)",
          notesCount: "Total Notes",
        },
      },
      tag: "CRM",
    },
    notesCreate: {
      post: {
        title: "Create User Note",
        titleShort: "Create Note",
        description:
          "Add a CRM note, call log, email record, meeting or task for a user",
        fields: {
          userId: {
            label: "User",
            description: "The user this note is about",
            placeholder: "Select user",
          },
          type: {
            label: "Activity Type",
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
            title: "Validation Error",
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
            title: "Not Found",
            description: "User not found",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
          network: {
            title: "Network Error",
            description: "Network request failed",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "There are unsaved changes",
          },
          internal: {
            title: "Internal Error",
            description: "Server error — try again",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
        },
        success: {
          title: "Note Created",
          description: "The note was saved",
        },
        widget: {
          created: "Note Created",
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
          createdAt: "Created At",
          updatedAt: "Updated At",
        },
      },
      tag: "CRM",
    },
    notesList: {
      get: {
        title: "List User Notes",
        titleShort: "User Notes",
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
            label: "Private Only",
            description: "Show only your private notes",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
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
            title: "Not Found",
            description: "User not found",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
          network: {
            title: "Network Error",
            description: "Network request failed",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "There are unsaved changes",
          },
          internal: {
            title: "Internal Error",
            description: "Server error — try again",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
        },
        success: {
          title: "Notes Loaded",
          description: "Notes retrieved successfully",
        },
        widget: {
          addNote: "Add Note",
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
            createdAt: "Created At",
            updatedAt: "Updated At",
          },
        },
      },
      tag: "CRM",
    },
    noteDelete: {
      post: {
        title: "Delete User Note",
        titleShort: "Delete Note",
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
            title: "Validation Error",
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
            title: "Not Found",
            description: "Note not found",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred",
          },
          network: {
            title: "Network Error",
            description: "Network request failed",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "There are unsaved changes",
          },
          internal: {
            title: "Internal Error",
            description: "Server error — try again",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unexpected error occurred",
          },
        },
        success: {
          title: "Note Deleted",
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
