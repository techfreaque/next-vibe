import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Správa serverov",
  tags: {
    imagePush: "Odoslanie obrazu",
  },
  post: {
    title: "Zostaviť a odoslať obraz",
    titleShort: "Odoslať obraz",
    description:
      "Zostaví produkčný obraz Dockeru a odošle ho do registra alebo cez SSH priamo na server. Server obraz načíta z registra alebo ho už má lokálne.",
    form: {
      title: "Nastavenia odoslania obrazu",
      description: "Nastaviť názov obrazu, značku a cieľovú platformu",
      submit: "Zostaviť a odoslať",
      runAgain: "Spustiť znova",
    },
    fields: {
      image: {
        title: "Obraz",
        description:
          "Register a názov obrazu, ktorý sa má zostaviť a odoslať. Predvolene sa použije DOCKER_IMAGE_NAME zo súboru .env.",
      },
      commit: {
        title: "Commit",
        description:
          "Commit na zostavenie. Zadaj SHA, značku alebo názov vetvy. Predvolený je HEAD aktuálnej vetvy. Do obrazu sa zahrnie iba kód z commitu. Zmeny pracovného stromu bez commitu sa vynechajú.",
      },
      tag: {
        title: "Značka",
        description:
          "Značka obrazu. Predvolená je skrátená hodnota SHA zostaveného commitu. Obraz vždy dostane aj značky so skráteným SHA a latest.",
      },
      push: {
        title: "Odoslať",
        description:
          "Po zostavení odošle obraz do registra alebo na cieľ cez SSH. Po vypnutí sa obraz iba zostaví lokálne, bez odoslania, prenosu cez SSH či nasadenia.",
      },
      platform: {
        title: "Platforma",
        description:
          "Cieľová platforma zostavy (docker buildx --platform). Musí zodpovedať architektúre nasadzovacieho servera, zvyčajne linux/amd64.",
      },
      sshTarget: {
        title: "Cieľ SSH",
        description:
          "Zadajte user@host, ak chcete poslať zostavený obraz priamo cez SSH (napr. root@203.0.113.5). Ak je nastavený SSH_SERVER, použije sa predvolene. Najprv sa ponúkne kľúč SSH_SERVER_KEY, potom heslo SSH_SERVER_PWD. Ak ani jedna hodnota nie je nastavená, použije sa váš kľúč alebo konfigurácia SSH. Prázdne pole odošle obraz do registra.",
      },
      secondary: {
        title: "Aktualizovať server 2",
        description:
          "Keď server 1 beží a prejde kontrolou stavu, aktualizuje aj druhý uzol HA (SSH_SERVER2). Načíta obraz so značkou SSH_SERVER2_IMAGE_TAG bez použitia :latest, zosynchronizuje .env zo servera 1, obnoví kontajner, skontroluje stav a pri zlyhaní vráti pôvodnú verziu. Caddy počas aktualizácie presmeruje prevádzku na druhý server. Voľba sa neuplatní, ak SSH_SERVER2 nie je nastavené alebo je zadané --sshTarget.",
      },
      primary: {
        title: "Nasadiť server 1",
        description:
          "Predvolene zapnuté. Ak server 1 nefunguje alebo je po prechode na záložný uzol izolovaný, prepni voľbu na vypnuté. Obraz sa odošle z tohto počítača priamo na server 2 (SSH_SERVER2) a aktualizuje sa iba tento uzol. Jeho .env aj nastavenia záložnej prevádzky zostanú zachované. Prenos je pomalší, pretože ide z tohto počítača priamo na server 2.",
      },
      drain: {
        title: "Odkloniť prevádzku pred reštartom",
        description:
          "Predvolene zapnuté pre oba uzly HA. Uzol sa najprv vyradí z prevádzky. Caddy odošle nové požiadavky na druhý uzol a záznam DNS sa odoberie. Uzol dokončí prebiehajúce odpovede AI a úlohy, presunie klientov WebSocket a až potom dostane nový obraz. Začína server 1. Po aktualizácii prevezme prevádzku, kým server 2 dokončí svoje spracovanie. Po vypnutí sa kontajner obnoví bez čakania.",
      },
      drainTimeout: {
        title: "Čas na dokončenie požiadaviek (sekundy)",
        description:
          "Čas, ktorý uzol pred reštartom najviac čaká na prebiehajúcu prácu AI. Zvyšné požiadavky dostanú čas na dokončenie podľa STREAM_DRAIN_TIMEOUT_MS. Potom sa prerušia a doterajší obsah sa uloží.",
      },
      cleanup: {
        title: "Vyčistiť lokálne zdroje",
        description:
          "Predvolene zapnuté. Po úspešnom odoslaní ponechá nový obraz a obrazy používané kontajnermi. Ostatné miestne značky ghcr.io/techfreaque/next-vibe-app odstráni. Ďalšie exporty commitov a ich značky presunie do .tmp/todelete/image-build/. Vyčistí vyrovnávaciu pamäť zostáv Dockeru nepoužívanú aspoň 24 hodín s cieľom 30 GB. Ak je v súborovom systéme Dockeru menej ako 40 GB voľného miesta, vyčistí ho aj pred zostavením. Na produkčných serveroch použite remoteCleanup.",
      },
      remoteCleanup: {
        title: "Vyčistiť produkčné servery",
        description:
          "Predvolene zapnuté. Po nasadení a úspešnej kontrole stavu ponechá na serveri obrazy používané kontajnermi, značky na návrat (server 1: :latest, :rollback a :prod-current-good; server 2: :unbottled, :unbottled-rollback, :unbottled-prev a :latest druhej hostovanej stránky) a 3 najnovšie zostavy ghcr.io/techfreaque/next-vibe-app. Staršie značky odstráni príkazom docker rmi bez -f. Docker odmietne odstrániť používané obrazy. Nakoniec sa odstránia nepoužívané obrazy bez značky. Ak pred načítaním zostáva menej ako 30 GB, použijú sa rovnaké pravidlá. Čistenie platí len pre nakonfigurované servery HA. Pri zadaní --sshTarget sa nepoužíva. Po vypnutí sa zobrazí iba upozornenie.",
      },
      skipCheck: {
        title: "Preskočiť bezpečnostnú kontrolu",
        description:
          "Výslovná výnimka na obídenie kontroly pred zostavením (overenie vibe gen a úplný vibe check). Vyžaduje neprázdny dôvod, ktorý sa zapíše do záznamu. Nezapisuje značku .checked.",
      },
      checkOnly: {
        title: "Iba kontrola",
        description:
          "Exportuje commit, spustí bezpečnostnú kontrolu pred zostavením (overenie vibe gen a úplný vibe check), pri úspechu zapíše značku .checked a skončí pred zostavením a odoslaním obrazu Docker.",
      },
      success: {
        title: "Úspech",
      },
      output: {
        title: "Výstup",
      },
      resolvedImage: {
        title: "Obraz",
      },
      tags: {
        title: "Odoslané značky",
      },
      duration: {
        title: "Trvanie (ms)",
      },
    },
    errors: {
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Parametre na odoslanie obrazu sú neplatné.",
      },
      network: {
        title: "Chyba siete",
        description: "Počas odosielania obrazu zlyhalo sieťové pripojenie",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Zostavenie a odoslanie obrazu vyžaduje prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Na zostavenie a odoslanie obrazu nemáte oprávnenie",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroje na odoslanie obrazu sa nenašli",
      },
      server: {
        title: "Chyba servera",
        // Declared errorTypes label - rendered param-free, so no placeholder.
        description: "Zostavenie alebo odoslanie obrazu Dockeru zlyhalo",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri odosielaní obrazu nastala neznáma chyba",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri odosielaní obrazu sa zistil konflikt",
      },
      unsavedChanges: {
        title: "Neznáma chyba",
        description: "Pri odosielaní obrazu nastala neznáma chyba",
      },
    },
    success: {
      title: "Obraz odoslaný",
      description: "Obraz Dockeru sa zostavil a odoslal",
    },
    repository: {
      messages: {
        buildStart: "🐳 Zostavuje sa {{image}}:{{tag}}…",
        buildSuccess: "✅ Zostavené bez odoslania: {{refs}}",
        pushSuccess: "🚀 Odoslané: {{refs}}",
        buildMemoryExceeded:
          "Zostavenie sa zastavilo na pamäťovom limite {{gb}} GB.",
        buildExitCode: "docker buildx skončil s kódom {{code}}",
        buildKilled: "Príkaz docker buildx ukončil signál {{signal}}",
        dockerBuildFailed: "Zostavenie obrazu Docker zlyhalo: {{error}}",
        commitResolveFailed: "Nepodarilo sa nájsť commit „{{ref}}“",
        commitResolveFailedDetail:
          "Nepodarilo sa nájsť commit „{{ref}}“: {{error}}",
        commitResolved: "📌 Zostavuje sa commit {{sha}} ({{ref}}): {{subject}}",
        dirtyTreeWarning:
          "⚠️ Pracovný strom obsahuje zmeny bez commitu. Počet: {{count}}. Zostaví sa iba commit {{sha}}.",
        deployedShaRecorded:
          "📝 Nasadený commit {{sha}} bol zaznamenaný do {{path}}.",
        deployedShaRecordFailed:
          "Nasadenie sa podarilo. Zápis do {{path}} zlyhal: {{error}}",
        exportStart: "📦 Exportuje sa commit {{sha}} do {{dir}}…",
        exportReused:
          "📦 Používa sa existujúci export commitu {{sha}} v {{dir}}",
        exportFailed: "Export commitu {{sha}} zlyhal: {{error}}",
        sshTransferStart: "📡 Prenáša sa {{refs}} na {{target}} cez SSH…",
        sshTransferSuccess:
          "🚀 Prenos {{refs}} na {{target}} cez SSH je dokončený",
        sshTransferFailed: "Prenos cez SSH na {{target}} zlyhal: {{error}}",
        scriptSynced:
          "📜 Skript {{script}} na {{target}} sa zosynchronizoval z commitu {{sha}}",
        scriptSyncFailed:
          "Synchronizácia {{script}} na {{target}} zlyhala. Nasadenie bolo prerušené: {{error}}",
        scriptMissing: "V commite {{sha}} chýba {{path}}",
        scriptSyntaxInvalid:
          "Kontrola bash -n odmietla {{path}} z commitu {{sha}}. Nasadený skript zostal nezmenený.",
        pgGuardFailed:
          "Strážca Postgresu na {{target}} zastavil nasadenie, nič sa nezmenilo: {{error}}",
        pgGuardMissing: "{{path}} v tomto checkoute chýba",
        pgGuardPassed: "🛡️ Strážca Postgresu na {{target}} prešiel",
        scriptRemoteExit: "Vzdialený príkaz skončil s kódom {{code}}",
        secondaryStart:
          "🔁 Server 1 je v prevádzke. Aktualizuje sa server 2 ({{target}})…",
        secondarySuccess:
          "🚀 {{refs}} nasadené na {{target}} aj na server 2 ({{secondary}})",
        secondaryOnlyMissing:
          "Voľba --primary=false aktualizuje iba server 2. Chýba však SSH_SERVER2.",
        secondaryOnlySuccess:
          "🚀 Server 1 sa preskočil. {{refs}} sa nasadil na server 2 ({{secondary}}).",
        secondaryOnlyFailed:
          "Aktualizácia samotného servera 2 ({{secondary}}) zlyhala: {{error}}. Server 2 ponechal alebo obnovil predchádzajúci obraz.",
        secondaryFailed:
          "Na serveri 1 ({{target}}) beží nový obraz. Aktualizácia servera 2 ({{secondary}}) zlyhala: {{error}}. Server 2 ponechal alebo obnovil predchádzajúci obraz.",
        drainStart:
          "🚰 Uzol {{node}} prestáva prijímať nové požiadavky. Obslúži ich druhý uzol. Prebiehajúce požiadavky AI majú najviac {{timeout}} s na dokončenie.",
        drainSwap:
          "🔀 {{from}} beží na novom obraze a opäť preberá prevádzku. Dokončujú sa požiadavky na {{to}} (najviac {{timeout}} s).",
        drainUndrained:
          "Uzol {{node}} znova obsluhuje prevádzku na predchádzajúcom obraze",
        drainLeftDrained:
          "Uzol {{node}} zostáva mimo prevádzky. Všetky požiadavky obsluhuje druhý uzol. Chyba: {{error}}. Po oprave na oboch serveroch spustite bash scripts/ha-node-drain.sh edge-off {{node}}.",
        drainPreflightFailed:
          "Predbežná kontrola na {{target}} zamietla nasadenie. Nič sa nezmenilo: {{error}}",
        drainScriptMissing:
          "V commite {{sha}} chýba scripts/ha-node-drain.sh. Nasadenie pokračuje bez čakania na dokončenie požiadaviek.",
        drainStepFailed:
          "ha-node-drain.sh {{step}} na {{target}} zlyhalo: {{error}}",
        envSyncFailed:
          "Kopírovanie súboru .env zo servera 1 na server 2 zlyhalo: {{error}}",
        cleanupSkippedImage:
          "🧹 Lokálne čistenie sa preskočilo. {{image}} sa nezhoduje s povoleným obrazom {{allowed}}.",
        cleanupListFailed:
          "Miestne čistenie sa preskočilo, pretože sa nepodarilo načítať zoznam obrazov pre {{image}}: {{error}}",
        cleanupCurrentMissing:
          "Miestne čistenie obrazov sa preskočilo, pretože sa nepodarilo nájsť práve načítanú zostavu {{image}}.",
        cleanupTagFailed: "Nepodarilo sa odstrániť lokálne {{ref}}: {{error}}",
        cleanupTagsRemoved:
          "🧹 Odstránené staré lokálne odkazy pre {{image}}: {{count}} ({{tags}})",
        cleanupCachePruned:
          "🧹 Odstránila sa vyrovnávacia pamäť zostáv Dockeru nepoužívaná aspoň {{hours}} h. Uvoľnené miesto: {{reclaimed}}.",
        cleanupCacheCapped:
          "🧹 Vyrovnávacia pamäť zostáv Dockeru sa zmenšila s cieľom {{size}} GB. Uvoľnené miesto: {{reclaimed}}.",
        cleanupCacheFailed:
          "Čistenie vyrovnávacej pamäte zostáv Dockeru zlyhalo: {{error}}",
        cleanupExportsParked:
          "🧹 Staré exporty commitov sa presunuli do {{dir}}. Počet: {{count}}.",
        cleanupExportFailed:
          "Presun starého exportu commitu {{dir}} zlyhal: {{error}}",
        diskLow:
          "⚠️ Na {{path}} je voľných iba {{free}} GB (minimum {{min}} GB). Pred zostavením sa odstránia staré lokálne obrazy a vyrovnávacia pamäť zostavenia…",
        diskLowNoCleanup:
          "⚠️ Na {{path}} je voľných iba {{free}} GB (minimum {{min}} GB). Čistenie je vypnuté a nič sa neodstránilo. Zostavenie môže zaplniť disk.",
        diskAfterPrune: "💽 Voľné miesto na {{path}} po čistení: {{free}} GB",
        diskCheckFailed:
          "Nepodarilo sa zistiť voľné miesto na {{path}}: {{error}}",
        remoteDiskOk: "💽 {{target}}: pred načítaním je voľných {{free}} GB",
        remoteDiskLow:
          "⚠️ {{target}}: voľných iba {{free}} GB (minimum {{min}} GB). Pred načítaním sa odstránia staré obrazy…",
        remoteDiskLowNoCleanup:
          "⚠️ {{target}}: voľných iba {{free}} GB (minimum {{min}} GB). remoteCleanup je vypnuté. Nič sa neodstránilo a načítanie môže zaplniť disk.",
        remoteDiskAfter: "💽 {{target}}: po čistení je voľných {{free}} GB",
        remoteListFailed:
          "Čistenie starých obrazov na {{target}} sa preskočilo. Nič nebolo odstránené: {{error}}",
        remoteTagFailed: "{{target}}: nemohol odstrániť {{ref}} : {{error}}",
        remoteRetained:
          "🧹 {{target}}: odstránené staré odkazy na obrazy ({{count}}). Zachované nové zostavy ({{keep}}), značky na návrat a používané obrazy: {{tags}}. Odstránené nepoužívané vrstvy: {{pruned}}",
        gateSkipped:
          "⚠️ Bezpečnostná kontrola nasadenia PRESKOČENÁ pre commit {{sha}} (--skipCheck): {{reason}}",
        gateCached:
          "✅ Bezpečnostná kontrola už prešla pre commit {{sha}} (uložená značka: {{marker}})",
        gateGenStart:
          "🔍 Overuje sa aktuálnosť vygenerovaných súborov v commite {{sha}}…",
        gateGenPassed: "✅ Vygenerované súbory sú aktuálne pre commit {{sha}}",
        gateGenFailed:
          "Nasadenie zablokované: kontrola vibe gen zlyhala pre commit {{sha}}: {{error}}",
        gateGenStale:
          "Nasadenie zablokované: vygenerované súbory v commite {{sha}} sú zastarané ({{count}} zmenených súborov): {{files}}",
        gateCheckStart:
          "🔍 Spúšťa sa úplný vibe check v exportovanom commite {{sha}}…",
        gateCheckPassed: "✅ Úplný vibe check prešiel pre commit {{sha}}",
        gateCheckFailed:
          "Nasadenie zablokované: vibe check zlyhal pre commit {{sha}}: {{error}}",
        gateCheckIncomplete:
          "Nasadenie zablokované: vibe check sa nedokončil pre commit {{sha}}: {{error}}",
        gateSetupFailed:
          "Nasadenie zablokované: exportovaný commit {{sha}} sa nepodarilo pripraviť na kontrolu: {{error}}",
        gateCleanupWarn:
          "⚠️ Upozornenie pri upratovaní po kontrole v {{dir}}: {{error}}",
        gateMarkerWarn:
          "⚠️ Bezpečnostná kontrola prešla pre {{sha}}, ale zápis značky {{path}} zlyhal: {{error}}",
        gatePassed:
          "✅ Bezpečnostná kontrola nasadenia prešla pre commit {{sha}}",
        checkOnlySuccess:
          "✅ Bezpečnostná kontrola ({{status}}) pre commit {{sha}} (zostavenie a odoslanie Dockeru preskočené cez --checkOnly)",
      },
    },
  },
};
