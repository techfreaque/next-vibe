import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "KI-Chat kostenlos ohne Anmeldung, ohne E-Mail | {{appName}}",
    description:
      "KI-Chat ohne Anmeldung auf {{appName}}: monatlich Gratis-Credits, Mainstream- bis unzensierte Modelle, Inkognito-Verlauf im Browser. Was anonym hier heißt.",
    category: "Ratgeber",
    imageAlt: "Ein KI-Chat, der ohne Anmeldeformular startet",
    keywords:
      "KI Chat ohne Anmeldung, KI Chat kostenlos ohne Anmeldung, KI ohne Registrierung, anonymer KI Chat, KI Chat ohne Konto, KI Chat ohne Login, privater KI Chat, kostenloser KI Chat ohne Registrierung, unzensierter KI Chat ohne Anmeldung, Inkognito KI Chat, Chatbot ohne E-Mail, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Ratgeber",
    readTime: "6 Min. Lesezeit",
    title: "Kostenloser KI-Chat ohne Anmeldung. Ohne E-Mail. Ohne Handynummer.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, {{modelCount}} Chat-Modelle, ein Inkognito-Verlauf, der in Ihrem Browser bleibt. Und eine ehrliche Liste dessen, was anonym nicht abdeckt.",
  },
  intro: {
    lead: "Sie wollen eine einzige Frage stellen. Der Chatbot will zuerst Ihre E-Mail, ein Passwort, eine Handynummer und einen Klick auf den Cookie-Banner. Wenn Sie endlich drin sind, ist die Frage weg.",
    p2: "Auf {{appName}} öffnen Sie einen Chat und tippen los. Kein Formular. Dieser Ratgeber zeigt, was Sie ohne Konto bekommen, was anonym hier ehrlich bedeutet und wann sich ein kostenloses Konto lohnt.",
  },
  guest: {
    title: "Was Sie ohne Konto bekommen",
    intro:
      "Ohne Anmeldung heißt nicht Demo. Es ist das volle Produkt, mit Kontingent.",
    credits:
      "{{guestCredits}} Gratis-Credits jeden Monat, ohne Konto, ohne Karte. Das Kontingent erneuert sich monatlich.",
    models:
      "Alle {{modelCount}} Chat-Modelle von {{labCount}} Laboren: Mainstream, offen und unzensiert, in einer Modellauswahl.",
    uncensored:
      "Auch die {{uncensored}} unzensierten Modelle, nach einmaliger 18+-Bestätigung.",
    media:
      "Bild-, Video-, Musik- und Sprachgenerierung aus denselben Credits: {{imageModels}} Bildmodelle, {{videoModels}} Videomodelle.",
    mediaLink: "Bilder, Videos und Musik erstellen",
  },
  starters: {
    title: "Die günstigsten Modelle für den Einstieg",
    intro:
      "Die zwei günstigsten Textmodelle jeder Stufe, direkt aus unserem Modellregister. Günstig heißt nicht schwach: Mit diesen reichen {{guestCredits}} Credits am weitesten.",
    footnote:
      "Pro Nachricht meint einen Referenz-Austausch über die günstigste Route. Mit {{cheapestModel}} reichen {{guestCredits}} Gast-Credits für etwa {{guestMessages}} kurze Nachrichten. Lange Chats und lange Antworten kosten mehr.",
  },
  table: {
    model: "Modell",
    context: "Kontext",
    price: "Pro Nachricht",
    chat: "Testen",
    chatLink: "Mit {{model}} chatten",
  },
  anonymous: {
    title: "Was anonym hier bedeutet und was nicht",
    intro:
      "Privat ist nicht unsichtbar. Hier die ehrliche Fassung, ohne Versprechen, die nicht in unserer Datenschutzerklärung stehen.",
    yesTitle: "Was bei Ihnen bleibt",
    noEmail:
      "Kein Name, keine E-Mail, keine Handynummer. Für eine Antwort brauchen wir nichts davon.",
    incognito:
      "Inkognito-Chats liegen in Ihrem Browser, nicht auf unseren Servern. Browserdaten löschen, und der Verlauf ist weg.",
    trackers:
      "Keine Tracker von Drittanbietern, keine Werbepixel, kein Fingerprinting. Ein einziges Erstanbieter-Cookie sagt unserem Server, mit welchem Browser er spricht.",
    noTitle: "Wer Ihre Nachricht trotzdem sieht",
    provider:
      "Der KI-Anbieter: Jede Nachricht geht über unseren Server an das Unternehmen, das das Modell betreibt. Es sieht den Prompt, um ihn zu beantworten. So funktioniert jede gehostete KI.",
    media:
      "Generierte Medien: Bilder, Audio und Videos, die ohne Konto entstehen, speichern wir auf unseren Servern, damit Sie sie ansehen und herunterladen können. Wenn Sie sich nie registrieren, werden sie nach 4 Monaten automatisch gelöscht.",
    network:
      "Das Netzwerk: Wie jede Website sieht unser Server die Verbindung, die Ihr Browser aufbaut. Ein VPN verbirgt Ihre Adresse auch vor uns.",
    callout:
      "Ein Prompt, der Ihren Rechner nie verlassen darf? Das kann kein gehosteter Chat versprechen. Führen Sie ein Modell lokal aus oder hosten Sie selbst.",
    policyLink: "Datenschutzerklärung lesen",
  },
  steps: {
    title: "In unter einer Minute zur Antwort",
    intro: "Vier Schritte. Keiner davon ist ein Formular.",
    open: {
      title: "Inkognito-Chat öffnen",
      body: "Ein Klick von jeder Seite aus. Kein Kontobildschirm davor.",
    },
    pick: {
      title: "Modell wählen",
      body: "Günstig starten, jederzeit wechseln. Beim Modellwechsel behält der Chat seinen Verlauf.",
    },
    confirm: {
      title: "18+ bestätigen, wenn Sie unzensiert wollen",
      body: "Unzensierte Modelle fragen einmalig nach einer 18+-Bestätigung und den Nutzungsbedingungen. Mainstream- und offene Modelle brauchen nichts davon.",
    },
    ask: {
      title: "Fragen",
      body: "{{guestCredits}} Credits im Monat. Sind sie aufgebraucht, warten Sie auf den nächsten Monat oder legen ein kostenloses Konto an.",
    },
  },
  account: {
    title: "Wann sich ein kostenloses Konto lohnt",
    intro: "Nie Pflicht. Manchmal nützlich.",
    credits:
      "Bis zu {{freeCredits}} Gratis-Credits im Monat mit bestätigter E-Mail statt {{guestCredits}}.",
    sync: "Chats in Ihren privaten Ordnern, auf jedem Gerät, auf dem Sie angemeldet sind.",
    control:
      "Alle Ihre Daten als JSON exportieren oder das Konto in den Einstellungen löschen. Die Löschung entfernt Ihre personenbezogenen Daten.",
    plans:
      "Abos ab {{subPrice}} im Monat, wenn die Gratis-Credits nicht reichen.",
  },
  stricter: {
    title: "Noch mehr Privatsphäre nötig?",
    intro: "Wählen Sie das Setup, das zum Risiko passt.",
    selfHost: "{{appName}} selbst hosten: Ihr Server, Ihre Logs, Ihre Regeln",
    local: "Ein unzensiertes Modell lokal ausführen, oder online ganz ohne GPU",
    venice: "Venice AI Alternativen im Datenschutz-Vergleich",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Gibt es einen KI-Chat ohne Anmeldung?",
      a: "Ja. Auf {{appName}} öffnen Sie einen Chat und tippen, ohne Konto und ohne E-Mail. Gäste erhalten {{guestCredits}} Gratis-Credits im Monat für alle {{modelCount}} Chat-Modelle.",
    },
    anonymous: {
      q: "Ist ein KI-Chat ohne Konto wirklich anonym?",
      a: "Anonym uns gegenüber in dem Sinn, dass wir nie fragen, wer Sie sind, und der Inkognito-Verlauf in Ihrem Browser bleibt. Nicht unsichtbar: Der KI-Anbieter sieht jeden Prompt, um ihn zu beantworten, und unser Server sieht Ihre Verbindung wie jede Website.",
    },
    free: {
      q: "Ist das kostenlos?",
      a: "{{guestCredits}} Credits im Monat sind ohne Konto gratis, bis zu {{freeCredits}} mit einem bestätigten kostenlosen Konto. Wie weit sie reichen, hängt vom Modell ab: Das günstigste, {{cheapestModel}}, kostet {{cheapestPrice}} pro Nachricht.",
    },
    uncensored: {
      q: "Kann ich unzensierte KI ohne Anmeldung nutzen?",
      a: "Ja. Alle {{uncensored}} unzensierten Modelle funktionieren ohne Konto, nach einmaliger 18+-Bestätigung.",
    },
    saved: {
      q: "Werden meine Chats gespeichert?",
      a: "Inkognito-Chats werden nur in Ihrem Browser gespeichert, Sie finden sie also auf demselben Gerät wieder. Browserdaten löschen, und sie sind weg. Mit Konto können Sie Chats zusätzlich in private Ordner legen, die sich über alle Geräte synchronisieren.",
    },
    runOut: {
      q: "Was passiert, wenn meine Gratis-Credits aufgebraucht sind?",
      a: "Warten Sie auf das Kontingent des nächsten Monats, oder legen Sie ein kostenloses Konto an und bestätigen Ihre E-Mail für bis zu {{freeCredits}} Credits im Monat. Was Sie in diesem Monat als Gast schon verbraucht haben, wird darauf angerechnet.",
    },
    chatLink: "Unzensierter KI-Chat im Browser",
    chatgptLink: "Eine ChatGPT-Alternative mit unzensierten Modellen",
  },
  cta: {
    title: "Kein Formular. Einfach fragen.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, jedes Modell, standardmäßig inkognito.",
    start: "Inkognito-Chat starten",
    models: "Alle Modelle vergleichen",
  },
};
