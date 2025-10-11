export const translations = {
  category: "Users",
  tag: "User Management",

  id: {
    get: {
      title: "Get User",
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
        leadId: {
          content: "Associated Lead ID",
        },
        email: {
          content: "Email Address",
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
      response: {
        leadId: {
          content: "Associated Lead ID",
        },
        email: {
          content: "Email Address",
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
        },
        conflict: {
          title: "Update Conflict",
          description: "The user data conflicts with existing records",
        },
        server: {
          title: "Server Error",
          description: "Unable to update user due to server error",
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
        },
        server: {
          title: "Server Error",
          description: "Unable to delete user due to server error",
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
  },
};
