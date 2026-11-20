/**
 * Desktop API translations (English)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  "take-screenshot": {
    title: "Take Desktop Captura de Pantalla",
    titleShort: "Captura",
    dynamicTitle: "Captura de Pantalla: {{target}}",
    description:
      "Capturar una captura de pantalla del escritorio o una región de pantalla",
    form: {
      label: "Take Captura de Pantalla",
      capturing: "Capturing...",
      refresh: "Reto",
      description:
        "Capturar una captura de pantalla del escritorio completo o una región específica",
      fields: {
        outputPath: {
          label: "Sendero de salida",
          description:
            "Camino absoluto para guardar la captura de pantalla. Omitir para volver a la base inline64.",
          placeholder: "/tmp/screenshot.png",
        },
        screen: {
          label: "Índice de pantalla",
          description:
            "Índice de pantalla/monitor (0 = primario). Preferir a monitorName sobre esto.",
          placeholder: "0",
        },
        monitorName: {
          label: "Nombre del monitor",
          description:
            "Supervisar el nombre de salida (por ejemplo. DP-1, HDMI-1). Ejecute los monitores de lista primero para ver los nombres disponibles.",
          placeholder: "DP-1",
        },
        maxWidth: {
          label: "Max Width",
          description:
            "Abajo a esta anchura si la captura es más ancha. Útil para AI - Las capturas de 4 monitores son masivas.",
          placeholder: "1920",
        },
      },
    },
    response: {
      success: "Captura de pantalla con éxito",
      imagePath: "Camino donde se salvó la captura de pantalla",
      imageData: "Datos de captura de pantalla PNG con código base64",
      imageUrl: "URL para acceder a la pantalla",
      width: "Captura de Pantalla ancho en pixels",
      height: "Altura de la pantalla en pixels",
      monitorName: "Monitor que fue capturado",
      originalWidth: "Ancho original antes de escalar",
      originalHeight: "Altura original antes de escalar",
      error: "Mensaje de error",
      executionId: "Ejecución ID para el seguimiento",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description:
          "Se produjo un error de red mientras capturaba la captura de pantalla",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Usted no está autorizado para capturar capturas de pantalla de escritorio",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Capturar capturas de pantalla de escritorio está prohibido",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras capturaba la captura de pantalla",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido mientras capturaba la captura de pantalla",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Un conflicto ocurrió mientras capturaba la captura de pantalla",
      },
      notImplemented: {
        title: "No se aplica",
        description: "Esta función no está disponible en su sistema operativo",
      },
    },
    success: {
      title: "Captura de pantalla",
      description: "La captura de pantalla de escritorio fue con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      captureAutomation: "Automatización de captura",
    },
  },
  "get-accessibility-tree": {
    title: "Accesibilidad Árbol",
    titleShort: "Árbol A11y",
    dynamicTitle: "A11y: {{app}}",
    description:
      "Obtener el árbol de accesibilidad de la ventana enfocada o una aplicación específica",
    form: {
      label: "Accesibilidad Árbol",
      description:
        "Recuperar el árbol de accesibilidad AT - SPI para la inspección de escritorio UI",
      fields: {
        appName: {
          label: "Nombre de la aplicación",
          description:
            "Nombre del proceso o título de ventana a blanco (omit por ventana enfocada)",
          placeholder: "firefox",
        },
        maxDepth: {
          label: "Max Depth",
          description:
            "Profundidad máxima del árbol para atravesar (por defecto: 5)",
          placeholder: "5",
        },
        includeActions: {
          label: "Include Actions",
          description:
            "Mostrar acciones disponibles por nodo (clic, prensa, activar...). Más detalles pero mayor producción.",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Árbol de accesibilidad recuperado con éxito",
      tree: "Árbol de accesibilidad como texto estructurado",
      nodeCount: "Número total de nodos atravesados",
      truncated:
        "Si la consulta se ha programado y la salida puede ser incompleta",
      error: "Mensaje de error",
      executionId: "Ejecución ID para el seguimiento",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description:
          "Se produjo un error de red al recuperar el árbol de accesibilidad",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "No está autorizado para acceder al árbol de accesibilidad",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso al árbol de accesibilidad está prohibido",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la aplicación o ventana del objetivo",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al recuperar el árbol de accesibilidad",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido mientras se recuperaba el árbol de accesibilidad",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Se produjo un conflicto mientras se recuperaba el árbol de accesibilidad",
      },
      notImplemented: {
        title: "No se aplica",
        description: "Esta función no está disponible en su sistema operativo",
      },
    },
    success: {
      title: "Árbol de Accesibilidad Retrievado",
      description: "El árbol de accesibilidad fue recuperado con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      accessibilityAutomation: "Automatización de accesibilidad",
    },
  },
  "list-monitors": {
    title: "List Monitors",
    titleShort: "Monitores",
    description:
      "Listar todos los monitores conectados con resolución, posición e índice",
    form: {
      label: "List Monitors",
      description:
        "Enumere todas las pantallas conectadas. Utilice los nombres de monitores para apuntar pantallas específicas para capturas de pantalla.",
      fields: {},
    },
    response: {
      success: "Monitores listados con éxito",
      monitors: "Array de monitores conectados",
      error: "Mensaje de error",
      executionId: "Ejecución ID para el seguimiento",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description:
          "Se produjo un error de red mientras se enumeran monitores",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado a listar monitores",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe la lista de monitores",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras se enumeran los monitores",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido mientras se enumeran los monitores",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Se produjo un conflicto mientras se enumeraban los supervisores",
      },
      notImplemented: {
        title: "No se aplica",
        description:
          "Lista de monitores no está disponible en su sistema operativo",
      },
    },
    success: {
      title: "Monitores incluidos",
      description: "Todos los monitores conectados se enumeraron con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      captureAutomation: "Automatización de captura",
    },
  },
  click: {
    title: "Haga clic",
    titleShort: "Haga clic",
    dynamicTitle: "Click: {{x}}, {{y}}",
    description:
      "Mover el ratón a coordenadas absolutas y realizar un clic del ratón",
    form: {
      label: "Haga clic",
      description: "Mueva el ratón a las coordenadas dadas y haga clic",
      fields: {
        x: {
          label: "X Coordinate",
          description:
            "Coordenada de pantalla horizontal en píxeles (desde el borde izquierdo)",
          placeholder: "100",
        },
        y: {
          label: "Y Coordinate",
          description:
            "Coordenada vertical en píxeles (desde el borde superior)",
          placeholder: "200",
        },
        button: {
          label: "Mouse Button",
          description:
            "Botón de ratón para hacer clic (izquierda, media, derecha)",
          placeholder: "izquierda",
          options: {
            left: "Izquierda",
            middle: "Medio ambiente",
            right: "Bien.",
          },
        },
        doubleClick: {
          label: "Doble clic",
          description: "Realizar un doble clic en lugar de un solo clic",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Haga clic con éxito",
      error: "Mensaje de error",
      executionId: "Ejecución ID para el seguimiento",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red al realizar el clic",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Usted no está autorizado para realizar clics de escritorio",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Realizar clics de escritorio está prohibido",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras se realiza el clic",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido mientras se realiza el clic",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió mientras realizaba el clic",
      },
      notImplemented: {
        title: "No se aplica",
        description: "Esta función no está disponible en su sistema operativo",
      },
    },
    success: {
      title: "Click Performed",
      description: "El clic del ratón se realizó con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      inputAutomation: "Automatización de entrada",
    },
  },
  "type-text": {
    title: "Texto",
    titleShort: "Texto",
    dynamicTitle: "Tipo: {{text}}",
    description:
      "Escriba texto en la ventana enfocada mediante simulación de teclado",
    form: {
      label: "Texto",
      description:
        "Enviar pulsaciones a la ventana enfocada para escribir texto",
      fields: {
        text: {
          label: "Texto",
          description: "El texto para escribir en la ventana enfocada",
          placeholder: "¡Hola, Mundo!",
        },
        delay: {
          label: "Retraso (ms)",
          description:
            "Dilatación entre pulsaciones en milisegundos (por defecto: 12)",
          placeholder: "12",
        },
        windowId: {
          label: "Ventana ID",
          description:
            "Enfóquese en esta ventana UUID antes de escribir (de las ventanas de la lista)",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Window Title",
          description:
            "Ventana de enfoque que contiene este título antes de escribir",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Texto escrito con éxito",
      error: "Mensaje de error",
      executionId: "Ejecución ID para el seguimiento",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red al escribir texto",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado a escribir texto en el escritorio",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe escribir texto en el escritorio",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al escribir texto",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido al escribir texto",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto al escribir texto",
      },
      notImplemented: {
        title: "No se aplica",
        description: "Esta función no está disponible en su sistema operativo",
      },
    },
    success: {
      title: "Texto tipo",
      description: "El texto fue escrito con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      inputAutomation: "Automatización de entrada",
    },
  },
  "press-key": {
    title: "Clave de prensa",
    titleShort: "Clave de prensa",
    dynamicTitle: "Clave: {{key}}",
    description: "Presione una combinación de teclas o clave usando xdotool",
    form: {
      label: "Clave de prensa",
      description:
        "Enviar un evento de prensa clave al escritorio con sintaxis de teclas xdotool",
      fields: {
        key: {
          label: "Clave",
          description:
            "Nombre o combinación clave en la sintaxis xdotool (por ejemplo. Regreso, ctrl+c, alt+F4)",
          placeholder: "Return",
        },
        repeat: {
          label: "Repito.",
          description:
            "Número de veces para presionar la tecla (por defecto: 1)",
          placeholder: "1",
        },
        delay: {
          label: "Retraso (ms)",
          description:
            "Retraso entre las prensas de teclas repetidas en milisegundos (por defecto: 0)",
          placeholder: "0",
        },
        windowId: {
          label: "Ventana ID",
          description: "Enfoque esta ventana UUID antes de presionar la tecla",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Window Title",
          description:
            "ventana Focus que contiene este título antes de presionar la tecla",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Clave pulsada con éxito",
      error: "Mensaje de error",
      executionId: "Ejecución ID para el seguimiento",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red al presionar la clave",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Usted no está autorizado a presionar las teclas en el escritorio",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Las teclas de prensa en el escritorio están prohibidas",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al pulsar la tecla",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido al pulsar la tecla",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Se produjo un conflicto a la vez que se aprendió la clave",
      },
      notImplemented: {
        title: "No se aplica",
        description: "Esta función no está disponible en su sistema operativo",
      },
    },
    success: {
      title: "Key Pressed",
      description: "La llave fue presionada con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      inputAutomation: "Automatización de entrada",
    },
  },
  "move-mouse": {
    title: "Muévete.",
    titleShort: "Muévete.",
    dynamicTitle: "Mover: {{x}}, {{y}}",
    description:
      "Mueva el cursor del ratón a las coordenadas de pantalla absoluta",
    form: {
      label: "Muévete.",
      description:
        "Mueva el cursor del ratón a la posición de la pantalla especificada",
      fields: {
        x: {
          label: "X Coordinate",
          description:
            "Coordenada de pantalla horizontal en píxeles (desde el borde izquierdo)",
          placeholder: "100",
        },
        y: {
          label: "Y Coordinate",
          description:
            "Coordenada vertical en píxeles (desde el borde superior)",
          placeholder: "200",
        },
      },
    },
    response: {
      success: "Mouse se movió con éxito",
      error: "Mensaje de error",
      executionId: "Ejecución ID para el seguimiento",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red mientras se mueve el ratón",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para mover el ratón en el escritorio",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Moving el ratón en el escritorio está prohibido",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error interno del servidor al mover el ratón",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido mientras se mueve el ratón",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió al mover el ratón",
      },
      notImplemented: {
        title: "No se aplica",
        description: "Esta función no está disponible en su sistema operativo",
      },
    },
    success: {
      title: "Mouse Moved",
      description: "El cursor del ratón se movió con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      inputAutomation: "Automatización de entrada",
    },
  },
  scroll: {
    title: "Scroll",
    titleShort: "Scroll",
    dynamicTitle: "Scroll: {{direction}}",
    description:
      "Desplazamiento en la posición actual del ratón o coordenadas especificadas",
    form: {
      label: "Scroll",
      description: "Sube, baja, izquierda o derecha en la posición dada",
      fields: {
        x: {
          label: "X Coordinate",
          description:
            "Posición horizontal para desplazarse a (utiliza la posición actual si se omite)",
          placeholder: "100",
        },
        y: {
          label: "Y Coordinate",
          description:
            "Posición vertical para desplazarse a (utiliza la posición actual si se omite)",
          placeholder: "200",
        },
        direction: {
          label: "Dirección",
          description: "Dirección de desplazamiento",
          placeholder: "abajo",
          options: {
            up: "Arriba",
            down: "Abajo",
            left: "Izquierda",
            right: "Bien.",
          },
        },
        amount: {
          label: "Monto",
          description: "Número de pasos de desplazamiento (predeterminado: 3)",
          placeholder: "3",
        },
      },
    },
    response: {
      success: "Pergamino realizado con éxito",
      error: "Mensaje de error",
      executionId: "Ejecución ID para el seguimiento",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red mientras se desplazaba",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no está autorizado a desplazarse en el escritorio",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Prohibido el desplazamiento en el escritorio",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras se desplazaba",
      },
      unknown: {
        title: "Error desconocido",
        description: "Un error desconocido ocurrió mientras se desplazaba",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto mientras se desplazaba",
      },
      notImplemented: {
        title: "No se aplica",
        description: "Esta función no está disponible en su sistema operativo",
      },
    },
    success: {
      title: "Scroll Performed",
      description: "El pergamino se realizó con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      inputAutomation: "Automatización de entrada",
    },
  },
  "get-focused-window": {
    title: "Concéntrate en la ventana",
    titleShort: "Ventana focalizada",
    description: "Obtenga información sobre la ventana actualmente enfocada",
    form: {
      label: "Concéntrate en la ventana",
      description: "Recuperar la ventana ID, título y PID de la ventana activa",
      fields: {},
    },
    response: {
      success: "Información de la ventana focalizada recuperada con éxito",
      windowId: "X11 ventana ID de la ventana enfocada",
      windowTitle: "Título texto de la ventana enfocada",
      pid: "Proceso ID de la ventana enfocada",
      width: "Ancho de ventana en píxeles",
      height: "Altura de ventana en píxeles",
      monitor: "Supervisar el índice de la ventana está en",
      error: "Mensaje de error",
      executionId: "Ejecución ID para el seguimiento",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description:
          "Se produjo un error de red al tiempo que se concentró la ventana",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para obtener información de ventana",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Obtener información de la ventana está prohibido",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró ventana enfocada",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras se consigue la ventana enfocada",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido al tiempo que se concentró la ventana",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Se produjo un conflicto al tiempo que se concentró la ventana",
      },
      notImplemented: {
        title: "No se aplica",
        description: "Esta función no está disponible en su sistema operativo",
      },
    },
    success: {
      title: "Ventana focalizada Retrieved",
      description:
        "La información de la ventana enfocada fue recuperada con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      windowManagement: "Gestión de ventana",
    },
  },
  "list-windows": {
    title: "Lista de Windows",
    titleShort: "Lista de Windows",
    description: "Lista todas las ventanas abiertas en el escritorio",
    form: {
      label: "Lista de Windows",
      description:
        "Recuperar una lista de todas las ventanas abiertas con sus identificaciones, títulos y posiciones",
      fields: {},
    },
    response: {
      success: "Lista de ventana recuperada con éxito",
      windows: "Lista de ventanas abiertas",
      error: "Mensaje de error",
      executionId: "Ejecución ID para el seguimiento",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description:
          "Se produjo un error de red mientras se enumeran las ventanas",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no está autorizado a enumerar ventanas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe la venta de ventanas",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontraron ventanas.",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al enumerar las ventanas",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido mientras se enumeran las ventanas",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Hubo un conflicto al enumerar las ventanas",
      },
      notImplemented: {
        title: "No se aplica",
        description: "Esta función no está disponible en su sistema operativo",
      },
    },
    success: {
      title: "Windows Listed",
      description: "La lista de ventanas fue recuperada con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      windowManagement: "Gestión de ventana",
    },
  },
  "focus-window": {
    title: "Ventana focal",
    titleShort: "Ventana focal",
    dynamicTitle: "Focus: {{target}}",
    description: "Traiga una ventana al primer plano y déle foco",
    form: {
      label: "Ventana focal",
      description: "Enfoque una ventana por su ID, PID, o título",
      fields: {
        windowId: {
          label: "Ventana ID",
          description:
            "X11 ventana ID (hexadecimal, p. ej. 0x1234). Toma prioridad sobre otras opciones.",
          placeholder: "0x1234",
        },
        pid: {
          label: "Proceso ID",
          description: "Enfoque la ventana que pertenece a este proceso ID",
          placeholder: "12345",
        },
        title: {
          label: "Window Title",
          description:
            "Enfóquese la ventana cuyo título contiene esta cadena (sensible en caso)",
          placeholder: "Firefox",
        },
      },
    },
    response: {
      success: "Ventana enfocada con éxito",
      error: "Mensaje de error",
      executionId: "Ejecución ID para el seguimiento",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description:
          "Por favor, proporcione al menos uno de: windowId, pid, o título",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red al enfocar la ventana",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no está autorizado a enfocar ventanas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe el enfoque de ventanas",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la ventana especificada",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al enfocar la ventana",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido al enfocar la ventana",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto al centrar la ventana",
      },
      notImplemented: {
        title: "No se aplica",
        description: "Esta función no está disponible en su sistema operativo",
      },
    },
    success: {
      title: "Ventana enfocada",
      description: "La ventana fue llevada al primer plano con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      windowManagement: "Gestión de ventana",
    },
  },
  "move-window-to-monitor": {
    title: "Mover ventana a monitor",
    titleShort: "Mover ventana",
    dynamicTitle: "Mover: {{target}}",
    description: "Mover una ventana a un monitor específico",
    form: {
      label: "Mover ventana a monitor",
      description:
        "Mover una ventana por su ID, PID, o título a un monitor de destino",
      fields: {
        windowId: {
          label: "Ventana ID",
          description:
            "Ventana interna KWin UUID (de ventana de lista). Tiene prioridad sobre el pid y el título.",
          placeholder: "{uuid}",
        },
        pid: {
          label: "Proceso ID",
          description: "Mueva la ventana perteneciente a este proceso ID",
          placeholder: "12345",
        },
        title: {
          label: "Window Title",
          description:
            "Mueva la ventana cuyo título contiene esta cadena (insensible por caso)",
          placeholder: "Firefox",
        },
        monitorName: {
          label: "Nombre del monitor",
          description:
            "Nombre del monitor de destino (por ejemplo. DP-1, HDMI -A-1). Utilice los monitores de lista para ver los nombres disponibles.",
          placeholder: "DP-1",
        },
        monitorIndex: {
          label: "Índice de monitores",
          description:
            "Índice de control de objetivos (0 basado). Use monitorName cuando sea posible.",
          placeholder: "0",
        },
      },
    },
    response: {
      success: "Si el movimiento tuvo éxito",
      movedTo: "Monitorear la ventana fue movido para",
      windowTitle: "Título de la ventana que se movió",
      error: "Mensaje de error si la operación falló",
      executionId: "Unico identificador para esta ejecución",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description:
          "Por favor, proporcione al menos un identificador de ventana y un objetivo de monitor",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red mientras se mueve la ventana",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para mover ventanas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe mover ventanas",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la ventana o el monitor especificado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al mover la ventana",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido mientras se mueve la ventana",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Hubo un conflicto al mover la ventana",
      },
    },
    success: {
      title: "Window Moved",
      description: "La ventana fue trasladada al monitor objetivo con éxito",
    },
    category: "Escritorio",
    tags: {
      desktopAutomation: "Automatización de escritorio",
      windowManagement: "Gestión de ventana",
    },
  },

  title: "Herramientas de automatización de escritorio",
  description:
    "Controlar el escritorio: capturas de pantalla, ratón, teclado, ventanas",
  category: "Escritorio",
  summary:
    "Automatización de escritorio multiplataforma: Linux (ydotool/KWin/pyatspi) y Windows (PowerShell/UIAutomation)",
  tags: {
    desktopAutomation: "Automatización de escritorio",
    inputAutomation: "Automatización de entrada",
    windowManagement: "Gestión de ventana",
    captureAutomation: "Automatización de captura",
    accessibilityAutomation: "Automatización de accesibilidad",
  },

  tool: {
    takeScreenshot: "Take Captura de Pantalla",
    getAccessibilityTree: "Accesibilidad Árbol",
    listMonitors: "List Monitors",
    click: "Haga clic",
    typeText: "Texto",
    pressKey: "Clave de prensa",
    moveMouse: "Muévete.",
    scroll: "Scroll",
    getFocusedWindow: "Concéntrate en la ventana",
    listWindows: "Lista de Windows",
    focusWindow: "Ventana focal",
    moveWindowToMonitor: "Mover ventana a monitor",
  },

  widget: {
    noWindows: "No hay ventanas abiertas encontradas",
    windowCount_one: "Ventana {{count}}",
    windowCount_other: "Ventanas {{count}}",
    actionFocus: "Focus",
    actionType: "Tipo",
    actionKey: "Clave",
    actionMove: "Muévanse.",
    actionA11y: "A11y",
    actionTypeText: "Texto",
    actionPressKey: "Clave de prensa",
    actionScreenshot: "Captura",
    actionScreenshotOnMonitor: "Captura de Pantalla: {{monitor}}",
    actionA11yTree: "Árbol A11y",
    actionAllWindows: "← Todas las ventanas",
    actionAllMonitors: "Todos los monitores →",
    actionScreenshotLink: "Captura de pantalla →",
    actionMoveWindowHere: "Mueva la ventana aquí",
    labelPrimary: "Primaria",
    statusFocused: "Ventana enfocada",
    statusTyped: "Tipos",
    statusPressed: "Presionado",
    statusMoved: "Muévete",
    statusScrolled: "Scrolled",
    statusMouseMoved: "Mouse movió",
    statusClickExecuted: "Haga clic en ejecutado",
    labelSaved: "Salvado:",
    labelTruncated: "Г Truncated",
    filterPlaceholder: "Nodos filtrantes...",
    titleTypeText: "Texto",
    titlePressKey: "Clave de prensa",
    titleClick: "Haga clic",
    titleScroll: "Scroll",
    titleMoveMouse: "Muévete.",
    titleMoveWindow: "Mover ventana",
    titleA11yTree: "Accesibilidad Árbol",
    titleListWindows: "Ventanas",
    titleListMonitors: "Monitores",
    titleGetFocusedWindow: "Ventana focalizada",
    titleFocusWindow: "Ventana focal",
  },

  repository: {
    platformNotSupported:
      "Plataforma no compatible: {{platform}}. Linux y Windows son compatibles.",
    windowsNotSupported: "Soporte de Windows que viene pronto",
    macosNotSupported: "soporte de macOS pronto",
    commandFailed: "El comando falló: {{error}}",
    toolNotFound:
      "Herramienta requerida no encontrada: {{tool}}. Instala con: {{installCmd}}",
    screenshotFailed: "Failed to capture screenshot",
    accessibilityFailed: "Failed to get accessibility tree",
    accessibilityFailedWithError: "Failed to get accessibility tree: {{error}}",
    focusWindowRequiresIdentifier:
      "Al menos uno de windowId, pid, o título es requerido",
    missingDep:
      "Falta el paquete del sistema requerido: {{dep}}. Debería haber aparecido un diálogo auth sistema - aprobarlo para instalar automáticamente.",
    scriptWriteFailed: "Failed to write script: {{error}}",
    monitorNotFoundByName: 'Monitor " {{monitorName}}" no encontrado',
    noMonitorsDetected: "No se detectan monitores",
    invalidWindowHandle:
      'Invalid windowId : " {{handle}}" no es un mango numérico válido',
    screenIndexOutOfRange: "Índice de pantalla {{screen}} fuera de rango",
    unknownKeyName: "Nombre clave desconocido: {{key}}",
    focusedWindowParseFailed: "Failed to parse focused window output",
    couldNotListWindows: "No podía listar ventanas",
    noWindowWithPid: "No hay ventana con PID {{pid}}",
    noWindowWithTitle: 'No hay ventana con título que contenga "{{title}}"',
    provideMonitorNameOrIndex: "Proveer monitorName o monitorIndex",
    monitorNotFound: "Monitor no encontrado: {{monitor}}",
    noActiveWindow: "No hay ventana activa",
    kwinNoOutput: "El script KWin no produjo ninguna salida",
    kwinNoWindowData: "No hay datos de ventana en la salida del script KWin",
    windowMoveNoEffect:
      "El movimiento de ventana no tuvo efecto. la ventana nunca llegó al monitor {{monitor}}",
  },
};
