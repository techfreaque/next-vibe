import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "गलत रिक्वेस्ट",
      description: "पब्लिशिंग ओवरव्यू लोड नहीं हो सका।",
    },
    unauthorized: {
      title: "साइन इन ज़रूरी है",
      description: "पब्लिशिंग ओवरव्यू लोड नहीं हो सका।",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन के लिए",
      description: "आँकड़े देखने के लिए एडमिन रोल चाहिए",
    },
    notFound: {
      title: "कोई डेटा नहीं",
      description: "पब्लिशिंग ओवरव्यू लोड नहीं हो सका।",
    },
    server: {
      title: "पब्लिशिंग ओवरव्यू",
      description: "पब्लिशिंग ओवरव्यू लोड नहीं हो सका।",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "पब्लिशिंग ओवरव्यू तक पहुँच नहीं हो सकी",
    },
    unknown: {
      title: "पब्लिशिंग ओवरव्यू",
      description: "पब्लिशिंग ओवरव्यू लोड नहीं हो सका।",
    },
    unsavedChanges: {
      title: "बिना सेव बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "रिक्वेस्ट मौजूदा डेटा से टकराती है",
    },
  },
  title: "पब्लिशिंग ओवरव्यू",
  description: "पब्लिक फ़ोरम और सेव किए IndexNow सबमिशन की गिनती।",
  threads: "पब्लिक फ़ोरम थ्रेड",
  savedUrls: "सेव किए IndexNow URL",
  snapshotOn: "{{date}} (UTC) का स्नैपशॉट",
  newestThread: "सबसे नया पब्लिक थ्रेड",
  indexingSnapshot: "IndexNow स्नैपशॉट",
  newestOn: "सबसे नया पब्लिक थ्रेड {{date}} को।",
  noThreads: "अभी कोई पब्लिक थ्रेड नहीं।",
  indexingSavedOn:
    "IndexNow आख़िरी बार {{date}} को सेव हुआ। इंडेक्सिंग की रिपोर्ट सर्च इंजन अलग से देते हैं।",
  noIndexingSnapshot: "इस इंस्टेंस पर कोई IndexNow सबमिशन दर्ज नहीं है।",
  noIndexingRecordsYet: "अभी कोई रिकॉर्ड नहीं",
  loading: "पब्लिशिंग ओवरव्यू लोड हो रहा है…",
};
