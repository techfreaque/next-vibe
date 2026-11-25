import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Vytvoril si niečo s AI? Získaj odmenu za zdieľanie.",
    description:
      "README, články aj návody už môžu prinášať odporúčania. Takto sa počíta odmena aj bonus, keď tvoju zručnosť zdieľajú iní.",
    category: "Partnerský program",
    imageAlt: "Terminál vývojára s kódom a prehľadom zárobkov",
    keywords:
      "odporúčací program pre vývojárov, affiliate program AI, príjem vývojárov, zarábanie na otvorenom kóde",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Pre vývojárov",
    readTime: "5 min čítania",
    title: "Vytvoril si niečo s AI? Získaj odmenu za zdieľanie.",
    subtitle:
      "S AI už tvoríš. Teraz môžeš k svojim projektom pridať odkaz, ktorý ti prinesie podiel z platieb odporučených ľudí.",
  },
  useCase: {
    title: "Kde vývojári prirodzene odporúčajú nástroje",
    p1: "Už teraz tvoríš obsah, ktorý ľudí privádza k nástrojom. Článok o pracovnom postupe, README so zmienkou o použitej AI, návod na YouTube alebo odpoveď na Discorde. Na všetkých týchto miestach môžeš pridať odporúčací odkaz.",
    p2: "Tam, kde by si spomenul {{appName}} aj bez provízie, pridaj svoj odkaz. Ak sa cezň niekto prihlási na odber, dostávaš 10 % z každej jeho platby, kým platí. Stačí pridať odkaz k tomu, čo už aj tak píšeš.",
    examples: [
      "README na GitHube: „Tento projekt som vytvoril pomocou API {{appName}}. Vyskúšaj ho: [tvoj odkaz]“",
      "Koniec článku: „Moje nástroje: … {{appName}} na prístup k AI [odporúčací odkaz]“",
      "Discord alebo Slack: „Používam {{appName}}. Ak to chceš skúsiť, tu je môj odporúčací odkaz.“",
      "Popis na YouTube: „Nástroje AI použité vo videu: {{appName}} [odporúčací odkaz]“",
    ],
  },
  skillAngle: {
    title: "Zverejni zručnosť a zarábaj, aj keď ju zdieľa niekto iný",
    p1: "Každá zverejnená zručnosť má vlastný odkaz. Keď ho zdieľaš, získavaš bežných 10 % z platieb priamych odporúčaní. Keď niekto iný zdieľa zručnosť vlastným odkazom, ako autor dostávaš 5 % z každej platby jeho odporúčaní.",
    p2: "Provízia 5 % patrí autorovi zručnosti aj vtedy, keď odkaz zdieľa iný člen. Ak používateľ nájde tvoju zručnosť v katalógu, pošle odkaz kamarátovi a ten sa zaregistruje, získaš automaticky 5 % z jeho platieb. Platforma eviduje autora zručnosti.",
    p3: "Odkaz na zručnosť vlož do README na GitHube alebo na vývojársky Discord. Pri registráciách z vlastného odkazu máš 10 % z platieb. Pri registráciách z cudzieho odkazu na tvoju zručnosť dostávaš 5 %. Jedna zručnosť, dva spôsoby zárobku.",
  },
  math: {
    title: "Prepočet na skutočných číslach",
    subtitle: "Tvoj odkaz (10 %) alebo tvoja zručnosť zdieľaná inými (5 %)",
    tableHeaderProfile: "Typ používateľa",
    tableHeaderSpend: "Mesačná spotreba",
    tableHeaderDirect: "Priame odporúčanie (10 %)",
    tableHeaderSkill: "Zručnosť zdieľaná inými (5 %)",
    rows: [
      {
        profile: "Predplatiteľ plánu Starter",
        spend: "{{planPrice}} mesačne",
        direct: "{{planEarn}} mesačne",
        skill: "{{planSkillEarn}} mesačne",
      },
      {
        profile: "Starter + 1 balík kreditov",
        spend: "{{plusPackSpend}} mesačne",
        direct: "{{plusPackEarn}} mesačne",
        skill: "{{plusPackSkillEarn}} mesačne",
      },
      {
        profile: "Aktívny používateľ: Starter a {{heavyPacks}} bal.",
        spend: "{{heavySpend}} mesačne",
        direct: "{{heavyEarn}} mesačne",
        skill: "{{heavySkillEarn}} mesačne",
      },
      {
        profile: "Náročný používateľ: Starter a {{powerPacks}} bal.",
        spend: "{{powerSpend}} mesačne",
        direct: "{{powerEarn}} mesačne",
        skill: "{{powerSkillEarn}} mesačne",
      },
    ],
    note: "Jeden náročný používateľ z tvojho odkazu ti prinesie {{powerEarn}} mesačne. Toľko získavaš za {{powerVsPlan}} bežných predplatiteľov. Vývojári už za AI nástroje platia, často sa rozhodnú rýchlo a predplatné rušia zriedka.",
    growthNote:
      "Keď {{appName}} pridáva modely a funkcie, priemerný príjem na používateľa môže rásť. Odporúčania, ktoré získaš dnes, ti tak môžu budúci rok priniesť viac bez ďalšej práce.",
  },
  chain: {
    title: "Čo získaš, keď tvoje odporúčania privedú ďalších",
    p1: "Keď ľudia, ktorých odporučíš, odporučia ďalších, dostávaš podiel aj z ich platieb. Takto vyzerajú sadzby.",
    level0: "Priame odporúčanie: 10 % z každej platby",
    level1:
      "Ich odporúčania (2. úroveň): približne 5 % z každej platby, teda polovica z celkových 10 % vyhradených pre vyššie úrovne",
    level2: "3. úroveň: približne 2,5 % z každej platby",
    level3: "4. úroveň: približne 1,25 % z každej platby",
    level4: "5. úroveň: približne 0,625 % z každej platby",
    total:
      "Najvyššia celková provízia rozdelená medzi všetkých: približne 20 % z jednej platby",
    p2: "Provízie na ďalších úrovniach sa rýchlo zmenšujú. Najviac prinesie 10 % za priame odporúčanie a 5 % za zručnosť. Keď projekt tvoríš verejne a oslovíš vývojárov, môžu sa pridať aj ďalšie úrovne. Sústreď sa na kvalitné priame odporúčania.",
  },
  crypto: {
    title: "Výplata v kryptomene bez bankového účtu",
    p1: "Zárobky vyplácame v BTC alebo USDC do 48 hodín od schválenia. Minimum je {{minPayout}}. To zodpovedá približne {{payoutPowerMonths}} mesiacom od jedného náročného používateľa alebo {{payoutPlanMonths}} mesiacom predplatného Starter.",
    p2: "Zárobok si môžeš hneď zmeniť na kredity. Ak {{appName}} používaš, provízia pokryje časť tvojich vlastných výdavkov.",
  },
  close: {
    title: "Zarábaj na tom, čo už zdieľaš",
    p1: "Už tvoríš, píšeš a hovoríš o AI nástrojoch. Pridať odporúčací odkaz nič nestojí a zaberie päť minút. Zverejni aj zručnosť a môžeš zarábať, keď ju zdieľajú iní.",
    p2: "Ak svoj projekt tvoríš verejne, postupne pribúdajú provízie z opakovaných platieb, vyššej spotreby aj odporúčaní ďalších vývojárov.",
    createCode: "Vytvoriť odporúčací kód",
    joinDiscord: "Pridať sa na Discord",
  },
};
