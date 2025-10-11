export const smsTranslations = {
  errors: {
    missing_phone_number: "Phone number is required for SMS",
    marketing_consent_required: "Marketing consent is required for SMS",
    verification_requires_phone:
      "Phone number is required for verification SMS",
    delivery_failed:
      "Failed to deliver SMS message after multiple attempts: {{errorMessage}}",
    missing_recipient: "SMS recipient is required",
    empty_message: "SMS message cannot be empty",
    aws_sns_api_error: "AWS SNS API error: {{error}}",
    aws_sns_error: "AWS SNS error: {{error}}",
    twilio_api_error: "Twilio API error {{errorCode}}: {{error}}",
    twilio_error: "Twilio error: {{error}}",
    messagebird_api_error: "MessageBird API error: {{error}}",
    messagebird_error: "MessageBird error: {{error}}",
    http_api_error: "HTTP SMS API error {{status}}: {{message}}",
    http_error: "HTTP SMS API error: {{error}}",
    rendering_failed: "Failed to render SMS template",
    send_failed: "Failed to send SMS",
    batch_send_failed: "Failed to send batch SMS",
  },
  error: {
    no_phone: "User has no phone number",
    invalid_phone_format:
      "The provided phone number has an invalid format: {{reason}}",
    delivery_failed:
      "Failed to deliver SMS message after multiple attempts: {{errorMessage}}",
    unexpected_error:
      "An unexpected error occurred while sending SMS: {{errorMessage}}",
    all_failed: "All {{totalResults}} SMS messages failed to send",
    partial_failure:
      "{{failureCount}} out of {{totalCount}} SMS messages failed to send",
  },
  template: {
    notification:
      "{{appName}}: Hello {{firstName}}! You have a new notification. Check it out at {{appUrl}}",
  },
  marketing: {
    new_features:
      "{{appName}}: We've just released exciting new features! Log in to check them out.",
  },
  verification: {
    code: "{{appName}}: Your verification code is {{code}}. It expires in {{expiresInMinutes}} minutes.",
  },
  onboarding: {
    completion:
      "{{appName}}: Welcome! Your onboarding is complete. Start exploring your dashboard.",
    welcome:
      "{{appName}}: Welcome to Social Media Service Center! Your journey begins now.",
    progress:
      "{{appName}}: Onboarding progress update - Current step: {{step}}. Continue your setup.",
  },
};
