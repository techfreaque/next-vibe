import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Stage",
  titleShort: "Vibe Stage",
  description:
    "पैटर्न जाँच पास करने वाली बॉयलरप्लेट फ़ाइलें (route.ts, i18n/*/index.ts) अपने आप स्टेज करता है। किसी भी फ़ाइल के सिर्फ़-import बदलाव भी स्टेज करता है, या मिले-जुले बदलाव वाली फ़ाइलों से सिर्फ़ import हिस्से आंशिक रूप से स्टेज करता है।",
  fields: {
    dryRun: {
      label: "ड्राई रन",
      description: "git add चलाए बिना देखें कि कौन सी फ़ाइलें स्टेज होंगी",
    },
    paths: {
      label: "पाथ तक सीमित करें",
      description:
        "सिर्फ़ इन पाथ के नीचे के उम्मीदवार देखें। सभी अनस्टेज बदलाव स्कैन करने के लिए खाली छोड़ें।",
      placeholder: "जैसे src",
    },
  },
  response: {
    staged: "स्टेज हुईं",
    partiallyStaged: "आंशिक स्टेज (सिर्फ़ imports)",
    skipped: "छोड़ी गईं (उल्लंघन)",
    renamed: "नाम बदला (मूव)",
    deleted: "हटाई गईं (generated/fixtures)",
    noChanges: "वर्किंग ट्री में स्टेज करने लायक कोई फ़ाइल नहीं मिली",
    dryRunNote: "ड्राई रन: असल में कोई फ़ाइल स्टेज नहीं हुई",
  },
  errors: {
    validation: {
      title: "पैरामीटर गलत हैं",
      description: "vibe stage के पैरामीटर गलत हैं",
    },
    internal: {
      title: "आंतरिक एरर",
      description: "vibe stage चलाते समय एरर हुई",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "vibe stage चलाने के लिए लॉग इन होना ज़रूरी है",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "vibe stage का एक्सेस प्रतिबंधित है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "कोई git रिपॉज़िटरी नहीं मिली",
    },
    server: {
      title: "सर्वर एरर",
      description: "vibe stage के दौरान सर्वर एरर हुई",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "vibe stage के दौरान अज्ञात एरर हुई",
    },
    unsaved: {
      title: "बिना सेव किए बदलाव",
      description: "बिना सेव बदलाव मिले",
    },
    conflict: {
      title: "टकराव",
      description: "vibe stage के दौरान टकराव हुआ",
    },
  },
  success: {
    title: "स्टेज पूरा",
    description: "बॉयलरप्लेट फ़ाइलें सफलतापूर्वक स्टेज हुईं",
  },
  widget: {
    title: "Vibe Stage",
    subtitle: "पैटर्न जाँच पास करने वाली बॉयलरप्लेट फ़ाइलें अपने आप स्टेज करें",
    submit: "स्टेज चलाएँ",
    dryRun: "ड्राई रन",
    staged: "स्टेज हुईं",
    partiallyStaged: "आंशिक स्टेज",
    skipped: "छोड़ी गईं",
    renamed: "नाम बदला",
    deleted: "हटाई गईं",
    stagedCount: "फ़ाइलें स्टेज हुईं",
    partiallyStaged_count: "फ़ाइलें आंशिक स्टेज (सिर्फ़ imports)",
    skippedCount: "फ़ाइलें छोड़ी गईं (उल्लंघन)",
    renamedCount: "मूव स्टेज हुए",
    deletedCount: "हटाना स्टेज हुआ",
    renameFile: "मूव हुईं",
    deleteFile: "हटाईं",
    noChanges: "स्टेज करने लायक कोई फ़ाइल नहीं मिली",
    noChangesHint:
      "बॉयलरप्लेट फ़ाइलें, सिर्फ़-import बदलाव या import हिस्सों वाली फ़ाइलें यहाँ दिखेंगी",
    dryRunBadge: "ड्राई रन",
    dryRunNote: "सिर्फ़ प्रिव्यू: कोई फ़ाइल स्टेज नहीं हुई",
    cleanFile: "साफ़",
    partialFile: "सिर्फ़ imports",
    violationsFile: "उल्लंघन",
    loading: "वर्किंग ट्री स्कैन हो रहा है...",
  },
};
