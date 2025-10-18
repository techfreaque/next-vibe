export const translations = {
  success: {
    title: "Import job action completed",
    description: "The requested action has been performed",
    job_stopped: "Job stopped successfully",
    job_queued_retry: "Job queued for retry",
    job_deleted: "Job deleted successfully",
  },
  error: {
    validation: {
      title: "Lead import validation failed",
      description: "Please check your CSV file and try again",
      failed: "CSV row validation failed",
      invalidData: "Invalid data in CSV row",
      missingFields: "Required fields are missing",
      invalidEmail: "Invalid email address in CSV row",
      email_required: "Email is required",
      invalid_email_format: "Invalid email format",
    },
    unauthorized: {
      title: "Lead import unauthorized",
      description: "You don't have permission to import leads",
    },
    server: {
      title: "Lead import server error",
      description: "Unable to import leads due to a server error",
    },
    unknown: {
      title: "Lead import failed",
      description: "An unexpected error occurred while importing leads",
    },
    forbidden: {
      title: "Lead import forbidden",
      description: "You don't have permission to import leads",
    },
    not_found: {
      title: "Import job not found",
      description: "The requested import job could not be found",
    },
    stopped_by_user: "Stopped by user",
  },
};
