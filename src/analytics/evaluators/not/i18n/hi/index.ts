import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "NOT",
    titleShort: "NOT",
    description:
      "सिग्नल स्ट्रीम को उलट देता है: फ़ायर हुआ सिग्नल नॉट-फ़ायर बन जाता है और उलटा भी",
    fields: {
      signal: { label: "सिग्नल", description: "उलटने के लिए इनपुट सिग्नल स्ट्रीम" },
      result: { label: "नतीजा", description: "उलटे आउटपुट सिग्नल इवेंट" },
    },
    success: {
      title: "NOT का मूल्यांकन हो गया",
      description: "उलटे सिग्नल इवेंट लौटाए गए",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "NOT का मूल्यांकन फ़ेल हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      validation: {
        title: "वैलिडेशन फ़ेल हुआ",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      notFound: { title: "नहीं मिला", description: "नहीं मिला" },
      conflict: { title: "टकराव", description: "टकराव" },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले बदलाव सेव करें",
      },
    },
  },
};
