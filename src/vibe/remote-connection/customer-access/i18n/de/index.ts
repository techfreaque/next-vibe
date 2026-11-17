import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  denied: {
    notPaid:
      "Eigene Instanz verbinden setzt ein bezahltes Konto voraus. Jedes Credit-Paket oder Abo schaltet es frei.",
    noConnection:
      "Für dieses Konto besteht keine aktive Verbindung. Verbinde zuerst deine Instanz und versuche es dann erneut.",
    connectionLimit:
      "Verbindungslimit erreicht: {{max}} Instanzen pro Konto. Trenne eine, um eine neue hinzuzufügen.",
    rateLimited:
      "Zu viele Anfragen von deiner Instanz. Neuer Versuch in {{seconds}} s.",
    invalidUrl:
      "Die Instanz-URL muss ein reiner Origin sein, etwa https://mein-server.example.com, ohne Pfad oder Query.",
  },
};
