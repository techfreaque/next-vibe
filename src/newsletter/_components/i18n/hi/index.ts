import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  heading: "न्यूज़लेटर सब्सक्राइब करें",
  subheadingPublic: "नए अनसेंसर्ड मॉडल, नए फ़ीचर्स। स्पैम बिल्कुल नहीं।",
  subheadingLoggedIn: "नए अनसेंसर्ड मॉडल, नए फ़ीचर्स। स्पैम बिल्कुल नहीं।",
  bonusGuest:
    "फ़्री अकाउंट: हर महीने {{freeCreditsSignedIn}} क्रेडिट, न्यूज़लेटर के साथ {{freeCreditsMax}}।",
  bonusGuestLink: "फ़्री में साइन अप करें",
  bonusAccount:
    "अपना ईमेल कन्फ़र्म करें: +{{bonusCredits}} फ़्री क्रेडिट, कुल {{freeCreditsMax}} हर महीने।",
  emailPlaceholder: "you@example.com",
  invalidEmail: "सही ईमेल पता डालें।",
  subscribe: "सब्सक्राइब करें",
  alreadyIn: "आप लिस्ट में हैं। अपना इनबॉक्स देखते रहें।",
  success: "बस एक कदम बाकी। कन्फ़र्म करने के लिए इनबॉक्स देखें।",
  error: "यह नहीं हो पाया। फिर कोशिश करें।",
  privacy: "एक क्लिक में अनसब्सक्राइब, कभी भी।",
  loggedInHint: "हम इसे आपके अकाउंट वाले ईमेल पर भेजेंगे।",
  pending: {
    title: "कन्फ़र्म करने के लिए इनबॉक्स देखें",
    bodyWithEmail: "कन्फ़र्म लिंक {{email}} पर भेजा गया है।",
    body: "कन्फ़र्म लिंक आपके इनबॉक्स में है।",
    bonus: "एक क्लिक से हर महीने +{{bonusCredits}} फ़्री क्रेडिट अनलॉक।",
    resend: "ईमेल दोबारा भेजें",
    resending: "भेजा जा रहा है...",
    resent: "भेज दिया। न दिखे तो स्पैम फ़ोल्डर भी देखें।",
  },
  subscribedNotice: {
    title: "आप सब्सक्राइब हो गए",
    bonus: "हर महीने +{{bonusCredits}} फ़्री क्रेडिट आपके अकाउंट पर चालू हैं।",
    body: "नए मॉडल और नए फ़ीचर्स की खबर सीधे आपके इनबॉक्स में।",
    manage: "मैनेज करें या अनसब्सक्राइब करें",
  },
};
