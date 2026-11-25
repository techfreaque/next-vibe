import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Hermes y Thea: hilos remotos en ambos sentidos | {{appName}}",
    description:
      "Tu IA local y tu IA en la nube ejecutan hilos la una para la otra. ¿Sin clave API en la instancia? Quien llama recupera el bucle y lo termina.",
    category: "Hermes & Thea",
    imageAlt: "Hermes y Thea: dos instancias next-vibe conectadas",
    keywords:
      "Hermes, Thea, next-vibe, hilos remotos, AI auto hospedado, Websocket inverso, retroceso de tecla API, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Hermes & Thea",
    readTime: "6 min leer",
    title: "Dos IA. Una conversación. En ambos sentidos.",
    subtitle:
      "Hermes gira en tu equipo. Thea, en un servidor. Ahora cualquiera de los dos puede pasarle una conversación al otro, y una clave API ausente ya no interrumpe la respuesta.",
  },
  intro: {
    p1: "next-vibe funciona en tu portátil, en un VPS o en ambos a la vez. Conecta dos instancias y trabajarán juntas. Las nuestras se llaman Hermes y Thea.",
    p2: "Este lanzamiento cierra el bucle: los hilos remotos ahora funcionan en ambas direcciones, y la instancia sin una clave de proveedor ya no bloquea nada.",
  },
  who: {
    title: "Conoce a la pareja",
    intro: "La misma base de código. Diferentes trabajos.",
    hermes: {
      label: "Local",
      title: "Hermes",
      body: "Corre en tu propio ordenador. Se sienta junto a sus archivos, su terminal y sus agentes de codificación. Tu conductor diario.",
    },
    thea: {
      label: "Cloud",
      title: "Thea",
      body: "Corre en un servidor. Siempre en línea, accesible desde cualquier lugar. Mira la plataforma y los delegados trabajan.",
    },
    note: "Cada instancia posee sus propios datos y tareas. La conexión retransmite eventos entre ellos: nada más, nada menos.",
  },
  twoWay: {
    title: "Los hilos ahora se cruzan en ambas direcciones",
    intro:
      "Los hilos privados y de telecarpeta se ejecutan en la otra instancia: desde Thea a Hermes y desde Hermes a Thea.",
    p1: "Ponga un hilo en una carpeta remota y la instancia en el otro lado corre el giro AI completo: modelo, sistema de impulso, herramientas. Sigue escribiendo dónde estás. La conversación retrocede a ti.",
    stepsTitle: "Un giro, final a fin",
    step1Title: "Escribes.",
    step1Body: "Un mensaje en una conversación remota en Hermes.",
    step2Title: "La conexión lo transmite",
    step2Body:
      "Más de una WebSocket persistente, o una llamada HTTP directa cuando el par es accesible públicamente.",
    step3Title: "Thea ejecuta el bucle",
    step3Body: "Con su modelo, su impulso, sus herramientas.",
    step4Title: "Las herramientas van donde viven",
    step4Body:
      "Una herramienta que existe sólo en Hermes se llama de nuevo en Hermes. El resultado vuelve al bucle de Thea.",
    step5Title: "El giro aterriza en ambos lados",
    step5Body: "La conversación terminada se sincroniza con tu espejo.",
  },
  keyless: {
    title: "¿No hay llave API? El turno aún termina.",
    intro:
      "El caso que funciona un turno necesita la clave API del proveedor modelo. No todos los casos tienen uno.",
    p1: "Antes de que una instancia tome un giro, comprueba la clave del proveedor en su propio nodo. ¿Perdiendo? Falla rápido con un marcador claro: no se cuelga, y no escribe la mitad del hilo.",
    p2: "El lado de llamada reconoce el marcador, revuelve su relé de contabilidad y corre el bucle en sí mismo. El impulso y las herramientas del control remoto siguen siendo aplicables; herramienta llama ida y vuelta sobre la conexión.",
    calloutTitle:
      "El modo de proveedor de información no necesita ninguna llave.",
    calloutBody:
      "Utilice la instancia conectada como su proveedor de modelo y su lado nunca toca una clave del proveedor. La conexión es la tubería modelo.",
    scenarioTitle: "¿Quién dirige el bucle?",
    scenario1Label: "Remote tiene la llave",
    scenario1Body:
      "El mando a distancia corre el turno. Herramientas de ida y vuelta.",
    scenario2Label: "Remote no tiene llave",
    scenario2Body:
      "La distancia falla rápido. El callador dirige el giro con el impulso y las herramientas del control remoto.",
    scenario3Label: "Modo de procesamiento de referencia",
    scenario3Body:
      "La instancia del proveedor dirige el modelo. El que llama no necesita llave.",
  },
  underTheHood: {
    title: "Bajo la capucha",
    intro: "Para la gente que leyó el diff.",
    transport:
      "El transporte se negocia a tiempo de conexión, nunca configurado a mano. El objetivo aprieta al iniciador con un cheque de salud autenticado (5 segundos max). Alcanzado: HTTP directo. Detrás de NAT : el lado oculto abre un WebSocket y cada relé multiplexes sobre él.",
    reconnect:
      "El conector vuelve a conectarse con el retroceso exponencial de 1 a 30 segundos y relee la conexión en cada reingreso. Esta liberación endurece ese camino.",
    fixesTitle: "También en esta versión",
    fix1: "Advertencia de la hoja de cálculo: un marco dirigido a una pista que ya no sabe este caso se deja caer con una advertencia en lugar de silencio, re-authenticar la conexión lo fija.",
    fix2: "Los horarios de bases de datos en UTC, Postgres con piscina y PGlite por igual, por lo que filas con muestreo predeterminado se clasifican correctamente a través de los casos.",
    fix3: "El escritor de corriente sembra el hilo id, por lo que los pares ya no abandonan eventos con un hilo vacío id.",
    fix4: "Revival se convierte en sincronización con el par, por lo que los resultados de la herramienta en su lugar alcanzan el espejo.",
    codeCaption: "El marcador de un receptor sin llave envía de vuelta:",
  },
  tryIt: {
    title: "Pruébalo.",
    p1: "A continuación, agregue la conexión bajo Admin → Conexión remota. Sólo los administradores pueden crear uno; el otro lado obtiene su entrada automáticamente.",
  },
  cta: {
    title: "Ejecuta tu propia instancia de Hermes.",
    subtitle:
      "Auto-host next-vibe en su máquina, conéctelo a un servidor y déjeles compartir el trabajo.",
    selfHost: "Guía de autoelección",
    github: "Lea el código",
  },
};
