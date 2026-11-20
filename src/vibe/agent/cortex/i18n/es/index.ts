/* eslint-disable i18next/no-literal-string */
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    cortex: "Cortex",
  },
  category: "Cortex",
  scaffold: {
    roots: {
      memories: "memories",
      documents: "documents",
    },
    memories: {
      identity: {
        path: "identity",
        purpose: "Quién eres: nombre, rol, objetivos y estilo de comunicación",
      },
      expertise: {
        path: "expertise",
        purpose: "Lo que sabes hacer: habilidades, herramientas y experiencia",
      },
      context: {
        path: "context",
        purpose:
          "Situación actual: proyectos activos, preferencias y limitaciones",
      },
      life: {
        path: "life",
        purpose:
          "Objetivos y situación de vida: carrera, salud, relaciones, finanzas, crecimiento y propósito",
      },
    },
    documents: {
      inbox: {
        path: "inbox",
        purpose:
          "Apuntes rápidos. Guárdalos aquí y organízalos cuando tengas el contexto.",
        icon: "inbox",
      },
      projects: {
        path: "projects",
        purpose: "Trabajo en curso. Una subcarpeta por proyecto.",
        icon: "folder-open",
      },
      knowledge: {
        path: "knowledge",
        purpose: "Material de referencia que vale la pena conservar",
        icon: "book-open",
      },
      journal: {
        path: "journal",
        purpose: "Entradas con fecha: ideas, reflexiones y observaciones",
        icon: "pen-line",
      },
      templates: {
        path: "templates",
        purpose: "Plantillas reutilizables para tareas recurrentes",
        icon: "layout-template",
      },
    },
  },
  templates: {
    memories: {
      identity: {
        name: {
          path: "name.md",
          content: `---\npriority: 100\ntags: [identity]\n---\n\n<!-- Tu nombre y cómo prefieres que se dirijan a ti. La IA completará este campo durante tu primera conversación. -->\n`,
        },
        role: {
          path: "role.md",
          content: `---\npriority: 100\ntags: [identity, work]\n---\n\n<!-- Tu rol profesional, qué haces y en qué contexto trabajas. -->\n`,
        },
        goals: {
          path: "goals.md",
          content: `---\npriority: 90\ntags: [identity, goals]\n---\n\n<!-- Tus objetivos principales: qué quieres crear, conseguir o mejorar a corto y largo plazo. -->\n`,
        },
        communication: {
          path: "communication.md",
          content: `---\npriority: 85\ntags: [identity, style]\n---\n\n<!-- Cómo prefieres comunicarte: tono, detalle, formato, qué te molesta y qué valoras. -->\n`,
        },
      },
      expertise: {
        skills: {
          path: "skills.md",
          content: `---\npriority: 80\ntags: [expertise]\n---\n\n<!-- Tus habilidades técnicas y profesionales. ¿En qué tienes experiencia y qué estás aprendiendo? -->\n`,
        },
        tools: {
          path: "tools.md",
          content: `---\npriority: 75\ntags: [expertise, tech]\n---\n\n<!-- Herramientas, lenguajes, frameworks y plataformas que usas habitualmente. Tecnologías que prefieres. -->\n`,
        },
        background: {
          path: "background.md",
          content: `---\npriority: 70\ntags: [expertise]\n---\n\n<!-- Tu trayectoria, tu experiencia y cómo llegaste hasta aquí. Ayuda a la IA a entender el contexto de cada interacción. -->\n`,
        },
      },
      context: {
        projects: {
          path: "projects.md",
          content: `---\npriority: 80\ntags: [context, projects]\n---\n\n<!-- Proyectos activos: en qué trabajas y qué importa más ahora. -->\n`,
        },
        preferences: {
          path: "preferences.md",
          content: `---\npriority: 70\ntags: [context]\n---\n\n<!-- Cómo prefieres trabajar, qué te retrasa y qué te ayuda a concentrarte. -->\n`,
        },
        constraints: {
          path: "constraints.md",
          content: `---\npriority: 65\ntags: [context]\n---\n\n<!-- Límites, reglas estrictas y condiciones innegociables sobre cómo debe actuar la IA contigo. -->\n`,
        },
      },
      life: {
        career: {
          path: "career.md",
          content: `---\npriority: 90\ntags: [life, career, goals]\n---\n\n## Situación actual\n\n<!-- ¿En qué trabajas ahora? Rol, empresa o proyecto, nivel de ingresos y satisfacción del 1 al 10. -->\n\n## Objetivos\n\n<!-- A corto plazo (este mes): -->\n<!-- A mediano plazo (este año): -->\n<!-- A largo plazo (3-5 años): -->\n\n## Proyectos activos\n\n<!-- ¿Qué proyectos de /documents/projects/ impulsan tu carrera ahora? ¿De qué manera? -->\n\n## Obstáculos\n\n<!-- ¿Qué problema cambiaría todo si lo resolvieras? ¿Cuál es el mayor obstáculo? -->\n\n## Patrones\n\n<!-- Patrones en tu carrera: qué te atrae una y otra vez, qué te agota y qué te da energía. -->\n`,
        },
        health: {
          path: "health.md",
          content: `---\npriority: 90\ntags: [life, health, goals]\n---\n\n## Situación actual\n\n<!-- Haz un balance sincero: estado físico, estado mental, calidad del sueño, afecciones y preocupaciones. -->\n\n## Rutinas\n\n<!-- Lo que haces hoy: ejercicio, horarios de sueño y hábitos alimentarios. -->\n\n## Energía\n\n<!-- ¿Qué te recarga? ¿Qué te agota? ¿En qué momentos del día o de la semana tienes más claridad? -->\n\n## Objetivos\n\n<!-- A corto plazo (este mes): -->\n<!-- A largo plazo (este año): -->\n\n## Obstáculos\n\n<!-- ¿Qué te impide mejorar tu salud? ¿Tiempo, motivación, información o entorno? -->\n`,
        },
        relationships: {
          path: "relationships.md",
          content: `---\npriority: 85\ntags: [life, relationships, goals]\n---\n\n## Círculo cercano\n\n<!-- Las 3-5 personas más importantes. Pareja, familia y amistades más cercanas. ¿Cómo va la relación con cada una? -->\n\n## Situación actual\n\n<!-- ¿Cómo van tus relaciones? ¿A quién sientes cerca? ¿De quién te has distanciado? -->\n\n## Tiempo y dedicación\n\n<!-- ¿Quién necesita más atención de tu parte? ¿A qué relaciones dedicas demasiada o muy poca energía? -->\n\n## Objetivos\n\n<!-- ¿Qué quieres construir o reparar en tus relaciones este año? -->\n\n## Obstáculos\n\n<!-- ¿Qué te estorba? ¿Tiempo, distancia, conflictos pendientes o conversaciones que evitas? -->\n`,
        },
        finances: {
          path: "finances.md",
          content: `---\npriority: 85\ntags: [life, finances, goals]\n---\n\n## Situación actual\n\n<!-- Ingresos y gastos mensuales. Ahorros y deudas. Estabilidad del 1 al 10. -->\n\n## Fondo de emergencia\n\n<!-- ¿Cuántos meses podrías cubrir tus gastos sin ingresos? -->\n\n## Objetivos\n\n<!-- A corto plazo (este mes): -->\n<!-- A largo plazo (este año): -->\n\n## Crecimiento\n\n<!-- ¿Cómo construyes patrimonio o seguridad económica? Inversiones, ingresos extra y habilidades que generan ingresos. -->\n\n## Obstáculos\n\n<!-- ¿Cuál es tu mayor riesgo u obstáculo financiero ahora? -->\n`,
        },
        growth: {
          path: "growth.md",
          content: `---\npriority: 85\ntags: [life, growth, learning, goals]\n---\n\n## Enfoque actual\n\n<!-- ¿Qué estás aprendiendo o desarrollando ahora? ¿Qué empieza a fluir? -->\n\n## Habilidades por desarrollar\n\n<!-- ¿Qué habilidad o conocimiento te permitiría dar el siguiente paso? -->\n\n## Objetivos\n\n<!-- ¿Qué quieres aprender o dominar este año? Elige un objetivo concreto. -->\n\n## Recursos\n\n<!-- Libros, cursos, mentores y comunidades que te ayudan. ¿Qué te está funcionando? -->\n\n## Obstáculos\n\n<!-- ¿Qué frena tu crecimiento? ¿Tiempo, enfoque, acceso a recursos o miedo? -->\n`,
        },
        purpose: {
          path: "purpose.md",
          content: `---\npriority: 95\ntags: [life, purpose, values, goals]\n---\n\n## Rumbo\n\n<!-- En una o dos frases: ¿qué da sentido a tu vida? ¿Qué quieres hacer o construir? -->\n\n## Valores fundamentales\n\n<!-- Elige de 3 a 5 valores que de verdad guíen tus decisiones cotidianas. -->\n\n## Cómo se ve el éxito\n\n<!-- Dentro de 5 años, ¿cómo sería para ti una vida bien vivida? -->\n`,
        },
      },
    },
    documents: {
      meetingNotes: {
        path: "meeting-notes.md",
        content: `---\ntype: template\ntags: [meetings, template]\n---\n\n# Notas de la reunión ([Date])\n\n**Participantes:**\n**Propósito:**\n\n## Contexto\n\nExplica brevemente por qué se hizo la reunión.\n\n## Agenda\n\n1.\n2.\n3.\n\n## Decisiones clave\n\n-\n\n## Acciones pendientes\n\n- [ ] @person: tarea, fecha límite [date]\n\n## Notas\n\n---\n*Archivado desde /documents/inbox*\n`,
      },
      projectBrief: {
        path: "project-brief.md",
        content: `---\ntype: template\ntags: [projects, template]\nstatus: draft\n---\n\n# Resumen del proyecto: [Name]\n\n**Responsable:**\n**Inicio:**\n**Meta:**\n\n## Problema\n\n¿Qué problema sigue abierto sin este proyecto? Explícalo en un párrafo.\n\n## Objetivo\n\nUna frase. Define un resultado concreto y, si puedes, medible.\n\n## Alcance\n\n**Incluye:**\n-\n\n**Excluye:**\n-\n\n## Criterios de éxito\n\n- [ ]\n- [ ]\n\n## Riesgos\n\n| Riesgo | Probabilidad | Impacto | Mitigación |\n|------|-----------|--------|------------|\n|      |           |        |            |\n\n## Recursos\n\nEnlaces, referencias y trabajos previos.\n`,
      },
      weeklyReview: {
        path: "weekly-review.md",
        content: `---\ntype: template\ntags: [review, weekly, template]\n---\n\n# Semana del [Date]\n\n## Qué entregaste\n\n-\n\n## Qué quedó pendiente\n\n-\n\n## Obstáculos que surgieron\n\n-\n\n## Qué aprendí\n\n-\n\n## Prioridad para la próxima semana\n\n1.\n2.\n3.\n\n## Nivel de energía (del 1 al 10)\n\nTrabajo:\nVida personal:\n\n---\n*Usa menos de 200 palabras. Escribe rápido y céntrate en lo esencial.*\n`,
      },
      decisionLog: {
        path: "decision-log.md",
        content: `---\ntype: template\ntags: [decisions, architecture, template]\n---\n\n# Decisión: [Title]\n\n**Fecha:**\n**Estado:** proposed | accepted | superseded | deprecated\n**Quién decide:**\n\n## Contexto\n\n¿Qué situación exigió esta decisión? ¿Qué restricciones hay?\n\n## Opciones consideradas\n\n### Opción A ([Name])\n\n**A favor:**\n**En contra:**\n\n### Opción B ([Name])\n\n**A favor:**\n**En contra:**\n\n## Decisión\n\nElegimos **la opción [X]** porque:\n\n## Consecuencias\n\n**Positivas:**\n**Negativas:**\n**Neutras:**\n\n---\n*Enlaza a este archivo desde el resumen del proyecto o el comentario correspondiente en el código.*\n`,
      },
      knowledgeArticle: {
        path: "knowledge-article.md",
        content: `---\ntype: template\ntags: [knowledge, reference, template]\n---\n\n# [Topic]\n\n**Última verificación:**\n**Fuente:**\n\n## Resumen\n\nEn un párrafo: ¿qué es, por qué importa y cuándo se aplica?\n\n## Cómo funciona\n\nExplica el funcionamiento básico. Incluye solo lo necesario para entenderlo o aplicarlo.\n\n## Cuándo usarlo\n\n-\n-\n\n## Cuándo evitarlo\n\n-\n\n## Ejemplos\n\n\`\`\`\npega aquí un ejemplo\n\`\`\`\n\n## Referencias\n\n-\n`,
      },
    },
  },
  enums: {
    nodeType: {
      file: "Archivo",
      dir: "Carpeta",
    },
    viewType: {
      list: "Lista",
      kanban: "Kanban",
      calendar: "Calendario",
      grid: "Cuadrícula",
      wiki: "Wiki",
    },
    syncPolicy: {
      sync: "Sincronizar",
      local: "Solo local",
    },
    creditFeature: {
      write: "Escribir",
      edit: "Editar",
      search: "Buscar",
      embedding: "Embedding",
    },
  },
  mounts: {
    memory: "Memoria",
    document: "Documento",
    thread: "Conversación",
    skill: "Habilidad",
    task: "Tarea",
    upload: "Carga",
    search: "Buscar",
    favorite: "Favorito",
    gen: "Contenido generado",
    ssh: "Conexión SSH",
  },
  button: {
    label: "Cortex",
    title: "Cortex, memoria de la IA",
    unavailableTitle: "Cortex no disponible",
    unavailableDescription:
      "Cortex está disponible en conversaciones privadas y compartidas. Abre una conversación privada para usar la memoria de la IA.",
  },
  nav: {
    back: "Volver",
    actions: {
      list: "Explorar",
      read: "Ver",
      write: "Escribir",
      edit: "Editar",
      delete: "Eliminar",
      move: "Mover",
      search: "Buscar",
      tree: "Árbol",
    },
  },
};
