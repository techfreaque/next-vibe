import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} इंस्टॉल करें",
    description: "लोकल इंस्टॉलेशन की प्रोग्रेस और वैकल्पिक GitHub रिपॉज़िटरी सेटअप।",
  },
  enums: {
    stepStatus: {
      done: "तैयार",
      inProgress: "चल रहा है",
      pending: "इंतज़ार में",
      skipped: "छोड़ा गया",
      error: "ध्यान चाहिए",
    },
    action: {
      refresh: "स्टेटस दोबारा जाँचें",
      githubAuthStart: "GitHub से साइन इन करें",
      githubAuthCheck: "GitHub साइन-इन जाँचें",
      githubCreatePrivateRepo: "प्राइवेट रिपॉज़िटरी बनाएँ",
      githubSkip: "GitHub सेटअप छोड़ें",
      githubReset: "GitHub सेट अप करें",
    },
    checkoutMode: {
      cloned: "नया क्लोन",
      existing: "मौजूदा चेकआउट रखा गया",
      unknown: "लोकल चेकआउट",
    },
  },
  get: {
    title: "इंस्टॉलर स्टेटस",
    titleShort: "इंस्टॉलर",
    description:
      "लोकल इंस्टॉलेशन की प्रोग्रेस, चेकआउट की स्थिति और वैकल्पिक GitHub रिपॉज़िटरी सेटअप देखें।",
    tags: {
      installer: "इंस्टॉलर",
    },
    success: {
      title: "स्टेटस लोड हो गया",
      description: "लोकल इंस्टॉलेशन स्टेटस मिल गया।",
    },
    response: {
      installDir: { title: "इंस्टॉल डायरेक्टरी" },
      os: { title: "ऑपरेटिंग सिस्टम" },
      arch: { title: "आर्किटेक्चर" },
      checkoutMode: { title: "चेकआउट मोड" },
      branch: { title: "Git ब्रांच" },
      originUrl: { title: "Origin रिमोट" },
      upstreamUrl: { title: "Upstream रिमोट" },
      port: { title: "लोकल पोर्ट" },
      stateFilePath: { title: "स्टेट फ़ाइल" },
      updatedAt: { title: "आख़िरी अपडेट" },
      lastError: { title: "आख़िरी एरर" },
      steps: { title: "इंस्टॉलेशन के स्टेप" },
      github: { title: "GitHub स्टेटस" },
      setup: { title: "सेटअप स्टेटस" },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत इंस्टॉलर स्टेटस रिक्वेस्ट।",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है।",
      },
      forbidden: {
        title: "सिर्फ़ लोकल",
        description: "इंस्टॉलर सिर्फ़ लोकल पहली-बार वाले इंस्टेंस पर उपलब्ध है।",
      },
      notFound: {
        title: "नहीं मिला",
        description: "इंस्टॉलर स्टेट नहीं मिली।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क रिक्वेस्ट फ़ेल हुई।",
      },
      server: {
        title: "सर्वर एरर",
        description: "लोकल इंस्टॉलर स्टेटस नहीं पढ़ा जा सका।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया।",
      },
      unsavedChanges: {
        title: "टकराव",
        description: "पढ़ते समय स्टेट बदल गई।",
      },
      conflict: {
        title: "टकराव",
        description: "इंस्टॉलर स्टेट में टकराव।",
      },
    },
  },
  post: {
    title: "इंस्टॉलर कार्रवाई चलाएँ",
    titleShort: "इंस्टॉलर कार्रवाई",
    description:
      "लोकल जाँच रीफ़्रेश करें या वैकल्पिक प्राइवेट GitHub रिपॉज़िटरी सेटअप मैनेज करें।",
    tags: {
      installer: "इंस्टॉलर",
    },
    request: {
      action: {
        label: "कार्रवाई",
        description: "चलाने वाली इंस्टॉलर कार्रवाई।",
      },
      repoName: {
        label: "प्राइवेट रिपॉज़िटरी का नाम",
        description: "आपके GitHub अकाउंट के तहत रिपॉज़िटरी का नाम।",
        placeholder: "next-vibe-private",
      },
    },
    response: {
      actionMessage: { title: "कार्रवाई का नतीजा" },
    },
    success: {
      title: "कार्रवाई पूरी हुई",
      description: "इंस्टॉलर कार्रवाई पूरी हुई।",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत कार्रवाई या रिपॉज़िटरी नाम।",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है।",
      },
      forbidden: {
        title: "सिर्फ़ लोकल",
        description: "इंस्टॉलर कार्रवाइयाँ सिर्फ़ लोकल पहली-बार वाले इंस्टेंस पर उपलब्ध हैं।",
      },
      notFound: {
        title: "नहीं मिला",
        description: "ज़रूरी लोकल टूल नहीं मिला।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "GitHub तक नहीं पहुँच सके। अपना कनेक्शन जाँचें और दोबारा कोशिश करें।",
      },
      server: {
        title: "सर्वर एरर",
        description: "इंस्टॉलर कार्रवाई फ़ेल हुई।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया।",
      },
      unsavedChanges: {
        title: "टकराव",
        description: "कार्रवाई के दौरान स्टेट बदल गई।",
      },
      conflict: {
        title: "रिपॉज़िटरी मौजूद है",
        description: "GitHub रिपॉज़िटरी में टकराव हुआ।",
      },
    },
  },
  errors: {
    localOnly: "इंस्टॉलर सिर्फ़ लोकल पहली-बार वाले इंस्टेंस पर उपलब्ध है।",
    invalidRepoName:
      "अक्षर, अंक, डॉट, डैश या अंडरस्कोर इस्तेमाल करें (ज़्यादा से ज़्यादा 100 कैरेक्टर)।",
    ghNotInstalled:
      "इस मशीन पर GitHub CLI (gh) इंस्टॉल नहीं है। नीचे के मैन्युअल स्टेप इस्तेमाल करें या छोड़ दें।",
    ghAuthStartFailed:
      "GitHub device साइन-इन शुरू नहीं हो सका। अपने टर्मिनल में 'gh auth login --web' चलाएँ या मैन्युअल स्टेप इस्तेमाल करें।",
    ghNotSignedIn: "पहले GitHub में साइन इन करें, फिर दोबारा कोशिश करें।",
    ghCreateFailed:
      "प्राइवेट GitHub रिपॉज़िटरी बनाई या उसमें पुश नहीं की जा सकी। अपनी GitHub अनुमतियाँ जाँचें और दोबारा कोशिश करें।",
  },
  actions: {
    refreshed: "एनवायरनमेंट जाँच रीफ़्रेश हुई।",
    githubAuthPending: "GitHub पर एक बार वाला कोड डालें, फिर साइन-इन जाँचें दबाएँ।",
    githubAuthReady: "GitHub में {{username}} के रूप में साइन इन हो गया।",
    githubAuthWaiting: "आपके ब्राउज़र में GitHub साइन-इन पूरा होने का इंतज़ार है।",
    githubRepoCreated: "प्राइवेट रिपॉज़िटरी जुड़ गई और पुश हो गई।",
    githubSkipped: "GitHub सेटअप छोड़ा गया। रिपॉज़िटरी बाद में भी जोड़ सकते हैं।",
    githubReset: "GitHub सेटअप फिर से खोला गया।",
  },
  widget: {
    progressOf: "{{total}} में से {{done}} स्टेप तैयार",
    title: "आपका लोकल इंस्टॉल तैयार है।",
    titleIncomplete: "अपना लोकल इंस्टॉल पूरा करें",
    subtitle:
      "आपकी मशीन सेट अप है और next-vibe लोकली चल रहा है। चाहें तो प्राइवेट GitHub रिपॉज़िटरी जोड़ें, फिर सेटअप विज़ार्ड पर आगे बढ़ें।",
    subtitleIncomplete:
      "नीचे के स्टेप देखें, हाइलाइट किया कोई भी आइटम ठीक करें, फिर सेटअप विज़ार्ड पर आगे बढ़ें।",
    checkoutLabel: "फ़ोल्डर",
    stateFileLabel: "स्टेट फ़ाइल",
    recheck: "दोबारा जाँचें",
    rechecking: "जाँच हो रही है...",
    copy: "कॉपी करें",
    copied: "कॉपी हो गया",
    steps: {
      git: {
        title: "Git",
        missingDetail: "PATH पर Git नहीं मिला।",
        missingRecovery: "git इंस्टॉल करें, नया टर्मिनल खोलें और इंस्टॉलर दोबारा चलाएँ।",
      },
      bun: {
        title: "Bun रनटाइम",
        missingDetail: "PATH पर Bun नहीं मिला।",
        missingRecovery: "https://bun.sh से Bun इंस्टॉल करें और इंस्टॉलर दोबारा चलाएँ।",
      },
      clone: {
        title: "next-vibe चेकआउट",
        clonedDetail: "{{dir}} में क्लोन हुआ",
        existingDetail: "मौजूदा चेकआउट {{dir}} में रखा गया",
        unknownDetail: "{{dir}} से चल रहा है",
      },
      dependencies: {
        title: "डिपेंडेंसी और CLI",
        readyDetail: "पैकेज इंस्टॉल हो गए और vibe CLI तैयार है।",
        missingDetail: "node_modules अधूरा है।",
        missingRecovery: "अपने चेकआउट फ़ोल्डर में 'bun install' चलाएँ।",
      },
      github: {
        title: "प्राइवेट GitHub रिपॉज़िटरी",
        optionalTag: "वैकल्पिक",
        connectedDetail: "Origin {{url}} की ओर इशारा करता है",
        skippedDetail: "अभी के लिए छोड़ा गया। अपडेट अब भी next-vibe से आते हैं।",
        pendingDetail: "वैकल्पिक। GitHub पर अपनी निजी कॉपी रखें।",
      },
      server: {
        title: "लोकल सर्वर",
        readyDetail: "http://localhost:{{port}} पर सुन रहा है",
      },
    },
    githubCard: {
      title: "प्राइवेट GitHub रिपॉज़िटरी",
      badge: "वैकल्पिक",
      body: "अपनी प्राइवेट रिपॉज़िटरी बनाइए ताकि आपका कस्टम कोड और बदलाव GitHub पर निजी रहें, और अपडेट के लिए upstream next-vibe जुड़ा रहे।",
      connectedTitle: "प्राइवेट रिपॉज़िटरी जुड़ गई",
      connectedOpen: "GitHub पर खोलें",
      skippedNotice:
        "GitHub सेटअप छोड़ा गया। प्राइवेट रिपॉज़िटरी आप बाद में कभी भी जोड़ सकते हैं।",
      reopenButton: "GitHub सेट अप करें",
      skipButton: "अभी छोड़ें",
      signedInAs: "GitHub में {{username}} के रूप में साइन इन",
      repoNameLabel: "प्राइवेट रिपॉज़िटरी का नाम",
      repoNameHelp:
        "आपके GitHub अकाउंट के तहत प्राइवेट रिपॉज़िटरी के रूप में बनी। Upstream next-vibe से जुड़ा रहता है।",
      createButton: "प्राइवेट रिपॉज़िटरी बनाएँ",
      creatingButton: "बनाकर पुश हो रहा है...",
      signInButton: "GitHub से साइन इन करें",
      startingSignIn: "साइन-इन शुरू हो रहा है...",
      deviceTitle: "GitHub पर साइन-इन मंज़ूर करें",
      deviceBody:
        "नीचे का एक बार वाला कोड कॉपी करें, GitHub का device पेज खोलें और एक्सेस मंज़ूर करें। ये पेज कोई टोकन स्टोर नहीं करता।",
      deviceOpenLink: "GitHub device पेज खोलें",
      deviceCheckButton: "मैंने साइन इन कर लिया, दोबारा जाँचें",
      manualTitle: "मैन्युअल सेटअप (GitHub CLI नहीं चाहिए)",
      manualBody:
        "GitHub CLI (gh) इंस्टॉल नहीं है। GitHub पर एक ख़ाली प्राइवेट रिपॉज़िटरी बनाइए, फिर अपने चेकआउट फ़ोल्डर में ये तीन कमांड चलाइए।",
      manualNewRepoLink: "GitHub पर प्राइवेट रिपॉज़िटरी बनाएँ",
      manualShowCommands: "git कमांड दिखाएँ",
      manualHideCommands: "git कमांड छिपाएँ",
    },
    handover: {
      continueToSetup: "सेटअप विज़ार्ड पर आगे बढ़ें",
      openApp: "ऐप खोलें",
      hint: "अगला: अपना एडमिन लॉगिन सेट करें और अपना unbottled.ai अकाउंट या API keys जोड़ें।",
      completeHint: "इस इंस्टेंस पर शुरुआती सेटअप पहले ही पूरा हो चुका है।",
    },
  },
};
