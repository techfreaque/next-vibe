import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "डेटा इम्पोर्ट",
  tags: {
    leads: "लीड",
    management: "प्रबंधन",
  },
  post: {
    title: "इम्पोर्ट जॉब रोकें",
    titleShort: "इम्पोर्ट रोकें",
    description: "चल रहा इम्पोर्ट जॉब रोकें",
    jobId: {
      label: "जॉब ID",
      description: "रोकने वाले इम्पोर्ट जॉब की यूनिक पहचान",
    },
    form: {
      title: "इम्पोर्ट जॉब रोकें",
      description: "चल रहा इम्पोर्ट जॉब रोकें",
    },
    response: {
      title: "रोकने का नतीजा",
      description: "रोकने की कार्रवाई का नतीजा",
      success: {
        content: "सफलता स्टेटस",
      },
      message: {
        content: "स्टॉप मैसेज",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिया गया जॉब ID गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "जॉब रोकने के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस अस्वीकृत",
        description: "आपको यह जॉब रोकने की अनुमति नहीं है",
      },
      notFound: {
        title: "जॉब नहीं मिला",
        description: "दिए गए ID से कोई इम्पोर्ट जॉब नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "जॉब रोकते समय एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "स्टॉप में टकराव",
        description: "जो जॉब अभी प्रोसेस नहीं हो रहा उसे रोका नहीं जा सकता",
      },
    },
    success: {
      title: "सफल",
      description: "इम्पोर्ट जॉब सफलतापूर्वक रुका",
    },
  },
  widget: {
    title: "इम्पोर्ट जॉब रोकें",
    successMessage: "जॉब सफलतापूर्वक रुका",
  },
};
