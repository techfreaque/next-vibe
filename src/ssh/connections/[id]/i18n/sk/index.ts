import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    clusterRole: {
      none: "Žiadna",
      controlPlane: "Riadiaci uzol",
      worker: "Pracovný uzol",
      storage: "Úložisko",
    },
    authType: {
      password: "Heslo",
      privateKey: "Súkromný kľúč (PEM)",
      keyAgent: "SSH agent",
      local: "Miestny počítač",
    },
  },

  errors: {
    connectionNotFound: "Pripojenie sa nenašlo",
    encryptionFailed:
      "Šifrovanie zlyhalo. Skontrolujte hodnotu JWT_SECRET_KEY.",
  },

  get: {
    title: "Pripojenie SSH",
    titleShort: "Pripojenie SSH",
    description: "Zobraziť podrobnosti pripojenia SSH",
    fields: {
      id: {
        label: "ID pripojenia",
        description: "Pripojenie, ktorého podrobnosti chcete zobraziť",
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
        description: "Nemáte potrebné oprávnenie",
      },
      server: {
        title: "Chyba servera",
        description: "Pripojenie sa nepodarilo načítať",
      },
      notFound: { title: "Nenašlo sa", description: "Pripojenie sa nenašlo" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Údaje sú v konflikte",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
    },
    response: {
      label: { title: "Názov" },
      host: { title: "Hostiteľ" },
      port: { title: "Port" },
      username: { title: "Používateľské meno" },
      authType: { title: "Spôsob overenia" },
      isDefault: { title: "Predvolené" },
      fingerprint: { title: "Odtlačok kľúča" },
      notes: { title: "Poznámky" },
      createdAt: { title: "Dátum vytvorenia" },
    },
    success: {
      title: "Pripojenie sa načítalo",
      description: "Podrobnosti pripojenia sa načítali",
    },
  },
  patch: {
    title: "Upraviť pripojenie SSH",
    titleShort: "Upraviť pripojenie",
    description: "Upraviť nastavenia pripojenia SSH",
    fields: {
      id: {
        label: "ID pripojenia",
        description: "Pripojenie, ktoré chcete upraviť",
      },
      label: {
        label: "Názov",
        description: "Názov, pod ktorým sa pripojenie zobrazí",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Hostiteľ",
        description: "Názov hostiteľa alebo IP adresa",
        placeholder: "1.2.3.4",
      },
      port: { label: "Port", description: "Port SSH", placeholder: "22" },
      username: {
        label: "Používateľské meno",
        description: "Používateľské meno na prihlásenie cez SSH",
        placeholder: "deploy",
      },
      authType: { label: "Spôsob overenia", description: "Spôsob overenia" },
      secret: {
        label: "Heslo alebo súkromný kľúč",
        description:
          "Ak chcete ponechať súčasné prihlasovacie údaje, pole nechajte prázdne.",
      },
      passphrase: {
        label: "Heslo k súkromnému kľúču",
        description:
          "Ak heslo nemeníte, ponechajte pole prázdne. Existujúce heslo môžete aj odstrániť.",
      },
      isDefault: {
        label: "Nastaviť ako predvolené",
        description:
          "Používať toto pripojenie ako predvolené pre terminálové relácie",
      },
      clusterRole: {
        label: "Úloha v klastri",
        description:
          "Úloha servera v klastri Kubernetes. Vyberte riadiaci uzol, pracovný uzol, úložisko alebo žiadnu úlohu.",
      },
      notes: {
        label: "Poznámky",
        description: "Voliteľné poznámky k tomuto pripojeniu",
      },
    },
    response: {
      updatedAt: { title: "Dátum poslednej úpravy" },
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
        description: "Nemáte potrebné oprávnenie",
      },
      server: {
        title: "Chyba servera",
        description: "Pripojenie sa nepodarilo aktualizovať",
      },
      notFound: { title: "Nenašlo sa", description: "Pripojenie sa nenašlo" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Údaje sú v konflikte",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
    },
    success: {
      title: "Pripojenie sa aktualizovalo",
      description: "Zmeny pripojenia sa uložili",
    },
  },
  delete: {
    title: "Odstrániť pripojenie SSH",
    titleShort: "Odstrániť pripojenie",
    description: "Odstrániť pripojenie SSH",
    fields: {
      id: {
        label: "ID pripojenia",
        description: "Pripojenie, ktoré chcete odstrániť",
      },
    },
    response: {
      deleted: { title: "Odstránené" },
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
        description: "Nemáte potrebné oprávnenie",
      },
      server: {
        title: "Chyba servera",
        description: "Pripojenie sa nepodarilo odstrániť",
      },
      notFound: { title: "Nenašlo sa", description: "Pripojenie sa nenašlo" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Údaje sú v konflikte",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
    },
    success: {
      title: "Pripojenie sa odstránilo",
      description: "Pripojenie sa odstránilo",
    },
  },
  widget: {
    title: "Podrobnosti pripojenia",
    host: "Hostiteľ",
    user: "Používateľ",
    auth: "Overenie",
    notes: "Poznámky",
    saveButton: "Uložiť zmeny",
    deleteButton: "Odstrániť pripojenie",
    testButton: "Otestovať pripojenie",
    confirmDelete: "Odstrániť toto pripojenie? Tento krok sa nedá vrátiť.",
    mountsSection: "Pripojené adresáre",
    manageMounts: "Spravovať pripojené adresáre",
  },
};
