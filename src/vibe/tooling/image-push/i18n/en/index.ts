export const translations = {
  category: "Server Management",
  tags: {
    imagePush: "Image Push",
  },
  post: {
    title: "Build & Push Image",
    titleShort: "Push Image",
    description:
      "Build the production Docker image and deliver it to the registry or directly to a server via SSH, so the deploy server only pulls (or already has) it instead of building it",
    form: {
      title: "Image Push Configuration",
      description: "Configure the image name, tag, and target platform",
      submit: "Build & Push",
      runAgain: "Run again",
    },
    fields: {
      image: {
        title: "Image",
        description:
          "Registry + image name to build and push. Defaults to DOCKER_IMAGE_NAME from your .env.",
      },
      commit: {
        title: "Commit",
        description:
          "Commit to build: a sha, tag or branch name. Defaults to HEAD of the current branch. Only committed code ships. Uncommitted changes in the working tree are never included.",
      },
      tag: {
        title: "Tag",
        description:
          "Image tag. Defaults to the short sha of the built commit. The short sha and 'latest' are always tagged as well.",
      },
      push: {
        title: "Push",
        description:
          "Push to the registry (or transfer to the SSH target) after building. Disable to build locally only: no push, no SSH transfer, no deploy.",
      },
      platform: {
        title: "Platform",
        description:
          "Target platform for the build (docker buildx --platform). Must match the deploy server's architecture - usually linux/amd64.",
      },
      sshTarget: {
        title: "SSH Target",
        description:
          "user@host to transfer the built image to directly over SSH instead of a registry (e.g. root@203.0.113.5) - defaults to SSH_SERVER if set. Uses SSH_SERVER_PWD for password auth when set, otherwise your own SSH key/config. Leave empty to push to the registry instead.",
      },
      secondary: {
        title: "Roll Server 2",
        description:
          "After Server 1 is live and healthy, also roll the second HA node (SSH_SERVER2): load the image under SSH_SERVER2_IMAGE_TAG (never :latest), sync Server 1's .env, recreate, health-check, auto-rollback. Each box's Caddy serves from the other box meanwhile, so nobody sees a gap. Ignored when SSH_SERVER2 is unset or --sshTarget is given.",
      },
      primary: {
        title: "Deploy Server 1",
        description:
          "Default on. Off = Server 1 is down or fenced after a failover: ship the image from this machine straight to Server 2 (SSH_SERVER2) and roll only that node, keeping its own .env and failover overrides. Slow (home upload, no box-to-box relay).",
      },
      drain: {
        title: "Drain before restart",
        description:
          "Default on (both HA nodes). Each node leaves rotation first (Caddy sends new requests to the peer, DNS drops it), finishes its in-flight AI streams and tasks, moves its WebSocket clients over, and only then gets the new image. Server 1 first, then Server 1 takes the traffic back while Server 2 drains. Off = recreate without waiting (old behaviour).",
      },
      drainTimeout: {
        title: "Drain timeout (seconds)",
        description:
          "Longest a node waits for its in-flight AI work before the restart. Whatever still runs then gets the shutdown drain (STREAM_DRAIN_TIMEOUT_MS) and is aborted with partial content saved.",
      },
      success: {
        title: "Success",
      },
      output: {
        title: "Output",
      },
      resolvedImage: {
        title: "Image",
      },
      tags: {
        title: "Tags Pushed",
      },
      duration: {
        title: "Duration (ms)",
      },
    },
    errors: {
      validation: {
        title: "Validation Failed",
        description: "Invalid image push parameters provided",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed during the image push",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to build and push the image",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to build and push the image",
      },
      notFound: {
        title: "Not Found",
        description: "Image push resources not found",
      },
      server: {
        title: "Server Error",
        // Declared errorTypes label - rendered param-free, so no placeholder.
        description: "Docker build or push failed",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during the image push",
      },
      conflict: {
        title: "Conflict",
        description: "Image push conflict detected",
      },
      unsavedChanges: {
        title: "Unknown Error",
        description: "An unknown error occurred during the image push",
      },
    },
    success: {
      title: "Image Pushed",
      description: "Docker image built and pushed successfully",
    },
    repository: {
      messages: {
        buildStart: "🐳 Building {{image}}:{{tag}} ...",
        buildSuccess: "✅ Built {{refs}} (not pushed)",
        pushSuccess: "🚀 Pushed {{refs}}",
        buildExitCode: "docker buildx exited with code {{code}}",
        buildKilled: "docker buildx was killed by signal {{signal}}",
        dockerBuildFailed: "Docker build failed: {{error}}",
        commitResolveFailed: "Could not resolve commit '{{ref}}'",
        commitResolveFailedDetail:
          "Could not resolve commit '{{ref}}': {{error}}",
        commitResolved: "📌 Building commit {{sha}} ({{ref}}): {{subject}}",
        dirtyTreeWarning:
          "⚠️ Working tree has {{count}} uncommitted change(s). They are EXCLUDED from the image. Only commit {{sha}} is built.",
        deployedShaRecorded: "📝 Recorded deployed commit {{sha}} in {{path}}",
        deployedShaRecordFailed:
          "Deploy succeeded, but writing {{path}} failed: {{error}}",
        exportStart: "📦 Exporting commit {{sha}} to {{dir}} ...",
        exportReused: "📦 Reusing exported tree for {{sha}} at {{dir}}",
        exportFailed: "Exporting commit {{sha}} failed: {{error}}",
        sshTransferStart: "📡 Transferring {{refs}} to {{target}} via ssh ...",
        sshTransferSuccess: "🚀 Transferred {{refs}} to {{target}} via ssh",
        sshTransferFailed: "ssh transfer to {{target}} failed: {{error}}",
        scriptSynced: "📜 Synced {{script}} on {{target}} from commit {{sha}}",
        scriptSyncFailed:
          "Syncing {{script}} to {{target}} failed, deploy aborted: {{error}}",
        scriptMissing: "{{path}} is missing from commit {{sha}}",
        scriptSyntaxInvalid:
          "bash -n rejected {{path}} from commit {{sha}}. Live script untouched.",
        scriptRemoteExit: "remote command exited with code {{code}}",
        secondaryStart: "🔁 Server 1 live. Rolling Server 2 ({{target}}) ...",
        secondarySuccess:
          "🚀 Rolled {{refs}} to {{target}} and Server 2 ({{secondary}})",
        secondaryOnlyMissing:
          "--primary=false rolls Server 2 only, but SSH_SERVER2 is not set",
        secondaryOnlySuccess:
          "🚀 Server 1 skipped. Rolled {{refs}} to Server 2 ({{secondary}})",
        secondaryOnlyFailed:
          "Rolling Server 2 ({{secondary}}) alone failed: {{error}}. Server 2 kept or restored its previous image.",
        secondaryFailed:
          "Server 1 ({{target}}) is LIVE on the new image, but rolling Server 2 ({{secondary}}) failed: {{error}}. Server 2 kept or restored its previous image.",
        drainStart:
          "🚰 Draining {{node}}: new traffic goes to the peer, in-flight AI work gets up to {{timeout}}s",
        drainSwap:
          "🔀 {{from}} is live on the new image and takes the traffic back. Draining {{to}} (up to {{timeout}}s)",
        drainUndrained: "{{node}} is back in rotation on its previous image",
        drainLeftDrained:
          "{{node}} stays DRAINED (out of rotation, the peer serves everything): {{error}}. Fix it, then run on both boxes: bash scripts/ha-node-drain.sh edge-off {{node}}",
        drainPreflightFailed:
          "Drain pre-check on {{target}} refused the deploy, nothing was changed: {{error}}",
        drainScriptMissing:
          "scripts/ha-node-drain.sh is missing from commit {{sha}}: deploying without drain",
        drainStepFailed:
          "ha-node-drain.sh {{step}} on {{target}} failed: {{error}}",
        envSyncFailed: "Copying Server 1's .env to Server 2 failed: {{error}}",
      },
    },
  },
};
