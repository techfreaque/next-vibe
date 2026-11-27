import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "न्यूज़लेटर",
  tags: {
    newsletter: "न्यूज़लेटर",
    credits: "क्रेडिट",
  },
  enum: {
    offer: {
      available: "उपलब्ध",
      pendingConfirmation: "ईमेल कन्फ़र्मेशन का इंतज़ार",
      active: "बोनस चालू",
      notEligible: "उपलब्ध नहीं",
    },
  },
  response: {
    offer: "न्यूज़लेटर बोनस",
    email: "अकाउंट ईमेल",
    bonusCredits: "हर महीने के बोनस क्रेडिट",
    freeRefillAt: "फ़्री क्रेडिट फिर से भरने की तारीख",
  },
  get: {
    title: "न्यूज़लेटर क्रेडिट बोनस",
    titleShort: "न्यूज़लेटर बोनस",
    description:
      "क्या आपके अकाउंट को अभी भी हर महीने का न्यूज़लेटर क्रेडिट बोनस मिल सकता है। सिर्फ़ अकाउंट के लिए।",
  },
  post: {
    title: "न्यूज़लेटर क्रेडिट बोनस लें",
    titleShort: "न्यूज़लेटर बोनस लें",
    description:
      "हर महीने एक्स्ट्रा फ़्री क्रेडिट के लिए अपने अकाउंट का ईमेल न्यूज़लेटर में जोड़ें। सिर्फ़ अकाउंट के लिए, हर अकाउंट पर एक बार।",
  },
  errors: {
    validation: {
      title: "गलत रिक्वेस्ट",
      description: "रिक्वेस्ट प्रोसेस नहीं हो पाई",
    },
    unauthorized: {
      title: "अकाउंट ज़रूरी",
      description:
        "न्यूज़लेटर क्रेडिट बोनस अकाउंट वालों के लिए है। पहले फ़्री में साइन अप करें या लॉग इन करें।",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "आप यह बोनस नहीं ले सकते",
    },
    notFound: {
      title: "अकाउंट नहीं मिला",
      description: "हमें आपका अकाउंट नहीं मिला",
    },
    internal: {
      title: "कुछ गड़बड़ हुई",
      description: "न्यूज़लेटर बोनस चेक नहीं हो पाया। फिर कोशिश करें।",
    },
  },
  success: {
    title: "हो गया",
    description: "न्यूज़लेटर बोनस स्टेटस लोड हो गया",
  },
  widget: {
    available: "हर महीने +{{bonusCredits}} फ़्री क्रेडिट",
    availableHint: "{{email}} को न्यूज़लेटर में जोड़ें। पहले हम एक कन्फ़र्म लिंक भेजेंगे।",
    claim: "+{{bonusCredits}} क्रेडिट/महीना पाएँ",
    pending:
      "{{email}} देखें। +{{bonusCredits}} क्रेडिट/महीना अनलॉक करने के लिए कन्फ़र्म लिंक पर क्लिक करें।",
    active: "न्यूज़लेटर बोनस चालू: +{{bonusCredits}} क्रेडिट/महीना।",
    notEligible: "इस अकाउंट के लिए न्यूज़लेटर बोनस उपलब्ध नहीं है।",
    refill: "फ़्री क्रेडिट {{date}} को फिर से भरेंगे।",
  },
};
