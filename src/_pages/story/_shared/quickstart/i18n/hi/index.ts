import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  requirements: {
    label: "आपको चाहिए",
    os: "macOS, Linux या Windows",
    git: "git",
    bun: "Bun 1.3+",
  },
  prereqs: {
    step: "हर मशीन पर एक बार",
    title: "git और Bun इंस्टॉल करें",
    platformLabel: "आपका सिस्टम",
    gitXcode: "git (Xcode Command Line Tools)",
    gitBrew: "या Homebrew से",
    gitApt: "git + unzip, Debian / Ubuntu",
    gitDnf: "git + unzip, Fedora",
    gitPacman: "git + unzip, Arch",
    gitWinget: "git",
    bun: "Bun",
    bunWindows: "Bun (PowerShell)",
    check: "जाँचें: 1.3 या नया",
    newTerminal: "फिर नया टर्मिनल खोलें, ताकि git और bun आपके PATH में आ जाएँ।",
  },
  terminal: {
    step: "फिर",
    title: "चलाएँ",
    copyAll: "सब कॉपी करें",
    copy: "कॉपी करें",
    copied: "कॉपी हो गया",
    clone: "कोड लें",
    install: "टर्मिनल में next-vibe फ़ोल्डर खोलें, फिर इंस्टॉल करें",
    dev: "शुरू करें। डेटाबेस, migrations और seed डेटा अपने आप चलते हैं।",
    fallback:
      "शेल कह रहा है vibe: command not found? नया टर्मिनल खोलें, या bun run dev चलाएँ।",
    port: "पोर्ट 3000 पहले से इस्तेमाल में है? दूसरे पोर्ट पर शुरू करें: vibe dev --port=4000, फिर localhost:4000 खोलें।",
    postgres:
      "डिफ़ॉल्ट: एम्बेडेड Postgres (PGlite), Docker की ज़रूरत नहीं। पूरा Postgres चाहिए? सेटिंग्स में DATABASE_URL बदलें; अगली बार vibe dev उसे Docker में शुरू कर देगा।",
  },
  browser: {
    step: "आखिर में",
    title: "बाकी सब ब्राउज़र में होता है",
    open: {
      title: "localhost:3000 खोलें",
      body: "ऊपर दाईं ओर लॉग इन पर क्लिक करें।",
    },
    admin: {
      title: "ADMIN अकाउंट चुनें",
      body: "Dev Quick Login बॉक्स में। सेटअप विज़र्ड खुल जाएगा।",
    },
    account: {
      title: "अपना एडमिन लॉगिन सेट करें",
      body: "आपका ईमेल, आपका पासवर्ड। सिक्योरिटी keys पहले से बनी हुई हैं।",
    },
    provider: {
      title: "अपना AI चुनें",
      body: "अपने unbottled.ai अकाउंट से साइन इन करें, या अपनी प्रोवाइडर key पेस्ट करें। Finish दबाएँ। चैट शुरू करें।",
    },
  },
};
