import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  sms: {
    error: {
      invalid_phone_format: "फ़ोन नंबर का फ़ॉर्मेट गलत है। कृपया सही फ़ोन नंबर दें।",
      invalid_phone_format_reason: "फ़ोन नंबर का फ़ॉर्मेट गलत है: {{reason}}",
      delivery_failed: "{{phoneNumber}} को SMS डिलीवर नहीं हुआ: {{error}}",
      delivery_failed_http:
        "{{phoneNumber}} को SMS डिलीवर नहीं हुआ: {{error}} (HTTP {{status}})",
      delivery_failed_code:
        "{{phoneNumber}} को SMS डिलीवर नहीं हुआ: {{error}} (कोड {{code}})",
      delivery_failed_status:
        "{{phoneNumber}} को SMS डिलीवर नहीं हुआ (HTTP {{status}})",
      unexpected_error: "SMS भेजते समय अप्रत्याशित एरर: {{error}}",
      all_failed: "सभी {{totalResults}} SMS मैसेज भेजना फ़ेल हुआ",
      batch_delivery_failed: "{{errorCount}} SMS मैसेज डिलीवर नहीं हुए",
      partial_failure:
        "कुछ SMS मैसेज भेजना फ़ेल हुआ। सफल: {{successCount}}, फ़ेल: {{failureCount}}",
      rendering_failed: "SMS टेंप्लेट रेंडर करना फ़ेल हुआ: {{error}}",
      send_failed: "SMS भेजना फ़ेल हुआ: {{error}}",
      batch_send_failed: "बैच SMS भेजना फ़ेल हुआ: {{error}}",
      missing_aws_access_key: "AWS Access Key ग़ायब है",
      missing_aws_secret_key: "AWS Secret Key ग़ायब है",
      missing_aws_region: "AWS Region ग़ायब है",
      missing_recipient: "प्राप्तकर्ता का फ़ोन नंबर ग़ायब है",
      empty_message: "SMS मैसेज ख़ाली नहीं हो सकता",
      aws_sns_api_error: "AWS SNS API एरर: {{error}}",
      aws_sns_api_error_http: "AWS SNS API एरर: {{error}} (HTTP {{status}})",
      aws_sns_error: "AWS SNS एरर आई",
      unknown_error: "अनजान एरर",
      unknown_provider_error: "अनजान {{provider}} एरर",
      error_code: "एरर {{code}}",
      unknown_code: "unknown",
    },
  },
};
