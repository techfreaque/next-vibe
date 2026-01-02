export const translations = {
  sms: {
    error: {
      invalid_phone_format: "Invalid phone number format. Please provide a valid phone number.",
      delivery_failed: "Failed to deliver SMS to {{phoneNumber}}: {{error}}",
      unexpected_error: "Unexpected error occurred while sending SMS",
      all_failed: "All SMS messages failed to send",
      partial_failure:
        "Some SMS messages failed to send. Successful: {{successCount}}, Failed: {{failureCount}}",
      rendering_failed: "Failed to render SMS template",
      send_failed: "Failed to send SMS",
      batch_send_failed: "Batch SMS send failed",
      missing_aws_access_key: "AWS Access Key is missing",
      missing_aws_secret_key: "AWS Secret Key is missing",
      missing_aws_region: "AWS Region is missing",
      missing_recipient: "Recipient phone number is missing",
      empty_message: "SMS message cannot be empty",
      aws_sns_api_error: "AWS SNS API error: {{error}}",
      aws_sns_error: "AWS SNS error occurred",
    },
  },
};
