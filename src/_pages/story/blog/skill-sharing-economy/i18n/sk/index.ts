import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Vytvor zručnosť, zdieľaj odkaz a zarábaj každý mesiac",
    description:
      "Zručnosť na {{appName}} vytvoríš raz a zdieľaš ju kdekoľvek. Tvoj odkaz ti prináša 10 % z každej platby a pri zdieľaní inými dostaneš 5 %.",
    category: "Zdieľanie zručností",
    imageAlt: "Tvorba zručností AI a opakovaný príjem z ich zdieľania",
    keywords:
      "zručnosti AI, pasívny príjem, odporúčací program, {{appName}}, vlastná AI, zdieľanie zručností, provízia za zručnosti",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Zdieľanie zručností",
    readTime: "7 min čítania",
    title: "Vytvor zručnosť. Zdieľaj odkaz. Zarábaj každý mesiac.",
    subtitle:
      "AI nastavíš raz a môžeš ju zdieľať kdekoľvek. Získaš 10 % z každej platby ľudí, ktorí sa cez tvoj odkaz zaregistrujú, bez časového obmedzenia.",
    quote:
      "„Vytvoril som zručnosť na klinické uvažovanie pre medikov. Po troch mesiacoch mi platí vlastné predplatné a ešte niečo zostane.“",
  },
  whatAreSkills: {
    title: "Čo sú zručnosti v {{appName}}?",
    p1: "Zručnosť spája systémové zadanie, osobnosť spoločníka, výber modelov pre jednotlivé typy výstupu, hlas a nastavenie obrázkov. Nastavenie pripravíš raz a potom ho môže použiť ktokoľvek.",
    p2: "Platforma má {{modelCount}} modelov: bežné, otvorené aj necenzurované. V zručnosti určíš model na čet, rozpoznávanie obrázkov, tvorbu obrázkov aj hlas odpovede. Väčšine používateľov stačí spustiť zručnosť. Nastavenie spravíš raz ty.",
    p3: "Zručnosť si vytvoríš zadarmo, bez plateného predplatného aj bez kódu. Stačí vedieť opísať, čo má AI robiť.",
    buildTitle: "Tri spôsoby, ako vytvoriť zručnosť",
    build1Title: "Ručne na stránke zručnosti",
    build1Body:
      "Všetky nastavenia upravíš priamo. Hodí sa, keď presne vieš, čo chceš.",
    build2Title: "Požiadaj Theu alebo Hermesa v čete",
    build2Body:
      "Opíš, čo chceš vytvoriť. Nechaj ich navrhnúť systémové zadanie, oponovať ti a postupne návrh spresňovať. Poznajú platformu a pomôžu aj pri zložitejších zručnostiach.",
    build3Title: "Pre vývojárov: vytvor skill.ts",
    build3Body:
      "Požiadaj agenta o súbor zručnosti. Vytvorí skill.ts s rovnakou štruktúrou ako vstavané zručnosti spoločníkov. Súbor môžeš rovno pridať do repozitára a použiť.",
  },
  shareLink: {
    title: "Ako zarába odkaz na zručnosť",
    p1: "Keď pri zručnosti stlačíš Zdieľať a zarobiť, dostaneš odkaz s dvoma funkciami.",
    bullet1: "Návštevníkovi ukáže zručnosť, jej nastavenia a to, čo dokáže.",
    bullet2: "Priradí ti odporúčanie každého, kto sa cez odkaz zaregistruje.",
    p2: "Keď sa niekto zaregistruje cez tvoj odkaz na zručnosť, získavaš 10 % z každej jeho platby. Keď tvoju zručnosť zdieľa vlastným odkazom niekto iný, ako autor dostávaš 5 % z platieb jeho odporúčaní.",
    p3: "Provízia sa počíta z každého obnovenia predplatného, dobitia kreditov aj ďalšieho nákupu. Za priame odporúčanie dostávaš 10 % z každej platby.",
    p4: "Adresa vyzerá takto: {{appName}}/track?ref=YOUR_CODE&url=/en/skill/SKILL_ID",
  },
  examples: {
    title: "Zručnosti, ktoré ľudia zdieľajú a ktoré zarábajú",
    p1: "Najúspešnejšie zručnosti pomáhajú s konkrétnou opakovanou úlohou, pri ktorej má ukážka väčšiu hodnotu než opis.",
    example1Title: "Spoločník pre konkrétnu profesiu",
    example1Body:
      "Medik vytvorí zručnosť, ktorá s ním rozoberá prípady a klinické uvažovanie ako skúsenejší kolega. Zdieľa ju na fóre lekárskej fakulty. Registrácie z komunity prinášajú províziu z mesačných platieb.",
    example2Title: "Zručnosť postavená na odborných znalostiach",
    example2Body:
      "Kouči, konzultanti a autori kurzov už predávajú PDF či konzultácie cez Zoom. Dobre pripravená zručnosť s ich skúsenosťami môže zarábať opakovane s menšou réžiou než kurz.",
    example3Title: "Tvorba bez cenzúry",
    example3Body:
      "Zručnosti s modelmi bez cenzúry na tvorivé písanie, hranie rolí či diskusiu. Oslovia komunity, kde sa ľudia často stretávajú s limitmi bežných modelov. Majú konkrétny dôvod zaregistrovať sa.",
    example4Title: "Kontrola kódu pre vývojárov",
    example4Body:
      "Zručnosť pozná technológie tímu a kontroluje jeho pravidlá. Zdieľa sa medzi vývojármi, ktorí na AI míňajú 100 až 200 USD mesačne. Takí používatelia zvyknú zostať dlhšie.",
  },
  theMath: {
    title: "Prepočet: 10 % z každej platby priameho odporúčania",
    p1: "Keď sa niekto zaregistruje cez tvoj odkaz a získa predplatné, dostávaš 10 % z každej platby. Keď tvoju zručnosť zdieľa niekto iný, dostávaš 5 % z platieb jeho odporúčaní. Provízia sa opakuje, kým predplatitelia platia.",
    tableHeaderProfile: "Typ používateľa",
    tableHeaderSpend: "Mesačná spotreba",
    tableHeaderEarn: "Mesačný zárobok cez odkaz na zručnosť",
    row1Profile: "Predplatiteľ plánu Starter",
    row1Spend: "{{planPrice}} mesačne",
    row1Earn: "{{planEarn}} mesačne",
    row2Profile: "Starter + 1 balík kreditov",
    row2Spend: "{{plusPackSpend}} mesačne",
    row2Earn: "{{plusPackEarn}} mesačne",
    row3Profile: "Aktívny používateľ: Starter a {{heavyPacks}} bal.",
    row3Spend: "{{heavySpend}} mesačne",
    row3Earn: "{{heavyEarn}} mesačne",
    row4Profile: "Náročný používateľ: Starter a {{powerPacks}} bal.",
    row4Spend: "{{powerSpend}} mesačne",
    row4Earn: "{{powerEarn}} mesačne",
    p2: "Zručnosť dáva človeku dôvod kliknúť. Odkaz ti pripíše odporúčanie aj vtedy, keď používateľ neskôr prejde na inú zručnosť.",
    p3: "Zdieľaj zručnosť na piatich miestach. Časť ľudí klikne a niektorí si vytvoria účet. Z ich mesačných platieb dostávaš 10 %. Ďalšia zručnosť o mesiac môže zvýšiť zárobok bez rovnako veľkého nárastu práce.",
  },
  chain: {
    title: "Zarábaš aj z ďalších odporúčaní svojich používateľov",
    p1: "Keď niekto z tvojich odporúčaní privedie ďalších ľudí, dostaneš podiel aj z ich platieb. Reťazec siaha do 5 úrovní a sadzba na každej klesne na polovicu.",
    level1:
      "2. úroveň (odporúčania tvojich odporúčaní): približne 5 % z každej platby",
    level2: "3. úroveň: približne 2,5 % z každej platby",
    level3: "4. úroveň: približne 1,25 % z každej platby",
    level4: "5. úroveň: približne 0,625 % z každej platby",
    p2: "Provízie reťazca rýchlo klesajú. Najviac zarábaš priamymi 10 % z odporúčaní cez zručnosť. Príjem z ďalších úrovní ber ako doplnok a sústreď sa na to, komu zručnosť pomôže.",
  },
  howTo: {
    title: "Prvý odkaz za 5 minút",
    step1Title: "Vytvor alebo nájdi zručnosť",
    step1Body:
      "Vytvor ju na stránke zručností, požiadaj o pomoc Theu či Hermesa alebo nájdi vstavanú zručnosť, ktorú sa oplatí zdieľať.",
    step2Title: "Otvor zručnosť",
    step2Body:
      "Otvor podrobnosti zručnosti a nájdi tlačidlo Zdieľať a zarobiť.",
    step3Title: "Vytvor odkaz na zdieľanie",
    step3Body:
      "Stlač Zdieľať a zarobiť. Vyber existujúci odporúčací kód alebo si za pár sekúnd vytvor nový. Odkaz nesie kód aj identifikátor zručnosti. Odporúčania sa pripisujú automaticky.",
    step4Title: "Zdieľaj tam, kde pomôže",
    step4Body:
      "Zverejni ju v komunitách, ktoré ju využijú, napríklad na Discorde, Reddite, fóre, blogu alebo Slacku. Konkrétna komunita má väčšiu hodnotu než široký dosah.",
    step5Title: "Sleduj prehľad",
    step5Body:
      "Prehľad ukazuje návštevy, registrácie a zárobky v reálnom čase. Za každú registráciu cez odkaz dostávaš 10 % z jej ďalších platieb.",
  },
  close: {
    title: "Zručnosť pritiahne ľudí. Odkaz ti prinesie províziu.",
    p1: "Všeobecný registračný odkaz sa zdieľa ťažko. Zručnosť, ktorá pomáha premýšľať ako skúsený klinik, dá ľuďom konkrétny dôvod poslať ju ďalej.",
    p2: "Vytvor si niečo, čo by si sám používal. Zameraj sa na konkrétny problém a zdieľaj odkaz. Provízia 10 % sa potom pripisuje automaticky.",
    createSkill: "Vytvoriť prvú zručnosť",
    referralPage: "Nastaviť odporúčací kód",
  },
};
