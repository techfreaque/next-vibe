import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Nástroje AI",
  backToChat: "Späť na čet",
  description:
    "Vyber, ktoré nástroje môže AI používať. Pripnuté nástroje zostanú v kontexte každého rozhovoru.",
  openFullPage: "Otvoriť celú stránku",
  modal: {
    title: "Nástroje AI",
    description:
      "Vyber, ktoré nástroje môže AI používať. Pripnuté nástroje zostanú v kontexte každého rozhovoru.",
  },
  widget: {
    tools: "Nástroje",
    overrideForSlot: "Upraviť nástroje pre túto pozíciu",
    inheritedDefaults:
      "Platia nadradené nastavenia. Ak ich chceš zmeniť, zapni vlastné nastavenia.",
    customToolsConfigured: "Pre túto pozíciu sú nastavené vlastné nástroje.",
    deselectAll: "Zrušiť výber všetkých",
    selectAll: "Vybrať všetky",
    reset: "Obnoviť predvolené",
    pinnedToContext: "pripnuté ku kontextu",
    requiresConfirmation: "vyžaduje potvrdenie",
    loadingTools: "Načítavajú sa nástroje…",
  },
  loadError: {
    title: "Administráciu sa nepodarilo načítať",
    message:
      "Reláciu sa nepodarilo overiť. Obnovte stránku; ak to stále nefunguje, prihláste sa znova.",
    reload: "Obnoviť",
    signIn: "Prihlásiť sa",
  },
};
