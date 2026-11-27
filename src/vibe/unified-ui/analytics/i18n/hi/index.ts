/**
 * Shared analytics vocabulary.
 *
 * Endpoints that use `analyticsWindowFields` spread these translations at the
 * root of their own i18n (`...analyticsTranslations`) so the field labels and
 * enum values resolve in their scope as well.
 */
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  analytics: {
    review: "देखें",
    reviewItem: "{{item}} देखें",
    range: {
      label: "अवधि",
      description: "रिपोर्ट की समय सीमा",
      last7Days: "पिछले 7 दिन",
      last30Days: "पिछले 30 दिन",
      last90Days: "पिछले 90 दिन",
      last6Months: "पिछले 6 महीने",
      last12Months: "पिछले 12 महीने",
      allTime: "अब तक",
      custom: "कस्टम",
    },
    rangeShort: {
      last7Days: "7d",
      last30Days: "30d",
      last90Days: "90d",
      last6Months: "6m",
      last12Months: "12m",
      allTime: "सब",
      custom: "कस्टम",
    },
    from: {
      label: "से",
      description: "शुरुआती तारीख़ (कस्टम अवधि, शामिल)",
    },
    to: {
      label: "तक",
      description: "आख़िरी तारीख़ (कस्टम अवधि, शामिल)",
    },
    granularity: {
      label: "ग्रुप करें",
      description: "चार्ट के लिए बकेट का आकार",
      auto: "ऑटो",
      day: "दिन",
      week: "सप्ताह",
      month: "महीना",
    },
    chart: {
      points: "{{value}} pp",
      vsValue: "बनाम {{value}}",
      comparedTo: "बनाम {{period}}",
      vsPrevious: "पिछली अवधि के मुकाबले",
      noPrevious: "पिछला डेटा नहीं",
      empty: "इस अवधि में कोई डेटा नहीं।",
      total: "कुल",
      other: "अन्य",
      share: "हिस्सा",
      unknown: "अज्ञात",
      none: "(कोई नहीं)",
      ofPrevious: "पिछले स्टेप का",
      ofFirst: "पहले स्टेप का",
      dropOff: "ड्रॉप-ऑफ़",
      open: "खोलें",
      openList: "लिस्ट खोलें",
      period: "अवधि",
      showing: "{{total}} में से {{count}} दिख रहे हैं",
      showAll: "सब दिखाएँ",
      showLess: "कम दिखाएँ",
      series: "सीरीज़",
      value: "वैल्यू",
      apply: "लागू करें",
      clearFilters: "फ़िल्टर हटाएँ",
      filters: "फ़िल्टर",
      refresh: "रिफ़्रेश",
      byGranularity: "{{granularity}} के हिसाब से",
      groupedBy: {
        day: "दिन के हिसाब से",
        week: "सप्ताह के हिसाब से",
        month: "महीने के हिसाब से",
      },
    },
  },
};
