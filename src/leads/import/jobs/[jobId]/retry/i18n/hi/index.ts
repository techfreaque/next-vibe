import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "डेटा इम्पोर्ट",
  tags: {
    leads: "लीड",
    management: "प्रबंधन",
  },
  post: {
    title: "इम्पोर्ट जॉब दोबारा चलाएँ",
    titleShort: "इम्पोर्ट दोबारा चलाएँ",
    description: "फ़ेल हुआ इम्पोर्ट जॉब दोबारा चलाएँ",
    jobId: {
      label: "जॉब ID",
      description: "दोबारा चलाने वाले इम्पोर्ट जॉब की यूनिक पहचान",
    },
    form: {
      title: "इम्पोर्ट जॉब दोबारा चलाएँ",
      description: "फ़ेल हुआ इम्पोर्ट जॉब दोबारा चलाएँ",
    },
    response: {
      title: "दोबारा चलाने का नतीजा",
      description: "दोबारा चलाने की कार्रवाई का नतीजा",
      success: {
        content: "सफलता स्टेटस",
      },
      message: {
        content: "रीट्राई मैसेज",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिया गया जॉब ID गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "जॉब दोबारा चलाने के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस अस्वीकृत",
        description: "आपको यह जॉब दोबारा चलाने की अनुमति नहीं है",
      },
      notFound: {
        title: "जॉब नहीं मिला",
        description: "दिए गए ID से कोई इम्पोर्ट जॉब नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "जॉब दोबारा चलाते समय एरर हुई",
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
        title: "रीट्राई में टकराव",
        description: "जो जॉब अभी प्रोसेस हो रहा है उसे दोबारा नहीं चलाया जा सकता",
      },
    },
    success: {
      title: "सफल",
      description: "इम्पोर्ट जॉब सफलतापूर्वक दोबारा चला",
    },
  },
  widget: {
    title: "इम्पोर्ट जॉब दोबारा चलाएँ",
    successMessage: "जॉब रीट्राई सफलतापूर्वक शुरू हुआ",
  },
};
