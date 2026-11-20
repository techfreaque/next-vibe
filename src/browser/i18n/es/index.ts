/**
 * Browser API translations (English)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  click: {
    title: "Haga clic en Element",
    titleShort: "Haga clic",
    description:
      "Haga clic en un elemento por su UID desde una instantánea. Primero haz una instantánea con la captura de fotos.",
    dynamicTitle: "Click: {{uid}}",

    form: {
      label: "Haga clic en Element",
      description: "Haga clic en un elemento específico en la página",
      fields: {
        uid: {
          label: "Element UID",
          description:
            "La uide de un elemento en la página desde la instantánea del contenido de la página",
          placeholder: "Entrar elemento UID",
        },
        dblClick: {
          label: "Doble clic",
          description: "Establece para hacer doble clic. Default es falso.",
        },
      },
    },

    response: {
      success: "Haga clic en la operación con éxito",
      result: "Haga clic en el resultado de operación",
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
        description: "Se produjo un error de red durante la operación del clic",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para realizar operaciones de clic",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe la operación de clics",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el elemento solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la operación del clic",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Un error desconocido ocurrió durante la operación de clic",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió durante la operación de clics",
      },
    },

    success: {
      title: "Haga clic en Operación Exitosa",
      description: "El elemento se hizo clic con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      inputAutomation: "Automatización de entrada",
    },
  },
  "close-page": {
    title: "Página",
    titleShort: "Página",
    description:
      "Cierre la página actual de sesión. La última página abierta no puede cerrarse.",

    form: {
      label: "Página",
      description: "Cerrar una página del navegador por su índice",
      fields: {
        pageIdx: {
          label: "Índice de página",
          description:
            "El índice de la página para cerrar. Llame a list_pages para listar páginas",
          placeholder: "Ingrese el índice de página (por ejemplo, 0)",
        },
      },
    },

    response: {
      success: "Página cerrada con éxito",
      result: "Resultado de operación de página",
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
        description: "Se produjo un error de red al cerrar la página",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado a cerrar páginas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "El cierre de página está prohibido",
      },
      notFound: {
        title: "No encontrado",
        description: "La página solicitada no fue encontrada",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al cerrar la página",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido al cerrar la página",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Hubo un conflicto al cerrar la página",
      },
    },

    success: {
      title: "Page Cerrada con éxito",
      description: "La página fue cerrada con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      navigationAutomation: "Automatización de navegación",
    },
  },
  drag: {
    title: "Arrastre Element",
    titleShort: "Arrastre",
    description:
      "Arrastre un elemento en otro por UID. Saca a los UIDs de la captura.",
    dynamicTitle: "Arrastre: {{from}} → {{to}}",

    form: {
      label: "Arrastre Element",
      description: "Arrastre un elemento en otro elemento",
      fields: {
        from_uid: {
          label: "De Element UID",
          description: "La uide del elemento para arrastrar",
          placeholder: "Ingrese el elemento fuente UID",
        },
        to_uid: {
          label: "A Element UID",
          description: "La uide del elemento para caer en",
          placeholder: "Ingrese el elemento objetivo UID",
        },
      },
    },

    response: {
      success: "Arrastre operación exitosa",
      result: "Resultado de la operación de arrastre",
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
          "Se produjo un error de red durante la operación de arrastre",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para realizar operaciones de arrastre",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación de arrastre está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el elemento solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la operación de arrastre",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido durante la operación de arrastre",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto durante la operación de arrastre",
      },
    },

    success: {
      title: "Arrastre Operación exitosa",
      description: "El elemento fue arrastrado con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      inputAutomation: "Automatización de entrada",
    },
  },
  fill: {
    title: "Relleno",
    titleShort: "Relleno",
    description:
      "Escriba texto en una entrada/textarea o seleccione una opción desplegable por UID. Saca a los UIDs de la captura.",
    dynamicTitle: "Relleno: {{uid}}",

    form: {
      label: "Fill Element",
      description: "Escriba texto en un elemento de forma",
      fields: {
        uid: {
          label: "Element UID",
          description:
            "La uide de un elemento en la página desde la instantánea del contenido de la página",
          placeholder: "Ingrese elemento uid",
        },
        value: {
          label: "Valor",
          description: "El valor para llenar",
          placeholder: "Valor de entrada para llenar",
        },
      },
    },

    response: {
      success: "Funcionamiento completo exitoso",
      result: "Resultado de operación completo",
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
          "Se produjo un error de red durante la operación de llenado",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para realizar operaciones de llenado",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe la operación de relleno",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la operación de llenado",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido durante la operación de llenado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto durante la operación de llenado",
      },
    },

    success: {
      title: "Llenar la operación exitosa",
      description: "El elemento se llenó con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      inputAutomation: "Automatización de entrada",
    },
  },
  "fill-form": {
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      inputAutomation: "Automatización de entrada",
    },
    title: "Formulario de llenado",
    titleShort: "Formulario de llenado",
    description:
      "Llene varios campos de forma a la vez por UID array. Más eficiente que las llamadas individuales.",

    form: {
      label: "Elementos del formulario de llenado",
      description: "Llenar elementos de forma múltiples simultáneamente",
      fields: {
        elements: {
          label: "Elementos de formulario",
          description: "Arregle de elementos de instantáneas para llenar",
          placeholder: "Introduzca elementos de forma (array JSON)",
          uid: {
            label: "Element UID",
            description: "El identificador único del elemento para llenar",
          },
          value: {
            label: "Valor",
            description: "El valor para entrar en el elemento",
          },
        },
      },
    },

    response: {
      success: "Funcionamiento de llenado de formularios exitoso",
      result: {
        title: "Resultado",
        description: "Resultado de operación de llenado de formularios",
        filled: "Todos llenos",
        filledCount: "Cuenta llena",
        elements: {
          uid: "Element UID",
          filled: "Rellenado de éxito",
        },
      },
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
          "Se produjo un error de red durante la operación de llenado de formularios",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "No está autorizado para realizar operaciones de llenado de formularios",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación de llenado de formulario está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la operación de llenado de formularios",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido durante la operación de llenado de formularios",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Se produjo un conflicto durante la operación de llenado de formularios",
      },
    },

    success: {
      title: "Funcionamiento de Fill Sucesivo",
      description: "Todos los elementos de forma se llenaron con éxito",
    },
  },
  "handle-dialog": {
    title: "Diagrama de manija",
    titleShort: "Diálogo",
    description:
      "Aceptar o desestimar un diálogo del navegador (alert/confirm/prompt). Llame antes de la acción que lo activa.",
    dynamicTitle: "Diálogo: {{action}}",

    form: {
      label: "Dialog del navegador de mano",
      description: "Aceptar o desestimar un diálogo del navegador",
      fields: {
        action: {
          label: "Medida",
          description: "Ya sea para descartar o aceptar el diálogo",
          placeholder: "Seleccionar acción",
          options: {
            accept: "Aceptar",
            dismiss: "Sueldo",
          },
        },
        promptText: {
          label: "Texto de la prontitud",
          description: "Texto del impulso opcional para entrar en el diálogo",
          placeholder: "Introduzca el texto inmediato (opcional)",
        },
      },
    },

    response: {
      success: "Funcionamiento de manipulación del diagrama exitoso",
      result: "Resultado de manipulación de diagramas",
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
          "Se produjo un error de red durante la operación de manipulación del diálogo",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "No está autorizado para realizar operaciones de manejo de diálogo",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación de manipulación del diálogo está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la operación de manipulación del diálogo",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido durante la operación de manipulación del diálogo",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Un conflicto ocurrió durante la operación de manipulación del diálogo",
      },
    },

    success: {
      title: "Dialog Handing Successful",
      description: "El diálogo del navegador fue manejado con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      dialogAutomation: "Automatización de diálogo",
    },
  },
  hover: {
    title: "Hover",
    titleShort: "Hover",
    description:
      "Sobre un elemento de UID para activar las puntas de la herramienta o revelar controles ocultos.",
    dynamicTitle: "Hover: {{uid}}",

    form: {
      label: "Hover Element",
      description: "Mueva el cursor del ratón sobre un elemento",
      fields: {
        uid: {
          label: "Element UID",
          description:
            "La uide de un elemento en la página desde la instantánea del contenido de la página",
          placeholder: "Ingrese elemento uid",
        },
      },
    },

    response: {
      success: "Operación Hover exitoso",
      result: "Resultado de la operación Hover",
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
          "Se produjo un error de red durante la operación de arrastre",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para realizar operaciones de arrastre",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe la operación Hover",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la operación de arrastre",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido durante la operación de arrastre",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto durante la operación de arrastre",
      },
    },

    success: {
      title: "Operación Hover Successful",
      description: "El elemento se apiló con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      inputAutomation: "Automatización de entrada",
    },
  },
  "press-key": {
    title: "Clave de prensa",
    titleShort: "Clave de prensa",
    dynamicTitle: "Clave: {{key}}",
    description: "Presione una combinación de teclas o clave",
    form: {
      label: "Clave de prensa",
      description: "Presione una combinación de teclas o clave",
      fields: {
        key: {
          label: "Clave",
          description:
            "Una llave o una combinación (por ejemplo, Entrar, Control+A, Control+Shift+R)",
          placeholder: "Introducir clave o combinación",
        },
      },
    },
    response: {
      success: "Funcionamiento de prensa clave exitoso",
      result: "Resultado clave de la operación de prensa",
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
          "Se produjo un error de red durante la operación de prensa clave",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "No está autorizado para realizar operaciones de prensa clave",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación de prensa clave está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la operación de prensa clave",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido durante la operación de prensa clave",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Se produjo un conflicto durante la operación de prensa clave",
      },
    },
    success: {
      title: "Operación de prensa clave exitosa",
      description: "La llave fue presionada con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      inputAutomation: "Automatización de entrada",
    },
  },
  "upload-file": {
    title: "Cargue el archivo",
    titleShort: "Subir",
    dynamicTitle: "Subir: {{file}}",
    description: "Cargue un archivo a través de un elemento proporcionado",
    form: {
      label: "Cargue el archivo",
      description: "Subir un archivo a un elemento de entrada de archivos",
      fields: {
        uid: {
          label: "Element UID",
          description:
            "La uide del elemento de entrada de archivo o un elemento que abrirá el selector de archivos",
          placeholder: "Ingrese elemento uid",
        },
        filePaths: {
          label: "Senderos de archivos",
          description:
            "Camino absoluto del archivo para subir, o varios para una entrada multi-archivo. Debe sentarse dentro del directorio del proyecto o el directorio temporal OS.",
          placeholder: "/tmp/photo.png",
        },
        includeSnapshot: {
          label: "Incluir instantáneas",
          description: "Regrese una instantánea de página después de la subida",
        },
      },
    },
    response: {
      success: "Operación de carga de archivos exitosa",
      result: "Resultado de la operación de carga de archivos",
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
          "Se produjo un error de red durante la operación de carga de archivos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "No está autorizado para realizar operaciones de carga de archivos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación de carga de archivos está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la operación de carga de archivos",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido durante la operación de carga de archivos",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Un conflicto ocurrió durante la operación de carga de archivos",
      },
    },
    success: {
      title: "Operación de carga de archivos exitosa",
      description: "El archivo se subió con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      inputAutomation: "Automatización de entrada",
    },
  },
  "list-pages": {
    title: "Páginas de lista",
    titleShort: "Páginas",
    description:
      "Listar todas las páginas de navegador abiertas con sus URLs. Cada sesión de llamada posee una pestaña; nueva página la reemplaza.",
    form: {
      label: "Páginas de lista",
      description: "Consiga todas las páginas del navegador abierto",
      fields: {},
    },
    response: {
      success: "Páginas que enumeran la operación con éxito",
      result: {
        title: "Resultado",
        description: "Resultado de la lista de páginas",
        pages: {
          idx: "Index",
          title: "Título",
          url: "URL",
          active: "Activa",
        },
        totalCount: "Total Conde",
      },
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
          "Se produjo un error de red mientras se enumeran las páginas",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no está autorizado a enumerar páginas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación del listado de páginas está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras se enumeran las páginas",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido mientras se enumeran las páginas",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió mientras se enumeraban las páginas",
      },
    },
    success: {
      title: "Páginas Listadas con éxito",
      description: "Las páginas abiertas se enumeraron con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      navigationAutomation: "Automatización de navegación",
    },
  },
  "navigate-page": {
    title: "Página de navegación",
    titleShort: "Navigate",
    dynamicTitle: "Navigate: {{target}}",
    description:
      "Navegue la página de sesión a un URL, atrás, adelante o recarga. Preferir esto sobre nueva página para la navegación de la misma pestaña.",
    form: {
      label: "Página de navegación",
      description:
        "Navegue la página seleccionada actualmente a un URL o a través de la historia",
      fields: {
        type: {
          label: "Tipo de navegación",
          description:
            "Navegue por URL, atrás o adelante en la historia, o recarga",
          placeholder: "Seleccione el tipo de navegación",
          options: {
            url: "URL",
            back: "Atrás",
            forward: "Adelante.",
            reload: "Recarga",
          },
        },
        url: {
          label: "URL",
          description: "Objetivo URL (sólo para el tipo=url)",
          placeholder: "Ingresa la URL",
        },
        ignoreCache: {
          label: "Ignoro Cache",
          description: "Ya sea ignorar el caché en la recarga",
          placeholder: "Ignorar caché",
        },
        timeout: {
          label: "Hora de salir",
          description:
            "Tiempo máximo de espera en milisegundos (0 por defecto)",
          placeholder: "Entrar en el tiempo",
        },
      },
    },
    response: {
      success: "Operación de navegación exitosa",
      result: "Resultado de la navegación",
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
        description: "Se produjo un error de red durante la navegación",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no está autorizado a navegar páginas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación de navegación por página está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la navegación",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido durante la navegación",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto durante la navegación",
      },
    },
    success: {
      title: "Navegación Exitosa",
      description: "La página fue navegada con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      navigationAutomation: "Automatización de navegación",
    },
  },
  "new-page": {
    title: "Nueva página",
    titleShort: "Nueva página",
    dynamicTitle: "Nueva página: {{url}}",
    description:
      "Abra una nueva pestaña del navegador en un URL. La sesión adopta la nueva pestaña: todas las llamadas posteriores funcionan en ella.",
    form: {
      label: "Nueva página",
      description: "Crear una nueva página del navegador y cargar un URL",
      fields: {
        url: {
          label: "URL",
          description: "URL para cargar en la nueva página",
          placeholder: "Ingresa la URL",
        },
        replacePage: {
          label: "Sustituir la página",
          description: "Cerrar las páginas existentes antes de abrir la nueva",
        },
        background: {
          label: "Antecedentes",
          description: "Abrir página sin traerla al frente",
        },
        timeout: {
          label: "Hora de salir",
          description:
            "Tiempo máximo de espera en milisegundos (0 por defecto)",
          placeholder: "Entrar en el tiempo",
        },
      },
    },
    response: {
      success: "Nuevo funcionamiento de creación de página exitoso",
      result: "Resultado de la nueva creación de página",
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
        description: "Se produjo un error de red al crear la nueva página",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no está autorizado a crear nuevas páginas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La nueva operación de creación de páginas está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al crear la nueva página",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido al crear la nueva página",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto al crear la nueva página",
      },
    },
    success: {
      title: "Nueva página Creada con éxito",
      description: "La nueva página se creó con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      navigationAutomation: "Automatización de navegación",
    },
  },
  "select-page": {
    title: "Seleccionar página",
    titleShort: "Seleccionar página",
    dynamicTitle: "Seleccione: {{page}}",
    description:
      "Cambiar la sesión a una página específica por índice. Utilice las páginas de lista para encontrar el índice. No actualiza la ficha de seguimiento de la sesión.",
    form: {
      label: "Seleccionar página",
      description: "Seleccione una página por su índice",
      fields: {
        pageIdx: {
          label: "Índice de página",
          description:
            "El índice de la página para seleccionar (llamar list_pages a las páginas de lista)",
          placeholder: "Indice de página",
        },
      },
    },
    response: {
      success: "Operaciones de selección de páginas exitosas",
      result: "Resultado de la selección de páginas",
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
        description: "Se produjo un error de red al seleccionar la página",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado a seleccionar páginas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación de selección de páginas está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al seleccionar la página",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido al seleccionar la página",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto al seleccionar la página",
      },
    },
    success: {
      title: "Página seleccionada con éxito",
      description: "La página fue seleccionada con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      navigationAutomation: "Automatización de navegación",
    },
  },
  emulate: {
    title: "Emulate",
    titleShort: "Emulate",
    description:
      "Emulate network conditions (offline/3G/4G) or CPU throttling on the current page. Cada llamada es absoluta: los campos omitidos son reajustados. Una anulación de agente de usuario se aplica desde la siguiente navegación, así que vuelva a cargar la página después de configurarla.",
    dynamicTitle: "Emulate: {{config}}",
    form: {
      label: "Emulate Device",
      description: "Emular las condiciones de red y el trienamiento CPU",
      fields: {
        networkConditions: {
          label: "Condiciones de red",
          description:
            "Red de tracción (conjunto a No emulación para desactivar)",
          placeholder: "Seleccione la condición de red",
          options: {
            noEmulation: "No hay emulación",
            offline: "Sin conexión",
            slow3g: "Despacio 3G",
            fast3g: "Fast 3G",
            slow4g: "Despacio 4G",
            fast4g: "Rápido 4G",
          },
        },
        cpuThrottlingRate: {
          label: "Tasa de oscilación CPU",
          description:
            "Factor de desaceleración CPU (1 a deshabilitación, 1-20)",
          placeholder: "Ingrese la tasa de oscilación",
        },
      },
    },
    response: {
      success: "Operación de emulación exitosa",
      result: "Resultado de la operación de emulación",
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
        description: "Se produjo un error de red durante la emulación",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "No está autorizado para emular las características del dispositivo",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación de emulación del dispositivo está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la emulación",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido durante la emulación",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto durante la emulación",
      },
    },
    success: {
      title: "Emulación Sucesiva",
      description: "Las características del dispositivo se emularon con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      performanceAutomation: "Automatización del rendimiento",
    },
  },
  "resize-page": {
    title: "Página",
    titleShort: "Resize",
    dynamicTitle: "Tamaño: {{width}} x {{height}}",
    description:
      "Redimensione el puerto de vista del navegador a dimensiones específicas en píxeles.",
    form: {
      label: "Página",
      description: "Redimensionar la página a dimensiones especificadas",
      fields: {
        width: {
          label: "Width",
          description: "Ancho de página en píxeles",
          placeholder: "Ancho de entrada",
        },
        height: {
          label: "Altura",
          description: "Altura de la página en píxeles",
          placeholder: "Altura de entrada",
        },
      },
    },
    response: {
      success: "Redimensionar la operación con éxito",
      result: "Resultado de la operación de tamaño de página",
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
          "Se produjo un error de red al cambiar el tamaño de la página",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado a cambiar el tamaño de páginas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación de redimensionamiento está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al cambiar el tamaño de la página",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido al redimensionar la página",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto al redimensionar la página",
      },
    },
    success: {
      title: "Page Resized Successfully",
      description: "La página se redimensionó con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      viewportAutomation: "Automatización de Viewport",
    },
  },
  "evaluate-script": {
    title: "Evaluate Script",
    titleShort: "Eval Script",
    description:
      "Ejecutar JavaScript en la página y devolver el resultado. Usar para leer el estado que toma-snapshot no exponga.",
    dynamicTitle: "Script: {{snippet}}",
    form: {
      label: "Evaluate Script",
      description: "Ejecutar JavaScript en la página del navegador",
      fields: {
        function: {
          label: "Función",
          description: "Declaración de función JavaScript para ejecutar",
          placeholder: "() => { return document.title; }",
        },
        args: {
          label: "Argumentos",
          description:
            "Lista opcional de argumentos (element UIDs) para pasar a la función",
          placeholder: '[{"uid": "element-uid"}]',
          uid: {
            label: "Element UID",
            description: "El identificador único de un elemento en la página",
          },
        },
      },
    },
    response: {
      success: "Operación de evaluación de scripts exitosa",
      result: {
        title: "Resultado",
        description: "Resultado de la evaluación del script",
        executed: "Ejecutado",
        result: "Valor de retorno",
      },
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
          "Se produjo un error de red durante la evaluación del script",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para evaluar scripts",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación de evaluación del script está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la evaluación del script",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Un error desconocido ocurrió durante la evaluación del script",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió durante la evaluación del script",
      },
    },
    success: {
      title: "Evaluado exitosamente",
      description: "El JavaScript fue ejecutado con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      scriptExecution: "Ejecución de scripts",
    },
  },
  "get-console-message": {
    title: "Mensaje de Consola",
    titleShort: "Console Msg",
    description:
      "Obtenga el cuerpo completo de un mensaje de consola específico por msgid de mensajes de la lista-console-messages.",
    dynamicTitle: "Consola # {{id}}",
    form: {
      label: "Mensaje de Consola",
      description: "Recuperar un mensaje de consola específico",
      fields: {
        msgid: {
          label: "Mensaje ID",
          description:
            "El msgid de un mensaje de consola de los mensajes de la consola lista",
          placeholder: "Introduzca mensaje ID",
        },
      },
    },
    response: {
      success: "Operación de recuperación del mensaje de consola exitosa",
      result: "Resultado de la recuperación del mensaje de consola",
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
          "Se produjo un error de red al recuperar el mensaje de la consola",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para recuperar mensajes de consola",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "La operación de recuperación del mensaje de consola está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al recuperar el mensaje de consola",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido al recuperar el mensaje de la consola",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Se produjo un conflicto al recuperar el mensaje de la consola",
      },
    },
    success: {
      title: "Mensaje de Consola con éxito",
      description: "El mensaje de la consola fue recuperado con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      debugging: "Debugging",
    },
  },
  "list-console-messages": {
    title: "Mensajes de Consola Lista",
    titleShort: "Consola Log",
    description:
      "Listar mensajes de consola desde la última navegación. Filtro por tipo (error/warn/log). Utilice después de acciones para atrapar errores JS.",
    form: {
      label: "Mensajes de Consola Lista",
      description:
        "Obtener todos los mensajes de consola de la página del navegador",
      fields: {
        includePreservedMessages: {
          label: "Incluir Mensajes Preservados",
          description:
            "Establecido para devolver los mensajes preservados en las últimas 3 navegaciónes",
          placeholder: "false",
        },
        pageIdx: {
          label: "Índice de página",
          description:
            "Número de página para volver (con base en 0, omit para primera página)",
          placeholder: "Indice de página",
        },
        pageSize: {
          label: "Tamaño de página",
          description:
            "Número máximo de mensajes para regresar (omitir para devolver todos los mensajes)",
          placeholder: "Introduzca el tamaño de la página",
        },
        types: {
          label: "Tipos de mensaje",
          description:
            "Filtrar mensajes para sólo devolver mensajes de los tipos especificados (omitir para devolver todos)",
          placeholder: "Seleccione tipos de mensaje",
          options: {
            log: "Log",
            debug: "Depuración",
            info: "Info",
            error: "Error",
            warn: "Advertencia",
            dir: "Dir",
            dirxml: "Dirxml",
            table: "Cuadro",
            trace: "Trace",
            clear: "Limpiar",
            startGroup: "Grupo de inicio",
            startGroupCollapsed: "Grupo de inicio colapsado",
            endGroup: "End Group",
            assert: "Assert",
            profile: "Perfil",
            profileEnd: "Perfil final",
            count: "Conde",
            timeEnd: "Tiempo final",
            verbose: "Verbose",
            issue: "Cuestión",
          },
        },
      },
    },
    response: {
      success: "Mensajes de consola recuperados con éxito",
      result: {
        title: "Resultado",
        description: "Resultado de la lista de mensajes",
        messages: {
          msgid: "Mensaje ID",
          type: "Tipo",
          text: "Mensaje",
          timestamp: "Timestamp",
        },
        totalCount: "Total Conde",
      },
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
          "Se produjo un error de red mientras se enumeran los mensajes de consola",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no está autorizado a listar mensajes de consola",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe la lista de mensajes de consola",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras se enumeran los mensajes de consola",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido mientras se enumeran los mensajes de consola",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Un conflicto ocurrió mientras se enumeraban mensajes de consola",
      },
    },
    success: {
      title: "Mensajes de Consola con éxito",
      description: "Los mensajes de consola fueron recuperados con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      debugging: "Debugging",
    },
  },
  "get-network-request": {
    title: "Obtener solicitud de red",
    titleShort: "Network Req",
    description:
      "Obtenga detalles completos (cabezadores, cuerpo) para una solicitud por reqid de listas-requerimientos de red.",
    dynamicTitle: "Red # {{id}}",
    form: {
      label: "Obtener solicitud de red",
      description:
        "Obtenga una solicitud de red específica o el seleccionado actualmente",
      fields: {
        reqid: {
          label: "Solicitud ID",
          description:
            "El reqid de la solicitud de red (omit para obtener la solicitud seleccionada en DevTools)",
          placeholder: "Ingrese solicitud ID",
        },
        maxBodyLength: {
          label: "Longitud del cuerpo",
          description:
            "Máximo caracteres para volver de los cuerpos de petición/respuesta en línea. Los cuerpos que exceden esto son truncados con un aviso. Omitir sin límite.",
          placeholder: "por ejemplo 10000",
        },
      },
    },
    response: {
      success: "Solicitud de red recuperada con éxito",
      result: "Resultado de recuperación de la solicitud de red",
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
          "Se produjo un error de red al recibir la solicitud de red",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para recibir solicitudes de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Prohibir las solicitudes de red",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al recibir la solicitud de red",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido al recibir la solicitud de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto al recibir la solicitud de red",
      },
    },
    success: {
      title: "Solicitud de red con éxito",
      description: "La solicitud de red fue recuperada con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      networkAnalysis: "Análisis de la red",
    },
  },
  "list-network-requests": {
    title: "Lista de solicitudes de red",
    titleShort: "Network Log",
    description:
      "Listar solicitudes de red desde la última navegación. Filtro por tipo de recurso (fetch/xhr/doc). Usar para inspeccionar llamadas API.",
    form: {
      label: "Lista de solicitudes de red",
      description:
        "Obtener todas las solicitudes de red de la página del navegador",
      fields: {
        includePreservedRequests: {
          label: "Incluir las solicitudes reservadas",
          description:
            "Establecido para devolver las solicitudes preservadas en las últimas 3 navegaciónes",
          placeholder: "false",
        },
        pageIdx: {
          label: "Índice de página",
          description:
            "Número de página para volver (con base en 0, omit para primera página)",
          placeholder: "Indice de página",
        },
        pageSize: {
          label: "Tamaño de página",
          description:
            "Número máximo de solicitudes de regreso (omitir a devolver todas las solicitudes)",
          placeholder: "Introduzca el tamaño de la página",
        },
        resourceTypes: {
          label: "Tipos de recursos",
          description:
            "Solicitudes de filtro para sólo devolver solicitudes de los tipos de recursos especificados (omitir para devolver todos)",
          placeholder: "Seleccionar tipos de recursos",
          options: {
            document: "Documento",
            stylesheet: "Hoja de estilo",
            image: "Imagen",
            media: "Medios",
            font: "Fuente",
            script: "Script",
            texttrack: "Tema de texto",
            xhr: "XHR",
            fetch: "Fetch",
            prefetch: "Prefetch",
            eventsource: "Event Source",
            websocket: "WebSocket",
            manifest: "Manifest",
            signedexchange: "Signed Exchange",
            ping: "Ping",
            cspviolationreport: "CSP Violation Report",
            preflight: "Preflight",
            fedcm: "FedCM",
            other: "Otro",
          },
        },
      },
    },
    response: {
      success: "Solicitudes de red recuperadas con éxito",
      result: {
        title: "Resultado",
        description: "Resultado de la lista de solicitudes de red",
        requests: {
          reqid: "Solicitud ID",
          url: "URL",
          method: "Método",
          status: "Situación",
          type: "Tipo",
        },
        totalCount: "Total Conde",
      },
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
          "Se produjo un error de red mientras se enumeran las solicitudes de red",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no está autorizado a listar solicitudes de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe la lista de solicitudes de red",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras se enumeran las solicitudes de red",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido mientras se enumeran las solicitudes de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Se produjo un conflicto mientras se enumeran las solicitudes de la red",
      },
    },
    success: {
      title: "Solicitudes de red resueltas con éxito",
      description: "Las solicitudes de red se recuperaron con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      networkAnalysis: "Análisis de la red",
    },
  },
  "performance-analyze-insight": {
    title: "Analizar la visión de rendimiento",
    titleShort: "Perf Insight",
    description:
      "Perforar una visión específica de un resultado de traza (por ejemplo, DocumentLatency, LCPBreakdown). Llama después de la prueba de rendimiento.",
    form: {
      label: "Analizar la visión de rendimiento",
      description:
        "Obtenga información detallada sobre una visión de rendimiento específica",
      fields: {
        insightSetId: {
          label: "Juego de presión ID",
          description:
            "El id para el conjunto de información específico (sólo use los ids dados en la lista de conjuntos de información disponibles)",
          placeholder: "Introdúzcase ID",
        },
        insightName: {
          label: "Nombre de la vista",
          description:
            "El nombre de la Insight desea más información sobre (por ejemplo, DocumentLatency o LCPBreakdown)",
          placeholder: "Introdúzcase el nombre del conocimiento.",
        },
      },
    },
    response: {
      success: "Perspectiva de rendimiento analizada con éxito",
      result: "Resultado del análisis de resultados",
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
          "Se produjo un error de red mientras se analiza la visión del rendimiento",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "No está autorizado para analizar las ideas de rendimiento",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe analizar las ideas de rendimiento",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras se analiza la visión del rendimiento",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido mientras se analiza la visión del rendimiento",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Se produjo un conflicto mientras se analiza la visión de rendimiento",
      },
    },
    success: {
      title: "Performance Insight Analyzed Successfully",
      description: "La visión de rendimiento se analizó con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      performanceAutomation: "Automatización del rendimiento",
    },
  },
  "performance-start-trace": {
    title: "Trace de rendimiento inicial",
    titleShort: "Trace de inicio",
    description:
      "Comience un rastro de rendimiento para capturar los vitales de la web y cargar métricas. Siga con el rendimiento-de-de-rendimiento.",
    form: {
      label: "Trace de rendimiento inicial",
      description:
        "Comience la grabación de métricas de rendimiento para la página del navegador",
      fields: {
        reload: {
          label: "Página de recarga",
          description:
            "Determina si, una vez iniciado el rastreo, la página debe ser automáticamente recargada",
          placeholder: "true",
        },
        autoStop: {
          label: "Auto Stop",
          description:
            "Determina si se debe detener automáticamente la grabación de traza",
          placeholder: "true",
        },
      },
    },
    response: {
      success: "Rastreo de rendimiento comenzó con éxito",
      result: "Resultado de inicio del trazo de rendimiento",
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
          "Se produjo un error de red al iniciar el trazo de rendimiento",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Usted no está autorizado para iniciar las trazas de rendimiento",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíben los rastros de rendimiento inicial",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al iniciar el trazo de rendimiento",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido al iniciar el trazo de rendimiento",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Se produjo un conflicto al iniciar el rastro de la actuación profesional",
      },
    },
    success: {
      title: "Performance Trace comenzó con éxito",
      description: "El rastro de rendimiento se inició con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      performanceAutomation: "Automatización del rendimiento",
    },
  },
  "performance-stop-trace": {
    title: "Stop Performance Trace",
    titleShort: "Stop Trace",
    description:
      "Detenga las métricas activas de traza y rendimiento con IDs de conjunto de información para el rendimiento-analyze-insight.",
    form: {
      label: "Stop Performance Trace",
      description: "Parar la grabación de traza de rendimiento activo",
      fields: {},
    },
    response: {
      success: "Trazado de rendimiento detenido con éxito",
      result: "Resultado del trazo de rendimiento con métricas",
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
          "Se produjo un error de red al detener el rastro del rendimiento",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Usted no está autorizado para detener los rastros de rendimiento",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Prohibido dejar rastros de rendimiento",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno al detener el rastro de rendimiento",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido al detener el rastro del rendimiento",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description:
          "Se produjo un conflicto al detener el rastro del desempeño",
      },
    },
    success: {
      title: "Rendimiento Trace Detuvo Su éxito",
      description: "El rastro del rendimiento se detuvo con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      performanceAutomation: "Automatización del rendimiento",
    },
  },
  "take-screenshot": {
    title: "Take Captura de Pantalla",
    titleShort: "Captura",
    dynamicTitle: "Captura de Pantalla: {{target}}",
    description:
      "Capturar una imagen visual de la página o un elemento específico. Devuelve una imagen. Uso para verificar el estado UI.",
    form: {
      label: "Take Captura de Pantalla",
      description: "Capturar una imagen de la página o elemento del navegador",
      fields: {
        uid: {
          label: "Element UID",
          description:
            "El uid de un elemento a capturar (omitir para capturar toda la página)",
          placeholder: "Ingrese elemento uid",
        },
        fullPage: {
          label: "Página completa",
          description:
            "Si se establece a la verdad toma una captura de pantalla de la página completa en lugar del mirador visible (incompatible con uid)",
          placeholder: "false",
        },
        format: {
          label: "Format",
          description:
            "Tipo de formato para guardar la captura de pantalla como (por defecto: png)",
          placeholder: "png",
          options: {
            png: "PNG",
            jpeg: "JPEG",
            webp: "WebP",
          },
        },
        quality: {
          label: "Calidad",
          description:
            "Calidad de compresión para formatos JPEG y WebP (0-100). Valores más altos significan una mejor calidad pero tamaños de archivos más grandes. Ignorado para formato PNG.",
          placeholder: "80",
        },
        filePath: {
          label: "Sendero de archivo",
          description:
            "El camino absoluto, o un camino relativo al directorio de trabajo actual, para guardar la captura de pantalla en lugar de adjuntarla a la respuesta",
          placeholder: "/path/to/screenshot.png",
        },
      },
    },
    response: {
      success: "Captura de pantalla con éxito",
      result: "Captura de pantalla resultado",
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
        description: "No está autorizado para capturar capturas de pantalla",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Capturar capturas de pantalla está prohibido",
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
    },
    success: {
      title: "Captura de pantalla con éxito",
      description: "La captura de pantalla fue captada con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      captureAutomation: "Automatización de captura",
    },
  },
  "take-snapshot": {
    title: "Tomen instantáneas",
    titleShort: "Snapshot",
    description:
      "Obtenga el árbol a11y de la página como texto. Se requiere antes de hacer clic/fill/drag. proporciona elemento UIDs.",
    form: {
      label: "Tomen instantáneas",
      description:
        "Capturar una instantánea de texto de la página del navegador basado en el árbol a11y",
      fields: {
        verbose: {
          label: "Verbose",
          description:
            "Ya sea para incluir toda la información posible disponible en el árbol a11y completo (por defecto: falso)",
          placeholder: "false",
        },
        filePath: {
          label: "Sendero de archivo",
          description:
            "El camino absoluto, o un camino relativo al actual directorio de trabajo, para guardar la instantánea en lugar de adjuntarla a la respuesta",
          placeholder: "/path/to/snapshot.txt",
        },
      },
    },
    response: {
      success: "Snapshot capturado con éxito",
      result: "Resultado de captura de instantáneas",
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
        description: "Se produjo un error de red al capturar la instantánea",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para capturar instantáneas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Capturar instantáneas está prohibido",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno mientras capturaba la instantánea",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Un error desconocido ocurrió mientras capturaba la instantánea",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió mientras capturaba la instantánea",
      },
    },
    success: {
      title: "Snapshot Captured Con éxito",
      description: "La instantánea fue capturada con éxito",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      captureAutomation: "Automatización de captura",
    },
  },
  "wait-for": {
    title: "Espera.",
    titleShort: "Espera.",
    dynamicTitle: "Espera: {{text}}",
    description:
      "Espere a que el texto específico aparezca en la página. Utilice después de la navegación o acciones que activan actualizaciones asinc.",

    form: {
      label: "Esperar texto",
      description: "Espere a que el texto específico aparezca en la página",
      fields: {
        text: {
          label: "Texto",
          description: "Texto que aparecerá en la página",
          placeholder: "Escriba texto para esperar",
        },
        timeout: {
          label: "Hora de salir",
          description:
            "Tiempo máximo de espera en milisegundos. Si se establece a 0, el tiempo de espera predeterminado será utilizado",
          placeholder: "Ingrese el tiempo (ms)",
        },
        captureSnapshot: {
          label: "Captura de instantáneas",
          description:
            "Cuando está habilitado, incluye la instantánea de accesibilidad completa en la respuesta. Discapacitados por defecto para mantener las respuestas concisas.",
        },
      },
    },

    response: {
      success: "Operaciones de espera exitosas",
      result: "Resultado de operación de espera",
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
          "Se produjo un error de red durante la operación de espera",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No está autorizado para realizar operaciones de espera",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "La operación de espera está prohibida",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      serverError: {
        title: "Error del servidor",
        description:
          "Un error de servidor interno ocurrió durante la operación de espera",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Un error desconocido ocurrió durante la operación de espera",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Usted tiene cambios insalvados que pueden perderse",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió durante la operación de espera",
      },
    },

    success: {
      title: "Operación de espera exitosa",
      description: "El texto especificado apareció en la página",
    },
    category: "Navegador",
    tags: {
      browserAutomation: "Automatización del navegador",
      waitAutomation: "Espera Automatización",
    },
  },
  title: "Herramientas de Chrome DevTools MCP",
  description:
    "Automatización del navegador a través de Chrome DevTools. Flujo: nueva página → toma-snapshot → interactuar (click/fill) → verificar.",
  category: "Navegador",
  summary:
    "Acceso Chrome DevTools Protocolo herramientas a través de MCP para automatización web",
  tags: {
    browserAutomation: "Automatización del navegador",
    chromeDevTools: "Chrome DevTools",
    mcpTools: "Herramientas MCP",
    webDebugging: "Web Debugging",
    performanceAnalysis: "Análisis de la actuación profesional",
    inputAutomation: "Automatización de entrada",
    captureAutomation: "Automatización de captura",
    debugging: "Debugging",
    dialogAutomation: "Automatización de diálogo",
    navigationAutomation: "Automatización de navegación",
    networkAnalysis: "Análisis de la red",
    performanceAutomation: "Automatización del rendimiento",
    scriptExecution: "Ejecución de scripts",
    viewportAutomation: "Automatización de Viewport",
    waitAutomation: "Espera Automatización",
  },

  form: {
    label: "Execución de la herramienta del navegador",
    description:
      "Ejecutar Chrome DevTools MCP herramientas para el control y análisis del navegador",
    fields: {
      tool: {
        label: "Herencia",
        description:
          "Seleccione la herramienta Chrome DevTools MCP para ejecutar",
        placeholder: "Elija una herramienta...",
      },
      arguments: {
        label: "Argumentos",
        description:
          "JSON argumenta para la herramienta seleccionada (opcional)",
        placeholder: '{"url": "https://example.com"}',
      },
    },
  },

  tool: {
    // Input automation tools (8)
    click: "Haga clic en Element",
    drag: "Arrastre Element",
    fill: "Fill Input Field",
    fillForm: "Formulario de llenado",
    handleDialog: "Diagrama de manija",
    hover: "Hover Element",
    pressKey: "Clave de prensa",
    uploadFile: "Cargue el archivo",

    // Navigation automation tools (6)
    closePage: "Página",
    listPages: "Páginas de lista",
    navigatePage: "Página de navegación",
    newPage: "Nueva página",
    selectPage: "Seleccionar página",
    waitFor: "Espera.",

    // Emulation tools (2)
    emulate: "Emulate Device",
    resizePage: "Página",

    // Performance tools (3)
    performanceAnalyzeInsight: "Analizar la visión de rendimiento",
    performanceStartTrace: "Trace de rendimiento inicial",
    performanceStopTrace: "Stop Performance Trace",

    // Network tools (2)
    getNetworkRequest: "Obtener solicitud de red",
    listNetworkRequests: "Lista de solicitudes de red",

    // Debugging tools (5)
    evaluateScript: "Evaluate Script",
    getConsoleMessage: "Mensaje de Consola",
    listConsoleMessages: "Mensajes de Consola Lista",
    takeScreenshot: "Take Captura de Pantalla",
    takeSnapshot: "Tomen instantáneas",
  },

  status: {
    pending: "Pendiente",
    running: "Corriendo",
    completed: "Completado",
    failed: "Failed",
  },

  response: {
    success: "Herramienta ejecutada con éxito",
    result: "Resultado de ejecución",
    status: "Estado de ejecución actual",
    statusItem: "Tema de la situación",
    executionId: "Ejecución ID para el seguimiento",
  },

  examples: {
    requests: {
      navigate: {
        title: "Navigate a URL",
        description: "Navegue el navegador a un URL específico",
      },
      screenshot: {
        title: "Take Captura de Pantalla",
        description: "Capturar una imagen de la página actual",
      },
      click: {
        title: "Haga clic en Element",
        description: "Haga clic en un elemento específico",
      },
      performance: {
        title: "Trace de rendimiento inicial",
        description: "Comience la grabación de métricas de rendimiento",
      },
      script: {
        title: "Evaluate Script",
        description: "Ejecutar JavaScript en el navegador",
      },
    },
    responses: {
      navigate: {
        title: "Resultado de la navegación",
        description: "Resultado de la navegación de la página",
      },
      screenshot: {
        title: "Captura de pantalla Resultado",
        description: "Captura de pantalla resultado",
      },
      click: {
        title: "Haga clic en Resultado",
        description: "Resultado del clic de elemento",
      },
      performance: {
        title: "Performance Trace Started",
        description: "Rastreo de la actuación profesional iniciado",
      },
      script: {
        title: "Resultado de la evaluación del script",
        description: "Resultado de ejecución JavaScript",
      },
    },
  },

  errors: {
    toolExecutionFailed: {
      title: "La ejecución de la herramienta falló",
      description: "La herramienta seleccionada no puede ejecutarse con éxito",
    },
    invalidArguments: {
      title: "Argumentos inválidos",
      description:
        "Los argumentos proporcionados no son válidos para esta herramienta",
    },
    browserNotAvailable: {
      title: "Navegador no disponible",
      description: "Chrome instancia del navegador no está disponible",
    },
    toolNotFound: {
      title: "Herramienta no encontrada",
      description: "No se dispone de la herramienta solicitada",
    },
    validation: {
      title: "Error de validación",
      description: "Por favor, compruebe su entrada e inténtelo de nuevo",
      toolRequired: "Se requiere la selección de herramientas",
      argumentsInvalid: "Los argumentos deben ser válidos JSON",
    },
    network: {
      title: "Error de red",
      description: "Se produjo un error de red al ejecutar la herramienta",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description:
        "Usted no está autorizado a ejecutar herramientas del navegador",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "La ejecución de herramientas del navegador está prohibida",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró la herramienta del navegador solicitada",
    },
    serverError: {
      title: "Error del servidor",
      description:
        "Se produjo un error de servidor interno durante la ejecución de la herramienta",
    },
    unknown: {
      title: "Error desconocido",
      description:
        "Un error desconocido ocurrió durante la ejecución de herramientas",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Usted tiene cambios insalvados que pueden perderse",
    },
    conflict: {
      title: "Conflicto",
      description: "Se produjo un conflicto mientras se ejecutó la herramienta",
    },
  },

  success: {
    title: "Herramienta ejecutada con éxito",
    description: "La herramienta del navegador se ejecutó con éxito",
  },

  shared: {
    addItem: "Añadir elemento",
    removeItem: "Quitar el último elemento",
    back: "Volver",
    instanceId: {
      label: "Período de sesiones ID",
      description:
        "Navegador sesión ID. Cada ID único obtiene su propia pestaña aislada. Deja vacío para usar la sesión predeterminada.",
      placeholder: "por ejemplo, mi sesión-1",
    },
  },

  repository: {
    execute: {
      start: "Ejecución de la herramienta del navegador inicial",
      success: "Herramienta de navegador ejecutado con éxito",
      error: "Herramienta de ejecución de errores del navegador",
    },
    mcp: {
      connect: {
        start: "Conexión a Chrome DevTools MCP servidor",
        success: "Conectado al servidor MCP con éxito",
        error: "No conectado al servidor MCP",
        failedToInitialize: "Failed to initialize Chrome DevTools MCP server",
      },
      closePage: {
        noSession: "No hay sesión activa - nada que cerrar",
        switchedToPage: "Página cerrada, conmutada a la página {{pageId}}",
        closedPage: "Página privada {{pageId}}",
        pageNotInSession:
          "Página {{pageId}} no pertenece a este período de sesiones",
      },
      tool: {
        call: {
          start: "Llamar a la herramienta MCP",
          success: "herramienta MCP llamada con éxito",
          error: "Llamada de error herramienta MCP",
          invalidJsonArguments: "Inválidos argumentos JSON",
          executionFailed: "La ejecución de la herramienta falló: {{error}}",
          newPageFailed: "No se puede abrir una página nueva",
          toolExecutionFailed: "Fallado para ejecutar {{toolName}}",
        },
      },
    },
  },
};
