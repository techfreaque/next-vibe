import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Uložené adresy",
  tag: "addresses",

  list: {
    title: "Fakturačné adresy",
    titleShort: "Moje adresy",
    description: "Zobraziť uložené adresy",
    response: {
      addresses: "Adresy",
    },
    widget: {
      back: "Späť",
      addAddress: "Pridať adresu",
      edit: "Upraviť",
      delete: "Odstrániť",
      billing: "Fakturácia",
      delivery: "Doručenie",
      empty: "Žiadne uložené adresy",
      emptyHint: "Ulož si adresu a pri platení ju už nebudeš musieť vypĺňať.",
      emptyCta: "Pridať svoju prvú adresu",
      loading: "Načítavajú sa adresy…",
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
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenájdené",
        description: "Nenašli sa žiadne adresy",
      },
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
        detail: "Adresy sa nepodarilo načítať: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
    },
    success: { title: "Úspech", description: "Adresy sa načítali" },
  },

  create: {
    title: "Pridať adresu",
    titleShort: "Pridať adresu",
    description: "Uložiť do účtu novú adresu",
    fields: {
      label: {
        label: "Označenie",
        description: "Pomenuj adresu, napríklad Domov alebo Kancelária",
        placeholder: "Domov",
      },
      fullName: {
        label: "Celé meno",
        description: "Meno kontaktnej osoby pre túto adresu",
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
      id: "ID adresy",
      label: "Označenie",
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
        description: "Prístup zamietnutý",
      },
      notFound: { title: "Nenájdené", description: "Používateľ sa nenašiel" },
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
        detail: "Adresu sa nepodarilo uložiť: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
    },
    success: {
      title: "Adresa sa uložila",
      description: "Adresa sa pridala do vášho účtu",
    },
    widget: {
      saved: "Adresa sa uložila.",
      backToAddresses: "Späť na adresy",
    },
  },
};
