import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profil používateľa",

  tag: "avatar",
  errors: {
    user_not_found: "Používateľ {{userId}} sa nenašiel",
    failed_to_upload_avatar:
      "Profilový obrázok pre používateľa {{userId}} sa nepodarilo nahrať: {{error}}",
    failed_to_delete_avatar:
      "Profilový obrázok pre používateľa {{userId}} sa nepodarilo odstrániť: {{error}}",
    invalid_file_type:
      "Neplatný typ súboru {{providedType}}. Povolené: {{allowedTypes}}",
    file_too_large:
      "Súbor je príliš veľký: {{providedSize}}. Maximum: {{maxSize}}",
  },
  debug: {
    uploadingUserAvatar: "Nahráva sa profilový obrázok používateľa",
    errorUploadingUserAvatar:
      "Chyba pri nahrávaní profilového obrázka používateľa",
    deletingUserAvatar: "Odstraňuje sa profilový obrázok používateľa",
    errorDeletingUserAvatar:
      "Chyba pri odstraňovaní profilového obrázka používateľa",
  },
  success: {
    uploaded: "Profilový obrázok bol nahraný",
    deleted: "Profilový obrázok bol odstránený",
    nextSteps: {
      visible: "Nový obrázok sa zobrazuje vo vašom profile",
      update: "Obrázok môžete kedykoľvek zmeniť v nastaveniach profilu",
      default: "Vo vašom profile sa zobrazuje predvolený obrázok",
      uploadNew:
        "Nový profilový obrázok môžete kedykoľvek nahrať v nastaveniach profilu",
    },
  },
  upload: {
    title: "Nahrať profilový obrázok",
    titleShort: "Nahrať profilový obrázok",
    description: "Nahrať profilový obrázok",
    groups: {
      fileUpload: {
        title: "Nahratie súboru",
        description: "Vyberte a nahrajte profilový obrázok",
      },
    },
    fields: {
      file: {
        label: "Profilový obrázok",
        description: "Vyberte súbor s profilovým obrázkom",
        placeholder: "Vyberte súbor s obrázkom...",
        help: "Nahrajte obrázok (JPG, PNG alebo GIF) s veľkosťou do 5 MB",
        validation: {
          maxSize: "Súbor musí mať menej ako 5 MB",
          imageOnly: "Povolené sú len obrázky",
          unsupportedFormat:
            "Nepodporovaný formát obrázka. Použite JPEG, PNG, WebP alebo GIF.",
        },
      },
    },
    response: {
      title: "Odpoveď po nahratí",
      label: "Výsledok nahratia",
      description: "Výsledok nahratia profilového obrázka",
      success: "Nahratie sa podarilo",
      message: "Profilový obrázok bol nahraný",
      avatarUrl: "URL profilového obrázka",
      uploadTime: "Čas nahratia",
      nextSteps: {
        item: "Nasledujúci krok",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Nahraný súbor je neplatný alebo poškodený",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na nahratie profilového obrázka sa musíte prihlásiť",
      },
      server: {
        title: "Chyba servera",
        description: "Profilový obrázok sa nepodarilo nahrať",
      },
      internal: {
        title: "Interná chyba",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri nahrávaní nastala neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Pri nahrávaní nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie nahrať profilový obrázok",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný zdroj sa nenašiel",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Počas nahrávania došlo ku konfliktu",
      },
    },
    success: {
      title: "Profilový obrázok nahraný",
      description: "Profilový obrázok bol nahraný",
    },
  },
  delete: {
    title: "Odstrániť profilový obrázok",
    titleShort: "Odstrániť profilový obrázok",
    description: "Odstrániť aktuálny profilový obrázok",
    response: {
      title: "Odpoveď po odstránení",
      label: "Výsledok odstránenia",
      description: "Výsledok odstránenia profilového obrázka",
      success: "Odstránenie sa podarilo",
      message: "Váš profilový obrázok sa odstránil",
      nextSteps: {
        item: "Nasledujúci krok",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description:
          "Požiadavka na odstránenie profilového obrázka je neplatná",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na odstránenie profilového obrázka sa musíte prihlásiť",
      },
      server: {
        title: "Chyba servera",
        description: "Profilový obrázok sa nepodarilo odstrániť",
      },
      internal: {
        title: "Interná chyba",
        description: "Vyskytla sa interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri odstraňovaní nastala neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Pri odstraňovaní nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie odstrániť tento profilový obrázok",
      },
      notFound: {
        title: "Nenájdené",
        description: "Profilový obrázok na odstránenie sa nenašiel",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Pri odstraňovaní došlo ku konfliktu",
      },
    },
    success: {
      title: "Profilový obrázok odstránený",
      description: "Profilový obrázok bol odstránený",
    },
  },
};
