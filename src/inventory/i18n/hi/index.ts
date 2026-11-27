import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "इन्वेंटरी",
  shared: {
    errors: {
      failedToRecordMovement: "स्टॉक मूवमेंट दर्ज नहीं हो सका",
      failedToApplyMovement: "स्टॉक मूवमेंट लागू नहीं हो सका",
    },
  },
  tags: {
    cancel: "रद्द करें",
    inventory: "इन्वेंटरी",
    warehouse: "वेयरहाउस",
    stock: "स्टॉक",
    transfer: "ट्रांसफ़र",
    create: "बनाएँ",
    list: "लिस्ट",
    get: "पाएँ",
    update: "अपडेट",
    adjust: "एडजस्ट",
    receive: "प्राप्त करें",
    issue: "जारी करें",
    dispatch: "डिस्पैच",
  },
  endpointCategories: {
    inventory: "इन्वेंटरी",
    warehouses: "वेयरहाउस",
    stock: "स्टॉक लेवल",
    transfers: "ट्रांसफ़र",
  },
  enums: {
    movementType: {
      receipt: "रसीद",
      issue: "जारी करें",
      transferIn: "ट्रांसफ़र इन",
      transferOut: "ट्रांसफ़र आउट",
      adjustment: "एडजस्टमेंट",
      sale: "बिक्री",
      return: "रिटर्न",
    },
    transferStatus: {
      draft: "ड्राफ़्ट",
      inTransit: "रास्ते में",
      received: "प्राप्त",
      cancelled: "रद्द",
    },
    negativeStockPolicy: {
      block: "नेगेटिव स्टॉक ब्लॉक करें",
      warn: "चेतावनी के साथ इजाज़त दें",
      allow: "नेगेटिव स्टॉक की इजाज़त दें",
    },
  },

  // Warehouse create
  warehouseCreate: {
    post: {
      title: "वेयरहाउस बनाएँ",
      titleShort: "नया वेयरहाउस",
      description: "किसी कंपनी के लिए नया वेयरहाउस रजिस्टर करें।",
      widget: {
        openWarehouse: "वेयरहाउस खोलें",
        createAnother: "एक और बनाएँ",
        backToList: "वेयरहाउस पर वापस",
        active: "एक्टिव",
        inactive: "निष्क्रिय",
        default: "डिफ़ॉल्ट",
      },
      companyId: {
        label: "कंपनी",
        description: "वो कंपनी जिसका ये वेयरहाउस है",
      },
      name: {
        label: "वेयरहाउस का नाम",
        description: "वेयरहाउस का पूरा नाम",
        placeholder: "मुख्य वेयरहाउस",
      },
      code: {
        label: "कोड",
        description: "छोटी पहचान (जैसे WH-01)",
        placeholder: "WH-01",
      },
      address: {
        label: "पता",
        description: "वेयरहाउस का भौतिक पता",
        placeholder: "123 स्टोरेज लेन",
      },
      isActive: {
        label: "एक्टिव",
        description: "ये वेयरहाउस चालू है या नहीं",
      },
      isDefault: {
        label: "डिफ़ॉल्ट वेयरहाउस",
        description: "इस कंपनी का डिफ़ॉल्ट वेयरहाउस बनाएँ",
      },
      negativeStockPolicy: {
        label: "नेगेटिव स्टॉक पॉलिसी",
        description: "हाथ में मात्रा कम होने पर टिल की बिक्री और स्टॉक इश्यू कैसे चलें",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "वेयरहाउस बनाने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एडमिन ज़रूरी",
          description: "सिर्फ़ एडमिन वेयरहाउस बना सकते हैं",
        },
        conflict: {
          title: "कोड पहले से मौजूद है",
          description: "इस कोड का वेयरहाउस पहले से मौजूद है",
        },
        server: {
          title: "सर्वर एरर",
          description: "वेयरहाउस नहीं बन सका। दोबारा कोशिश करें।",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "वेयरहाउस बन गया",
        description: "वेयरहाउस सफलतापूर्वक रजिस्टर हुआ",
      },
      response: {
        id: "वेयरहाउस ID",
        name: "वेयरहाउस का नाम",
        code: "कोड",
        companyId: "कंपनी ID",
        isActive: "एक्टिव",
        isDefault: "डिफ़ॉल्ट",
        negativeStockPolicy: "नेगेटिव स्टॉक पॉलिसी",
      },
    },
  },

  // Warehouse list
  warehouseList: {
    get: {
      title: "वेयरहाउस",
      titleShort: "वेयरहाउस",
      description: "किसी कंपनी के सभी वेयरहाउस की लिस्ट।",
      widget: {
        subtitle: "जहाँ आपका स्टॉक रहता है। उसका स्टॉक और वैल्यू देखने के लिए एक खोलें।",
        status: "स्टेटस",
        active: "एक्टिव",
        inactive: "निष्क्रिय",
        default: "डिफ़ॉल्ट",
        total: "वेयरहाउस",
        createWarehouse: "नया वेयरहाउस",
        empty: "अभी कोई वेयरहाउस नहीं।",
        emptyHint: "इन्वेंटरी ट्रैक करना शुरू करने के लिए अपना पहला वेयरहाउस बनाएँ।",
        emptyIcon: "🏭",
        back: "वापस",
        loading: "वेयरहाउस लोड हो रहे हैं…",
        load: "लोड करें",
        viewStock: "स्टॉक देखें",
        selectCompany: "वेयरहाउस लोड करने के लिए कंपनी ID डालें।",
      },
      companyId: {
        label: "कंपनी",
        description: "जिस कंपनी के वेयरहाउस दिखाने हैं",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "वेयरहाउस देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस कंपनी का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "वेयरहाउस की लिस्ट नहीं मिल सकी",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "वेयरहाउस लोड हो गए",
        description: "वेयरहाउस की लिस्ट मिल गई",
      },
      response: {
        id: "वेयरहाउस ID",
        name: "नाम",
        code: "कोड",
        address: "पता",
        isActive: "एक्टिव",
        isDefault: "डिफ़ॉल्ट",
        createdAt: "बनाने का समय",
      },
    },
  },

  // Warehouse get
  warehouseGet: {
    get: {
      title: "वेयरहाउस पाएँ",
      titleShort: "वेयरहाउस",
      description: "किसी ख़ास वेयरहाउस का ब्योरा पाएँ।",
      widget: {
        companyName: "कंपनी",
        stockedProducts: "स्टॉक में प्रोडक्ट",
        companyInventory: "कंपनी इन्वेंटरी ओवरव्यू",
        missingValuation: "लागत नहीं",
        details: "वेयरहाउस का ब्योरा",
        related: "इन्वेंटरी",
        backToList: "वेयरहाउस पर वापस",
        back: "वापस",
        edit: "वेयरहाउस एडिट करें",
        viewStock: "स्टॉक देखें",
        select: "वेयरहाउस चुनें",
      },
      warehouseId: {
        label: "वेयरहाउस",
        description: "जिस वेयरहाउस का ब्योरा चाहिए",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत वेयरहाउस ID",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "वेयरहाउस देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस वेयरहाउस का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "वेयरहाउस लोड नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "वेयरहाउस नहीं मिला",
          description: "वेयरहाउस मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "वेयरहाउस लोड हो गया",
        description: "वेयरहाउस का ब्योरा मिल गया",
      },
      response: {
        id: "वेयरहाउस ID",
        companyId: "कंपनी ID",
        name: "नाम",
        code: "कोड",
        address: "पता",
        isActive: "एक्टिव",
        isDefault: "डिफ़ॉल्ट",
        negativeStockPolicy: "नेगेटिव स्टॉक पॉलिसी",
        createdAt: "बनाने का समय",
        updatedAt: "अपडेट का समय",
      },
    },
  },

  // Warehouse update
  warehouseUpdate: {
    patch: {
      title: "वेयरहाउस अपडेट करें",
      titleShort: "वेयरहाउस एडिट करें",
      description: "वेयरहाउस का ब्योरा अपडेट करें।",
      widget: {
        backToWarehouse: "वेयरहाउस पर वापस",
        active: "एक्टिव",
        inactive: "निष्क्रिय",
      },
      warehouseId: {
        label: "वेयरहाउस",
        description: "अपडेट करने वाला वेयरहाउस",
      },
      name: {
        label: "वेयरहाउस का नाम",
        description: "वेयरहाउस का पूरा नाम",
        placeholder: "मुख्य वेयरहाउस",
      },
      code: {
        label: "कोड",
        description: "छोटी पहचान",
        placeholder: "WH-01",
      },
      address: {
        label: "पता",
        description: "भौतिक पता",
        placeholder: "123 स्टोरेज लेन",
      },
      isActive: {
        label: "एक्टिव",
        description: "ये वेयरहाउस चालू है या नहीं",
      },
      isDefault: {
        label: "डिफ़ॉल्ट वेयरहाउस",
        description: "डिफ़ॉल्ट वेयरहाउस बनाएँ",
      },
      negativeStockPolicy: {
        label: "नेगेटिव स्टॉक पॉलिसी",
        description: "हाथ में मात्रा कम होने पर टिल की बिक्री और स्टॉक इश्यू कैसे चलें",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "वेयरहाउस अपडेट करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एडमिन ज़रूरी",
          description: "सिर्फ़ एडमिन वेयरहाउस अपडेट कर सकते हैं",
        },
        conflict: {
          title: "कोड में टकराव",
          description: "वो वेयरहाउस कोड पहले से लिया जा चुका है",
        },
        server: {
          title: "सर्वर एरर",
          description: "वेयरहाउस अपडेट नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "वेयरहाउस नहीं मिला",
          description: "वेयरहाउस मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "वेयरहाउस अपडेट हो गया",
        description: "वेयरहाउस सफलतापूर्वक अपडेट हुआ",
      },
      response: {
        id: "वेयरहाउस ID",
        name: "नाम",
        code: "कोड",
        isActive: "एक्टिव",
        isDefault: "डिफ़ॉल्ट",
        negativeStockPolicy: "नेगेटिव स्टॉक पॉलिसी",
      },
    },
  },

  // Stock list
  stockList: {
    get: {
      title: "स्टॉक लेवल",
      titleShort: "स्टॉक लेवल",
      description: "किसी वेयरहाउस के स्टॉक लेवल उपलब्धता और कम-स्टॉक संकेतकों के साथ देखें।",
      widget: {
        unnamedProduct: "प्रोडक्ट का नाम उपलब्ध नहीं",
        search: "प्रोडक्ट या वेयरहाउस खोजें",
        stockStatus: "स्टॉक स्टेटस",
        actions: "कार्रवाइयाँ",
        noMatches: "कोई मेल खाता स्टॉक रिकॉर्ड नहीं",
        loadMore: "और दिखाएँ",

        back: "वापस",
        defaultLowStockRule: "{{threshold}} उपलब्ध से कम पर कम",
        reorderPointRule: "{{threshold}} उपलब्ध या उससे कम पर कम",
        stockValuePrecision:
          "स्टॉक वैल्यू = हाथ में मात्रा × बिना राउंड की यूनिट लागत। दिखाई गई लागत दो दशमलव तक राउंड है।",
        lowStock: "कम स्टॉक",
        available: "उपलब्ध",
        onHand: "हाथ में",
        reserved: "रिज़र्व्ड",
        onOrder: "ऑर्डर पर",
        reorderPoint: "रीऑर्डर पॉइंट",
        empty: "अभी कोई स्टॉक रिकॉर्ड नहीं।",
        emptyHint: "यहाँ लेवल देखने के लिए वेयरहाउस में स्टॉक प्राप्त करें।",
        emptyIcon: "📦",
        loading: "स्टॉक लेवल लोड हो रहे हैं…",
        filterProduct: "प्रोडक्ट से फ़िल्टर करें",
        load: "लोड करें",
        selectWarehouse: "स्टॉक लेवल देखने के लिए वेयरहाउस ID डालें।",
        total: "आइटम",
        adjust: "एडजस्ट",
        transfer: "ट्रांसफ़र",
        outOfStock: "स्टॉक ख़त्म",
        belowReorderPoint: "रीऑर्डर पॉइंट से नीचे",
        bulletSeparator: "·",
        stockValue: "स्टॉक वैल्यू",
        statusOk: "स्टॉक में",
      },
      warehouseId: {
        label: "वेयरहाउस",
        description: "जिस वेयरहाउस का स्टॉक देखना है",
      },
      productId: {
        label: "प्रोडक्ट",
        description: "किसी ख़ास प्रोडक्ट तक फ़िल्टर करें (वैकल्पिक)",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "स्टॉक देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस वेयरहाउस का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "स्टॉक लेवल लोड नहीं हो सके",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "वेयरहाउस नहीं मिला",
          description: "वेयरहाउस मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: { title: "स्टॉक लोड हो गया", description: "स्टॉक लेवल मिल गए" },
      response: {
        currency: "करेंसी",
        id: "स्टॉक ID",
        warehouseId: "वेयरहाउस ID",
        warehouseName: "वेयरहाउस",
        productId: "प्रोडक्ट ID",
        productName: "प्रोडक्ट",
        quantityOnHand: "हाथ में",
        quantityReserved: "रिज़र्व्ड",
        quantityOnOrder: "ऑर्डर पर",
        quantityAvailable: "उपलब्ध",
        reorderPoint: "रीऑर्डर पॉइंट",
        reorderQuantity: "रीऑर्डर मात्रा",
        unitCost: "यूनिट लागत",
        isLowStock: "कम स्टॉक",
        updatedAt: "अपडेट का समय",
      },
    },
  },

  // Stock adjust
  stockWrite: {
    onHandNow: "अभी हाथ में:",
    viewStock: "स्टॉक लेवल देखें",
    again: "एक और दर्ज करें",
  },
  stockAdjust: {
    post: {
      title: "स्टॉक एडजस्ट करें",
      titleShort: "स्टॉक एडजस्ट करें",
      description:
        "स्टॉक की मात्रा हाथ से एडजस्ट करें। राइट-ऑफ़ के लिए नेगेटिव वैल्यू इस्तेमाल करें।",
      widget: {
        backToStock: "स्टॉक पर वापस",
        reserved: "रिज़र्व्ड",
        preview: "प्रीव्यू",
        quantityChange: "मात्रा में बदलाव",
        positiveHint: "सकारात्मक मात्रा स्टॉक जोड़ती है",
        negativeHint: "नेगेटिव मात्रा स्टॉक घटाती है",
      },
      warehouseId: {
        label: "वेयरहाउस",
        description: "जिस वेयरहाउस का स्टॉक एडजस्ट करना है",
      },
      productId: { label: "प्रोडक्ट", description: "एडजस्ट करने वाला प्रोडक्ट" },
      quantity: {
        label: "मात्रा",
        description: "चिह्न वाली मात्रा का बदलाव (सकारात्मक = जोड़ें, नेगेटिव = घटाएँ)",
        placeholder: "10",
      },
      reason: {
        label: "वजह",
        description: "ये एडजस्टमेंट क्यों किया जा रहा है",
        placeholder: "भौतिक गिनती का सुधार",
      },
      unitCost: {
        label: "यूनिट लागत",
        description: "प्रति यूनिट लागत (वैकल्पिक)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "स्टॉक एडजस्ट करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस वेयरहाउस का एक्सेस नहीं",
        },
        conflict: {
          title: "स्टॉक कम है",
          description: "इस एडजस्टमेंट के लिए पर्याप्त स्टॉक उपलब्ध नहीं",
        },
        server: {
          title: "सर्वर एरर",
          description: "स्टॉक एडजस्ट नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "नहीं मिला",
          description: "वेयरहाउस या प्रोडक्ट नहीं मिला",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "स्टॉक एडजस्ट हो गया",
        description: "स्टॉक एडजस्टमेंट दर्ज हो गया",
      },
      response: {
        movementId: "मूवमेंट ID",
        productId: "प्रोडक्ट ID",
        warehouseId: "वेयरहाउस ID",
        quantityOnHand: "नया हाथ में",
        quantityAvailable: "उपलब्ध",
      },
    },
  },

  // Stock receive
  stockReceive: {
    post: {
      title: "स्टॉक प्राप्त करें",
      titleShort: "स्टॉक प्राप्त करें",
      description:
        "हाथ की मात्रा और भारित औसत लागत अपडेट करने के लिए स्टॉक रसीद दर्ज करें।",
      widget: {
        backToStock: "स्टॉक पर वापस",
      },
      warehouseId: {
        label: "वेयरहाउस",
        description: "स्टॉक प्राप्त करने वाला वेयरहाउस",
      },
      productId: { label: "प्रोडक्ट", description: "प्राप्त हो रहा प्रोडक्ट" },
      quantity: {
        label: "मात्रा",
        description: "प्राप्त यूनिट की संख्या",
        placeholder: "100",
      },
      unitCost: {
        label: "यूनिट लागत",
        description: "प्राप्त हर यूनिट की लागत",
        placeholder: "0.00",
      },
      reference: {
        label: "रेफ़रेंस",
        description: "परचेज़ ऑर्डर नंबर या डिलीवरी नोट",
        placeholder: "PO-2024-001",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "स्टॉक प्राप्त करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस वेयरहाउस का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "स्टॉक प्राप्त नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "नहीं मिला",
          description: "वेयरहाउस या प्रोडक्ट नहीं मिला",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "स्टॉक प्राप्त हुआ",
        description: "स्टॉक रसीद दर्ज हो गई",
      },
      response: {
        movementId: "मूवमेंट ID",
        productId: "प्रोडक्ट ID",
        warehouseId: "वेयरहाउस ID",
        quantityOnHand: "नया हाथ में",
        unitCost: "नई यूनिट लागत",
      },
    },
  },

  // Stock issue
  stockIssue: {
    post: {
      title: "स्टॉक जारी करें",
      titleShort: "स्टॉक जारी करें",
      description: "वेयरहाउस से स्टॉक जारी करें। पर्याप्त उपलब्ध मात्रा जाँचता है।",
      widget: {
        backToStock: "स्टॉक पर वापस",
      },
      warehouseId: {
        label: "वेयरहाउस",
        description: "जिस वेयरहाउस से स्टॉक जारी हो रहा है",
      },
      productId: { label: "प्रोडक्ट", description: "जारी करने वाला प्रोडक्ट" },
      quantity: {
        label: "मात्रा",
        description: "जारी करने की यूनिट की संख्या",
        placeholder: "10",
      },
      reference: {
        label: "रेफ़रेंस",
        description: "वर्क ऑर्डर, जॉब नंबर या कोई और रेफ़रेंस",
        placeholder: "WO-2024-001",
      },
      unitCost: {
        label: "यूनिट लागत",
        description: "प्रति यूनिट लागत (डिफ़ॉल्ट मौजूदा भारित औसत)",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "स्टॉक जारी करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस वेयरहाउस का एक्सेस नहीं",
        },
        conflict: {
          title: "स्टॉक कम है",
          description: "जारी करने के लिए पर्याप्त स्टॉक उपलब्ध नहीं",
        },
        server: { title: "सर्वर एरर", description: "स्टॉक जारी नहीं हो सका" },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "नहीं मिला",
          description: "वेयरहाउस या प्रोडक्ट नहीं मिला",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "स्टॉक जारी हुआ",
        description: "स्टॉक सफलतापूर्वक जारी हुआ",
      },
      response: {
        movementId: "मूवमेंट ID",
        productId: "प्रोडक्ट ID",
        warehouseId: "वेयरहाउस ID",
        quantityOnHand: "नया हाथ में",
        quantityAvailable: "उपलब्ध",
      },
    },
  },

  // Transfer create
  transferCreate: {
    post: {
      title: "ट्रांसफ़र बनाएँ",
      titleShort: "नया ट्रांसफ़र",
      description: "वेयरहाउस ट्रांसफ़र रिक्वेस्ट बनाएँ। ड्राफ़्ट स्टेटस में शुरू होती है।",
      widget: {
        itemsTitle: "हिलाने वाले आइटम",
        pickSource: "स्रोत वेयरहाउस चुनें ताकि दिखे उसमें क्या है।",
        noStock: "इस वेयरहाउस में हिलाने के लिए कोई स्टॉक नहीं है।",
        available: "{{quantity}} उपलब्ध",
        itemsRequired: "कम से कम एक प्रोडक्ट की मात्रा डालें।",
        backToList: "ट्रांसफ़र पर वापस",
        viewTransfer: "ट्रांसफ़र देखें",
        browseWarehouses: "वेयरहाउस देखें",
      },
      companyId: {
        label: "कंपनी",
        description: "वो कंपनी जिसका ये ट्रांसफ़र है",
      },
      fromWarehouseId: {
        label: "किस वेयरहाउस से",
        description: "स्टॉक भेजने वाला वेयरहाउस",
      },
      toWarehouseId: {
        label: "किस वेयरहाउस में",
        description: "स्टॉक पाने वाला वेयरहाउस",
      },
      reference: {
        label: "रेफ़रेंस",
        description: "ट्रांसफ़र का रेफ़रेंस नंबर",
        placeholder: "TR-2024-001",
      },
      notes: {
        label: "नोट्स",
        description: "इस ट्रांसफ़र के बारे में अतिरिक्त नोट",
        placeholder: "मौसमी रीस्टॉक",
      },
      items: {
        label: "आइटम",
        description: "ट्रांसफ़र करने वाले प्रोडक्ट और मात्राएँ",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "ट्रांसफ़र बनाने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस कंपनी का एक्सेस नहीं",
        },
        conflict: {
          invalidWarehouses: "दोनों वेयरहाउस एक्टिव और इसी कंपनी के होने चाहिए।",
          invalidItems:
            "हर प्रोडक्ट एक बार लिखें और मात्रा शून्य से ज़्यादा रखें (4 दशमलव तक)।",
          title: "वही वेयरहाउस",
          description: "से और तक के वेयरहाउस अलग होने चाहिए",
        },
        server: {
          title: "सर्वर एरर",
          description: "ट्रांसफ़र नहीं बन सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: { title: "नहीं मिला", description: "वेयरहाउस नहीं मिला" },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "ट्रांसफ़र बन गया",
        description: "ट्रांसफ़र ड्राफ़्ट बन गया",
      },
      response: {
        id: "ट्रांसफ़र ID",
        status: "स्टेटस",
        reference: "रेफ़रेंस",
        fromWarehouseId: "किस वेयरहाउस से",
        toWarehouseId: "किस वेयरहाउस में",
      },
    },
  },

  // Transfer list
  transferList: {
    get: {
      title: "ट्रांसफ़र",
      titleShort: "ट्रांसफ़र",
      description: "किसी कंपनी के वेयरहाउस ट्रांसफ़र की लिस्ट।",
      widget: {
        back: "वापस",
        newTransfer: "नया ट्रांसफ़र",
        empty: "अभी कोई ट्रांसफ़र नहीं।",
        emptyHint: "वेयरहाउस के बीच स्टॉक हिलाने के लिए ट्रांसफ़र बनाएँ।",
        emptyIcon: "🔄",
        loading: "ट्रांसफ़र लोड हो रहे हैं…",
        load: "लोड करें",
        selectCompany: "ट्रांसफ़र लोड करने के लिए कंपनी ID डालें।",
        total: "ट्रांसफ़र",
        view: "देखें",
        draft: "ड्राफ़्ट",
        inTransit: "रास्ते में",
        viewTransfer: "ट्रांसफ़र देखें",
        tabAll: "सभी",
        tabDraft: "पेंडिंग",
        tabInTransit: "रास्ते में",
        tabReceived: "पूरा हुआ",
        tabCancelled: "रद्द",
        arrowSeparator: "→",
      },
      companyId: {
        label: "कंपनी",
        description: "जिस कंपनी के ट्रांसफ़र दिखाने हैं",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "ट्रांसफ़र देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस कंपनी का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "ट्रांसफ़र की लिस्ट नहीं मिल सकी",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "ट्रांसफ़र लोड हो गए",
        description: "ट्रांसफ़र की लिस्ट मिल गई",
      },
      response: {
        id: "ट्रांसफ़र ID",
        fromWarehouseId: "भेजने वाले वेयरहाउस की ID",
        fromWarehouseName: "से",
        toWarehouseId: "पाने वाले वेयरहाउस की ID",
        toWarehouseName: "तक",
        status: "स्टेटस",
        reference: "रेफ़रेंस",
        createdAt: "बनाने का समय",
        completedAt: "पूरा होने का समय",
      },
    },
  },

  // Transfer get
  transferGet: {
    get: {
      title: "ट्रांसफ़र पाएँ",
      titleShort: "ट्रांसफ़र",
      description: "एक ट्रांसफ़र उसके सभी लाइन आइटम के साथ पाएँ।",
      widget: {
        cancel: "ट्रांसफ़र रद्द करें",
        retry: "दोबारा कोशिश करें",
        noItems: "इस ट्रांसफ़र में कोई आइटम नहीं है।",
        noItemsHint:
          "ट्रांसफ़र बनाते समय हिलाने वाले प्रोडक्ट जोड़ें। बिना आइटम का ट्रांसफ़र डिस्पैच नहीं हो सकता।",
        receivedOf: "{{requested}} में से {{received}} प्राप्त",
        newTransfer: "नया ट्रांसफ़र",
        back: "वापस",
        dispatch: "ट्रांसफ़र डिस्पैच करें",
        receive: "प्राप्त चिह्नित करें",
        status: "स्टेटस",
        select: "ट्रांसफ़र चुनें",
      },
      transferId: { label: "ट्रांसफ़र", description: "जो ट्रांसफ़र पाना है" },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत ट्रांसफ़र ID",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "ट्रांसफ़र देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस ट्रांसफ़र का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "ट्रांसफ़र लोड नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "ट्रांसफ़र नहीं मिला",
          description: "ट्रांसफ़र मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "ट्रांसफ़र लोड हो गया",
        description: "ट्रांसफ़र का ब्योरा मिल गया",
      },
      response: {
        id: "ट्रांसफ़र ID",
        companyId: "कंपनी ID",
        fromWarehouseId: "किस वेयरहाउस से",
        fromWarehouseName: "किस वेयरहाउस से",
        toWarehouseId: "किस वेयरहाउस में",
        toWarehouseName: "किस वेयरहाउस में",
        status: "स्टेटस",
        reference: "रेफ़रेंस",
        notes: "नोट्स",
        createdAt: "बनाया गया",
        completedAt: "पूरा हुआ",
        items: "आइटम",
        itemId: "आइटम ID",
        productId: "प्रोडक्ट ID",
        productName: "प्रोडक्ट",
        quantityRequested: "माँगा गया",
        quantityReceived: "प्राप्त",
      },
    },
  },

  // Transfer dispatch
  transferCancel: {
    post: {
      title: "ट्रांसफ़र रद्द करें",
      titleShort: "ट्रांसफ़र रद्द करें",
      description:
        "इस ट्रांसफ़र को रोकें। डिस्पैच किया ट्रांसफ़र अपना स्टॉक वापस स्रोत वेयरहाउस में रख देता है।",
      widget: {
        backToTransfer: "ट्रांसफ़र पर वापस",
      },
      transferId: {
        label: "ट्रांसफ़र",
        description: "जो ट्रांसफ़र रद्द करना है",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत ट्रांसफ़र",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "ट्रांसफ़र रद्द करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस ट्रांसफ़र का एक्सेस नहीं",
        },
        conflict: {
          title: "रद्द नहीं हो सकता",
          description: "सिर्फ़ ड्राफ़्ट या रास्ते वाले ट्रांसफ़र रद्द हो सकते हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "ट्रांसफ़र रद्द नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "ट्रांसफ़र नहीं मिला",
          description: "ट्रांसफ़र मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "ट्रांसफ़र रद्द हो गया",
        description: "इस ट्रांसफ़र का कुछ भी अब रास्ते में नहीं है।",
      },
      response: {
        id: "ट्रांसफ़र",
        status: "स्टेटस",
      },
    },
  },
  transferDispatch: {
    post: {
      title: "ट्रांसफ़र डिस्पैच करें",
      titleShort: "डिस्पैच",
      description:
        "ट्रांसफ़र को रास्ते में चिह्नित करें। स्टॉक स्रोत वेयरहाउस से निकल जाता है।",
      widget: {
        backToTransfer: "ट्रांसफ़र पर वापस",
      },
      transferId: { label: "ट्रांसफ़र", description: "डिस्पैच करने वाला ट्रांसफ़र" },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत ट्रांसफ़र ID",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "ट्रांसफ़र डिस्पैच करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस ट्रांसफ़र का एक्सेस नहीं",
        },
        conflict: {
          insufficientStock: "स्रोत वेयरहाउस में हर आइटम के लिए पर्याप्त स्टॉक नहीं।",
          title: "ड्राफ़्ट नहीं है",
          description: "सिर्फ़ ड्राफ़्ट ट्रांसफ़र डिस्पैच हो सकते हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "ट्रांसफ़र डिस्पैच नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "ट्रांसफ़र नहीं मिला",
          description: "ट्रांसफ़र मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "ट्रांसफ़र डिस्पैच हो गया",
        description: "ट्रांसफ़र अब रास्ते में है",
      },
      response: {
        id: "ट्रांसफ़र ID",
        status: "स्टेटस",
      },
    },
  },

  // Transfer receive
  transferReceive: {
    post: {
      title: "ट्रांसफ़र प्राप्त करें",
      titleShort: "ट्रांसफ़र प्राप्त करें",
      description:
        "ट्रांसफ़र को प्राप्त चिह्नित करें। स्टॉक मूवमेंट बनाता है और दोनों सिरों पर इन्वेंटरी अपडेट करता है।",
      widget: {
        backToTransfer: "ट्रांसफ़र पर वापस",
      },
      transferId: { label: "ट्रांसफ़र", description: "प्राप्त करने वाला ट्रांसफ़र" },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत ट्रांसफ़र ID",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "ट्रांसफ़र प्राप्त करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस ट्रांसफ़र का एक्सेस नहीं",
        },
        conflict: {
          title: "रास्ते में नहीं",
          description: "सिर्फ़ रास्ते वाले ट्रांसफ़र प्राप्त हो सकते हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "ट्रांसफ़र प्राप्त नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "ट्रांसफ़र नहीं मिला",
          description: "ट्रांसफ़र मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "ट्रांसफ़र प्राप्त हुआ",
        description: "स्टॉक मूवमेंट बन गए और इन्वेंटरी अपडेट हो गई",
      },
      response: {
        id: "ट्रांसफ़र ID",
        status: "स्टेटस",
        completedAt: "पूरा होने का समय",
      },
    },
  },

  // Inventory Dashboard
  dashboard: {
    get: {
      title: "इन्वेंटरी ओवरव्यू",
      titleShort: "ओवरव्यू",
      description:
        "स्टॉक की सेहत, पेंडिंग ट्रांसफ़र और वेयरहाउस की गिनती का लाइव स्नैपशॉट।",
      widget: {
        noWarehousesHint:
          "स्टॉक प्राप्त करना और हिलाना शुरू करने के लिए वेयरहाउस बनाएँ।",
        navStockLevelsHint: "मात्रा, वैल्यू और रीऑर्डर पॉइंट",
        navTransfersHint: "रास्ते में: {{count}}",
        navWarehousesHint: "लोकेशन: {{count}}",
        noWarehouses: "अभी कोई वेयरहाउस नहीं",
        related: "संबंधित",
        kpiInStock: "स्टॉक में",
        kpiOutOfStock: "स्टॉक ख़त्म",
        kpiLowStock: "कम स्टॉक",
        kpiWarehouses: "वेयरहाउस",
        attention: "ध्यान चाहने वाला स्टॉक",
        noAttention: "कोई आइटम अपनी स्टॉक सीमा से नीचे नहीं है।",
        newPurchaseOrder: "नया परचेज़ ऑर्डर",
        kpiTransfersInTransit: "रास्ते में ट्रांसफ़र",
        alertOutOfStock: "{{count}} प्रोडक्ट स्टॉक में नहीं",
        alertOutOfStockPlural: "{{count}} प्रोडक्ट स्टॉक में नहीं",
        navStockLevels: "स्टॉक लेवल",
        navTransfers: "ट्रांसफ़र",
        navWarehouses: "वेयरहाउस",
        loading: "लोड हो रहा है…",
        pendingTransfers: "{{count}} ट्रांसफ़र रास्ते में",
        pendingTransfersPlural: "{{count}} ट्रांसफ़र रास्ते में",
      },
      companyId: {
        label: "कंपनी",
        description: "जिस कंपनी के इन्वेंटरी स्टैट्स दिखाने हैं (वैकल्पिक)",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं हैं",
          description: "इन्वेंटरी ओवरव्यू देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस कंपनी का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "इन्वेंटरी ओवरव्यू लोड नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "डैशबोर्ड लोड हो गया",
        description: "इन्वेंटरी ओवरव्यू मिल गया",
      },
      response: {
        inStockCount: "स्टॉक में",
        outOfStockCount: "स्टॉक ख़त्म",
        lowStockCount: "कम स्टॉक",
        pendingTransferCount: "पेंडिंग ट्रांसफ़र",
        warehouseCount: "वेयरहाउस",
      },
    },
  },
};
