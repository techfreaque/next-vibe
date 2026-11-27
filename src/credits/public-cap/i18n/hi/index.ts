import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicCap: "public-cap",
    admin: "admin",
  },
  get: {
    perDayUnit: "क्रेडिट/दिन",
    lead: "विज़िटर",
    ip: "IP एड्रेस",
    globalCap: "दैनिक सीमा पूरी हो गई",
    leadCap: "विज़िटर की सीमा पूरी हो गई",
    ipCap: "IP की सीमा पूरी हो गई",
    singleRequest: "रिक्वेस्ट बहुत महँगी है",
    failClosed: "ब्लॉक किया गया, सीमा की जाँच विफल रही",
    poolReserved: "क्रेडिट रिज़र्व किए गए",
    threshold80: "सीमा का 80% इस्तेमाल हुआ",
    threshold100: "सीमा पूरी तरह इस्तेमाल हो गई",
    other: "अन्य",
    changeCap: "सीमा बदलें",
    limits: "सीमाएँ",
    capHint: "बिना पेड प्लान वाले हर विज़िटर के बीच साझा",
    usedOfCap: "{{cap}} में से {{used}} इस्तेमाल हुए",
    exceededHint: "डेली रीसेट तक फ़्री विज़िटर ब्लॉक रहेंगे।",
    resetAt: "आख़िरी रीसेट {{time}}",
    title: "फ़्री टियर की सीमा",
    titleShort: "फ़्री टियर की सीमा",
    description: "आज का कुल फ़्री टियर क्रेडिट खर्च और सीमा देखें",
    container: {
      title: "फ़्री टियर की दैनिक सीमा",
      description: "बिना पेमेंट वाले यूज़र्स के लिए कुल दैनिक खर्च की सीमा",
    },
    spendToday: {
      content: "आज खर्च हुए",
    },
    capAmount: {
      content: "दैनिक सीमा",
    },
    remainingToday: {
      content: "आज बचे हुए",
    },
    percentUsed: {
      content: "इस्तेमाल हुए",
    },
    lastResetAt: {
      content: "आख़िरी रीसेट",
    },
    capExceeded: {
      content: "सीमा पार हो गई",
    },
    perLeadCap: { content: "प्रति विज़िटर" },
    perIpCap: { content: "प्रति IP एड्रेस" },
    topSpenders: { content: "आज सबसे ज़्यादा फ़्री खर्च करने वाले" },
    recentEvents: { content: "हाल की सीमा से जुड़ी घटनाएँ" },
    noData: "आज अभी तक कुछ नहीं।",
    success: {
      title: "सीमा की स्थिति लोड हुई",
      description: "पब्लिक फ़्री टियर की सीमा की स्थिति मिल गई",
    },
    errors: {
      validation: {
        title: "फ़ॉर्म जाँचें",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन विफल रहा",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "सीमा की कॉन्फ़िगरेशन नहीं मिली",
      },
      server: {
        title: "सर्वर एरर",
        description: "सीमा की स्थिति नहीं मिल सकी",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "रिसोर्स में टकराव हुआ",
      },
    },
  },
  post: {
    perDayUnit: "क्रेडिट प्रति दिन",
    back: "वापस",
    decrease: "100 घटाएँ",
    increase: "100 बढ़ाएँ",
    title: "फ़्री टियर की सीमा अपडेट करें",
    titleShort: "सीमा अपडेट करें",
    description: "बिना पेमेंट वाले यूज़र्स के लिए कुल दैनिक क्रेडिट खर्च की सीमा अपडेट करें",
    capAmount: {
      label: "दैनिक सीमा (क्रेडिट)",
      description:
        "बिना पेमेंट वाले यूज़र्स मिलकर एक दिन में ज़्यादा से ज़्यादा कितने क्रेडिट खर्च कर सकते हैं",
      placeholder: "जैसे 500",
    },
    perLeadCap: {
      label: "प्रति विज़िटर प्रतिदिन (क्रेडिट)",
      description:
        "एक गेस्ट या लीड एक दिन में ज़्यादा से ज़्यादा कितने फ़्री क्रेडिट खर्च कर सकता है",
      placeholder: "जैसे 20",
    },
    perIpCap: {
      label: "प्रति IP एड्रेस प्रतिदिन (क्रेडिट)",
      description: "एक IP एक दिन में ज़्यादा से ज़्यादा कितने फ़्री क्रेडिट खर्च कर सकता है",
      placeholder: "जैसे 40",
    },
    message: {
      content: "नतीजा",
    },
    success: {
      title: "सीमा अपडेट हो गई",
      description: "दैनिक सीमा अपडेट हो गई",
    },
    errors: {
      validation: {
        title: "फ़ॉर्म जाँचें",
        description: "सीमा की राशि एक धनात्मक संख्या होनी चाहिए",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन विफल रहा",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "सीमा की कॉन्फ़िगरेशन नहीं मिली",
      },
      server: {
        title: "सर्वर एरर",
        description: "सीमा अपडेट नहीं हो सकी",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "रिसोर्स में टकराव हुआ",
      },
    },
  },
  repository: {
    capUpdated: "दैनिक सीमा {{capAmount}} क्रेडिट पर सेट हुई",
    capExceeded:
      "आज का फ़्री कोटा इस रिक्वेस्ट के लिए काफ़ी नहीं है। कल दोबारा कोशिश करें या पेड क्रेडिट इस्तेमाल करें।",
    leadCapExceeded:
      "यह रिक्वेस्ट आज की आपकी फ़्री सीमा से ज़्यादा है। कल दोबारा कोशिश करें या पेड क्रेडिट इस्तेमाल करें।",
    reservedByRunningReply:
      "आपके फ़्री क्रेडिट अभी एक चल रहे जवाब में लगे हैं। उसे पूरा होने दें, फिर दोबारा भेजें।",
    capUnavailable:
      "फ़्री क्रेडिट अभी कुछ देर के लिए उपलब्ध नहीं हैं। थोड़ी देर बाद कोशिश करें।",
    getCapFailed: "फ़्री टियर की सीमा की कॉन्फ़िगरेशन नहीं मिल सकी",
    updateCapFailed: "फ़्री टियर की सीमा अपडेट नहीं हो सकी",
    incrementFailed: "फ़्री टियर का खर्च दर्ज नहीं हो सका",
  },
};
