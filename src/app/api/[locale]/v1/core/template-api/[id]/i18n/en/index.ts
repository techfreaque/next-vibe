/**
 * Template Item API translations for English
 */

export const translations = {
  // Common category and tags
  category: "Template API",
  tags: {
    template: "Template",
    get: "Retrieve",
    update: "Update",
    delete: "Delete",
  },

  // GET endpoint translations
  get: {
    title: "Get Template",
    description: "Retrieve a template by ID",
    form: {
      title: "Template Retrieval",
      description: "Specify the template ID to retrieve",
    },
    id: {
      label: "Template ID",
      description: "The unique identifier of the template",
      placeholder: "Enter template ID",
    },
    response: {
      title: "Template Response",
      description: "The retrieved template data",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided template ID is invalid",
      },
      notFound: {
        title: "Template Not Found",
        description: "No template found with the specified ID",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to access this template",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this template is forbidden",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving the template",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred during template retrieval",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that will be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during template retrieval",
      },
    },
    success: {
      title: "Template Retrieved",
      description: "Template has been successfully retrieved",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Update Template",
    description: "Update an existing template",
    form: {
      title: "Template Update",
      description: "Modify template properties",
    },
    id: {
      label: "Template ID",
      description: "The unique identifier of the template to update",
      placeholder: "Enter template ID",
    },
    name: {
      label: "Template Name",
      description: "The name of the template",
      placeholder: "Enter template name",
    },
    templateDescription: {
      label: "Description",
      help: "An optional description for the template",
      placeholder: "Enter template description",
    },
    content: {
      label: "Template Content",
      description: "The content/body of the template",
      placeholder: "Enter template content",
    },
    status: {
      label: "Status",
      description: "The current status of the template",
      placeholder: "Select template status",
    },
    tags: {
      label: "Tags",
      description: "Tags to categorize the template",
      placeholder: "Enter template tags",
    },
    response: {
      title: "Update Response",
      description: "The updated template data",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided template data is invalid",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred during template update",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to update this template",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to update this template is forbidden",
      },
      notFound: {
        title: "Template Not Found",
        description: "No template found with the specified ID to update",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating the template",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during update",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that will be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during template update",
      },
    },
    success: {
      title: "Template Updated",
      description: "Template has been successfully updated",
    },
  },

  // DELETE endpoint translations
  delete: {
    title: "Delete Template",
    description: "Delete an existing template",
    form: {
      title: "Template Deletion",
      description: "Confirm template deletion",
    },
    id: {
      label: "Template ID",
      description: "The unique identifier of the template to delete",
      placeholder: "Enter template ID",
    },
    response: {
      title: "Deletion Response",
      description: "Confirmation of template deletion",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided template ID is invalid",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred during template deletion",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to delete this template",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to delete this template is forbidden",
      },
      notFound: {
        title: "Template Not Found",
        description: "No template found with the specified ID to delete",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while deleting the template",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during deletion",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that will be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during template deletion",
      },
    },
    success: {
      title: "Template Deleted",
      description: "Template has been successfully deleted",
    },
  },
};
