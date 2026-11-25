import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Export účtovného denníka do CSV",
  description:
    "Exportovať riadky zaúčtovaných zápisov vrátane storien pre jednu firmu a menu.",
  company: "Firma",
  currency: "Mena",
  currencyHint: "Zadajte trojpísmenový kód meny, napríklad EUR.",
  otherCurrency: "Iná mena",
  debitCount: "Riadky na strane Má dať",
  creditCount: "Riadky na strane Dal",
  invalidLine:
    "Uložený riadok účtovného zápisu má neplatnú stranu Má dať alebo Dal.",
  from: "Od",
  to: "Do",
  prepare: "Pripraviť CSV",
  preparing: "Pripravuje sa CSV…",
  download: "Stiahnuť CSV",
  copy: "Skopírovať CSV",
  copied: "CSV sa skopírovalo",
  copyFailed: "CSV sa nepodarilo skopírovať. Skúste to znova.",
  filename: "Názov súboru",
  rowCount: "Položky denníka",
  invalidDates:
    "Vyberte platný rozsah. Koncový dátum musí pripadať na deň začiatku alebo neskôr.",
  tooLarge:
    "Export presahuje 10 000 položiek alebo 5 MiB. Skráťte rozsah dátumov a skúste to znova.",
  ready: "CSV je pripravené",
  headerEntry: "Číslo účtovného zápisu",
  headerDate: "Dátum účtovania",
  headerPosted: "Čas zaúčtovania (UTC)",
  headerSource: "Zdroj",
  headerAccountCode: "Kód účtu",
  headerAccountName: "Názov účtu",
  headerDescription: "Opis zápisu",
  headerLineDescription: "Opis položky",
  headerCurrency: "Mena",
  headerDebit: "Má dať",
  headerCredit: "Dal",
  errors: {
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžaduje sa prihlásenie",
    },
    validation: {
      title: "Neplatné údaje",
      description: "Skontrolujte všetky polia",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nedostatočné oprávnenia",
    },
    server: {
      title: "Chyba servera",
      description: "Operácia sa nepodarila. Skúste to znova.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Nastala neočakávaná chyba",
    },
    conflict: { title: "Konflikt", description: "Konflikt údajov" },
    network: {
      title: "Chyba siete",
      description: "Server sa nepodarilo kontaktovať",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Požadovaný zdroj sa nenašiel",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
  },
  tags: { journal: "účtovný denník", export: "export" },
};
