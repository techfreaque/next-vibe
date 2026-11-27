import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Čet s AI bez cenzúry v prehliadači",
  metaTitle: "AI čet bez cenzúry online, bez registrácie | {{appName}}",
  description:
    "Četbot bez cenzúry priamo v prehliadači: kredity zadarmo pre hostí, bez registrácie. Porovnaj modely podľa kontextu a ceny alebo začni hneď četovať.",
  keywords:
    "AI bez cenzúry, čet s AI bez filtrov, nefiltrovaný AI čet, ChatGPT bez filtrov, četbot bez cenzúry, abliterated AI, AI bez obmedzení",
  intro:
    "AI čet bez cenzúry znamená modely, ktoré odpovedajú namiesto odmietania. Četuj v prehliadači ako hosť: kredity zadarmo, bez registrácie, jedno potvrdenie veku 18+. Vyber model nižšie alebo začni najlacnejším.",
  tryModel: "Vyskúšať {{model}}",
  chooseModel: "Porovnať četovacie modely",
  choose:
    "Pri krátkej otázke začni pri vrchu zoznamu, kde sú lacnejšie modely. Pri dlhom dokumente alebo konverzácii vyber väčšie kontextové okno, aby model naraz spracoval viac textu.",
  start:
    "Otvor čet s vybraným modelom. Keď sa zobrazí výzva, potvrď, že máš aspoň 18 rokov, a prijmi podmienky. Ukážkové zadanie potom nahraď vlastnou otázkou.",
  models: "Vyber četovací model",
  order:
    "Modely sú zoradené od najnižšej odhadovanej ceny. Odhad počíta s najlacnejšou dostupnou trasou a počtom tokenov {{input}} na vstupe a {{output}} na výstupe. Dlhšia konverzácia môže stáť viac.",
  empty:
    "V tejto inštancii momentálne nie sú dostupné žiadne četovacie modely bez cenzúry.",
  context: "Veľkosť kontextového okna v tokenoch: {{tokens}}",
  price: "Odhad za výmenu správ: {{credits}} kr.",
  chat: "Otvoriť čet s modelom {{model}}",
  questions: "Pred prvým četom",
  faq: {
    access: {
      q: "Môžem vyskúšať AI čet bez cenzúry zadarmo?",
      a: "Ako hosť môžeš mesačne získať až {{credits}} kr. zdarma. Počet správ závisí od modelu a dĺžky konverzácie.",
    },
    outOfCredits: {
      q: "Čo sa stane, keď miniem kredity pre hostí?",
      a: "Môžeš počkať na ďalšie mesačné kredity alebo si vytvoriť bezplatný účet a overiť e-mail. Overený účet môže mesačne získať až {{credits}} kr. zdarma. Kredity, ktoré si už v danom mesiaci minul ako hosť, sa započítajú do tohto limitu.",
    },
    chatgpt: {
      q: "Existuje ChatGPT bez filtrov?",
      a: "Modely GPT od OpenAI si svoje filtre zachovávajú všade, aj tu. Pokusy o obídenie filtrov zadaním fungujú nanajvýš do ďalšej aktualizácie. Vyber si model z kategórie bez cenzúry a polož otázku priamo.",
    },
    kinds: {
      q: "Abliterated alebo bez cenzúry. Aký je rozdiel?",
      a: "Modely typu abliterated vychádzajú z bežných modelov s upraveným odmietaním odpovedí. Zachovávajú si tréning aj pôvodný pohľad na svet a častejšie odpovedia. Model {{model}} trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu, čo vedie k odlišným politickým názorom. Karta každého modelu uvádza jeho typ.",
    },
    filters: {
      q: "Čo tu znamená čet s AI bez filtrov?",
      a: "Vyberáš si model z kategórie bez cenzúry. Bežné modely vrátane GPT si zachovávajú vlastné filtre. Aj model bez cenzúry môže zadanie odmietnuť alebo odpovedať nesprávne.",
    },
    privacy: {
      q: "Sú moje čety súkromné?",
      a: "Čety v režime inkognito zostávajú v prehliadači a neukladajú sa na našich serveroch. Každé zadanie dostane poskytovateľ AI, aby mohol odpovedať. Nepoužívame sledovacie nástroje tretích strán ani reklamné pixely. Ak máš účet, v nastaveniach môžeš exportovať údaje ako JSON alebo účet odstrániť.",
    },
    legal: {
      q: "Je používanie AI bez cenzúry legálne?",
      a: "Používanie modelu, ktorý odmieta menej otázok, nie je zakázané. Na spôsob, akým odpovede použiješ alebo zverejníš, sa vzťahujú rovnaké zákony ako na iný text. Pred prvým použitím modelu bez cenzúry raz potvrdíš, že máš aspoň 18 rokov.",
    },
    local: {
      q: "Potrebujem na tieto modely grafickú kartu?",
      a: "Stačí prehliadač a pripojenie na internet. Zadanie spracuje poskytovateľ. Ak chceš model spúšťať výlučne na vlastnom zariadení, musíš ho nainštalovať lokálne.",
    },
    askAnything: {
      q: "Môžem sa AI bez cenzúry opýtať na čokoľvek?",
      a: "Opýtať sa môžeš na čokoľvek. Modely z úrovne bez cenzúry preskakujú bežné frázy odmietnutia, takže väčšina otázok dostane priamu odpoveď. Model aj tak môže odmietnuť alebo sa mýliť, dôležité fakty si preto over. Za to, čo s odpoveďami urobíš, zodpovedáš ty.",
    },
    online: {
      q: "Funguje to online, bez aplikácie?",
      a: "Áno. Každý model beží v prehliadači, na počítači aj v mobile. Nič neinštaluješ, nepotrebuješ GPU. Po akomkoľvek nákupe sú tie isté modely dostupné aj cez API kompatibilné s OpenAI.",
    },
    pick: {
      q: "Ktorý AI četbot bez cenzúry si vybrať?",
      a: "Na rýchlu otázku začni s {{cheapest}}, najlacnejším modelom v zozname. Na dlhé dokumenty vyber model s kontextovým oknom {{context}}.",
      aWorldview:
        "Na rýchlu otázku začni s {{cheapest}}, najlacnejším modelom v zozname. Na dlhé dokumenty vyber model s kontextovým oknom {{context}}. Ak chceš odpovede mimo názorov hlavného prúdu, vyskúšaj {{model}}: trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu, čo vedie k odlišným politickým názorom.",
    },
  },
  guides: "Porovnať modely a platformy",
  chatgptGuide: "ChatGPT bez filtrov: aké sú možnosti",
  abliteratedChat: "Vyskúšať upravený model v čete",
  compare: "Porovnať platformy na AI čet bez cenzúry",
  benchmark: "Zistiť, ktoré modely odpovedali na rovnaké testovacie otázky",
  breadcrumb: "AI bez cenzúry",
  guidesTitle: "Príručky k AI bez cenzúry",
  guidesIntro:
    "Ktorý model sa hodí na tvoju úlohu, čo v ňom metóda abliteration mení a ako četovať alebo používať API bez grafickej karty či účtu.",
  comparisons: "Priame porovnania modelov",
  comparisonsIntro:
    "Na každej stránke nájdeš dva modely vedľa seba. Pred výberom si pozri, v čom sa líšia.",
  versus: "{{a}} a {{b}}",
};
