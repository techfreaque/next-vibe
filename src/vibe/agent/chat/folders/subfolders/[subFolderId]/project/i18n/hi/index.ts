import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folders: "फ़ोल्डर",
  },
  get: {
    title: "प्रोजेक्ट सेटिंग्स",
    titleShort: "प्रोजेक्ट",
    description: "फ़ोल्डर प्रोजेक्ट के लिए निर्देश और नॉलेज फ़ाइलें",
    id: { label: "फ़ोल्डर ID", description: "जो फ़ोल्डर पढ़ना है" },
    response: {
      folderName: "फ़ोल्डर",
      instructions: "निर्देश",
      canManage: "मैनेज कर सकते हैं",
      knowledgePath: "नॉलेज पाथ",
      files: {
        id: "ID",
        name: "नाम",
        path: "पाथ",
        size: "साइज़",
        updatedAt: "अपडेट हुआ",
      },
    },
    heading: "प्रोजेक्ट",
    subheading:
      "निर्देश इस फ़ोल्डर और इसके सब फ़ोल्डर की हर चैट पर लागू होते हैं। नॉलेज फ़ाइलें AI को उपलब्ध रहती हैं।",
    instructionsTitle: "निर्देश",
    noInstructions:
      "अभी कोई निर्देश नहीं है। AI को बताएँ कि इस फ़ोल्डर में उसे कैसे जवाब देना है।",
    editInstructions: "निर्देश बदलें",
    addInstructions: "निर्देश जोड़ें",
    knowledgeTitle: "नॉलेज फ़ाइलें",
    noFiles:
      "अभी कोई नॉलेज फ़ाइल नहीं है। नोट्स, ब्रीफ़ या दस्तावेज़ जोड़ें जो AI को पता होने चाहिए।",
    addFile: "फ़ाइल जोड़ें",
    removeFile: "हटाएँ",
    bytes: "अक्षर",
    noData: "प्रोजेक्ट लोड हो रहा है...",
    noAccess: "प्रोजेक्ट सेटिंग्स सिर्फ़ फ़ोल्डर एडिटर बदल सकते हैं।",
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
  patch: {
    title: "प्रोजेक्ट निर्देश बदलें",
    titleShort: "निर्देश",
    description: "वे निर्देश तय करें जिन्हें AI इस फ़ोल्डर की हर चैट में माने",
    container: {
      title: "प्रोजेक्ट निर्देश",
      description: "इस फ़ोल्डर और इसके सब फ़ोल्डर की हर चैट पर लागू",
    },
    id: { label: "फ़ोल्डर ID", description: "जो फ़ोल्डर अपडेट करना है" },
    instructions: {
      label: "निर्देश",
      description:
        "AI का व्यवहार कैसा हो, उसे क्या पता हो, टोन और फ़ॉर्मैट। खाली छोड़ने पर निर्देश हट जाते हैं।",
      placeholder:
        "जैसे: तुम मेरे लॉन्च के कॉपीराइटर हो। छोटे और दमदार वाक्य लिखो। जवाब हमेशा बुलेट पॉइंट में दो।",
    },
    response: { folderId: "फ़ोल्डर", hasInstructions: "निर्देश चालू हैं" },
    backButton: { label: "वापस" },
    submitButton: { label: "निर्देश सेव करें", loadingText: "सेव हो रहा है..." },
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
