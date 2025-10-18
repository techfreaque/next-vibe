export const translations = {
  button: "Import Leads",
  title: "Import Leads from CSV",
  description: "Upload a CSV file to import leads into your campaign system",
  template: {
    title: "Download Template",
    description: "Get the CSV template with required columns",
    download: "Download Template",
    examples: {
      example1:
        "john@example.com,Example Corp,John Doe,+1234567890,https://example.com,DE,en,website,Interested in premium features",
      example2:
        "jane@company.com,Company Inc,Jane Smith,+0987654321,https://company.com,PL,en,referral,Looking for social media automation",
    },
  },
  file: {
    label: "CSV File",
    dropzone: {
      title: "Drop your CSV file here",
      description: "or click to browse files",
    },
    validation: {
      required: "Please select a CSV file to upload",
    },
  },
  options: {
    title: "Import Options",
    description: "Configure how the import should handle existing data",
    skipDuplicates: "Skip leads with duplicate email addresses",
    updateExisting: "Update existing leads with new data",
  },
  batch: {
    title: "Batch Processing",
    description: "Configure how large imports should be processed",
    useChunkedProcessing: "Use batch processing",
    useChunkedProcessingDescription:
      "Process large CSV files in smaller batches via background jobs. Recommended for files with more than 1000 rows.",
    batchSize: "Batch size",
    batchSizeDescription: "Number of rows to process per batch (10-1000)",
    batchSizePlaceholder: "100",
  },
  defaults: {
    title: "Default Values",
    description: "Set default values for leads that don't specify these fields",
    country: "Default Country",
    countryDescription: "Country to use when not specified in CSV",
    countryPlaceholder: "Select default country",
    language: "Default Language",
    languageDescription: "Language to use when not specified in CSV",
    languagePlaceholder: "Select default language",
    status: "Default Status",
    statusDescription: "Status to use when not specified in CSV",
    statusPlaceholder: "Select default status",
    campaignStage: "Default Campaign Stage",
    campaignStageDescription: "Campaign stage to use when not specified in CSV",
    campaignStagePlaceholder: "Select default campaign stage",
    source: "Default Source",
    sourceDescription: "Source to use when not specified in CSV",
    sourcePlaceholder: "Select default source",
  },
  progress: {
    title: "Import Progress",
    processing: "Processing...",
  },
  status: {
    title: "Import Status",
    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
    failed: "Failed",
    unknown: "Unknown",
    rows: "rows",
    summary:
      "{{successful}} successful, {{failed}} failed, {{duplicates}} duplicates",
    andMore: "and {{count}} more",
    importing: "Importing",
    loading: "Loading import status...",
    activeJobs: "Active Import Jobs",
    preparing: "Preparing import...",
  },
  settings: {
    title: "Import Job Settings",
    description: "Adjust settings for this import job",
    batchSize: "Batch Size",
    maxRetries: "Max Retries",
  },
  success:
    "Successfully imported {{successful}} of {{total}} leads. {{failed}} failed, {{duplicates}} duplicates.",
  importing: "Importing...",
  start: "Start Import",
  error: {
    generic: "Import failed. Please check your file format and try again.",
    invalid_email_format: "Invalid email format",
    email_required: "Email is required",
  },
  errors: {
    noData: "No data found in the uploaded file",
    missingHeaders: "Missing required headers in CSV file",
  },
};
