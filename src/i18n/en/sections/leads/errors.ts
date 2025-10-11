export const errorsTranslations = {
  create: {
    conflict: {
      title: "Lead Already Exists",
      description:
        "A lead with this email address already exists in the system.",
    },
    validation: {
      title: "Invalid Lead Data",
      description: "Please check the lead information and try again.",
    },
  },
  get: {
    notFound: {
      title: "Lead Not Found",
      description: "The requested lead could not be found.",
    },
  },
  update: {
    notFound: {
      title: "Lead Not Found",
      description: "The lead you're trying to update could not be found.",
    },
    validation: {
      title: "Invalid Update Data",
      description: "Please check the update information and try again.",
    },
  },
  import: {
    badRequest: {
      title: "Invalid CSV File",
      description: "The CSV file format is invalid or empty.",
    },
    validation: {
      title: "CSV Validation Error",
      description: "Some rows in the CSV file contain invalid data.",
    },
  },
};
