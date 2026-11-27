import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "सब्सक्रिप्शन",
    company: "कंपनी",
    get: "लाएँ",
  },
  view: {
    empty: "कोई मालिक सब्सक्रिप्शन नहीं",
    emptyHelp: "आपके अकाउंट पर कोई सब्सक्रिप्शन नहीं है।",
    status: "स्थिति",
    interval: "बिलिंग अंतराल",
    periodStart: "मौजूदा अवधि शुरू",
    periodEnd: "मौजूदा अवधि समाप्त",
    unavailable: "दर्ज नहीं",
    provider: "पेमेंट प्रोवाइडर",
    cancellation: "रद्दीकरण",
    endOfPeriod: "अवधि के अंत में",
    scheduled: "तय रद्दीकरण",
    canceled: "रद्द होने की तारीख़",
    ended: "समाप्त होने की तारीख़",
    open: "सब्सक्रिप्शन का ब्योरा खोलें",
    list: "सब्सक्रिप्शन पर वापस",
  },
  get: {
    title: "मालिक का सब्सक्रिप्शन",
    titleShort: "मालिक का सब्सक्रिप्शन",
    description: "कंपनी के मालिक का अपना सब्सक्रिप्शन देखें।",
    companyId: {
      label: "कंपनी ID",
      description: "जिस कंपनी का सब्सक्रिप्शन लाना है",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कंपनी ID गलत है",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "कंपनी सब्सक्रिप्शन देखने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपके पास इस कंपनी के सब्सक्रिप्शन का एक्सेस नहीं है",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव",
      },
      server: {
        title: "सर्वर एरर",
        description: "कुछ गड़बड़ हुई। फिर कोशिश करें",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
      },
      notFound: {
        title: "कोई सब्सक्रिप्शन नहीं मिला",
        description: "इस कंपनी का कोई सब्सक्रिप्शन नहीं है",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सब्सक्रिप्शन लोड हुआ",
      description: "कंपनी का सब्सक्रिप्शन मिल गया",
    },
  },
};
