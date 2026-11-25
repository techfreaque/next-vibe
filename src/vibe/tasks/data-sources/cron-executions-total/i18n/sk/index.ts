import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Celkový počet spustení naplánovaných úloh",
    titleShort: "Naplánované spustenia spolu",
    description: "Celkový počet spustení úloh cron za každý časový interval.",
    fields: {
      resolution: {
        label: "Rozlíšenie",
        description: "Časový interval výpočtu",
      },
      range: { label: "Rozsah", description: "Časový rozsah dotazu" },
      lookback: {
        label: "Rozsah histórie",
        description:
          "Počet intervalov, ktoré sa majú zahrnúť pred začiatkom rozsahu",
      },
      result: {
        label: "Spustenia celkovo",
        description: "Výstupný časový rad",
      },
      meta: { label: "Metadáta", description: "Metadáta o spustení uzla" },
    },
    success: {
      title: "Celkový počet spustení cron sa vypočítal.",
      description: "Vrátil sa časový rad všetkých spustení cron.",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Vyžaduje sa oprávnenie správcu.",
      },
      server: { title: "Chyba servera", description: "Dopyt zlyhal." },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Neplatné parametre požiadavky",
      },
      notFound: { title: "Nenašlo sa", description: "Nenašlo sa" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Chyba siete",
        description: "Sieťová požiadavka zlyhala.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv uložte zmeny.",
      },
    },
  },
};
