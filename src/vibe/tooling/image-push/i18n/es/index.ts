import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de servidores",
  tags: {
    imagePush: "Image Push",
  },
  post: {
    title: "Construir y Empujar imagen",
    titleShort: "Imagen de empuje",
    description:
      "Construir la imagen Docker de producción y entregarla al registro o directamente a un servidor a través de SSH, por lo que el servidor de despliegue sólo tira (o ya tiene) en lugar de construirla",
    form: {
      title: "Configuración de impulso de imagen",
      description:
        "Configurar el nombre de imagen, etiqueta y plataforma de destino",
      submit: "Construir y Empujar",
      runAgain: "Corre otra vez.",
    },
    fields: {
      image: {
        title: "Imagen",
        description:
          "Registro + nombre de imagen para construir y empujar. Defaults to DOCKER_IMAGE_NAME from your.env.",
      },
      commit: {
        title: "Commit",
        description:
          "Comprometerse a construir: un nombre de sha, etiqueta o rama. Defaults to HEAD of the current branch. Sólo naves de código comprometidas. Los cambios no comprometidos en el árbol de trabajo nunca se incluyen.",
      },
      tag: {
        title: "Tag",
        description:
          "Etiquetas de imagen. Defaults to the short sha of the built commit. La corta sombra y la última son siempre etiquetadas también.",
      },
      push: {
        title: "Empuje",
        description:
          "Empujar al registro (o transferir al objetivo SSH) después del edificio. Incapacidad para construir localmente solamente: sin empuje, sin transferencia SSH, sin despliegue.",
      },
      platform: {
        title: "Plataforma",
        description:
          "Plataforma de destino para la construcción (docker buildx --platform). Debe coincidir con la arquitectura del servidor de despliegue - generalmente linux/amd64.",
      },
      sshTarget: {
        title: "Meta de SSH",
        description:
          "user@host para transferir la imagen construida directamente sobre SSH en lugar de un registro (por ejemplo root@203.0.113.5) - predeterminados a SSH_SERVER si se establece. Ofrece la tecla SSH_SERVER_KEY primero, luego SSH_SERVER_PWD como el inconveniente de contraseña; ni set = su propia tecla SSH/config. Dejar vacío para empujar al registro en su lugar.",
      },
      secondary: {
        title: "Roll Server 2",
        description:
          "Después de que el servidor 1 es vivo y saludable, también rodar el segundo nodo HA (SSH_SERVER2): cargar la imagen bajo SSH_SERVER2_IMAGE_TAG (nunca :latest), sincronizar el servidor 1's.env, recrear, cheque de salud, auto-rollback. Caddy de cada caja sirve de la otra caja mientras tanto, nadie ve una brecha. Ignorado cuando SSH_SERVER2 no está activado o -- sshTarget es dado.",
      },
      primary: {
        title: "Implementar el servidor 1",
        description:
          "Default on. Off = Servidor 1 se desciende o valla después de una falla: envía la imagen de esta máquina directamente al Servidor 2 (SSH_SERVER2) y roda sólo ese nodo, manteniendo su propio.env y la falla sobresigue. Lenta (carga casera, sin relé de caja a caja).",
      },
      drain: {
        title: "Dibujo antes de reiniciar",
        description:
          "Predeterminado (ambos nodos HA). Cada nodo deja la rotación primero (Caddy envía nuevas solicitudes al par, DNS lo deja caer), termina sus flujos y tareas AI en vuelo, mueve a sus clientes WebSocket, y sólo entonces consigue la nueva imagen. Servidor 1 primero, luego el servidor 1 recupera el tráfico mientras que el servidor 2 drena. Off = recrear sin esperar (conformidad vieja).",
      },
      drainTimeout: {
        title: "Tiempo libre de drenaje (segundos)",
        description:
          "Un nodo más largo espera su trabajo AI en vuelo antes del reinicio. Cualquier cosa que siga corriendo entonces consigue el desagüe de apagado (STREAM_DRAIN_TIMEOUT_MS) y es abortado con contenido parcial salvado.",
      },
      cleanup: {
        title: "Limpiar localmente",
        description:
          "De forma predeterminada. Después de un empuje exitoso, mantenga la imagen y las imágenes recién cargadas utilizadas por los contenedores. Quitar otras etiquetas ghcr.io local /techfreaque/ next-vibe -app. Mueva todas las demás exportaciones de comprometer y sus marcadores a.tmp/todelete/image-build/. Prune Docker construir caché sin usar por lo menos 24 horas y el objetivo 30 GB. Debajo de 40 GB gratis en el sistema de archivos Docker, la limpieza también funciona antes de la construcción. Utilice remoteCleanup para los servidores de producción.",
      },
      remoteCleanup: {
        title: "Limpiar servidores prod",
        description:
          "Default on. Después de un nodo desplegado y aprobado su cheque de salud, mantenga en ese servidor solamente: la imagen que cualquier contenedor corre, sus etiquetas de rebote (Server 1 :latest, :rollback, :prod-current-good; Server 2 :unbottled-rollback, :unbottled-prev y el sitio co-establecido :latest) y las 3 nuevas construcciones de ghcr.io/techfreaque/next-vibe-app. Las etiquetas más antiguas van con el simple docker rmi (nunca -f, docker rechaza las imágenes en uso), entonces se corren imágenes colgantes. Antes de cada carga, menos de 30 GB libre corre la misma retención. Sólo los servidores HA configurados, nunca un sshTarget explícito. - Sólo advierta.",
      },
      skipCheck: {
        title: "Omitir puerta de seguridad",
        description:
          "Salida explícita para omitir la puerta de seguridad previa al build (revisión de vibe gen y vibe check completo). Exige un motivo no vacío que queda registrado. No escribe el marcador .checked.",
      },
      checkOnly: {
        title: "Solo verificar",
        description:
          "Exporta el commit, ejecuta la puerta de seguridad previa al build (vibe gen y vibe check completo), escribe el marcador .checked si pasa y se detiene antes del build y push de Docker.",
      },
      success: {
        title: "Operación completada",
      },
      output: {
        title: "Producto",
      },
      resolvedImage: {
        title: "Imagen",
      },
      tags: {
        title: "Etiquetas Empujado",
      },
      duration: {
        title: "Duración ms)",
      },
    },
    errors: {
      validation: {
        title: "Validación fallida",
        description: "Parámetros de empuje de imagen inválidos proporcionados",
      },
      network: {
        title: "Error de red",
        description: "La conexión de red falló durante el impulso de imagen",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para construir y empujar la imagen",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para construir y empujar la imagen",
      },
      notFound: {
        title: "No encontrado",
        description: "Recursos de impulso de imagen no encontrados",
      },
      server: {
        title: "Error del servidor",
        // Declared errorTypes label - rendered param-free, so no placeholder.
        description: "Docker construir o empujar falló",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Un error desconocido ocurrió durante el empuje de la imagen",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de impulso de imagen detectado",
      },
      unsavedChanges: {
        title: "Error desconocido",
        description:
          "Un error desconocido ocurrió durante el empuje de la imagen",
      },
    },
    success: {
      title: "Imagen Empujada",
      description: "Imagen Docker construida y empujada con éxito",
    },
    repository: {
      messages: {
        buildStart: " ⁇  Building {{image}} : {{tag}}...",
        buildSuccess: "✅ Construido {{refs}} (no empujado)",
        pushSuccess: " ⁇  Empujado {{refs}}",
        buildMemoryExceeded:
          "La compilación se detuvo al alcanzar el límite de memoria de {{gb}} GB.",
        buildExitCode: "docker buildx salió con el código {{code}}",
        buildKilled: "Docker buildx fue asesinado por la señal {{signal}}",
        dockerBuildFailed: "Docker build falló: {{error}}",
        commitResolveFailed: "No podría resolver el compromiso ' {{ref}}'",
        commitResolveFailedDetail:
          "No podría resolver el compromiso ' {{ref}}': {{error}}",
        commitResolved: " ⁇  Building commit {{sha}} ({{ref}}): {{subject}}",
        dirtyTreeWarning:
          "El árbol de trabajo NOVED tiene {{count}} cambio(s) no comprometido. Son EXCLUDED de la imagen. Sólo comprometer {{sha}} es construido.",
        deployedShaRecorded: " ⁇  Grabado implementado {{sha}} en {{path}}",
        deployedShaRecordFailed:
          "Deploy tuvo éxito, pero la escritura {{path}} falló: {{error}}",
        exportStart: " ⁇  Exporting commit {{sha}} to {{dir}}...",
        exportReused:
          " ⁇  Reutilización de árbol exportado para {{sha}} en {{dir}}",
        exportFailed: "Exportar compromiso {{sha}} falló: {{error}}",
        sshTransferStart: " ⁇  Transferir {{refs}} a {{target}} vía ssh...",
        sshTransferSuccess: " ⁇  Transferred {{refs}} to {{target}} via ssh",
        sshTransferFailed: "transferencia de ssh a {{target}} falló: {{error}}",
        scriptSynced:
          " ⁇  Sinceder {{script}} en {{target}} de comprometer {{sha}}",
        scriptSyncFailed:
          "Sincing {{script}} a {{target}} falló, desplegándose abortado: {{error}}",
        scriptMissing: "{{path}} está desaparecido de comprometer {{sha}}",
        scriptSyntaxInvalid:
          "bash -n rechazado {{path}} de comprometer {{sha}}. Guión vivo sin tocar.",
        pgGuardFailed:
          "El guardián de Postgres en {{target}} detuvo el despliegue, no se cambió nada: {{error}}",
        pgGuardMissing: "Falta {{path}} en este checkout",
        pgGuardPassed: "🛡️ Guardián de Postgres superado en {{target}}",
        scriptRemoteExit: "mando remoto salida con código {{code}}",
        secondaryStart: " ⁇  Servidor 1 vivo. Rolling Server 2 ({{target}})...",
        secondarySuccess:
          " ⁇  Rolled {{refs}} to {{target}} and Server 2 ({{secondary}})",
        secondaryOnlyMissing:
          "--primary=false rolls Server 2 solamente, pero SSH_SERVER2 no está establecido",
        secondaryOnlySuccess:
          " ⁇  Servidor 1 saltado. {{refs}} enrollado al servidor 2 ({{secondary}})",
        secondaryOnlyFailed:
          "Rolling Server 2 ({{secondary}}) solo falló: {{error}}. El servidor 2 guardó o restauró su imagen anterior.",
        secondaryFailed:
          "El servidor 1 ({{target}}) es LIVE en la nueva imagen, pero el servidor móvil 2 ({{secondary}}) falló: {{error}}. El servidor 2 guardó o restauró su imagen anterior.",
        drainStart:
          " ⁇  Draining {{node}} : nuevo tráfico va al par, en vuelo AI trabajo se levanta a {{timeout}} s",
        drainSwap:
          " ⁇  {{from}} está en vivo sobre la nueva imagen y recupera el tráfico. {{to}} (hasta {{timeout}} s)",
        drainUndrained:
          "{{node}} está de vuelta en rotación en su imagen anterior",
        drainLeftDrained:
          "{{node}} se mantiene DRAINED (sin rotación, el par sirve todo): {{error}}. Arréglalo, luego ejecute en ambas cajas: bash scripts/ha-node-drain.sh edge-off {{node}}",
        drainPreflightFailed:
          "Previsualización de Drain en {{target}} rechazó el despliegue, nada fue cambiado: {{error}}",
        drainScriptMissing:
          "scripts/ha-node-drain.sh falta de comprometer {{sha}} : el despliegue sin dren",
        drainStepFailed:
          "ha-node-drain.sh {{step}} en {{target}} falló: {{error}}",
        envSyncFailed:
          "Copiar el servidor 1's.env al servidor 2 falló: {{error}}",
        cleanupSkippedImage:
          " ⁇  Limpieza local saltada: {{image}} no es {{allowed}}",
        cleanupListFailed:
          "Limpieza local saltada, no podía listar imágenes de {{image}} : {{error}}",
        cleanupCurrentMissing:
          "Se saltó la limpieza de imagen local porque la construcción sólo cargada para {{image}} no se pudo encontrar.",
        cleanupTagFailed: "No se puede quitar {{ref}} local : {{error}}",
        cleanupTagsRemoved:
          " ⁇  Retirada {{count}} refres locales antiguos para {{image}} ({{tags}})",
        cleanupCachePruned:
          " ⁇  Pruned Docker build cache unused for at least {{hours}} hours ({{reclaimed}} reclaimed)",
        cleanupCacheCapped:
          " ⁇  Pruned Docker construir caché para apuntar {{size}} GB ({{reclaimed}} reclamado)",
        cleanupCacheFailed: "Pruning the Docker build cache failed: {{error}}",
        cleanupExportsParked:
          " ⁇  Moved {{count}} old commit export(s) to {{dir}}",
        cleanupExportFailed:
          "Moving old commit export {{dir}} falló: {{error}}",
        diskLow:
          "Глены sólo {{free}} GB libre en {{path}} (minimum {{min}} GB). Pruning viejas imágenes locales y construir cache antes de la construcción...",
        diskLowNoCleanup:
          "Глены sólo {{free}} GB libre en {{path}} (minimum {{min}} GB). La limpieza está apagada, nada podado. La construcción puede llenar el disco.",
        diskAfterPrune: " ⁇  {{free}} GB gratis en {{path}} después de la poda",
        diskCheckFailed:
          "No podía leer el espacio libre en {{path}} : {{error}}",
        remoteDiskOk: " ⁇  {{target}} : {{free}} GB gratis antes de la carga",
        remoteDiskLow:
          "Гле {{target}} : sólo {{free}} GB libre (minimum {{min}} GB). Dejando viejas imágenes antes de la carga...",
        remoteDiskLowNoCleanup:
          "⚠️ {{target}}- Sólo {{free}} GB (mínimo) {{min}} GB). remoteCleanup Está apagado, nada quitado. La carga puede llenar el disco.",
        remoteDiskAfter:
          " ⁇  {{target}} : {{free}} GB gratis después de la retención",
        remoteListFailed:
          "Retención de imagen en {{target}} saltada, nada eliminado: {{error}}",
        remoteTagFailed: "{{target}} : no podía quitar {{ref}} : {{error}}",
        remoteRetained:
          " ⁇  {{target}} : Removido {{count}} antiguo imagen ref(s), mantuvo el nuevo {{keep}} construye más etiquetas de redondeo e imágenes en uso: {{tags}}. Próxima de enganche: {{pruned}}",
        gateSkipped:
          "⚠️ Puerta de seguridad OMITIDA para el commit {{sha}} (--skipCheck): {{reason}}",
        gateCached:
          "✅ Puerta de seguridad ya aprobada para el commit {{sha}} (marcador en caché: {{marker}})",
        gateGenStart:
          "🔍 Verificando archivos generados en el commit exportado {{sha}} ...",
        gateGenPassed: "✅ Archivos generados al día para el commit {{sha}}",
        gateGenFailed:
          "Despliegue bloqueado: falló vibe gen para el commit {{sha}}: {{error}}",
        gateGenStale:
          "Despliegue bloqueado: archivos generados desactualizados en el commit {{sha}} ({{count}} archivo(s) modificados por vibe gen): {{files}}",
        gateCheckStart:
          "🔍 Ejecutando vibe check completo en el commit exportado {{sha}} ...",
        gateCheckPassed:
          "✅ vibe check completo aprobado para el commit {{sha}}",
        gateCheckFailed:
          "Despliegue bloqueado: falló vibe check para el commit {{sha}}: {{error}}",
        gateCheckIncomplete:
          "Despliegue bloqueado: vibe check no se completó para el commit {{sha}}: {{error}}",
        gateSetupFailed:
          "Despliegue bloqueado: no se pudo preparar el commit {{sha}} para la puerta de seguridad: {{error}}",
        gateCleanupWarn:
          "⚠️ Aviso al limpiar la puerta de seguridad en {{dir}}: {{error}}",
        gateMarkerWarn:
          "⚠️ Puerta de seguridad aprobada para {{sha}}, pero falló al escribir el marcador {{path}}: {{error}}",
        gatePassed: "✅ Puerta de seguridad aprobada para el commit {{sha}}",
        checkOnlySuccess:
          "✅ Puerta de seguridad {{status}} para el commit {{sha}} (build y push de Docker omitidos con --checkOnly)",
      },
    },
  },
};
