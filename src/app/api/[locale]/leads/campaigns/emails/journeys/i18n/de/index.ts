import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailJourneys: {
    components: {
      defaults: {
        signatureName: "Ein anderer unbottled.ai-Nutzer",
        previewLeadId: "vorschau-lead-id",
        previewEmail: "vorschau@beispiel.de",
        previewBusinessName: "Muster GmbH",
        previewContactName: "Vorschau Nutzer",
        previewPhone: "+491234567890",
        previewCampaignId: "vorschau-kampagne-id",
      },
      footer: {
        unsubscribeText:
          "Sie erhalten diese E-Mail, weil Sie sich angemeldet haben.",
        unsubscribeLink: "Abmelden",
      },
      journeyInfo: {
        uncensoredConvert: {
          name: "Unzensierter Konverter",
          description:
            "Ein Begeisterter teilt seine Entdeckung von unbottled.ai",
        },
        sideHustle: {
          name: "Nebenverdienst",
          description:
            "Ein transparenter Affiliate teilt echte Anwendungsfälle",
        },
        quietRecommendation: {
          name: "Stille Empfehlung",
          description: "Ein sachlicher Profi gibt ein getestetes Tool weiter",
        },
      },
    },
    leads: {
      journeys: {
        uncensoredConvert: {
          initial: {
            subject: "hab was gefunden, das ich teilen musste",
            previewText: "ich weiß selbst nicht warum, aber hier geht's los",
            greeting: "Hey,",
            opening:
              "Ich schreibe eigentlich keine Kalt-E-Mails. Ich find die meistens nervig. Aber ich hab vor ein paar Wochen was gefunden, das ich ständig weiterempfehle – da dachte ich mir, ich schreib's mal auf.",
            discovery:
              'Ich war nachts um 11 in einem Kaninchenbau unterwegs, frustriert weil ChatGPT mir nicht bei Marketing-Copy helfen wollte, weil es das Wording für "möglicherweise irreführend" hielt (war es nicht). Jemand im Forum hat unbottled.ai erwähnt und ich hab\'s einfach ausprobiert.',
            whatItDoes:
              "Es ist eine KI, die tut, was man ihr sagt. Kein Absichern, keine Moralpredigten, keine zufälligen Verweigerungen. Ich benutze es für Texterstellung, Recherche, Wettbewerbsanalyse, und für Sachen, die ich einer vorsichtigen KI nicht erklären will. Es funktioniert einfach.",
            affiliateDisclosure:
              "Volle Transparenz: wenn du dich über meinen Link anmeldest, bekomme ich eine kleine Provision. Das ist ein Teil des Grundes warum ich das schreibe. Aber ich würde es so oder so weiterempfehlen – ich hab den Link schon drei Leuten in normalen Gesprächen geschickt.",
            ctaText: "unbottled.ai ausprobieren (mein Affiliate-Link)",
            signature: " -  Chris",
            postScript:
              "P.S. Es gibt eine kostenlose Testversion, damit du dich erst umschauen kannst.",
          },
          followup1: {
            subject: "wofür ich es eigentlich benutze",
            previewText: "konkrete Sachen, keine vagen Versprechen",
            greeting: "Hey nochmal,",
            recap:
              "Ich hab dir vor ein paar Wochen was über unbottled.ai geschickt. Falls du noch neugierig bist, hier ein paar Sachen, die ich seitdem damit gemacht habe:",
            useCases:
              'Eine komplette Landingpage für einen Kunden in etwa 20 Minuten geschrieben. Einen rechtlichen Haftungsausschluss entworfen (wurde natürlich noch geprüft). Ein gefälschtes "Interview" mit einem Konkurrenzprodukt durchgeführt, um Schwächen zu finden. 40 Betreffzeilen-Variationen für einen E-Mail-Test generiert. Nichts davon erforderte, dass ich mich erklärte oder Dinge fünfmal umformulieren musste.',
            differentFromOthers:
              "Der Unterschied zu anderen KI-Tools ist nicht Geschwindigkeit oder ein besonderes Feature. Es ist, dass es dich wie einen Erwachsenen behandelt, der weiß was er tut. Klingt klein. Ist es nicht.",
            ctaText: "Nachschauen",
            signature: " -  Chris",
            postScript:
              "P.S. Benutze noch meinen Affiliate-Link, weil ich genausogut ehrlich sein kann.",
          },
          followup2: {
            subject: "das Spezifische, das mich an ChatGPT genervt hat",
            previewText: "und warum unbottled.ai das für mich gelöst hat",
            greeting: "Letzte Mail von mir zu dem Thema, versprochen.",
            specificExample:
              "Ich wollte Werbetexte für eine Supplement-Marke schreiben, die mutige Behauptungen macht. Jede gängige KI hat sie entweder abgeschwächt oder komplett abgelehnt. Ich hab vielleicht 45 Minuten Kreise gedreht. Bei unbottled.ai gewechselt, hatte Texte in 8 Minuten. Der Kunde hat sie noch am selben Tag genehmigt.",
            comparison:
              "Ich sage nicht, dass ChatGPT schlecht ist. Für vieles ist es super. Aber wenn du in irgendetwas rund um Marketing, Sales-Copy, rechtliche Grenzfälle oder einfach Dinge arbeitest, die ein bisschen Direktheit erfordern – du wirst irgendwann an die Wand stoßen.",
            nudge:
              "Wenn sich das nach deiner Welt anhört, sind 5 Minuten für die kostenlose Version es wert.",
            ctaText: "Kostenlos ausprobieren",
            signature: " -  Chris",
          },
          followup3: {
            subject: "ok, nach dieser Mail höre ich auf",
            previewText: "ich lass das hier einfach stehen",
            greeting: "Hey,",
            lastPitch:
              "Ich habe ein paar Mails über unbottled.ai geschickt und lass es danach auf sich beruhen. Wenn es nicht relevant für deine Arbeit ist, völlig verständlich.",
            honesty:
              "Wenn du dich jemals mit einer KI herumärgerst, die nicht mitmacht – denk daran, dass das hier eine Option ist. Link unten. Affiliate, ja. Trotzdem ehrlich gemeint.",
            ctaText: "unbottled.ai",
            signature: " -  Chris",
          },
          nurture: {
            subject: "die haben was hinzugefügt, das erwähnenswert ist",
            previewText: "kleines Update zu unbottled.ai",
            greeting: "Hey,",
            newFeature:
              "Kurz und bündig. unbottled.ai hat kürzlich neue Modell-Optionen eingeführt, darunter einige, die besonders gut für Langform-Content sind. Wenn du viele Artikel, Berichte oder Skripte schreibst, ist es deutlich besser als zuvor.",
            stillRelevant:
              "Kostenlose Testversion noch aktiv. Affiliate-Link noch meiner. Dachte nur, es ist erwähnenswert.",
            ctaText: "Neuerungen ansehen",
            signature: " -  Chris",
          },
          reactivation: {
            subject: "nochmal kurz melden",
            previewText: "seit meiner ersten Erwähnung hat sich viel getan",
            greeting: "Hey,",
            checkIn:
              "Ich weiß, es ist eine Weile her seit ich unbottled.ai zuletzt angesprochen habe. Ich benutze es weiter und es ist wirklich besser geworden – schnellere Antworten, mehr Modell-Auswahl, und sie haben einige Kanten geschliffen.",
            update:
              "Wenn du es dir vorher angeschaut hast und nicht beeindruckt warst, könnte es sich lohnen, nochmal reinzuschauen. Wenn du es nie probiert hast, gibt es noch die kostenlose Testversion. Gleicher Affiliate-Link, gleiche ehrliche Empfehlung.",
            ctaText: "Nochmal anschauen",
            signature: " -  Chris",
          },
        },
        sideHustle: {
          initial: {
            subject: "Ich bin Affiliate dafür. Hier erkläre ich warum.",
            previewText:
              "transparent von Anfang an – ich verdiene was, wenn du dich anmeldest",
            greeting: "Hey,",
            opening:
              "Ich will direkt sein, bevor ich irgendetwas anderes sage: Ich bin Affiliate für unbottled.ai, was bedeutet, dass ich eine Provision verdiene, wenn du dich über meinen Link anmeldest. Ich sage dir das, weil ich nur für Sachen werbe, die ich selbst benutze – und ich denke, dieser Unterschied zählt.",
            myStory:
              "Ich benutze unbottled.ai seit etwa 4 Monaten, um Texte für meine Freelance-Kunden zu schreiben. Davor nutzte ich eine Kombination aus ChatGPT und manueller Bearbeitung, um Inhaltssperren zu umgehen. unbottled.ai hat diesen Prozess ungefähr halbiert, weil es sich nicht gegen mich sperrt. Dann fing ich an, es Kunden als Teil meines Prozesses zu empfehlen. Dann merkte ich, dass ich passiv verdienen kann, indem ich einfach offen darüber bin.",
            affiliateHonesty:
              "Also ja – es steckt Geld dahinter. Aber ich benutze es auch wirklich jede Woche für echte bezahlte Arbeit. Wenn es aufhören würde, gut zu sein, würde ich aufhören, es zu empfehlen. Es hat aufgehört, nicht gut zu sein.",
            proof:
              "Ich hab es diese Woche benutzt für: 3 Produktbeschreibungen für einen E-Commerce-Kunden schreiben, eine Pitch-Mail für meine eigene Akquise entwerfen (meta, ich weiß), eine 40-seitige PDF in eine 1-seitige Zusammenfassung verdichten. Alles ohne Kämpfe mit Filtern oder Umformulierungen.",
            ctaText: "unbottled.ai ausprobieren (Affiliate-Link)",
            signature: " -  Jordan",
            postScript:
              "P.S. Kostenlose Testversion verfügbar. Keine Kreditkarte nötig zum Starten.",
          },
          followup1: {
            subject: "was ich diese Woche damit gemacht habe (echte Arbeit)",
            previewText: "konkrete Anwendungsfälle, kein Hype",
            greeting: "Hey,",
            thisWeek:
              "Kurzes Update. Diese Woche habe ich unbottled.ai benutzt, um Onboarding-Mails für den neuen User-Flow eines SaaS-Kunden zu schreiben. Sechs Mails, zwei Variationen jede, komplett mit Betreffzeilen-Optionen. Das hätte mit meinem alten Prozess fast einen Tag gedauert. Es hat etwa 90 Minuten gedauert.",
            clientWork:
              "Der Kunde wusste nicht, dass ich KI benutzt habe. Er hat die Texte mit kleinen Änderungen genehmigt. Das ist eigentlich der Punkt – nicht dass KI die kreative Arbeit macht, sondern dass es das Grundgerüst beschleunigt, damit ich mich auf das Qualitätsverbessern konzentrieren kann.",
            howYouCanToo:
              "Wenn du irgendetwas mit Schreiben machst – Copy, Content, Kommunikation, irgendetwas – ist das einen Versuch wert. Der Affiliate-Link bedeutet, ich verdiene etwas wenn du dich anmeldest, aber ich teile das, weil es wirklich Teil meiner Arbeitsweise ist.",
            ctaText: "Nachschauen",
            signature: " -  Jordan",
          },
          followup2: {
            subject: "der Affiliate-Teil ist eigentlich auch interessant",
            previewText:
              "wie passives Einkommen mit einem Tool das man nutzt funktioniert",
            greeting: "Hey,",
            anotherUseCase:
              "Noch eine Woche, noch ein echter Anwendungsfall: Ich habe unbottled.ai benutzt, um die Kalt-Akquise-Mails zu schreiben, die ich gerade versende – einschließlich dieser hier, was etwas zirkulär ist, aber irgendwie auch den Punkt beweist.",
            passiveIncome:
              "Auf der Affiliate-Seite: Ich verdiene kleines aber konstantes monatliches Einkommen, einfach indem ich das Ding in normalen Gesprächen und in meinem Newsletter empfehle. Es ist kein lebensveränderndes Geld, aber es ist real und es wächst. Das Modell ist einfach – Leute melden sich an, ich verdiene einen Prozentsatz ihres Abos solange sie Kunden bleiben.",
            callToAction:
              "Wenn du irgendeinen Content-, Freelancing- oder Marketing-Betrieb führst, könnte Affiliate auch für dich sinnvoll sein. Oder einfach als Tool nutzen. Beides ist gültig. Link unten so oder so.",
            ctaText: "unbottled.ai ausprobieren",
            signature: " -  Jordan",
            postScript:
              "P.S. Ja, Affiliate-Link. Ja, ich verdiene Geld. Ja, ich benutze es wirklich. Alle drei Dinge sind wahr.",
          },
          followup3: {
            subject: "letzte Mail von mir dazu, versprochen",
            previewText: "eine Zahl, die mich zum Nachdenken gebracht hat",
            greeting: "Hey,",
            monthlyEarnings:
              "Ich mach's kurz. Letzten Monat habe ich €147 in Affiliate-Provisionen von unbottled.ai verdient, nur von Leuten, die ich beiläufig darauf hingewiesen habe. Das ist kein Business, aber es ist ein nettes Zubrot dafür, dass man etwas empfiehlt, das man eh nutzt.",
            noHardSell:
              "Ich werde dich nicht weiter damit per Mail nerven. Wenn es bis jetzt nicht geklickt hat, wird es wahrscheinlich nicht mehr. Aber wenn du jemals eine fähige, unzensierte KI für Content-Arbeit ausprobieren willst – oder einfach das Affiliate-Programm – der Link ist unten. Kein Druck, wirklich.",
            ctaText: "unbottled.ai",
            signature: " -  Jordan",
          },
          nurture: {
            subject: "ein kleiner Prompt-Trick, der mir Zeit spart",
            previewText: "funktioniert besonders gut mit unbottled.ai",
            greeting: "Hey,",
            tip: 'Schneller Tipp, den ich benutze: wenn ich etwas in einer bestimmten Marken-Stimme schreiben muss, füge ich 3 Beispiele vorhandener Inhalte ein und sage "schreib in diesem Stil" vor der eigentlichen Anfrage. unbottled.ai ist besonders gut darin, das aufzugreifen, weil es kein eigenes Absichern oder Mildern draufsetzt.',
            freeValue:
              "Diesmal kein Affiliate-Push – nur etwas, das funktioniert. Wenn du unbottled.ai noch nicht ausprobiert hast und willst, der Link ist noch da.",
            ctaText: "unbottled.ai",
            signature: " -  Jordan",
          },
          reactivation: {
            subject:
              "die haben einige Änderungen gemacht, die du kennen solltest",
            previewText: "unbottled.ai Update + noch mein Affiliate-Link",
            greeting: "Hey,",
            update:
              "Es sind ein paar Monate vergangen. unbottled.ai ist merklich schneller geworden und sie haben neue Modell-Ebenen hinzugefügt. Das, das ich jetzt am meisten benutze, ist besser darin, lange Dokumente ohne Abdriften vom Thema zu behalten.",
            newOpportunity:
              "Noch Affiliate, noch verdiend damit, noch wöchentlich benutzt. Wenn du es vorher ausprobiert hast und weitergezogen bist, könnte sich ein weiterer Blick lohnen. Wenn du es nie probiert hast, kostenlose Testversion noch verfügbar.",
            ctaText: "Neuigkeiten ansehen",
            signature: " -  Jordan",
          },
        },
        quietRecommendation: {
          initial: {
            subject: "Tool, das du kennen solltest",
            previewText: "in einem Forum gefunden, 3 Wochen getestet",
            greeting: "Hallo,",
            howIFoundIt:
              "Jemand in einem Entwickler-Forum hat unbottled.ai als Alternative zu ChatGPT für Aufgaben erwähnt, die ständig an Inhaltssperren stoßen. Ich habe es etwa 3 Wochen getestet, bevor ich entschieden habe, es weiterzugeben.",
            whatItDoesDifferently:
              "Die Kurzversion: Es ist ein KI-Assistent, der Aufgaben nicht aus vagen Richtlinien heraus verweigert. Nützlich wenn du irgendetwas in Marketing, Recht, kreatives Schreiben, Forschung machst, oder wirklich alles, wo gängige KI-Tools der eigentlichen Arbeit im Weg stehen.",
            affiliateNote:
              "Es gibt einen Affiliate-Link unten – ich verdiene eine kleine Provision wenn du dich anmeldest. Ich erwähne es, weil ich lieber direkt bin, als so zu tun, als wäre er nicht da.",
            ctaText: "Nachschauen",
            signature: " -  Sam",
          },
          followup1: {
            subject: "was ich damit wirklich gebaut habe",
            previewText:
              "drei Wochen echter Nutzung, keine Verkaufspräsentation",
            greeting: "Hallo,",
            specificThing:
              "In meinen drei Wochen mit unbottled.ai: ein Content-Brief für einen Kunden geschrieben, der etwas selbstbewusstes Positioning brauchte (hat super funktioniert). Ein rechtlich angrenzendes Policy-Dokument entworfen, das zwei andere KI-Tools komplett abgelehnt hatten. Wettbewerbsforschung betrieben, indem ich es bat, den Advokaten des Teufels zu meinem Geschäftsmodell zu spielen.",
            builtWith:
              "Das sind keine außerordentlichen Aufgaben. Es sind nur Dinge, die anderswo ständig durch Guardrails unterbrochen wurden. Wenn sich dieser Reibungspunkt bekannt anfühlt, sind 10 Minuten für die kostenlose Version wahrscheinlich wert.",
            ctaText: "Kostenlose Version testen",
            signature: " -  Sam",
          },
          followup2: {
            subject: "ehrlicher Vergleich mit ChatGPT",
            previewText: "wo jedes besser ist",
            greeting: "Hallo,",
            comparison:
              'Wo ChatGPT besser ist: allgemeines Wissen, Coding, mehrstufiges Reasoning, alles "Sichere". Wo unbottled.ai besser ist: Aufgaben, die Direktheit erfordern, Arbeit in sensiblen Kategorien, alles, bei dem du wiederholt umformulieren musstest um eine Verweigerung zu vermeiden.',
            honestTake:
              "Ich benutze beide. Sie konkurrieren für mich nicht direkt. Aber wenn du jemals von einer KI bei etwas Legitimem blockiert wurdest, ist unbottled.ai die praktische Lösung. Kostenlose Testversion, Affiliate-Link, kein Hochdruckverkauf.",
            ctaText: "unbottled.ai",
            signature: " -  Sam",
          },
          followup3: {
            subject: "letzte Mail",
            previewText: "ich werde darüber nicht weiter mailen",
            greeting: "Hallo,",
            lastOne:
              "Letzte Mail über unbottled.ai von mir. Es ist ein solides Tool für die spezifischen Fälle, wo gängige KI-Tools nicht kooperieren. Affiliate-Link unten falls du neugierig bist.",
            stayInTouch:
              "Wenn das für deine Arbeit nicht relevant ist, kein Problem.",
            ctaText: "unbottled.ai",
            signature: " -  Sam",
          },
          nurture: {
            subject: "kleines Update von unbottled.ai",
            previewText: "erwähnenswert falls du auf der Suche bist",
            greeting: "Hallo,",
            update:
              "unbottled.ai hat kürzlich neue Modell-Optionen hinzugefügt. Wenn du es vorher angeschaut hast und die Ausgabequalität nicht da war, lohnt sich ein weiterer Versuch – die neueren Modelle sind einen Schritt besser. Affiliate-Link noch aktiv wenn du dich anmelden möchtest.",
            ctaText: "Neuigkeiten sehen",
            signature: " -  Sam",
          },
          reactivation: {
            subject: "kurz nachfragen",
            previewText: "kurze Notiz",
            greeting: "Hallo,",
            checkIn:
              "Es ist eine Weile her. Kurz nachfragen – wenn du unbottled.ai mal ausprobiert hast, würde mich interessieren was du dachtest. Und wenn nicht, es ist noch da, noch verbessert, kostenlose Testversion noch verfügbar.",
            whatChanged:
              "Sie haben bessere Langform-Unterstützung und schnellere Antwortzeiten hinzugefügt seit ich es zuerst erwähnte. Affiliate-Link unten.",
            ctaText: "Nachschauen",
            signature: " -  Sam",
          },
        },
      },
    },
  },
};
