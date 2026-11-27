import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    title: "चालू टर्मिनल",
    back: "वापस",
    lastCommand: "आख़िरी कमांड",
    noTerminals: "कोई चालू टर्मिनल नहीं",
    noTerminalsHint: 'टर्मिनल सेशन शुरू करने के लिए "कमांड चलाएँ" से कोई कमांड चलाएँ।',
    openExec: "कमांड चलाएँ",
    terminalCount: "टर्मिनल",
    machineLabel: "मशीन",
    cwdLabel: "cwd",
    statusLabel: "स्टेटस",
    openedLabel: "खुला",
    openTerminal: "खोलें",
    manageConnections: "कनेक्शन",
    activeStatus: "चालू",
  },
  get: {
    title: "टर्मिनल देखें",
    titleShort: "टर्मिनल",
    description: "चालू टर्मिनल सेशन की लिस्ट, उनकी मौजूदा वर्किंग डायरेक्टरी के साथ।",
    dynamicTitle: "टर्मिनल: {{path}}",
    status: {
      loading: "लोड हो रहा है...",
      done: "लोड हो गया",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "मशीन",
        description:
          "किसी खास मशीन तक सीमित करें, जैसे /ssh/local-machine। सब देखने के लिए खाली छोड़ें।",
      },
    },
    response: {
      terminals: {
        terminalId: { content: "टर्मिनल ID" },
        connectionSlug: { content: "मशीन" },
        cwd: { content: "वर्किंग डायरेक्टरी" },
        name: { content: "नाम" },
        openedAt: { content: "खुला" },
        lastCommandAt: { content: "आख़िरी कमांड" },
        status: { content: "स्टेटस" },
      },
      total: { text: "कुल" },
    },
    errors: {
      validation: {
        title: "गलत इनपुट",
        description: "पाथ जाँचें",
      },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच पा रहे" },
      unauthorized: { title: "लॉग इन नहीं हैं", description: "पहले लॉग इन करें" },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई टर्मिनल नहीं मिला",
      },
      server: { title: "सर्वर एरर", description: "कुछ टूट गया" },
      unknown: { title: "एरर", description: "कुछ गड़बड़ हो गई" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले सेव करें या छोड़ दें",
      },
      conflict: {
        title: "टकराव",
        description: "टकराती हुई कार्रवाई",
      },
    },
    success: {
      title: "टर्मिनल की लिस्ट बन गई",
      description: "चालू टर्मिनल लोड हो गए",
    },
  },
};
