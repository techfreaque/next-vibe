import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Kontrola nákladov na tvorcov a odporúčania",
  description:
    "Vložte riadky oddelené tabulátormi s uvedenými hlavičkami. Náhľad overí podklady bez vytvorenia faktúr alebo platieb.",
  company: "Spoločnosť",
  history: "História nákladov",
  preview: "Skontrolovať históriu",
  failure: "Skontrolujte spoločnosť a zadané riadky.",
  forbidden: "K tejto spoločnosti nemáte prístup.",
  rows: "Skontrolované náklady",
  commitment: "Iba prisľúbený výdavok",
  missing: "Neúplné podklady",
  verifyPaid: "Pred zaúčtovaním platby overte úhradu",
  ready: "Dodávateľská faktúra je k dispozícii",
  openBill: "Skontrolovať dodávateľskú faktúru",
  net: "Bez DPH",
  creator: "Tvorca",
  referral: "Odporúčanie",
  referenceColumn: "Referencia",
  kindColumn: "Typ",
  statusColumn: "Stav kontroly",
  amountColumn: "Suma",
  actionColumn: "Ďalší krok",
};
