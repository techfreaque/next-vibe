export const fieldsTranslations = {
  format: {
    label: "Import Format",
    placeholder: "Select import format",
    description: "Choose the format of your import data",
    options: {
      csv: "CSV (Comma Separated Values)",
      json: "JSON (JavaScript Object Notation)",
      xml: "XML (Extensible Markup Language)",
    },
  },
  mode: {
    label: "Import Mode",
    placeholder: "Select import mode",
    description: "Choose how to handle existing templates",
    options: {
      createonly: "Create Only - Skip existing templates",
      updateonly: "Update Only - Only update existing templates",
      createorupdate: "Create or Update - Create new and update existing",
    },
  },
  data: {
    label: "Import Data",
    placeholder: "Paste your CSV, JSON, or XML data here...",
    description: "The template data to import",
    help: "Ensure your data follows the correct format for the selected import type",
  },
  validateOnly: {
    label: "Validate Only",
    description: "Only validate the data without importing",
    help: "Use this to check your data format before performing the actual import",
  },
  skipErrors: {
    label: "Skip Errors",
    description: "Continue processing even if some rows have errors",
    help: "When enabled, rows with errors will be skipped and the import will continue",
  },
  defaultStatus: {
    label: "Default Status",
    placeholder: "Select default status",
    description: "Default status for imported templates",
    options: {
      draft: "Draft",
      published: "Published",
      archived: "Archived",
    },
  },
};
