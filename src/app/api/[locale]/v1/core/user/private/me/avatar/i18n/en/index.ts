export const translations = {
  tag: "avatar",
  errors: {
    user_not_found: "User not found",
    failed_to_upload_avatar: "Failed to upload avatar",
    failed_to_delete_avatar: "Failed to delete avatar",
  },
  debug: {
    errorUploadingUserAvatar: "Error uploading user avatar",
    errorDeletingUserAvatar: "Error deleting user avatar",
  },
  success: {
    uploaded: "Avatar uploaded successfully",
    deleted: "Avatar deleted successfully",
    nextSteps: {
      visible: "Your avatar is now visible on your profile",
      update: "You can update it anytime from your profile settings",
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
};
