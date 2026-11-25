import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Uložené adresy",
  tag: "addresses",

  widget: {
    chooseAddress: "Vyber uloženú adresu",
    addressUnavailable: "Adresa nie je k dispozícii",
    saveChanges: "Uložiť zmeny",
    reviewDeletion: "Skontrolovať odstránenie",
    confirmDeletion: "Chceš odstrániť „{{label}}“ z uložených adries?",
    cancel: "Zrušiť",
  },

  update: {
    title: "Aktualizovať adresu",
    titleShort: "Aktualizovať adresu",
    description: "Upraviť uloženú adresu",
    fields: {
      addressId: {
        label: "ID adresy",
        description: "Adresa, ktorú chceš upraviť",
      },
      label: {
        label: "Označenie",
        description: "Pomenuj adresu",
        placeholder: "Domov",
      },
      fullName: {
        label: "Celé meno",
        description: "Meno kontaktnej osoby",
        placeholder: "Jana Nováková",
      },
      company: {
        label: "Firma",
        description: "Názov spoločnosti (nepovinné)",
        placeholder: "Vzor, s. r. o.",
      },
      phone: {
        label: "Telefón",
        description: "Kontaktné telefónne číslo",
        placeholder: "+421 900 000 000",
      },
      vatNumber: {
        label: "IČ DPH",
        description: "Identifikačné číslo pre DPH v EÚ",
        placeholder: "SK1234567890",
      },
      taxId: {
        label: "DIČ",
        description: "Daňové identifikačné číslo",
        placeholder: "1234567890",
      },
      addressLine1: {
        label: "Adresa, riadok 1",
        description: "Ulica a číslo",
        placeholder: "Hlavná 12",
      },
      addressLine2: {
        label: "Adresa, riadok 2",
        description: "Byt, kancelária alebo jednotka (nepovinné)",
        placeholder: "Byt 4B",
      },
      city: { label: "Mesto", description: "Mesto", placeholder: "Bratislava" },
      region: {
        label: "Štát alebo región",
        description: "Štát alebo región (nepovinné)",
        placeholder: "Bratislavský kraj",
      },
      postalCode: {
        label: "PSČ",
        description: "Poštové smerovacie číslo",
        placeholder: "811 01",
      },
      country: {
        label: "Krajina",
        description: "Dvojpísmenový kód krajiny podľa ISO 3166-1 alpha-2",
        placeholder: "SK",
      },
      isDefaultBilling: {
        label: "Predvolená fakturačná adresa",
        description: "Použiť ako predvolenú fakturačnú adresu",
      },
      isDefaultDelivery: {
        label: "Predvolená adresa doručenia",
        description: "Použiť ako predvolenú adresu doručenia",
      },
    },
    response: {
      updated: "Aktualizované",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Skontroluj povinné polia",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Táto adresa nepatrí k tvojmu účtu",
      },
      notFound: { title: "Nenájdené", description: "Adresa sa nenašla" },
      conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      internal: {
        title: "Chyba servera",
        description: "Interná chyba servera",
        detail: "Adresu sa nepodarilo upraviť: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
    },
    success: {
      title: "Adresa sa upravila",
      description: "Adresa sa uložila",
    },
    widget: {
      updated: "Adresa sa upravila.",
      backToAddresses: "Späť na adresy",
    },
  },

  delete: {
    title: "Odstrániť adresu",
    titleShort: "Odstrániť adresu",
    description: "Odstráň uloženú adresu zo svojho účtu",
    fields: {
      addressId: { label: "ID adresy", description: "Adresa na odstránenie" },
    },
    response: {
      deleted: "Odstránené",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Táto adresa nepatrí k tvojmu účtu",
      },
      notFound: { title: "Nenájdené", description: "Adresa sa nenašla" },
      conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      internal: {
        title: "Chyba servera",
        description: "Interná chyba servera",
        detail: "Adresu sa nepodarilo odstrániť: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
    },
    success: {
      title: "Adresa odstránená",
      description: "Adresa sa odstránila z tvojho účtu",
    },
    widget: {
      deleted: "Adresa bola odstránená.",
      backToAddresses: "Späť na adresy",
    },
  },
};
