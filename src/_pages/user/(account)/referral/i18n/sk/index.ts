import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  backToChat: "Späť na čet",
  title:
    "Zdieľaj odkaz. Z každej platby získaš {{directPct}} bez časového obmedzenia.",
  description:
    "Keď sa niekto zaregistruje cez tvoj odkaz, z každej jeho platby dostaneš {{directPct}}. Výška ani trvanie odmeny nemajú strop. Zverejni zručnosť a získaj {{skillBonusPct}} aj od používateľov, ktorých k nej privedú iní.",
  tagline: "Odporúčania a zručnosti",

  hero: {
    directEarning: "Tvoja odmena",
    directNote: "z platieb ľudí, ktorých odporučíš, bez časového obmedzenia",
    bonusEarning: "Ako autor zručnosti",
    bonusNote: "z každej platby, keď tvoju zručnosť zdieľa niekto iný",
  },

  commissionTable: {
    youLabel: "Ty",
    perMonth: " / mes.",
    colLevel: "Kto získava odmenu",
    colCut: "Podiel",
    alwaysYours: "vždy patrí tebe",
    heroLabel: "z každej platby",
    heroSub: "Opakovane, bez časového obmedzenia.",
    chainTitle: "Koľko mesačne zarobíš pri 10 predplatiteľoch",
    chainSubtitle:
      "Každá ďalšia úroveň získava polovicu podielu predchádzajúcej. Poradie sa určí raz pri registrácii a platí pri všetkých ďalších platbách.",
    whoLabel0: "Ty ako človek, ktorý používateľa odporučil priamo",
    whoLabel1:
      "Autor zručnosti, ak ju vytvoril niekto iný, alebo človek, ktorý odporučil teba",
    whoLabel2: "Človek, ktorý odporučil ich sprostredkovateľa",
    whoLabel3: "4. úroveň",
    whoLabel4: "5. úroveň",
    whoLabel5: "6. úroveň",
    tableNote:
      "Za odporúčanie cez tvoj odkaz získaš {{directPct}} z platieb používateľa. Keď tvoju zručnosť zdieľa niekto iný, tvoj podiel je {{skillBonusPct}}. Obe odmeny sa opakujú bez časového obmedzenia.",
  },

  // Story scenario section
  story: {
    title: "Ako rastie tvoj podiel",
    subtitle:
      "Stále tých istých 10 predplatiteľov. Každá aktívna úroveň ti trvalo zvyšuje celkovú odmenu.",
    totalLabel: "Spolu za mesiac",
    addedLabel: "+{{amount}} z tejto úrovne",
    levelLabel: "Aktívna úroveň: {{n}}",
    level1Desc:
      "Tvojich 10 priamo odporučených predplatiteľov. Z každého máš {{directPct}}.",
    level2Desc:
      "Ľudia, ktorých odporučíš, odporučia ďalších. Aj z ich platieb máš podiel.",
    level3Desc: "Ďalší ľudia odporučia svojich známych a sieť rastie.",
    level4Desc: "Štvrtá úroveň ti stále prináša odmenu.",
    level5Desc: "Piata úroveň odporúčaní.",
    level6Desc: "Šiesta úroveň. Každý cent ti patrí bez časového obmedzenia.",
    noob: {
      label: "Začiatky",
      earning: "pribl. {{story_noob_earning}} / mes.",
      desc: "Cez tvoj odkaz prišlo {{story_noob_users}} platiacich predplatiteľov. Z každého získavaš {{directPct}}. Jeden príspevok na sociálnej sieti alebo blogu ti môže ďalej prinášať príjem.",
    },
    mid: {
      label: "Rastúce publikum",
      earning: "pribl. {{story_mid_earning}} / mes.",
      desc: "Cez odkazy na odporúčanie aj na zručnosti prišlo {{story_mid_users}} predplatiteľov. Pridali sa aj niektorí ich priatelia. Sieť už rastie sama.",
    },
    pro: {
      label: "Zabehnutý tvorca",
      earning: "pribl. {{story_pro_earning}} / mes.",
      desc: "Cez odkazy na odporúčanie a zručnosti máš {{story_pro_users}} predplatiteľov. K priamym odmenám sa pripočítava aj podiel za ľudí, ktorých odporučili oni.",
    },
  },

  overview: {
    title: "Tvoje odmeny",
    subtitle: "Údaje sa aktualizujú po každej platbe.",
  },

  howItWorks: {
    title: "Ako to funguje",
    step1Title: "Vytvor si kód na odporúčanie",
    step1Body:
      "Pre priateľov, Discord či článok na blogu si vytvor samostatné kódy. Výsledky každého uvidíš osobitne.",
    step2Title: "Zdieľaj svoj odkaz",
    step2Body:
      "Za odporúčanie cez odkaz získavaš {{directPct}} z platieb používateľa bez časového obmedzenia. Keď tvoju zručnosť zdieľajú iní, získaš {{skillBonusPct}}. Oba podiely sa počítajú automaticky.",
    step3Title: "Vyber si odmenu",
    step3Body:
      "Odmena sa sprístupní {{holdDays}} dní po každej platbe, keď uplynie lehota na vrátenie peňazí. Potom ju môžeš využiť ako kredity alebo si od {{minPayout}} vybrať BTC či USDC.",
  },

  manage: {
    codesSubtitle: "Skopíruj odkaz, zdieľaj ho a sleduj svoje odmeny.",
  },
  myCodes: {
    title: "Tvoje odkazy",
  },
  cta: {
    title: "Vytvor si účet a začni získavať odmeny",
    description:
      "Získaj odkaz na odporúčanie a {{directPct}} z každej platby bez časového obmedzenia. Ak zverejníš zručnosť, dostaneš {{skillBonusPct}} aj vtedy, keď ju zdieľa niekto iný.",
    signUp: "Vytvoriť účet",
    logIn: "Prihlásiť sa",
    pitch1:
      "Provízia {{directPct}} za odporúčanie pri každej platbe, bez časového obmedzenia",
    pitch2:
      "Zverejni zručnosť a získaj {{skillBonusPct}} z platieb ľudí, ktorých k nej privedú iní",
    pitch3:
      "Odmena je k dispozícii {{holdDays}} dní po platbe. BTC alebo USDC si môžeš vybrať od {{minPayout}}.",
  },
  payout: {
    title: "Vyber si odmenu",
    description: "Dva spôsoby, ako využiť svoje odmeny",
    useAsCredits: "Použiť ako kredity na čet",
    useAsCreditsDesc:
      "Ihneď a bez minimálnej sumy. Prevod na kredity na čet s AI je v pomere 1 : 1.",
    cryptoPayout: "Vybrať v kryptomene",
    cryptoPayoutDesc: "BTC alebo USDC priamo na adresu tvojej peňaženky.",
    minimumNote:
      "Minimum je {{minPayout}}. Výber spracujeme do {{cryptoPayoutHours}} hodín od schválenia.",
  },
  audienceCallout: {
    title: "Dva spôsoby, ako získať odmenu",
    newTitle: "Odkaz na odporúčanie: {{directPct}} za používateľa",
    newBody:
      "Zdieľaj svoj kód. Keď sa cezň niekto zaregistruje a zaplatí, dostaneš {{directPct}} z každej jeho platby. Stačí jeden príspevok a odmeny môžeš dostávať každý mesiac bez časového obmedzenia.",
    newCta: "Získať odkaz na odporúčanie",
    proTitle: "Autor zručnosti: {{skillBonusPct}} za používateľa",
    proBody:
      "Vytvor zručnosť a zdieľaj jej odkaz. Za ľudí, ktorí sa zaregistrujú cez tvoj odkaz, dostávaš opakovane {{directPct}}. Keď tvoju zručnosť zdieľa niekto iný cez svoj odkaz, tebe ako autorovi patrí {{skillBonusPct}}. Platforma autorstvo sleduje automaticky.",
    proCta: "Vytvoriť zručnosť",
  },
  discord: {
    title: "Pridaj sa ku komunite",
    description:
      "Podeľ sa o skúsenosti, pýtaj sa a spoj sa s ďalšími ľuďmi, ktorí získavajú odmeny za odporúčania.",
    cta: "Pridať sa na Discord",
  },
};
