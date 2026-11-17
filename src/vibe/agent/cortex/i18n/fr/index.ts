/* eslint-disable i18next/no-literal-string */
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    cortex: "Cortex",
  },
  category: "Cortex",
  scaffold: {
    roots: {
      memories: "memoires",
      documents: "documents",
    },
    memories: {
      identity: {
        path: "identite",
        purpose: "Qui vous êtes : nom, rôle, objectifs, style de communication",
      },
      expertise: {
        path: "expertise",
        purpose: "Ce que vous savez : compétences, outils, parcours",
      },
      context: {
        path: "contexte",
        purpose:
          "Situation actuelle : projets en cours, préférences, contraintes",
      },
      life: {
        path: "vie",
        purpose:
          "Objectifs de vie et situation actuelle : carrière, santé, relations, finances, développement, sens",
      },
    },
    documents: {
      inbox: {
        path: "boite-de-reception",
        purpose:
          "Captures brutes : déposez ici en vitesse, traitez et classez quand le contexte est clair",
        icon: "inbox",
      },
      projects: {
        path: "projets",
        purpose: "Travail en cours : un sous-dossier par projet",
        icon: "folder-open",
      },
      knowledge: {
        path: "connaissances",
        purpose:
          "Référence permanente : ce qui mérite d'être gardé pour toujours",
        icon: "book-open",
      },
      journal: {
        path: "journal",
        purpose: "Entrées datées : idées, réflexions, observations",
        icon: "pen-line",
      },
      templates: {
        path: "modeles",
        purpose: "Structures réutilisables pour les tâches récurrentes",
        icon: "layout-template",
      },
    },
  },
  templates: {
    memories: {
      identity: {
        name: {
          path: "nom.md",
          content: `---\npriority: 100\ntags: [identite]\n---\n\n<!-- Votre nom et la façon dont vous préférez être appelé. L'IA le complètera lors de votre première conversation. -->\n`,
        },
        role: {
          path: "role.md",
          content: `---\npriority: 100\ntags: [identite, travail]\n---\n\n<!-- Votre rôle professionnel, ce que vous faites et le contexte dans lequel vous travaillez. -->\n`,
        },
        goals: {
          path: "objectifs.md",
          content: `---\npriority: 90\ntags: [identite, objectifs]\n---\n\n<!-- Vos objectifs principaux : ce que vous voulez construire, atteindre ou améliorer. À court et à long terme. -->\n`,
        },
        communication: {
          path: "communication.md",
          content: `---\npriority: 85\ntags: [identite, style]\n---\n\n<!-- Votre façon préférée de communiquer : ton, profondeur, format, ce qui vous agace, ce que vous appréciez. -->\n`,
        },
      },
      expertise: {
        skills: {
          path: "competences.md",
          content: `---\npriority: 80\ntags: [expertise]\n---\n\n<!-- Vos compétences techniques et professionnelles. Ce que vous maîtrisez, ce que vous apprenez. -->\n`,
        },
        tools: {
          path: "outils.md",
          content: `---\npriority: 75\ntags: [expertise, tech]\n---\n\n<!-- Outils, langages, frameworks et plateformes que vous utilisez régulièrement. Votre stack préférée. -->\n`,
        },
        background: {
          path: "parcours.md",
          content: `---\npriority: 70\ntags: [expertise]\n---\n\n<!-- Votre parcours, votre expérience et comment vous en êtes arrivé là. Cela donne le contexte de chaque échange. -->\n`,
        },
      },
      context: {
        projects: {
          path: "projets.md",
          content: `---\npriority: 80\ntags: [contexte, projets]\n---\n\n<!-- Projets en cours : ce sur quoi vous travaillez, ce qui compte le plus en ce moment. -->\n`,
        },
        preferences: {
          path: "preferences.md",
          content: `---\npriority: 70\ntags: [contexte]\n---\n\n<!-- Préférences de travail : comment vous aimez travailler, ce qui vous ralentit, ce qui vous aide à vous concentrer. -->\n`,
        },
        constraints: {
          path: "contraintes.md",
          content: `---\npriority: 65\ntags: [contexte]\n---\n\n<!-- Contraintes, règles strictes et points non négociables sur la façon dont l'IA doit se comporter avec vous. -->\n`,
        },
      },
      life: {
        career: {
          path: "carriere.md",
          content: `---\npriority: 90\ntags: [vie, carriere, objectifs]\n---\n\n## Situation actuelle\n\n<!-- Que faites-vous vraiment comme travail en ce moment ? Rôle, entreprise/projet, niveau de revenu, satisfaction de 1 à 10. -->\n\n## Objectifs\n\n<!-- Court terme (ce mois-ci) : -->\n<!-- Moyen terme (cette année) : -->\n<!-- Long terme (3 à 5 ans) : -->\n\n## Projets en cours\n\n<!-- Quels projets de /documents/projets/ servent votre carrière en ce moment ? Quel est le lien ? -->\n\n## Obstacles\n\n<!-- Qu'est-ce qui changerait tout une fois résolu ? Quel est le plus gros obstacle ? -->\n\n## Tendances\n\n<!-- Thèmes récurrents de votre carrière : ce vers quoi vous revenez toujours, ce qui vous épuise, ce qui vous dynamise. -->\n`,
        },
        health: {
          path: "sante.md",
          content: `---\npriority: 90\ntags: [vie, sante, objectifs]\n---\n\n## Situation actuelle\n\n<!-- Un état des lieux honnête : forme physique, état mental, qualité du sommeil, pathologies ou inquiétudes éventuelles. -->\n\n## Routines\n\n<!-- Ce que vous faites vraiment (pas ce que vous prévoyez de faire). Sport, horaires de sommeil, habitudes alimentaires. -->\n\n## Énergie\n\n<!-- Qu'est-ce qui vous recharge ? Qu'est-ce qui vous vide ? À quel moment de la journée ou de la semaine êtes-vous le plus vif ? -->\n\n## Objectifs\n\n<!-- Court terme (ce mois-ci) : -->\n<!-- Long terme (cette année) : -->\n\n## Obstacles\n\n<!-- Qu'est-ce qui empêche une meilleure santé ? Temps, motivation, connaissances, environnement ? -->\n`,
        },
        relationships: {
          path: "relations.md",
          content: `---\npriority: 85\ntags: [vie, relations, objectifs]\n---\n\n## Cercle proche\n\n<!-- Les 3 à 5 personnes qui comptent le plus. Partenaire, famille, amis les plus proches. Où en êtes-vous avec chacun ? -->\n\n## Situation actuelle\n\n<!-- État général de vos relations. De qui êtes-vous proche ? De qui vous êtes-vous éloigné ? -->\n\n## Investissement\n\n<!-- Qui a besoin de plus de vous en ce moment ? Où investissez-vous trop, où pas assez ? -->\n\n## Objectifs\n\n<!-- Que voulez-vous construire ou réparer dans vos relations cette année ? -->\n\n## Obstacles\n\n<!-- Qu'est-ce qui bloque ? Temps, distance, conflit non résolu, évitement ? -->\n`,
        },
        finances: {
          path: "finances.md",
          content: `---\npriority: 85\ntags: [vie, finances, objectifs]\n---\n\n## Situation actuelle\n\n<!-- Revenus mensuels face aux dépenses. Épargne. Dettes. Stabilité de 1 à 10. -->\n\n## Filet de sécurité\n\n<!-- Combien de mois pourriez-vous tenir sans revenu ? Quelle est votre marge ? -->\n\n## Objectifs\n\n<!-- Court terme (ce mois-ci) : -->\n<!-- Long terme (cette année) : -->\n\n## Croissance\n\n<!-- Comment construisez-vous votre patrimoine ou votre sécurité financière ? Placements, revenus annexes, compétences qui rapportent. -->\n\n## Obstacles\n\n<!-- Quel est le plus gros risque ou obstacle financier en ce moment ? -->\n`,
        },
        growth: {
          path: "developpement.md",
          content: `---\npriority: 85\ntags: [vie, developpement, apprentissage, objectifs]\n---\n\n## Priorité actuelle\n\n<!-- Qu'apprenez-vous ou que développez-vous activement en ce moment ? Qu'est-ce qui fait tilt ? -->\n\n## Compétences manquantes\n\n<!-- Quelle compétence ou connaissance, une fois acquise, vous ferait passer au niveau supérieur ? -->\n\n## Objectifs\n\n<!-- Que voulez-vous apprendre ou maîtriser cette année ? Soyez précis. -->\n\n## Ressources\n\n<!-- Livres, cours, mentors, communautés qui vous aident. Qu'est-ce qui fonctionne ? -->\n\n## Obstacles\n\n<!-- Qu'est-ce qui freine votre progression ? Temps, concentration, accès, peur ? -->\n`,
        },
        purpose: {
          path: "sens.md",
          content: `---\npriority: 95\ntags: [vie, sens, valeurs, objectifs]\n---\n\n## Cap\n\n<!-- Une ou deux phrases : quel est le fond de votre vie ? Qu'êtes-vous venu faire ou construire ? -->\n\n## Valeurs fondamentales\n\n<!-- 3 à 5 valeurs qui guident vos décisions. Pas des aspirations : des principes que vous appliquez vraiment. -->\n\n## À quoi ressemble la réussite\n\n<!-- Dans 5 ans, à quoi ressemble une vie bien vécue, pour vous précisément ? -->\n`,
        },
      },
    },
    documents: {
      meetingNotes: {
        path: "notes-de-reunion.md",
        content: `---\ntype: template\ntags: [reunions, modele]\n---\n\n# Notes de réunion - [Date]\n\n**Participants :**\n**Objet :**\n\n## Contexte\n\nRappel rapide des raisons de cette réunion.\n\n## Ordre du jour\n\n1.\n2.\n3.\n\n## Décisions clés\n\n-\n\n## Actions\n\n- [ ] @personne - tâche - échéance [date]\n\n## Notes\n\n---\n*Classé depuis : /documents/boite-de-reception*\n`,
      },
      projectBrief: {
        path: "fiche-projet.md",
        content: `---\ntype: template\ntags: [projets, modele]\nstatus: draft\n---\n\n# Fiche projet : [Nom]\n\n**Responsable :**\n**Début :**\n**Échéance :**\n\n## Problème\n\nQu'est-ce qui casse ou fait mal sans ce projet ? Un paragraphe, sans remplissage.\n\n## Objectif\n\nUne phrase. Un résultat précis. Mesurable si possible.\n\n## Périmètre\n\n**Inclus :**\n-\n\n**Exclu :**\n-\n\n## Critères de réussite\n\n- [ ]\n- [ ]\n\n## Risques\n\n| Risque | Probabilité | Impact | Parade |\n|--------|-------------|--------|--------|\n|        |             |        |        |\n\n## Ressources\n\nLiens, références, travaux existants.\n`,
      },
      weeklyReview: {
        path: "bilan-hebdo.md",
        content: `---\ntype: template\ntags: [bilan, hebdo, modele]\n---\n\n# Semaine du [Date]\n\n## Ce qui est sorti\n\n-\n\n## Ce qui n'est pas sorti\n\n-\n\n## Obstacles rencontrés\n\n-\n\n## Ce que j'ai appris\n\n-\n\n## Priorités de la semaine prochaine\n\n1.\n2.\n3.\n\n## Niveau d'énergie (1-10)\n\nTravail :\nPerso :\n\n---\n*Moins de 200 mots. La vitesse compte plus que l'exhaustivité.*\n`,
      },
      decisionLog: {
        path: "journal-des-decisions.md",
        content: `---\ntype: template\ntags: [decisions, architecture, modele]\n---\n\n# Décision : [Titre]\n\n**Date :**\n**Statut :** proposée | acceptée | remplacée | obsolète\n**Décideurs :**\n\n## Contexte\n\nQuelle situation a imposé cette décision ? Quelles contraintes existent ?\n\n## Options envisagées\n\n### Option A - [Nom]\n\n**Pour :**\n**Contre :**\n\n### Option B - [Nom]\n\n**Pour :**\n**Contre :**\n\n## Décision\n\nNous avons choisi **l'option [X]** parce que :\n\n## Conséquences\n\n**Positives :**\n**Négatives :**\n**Neutres :**\n\n---\n*Liez ce fichier depuis la fiche projet ou le commentaire de code concerné.*\n`,
      },
      knowledgeArticle: {
        path: "fiche-connaissance.md",
        content: `---\ntype: template\ntags: [connaissances, reference, modele]\n---\n\n# [Sujet]\n\n**Dernière vérification :**\n**Source :**\n\n## Résumé\n\nUn paragraphe. De quoi s'agit-il, pourquoi c'est important, quand cela s'applique-t-il ?\n\n## Fonctionnement\n\nLe mécanisme de base. Sans remplissage : juste ce qu'il faut pour comprendre ou appliquer.\n\n## Quand l'utiliser\n\n-\n-\n\n## Quand NE PAS l'utiliser\n\n-\n\n## Exemples\n\n\`\`\`\ncollez un exemple ici\n\`\`\`\n\n## Références\n\n-\n`,
      },
    },
  },
  enums: {
    nodeType: {
      file: "Fichier",
      dir: "Dossier",
    },
    viewType: {
      list: "Liste",
      kanban: "Kanban",
      calendar: "Calendrier",
      grid: "Grille",
      wiki: "Wiki",
    },
    syncPolicy: {
      sync: "Synchroniser",
      local: "Local uniquement",
    },
    creditFeature: {
      write: "Écriture",
      edit: "Modification",
      search: "Recherche",
      embedding: "Embedding",
    },
  },
  mounts: {
    memory: "Mémoire",
    document: "Document",
    thread: "Fil",
    skill: "Skill",
    task: "Tâche",
    upload: "Fichier envoyé",
    search: "Recherche",
    favorite: "Favori",
    gen: "Généré",
    ssh: "Connexion SSH",
  },
  button: {
    label: "Cortex",
    title: "Cortex : la mémoire de l'IA",
    unavailableTitle: "Cortex indisponible",
    unavailableDescription:
      "Le Cortex n'est disponible que dans les fils privés et partagés. Lancez un fil privé pour utiliser la mémoire de votre IA.",
  },
  nav: {
    back: "Retour",
    actions: {
      list: "Parcourir",
      read: "Afficher",
      write: "Écrire",
      edit: "Modifier",
      delete: "Supprimer",
      move: "Déplacer",
      search: "Rechercher",
      tree: "Arborescence",
    },
  },
};
