import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Pripojenie banky",
  description:
    "Povoľte prístup na čítanie. Po návrate vyberiete firemné transakcie a skontrolujete náhľad prvého importu.",
  company: "Spoločnosť",
  ledgerAccount: "Bankový účet v hlavnej knihe",
  bankCountry: "Krajina banky",
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
  bankStep: "1 zo 4 · Vyberte banku",
  ledgerStep: "2 zo 4 · Vyberte účtovný účet",
  authorizeStep: "3 zo 4 · Povoľte prístup na čítanie",
  next: "Vybrať účtovný účet",
  back: "Späť na výber banky",
  createAccount: "Vytvoriť bankový účet v účtovej osnove",
  noLedger:
    "Spoločnosť nemá v účtovej osnove aktívny bankový účet. Ak chcete pokračovať, vytvorte ho.",
  search: "Vyhľadajte banku",
  noBanks:
    "Žiadna banka nevyhovuje výberu. Skúste iný názov, krajinu alebo typ účtu.",
  loading: "Načítava sa zoznam bánk…",
  unconfigured:
    "Požiadajte správcu servera, aby nastavil identifikátor aplikácie Enable Banking a podpisový kľúč.",
  directoryUnavailable:
    "Zoznam bánk momentálne nie je dostupný. Skúste ho načítať znova.",
  retry: "Skúsiť znova",
};
