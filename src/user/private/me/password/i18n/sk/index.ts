import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profil používateľa",

  title: "Zmeniť heslo",
  titleShort: "Zmeniť heslo",
  description: "Potvrď aktuálne heslo a potom nastav nové.",
  tag: "password-change",
  debug: {
    updatingPassword: "Heslo sa mení",
    errorUpdatingPassword: "Heslo sa nepodarilo zmeniť",
    settingPassword: "Nastavuje sa heslo",
    errorSettingPassword: "Heslo sa nepodarilo nastaviť",
  },
  groups: {
    currentCredentials: {
      title: "Aktuálne heslo",
      description: "Pred pokračovaním over aktuálne heslo",
    },
    newCredentials: {
      title: "Nové heslo",
      description: "Vyber si nové silné heslo k účtu",
    },
  },
  currentPassword: {
    label: "Aktuálne heslo",
    description: "Zadaj aktuálne heslo",
    placeholder: "Tvoje aktuálne heslo",
    help: "Ak chceš zmeniť heslo, potvrď svoju totožnosť aktuálnym heslom",
  },
  newPassword: {
    label: "Nové heslo",
    description: "Najmenej 8 znakov.",
    placeholder: "Minimálne 8 znakov",
    help: "Vyber silné heslo s aspoň 8 znakmi vrátane písmen, číslic a symbolov",
  },
  confirmPassword: {
    label: "Zopakuj nové heslo",
    description: "Potvrď nové heslo",
    placeholder: "Zadaj heslo znova",
    help: "Zadaj nové heslo znova, aby sa overilo, že si ho napísal správne",
  },
  twoFactorCode: {
    label: "Kód dvojfaktorového overenia",
    description: "Ak máš zapnuté dvojfaktorové overenie, zadaj kód",
    placeholder: "Zadaj kód dvojfaktorového overenia",
  },
  response: {
    title: "Výsledok zmeny hesla",
    description: "Údaje po zmene hesla",
    success: "Heslo zmenené",
    message: "Správa o stave",
    securityTip: "Bezpečnostný tip",
    nextSteps: {
      item: "Ďalšie kroky",
    },
  },
  validation: {
    currentPassword: {
      minLength: "Aktuálne heslo musí mať aspoň 8 znakov",
    },
    newPassword: {
      minLength: "Nové heslo musí mať aspoň 8 znakov",
    },
    confirmPassword: {
      minLength: "Potvrdenie hesla musí mať aspoň 8 znakov",
    },
    passwords: {
      mismatch: "Heslá sa nezhodujú",
    },
  },
  errors: {
    passwords_do_not_match: "Heslá sa nezhodujú",
    user_not_found: "Používateľ {{userId}} sa nenašiel",
    incorrect_password: "Nesprávne heslo",
    update_failed: "Heslo sa nepodarilo zmeniť",
    token_creation_failed: "Nepodarilo sa vytvoriť token hesla",
    two_factor_code_required: "Vyžaduje sa kód dvojfaktorového overenia",
    invalid_two_factor_code: "Neplatný kód dvojfaktorového overenia",
    invalid_request: {
      title: "Neplatná požiadavka",
      description: "Požiadavka na zmenu hesla je neplatná",
    },
    validation: {
      title: "Chyba overenia",
      description: "Skontrolujte zadané údaje a skúste to znova",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Ak chceš zmeniť heslo, prihlás sa",
    },
    server: {
      title: "Chyba servera",
      description: "Heslo sa nepodarilo zmeniť pre chybu servera",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Pri zmene hesla nastala neočakávaná chyba",
    },
    network: {
      title: "Chyba siete",
      description: "Sieťové pripojenie zlyhalo",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Na túto akciu nemáš oprávnenie",
    },
    notFound: {
      title: "Používateľ sa nenašiel",
      description: "Používateľský účet sa nenašiel",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Neuložené zmeny sa stratia",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Pri zmene hesla došlo ku konfliktu",
    },
  },
  success: {
    updated: "Heslo sa zmenilo",
    securityTip: "Pre vyššiu bezpečnosť zapni dvojfaktorové overenie",
    nextSteps: {
      logoutOther:
        "Zo všetkých ostatných relácií ťa odhlásime. Nabudúce sa prihlás novým heslom.",
      enable2fa: "Pre vyššiu bezpečnosť zváž zapnutie dvojfaktorového overenia",
    },
    title: "Heslo sa zmenilo",
    description: "Tvoje heslo bolo zmenené",
  },
  update: {
    success: {
      title: "Heslo sa zmenilo",
      description: "Tvoje heslo bolo zmenené",
    },
    errors: {
      unknown: {
        title: "Neznáma chyba",
        description: "Pri zmene hesla nastala neočakávaná chyba",
      },
    },
  },
  widget: {
    back: "Späť",
    submit: "Zmeniť heslo",
    submitting: "Aktualizuje sa…",
  },
};
