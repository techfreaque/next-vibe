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
      tag: {
        title: "Tag",
        description:
          "Image tag. Defaults to the current short git commit SHA. 'latest' is always additionally tagged and pushed.",
      },
      push: {
        title: "Push",
        description:
          "Push to the registry after building. Disable to build locally only - requires 'docker login' beforehand to push.",
      },
      platform: {
        title: "Platform",
        description:
          "Target platform for the build (docker buildx --platform). Must match the deploy server's architecture - usually linux/amd64.",
      },
      sshTarget: {
        title: "SSH Target",
        description:
          "user@host to transfer the built image to directly over SSH instead of a registry (e.g. root@203.0.113.5) - uses your own SSH key/config, same as running ssh yourself. Leave empty to push to the registry instead.",
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
        description: "Docker build or push failed: {{error}}",
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
        gitShaFailed: "Could not resolve the current git commit SHA",
        sshTransferStart: "📡 Transferring {{refs}} to {{target}} via ssh ...",
        sshTransferSuccess: "🚀 Transferred {{refs}} to {{target}} via ssh",
        sshTransferFailed: "ssh transfer to {{target}} failed: {{error}}",
      },
    },
  },
};
