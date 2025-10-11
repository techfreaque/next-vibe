export const processingTranslations = {
  error: {
    unauthorized: {
      title: "Unauthorized",
      description:
        "You are not authorized to process emails through the agent.",
    },
    validation: {
      title: "Validation error",
      description: "Invalid parameters provided for email processing.",
    },
    server: {
      title: "Server error",
      description:
        "An error occurred while processing emails through the agent.",
    },
    unknown: {
      title: "Unknown error",
      description: "An unknown error occurred during email processing.",
    },
    api_error: {
      title: "API error",
      description: "API request failed: {{error}}",
    },
    api_timeout: {
      title: "API timeout",
      description: "API request timed out",
    },
    api_key_not_configured: {
      title: "API key not configured",
      description: "API key is not properly configured",
    },
    llm_provider_unsupported: {
      title: "Unsupported LLM provider",
      description: "The specified LLM provider is not supported",
    },
    template_not_found: {
      title: "Template not found",
      description: "The requested prompt template was not found",
    },
    analysis_failed: {
      title: "Analysis failed",
      description: "Email analysis could not be completed",
    },
    response_generation_failed: {
      title: "Response generation failed",
      description: "Failed to generate email response",
    },
  },
  success: {
    title: "Processing started",
    description:
      "Email processing through the agent has been started successfully.",
    analysis_completed: "Advanced AI analysis completed with high confidence",
    ai_analysis_completed: "AI analysis completed successfully",
  },
};
