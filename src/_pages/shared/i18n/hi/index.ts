import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  error: {
    title: "एरर",
    message: "कुछ गड़बड़ हो गई। फिर से कोशिश करें।",
    general: {
      unknown_validation_error: "एक अज्ञात वैलिडेशन एरर आया।",
    },
  },
  errorTypes: {
    auth_error: "ऑथेंटिकेशन एरर",
    bad_request: "ग़लत रिक्वेस्ट",
    database_error: "डेटाबेस एरर",
    email_error: "ईमेल एरर",
    external_service_error: "बाहरी सर्विस एरर",
    forbidden: "अनुमति नहीं",
    http_error: "HTTP एरर",
    internal_error: "इंटरनल एरर",
    invalid_credentials_error: "ग़लत लॉगिन जानकारी",
    invalid_data_error: "ग़लत डेटा",
    invalid_format_error: "ग़लत फ़ॉर्मेट",
    invalid_input_error: "ग़लत इनपुट",
    invalid_method_error: "ग़लत मेथड",
    invalid_parameter_error: "ग़लत पैरामीटर",
    invalid_path_error: "ग़लत पाथ",
    invalid_payload_error: "ग़लत पेलोड",
    invalid_query_error: "ग़लत क्वेरी",
    invalid_request_error: "ग़लत रिक्वेस्ट",
    invalid_response_error: "ग़लत रिस्पॉन्स",
    invalid_status_error: "ग़लत स्टेटस",
    invalid_token_error: "ग़लत टोकन",
    invalid_url_error: "ग़लत URL",
    no_response_data: "रिस्पॉन्स में कोई डेटा नहीं",
    not_found: "नहीं मिला",
    partial_failure: "आंशिक रूप से फ़ेल",
    payment_failed: "पेमेंट फ़ेल हो गया",
    payment_required: "पेमेंट ज़रूरी है",
    permission_denied: "अनुमति नहीं मिली",
    permission_error: "अनुमति एरर",
    sms_error: "SMS एरर",
    token_expired_error: "टोकन एक्सपायर हो गया",
    email_confirmation_required: "ईमेल कन्फ़र्मेशन कोड",
    two_factor_required: "टू फ़ैक्टर ऑथेंटिकेशन ज़रूरी है",
    unauthorized: "अनधिकृत",
    unknown_error: "अज्ञात एरर",
    validation_error: "वैलिडेशन एरर",
  },
  stats: {
    chartType: {
      area: "एरिया",
      bar: "बार",
      donut: "डोनट",
      line: "लाइन",
      pie: "पाई",
    },
    dateRange: {
      custom: "कस्टम",
      last30Days: "पिछले 30 दिन",
      last7Days: "पिछले 7 दिन",
      last90Days: "पिछले 90 दिन",
      lastMonth: "पिछला महीना",
      lastQuarter: "पिछली तिमाही",
      lastWeek: "पिछला हफ़्ता",
      lastYear: "पिछला साल",
      thisMonth: "इस महीने",
      thisQuarter: "इस तिमाही",
      thisWeek: "इस हफ़्ते",
      thisYear: "इस साल",
      today: "आज",
      yesterday: "कल",
    },
    timePeriod: {
      day: "दिन",
      month: "महीना",
      quarter: "तिमाही",
      week: "हफ़्ता",
      year: "साल",
    },
  },
  errors: {
    invalid_request_data: "ग़लत रिक्वेस्ट डेटा",
    serverError: {
      description: "सर्वर में गड़बड़ हुई। फिर से कोशिश करें।",
    },
    validationFailed: {
      description: "वैलिडेशन फ़ेल हुआ। अपना इनपुट जाँचें।",
    },
  },
  cli: {
    vibe: {
      errors: {
        routeNotFound: "इस टूल के लिए रूट नहीं मिला: {{toolName}}",
        routeUnavailableOnServer:
          "{{toolName}} सिर्फ़ vibe CLI में चलता है। यह सर्वर इसे नहीं देता।",
        executionFailed: "एक्ज़िक्यूशन फ़ेल हुआ",
        unknownError: "एक अज्ञात एरर आया",
        unknownErrorDetail: "एक अज्ञात एरर आया: {{error}}",
      },
    },
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "एंडपॉइंट डेफ़िनिशन एरर",
        platformAccessDenied: "{{platform}} पर एक्सेस नहीं मिला: {{reason}}",
        insufficientRoles:
          "यूज़र {{userId}} के पास ज़रूरी रोल नहीं हैं: {{requiredRoles}}",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "एंडपॉइंट नहीं मिला",
            loadFailed: "एंडपॉइंट लोड नहीं हो पाया",
            batchLoadFailed: "एंडपॉइंट लोड नहीं हो पाए",
          },
        },
      },
    },
  },
  utils: {
    parseJsonWithComments: {
      errors: {
        invalid_json: "ग़लत JSON",
      },
    },
    time: {
      errors: {
        invalid_time_format: {
          title: "ग़लत समय फ़ॉर्मेट",
        },
        invalid_time_range: {
          title: "ग़लत समय सीमा",
        },
      },
    },
  },
};
