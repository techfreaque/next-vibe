import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    accountType: {
      ASSET: "Majetok",
      LIABILITY: "Záväzok",
      EQUITY: "Vlastné imanie",
      REVENUE: "Výnosy",
      EXPENSE: "Náklady",
    },
    accountSubtype: {
      CURRENT_ASSET: "Obežný majetok",
      FIXED_ASSET: "Dlhodobý majetok",
      BANK: "Banka",
      CASH: "Pokladničná hotovosť",
      ACCOUNTS_RECEIVABLE: "Pohľadávky",
      INVENTORY: "Zásoby",
      PREPAID: "Predplatené",
      ACCOUNTS_PAYABLE: "Záväzky voči dodávateľom",
      VAT_PAYABLE: "DPH na úhradu",
      VAT_RECEIVABLE: "Pohľadávka na DPH",
      ACCRUED_LIABILITY: "Časovo rozlíšené záväzky",
      SHORT_TERM_DEBT: "Krátkodobý dlh",
      LONG_TERM_DEBT: "Dlhodobý dlh",
      SHARE_CAPITAL: "Základné imanie",
      RETAINED_EARNINGS: "Nerozdelený zisk",
      REVENUE_SALES: "Výnosy z predaja",
      REVENUE_SERVICE: "Výnosy zo služieb",
      COGS: "Náklady na predaný tovar",
      PAYROLL: "Mzdové náklady",
      RENT: "Nájomné",
      UTILITIES: "Energie a služby",
      OPEX: "Prevádzkové náklady",
      FINANCIAL_INCOME: "Finančné výnosy",
      FINANCIAL_EXPENSE: "Finančné náklady",
      TAX_EXPENSE: "Daňové náklady",
      OTHER: "Iné",
    },
  },
  post: {
    title: "Vytvoriť účet",
    titleShort: "Nový účet",
    description: "Pridať vlastný účet do prehľadu účtov spoločnosti",
    companyId: {
      label: "ID firmy",
      description: "Spoločnosť na pridanie účtu do",
      placeholder: "Zadajte UUID spoločnosti",
    },
    code: {
      label: "Kód účtu",
      description: "Jedinečný číselný kód účtu",
      placeholder: "napr. 1150",
    },
    name: {
      label: "Názov účtu",
      description: "Opisný názov účtu",
      placeholder: "napr. Petty Cash",
    },
    type: {
      label: "Typ účtu",
      description: "Klasifikácia účtov najvyššej úrovne",
      placeholder: "Vybrať typ",
    },
    subtype: {
      label: "Podtyp účtu",
      description: "Podrobná klasifikácia v rámci typu",
      placeholder: "Vybrať podtyp",
    },
    parentId: {
      label: "Rodičovský účet",
      description: "Nepovinný materský účet pre hierarchické zoskupenie",
      placeholder: "Rodičovský účet UUID (nepovinné)",
    },
    response: {
      id: "ID účtu",
      code: "Kód",
      name: "Názov",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolovať všetky požadované polia",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nedostatočné oprávnenia",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa vytvoriť účet",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      conflict: {
        title: "Kód sa už používa",
        description: "Účet s týmto kódom už existuje",
      },
      network: {
        title: "Chyba siete",
        description: "Server sa nepodarilo kontaktovať",
      },
      notFound: { title: "Nenašlo sa", description: "Firma sa nenašla" },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Účet vytvorený",
      description: "Účet bol pridaný",
    },
    widget: {
      viewButton: "Zobraziť účet",
      addAnotherButton: "Pridať ďalšie",
      back: "Späť",
    },
  },
  title: "Vytvoriť účet",
  description: "Pridať vlastný účet",
  category: "Účtový rozvrh",
  tag: "Účet",
};
