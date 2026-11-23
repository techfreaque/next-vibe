import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/it";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Iscrizioni",
  titleShort: "Iscrizioni",
  description:
    "Chi si è iscritto, da quale canale o codice referral, quanti hanno verificato l'email, sono rimasti attivi e hanno pagato, e chi brucia crediti gratuiti. Ogni numero contro il periodo precedente, ogni riquadro e riga apre gli account corrispondenti.",
  category: "Utenti",
  tag: "Statistiche",
  response: {
    window: "Periodo",
    kpis: "Indicatori",
    totals: "Totali",
    signupTrend: "Iscrizioni nel tempo",
    activityTrend: "Attività nel tempo",
    funnel: "Funnel di iscrizione",
    byChannel: "Per canale",
    byRefCode: "Per codice referral",
    byPlan: "Abbonati per piano",
    byLocale: "Per lingua",
    freeBurners: "Chi brucia più crediti gratis",
  },
  widget: {
    cohortNote:
      "Risultati a oggi. I conti più vecchi hanno avuto più tempo per verificarsi, usare crediti o pagare.",
    activityToggle: "Attività dei conti",
    reviewUnverified: "Controlla le registrazioni non confermate ({{count}})",
    planLapsed: "Abbonamento scaduto",
    planPacks: "Solo pacchetti crediti",
    groups: {
      abuse: "Abusi",
      signups: "Iscrizioni del periodo",
      accounts: "Tutti gli account corrispondenti, questo periodo",
    },
    cliHint:
      "Account dietro queste iscrizioni: vibe users-list --audience=enums.audience.humans --signupFrom={{from}} --signupTo={{to}}",
    loading: "Calcolo in corso...",
    filters: "Filtri",
    openUsers: "Apri account",
    empty: "Nessuna iscrizione in questo periodo.",
    noJourney: "(non tracciato)",
    noRefCodes: "Nessuna iscrizione con codice referral in questo periodo.",
    noSubscribers: "Nessun abbonato attivo in questo gruppo.",
    noBurners: "Nessuno ha bruciato crediti gratuiti in questo periodo.",
    signedUpOn: "iscritto il {{date}}",
    banned: "Bannato",
    unverified: "Non verificato",
    kpi: {
      revenuePerPayerHint: "Ricavi nel periodo / account paganti",
      revenuePerPayer: "Ricavo per pagante",
      revenuePeriod: "Ricavi nel periodo",
      activatedRate: "Hanno usato crediti",
      signups: "Iscrizioni",
      signupsHint:
        "Iscritti nel periodo. {{total}} account corrispondenti in totale",
      verifiedRate: "Verificati",
      paidConversion: "Conversione a pagamento",
      ofSignups: "{{count}} su {{total}} iscrizioni",
      activeUsers: "Account attivi",
      activeHint:
        "Tutti gli account corrispondenti che hanno usato crediti nel periodo",
      payingUsers: "Account paganti",
      payingHint:
        "Tutti gli account corrispondenti che hanno pagato nel periodo",
      revenue: "Ricavi",
      revenueHint:
        "Tutti gli account corrispondenti, pagamenti riusciti nel periodo, USD",
      freeBurn: "Crediti gratuiti bruciati",
      freeBurnHint: "Crediti spesi da account mai paganti. Account: {{count}}",
      banned: "Iscrizioni bannate",
      bannedHint: "Iscritti nel periodo, bannati ora",
    },
    series: {
      paid: "Paganti",
      verified: "Verificati, non paganti",
      unverified: "Non verificati, non paganti",
      active: "Account attivi",
      paying: "Account paganti",
    },
    funnel: {
      paid: "Pagato",
      active: "Hanno usato crediti",
      verified: "Email verificata",
      signups: "Iscritti",
    },
    charts: {
      signups: "Iscrizioni",
      signupsHint:
        "Nuovi account per intervallo, divisi per ciò che hanno fatto dopo. Clicca una barra per gli account.",
      activity: "Attività",
      activityHint:
        "Tutti gli account corrispondenti per intervallo. La legenda mostra gli account distinti nel periodo",
      funnel: "Traguardi delle iscrizioni",
      funnelHint:
        "Iscritti del periodo che hanno raggiunto ogni traguardo. I numeri corrispondono ai riquadri sopra.",
      byChannel: "Iscrizioni per canale del primo contatto",
      byChannelHint:
        "Primo contatto di questi iscritti. Ricavi = i loro pagamenti nel periodo",
      byRefCode: "Iscrizioni per codice referral",
      byRefCodeHint:
        "Iscrizioni accreditate a un codice, altrimenti codice della prima visita. Può superare le righe del canale ref:",
      byPlan: "Account paganti per piano",
      byPlanHint:
        "Account che hanno pagato nel periodo e i loro ricavi; somma uguale ai riquadri Paganti e Ricavi",
      byLocale: "Iscrizioni per lingua",
      freeBurners: "Chi brucia più crediti gratis",
      freeBurnersHint: "Mai pagato, più crediti nel periodo",
    },
    columns: {
      ofSignups: "% iscrizioni",
      accounts: "Account",
      milestone: "Traguardo",
      active: "Hanno usato crediti",
      creditsGranted: "Concessi",
      creditsSpentTotal: "Totale",
      creditBalance: "Saldo",
      signups: "Iscriz.",
      verified: "Verificati",
      paid: "Paganti",
      conversion: "Conv.",
      revenue: "Ricavi nel periodo",
      channel: "Canale",
      refCode: "Codice",
      plan: "Piano",
      subscribers: "Account",
      revenueWindow: "Ricavi",
      locale: "Lingua",
      account: "Account",
      creditsSpent: "Nel periodo",
    },
    definitions:
      "Di default solo persone: admin e domini di test esclusi. Attivo = crediti usati dal proprio wallet o da un wallet ospite collegato. Ricavi in USD a cambi fissi. La conversione conta i pagamenti in qualsiasi momento dopo l'iscrizione.",
  },
  errors: {
    validation: {
      title: "Richiesta statistiche non valide",
      description: "Controllare la finestra e le date",
    },
    unauthorized: {
      title: "Accedi per continuare",
      description: "Accedi per visualizzare le statistiche",
    },
    forbidden: {
      title: "Admins solo",
      description:
        "Hai bisogno del ruolo di amministratore per visualizzare le statistiche",
    },
    notFound: {
      title: "Nessun dato",
      description: "Niente da segnalare per questa finestra",
    },
    server: {
      title: "Non poteva calcolare le statistiche",
      description:
        "Il server non è riuscito a calcolare le statistiche degli utenti",
    },
    network: {
      title: "Errore di rete",
      description: "Non è possibile raggiungere il server",
    },
    unknown: {
      title: "Errore inaspettato",
      description: "Qualcosa è andato storto calcolo statistiche",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    conflict: {
      title: "Conflitto",
      description: "La richiesta è in conflitto con i dati attuali",
    },
  },
  success: {
    title: "Stats pronto",
    description: "Statistiche dell'utente calcolate",
  },
};
