import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI टूल",
  tags: {
    skills: "स्किल",
  },
  post: {
    selectSkill: "वोट देने के लिए कोई कम्युनिटी स्किल खोलें।",
    browseSkills: "कम्युनिटी स्किल ब्राउज़ करें",
    title: "स्किल को वोट दें",
    titleShort: "स्किल को वोट दें",
    description:
      "किसी कम्युनिटी स्किल को अपवोट या डाउनवोट करें। अपनी मौजूदा दिशा दोबारा भेजने पर वोट हट जाता है, उलटी दिशा भेजने पर पलट जाता है।",
    dynamicTitle: "वोट: {{name}}",
    direction: {
      label: "दिशा",
      description: "वोट की दिशा: up (काम की) या down (काम की नहीं)।",
      up: "अपवोट",
      down: "डाउनवोट",
    },
    errors: {
      validation: { title: "वैलिडेशन एरर", description: "गलत रिक्वेस्ट" },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "वोट देने के लिए लॉग इन करना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आप इस स्किल को वोट नहीं दे सकते",
      },
      notFound: { title: "नहीं मिला", description: "स्किल नहीं मिली" },
      server: {
        title: "सर्वर एरर",
        description: "आपका वोट प्रोसेस करते समय एरर आया",
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
      title: "वोट दर्ज हो गया",
      description: "आपका वोट अपडेट हो गया",
    },
    response: {
      userVote: { content: "आपका वोट" },
      voteCount: { content: "स्कोर" },
      upCount: { content: "अपवोट" },
      downCount: { content: "डाउनवोट" },
      trustLevel: { content: "भरोसे का स्तर" },
    },
    backButton: {
      label: "वापस",
    },
    button: {
      vote: "अपवोट",
      unvote: "वोट हटाएँ",
      loading: "सेव हो रहा है...",
    },
    badge: {
      verified: "वेरिफ़ाइड",
    },
  },
};
