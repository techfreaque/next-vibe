import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  denied: {
    notPaid:
      "Collegare la propria istanza ha bisogno di un account pagato. Qualsiasi pacchetto di credito o abbonamento lo sblocca.",
    noConnection:
      "Nessun collegamento attivo per questo account. Collega prima la tua istanza, poi riprova.",
    connectionLimit:
      "Limite di connessione raggiunto: istanze {{max}} per conto. Scollegare uno per aggiungere un altro.",
    rateLimited:
      "Troppe richieste dalla tua istanza. Recuperare in {{seconds}} s.",
    invalidUrl:
      "Il grado URL deve essere un'origine normale come https://my-box.example.com, senza percorso o query.",
  },
};
