import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Comptabilité, CRM et IA auto-hébergés | {{appName}}",
    description:
      "Comptabilité en partie double, facturation, achats, stock, caisse, CRM et newsletters dans une seule app open source. Sur votre serveur. Chaque fonction est un outil que votre IA peut utiliser.",
    category: "Entreprise",
    imageAlt: "{{appName}} auto-hébergé : comptabilité, CRM et IA",
    keywords:
      "logiciel de comptabilité auto-hébergé, ERP open source, comptabilité open source, comptabilité en partie double, logiciel de facturation, comptabilité IA, CRM auto-hébergé, {{appName}}",
  },
  hero: {
    badge: "Suite de gestion open source",
    title: "Vos comptes. Votre serveur.",
    titleHighlight: "L'IA incluse.",
    subtitle:
      "Comptabilité en partie double, facturation, achats, stock, caisse, CRM et newsletters dans une seule app open source. Elle tourne sur votre serveur. Chaque fonction est un outil que votre IA sait utiliser.",
    ctaStart: "L'installer chez vous",
    ctaGithub: "Voir sur GitHub",
    shotAlt: "Balance générale d'une société de démo : débit égal crédit",
    stats: {
      actions: "actions que votre IA peut lancer",
      reports: "rapports en direct du grand livre",
      charts: "plans comptables : SKR03, ÖKR, SK, IFRS",
      languages: "langues intégrées",
    },
  },
  trialBalance: {
    sample: "Extrait du rapport · {{date}} · EUR",
    account: "Compte",
    debit: "Débit",
    credit: "Crédit",
    bank: "Banque",
    sales: "Ventes",
    wages: "Salaires",
    total: "Total du rapport",
    open: "Voir le rapport complet",
  },
  ledger: {
    eyebrow: "La compta",
    title: "Partie double. Sans exception.",
    intro:
      "Factures clients, factures fournisseurs, paiements et ventes en caisse arrivent seuls dans le grand livre, y compris les écritures multidevises avec taux quotidiens BCE, écarts de change réalisés et réévaluation de fin de période. Débit égal crédit, sinon rien n'est comptabilisé.",
    points: {
      balanced: {
        title: "Équilibrée ou refusée",
        body: "Chaque écriture exige au moins deux lignes et un équilibre exact. Vérifié à la création, à la validation et à l'extourne.",
      },
      final: {
        title: "Validée, c'est définitif",
        body: "Aucune retouche en douce. Une erreur se corrige par une extourne qui reprend l'original et y renvoie.",
      },
      periods: {
        title: "Des périodes qui se clôturent",
        body: "Les écritures doivent tomber dans une période ouverte. Pas de clôture tant qu'il reste des brouillons, et l'auteur est enregistré.",
      },
      templates: {
        title: "Partez de votre pays",
        body: "Allemagne (SKR03), Autriche (ÖKR) ou Slovaquie (SK) : taux de TVA, caisse et compte bancaire inclus. Ailleurs : un plan comptable IFRS générique, vous ajoutez vos taux.",
      },
    },
    reportsLabel: "Rapports, en direct depuis le grand livre",
    reports: {
      balanceSheet: "Bilan",
      profitLoss: "Compte de résultat",
      trialBalance: "Balance générale",
      aging: "Balance âgée clients",
      vat: "Rapport de TVA",
      payablesAging: "Balance âgée fournisseurs",
      journalExport: "Export CSV du journal",
      taxFilings:
        "Déclarations fiscales par pays (DE UStVA/EÜR, AT UVA, SK DPH/KV, TVA générique)",
    },
    shotAlt:
      "Factures fournisseurs avec statut et montants dans l'admin de {{appName}}",
  },
  flows: {
    eyebrow: "Entrées et sorties",
    title: "Du devis au grand livre, sans ressaisie.",
    intro:
      "Chaque document devient le suivant en une action. La comptabilisation se fait en chemin.",
    posted: "Comptabilisé",
    sales: {
      title: "Ventes",
      steps: {
        estimate: "Devis",
        invoice: "Facture",
        payment: "Paiement enregistré",
      },
      note: "Avoirs, factures PDF avec ZUGFeRD et QR code de paiement, envoi par e-mail avec journal de livraison, facturation récurrente et liens de paiement Stripe.",
    },
    purchasing: {
      title: "Achats",
      steps: {
        order: "Bon de commande",
        receipt: "Réception",
        bill: "Facture fournisseur",
        payment: "Réglée",
      },
      note: "Fournisseurs avec taux de TVA par défaut. Livraisons partielles suivies ligne par ligne. Les réceptions entrent en stock.",
    },
    pos: {
      title: "Caisse",
      steps: {
        session: "Ouvrir la caisse",
        order: "Encaisser",
        payment: "Espèces, carte ou virement",
      },
      note: "Les ventes et remboursements déduisent le stock de l'entrepôt de la caisse et comptabilisent le coût des ventes (COGS) avec règle de stock négatif configurable. La clôture vérifie les espèces.",
    },
    inventory: {
      title: "Stock",
      body: "Entrepôts, entrées, sorties et ajustements, transferts entre sites. Chaque mouvement entre dans un journal non modifiable, avec son auteur.",
    },
  },
  suite: {
    eyebrow: "Autour de la compta",
    title: "Le reste de l'entreprise, dans la même app.",
    intro:
      "Un login, une base de données, un admin. Plus de synchronisation entre cinq abonnements.",
    aiLabel: "Tout modèle",
    toolCount: "{{count}} actions",
    cards: {
      crm: {
        title: "CRM et prospects",
        body: "Import de contacts en CSV, suivi des affaires et de la prospection, export à tout moment.",
      },
      newsletter: {
        title: "Newsletter et campagnes",
        body: "Double opt-in, désinscription en un clic, gestion des rebonds, séquences d'e-mails.",
      },
      messaging: {
        title: "Boîte de réception et messagerie",
        body: "Votre boîte mail via IMAP et SMTP, plus SMS, Telegram et WhatsApp Business.",
      },
      payments: {
        title: "Facturation d'abonnements",
        body: "Paiement par Stripe et crypto, webhooks et remboursements pour des offres d'abonnement.",
      },
      team: {
        title: "Sociétés et rôles",
        body: "Plusieurs sociétés sur une instance. Invitez l'équipe comme propriétaire, admin, comptable, membre ou lecteur.",
      },
      ai: {
        title: "Agents planifiés",
        body: "Des agents lancent rapports et contrôles selon un planning. Avec votre compte {{appName}} ou votre propre clé de fournisseur.",
      },
    },
  },
  ai: {
    eyebrow: "Une IA qui travaille",
    title: "Interrogez vos comptes. Des réponses, pas des graphiques.",
    intro:
      "Chaque action comptable est un outil typé. Votre IA appelle le même code que les boutons de l'admin, avec les mêmes contrôles.",
    points: {
      chat: "Demandez avec vos mots. Le modèle lance le rapport et l'explique.",
      cli: "Scriptez la clôture du mois depuis le terminal. Chaque outil est une commande CLI.",
      mcp: "Claude Code, Cursor et Codex accèdent aux mêmes outils via MCP.",
      permissions:
        "Un agent agit au nom de l'utilisateur qui le lance. Même rôle dans la société, mêmes contrôles.",
    },
    demo: {
      label: "Exemple",
      question: "Qui nous doit de l'argent, et avec quel retard ?",
      tool: "Balance âgée clients",
      answer:
        "Trois clients sont en retard, 4 180 EUR au total. Le plus gros, 2 380 EUR, a 47 jours de retard. Je vous donne les numéros de facture ?",
    },
    tabs: {
      cli: "CLI",
      mcp: "MCP",
    },
  },
  compare: {
    eyebrow: "La différence",
    title: "Logiciel comptable SaaS typique ou votre propre serveur.",
    intro:
      "Les outils hébergés sont pratiques. Voici ce que vous cédez en échange, et là où ils gagnent encore.",
    colSaas: "Logiciel comptable SaaS typique",
    colUs: "{{appName}}, auto-hébergé",
    colSaasShort: "SaaS",
    colUsShort: "Auto-hébergé",
    rows: {
      data: {
        label: "Où vivent vos comptes",
        saas: "Dans leur cloud, à leurs conditions",
        us: "Sur votre serveur, dans votre Postgres",
      },
      seats: {
        label: "Prix par utilisateur",
        saas: "Abonnement mensuel par poste",
        us: "Pas de frais par poste. Vous payez l'hébergement et l'IA que vous utilisez.",
      },
      ai: {
        label: "IA",
        saas: "En option, ou absente",
        us: "Chaque fonction est un outil IA, avec n'importe quel modèle",
      },
      code: {
        label: "Code source",
        saas: "Fermé",
        us: "Ouvert sur GitHub",
      },
      missing: {
        label: "Une fonction manque",
        saas: "Attendre la feuille de route",
        us: "La construire : un fichier de définition",
      },
      exit: {
        label: "Partir",
        saas: "Exporter ce qu'ils autorisent",
        us: "C'est déjà votre base de données",
      },
      filings: {
        label: "Flux bancaires et déclarations",
        saas: "Souvent intégrés",
        us: "Intégrés : flux Enable Banking, import de relevés (CAMT.053, MT940, CSV) et rapprochement, plus exports DE UStVA/EÜR, AT UVA, SK DPH/KV et TVA générique.",
      },
      hosting: {
        label: "Exploitation",
        saas: "Gérée pour vous",
        us: "Vous l'exploitez. On aide si vous demandez.",
      },
    },
  },
  start: {
    eyebrow: "Installation",
    title: "Trois commandes. Puis créez votre société.",
    intro:
      "Cloner, installer, lancer. L'assistant règle le compte admin et l'IA. Ensuite, ajoutez votre société dans l'admin. Allemagne, Autriche ou Slovaquie : plan comptable, taux de TVA, caisse et compte bancaire en une étape. Ailleurs : un plan IFRS générique comme base.",
    terminalTitle: "Lancer votre instance",
    guide: "Guide complet d'auto-hébergement",
    developers: "Créer vos propres modules",
  },
  code: {
    copy: "Copier",
    copied: "Copié",
    wrap: "Retour à la ligne",
  },
  help: {
    title: "Vous y migrez une entreprise ?",
    description:
      "Aide à l'installation, reprise de données, modules sur mesure. Un humain lit chaque message.",
  },
};
