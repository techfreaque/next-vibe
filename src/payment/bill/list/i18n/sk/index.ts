import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "platba",
    bill: "prijatá faktúra",
    ap: "záväzky",
  },
  get: {
    title: "Dodávateľské faktúry",
    titleShort: "Dodávateľské faktúry",
    description:
      "Vyhľadávajte podľa čísla faktúry, dodávateľa alebo ID. Filtrujte podľa firmy alebo stavu.",
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte nastavenie filtrov.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa a zobrazte faktúry.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nie ste členom tejto firmy.",
      },
      conflict: { title: "Konflikt", description: "Konflikt údajov" },
      server: {
        title: "Chyba servera",
        description: "Faktúry sa nepodarilo načítať.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie.",
      },
      notFound: { title: "Nenašlo sa", description: "Firma sa nenašla" },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Faktúry boli načítané",
      description: "Prijaté faktúry boli načítané.",
    },
    response: {
      totalCount: "Spolu",
      id: "ID",
      supplierName: "Dodávateľ",
      billNumber: "Číslo faktúry",
      billDate: "Dátum vystavenia",
      dueDate: "Dátum splatnosti",
      currency: "Mena",
      billTotal: "Suma",
      status: "Stav",
      createdAt: "Vytvorené",
    },
  },
  companyId: {
    label: "Firma",
    description: "Filtrovať podľa firmy",
    placeholder: "UUID firmy",
  },
  search: {
    label: "Hľadať doklady",
    description:
      "Vyhľadávajte podľa čísla faktúry, dodávateľa alebo ID. Filtrujte podľa firmy alebo stavu.",
    placeholder: "Číslo faktúry alebo dodávateľ",
  },
  status: {
    label: "Stav",
    description: "Filtrovať podľa stavu faktúry",
    placeholder: "Všetky stavy",
  },
  page: { label: "Strana", description: "Číslo strany" },
  pageSize: {
    label: "Počet na strane",
    description: "Počet výsledkov na strane",
  },
  enums: {
    billStatus: {
      DRAFT: "Koncept",
      RECEIVED: "Prijatá",
      APPROVED: "Schválená",
      PAID: "Zaplatené",
      DISPUTED: "Sporná",
    },
  },
  widget: {
    filters: "Filtre",
    pageCount: "Počet strán",
    back: "Späť",
    title: "Dodávateľské faktúry",
    newBill: "Evidovať prijatú faktúru",
    loading: "Načítavajú sa prijaté faktúry…",
    empty: {
      title: "Žiadne prijaté faktúry",
      hint: "Po doručení faktúry od dodávateľa ju zaevidujte.",
      cta: "Evidovať prijatú faktúru",
    },
    company: {
      select: "Vybrať firmu",
      selected: "Vybraná firma",
    },
    due: "Splatné",
    overdue: "Po splatnosti",
    view: "Zobraziť",
  },
};
