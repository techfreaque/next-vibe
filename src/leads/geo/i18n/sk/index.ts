import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  update: {
    post: {
      title: "Aktualizovať databázu krajín návštevníkov",
      titleShort: "Aktualizácia Geo IP",
      description:
        "Načíta mesačnú tabuľku krajín DB-IP do databázy a doplní krajinu kontaktom, pri ktorých chýba. Vyhľadávanie funguje lokálne bez volania API pri každej návšteve.",
      tag: "Geo IP",
      container: {
        title: "Databáza Geo IP",
        description: "Mapovanie IP adries na krajiny od DB-IP (CC BY 4.0)",
      },
      fields: {
        force: {
          label: "Vynútiť stiahnutie",
          description: "Stiahne aktuálne vydanie, aj keď už je uložené",
        },
      },
      response: {
        status: "Stav",
        version: "Vydanie",
        v4Ranges: "Rozsahy IPv4",
        v6Ranges: "Rozsahy IPv6",
        backfilled: "Kontakty s doplnenou krajinou",
        unresolved: "Kontakty stále bez krajiny",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description:
            "Ak chcete aktualizovať databázu Geo IP, prihláste sa ako správca.",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Databázu Geo IP môžu aktualizovať iba správcovia.",
        },
        server: {
          title: "Aktualizácia zlyhala",
          description:
            "Databázu Geo IP sa nepodarilo aktualizovať. Skontrolujte záznamy.",
        },
        unknown: {
          title: "Neočakávaná chyba",
          description: "Pri aktualizácii databázy Geo IP nastala chyba.",
        },
        validation: {
          title: "Neplatný vstup",
          description: "Skontrolujte polia požiadavky.",
        },
        network: {
          title: "Chyba siete",
          description: "Zdroj Geo IP nie je dostupný.",
        },
      },
      success: {
        title: "Databáza Geo IP skontrolovaná",
        description: "Tabuľka krajín je aktuálna.",
      },
    },
    task: {
      description:
        "Mesačná aktualizácia krajín DB-IP a dopĺňanie chýbajúcich krajín kontaktov každú hodinu",
    },
  },
  enums: {
    updateStatus: {
      updated: "Aktualizované",
      current: "Už aktuálne",
      unavailable: "Stiahnutie zlyhalo",
    },
  },
};
