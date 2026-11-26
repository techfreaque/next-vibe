import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Passività per crediti dei clienti",
  description:
    "Controlli le passività contabilizzate per i pacchetti di crediti pagati e associati a questa azienda.",
  tag: "Passività per crediti",
  company: "Azienda",
  choose: "Selezioni l’azienda per vedere le passività contabilizzate.",
  empty: "Nessuna registrazione collegata a crediti pagati",
  account: "Conto contabile",
  currency: "Valuta",
  amount: "Saldo contabile",
  asOf: "Situazione al",
  reportDay: "Fino al {{date}} (UTC)",
  scope:
    "Sono inclusi vendite, rimborsi, ricavi rilevati e storni collegati. I crediti nei portafogli e gli importi senza associazione aziendale verificata sono esclusi.",
  ledgerScope:
    "Apra un conto per vedere il mastro completo, comprese le registrazioni fuori dal report.",
  supplierLink: "Controllare gli anticipi ai fornitori",
  errors: {
    validation: {
      title: "Verificare l’azienda selezionata",
      description: "Selezioni un’azienda attiva a cui ha accesso.",
    },
    forbidden: {
      title: "Accesso all’azienda richiesto",
      description: "Non ha accesso a questa azienda.",
    },
    server: {
      title: "Impossibile caricare le passività per crediti",
      description: "Provi a ricaricare il report.",
    },
  },
};
