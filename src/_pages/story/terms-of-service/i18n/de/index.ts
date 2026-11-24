import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nutzungsbedingungen: {{appName}}",
    category: "Rechtliches",
    description:
      "Lesen Sie die Nutzungsbedingungen für die Verwendung von {{appName}}",
    imageAlt: "Nutzungsbedingungen",
    keywords:
      "Nutzungsbedingungen, Allgemeine Geschäftsbedingungen, Benutzervereinbarung, {{appName}} Bedingungen",
    ogTitle: "Nutzungsbedingungen: {{appName}}",
    ogDescription:
      "Lesen Sie die Nutzungsbedingungen für die Verwendung von {{appName}}",
    twitterTitle: "Nutzungsbedingungen: {{appName}}",
    twitterDescription:
      "Lesen Sie die Nutzungsbedingungen für die Verwendung von {{appName}}",
  },
  printAriaLabel: "Nutzungsbedingungen drucken",
  onThisPage: "Auf dieser Seite",
  printButton: "Drucken",
  title: "Nutzungsbedingungen",
  lastUpdated: "Zuletzt aktualisiert: 24. November 2026",
  bindingVersionNotice:
    "Diese Übersetzung dient nur der Information. Rechtsverbindlich ist die deutsche Fassung dieses Dokuments.",
  introduction:
    "Willkommen bei {{appName}}. Durch die Nutzung unserer KI-Chat-Plattform stimmen Sie diesen Nutzungsbedingungen zu. Bitte lesen Sie diese sorgfältig durch. Anbieter von {{appName}} ist {{operator}}, Deutschland.",
  sections: {
    agreement: {
      title: "Zustimmung zu den Bedingungen",
      content:
        "Durch den Zugriff auf oder die Nutzung von {{appName}} stimmen Sie zu, an diese Nutzungsbedingungen und alle geltenden Gesetze gebunden zu sein.",
    },
    description: {
      title: "Dienst-Beschreibung",
      content:
        "{{appName}} bietet Zugang zu KI-Chat-Modellen verschiedener Anbieter. Wir bieten kostenlose und kostenpflichtige Tarife mit unterschiedlichen Funktionen an.",
    },
    subscriptions: {
      title: "Abonnements und Abrechnung",
      plans: {
        title: "Abonnement-Pläne",
        content:
          "Wir bieten einen Abonnement-Plan und Kredit-Pakete an. Kredit-Pakete laufen nie ab, auch nicht nach dem Ende des Abonnements.",
      },
      billing: {
        title: "Abrechnung",
        content:
          "Abonnements werden monatlich oder jährlich abgerechnet; Jahrespläne erhalten ihre monatlichen Credits jeden Monat. Kredit-Pakete sind einmalige Aufstockungen für aktive Abonnenten und laufen nie ab. Wir akzeptieren Karten, PayPal, Apple Pay und Google Pay über Stripe sowie Kryptowährung über NowPayments.",
      },
      cancellation: {
        title: "Kündigung",
        content:
          "Sie können Ihr Abonnement jederzeit kündigen. Kündigungen werden am Ende des aktuellen Abrechnungszeitraums wirksam. Kredit-Pakete sind nicht erstattungsfähig, soweit nicht das gesetzliche Widerrufsrecht greift (siehe Abschnitt Widerrufsrecht für Verbraucher).",
      },
    },
    withdrawal: {
      title: "Widerrufsrecht für Verbraucher",
      intro:
        "Sind Sie Verbraucher (§ 13 BGB), steht Ihnen bei Verträgen über Kredit-Pakete und Abonnements, die Sie mit uns über {{appName}} schließen, ein gesetzliches Widerrufsrecht nach Maßgabe der folgenden Widerrufsbelehrung zu.",
      notice: {
        title: "Widerrufsbelehrung",
        right:
          "Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.",
        exercise:
          "Um Ihr Widerrufsrecht auszuüben, müssen Sie uns ({{operator}}, {{address}}, E-Mail: {{email}}) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist. Eine formlose E-Mail genügt.",
        deadline:
          "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.",
      },
      effects: {
        title: "Folgen des Widerrufs",
        refund:
          "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.",
        compensation:
          "Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen sollen, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.",
        end: "Ende der Widerrufsbelehrung",
      },
      expiry: {
        title: "Hinweise zum vorzeitigen Erlöschen des Widerrufsrechts",
        digitalContent:
          "Bei einem Vertrag über die Bereitstellung von nicht auf einem körperlichen Datenträger befindlichen digitalen Inhalten erlischt das Widerrufsrecht nach § 356 Abs. 5 BGB, wenn wir mit der Vertragserfüllung begonnen haben, nachdem Sie ausdrücklich zugestimmt haben, dass wir mit der Vertragserfüllung vor Ablauf der Widerrufsfrist beginnen, Sie Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Vertragserfüllung Ihr Widerrufsrecht verlieren, und wir Ihnen eine Bestätigung des Vertrags zur Verfügung gestellt haben.",
        services:
          "Bei einem Vertrag über die Erbringung von Dienstleistungen erlischt das Widerrufsrecht nach § 356 Abs. 4 BGB, wenn wir die Dienstleistung vollständig erbracht haben und mit der Ausführung erst begonnen haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch uns erlischt.",
        credits:
          "Soweit Ihr Widerrufsrecht nicht nach diesen Vorschriften erloschen ist, gilt für Kredite Folgendes: Den auf nicht verbrauchte Kredite aus dem widerrufenen Vertrag entfallenden Preis erstatten wir vollständig; diese Kredite werden mit dem Widerruf aus Ihrem Konto ausgebucht. Für bereits verbrauchte Kredite berechnen wir, soweit gesetzlich zulässig, einen anteiligen Betrag nach dem Verhältnis der verbrauchten zu den mit dem Vertrag erworbenen Krediten. Mit dem Widerruf eines Abonnements endet auch das Abonnement.",
      },
      form: {
        title: "Muster-Widerrufsformular",
        intro:
          "(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)",
        recipient: "An {{operator}}, {{address}}, E-Mail: {{email}}",
        statement:
          "Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Bereitstellung der folgenden digitalen Inhalte (*)/die Erbringung der folgenden Dienstleistung (*):",
        orderedOn: "Bestellt am (*)/erhalten am (*)",
        name: "Name des/der Verbraucher(s)",
        address: "Anschrift des/der Verbraucher(s)",
        signature:
          "Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)",
        date: "Datum",
        footnote: "(*) Unzutreffendes streichen.",
        accountHint:
          "Damit wir Ihren Kauf schnell zuordnen können, nennen Sie bitte die E-Mail-Adresse Ihres Kontos. Das ist keine Voraussetzung für einen wirksamen Widerruf.",
      },
    },
    userAccounts: {
      title: "Benutzerkonten",
      creation: {
        title: "Kontoerstellung",
        content:
          "Sie müssen bei der Kontoerstellung genaue Informationen angeben. Sie sind für die Sicherheit Ihrer Kontodaten verantwortlich.",
      },
      responsibilities: {
        title: "Benutzerverantwortlichkeiten",
        content:
          "Sie sind für alle Aktivitäten unter Ihrem Konto verantwortlich. Sie dürfen Ihr Konto nicht mit anderen teilen.",
      },
    },
    userContent: {
      title: "Benutzerinhalte",
      ownership: {
        title: "Inhaltseigentümerschaft",
        content:
          "Sie behalten alle Rechte an Ihren Gesprächen und Daten. Ihre privaten Ordner sind nur für Sie zugänglich.",
      },
      guidelines: {
        title: "Inhaltsrichtlinien",
        intro:
          "Obwohl wir unzensierten KI-Zugang bieten, dürfen Sie den Dienst nicht nutzen, um:",
        items: {
          item1: "Illegale Aktivitäten durchzuführen",
          item2: "Andere zu belästigen, zu bedrohen oder zu schaden",
          item3: "Rechte an geistigem Eigentum zu verletzen",
          item4: "Die Plattform zu hacken oder zu kompromittieren",
        },
      },
    },
    aiOutput: {
      title: "KI-generierte Ausgaben",
      ownership:
        "Wir beanspruchen keine Rechte an Texten, Bildern, Videos, Audio oder sonstigen Ausgaben, die Sie mit {{appName}} erzeugen. Soweit an diesen Ausgaben Rechte bestehen, stehen sie Ihnen zu.",
      licenses:
        "Ausgaben werden von Modellen Dritter erzeugt. Zusätzlich zu diesen Bedingungen gelten die Lizenz des jeweiligen Modells und die Bedingungen seines Anbieters. Einige Modelle erlauben nur eine nichtkommerzielle Nutzung oder schränken bestimmte Nutzungen ein. Diese Modelle kennzeichnen wir in der App.",
      copyright:
        "KI-Ausgaben sind möglicherweise nicht urheberrechtlich geschützt und können bestehenden Werken oder Ausgaben anderer Nutzer ähneln. Sie sind dafür verantwortlich, vor der Verwendung einer Ausgabe die Lizenz des genutzten Modells zu prüfen, insbesondere bei kommerzieller Nutzung.",
    },
    intellectualProperty: {
      title: "Geistiges Eigentum",
      content:
        "Die {{appName}}-Plattform, einschließlich ihres Designs, ihrer Funktionen und ihres Codes, ist durch Gesetze zum Schutz des geistigen Eigentums geschützt.",
    },
    limitation: {
      title: "Haftungsbeschränkung",
      content:
        "{{appName}} haftet nicht für indirekte, zufällige, besondere oder Folgeschäden, die durch Ihre Nutzung des Dienstes entstehen.",
    },
    indemnification: {
      title: "Schadloshaltung",
      content:
        "Sie stimmen zu, {{appName}} von Ansprüchen, Schäden oder Ausgaben freizustellen, die aus Ihrer Nutzung des Dienstes entstehen.",
    },
    termination: {
      title: "Kündigung",
      content:
        "Wir behalten uns das Recht vor, Ihr Konto bei Verstößen gegen diese Bedingungen zu kündigen oder zu sperren.",
    },
    changes: {
      title: "Änderungen der Bedingungen",
      content:
        "Wir können diese Nutzungsbedingungen von Zeit zu Zeit aktualisieren. Die weitere Nutzung des Dienstes nach Änderungen gilt als Akzeptanz der neuen Bedingungen.",
    },
    governingLaw: {
      title: "Anwendbares Recht",
      content:
        "Es gilt das Recht der Bundesrepublik Deutschland. Sind Sie Verbraucher, gilt diese Rechtswahl nur, soweit Ihnen dadurch nicht der Schutz zwingender Bestimmungen des Rechts des Staates entzogen wird, in dem Sie Ihren gewöhnlichen Aufenthalt haben. Sind Sie Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand für alle Streitigkeiten aus diesen Nutzungsbedingungen der Sitz des Anbieters in Simbach am Inn, Deutschland. Im Übrigen gelten die gesetzlichen Gerichtsstände.",
    },
  },
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
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
        description: "Interner Serverfehler",
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
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
