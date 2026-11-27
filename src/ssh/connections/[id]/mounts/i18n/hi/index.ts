import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    noRowReturned: "इन्सर्ट से कोई रो नहीं लौटी",
    notYourConnection: "ये कनेक्शन आपका नहीं है",
    mountNotFound: "माउंट नहीं मिला",
  },

  list: {
    title: "माउंट की डायरेक्टरी",
    titleShort: "माउंट",
    description:
      "इस कनेक्शन के नाम वाले डायरेक्टरी शॉर्टकट। हर माउंट cortex में /ssh/<connection>/<name>/ के रूप में दिखता है। टर्मिनल डिफ़ॉल्ट माउंट डायरेक्टरी में शुरू होते हैं।",
    fields: {
      connectionId: {
        label: "कनेक्शन",
        description: "वो SSH कनेक्शन जिसके ये माउंट हैं",
      },
    },
    response: {
      mounts: { title: "माउंट" },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "इनपुट जाँचें और दोबारा कोशिश करें",
      },
      unauthorized: { title: "अनधिकृत", description: "लॉगिन ज़रूरी है" },
      forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
      server: { title: "सर्वर एरर", description: "माउंट लोड नहीं हो सके" },
      notFound: { title: "नहीं मिला", description: "कनेक्शन नहीं मिला" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "इस कनेक्शन पर ये माउंट नाम पहले से है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच सके",
      },
    },
    success: {
      title: "माउंट लोड हो गए",
      description: "इस कनेक्शन के डायरेक्टरी माउंट",
    },
  },

  create: {
    title: "माउंट जोड़ें",
    titleShort: "माउंट जोड़ें",
    description:
      "नाम वाला डायरेक्टरी शॉर्टकट जोड़ें। नाम पाथ का हिस्सा बन जाता है: /ssh/<connection>/<name>/",
    fields: {
      connectionId: {
        label: "कनेक्शन ID",
        description: "वो SSH कनेक्शन जिसमें माउंट जोड़ना है",
      },
      path: {
        label: "डायरेक्टरी पाथ",
        description:
          "मशीन पर पूरा पाथ, जैसे /home/max/project। Cortex सेगमेंट = बेसनेम। ये डिफ़ॉल्ट माउंट हो तो टर्मिनल की डिफ़ॉल्ट cwd।",
        placeholder: "/home/user/project",
      },
      isDefault: {
        label: "डिफ़ॉल्ट माउंट",
        description:
          "नए टर्मिनल सेशन इसी डायरेक्टरी में शुरू होते हैं। हर कनेक्शन पर सिर्फ़ एक माउंट डिफ़ॉल्ट हो सकता है।",
      },
    },
    response: {
      id: { title: "माउंट ID" },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "फ़ॉर्म की फ़ील्ड जाँचें और दोबारा कोशिश करें",
      },
      unauthorized: { title: "अनधिकृत", description: "लॉगिन ज़रूरी है" },
      forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
      server: {
        title: "सर्वर एरर",
        description: "माउंट सेव नहीं हो सका",
      },
      notFound: { title: "नहीं मिला", description: "कनेक्शन नहीं मिला" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "नाम लिया जा चुका है",
        description: "इस कनेक्शन पर इस नाम का माउंट पहले से है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच सके",
      },
    },
    success: {
      title: "माउंट जुड़ गया",
      description: "डायरेक्टरी माउंट सफलतापूर्वक जुड़ गया",
    },
  },

  detail: {
    titleGet: "माउंट",
    titleShortGet: "माउंट",
    descriptionGet: "माउंट की हुई डायरेक्टरी का शॉर्टकट देखें।",
    titlePatch: "माउंट एडिट करें",
    titleShortPatch: "माउंट एडिट करें",
    descriptionPatch: "माउंट की हुई डायरेक्टरी के शॉर्टकट का नाम बदलें या उसे हिलाएँ।",
    titleDelete: "माउंट हटाएँ",
    titleShortDelete: "माउंट हटाएँ",
    descriptionDelete: "इस कनेक्शन से डायरेक्टरी माउंट शॉर्टकट हटाएँ।",
    fields: {
      mountId: {
        label: "माउंट ID",
        description: "इस माउंट की यूनिक पहचान",
      },
      path: {
        label: "डायरेक्टरी पाथ",
        description: "मशीन पर पूरा पाथ। Cortex सेगमेंट = बेसनेम।",
        placeholder: "/home/user/project",
      },
      isDefault: {
        label: "डिफ़ॉल्ट माउंट",
        description: "नए टर्मिनल सेशन इसी डायरेक्टरी में शुरू होते हैं",
      },
    },
    response: {
      id: { title: "माउंट ID" },
      name: { title: "नाम" },
      path: { title: "पाथ" },
      isDefault: { title: "डिफ़ॉल्ट" },
      createdAt: { title: "बनाया गया" },
      updatedAt: { title: "अपडेट किया गया" },
      deleted: { title: "हटा दिया गया" },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "इनपुट जाँचें और दोबारा कोशिश करें",
      },
      unauthorized: { title: "अनधिकृत", description: "लॉगिन ज़रूरी है" },
      forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
      server: { title: "सर्वर एरर", description: "माउंट अपडेट नहीं हो सका" },
      notFound: { title: "नहीं मिला", description: "माउंट नहीं मिला" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "नाम लिया जा चुका है",
        description: "इस कनेक्शन पर इस नाम का माउंट पहले से है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच सके",
      },
    },
    successGet: { title: "माउंट लोड हो गया", description: "माउंट का ब्योरा" },
    successPatch: {
      title: "माउंट अपडेट हो गया",
      description: "माउंट सफलतापूर्वक अपडेट हुआ",
    },
    successDelete: {
      title: "माउंट हट गया",
      description: "माउंट सफलतापूर्वक हट गया",
    },
    widget: {
      confirmDelete: "ये माउंट हटाएँ?",
    },
  },

  widget: {
    noMounts: "कोई माउंट कॉन्फ़िगर नहीं",
    noMountsHint:
      "डायरेक्टरी शॉर्टकट बनाने के लिए माउंट जोड़ें। टर्मिनल डिफ़ॉल्ट माउंट डायरेक्टरी में शुरू होंगे।",
    addMount: "माउंट जोड़ें",
    defaultBadge: "डिफ़ॉल्ट",
    cortexPath: "Cortex पाथ",
    cortexPathPrefix: "/ssh/…/",
    pathArrow: "→",
  },
};
