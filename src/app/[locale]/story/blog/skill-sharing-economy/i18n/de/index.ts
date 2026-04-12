import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Skill erstellen. Link teilen. Jeden Monat verdienen.",
    description:
      "{{appName}} Skills sind vorkonfigurierte KI-Setups, die du einmal baust und überall teilst. Der Share-Link positioniert dich in der Empfehlungskette - 10 % + 5 % Bonus von jeder Zahlung, die dieser Nutzer je macht.",
    category: "Skill Economy",
    imageAlt:
      "Eine Person erstellt KI-Skills und verdient jeden Monat wiederkehrend",
    keywords:
      "KI-Skills, passives Einkommen, Empfehlungsprogramm, {{appName}}, Custom KI, Skill Sharing, Skill Economy",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    brand: "{{appName}} - ",
    icon: "✦",
    category: "Skill Economy",
    readTime: "7 Min. Lesezeit",
    title: "Skill erstellen. Link teilen. Jeden Monat verdienen.",
    subtitle:
      "Baue ein vorkonfiguriertes KI-Setup einmal. Teile es überall. Verdiene 10 % + 5 % von jeder Zahlung der Leute, die sich dadurch anmelden, für immer.",
    quote:
      '"Ich hab einen klinischen Reasoning-Skill für Medizinstudenten gebaut. Nach drei Monaten bezahlt er mein eigenes Abo - und mehr."',
  },
  whatAreSkills: {
    title: "Was sind Skills auf {{appName}}?",
    p1: "Ein Skill ist ein vollständiges KI-Setup - System-Prompt, Companion-Persona, Modellauswahl pro Modalität, Stimme, Bildgenerierungseinstellungen - einmal konfiguriert und überall wiederverwendbar. Denk daran wie an ein Rezept: Du findest einmal die richtigen Zutaten, dann kann es jeder nutzen.",
    p2: "Die Plattform hat {{modelCount}} Modelle: Mainstream, Open Source, unzensiert. Jeder Skill konfiguriert, welches Modell für Gespräche, welches für Vision, welches für Bildgenerierung und welche Stimme verwendet wird. Die meisten Nutzer müssen diese Einstellungen nie anfassen - sie nutzen einfach den Skill. Du als Ersteller machst das einmal.",
    p3: "Skills sind kostenlos zu erstellen. Kein bezahltes Abo nötig. Kein Code. Wenn du beschreiben kannst, was eine KI tun soll, kannst du einen Skill bauen.",
    buildTitle: "Drei Wege, einen Skill zu bauen",
    build1Title: "Manuell auf der Skill-Seite",
    build1Body:
      "Volle Kontrolle. Jede Einstellung direkt konfigurieren. Gut, wenn du genau weißt, was du willst.",
    build2Title: "Mit Thea oder Hermes im Gespräch",
    build2Body:
      "Beschreibe, was du bauen willst. Brainstorme mit ihnen - lass sie den System-Prompt entwerfen, Ideen hinterfragen, iterieren. Der beste Weg für nuancierte Setups. Sie kennen die Plattform.",
    build3Title: "Für Entwickler: skill.ts generieren",
    build3Body:
      "Deinen Agenten bitten, eine Skill-Datei zu erstellen. Sie gibt ein skill.ts aus, das derselben Struktur wie die eingebauten Companion-Skills folgt - sofort einsatzbereit.",
  },
  shareLink: {
    title: "Der Share-Link-Mechanismus - wie du tatsächlich verdienst",
    p1: "Wenn du bei einem Skill auf Share & Earn klickst, bekommst du eine URL, die zwei Dinge gleichzeitig tut:",
    bullet1:
      "Zeigt Besuchern den Skill - was er kann, wie er konfiguriert ist, was für eine KI er ist",
    bullet2:
      "Positioniert dich in der Empfehlungskette - jeder, der sich über diesen Link anmeldet, wird dir zugeordnet",
    p2: "Das bedeutet in der Praxis: Wenn sich jemand über deinen Skill-Link anmeldet, wirst du gleichzeitig ihr direkter Empfehler UND ihr Skill-Ersteller. Du verdienst 10 % jeder Zahlung, die sie je machen (direkte Empfehlungsprovision) plus 5 % zusätzlich (Skill-Bonus) - 15 % total von diesem einen Nutzer, für immer.",
    p3: "Das ist keine einmalige Belohnung. Kein Anmeldebonus. Jede Abo-Verlängerung, jede Aufladung, jeder Kauf - du verdienst 15 % davon. Du hast die Arbeit einmal gemacht.",
    p4: "Die URL sieht so aus: {{appName}}/track?ref=DEIN_CODE&url=/de/skill/SKILL_ID",
  },
  examples: {
    title: "Skills, die Leute tatsächlich teilen - und damit verdienen",
    p1: "Die erfolgreichsten Skills lösen ein spezifisches, wiederkehrendes Problem, das schwer zu erklären ist, ohne es zu zeigen. Hier sind Muster, die funktionieren:",
    example1Title: "Der Spezialist-Companion",
    example1Body:
      "Ein Medizinstudent baut einen Skill, der wie ein erfahrener klinischer Kollege spricht - Fälle, Differenzialdiagnosen, Reasoning unter Druck. Geteilt in Medizin-Foren. Jede Anmeldung aus dieser Community zahlt monatlich.",
    example2Title: "Das echte Produkt des Wissensverkäufers",
    example2Body:
      "Coaches, Berater, Kursersteller - sie haben PDFs und Zoom-Calls verkauft. Ein gut gebauter Skill mit ihrem echten Fachwissen verdient wiederkehrend ohne den Overhead. Das ist besser als ein Kurs.",
    example3Title: "Die unzensierte Option",
    example3Body:
      "Skills mit unzensierten Modellen für kreatives Schreiben, Roleplay oder Debatten. Geteilt in Communities, wo KI-Zensur ein tägliches Ärgernis ist. Hohe Anmeldeintention.",
    example4Title: "Der Entwickler-Code-Reviewer",
    example4Body:
      "Kennt deinen Stack, setzt deine Team-Konventionen durch. Geteilt in Engineering-Communities voller Leute, die 100–200 $/Monat für KI ausgeben. Hochwertige Anmeldungen, die bleiben.",
  },
  theMath: {
    title: "Die Rechnung: 15 % pro Nutzer pro Monat, für immer",
    p1: "Wenn sich jemand über deinen Skill-Link anmeldet und abonniert, verdienst du 15 % jeder Zahlung - 10 % direkte Empfehlung + 5 % Skill-Bonus. Nicht nur den ersten Monat. Jeden Monat, solange sie abonniert sind.",
    tableHeaderProfile: "Nutzerprofil",
    tableHeaderSpend: "Monatliche Ausgaben",
    tableHeaderEarn: "Du verdienst/Monat (via Skill-Link)",
    row1Profile: "Gelegenheitsnutzer",
    row1Spend: "~8 $/Monat",
    row1Earn: "1,20 $/Monat",
    row2Profile: "Regulärer Abonnent",
    row2Spend: "20 $/Monat",
    row2Earn: "3,00 $/Monat",
    row3Profile: "Intensiver KI-Nutzer",
    row3Spend: "100 $/Monat",
    row3Earn: "15,00 $/Monat",
    row4Profile: "Entwickler / Power User",
    row4Spend: "200 $+/Monat",
    row4Earn: "30,00 $+/Monat",
    p2: "Der Skill ist der Haken. Der Link ist die Einnahme. Du verdienst, ob jemand deinen Skill täglich nutzt oder nach der Anmeldung wechselt - die Empfehlungszuordnung bleibt bei dir.",
    p3: "Teile einen Skill an fünf Stellen. Ein Prozentsatz klickt durch. Ein Prozentsatz meldet sich an. Diese Anmeldungen zahlen dir 15 % jeden Monat. Nächsten Monat einen weiteren Skill teilen. Deine Einnahmen wachsen ohne proportional mehr Arbeit.",
  },
  chain: {
    title: "Du verdienst auch, wenn deine Nutzer andere empfehlen",
    p1: "Wenn Nutzer, die du empfohlen hast, selbst andere empfehlen, verdienst du auch an diesen Zahlungen - bis zu 5 Ebenen tief, jede Ebene halbiert:",
    level1: "Ebene 2 (Empfehlungen deiner Empfehlungen): ~5 % jeder Zahlung",
    level2: "Ebene 3: ~2,5 % jeder Zahlung",
    level3: "Ebene 4: ~1,25 % jeder Zahlung",
    level4: "Ebene 5: ~0,625 % jeder Zahlung",
    p2: "Ehrliche Einschätzung: Die Ketten-Boni werden schnell klein. Die 15 %, die du von direkten Skill-Empfehlungen verdienst, sind das eigentliche Einkommen. Behandle Ketten-Einnahmen als Bonus - optimiere nicht für Tiefe, optimiere für qualitativ hochwertige Shares.",
  },
  howTo: {
    title: "5 Minuten bis zu deinem ersten Share-Link",
    step1Title: "Skill erstellen oder finden",
    step1Body:
      "Baue einen von Grund auf auf der Skill-Seite, frag Thea oder Hermes um Hilfe beim Entwurf, oder finde einen eingebauten Skill, der es wert ist, geteilt zu werden.",
    step2Title: "Skill öffnen",
    step2Body:
      "Klick auf den Skill, um die Detailseite zu sehen. Hier findest du den Share & Earn Button.",
    step3Title: "Share-Link generieren",
    step3Body:
      "Klick auf Share & Earn. Falls du einen Empfehlungscode hast, wähle ihn aus. Falls nicht, erstelle einen in drei Sekunden. Dein Link trägt automatisch sowohl deinen Empfehlungscode als auch die Skill-ID - beide Provisionen werden automatisch getrackt.",
    step4Title: "Dort teilen, wo es zählt",
    step4Body:
      "Poste ihn in Communities, wo Leute den Skill tatsächlich nutzen würden - Discord-Server, Subreddits, Forum-Threads, Blog-Posts, Slack-Channels. Spezifisch schlägt breit.",
    step5Title: "Dashboard beobachten",
    step5Body:
      "Dein Empfehlungs-Dashboard zeigt Besucher, Anmeldungen und Einnahmen in Echtzeit. Jede neue Anmeldung über deinen Link ist 15 % wiederkehrendes Einkommen.",
  },
  close: {
    title: "Das Skill ist das Produkt. Der Link ist die Einnahme.",
    p1: 'Die meisten denken bei Empfehlungsprogrammen an generische Anmeldelinks. Das funktioniert, aber es ist ein schwieriger Verkauf. "Hier ist ein Link zu einer KI-Plattform" geht nirgendwo hin. "Hier ist eine KI, die wie ein erfahrener Kliniker denkt" ist etwas, das Leute tatsächlich verschicken.',
    p2: "Bau, was du selbst nutzen würdest. Mach es spezifisch. Dann teil den Link. Die 15 % ergeben sich von selbst.",
    createSkill: "Erstelle deinen ersten Skill",
    referralPage: "Empfehlungscode einrichten",
  },
};
