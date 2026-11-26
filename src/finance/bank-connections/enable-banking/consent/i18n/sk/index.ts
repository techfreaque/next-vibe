import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Pripojenie banky",
  description:
    "Vyberte banku a účet hlavnej knihy. Banka schváli prístup na čítanie najviac na 180 dní.",
  company: "Spoločnosť",
  ledgerAccount: "Bankový účet v hlavnej knihe",
  bankCountry: "Kód krajiny banky",
  bankName: "Názov banky",
  psu: "Typ prihlásenia do banky",
  personal: "Osobný bankový účet",
  business: "Firemné",
  start: "Spustiť autorizáciu banky",
  ready: "Autorizácia je pripravená",
  continueDescription:
    "Pred pokračovaním skontrolujte vybranú banku a účet hlavnej knihy.",
  starting: "Spúšťa sa autorizácia…",
  authorize: "Pokračovať do banky",
  unavailable:
    "Autorizáciu banky sa nepodarilo spustiť. Skontrolujte výber banky a skúste znova.",
  forbidden: "K tejto spoločnosti a bankovému účtu nemáte prístup.",
  invalidAccount: "Súhlas banky nie je dostupný alebo už vypršal.",
  expiryTitle: "Platnosť súhlasu banky čoskoro vyprší",
};
