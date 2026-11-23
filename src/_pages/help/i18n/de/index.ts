import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: {
    home: "Startseite",
  },
  breadcrumb: "Hilfe",
  meta: {
    contact: {
      title: "Hilfe-Center: FAQ, Ratgeber und Support | {{appName}}",
      description:
        "Antworten zu Credits, Zahlung, Datenschutz, unzensierten Modellen und API-Zugang. Ratgeber zu allen Bereichen von {{appName}}, dazu direkter Support per E-Mail und Discord.",
      category: "Support",
      imageAlt: "{{appName}} Hilfe-Center",
      keywords:
        "{{appName}} Hilfe, {{appName}} FAQ, KI-Chat Support, unzensierte KI Hilfe, KI-Credits, KI-API Zugang",
      ogTitle: "{{appName}} Hilfe-Center",
      ogDescription:
        "Credits, Zahlung, Datenschutz, unzensierte Modelle und API-Zugang: alles beantwortet.",
      twitterTitle: "{{appName}} Hilfe-Center",
      twitterDescription: "Antworten, Ratgeber und direkter Support.",
    },
  },
  pages: {
    help: {
      title: "Wie können wir helfen?",
      subtitle:
        "Erst die schnellen Antworten. Ratgeber für die Details. Ein Mensch, wenn du einen brauchst.",
      topics: {
        title: "Schnell zum Ziel",
        models: {
          title: "Modelle",
          body: "{{modelCount}} Chat-Modelle nach Preis, Kontext und Zensurgrad vergleichen.",
        },
        uncensored: {
          title: "Unzensierter KI-Chat",
          body: "Welche Modelle ohne Mainstream-Filter antworten und wie du startest.",
        },
        skills: {
          title: "Skills",
          body: "Fertige Spezialisten und Charaktere. Oder bau dir deinen eigenen.",
        },
        studio: {
          title: "Media Studio",
          body: "Bilder, Video, Musik, Sprachausgabe und Transkription an einem Ort.",
        },
        pricing: {
          title: "Tarife und Credits",
          body: "Was ein Tarif enthält, wie Credits funktionieren und wie du aufstockst.",
        },
        api: {
          title: "API-Doku",
          body: "OpenAI- und Anthropic-kompatible Endpunkte mit Beispielen zum Kopieren.",
        },
        selfHost: {
          title: "Selbst hosten",
          body: "Deine eigene Instanz aus dem Open-Source-Code betreiben.",
        },
      },
      info: {
        title: "Noch Fragen? Schreib uns",
        intro:
          "Nachricht unten abschicken oder uns direkt erreichen. Wir lesen jede Anfrage.",
        supportEmail: "Support-E-Mail",
        discord: "Discord",
        discordUrl: "Tritt unserer Discord-Community bei",
      },
      guides: {
        title: "Beliebte Ratgeber",
      },
      faq: {
        title: "Häufige Fragen",
        more: "Mehr dazu",
        questions: {
          q1: {
            question: "Was ist {{appName}}?",
            answer:
              "{{appName}} ist eine KI-Chat-Plattform mit {{modelCount}} Modellen: Mainstream, offen und unzensiert. Du wählst das Modell und damit, wie viel Filter du willst. Dazu kommen Skills, Ordner, Mediengenerierung und eine API.",
          },
          q2: {
            question: "Welche Zahlungsmethoden gibt es?",
            answer:
              "Karte, PayPal, Apple Pay und Google Pay über Stripe, dazu Krypto (Bitcoin, Ethereum, Stablecoins) über NOWPayments. Tarife gibt es ab {{subscriptionPrice}} im Monat. Credit-Pakete sind die Aufstockung für Abonnenten.",
          },
          q3: {
            question: "Wie funktioniert das Credit-System?",
            answer:
              "Jedes Modell kostet Credits pro Nutzung. Zum Start gibt es Gratis-Credits. Jeder Tarif bringt jeden Monat neue Credits: {{subscriptionPrice}} für {{subscriptionCredits}}, {{plusPrice}} für {{plusCredits}}, {{proPrice}} für {{proCredits}}, {{ultraPrice}} für {{ultraCredits}}. Mehr gebraucht? Abonnenten stocken mit Credit-Paketen auf ({{packPrice}} für {{packCredits}} Credits). Paket-Credits verfallen nie und laufen mit allen {{modelCount}} KI-Modellen.",
          },
          q4: {
            question: "Sind meine Daten privat und sicher?",
            answer:
              "Private Ordner siehst nur du. Im Inkognito-Modus landet der Chatverlauf nicht auf unseren Servern, generierte Mediendateien werden dort aber gespeichert. In den Einstellungen exportierst du alle Daten oder löschst dein Konto samt der verknüpften personenbezogenen Daten. Wir verkaufen deine Daten nie.",
          },
          q5: {
            question: "Kann ich es ohne Konto testen?",
            answer:
              "Ja. Gäste bekommen bis zu {{freeCreditsGuest}} Gratis-Credits pro Monat. Mit einem kostenlosen, bestätigten Konto werden es {{freeCreditsSignedIn}}, mit bestätigtem Newsletter-Abo {{freeCreditsMax}}.",
          },
          q6: {
            question:
              "Was unterscheidet abliterierte von unzensierten Modellen?",
            answer:
              "Abliterierte Modelle sind Mainstream-Modelle, denen das Verweigern abtrainiert wurde: Sie antworten, statt auszuweichen. Uncensored LM ist anders: Es wurde mit Büchern und Dokumenten trainiert, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit gegenläufigen politischen Ansichten.",
          },
          q7: {
            question: "Wie bekomme ich API-Zugang?",
            answer:
              "API-Schlüssel werden mit deinem ersten Kauf freigeschaltet, egal ob Tarif oder Credit-Paket. Gratis-Credits schalten die API nicht frei. Danach legst du in deinem Konto einen Schlüssel an und richtest jeden OpenAI- oder Anthropic-Client auf unsere Basis-URL.",
          },
          q8: {
            question:
              "Kann ich {{appName}} auf meinem eigenen Server betreiben?",
            answer:
              "Ja. Der Code ist Open Source. Repository klonen, bun i und vibe dev ausführen, den Rest der Einrichtung erledigst du im Browser. Deine Instanz lässt sich mit deinem {{appName}}-Konto verbinden.",
          },
        },
      },
    },
  },
};
