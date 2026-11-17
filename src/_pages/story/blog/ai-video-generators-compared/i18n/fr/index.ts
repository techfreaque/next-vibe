import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Meilleur générateur de vidéo IA : {{modelCount}} modèles, Kling vs Seedance | {{appName}}",
    description:
      "{{modelCount}} générateurs de vidéo IA comparés : Kling vs Seedance, Veo 3.1 vs Sora 2, Wan 3.0, Hailuo. Texte et image vers vidéo, vrais prix, aucun filigrane de notre part.",
    category: "Comparatif de modèles",
    imageAlt: "{{appName}} : générateurs de vidéo IA comparés côte à côte",
    keywords:
      "meilleur générateur de vidéo IA, générateur de vidéo IA, Kling vs Seedance, Seedance 2.0, Seedance 2.5, Kling 3.0, Veo 3.1 vs Sora 2, Veo 3.1, Sora 2, Wan 3.0, Hailuo 3, Grok Imagine vidéo, Gemini Omni, Runway Gen-4.5, image vers vidéo IA, texte vers vidéo IA, générateur de vidéo IA sans filigrane, générateur de vidéo IA prix par seconde, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif de modèles",
    readTime: "10 min de lecture",
    title: "{{modelCount}} générateurs de vidéo IA. Un seul solde. Comparés.",
    subtitle:
      "Kling vs Seedance, Veo vs Sora, Wan, Hailuo, Grok Imagine et Gemini Omni. Le vrai prix par seconde, les vraies durées de clip, le contrôle des images clés et le son. Choisissez le modèle adapté au plan, puis générez-le depuis n'importe quelle discussion sur {{appName}}.",
  },
  intro: {
    lead: "Chaque labo présente son modèle comme le meilleur générateur de vidéo IA. Chacun veut son appli, ses crédits, son abonnement. Vous, vous voulez une seule chose : le bon clip pour le bon usage, à un prix affiché avant de cliquer sur générer.",
    p2: "{{appName}} fait tourner {{modelCount}} modèles vidéo de {{labCount}} labos sur un seul solde de crédits : Veo, Sora, Kling, Seedance, Wan, Hailuo, Grok Imagine, Gemini Omni, Runway et d'autres. Ci-dessous, tous côte à côte, directement issus de notre registre de modèles en temps réel : entrées, contrôle des images clés, durée, résolution, son et vrai prix par seconde. Ensuite, les choix par usage, les duels, comment créer un clip depuis n'importe quelle discussion, et les limites que personne n'affiche sur sa page d'accueil.",
  },
  table: {
    title: "Les {{modelCount}} modèles vidéo, côte à côte",
    intro:
      "Tous les modèles actuels de {{labCount}} labos, du moins cher à la seconde au plus cher. Les prix incluent notre marge de {{markup}} %. 1 crédit = {{creditValue}}.",
    colModel: "Modèle",
    colInput: "Entrée",
    colFrames: "Images clés",
    colLength: "Durée",
    colResolution: "Résolution",
    colAudio: "Audio",
    colRate: "Crédits / s",
    colClip: "Clip via chat",
    i2v: "Texte ou image",
    t2v: "Texte",
    v2v: "Texte et vidéo",
    videoAudio: "Vidéo et audio",
    framesFirst: "Première image",
    framesFirstLast: "Première et dernière image",
    framesNone: "Pas de contrôle des images",
    secondsFixed: "{{max}} s",
    seconds: "{{min}} à {{max}} s",
    resolutionDefault: "Par défaut du fournisseur",
    audioYes: "Audio natif",
    audioNo: "Muet",
    withImage: "Avec image : {{credits}}",
    clipValue: "{{credits}} crédits, {{seconds}} s",
    footnote:
      "Crédits / s correspond au tarif à la résolution par défaut du modèle. Quand la résolution change le prix, la petite ligne indique chaque tarif. « Avec image » est le tarif appliqué quand une image jointe bascule la tâche vers la route image du modèle. Clip via chat indique le coût d'une requête depuis le chat : {{seconds}} secondes demandées, arrondies à la durée la plus proche prise en charge par le modèle.",
    allModels: "Voir tous les modèles avec leurs specs complètes",
  },
  picks: {
    title: "Le meilleur générateur de vidéo IA pour chaque usage",
    intro:
      "Il n'y a pas de meilleur absolu. Il y a le plus adapté au plan. Six usages, les modèles qui y répondent, et les faits concrets pour chacun.",
    factLine:
      "{{rate}} crédits/s · jusqu'à {{max}} s · {{resolution}} · {{audio}} · {{frames}}",
    quality: {
      title: "Meilleure qualité : le plan final",
      body: "Quand le clip est le livrable. Réalisme cinématographique, physique crédible, finition soignée. Ces modèles sont en haut de la fourchette de prix : peaufinez le prompt sur un modèle bon marché, puis faites le rendu ici.",
    },
    budget: {
      title: "Le moins cher : brouillons et volume",
      body: "Testez des prompts, itérez sur le mouvement, alimentez les réseaux sociaux en volume. Moins de détails, une facture bien plus légère. La plupart de vos essais ont leur place ici.",
    },
    long: {
      title: "Clips les plus longs : une seule prise continue",
      body: "Jusqu'à {{longestSeconds}} secondes en un seul clip. Moins de coupes, moins de raccords visibles. Réglez la durée sur la page du générateur vidéo ; une requête depuis le chat demande {{seconds}} secondes.",
    },
    frames: {
      title: "Contrôle de la première et de la dernière image",
      body: "Fournissez la première image et la dernière, le modèle génère le mouvement entre les deux. Transitions, révélations produit, boucles propres. {{lastFrameCount}} modèles acceptent une dernière image.",
    },
    audio: {
      title: "Son natif dans la même passe",
      body: "Image et audio en une seule génération : ambiance, effets et, sur certains modèles, dialogues. Pas d'étape son séparée, pas de synchronisation à la main. {{audioCount}} modèles génèrent le son nativement.",
    },
    editing: {
      title: "Spécialistes : avatars, synchro labiale, montage",
      body: "Pas pour créer des scènes à partir d'un prompt. Omnihuman 1.5 anime une personne à partir d'une photo et d'une piste audio. Lipsync 2 cale les lèvres d'une vidéo existante sur une nouvelle voix. Gen4 Aleph modifie une vidéo existante : ajouter ou retirer des objets, changer le style, l'éclairage, l'angle de caméra.",
    },
  },
  versus: {
    title: "Face à face : les duels les plus recherchés",
    intro:
      "Quatre comparaisons qui reviennent sans cesse. Ce pour quoi chaque modèle est conçu, et quand choisir lequel.",
    pairTitle: "{{a}} vs {{b}}",
    klingSeedance:
      "{{a}} est le choix rapport qualité-prix de la gamme Kling 3 : mouvement vivant et convaincant, audio natif, première et dernière image, clips jusqu'à {{aMax}} secondes. La limite : 720p au maximum. {{b}} monte jusqu'en 4K et accepte des références qui gardent les personnages récurrents cohérents d'un plan à l'autre. À la seconde : {{aRate}} crédits pour {{a}}, {{bRate}} pour {{b}}. Brouillons et clips pour les réseaux : {{a}}. Plans narratifs avec le même personnage scène après scène : {{b}}.",
    veoSora:
      "{{a}} est le modèle phare de Google : réalisme cinématographique, audio natif avec dialogues et effets, première et dernière image, une image comme plan d'ouverture, jusqu'en 4K. {{b}} est celui d'OpenAI, réputé pour sa physique crédible. Sur cette plateforme, il n'accepte que du texte, et uniquement en paysage. Durée max : {{aMax}} secondes pour {{a}}, {{bMax}} pour {{b}}. À la seconde : {{aRate}} crédits contre {{bRate}}. Besoin de son ou d'une image de départ : {{a}}. Prompt purement textuel, prise plus longue : {{b}}.",
    hailuoWan:
      "{{a}} mise sur la netteté : sortie 2K, audio natif, première et dernière image, clips jusqu'à {{aMax}} secondes. {{b}} mise sur la durée : jusqu'à {{bMax}} secondes en une prise, audio natif, contrôle des images, de 480p à 1080p, plus un palier 480p bon marché pour les brouillons. À la seconde : {{aRate}} crédits pour {{a}}, {{bRate}} pour {{b}}. Plans courts et nets : {{a}}. Prises longues à petit budget : {{b}}.",
    grokGemini:
      "{{a}} est celui de xAI : de 480p à 1080p, première image en option, pas de son, clips jusqu'à {{aMax}} secondes. {{b}} est celui de Google : audio natif, première et dernière image, de 360p jusqu'en 4K, clips jusqu'à {{bMax}} secondes. À la seconde : {{aRate}} crédits contre {{bRate}}. Son et contrôle des images : {{b}}. Clips muets rapides, de n'importe quelle durée à partir d'une seconde : {{a}}.",
    verdict:
      "Aucun modèle ne gagne sur tous les usages. Commencez petit : {{cheapestName}} coûte {{minRate}} crédits la seconde. Besoin de son ? {{audioCount}} modèles le génèrent nativement. Besoin de fixer la fin ? {{lastFrameCount}} acceptent une dernière image. Ne payez le premium que pour le rendu que vous gardez.",
  },
  chat: {
    title: "Créez une vidéo depuis n'importe quelle discussion",
    intro:
      "Pas d'appli séparée, pas de nouveau compte. Demandez dans n'importe quelle discussion sur {{appName}} et l'IA appelle le générateur de vidéo pour vous.",
    steps: {
      ask: {
        title: "Décrivez le plan",
        body: "Sujet, mouvement, caméra, ambiance. Avec des mots simples. « Un renard court dans la neige fraîche à l'aube, travelling bas. » L'IA en fait une requête de génération.",
      },
      model: {
        title: "Gardez le modèle par défaut, ou nommez-en un",
        body: "Le réglage vidéo de votre compétence choisit le modèle, {{defaultModel}} sauf si vous l'avez changé. Vous en voulez un autre ? Dites-le dans le prompt : « utilise Kling 3.0 ». L'IA transmet ce modèle.",
      },
      image: {
        title: "Joignez une image pour l'animer",
        body: "Déposez une image et elle devient la première image du clip. C'est ça, l'image vers vidéo. Si votre modèle n'accepte pas les images, la tâche passe par la route image de ce modèle, ou par le modèle le moins cher qui en accepte.",
      },
      lastFrame: {
        title: "Fixez la dernière image",
        body: "Joignez une deuxième image et précisez que c'est la fin. Le modèle anime de l'une à l'autre. Fonctionne sur {{lastFrameCount}} modèles, et les deux doivent être des images. Vous pouvez aussi ajouter des images, de l'audio ou de la vidéo comme références pour guider le rendu.",
      },
      result: {
        title: "Regardez-le, gardez-le",
        body: "Le clip se lit directement dans le chat et s'enregistre dans votre propre espace de stockage. En discussion incognito, il reste lié à votre session de navigateur. Comptez environ une minute à plusieurs minutes par clip.",
      },
    },
    toolPage:
      "Un compromis. Dans le chat, l'IA ne peut pas régler la durée, la résolution ni le format : chaque clip demandé depuis le chat dure {{seconds}} secondes à la résolution par défaut du modèle. Besoin de tout contrôler ? La page du générateur vidéo règle le modèle, la durée, le format, la résolution, la première et la dernière image, et un prompt négatif.",
    toolLink: "Ouvrir le générateur de vidéo",
  },
  pricing: {
    title: "Ce que coûte la vidéo IA ici",
    intro:
      "Crédits par seconde multipliés par le nombre de secondes. C'est toute la formule. Un seul solde paie tous les modèles.",
    perSecond:
      "Chaque modèle a un tarif à la seconde : le prix du fournisseur plus notre marge de {{markup}} %, arrondi au dixième de crédit supérieur. 1 crédit = {{creditValue}}.",
    cheapest:
      "Clip le moins cher via le chat en ce moment : {{cheapestClipName}}, {{cheapestClipCredits}} crédits ({{cheapestClipPrice}}). Tarif le plus bas : {{cheapestName}} à {{minRate}} crédits la seconde.",
    priciest:
      "Clip le plus cher via le chat : {{priciestClipName}}, {{priciestClipCredits}} crédits ({{priciestClipPrice}}). Tarif le plus élevé : {{priciestName}} à {{maxRate}} crédits la seconde.",
    resolution:
      "Une résolution plus élevée coûte plus cher à la seconde sur les modèles qui facturent selon la résolution. Le tableau indique ces tarifs.",
    failed:
      "Les crédits ne sont débités qu'une fois le clip livré. Tâche échouée, prompt refusé, délai dépassé : vous ne payez rien.",
    reported:
      "Les routes servies via OpenRouter facturent le coût réel déclaré par le fournisseur plus la marge : le montant final peut donc légèrement s'écarter du tableau.",
    sub: "Formules mensuelles : quatre tailles, dès {{subCredits}} crédits pour {{subPrice}}.",
    pack: "Packs de crédits : une recharge pour les abonnés, {{packCredits}} crédits pour {{packPrice}}. Ils n'expirent jamais. Carte, PayPal ou crypto.",
    link: "Voir les formules et les packs de crédits",
  },
  watermark: {
    title: "Vidéo IA sans filigrane",
    intro:
      "{{appName}} n'appose rien sur votre clip. Vous recevez le fichier brut.",
    ours: "Aucun filigrane, aucun logo, aucune surimpression de notre part. Vous téléchargez la vidéo exactement telle que le modèle l'a livrée.",
    provenance:
      "Certains labos intègrent eux-mêmes des marques de provenance invisibles ou des métadonnées. Google insère SynthID dans la sortie de ses modèles vidéo. OpenAI ajoute des métadonnées C2PA aux clips Sora. Elles viennent du labo, pas de nous.",
    storage:
      "Chaque clip est enregistré dans votre propre espace de stockage. En discussion incognito, il reste rattaché à votre session de navigateur.",
  },
  limits: {
    title: "Les limites, sans détour",
    intro:
      "La vidéo, c'est le mode difficile de l'IA générative. Connaissez les contraintes avant de dépenser.",
    time: "Un clip prend environ une minute à plusieurs minutes. Les tâches longues peuvent dépasser le délai, et un délai dépassé ne coûte rien.",
    cost: "La vidéo est le type de média le plus cher sur {{appName}}. Faites vos brouillons sur un modèle bon marché, et le rendu final sur un modèle premium.",
    filters:
      "Tous les modèles vidéo ici viennent de labos grand public et passent par la modération de leur fournisseur. Contenu sexuel explicite, personnalités publiques réelles, mineurs ou violence graphique peuvent être refusés en amont. Ce refus vient du fournisseur, pas de nous, et il ne vous coûte rien.",
    chatControls:
      "Dans le chat, la durée, la résolution et le format restent par défaut. Le générateur vidéo les débloque tous.",
    snap: "Chaque modèle prend en charge ses propres durées. Une requête est arrondie à la plus proche, donc certains clips via le chat durent un peu moins ou un peu plus de {{seconds}} secondes.",
    legacy:
      "{{legacyCount}} modèles plus anciens ne figurent pas dans ce tableau. Ils restent dans la liste complète des modèles.",
    callout:
      "Le non-censuré, c'est notre engagement pour les modèles de chat. La vidéo tourne sur des modèles grand public avec les filtres de leurs fournisseurs. Aucun ne génère de contenu explicite.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quel est le meilleur générateur de vidéo IA ?",
      a: "Celui qui correspond au plan. Réalisme cinématographique avec son : Veo 3.1. Longues prises continues : Wan 3.0 ou Seedance 2.5. Personnages cohérents d'une scène à l'autre : Seedance 2.0. Brouillons pas chers : {{cheapestName}}. Une personne qui parle à partir d'une seule photo : Omnihuman 1.5. Les {{modelCount}} tournent sur un seul solde {{appName}}, vous pouvez donc changer à chaque clip.",
    },
    klingVsSeedance: {
      q: "Kling vs Seedance : lequel est le meilleur ?",
      a: "Des usages différents. Kling 3.0 Std est le choix rapport qualité-prix : mouvement vivant, audio natif, contrôle des images, plafonné à 720p. Seedance 2.0 coûte plus cher à la seconde et monte jusqu'en 4K, avec des références qui gardent un personnage cohérent d'un plan à l'autre. Brouillons sur Kling, plans narratifs finaux sur Seedance.",
    },
    imageToVideo: {
      q: "Comment transformer une image en vidéo avec l'IA ?",
      a: "Joignez l'image dans n'importe quelle discussion et décrivez le mouvement. Elle devient la première image du clip. {{i2vCount}} modèles sur {{modelCount}} acceptent directement une image ; si le vôtre ne le fait pas, la tâche passe par une route qui les accepte. Ajoutez une deuxième image comme dernière image sur les modèles compatibles.",
    },
    watermark: {
      q: "Existe-t-il un générateur de vidéo IA sans filigrane ?",
      a: "Oui. {{appName}} n'ajoute ni filigrane, ni logo, ni surimpression. Vous téléchargez le fichier brut. Certains labos intègrent eux-mêmes des marques invisibles : SynthID de Google sur ses modèles vidéo, métadonnées C2PA sur les clips Sora d'OpenAI.",
    },
    cost: {
      q: "Combien coûte la génération de vidéo IA ?",
      a: "De {{cheapestClipPrice}} à {{priciestClipPrice}} par clip via le chat en ce moment, selon le modèle. Chaque modèle a un tarif à la seconde, prix du fournisseur plus {{markup}} % de marge. 1 crédit = {{creditValue}}. Les tâches échouées ne coûtent rien.",
    },
    free: {
      q: "Peut-on créer des vidéos IA gratuitement ?",
      a: "Les nouveaux comptes reçoivent des crédits gratuits. La vidéo est l'une des générations les plus chères, ils couvrent donc quelques clips tout au plus. Le clip le moins cher en ce moment est {{cheapestClipName}} à {{cheapestClipCredits}} crédits. Ensuite : une formule, dès {{subPrice}} par mois.",
    },
    length: {
      q: "Quelle durée peut faire une vidéo IA ?",
      a: "Jusqu'à {{longestSeconds}} secondes en un seul clip, sur {{longestName}}. La plupart des modèles s'arrêtent bien avant. Une requête depuis le chat demande {{seconds}} secondes ; réglez une durée plus longue sur la page du générateur vidéo.",
    },
    uncensored: {
      q: "Existe-t-il un générateur de vidéo IA non censuré ?",
      a: "Pas ici, et nous ne prétendrons pas le contraire. Chaque modèle vidéo sur {{appName}} vient d'un labo grand public et passe par les filtres de son fournisseur. Aucun ne génère de contenu explicite. Nos modèles non censurés sont des modèles de chat.",
    },
    modelsLink: "Parcourir tous les modèles avec specs et prix",
    pricingLink: "Voir les formules et les tarifs",
  },
  partners: {
    body: "Vous créez du contenu vidéo avec l'IA ? Le programme partenaire {{appName}} vous reverse une part récurrente de chaque paiement que vous apportez.",
    link: "Rejoindre le programme partenaire",
  },
  cta: {
    title: "Choisissez un modèle. Tournez le plan.",
    subtitle:
      "Contrôle total dans le générateur vidéo : modèle, durée, format, résolution, images clés. Ou demandez simplement dans n'importe quelle discussion sur {{appName}}.",
    generate: "Générer une vidéo",
    models: "Parcourir tous les modèles",
  },
};
