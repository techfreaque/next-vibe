import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Deps",
  titleShort: "Deps",
  description:
    "Analizador de dependencia completo. Maps the import graph across the whole codebase and enforces package boundaries. --mode=files / categories / unused for the import graph and dead code. --mode=boundaries shows every import a package makes into app code (the moves to fix before extraction). --mode=layers flags illegal cross-package direction. --mode=shared-candidates clasifica la aplicación primitiva de los paquetes que ya dependen.",
  category: "Herramientas de desarrollo",
  tag: "análisis",

  mode: {
    report: "Informe",
    files: "Archivos",
    categories: "Categorías",
    unused: "No utilizados",
    boundaries: "Límites",
    layers: "Capas",
    sharedCandidates: "Candidatos compartidos",
    importers: "Importadores",
    needsMove: "Necesidades Muévanse",
    unusedSymbols: "Símbolos no utilizados",
    unusedI18n: "Llaves i18n no utilizadas",
    crossDomain: "Cross-Domain",
    pageViolations: "Violaciones de la página",
  },

  container: {
    title: "Análisis de la dependencia",
    description: "Configurar el alcance y modo del análisis de dependencia",
  },

  fields: {
    focus: {
      label: "Sendero de enfoque",
      description:
        "Reducir a un archivo o directorio específico (por ejemplo, 'agent/ai-stream' o 'user'). Deja vacío para analizar la base de código completa.",
      placeholder: "por ejemplo, agente/ai-stream o usuario",
    },
    mode: {
      label: "Modo",
      description:
        "ficheros: graph. categorías: enrollado por dir de alto nivel sin uso: archivos sin importadores. límites: importación de paquetes en código de aplicación. capas: dirección ilegal de cross-package. candidaturas compartidas: aplicación primitiva de los paquetes dependen. importadores: importadores de un archivo por paquete (necesidad --focus).",
    },
    package: {
      label: "Paquete",
      description:
        "Limitaciones/capas estrechas a un solo paquete declarado (por ejemplo, vibe-ui, vibe-unified-ui). Deja vacío para todos los paquetes.",
      placeholder: "por ejemplo, vibe-unified-ui",
    },
    depth: {
      label: "Profundidad",
      description:
        "¿Cuántos niveles de dependencia transitoria incluyen (por defecto: 1, sólo directo). 0 = ilimitado.",
    },
    limit: {
      label: "Limitación",
      description:
        "Número máximo de entradas para el regreso (predeterminado: 100).",
    },
  },

  response: {
    success: "Análisis de dependencia completo",
    entries: {
      title: "Entidades de dependencia",
      emptyState: {
        description: "No hay archivos que coincidan con el filtro dado.",
      },
      importedBy: "importados por",
    },
    summary: {
      title: "Resumen",
      totalFiles: "Total Files Scanned",
      totalEdges: "Total Import Edges",
      unusedCount: "Exportaciones no utilizadas",
    },
    boundaries: {
      title: "Paquete Boundaries",
      cleanState:
        "No hay violaciones de límites. Los paquetes son autocontenidos.",
      legendTitle: "Leyenda",
      legendOut: "out-of-package (paquete alcanza el código de aplicación)",
      legendCross: "multipaquete (dependencia ilegal)",
      legendReverse:
        "red de dirección inversa (las importaciones de capa inferior más altas)",
      legendHot: "blanco caliente (10+ importadores - más fuerte en el núcleo)",
      colTarget: "objetivo",
      colCount: "usos",
      colKind: "especie",
      packageHeader: "paquete",
      violationsAcross: "violaciones de las",
      packagesWord: "paquetes",
    },
    layers: {
      title: "Dirección de capas",
      cleanState:
        "La dirección está limpia. No hay importaciones ilegales de paquetes cruzados.",
      edge: "importaciones",
    },
    sharedCandidates: {
      title: "Candidatos compartidos",
      description:
        "Los archivos de código de aplicación importados por paquetes, clasificados por cuenta de paquete-importador. Alto = tire hacia el fondo de vibración.",
      colCount: "usos de pkg",
      colPath: "sendero",
      emptyState:
        "No se importan archivos de aplicación por código de paquete.",
    },
    importers: {
      title: "Importadores por paquete",
      colCount: "usos",
      colGroup: "paquete / categoría",
    },
    needsMove: {
      title: "Lista de movimiento",
      description:
        "Archivos que aún no están en su posición final, agrupados por área de destino. Los archivos enlistados (ya colocados) son silenciosos. Lea la parte superior a la parte inferior. ese es el orden de movimiento.",
      colTarget: "→ área",
      colPath: "archivo",
      emptyState: "Todo en alcance está colocado. No hay nada que mover.",
      relocate: "reubicación",
      reorganize: "reorg",
    },
    unusedSymbols: {
      title: "Superficie pública no utilizada",
      description:
        "Exportaciones muertas, métodos estáticos no utilizados y archivos sin importadores. Las señales basadas en Regex para revisar. conservadores (pueden perder usos dinámicos).",
      colKind: "especie",
      colSymbol: "símbolo",
      colPath: "archivo",
      emptyState: "No hay superficie pública no usada en su alcance.",
      wholeFile: "(total archivo - no importadores)",
    },
    unusedI18n: {
      title: "Llaves i18n no utilizadas",
      description:
        "Keys in scoped en translations that no source file references. Prefijos de plantilla como t(`a.b.<x>`) protegen su subárbol. Eliminar de en, de y pl juntos.",
      colKey: "clave",
      colPath: "archivo",
      emptyState: "Se hace referencia a cada clave de traducción en alcance.",
    },
    pageViolations: {
      title: "Violaciones de la Arquitectura",
      description:
        "ficheros page.tsx importando más que repositorio/definición/i18n/page-client. Las páginas deben ser delgadas conchas SSR. lógica empresarial, UI, enums y acceso db pertenecen a repository.ts o página-client.tsx.",
      colCount: "violaciones",
      colPath: "página",
      emptyState:
        "Todos los archivos page.tsx respetan el límite de arquitectura.",
    },
    crossDomain: {
      title: "Candidatos de dominio cruzado",
      description:
        "Importaciones que cruzan un límite de dominio y son NOT un marco permitido primitivo. Cada uno es un candidato para promover en vibe (engine/core) o decouple. La mayoría de las veces primero. Los bordes primitivos permitidos son altos por separado, no ocultos.",
      colCount: "usos",
      colTarget: "para el objetivo",
      emptyState:
        "No hay bordes cruzados sin revisión. Se permite todo el cruce.",
      allowedTally: "los bordes primitivos permitidos (no listado)",
    },
    violations: {
      title: "Violaciones",
      outOfPackage: "Envasado",
      crossPackage: "Paquete cruzado",
      reverseDirection: "Dirección",
      total: "Total",
    },
  },

  errors: {
    validation: {
      title: "Parámetros inválidos",
      description: "Los parámetros de análisis de dependencia son inválidos",
    },
    internal: {
      title: "Error interno",
      description:
        "Se produjo un error interno durante el análisis de la dependencia",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "No tienes permiso para realizar análisis de dependencia",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Se prohíbe el acceso al análisis de la dependencia",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró la ruta de enfoque especificada",
    },
    focusNotFound:
      "No hay archivos que coincidan con la ruta de enfoque {{focus}}",
    server: {
      title: "Error del servidor",
      description:
        "Error del servidor ocurrió durante el análisis de dependencia",
    },
    unknown: {
      title: "Error desconocido",
      description:
        "Se produjo un error desconocido durante el análisis de la dependencia",
    },
    unsaved: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    conflict: {
      title: "Conflicto",
      description:
        "Se produjo un conflicto durante el análisis de la dependencia",
    },
  },

  success: {
    title: "Análisis completo",
    description: "Análisis de la dependencia completado con éxito",
  },
};
