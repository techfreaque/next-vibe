import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Deps",
  titleShort: "Deps",
  description:
    "ऑल-इन-वन डिपेंडेंसी एनालाइज़र। पूरे कोडबेस का इम्पोर्ट ग्राफ़ बनाता है और पैकेज की सीमाएँ लागू करता है। इम्पोर्ट ग्राफ़ और डेड कोड के लिए --mode=files / categories / unused। --mode=boundaries दिखाता है कि कोई पैकेज ऐप कोड में कौन से इम्पोर्ट करता है (एक्सट्रैक्शन से पहले ठीक करने वाले मूव)। --mode=layers गलत क्रॉस-पैकेज दिशा को फ़्लैग करता है। --mode=shared-candidates उन ऐप प्रिमिटिव को रैंक करता है जिन पर पैकेज पहले से निर्भर हैं। --mode=importers --focus=X एक फ़ाइल के इम्पोर्टर को पैकेज के हिसाब से बाँटता है।",
  category: "डेवलपमेंट टूल्स",
  tag: "analysis",

  mode: {
    report: "रिपोर्ट",
    files: "फ़ाइलें",
    categories: "कैटेगरी",
    unused: "अनउपयोगी",
    boundaries: "सीमाएँ",
    layers: "लेयर",
    sharedCandidates: "शेयर्ड कैंडिडेट",
    importers: "Importers",
    needsMove: "मूव चाहिए",
    unusedSymbols: "अनउपयोगी सिंबल",
    unusedI18n: "अनउपयोगी i18n key",
    crossDomain: "क्रॉस-डोमेन",
    pageViolations: "पेज उल्लंघन",
  },

  container: {
    title: "डिपेंडेंसी एनालिसिस",
    description: "डिपेंडेंसी स्कैन का दायरा और मोड कॉन्फ़िगर करें",
  },

  fields: {
    focus: {
      label: "फ़ोकस पाथ",
      description:
        "किसी ख़ास फ़ाइल या डायरेक्टरी तक सीमित करें (जैसे 'agent/ai-stream' या 'user')। पूरे कोडबेस के लिए खाली छोड़ें।",
      placeholder: "जैसे agent/ai-stream या user",
    },
    mode: {
      label: "मोड",
      description:
        "files: हर फ़ाइल का इम्पोर्ट ग्राफ़। categories: टॉप-लेवल डायरेक्टरी में समेटा हुआ। unused: बिना इम्पोर्टर वाली फ़ाइलें। boundaries: ऐप कोड में पैकेज के इम्पोर्ट। layers: गलत क्रॉस-पैकेज दिशा। shared-candidates: वो ऐप प्रिमिटिव जिन पर पैकेज निर्भर हैं। importers: एक फ़ाइल के इम्पोर्टर पैकेज के हिसाब से (--focus चाहिए)।",
    },
    package: {
      label: "पैकेज",
      description:
        "boundaries/layers को किसी एक घोषित पैकेज तक सीमित करें (जैसे vibe-ui, vibe-unified-ui)। सभी पैकेज के लिए खाली छोड़ें।",
      placeholder: "जैसे vibe-unified-ui",
    },
    depth: {
      label: "गहराई",
      description:
        "ट्रांज़िटिव डिपेंडेंसी के कितने स्तर शामिल करने हैं (डिफ़ॉल्ट: 1, सिर्फ़ सीधे)। 0 = असीमित।",
    },
    limit: {
      label: "सीमा",
      description: "लौटाई जाने वाली एंट्री की अधिकतम संख्या (डिफ़ॉल्ट: 100)।",
    },
  },

  response: {
    success: "डिपेंडेंसी एनालिसिस पूरा",
    entries: {
      title: "डिपेंडेंसी एंट्री",
      emptyState: {
        description: "दिए गए फ़िल्टर से कोई फ़ाइल मेल नहीं खाई।",
      },
      importedBy: "imported by",
    },
    summary: {
      title: "सारांश",
      totalFiles: "स्कैन की कुल फ़ाइलें",
      totalEdges: "कुल इम्पोर्ट एज",
      unusedCount: "अनउपयोगी एक्सपोर्ट",
    },
    boundaries: {
      title: "पैकेज की सीमाएँ",
      cleanState: "कोई सीमा उल्लंघन नहीं। पैकेज आत्मनिर्भर हैं।",
      legendTitle: "लेजेंड",
      legendOut: "पैकेज से बाहर (पैकेज ऐप कोड तक पहुँचता है)",
      legendCross: "क्रॉस-पैकेज (गलत डिपेंडेंसी)",
      legendReverse: "उलटी दिशा (निचली लेयर ऊपरी को इम्पोर्ट करती है)",
      legendHot: "हॉट टारगेट (10+ इम्पोर्टर: कोर की ओर सबसे मज़बूत खिंचाव)",
      colTarget: "टारगेट",
      colCount: "इस्तेमाल करता है",
      colKind: "प्रकार",
      packageHeader: "पैकेज",
      violationsAcross: "उल्लंघन, इतने में",
      packagesWord: "पैकेज",
    },
    layers: {
      title: "लेयर की दिशा",
      cleanState: "दिशा साफ़ है। कोई गलत क्रॉस-पैकेज इम्पोर्ट नहीं।",
      edge: "इम्पोर्ट",
    },
    sharedCandidates: {
      title: "शेयर्ड कैंडिडेट",
      description:
        "पैकेज के इम्पोर्ट की गई ऐप-कोड फ़ाइलें, पैकेज-इम्पोर्टर की गिनती के हिसाब से रैंक। ऊँचा = vibe-core में खींचने लायक।",
      colCount: "पैकेज इस्तेमाल",
      colPath: "पाथ",
      emptyState: "पैकेज कोड कोई ऐप फ़ाइल इम्पोर्ट नहीं करता।",
    },
    importers: {
      title: "पैकेज के हिसाब से इम्पोर्टर",
      colCount: "इस्तेमाल करता है",
      colGroup: "पैकेज / कैटेगरी",
    },
    needsMove: {
      title: "मूव लिस्ट",
      description:
        "वो फ़ाइलें जो अभी अपनी अंतिम जगह पर नहीं हैं, मंज़िल के क्षेत्र के हिसाब से ग्रुप। व्हाइटलिस्ट फ़ाइलें (पहले से सही जगह) चुप रहती हैं। ऊपर से नीचे पढ़ें: यही मूव का क्रम है।",
      colTarget: "→ क्षेत्र",
      colPath: "फ़ाइल",
      emptyState: "दायरे की हर चीज़ अपनी जगह पर है। कुछ हिलाना नहीं।",
      relocate: "relocate",
      reorganize: "reorg",
    },
    unusedSymbols: {
      title: "अनउपयोगी पब्लिक सतह",
      description:
        "डेड एक्सपोर्ट, अनउपयोगी स्टैटिक मेथड और बिना इम्पोर्टर वाली फ़ाइलें। समीक्षा के लिए regex-आधारित संकेत: सतर्क (डायनामिक इस्तेमाल छूट सकता है)।",
      colKind: "प्रकार",
      colSymbol: "सिंबल",
      colPath: "फ़ाइल",
      emptyState: "दायरे में कोई अनउपयोगी पब्लिक सतह नहीं मिली।",
      wholeFile: "(पूरी फ़ाइल: कोई इम्पोर्टर नहीं)",
    },
    unusedI18n: {
      title: "अनउपयोगी i18n key",
      description:
        "स्कोप्ड en ट्रांसलेशन की वो key जिन्हें कोई सोर्स फ़ाइल रेफ़रेंस नहीं करती। t(`a.b.<x>`) जैसे टेम्पलेट प्रीफ़िक्स अपने सबट्री को बचाते हैं। en, de और pl से साथ-साथ हटाएँ।",
      colKey: "key",
      colPath: "फ़ाइल",
      emptyState: "दायरे की हर ट्रांसलेशन key रेफ़रेंस की गई है।",
    },
    pageViolations: {
      title: "पेज आर्किटेक्चर उल्लंघन",
      description:
        "page.tsx फ़ाइलें जो repository/definition/i18n/page-client से ज़्यादा इम्पोर्ट करती हैं। पेज पतले SSR शेल होने चाहिए: बिज़नेस लॉजिक, UI, enum और db एक्सेस repository.ts या page-client.tsx में रहने चाहिए।",
      colCount: "उल्लंघन",
      colPath: "पेज",
      emptyState: "सभी page.tsx फ़ाइलें आर्किटेक्चर सीमा का पालन करती हैं।",
    },
    crossDomain: {
      title: "क्रॉस-डोमेन कैंडिडेट",
      description:
        "वो इम्पोर्ट जो डोमेन सीमा पार करते हैं और अनुमत फ़्रेमवर्क प्रिमिटिव नहीं हैं। हर एक को vibe (engine/core) में ले जाने या अलग करने का उम्मीदवार माना जाता है। सबसे ज़्यादा पहुँचे पहले। अनुमत प्रिमिटिव एज अलग गिने जाते हैं, छिपाए नहीं जाते।",
      colCount: "इस्तेमाल करता है",
      colTarget: "पहुँचा जाने वाला टारगेट",
      emptyState: "कोई अनसमीक्षित क्रॉस-डोमेन एज नहीं। पार होने वाली हर चीज़ अनुमत है।",
      allowedTally: "अनुमत प्रिमिटिव एज (लिस्ट नहीं)",
    },
    violations: {
      title: "उल्लंघन",
      outOfPackage: "पैकेज से बाहर",
      crossPackage: "क्रॉस पैकेज",
      reverseDirection: "उलटी दिशा",
      total: "कुल",
    },
  },

  errors: {
    validation: {
      title: "गलत पैरामीटर",
      description: "डिपेंडेंसी एनालिसिस के पैरामीटर गलत हैं",
    },
    internal: {
      title: "इंटरनल एरर",
      description: "डिपेंडेंसी एनालिसिस के दौरान इंटरनल एरर आया",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "आपके पास डिपेंडेंसी एनालिसिस चलाने की अनुमति नहीं है",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "डिपेंडेंसी एनालिसिस का एक्सेस मना है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "बताया गया फ़ोकस पाथ नहीं मिला",
    },
    focusNotFound: "फ़ोकस पाथ {{focus}} से कोई फ़ाइल मेल नहीं खाती",
    server: {
      title: "सर्वर एरर",
      description: "डिपेंडेंसी एनालिसिस के दौरान सर्वर एरर आया",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "डिपेंडेंसी एनालिसिस के दौरान कोई अज्ञात एरर आया",
    },
    unsaved: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "डिपेंडेंसी एनालिसिस के दौरान टकराव हुआ",
    },
  },

  success: {
    title: "एनालिसिस पूरा",
    description: "डिपेंडेंसी एनालिसिस सफलतापूर्वक पूरा हुआ",
  },
};
