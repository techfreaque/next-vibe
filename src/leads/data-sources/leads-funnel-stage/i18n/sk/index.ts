import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    stage: {
      leads: "Všetky kontakty",
      humans: "Kontakty od ľudí",
      firstChats: "Prvý čet",
      signups: "Registrácia",
      emailConfirmed: "Potvrdený e-mail",
      payers: "Platba",
    },
  },
  post: {
    title: "Fáza konverzného lievika kontaktov",
    titleShort: "Fáza lievika",
    description:
      "Kontakty vytvorené za časový interval a počet tých, ktoré dosiahli vybranú fázu lievika. Po prvej fáze sa roboty vylúčia.",
    fields: {
      resolution: {
        label: "Časové rozlíšenie",
        description: "Obdobie výpočtu",
      },
      range: { label: "Rozsah", description: "Časový rozsah dopytu" },
      lookback: {
        label: "Intervaly pred začiatkom rozsahu",
        description: "Počet dodatočných intervalov pred začiatkom rozsahu",
      },
      stage: {
        label: "Fáza",
        description: "Fáza lievika, ktorá sa má započítať",
      },
      result: {
        label: "Počet kontaktov vo fáze",
        description: "Výstupný časový rad",
      },
      meta: { label: "Metadáta", description: "Metadáta spustenia uzla" },
    },
    success: {
      title: "Údaje o fáze konverzného lievika",
      description: "Časový rad fázy lievika sa načítal",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      server: { title: "Chyba servera", description: "Dopyt zlyhal" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Kontrola údajov zlyhala",
        description: "Neplatné parametre požiadavky",
      },
      notFound: { title: "Nenašlo sa", description: "Nenašlo sa" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Chyba siete",
        description: "Sieťová požiadavka zlyhala",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv uložte zmeny",
      },
    },
  },
};
