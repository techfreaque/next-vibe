import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/hi";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/hi";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  platformSummary: {
    reviewPayouts: "पेआउट रिक्वेस्ट रिव्यू करें",
    creditsPurchased: "30 दिन में ख़रीदे गए क्रेडिट",
    creditsUsed: "30 दिन में इस्तेमाल हुए क्रेडिट",
    creditsUnused: "बिना इस्तेमाल के पेड क्रेडिट",
    activeSubscriptions: "सक्रिय सब्सक्रिप्शन",
    renewalsSoon: "7 दिन में रिन्यू",
    pastDueSubscriptions: "बकाया सब्सक्रिप्शन",
    pendingPayouts: "पेंडिंग पेआउट रिक्वेस्ट",
    pendingPayoutValue: "पेंडिंग पेआउट",
    messagesSent: "भेजे गए ईमेल",
    messagesBounced: "बाउंस हुए ईमेल",
    messagesFailed: "फ़ेल हुए ईमेल",
    activeCompanies: "सक्रिय कंपनियाँ",
    inactiveCompanies: "निष्क्रिय कंपनियाँ",
    totalConnections: "कनेक्शन",
    grossReceipts: "कुल प्राप्ति",
    refunds: "रिफ़ंड",
    netReceipts: "रिफ़ंड के बाद प्राप्ति",

    valuationBasis:
      "मार्जिन = लिस्ट प्राइस पर क्रेडिट घटा प्रोवाइडर कॉस्ट। सिर्फ़ वही इस्तेमाल गिना जाता है जिसकी कॉस्ट दर्ज है।",
    valuationCost: "अनुमानित AI कॉस्ट",
    valuationMargin: "अनुमानित AI यूसेज मार्जिन",
    newAccount: "अकाउंट रजिस्टर हुआ",
    receivedPayment: "पेमेंट मिला",
    completedTask: "शेड्यूल्ड टास्क पूरा हुआ",
    operations: "ऑपरेशंस",
    emptyActivity: "इस अवधि में कोई गतिविधि नहीं।",
    period: "पिछले 30 दिन, उससे पहले के 30 दिनों की तुलना में",
    retry: "दोबारा कोशिश करें",
    title: "प्लेटफ़ॉर्म ओवरव्यू",
    description: "पिछले 30 दिनों में यूज़र ग्रोथ, रेवेन्यू और सर्विस हेल्थ देखें।",
    unavailable: "उपलब्ध नहीं",
    recent: "हाल की गतिविधि",
    recentPayments: "हाल के भुगतान",
    emptyPayments: "पिछले 30 दिनों में कोई पेमेंट नहीं।",
  },
  category: "एनालिटिक्स",
  tags: {
    analytics: "एनालिटिक्स",
    overview: "ओवरव्यू",
  },
  get: {
    title: "बिज़नेस ओवरव्यू",
    titleShort: "ओवरव्यू",
    description:
      "किसी अवधि के ट्रैफ़िक, लीड, साइन अप, पेयर, रेवेन्यू, AI कॉस्ट और अलर्ट, पिछली अवधि से तुलना के साथ। हर संख्या खोलने पर उसके पीछे की रिपोर्ट दिखती है।",
    response: {
      window: "अवधि",
      generatedAt: "डेटा की तारीख़",
      acquisition: "अधिग्रहण",
      referral: "रेफ़रल",
      money: "पैसा",
      ops: "ऑपरेशंस",
    },
    widget: {
      kpi: {
        visits: "इंसानी विज़िट",
        humanLeads: "नई लीड",
        botLeadsHint: "{{count}} बॉट लीड बाहर रखी गईं",
        botVisitsHint: "{{count}} बॉट विज़िट बाहर रखी गईं",
        excludedLeadsHint: "{{bots}} बॉट और {{unknown}} अनजान लीड बाहर रखी गईं",
        excludedVisitsHint:
          "{{bots}} बॉट और {{unknown}} अनजान विज़िट बाहर रखी गईं",
        creditSpendHintNoPrevCost:
          "प्रोवाइडर कॉस्ट {{cost}} (पिछली अवधि में दर्ज नहीं थी)। गेस्ट: {{guests}}।",
        creditSpendHintNoCompare: "प्रोवाइडर कॉस्ट {{cost}}। गेस्ट: {{guests}}।",
        payersHint: "अवधि में अलग-अलग पेयर",
        signups: "साइनअप",
        signupRateHint: "नई लीड का {{rate}}",
        payers: "पेमेंट करने वाले कस्टमर",
        revenue: "रेवेन्यू",
        revenueHint: "जमा हुआ कैश, लगभग USD",
        revenueNetHint: "जमा हुआ कैश, लगभग USD। AI प्रोवाइडर कॉस्ट के बाद {{net}}।",
        creditSpend: "AI यूसेज (ख़र्च हुए क्रेडिट)",
        guestSpendHint: "गेस्ट द्वारा {{amount}}",
        creditSpendHint:
          "प्रोवाइडर कॉस्ट {{cost}} ({{previous}} के मुक़ाबले)। गेस्ट: {{guests}}।",
        margin: "AI यूसेज मार्जिन",
        marginPartial: "AI मार्जिन (आंशिक)",
        marginHint:
          "प्रोवाइडर कॉस्ट {{cost}}। जहाँ कॉस्ट पता है वहाँ बिल की रकम घटा कॉस्ट।",
        marginBaseHint:
          "कॉस्ट डेटा वाले {{base}} बिल्ड यूसेज का {{rate}}। प्रोवाइडर कॉस्ट {{cost}}।",
        marginRateHint:
          "कॉस्ट डेटा वाले {{base}} पर {{margin}} (यूसेज का {{coverage}})।",
        errors: "अनसुलझे एरर",
        errorsHint: "अवधि में {{count}} बार हुए",
        botShare: "लीड में बॉट का हिस्सा",
        botShareHint: "{{count}} बॉट लीड, टॉप सोर्स 'ध्यान चाहिए' में",
        botShareTopHint: "{{count}} बॉट लीड। सबसे बड़ा बर्स्ट {{prefix}}।",
      },
      trafficChart: "इंसानी लीड और साइन अप",
      trafficChartHint: "बॉट बाहर रखे गए",
      moneyChart: "रेवेन्यू",
      moneyChartHint: "हर बकेट में जमा कैश",
      series: {
        visits: "विज़िट",
        leads: "नई लीड",
        signups: "साइनअप",
        revenueUsd: "रेवेन्यू",
        spendUsd: "बिल हुआ AI यूसेज",
        upstreamCostUsd: "प्रोवाइडर लागत",
      },
      sources: "लीड कहाँ से आती हैं (पहला टच)",
      sourcesDimension: "चैनल",
      sourcesHint: "हर व्यक्ति के पहले टच चैनल के हिसाब से इस अवधि की गतिविधि",
      referralsHint: "इस अवधि में कोड के नाम दर्ज क्लिक, साइन अप और पेमेंट",
      leadShare: "लीड हिस्सा",
      revenueShare: "रेवेन्यू हिस्सा",
      footerSources: "इन पंक्तियों में रेवेन्यू: अवधि में जमा हुए {{total}} में से {{rows}}",
      footerReferrals:
        "कोड के नाम दर्ज (कमीशन का आधार): अवधि में जमा हुए {{total}} में से {{rows}}",
      referrals: "टॉप रेफ़रल कोड",
      referralsDimension: "कोड",
      columns: {
        leads: "लीड",
        signups: "साइनअप",
        payers: "पेमेंट करने वाले",
        clicks: "क्लिक",
        revenueUsd: "रेवेन्यू",
        conversion: "लीड से साइन अप",
        clickToSignup: "क्लिक से साइनअप",
      },
      alerts: {
        severity: { high: "हाई", medium: "मीडियम", low: "लो" },
        title: "ध्यान चाहिए",
        none: "इस अवधि में किसी चीज़ पर ध्यान देने की ज़रूरत नहीं।",
        abuse: "लीड बर्स्ट वाली {{count}} IP रेंज, टॉप {{prefix}} ({{leads}} लीड)",
        payouts: "{{count}} पेआउट रिक्वेस्ट इंतज़ार में ({{amount}})",
        tasks: "{{count}} शेड्यूल्ड टास्क फ़ेल हो रहे हैं",
        connections: "{{count}} रिमोट कनेक्शन ठीक नहीं हैं",
        failedPayments: "पिछले 30 दिनों में फ़ेल पेमेंट: {{count}}",
        disputes: "खुले पेमेंट डिस्प्यूट: {{count}}",
        costCoverage:
          "AI यूसेज के सिर्फ़ {{coverage}} की प्रोवाइडर कॉस्ट पता है, इसलिए मार्जिन आंशिक है",
        unattributed: "रेवेन्यू के {{share}} का सोर्स पता नहीं ({{amount}})",
        errors: "{{count}} अनसुलझे एरर, अवधि में {{occurrences}} बार हुए",
        errorsSince:
          "{{count}} अनसुलझे एरर, {{date}} से {{occurrences}} बार हुए (रोज़ की गिनती तभी से शुरू होती है)",
      },
      open: {
        acquisition: "एक्विज़िशन रिपोर्ट",
        funnel: "फ़नल",
        referrals: "रेफ़रल ओवरव्यू",
        revenue: "रेवेन्यू रिपोर्ट",
        usage: "AI यूसेज रिपोर्ट",
        errors: "एरर लॉग",
      },
      unavailable: "यह सेक्शन लोड नहीं हो सका।",
      asOf: "डेटा {{time}} तक का है। एक मिनट के लिए कैश किया गया।",
      loading: "ओवरव्यू लोड हो रहा है",
    },
    errors: {
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "बिज़नेस ओवरव्यू देखने के लिए एडमिन के रूप में साइन इन करें।",
      },
      validation: {
        title: "अवधि गलत है",
        description: "अवधि और तारीख़ें जाँचें।",
      },
      server: {
        title: "ओवरव्यू फ़ेल हुआ",
        description: "ओवरव्यू कैलकुलेट नहीं हो सका। फिर कोशिश करें।",
      },
      unknown: {
        title: "अनपेक्षित एरर",
        description: "ओवरव्यू लोड करते समय कुछ गलत हो गया।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक पहुँच नहीं हो सकी।",
      },
      forbidden: {
        title: "सिर्फ़ एडमिन",
        description: "बिज़नेस ओवरव्यू सिर्फ़ एडमिन देख सकते हैं।",
      },
      notFound: {
        title: "नहीं मिला",
        description: "ओवरव्यू उपलब्ध नहीं है।",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले अपने बदलाव सेव करें या छोड़ दें।",
      },
      conflict: {
        title: "टकराव",
        description: "लोड होते समय डेटा बदल गया। फिर कोशिश करें।",
      },
    },
    success: {
      title: "ओवरव्यू लोड हो गया",
      description: "चुनी हुई अवधि का बिज़नेस ओवरव्यू।",
    },
  },
};
