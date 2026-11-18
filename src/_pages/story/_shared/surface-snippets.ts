export const INSTANCE_ENV = `# .env - the minimum for a private instance
JWT_SECRET_KEY="<openssl rand -hex 32>"
VIBE_ADMIN_USER_EMAIL="you@example.com"
VIBE_ADMIN_USER_PASSWORD="<strong password>"
DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres"
NEXT_PUBLIC_APP_URL="https://chat.example.com"
NEXT_PUBLIC_VIBE_MODE="agent"   # personal instance: no auth wall, no payments`;

export const INSTANCE_COMPOSE = `# production: Postgres + app image, one command
bash scripts/install-docker.sh
# = docker compose -f docker-compose.prod.yml
#   builds postgres (pgvector), pulls the app image, restarts

# update later, zero downtime
vibe rebuild`;

export const INSTANCE_MODEL = `vibe dev                    # Atlas  - coding instance, hot reload
vibe --hermes dev           # Hermes - your daily driver, own database
vibe --hermes --remote ...  # target a connected remote instance`;
