import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "कंपनी का देश, VAT ट्रीटमेंट और प्रभावी तारीख़ जाँचें।",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "आपका लॉग इन होना ज़रूरी है",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "सिर्फ़ कंपनी ओनर और एडमिन VAT रेजीम बदल सकते हैं।",
    },
    notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
    conflict: {
      title: "प्रभावी तारीख़ पहले से इस्तेमाल में है",
      description: "इस कंपनी के लिए उस तारीख़ का VAT रेजीम पहले से है।",
    },
    server: {
      title: "सर्वर एरर",
      description: "इंटरनल एरर आया",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क एरर आया",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर आया",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
  },
  reviewDescription: "चुनी हुई तारीख़ पर इस कंपनी पर कौन से VAT नियम लागू हैं, देखें।",
  view: "VAT रेजीम देखें",
  asOf: "की स्थिति में",
  change: "टैक्स रेजीम बदलें",
  regimes: {
    standard: "स्टैंडर्ड VAT",
    german: "जर्मनी: छोटा कारोबार (§ 19 UStG)",
    austrian: "ऑस्ट्रिया: छोटा कारोबार (§ 6 Abs. 1 Z 27 UStG)",
    slovak: "स्लोवाकिया: VAT के लिए अपंजीकृत कारोबार",
    slovakSection7: "स्लोवाकिया: § 7 के तहत VAT पंजीकृत (VAT पेयर नहीं)",
    slovakSection7a: "स्लोवाकिया: § 7a के तहत VAT पंजीकृत (VAT पेयर नहीं)",
  },
  title: "कंपनी का VAT रेजीम",
  description: "किसी प्रभावी तारीख़ से दस्तावेज़ों के लिए VAT ट्रीटमेंट चुनें।",
  company: "कंपनी",
  from: "इस तारीख़ से प्रभावी",
  save: "टैक्स रेजीम सेव करें",
  regime: "VAT ट्रीटमेंट",
  saved: "टैक्स रेजीम चुनी हुई तारीख़ से लागू होता है।",
  conflict: "कोई दूसरी तारीख़ चुनें या मौजूदा चुनाव देखें।",
  foreign:
    "विदेशी सेवाओं की जाँच अपने टैक्स सलाहकार से करवाएँ। छोटे कारोबार की छूट के बावजूद रिवर्स चार्ज लागू हो सकता है।",
  saleConflict:
    "बिक्री VAT कंपनी की छूट से टकराता है। ये इनवॉइस जारी करने से पहले लाइनें देख लें।",
  choose: "VAT ट्रीटमेंट चुनें",
  back: "वापस",
  appliesOn: "{{date}} को VAT ट्रीटमेंट",
  invoiceText: "इनवॉइस पर टेक्स्ट",
  savedTitle: "{{regime}} {{date}} से लागू",
  pickCompany: {
    title: "कंपनी चुनें",
    message: "देखें कि किसी भी तारीख़ पर उसके इनवॉइस पर कौन से VAT नियम लागू हैं।",
  },
  hints: {
    standard: "इनवॉइस पर कंपनी की टैक्स दरों से VAT लगता है। सप्लायर VAT डिडक्टिबल है।",
    german: "इनवॉइस पर कोई VAT नहीं होता और § 19 UStG छूट लिखी होती है।",
    austrian:
      "इनवॉइस पर कोई VAT नहीं होता और ऑस्ट्रिया की छोटे कारोबार की छूट लिखी होती है।",
    slovak: "इनवॉइस पर कोई VAT नहीं होता क्योंकि कारोबार VAT के लिए पंजीकृत नहीं है।",
    slovakSection7:
      "घरेलू इनवॉइस पर कोई VAT नहीं होता। सीमा से ऊपर के सामान की EU खरीद पर आप अपनी SK VAT ID से टैक्स ख़ुद देते हैं।",
    slovakSection7a:
      "घरेलू इनवॉइस पर कोई VAT नहीं होता। EU कारोबारों को सेवाओं पर आपकी SK VAT ID के साथ रिवर्स चार्ज लगता है।",
  },
};
