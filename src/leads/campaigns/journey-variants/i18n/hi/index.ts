import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "जर्नी वेरिएंट",
  description: "ईमेल जर्नी वेरिएंट के रजिस्ट्रेशन मैनेज करें",
  enums: {
    campaignType: {
      leadCampaign: "लीड कैंपेन",
      newsletter: "न्यूज़लेटर",
      signupNurture: "साइनअप नर्चर",
      retention: "रिटेंशन",
      winback: "विनबैक",
      transactional: "ट्रांज़ैक्शनल",
      notification: "नोटिफ़िकेशन",
      system: "सिस्टम",
    },
  },
  get: {
    title: "जर्नी वेरिएंट",
    titleShort: "जर्नी वेरिएंट",
    description: "सभी रजिस्टर्ड ईमेल जर्नी वेरिएंट की लिस्ट",
    response: {
      id: "ID",
      variantKey: "वेरिएंट key",
      displayName: "डिस्प्ले नाम",
      description: "विवरण",
      weight: "वेट",
      active: "एक्टिव",
      campaignType: "कैंपेन टाइप",
      sourceFilePath: "सोर्स फ़ाइल पाथ",
      senderName: "भेजने वाले का नाम",
      companyName: "कंपनी का नाम",
      companyEmail: "कंपनी का ईमेल",
      checkErrors: "एरर जाँचें",
      createdAt: "बनाने का समय",
      updatedAt: "अपडेट का समय",
      items: "वेरिएंट",
      total: "कुल वेरिएंट",
    },
    errors: {
      unauthorized: { title: "अनधिकृत", description: "एडमिन होना ज़रूरी है" },
      forbidden: { title: "अनुमति नहीं", description: "अनुमति नहीं" },
      server: {
        title: "सर्वर एरर",
        description: "जर्नी वेरिएंट लोड नहीं हो सके",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      notFound: { title: "नहीं मिला", description: "नहीं मिला" },
      conflict: { title: "टकराव", description: "टकराव" },
      network: { title: "नेटवर्क एरर", description: "नेटवर्क एरर" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव",
      },
    },
    success: {
      title: "वेरिएंट लोड हो गए",
      description: "जर्नी वेरिएंट सफलतापूर्वक लोड हुए",
    },
  },
  post: {
    title: "जर्नी वेरिएंट रजिस्टर करें",
    titleShort: "नया वेरिएंट",
    description: "नया ईमेल जर्नी वेरिएंट रजिस्टर करें",
    fields: {
      variantKey: {
        label: "वेरिएंट key",
        description:
          "यूनिक पहचान (जैसे MY_VARIANT)। EmailJourneyVariant enum की किसी key से मेल खानी चाहिए।",
      },
      displayName: {
        label: "डिस्प्ले नाम",
        description: "इस वेरिएंट का इंसान को समझ आने वाला नाम",
      },
      description: {
        label: "विवरण",
        description: "ये जर्नी किस बारे में है",
      },
      weight: {
        label: "वेट",
        description: "A/B टेस्ट वेट (1-100)। सिर्फ़ कोल्ड-लीड कैंपेन में इस्तेमाल होता है।",
      },
      campaignType: {
        label: "कैंपेन टाइप",
        description: "ये वेरिएंट किस कैंपेन टाइप के लिए है (वैकल्पिक)",
      },
      sourceFilePath: {
        label: "सोर्स फ़ाइल पाथ",
        description:
          ".email.tsx फ़ाइल का रिलेटिव पाथ (जैसे journeys/my-variant.email)",
      },
      senderName: {
        label: "भेजने वाले का नाम",
        description:
          "ईमेल क्लाइंट में दिखने वाला भेजने वाले का नाम (जैसे Alex from Unbottled)",
      },
      companyName: {
        label: "कंपनी का नाम",
        description: "ईमेल फ़ुटर/टेम्पलेट में दिखने वाला कंपनी का नाम",
      },
      companyEmail: {
        label: "कंपनी का ईमेल",
        description: "ईमेल फ़ुटर/टेम्पलेट में दिखने वाला कंपनी का संपर्क ईमेल",
      },
    },
    errors: {
      unauthorized: { title: "अनधिकृत", description: "एडमिन होना ज़रूरी है" },
      forbidden: { title: "अनुमति नहीं", description: "अनुमति नहीं" },
      server: {
        title: "सर्वर एरर",
        description: "जर्नी वेरिएंट रजिस्टर नहीं हो सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत वेरिएंट key या डेटा",
      },
      notFound: {
        title: "नहीं मिला",
        description: "वेरिएंट key enum में नहीं मिली",
      },
      conflict: {
        title: "टकराव",
        description: "वेरिएंट key पहले से रजिस्टर्ड है",
      },
      network: { title: "नेटवर्क एरर", description: "नेटवर्क एरर" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव",
      },
    },
    success: {
      title: "वेरिएंट रजिस्टर हो गया",
      description: "जर्नी वेरिएंट सफलतापूर्वक रजिस्टर हुआ",
    },
  },
  patch: {
    title: "जर्नी वेरिएंट अपडेट करें",
    titleShort: "वेरिएंट एडिट करें",
    description: "रजिस्टर्ड ईमेल जर्नी वेरिएंट अपडेट करें",
    fields: {
      id: {
        label: "वेरिएंट ID",
        description: "अपडेट करने वाले वेरिएंट की ID",
      },
      active: {
        label: "एक्टिव",
        description: "इस वेरिएंट को चालू या बंद करें",
      },
      weight: {
        label: "वेट",
        description: "A/B टेस्ट वेट (1-100)",
      },
      displayName: {
        label: "डिस्प्ले नाम",
        description: "इस वेरिएंट का इंसान को समझ आने वाला नाम",
      },
      description: {
        label: "विवरण",
        description: "ये जर्नी किस बारे में है",
      },
      senderName: {
        label: "भेजने वाले का नाम",
        description: "ईमेल क्लाइंट में दिखने वाला भेजने वाले का नाम",
      },
      companyName: {
        label: "कंपनी का नाम",
        description: "ईमेल फ़ुटर/टेम्पलेट में दिखने वाला कंपनी का नाम",
      },
      companyEmail: {
        label: "कंपनी का ईमेल",
        description: "ईमेल फ़ुटर/टेम्पलेट में दिखने वाला कंपनी का संपर्क ईमेल",
      },
    },
    errors: {
      unauthorized: { title: "अनधिकृत", description: "एडमिन होना ज़रूरी है" },
      forbidden: { title: "अनुमति नहीं", description: "अनुमति नहीं" },
      server: {
        title: "सर्वर एरर",
        description: "जर्नी वेरिएंट अपडेट नहीं हो सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत अपडेट डेटा",
      },
      notFound: { title: "नहीं मिला", description: "वेरिएंट नहीं मिला" },
      conflict: { title: "टकराव", description: "टकराव" },
      network: { title: "नेटवर्क एरर", description: "नेटवर्क एरर" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव",
      },
    },
    success: {
      title: "वेरिएंट अपडेट हो गया",
      description: "जर्नी वेरिएंट सफलतापूर्वक अपडेट हुआ",
    },
  },
  widget: {
    title: "जर्नी वेरिएंट",
    refresh: "रीफ़्रेश करें",
    register: "वेरिएंट रजिस्टर करें",
    noVariants: "अभी कोई वेरिएंट रजिस्टर नहीं",
    activeLabel: "एक्टिव",
    inactiveLabel: "निष्क्रिय",
    weightLabel: "वेट",
    campaignTypeLabel: "कैंपेन टाइप",
    sourceFileLabel: "सोर्स फ़ाइल",
    toggleActivate: "चालू करें",
    toggleDeactivate: "निष्क्रिय करें",
    checkErrorsLabel: "एरर जाँचें:",
    unsavedChanges: "बिना सेव किए बदलाव",
    saving: "सेव हो रहा है…",
    saveChanges: "बदलाव सेव करें",
  },
};
