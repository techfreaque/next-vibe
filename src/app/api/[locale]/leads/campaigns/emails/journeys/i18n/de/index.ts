import { translations as componentsTranslations } from "../../components/i18n/de";
import { translations as resultsTranslations } from "../../results/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  results: resultsTranslations,
  emailJourneys: {
    components: {
      defaults: {
        signatureName: "Ihr Partner für Wachstum",
      },
      journeyInfo: {
        personalApproach: {
          name: "Persönlicher Ansatz",
          description: "Echte Verbindungen durch personalisierte Nachrichten aufbauen",
        },
        resultsFocused: {
          name: "Ergebnisorientiert",
          description: "Konkrete Ergebnisse und messbare Resultate betonen",
        },
        personalResults: {
          name: "Persönlich + Ergebnisse",
          description: "Persönliche Note mit ergebnisorientierten Nachrichten kombinieren",
        },
      },
    },
    leads: {
      journeys: {
        personalPractical: {
          initial: {
            subject: "Lassen Sie uns gemeinsam etwas Großartiges aufbauen",
            previewText: "Eine persönliche Nachricht über die Zusammenarbeit",
            greeting: "Hallo {{businessName}},",
            personalIntro:
              "Ich wollte mich persönlich an Sie wenden, weil ich glaube, dass wir gemeinsam etwas wirklich Wertvolles schaffen können.",
            connectionValue:
              "Was mich an Ihrem Unternehmen fasziniert hat, ist das Potenzial für Wachstum und Wirkung, das ich sehe.",
            practicalTransition:
              "Aber lassen Sie mich praktisch sein - Sie fragen sich wahrscheinlich, was das tatsächlich für Sie bedeutet.",
            plansBridge: "Hier ist, was ich mir in Bezug auf konkrete nächste Schritte vorstelle:",
            ctaText: "Lassen Sie uns über Ihre Ziele sprechen",
            signature: "Ich freue mich auf den Austausch,",
            signatureClosing: "Mit freundlichen Grüßen",
            postScript:
              "P.S. Kein Druck - wenn der Zeitpunkt nicht passt, verstehe ich das vollkommen.",
          },
          followup1: {
            subject: "Ihr Fahrplan für die nächsten 90 Tage",
            previewText: "Die Reise in praktische Schritte unterteilen",
            defaultBusinessName: "Sie",
            greeting: "Hallo {{businessName}},",
            personalReflection:
              "Ich habe über unsere mögliche Zusammenarbeit nachgedacht und wollte Ihnen etwas Konkreteres mitteilen.",
            thoughtProcess:
              "Anstatt allgemeiner Versprechen lassen Sie mich Ihnen genau zeigen, wie die ersten 90 Tage aussehen könnten:",
            timelineTitle: "Ihr 90-Tage-Fahrplan:",
            week1Title: "Woche 1: Grundlage",
            week1Content:
              "Wir setzen uns zusammen und verstehen wirklich Ihre Geschäftsziele und Herausforderungen.",
            month2Title: "Monat 2: Umsetzung",
            month2Content: "Hier beginnen wir, echte Dynamik aufzubauen.",
            week3Title: "Woche 3-4: Schnelle Erfolge",
            week3Content:
              "Sie werden die ersten greifbaren Ergebnisse sehen - normalerweise schneller als erwartet.",
            roadmapIntro:
              "Was mir an diesem Ansatz gefällt, ist, dass Sie nicht 6 Monate warten müssen, um zu sehen, ob die Dinge funktionieren.",
            personalCommitment:
              "Hier ist etwas, das Sie wissen sollten: Ich bin persönlich in Ihren Erfolg investiert. Dies ist für mich nicht nur eine weitere Kundenbeziehung.",
            nextSteps:
              "Wenn das bei Ihnen Anklang findet, lassen Sie uns ein echtes Gespräch darüber führen.",
            ctaText: "Strategiegespräch planen",
            signature: "Begeistert von den Möglichkeiten,",
            signatureClosing: "Herzliche Grüße",
            postScript:
              "P.S. Ich habe ähnlichen Unternehmen geholfen, [spezifisches Ergebnis] zu erreichen - gerne teile ich diese Geschichten, wenn wir sprechen.",
          },
          followup2: {
            subject: "Wie wir tatsächlich zusammenarbeiten würden",
            previewText: "Echte Beispiele und flexible Ansätze",
            defaultBusinessName: "Sie",
            greeting: "Hallo {{businessName}},",
            personalContext:
              "Ich weiß, dass Sie beschäftigt sind, also wollte ich etwas teilen, das Ihnen helfen könnte zu sehen, ob wir gut zusammenpassen:",
            caseStudyIntro:
              "Kürzlich habe ich mit einem ähnlichen Unternehmen wie Ihrem gearbeitet. Hier ist, was tatsächlich passiert ist:",
            methodExplanation:
              "Der Grund, warum dies funktioniert hat, war keine Magie - es war ein systematischer Ansatz für [spezifischer Bereich].",
            applicationTo:
              "Für Ihr Unternehmen sehe ich ähnliche Chancen, insbesondere im Bereich [spezifische Gelegenheit].",
            realResults:
              "Aber was wirklich zählt - es geht nicht darum, was ich für andere getan habe, sondern was für Sie sinnvoll ist.",
            flexibleOptions:
              "Einige Kunden benötigen sofort intensive Unterstützung. Andere bevorzugen es, klein anzufangen und von dort aus aufzubauen. Beide Ansätze funktionieren - es geht darum, was zu Ihrer Situation passt.",
            practicalNext:
              "Wenn Sie neugierig sind, welcher Ansatz für Sie am besten geeignet sein könnte, lassen Sie uns darüber sprechen.",
            ctaText: "Lassen Sie uns Ihre Situation besprechen",
            signature: "Hier um zu helfen,",
            postScript:
              "P.S. Wenn Sie spezifischere Beispiele sehen oder mit einem früheren Kunden sprechen möchten, lassen Sie es mich einfach wissen.",
          },
          followup3: {
            subject: "Ein letzter Gedanke, bevor ich gehe",
            previewText: "Abschließende Gedanken und eine offene Tür",
            defaultBusinessName: "Sie",
            greeting: "Hallo {{businessName}},",
            finalReflection:
              "Ich habe mich ein paar Mal gemeldet, weil ich wirklich Potenzial in einer Zusammenarbeit sehe. Aber ich weiß auch, dass Timing alles ist.",
            marketTiming:
              "Manchmal beginnen die besten Geschäftsbeziehungen, wenn Sie noch nicht ganz bereit sind - denn dann sind Sie am nachdenklichsten bei der richtigen Wahl.",
            personalCommitment:
              "Wenn wir am Ende zusammenarbeiten, möchte ich, dass es ist, weil es für Ihr Unternehmen wirklich sinnvoll ist, nicht weil Sie sich unter Druck gesetzt fühlten.",
            practicalOffer:
              "Also hier ist mein praktisches Angebot: Wenn Sie jemals ein druckloses Gespräch über Ihre Geschäftsziele führen möchten, bin ich hier.",
            noHighPressure:
              "Kein Verkaufsgespräch. Kein harter Verkauf. Nur ein echtes Gespräch darüber, wohin Sie Ihr Unternehmen führen möchten und ob wir helfen können.",
            finalCTA: "Die Tür steht offen, wann immer Sie bereit sind, hindurchzugehen.",
            ctaText: "Lassen Sie uns dieses Gespräch führen",
            signature: "Ich wünsche Ihnen alles Gute,",
            postScript:
              "P.S. Auch wenn wir nie zusammenarbeiten, würde ich gerne hören, wie sich Ihr Unternehmen entwickelt. Bleiben Sie gerne in Kontakt.",
          },
          reactivation: {
            subject: "Etwas Neues, das ich mit Ihnen teilen wollte",
            previewText: "Updates und neue Möglichkeiten",
            defaultBusinessName: "Sie",
            greeting: "Hallo {{businessName}},",
            reconnection:
              "Es ist eine Weile her, seit wir das letzte Mal Kontakt hatten, und ich wollte mich melden, weil sich einige Dinge entwickelt haben, die Sie interessant finden werden.",
            newDevelopments:
              "Seit wir das letzte Mal gesprochen haben, haben wir einige neue Ansätze entwickelt, die besonders relevant für Unternehmen wie Ihres sind.",
            specificOffer:
              "Was jetzt anders ist, ist, dass wir unseren Prozess auf der Grundlage dessen verfeinert haben, was wir aus der Arbeit mit Unternehmen in Ihrem Bereich gelernt haben.",
            practicalEvolution:
              "Das praktische Ergebnis ist, dass wir jetzt gezieltere Lösungen mit schnelleren Implementierungszeiten anbieten können.",
            updatedResults:
              "Neuere Kunden haben [spezifische neue Ergebnisse] gesehen - was deutlich besser ist als das, was wir zuvor erreicht haben.",
            investmentUpdate:
              "Ich sollte auch erwähnen, dass sich unsere Preisstruktur entwickelt hat, um flexibler und zugänglicher zu sein.",
            personalInvitation:
              "Wenn Sie neugierig auf diese Entwicklungen sind, würde ich mich wirklich freuen, mich wieder zu verbinden und zu teilen, was neu ist.",
            ctaText: "Lassen Sie uns wieder verbinden",
            signature: "Hoffe, von Ihnen zu hören,",
            postScript:
              "P.S. Auch wenn Sie im Moment nicht interessiert sind, würde ich gerne in Kontakt bleiben und hören, wie es mit Ihrem Unternehmen läuft.",
          },
          nurture: {
            subject: "Kurzer Gedanke für Ihr Unternehmen",
            previewText: "Eine hilfreiche Einsicht, die ich teilen wollte",
            defaultBusinessName: "Sie",
            greeting: "Hallo {{businessName}},",
            friendlyCheckIn:
              "Ich weiß, dass Sie beschäftigt sind, also halte ich mich kurz. Ich bin kürzlich auf etwas gestoßen, das mich an Ihr Unternehmen denken ließ.",
            practicalInsight:
              "Ich habe bemerkt, dass Unternehmen in Ihrem Bereich oft mit [spezifischer Herausforderung] zu kämpfen haben. Diejenigen, die erfolgreich sind, gehen normalerweise mit [spezifischer Strategie] vor.",
            specificSuggestion:
              "Für Ihre spezifische Situation könnten Sie [praktischer Vorschlag] in Betracht ziehen. Es ist eine relativ einfache Änderung, die einen echten Unterschied machen kann.",
            genuineCare:
              "Ich teile dies nicht als Verkaufsgespräch, sondern weil ich wirklich möchte, dass Ihr Unternehmen erfolgreich ist - ob wir zusammenarbeiten oder nicht.",
            helpfulResource:
              "Wenn Sie dies weiter erkunden möchten, habe ich eine schnelle Ressource zusammengestellt, die helfen könnte. Ohne Bedingungen.",
            ctaText: "Ressource erhalten",
            signature: "Ich unterstütze Ihren Erfolg,",
            postScript:
              "P.S. Wenn dies für Sie im Moment nicht relevant ist, ignorieren Sie es gerne. Ich werde irgendwann mit etwas anderem nachfragen, das nützlich sein könnte.",
          },
        },
        personal: {
          initial: {
            subject: "Willkommen bei unserem Service",
            previewText: "Erste Schritte auf Ihrer Reise",
            greeting: "Hallo {{businessName}},",
            intro: "Willkommen! Wir freuen uns, Sie an Bord zu haben.",
            serviceDescription:
              "Unser Service ist darauf ausgelegt, Ihnen zu helfen, Ihre Ziele effizient zu erreichen.",
            convenience: "Alles, was Sie brauchen, direkt zur Hand.",
            ctaText: "Loslegen",
            signature: "Willkommen an Bord,",
            postScript: "P.S. Wenn Sie Fragen haben, sind wir für Sie da.",
          },
          followup1: {
            subject: "Wie läuft es?",
            previewText: "Nachfrage zu Ihrer Erfahrung",
            greeting: "Hallo {{businessName}},",
            intro: "Ich wollte nachfragen, wie es läuft.",
            empathy: "Ich weiß, dass der Einstieg in etwas Neues herausfordernd sein kann.",
            question: "Wie war Ihre Erfahrung bisher?",
            socialProof: {
              quote:
                "Dieser Service hat unsere Arbeitsweise transformiert - wir könnten nicht glücklicher sein!",
              author: "Zufriedener Kunde",
            },
            ctaText: "Feedback teilen",
            signature: "Freue mich auf Ihre Rückmeldung,",
          },
          followup2: {
            subject: "Unsere Geschichte und Mission",
            previewText: "Warum wir tun, was wir tun",
            greeting: "Hallo {{businessName}},",
            intro: "Ich wollte ein wenig darüber erzählen, warum wir tun, was wir tun.",
            mission:
              "Unsere Mission ist es, professionelle Dienstleistungen für alle zugänglich zu machen.",
            story1:
              "Wir haben angefangen, weil wir Unternehmen mit veralteten Lösungen kämpfen sahen.",
            story2:
              "Heute sind wir stolz darauf, Hunderten von Unternehmen zum Erfolg zu verhelfen.",
            ctaText: "Mehr über uns erfahren",
            signature: "Mit Zielstrebigkeit,",
            closing: "Danke, dass Sie Teil unserer Reise sind.",
          },
          followup3: {
            subject: "Letzte Nachfrage",
            previewText: "Eine letzte Nachricht von uns",
            greeting: "Hallo {{businessName}},",
            intro:
              "Dies ist meine letzte Nachricht, es sei denn, Sie möchten weiterhin von uns hören.",
            reflection:
              "Ich habe mich gemeldet, weil ich wirklich glaube, dass wir Ihrem Unternehmen helfen könnten.",
            noPressure: "Aber ich respektiere Ihre Zeit und möchte nicht lästig sein.",
            ctaText: "In Verbindung bleiben",
            signature: "Alles Gute,",
            closing: "Die Tür steht immer offen, falls Sie später Ihre Meinung ändern.",
          },
          nurture: {
            subject: "Kurzer Tipp für Sie",
            previewText: "Eine hilfreiche Einsicht",
            greeting: "Hallo {{businessName}},",
            intro: "Ich bin auf etwas gestoßen, das Sie wertvoll finden könnten.",
            tip: "Hier ist ein kurzer Tipp, der einen echten Unterschied machen kann:",
            value:
              "Kleine Änderungen können im Laufe der Zeit zu erheblichen Verbesserungen führen.",
            ctaText: "Mehr erfahren",
            signature: "Zu Ihrem Erfolg,",
          },
          reactivation: {
            subject: "Lassen Sie uns wieder verbinden",
            previewText: "Wir würden uns freuen, wieder in Kontakt zu treten",
            greeting: "Hallo {{businessName}},",
            intro: "Es ist eine Weile her - ich wollte mich melden.",
            checkIn: "Wie läuft es mit Ihrem Unternehmen?",
            offer: "Wir haben einige neue Angebote, die Sie interessieren könnten.",
            ctaText: "Entdecken Sie, was neu ist",
            signature: "Hoffe, bald von Ihnen zu hören,",
            closing: "Freue mich darauf, von Ihnen zu hören.",
          },
        },
      },
    },
  },
};
