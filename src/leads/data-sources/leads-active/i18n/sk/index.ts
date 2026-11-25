import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Aktívne kontakty",
    titleShort: "Aktívne kontakty",
    description:
      "Počet kontaktov bez vráteného e-mailu, zrušeného odberu alebo neplatného stavu za časový interval",
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
      result: { label: "Aktívne kontakty", description: "Výstupný časový rad" },
      meta: { label: "Metadáta", description: "Metadáta spustenia uzla" },
    },
    success: {
      title: "Údaje o aktívnych kontaktoch",
      description: "Časový rad aktívnych kontaktov sa načítal",
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
