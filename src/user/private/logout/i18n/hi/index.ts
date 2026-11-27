import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "यूज़र लॉगआउट",
  titleShort: "लॉग आउट",
  description: "मौजूदा यूज़र को लॉग आउट करता है और उसका सेशन अमान्य कर देता है",
  category: "यूज़र मैनेजमेंट",
  tag: "logout",
  logoutButton: "लॉग आउट",
  loggingOut: "लॉग आउट हो रहा है...",
  response: {
    title: "लॉगआउट रिस्पॉन्स",
    description: "सफल लॉगआउट बताने वाला रिस्पॉन्स",
    success: "सफल",
    message: "मैसेज",
    sessionsCleaned: "सेशन साफ़ हो गए",
    nextSteps: "लॉगआउट के बाद के सुझाए गए अगले कदम",
  },
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "लॉगआउट रिक्वेस्ट में अमान्य डेटा है",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "लॉग आउट करने के लिए आपका लॉग इन होना ज़रूरी है",
    },
    internal: {
      title: "आंतरिक सर्वर एरर",
      description: "लॉग आउट करते समय आंतरिक एरर हुआ",
      detail: "लॉगआउट विफल रहा: {{error}} (यूज़र {{userId}})",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "लॉगआउट के दौरान अनपेक्षित एरर हुआ",
    },
    session_deletion_failed: {
      title: "सेशन हटाना विफल रहा",
      description: "यूज़र सेशन हटाया नहीं जा सका",
    },
    conflict: {
      title: "लॉगआउट में टकराव",
      description: "लॉगआउट के दौरान टकराव हुआ",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "लॉगआउट की अनुमति नहीं है",
    },
    network_error: {
      title: "नेटवर्क एरर",
      description: "लॉगआउट के दौरान नेटवर्क एरर",
    },
    not_found: {
      title: "नहीं मिला",
      description: "सेशन नहीं मिला",
    },
    server_error: {
      title: "सर्वर एरर",
      description: "लॉगआउट के दौरान आंतरिक सर्वर एरर",
    },
    unsaved_changes: {
      title: "बिना सेव किए बदलाव",
      description: "बिना सेव किए बदलाव हैं",
    },
    invalid_user: {
      title: "अमान्य यूज़र",
      description: "यूज़र मान्य नहीं है या मौजूद नहीं है",
    },
  },
  success: {
    title: "लॉगआउट सफल",
    description: "आप सफलतापूर्वक लॉग आउट हो गए हैं",
    message: "यूज़र सफलतापूर्वक लॉग आउट हुआ",
  },
};
