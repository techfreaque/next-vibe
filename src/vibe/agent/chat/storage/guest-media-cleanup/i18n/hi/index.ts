import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "मेंटेनेंस",
  },
  post: {
    title: "गेस्ट मीडिया क्लीनअप",
    titleShort: "गेस्ट मीडिया क्लीनअप",
    description:
      "गेस्ट ने इनकॉग्निटो चैट और अलग टूल रन में जो मीडिया बनाया, वह रिटेंशन विंडो पार होने पर डिलीट करें। सिर्फ़ उन गेस्ट का जिन्होंने कभी साइन अप या लॉगिन नहीं किया। सेव किए थ्रेड और अकाउंट की फ़ाइलें कभी नहीं छुई जातीं।",
    container: {
      title: "गेस्ट मीडिया क्लीनअप",
      description: "शेड्यूल्ड क्लीनअप का प्रीव्यू देखें",
    },
    fields: {
      batchSize: {
        label: "अधिकतम डिलीशन",
        description:
          "एक रन में ज़्यादा से ज़्यादा कितनी फ़ाइलें डिलीट हों। बाक़ी अगले रन में।",
      },
      dryRun: {
        label: "ड्राई रन",
        description: "डिलीट किए बिना सभी योग्य फ़ाइलें और बाइट गिनें",
      },
    },
    response: {
      cutoff: "कटऑफ़",
      namespacesScanned: "स्कैन किए नेमस्पेस",
      storedThreadNamespaces: "छोड़े गए सेव्ड थ्रेड",
      filesScanned: "स्कैन की गई फ़ाइलें",
      eligibleFiles: "योग्य फ़ाइलें",
      eligibleBytes: "योग्य बाइट",
      filesDeleted: "डिलीट हुई फ़ाइलें",
      bytesDeleted: "डिलीट हुए बाइट",
      skippedTooNew: "रखी गईं: रिटेंशन के अंदर",
      skippedUserOwned: "रखी गईं: अकाउंट की हैं",
      skippedUnowned: "रखी गईं: कोई मालिक नहीं",
      skippedAccountLead: "रखी गईं: लीड अकाउंट से जुड़ी है",
      deferred: "अगले रन पर टाला गया",
      failed: "फ़ेल",
      rowsDeleted: "डिलीट हुई स्टूडियो रो",
      scanComplete: "स्कैन पूरा",
      executionTimeMs: "एक्ज़ीक्यूशन टाइम (ms)",
    },
    success: {
      title: "क्लीनअप हो गया",
      description: "गेस्ट मीडिया स्कैन पूरा हुआ",
    },
  },
  errors: {
    scheduledOnly: "सिर्फ़ प्रोडक्शन गेस्ट मीडिया क्रॉन फ़ाइलें डिलीट कर सकता है।",
    failed: "गेस्ट मीडिया क्लीनअप फ़ेल हुआ: {{error}}",
    server: {
      title: "क्लीनअप एरर",
      description: "गेस्ट मीडिया क्लीनअप फ़ेल हुआ",
    },
  },
  task: {
    name: "गेस्ट मीडिया क्लीनअप",
    description:
      "इनकॉग्निटो चैट और अलग टूल रन के एक्सपायर्ड गेस्ट मीडिया की रोज़ाना सफ़ाई",
  },
};
