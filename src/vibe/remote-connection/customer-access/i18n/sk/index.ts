import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  denied: {
    notPaid:
      "Vlastnú inštanciu môžeš pripojiť po zakúpení ľubovoľného balíka kreditov alebo predplatného.",
    noConnection:
      "Tento účet ešte nemá aktívne pripojenie. Najprv pripoj svoju inštanciu a potom to skús znova.",
    connectionLimit:
      "Dosiahnutý limit inštancií na účet ({{max}}). Ak chceš pridať ďalšiu, najprv jednu odpoj.",
    rateLimited:
      "Tvoja inštancia odoslala priveľa požiadaviek. Skús to znova o {{seconds}} s.",
    invalidUrl:
      "Zadaj len základnú adresu inštancie bez ďalšej cesty a parametrov, napríklad https://my-box.example.com.",
  },
};
