import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    messageType: {
      all: "Všetky typy",
      system: "Systém",
      transactional: "Transakčné",
      notification: "Oznámenie",
      marketing: "Marketing",
      leadCampaign: "Kampaň pre kontakty",
      userCommunication: "Správa používateľa",
    },
  },
  post: {
    title: "Odoslané správy",
    titleShort: "Odoslané správy",
    description: "Počet odoslaných správ v každom časovom intervale",
    fields: {
      resolution: {
        label: "Časové rozlíšenie",
        description: "Obdobie výpočtu",
      },
      range: { label: "Rozsah", description: "Časový rozsah dotazu" },
      lookback: {
        label: "Intervaly pred začiatkom rozsahu",
        description: "Počet dodatočných intervalov pred začiatkom rozsahu",
      },
      messageType: {
        label: "Typ správy",
        description: "Započítať všetky odoslané správy alebo iba vybraný typ",
      },
      result: { label: "Odoslané správy", description: "Výstupný časový rad" },
      meta: { label: "Metadáta", description: "Metadáta spustenia uzla" },
    },
    success: {
      title: "Vypočítal sa počet odoslaných správ",
      description: "Časový rad odoslaných správ načítaný",
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
      server: { title: "Chyba servera", description: "Dotaz zlyhal" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie zlyhalo",
        description: "Neplatné parametre požiadavky",
      },
      notFound: { title: "Nenašlo sa", description: "Nenašlo sa" },
      conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
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
