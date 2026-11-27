import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "कमांड चलाएँ",
    titleShort: "कमांड चलाएँ",
    description:
      "किसी मशीन पर शेल कमांड चलाएँ। सिर्फ़ /ssh/ पाथ पर काम करता है। टर्मिनल स्थायी रहता है, इसलिए cwd कॉल के बीच बना रहता है। कॉन्फ़िगर हो तो नए सेशन डिफ़ॉल्ट माउंट डायरेक्टरी में शुरू होते हैं।",
    dynamicTitle: "{{path}}: {{command}}",
    status: {
      loading: "चल रहा है...",
      done: "हो गया",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "मशीन",
        description:
          'SSH मशीन का पाथ। /ssh/ से शुरू होना चाहिए। मशीनें और उनके माउंट ढूँढने के लिए cortex-list(path="/ssh") इस्तेमाल करें।',
      },
      command: {
        label: "कमांड",
        description: "चलाने के लिए शेल कमांड",
        placeholder: "echo hello",
      },
      workingDir: {
        label: "वर्किंग डायरेक्टरी",
        description:
          "इस कमांड के लिए cwd बदलें। खाली हो तो टर्मिनल की मौजूदा डायरेक्टरी इस्तेमाल होती है।",
        placeholder: "/home/user/project",
      },
      terminalId: {
        label: "टर्मिनल ID",
        description:
          "किसी खास टर्मिनल सेशन को दोबारा इस्तेमाल करें। खाली हो तो इस कनेक्शन का डिफ़ॉल्ट टर्मिनल इस्तेमाल होता है।",
      },
      timeoutMs: {
        label: "टाइमआउट (ms)",
        description: "अधिकतम चलने का समय। डिफ़ॉल्ट 30000ms। अधिकतम 300000ms।",
        placeholder: "30000",
      },
    },
    submitButton: {
      label: "चलाएँ",
      loadingText: "चल रहा है...",
    },
    response: {
      output: { content: "आउटपुट" },
      exitCode: { title: "एग्ज़िट कोड" },
      cwd: { content: "वर्किंग डायरेक्टरी" },
      terminalId: { content: "टर्मिनल ID" },
      backend: { title: "बैकएंड" },
      truncated: { title: "काटा गया" },
    },
    errors: {
      validation: {
        title: "गलत इनपुट",
        description: "पाथ और कमांड जाँचें",
      },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच पा रहे" },
      unauthorized: { title: "लॉग इन नहीं हैं", description: "पहले लॉग इन करें" },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "इस मशीन की अनुमति नहीं है",
      },
      notFound: {
        title: "मशीन नहीं मिली",
        description: "इस पाथ पर कोई SSH कनेक्शन या रिमोट इंस्टेंस नहीं है",
      },
      server: { title: "एक्ज़ीक्यूट फ़ेल", description: "कमांड नहीं चल पाई" },
      unknown: { title: "एरर", description: "कुछ गड़बड़ हो गई" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले सेव करें या छोड़ दें",
      },
      conflict: {
        title: "सेशन टकराव",
        description: "टर्मिनल सेशन व्यस्त है",
      },
    },
    success: {
      title: "कमांड पूरी हुई",
      description: "कमांड चल गई",
    },
  },
  errors: {
    invalidWorkingDir:
      "वर्किंग डायरेक्टरी एब्सोल्यूट पाथ होनी चाहिए और उसमें '..' नहीं होना चाहिए",
    commandTimedOut: "कमांड टाइमआउट हो गई",
    invalidPath: "पाथ /ssh/ से शुरू होना चाहिए",
    noConnection: "इस पाथ पर कोई कनेक्शन नहीं मिला",
    connectionNotFound: "कनेक्शन नहीं मिला",
    encryptionFailed: "एन्क्रिप्शन फ़ेल हुआ। JWT_SECRET_KEY गलत हो सकती है",
    connectTimeout: "कनेक्शन टाइमआउट हो गया",
    sshAuthFailed: "SSH ऑथेंटिकेशन फ़ेल हुआ",
    sshConnectionFailed: "SSH कनेक्शन फ़ेल हुआ",
    fingerprintMismatch:
      "होस्ट का फ़िंगरप्रिंट बदल गया है। सुरक्षा का जोखिम हो सकता है। कनेक्शन हटाकर दोबारा जोड़ें।",
    remoteNotSupported:
      "रिमोट कनेक्शन पर exec अभी सपोर्ट नहीं है। सीधा SSH कनेक्शन इस्तेमाल करें।",
  },
  log: {
    execComplete: "कमांड चल गई",
    openedLocal: "लोकल टर्मिनल खुला",
    failedLocal: "लोकल टर्मिनल नहीं खुल पाया",
    openedSsh: "SSH टर्मिनल खुला",
    failedFingerprint: "फ़िंगरप्रिंट सेव नहीं हो पाया",
    failedPty: "SSH PTY नहीं खुल पाया",
    escalated: "लंबी चलने वाली कमांड को बैकग्राउंड टास्क में भेज दिया",
  },
  widget: {
    title: "टर्मिनल",
    back: "वापस",
    machineLabel: "मशीन",
    machinePlaceholder: "/ssh/local-machine",
    placeholder: "कमांड लिखें...",
    runButton: "चलाएँ",
    running: "चल रहा है...",
    clearButton: "साफ़ करें",
    ctrlEnterHint: "चलाने के लिए Ctrl+Enter",
    exitCodeLabel: "एग्ज़िट कोड",
    backendLabel: "बैकएंड",
    cwdLabel: "वर्किंग डायरेक्टरी",
    terminalLabel: "टर्मिनल",
    truncatedWarning: "आउटपुट काटा गया",
    emptyOutput: "कोई आउटपुट नहीं",
    outputLabel: "आउटपुट यहाँ दिखेगा",
    outputTitle: "आउटपुट",
    historyTitle: "हिस्ट्री",
    noHistory: "अभी कोई कमांड नहीं",
    manageConnections: "कनेक्शन",
    viewTerminals: "टर्मिनल",
    successStatus: "सफल",
    failedStatus: "फ़ेल",
    picker: {
      browse: "ब्राउज़ करें",
      cancel: "रद्द करें",
      machinesTitle: "मशीन चुनें",
      machines: "मशीनें",
      loading: "लोड हो रहा है...",
      noMachines: "कोई मशीन कॉन्फ़िगर नहीं है",
      defaultBadge: "डिफ़ॉल्ट",
      useDir: "यह डायरेक्टरी इस्तेमाल करें",
      emptyDir: "खाली डायरेक्टरी",
    },
  },
};
