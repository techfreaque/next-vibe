import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Neplatná požiadavka",
      description: "Skontrolujte požiadavku.",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Ak chcete otvoriť prehľad publikovania, prihláste sa.",
    },
    forbidden: {
      title: "Len pre správcov",
      description: "Na otvorenie prehľadu potrebujete rolu správcu.",
    },
    notFound: {
      title: "Žiadne údaje",
      description: "Táto inštancia nemá žiadne údaje o publikovaní.",
    },
    server: {
      title: "Prehľad publikovania",
      description: "Prehľad publikovania sa nepodarilo načítať.",
    },
    network: {
      title: "Chyba siete",
      description: "So serverom sa nepodarilo spojiť",
    },
    unknown: {
      title: "Prehľad publikovania",
      description: "Prehľad publikovania sa nepodarilo načítať.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Požiadavka je v rozpore s aktuálnymi údajmi",
    },
  },
  title: "Prehľad publikovania",
  description: "Verejné fórum a záznamy o odoslaní adries do IndexNow.",
  threads: "Verejné diskusie na fóre",
  savedUrls: "Adresy zaznamenané v IndexNow",
  snapshotOn: "Stav k {{date}} (UTC)",
  newestThread: "Najnovšia verejná diskusia",
  indexingSnapshot: "Stav IndexNow",
  newestOn: "Najnovšia verejná diskusia z {{date}}.",
  noThreads: "Na fóre zatiaľ nie sú verejné diskusie.",
  indexingSavedOn:
    "Posledný záznam IndexNow je z {{date}}. Stav indexovania uvádzajú vyhľadávače samostatne.",
  noIndexingSnapshot:
    "V tejto inštancii zatiaľ nie sú záznamy o odoslaní do IndexNow.",
  noIndexingRecordsYet: "Zatiaľ bez záznamov",
  loading: "Načítava sa prehľad publikovania…",
};
