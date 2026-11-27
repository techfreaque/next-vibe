import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "अकाउंटिंग",
  tags: {
    ledger: "ledger",
    fx: "fx",
    rates: "exchange-rates",
  },
  fields: {
    companyId: "कंपनी",
    baseCurrency: "बेस करेंसी",
    quoteCurrency: "कोट करेंसी",
    rate: "एक्सचेंज रेट",
    rateDate: "रेट की तारीख़",
    source: "स्रोत",
    asOfDate: "रीवैल्यूएशन की तारीख़",
    dryRun: "सिर्फ़ प्रीव्यू",
    postReversalNextDay: "अगले दिन ऑटो-रिवर्स",
    currency: "करेंसी",
    limit: "अधिकतम पंक्तियाँ",
  },
  list: {
    title: "एक्सचेंज रेट",
    titleShort: "FX रेट",
    description:
      "मल्टी-करेंसी लेजर ट्रांसलेशन के लिए ECB के दैनिक रेफ़रेंस रेट और मैन्युअल एक्सचेंज रेट",
    syncEcbAction: "ECB रेट सिंक करें",
    setManualAction: "मैन्युअल रेट जोड़ें",
    revalueAction: "अवधि-अंत FX रीवैल्यूएशन",
    empty: "अभी कोई एक्सचेंज रेट स्टोर नहीं। ECB के दैनिक रेट सिंक करें या मैन्युअल रेट जोड़ें।",
    countLabel: "स्टोर किए रेट",
    latestDate: "आख़िरी रेट की तारीख़",
    success: "एक्सचेंज रेट लोड हुए",
  },
  set: {
    title: "मैन्युअल एक्सचेंज रेट सेट करें",
    description:
      "मैन्युअल एक्सचेंज रेट दर्ज करें (1 बेस करेंसी = रेट कोट करेंसी)। उसी तारीख़ पर मैन्युअल रेट ECB से ऊपर रहते हैं।",
    action: "रेट सेव करें",
    success: "एक्सचेंज रेट सेव हुआ",
  },
  sync: {
    title: "ECB के दैनिक रेट सिंक करें",
    description: "यूरोपियन सेंट्रल बैंक के जारी किए ताज़ा यूरो रेफ़रेंस एक्सचेंज रेट लाएँ",
    action: "ECB रेट अभी लाएँ",
    success: "ECB के दैनिक रेट सिंक हुए",
    upsertedCount: "रेट अपडेट हुए",
  },
  revaluation: {
    title: "अवधि-अंत FX रीवैल्यूएशन",
    description:
      "खुले विदेशी-करेंसी रिसीवेबल, पेएबल और कैश/बैंक बैलेंस को क्लोज़िंग रेट पर रीवैल्यू करें",
    action: "FX रीवैल्यूएशन चलाएँ",
    previewAction: "रीवैल्यूएशन का प्रीव्यू",
    postAction: "रीवैल्यूएशन एंट्री पोस्ट करें",
    success: "FX रीवैल्यूएशन पूरा हुआ",
    noAdjustments: "किसी खुले विदेशी-करेंसी बैलेंस को रीवैल्यूएशन की ज़रूरत नहीं।",
    functionalCurrency: "फ़ंक्शनल करेंसी",
    totalUnrealized: "नेट अवास्तविक FX लाभ/हानि",
    journalEntryId: "रीवैल्यूएशन जर्नल एंट्री",
    reversalEntryId: "अगले दिन की रिवर्सल एंट्री",
    missingRates: "क्लोज़िंग रेट ग़ायब वाली करेंसी",
    account: "अकाउंट",
    foreignBalance: "मूल बैलेंस",
    carryingFunctional: "कैरिंग वैल्यू",
    closingRate: "क्लोज़िंग रेट",
    revaluedFunctional: "रीवैल्यू किया मान",
    unrealizedDelta: "अवास्तविक FX",
    previewBanner: "सिर्फ़ प्रीव्यू। कोई जर्नल एंट्री पोस्ट नहीं हुई।",
    postedBanner: "अवास्तविक FX रीवैल्यूएशन जर्नल एंट्री पोस्ट हुई।",
  },
  errors: {
    validation: {
      title: "इनपुट गलत है",
      description: "करेंसी कोड, तारीख़ और एक्सचेंज रेट के मान जाँचें।",
    },
    unauthorized: {
      title: "साइन इन ज़रूरी है",
      description: "एक्सचेंज रेट और FX रीवैल्यूएशन देखने के लिए ऑथेंटिकेट करें।",
    },
    forbidden: {
      title: "एक्सेस नहीं मिला",
      description: "इस कार्रवाई के लिए अकाउंटेंट की अनुमति चाहिए।",
    },
    notFound: {
      title: "नहीं मिला",
      description: "माँगी गई कंपनी या एक्सचेंज रेट का डेटा नहीं मिला।",
    },
    conflict: {
      title: "टकराव",
      description: "खुली अकाउंटिंग अवधि या ज़रूरी FX अकाउंट ग़ायब हैं।",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "ECB एक्सचेंज रेट फ़ीड तक नहीं पहुँच सके।",
    },
    server: {
      title: "सर्वर एरर",
      description: "FX डेटा प्रोसेस करते समय अप्रत्याशित एरर आई।",
    },
    unknown: {
      title: "अनजान एरर",
      description: "अप्रत्याशित एरर आई।",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं।",
    },
  },
};
