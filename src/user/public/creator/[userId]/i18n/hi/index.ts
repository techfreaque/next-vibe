import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "क्रिएटर प्रोफ़ाइल",
  tags: {
    creator: "क्रिएटर",
    profile: "profile",
    public: "public",
  },
  get: {
    title: "क्रिएटर प्रोफ़ाइल पाएँ",
    titleShort: "क्रिएटर प्रोफ़ाइल",
    description: "बायो, सोशल लिंक और स्किल के साथ पब्लिक क्रिएटर प्रोफ़ाइल पाएँ",
    form: {
      title: "क्रिएटर प्रोफ़ाइल",
      description: "स्किल क्रिएटर की पब्लिक प्रोफ़ाइल",
      creatorId: {
        label: "क्रिएटर ID",
        description: "क्रिएटर की ID या स्लग",
      },
    },
    response: {
      title: "क्रिएटर प्रोफ़ाइल",
      description: "पब्लिक क्रिएटर प्रोफ़ाइल डेटा",
      publicName: "डिस्प्ले नाम",
      avatarUrl: "अवतार",
      bio: "बायो",
      websiteUrl: "वेबसाइट",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      facebookUrl: "Facebook",
      discordUrl: "Discord",
      tribeUrl: "Tribe",
      rumbleUrl: "Rumble",
      odyseeUrl: "Odysee",
      nostrUrl: "Nostr",
      gabUrl: "Gab",
      creatorAccentColor: "एक्सेंट कलर",
      creatorHeaderImageUrl: "हेडर इमेज",
      referralCode: "रेफ़रल कोड",
      appName: "ऐप का नाम",
      leadMagnetActive: "लीड मैग्नेट एक्टिव",
      leadMagnetHeadline: "लीड मैग्नेट हेडलाइन",
      leadMagnetButtonText: "लीड मैग्नेट बटन",
      skills: "स्किल",
    },
    errors: {
      validation: { title: "वैलिडेशन एरर", description: "अमान्य रिक्वेस्ट" },
      unauthorized: { title: "अनधिकृत", description: "अधिकृत नहीं" },
      forbidden: { title: "प्रतिबंधित", description: "एक्सेस नहीं मिला" },
      notFound: {
        title: "नहीं मिला",
        description: "क्रिएटर नहीं मिला",
        detail: "{{userId}} के लिए कोई क्रिएटर प्रोफ़ाइल नहीं है",
      },
      conflict: { title: "टकराव", description: "रिक्वेस्ट में टकराव" },
      network: { title: "नेटवर्क एरर", description: "नेटवर्क एरर" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव",
      },
      internal: {
        title: "सर्वर एरर",
        description: "आंतरिक एरर",
        detail: "यह क्रिएटर प्रोफ़ाइल लोड नहीं हो सकी: {{error}}",
      },
      unknown: { title: "अज्ञात एरर", description: "अज्ञात एरर" },
    },
    success: {
      title: "क्रिएटर प्रोफ़ाइल",
      description: "क्रिएटर प्रोफ़ाइल मिल गई",
    },
  },
  widget: {
    notFound: {
      title: "क्रिएटर नहीं मिला",
      description: "यह प्रोफ़ाइल मौजूद नहीं है या हटा दी गई है।",
      back: "होम पर वापस",
    },
    skills: {
      title: "स्किल",
    },
    referral: {
      label: "रेफ़रल कोड",
    },
    nav: {
      backArrow: "\u2190",
      copyright: "\u00a9",
    },
  },
  meta: {
    title: "{{publicName}} | क्रिएटर प्रोफ़ाइल",
    description:
      "{{publicName}} {{appName}} पर AI स्किल बनाते हैं। उनका काम देखें और बातचीत शुरू करें।",
    notFound: "क्रिएटर नहीं मिला | {{appName}}",
  },
};
