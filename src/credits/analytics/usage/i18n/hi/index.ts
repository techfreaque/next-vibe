import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/hi";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "क्रेडिट इस्तेमाल",
    titleShort: "इस्तेमाल",
    description:
      "समय के साथ क्रेडिट खर्च: अकाउंट बनाम गेस्ट, फ़्री बनाम पैक क्रेडिट, मॉडल, फ़ीचर और प्रोवाइडर के हिसाब से, प्रोवाइडर लागत, मार्जिन और सबसे ज़्यादा खर्च करने वालों के साथ।",
    tags: {
      usage: "क्रेडिट इस्तेमाल",
      margin: "मार्जिन",
    },
    fields: {
      actor: {
        label: "खर्च करने वाला",
        description: "अकाउंट, गेस्ट (बिना अकाउंट), या दोनों",
      },
      creditKind: {
        label: "क्रेडिट",
        description: "मासिक फ़्री कोटा, पैक क्रेडिट, या दोनों",
      },
      model: {
        label: "मॉडल",
        description: "सिर्फ़ इस model id पर खर्च",
      },
      feature: {
        label: "फ़ीचर",
        description: "सिर्फ़ इस फ़ीचर पर खर्च (चैट, Generate Image, ...)",
      },
      provider: {
        label: "अपस्ट्रीम प्रोवाइडर",
        description: "सिर्फ़ इस अपस्ट्रीम प्रोवाइडर से परोसा गया खर्च",
      },
      includeInternal: {
        label: "एडमिन अकाउंट शामिल करें",
        description: "एडमिन अकाउंट का खर्च भी गिनें",
      },
    },
    response: {
      window: "अवधि",
      appliedFilters: "लागू फ़िल्टर",
      kpis: "मुख्य आँकड़े",
      spendByActor: "खर्च करने वाले के हिसाब से खर्च",
      spendByKind: "क्रेडिट किस्म के हिसाब से खर्च",
      costVsSpend: "खर्च का मूल्य बनाम प्रोवाइडर लागत",
      byModel: "मॉडल के हिसाब से",
      byFeature: "फ़ीचर के हिसाब से",
      byProvider: "अपस्ट्रीम प्रोवाइडर के हिसाब से",
      featureLabels: "फ़ीचर के नाम",
      topSpenders: "सबसे ज़्यादा खर्च करने वाले",
    },
    errors: {
      validation: {
        title: "गलत फ़िल्टर",
        description: "अवधि और फ़िल्टर जाँचें और फिर कोशिश करें।",
      },
      unauthorized: {
        title: "साइन इन ज़रूरी है",
        description: "क्रेडिट इस्तेमाल देखने के लिए एडमिन के रूप में साइन इन करें।",
      },
      forbidden: {
        title: "सिर्फ़ एडमिन के लिए",
        description: "क्रेडिट इस्तेमाल सिर्फ़ एडमिन देख सकते हैं।",
      },
      notFound: {
        title: "कुछ नहीं मिला",
        description: "इस रिक्वेस्ट से मेल खाता कोई इस्तेमाल डेटा नहीं।",
      },
      server: {
        title: "रिपोर्ट फ़ेल",
        description: "क्रेडिट इस्तेमाल रिपोर्ट नहीं बन सकी। फिर कोशिश करें।",
      },
      unknown: {
        title: "अनपेक्षित एरर",
        description: "रिपोर्ट लोड करते समय कुछ गड़बड़ हुई।",
      },
      network: {
        title: "कनेक्शन एरर",
        description: "सर्वर तक पहुँच नहीं हो सकी।",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "पहले अपने फ़िल्टर बदलाव लागू करें या छोड़ दें।",
      },
      conflict: {
        title: "डेटा टकराव",
        description: "लोड होते समय डेटा बदल गया। रिपोर्ट रिफ़्रेश करें।",
      },
    },
    success: {
      title: "रिपोर्ट तैयार",
      description: "क्रेडिट इस्तेमाल लोड हुआ",
    },
  },
  widget: {
    extra: {
      nothingRecorded: "कुछ दर्ज नहीं",
      paidShareHint2:
        "खरीदे पैक और सब्सक्रिप्शन, उस खर्च में से जिसका स्रोत पता है; {{missing}} का स्रोत गायब है",
      costedPct: "लागत वाला %",
      paidShare: "पेड हिस्सा",
      paidShareHint: "खरीदे पैक और सब्सक्रिप्शन से खर्च; कुल मूल्य {{value}}",
      freeCostHint3:
        "{{credits}} फ़्री क्रेडिट की प्रोवाइडर लागत; खर्च के {{coverage}} पर लागत दर्ज",
      fundGrants: "ग्रांट",
      boughtPct: "खरीदा %",
      subPct: "सब्स %",
      grantsPct: "ग्रांट %",
      unknownPct: "स्रोत गायब %",
      fundingChart: "फ़ंडिंग के हिसाब से खर्च",
      fundingNote:
        "हर चार्ज किस बकेट से चुकाया गया: फ़्री कोटा, साइन अप / न्यूज़लेटर बोनस, खरीदे पैक, सब्सक्रिप्शन, रेफ़रल क्रेडिट या एडमिन ग्रांट। चार्ज के समय दर्ज; स्रोत गायब सिर्फ़ पुराने चार्ज में।",
      fundAllowance: "फ़्री कोटा",
      fundPurchased: "खरीदा हुआ",
      fundSubscription: "सब्सक्रिप्शन",
      fundBonus: "बोनस ग्रांट",
      fundEarned: "रेफ़रल कमाई",
      fundUnknown: "स्रोत गायब",
      fundFreeBonus: "साइन अप / न्यूज़लेटर बोनस",
      fundFreeUnknown: "फ़्री, टियर दर्ज नहीं",
      fundAdminGrant: "एडमिन ग्रांट",
      change: "पिछले से",
      paidPct: "पेड %",
      topModel: "ज़्यादातर {{model}}",
      spendersHint: "{{count}} खर्च करने वालों से",
      accountTag: "अकाउंट",
      freeCostHint2:
        "फ़्री कोटा इस्तेमाल की प्रोवाइडर लागत; खर्च के {{coverage}} पर लागत दर्ज",
      notLoaded: "रिपोर्ट लोड नहीं हुई। दोबारा कोशिश के लिए रिफ़्रेश करें।",
      freeCost: "फ़्री खर्च की लागत",
      freeCostHint: "फ़्री कोटा इस्तेमाल की प्रोवाइडर लागत, जहाँ दर्ज है",
      markup: "सकल मुनाफ़ा (लागत वाला)",
      markupPct: "मार्जिन",
      markupPctHint:
        "प्रोवाइडर लागत के बाद बचा, लिस्ट मूल्य ($0.01/क्रेडिट) पर, नकद नहीं",
      kindNote2:
        "पैक क्रेडिट में खरीद, सब्सक्रिप्शन और एडमिन ग्रांट शामिल हैं; इस्तेमाल यह दर्ज नहीं करता कि कौन सा।",
      modelNotRecorded: "मॉडल दर्ज नहीं",
      costedSpend: "दर्ज लागत वाला खर्च",
      costChart: "दर्ज लागत वाला खर्च बनाम प्रोवाइडर लागत",
      marginHint2: "दर्ज लागत वाले खर्च के {{value}} पर",
      marginHint:
        "खर्च मूल्य के {{value}} का लागत डेटा है; मार्जिन वही घटा प्रोवाइडर लागत है",
      guestPct: "गेस्ट %",
      freePct: "फ़्री %",
      noCost: "लागत डेटा नहीं",
    },
    kpi: {
      creditsSpent: "खर्च हुए क्रेडिट",
      spendUsd: "खर्च मूल्य",
      guestShare: "गेस्ट हिस्सा",
      freeShare: "फ़्री हिस्सा",
      upstreamCostUsd: "प्रोवाइडर लागत",
      marginUsd: "सकल मार्जिन",
      marginPct: "मार्जिन",
      activeSpenders: "सक्रिय खर्च करने वाले",
    },
    hint: {
      spendUsd: "लिस्ट मूल्य $0.01 प्रति क्रेडिट पर, मिला हुआ नकद नहीं",
      guestShare: "बिना अकाउंट वाले विज़िटर का खर्च",
      freeShare: "मासिक फ़्री कोटे से चुकाया गया",
      upstreamCostUsd: "खर्च के {{coverage}} पर दर्ज",
      marginUsd: "मूल्य घटा प्रोवाइडर लागत, लागत डेटा वाली रो पर",
      marginPct: "लागत डेटा वाले खर्च मूल्य का",
      activeSpenders: "कोई भी खर्च करने वाले अकाउंट और गेस्ट",
    },
    chart: {
      actor: "खर्च: अकाउंट बनाम गेस्ट",
      kind: "खर्च: फ़्री कोटा बनाम पैक क्रेडिट",
      kindNote: "पैक क्रेडिट में खरीद, सब्सक्रिप्शन और एडमिन ग्रांट आते हैं।",
      cost: "खर्च मूल्य बनाम प्रोवाइडर लागत",
      costNote: "प्रोवाइडर लागत सिर्फ़ वहाँ है जहाँ चार्ज ने उसे दर्ज किया।",
    },
    series: {
      users: "अकाउंट",
      guests: "गेस्ट",
      free: "फ़्री कोटा",
      pack: "पैक क्रेडिट",
      spendUsd: "खर्च मूल्य",
      upstreamCostUsd: "प्रोवाइडर लागत",
    },
    breakdown: {
      model: "मॉडल",
      feature: "फ़ीचर",
      provider: "प्रोवाइडर",
      spender: "खर्च करने वाला",
      byModel: "मॉडल के हिसाब से",
      byFeature: "फ़ीचर के हिसाब से",
      byProvider: "अपस्ट्रीम प्रोवाइडर के हिसाब से",
      topSpenders: "सबसे ज़्यादा खर्च करने वाले",
      topSpendersHint: "अकाउंट या गेस्ट खोलने के लिए रो पर क्लिक करें।",
      drillHint: "रिपोर्ट फ़िल्टर करने के लिए रो पर क्लिक करें।",
    },
    column: {
      credits: "क्रेडिट",
      usd: "मूल्य",
      costUsd: "लागत",
      marginPct: "मार्जिन",
      spenders: "खर्च करने वाले",
      guestShare: "गेस्ट",
      freeShare: "फ़्री",
      transactions: "चार्ज",
    },
    label: {
      noModel: "टूल और मीडिया",
      noFeature: "दर्ज नहीं",
      noProvider: "दर्ज नहीं",
      chat: "चैट",
      guest: "गेस्ट {{id}}",
      guestTag: "गेस्ट",
      lastActivity: "आख़िरी खर्च {{date}}",
    },
    filter: {
      actor: "खर्च करने वाला",
      creditKind: "क्रेडिट",
      model: "मॉडल",
      feature: "फ़ीचर",
      provider: "प्रोवाइडर",
      internal: "एडमिन शामिल",
    },
    empty: "इस अवधि में कोई क्रेडिट खर्च नहीं।",
    includeInternal: "एडमिन शामिल करें",
  },
  enums: {
    actor: {
      all: "सब",
      users: "अकाउंट",
      guests: "गेस्ट",
    },
    creditKind: {
      all: "सभी क्रेडिट",
      free: "फ़्री",
      pack: "सभी पैक",
      purchased: "खरीदा हुआ",
      subscription: "सब्सक्रिप्शन",
      grants: "ग्रांट",
    },
  },
};
