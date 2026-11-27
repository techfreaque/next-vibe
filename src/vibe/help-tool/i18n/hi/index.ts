import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "हेल्प और डॉक्यूमेंटेशन",
  tag: "हेल्प",
  uncategorized: "अन्य",
  admin: {
    recordBackTo: "{{section}} पर वापस",
    recordAccessDenied: "आपके पास इस रिकॉर्ड का एक्सेस नहीं है",
    overviewLoadError: "ओवरव्यू लोड नहीं हो सका",
    accountMenu: "अकाउंट सेटिंग्स",
    homeDescription: "प्लेटफ़ॉर्म संभालें और देखें कि किस पर ध्यान चाहिए।",
    new: "नया",
    destinations: "सूचियाँ और रिपोर्ट",
    noDestinations: "इस क्षेत्र में कोई सूची या रिपोर्ट उपलब्ध नहीं है।",
    automations: "ऑटोमेशन",
    developer: "डेवलपर टूल",
    openDeveloper: "डेवलपर कैटलॉग खोलें",
    title: "एडमिनिस्ट्रेशन",
    workspaces: "वर्कस्पेस",
    pinned: "पिन किए गए टूल",
    categoryTools: "इस वर्कस्पेस के टूल",
    results: "सर्च नतीजे",
    resultsForOne: "“{{query}}” के लिए 1 नतीजा",
    resultsFor: "“{{query}}” के लिए {{count}} नतीजे",
    jumpTo: "या कोई वर्कस्पेस खोलें",
    tool: "टूल",
  },
  erp: {
    navigation: {
      sales: "बिक्री",
      purchases: "खरीद",
      invoices: "इनवॉइस",
      estimates: "कोटेशन",
      bills: "सप्लायर बिल",
    },
    overview: {
      noCompany: "यह टूल इस्तेमाल करने के लिए कंपनी बनाएँ या उससे जुड़ें।",
      chooseCompany: "रिपोर्ट देखने के लिए कंपनी चुनें।",
      loading: "कंपनी ओवरव्यू लोड हो रहा है",
      loadError: "कंपनी ओवरव्यू लोड नहीं हो सका",
    },
    home: "होम",
    title: "अकाउंटिंग वर्कस्पेस",
    description:
      "अपनी कंपनी सेट करें, इनवॉइस संभालें और महीने के अंत के लिए बही-खाता तैयार रखें।",
    companies: "कंपनियाँ मैनेज करें",
    activeDescription: "अपना बही-खाता देखें और अगला इनवॉइस शुरू करें।",
    newInvoice: "नया इनवॉइस",
    createCompany: "अपनी कंपनी सेट करें",
    companySwitch: {
      label: "अकाउंटिंग कंपनी",
      select: "कंपनी चुनें",
      current: "मौजूदा कंपनी: {{name}}",
    },
    workflows: "आम वर्कफ़्लो",
    sales: {
      title: "ग्राहक को इनवॉइस भेजें",
      description:
        "ड्राफ़्ट इनवॉइस बनाएँ, या भुगतान दर्ज करने के लिए मौजूदा इनवॉइस खोलें।",
      primary: "इनवॉइस बनाएँ",
      secondary: "इनवॉइस देखें",
    },
    expenses: {
      title: "सप्लायर बिल दर्ज करें",
      description: "सप्लायर को जो देना है उसे दर्ज करें और बिल से भुगतान ट्रैक करें।",
      primary: "बिल बनाएँ",
      secondary: "बिल देखें",
    },
    receivables: {
      title: "देखें किससे पैसा लेना है",
      description: "ग्राहकों की बकाया रकम देखें, देरी की अवधि के हिसाब से बँटी हुई।",
      primary: "प्राप्य देखें",
    },
    payables: {
      title: "देखें सप्लायर को कितना देना है",
      description: "सप्लायर की बकाया रकम, मंज़ूर होने वाले बिल और विवादित राशियाँ देखें।",
      primary: "देय देखें",
    },
    bank: {
      title: "बैंक गतिविधि इम्पोर्ट करें",
      description: "CSV स्टेटमेंट इम्पोर्ट करें, फिर बिना मिलान वाले लेन-देन देखें।",
      primary: "बैंक स्टेटमेंट इम्पोर्ट करें",
      secondary: "बिना मिलान वाले लेन-देन देखें",
    },
    stock: {
      title: "अपना इन्वेंटरी देखें",
      description: "स्टॉक का स्तर देखें और जानें क्या दोबारा भरना है।",
      primary: "इन्वेंटरी खोलें",
    },
    tax: {
      title: "VAT देखें",
      description: "फ़ाइल करने से पहले रिपोर्टिंग अवधि के टैक्स टोटल जाँचें।",
      primary: "टैक्स रिपोर्ट खोलें",
    },
    exports: {
      title: "जर्नल देखें और एक्सपोर्ट करें",
      description: "पोस्टिंग की दिक्कतें जाँचें या पोस्ट हुई जर्नल एंट्री CSV में डाउनलोड करें।",
      primary: "पोस्टिंग देखें",
      secondary: "जर्नल एक्सपोर्ट खोलें",
    },
    close: {
      title: "अकाउंटिंग अवधि बंद करें",
      description: "अवधि बंद करने से पहले ट्रायल बैलेंस देखें।",
      primary: "अवधियाँ देखें",
      secondary: "ट्रायल बैलेंस खोलें",
    },
  },
  catalog: {
    navigation: "टूल नेविगेशन",
    breadcrumbs: "टूल की जगह",
    favorites: "पसंदीदा",
    viewFavorites: "सब देखें",
    noFavorites: "अभी कोई पसंदीदा टूल नहीं",
    recent: "हाल में खोले गए",
    noRecent: "हाल में कोई टूल नहीं खोला गया",
    rolePreview:
      "{{role}} के लिए कैटलॉग प्रिव्यू। टूल आपकी साइन-इन अनुमतियों के साथ चलते हैं।",
    hidden: "छिपे हुए टूल",
    restoreTool: "वापस लाएँ",
    toolOptions: "टूल विकल्प",
    unfavoriteTool: "पसंदीदा से हटाएँ",
    favoriteTool: "पसंदीदा में जोड़ें",
    hideTool: "टूल छिपाएँ",
    disableAi: "AI के लिए बंद करें",
    enableAi: "AI के लिए चालू करें",
    aiRestricted: "मौजूदा AI प्रोफ़ाइल द्वारा सीमित",
    preferenceError: "टूल की पसंद सेव नहीं हो सकी। दोबारा कोशिश करें।",
    moreMatches: "और नतीजे ({{count}})",
    title: "टूल कैटलॉग",
    searchLabel: "टूल कैटलॉग में सर्च करें",
    searchAction: "टूल सर्च करें",
    clearSearch: "टूल सर्च साफ़ करें",
    overview: "बिज़नेस ओवरव्यू",
    allTools: "सभी टूल",
    selectRecord: "डिटेल देखने के लिए कोई रिकॉर्ड चुनें।",
    openRecord: "रिकॉर्ड खोलें",
    findRecord: "रिकॉर्ड खोजें",
    recordPlaceholder: "नाम, ईमेल या रेफ़रेंस",
    loadError: "कैटलॉग लोड नहीं हो सका",
    retry: "दोबारा कोशिश करें",
    noTools: "इस व्यू में कोई टूल उपलब्ध नहीं",
    noMatches: "“{{query}}” से कोई टूल नहीं मिला। कोई दूसरा टूल नाम आज़माएँ।",
    openPrimary: "{{title}} खोलें",
    allInCategory: "सभी टूल",
    general: "सामान्य",
    toolUnavailable: "दूसरे प्लेटफ़ॉर्म पर उपलब्ध",
    previous: "पिछला",
    next: "अगला",
    page: "पेज {{page}} / {{total}}",
    openSidebar: "टूल साइडबार खोलें",
    browse: "टूल ब्राउज़ करें",
    backHome: "एडमिन होम पर जाएँ",
    toolUnavailableHint:
      "यह लिंक पुराना हो सकता है, या आपकी भूमिका को एक्सेस न हो। अपने लिए उपलब्ध टूल ब्राउज़ करें।",
    openError: "यह टूल खुल नहीं सका",
    toolNotFound: "यह टूल उपलब्ध नहीं है",
    localInstance: "लोकल इंस्टेंस",
    allowTool: "AI को यह टूल बुलाने दें",
    blockTool: "AI को यह टूल बुलाने से रोकें",
    pinWeb: "साइडबार में पिन करें",
    unpinWeb: "साइडबार से अनपिन करें",
    webSidebar: "वेब साइडबार",
    webSidebarHint: "आपके साइडबार में पिन किए गए टूल।",
  },
  groups: {
    ai: "AI",
    analytics: "ग्रोथ",
    business: "बिज़नेस",
    system: "ऑपरेशंस",
    comms: "संचार",
    platform: "प्लेटफ़ॉर्म",
    people: "लोग और CRM",
    billing: "बिलिंग",
    content: "कंटेंट",
  },
  get: {
    title: "टूल हेल्प - उपलब्ध टूल खोजें",
    titleShort: "टूल हेल्प",
    description:
      "आपके लिए उपलब्ध सभी टूल सर्च करें और खोजें। बिना पैरामीटर के बुलाएँ तो सभी टूल और कैटेगरी की सूची मिलती है। नाम/विवरण/alias से सर्च करने के लिए query इस्तेमाल करें। किसी टूल का पूरा पैरामीटर स्कीमा पाने के लिए toolName इस्तेमाल करें। कैटेगरी से छाँटने के लिए category इस्तेमाल करें। page/pageSize से पेजिनेशन चलता है। AI/MCP के लिए डिफ़ॉल्ट पेज साइज़ 100 है।",
    tags: {
      tools: "टूल",
    },
    fields: {
      interactive: {
        label: "इंटरैक्टिव",
        description: "पूरा इंटरैक्टिव टूल ब्राउज़र खोलें",
      },
      query: {
        label: "सर्च क्वेरी (वैकल्पिक)",
        description:
          "कीवर्ड से टूल छाँटें। स्पेस से अलग किए सभी शब्द ज़रूरी हैं (जैसे 'fetch url' उन टूल से मिलता है जिनमें दोनों शब्द हों)। नाम, alias, विवरण, टैग में केस-इनसेंसिटिव मिलान, नाम/alias के मिलान ऊपर आते हैं। सटीक नाम/alias मिलने पर पूरा डिटेल अपने आप दिखता है। सभी टूल की सूची के लिए खाली छोड़ें।",
        placeholder: "जैसे fetch url, image gen, memory...",
      },
      category: {
        label: "कैटेगरी फ़िल्टर",
        description:
          "कैटेगरी या सब-कैटेगरी के नाम से टूल छाँटें (केस-इनसेंसिटिव)। पैरेंट कैटेगरी की key (जैसे 'ai') या सब-कैटेगरी का नाम (जैसे 'Search') चलता है। सभी कैटेगरी देखने के लिए खाली छोड़ें।",
      },
      toolName: {
        label: "टूल नाम (डिटेल)",
        description:
          "किसी टूल का पूरा पैरामीटर स्कीमा उसके सटीक toolName (जैसे agent_search_brave_GET) या alias से पाएँ। अनजाने टूल को बुलाने से पहले इसे इस्तेमाल करें।",
      },
      page: {
        label: "पेज",
        description: "पेजिनेटेड नतीजों का पेज नंबर (डिफ़ॉल्ट: 1)",
        title: "मौजूदा पेज नंबर",
      },
      pageSize: {
        label: "पेज साइज़",
        description:
          "प्रति पेज नतीजों की संख्या। AI/MCP डिफ़ॉल्ट: 100। वेब/CLI डिफ़ॉल्ट: 800। अधिकतम: 1000।",
        title: "प्रभावी पेज साइज़",
      },
      tools: {
        title: "उपलब्ध टूल",
      },
      totalCount: {
        title: "कुल टूल संख्या",
      },
      matchedCount: {
        title: "मिले टूल की संख्या",
      },
      categories: {
        title: "टूल कैटेगरी",
      },
      hint: {
        title: "इस्तेमाल का संकेत",
      },
      pinnedCount: {
        title: "पिन किए गए टूल की संख्या",
      },
      allowedCount: {
        title: "अनुमत टूल की संख्या",
      },
      webPinnedCount: {
        title: "वेब में पिन किए टूल की संख्या",
      },
      currentPage: {
        title: "मौजूदा पेज",
      },
      effectivePageSize: {
        title: "प्रभावी पेज साइज़",
      },
      totalPages: {
        title: "कुल पेज",
      },
      parameters: {
        title: "पैरामीटर",
      },
      aliases: {
        title: "Alias",
      },
      openTool: {
        label: "टूल खोलें",
      },
      platform: {
        label: "प्लेटफ़ॉर्म",
        description:
          "प्लेटफ़ॉर्म से टूल छाँटें (सिर्फ़ एडमिन)। चुने हुए प्लेटफ़ॉर्म पर उपलब्ध टूल दिखाता है। सभी प्लेटफ़ॉर्म के टूल देखने के लिए 'all' इस्तेमाल करें।",
      },
      includeProdOnly: {
        label: "सिर्फ़-प्रोडक्शन टूल शामिल करें",
        description:
          "true होने पर सिर्फ़-प्रोडक्शन चिह्नित टूल भी शामिल होते हैं (सिर्फ़ एडमिन)। सभी प्लेटफ़ॉर्म के टूल देखने के लिए 'all' प्लेटफ़ॉर्म फ़िल्टर इस्तेमाल करें।",
      },
      platforms: {
        title: "उपलब्ध प्लेटफ़ॉर्म",
      },
      viewAsRole: {
        label: "भूमिका के रूप में देखें",
        description: "देखें कि किसी यूज़र भूमिका को कौन से टूल दिखते हैं (सिर्फ़ एडमिन)",
        options: {
          admin: "एडमिन",
          customer: "कस्टमर",
          public: "पब्लिक",
        },
      },
      instanceId: {
        label: "इंस्टेंस ID",
        description:
          "वैकल्पिक। सिर्फ़ किसी खास रिमोट इंस्टेंस के टूल तक सीमित करें। लोकल टूल सर्च करने के लिए खाली छोड़ें।",
      },
      pinnedToolIds: {
        label: "पिन किए टूल की ID",
        description:
          "वैकल्पिक: यूज़र के पिन किए टूल ID की सूची। देने पर सर्वर सिर्फ़ इन्हीं टूल तक छाँटता है, पर पूरा totalCount फिर भी लौटाता है।",
      },
      statsFilter: {
        label: "टूल फ़िल्टर",
        description: "सभी टूल, सिर्फ़ पिन किए, या सिर्फ़ अनुमत टूल दिखाएँ",
      },
    },
    hints: {
      noCapabilitySnapshot:
        'इंस्टेंस "{{instanceId}}" के लिए कोई कैपेबिलिटी स्नैपशॉट नहीं। इंस्टेंस कनेक्ट करें और सिंक पल्स का इंतज़ार करें।',
      remoteFullSchema:
        '"{{instanceId}}" के {{count}} टूल का पूरा स्कीमा। इससे बुलाएँ: execute-tool toolName="{{instanceId}}__<name>" input={...}।',
      remoteList:
        'रिमोट इंस्टेंस "{{instanceId}}" के {{total}} में से {{matched}} टूल। पूरे स्कीमा के लिए सर्च को ≤{{detailThreshold}} नतीजों तक सीमित करें, या किसी खास टूल के लिए toolName= दें।{{pagination}}',
      toolNotFound:
        'टूल "{{name}}" नहीं मिला। कीवर्ड से सर्च करने के लिए query इस्तेमाल करें।',
      detailMode:
        'इस तरह बुलाएँ: execute-tool toolName="{{name}}"{{aliases}}। CLI: vibe {{name}} [--field=value]।',
      detailModeAliases: " (alias: {{aliases}})",
      noToolsMatched:
        "कोई टूल नहीं मिला। ज़्यादा व्यापक क्वेरी आज़माएँ या सभी कैटेगरी देखने के लिए बिना पैरामीटर के बुलाएँ।",
      compactFullSchema:
        '{{count}} टूल का पूरा स्कीमा। इससे बुलाएँ: execute-tool toolName="<name>" input={...}।',
      compactCategoryOnly:
        '{{categories}} कैटेगरी में {{matched}} टूल। नतीजे सीमित करने के लिए category="<name>" इस्तेमाल करें (पैरेंट कैटेगरी या सब-कैटेगरी चलती है)। {{listThreshold}} से कम नतीजों पर टूल के नाम दिखते हैं; {{detailThreshold}} से कम पर पूरे स्कीमा।',
      compactList:
        '{{matched}} टूल। पूरे स्कीमा के लिए ≤{{detailThreshold}} तक सीमित करें, या डिटेल के लिए toolName="<name>" दें। कोई भी टूल बुलाएँ: execute-tool toolName="<name>"।{{pagination}}',
      cliFullDetail:
        "{{count}} टूल का पूरा डिटेल दिख रहा है। CLI: vibe <name> [--field=value]।",
      cliList:
        "पेज {{page}}/{{total}} - {{matched}} टूल मिले। पूरे डिटेल के लिए vibe help <name> इस्तेमाल करें।",
      cliListSingle:
        "{{matched}} टूल मिले। पूरे डिटेल के लिए vibe help <name> इस्तेमाल करें।",
      pagination: " पेज {{page}}/{{total}} - आगे के लिए page={{next}} दें।",
      paginationCli: " - vibe help --page={{next}}",
    },
    success: {
      title: "टूल सफलतापूर्वक मिले",
      description: "उपलब्ध टूल मिल गए",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास टूल एक्सेस करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "टूल एंडपॉइंट नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "टूल नहीं मिल सके",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टूल लाते समय टकराव हुआ",
      },
    },
  },
  interactive: {
    post: {
      title: "इंटरैक्टिव मोड",
      description: "रूट ब्राउज़ करने और चलाने के लिए इंटरैक्टिव फ़ाइल एक्सप्लोरर मोड शुरू करें",
      category: "सिस्टम हेल्प",
      tags: {
        system: "सिस्टम",
        help: "हेल्प",
      },
      summary: "इंटरैक्टिव मोड शुरू करें",
    },
    ui: {
      title: "इंटरैक्टिव API एक्सप्लोरर",
      description: "सभी ब्राउज़ करें और चलाएँ",
      availableEndpoints: "उपलब्ध एंडपॉइंट",
      endpointsLabel: "एंडपॉइंट",
      aliasesLabel: "Alias:",
      selectEndpoint: "शुरू करने के लिए सूची से कोई एंडपॉइंट चुनें",
    },
    response: {
      started: "इंटरैक्टिव मोड सफलतापूर्वक शुरू हुआ",
    },
    errors: {
      cliOnly: {
        title: "सिर्फ़ CLI",
        description: "इंटरैक्टिव मोड सिर्फ़ CLI से उपलब्ध है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "इंटरैक्टिव मोड के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "इंटरैक्टिव मोड शुरू नहीं हो सका",
      },
    },
    success: {
      title: "सफल",
      description: "इंटरैक्टिव मोड सफलतापूर्वक शुरू हुआ",
    },
    grouping: {
      category: "कैटेगरी",
      tags: "टैग",
      path: "पाथ",
    },
  },
  post: {
    title: "हेल्प जानकारी दिखाएँ",
    description: "CLI कमांड की हेल्प जानकारी दिखाएँ",
    form: {
      title: "हेल्प विकल्प",
      description: "किसी खास कमांड या सामान्य इस्तेमाल की हेल्प पाएँ",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "हेल्प कमांड के पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "हेल्प जानकारी नहीं मिल सकी",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको हेल्प देखने की अनुमति नहीं है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास हेल्प देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "कमांड नहीं मिली",
        description: "बताई गई कमांड नहीं मिली",
      },
      server: {
        title: "सर्वर एरर",
        description: "हेल्प जानकारी बन नहीं सकी",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "हेल्प बनाते समय कोई अनपेक्षित एरर हुई",
      },
      conflict: {
        title: "टकराव",
        description: "हेल्प बनाने में टकराव मिला",
      },
    },
    success: {
      title: "हेल्प तैयार",
      description: "हेल्प जानकारी सफलतापूर्वक बनी",
    },
  },
  fields: {
    command: {
      label: "कमांड",
      description: "जिस कमांड की हेल्प चाहिए (सामान्य हेल्प के लिए खाली छोड़ें)",
      placeholder: "जैसे check, list, db:ping",
    },
    header: {
      title: "हेडर",
      description: "हेडर विवरण",
    },
    title: {
      label: "शीर्षक",
    },
    description: {
      label: "विवरण",
    },
    usage: {
      title: "इस्तेमाल",
      patterns: {
        item: "पैटर्न",
      },
    },
    commonCommands: {
      title: "आम कमांड",
      items: "कमांड",
      command: "कमांड",
      description: "विवरण",
    },
    options: {
      title: "विकल्प",
      items: "विकल्प",
      flag: "फ़्लैग",
      description: "विवरण",
    },
    examples: {
      title: "उदाहरण",
      items: "उदाहरण",
      command: "कमांड",
      description: "विवरण",
    },
    details: {
      title: "डिटेल",
      category: {
        content: "कैटेगरी",
      },
      path: {
        content: "पाथ",
      },
      method: {
        content: "मेथड",
      },
      aliases: {
        content: "Alias",
      },
    },
  },
  aiTools: {
    modal: {
      webPinnedLabel: "वेब पिन",
      webPinnedTooltip: "तेज़ एक्सेस के लिए साइडबार में पिन किए टूल",
      pinnedLabel: "पिन किए",
      pinnedTooltip: "पिन किए टूल हमेशा कॉन्टेक्स्ट में रहते हैं। AI उन्हें हर टर्न में देखता है",
      enabledLabel: "AI अनुमत",
      enabledTooltip: "AI-अनुमत टूल हेल्प चालू होने पर ज़रूरत के हिसाब से बुलाए जा सकते हैं",
      totalLabel: "कुल",
      totalTooltip: "सभी टूल दिखाएँ। फ़िल्टर हटाने के लिए क्लिक करें",
      searchPlaceholder: "टूल सर्च करें...",
      chipWeb: "वेब",
      chipAiPins: "AI पिन",
      chipAiAllowed: "AI अनुमत",
      chipAll: "सभी",
      chipCli: "CLI",
      chipMcpPinned: "MCP दृश्य",
      chipMcpAllowed: "MCP सभी",
      searchNoResults: "कोई नतीजा नहीं",
      searchResultOne: "1 नतीजा",
      searchResultMany: "{{count}} नतीजे",
      expandAll: "सब फैलाएँ",
      collapseAll: "सब समेटें",
      deselectAll: "सब का चयन हटाएँ",
      selectAll: "सब चुनें",
      resetToDefault: "डिफ़ॉल्ट पर रीसेट करें",
      loading: "लोड हो रहा है...",
      noToolsFound: "आपकी सर्च से कोई टूल नहीं मिला",
      noToolsAvailable: "कोई AI टूल उपलब्ध नहीं",
      legendActive: "हमेशा कॉन्टेक्स्ट में (पिन)",
      legendConfirm: "चलाने से पहले पूछता है",
      legendWebPin: "साइडबार में पिन",
      stats: "{{total}} में से {{pinned}} टूल पिन किए",
      activeOn: "हमेशा AI कॉन्टेक्स्ट में। सिर्फ़ ज़रूरत पर बुलाने के लिए अनपिन करें",
      activeOff: "कॉन्टेक्स्ट में नहीं। हर AI टर्न में शामिल करने के लिए पिन करें",
      confirmOn: "AI चलाने से पहले आपसे पूछता है। अपने आप मंज़ूर करने के लिए क्लिक करें",
      confirmOff: "बिना पूछे चलता है। अपनी मंज़ूरी ज़रूरी करने के लिए क्लिक करें",
      closeSidebar: "टूल साइडबार बंद करें",
      selectTool: "कोई टूल चुनें",
      selectToolHint: "शुरू करने के लिए साइडबार से कोई टूल चुनें",
      allPlatforms: "सभी प्लेटफ़ॉर्म",
      prodOnly: "सिर्फ़ प्रोडक्शन",
      adminFilters: "एडमिन फ़िल्टर",
      resetPins: "पिन डिफ़ॉल्ट पर रीसेट करें",
      aiPinsTitle: "AI टूल पिन",
      aiPinsDescription:
        "ये टूल हर AI बातचीत में सक्रिय रहते हैं। AI इन्हें अपने आप बुला सकता है, कहने की ज़रूरत नहीं।",
      resetToDefaults: "डिफ़ॉल्ट पर रीसेट करें",
      noPinnedTools: "अभी कोई पिन किया टूल नहीं",
      noPinnedToolsHint:
        "सभी टूल ब्राउज़ करें और जिन्हें AI से इस्तेमाल करवाना है उन्हें पिन करें",
      webPinsDescription:
        "साइडबार शॉर्टकट। आपके एडमिन पैनल में पिन किए तुरंत चलने वाले टूल।",
      aiAllowedDescription:
        "वे टूल जिन्हें AI ज़रूरत पर बुला सकता है। यहाँ का कुछ भी तब चल सकता है जब AI को ज़रूरी लगे।",
      noAllowedTools: "कोई अनुमत टूल नहीं",
    },

    platformFilter: {
      all: "सभी प्लेटफ़ॉर्म",
      cli: "CLI",
      cliPackage: "CLI पैकेज",
      mcp: "MCP",
      ai: "AI",
      web: "वेब",
      cron: "Cron",
      electron: "डेस्कटॉप",
      frame: "फ़्रेम",
      skill: "स्किल",
      nextPage: "Next पेज",
      nextApi: "Next API",
    },
    envFilter: {
      development: "डेवलपमेंट",
      production: "प्रोडक्शन",
    },
  },
  list: {
    post: {
      title: "उपलब्ध कमांड की सूची",
      description: "सभी उपलब्ध CLI कमांड उनके विवरण और alias के साथ दिखाएँ",
      form: {
        title: "कमांड सूची विकल्प",
        description: "कमांड कैसे दिखें यह तय करें",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "सूची कमांड के पैरामीटर गलत हैं",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "कमांड सूची नहीं मिल सकी",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "आपको कमांड सूचीबद्ध करने की अनुमति नहीं है",
        },
        forbidden: {
          title: "प्रतिबंधित",
          description: "आपके पास कमांड सूचीबद्ध करने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "कमांड सूची नहीं मिली",
        },
        server: {
          title: "सर्वर एरर",
          description: "कमांड सूची बन नहीं सकी",
          errorLoading: "कमांड लोड करने में एरर: {{error}}",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कमांड सूचीबद्ध करते समय कोई अनपेक्षित एरर हुई",
        },
        conflict: {
          title: "टकराव",
          description: "कमांड सूची में टकराव मिला",
        },
      },
      success: {
        title: "कमांड सूचीबद्ध",
        description: "कमांड सूची सफलतापूर्वक मिली",
      },
    },
    tag: "हेल्प",
    fields: {
      category: {
        label: "कैटेगरी से छाँटें",
        description: "सिर्फ़ इस कैटेगरी की कमांड दिखाएँ",
        placeholder: "जैसे system, database, user",
      },
      format: {
        label: "आउटपुट फ़ॉर्मेट",
        description: "कमांड सूची कैसे दिखे",
        options: {
          tree: "ट्री व्यू (नेस्टेड हाइरार्की)",
          flat: "फ़्लैट सूची (सीधी लिस्टिंग)",
          json: "JSON फ़ॉर्मेट (पार्सिंग के लिए)",
        },
      },
      showAliases: {
        label: "Alias दिखाएँ",
        description: "सभी उपलब्ध कमांड alias दिखाएँ",
      },
      showDescriptions: {
        label: "विवरण दिखाएँ",
        description: "आउटपुट में कमांड के विवरण शामिल करें",
      },
      success: {
        label: "सफल",
      },
      totalCommands: {
        label: "कुल कमांड",
        description: "उपलब्ध कमांड की संख्या",
      },
      commandsText: {
        label: "उपलब्ध कमांड",
        description: "सभी उपलब्ध कमांड की फ़ॉर्मैट की हुई सूची",
      },
      commands: {
        alias: "कमांड Alias",
        message: "कमांड मैसेज",
        description: "कमांड विवरण",
        category: "कमांड कैटेगरी",
        aliases: "कमांड Alias",
        rule: "कमांड नियम",
      },
    },
    response: {
      commands: {
        title: "उपलब्ध कमांड",
        emptyState: {
          description: "कोई कमांड नहीं मिली",
        },
        alias: "कमांड",
        path: "API पाथ",
        method: "HTTP मेथड",
        category: "कैटेगरी",
        description: "विवरण",
        aliases: "Alias",
      },
    },
  },
};
