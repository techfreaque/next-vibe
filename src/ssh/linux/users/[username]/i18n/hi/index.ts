import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    localModeOnly: {
      title: "सिर्फ़ लोकल मोड",
    },
    cannotDeleteCurrentUser: "मौजूदा प्रोसेस यूज़र को नहीं हटाया जा सकता",
    cannotDeleteSystemUser: "सिस्टम यूज़र (uid < 1000) नहीं हटाए जा सकते",
    userNotFound: "यूज़र नहीं मिला",
  },

  delete: {
    review: "Linux यूज़र डायरेक्टरी में लोकल अकाउंट देखें।",
    title: "Linux यूज़र हटाएँ",
    titleShort: "यूज़र हटाएँ",
    description: "होस्ट से OS यूज़र अकाउंट हटाएँ",
    fields: {
      removeHome: {
        label: "होम डायरेक्टरी हटाएँ",
        description: "यूज़र की होम डायरेक्टरी भी हटाएँ",
        placeholder: "",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "सिस्टम यूज़र या मौजूदा प्रोसेस यूज़र को नहीं हटाया जा सकता",
      },
      server: { title: "सर्वर एरर", description: "यूज़र हटाना फ़ेल हुआ" },
      notFound: { title: "नहीं मिला", description: "यूज़र नहीं मिला" },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      unsavedChanges: { title: "बिना सेव किए बदलाव" },
      conflict: { title: "टकराव", description: "यूज़र को हटाया नहीं जा सकता" },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      timeout: { title: "टाइमआउट", description: "रिक्वेस्ट टाइमआउट हो गई" },
    },
    response: {
      ok: { title: "ठीक है" },
    },
    success: {
      title: "यूज़र हट गया",
      description: "OS यूज़र अकाउंट सफलतापूर्वक हट गया",
    },
  },
};
