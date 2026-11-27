import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folders: "फ़ोल्डर",
  },
  post: {
    title: "नॉलेज फ़ाइल जोड़ें",
    titleShort: "फ़ाइल जोड़ें",
    description: "एक दस्तावेज़ जोड़ें जिसे AI इस फ़ोल्डर की हर चैट में देख सके",
    container: {
      title: "नॉलेज फ़ाइल जोड़ें",
      description:
        "Cortex दस्तावेज़ के रूप में सेव होता है। AI इसे cortex-read और cortex-search से पढ़ता है।",
    },
    id: { label: "फ़ोल्डर ID", description: "जिस फ़ोल्डर में फ़ाइल जोड़नी है" },
    name: {
      label: "फ़ाइल का नाम",
      description: "छोटा-सा नाम। .md न होने पर अपने आप जुड़ जाएगा।",
      placeholder: "launch-brief",
    },
    content: {
      label: "सामग्री",
      description: "दस्तावेज़ का टेक्स्ट पेस्ट करें (markdown सबसे अच्छा रहता है)",
    },
    response: { fileId: "फ़ाइल ID", path: "Cortex पाथ" },
    backButton: { label: "वापस" },
    submitButton: { label: "फ़ाइल जोड़ें", loadingText: "जुड़ रहा है..." },
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
