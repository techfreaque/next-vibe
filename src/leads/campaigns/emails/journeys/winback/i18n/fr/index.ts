import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  initial: {
    subject: "nous avons remarqué votre départ",
    previewText: "sans rancune, nous voulions juste prendre des nouvelles",
    greeting: "Bonjour,",
    noticed:
      "Nous avons remarqué que votre abonnement a pris fin. Pas de forcing ici : nous voulions vous écrire une fois pour savoir si nous aurions pu faire mieux.",
    whatChanged:
      "Si vous êtes parti pour une raison précise, nous aimerions sincèrement la connaître. Répondez à cet e-mail.",
    noHardFeelings:
      "Si ça ne vous correspondait simplement pas, c'est très bien aussi. Nous n'enverrons que quelques messages de plus, puis nous vous laisserons tranquille.",
    signature: "L'équipe unbottled.ai",
  },
  followup1: {
    subject: "ce qui a changé depuis votre départ",
    previewText: "quelques nouveautés à connaître",
    greeting: "Bonjour,",
    improvements:
      "Depuis votre résiliation, nous avons livré plusieurs améliorations importantes qui répondent peut-être à ce qui ne vous convenait pas.",
    specificChange:
      "Les réponses sont désormais 3 fois plus rapides. Nous avons ajouté 12 nouveaux modèles. Et nous avons repensé l'interface à partir des retours des abonnés.",
    openDoor:
      "Si l'un de ces points vous parle, nous proposons un essai gratuit de 14 jours aux anciens abonnés. Sans condition.",
    signature: "L'équipe unbottled.ai",
  },
  followup2: {
    subject: "offre spéciale de retour",
    previewText: "30 % de réduction sur votre premier mois",
    greeting: "Bonjour,",
    specialOffer:
      "Nous voulons vous faciliter le retour pour découvrir ce que nous avons construit. Pendant les 7 prochains jours, les anciens abonnés bénéficient de 30 % de réduction sur leur premier mois.",
    offerDetails:
      "Utilisez le code COMEBACK30 au moment du paiement. Sans engagement : résiliable à tout moment, comme avant.",
    signature: "L'équipe unbottled.ai",
  },
  followup3: {
    subject: "notre dernier message",
    previewText: "nous vous laisserons tranquille après celui-ci",
    greeting: "Bonjour,",
    lastAttempt:
      "C'est le dernier e-mail que nous vous envoyons pour vous proposer de revenir sur unbottled.ai. Nous ne voulons pas être pénibles.",
    honesty:
      "Si un jour vous voulez de nouveau accéder à une IA non censurée, pour vos contenus, vos recherches, l'écriture créative ou autre chose, nous serons là. L'offre ci-dessous reste toujours valable.",
    signature: "L'équipe unbottled.ai",
  },
  nurture: {
    subject: "grosse mise à jour chez unbottled.ai",
    previewText: "nous avons fait du chemin",
    greeting: "Bonjour,",
    majorUpdate:
      "Cela fait un moment que vous n'êtes plus abonné. Nous avons beaucoup progressé : nouveaux modèles, meilleures performances, interface repensée et accès API pour les utilisateurs avancés.",
    gentleInvite:
      "Si vous cherchez une IA performante et sans restrictions, nous serions ravis de vous revoir. L'essai gratuit est toujours disponible.",
    signature: "L'équipe unbottled.ai",
  },
  reactivation: {
    subject: "toujours là si vous avez besoin de nous",
    previewText: "un dernier mot",
    greeting: "Bonjour,",
    longTime:
      "Cela fait longtemps que vous n'êtes plus abonné à unbottled.ai. Nous construisons toujours la même chose : une plateforme d'IA qui respecte votre intelligence et votre temps.",
    finalOffer:
      "Si vous décidez un jour de retrouver un accès à une IA sans restrictions, nous serons là. Sans pression, et plus aucun e-mail après celui-ci.",
    signature: "L'équipe unbottled.ai",
  },
};
