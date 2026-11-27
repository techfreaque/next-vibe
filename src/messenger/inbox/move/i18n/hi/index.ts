import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "मैसेज मूव करें",
  titleShort: "मैसेज मूव करें",
  description: "मैसेज को दूसरे फ़ोल्डर में ले जाएँ",
  tag: "इनबॉक्स",

  container: {
    title: "मैसेज मूव करें",
    description: "मैसेज को एक फ़ोल्डर से दूसरे में ले जाएँ",
  },

  accountId: {
    label: "अकाउंट",
    description: "मैसेंजर अकाउंट",
    placeholder: "अकाउंट UUID",
  },
  uid: {
    label: "मैसेज UID",
    description: "मूव करने वाले मैसेज का UID",
    placeholder: "12345",
  },
  fromFolder: {
    label: "किस फ़ोल्डर से",
    description: "मौजूदा फ़ोल्डर पाथ",
    placeholder: "INBOX",
  },
  toFolder: {
    label: "किस फ़ोल्डर में",
    description: "गंतव्य फ़ोल्डर पाथ",
    placeholder: "आर्काइव",
  },

  moved: { label: "मूव हो गया" },

  errors: {
    validation: { title: "वैलिडेशन एरर", description: "अपना इनपुट जाँचें" },
    unauthorized: { title: "अनधिकृत", description: "लॉगिन ज़रूरी है" },
    server: {
      title: "सर्वर एरर",
      description: "इंटरनल सर्वर एरर",
      detail: "मूव फ़ेल हुआ: {{error}}",
    },
    unknown: { title: "अज्ञात एरर", description: "अनपेक्षित एरर" },
    forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
    network: { title: "नेटवर्क एरर", description: "नेटवर्क एरर" },
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
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
  },

  success: {
    title: "मैसेज मूव हो गया",
    description: "मैसेज सफलतापूर्वक मूव हो गया",
  },
};
