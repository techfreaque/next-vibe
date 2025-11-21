import { translations as _componentsTranslations } from "../../_components/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  _components: _componentsTranslations,
  title: "Benutzerregistrierung",
  description: "Benutzerregistrierungs-Endpunkt",
  tag: "Authentifizierung",
  fields: {
    firstName: {
      label: "Vorname",
      description: "Vorname des Benutzers",
      placeholder: "Vorname eingeben",
      help: "Geben Sie Ihren Vornamen ein, wie er in Ihrem Profil erscheinen soll",
    },
    lastName: {
      label: "Nachname",
      description: "Nachname des Benutzers",
      placeholder: "Nachname eingeben",
      help: "Geben Sie Ihren Nachnamen ein, wie er in Ihrem Profil erscheinen soll",
    },
    privateName: {
      label: "Privater Name",
      description: "Privater Name des Benutzers",
      placeholder: "Privaten Namen eingeben",
      help: "Geben Sie Ihren privaten Namen für interne Zwecke ein",
    },
    publicName: {
      label: "Öffentlicher Name",
      description: "Öffentlicher Name des Benutzers",
      placeholder: "Öffentlichen Namen eingeben",
      help: "Geben Sie Ihren öffentlichen Namen ein, wie er anderen angezeigt wird",
    },
    email: {
      label: "E-Mail",
      description: "E-Mail-Adresse des Benutzers",
      placeholder: "E-Mail-Adresse eingeben",
      help: "Dies wird Ihre Login-E-Mail und primäre Kontaktmethode sein",
    },
    password: {
      label: "Passwort",
      description: "Benutzerpasswort",
      placeholder: "Passwort eingeben",
      help: "Passwort muss mindestens 8 Zeichen haben",
    },
    confirmPassword: {
      label: "Passwort bestätigen",
      description: "Passwort bestätigen",
      placeholder: "Passwort erneut eingeben",
      help: "Geben Sie Ihr Passwort erneut ein, um es zu bestätigen",
      validation: {
        mismatch: "Passwörter stimmen nicht überein",
      },
    },
    phone: {
      label: "Telefonnummer",
      description: "Telefonnummer des Benutzers",
      placeholder: "Telefonnummer eingeben",
      help: "Telefonnummer für Kontowiederherstellung und Benachrichtigungen (optional)",
    },
    company: {
      label: "Firma",
      description: "Firmenname des Benutzers",
      placeholder: "Firmenname eingeben",
      help: "Ihr Unternehmen oder Organisationsname (optional)",
    },
    leadId: {
      label: "Lead-ID",
      description: "Lead-Identifikator für die Verfolgung",
      placeholder: "Lead-ID eingeben",
      help: "Interne Lead-Identifikation (optional)",
    },
    preferredContactMethod: {
      label: "Bevorzugte Kontaktmethode",
      description: "Wie Sie kontaktiert werden möchten",
      placeholder: "Kontaktmethode auswählen",
      help: "Wählen Sie, wie wir Sie erreichen sollen",
    },
    signupType: {
      label: "Anmeldungsquelle",
      description: "Woher Sie sich angemeldet haben",
      placeholder: "Anmeldungsquelle auswählen",
      help: "Wie haben Sie uns gefunden?",
    },
    acceptTerms: {
      label: "Nutzungsbedingungen akzeptieren",
      description: "Akzeptieren Sie unsere Nutzungsbedingungen",
      placeholder: "Ich akzeptiere die Nutzungsbedingungen",
      help: "Bitte lesen und akzeptieren Sie unsere Nutzungsbedingungen, um fortzufahren",
      validation: {
        required:
          "Sie müssen die Nutzungsbedingungen akzeptieren, um fortzufahren",
      },
    },
    subscribeToNewsletter: {
      label: "Newsletter abonnieren",
      description: "Erhalten Sie Updates und Neuigkeiten per E-Mail",
      placeholder: "Unseren Newsletter abonnieren",
      help: "Erhalten Sie die neuesten Updates, Tipps und exklusive Angebote in Ihrem Postfach",
    },
    imageUrl: {
      label: "Profilbild-URL",
      description: "URL für Ihr Profilbild",
      placeholder: "Bild-URL eingeben",
      help: "Optional: Geben Sie eine URL für Ihr Profilbild an",
    },
    referralCode: {
      label: "Empfehlungscode",
      description: "Optionaler Empfehlungscode von einem Freund",
      placeholder: "Empfehlungscode eingeben (optional)",
      help: "Wenn Sie einen Empfehlungscode haben, geben Sie ihn hier ein",
    },
  },
  groups: {
    personalInfo: {
      title: "Persönliche Informationen",
      description: "Geben Sie Ihre persönlichen Daten ein",
    },
    security: {
      title: "Sicherheit",
      description: "Richten Sie Ihre Kontosicherheit ein",
    },
    businessInfo: {
      title: "Geschäftsinformationen",
      description: "Geben Sie Ihre Geschäftsdaten ein",
    },
    preferences: {
      title: "Einstellungen",
      description: "Legen Sie Ihre Kommunikationseinstellungen fest",
    },
    consent: {
      title: "Nutzungsbedingungen und Einverständnis",
      description: "Überprüfen und akzeptieren Sie unsere Nutzungsbedingungen",
    },
    advanced: {
      title: "Erweiterte Optionen",
      description: "Zusätzliche Konfigurationsoptionen",
    },
  },
  errors: {
    title: "Anmeldefehler",
    conflict: {
      title: "Kontokonflikt",
      description: "Konto existiert bereits",
    },
    internal: {
      title: "Interner Fehler",
      description: "Ein interner Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler aufgetreten",
    },
  },
  emailCheck: {
    title: "E-Mail-Verfügbarkeitsprüfung",
    description:
      "Prüfen Sie, ob die E-Mail für die Registrierung verfügbar ist",
    tag: "E-Mail-Prüfung",
    fields: {
      email: {
        label: "E-Mail-Adresse",
        description: "Zu prüfende E-Mail",
        placeholder: "E-Mail-Adresse eingeben",
        validation: {
          invalid: "Ungültiges E-Mail-Format",
        },
      },
    },
    response: {
      title: "E-Mail-Prüfungsantwort",
      description: "Ergebnis der E-Mail-Verfügbarkeitsprüfung",
      available: "E-Mail verfügbar",
      message: "Verfügbarkeitsnachricht",
    },
    errors: {
      validation: {
        title: "Ungültige E-Mail",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      },
      internal: {
        title: "E-Mail-Prüfungsfehler",
        description: "Fehler bei der Überprüfung der E-Mail-Verfügbarkeit",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: {
        title: "E-Mail bereits vergeben",
        description: "Diese E-Mail ist bereits registriert",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, diese E-Mail zu prüfen",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Prüfen der E-Mail",
      },
      notFound: {
        title: "Service nicht gefunden",
        description: "E-Mail-Prüfungsservice ist nicht verfügbar",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich zum Prüfen der E-Mail",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "E-Mail-Prüfung abgeschlossen",
      description: "E-Mail-Verfügbarkeit erfolgreich geprüft",
    },
  },
  post: {
    title: "Registrierung",
    description: "Registrierungs-Endpunkt",
    form: {
      title: "Registrierungskonfiguration",
      description: "Registrierungsparameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Registrierungsantwortdaten",
      success: "Registrierung erfolgreich",
      message: "Statusnachricht",
      userId: "Benutzer-ID",
      nextSteps: "Nächste Schritte",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
      processing: "Registrierung wird erfolgreich verarbeitet",
    },
  },
  response: {
    title: "Antwort",
    description: "Registrierungsantwortdaten",
    success: "Registrierung erfolgreich",
    message: "Statusnachricht",
    user: {
      id: "Benutzer-ID",
      email: "E-Mail-Adresse",
      firstName: "Vorname",
      lastName: "Nachname",
      privateName: "Privater Name",
      publicName: "Öffentlicher Name",
      imageUrl: "Profilbild-URL",
      verificationRequired: "Verifizierung erforderlich",
    },
    verificationInfo: {
      title: "E-Mail-Verifizierung",
      description: "Details zum E-Mail-Verifizierungsprozess",
      emailSent: "E-Mail gesendet",
      expiresAt: "Verifizierung läuft ab am",
      checkSpamFolder: "Spam-Ordner prüfen",
    },
    nextSteps: "Nächste Schritte",
  },
  success: {
    title: "Anmeldung erfolgreich",
    description: "Ihr Konto wurde erfolgreich erstellt",
  },
  enums: {
    signupType: {
      meeting: "Meeting-Anmeldung",
      pricing: "Pricing-Anmeldung",
    },
  },
  admin_notification: {
    title: "Neue Benutzeranmeldung",
    subject: "Neue Benutzeranmeldung - {{privateName}}",
    preview: "Neuer Benutzer {{privateName}} hat sich angemeldet",
    message: "Ein neuer Benutzer hat sich bei {{appName}} angemeldet",
    privateName: "Privater Name",
    publicName: "Öffentlicher Name",
    email: "E-Mail",
    signup_preferences: "Anmeldepräferenzen",
    user_details: "Benutzerdetails",
    basic_information: "Grundlegende Informationen",
    signup_type: "Anmeldetyp",
    consultation_first: "Beratung zuerst",
    direct_signup: "Direkte Anmeldung",
    newsletter: "Newsletter",
    subscribed: "Abonniert",
    not_subscribed: "Nicht abonniert",
    signup_details: "Anmeldedetails",
    signup_date: "Anmeldedatum",
    user_id: "Benutzer-ID",
    recommended_next_steps: "Empfohlene nächste Schritte",
    consultation_recommendation: "Beratungsgespräch vereinbaren",
    direct_recommendation: "Benutzerprofil und Zahlungseinrichtung überprüfen",
    contact_user: "Benutzer kontaktieren",
    footer: "Dies ist eine automatische Benachrichtigung von {{appName}}",
  },
  email: {
    title: "Willkommen bei {{appName}}!",
    subject: "Willkommen bei {{appName}}!",
    previewText:
      "Willkommen bei {{appName}}! Starten Sie Ihr KI-Chat-Erlebnis.",
    welcomeMessage: "Willkommen bei {{appName}}!",
    description:
      "Sie sind jetzt bereit, mit KI zu chatten und unserem Community-Forum beizutreten.",
    ctaTitle: "Loslegen",
    ctaButton: "Zu Abonnement",
    signoff: "Mit freundlichen Grüßen,\nDas {{appName}} Team",
  },
};
