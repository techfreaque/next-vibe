import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Varianty e-mailových sérií",
  description: "Spravovať registrácie variantov e-mailových sérií",
  enums: {
    campaignType: {
      leadCampaign: "Kampaň pre kontakty",
      newsletter: "Newsletter",
      signupNurture: "Začíname po registrácii",
      retention: "Udržanie predplatiteľov",
      winback: "Návrat používateľov",
      transactional: "Transakčné",
      notification: "Oznámenie",
      system: "Systém",
    },
  },
  get: {
    title: "Varianty e-mailových sérií",
    titleShort: "Varianty e-mailových sérií",
    description: "Zobraziť všetky zaregistrované varianty e-mailových sérií",
    response: {
      id: "ID",
      variantKey: "Kľúč variantu",
      displayName: "Zobrazovaný názov",
      description: "Opis",
      weight: "Váha",
      active: "Aktívne",
      campaignType: "Typ kampane",
      sourceFilePath: "Cesta k zdrojovému súboru",
      senderName: "Meno odosielateľa",
      companyName: "Názov spoločnosti",
      companyEmail: "E-mail spoločnosti",
      checkErrors: "Chyby kontroly",
      createdAt: "Vytvorené",
      updatedAt: "Aktualizované",
      items: "Varianty",
      total: "Počet variantov",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Chýba oprávnenie",
      },
      server: {
        title: "Chyba servera",
        description: "Varianty e-mailových sérií sa nepodarilo načítať",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre požiadavky",
      },
      notFound: { title: "Nenašlo sa", description: "Nenašlo sa" },
      conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
      network: { title: "Chyba siete", description: "Chyba siete" },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny",
      },
    },
    success: {
      title: "Varianty načítané",
      description: "Varianty e-mailových sérií sa načítali",
    },
  },
  post: {
    title: "Zaregistrovať variant e-mailovej série",
    titleShort: "Nový variant",
    description: "Zaregistrovať nový variant e-mailovej série",
    fields: {
      variantKey: {
        label: "Kľúč variantu",
        description:
          "Jedinečný identifikátor, napríklad MY_VARIANT. Musí zodpovedať kľúču v enumerácii EmailJourneyVariant.",
      },
      displayName: {
        label: "Zobrazovaný názov",
        description: "Zrozumiteľný názov variantu",
      },
      description: {
        label: "Opis",
        description: "Téma e-mailovej série",
      },
      weight: {
        label: "Váha",
        description:
          "Váha pri A/B teste (1 až 100). Používa sa iba pri kampaniach na prvé oslovenie kontaktov.",
      },
      campaignType: {
        label: "Typ kampane",
        description: "Typ kampane, pre ktorý je variant určený (nepovinné)",
      },
      sourceFilePath: {
        label: "Cesta k zdrojovému súboru",
        description:
          "Relatívna cesta k súboru .email.tsx, napríklad journeys/my-variant.email",
      },
      senderName: {
        label: "Meno odosielateľa",
        description:
          "Meno odosielateľa zobrazené v e-mailovej aplikácii, napríklad Alex z Unbottled",
      },
      companyName: {
        label: "Názov spoločnosti",
        description: "Názov firmy v päte e-mailu alebo v šablóne",
      },
      companyEmail: {
        label: "E-mail spoločnosti",
        description: "Kontaktný e-mail firmy v päte e-mailu alebo v šablóne",
      },
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Chýba oprávnenie",
      },
      server: {
        title: "Chyba servera",
        description: "Variant e-mailovej série sa nepodarilo zaregistrovať",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatný kľúč alebo údaje variantu",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Kľúč variantu sa v enumerácii nenašiel",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Kľúč variantu je už zaregistrovaný",
      },
      network: { title: "Chyba siete", description: "Chyba siete" },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny",
      },
    },
    success: {
      title: "Variant registrovaný",
      description: "Variant e-mailovej série sa zaregistroval",
    },
  },
  patch: {
    title: "Upraviť variant e-mailovej série",
    titleShort: "Upraviť variant",
    description: "Upraviť zaregistrovaný variant e-mailovej série",
    fields: {
      id: {
        label: "ID variantu",
        description: "ID variantu na aktualizáciu",
      },
      active: {
        label: "Aktívne",
        description: "Povoliť alebo zakázať tento variant",
      },
      weight: {
        label: "Váha",
        description: "Váha pri A/B teste (1 až 100)",
      },
      displayName: {
        label: "Zobrazovaný názov",
        description: "Zrozumiteľný názov variantu",
      },
      description: {
        label: "Opis",
        description: "Téma e-mailovej série",
      },
      senderName: {
        label: "Meno odosielateľa",
        description: "Meno odosielateľa zobrazené v e-mailovej aplikácii",
      },
      companyName: {
        label: "Názov spoločnosti",
        description: "Názov firmy v päte e-mailu alebo v šablóne",
      },
      companyEmail: {
        label: "E-mail spoločnosti",
        description: "Kontaktný e-mail firmy v päte e-mailu alebo v šablóne",
      },
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Chýba oprávnenie",
      },
      server: {
        title: "Chyba servera",
        description: "Variant e-mailovej série sa nepodarilo uložiť",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné údaje úpravy",
      },
      notFound: { title: "Nenašlo sa", description: "Variant sa nenašiel" },
      conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
      network: { title: "Chyba siete", description: "Chyba siete" },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny",
      },
    },
    success: {
      title: "Variant upravený",
      description: "Variant e-mailovej série sa uložil",
    },
  },
  widget: {
    title: "Varianty e-mailových sérií",
    refresh: "Obnoviť",
    register: "Zaregistrovať variant",
    noVariants: "Zatiaľ nie sú registrované žiadne varianty",
    activeLabel: "Aktívne",
    inactiveLabel: "Neaktívne",
    weightLabel: "Váha",
    campaignTypeLabel: "Typ kampane",
    sourceFileLabel: "Zdrojový súbor",
    toggleActivate: "Aktivovať",
    toggleDeactivate: "Deaktivovať",
    checkErrorsLabel: "Kontrola chýb:",
    unsavedChanges: "neuložené zmeny",
    saving: "Ukladá sa…",
    saveChanges: "Uložiť zmeny",
  },
};
