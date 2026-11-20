import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Su AI entrega el trabajo a Claude Code - {{appName}}",
    description:
      "La herramienta de codificación permite a su delegado AI cambios en código real en Claude Code o OpenCode - sin cabeza, o como sesión en vivo en una ventana de terminal real que informa cuando se hace. Ahora a través de los casos.",
    category: "Agente de programación",
    imageAlt:
      "Agente de codificación interactivo - Claude Code en una ventana terminal",
    keywords:
      "agente de codificación, Claude Code, OpenCode, AI terminal, MCP completa-tarea, AI auto hospedado, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Agente de programación",
    readTime: "5 min para leer",
    title: "Tu IA abre una terminal y le pasa el trabajo a Claude Code.",
    subtitle:
      "Chat AIs habla de código. Los agentes de codificación lo cambian. La herramienta de codificación-agent conecta los dos - y en modo interactivo que ve que el trabajo sucede en una ventana terminal real.",
  },
  intro: {
    p1: "Pides a tu AI que arregle una prueba de fallo. Puede explicar la solución. No puede editar su repo, ejecutar la suite e iterate hasta verde. Claude Code y OpenCode pueden.",
    p2: "La herramienta de codificación-agente da la tarea a uno de ellos, en la máquina donde vive el código, y trae el resultado de vuelta a su conversación.",
  },
  modes: {
    title: "Dos modos",
    intro: "Escoge fuego y recoger o vigilar y dirigir.",
    batch: {
      label: "Predeterminado",
      title: "Batch",
      body: "Huye sin cabeza. Recoge todo lo que el agente imprime y lo devuelve en la conversación. Para después de 30 minutos.",
    },
    interactive: {
      label: "Mira y dirige",
      title: "Interactivo",
      body: "Abre una ventana terminal real con una sesión en vivo. Siga, responda a sus preguntas, redirección. No hay límite de tiempo - el resultado aterriza en su hilo cuando la sesión informa de nuevo.",
    },
  },
  handBack: {
    title: "Cómo el resultado encuentra su camino de regreso",
    intro:
      "La sesión terminal es un proceso separado. Así es como su respuesta aún aterriza en el hilo derecho.",
    step1Title: "Tu AI llama a la herramienta",
    step1Body: "Con el modo rápido e interactivo encendido.",
    step2Title: "Se crea una tarea rastreada",
    step2Body: "El hilo espera esa tarea - no para el terminal.",
    step3Title: "Se abre una ventana terminal",
    step3Body:
      "Terminal en macOS, su TERMINAL $ o el primer emulador encontrado en Linux, una consola PowerShell fresca en Windows.",
    step4Title: "El agente recibe sus órdenes de marchar",
    step4Body:
      "El aviso lleva una línea extra: cuando se hace, llame a la prueba completa en el servidor MCP de este caso con este id de tarea.",
    step5Title: "El resultado aterriza en su hilo",
    step5Body: "completa-tarea ofrece la salida y la conversación reanudar.",
    codeCaption: "La línea anexada a cada impulso interactivo del Claude Code:",
  },
  whatsNew: {
    title: "Nuevo: funciona a través de casos",
    intro:
      "Thea en la nube ahora puede pedir Hermes en su máquina para ejecutar una sesión de codificación.",
    item1:
      "En el caso remoto, la sesión funciona como una tarea de fondo rastreada, así que nada bloquea mientras trabajas en el terminal.",
    item2:
      "Cuando el período de sesiones informa a través del análisis completo, el resultado real se transmite de nuevo al caso que se le preguntó.",
    item3:
      "En Windows abre una ventana de consola real. El comando está escrito a un script PowerShell primero, por lo que los avisos con citas, frenos o nuevas líneas sobreviven intactos.",
    item4:
      "Una sesión lanzada por la máquina local puede informar sobre cualquier tarea que su propia instancia posee.",
    item5:
      "¿No hay canal en vivo para volver a informar? El modo interactivo vuelve al lote, por lo que el callador aún recibe una respuesta.",
  },
  tryIt: {
    title: "Pruébalo.",
    p1: "La herramienta es sólo para administración y vive en instancias auto-anfitrionas: se ejecuta un CLI de codificación con permisos completos dentro de la carpeta del proyecto. Necesita Claude Code o OpenCode instalado y firmado en esa máquina.",
    p2: "Entonces pregunte en el chat - o llámalo directamente desde la terminal:",
  },
  cta: {
    title: "Dale tus manos AI.",
    subtitle:
      "Instala next-vibe en tu equipo, inicia sesión una vez en Claude Code y deja que tu IA modifique código en tu propia máquina.",
    selfHost: "Guía de autoelección",
    framework: "Explora next-vibe",
  },
};
