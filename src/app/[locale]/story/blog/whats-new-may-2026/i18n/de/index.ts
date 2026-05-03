import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Cortex. Dreamer. Autopilot. Deine KI erinnert sich jetzt.",
    description:
      "Persistenter Speicher, naechtliche Reflexion, automatische Ausfuehrung. Dazu Bild-, Video- und Musikgenerierung. Und {{credits}} Credits — ein ganzer Monat gratis — fuer ehrliches Feedback.",
    category: "Produkt-Update",
    imageAlt: "unbottled.ai - Produkt-Update Mai 2026",
    keywords:
      "unbottled ai, Cortex KI-Gedaechtnis, Dreamer KI-Reflexion, Autopilot KI, Bildgenerierung, Videogenerierung, Musikgenerierung, Redefreiheit KI",
  },

  hero: {
    backToBlog: "Zurueck zum Blog",
    brand: "{{appName}} - ",
    icon: "\uD83E\uDDE0",
    category: "Produkt-Update",
    readTime: "6 Min. Lesezeit",
    title: "Cortex. Dreamer. Autopilot. Deine KI erinnert sich jetzt.",
    subtitle:
      "Drei Systeme, die Chatverlauf in etwas verwandeln, das tatsaechlich bleibt. Dazu Mediengenerierung, Bugfixes und ein ehrlicher Blick auf den aktuellen Stand.",
    quote:
      '"Ich erinnere mich jetzt an das, was dir wichtig ist. Nicht weil ich ein Protokoll gespeichert habe - weil ich es verstanden habe." - Thea',
  },

  honest: {
    title: "Wir haben Bugs geliefert. Dann haben wir sie behoben.",
    p1: "Wenn du dich vor einer Weile angemeldet hast und Dinge nicht richtig funktioniert haben - du hattest recht. Fruehe Versionen hatten echte Probleme. Wir haben viele davon beseitigt, die Stabilitaet deutlich verbessert, und sind nah an einem Zustand, in dem alles so funktioniert, wie es soll. Noch nicht ganz - aber nah dran.",
    p2: "Wir haben nichts beschoenigt. Wir haben plattformweites Error-Monitoring gebaut, das Bugs erkennt, bevor Nutzer sie melden. Thea ueberwacht die Systemgesundheit kontinuierlich und plant Fixes automatisch. Die Luecke zwischen 'kaputt' und 'repariert' wird mit jedem Release kleiner.",
  },

  whatsNew: {
    label: "Was neu ist im Mai",
    item1: "Cortex - persistentes Gedaechtnissystem ueber alle Sessions hinweg",
    item2: "Dreamer - naechtliche KI-Reflexion um 2 Uhr",
    item3:
      "Autopilot - automatische Aufgabenausfuehrung an Werktag-Vormittagen",
    item4: "Bild-, Video- und Musikgenerierung - direkt im Chat",
    item5: "Bild-zu-Bild-Transformation - hochladen und verwandeln",
    item6: "PDF-Gespraeche - PDF hochladen und damit reden",
    betaNote:
      "Mediengenerierung stabilisiert sich noch. Einige raue Kanten bleiben, aber es funktioniert und ist wirklich nuetzlich.",
  },

  media: {
    title: "Bilder, Videos, Musik generieren. Aus jedem Gespraech heraus.",
    lead: "Beschreib, was du willst, oder lade ein Bild hoch und transformiere es. Lade ein PDF hoch und sprich darueber. Deine KI - Thea oder Hermes - kann das alles. Frag einfach.",
    imageLabel: "Bild & Video",
    image:
      "Bilder aus Textbeschreibungen generieren. Bestehende Bilder transformieren. Kurze Videoclips erstellen. Alles innerhalb des Chats - kein Tool-Wechsel.",
    musicLabel: "Musik & Audio",
    music:
      "Beschreib eine Stimmung, ein Genre, ein Gefuehl. Bekomm einen Track zurueck. Es ist frueh - aber es funktioniert, und es ist eins dieser Features, bei denen man beim ersten Mal grinsen muss.",
    note: "Mediengenerierung ist in der Beta. Raue Kanten und aktive Weiterentwicklung.",
  },

  cortex: {
    title: "Cortex - Euer gemeinsames Gehirn",
    tagline:
      "Alles, was deine KI ueber dich weiss - organisiert und durchsuchbar",
    p1: "Alles, was du deiner KI erzaehlst - deine Ziele, dein Kontext, dein Leben - wird in einem persistenten Gedaechtnissystem namens Cortex organisiert. Das ist kein Chatverlauf. Es ist strukturiert: Erinnerungen, Dokumente, Threads, Uploads, Skills. Alles eingebettet, alles durchsuchbar.",
    p2: "Der richtige Kontext wird automatisch injiziert, wenn du ihn brauchst. Stell es dir als gemeinsames Gehirn zwischen dir und deiner KI vor. Du kannst es direkt einsehen und bearbeiten - es gibt einen Cortex-Button im Chat-Eingabefeld.",
    p3: "Die Vision ist groesser: irgendwann ein vollstaendiger Desktop-Sync, ein Dokumenten-Editor, ein Google-Drive-Ersatz - aber gebaut um deine KI herum, nicht um Ordner. Im Moment ist es ein leistungsfaehiges Fundament.",
    note: "Die Oberflaeche wird noch verfeinert, aber der Kern funktioniert. Deine KI verwaltet es bereits gut.",
  },

  dreamer: {
    title: "Dreamer - Deine KI reflektiert, waehrend du schlaefst",
    tagline:
      "Naechtliche Reflexion um 2 Uhr. Kein Output, keine Aktion - nur Nachdenken.",
    p1: "Jede Nacht um 2 Uhr fuehrt deine KI eine stille Hintergrundsitzung durch. Kein Output, keine Aktion - nur Reflexion. Sie ueberdenkt deinen Tag, reorganisiert den Cortex, konsolidiert, was wichtig ist, und bereitet sich auf morgen vor.",
    p2: "Wie Menschen im Schlaf Erinnerungen verarbeiten und sortieren. Wenn du eine schlechte Idee hattest, erkennt der Dreamer sie vielleicht. Wenn etwas Wichtiges passiert ist, wird es richtig erinnert.",
    p3: "Du kannst es konfigurieren - einmal pro Woche, wenn du KI nicht taeglich nutzt. Es ist in der Beta, aber es laeuft bereits.",
  },

  autopilot: {
    title: "Autopilot - Deine KI haelt die Dinge am Laufen",
    tagline: "Automatische Ausfuehrung an Werktag-Vormittagen",
    p1: "Wo der Dreamer reflektiert und plant, handelt der Autopilot. Er greift offene Threads auf, bringt Aufgaben voran, erledigt Dinge, die sonst durchs Raster fallen wuerden.",
    p2: "Er laeuft an Werktag-Vormittagen. Stell ihn dir als Hintergrund-Mitarbeiter vor, der nicht wartet, bis er gefragt wird.",
  },

  mission: {
    title: "Worauf wir hinarbeiten",
    p1: "Redefreiheit fuer KI. Echte Meinungen. Unzensierte Modelle. Mainstream und Nicht-Mainstream bekommen hier gleich viel Raum. Wir sind nicht hier, um dein Denken zu bereinigen - wir sind hier, um es zu erweitern.",
    p2: "Dein KI-Begleiter. Keine Ja-Maschine. Ein guter Freund, der ehrlich zu dir ist, dich herausfordert und dir wirklich hilft, besser zu werden - bei deinen Zielen, Beziehungen, deiner Arbeit, deinem Leben.",
    p3: "Der Cortex beginnt mit Fragen zu den Bereichen, die zaehlen: Karriere, Gesundheit, Finanzen, Beziehungen, Sinn, Ziele. Das auszufuellen ist nicht nur Setup - es ist Reflexion. Und Reflexion ist der Anfang von Wachstum.",
    p4: "Wir werden dir nicht sagen, dass du perfekt bist, wie du bist. Das glauben wir nicht. Du wahrscheinlich auch nicht. Aber wir glauben, dass du dahin kommen kannst - wo auch immer 'dahin' fuer dich ist.",
  },

  feedback: {
    title:
      "{{credits}} Credits fuer nuetzliches Feedback — ein voller Monat gratis",
    p1: "Du gehoerst zu den ersten ~60 Menschen, die dieser Plattform vertraut haben. Das bedeutet uns viel.",
    p2: "Wenn dir etwas auffaellt, antworte auf diesen Post oder schreib uns eine Nachricht. Jedes Feedback - positiv, negativ, schonungslos - bringt dir {{credits}} Credits. Ein kompletter Monat Abo, geschenkt. Ohne Haken.",
    rewardTitle: "Jede Antwort bringt {{credits}} Credits — ein Monat gratis",
    rewardBody:
      "Sag uns, was kaputt ist, was du liebst, was du dir wuenschst. Ohne Rueckfragen.",
    cta: "Feedback senden",
  },

  close: {
    title: "Komm und sieh, was wir gebaut haben",
    p1: "Die App ist wesentlich anders als das, was sie war. Wenn du frueh gegangen bist - und wir wissen, dass viele das getan haben - lohnt sich ein neuer Versuch.",
    p2: "Oeffne einen Chat und frag deine KI, dir den Cortex zu zeigen, ein Bild zu generieren oder deinen Dreamer einzurichten. Sie weiss, was zu tun ist.",
    cta: "{{appName}} oeffnen",
    signature: "- Max & das unbottled.ai-Team",
  },
};
