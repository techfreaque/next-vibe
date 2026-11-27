import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र",
  post: {
    title: "सेशन क्लीनअप",
    titleShort: "सेशन साफ़ करें",
    description: "एक्सपायर हुए यूज़र सेशन और टोकन साफ़ करें",
    tag: "सेशन क्लीनअप",
    container: {
      title: "सेशन क्लीनअप",
      description: "सेशन क्लीनअप कॉन्फ़िगर करें और चलाएँ",
    },
    fields: {
      sessionRetentionDays: {
        label: "सेशन रखने के दिन",
        description: "सेशन कितने दिन रखने हैं",
      },
      tokenRetentionDays: {
        label: "टोकन रखने के दिन",
        description: "टोकन कितने दिन रखने हैं",
      },
      batchSize: {
        label: "बैच साइज़",
        description: "हर बैच में प्रोसेस होने वाले रिकॉर्ड की संख्या",
      },
      dryRun: {
        label: "ड्राई रन",
        description: "रिकॉर्ड असल में हटाए बिना चलाएँ",
      },
    },
    response: {
      sessionsDeleted: "हटाए गए सेशन",
      tokensDeleted: "हटाए गए टोकन",
      totalProcessed: "कुल प्रोसेस हुए",
      executionTimeMs: "एक्ज़ीक्यूशन समय (ms)",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "सेशन क्लीनअप चलाने के लिए एडमिन होना ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित",
      },
      server: {
        title: "सर्वर एरर",
        description: "क्लीनअप के दौरान आंतरिक सर्वर एरर",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुई",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "क्लीनअप कॉन्फ़िगरेशन गलत है",
      },
    },
    success: {
      title: "सेशन क्लीनअप पूरा हुआ",
      description: "सेशन और टोकन सफलतापूर्वक साफ़ हुए",
    },
  },
  task: {
    name: "सेशन क्लीनअप",
    description: "सिस्टम की सुरक्षा बनाए रखने के लिए एक्सपायर हुए यूज़र सेशन साफ़ करें",
    purpose: "सुरक्षा और परफ़ॉर्मेंस बनाए रखने के लिए एक्सपायर हुए सेशन हटाता है",
    impact: "पुराना सेशन डेटा हटाकर सिस्टम की परफ़ॉर्मेंस और सुरक्षा बेहतर करता है",
    rollback: "क्लीनअप कार्रवाइयों पर रोलबैक लागू नहीं होता",
  },
  errors: {
    default: "सेशन क्लीनअप के दौरान एरर हुई",
    execution_failed: {
      title: "सेशन क्लीनअप फ़ेल हुआ: {{error}}",
      description: "एक्सपायर हुए सेशन साफ़ नहीं हो सके",
    },
    partial_failure: {
      title: "सेशन क्लीनअप आंशिक रूप से फ़ेल: {{errors}}",
      description: "कुछ सेशन साफ़ नहीं हो सके",
    },
    unknown_error: {
      title: "अज्ञात सेशन क्लीनअप एरर",
      description: "सेशन क्लीनअप के दौरान अज्ञात एरर हुई",
    },
    invalid_session_retention: {
      title: "सेशन रखने की अवधि गलत",
      description: "सेशन रखने की अवधि गलत बताई गई",
    },
    invalid_token_retention: {
      title: "टोकन रखने की अवधि गलत",
      description: "टोकन रखने की अवधि गलत बताई गई",
    },
    invalid_batch_size: {
      title: "बैच साइज़ गलत",
      description: "क्लीनअप के लिए बैच साइज़ गलत बताया गया",
    },
    validation_failed: {
      title: "वैलिडेशन फ़ेल हुआ",
      description: "सेशन क्लीनअप कॉन्फ़िगरेशन का वैलिडेशन फ़ेल हुआ",
    },
  },
  success: {
    title: "सेशन क्लीनअप पूरा हुआ",
    description: "एक्सपायर हुए सेशन सफलतापूर्वक साफ़ हुए",
  },
  monitoring: {
    alertTrigger: "सेशन क्लीनअप टास्क फ़ेल हुआ",
  },
  documentation: {
    overview:
      "यह टास्क सुरक्षा और परफ़ॉर्मेंस बनाए रखने के लिए सिस्टम से एक्सपायर हुए यूज़र सेशन हटाता है",
  },
};
