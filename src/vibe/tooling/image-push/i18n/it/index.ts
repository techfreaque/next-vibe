import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione server",
  tags: {
    imagePush: "Spinta dell'immagine",
  },
  post: {
    title: "Costruisci &amp; Push Image",
    titleShort: "Immagine di spinta",
    description:
      "Costruisci l'immagine Docker di produzione e consegnala al registro o direttamente a un server tramite SSH, quindi il server di distribuzione tira solo (o già lo ha) invece di costruirla",
    form: {
      title: "Configurazione push immagine",
      description:
        "Configurare il nome dell'immagine, tag e piattaforma di destinazione",
      submit: "Costruire e Spingere",
      runAgain: "Correre di nuovo",
    },
    fields: {
      image: {
        title: "Immagine",
        description:
          "Registro + nome dell'immagine per costruire e spingere. Predefiniti per DOCKER_IMAGE_NAME dal tuo.env.",
      },
      commit: {
        title: "Commit",
        description:
          "Impedire di costruire: un nome sha, tag o ramo. Predefinisce HEAD del ramo corrente. Solo navi di codice impegnate. Non sono mai inclusi cambiamenti non accettati nell'albero di lavoro.",
      },
      tag: {
        title: "Tag",
        description:
          "Etichetta d'immagine. Predefinisce la scia corta del commit costruito. La breve scia e' sempre etichettata.",
      },
      push: {
        title: "Spingi",
        description:
          "Spingere al registro di sistema (o trasferire al target SSH) dopo l'edificio. Disattivare per costruire solo localmente: nessuna spinta, nessun trasferimento SSH, nessun dispiegamento.",
      },
      platform: {
        title: "Piattaforma",
        description:
          "Piattaforma di destinazione per la costruzione (docker Buildx --platform). Deve corrispondere all'architettura del server di distribuzione - di solito linux/amd64.",
      },
      sshTarget: {
        title: "Obiettivo SSH",
        description:
          "user@host per trasferire l'immagine costruita direttamente su SSH invece di un registro (ad esempio root@203.0.113.5) - predefinizioni a SSH_SERVER se impostato. Offre prima la chiave SSH_SERVER_KEY, poi SSH_SERVER_PWD come il failback della password; né impostato = il proprio tasto SSH/config. Lasciare vuoto per spingere al Registro di sistema invece.",
      },
      secondary: {
        title: "Roll Server 2",
        description:
          "Dopo che Server 1 è live e sano, anche rotolare il secondo nodo HA (SSH_SERVER2): caricare l'immagine sotto SSH_SERVER2_IMAGE_TAG (mai:latest), sincronizzare Server 1's.env, ricreare, controllo sanitario, auto-rollback. Ogni scatola di Caddy serve dall'altra scatola nel frattempo, quindi nessuno vede un gap. Ignorato quando SSH_SERVER2 è unset o -- sshTarget è dato.",
      },
      primary: {
        title: "Server di distribuzione 1",
        description:
          "Predefinito. Off = Server 1 è giù o recintato dopo un failover: spedire l'immagine da questa macchina direttamente a Server 2 (SSH_SERVER2) e rotolare solo quel nodo, mantenendo il proprio.env e failover overrides. Slow (home upload, no box-to-box relay).",
      },
      drain: {
        title: "Scolare prima di riavviare",
        description:
          "Predefinito su (entrambi i nodi HA). Ogni nodo lascia la rotazione prima (Caddy invia nuove richieste al pari, DNS lo rilascia), termina i suoi flussi e le attività AI in volo, sposta i suoi client WebSocket oltre, e solo allora ottiene la nuova immagine. Prima Server 1, poi Server 1 riprende il traffico mentre Server 2 drena. Off = ricreare senza aspettare (vecchio comportamento).",
      },
      drainTimeout: {
        title: "Tempo di drenaggio (secondi)",
        description:
          "Più a lungo un nodo aspetta il suo lavoro in volo AI prima del riavvio. Qualunque cosa funzioni ancora, ottiene lo scarico di spegnimento (STREAM_DRAIN_TIMEOUT_MS) ed è abortito con contenuti parziali salvati.",
      },
      cleanup: {
        title: "Pulire localmente",
        description:
          "Per impostazione predefinita. Dopo una spinta di successo, mantenere l'immagine appena carica e le immagini utilizzate dai contenitori. Rimuovere altri tag ghcr.io /techfreaque/ next-vibe -app locali. Spostare tutte le altre esportazioni di commit e i loro marcatori a.tmp/todelete/image-build/. Prune Docker costruisce la cache inutilizzata per almeno 24 ore e target 30 GB. Sotto i 40 GB liberi sul filesystem Docker, la pulizia viene eseguita anche prima della costruzione. Utilizzare remoteCleanup per i server di produzione.",
      },
      remoteCleanup: {
        title: "Pulire i server prod",
        description:
          "Predefinito. Dopo un nodo distribuito e superato il suo controllo sanitario, tenere su quel server solo: l'immagine qualsiasi contenitore viene eseguito, i suoi tag rollback (Server 1 : più tardi, :rollback, :prod-current-good; Server 2 :unbottled-rollback, :unbottled-prev e il sito co-hosted's :latest) e le più recenti 3 build di ghcr.io/Tecnologia/Consiglio/Consiglionext-vibe- App. I tag più vecchi vanno con docker rmi semplice (mai -f, docker rifiuta immagini in uso), quindi le immagini di abbagliamento sono indiscreti. Prima di ogni carico, meno di 30 GB libera esegue la stessa ritenzione. Solo i server HA configurati, mai un esplicito -- sshTarget. Off = avvertire solo.",
      },
      skipCheck: {
        title: "Salta controllo di sicurezza",
        description:
          "Uscita esplicita per saltare il controllo di sicurezza pre-build (controllo vibe gen e vibe check completo). Richiede un motivo non vuoto che viene registrato nei log. Non scrive il marcatore .checked.",
      },
      checkOnly: {
        title: "Solo controllo",
        description:
          "Esporta il commit, esegue il controllo di sicurezza pre-build (vibe gen e vibe check completo), scrive il marcatore .checked in caso di successo e si ferma prima di build e push Docker.",
      },
      success: {
        title: "Operazione riuscita",
      },
      output: {
        title: "Produzione",
      },
      resolvedImage: {
        title: "Immagine",
      },
      tags: {
        title: "Tags Spinta",
      },
      duration: {
        title: "Durata (m)",
      },
    },
    errors: {
      validation: {
        title: "Convalida non riuscita",
        description: "Parametri di spinta dell'immagine non valida forniti",
      },
      network: {
        title: "Errore di rete",
        description:
          "La connessione di rete non è riuscita durante la spinta dell'immagine",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per costruire e spingere l'immagine",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di costruire e spingere l'immagine",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorse di spinta dell'immagine non trovate",
      },
      server: {
        title: "Errore del server",
        // Declared errorTypes label - rendered param-free, so no placeholder.
        description: "Docker costruire o spingere fallito",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la spinta dell'immagine",
      },
      conflict: {
        title: "Conflitto",
        description: "Rilevato conflitto di spinta dell'immagine",
      },
      unsavedChanges: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante la spinta dell'immagine",
      },
    },
    success: {
      title: "Immagine spinta",
      description: "Immagine Docker costruita e spinta con successo",
    },
    repository: {
      messages: {
        buildStart: " ⁇  Costruire {{image}}: {{tag}}...",
        buildSuccess: "✅ Costruito {{refs}} (non spinto)",
        pushSuccess: "{{refs}} spinta",
        buildMemoryExceeded:
          "Build interrotta al raggiungimento del limite di memoria di {{gb}} GB.",
        buildExitCode: "docker buildx uscito con il codice {{code}}",
        buildKilled: "docker buildx è stato ucciso dal segnale {{signal}}",
        dockerBuildFailed: "La costruzione di Docker non è riuscita: {{error}}",
        commitResolveFailed: "Non si può risolvere commit ' {{ref}}'",
        commitResolveFailedDetail:
          "Non è possibile risolvere commit ' {{ref}}': {{error}}",
        commitResolved: " ⁇  Costruire commit {{sha}} ({{ref}}): {{subject}}",
        dirtyTreeWarning:
          " ⁇  L'albero di lavoro ha {{count}} modifiche non commesse. Sono EXCLUDED dall'immagine. Solo commettere {{sha}} è costruito.",
        deployedShaRecorded: " ⁇  Registrato impegnato {{sha}} in {{path}}",
        deployedShaRecordFailed:
          "Deploy è riuscito, ma la scrittura {{path}} ha fallito: {{error}}",
        exportStart: " ⁇  Esportazione commit {{sha}} a {{dir}}...",
        exportReused:
          " ⁇  Riutilizzare l'albero esportato per {{sha}} a {{dir}}",
        exportFailed: "L'esportazione di commit {{sha}} ha fallito: {{error}}",
        sshTransferStart: " ⁇  Trasferire {{refs}} a {{target}} tramite ssh...",
        sshTransferSuccess: " ⁇  Trasferito {{refs}} a {{target}} tramite ssh",
        sshTransferFailed: "trasferimento ssh a {{target}} fallito: {{error}}",
        scriptSynced: " ⁇  Sinced {{script}} su {{target}} dal commit {{sha}}",
        scriptSyncFailed:
          "Sincronizzazione di {{script}} a {{target}} fallita, implementazione abortita: {{error}}",
        scriptMissing: "{{path}} manca dal commit {{sha}}",
        scriptSyntaxInvalid:
          "bash -n ha respinto {{path}} dal commit {{sha}}. Scritto dal vivo intatto.",
        pgGuardFailed:
          "Il controllo Postgres su {{target}} ha bloccato il deploy, nulla è stato modificato: {{error}}",
        pgGuardMissing: "{{path}} manca in questo checkout",
        pgGuardPassed: "🛡️ Controllo Postgres superato su {{target}}",
        scriptRemoteExit: "comando remoto uscito con codice {{code}}",
        secondaryStart: " ⁇  Server 1 live. Rolling Server 2 ({{target}})...",
        secondarySuccess:
          " ⁇  Rolled {{refs}} a {{target}} e Server 2 ({{secondary}})",
        secondaryOnlyMissing:
          "--primary=false rolls Server 2 solo, ma SSH_SERVER2 non è impostato",
        secondaryOnlySuccess:
          " ⁇  Server 1 saltato. Rolled {{refs}} a Server 2 ({{secondary}})",
        secondaryOnlyFailed:
          "Rolling Server 2 ({{secondary}}) da solo fallito: {{error}}. Server 2 ha mantenuto o ripristinato la sua immagine precedente.",
        secondaryFailed:
          "Server 1 ({{target}}) è LIVE sulla nuova immagine, ma il rolling Server 2 ({{secondary}}) non è riuscito: {{error}}. Server 2 ha mantenuto o ripristinato la sua immagine precedente.",
        drainStart:
          " ⁇  Draining {{node}}: il nuovo traffico va al pari, il lavoro in volo AI arriva fino a {{timeout}} s",
        drainSwap:
          " ⁇  {{from}} è in diretta sulla nuova immagine e riprende il traffico. Drenaggio {{to}} (fino a {{timeout}} s)",
        drainUndrained:
          "{{node}} è tornato in rotazione sulla sua immagine precedente",
        drainLeftDrained:
          "{{node}} rimane DRAINED (fuori rotazione, il peer serve tutto): {{error}}. Risolvilo, quindi esegui su entrambe le caselle: script bash/ha-node-drain.sh edge-off {{node}}",
        drainPreflightFailed:
          "Il pre-controllo del drenaggio su {{target}} ha rifiutato il dispiegamento, nulla è stato cambiato: {{error}}",
        drainScriptMissing:
          "scripts/ha-node-drain.sh manca dal commit {{sha}}: schieramento senza scarico",
        drainStepFailed:
          "ha-node-drain.sh {{step}} su {{target}} fallito: {{error}}",
        envSyncFailed: "Copiare Server 1's.env su Server 2 fallito: {{error}}",
        cleanupSkippedImage:
          " ⁇  Pulizia locale saltata: {{image}} non è {{allowed}}",
        cleanupListFailed:
          "Pulizia locale saltata, non poteva elencare le immagini di {{image}}: {{error}}",
        cleanupCurrentMissing:
          "Ha saltato la pulizia dell'immagine locale perché la costruzione appena caricata per {{image}} non poteva essere trovata.",
        cleanupTagFailed: "Non è possibile rimuovere {{ref}} locale: {{error}}",
        cleanupTagsRemoved:
          " ⁇  Rimossa {{count}} vecchie ref locali per {{image}} ({{tags}})",
        cleanupCachePruned:
          " ⁇  Pruned Docker costruiscono la cache inutilizzata per almeno le ore {{hours}} (reclamato {{reclaimed}})",
        cleanupCacheCapped:
          " ⁇  Pruned Docker costruiscono la cache per indirizzare {{size}} GB ({{reclaimed}} recuperato)",
        cleanupCacheFailed: "Pruning the Docker build cache fail: {{error}}",
        cleanupExportsParked:
          " ⁇  Esportazione di vecchi impegni {{count}} (s) in {{dir}}",
        cleanupExportFailed:
          "Spostare l'export di commit {{dir}} ha fallito: {{error}}",
        diskLow:
          " ⁇  Solo {{free}} GB gratuitamente su {{path}} (minimo {{min}} GB). Pruning vecchie immagini locali e costruire la cache prima della costruzione...",
        diskLowNoCleanup:
          " ⁇  Solo {{free}} GB gratuitamente su {{path}} (minimo {{min}} GB). La pulizia e' spenta, non e' niente di indiscreto. La costruzione può riempire il disco.",
        diskAfterPrune: " ⁇  {{free}} GB libera su {{path}} dopo la potatura",
        diskCheckFailed:
          "Non poteva leggere spazio libero su {{path}}: {{error}}",
        remoteDiskOk: " ⁇  {{target}}: {{free}} GB libero prima del carico",
        remoteDiskLow:
          " ⁇  {{target}}: solo {{free}} GB libero (minimo {{min}} GB). Gettare vecchie immagini prima del carico...",
        remoteDiskLowNoCleanup:
          " ⁇  {{target}}: solo {{free}} GB libero (minimo {{min}} GB). remoteCleanup è spento, niente rimosso. Il carico può riempire il disco.",
        remoteDiskAfter:
          " ⁇  {{target}}: {{free}} GB libera dopo la ritenzione",
        remoteListFailed:
          "Ritenzione dell'immagine su {{target}} saltato, nulla rimosso: {{error}}",
        remoteTagFailed: "{{target}}: non può rimuovere {{ref}}: {{error}}",
        remoteRetained:
          " ⁇  {{target}}: rimosso {{count}} vecchio immagine ref(s), mantenuto il più recente {{keep}} costruisce più tag rollback e immagini in uso: {{tags}}. Prugna dangling: {{pruned}}",
        gateSkipped:
          "⚠️ Controllo di sicurezza SALTATO per il commit {{sha}} (--skipCheck): {{reason}}",
        gateCached:
          "✅ Controllo di sicurezza già superato per il commit {{sha}} (marcatore in cache: {{marker}})",
        gateGenStart:
          "🔍 Controllo dei file generati nel commit esportato {{sha}} ...",
        gateGenPassed: "✅ File generati aggiornati per il commit {{sha}}",
        gateGenFailed:
          "Deploy bloccato: vibe gen non riuscito per il commit {{sha}}: {{error}}",
        gateGenStale:
          "Deploy bloccato: file generati non aggiornati nel commit {{sha}} ({{count}} file modificati da vibe gen): {{files}}",
        gateCheckStart:
          "🔍 Esecuzione di vibe check completo nel commit esportato {{sha}} ...",
        gateCheckPassed:
          "✅ vibe check completo superato per il commit {{sha}}",
        gateCheckFailed:
          "Deploy bloccato: vibe check non superato per il commit {{sha}}: {{error}}",
        gateCheckIncomplete:
          "Deploy bloccato: vibe check non completato per il commit {{sha}}: {{error}}",
        gateSetupFailed:
          "Deploy bloccato: impossibile preparare il commit {{sha}} per il controllo di sicurezza: {{error}}",
        gateCleanupWarn:
          "⚠️ Avviso durante la pulizia del controllo di sicurezza in {{dir}}: {{error}}",
        gateMarkerWarn:
          "⚠️ Controllo di sicurezza superato per {{sha}}, ma scrittura del marcatore {{path}} fallita: {{error}}",
        gatePassed: "✅ Controllo di sicurezza superato per il commit {{sha}}",
        checkOnlySuccess:
          "✅ Controllo di sicurezza {{status}} per il commit {{sha}} (build e push Docker saltati con --checkOnly)",
      },
    },
  },
};
