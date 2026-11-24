import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Account",
  title: "Verifica la tua email",
  titleShort: "Verifica email",
  description:
    "Conferma il tuo indirizzo email con il link che ti abbiamo inviato. Chiamare senza un token per rivendere il link.",
  tag: "verifica-email",
  token: {
    label: "Token di verifica",
    description:
      "Dal link nella tua email di verifica. Lasciare vuoto per rivendere l'e-mail.",
    placeholder: "Token dall'e-mail",
  },
  response: {
    verified: "Verificato",
    message: "Stato",
    email: "Email",
    emailChanged: "E-mail cambiata",
  },
  widget: {
    heroTitle: "Conferma la tua email",
    heroDescription: "Basta un clic per verificare il tuo indirizzo.",
    confirmButton: "Verifica la mia email",
    confirming: "Verificare...",
    doneTitle: "Email verificata",
    doneDescription: "Hai confermato il tuo indirizzo. È tutto pronto.",
    resend: "Inviami un nuovo link",
    continue: "Continua",
    changedTitle: "E-mail cambiata",
    changedDescription:
      "Ora accedi con {{email}}. Il vecchio indirizzo non è più in uso.",
  },
  accountChallenge: {
    settings: "Impostazioni account",
    prompt:
      "Inserisci il codice di sei cifre inviato a {{email}}. È valido per 30 minuti. Puoi anche aprire il link nell’email e accedere di nuovo.",
    mail: "Conferma il tuo indirizzo con il link qui sotto. Per accedere puoi anche inserire questo codice entro 30 minuti.",
    notice:
      "Conferma {{email}} prima del prossimo accesso. Intanto puoi continuare a usare il tuo account.",
    undeliverable:
      "Non siamo riusciti a consegnare l’email a {{email}}. Se hai già effettuato l’accesso, controlla l’indirizzo nelle impostazioni. In alternativa, contatta l’assistenza.",
    invalid:
      "Il codice è errato o scaduto. Controlla l’ultima email o richiedi un nuovo codice.",
    cooldown: "Attendi cinque minuti prima di richiedere un’altra email.",
    dismiss: "Nascondi",
  },
  creditsPrompt: {
    title: "Conferma la tua email per sbloccare i crediti gratuiti",
    description:
      "Apri il link che ti abbiamo inviato. Riceverai {{credits}} crediti gratis ogni mese.",
    resend: "Invia di nuovo il link",
    sending: "Invio in corso…",
    sent: "Link inviato a {{email}}. Controlla anche la posta indesiderata.",
  },
  email: {
    subject: "Sblocca i tuoi {{credits}} crediti gratis su {{appName}}",
    title: "Conferma la tua email",
    previewText: "Con un clic confermi l’indirizzo e attivi i crediti gratis.",
    greeting: "Ciao {{name}},",
    body: "Il tuo account è pronto. Conferma questo indirizzo per ricevere {{credits}} crediti gratis ogni mese. Non serve una carta.",
    newsletter:
      "Lo stesso clic conferma anche l’iscrizione alla newsletter. Riceverai {{credits}} crediti extra gratis ogni mese finché resti iscritto.",
    button: "Conferma e sblocca i crediti",
    reminder: {
      subject: "I tuoi {{credits}} crediti gratis sono ancora in attesa",
      previewText: "Attivali con un clic sul link.",
      body: "Hai creato il tuo account {{appName}} ieri. Ti manca solo la conferma dell’indirizzo per attivare i tuoi {{credits}} crediti gratis al mese. Basta un clic.",
    },
    expiry:
      "Il link è valido per {{days}} giorni. Se non hai creato tu l’account, ignora questa email.",
    signoff: "Il team di {{appName}}",
  },
  emailTemplates: {
    name: "Verifica e-mail",
    description:
      "Inviato dopo l'iscrizione e su richiesta per verificare l'e-mail dell'account",
    category: "Account",
  },
  errors: {
    emailTaken:
      "Un altro account usa già questo indirizzo. La tua email non è stata modificata.",
    invalidToken:
      "Il link di verifica non è valido oppure è scaduto. Richiedine uno nuovo dalle impostazioni.",
    userNotFound: "Account non trovato.",
    failed: "Impossibile verificare l’email.",
    needLogin: "Accedi per ricevere di nuovo l’email di verifica.",
    validation: {
      title: "Errore di convalida",
      description: "Controlla il tuo input e riprova",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per ricevere di nuovo l’email di verifica",
    },
    server: {
      title: "Errore del server",
      description: "La verifica non è riuscita a causa di un errore del server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    network: {
      title: "Errore di rete",
      description: "Collegamento di rete fallito",
    },
    forbidden: {
      title: "Accesso non consentito",
      description: "Non hai il permesso di farlo.",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "L'account non è stato trovato",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    conflict: {
      title: "Conflitto",
      description: "Si è verificato un conflitto",
    },
  },
  success: {
    title: "Fatto",
    description: "Verifica e-mail aggiornata",
    verified: "Abbiamo verificato la tua email.",
    alreadyVerified: "La tua email è già verificata.",
    emailChanged: "Fatto. La tua email ora è {{email}}.",
    sent: "Email di verifica inviata. Controlla la posta.",
  },
};
