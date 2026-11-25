import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cenové ponuky",
  tags: {
    payment: "platba",
    estimate: "cenová ponuka",
    list: "zoznam",
  },
  get: {
    title: "Cenové ponuky",
    titleShort: "Cenové ponuky",
    description:
      "Vyhľadajte cenové ponuky podľa referencie, zákazníka, e-mailu, názvu alebo ID. Filtrovať môžete podľa firmy alebo stavu.",
    form: {
      title: "Filtre cenových ponúk",
      description: "Filtrovať cenové ponuky a nastaviť stránkovanie",
    },
    response: {
      totalCount: "Celkový počet",
      id: "ID cenovej ponuky",
      estimateNumber: "Číslo cenovej ponuky",
      status: "Stav",
      customerId: "ID zákazníka",
      customerName: "Meno zákazníka",
      currency: "Mena",
      total: "Spolu",
      validUntil: "Platnosť do",
      lineCount: "Počet položiek",
      createdAt: "Čas vytvorenia",
      updatedAt: "Čas aktualizácie",
    },
    errors: {
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
      notFound: { title: "Nenašlo sa", description: "Firma sa nenašla" },
      conflict: {
        title: "Konflikt",
        description: "Údaje sa medzičasom zmenili.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Úspech",
      description: "Cenové ponuky načítané",
    },
  },
  enums: {
    estimateStatus: {
      DRAFT: "Koncept",
      SENT: "Odoslaná",
      ACCEPTED: "Prijatá",
      DECLINED: "Odmietnutá",
      EXPIRED: "Platnosť skončila",
      CONVERTED: "Prevedená na faktúru",
    },
  },
  companyId: {
    label: "ID firmy",
    description: "Filtrovať podľa firmy",
    placeholder: "Zadajte ID firmy",
  },
  search: {
    label: "Hľadať doklady",
    description:
      "Vyhľadajte cenové ponuky podľa referencie, zákazníka, e-mailu, názvu alebo ID. Filtrovať môžete podľa firmy alebo stavu.",
    placeholder: "Číslo ponuky, zákazník alebo názov",
  },
  status: {
    label: "Stav",
    description: "Filtrovať podľa stavu",
    placeholder: "Všetky stavy",
  },
  customerId: {
    label: "ID zákazníka",
    description: "Filtrovať podľa zákazníka",
    placeholder: "Zadajte ID zákazníka",
  },
  page: {
    label: "Strana",
    description: "Číslo strany",
  },
  pageSize: {
    label: "Počet položiek na strane",
    description: "Počet položiek na strane",
  },
  widget: {
    filters: "Filtre",
    pageCount: "Počet strán",
    back: "Späť",
    title: "Cenové ponuky",
    newEstimate: "Nová cenová ponuka",
    loading: "Načítavajú sa cenové ponuky…",
    noEstimates: "Zatiaľ žiadne cenové ponuky.",
    noEstimatesHint: "Vytvorte prvú cenovú ponuku.",
    empty: {
      title: "Zatiaľ žiadne cenové ponuky.",
      hint: "Vytvorte prvú cenovú ponuku.",
      cta: "Nová cenová ponuka",
    },
    valid: "Platná",
    lines: "položky",
    line: "položka",
    view: "Zobraziť",
    status: {
      draft: "Koncept",
      sent: "Odoslaná",
      accepted: "Prijatá",
      declined: "Odmietnutá",
      expired: "Platnosť skončila",
      converted: "Prevedená na faktúru",
    },
  },
};
