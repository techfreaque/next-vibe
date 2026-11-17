import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Générateur de musique IA, voix et transcription sur un seul compte | {{appName}}",
    description:
      "{{musicCount}} modèles de musique IA, {{voiceCount}} voix de synthèse vocale, {{sttCount}} modèles de transcription. Des alternatives à Suno avec les vrais prix par clip, par minute et par heure. Crédits gratuits pour commencer.",
    category: "Comparatif de modèles",
    imageAlt:
      "{{appName}} : modèles de musique, de voix et de transcription IA comparés",
    keywords:
      "générateur de musique IA, alternative à Suno, générateur de chansons IA, générateur de beats IA, Lyria 3, ElevenLabs Music, Sonauto, MusicGen, synthèse vocale IA, générateur de voix IA, générateur de voix IA crédits gratuits, voix text to speech, alternative à ElevenLabs, Kokoro TTS, Gemini TTS, reconnaissance vocale, transcription IA, Whisper, Whisper Large V3, Deepgram Nova-2, GPT-4o Mini Transcribe, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif de modèles",
    readTime: "11 min de lecture",
    title: "Chansons, beats, voix, transcriptions. Un seul compte.",
    subtitle:
      "{{musicCount}} modèles de musique, {{voiceCount}} voix, {{sttCount}} modèles de transcription sur un seul solde {{appName}}. Le vrai prix par clip, par minute, par heure. Et lequel choisir pour quel usage.",
  },
  intro: {
    lead: "Une appli de musique. Une appli de voix. Une appli de transcription. Trois abonnements, trois identifiants, trois tas de crédits qui expirent. Alors que vous vouliez juste un jingle, une voix off et une transcription.",
    p2: "{{appName}} fait tourner {{modelCount}} modèles audio de {{labCount}} labos sur un seul solde de crédits. Chaque chiffre ci-dessous vient en direct de notre registre de modèles : durées, voix, catégories, vrais prix. Quatre usages, quatre réponses :",
    songs:
      "Chansons avec voix : Sonauto, ElevenLabs Music, Lyria 3 Pro. Clips jusqu'à {{longestMusic}} secondes.",
    beats:
      "Beats et instrumentaux : MusicGen Stereo, ModelsLab Music Gen, Lyria 3.",
    voiceovers:
      "Voix off et lecture à voix haute : {{voiceCount}} voix, de {{cheapVoiceMinute}} à {{priceyVoiceMinute}} par minute de parole.",
    transcription:
      "Transcription : {{sttCount}} modèles, de {{cheapSttHour}} à {{priceySttHour}} par heure d'audio.",
  },
  tiers: {
    mainstream: "Grand public",
    open: "Open source",
    uncensored: "Non censuré",
  },
  music: {
    title: "Générateur de musique IA : les {{musicCount}} modèles",
    intro:
      "Du clip le moins cher au plus cher. Les prix incluent notre marge de {{markup}} %. 1 crédit = {{creditValue}}.",
    colModel: "Modèle",
    colLength: "Durée du clip",
    colTier: "Catégorie",
    colCredits: "Crédits / clip",
    colPrice: "Prix / clip",
    lengthChoice: "{{lengths}} s",
    lengthFixed: "{{seconds}} s",
    footnote:
      "Un seul prix par clip, quelle que soit la durée choisie. Si vous demandez une durée que le modèle ne propose pas, la requête prend la plus proche disponible.",
    factLine: "{{credits}} crédits ({{price}}) par clip · {{length}}",
    picks: {
      songs: {
        title: "Chansons avec voix",
        body: "Un chanteur et un refrain. Décrivez le genre, l'ambiance, la voix et le sujet de la chanson. Ces modèles sont faits pour des chansons qui chantent vraiment.",
      },
      beats: {
        title: "Beats et instrumentaux",
        body: "Musique de fond, boucles pour une vidéo, un beat pour rapper dessus. Sans voix. Précisez le genre, le tempo et les instruments : « lo-fi hip hop, 85 bpm, dusty piano, vinyl crackle ».",
      },
      short: {
        title: "Clips courts, virgules sonores, jingles",
        body: "Intros, sons de notification, virgule de podcast. Court et pas cher. Faites-en dix, gardez-en un.",
      },
    },
    suno: "Vous cherchez une alternative à Suno ? Suno et Udio ne sont pas sur {{appName}}. Ce que vous avez à la place : {{musicCount}} modèles de musique sur un seul solde, à partir de {{cheapMusicPrice}} le clip, sans abonnement supplémentaire. La limite, honnêtement : les clips s'arrêtent à {{longestMusic}} secondes. Pour des morceaux complets de trois minutes, les applis dédiées restent la référence.",
    toolLink: "Ouvrir le générateur de musique",
  },
  voices: {
    title: "Synthèse vocale IA : {{voiceCount}} voix comparées",
    intro:
      "De la moins chère à la plus chère. Facturé au caractère de texte. La dernière colonne estime une minute de parole à environ {{charsPerMinute}} caractères.",
    colVoice: "Voix",
    colCharacter: "Timbre",
    colTier: "Catégorie",
    colCredits: "Crédits / 1 000 caractères",
    colMinute: "Env. 1 min de parole",
    gender: {
      male: "Masculine",
      female: "Féminine",
      neutral: "Neutre",
    },
    style: {
      conversational: "naturelle",
      warm: "chaleureuse",
      deep: "grave",
      expressive: "expressive",
      calm: "calme",
      friendly: "amicale",
      authoritative: "assurée",
      clear: "claire",
      soft: "douce",
      steady: "posée",
      confident: "confiante",
      british: "britannique",
      lively: "vive",
      bright: "lumineuse",
      upbeat: "enjouée",
    },
    footnote:
      "Les tarifs incluent notre marge de {{markup}} %. La minute est une estimation : un débit rapide ou des mots longs la font varier. Vous payez les caractères envoyés, pas les secondes reçues.",
    factLine:
      "{{credits}} crédits / 1 000 caractères · env. {{minute}} par minute · {{character}}",
    picks: {
      everyday: {
        title: "Lecture à voix haute au quotidien",
        body: "Propre, claire, assez bon marché pour la laisser tourner. {{defaultVoice}} est la voix par défaut pour lire les réponses à voix haute.",
      },
      natural: {
        title: "Le plus naturel : des voix off à publier",
        body: "Palette émotionnelle, rythme humain. Pour la narration YouTube, les pubs, les extraits de livres audio. Ce sont les voix les plus chères ici : finalisez le script d'abord, puis générez une seule fois.",
      },
      multilingual: {
        title: "Plusieurs langues, une seule voix",
        body: "Les voix Gemini parlent plus de 100 langues et suivent des consignes de diction : plus lent, chuchoté, enthousiaste.",
      },
      expressive: {
        title: "Personnages et narration",
        body: "Plus de dramatisation, plus d'amplitude. Faites pour la fiction, les personnages de jeu, les scènes de jeu de rôle.",
      },
      budget: {
        title: "Le moins cher, sans filtre de contenu",
        body: "Kokoro est un modèle open-weight de 82M de paramètres. {{uncensoredVoiceCount}} voix Kokoro font partie de notre catégorie non censurée : aucun filtre sur ce qu'elles lisent. Ce sont aussi les voix les moins chères de la plateforme.",
      },
    },
    languages:
      "Toutes ces voix sont optimisées pour l'anglais. Les voix Gemini gèrent plus de 100 langues. Les autres peuvent lire d'autres langues, souvent avec un accent. Testez une phrase avant de générer tout un script.",
    toolLink: "Ouvrir la synthèse vocale",
  },
  stt: {
    title: "Transcription IA : {{sttCount}} modèles de reconnaissance vocale",
    intro:
      "Du moins cher à la minute au plus cher. Facturé à la seconde d'audio. Les prix incluent notre marge de {{markup}} %.",
    colModel: "Modèle",
    colTier: "Catégorie",
    colCredits: "Crédits / minute",
    colHour: "Prix / heure",
    footnote:
      "Quand un fournisseur indique le coût réel d'une tâche, nous facturons ce coût plus la marge. Le montant final peut donc légèrement s'écarter du tableau.",
    factLine: "{{credits}} crédits / minute · {{hour}} par heure",
    picks: {
      cheapest: {
        title: "Le moins cher : des heures d'audio pour quelques centimes",
        body: "Whisper open-weight, 99 langues. Un abonnement couvre environ {{subSttHours}} heures d'audio à ce tarif.",
      },
      accuracy: {
        title: "La précision avant tout",
        body: "Moins de mots erronés, meilleure détection de la langue. Pour les interviews, les citations, tout ce que vous publiez. {{defaultStt}} est le modèle par défaut pour la saisie vocale.",
      },
      languages: {
        title: "De nombreuses langues",
        body: "Whisper couvre 99 langues, Nemotron 40 variantes régionales. Voxtral est le modèle de transcription de Mistral, conçu pour des enregistrements jusqu'à 10 minutes.",
      },
      fast: {
        title: "Rapide et résistant au bruit",
        body: "Faible latence, tient bon dans les pièces bruyantes. Fait pour les mémos vocaux rapides et la dictée.",
      },
    },
    toolLink: "Ouvrir la reconnaissance vocale",
  },
  chat: {
    title: "Comment ça marche dans le chat",
    intro:
      "Pas d'appli séparée. Musique, voix et transcription sont intégrées à chaque discussion sur {{appName}}.",
    steps: {
      song: {
        title: "Demandez une chanson",
        body: "Tapez « fais-moi une intro synthwave de 30 secondes pour mon podcast ». L'IA appelle le générateur de musique avec le modèle musical de votre compétence, {{defaultMusic}} sauf si vous l'avez changé. Citez un autre modèle dans le prompt pour en changer.",
      },
      voice: {
        title: "Écoutez n'importe quelle réponse",
        body: "Cliquez sur l'icône haut-parleur d'une réponse : elle est lue à voix haute avec la voix de votre compétence, {{defaultVoice}} par défaut. Vous pouvez définir une voix différente par compétence.",
      },
      dictate: {
        title: "Parlez au lieu de taper",
        body: "Touchez le micro et parlez. {{defaultStt}} transcrit vos mots dans le champ de saisie, ou l'enregistrement part directement aux modèles qui comprennent l'audio.",
      },
      transcribe: {
        title: "Transcrivez des fichiers entiers",
        body: "Réunions, interviews, mémos vocaux : déposez jusqu'à {{sttMaxFiles}} fichiers sur la page de transcription audio et choisissez le modèle.",
      },
      call: {
        title: "Mode appel",
        body: "Mains libres. Vous parlez, l'IA répond à voix haute, vous répondez. Voix en entrée, voix en sortie, même solde.",
      },
    },
    toolPages:
      "Vous voulez tout contrôler ? Chaque usage a sa propre page : choisissez le modèle ou la voix, réglez la durée du clip, collez un long script.",
  },
  pricing: {
    title: "Ce que coûtent la musique et la voix IA ici",
    intro:
      "Trois modes de calcul, un seul solde. Prix du fournisseur plus notre marge de {{markup}} %. 1 crédit = {{creditValue}}.",
    music:
      "Musique : un prix fixe par clip. De {{cheapMusicCredits}} crédits ({{cheapMusicPrice}}) sur {{cheapMusicName}} à {{priceyMusicCredits}} crédits ({{priceyMusicPrice}}) sur {{priceyMusicName}}.",
    voice:
      "Voix : au caractère. De {{cheapVoiceCredits}} crédits pour 1 000 caractères sur {{cheapVoiceName}} à {{priceyVoiceCredits}} sur {{priceyVoiceName}}.",
    stt: "Transcription : à la seconde d'audio. De {{cheapSttCredits}} crédits la minute sur {{cheapSttName}} à {{priceySttCredits}} sur {{priceySttName}}.",
    failed:
      "Les crédits ne sont débités qu'une fois le résultat obtenu. Tâche échouée, délai dépassé, prompt refusé : vous ne payez rien.",
    free: "Gratuit : {{guestCredits}} crédits par mois sans compte, {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter. {{freeCredits}} crédits paient {{freeClips}} clips sur {{cheapMusicName}}, ou environ {{freeVoiceMinutes}} minutes de {{cheapVoiceName}}.",
    sub: "Formules mensuelles : quatre tailles, dès {{subCredits}} crédits pour {{subPrice}}.",
    pack: "Packs de crédits : une recharge pour les abonnés, {{packCredits}} crédits pour {{packPrice}}. Ils n'expirent jamais. Carte, PayPal ou crypto.",
    link: "Voir les formules et les packs de crédits",
  },
  limits: {
    title: "Les limites, sans détour",
    intro: "Connaissez les contraintes avant de dépenser un crédit.",
    musicLength:
      "Les clips musicaux durent {{longestMusic}} secondes au maximum. Pas de morceaux de trois minutes, pas de prolongation d'un clip.",
    musicFlat:
      "Un clip coûte le même prix quelle que soit sa durée. Les clips courts servent à tester un prompt à moindre coût, ce n'est pas une remise.",
    noSuno: "Pas de Suno, pas d'Udio. Leurs API ne sont pas sur {{appName}}.",
    ttsLength:
      "La synthèse vocale accepte jusqu'à {{ttsMaxChars}} caractères par requête. Pour un script plus long : découpez-le.",
    sttFiles:
      "La transcription accepte jusqu'à {{sttMaxFiles}} fichiers par requête, {{sttMaxMb}} Mo chacun.",
    noCloning:
      "Pas de clonage de voix. Vous choisissez parmi les voix du tableau. Impossible d'importer la vôtre.",
    filters:
      "La plupart des modèles de musique et de voix passent par la modération de leur fournisseur. Un prompt peut être refusé en amont. Ce refus ne coûte rien.",
    callout:
      "Avant de publier : vérifiez les conditions du fournisseur sur l'usage commercial de la musique et des voix générées. Les règles varient selon les labos, et elles évoluent.",
  },
  faq: {
    title: "FAQ",
    bestMusic: {
      q: "Quel est le meilleur générateur de musique IA ?",
      a: "Ça dépend du morceau. Chansons avec voix : Sonauto ou ElevenLabs Music. Morceaux courts et soignés : Lyria 3 Pro. Beats et boucles : MusicGen Stereo. Le moins cher : {{cheapMusicName}} à {{cheapMusicPrice}} le clip. Les {{musicCount}} tournent sur un seul solde {{appName}}, vous changez donc à chaque clip.",
    },
    suno: {
      q: "Existe-t-il une bonne alternative à Suno ?",
      a: "Pour des chansons courtes et des beats, oui : Sonauto, ElevenLabs Music et Lyria 3 de Google tournent ici sur un seul solde, à partir de {{cheapMusicPrice}} le clip, sans abonnement supplémentaire. Pour des chansons complètes de trois minutes, pas encore : les clips s'arrêtent ici à {{longestMusic}} secondes.",
    },
    vocals: {
      q: "Une IA peut-elle créer des chansons avec voix ?",
      a: "Oui. Demandez une chanson à Sonauto, ElevenLabs Music ou Lyria 3 Pro et décrivez le sujet, l'ambiance et le chanteur. Les modèles instrumentaux comme MusicGen Stereo font de la musique sans voix.",
    },
    bestVoice: {
      q: "Quel générateur de voix IA sonne le plus naturel ?",
      a: "Pour la lecture à voix haute au quotidien, les voix OpenAI comme {{defaultVoice}} sont propres et coûtent peu. Les plus expressives : xAI Eve et Inworld. Pour de nombreuses langues : Gemini. Pour le prix le plus bas et aucun filtre : Kokoro.",
    },
    free: {
      q: "Existe-t-il un générateur de voix IA avec des crédits gratuits ?",
      a: "Oui. {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte gratuit, {{maxCredits}} avec la newsletter. Sur {{cheapVoiceName}}, cela fait environ {{freeVoiceMinutes}} minutes de parole. Les mêmes crédits paient la musique et la transcription.",
    },
    transcribeCost: {
      q: "Combien coûte la transcription IA ?",
      a: "De {{cheapSttHour}} par heure d'audio sur {{cheapSttName}} à {{priceySttHour}} sur {{priceySttName}}. Facturé à la seconde. Les tâches échouées ne coûtent rien.",
    },
    cloning: {
      q: "Puis-je cloner ma propre voix ?",
      a: "Non. {{appName}} propose {{voiceCount}} voix prêtes à l'emploi. Pas de clonage, pas d'import de votre propre voix.",
    },
    uncensored: {
      q: "Existe-t-il une synthèse vocale non censurée ?",
      a: "Oui. {{uncensoredVoiceCount}} voix Kokoro font partie de notre catégorie non censurée : un modèle open-weight sans filtre de contenu sur ce qu'il lit. La plupart des modèles de musique et les autres voix passent par les filtres de leur fournisseur.",
    },
    modelsLink: "Parcourir tous les modèles avec specs et prix",
    videoLink: "Besoin de vidéo aussi ? Les générateurs de vidéo IA comparés",
    pricingLink: "Voir les formules et les tarifs",
  },
  partners: {
    body: "Vous faites de la musique, des podcasts ou des voix off ? Le programme partenaire {{appName}} vous reverse une part récurrente de chaque paiement que vous apportez.",
    link: "Rejoindre le programme partenaire",
  },
  cta: {
    title: "Choisissez un modèle. Lancez la lecture.",
    subtitle:
      "Chansons, beats, voix et transcriptions sur un seul solde. Commencez avec {{guestCredits}} crédits gratuits, sans compte.",
    music: "Créer de la musique",
    voice: "Générer une voix",
    transcribe: "Transcrire de l'audio",
    models: "Parcourir tous les modèles",
  },
};
