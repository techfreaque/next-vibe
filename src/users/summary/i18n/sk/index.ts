import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Neplatná požiadavka na štatistiky",
      description: "Skontrolujte obdobie a dátumy",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Ak chcete zobraziť štatistiky, prihláste sa",
    },
    forbidden: {
      title: "Len pre správcov",
      description: "Na zobrazenie štatistík potrebujete rolu správcu",
    },
    notFound: {
      title: "Žiadne údaje",
      description: "Za zvolené obdobie nie sú žiadne údaje",
    },
    server: {
      title: "Štatistiky sa nepodarilo vypočítať",
      description: "Server nedokázal vypočítať štatistiky používateľov",
    },
    network: {
      title: "Chyba siete",
      description: "So serverom sa nepodarilo spojiť",
    },
    unknown: {
      title: "Neočakávaná chyba",
      description: "Pri výpočte štatistík sa vyskytla chyba",
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
  title: "Prehľad účtov",
  description:
    "Skontrolujte nové zákaznícke účty a overenie e-mailových adries. Prehľad nezahŕňa účty zamestnancov ani testovacie účty.",
  accounts: "Zákaznícke účty",
  signups: "Nové za 7 dní",
  verified: "Overený e-mail",
  unverified: "Neoverený e-mail",
  reviewUnverified: "Nové účty bez overenia ({{count}})",
  attention: "Na kontrolu",
  clear: "Všetky nové účty majú overenú e-mailovú adresu.",
  unavailable: "Stav overenia nie je dostupný.",
  recent: "Posledná aktivita",
  loading: "Načítava sa prehľad účtov…",
};
