import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    localModeOnly: {
      title: "Len v miestnom režime",
    },
    connectionNotFound: "Pripojenie sa nenašlo",
    encryptionFailed:
      "Šifrovanie zlyhalo. Skontrolujte hodnotu JWT_SECRET_KEY.",
    connectTimeout: "Čas na pripojenie vypršal",
    sshAuthFailed: "Overenie cez SSH zlyhalo",
    sshConnectionFailed: "Pripojenie SSH zlyhalo",
    fingerprintMismatch:
      "Odtlačok kľúča hostiteľa sa zmenil. Môže ísť o útok MITM. Po overení odtlačku pokračujte s acknowledgeNewFingerprint=true.",
  },

  get: {
    title: "Zoznam používateľov Linuxu",
    titleShort: "Používatelia Linuxu",
    description: "Zobraziť používateľské účty na tomto počítači (UID >= 1000)",
    fields: {
      connectionId: {
        label: "Pripojenie",
        description:
          "Vyberte pripojenie SSH. Pre miestny počítač nechajte pole prázdne.",
        placeholder: "uuid",
      },
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžaduje sa režim LOCAL_MODE",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa zostaviť zoznam používateľov",
      },
      notFound: { title: "Nenašlo sa", description: "Nenašlo sa" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: { title: "Neuložené zmeny" },
      conflict: {
        title: "Konflikt údajov",
        description: "Údaje sú v konflikte",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      timeout: {
        title: "Časový limit",
        description: "Čas na spracovanie požiadavky vypršal",
      },
    },
    response: {
      users: { title: "Používatelia" },
    },
    success: {
      title: "Zoznam používateľov sa načítal",
      description: "Používateľské účty sa načítali",
    },
  },
  widget: {
    title: "Používatelia Linuxu",
    createButton: "Vytvoriť používateľa",
    lockButton: "Zamknúť",
    unlockButton: "Odomknúť",
    deleteButton: "Odstrániť",
    usernameCol: "Používateľské meno",
    uidCol: "UID",
    homeDirCol: "Domovský adresár",
    shellCol: "Shell",
    groupsCol: "Skupiny",
    statusCol: "Stav",
    locked: "Zamknutý",
    active: "Aktívny",
    localModeOnly: "Dostupné iba v režime LOCAL_MODE",
    noUsers: "Nenašli sa žiadni používatelia",
    confirmDelete:
      "Odstrániť používateľa {username}? Tento krok sa nedá vrátiť.",
  },
};
