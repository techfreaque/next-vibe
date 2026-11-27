import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "पढ़ा हुआ करें",
  titleShort: "पढ़ा हुआ करें",
  description: "मैसेज को पढ़ा या अनपढ़ा चिह्नित करें",
  tag: "इनबॉक्स",
  container: {
    title: "मैसेज चिह्नित करें",
    description: "मैसेज का पढ़ने का स्टेटस अपडेट करें",
  },
  accountId: {
    label: "अकाउंट",
    description: "मैसेंजर अकाउंट",
    placeholder: "अकाउंट UUID",
  },
  uid: {
    label: "मैसेज UID",
    description: "मैसेज का UID",
    placeholder: "12345",
  },
  folderPath: {
    label: "फ़ोल्डर",
    description: "मैसेज वाले फ़ोल्डर का पाथ",
    placeholder: "INBOX",
  },
  isRead: {
    label: "पढ़ा हुआ चिह्नित करें",
    description: "पढ़ा हुआ करने के लिए true, अनपढ़ा के लिए false रखें",
  },
  updated: {
    label: "अपडेट हुआ",
  },
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "अपना इनपुट जाँचें",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "लॉगिन ज़रूरी है",
    },
    server: {
      title: "सर्वर एरर",
      description: "आंतरिक सर्वर एरर",
      detail: "पढ़ने का स्टेटस अपडेट नहीं हो सका: {{error}}",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "अनपेक्षित एरर",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "एक्सेस अस्वीकृत",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क एरर",
    },
    notFound: {
      title: "अकाउंट नहीं मिला",
      description: "मैसेंजर अकाउंट नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "रिक्वेस्ट मौजूदा डेटा से टकराती है",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
    },
  },
  success: {
    title: "मैसेज अपडेट हुआ",
    description: "पढ़ने का स्टेटस सफलतापूर्वक अपडेट हुआ",
  },
};
