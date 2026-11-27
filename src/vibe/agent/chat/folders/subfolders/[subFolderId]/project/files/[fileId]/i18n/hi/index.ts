import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folders: "फ़ोल्डर",
  },
  delete: {
    title: "नॉलेज फ़ाइल हटाएँ",
    titleShort: "फ़ाइल हटाएँ",
    description: "इस फ़ोल्डर प्रोजेक्ट से नॉलेज फ़ाइल हटाएँ",
    container: {
      title: "नॉलेज फ़ाइल हटाएँ",
      description: "AI को यह फ़ाइल इस फ़ोल्डर में अब नहीं दिखेगी।",
    },
    id: { label: "फ़ोल्डर ID", description: "जिस फ़ोल्डर में फ़ाइल है" },
    fileId: { label: "फ़ाइल ID", description: "जो फ़ाइल हटानी है" },
    response: { removedPath: "हटा दिया गया" },
    backButton: { label: "वापस" },
    submitButton: { label: "फ़ाइल हटाएँ", loadingText: "हट रही है..." },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिया गया डेटा सही नहीं है",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "लॉग इन करना ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास यह प्रोजेक्ट एडिट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "फ़ोल्डर या फ़ाइल नहीं मिली",
      },
      server: {
        title: "सर्वर एरर",
        description: "कुछ गड़बड़ हो गई। दोबारा कोशिश करें।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "प्रोजेक्ट कहीं और बदल दिया गया है",
      },
      notSupported: {
        title: "सपोर्ट नहीं है",
        description: "प्रोजेक्ट सिर्फ़ प्राइवेट और शेयर्ड फ़ोल्डर में काम करते हैं",
      },
    },
    success: {
      title: "सेव हो गया",
      description: "हो गया",
    },
  },
};
