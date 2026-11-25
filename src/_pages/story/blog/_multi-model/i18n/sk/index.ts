import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    back: "Späť na blog",
    category: "Porovnanie",
    readTime: "Čítanie na 7 minút",
    switching: "Prečo ľudia hľadajú alternatívy",
    criteria: "Čo porovnať pred prechodom",
    privacy:
      "Zisti, kde sa ukladá história a kto spracúva tvoje zadania. Ak pripojíš model prevádzkovaný u poskytovateľa, zadanie sa mu odošle aj z lokálneho rozhrania.",
    table: "Všetky možnosti vedľa seba",
    checked:
      "Ceny konkurencie sme overili {{date}}. Uvádzame ich v amerických dolároch. Cena pri platbe sa môže líšiť podľa krajiny. Údaje pre {{appName}} vychádzajú z aktuálnych nastavení služby. Na malej obrazovke môžeš tabuľkou posúvať do strán.",
    alternatives: "Ďalšie možnosti podrobne",
    price: "Cena",
    pro: "Hlavná výhoda",
    con: "S čím počítať",
    fit: "Vyber si ho, ak",
    faq: "Časté otázky",
    guides: "Súvisiace porovnania",
    modelCatalog: "Pozri si katalóg modelov",
  },
  kinds: {
    aggregator: "Online chat s viacerými modelmi",
    client: "Klient pre vlastné kľúče API",
    selfHosted: "Chatové rozhranie na vlastnom serveri",
    gateway: "Brána API s webovým chatom",
    creativeChat: "Online chat na tvorbu obsahu",
    singleProvider: "Online chat od jedného poskytovateľa",
  },
  us: {
    title: "{{appName}}. Online chat s výberom filtrov",
    intro:
      "Prepínaj modely v tej istej konverzácii bez nastavovania kľúčov API. V katalógu je {{modelCount}} modelov na chatovanie. Z toho je {{mainstream}} bežných, {{open}} otvorených a {{uncensored}} bez cenzúry. Prístup k modelom bez cenzúry vyžaduje potvrdenie veku aspoň 18 rokov.",
    price:
      "Každý mesiac dostaneš {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s účtom. Predplatné začína na {{subPrice}} mesačne. Kredity sa odpočítavajú podľa sadzby vybraného modelu.",
    privacy:
      "V režime inkognito zostáva história v prehliadači. Model prevádzkovaný u poskytovateľa dostane zadanie, ktoré potrebuje na odpoveď.",
    api: "Platený prístup k API kompatibilným s OpenAI a Anthropic začína na {{apiSubPrice}} mesačne.",
    cta: "Vyskúšaj rovnaké zadanie v dvoch modeloch",
    ctaSubtitle:
      "Začni v režime inkognito s mesačným prídelom {{guestCredits}} kreditov zdarma. Vyber si model a odošli prvú správu.",
    start: "Začni chat v režime inkognito",
    models: "Preskúmaj modely bez cenzúry",
  },
  platforms: {
    poe: {
      free: "Denné body zdarma",
      paid: "Od {{poeStart}} mesačne",
      filter: "Pravidlá Poe a jednotlivých botov",
      privacy: "Údaje z chatu spracúva Poe aj poskytovatelia botov",
      api: "Kompatibilné s OpenAI, čerpá body z predplatného",
      media: "Obrázky, video a zvuk",
      open: "Proprietárny softvér",
      models:
        "Online služba od Quory ponúka GPT, Claude, Gemini a ďalšie modely spolu s komunitnými botmi. Na chat aj médiá stačí jeden zostatok bodov. Kľúče API netreba nastavovať.",
      price:
        "Body zdarma sa obnovujú každých 24 hodín a zvyšok sa neprenáša. Najlacnejšie predplatné uvádza 10 000 bodov denne. Cena závisí od bota a môže rásť s dĺžkou vstupu, výstupu alebo kontextu.",
      pro: "Objav komunitné boty, pozvi ľudí do skupinového chatu alebo zverejni vlastného bota. Tvorcovia, ktorí spĺňajú podmienky, môžu zarábať za správy. Predplatitelia čerpajú rovnaké body v chate aj cez API.",
      con: "Rozsah využitia určuje prídel bodov a sadzba jednotlivých botov. Podľa zásad ochrany súkromia Poe môžu poskytovatelia a vývojári botov dostať konverzácie a nahraté súbory. Každý bot môže mať vlastné pravidlá a platia aj pravidlá Poe.",
      fit: "chceš online katalóg botov, skupinové chaty a jednu faktúru za modely od viacerých poskytovateľov.",
    },
    typingMind: {
      free: "Základné rozhranie bez licencie",
      paid: "Jednorazovo {{typingStandard}} plus cena za používanie modelov",
      filter: "Pravidlá pripojeného modelu a poskytovateľa",
      privacy: "Predvolené ukladanie v prehliadači, voliteľná synchronizácia",
      api: "Pripojenie k externým API",
      media: "Obrázky a hlas s podporovanými plánmi a modelmi",
      open: "Proprietárne, statická aplikácia na vlastnom serveri s platenou licenciou",
      models:
        "TypingMind je rozhranie pre vlastné kľúče API alebo kompatibilné koncové body. Pripojíš k nemu GPT, Claude, Gemini a ďalšie modely. S licenciou môžeš ukladať históriu v prehliadači.",
      price:
        "Standard stojí {{typingStandard}}, Extended {{typingExtended}} a Premium bolo v akcii za {{typingPremium}} pri cenníkovej cene {{typingList}}. Licencia nepokrýva používanie modelov. Rozšírené úložisko sa platí zvlášť.",
      pro: "Premium pridáva priečinky projektov a zobrazenie odpovedí vedľa seba so samostatným kontextom pre každý model. Nastavíš si parametre a využiješ služby poskytovateľov, ktorým už platíš.",
      con: "Bezplatné rozhranie neukladá chaty. Správu kľúčov a faktúr riešiš priamo s poskytovateľmi. Na vlastnom serveri môžeš prevádzkovať skompilovanú aplikáciu s platenou licenciou.",
      fit: "chceš platiť priamo poskytovateľom a používať hotového klienta s podrobnými nastaveniami.",
    },
    libreChat: {
      free: "Bezplatný softvér s licenciou MIT",
      paid: "Prípadné náklady na hosting a používanie modelov",
      filter: "Závisí od inštancie a modelu",
      privacy:
        "História na tvojej inštancii, modely u poskytovateľov dostávajú zadania",
      api: "API poskytovateľov a Agents API v beta verzii",
      media: "Generovanie obrázkov pomocou nastavených nástrojov",
      open: "Licencia MIT, prevádzka na vlastnom serveri",
      models:
        "LibreChat sa pripája k službám OpenAI, Anthropic, OpenRouter a ďalších poskytovateľov. Nainštaluj si ho na vlastný server alebo si vytvor účet a vyskúšaj verejné demo projektu.",
      price:
        "Za licenciu neplatíš. Počítaj s cenou servera a služieb platených poskytovateľov. Verejné demo slúži na vyskúšanie.",
      pro: "Prispôsobiteľný softvér s agentmi, MCP, vyhľadávaním v súboroch, importom chatu a viacerými formátmi exportu.",
      con: "Inštalácia, aktualizácie a zálohy sú na tebe. Do dema nedávaj citlivé údaje ani konverzácie, ktoré si potrebuješ uchovať.",
      fit: "chceš prispôsobiteľné rozhranie pre viacerých poskytovateľov a vieš spravovať server.",
    },
    openWebUi: {
      free: "Bezplatná prevádzka na vlastnom serveri podľa licencie",
      paid: "Prípadné náklady na hardvér, hosting alebo používanie modelov",
      filter: "Závisí od inštancie a modelu",
      privacy: "S lokálnymi modelmi funguje aj offline",
      api: "Ollama a koncové body kompatibilné s OpenAI",
      media: "Obrázky a hlas cez integrácie",
      open: "Dostupný zdrojový kód, podmienky používania značky",
      models:
        "Open WebUI je rozhranie na vlastný server pre Ollama a API kompatibilné s OpenAI. S lokálnym modelom môže chat bežať úplne offline.",
      price:
        "So značkou projektu môžeš softvér používať zadarmo. Pri väčších nasadeniach môže zmenu značky pokrývať samostatná licencia.",
      pro: "Spúšťaj modely a ukladaj históriu na vlastnom hardvéri. Neskôr môžeš v rovnakom rozhraní pripojiť aj cloudové API.",
      con: "Lokálne modely potrebujú dostatočne výkonný hardvér alebo samostatný server. Ak službu nasadzuješ pre iných, počítaj so správou prevádzky a podmienkami používania značky.",
      fit: "chceš v jednom rozhraní spúšťať lokálne modely aj modely u poskytovateľov, najmä ak potrebuješ pracovať offline.",
    },
    openRouter: {
      free: "Vybrané modely zdarma",
      paid: "Platba podľa spotreby",
      filter: "Pravidlá modelu a poskytovateľa",
      privacy:
        "Pravidlá spracúvania údajov závisia od spôsobu smerovania k poskytovateľovi",
      api: "Jednotné API",
      media: "Závisí od vybraného modelu",
      open: "Online služba, proprietárna",
      models:
        "V OpenRouter Chat môžeš v prehliadači skúšať modely z katalógu OpenRouter. Odošli jedno zadanie viacerým modelom a porovnaj odpovede vedľa seba.",
      price:
        "Za platené modely platíš podľa spotreby. Pri bežnom dobití kartou je poplatok {{routerFee}} a minimálna suma {{routerMinimum}}. Sadzby modelov určuje poskytovateľ.",
      pro: "Porovnaj odpovede a vyber si, kam sa budú požiadavky smerovať. Rovnaký zostatok využiješ aj cez API OpenRouter.",
      con: "Počet bezplatných požiadaviek je obmedzený. Cena závisí od modelu a kontextu. Pravidlá uchovávania údajov závisia od smerovania požiadavky.",
      fit: "chceš porovnávať veľa modelov v prehliadači a platiť podľa spotreby.",
    },
    venice: {
      free: "Denne 10 textových a 15 obrazových zadaní v základných modeloch",
      paid: "Pro za {{venicePro}} mesačne",
      filter: "V pláne Pro sa dá vypnúť filter obsahu pre dospelých",
      privacy:
        "Predvolene lokálna história, ochrana súkromia závisí od smerovania",
      api: "Platba za API v kreditoch",
      media: "Obrázky, video, hlas a hudba",
      open: "Online služba, proprietárna",
      models:
        "Venice prevádzkuje otvorené aj proprietárne textové modely a nástroje na tvorbu obrázkov, videa a zvuku. Na stránke o súkromí rozlišuje štyri spôsoby spracovania zadaní s odlišnou ochranou.",
      price:
        "Pro stojí {{venicePro}} mesačne. Na modely zahrnuté v pláne môžeš posielať neobmedzený počet textových zadaní. Niektoré špičkové modely a generovanie médií stále čerpajú kredity.",
      pro: "Históriu máš predvolene v prehliadači. Pro pridáva šifrované zálohy a pri podporovaných spôsoboch spracovania si môžeš vybrať hardvérovo chránené modely.",
      con: "Bezplatná verzia má denné limity. Pri niektorých špičkových modeloch sa zadania odosielajú externým poskytovateľom. Na vypnutie filtra obsahu pre dospelých potrebuješ aspoň plán Pro.",
      fit: "chceš mať väčšiu kontrolu nad nastaveniami obsahu a používať online rozhranie s lokálnou históriou.",
    },
    nanoGpt: {
      free: "Jeden bezplatný model vo webovom rozhraní",
      paid: "Platba podľa spotreby alebo Pro za {{nanoPro}} mesačne",
      filter: "Platia podmienky a limity modelov",
      privacy:
        "Predvolené ukladanie histórie v prehliadači, voliteľná synchronizácia",
      api: "API s predplateným zostatkom alebo čerpaním z príslušného plánu",
      media: "Obrázky, video a hlas",
      open: "Online služba, proprietárna",
      models:
        "NanoGPT ponúka bežné aj otvorené modely v prehliadači a cez API. Dobi si zostatok, ak chceš platené modely používať bez predplatného, alebo si vyber plán s prídelom v cene.",
      price:
        "Pro stojí {{nanoPro}} mesačne a zahŕňa až 60 miliónov vstupných tokenov týždenne vo vybraných otvorených modeloch a 100 obrázkov denne v štyroch zahrnutých obrazových modeloch.",
      pro: "Platíš podľa spotreby z jedného zostatku pre web aj API. História sa predvolene ukladá v prehliadači a pri registrácii môžeš použiť vygenerované ID.",
      con: "V pláne Pro sa používanie väčšiny uzavretých modelov, videa a hlasu stále odpočítava zo zostatku. Prídel v cene platí pre konkrétne modely.",
      fit: "službu využívaš nepravidelne alebo chceš pravidelný prídel najmä pre otvorené modely.",
    },
    chatGpt: {
      free: "Samostatný bezplatný plán ChatGPT Free",
      paid: "Plus za {{plus}} mesačne",
      filter: "Pravidlá OpenAI",
      privacy: "História v účte s nastaveniami používania údajov na trénovanie",
      api: "OpenAI API sa účtuje zvlášť",
      media: "Obrázky a hlas",
      open: "Online služba, proprietárna",
      models:
        "ChatGPT Plus je predplatné online služby od OpenAI. Zahŕňa prístup k modelom OpenAI, hlasové konverzácie, analýzu súborov, generovanie obrázkov a hĺbkový výskum tam, kde je dostupný.",
      price:
        "OpenAI uvádza cenu Plus {{plus}} mesačne. Limity sa môžu meniť a API sa účtuje samostatne.",
      pro: "Hlas, súbory aj výskum máš v jednej aplikácii za jasnú mesačnú cenu.",
      con: "Chat využíva modely jedného poskytovateľa a môžu pri ňom platiť limity používania. Predplatné Plus nepokrýva bežné používanie API OpenAI.",
      fit: "používaš najmä modely OpenAI a chceš nástroje, ktoré sú súčasťou ChatGPT.",
    },
  },
  posts: {
    poe: {
      metaTitle: "Porovnanie 8 alternatív k Poe (2026)",
      description:
        "Porovnaj alternatívy k Poe s jedným zostatkom, platbou podľa spotreby alebo vlastnými kľúčmi. Pozri si aktuálne ceny, obmedzenia aj možnosti služby {{appName}}.",
      keywords:
        "alternatívy k Poe, náhrada za Poe AI, body Poe, Poe vs. TypingMind, OpenRouter Chat, {{appName}}",
      title: "8 alternatív k Poe pre rôzne rozpočty",
      subtitle:
        "Používaj online chat, plať podľa potreby alebo si spusti vlastné rozhranie. Porovnávame osem možností vrátane {{appName}}.",
      lead: "Poe sa hodí, keď pravidelne používaš viacero modelov. Ak ťa zaskočí cena dlhej konverzácie, pozri si, ako by tú istú konverzáciu účtovala ďalšia aplikácia. Denný prídel, predplatený zostatok a platba za API poskytovateľa vyhovujú rôznym spôsobom používania.",
      overview: "Čo Poe ponúka a ako účtuje používanie",
      tradeoff:
        "Silnou stránkou Poe je verejný katalóg botov, odmeny pre tvorcov a skupinové chaty. {{appName}} účtuje používanie v kreditoch, preto si porovnaj cenu dlhej konverzácie v modeloch, ktoré skutočne používaš.",
      switch: {
        firstLink: "Ceny pri obnovení a prídely v Poe",
        secondLink: "Poe a platba podľa spotreby",
        first:
          "V jednej diskusii na r/PoeAI predplatitelia spomenuli zmeny cien pri obnovení a výšky bodového prídelu. Jeden plánoval prejsť na OpenRouter s TypingMind. Ďalšiemu pri jeho používaní stále vyhovoval pôvodný plán.",
        second:
          "V inom vlákne jeden používateľ uprednostnil OpenRouter, pretože lepšie videl ceny modelov. Ďalší uviedol, že pri pravidelnom používaní sa môže viac oplatiť denný prídel Poe. Ide o osobné skúsenosti. Porovnanie vychádza z oficiálnych cien uvedených nižšie.",
      },
      criteria: {
        cost: "Ak chat používaš nárazovo, porovnaj predplatenú službu s tým, čo zaplatíš za predplatné v pokojnom mesiaci. Ak chatuješ denne, zisti, na koľko bežných výmen správ ti vystačia pridelené body.",
        workflow:
          "Spíš si, čo využívaš okrem bežného chatu. Komunitné boty a skupinové chaty môžu byť dôvodom zostať pri Poe. Ak najmä porovnávaš odpovede, skontroluj, či môžeš zobraziť odpovede vedľa seba alebo prepínať modely v rámci konverzácie.",
      },
      faq: {
        best: {
          q: "Ktorá alternatíva k Poe je najlepšia?",
          a: "Ak chceš online chat s bežnými modelmi aj modelmi bez cenzúry, vyskúšaj {{appName}}. OpenRouter Chat a NanoGPT sa hodia na platbu podľa spotreby. TypingMind je vhodný na použitie s vlastnými kľúčmi a Open WebUI pre lokálnu prevádzku.",
        },
        free: {
          q: "Existuje bezplatná alternatíva k Poe?",
          a: "V {{appName}} dostaneš bez účtu {{guestCredits}} kreditov zdarma každý mesiac. OpenRouter má obmedzený výber bezplatných modelov. LibreChat a Open WebUI môžeš pri bežnej prevádzke na vlastnom serveri používať bez poplatku za softvér. Hardvér, hosting a platené služby môžu stále niečo stáť.",
        },
        billing: {
          q: "Ktoré alternatívy k Poe účtujú podľa spotreby?",
          a: "V OpenRouter a NanoGPT si dobiješ zostatok a platíš podľa používania. TypingMind a LibreChat môžeš prepojiť s účtami, za ktoré platíš priamo poskytovateľom. Najlacnejšia možnosť závisí od modelu, dĺžky kontextu a frekvencie používania.",
        },
        privacy: {
          q: "Ktorá alternatíva ukladá chaty lokálne?",
          a: "Open WebUI môže s lokálnym modelom bežať offline. TypingMind s licenciou predvolene ukladá históriu lokálne. Venice, NanoGPT a {{appName}} v režime inkognito môžu ponechať históriu na tvojom zariadení aj pri používaní online modelov. Tieto modely zadanie stále dostávajú.",
        },
        switching: {
          q: "Oplatí sa zostať pri Poe, ak používam komunitné boty?",
          a: "Často áno. Iné aplikácie majú vlastných agentov alebo nástroje, no katalóg botov, skupinové chaty a odmeny pre tvorcov sú špecifické pre Poe. Pred zmenou plánu si over, že v náhrade zvládneš všetko, čo dnes potrebuješ.",
        },
      },
    },
    typingMind: {
      metaTitle: "Porovnanie 8 alternatív k TypingMind (2026)",
      description:
        "Porovnaj alternatívy k TypingMind pre vlastné kľúče API, lokálne modely alebo online chat. Pozri si ceny licencií, účtovanie modelov aj možnosti služby {{appName}}.",
      keywords:
        "alternatívy k TypingMind, TypingMind vs. LibreChat, TypingMind vs. Open WebUI, vlastný kľúč API, {{appName}}",
      title: "8 alternatív k TypingMind pre tvoj AI chat",
      subtitle:
        "Nechaj si kľúče poskytovateľov a používaj vlastné rozhranie alebo prejdi rovno na online model. Porovnávame osem možností vrátane {{appName}}.",
      lead: "TypingMind dáva zmysel, keď chceš jedno prepracované rozhranie pre poskytovateľov, ktorým platíš. Ak ti ide predovšetkým o chat, spočítaj si cenu licencie, používania modelov a prípadnej rozšírenej synchronizácie. Možno ti stačí bezplatné rozhranie alebo online chat, ktorý správu modelov rieši za teba.",
      overview: "Čo získaš s licenciou TypingMind",
      tradeoff:
        "S TypingMind platíš priamo poskytovateľom a Premium dokáže zobraziť viac nezávislých odpovedí naraz. {{appName}} ponúka spoločný online katalóg a účtuje kredity podľa sadzby vybraného modelu. Ak už máš kredity u poskytovateľov a chceš ich čerpať priamo, vyber si klienta ako TypingMind.",
      switch: {
        firstLink: "Bezplatné alternatívy k TypingMind na vlastný server",
        secondLink: "Náklady nad rámec licencie TypingMind",
        first:
          "Na r/selfhosted jeden používateľ napísal, že TypingMind stál viac, než chcel zaplatiť. Hľadal rozhranie na vlastný server pre svoj prístup k OpenAI, vyskúšal Open WebUI a uviedol, že mu vyhovuje.",
        second:
          "Na r/TypingMind sa záujemca pýtal, čo sa platí okrem doživotnej licencie. V odpovediach sa spomínalo používanie API a voliteľné cloudové úložisko. Podmienky a sumy si over v aktuálnom cenníku, pretože diskusia opisuje jednotlivé prípady.",
      },
      criteria: {
        cost: "Porovnaj celkové ročné náklady vrátane licencie, používania modelov, úložiska a prípadného servera. Pri online predplatnom sa rozpočet plánuje ľahšie. Na príležitostnú prácu môže stačiť platba podľa spotreby.",
        workflow:
          "Ak potrebuješ vlastné kľúče alebo lokálny model, zahrň do výberu LibreChat a Open WebUI. Ak potrebuješ samostatný kontext pre každý model alebo projektové priečinky, vyskúšaj si tieto funkcie pred prechodom.",
      },
      faq: {
        best: {
          q: "Ktorá alternatíva k TypingMind je najlepšia?",
          a: "LibreChat sa hodí na prevádzku klienta s viacerými poskytovateľmi na vlastnom serveri. Open WebUI zvoľ pre lokálne modely, OpenRouter Chat na porovnávanie online modelov a {{appName}} na online chat s bežnými modelmi aj modelmi bez cenzúry bez nastavovania kľúčov.",
        },
        free: {
          q: "Existuje bezplatná alternatíva k TypingMind?",
          a: "LibreChat a Open WebUI môžeš podľa ich licencií bezplatne prevádzkovať na vlastnom serveri. Server a prípadné používanie platených modelov hradíš samostatne. V {{appName}} dostaneš {{guestCredits}} kreditov zdarma mesačne aj bez účtu.",
        },
        billing: {
          q: "Zahŕňa licencia TypingMind používanie API?",
          a: "Licenciu zaplatíš raz. Potom platíš poskytovateľom modelov podľa ich sadzieb. Pri lokálnom modeli platíš za hardvér a elektrinu. ChatGPT Plus je samostatné predplatné a nepokrýva bežné používanie API OpenAI.",
        },
        privacy: {
          q: "Znamená lokálna história chatu aj spracovanie bez internetu?",
          a: "TypingMind môže ukladať históriu na tvojom zariadení a zároveň posielať zadania priamo poskytovateľovi. Ak chceš históriu aj spracovanie nechať na vlastnom hardvéri, jednou z možností je Open WebUI s plne lokálnym modelom.",
        },
        switching: {
          q: "Môžem z TypingMind prejsť na Poe alebo OpenRouter Chat?",
          a: "Áno. Poe sprístupňuje modely cez body v predplatnom. OpenRouter Chat pri platených modeloch čerpá zo zostatku a vie poslať rovnaké zadanie viacerým modelom. Pred prechodom si ulož dôležité konverzácie a zisti, ktoré formáty sa dajú importovať do novej služby.",
        },
      },
    },
  },
};
