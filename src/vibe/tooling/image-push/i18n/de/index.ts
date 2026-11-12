import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Server-Management",
  tags: {
    imagePush: "Image Push",
  },
  post: {
    title: "Image bauen & pushen",
    titleShort: "Image pushen",
    description:
      "Baut das Produktions-Docker-Image und liefert es an die Registry oder direkt per SSH an einen Server aus, damit der Deploy-Server es nur noch zieht (oder schon hat) statt selbst zu bauen",
    form: {
      title: "Image-Push-Konfiguration",
      description: "Image-Name, Tag und Zielplattform konfigurieren",
      submit: "Bauen & Pushen",
      runAgain: "Erneut ausführen",
    },
    fields: {
      image: {
        title: "Image",
        description:
          "Registry + Image-Name zum Bauen und Pushen. Standard: DOCKER_IMAGE_NAME aus deiner .env.",
      },
      commit: {
        title: "Commit",
        description:
          "Zu bauender Commit: SHA, Tag oder Branch-Name. Standard ist HEAD des aktuellen Branches. Ausgeliefert wird nur committeter Code. Uncommittete Änderungen im Arbeitsverzeichnis landen nie im Image.",
      },
      tag: {
        title: "Tag",
        description:
          "Image-Tag. Standard ist der kurze SHA des gebauten Commits. Kurz-SHA und 'latest' werden immer zusätzlich getaggt.",
      },
      push: {
        title: "Pushen",
        description:
          "Nach dem Bauen in die Registry pushen (bzw. per SSH übertragen). Deaktivieren für einen rein lokalen Build: kein Push, keine SSH-Übertragung, kein Deploy.",
      },
      platform: {
        title: "Plattform",
        description:
          "Zielplattform für den Build (docker buildx --platform). Muss zur Architektur des Deploy-Servers passen - meist linux/amd64.",
      },
      sshTarget: {
        title: "SSH-Ziel",
        description:
          "user@host, um das gebaute Image direkt per SSH statt über eine Registry zu übertragen (z.B. root@203.0.113.5) - standardmäßig SSH_SERVER, falls gesetzt. Nutzt SSH_SERVER_PWD für Passwort-Auth, sonst deinen eigenen SSH-Schlüssel/-Konfiguration. Leer lassen, um stattdessen in die Registry zu pushen.",
      },
      success: {
        title: "Erfolg",
      },
      output: {
        title: "Ausgabe",
      },
      resolvedImage: {
        title: "Image",
      },
      tags: {
        title: "Gepushte Tags",
      },
      duration: {
        title: "Dauer (ms)",
      },
    },
    errors: {
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Image-Push-Parameter angegeben",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung während des Image-Push fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Du musst angemeldet sein, um das Image zu bauen und zu pushen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Du hast keine Berechtigung, das Image zu bauen und zu pushen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Image-Push-Ressourcen nicht gefunden",
      },
      server: {
        title: "Server-Fehler",
        description: "Docker-Build oder -Push fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Beim Image-Push ist ein unbekannter Fehler aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description: "Image-Push-Konflikt erkannt",
      },
      unsavedChanges: {
        title: "Unbekannter Fehler",
        description: "Beim Image-Push ist ein unbekannter Fehler aufgetreten",
      },
    },
    success: {
      title: "Image gepusht",
      description: "Docker-Image erfolgreich gebaut und gepusht",
    },
    repository: {
      messages: {
        buildStart: "🐳 Baue {{image}}:{{tag}} ...",
        buildSuccess: "✅ {{refs}} gebaut (nicht gepusht)",
        pushSuccess: "🚀 {{refs}} gepusht",
        buildExitCode: "docker buildx wurde mit Code {{code}} beendet",
        buildKilled: "docker buildx wurde durch Signal {{signal}} beendet",
        dockerBuildFailed: "Docker-Build fehlgeschlagen: {{error}}",
        commitResolveFailed: "Commit '{{ref}}' konnte nicht aufgelöst werden",
        commitResolveFailedDetail:
          "Commit '{{ref}}' konnte nicht aufgelöst werden: {{error}}",
        commitResolved: "📌 Baue Commit {{sha}} ({{ref}}): {{subject}}",
        dirtyTreeWarning:
          "⚠️ Arbeitsverzeichnis hat {{count}} uncommittete Änderung(en). Sie sind NICHT im Image. Gebaut wird nur Commit {{sha}}.",
        exportStart: "📦 Exportiere Commit {{sha}} nach {{dir}} ...",
        exportReused: "📦 Nutze exportierten Stand von {{sha}} in {{dir}}",
        exportFailed: "Export von Commit {{sha}} fehlgeschlagen: {{error}}",
        sshTransferStart: "📡 Übertrage {{refs}} per ssh an {{target}} ...",
        sshTransferSuccess: "🚀 {{refs}} per ssh an {{target}} übertragen",
        sshTransferFailed:
          "ssh-Übertragung an {{target}} fehlgeschlagen: {{error}}",
        scriptSynced:
          "📜 {{script}} auf {{target}} aus Commit {{sha}} synchronisiert",
        scriptSyncFailed:
          "Synchronisierung von {{script}} auf {{target}} fehlgeschlagen, Deploy abgebrochen: {{error}}",
        scriptMissing: "{{path}} fehlt in Commit {{sha}}",
        scriptSyntaxInvalid:
          "bash -n lehnt {{path}} aus Commit {{sha}} ab. Live-Skript unverändert.",
        scriptRemoteExit: "Remote-Befehl mit Code {{code}} beendet",
      },
    },
  },
};
