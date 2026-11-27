import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "अकाउंट",
  tags: {
    remoteConnection: "रिमोट कनेक्शन",
  },
  widget: {
    title: "रिवर्स सिंक",
    description:
      "सिस्टम एंडपॉइंट। शुरू करने वाला इंस्टेंस syncScope बदलाव रिमोट की तरफ़ मिरर करने के लिए इसे कॉल करता है।",
    note: "यूज़र के लिए नहीं: कनेक्शन सेटिंग्स अपडेट होने पर अपने आप चलता है।",
  },
  patch: {
    title: "रिवर्स कनेक्शन अपडेट करें",
    titleShort: "रिवर्स अपडेट",
    description:
      "शुरू करने वाला इंस्टेंस कनेक्शन सेटिंग्स दूसरी तरफ़ सिंक करने के लिए इसे कॉल करता है",
    syncScope: {
      label: "सिंक स्कोप",
      description: "इस कनेक्शन पर कौन से डेटा डोमेन सिंक हों",
    },
    newInstanceId: {
      label: "नए इंस्टेंस का नाम",
      description: "कॉल करने वाले का नया इंस्टेंस नाम: हमारे यहाँ उसका लेबल अपडेट करता है",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना ब्योरा जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "लॉग इन नहीं",
        description: "कनेक्शन अपडेट करने के लिए आपका लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपको यह कनेक्शन अपडेट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "इस इंस्टेंस के लिए कोई रिवर्स कनेक्शन नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "कनेक्शन अपडेट करते समय एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "कनेक्शन अपडेट करते समय टकराव हुआ",
      },
    },
    success: {
      title: "कनेक्शन अपडेट हुआ",
      description: "रिवर्स कनेक्शन की सेटिंग्स अपडेट हो गई हैं",
    },
  },
};
