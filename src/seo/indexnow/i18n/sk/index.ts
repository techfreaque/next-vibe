import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Odoslať adresy do IndexNow",
    titleShort: "IndexNow",
    description:
      "Oznámi vyhľadávačom Bing, Yandex, Seznam, Naver a Yep nové alebo zmenené adresy z mapy webu. Spúšťa sa iba v produkcii. Už odoslané adresy preskočí.",
    tag: "SEO",
    container: {
      title: "Odoslanie cez IndexNow",
      description: "Adresy, ktoré boli odoslané vyhľadávačom",
    },
    fields: {
      force: {
        label: "Znova odoslať všetko",
        description:
          "Znova odošle každú adresu z mapy webu vrátane tých, ktoré sa nezmenili.",
      },
      dryRun: {
        label: "Skúšobný beh",
        description: "Spočíta čakajúce adresy bez toho, aby ich odoslal.",
      },
    },
    response: {
      status: "Stav",
      host: "Hostiteľ",
      totalUrls: "Adresy v mape webu",
      pendingUrls: "Čakajúce adresy",
      submittedUrls: "Odoslané adresy",
      requests: "Odoslané požiadavky",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete odoslať adresy, prihláste sa ako správca.",
      },
      forbidden: {
        title: "Len pre správcov",
        description: "Adresy do IndexNow môžu odosielať iba správcovia.",
      },
      server: {
        title: "Odoslanie zlyhalo",
        description:
          "IndexNow odmietol požiadavku alebo sa nepodarilo vytvoriť mapu webu. Skontrolujte záznamy servera.",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Pri odosielaní adries sa vyskytla chyba.",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte zadané možnosti.",
      },
      keyUnreachable: {
        title: "Súbor s kľúčom nie je dostupný",
        description:
          "Server pri načítaní kľúča IndexNow z koreňa webu nevrátil stav 200 s očakávaným kľúčom. Žiadne adresy sa neodoslali. Skontrolujte záznamy servera.",
      },
      network: {
        title: "IndexNow nie je dostupný",
        description:
          "API IndexNow neodpovedalo. Pri ďalšom spustení sa čakajúce adresy odošlú znova.",
      },
    },
    success: {
      title: "Hotovo",
      description: "Odoslanie cez IndexNow sa skončilo.",
    },
  },
  enums: {
    status: {
      submitted: "Odoslané",
      unchanged: "Žiadne nové adresy",
      dryRun: "Skúšobný beh",
      notProduction: "Preskočené mimo produkcie",
    },
  },
  task: {
    description:
      "Každú hodinu odošle nové alebo zmenené adresy z mapy webu do IndexNow pre Bing, Yandex a partnerské vyhľadávače.",
  },
};
