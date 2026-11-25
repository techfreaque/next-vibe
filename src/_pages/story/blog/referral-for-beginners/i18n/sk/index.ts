import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Dva spôsoby, ako získať odmenu. Môžeš použiť oba.",
    description:
      "Program odporúčaní {{appName}} jednoducho. Zdieľaj odkaz za 10 % alebo zverejni zručnosť a získaj 5 %, aj keď ju zdieľajú iní. Bez skúseností.",
    category: "Partnerský program",
    imageAlt: "Používateľ zdieľa odkaz a získava províziu",
    keywords:
      "odporúčací program, affiliate marketing pre začiatočníkov, provízie z odporúčania AI, zárobok zo zručností",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Pre začiatočníkov",
    readTime: "5 min čítania",
    title: "Dva spôsoby, ako získať odmenu. Môžeš použiť oba.",
    subtitle:
      "Zdieľaj odkaz, vytvor zručnosť alebo urob oboje. Takto presne sa počítajú odmeny.",
    quote:
      "„Ani ja som nevedel, čo je odporúčací program. Mame by som to vysvetlil takto.“",
  },
  intro: {
    title: "Začnime od začiatku",
    p1: "Na {{appName}} môžeš zarábať dvoma spôsobmi. Vyber si jeden alebo oba. Skúsenosti nepotrebuješ.",
    p2: "Prvá možnosť: zdieľaj odkaz. Keď si cezň niekto kúpi predplatné, dostaneš 10 % z každej jeho platby. Provízia sa opakuje každý mesiac, kým sú predplatiteľmi. Druhá možnosť: vytvor zručnosť. Je to vlastné nastavenie AI, ktoré môžeš zverejniť. Keď sa niekto zaregistruje cez odkaz na tvoju zručnosť, ako autor máš 5 % z jeho platieb aj vtedy, keď zručnosť zdieľal niekto iný. Vytvoríš ju raz a môže ti zarábať dlhodobo.",
  },
  different: {
    title: "Jednorazová a opakovaná provízia: aký je rozdiel?",
    p1: "Väčšina odporúčacích programov odmeňuje jednorazovo. {{appName}} ti vypláca províziu po celý čas, kým odporúčaný zákazník platí. Takto to vyzerá v praxi.",
    tableHeaderType: "Typ",
    tableHeaderYouEarn: "Zárobok",
    tableHeaderWhen: "Kedy",
    row1Type: "Jednorazový bonus, napríklad poukaz do reštaurácie",
    row1Earn: "Pevná odmena",
    row1When: "Raz",
    row2Type: "Provízia za predaj, napríklad Amazon",
    row2Earn: "Približne 3 až 10 % z predaja",
    row2When: "Raz za nákup",
    row3Type: "Odporúčanie {{appName}}",
    row3Earn: "10 % z predplatného",
    row3When: "Každý mesiac počas predplatného",
    p2: "Niekoho odporučíš v januári. Ak zostane predplatiteľom do decembra, dostaneš províziu 12-krát. Stačilo ho odporučiť raz.",
  },
  skillAngle: {
    title: "Vytvor zručnosť raz a zarábaj dlhodobo",
    p1: "Zručnosť je vlastné nastavenie AI. Dáš jej názov, osobnosť a systémové zadanie. Po zverejnení ju môže ktokoľvek nájsť a použiť. Keď sa niekto zaregistruje cez odkaz iného člena na tvoju zručnosť, ako autor dostávaš 5 % z jeho platieb. Za odporúčanie cez vlastný odkaz dostávaš 10 %.",
    p2: "Tých 5 % patrí autorovi. Ak niekto nájde tvoju zručnosť v katalógu, pošle svoj odkaz kamarátovi a ten sa zaregistruje, províziu dostaneš aj ty. Zručnosť zarába, aj keď ju práve nepropaguješ.",
    p3: "Zručnosti môžeš vytvárať zadarmo a bez predplatného. Začni s niečím jednoduchým pre svoj koníček, prácu alebo materinský jazyk. Zverejni zručnosť a pridaj jej odkaz tam, kde už hovoríš o AI. Platby z registrácií cez tvoj odkaz ti prinášajú 10 %. Z registrácií, ktoré na tvoju zručnosť privedie niekto iný, získavaš 5 %.",
  },
  multilevel: {
    title: "Ako funguje reťazec odporúčaní",
    p1: "Keď ľudia, ktorých odporučíš, privedú ďalších, získaš menší podiel aj z ich platieb. Takto sa sadzby delia.",
    explanation:
      "Odporučíš Alicu. Keď si kúpi predplatné, dostávaš 10 % z jej platieb, kým platí. Ak Alica odporučí Boba a ten si kúpi predplatné, získaš približne 5 % z jeho platieb, teda polovicu sadzby za Alicu. Ak Bob odporučí Carol, dostaneš približne 2,5 % z jej platieb. Sadzba sa na každej úrovni zníži na polovicu, až do piatej úrovne.",
    p2: "V praxi väčšinu zárobku tvorí priamych 10 % z tvojich vlastných odporúčaní. Provízie z ďalších úrovní ber ako menší doplnok.",
    p3: "Na začiatok stačí vytvoriť odkaz a zdieľať ho. Z platieb ľudí, ktorí sa cezň zaregistrujú, dostávaš 10 %.",
  },
  expectations: {
    title: "Koľko môžeš reálne zarobiť",
    p1: "Pozri si výpočet.",
    scenario1Label: "Predplatiteľ plánu Starter",
    scenario1Spend: "Plán za {{planPrice}} mesačne",
    scenario1Earn: "= {{planEarn}} mesačne za odporúčanie",
    scenario2Label: "Náročný používateľ (agenti, API, obrázky a videá)",
    scenario2Spend:
      "Plán {{planPrice}} + {{powerPacks}} balíkov po {{packPrice}} = {{powerSpend}} mesačne",
    scenario2Earn: "= {{powerEarn}} mesačne za odporúčanie",
    note: "Jeden náročný používateľ ti prinesie rovnakú províziu ako {{powerVsPlan}} bežných predplatiteľov. Vývojári, ktorí používajú agentov a API, míňajú viac kreditov a predplatné rušia zriedka. Preto sa ich oplatí osloviť.",
    example:
      "Priveď 10 predplatiteľov plánu Starter a získaš {{tenPlanEarn}} mesačne. Je to menší príjem za odporúčanie služby, o ktorej by si aj tak povedal.",
  },
  firststeps: {
    title: "Prvé kroky za 5 minút",
    step1Title: "Vytvor si bezplatný účet",
    step1Body: "Platený plán nepotrebuješ. Do programu sa môže zapojiť každý.",
    step2Title: "Prejdi na prehľad odporúčaní",
    step2Link: "Otvor stránku odporúčaní.",
    step2Suffix: " Vytvor kód, ktorý si ľudia ľahko zapamätajú.",
    step3Title: "Zdieľaj odkaz alebo zverejni zručnosť",
    step3Body:
      "Odporúčací odkaz pridaj tam, kde prirodzene hovoríš o AI. Alebo vytvor zručnosť a zdieľaj jej odkaz. Províziu prinášajú obe možnosti.",
    step4Title: "Sleduj prehľad",
    step4Body:
      "Návštevy, registrácie a zárobky pribúdajú v reálnom čase. Sledovanie funguje od začiatku bez požadovaných výdavkov.",
  },
  close: {
    title: "Prvé odporúčanie môžeš poslať hneď",
    p1: "Stačí povedať ľuďom o službe, ktorú používaš. Nepotrebuješ blog, sledovateľov ani výpočty všetkých úrovní. Ak chceš, vytvor jednoduchú zručnosť, ktorá môže zarábať sama.",
    p2: "Na našom Discorde môžeš prebrať sadzby provízií, nájsť ďalšie spôsoby zdieľania odkazov a opýtať sa ostatných, čo im funguje.",
    createCode: "Získať odporúčací kód",
    joinDiscord: "Pridať sa na Discord",
  },
};
