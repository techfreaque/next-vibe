// Consolidated user translations
export const translations = {
  account: {
    delete: {
      success: {
        title: "Account Deleted",
        description: "Your account has been deleted successfully",
      },
      error: {
        title: "Account Deletion Failed",
      },
    },
  },
  avatar: {
    upload: {
      success: {
        title: "Avatar Uploaded",
        description: "Your avatar has been uploaded successfully",
      },
      error: {
        title: "Avatar Upload Failed",
        default: "Failed to upload avatar",
      },
    },
    delete: {
      success: {
        title: "Avatar Deleted",
        description: "Your avatar has been deleted successfully",
      },
      error: {
        title: "Avatar Deletion Failed",
      },
    },
  },
  errors: {
    not_found: "User not found",
    user_not_found: "User not found",
    auth_required: "Authentication required to perform this operation",
    auth_retrieval_failed: "Failed to retrieve authentication information",
    roles_lookup_failed: "Failed to retrieve user roles",
    id_lookup_failed: "Failed to lookup user by ID",
    email_lookup_failed: "Failed to lookup user by email",
    existence_check_failed: "Failed to check if user exists",
    email_check_failed: "Failed to check email availability",
    email_duplicate_check_failed: "Failed to check for duplicate email",
    search_failed: "User search failed",
    email_already_in_use: "Email address is already in use",
    creation_failed: "Failed to create new user account",
    profile_update_failed: "Failed to update user profile",
    account_deletion_failed: "Failed to delete user account",
    password_hashing_failed: "Failed to secure password",
  },
  password: {
    success: {
      title: "Password Updated",
      description: "Your password has been updated successfully",
    },
    error: {
      title: "Password Update Failed",
    },
  },
  profile: {
    title: "Profile Information",
    description: "Update your personal profile information.",
    fields: {
      firstName: {
        label: "First Name",
        placeholder: "Enter your first name",
      },
      lastName: {
        label: "Last Name",
        placeholder: "Enter your last name",
      },
      bio: {
        label: "Bio",
        placeholder: "Tell us about yourself...",
      },
      website: {
        label: "Website",
        placeholder: "https://example.com",
      },
      phone: {
        label: "Phone",
        placeholder: "+1 (555) 123-4567",
      },
    },
    success: {
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    },
    error: {
      title: "Profile Update Failed",
      description: "Failed to update profile. Please try again.",
    },
  },
  roles: {
    errors: {
      find_failed: "Failed to find user roles",
      not_found: "User role not found",
      lookup_failed: "Failed to lookup user role",
      add_failed: "Failed to add role to user",
      remove_failed: "Failed to remove role from user",
      check_failed: "Failed to check user role",
      delete_failed: "Failed to delete user roles",
    },
  },
  search: {
    error: {
      validation: {
        title: "Search Validation Error",
        description: "Please provide valid search criteria.",
      },
      unauthorized: {
        title: "Unauthorized Search",
        description: "You don't have permission to search users.",
      },
      server: {
        title: "Search Server Error",
        description: "A server error occurred while searching users.",
      },
      unknown: {
        title: "Search Error",
        description: "An unexpected error occurred while searching users.",
      },
    },
    success: {
      title: "Search Successful",
      description: "Search completed successfully.",
    },
  },
};
