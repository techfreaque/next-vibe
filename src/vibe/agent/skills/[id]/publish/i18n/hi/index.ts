import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI टूल",
  tags: {
    skills: "स्किल",
  },
  enums: {
    skillStatus: {
      draft: "ड्राफ़्ट",
      published: "पब्लिश्ड",
      unlisted: "अनलिस्टेड",
    },
  },
  patch: {
    title: "स्किल पब्लिश करें",
    titleShort: "स्किल पब्लिश करें",
    description:
      "कस्टम स्किल पब्लिश करें या पब्लिश करना बंद करें। PUBLISHED करने पर वह कम्युनिटी स्टोर में दिखती है।",
    dynamicTitle: "पब्लिश: {{name}}",
    status: {
      label: "स्टेटस",
      description:
        "स्टोर में दिखाने के लिए PUBLISHED, छिपाने के लिए DRAFT, और सिर्फ़ लिंक से पहुँच के लिए UNLISTED चुनें।",
    },
    changeNote: {
      label: "बदलाव का नोट",
      description: "इस वर्शन में क्या बदला, इसका वैकल्पिक नोट।",
      placeholder: "जैसे सिस्टम प्रॉम्प्ट और साफ़ किया",
    },
    errors: {
      validation: { title: "वैलिडेशन एरर", description: "गलत रिक्वेस्ट" },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "पब्लिश करने के लिए लॉग इन करना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आप सिर्फ़ अपनी स्किल पब्लिश कर सकते हैं",
      },
      notFound: { title: "नहीं मिला", description: "स्किल नहीं मिली" },
      server: {
        title: "सर्वर एरर",
        description: "पब्लिश करते समय एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: { title: "टकराव", description: "टकराव हो गया" },
    },
    success: {
      title: "स्किल पब्लिश हो गई",
      description: "आपकी स्किल अब कम्युनिटी स्टोर में दिख रही है",
    },
    response: {
      status: { content: "स्टेटस" },
      publishedAt: { content: "पब्लिश होने का समय" },
    },
    backButton: {
      label: "वापस",
    },
    button: {
      submit: "स्टेटस सेव करें",
      loading: "सेव हो रहा है...",
    },
  },
};
