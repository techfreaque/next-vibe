export const smsTranslations = {
  errors: {
    invalid_parameters: "Invalid SMS parameters",
    recipient_required: "Recipient phone number (to) is required",
    from_required:
      "From phone number is required (either in params or SMS_FROM_NUMBER env var)",
    empty_message: "Message content cannot be empty",
    twilio_api_error: "Twilio API error {{errorCode}}: {{errorMessage}}",
    twilio_error: "Twilio error: {{error}}",
    messagebird_api_error: "MessageBird API error: {{errorMessage}}",
    messagebird_error: "MessageBird error: {{error}}",
    http_api_error: "HTTP SMS API error {{status}}: {{message}}",
    http_error: "HTTP SMS API error: {{error}}",
    missing_phone_number: "Phone number is required for SMS",
    marketing_consent_required: "Marketing consent is required for SMS",
    verification_requires_phone:
      "Phone number is required for verification SMS",
  },
};
