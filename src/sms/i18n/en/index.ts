export const translations = {
  sms: {
    error: {
      invalid_phone_format:
        "Invalid phone number format. Please provide a valid phone number.",
      invalid_phone_format_reason: "Invalid phone number format: {{reason}}",
      delivery_failed: "Failed to deliver SMS to {{phoneNumber}}: {{error}}",
      delivery_failed_http:
        "Failed to deliver SMS to {{phoneNumber}}: {{error}} (HTTP {{status}})",
      delivery_failed_code:
        "Failed to deliver SMS to {{phoneNumber}}: {{error}} (code {{code}})",
      delivery_failed_status:
        "Failed to deliver SMS to {{phoneNumber}} (HTTP {{status}})",
      unexpected_error: "Unexpected error while sending SMS: {{error}}",
      all_failed: "All {{totalResults}} SMS messages failed to send",
      batch_delivery_failed: "{{errorCount}} SMS messages failed to deliver",
      partial_failure:
        "Some SMS messages failed to send. Successful: {{successCount}}, Failed: {{failureCount}}",
      rendering_failed: "Failed to render SMS template: {{error}}",
      send_failed: "Failed to send SMS: {{error}}",
      batch_send_failed: "Batch SMS send failed: {{error}}",
      missing_aws_access_key: "AWS Access Key is missing",
      missing_aws_secret_key: "AWS Secret Key is missing",
      missing_aws_region: "AWS Region is missing",
      missing_recipient: "Recipient phone number is missing",
      empty_message: "SMS message cannot be empty",
      aws_sns_api_error: "AWS SNS API error: {{error}}",
      aws_sns_api_error_http: "AWS SNS API error: {{error}} (HTTP {{status}})",
      aws_sns_error: "AWS SNS error occurred",
      unknown_error: "Unknown error",
      unknown_provider_error: "Unknown {{provider}} error",
      error_code: "Error {{code}}",
      unknown_code: "unknown",
    },
  },
};
