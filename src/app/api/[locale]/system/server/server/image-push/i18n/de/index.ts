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
      tag: {
        title: "Tag",
        description:
          "Image-Tag. Standardmäßig der aktuelle kurze Git-Commit-SHA. 'latest' wird immer zusätzlich getaggt und gepusht.",
      },
      push: {
        title: "Pushen",
        description:
          "Nach dem Bauen in die Registry pushen. Deaktivieren für einen rein lokalen Build - Pushen erfordert vorher 'docker login'.",
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
        description: "Docker-Build oder -Push fehlgeschlagen: {{error}}",
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
        gitShaFailed:
          "Der aktuelle Git-Commit-SHA konnte nicht ermittelt werden",
        sshTransferStart: "📡 Übertrage {{refs}} per ssh an {{target}} ...",
        sshTransferSuccess: "🚀 {{refs}} per ssh an {{target}} übertragen",
        sshTransferFailed:
          "ssh-Übertragung an {{target}} fehlgeschlagen: {{error}}",
      },
    },
  },
};
