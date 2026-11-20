import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Strumenti AI",
  tags: {
    skills: "competenze",
  },
  enums: {
    platform: {
      characterAi: "Character.AI",
      talkie: "Talkie",
    },
    visibility: {
      private: "Privato",
      unlisted: "Non elencato",
      public: "Pubblico",
    },
  },
  post: {
    title: "Importa il carattere dal link",
    titleShort: "Importazione dal link",
    description:
      "Importa un personaggio da un carattere pubblico. AI (character.ai, c.ai) o Talkie (talkie-ai.com) link. Copie nome, avatar, saluto, descrizione, definizione e tag in un nuovo personaggio che possiedi, accredita il creatore originale e link alla fonte. Importare lo stesso link restituisce di nuovo il carattere esistente.",
    dynamicTitle: "Importazione: {{url}}",
    intro:
      "Incolla un link di carattere pubblico. Copiamo ciò che la pagina mostra pubblicamente e accreditiamo il creatore originale.",
    supported: "Funziona con il carattere. AI e Talkie.",
    url: {
      label: "Link del carattere",
      description: "Collegamento pubblico alla pagina dei caratteri",
      placeholder: "https://character.ai/character/...",
      validation: {
        invalid: "Incolla un link completo a partire da https://",
      },
    },
    visibility: {
      label: "Visibilità",
      description:
        "Privato: solo tu. Senza lista: fuori dalla lista pubblica. Pubblico: elencato per tutti.",
    },
    response: {
      id: { content: "Carattere ID" },
      name: { content: "Nome" },
      platform: { content: "Fonte" },
      creatorName: { content: "Creatore originale" },
      sourceUrl: { content: "Link sorgente" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Già importato" },
      importedFields: { content: "Importato" },
    },
    fields: {
      name: "nome",
      avatar: "avatar",
      greeting: "saluto",
      description: "descrizione",
      definition: "definizione",
      tags: "tags",
    },
    result: {
      imported: "{{name}} è pronto.",
      alreadyImported: "Hai già importato {{name}}. Aprite la vostra copia.",
      credit: "Originariamente {{creator}} su {{platform}}",
      creditUnknown: "Importato da {{platform}}",
      fieldsList: "Importato: {{fields}}",
      openSkill: "Carattere aperto",
      importAnother: "Importa un altro",
    },
    errors: {
      validation: {
        title: "Link non valido",
        description: "Incolla un link completo di carattere pubblico.",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server.",
      },
      unauthorized: {
        title: "Accedi per continuare",
        description: "Accedi per importare i caratteri.",
      },
      forbidden: {
        title: "Operazione non consentita",
        description: "Il tuo account non può importare caratteri.",
      },
      notFound: {
        title: "Carattere non trovato",
        description:
          "La pagina non mostra dati di carattere pubblico. Può essere privato, cancellato o bisogno di un login.",
      },
      server: {
        title: "Importazione fallita",
        description: "Qualcosa si e' rotto durante l'importazione. Riprova.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore inaspettato.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai dei cambiamenti insoddisfatti.",
      },
      conflict: {
        title: "Già importato",
        description: "Hai gia' importato questo personaggio.",
      },
      unsupported:
        "Collegamento non supportato. Incolla un carattere. AI (character.ai, c.ai) o il link del carattere di Talkie (talkie-ai.com).",
      blocked:
        "{{platform}} ha bloccato la richiesta. Riprova in pochi minuti o crea il personaggio a mano.",
      noPublicData:
        "{{platform}} non mostra dati pubblici per questo carattere. Può essere privato, cancellato o bisogno di un login.",
      rateLimited:
        "Troppe importazioni. Attendere i secondi {{seconds}} e riprovare.",
      notConfigured:
        "Le pagine {{platform}} hanno bisogno della pagina fetcher, che non è configurata in questo server.",
    },
    success: {
      title: "Carattere importato",
      description: "La tua copia è pronta a chattare.",
    },
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      label: "Importazione",
      loadingText: "Importazione...",
    },
  },
};
