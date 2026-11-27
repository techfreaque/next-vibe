import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    threads: "थ्रेड",
  },
  patch: {
    title: "थ्रेड का नाम बदलें",
    titleShort: "थ्रेड का नाम बदलें",
    description: "चैट थ्रेड का टाइटल और प्रीव्यू अपडेट करें",
    container: {
      title: "थ्रेड का नाम बदलें",
      description: "थ्रेड का नया टाइटल या प्रीव्यू तय करें",
    },
    threadId: {
      label: "थ्रेड ID",
      description: "जिस थ्रेड का नाम बदलना है उसकी ID",
    },
    threadTitle: {
      label: "टाइटल",
      description: "थ्रेड का नया टाइटल",
      placeholder: "थ्रेड का टाइटल लिखें...",
    },
    preview: {
      label: "प्रीव्यू",
      description: "थ्रेड का छोटा विवरण या प्रीव्यू टेक्स्ट",
      placeholder: "प्रीव्यू टेक्स्ट लिखें...",
    },
    response: {
      threadId: {
        content: "थ्रेड ID",
      },
      title: {
        content: "टाइटल",
      },
      preview: {
        content: "प्रीव्यू",
      },
      updatedAt: {
        content: "अपडेट का समय",
      },
    },
    errors: {
      validation: {
        title: "ग़लत इनपुट",
        description: "जाँचें कि threadId सही UUID है और कम से कम एक फ़ील्ड दी गई है",
        noActiveThread: "स्ट्रीम कॉन्टेक्स्ट में कोई एक्टिव थ्रेड नहीं है",
        folderUnresolved: "थ्रेड का फ़ोल्डर पता नहीं चल पाया",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "थ्रेड का नाम बदलने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस मना",
        description: "आपको इस थ्रेड का नाम बदलने की अनुमति नहीं है",
      },
      notFound: {
        title: "थ्रेड नहीं मिला",
        description: "इस ID का कोई थ्रेड नहीं है",
        detail: "थ्रेड नहीं मिला: {{threadId}}",
      },
      server: {
        title: "सर्वर एरर",
        description: "थ्रेड का नाम नहीं बदल पाया",
        detail: "सर्वर एरर: {{error}}",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच पाया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ गड़बड़ हो गई",
      },
      unsavedChanges: {
        title: "अनसेव्ड बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "किसी और ने यह थ्रेड बदल दिया है",
      },
    },
    success: {
      title: "थ्रेड का नाम बदल गया",
      description: "थ्रेड का टाइटल और प्रीव्यू अपडेट हो गए",
    },
    backButton: {
      label: "रद्द करें",
    },
    submitButton: {
      label: "सेव करें",
      loadingText: "सेव हो रहा है...",
    },
    dynamicTitle: "थ्रेड का नाम बदलें: {{title}}",
  },
};
