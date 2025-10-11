export const errorsTranslations = {
  title: "Import Failed",
  description: "There was an error importing your templates",
  validation: {
    title: "Validation Error",
    description: "Please check your data format and try again",
  },
  server: {
    title: "Server Error",
    description: "An unexpected error occurred during import",
  },
  fileFormat: {
    title: "Invalid File Format",
    description: "The selected format doesn't match your data",
  },
  dataEmpty: {
    title: "No Data",
    description: "Import data cannot be empty",
  },
  csvFormat: {
    title: "Invalid CSV Format",
    description: "CSV data should contain commas and line breaks",
  },
  jsonFormat: {
    title: "Invalid JSON Format",
    description: "The provided JSON data is not valid",
  },
  xmlFormat: {
    title: "Invalid XML Format",
    description: "XML data should contain valid XML tags",
  },
  unsupported_format: "Unsupported format",
  csv_min_rows: "CSV must have header and at least one data row",
  xml_not_implemented: "XML parsing not implemented in this demo",
  missing_required_fields:
    "Missing required fields: name and content are required",
  invalid_status: "Invalid status",
  database_error: "Database error occurred: {{error}}",
};
