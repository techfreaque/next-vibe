import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} einrichten",
    description: "Ersteinrichtung für deine selbst gehostete Instanz.",
  },
  stepOf: "Schritt {{current}} von {{total}}",
  steps: {
    admin: "Admin-Zugang",
    ai: "KI verbinden",
    extras: "Extras",
    done: "Fertig",
  },
  back: "Zurück",
  continue: "Weiter",
  getKey: "Schlüssel holen",
  secretSaved: "Gespeichert. Leer lassen, um ihn zu behalten.",
  errors: {
    saveFailed:
      "Speichern fehlgeschlagen. Sieh im Terminal mit vibe dev nach und versuch es erneut.",
  },
  restart: {
    title: "Einstellungen werden übernommen",
    body: "Deine Instanz startet neu, um sie zu laden. Die Seite lädt in ein paar Sekunden von selbst neu.",
    slow: "Dauert länger als sonst?",
    reload: "Seite neu laden",
    manualTitle: "Gespeichert",
    manualBody:
      "Starte den Server neu, damit die Einstellungen greifen. Du kannst solange weitermachen.",
    continue: "Weiter",
  },
  welcome: {
    title: "Deine Instanz läuft.",
    body: "Sichere sie mit deinem eigenen Admin-Zugang, verbinde eine KI und leg los. Dauert zwei Minuten.",
    inProgress:
      "Die Einrichtung dieser Instanz läuft bereits. Melde dich als Admin an, um sie abzuschließen.",
    failed:
      "Der eingebaute Admin-Zugang hat nicht funktioniert. Falls du ihn schon geändert hast, melde dich mit deinem eigenen an.",
    start: "Einrichtung starten",
    starting: "Wird gestartet",
    signIn: "Als Admin anmelden",
  },
  readOnly: {
    title: "Einstellungen sind hier schreibgeschützt",
    body: "Diese Instanz liest ihre Einstellungen aus der Deployment-Umgebung, daher kann diese Seite nichts speichern. Trag sie dort ein, wo du deployst, und starte neu.",
  },
  admin: {
    title: "Admin-Zugang anlegen",
    body: "Ersetzt den eingebauten Standardzugang. Damit meldest du dich hier und in der vibe CLI an.",
    email: "E-Mail",
    emailHelp: "Dein Anmeldename. Es wird nichts dorthin geschickt.",
    emailPlaceholder: "du@beispiel.de",
    password: "Passwort",
    passwordHelp:
      "Mindestens 8 Zeichen. Verschlüsselt auf diesem Rechner gespeichert.",
    confirm: "Passwort wiederholen",
    save: "Speichern und weiter",
    errors: {
      email: "Gib eine gültige E-Mail-Adresse ein.",
      passwordShort: "Mindestens 8 Zeichen.",
      passwordDefault: "Wähl ein eigenes Passwort, nicht das Standardpasswort.",
      mismatch: "Die Passwörter stimmen nicht überein.",
    },
  },
  ai: {
    title: "KI verbinden",
    body: "Leg fest, woher die Modelle kommen. Eine Option reicht. Weitere kannst du jederzeit ergänzen.",
    byo: "Oder eigene Schlüssel nutzen",
    moreProviders: "Weitere Anbieter",
    skip: "Vorerst überspringen",
    unbottled: {
      title: "Dein unbottled.ai-Konto",
      recommended: "Empfohlen",
      body: "Eine Anmeldung schaltet jedes Modell auf unbottled.ai frei: Mainstream, offen und unzensiert. Abgerechnet wird über deine unbottled.ai-Credits. Keine Anbieterschlüssel zu verwalten.",
      email: "unbottled.ai-E-Mail",
      password: "unbottled.ai-Passwort",
      advanced: "Erweitert",
      serverUrl: "Server-URL",
      serverUrlHelp:
        "Nur ändern, um eine andere next-vibe-Instanz zu verbinden.",
      failed: "Anmeldung fehlgeschlagen. Prüf E-Mail und Passwort.",
      connect: "Konto verbinden",
      connecting: "Wird verbunden",
      connected: "Verbunden mit {{url}}",
      unhealthy:
        "Verbindung gespeichert, aber der Server antwortet gerade nicht.",
      disconnect: "Trennen",
      noAccount: "Noch kein Konto?",
      createAccount: "Jetzt anlegen",
    },
    claude: {
      title: "Claude Code",
      detectedBadge: "Erkannt",
      missingBadge: "Nicht installiert",
      detected:
        "Auf diesem Rechner gefunden. Claude-Modelle laufen über dein Claude-Abo. Nichts einzutragen.",
      missing:
        "Installier die claude CLI und melde dich an, um dein Claude-Abo zu nutzen. Danach vibe dev neu starten.",
    },
  },
  fields: {
    openRouter: {
      label: "OpenRouter-API-Schlüssel",
      help: "Hunderte Modelle hinter einem Schlüssel.",
    },
    venice: {
      label: "Venice-AI-API-Schlüssel",
      help: "Private, unzensierte Modelle.",
    },
    nanoGpt: {
      label: "NanoGPT-API-Schlüssel",
      help: "Unzensierte und abliterierte Modelle. Bezahlung mit Krypto.",
    },
    openAi: {
      label: "OpenAI-API-Schlüssel",
      help: "Bildgenerierung mit den gpt-image-Modellen.",
    },
    smtpHost: {
      label: "SMTP-Server",
      help: "Dein Mailserver, etwa smtp.example.com.",
    },
    smtpPort: { label: "Port", help: "Meist 587, mit TLS 465." },
    smtpSecure: {
      label: "TLS verwenden",
      help: "Für Port 465 einschalten.",
    },
    smtpUser: {
      label: "Benutzername",
      help: "Meist deine vollständige E-Mail-Adresse.",
    },
    smtpPass: {
      label: "Passwort",
      help: "Gmail und die meisten großen Anbieter verlangen hier ein App-Passwort.",
    },
    smtpFromEmail: {
      label: "Absenderadresse",
      help: "Von dieser Adresse kommen die E-Mails.",
    },
    smtpFromName: {
      label: "Absendername",
      help: "Wird als Absender angezeigt, etwa der Name deiner Instanz.",
    },
    stripeSecret: {
      label: "Geheimer Schlüssel",
      help: "Beginnt mit sk_. Testschlüssel gehen auch.",
    },
    stripePublishable: {
      label: "Öffentlicher Schlüssel",
      help: "Beginnt mit pk_.",
    },
    stripeWebhook: {
      label: "Webhook-Signaturgeheimnis",
      help: "Beginnt mit whsec_. Bestätigt, dass Zahlungen bei deiner Instanz ankommen.",
    },
    storageType: {
      label: "Speicherort für Dateien",
      help: "Uploads, Bilder und Audio aus deinen Chats.",
      optionFilesystem: "Dieser Rechner",
      optionS3: "S3-kompatibler Speicher",
    },
    s3Endpoint: {
      label: "Endpunkt-URL",
      help: "Der S3-Endpunkt deines Anbieters, etwa https://s3.amazonaws.com.",
    },
    s3Region: {
      label: "Region",
      help: "Etwa us-east-1. Manche Anbieter nehmen auto.",
    },
    s3Bucket: { label: "Bucket", help: "Der Bucket muss schon existieren." },
    s3AccessKey: {
      label: "Access-Key-ID",
      help: "Von der Zugangsschlüssel-Seite deines Speicheranbieters.",
    },
    s3SecretKey: {
      label: "Secret Access Key",
      help: "Wird nur einmal beim Anlegen des Schlüssels angezeigt.",
    },
    s3PublicUrl: {
      label: "Öffentliche URL",
      help: "Optional. CDN oder öffentliche Bucket-Adresse für Dateilinks.",
    },
  },
  extras: {
    title: "Optionale Extras",
    body: "Zum Chatten brauchst du nichts davon. Überspring es und komm zurück, wenn du es brauchst.",
    configured: "Eingerichtet",
    finish: "Einrichtung abschließen",
    skipFinish: "Überspringen und abschließen",
    errors: {
      s3Incomplete:
        "S3-Speicher braucht Endpunkt, Region, Bucket und beide Schlüssel.",
    },
    sections: {
      email: {
        title: "E-Mail",
        body: "Registrierungsbestätigungen und Passwort-Resets über deinen SMTP-Server.",
      },
      payments: {
        title: "Zahlungen",
        body: "Credits und Abos mit Stripe verkaufen.",
      },
      storage: {
        title: "Dateispeicher",
        body: "Chat-Dateien bleiben auf diesem Rechner, außer du wählst S3.",
      },
    },
  },
  done: {
    title: "Alles bereit.",
    body: "Deine Instanz ist eingerichtet und gehört dir.",
    admin: "Admin-Zugang: {{email}}",
    aiUnbottled: "KI: dein unbottled.ai-Konto",
    aiKeys: "KI: deine eigenen Anbieterschlüssel",
    aiClaude: "KI: Claude Code auf diesem Rechner",
    aiNone:
      "Noch keine KI verbunden. Zum Chatten brauchst du einen Anbieter. Du kannst ihn jederzeit in den Admin-Einstellungen ergänzen.",
    start: "Chat starten",
    later: "Alles hier lässt sich später in den Admin-Einstellungen ändern.",
  },
};
