import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "इनबॉक्स की सूची",
  titleShort: "इनबॉक्स",
  description: "इनबॉक्स या किसी खास फ़ोल्डर के मैसेज की सूची",
  tag: "इनबॉक्स",
  container: {
    title: "इनबॉक्स मैसेज",
    description: "चुने हुए अकाउंट और फ़ोल्डर के मैसेज",
  },
  accountId: {
    label: "अकाउंट",
    description: "जिस मैसेंजर अकाउंट का इनबॉक्स पढ़ना है",
    placeholder: "अकाउंट UUID",
  },
  folderPath: {
    label: "फ़ोल्डर",
    description: "सूची के लिए फ़ोल्डर पाथ (डिफ़ॉल्ट INBOX)",
    placeholder: "INBOX",
  },
  messages: {
    label: "मैसेज",
    uid: {
      label: "UID",
    },
    messageId: {
      label: "मैसेज ID",
    },
    subject: {
      label: "विषय",
    },
    from: {
      label: "भेजने वाला",
    },
    to: {
      label: "पाने वाला",
    },
    date: {
      label: "तारीख़",
    },
    isRead: {
      label: "पढ़ा गया",
    },
    isFlagged: {
      label: "फ़्लैग किया",
    },
    folderPath: {
      label: "फ़ोल्डर",
    },
    bodyText: {
      label: "मुख्य भाग",
    },
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
      detail: "इनबॉक्स लोड नहीं हो सका: {{error}}",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "अनपेक्षित एरर",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "एक्सेस नहीं मिला",
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
      title: "बिना सेव बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
  },
  success: {
    title: "इनबॉक्स लोड हुआ",
    description: "मैसेज सफलतापूर्वक मिल गए",
  },
};
