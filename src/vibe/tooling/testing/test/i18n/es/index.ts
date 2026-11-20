import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Pruebas de ejecución",
  titleShort: "Pruebas de ejecución",
  description: "Ejecutar la suite de prueba con configuraciones opcionales",
  category: "Pruebas",
  tag: "Test",

  container: {
    title: "Configuración de prueba",
    description: "Configurar los parámetros de ejecución de pruebas",
  },

  fields: {
    path: {
      label: "Sendero de prueba",
      description: "Camino a los archivos de prueba o directorio",
      placeholder: "src/",
    },
    verbose: {
      label: "Productos de Verbose",
      description: "Permitir la producción de prueba detallada",
    },
    watch: {
      label: "Modo de reloj",
      description:
        "Ejecute pruebas en modo de reloj para los cambios de archivo",
    },
    coverage: {
      label: "Informe de cobertura",
      description: "Generar informe de cobertura de pruebas",
    },
  },

  response: {
    success: "Estado de ejecución de pruebas",
    output: "Prueba de salida y resultados",
    duration: "Duración de la ejecución de pruebas (ms)",
  },

  errors: {
    validation: {
      title: "Error de validación",
      description: "Parámetros de configuración de prueba inválidos",
    },
    internal: {
      title: "Error interno",
      description: "La ejecución de pruebas falló debido al error interno",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Permiso denegado para la ejecución de pruebas",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "La ejecución de pruebas está prohibida",
    },
    notFound: {
      title: "No encontrado",
      description: "Archivo de prueba o directorio no encontrado",
    },
    server: {
      title: "Error del servidor",
      description: "Error del servidor durante la ejecución de pruebas",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
    unsaved: {
      title: "Cambios sin guardar",
      description: "Hay cambios sin salvar que pueden afectar las pruebas",
    },
    conflict: {
      title: "Conflicto",
      description: "Conflicto de ejecución de pruebas detectado",
    },
    executionFailed:
      "La ejecución de pruebas falló después de {{duration}} ms: {{detail}}\n{{output}}",
    // The EN wording of `streamingUnsupported` is load-bearing: test-endpoint.ts
    // probes response messages for "Streaming responses are not supported" to tell
    // test-infrastructure failures from real endpoint errors. Keep that substring.
    streamingUnsupported:
      "No se admiten respuestas de racionalización en los exámenes",
    responseSchemaFailed:
      "Validación del esquema de respuesta falló para {{path}} : {{issues}}",
    requestFailed: "La solicitud de prueba falló: {{detail}}",
    browser: {
      serverNotRunning:
        "El servidor de Atlas dev no está funcionando - empezar con vibe dev",
      openFailed: "No podía abrir la página del navegador: {{detail}}",
      fillFailed: "No se pueden rellenar los campos de formularios: {{detail}}",
      submitFailed:
        "No se puede hacer clic en el botón de presentación: {{detail}}",
      evaluateFailed: "Evaluación de scripts en la página falló: {{detail}}",
      resultTimeout:
        "Ningún resultado de mutación llegó dentro de los ms {{timeoutMs}}",
      parseFailed:
        "No se pudo analizar la respuesta en caché como JSON : {{raw}}",
      cacheEmpty:
        "El caché de mutación está vacío - la respuesta nunca cargada",
      requestFailed: "Prueba del navegador falló: {{detail}}",
    },
  },

  success: {
    title: "Pruebas completadas",
    description: "Ejecución de los ensayos con éxito",
  },
};
