import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  requirements: {
    label: "Necesitas",
    os: "macOS, Linux o Windows",
    git: "git",
    bun: "Bun 1.3+",
  },
  prereqs: {
    step: "Una vez por equipo",
    title: "Instala git y Bun",
    platformLabel: "Tu sistema",
    gitXcode: "git (Xcode Command Line Tools)",
    gitBrew: "o con Homebrew",
    gitApt: "git + unzip, Debian / Ubuntu",
    gitDnf: "git + unzip, Fedora",
    gitPacman: "git + unzip, Arch",
    gitWinget: "git",
    bun: "Bun",
    bunWindows: "Bun (PowerShell)",
    check: "Comprueba la versión: 1.3 o posterior",
    newTerminal:
      "Después abre una terminal nueva para que git y bun estén disponibles en tu PATH.",
  },
  terminal: {
    step: "Después",
    title: "Inicia la instancia",
    copyAll: "Copiar todo",
    copy: "Copiar",
    copied: "Copiado",
    clone: "Descarga el código",
    cd: "Entra en la carpeta",
    install: "Instala. El comando también agrega vibe al PATH.",
    dev: "Inicia. La base de datos, las migraciones y los datos iniciales se configuran automáticamente.",
    fallback:
      "¿La terminal dice «vibe: command not found»? Abre una terminal nueva o ejecuta bun run dev.",
    port: "¿El puerto 3000 ya está en uso? Arranca en otro: vibe dev --port=4000 y abre localhost:4000.",
    postgres:
      "De forma predeterminada, usas Postgres integrado (PGlite) sin Docker. Para usar Postgres completo, configura DATABASE_URL. En el siguiente arranque, vibe dev lo ejecuta en Docker.",
  },
  browser: {
    step: "Por último",
    title: "Termina la configuración en el navegador",
    open: {
      title: "Abre localhost:3000",
      body: "Haz clic en Iniciar sesión, arriba a la derecha.",
    },
    admin: {
      title: "Selecciona la cuenta ADMIN",
      body: "En el recuadro Dev Quick Login. Se abrirá el asistente de configuración.",
    },
    account: {
      title: "Configura el acceso de administrador",
      body: "Introduce tu correo y tu contraseña. Las claves de seguridad ya están listas.",
    },
    provider: {
      title: "Elige tu IA",
      body: "Inicia sesión con tu cuenta de unbottled.ai o pega la clave de tu proveedor. Termina la configuración y empieza a chatear.",
    },
  },
};
