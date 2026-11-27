import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  update: {
    post: {
      title: "Aggiorna il database dei paesi dei visitatori",
      titleShort: "Aggiornamento Geo IP",
      description:
        "Carica nel database la tabella mensile dei paesi DB-IP e completa il paese dei lead che non ce l'hanno. Ricerca offline, nessuna chiamata API per visita.",
      tag: "Geo IP",
      container: {
        title: "Database Geo IP",
        description:
          "Dati da IP a paese e ASN di DB-IP (CC BY 4.0). Elenco ASN di hosting: bad-asn-list (MIT)",
      },
      fields: {
        force: {
          label: "Forza il download",
          description: "Scarica la versione attuale anche se è già salvata",
        },
      },
      response: {
        status: "Stato",
        version: "Versione",
        asnVersion: "Versione ASN",
        v4Ranges: "Intervalli IPv4",
        v6Ranges: "Intervalli IPv6",
        backfilled: "Lead completati",
        unresolved: "Lead ancora senza paese",
      },
      errors: {
        unauthorized: {
          title: "Accesso non effettuato",
          description: "Accedi come admin per aggiornare il database geo.",
        },
        forbidden: {
          title: "Non consentito",
          description: "Solo gli admin possono aggiornare il database geo.",
        },
        server: {
          title: "Aggiornamento non riuscito",
          description:
            "Il database geo non è stato aggiornato. Controlla i log.",
        },
        unknown: {
          title: "Errore imprevisto",
          description:
            "Qualcosa è andato storto durante l'aggiornamento del database geo.",
        },
        validation: {
          title: "Dati non validi",
          description: "Controlla i campi della richiesta.",
        },
        network: {
          title: "Errore di rete",
          description: "La fonte geo non è raggiungibile.",
        },
      },
      success: {
        title: "Database geo controllato",
        description: "La tabella dei paesi è aggiornata.",
      },
    },
    task: {
      description:
        "Aggiorna ogni mese i dati DB-IP e ogni ora completa il paese mancante dei lead.",
    },
  },
  enums: {
    updateStatus: {
      updated: "Aggiornato",
      current: "Già aggiornato",
      unavailable: "Download non riuscito",
    },
  },
};
