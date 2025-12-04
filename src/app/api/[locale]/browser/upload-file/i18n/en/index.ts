export const translations = {
  title: "Upload File",
  description: "Upload a file through a provided element",
  form: {
    label: "Upload File",
    description: "Upload a file to a file input element",
    fields: {
      uid: {
        label: "Element UID",
        description: "The uid of the file input element or an element that will open file chooser",
        placeholder: "Enter element uid",
      },
      filePath: {
        label: "File Path",
        description: "The local path of the file to upload",
        placeholder: "Enter file path",
      },
    },
  },
  response: {
    success: "File upload operation successful",
    result: "File upload operation result",
    error: "Error message",
    executionId: "Execution ID for tracking",
  },
  errors: {
    validation: { title: "Validation Error", description: "Please check your input and try again" },
    network: { title: "Network Error", description: "A network error occurred during the file upload operation" },
    unauthorized: { title: "Unauthorized", description: "You are not authorized to perform file upload operations" },
    forbidden: { title: "Forbidden", description: "File upload operation is forbidden" },
    notFound: { title: "Not Found", description: "The requested resource was not found" },
    serverError: { title: "Server Error", description: "An internal server error occurred during the file upload operation" },
    unknown: { title: "Unknown Error", description: "An unknown error occurred during the file upload operation" },
    unsavedChanges: { title: "Unsaved Changes", description: "You have unsaved changes that may be lost" },
    conflict: { title: "Conflict", description: "A conflict occurred during the file upload operation" },
  },
  success: {
    title: "File Upload Operation Successful",
    description: "The file was uploaded successfully",
  },
};
