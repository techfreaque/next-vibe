import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "KI-Musikgenerator, KI-Stimmen und Transkription | {{appName}}",
    description:
      "{{musicCount}} KI-Musikmodelle, {{voiceCount}} KI-Stimmen, {{sttCount}} Transkriptionsmodelle. Suno-Alternativen mit echten Preisen pro Clip und Minute. Gratis-Credits zum Start.",
    category: "Modellvergleich",
    imageAlt:
      "{{appName}}: KI-Musik, KI-Stimmen und Transkriptionsmodelle im Vergleich",
    keywords:
      "KI-Musikgenerator, KI Musik erstellen, KI Song Generator, Suno-Alternative, Suno Alternative, AI music generator, KI Beat Generator, Lyria 3, ElevenLabs Music, Sonauto, MusicGen, KI-Stimmen, KI Stimme generieren, Text zu Sprache, Text to Speech, KI Sprachausgabe, KI-Stimmen kostenlos, ElevenLabs Alternative, Kokoro TTS, Gemini TTS, Transkription, KI-Transkription, Sprache zu Text, Whisper, Whisper Large V3, Deepgram Nova-2, GPT-4o Mini Transcribe, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modellvergleich",
    readTime: "11 Min. Lesezeit",
    title: "Songs, Beats, Stimmen, Transkripte. Ein Account.",
    subtitle:
      "{{musicCount}} Musikmodelle, {{voiceCount}} Stimmen, {{sttCount}} Transkriptionsmodelle auf einem {{appName}}-Guthaben. Der echte Preis pro Clip, pro Minute, pro Stunde. Und welches Modell zu welchem Job passt.",
  },
  intro: {
    lead: "Eine Musik-App. Eine Stimmen-App. Eine Transkriptions-App. Drei Abos, drei Logins, drei Credit-Töpfe, die verfallen. Dabei wolltest du nur einen Jingle, einen Sprechertext und ein Transkript.",
    p2: "{{appName}} betreibt {{modelCount}} Audiomodelle von {{labCount}} Labs auf einem Credit-Guthaben. Jede Zahl unten kommt live aus unserer Modellregistry: Längen, Stimmen, Stufen, echte Preise. Vier Jobs, vier Antworten:",
    songs:
      "Songs mit Gesang: Sonauto, ElevenLabs Music, Lyria 3 Pro. Clips bis {{longestMusic}} Sekunden.",
    beats:
      "Beats und Instrumentals: MusicGen Stereo, ModelsLab Music Gen, Lyria 3.",
    voiceovers:
      "Sprechertexte und Vorlesen: {{voiceCount}} Stimmen, {{cheapVoiceMinute}} bis {{priceyVoiceMinute}} pro Minute Sprache.",
    transcription:
      "Transkription: {{sttCount}} Modelle, {{cheapSttHour}} bis {{priceySttHour}} pro Stunde Audio.",
  },
  tiers: {
    mainstream: "Mainstream",
    open: "Offen",
    uncensored: "Unzensiert",
  },
  music: {
    title: "KI-Musikgenerator: alle {{musicCount}} Modelle",
    intro:
      "Günstigster Clip zuerst. Preise inklusive unserer Marge von {{markup}} %. 1 Credit = {{creditValue}}.",
    colModel: "Modell",
    colLength: "Cliplänge",
    colTier: "Stufe",
    colCredits: "Credits / Clip",
    colPrice: "Preis / Clip",
    lengthChoice: "{{lengths}} s",
    lengthFixed: "{{seconds}} s",
    footnote:
      "Ein Preis pro Clip, egal welche Länge du wählst. Fragst du eine Länge an, die das Modell nicht anbietet, rastet die Anfrage auf die nächstgelegene ein.",
    factLine: "{{credits}} Credits ({{price}}) pro Clip · {{length}}",
    picks: {
      songs: {
        title: "Songs mit Gesang",
        body: "Eine Stimme, ein Refrain, der hängen bleibt. Beschreib Genre, Stimmung, Sängerin oder Sänger und worum es im Song geht. Diese Modelle sind für Songs gebaut, die singen.",
      },
      beats: {
        title: "Beats und Instrumentals",
        body: 'Hintergrundmusik, Loops fürs Video, ein Beat zum Rappen. Ohne Gesang. Nenn Genre, Tempo und Instrumente: "Lo-Fi-Hip-Hop, 85 bpm, staubiges Klavier, Vinyl-Knistern".',
      },
      short: {
        title: "Kurze Clips, Stings, Jingles",
        body: "Intros, Benachrichtigungstöne, ein Podcast-Sting. Kurz und günstig. Zehn erzeugen, einen behalten.",
      },
    },
    suno: "Du suchst eine Suno-Alternative? Suno und Udio gibt es auf {{appName}} nicht. Stattdessen bekommst du {{musicCount}} Musikmodelle auf einem Guthaben, ab {{cheapMusicPrice}} pro Clip, ohne Zusatzabo. Der ehrliche Haken: Bei {{longestMusic}} Sekunden ist Schluss. Komplette Drei-Minuten-Tracks bleiben vorerst Sache der spezialisierten Song-Apps.",
    toolLink: "Musikgenerator öffnen",
  },
  voices: {
    title: "Text zu Sprache: {{voiceCount}} KI-Stimmen im Vergleich",
    intro:
      "Günstigste zuerst. Abgerechnet wird pro Textzeichen. Die letzte Spalte schätzt eine Minute Sprache auf etwa {{charsPerMinute}} Zeichen.",
    colVoice: "Stimme",
    colCharacter: "Klang",
    colTier: "Stufe",
    colCredits: "Credits / 1.000 Zeichen",
    colMinute: "Ca. 1 Min. Sprache",
    gender: {
      male: "Männlich",
      female: "Weiblich",
      neutral: "Neutral",
    },
    style: {
      conversational: "im Gesprächston",
      warm: "warm",
      deep: "tief",
      expressive: "ausdrucksstark",
      calm: "ruhig",
      friendly: "freundlich",
      authoritative: "souverän",
      clear: "klar",
      soft: "sanft",
      steady: "gleichmäßig",
      confident: "selbstbewusst",
      british: "britisch",
      lively: "lebendig",
      bright: "hell",
      upbeat: "beschwingt",
    },
    footnote:
      "Sätze inklusive unserer Marge von {{markup}} %. Die Minute ist eine Schätzung: Schnellsprecher und lange Wörter verschieben sie. Du zahlst für die Zeichen, die du schickst, nicht für die Sekunden, die zurückkommen.",
    factLine:
      "{{credits}} Credits / 1.000 Zeichen · ca. {{minute}} pro Minute · {{character}}",
    picks: {
      everyday: {
        title: "Vorlesen im Alltag",
        body: "Sauber, klar und so günstig, dass du sie einfach laufen lassen kannst. {{defaultVoice}} ist die Standardstimme fürs Vorlesen von Antworten.",
      },
      natural: {
        title: "Am natürlichsten: Sprechertexte zum Veröffentlichen",
        body: "Emotionale Bandbreite, menschliches Sprechtempo. Für YouTube-Kommentare, Werbespots, Hörbuchproben. Die teuersten Stimmen hier, also erst das Skript fertigstellen, dann einmal rendern.",
      },
      multilingual: {
        title: "Viele Sprachen, eine Stimme",
        body: "Gemini-Stimmen sprechen über 100 Sprachen und folgen Vortragsanweisungen: langsamer, geflüstert, aufgeregt.",
      },
      expressive: {
        title: "Figuren und Erzählungen",
        body: "Mehr Drama, mehr Bandbreite. Gebaut für Fiktion, Spielfiguren, Rollenspielszenen.",
      },
      budget: {
        title: "Am günstigsten, ohne Inhaltsfilter",
        body: "Kokoro ist ein Open-Weight-Modell mit 82M Parametern. {{uncensoredVoiceCount}} Kokoro-Stimmen liegen in unserer unzensierten Stufe: kein Inhaltsfilter auf dem, was sie vorlesen. Gleichzeitig die günstigsten Stimmen der Plattform.",
      },
    },
    languages:
      "Jede Stimme hier ist auf Englisch abgestimmt. Gemini-Stimmen beherrschen über 100 Sprachen. Die übrigen lesen andere Sprachen auch, oft mit Akzent. Teste einen Satz, bevor du ein ganzes Skript renderst.",
    toolLink: "Text zu Sprache öffnen",
  },
  stt: {
    title: "KI-Transkription: {{sttCount}} Modelle für Sprache zu Text",
    intro:
      "Günstigste pro Minute zuerst. Abgerechnet wird pro Sekunde Audio. Preise inklusive unserer Marge von {{markup}} %.",
    colModel: "Modell",
    colTier: "Stufe",
    colCredits: "Credits / Minute",
    colHour: "Preis / Stunde",
    footnote:
      "Meldet ein Anbieter seine tatsächlichen Kosten für einen Job, rechnen wir genau diese plus Marge ab. Die finale Abbuchung kann deshalb leicht von der Tabelle abweichen.",
    factLine: "{{credits}} Credits / Minute · {{hour}} pro Stunde",
    picks: {
      cheapest: {
        title: "Am günstigsten: Stunden an Audio für Centbeträge",
        body: "Open-Weight-Whisper, 99 Sprachen. Ein Abo reicht bei diesem Satz für etwa {{subSttHours}} Stunden Audio.",
      },
      accuracy: {
        title: "Genauigkeit zuerst",
        body: "Weniger falsche Wörter, bessere Spracherkennung. Für Interviews, Zitate, alles, was du veröffentlichst. {{defaultStt}} ist der Standard für die Spracheingabe.",
      },
      languages: {
        title: "Viele Sprachen",
        body: "Whisper deckt 99 Sprachen ab, Nemotron 40 Sprachvarianten. Voxtral ist das Transkriptionsmodell von Mistral, gebaut für Aufnahmen bis 10 Minuten.",
      },
      fast: {
        title: "Schnell und robust gegen Störgeräusche",
        body: "Geringe Latenz, hält auch in lauten Räumen durch. Gemacht für schnelle Sprachnotizen und Diktate.",
      },
    },
    toolLink: "Sprache zu Text öffnen",
  },
  chat: {
    title: "So funktioniert es im Chat",
    intro:
      "Keine extra App. Musik, Stimmen und Transkription stecken in jedem Chat auf {{appName}}.",
    steps: {
      song: {
        title: "Song anfragen",
        body: 'Schreib "mach mir ein 30-Sekunden-Synthwave-Intro für meinen Podcast". Die KI ruft den Musikgenerator mit dem Musikmodell deines Skills auf, {{defaultMusic}}, solange du nichts änderst. Nenn ein anderes Modell im Prompt, und es wird genommen.',
      },
      voice: {
        title: "Jede Antwort anhören",
        body: "Tipp auf das Lautsprecher-Symbol einer Antwort, und sie wird in der Stimme deines Skills vorgelesen, standardmäßig {{defaultVoice}}. Die Stimme legst du pro Skill fest.",
      },
      dictate: {
        title: "Sprechen statt tippen",
        body: "Tipp aufs Mikrofon und sprich. {{defaultStt}} schreibt deine Worte ins Eingabefeld, oder die Aufnahme geht direkt an Modelle, die Audio verstehen.",
      },
      transcribe: {
        title: "Ganze Dateien transkribieren",
        body: "Meetings, Interviews, Sprachmemos: Zieh bis zu {{sttMaxFiles}} Dateien auf die Seite für Sprache zu Text und wähl das Modell.",
      },
      call: {
        title: "Anrufmodus",
        body: "Freihändig. Du sprichst, die KI antwortet laut, du antwortest zurück. Stimme rein, Stimme raus, dasselbe Guthaben.",
      },
    },
    toolPages:
      "Volle Kontrolle? Jeder Job hat seine eigene Seite: Modell oder Stimme wählen, Cliplänge einstellen, ein langes Skript einfügen.",
  },
  pricing: {
    title: "Was KI-Musik und KI-Stimmen hier kosten",
    intro:
      "Drei Formeln, ein Guthaben. Anbieterpreis plus unsere Marge von {{markup}} %. 1 Credit = {{creditValue}}.",
    music:
      "Musik: ein fester Preis pro Clip. Von {{cheapMusicCredits}} Credits ({{cheapMusicPrice}}) bei {{cheapMusicName}} bis {{priceyMusicCredits}} Credits ({{priceyMusicPrice}}) bei {{priceyMusicName}}.",
    voice:
      "Stimme: pro Zeichen. Von {{cheapVoiceCredits}} Credits pro 1.000 Zeichen bei {{cheapVoiceName}} bis {{priceyVoiceCredits}} bei {{priceyVoiceName}}.",
    stt: "Transkription: pro Sekunde Audio. Von {{cheapSttCredits}} Credits pro Minute bei {{cheapSttName}} bis {{priceySttCredits}} bei {{priceySttName}}.",
    failed:
      "Credits werden erst abgebucht, wenn das Ergebnis da ist. Fehlgeschlagener Job, Timeout, abgelehnter Prompt: Du zahlst nichts.",
    free: "Gratis: {{guestCredits}} Credits im Monat ohne Konto, {{freeCredits}} mit kostenlosem Konto, {{maxCredits}} mit Newsletter. {{freeCredits}} Credits reichen für {{freeClips}} Clips mit {{cheapMusicName}} oder etwa {{freeVoiceMinutes}} Minuten {{cheapVoiceName}}.",
    sub: "Monatstarife: vier Größen, ab {{subCredits}} Credits für {{subPrice}}.",
    pack: "Credit-Pakete: Aufstockung für Abonnenten, {{packCredits}} Credits für {{packPrice}}. Sie verfallen nie. Karte, PayPal oder Krypto.",
    link: "Tarife und Credit-Pakete ansehen",
  },
  limits: {
    title: "Die Grenzen, ungeschönt",
    intro: "Kenn die Grenzen, bevor du einen Credit ausgibst.",
    musicLength:
      "Musikclips laufen höchstens {{longestMusic}} Sekunden. Keine Drei-Minuten-Tracks, kein Verlängern eines Clips.",
    musicFlat:
      "Ein Clip kostet bei jeder Länge gleich viel. Kurze Clips sind der günstige Weg, einen Prompt zu testen, kein Rabatt.",
    noSuno: "Kein Suno, kein Udio. Ihre APIs gibt es auf {{appName}} nicht.",
    ttsLength:
      "Text zu Sprache nimmt bis zu {{ttsMaxChars}} Zeichen pro Anfrage. Längere Skripte: aufteilen.",
    sttFiles:
      "Transkription nimmt bis zu {{sttMaxFiles}} Dateien pro Anfrage, je {{sttMaxMb}} MB.",
    noCloning:
      "Kein Stimmenklonen. Du wählst aus den Stimmen in der Tabelle. Eigene Stimmen hochladen geht nicht.",
    filters:
      "Die meisten Musik- und Stimmenmodelle laufen hinter der Moderation ihres Anbieters. Ein Prompt kann schon beim Anbieter abgelehnt werden. Diese Ablehnung kostet nichts.",
    callout:
      "Vor dem Veröffentlichen: Prüf die Bedingungen des Anbieters zur kommerziellen Nutzung generierter Musik und Stimmen. Die Regeln unterscheiden sich je Lab, und sie ändern sich.",
  },
  faq: {
    title: "FAQ",
    bestMusic: {
      q: "Welcher KI-Musikgenerator ist der beste?",
      a: "Kommt auf den Track an. Songs mit Gesang: Sonauto oder ElevenLabs Music. Ausgefeilte kurze Tracks: Lyria 3 Pro. Beats und Loops: MusicGen Stereo. Am günstigsten: {{cheapMusicName}} mit {{cheapMusicPrice}} pro Clip. Alle {{musicCount}} laufen auf einem {{appName}}-Guthaben, du wechselst also pro Clip.",
    },
    suno: {
      q: "Gibt es eine gute Suno-Alternative?",
      a: "Für kurze Songs und Beats ja: Sonauto, ElevenLabs Music und Googles Lyria 3 laufen hier auf einem Guthaben, ab {{cheapMusicPrice}} pro Clip, ohne Zusatzabo. Für komplette Drei-Minuten-Songs noch nicht: Clips enden hier nach {{longestMusic}} Sekunden.",
    },
    vocals: {
      q: "Kann KI Songs mit Gesang erstellen?",
      a: "Ja. Frag Sonauto, ElevenLabs Music oder Lyria 3 Pro nach einem Song und beschreib Thema, Stimmung und Stimme. Instrumentalmodelle wie MusicGen Stereo machen Musik ohne Gesang.",
    },
    bestVoice: {
      q: "Welcher KI-Stimmengenerator klingt am natürlichsten?",
      a: "Fürs Vorlesen im Alltag klingen OpenAI-Stimmen wie {{defaultVoice}} sauber und kosten wenig. Am ausdrucksstärksten: xAI Eve und Inworld. Für viele Sprachen: Gemini. Für den niedrigsten Preis ohne Filter: Kokoro.",
    },
    free: {
      q: "Gibt es einen KI-Stimmengenerator mit Gratis-Credits?",
      a: "Ja. {{guestCredits}} Gratis-Credits im Monat ohne Konto, {{freeCredits}} mit kostenlosem Konto, {{maxCredits}} mit Newsletter. Mit {{cheapVoiceName}} sind das etwa {{freeVoiceMinutes}} Minuten Sprache. Dieselben Credits bezahlen auch Musik und Transkription.",
    },
    transcribeCost: {
      q: "Was kostet KI-Transkription?",
      a: "Von {{cheapSttHour}} pro Stunde Audio bei {{cheapSttName}} bis {{priceySttHour}} bei {{priceySttName}}. Abgerechnet pro Sekunde. Fehlgeschlagene Jobs kosten nichts.",
    },
    cloning: {
      q: "Kann ich meine eigene Stimme klonen?",
      a: "Nein. {{appName}} bietet {{voiceCount}} fertige Stimmen. Kein Klonen, kein Hochladen der eigenen Stimme.",
    },
    uncensored: {
      q: "Gibt es unzensiertes Text zu Sprache?",
      a: "Ja. {{uncensoredVoiceCount}} Kokoro-Stimmen liegen in unserer unzensierten Stufe: ein Open-Weight-Modell ohne Inhaltsfilter auf dem, was es vorliest. Die meisten Musikmodelle und die übrigen Stimmen laufen hinter den Filtern ihrer Anbieter.",
    },
    modelsLink: "Alle Modelle mit Daten und Preisen ansehen",
    videoLink: "Auch Video? KI-Videogeneratoren im Vergleich",
    pricingLink: "Tarife und Preise ansehen",
  },
  partners: {
    body: "Du machst Musik, Podcasts oder Sprecher-Content? Das {{appName}}-Partnerprogramm zahlt dir einen wiederkehrenden Anteil an jeder Zahlung, die du vermittelst.",
    link: "Partner werden",
  },
  cta: {
    title: "Modell wählen. Play drücken.",
    subtitle:
      "Songs, Beats, Stimmen und Transkripte von einem Guthaben. Starte mit {{guestCredits}} Gratis-Credits, ganz ohne Konto.",
    music: "Musik erstellen",
    voice: "Stimme generieren",
    transcribe: "Audio transkribieren",
    models: "Alle Modelle ansehen",
  },
};
