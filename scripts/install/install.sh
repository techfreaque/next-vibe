#!/usr/bin/env sh
# next-vibe visual installer bootstrap (macOS and Linux)
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/techfreaque/next-vibe/main/scripts/install/install.sh | sh
#
# Environment / flag overrides:
#   VIBE_INSTALL_DIR   Target checkout directory (default: "$HOME/next-vibe")
#   VIBE_REPO_URL      Git repository URL (default: https://github.com/techfreaque/next-vibe.git)
#   VIBE_REPO_BRANCH   Optional git branch to clone
#   VIBE_PORT          Preferred localhost port (default: 3000; auto-picks free port if busy)
#   VIBE_STATE_FILE    Path to installer state JSON
#   VIBE_NO_BROWSER    Set to 1 to skip opening the browser
#   VIBE_DETACH        Set to 1 to leave the local server running in background and exit

set -eu

# ---------------------------------------------------------------------------
# Defaults & argument parsing
# ---------------------------------------------------------------------------

INSTALL_DIR="${VIBE_INSTALL_DIR:-$HOME/next-vibe}"
REPO_URL="${VIBE_REPO_URL:-https://github.com/techfreaque/next-vibe.git}"
REPO_BRANCH="${VIBE_REPO_BRANCH:-}"
PREFERRED_PORT="${VIBE_PORT:-3000}"
NO_BROWSER="${VIBE_NO_BROWSER:-0}"
DETACH="${VIBE_DETACH:-0}"
STATE_BASE="${XDG_STATE_HOME:-$HOME/.local/state}/next-vibe"
STATE_FILE="${VIBE_STATE_FILE:-$STATE_BASE/installer-state.json}"
LOCALE="${VIBE_LOCALE:-en-US}"

print_usage() {
  cat <<'EOF'
next-vibe installer (macOS / Linux)

Options:
  --dir <path>         Directory to clone or reuse (default: ~/next-vibe)
  --repo <url>         Git repository URL
  --branch <name>      Git branch to clone
  --port <number>      Preferred localhost port (default: 3000)
  --state-file <path>  Path to resumable installer state file
  --no-browser         Do not open the browser automatically
  --detach             Start server in background and exit once ready
  -h, --help           Show this help
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --dir)
      [ "$#" -ge 2 ] || { echo "Missing value for --dir" >&2; exit 2; }
      INSTALL_DIR="$2"
      shift 2
      ;;
    --repo)
      [ "$#" -ge 2 ] || { echo "Missing value for --repo" >&2; exit 2; }
      REPO_URL="$2"
      shift 2
      ;;
    --branch)
      [ "$#" -ge 2 ] || { echo "Missing value for --branch" >&2; exit 2; }
      REPO_BRANCH="$2"
      shift 2
      ;;
    --port)
      [ "$#" -ge 2 ] || { echo "Missing value for --port" >&2; exit 2; }
      PREFERRED_PORT="$2"
      shift 2
      ;;
    --state-file)
      [ "$#" -ge 2 ] || { echo "Missing value for --state-file" >&2; exit 2; }
      STATE_FILE="$2"
      shift 2
      ;;
    --no-browser)
      NO_BROWSER=1
      shift
      ;;
    --detach)
      DETACH=1
      shift
      ;;
    -h|--help)
      print_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      print_usage >&2
      exit 2
      ;;
  esac
done

# ---------------------------------------------------------------------------
# Logging helpers
# ---------------------------------------------------------------------------

log_step() {
  printf '\n[%s] %s\n' "$1" "$2"
}

log_info() {
  printf '  %s\n' "$1"
}

log_ok() {
  printf '  OK: %s\n' "$1"
}

log_warn() {
  printf '  NOTE: %s\n' "$1" >&2
}

log_err() {
  printf '  ERROR: %s\n' "$1" >&2
}

# ---------------------------------------------------------------------------
# OS & state tracking
# ---------------------------------------------------------------------------

UNAME_S="$(uname -s 2>/dev/null || echo unknown)"
UNAME_M="$(uname -m 2>/dev/null || echo unknown)"
case "$UNAME_S" in
  Darwin*) OS_NAME="macos" ;;
  Linux*)  OS_NAME="linux" ;;
  *)       OS_NAME="unix" ;;
esac

STARTED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "")"
STEP_GIT="pending"
STEP_BUN="pending"
STEP_CLONE="pending"
STEP_DEPS="pending"
STEP_GITHUB="pending"
STEP_SERVER="pending"
VER_GIT=""
VER_BUN=""
CHECKOUT_MODE=""
ACTUAL_PORT="$PREFERRED_PORT"
APP_URL=""
LAST_ERROR=""
REPO_READY=0

json_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/	/\\t/g' | tr '\n' ' '
}

write_state_to() {
  target="$1"
  parent_dir="$(dirname "$target")"
  mkdir -p "$parent_dir"
  tmp_file="${target}.tmp.$$"
  now_ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "")"
  cat > "$tmp_file" <<EOF
{
  "version": 1,
  "startedAt": "$(json_escape "$STARTED_AT")",
  "updatedAt": "$(json_escape "$now_ts")",
  "os": "$(json_escape "$OS_NAME")",
  "arch": "$(json_escape "$UNAME_M")",
  "installDir": "$(json_escape "$INSTALL_DIR")",
  "repoUrl": "$(json_escape "$REPO_URL")",
  "checkoutMode": "$(json_escape "$CHECKOUT_MODE")",
  "port": ${ACTUAL_PORT},
  "url": "$(json_escape "$APP_URL")",
  "steps": {
    "git": "$(json_escape "$STEP_GIT")",
    "bun": "$(json_escape "$STEP_BUN")",
    "clone": "$(json_escape "$STEP_CLONE")",
    "dependencies": "$(json_escape "$STEP_DEPS")",
    "github": "$(json_escape "$STEP_GITHUB")",
    "server": "$(json_escape "$STEP_SERVER")"
  },
  "versions": {
    "git": "$(json_escape "$VER_GIT")",
    "bun": "$(json_escape "$VER_BUN")"
  },
  "github": {
    "status": "$(json_escape "$STEP_GITHUB")",
    "repoUrl": "",
    "skipped": false
  },
  "lastError": "$(json_escape "$LAST_ERROR")"
}
EOF
  mv "$tmp_file" "$target"
}

save_state() {
  write_state_to "$STATE_FILE"
  if [ "$REPO_READY" = "1" ] && [ -d "$INSTALL_DIR" ]; then
    write_state_to "$INSTALL_DIR/.tmp/installer-state.json"
  fi
}

fail_with_recovery() {
  LAST_ERROR="$1"
  save_state
  log_err "$1"
  if [ -n "${2:-}" ]; then
    printf '\nNext step:\n  %s\n\nThen re-run this installer command to resume where it stopped.\n' "$2" >&2
  fi
  exit 1
}

# Make sure common user-space bin dirs are on PATH in this session.
export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
PATH="$BUN_INSTALL/bin:$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
export PATH

printf '\nnext-vibe installer (%s / %s)\n' "$OS_NAME" "$UNAME_M"
printf 'Target folder: %s\n' "$INSTALL_DIR"
save_state

# ---------------------------------------------------------------------------
# Step 1: Git (non-admin first)
# ---------------------------------------------------------------------------

log_step "1/6" "Checking git"
STEP_GIT="in_progress"
save_state

has_working_git() {
  if ! command -v git >/dev/null 2>&1; then
    return 1
  fi
  # On macOS, /usr/bin/git is a shim that exits non-zero when CLT is missing.
  git --version >/dev/null 2>&1
}

if ! has_working_git; then
  log_info "git not found. Trying a user-space install first."
  if [ "$OS_NAME" = "macos" ]; then
    if command -v brew >/dev/null 2>&1 && [ -w "$(brew --prefix 2>/dev/null || echo /nonexistent)" ]; then
      brew install git || true
    else
      log_info "Requesting Apple Command Line Tools (no sudo required)..."
      xcode-select --install >/dev/null 2>&1 || true
      STEP_GIT="error"
      fail_with_recovery \
        "git is not installed yet. Apple Command Line Tools installer was opened." \
        "Finish the Apple Command Line Tools dialog, then re-run this installer."
    fi
  else
    if command -v brew >/dev/null 2>&1; then
      brew install git || true
    elif command -v nix-env >/dev/null 2>&1; then
      nix-env -iA nixpkgs.git || true
    elif command -v micromamba >/dev/null 2>&1; then
      micromamba install -y -c conda-forge git || true
    fi
  fi
fi

if ! has_working_git; then
  STEP_GIT="error"
  hint="Install git for your system, then re-run this command."
  if command -v apt-get >/dev/null 2>&1; then
    hint="sudo apt-get update && sudo apt-get install -y git"
  elif command -v dnf >/dev/null 2>&1; then
    hint="sudo dnf install -y git"
  elif command -v pacman >/dev/null 2>&1; then
    hint="sudo pacman -Sy --noconfirm git"
  elif command -v zypper >/dev/null 2>&1; then
    hint="sudo zypper install -y git"
  elif command -v apk >/dev/null 2>&1; then
    hint="sudo apk add git"
  fi
  fail_with_recovery "git is required to clone next-vibe." "$hint"
fi

VER_GIT="$(git --version 2>/dev/null | head -n 1 || echo "git")"
STEP_GIT="done"
save_state
log_ok "$VER_GIT"

# ---------------------------------------------------------------------------
# Step 2: Bun (user-space, zero admin rights)
# ---------------------------------------------------------------------------

log_step "2/6" "Checking Bun"
STEP_BUN="in_progress"
save_state

has_working_bun() {
  command -v bun >/dev/null 2>&1 && bun --version >/dev/null 2>&1
}

if ! has_working_bun; then
  log_info "Installing Bun into $BUN_INSTALL (user-space, no admin needed)..."
  if ! command -v curl >/dev/null 2>&1; then
    STEP_BUN="error"
    fail_with_recovery "curl is required to download Bun." "Install curl and re-run this installer."
  fi
  if ! command -v unzip >/dev/null 2>&1; then
    STEP_BUN="error"
    fail_with_recovery "unzip is required by the Bun installer." "Install unzip (for example: sudo apt-get install -y unzip) and re-run."
  fi
  if command -v bash >/dev/null 2>&1; then
    curl -fsSL https://bun.sh/install | bash
  else
    curl -fsSL https://bun.sh/install | sh
  fi
  PATH="$BUN_INSTALL/bin:$PATH"
  export PATH
fi

if ! has_working_bun; then
  STEP_BUN="error"
  fail_with_recovery \
    "Bun could not be verified after installation." \
    "Install Bun from https://bun.sh and re-run this installer."
fi

VER_BUN="$(bun --version 2>/dev/null | head -n 1 || echo "bun")"
STEP_BUN="done"
save_state
log_ok "bun $VER_BUN"

# ---------------------------------------------------------------------------
# Step 3: Clone or detect existing checkout (never overwrite)
# ---------------------------------------------------------------------------

log_step "3/6" "Preparing next-vibe checkout"
STEP_CLONE="in_progress"
save_state

is_next_vibe_checkout() {
  dir="$1"
  if [ -f "$dir/src/vibe/platforms/cli/vibe-runtime.ts" ]; then
    return 0
  fi
  if [ -d "$dir/.git" ] && [ -f "$dir/package.json" ] && grep -q '"name"[[:space:]]*:[[:space:]]*"next-vibe"' "$dir/package.json" 2>/dev/null; then
    return 0
  fi
  return 1
}

is_dir_empty() {
  dir="$1"
  # Returns 0 if directory has no entries (ignoring . and ..).
  [ -z "$(ls -A "$dir" 2>/dev/null)" ]
}

if [ -d "$INSTALL_DIR" ]; then
  if is_next_vibe_checkout "$INSTALL_DIR"; then
    CHECKOUT_MODE="existing"
    log_ok "Found existing next-vibe checkout at $INSTALL_DIR (kept untouched)"
  elif is_dir_empty "$INSTALL_DIR"; then
    log_info "Cloning into empty folder $INSTALL_DIR..."
    if [ -n "$REPO_BRANCH" ]; then
      git clone --branch "$REPO_BRANCH" "$REPO_URL" "$INSTALL_DIR"
    else
      git clone "$REPO_URL" "$INSTALL_DIR"
    fi
    CHECKOUT_MODE="cloned"
    log_ok "Cloned into $INSTALL_DIR"
  else
    STEP_CLONE="error"
    fail_with_recovery \
      "Directory '$INSTALL_DIR' already exists and is not a next-vibe checkout. Refusing to overwrite it." \
      "Choose another folder: VIBE_INSTALL_DIR=\"\$HOME/next-vibe-app\" sh $0"
  fi
elif [ -e "$INSTALL_DIR" ]; then
  STEP_CLONE="error"
  fail_with_recovery \
    "Path '$INSTALL_DIR' exists as a file. Refusing to overwrite it." \
    "Choose another folder: VIBE_INSTALL_DIR=\"\$HOME/next-vibe-app\" sh $0"
else
  mkdir -p "$(dirname "$INSTALL_DIR")"
  log_info "Cloning $REPO_URL into $INSTALL_DIR..."
  if [ -n "$REPO_BRANCH" ]; then
    git clone --branch "$REPO_BRANCH" "$REPO_URL" "$INSTALL_DIR"
  else
    git clone "$REPO_URL" "$INSTALL_DIR"
  fi
  CHECKOUT_MODE="cloned"
  log_ok "Cloned into $INSTALL_DIR"
fi

# Resolve canonical path so state matches server process.cwd()
INSTALL_DIR="$(cd "$INSTALL_DIR" && pwd -P)"
START_PAGE=setup
if [ -f "$INSTALL_DIR/src/_pages/install/page.tsx" ]; then
  START_PAGE=install
fi
REPO_READY=1
STEP_CLONE="done"
save_state

# ---------------------------------------------------------------------------
# Step 4: Install dependencies (bun install -> runs vibe setup postinstall)
# ---------------------------------------------------------------------------

log_step "4/6" "Installing dependencies with Bun"
STEP_DEPS="in_progress"
save_state

cd "$INSTALL_DIR"
if ! bun install; then
  STEP_DEPS="error"
  fail_with_recovery \
    "bun install failed in $INSTALL_DIR." \
    "cd \"$INSTALL_DIR\" && bun install"
fi

if [ ! -d "$INSTALL_DIR/node_modules" ]; then
  STEP_DEPS="error"
  fail_with_recovery \
    "node_modules is missing after bun install." \
    "cd \"$INSTALL_DIR\" && bun install"
fi

STEP_DEPS="done"
save_state
log_ok "Dependencies and vibe CLI ready"

# ---------------------------------------------------------------------------
# Step 5: Pick available port & start local app server
# ---------------------------------------------------------------------------

log_step "5/6" "Starting local next-vibe server"
STEP_SERVER="in_progress"
save_state

# Check whether an already-running server on PREFERRED_PORT belongs to this checkout
check_existing_server_for_dir() {
  check_port="$1"
  # Verify our own checkout PID file owns a live process on check_port
  pid_owner_ok=0
  for pf in "$INSTALL_DIR/.tmp/installer-dev.pid" "$INSTALL_DIR/.tmp/.atlas.pid"; do
    if [ -f "$pf" ]; then
      p_pid="$(head -n 1 "$pf" 2>/dev/null || echo "")"
      p_port="$(grep '^PORT:' "$pf" 2>/dev/null | head -n 1 | cut -d: -f2 || echo "")"
      if [ -n "$p_pid" ] && [ "$p_port" = "$check_port" ] && kill -0 "$p_pid" 2>/dev/null; then
        pid_owner_ok=1
        break
      fi
    fi
  done
  if [ "$pid_owner_ok" != "1" ]; then
    return 1
  fi
  bun -e '
    const url = process.argv[1];
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000), redirect: "manual" });
      process.exit(res.status >= 200 && res.status < 400 ? 0 : 1);
    } catch {
      process.exit(1);
    }
  ' "http://127.0.0.1:${check_port}/${LOCALE}/${START_PAGE}" >/dev/null 2>&1
}

find_free_port() {
  start_port="$1"
  bun -e '
    const net = await import("node:net");
    const start = Number(process.argv[1]) || 3000;
    const candidates = [start];
    for (let p = 3003; p <= 3099; p++) {
      if (p !== start) candidates.push(p);
    }
    const isFree = (port) =>
      new Promise((resolve) => {
        const srv = net.createServer();
        srv.once("error", () => resolve(false));
        srv.once("listening", () => srv.close(() => resolve(true)));
        srv.listen(port, "127.0.0.1");
      });
    for (const p of candidates) {
      if (await isFree(p)) {
        process.stdout.write(String(p));
        process.exit(0);
      }
    }
    process.exit(1);
  ' "$start_port"
}

REUSED_SERVER=0
SERVER_PID=""
DEV_LOG="$INSTALL_DIR/.tmp/installer-dev.log"
mkdir -p "$INSTALL_DIR/.tmp"

if check_existing_server_for_dir "$PREFERRED_PORT"; then
  ACTUAL_PORT="$PREFERRED_PORT"
  REUSED_SERVER=1
  log_ok "Reusing already-running server on http://localhost:$ACTUAL_PORT"
else
  ACTUAL_PORT="$(find_free_port "$PREFERRED_PORT")" || {
    STEP_SERVER="error"
    fail_with_recovery \
      "Could not find a free localhost port starting from $PREFERRED_PORT." \
      "Free a port or pass --port <number>."
  }
  if [ "$ACTUAL_PORT" != "$PREFERRED_PORT" ]; then
    log_warn "Port $PREFERRED_PORT is busy. Using port $ACTUAL_PORT instead."
  fi

  APP_URL="http://localhost:${ACTUAL_PORT}/${LOCALE}/${START_PAGE}"
  save_state

  RUNTIME_ENTRY="$INSTALL_DIR/src/vibe/platforms/cli/vibe-runtime.ts"
  if [ ! -f "$RUNTIME_ENTRY" ]; then
    STEP_SERVER="error"
    fail_with_recovery \
      "CLI runtime not found at $RUNTIME_ENTRY." \
      "Verify the checkout in $INSTALL_DIR is complete."
  fi

  log_info "Launching local server on port $ACTUAL_PORT (log: $DEV_LOG)..."
  VIBE_INSTALLER_STATE_FILE="$INSTALL_DIR/.tmp/installer-state.json" \
    nohup bun "$RUNTIME_ENTRY" dev --port="$ACTUAL_PORT" >"$DEV_LOG" 2>&1 </dev/null &
  SERVER_PID="$!"
  printf '%s\nPORT:%s\n' "$SERVER_PID" "$ACTUAL_PORT" > "$INSTALL_DIR/.tmp/installer-dev.pid"

  # Wait up to 120 seconds: first wait for TCP listen (zero SSR load), then verify HTTP 200
  tcp_ready=0
  attempt=0
  while [ "$attempt" -lt 90 ]; do
    if ! kill -0 "$SERVER_PID" 2>/dev/null; then
      STEP_SERVER="error"
      log_err "Local server exited unexpectedly. Last log lines:"
      tail -n 30 "$DEV_LOG" >&2 || true
      fail_with_recovery \
        "Local server failed to start on port $ACTUAL_PORT." \
        "Check $DEV_LOG or run: cd \"$INSTALL_DIR\" && bun \"$RUNTIME_ENTRY\" dev --port=$ACTUAL_PORT"
    fi
    if bun -e '
      const net = await import("node:net");
      const port = Number(process.argv[1]);
      const sock = net.createConnection({ host: "127.0.0.1", port });
      sock.setTimeout(500);
      sock.once("connect", () => { sock.destroy(); process.exit(0); });
      sock.once("error", () => process.exit(1));
      sock.once("timeout", () => { sock.destroy(); process.exit(1); });
    ' "$ACTUAL_PORT" >/dev/null 2>&1; then
      tcp_ready=1
      break
    fi
    attempt=$((attempt + 1))
    sleep 1
  done

  ready=0
  http_attempt=0
  while [ "$tcp_ready" = "1" ] && [ "$http_attempt" -lt 10 ]; do
    if ! kill -0 "$SERVER_PID" 2>/dev/null; then
      break
    fi
    if bun -e '
      const url = process.argv[1];
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: "manual" });
        process.exit(res.status >= 200 && res.status < 400 ? 0 : 1);
      } catch {
        process.exit(1);
      }
    ' "http://127.0.0.1:${ACTUAL_PORT}/${LOCALE}/${START_PAGE}" >/dev/null 2>&1; then
      ready=1
      break
    fi
    http_attempt=$((http_attempt + 1))
    sleep 2
  done

  if [ "$ready" != "1" ]; then
    STEP_SERVER="error"
    tail -n 25 "$DEV_LOG" >&2 || true
    fail_with_recovery \
      "Timed out waiting for http://localhost:${ACTUAL_PORT}/${LOCALE}/${START_PAGE}." \
      "Check $DEV_LOG and re-run."
  fi
fi

APP_URL="http://localhost:${ACTUAL_PORT}/${LOCALE}/${START_PAGE}"
STEP_SERVER="done"
LAST_ERROR=""
save_state
log_ok "Server ready at $APP_URL"

# ---------------------------------------------------------------------------
# Step 6: Open browser on local installer UI
# ---------------------------------------------------------------------------

log_step "6/6" "Opening next-vibe in your browser"

open_browser() {
  target_url="$1"
  if [ "$NO_BROWSER" = "1" ]; then
    log_info "Browser auto-open disabled (--no-browser)."
    return 0
  fi
  if [ "$OS_NAME" = "macos" ] && command -v open >/dev/null 2>&1; then
    open "$target_url" >/dev/null 2>&1 || true
  elif command -v wslview >/dev/null 2>&1; then
    wslview "$target_url" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1 && [ -n "${DISPLAY:-}${WAYLAND_DISPLAY:-}" ]; then
    nohup xdg-open "$target_url" >/dev/null 2>&1 </dev/null &
  else
    log_info "No desktop browser opener detected. Open the URL manually."
  fi
}

open_browser "$APP_URL"

printf '\n============================================================\n'
printf 'next-vibe is running.\n'
if [ "$START_PAGE" = "install" ]; then
  printf '  Installer: %s\n' "$APP_URL"
fi
printf '  Setup:     http://localhost:%s/%s/setup\n' "$ACTUAL_PORT" "$LOCALE"
printf '  Folder:    %s\n' "$INSTALL_DIR"
printf '  State:     %s\n' "$INSTALL_DIR/.tmp/installer-state.json"
printf '============================================================\n\n'

if [ "$DETACH" = "1" ] || [ "$REUSED_SERVER" = "1" ] || [ -z "$SERVER_PID" ]; then
  log_info "Server continues running in the background."
  if [ -n "$SERVER_PID" ]; then
    log_info "PID: $SERVER_PID (stop with: kill $SERVER_PID)"
  fi
  exit 0
fi

log_info "Keep this window open while using next-vibe. Press Ctrl+C to stop."
log_info "Start again later with: cd \"$INSTALL_DIR\" && vibe dev"

cleanup_server() {
  if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  exit 0
}

trap cleanup_server INT TERM
wait "$SERVER_PID"
