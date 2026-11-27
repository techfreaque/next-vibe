import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errorTypes: {
    auth_error: "ऑथेंटिकेशन एरर",
    bad_request: "ग़लत रिक्वेस्ट",
    conflict: "टकराव",
    purchased_model_required:
      "इस मॉडल के लिए खरीदे हुए क्रेडिट चाहिए। कोई फ़्री मॉडल चुनें या क्रेडिट जोड़ें।",
    shared_allowance_reached:
      "आपका साझा फ़्री कोटा ख़त्म हो गया है। क्रेडिट जोड़ें या अगली विंडो का इंतज़ार करें।",
    consent_required: "सहमति ज़रूरी है",
    database_error: "डेटाबेस एरर",
    email_error: "ईमेल एरर",
    external_service_error: "बाहरी सर्विस एरर",
    forbidden: "प्रतिबंधित",
    http_error: "HTTP एरर",
    internal_error: "आंतरिक एरर",
    invalid_credentials_error: "क्रेडेंशियल ग़लत हैं",
    invalid_data_error: "अमान्य डेटा",
    invalid_format_error: "अमान्य फ़ॉर्मेट",
    invalid_input_error: "अमान्य इनपुट",
    invalid_method_error: "अमान्य मेथड",
    invalid_parameter_error: "अमान्य पैरामीटर",
    invalid_path_error: "अमान्य पाथ",
    invalid_payload_error: "अमान्य पेलोड",
    invalid_query_error: "अमान्य क्वेरी",
    invalid_request_error: "अमान्य रिक्वेस्ट",
    invalid_response_error: "अमान्य रिस्पॉन्स",
    invalid_status_error: "अमान्य स्टेटस",
    invalid_token_error: "अमान्य टोकन",
    invalid_url_error: "अमान्य URL",
    no_response_data: "कोई रिस्पॉन्स डेटा नहीं",
    not_found: "नहीं मिला",
    partial_failure: "आंशिक विफलता",
    payment_failed: "पेमेंट विफल रहा",
    payment_required: "पेमेंट ज़रूरी है",
    permission_denied: "अनुमति नहीं मिली",
    permission_error: "अनुमति एरर",
    sms_error: "SMS एरर",
    token_expired_error: "टोकन एक्सपायर हो गया",
    email_confirmation_required: "ईमेल कन्फ़र्मेशन कोड",
    two_factor_required: "टू-फ़ैक्टर ऑथेंटिकेशन ज़रूरी है",
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
    invalid_request_data: "रिक्वेस्ट डेटा अमान्य है",
    invalidLocaleDetail: 'Invalid locale "{{locale}}"',
    invalidRequestDataDetail: "रिक्वेस्ट डेटा अमान्य है: {{error}}",
    invalidResponseDetail: "रिस्पॉन्स डेटा अमान्य है: {{error}}",
    invalidErrorResponseDetail: "एरर रिस्पॉन्स ग़लत फ़ॉर्मेट में है: {{error}}",
    csrfFailedDetail: "CSRF सुरक्षा ने रिक्वेस्ट रोक दी: {{reason}}",
    csrfReasonUnknown: "CSRF टोकन वैलिडेशन विफल रहा",
    uploadTooLargeDetail:
      "अपलोड बहुत बड़ा है: {{size}} MB। एक मैसेज में फ़ाइलें {{limit}} MB तक जा सकती हैं। कोई फ़ाइल हटाएँ या छोटी करें और दोबारा भेजें।",
    internalDetail: "आंतरिक एरर: {{error}}",
    authenticationFailed: "यूज़र ऑथेंटिकेशन विफल रहा",
  },
  validation: {
    invalidEmail: "सही ईमेल एड्रेस लिखें।",
    missingFields: "ज़रूरी फ़ील्ड गायब हैं ({{count}}):",
    failedOne: "वैलिडेशन विफल (1 एरर):",
    failedMany: "वैलिडेशन विफल ({{count}} एरर):",
    cliHints:
      "\n\nउदाहरण:\n  {{example}}\n\nया इंटरैक्टिव चलाएँ:\n  {{interactive}}\n\nऔर जानकारी:\n  {{help}}",
    report: "{{header}}{{fields}}{{hints}}",
    unexpected: "वैलिडेशन अनपेक्षित रूप से विफल रहा: {{error}}",
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "एंडपॉइंट डेफ़िनिशन एरर: {{reason}}",
        allowedRolesMissing:
          "एंडपॉइंट डेफ़िनिशन एरर: allowedRoles गायब है या सूची नहीं है",
        platformAccessDenied: {
          productionDisabled:
            "{{platform}} पर एक्सेस नहीं मिला: यह एंडपॉइंट प्रोडक्शन में बंद है",
          platformExcluded:
            "{{platform}} पर एक्सेस नहीं मिला: यह एंडपॉइंट इस प्लेटफ़ॉर्म पर उपलब्ध नहीं है",
          cliPackageAuthRequired:
            "{{platform}} पर एक्सेस नहीं मिला: इस एंडपॉइंट को ऑथेंटिकेशन चाहिए, जो CLI पैकेज नहीं दे सकता",
          mcpNotListed:
            "{{platform}} पर एक्सेस नहीं मिला: यह एंडपॉइंट MCP पर लिस्टेड नहीं है",
        },
        insufficientRoles:
          "यूज़र {{userId}} के पास ज़रूरी रोल नहीं हैं: {{requiredRoles}} (मौजूदा: {{userRoles}})",
        insufficientRolesNoRoles:
          "यूज़र {{userId}} के पास ज़रूरी रोल नहीं हैं: {{requiredRoles}} (मौजूदा: कोई नहीं)",
        insufficientRolesPublic:
          "पब्लिक यूज़र के पास ज़रूरी रोल नहीं हैं: {{requiredRoles}} (मौजूदा: {{userRoles}})",
        insufficientRolesPublicNoRoles:
          "पब्लिक यूज़र के पास ज़रूरी रोल नहीं हैं: {{requiredRoles}} (मौजूदा: कोई नहीं)",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "एंडपॉइंट नहीं मिला: {{identifier}}",
            loadFailed: "एंडपॉइंट {{identifier}} लोड नहीं हो सका: {{error}}",
            batchLoadFailed:
              "{{totalCount}} में से {{failedCount}} एंडपॉइंट लोड नहीं हो सके",
            batchLoadError:
              "{{totalCount}} में से {{failedCount}} एंडपॉइंट लोड नहीं हो सके: {{error}}",
          },
        },
      },
    },
  },
};
