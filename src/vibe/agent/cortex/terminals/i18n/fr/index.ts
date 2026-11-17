import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    title: "Terminaux actifs",
    back: "Retour",
    lastCommand: "Dernière commande",
    noTerminals: "Aucun terminal actif",
    noTerminalsHint:
      "Lancez une commande avec Exécuter une commande pour ouvrir une session de terminal.",
    openExec: "Exécuter une commande",
    terminalCount: "terminaux",
    machineLabel: "Machine",
    cwdLabel: "cwd",
    statusLabel: "Statut",
    openedLabel: "Ouvert",
    openTerminal: "Ouvrir",
    manageConnections: "Connexions",
    activeStatus: "Actif",
  },
  get: {
    title: "Lister les terminaux",
    titleShort: "Terminaux",
    description:
      "Liste les sessions de terminal actives avec leur répertoire de travail courant.",
    dynamicTitle: "Terminaux : {{path}}",
    status: {
      loading: "Chargement...",
      done: "Chargé",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Machine",
        description:
          "Filtrer sur une machine précise, ex. /ssh/local-machine. Laissez vide pour tout lister.",
      },
    },
    response: {
      terminals: {
        terminalId: { content: "ID du terminal" },
        connectionSlug: { content: "Machine" },
        cwd: { content: "Répertoire de travail" },
        name: { content: "Nom" },
        openedAt: { content: "Ouvert" },
        lastCommandAt: { content: "Dernière commande" },
        status: { content: "Statut" },
      },
      total: { text: "Total" },
    },
    errors: {
      validation: {
        title: "Saisie invalide",
        description: "Vérifiez le chemin",
      },
      network: { title: "Hors ligne", description: "Serveur injoignable" },
      unauthorized: {
        title: "Non connecté",
        description: "Connectez-vous d'abord",
      },
      forbidden: {
        title: "Accès refusé",
        description: "Non autorisé",
      },
      notFound: {
        title: "Introuvable",
        description: "Aucun terminal trouvé",
      },
      server: {
        title: "Erreur serveur",
        description: "Quelque chose a planté",
      },
      unknown: { title: "Erreur", description: "Une erreur s'est produite" },
      unsavedChanges: {
        title: "Modifications non enregistrées",
        description: "Enregistrez ou annulez d'abord",
      },
      conflict: {
        title: "Conflit",
        description: "Opération en conflit",
      },
    },
    success: {
      title: "Terminaux listés",
      description: "Terminaux actifs chargés",
    },
  },
};
