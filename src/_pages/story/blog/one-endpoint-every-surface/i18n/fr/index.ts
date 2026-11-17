import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Un endpoint. Toutes les surfaces. | next-vibe",
    description:
      "Un seul definition.ts par fonctionnalité. Il s'affiche à la fois en formulaire web, commande CLI, outil MCP, écran natif et tâche cron. Zéro duplication. Types imposés.",
    category: "Architecture",
    imageAlt:
      "Architecture à surface unifiée de next-vibe : un endpoint, toutes les plateformes",
    keywords:
      "next-vibe, TypeScript, surface unifiée, MCP, CLI, definition.ts, open source, framework SaaS",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Architecture",
    readTime: "5 min de lecture",
    title: "Un endpoint. Toutes les surfaces.",
    subtitle:
      "Une définition par fonctionnalité. Formulaire web, commande CLI, outil MCP, écran natif, tâche cron : tout d'un coup. Zéro duplication.",
  },
  intro: {
    paragraph1:
      "Chaque fonctionnalité demandait un formulaire web, une commande CLI, un outil MCP pour les agents IA, parfois un écran mobile. Même validation Zod, même i18n, même gestion d'erreurs, juste un habillage différent. J'ai donc construit next-vibe : un framework où vous écrivez un seul definition.ts par fonctionnalité, et il s'affiche sur toutes ces surfaces à la fois.",
    paragraph2:
      "C'est aussi le moteur de {{appName}} : {{modelCount}} modèles d'IA, une censure que l'utilisateur contrôle. Le même code tourne comme application web Next.js, serveur de dev TanStack/Vite, application mobile React Native, CLI, serveur MCP, système cron et bus d'événements WebSocket. Une seule définition d'endpoint. Zéro duplication.",
  },
  typeRules: {
    title: "Les types doivent s'aligner. Sans exception.",
    subtitle:
      "Ce ne sont pas des préférences de style. Ce sont des règles d'architecture gravées dans le framework.",
    intro:
      "La règle est stricte : les types doivent s'aligner complètement. Si vos types sont faux, votre architecture est fausse. Nous avons créé vibe check pour l'imposer : Oxlint + ESLint + TypeScript en parallèle, avec des plugins maison pour les règles propres au projet.",
    any: {
      name: "pas de any",
      description:
        "Remplacez-le par une vraie interface typée. Si vous sortez any, votre architecture a un trou.",
    },
    unknown: {
      name: "pas de unknown",
      description:
        "Même règle. unknown, c'est any avec des étapes en plus. Définissez le type.",
    },
    object: {
      name: "pas de object nu",
      description:
        "Un object nu ne veut rien dire. Écrivez la forme que vous attendez vraiment.",
    },
    asX: {
      name: "pas de as X",
      description:
        "Les assertions de type sont des mensonges au compilateur. Corrigez plutôt l'architecture.",
    },
    throwStatements: {
      name: "pas de throw",
      description:
        "Utilisez ResponseType<T> avec success(data) ou fail({message, errorType}). Les erreurs sont des données, pas des exceptions.",
    },
    hardcodedStrings: {
      name: "pas de chaînes en dur dans le JSX",
      description:
        "Le vérificateur repère les chaînes littérales non traduites. Chaque chaîne a besoin d'une clé de traduction.",
    },
  },
  vibeSense: {
    title: "Le moteur de graphes né par accident",
    subtitle: "Un bot de trading qui ne sait pas trader",
    description:
      "Vibe Sense a commencé comme bot de trading. Il n'a jamais passé d'ordre : il surveillait les prix et émettait des signaux. Quand je l'ai abandonné, l'architecture en pipeline a survécu : les sources de données alimentent des indicateurs, les indicateurs nourrissent des évaluateurs, les évaluateurs émettent des signaux, les signaux déclenchent des actions. Chaque nœud est un endpoint HTTP.",
    quote:
      "Chaque nœud du graphe n'est qu'un endpoint HTTP : vous pouvez faire un curl sur n'importe quelle étape du pipeline, la tester isolément ou l'appeler depuis un agent IA. Le moteur de graphes est un planificateur, pas un DSL.",
    whyItMatters:
      "Comme chaque nœud est un endpoint standard, il se teste seul via la CLI, reste accessible aux agents IA via MCP et se met en cache avec la même infra que tout le reste. Le moteur de graphes n'invente pas son propre langage. Il planifie des endpoints.",
  },
  cta: {
    title: "Lisez le code. Lancez-le vous-même.",
    subtitle:
      "next-vibe est open source. Clonez-le, lancez vibe dev et déployez votre premier endpoint sur toutes les surfaces en un après-midi.",
    github: "Voir sur GitHub",
    clone: "git clone https://github.com/techfreaque/next-vibe",
    framework: "Découvrir next-vibe",
  },
};
