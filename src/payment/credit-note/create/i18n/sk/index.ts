import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
    ar: "pohľadávky",
    creditNote: "dobropis",
  },
  post: {
    title: "Vystaviť dobropis",
    titleShort: "Dobropis",
    description:
      "Vystaviť úplný alebo čiastočný dobropis k zaúčtovanej faktúre. Dobropis upraví príslušnú pohľadávku, výnosy a DPH.",
    form: {
      title: "Vystaviť dobropis",
      description: "Vystaviť dobropis k existujúcej faktúre",
    },
    response: {
      success: "Dobropis bol vystavený",
      message: "Stavová správa",
      creditNote: {
        title: "Dobropis",
        subtitle: "Údaje o vystavenom dobropise",
        id: "ID dobropisu",
        invoiceId: "ID pôvodnej faktúry",
        companyId: "ID firmy",
        currency: "Mena",
        status: "Stav",
        amount: "Suma",
        reason: "Dôvod",
        createdAt: "Čas vytvorenia",
        updatedAt: "Čas aktualizácie",
      },
    },
    errors: {
      creditLines:
        "Zadajte položky dobropisu s kladnými množstvami a sadzbami DPH z pôvodnej faktúry.",
      creditLimit:
        "Dobropis by prekročil zostávajúcu sumu bez dane, DPH alebo celkovú sumu pôvodnej faktúry.",
      originalPosting:
        "Pred vystavením dobropisu skontrolujte a zosúlaďte zaúčtovanie pôvodnej faktúry.",
      posting:
        "Skontrolujte menu firmy, otvorené účtovné obdobie a pôvodné účty použité pri zaúčtovaní.",
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa.",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte zadané údaje.",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba.",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte potrebné oprávnenie.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Faktúra sa nenašla.",
      },
      conflict: {
        title: "Dobropis nemožno vystaviť",
        description:
          "Dobropis možno vystaviť iba k faktúre v stave OPEN alebo PAID.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Úspech",
      description: "Dobropis bol vystavený a účtovný zápis zaúčtovaný.",
    },
    widget: {
      back: "Späť",
      submit: "Vystaviť dobropis",
    },
  },
  invoiceId: {
    label: "ID faktúry",
    description: "Faktúra, ku ktorej sa vystaví dobropis",
    placeholder: "Zadajte ID faktúry",
  },
  companyId: {
    label: "ID firmy",
    description: "Firma, ktorá vystavuje dobropis",
    placeholder: "Zadajte ID firmy",
  },
  reason: {
    label: "Dôvod",
    description: "Dôvod vystavenia dobropisu",
    placeholder: "Opíšte dôvod vystavenia dobropisu",
  },
  lineItems: {
    label: "Položky",
    description:
      "Nepovinné položky čiastočného dobropisu. Ak ich nevyplníte, dobropis sa vystaví na celú sumu.",
    placeholder: "",
  },
};
