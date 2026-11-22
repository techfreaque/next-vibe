# Run next-vibe with managed PostgreSQL

The pod image serves the app and WebSockets on TCP port 3000. It stores files under `/data` and uses a PostgreSQL database for accounts, sessions, tools, and conversations. A fresh install opens the administrator login form. Built-in tool discovery works without a model provider.

## Install a release

Use Linux amd64, a writable volume owned by UID 1000, and a dedicated PostgreSQL 16 database. Give its application role permission to create tables and indexes in the public schema. The pod uses ordinary PostgreSQL with full-text indexes, text-backed embeddings, and application-side credit functions. Realtime delivery stays in the app process.

Choose the exact tag from a successful **Publish self-hosted pod image** release workflow. The registry path is `ghcr.io/techfreaque/next-vibe-pod:<release-tag>`. The first public image and a PikaPods listing are pending.

A local amd64 build of `96469468b4` measured 2,260 MiB uncompressed for the complete image, including Bun, Node and Alpine. The production server image is 7.16 GB. The release workflow measures every image again before publishing. The image leaves out the bundled Claude Code CLI, so the Claude Code provider is unavailable in the pod.

| Environment variable       | Value                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`             | PostgreSQL connection URI from the host. Preserve its TLS settings and URL-encode credentials.                    |
| `NEXT_PUBLIC_APP_URL`      | Public HTTPS origin, such as `https://tools.example.org`. For local verification use `http://localhost:3000`.     |
| `VIBE_ADMIN_USER_EMAIL`    | Administrator email in lowercase.                                                                                 |
| `VIBE_ADMIN_USER_PASSWORD` | Unique administrator password, at least 12 characters. The production seed synchronizes this password on startup. |
| `JWT_SECRET_KEY`           | Persistent signing secret. Generate with `openssl rand -hex 32`.                                                  |
| `CRON_SECRET`              | Generate a second independent value with `openssl rand -hex 32`.                                                  |

Enter these values in the host's environment settings. For Docker, put them in a private env file and run the following with the chosen release tag.

```sh
docker run -d --name next-vibe-pod --restart unless-stopped \
  --env-file pod.env -p 127.0.0.1:3000:3000 \
  -v next-vibe-files:/data "ghcr.io/techfreaque/next-vibe-pod:${RELEASE_TAG}"
```

Forward HTTPS and WebSocket upgrades to port 3000. Visit the configured origin and sign in with the administrator credentials. Startup applies migrations and production seeds before opening the listener. Keep the same database, volume, and secrets when replacing the container. Back up the database and volume together before upgrading. Restoring an older binary after a schema change may require restoring that backup.

## Release and hosting plan

Use an ephemeral Linux amd64 Actions runner labeled `pod-image-builder`, or set the repository variable `POD_IMAGE_RUNNER` to its label. Allow at least 24 GB of memory: the build peaks near 18 GB. The runner needs Docker, Chrome or Chromium, Node, Python 3, curl and OpenSSL. Pod operators only pull the resulting image.

1. Push a stable version tag of the form `vX.Y.Z` to GitHub. The pod workflow checks out that tag and builds a separate Linux amd64 image.
2. CI measures the uncompressed image and enforces a limit of 3 GiB. It starts the image against stock PostgreSQL, checks guest rejection and administrator login, exercises the tool directory in headless Chrome, CLI and MCP, and recreates the pod to verify its files and session survive.
3. CI pushes the tested image under the release tag, moves `latest` when the tag is the highest stable release, and checks anonymous registry access. On the first publication, a package owner must set the GHCR package visibility to public and verify the tagged manifest anonymously. The image carries the commit SHA in its OCI revision label. [GitHub Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
4. Once the tag is publicly pullable, submit the image reference, digest, measured size, volume, environment settings, and login procedure to the PikaPods feedback board. [PikaPods feedback board](https://feedback.pikapods.com/) · [App criteria](https://help.pikapods.com/faq/apps#adding-new-apps)

To build and verify a commit locally, run `scripts/pikapods/release.sh --ref <commit-or-tag>`. It builds the committed tree with `git archive`, never uncommitted files, checks the size limit, runs `scripts/pikapods/smoke.sh` against a disposable PostgreSQL 16 container on a private network and a random loopback port, then removes every container, network, volume and image it created. `--push` publishes a `vX.Y.Z` tag and `latest` without CI. A `vX.Y.Z` tag push also starts the npm release workflow.

For a provider-free functional check, use the [FlowStacks tool-directory example](flowstacks.md).
