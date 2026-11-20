import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Infraestructura",
  type: "Infraestructura",

  enums: {
    infraStatus: {
      pending: "Pendiente",
      provisioning: "Provisioning",
      ready: "Listo",
      degraded: "Degradado",
      error: "Error",
    },
    componentStatus: {
      unknown: "Desconocida",
      healthy: "Salud",
      degraded: "Degradado",
      down: "Abajo",
    },
    scaleComponent: {
      web: "Web (Next.js)",
      tasks: "Task Runner",
      storage: "Almacenamiento (MinIO)",
    },
  },

  errors: {
    noControlPlane:
      "Sin conexión SSH etiquetada como plan de control. Etiquete un servidor en los ajustes SSH primero.",
    noClusterNodes:
      "No hay conexiones SSH etiquetadas como nodos de racimo. Etiquete al menos un servidor como plan de control.",
    kubeconfigMissing:
      "Kubeconfig no se encontró. Corre primero el inicio del clúster.",
    pulumiNotInstalled:
      "Pulumi CLI no está instalado. Instala con: curl -fsSL https://get.pulumi.com Silencio sh",
    sshExecFailed: "El comando SSH falló en el nodo",
    k3sInstallFailed: "k3s instalación fallido",
    scaleTargetNotFound: "Despliegue no encontrado en grupo",
    connectionNotFound: "Conexión SSH no encontrada",
    encryptionFailed: "Falló el desciframiento credencial",
    connectTimeout: "SSH conexión cronometrada fuera",
    sshAuthFailed: "La autenticación SSH falló",
    sshConnectionFailed: "La conexión SSH falló",
    fingerprintMismatch: "SSH host clave error de la huella dactilar",
  },

  cluster: {
    init: {
      post: {
        title: "Grupo inicializado",
        titleShort: "Init Cluster",
        description:
          "Suministro de k3s en servidores SSH etiquetados. Instala k3s, bases de datos, Redis, MinIO e ingress.",
        container: { title: "Cluster Init" },
        fields: {
          clusterName: {
            label: "Nombre del grupo",
            description:
              "Nombre para este clúster (utilizado en kubeconfig y etiquetas)",
            placeholder: "next-vibe-prod",
          },
          domain: {
            label: "Dominio",
            description:
              "Dominio base para el ingreso (por ejemplo example.com → app.example.com)",
            placeholder: "example.com",
          },
          email: {
            label: "Correo electrónico",
            description:
              "Correo electrónico de contacto para certificados Encrypt TLS",
            placeholder: "admin@example.com",
          },
          k3sVersion: {
            label: "k3s Version",
            description: "k3s versión para instalar",
            placeholder: "v1.31.0+k3s1",
          },
          dryRun: {
            label: "Simulación",
            description: "Previsualizar lo que se instalaría sin hacer cambios",
          },
          skipDatabase: {
            label: "Skip Database",
            description: "Saltar instalación CloudNativePG PostgreSQL",
          },
          skipRedis: {
            label: "Skip Redis",
            description: "Skip Redis Sentinel installation",
          },
          skipStorage: {
            label: "Guardar",
            description: "Instalación de almacenamiento distribuida Skip MinIO",
          },
          skipIngress: {
            label: "Skip Ingress",
            description: "Saltar nginx-ingress e instalación cert-manager",
          },
        },
        response: {
          success: { title: "Operación completada" },
          message: { title: "Mensaje" },
          nodesProvisioned: { title: "Nodos previstos" },
          componentsInstalled: { title: "Componentes instalados" },
          kubeconfig: { title: "Kubeconfig" },
          duration: { title: "Duración ms)" },
        },
        success: {
          title: "Listo para el equipo",
          description: "k3s cluster provisioned successfully",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Configuración inválida de racimo",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso de los administradores necesario",
          },
          server: {
            title: "Disposición fallida",
            description: "Fallo de la inicialización de los grupos",
          },
          notFound: {
            title: "Nodes Found",
            description: "Sin conexiones SSH etiquetadas como nodos de racimo",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "El grupo ya existe o se está suministrando",
          },
          network: {
            title: "Error de red",
            description: "No podía alcanzar los ganglios de racimo",
          },
        },
      },
    },
    status: {
      get: {
        title: "Estado del grupo de expertos",
        titleShort: "Estado del grupo de expertos",
        description:
          "Mostrar k8s salud del nodo, cuenta de cápsulas y estado del componente",
        container: { title: "Estado del grupo de expertos" },
        response: {
          nodes: { title: "Nodos" },
          components: { title: "Componentes" },
          overallStatus: { title: "Situación general" },
          podCounts: { title: "Cuentas de Pod" },
        },
        success: {
          title: "Estado recuperado",
          description: "Estado de la lista recuperado con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso de los administradores necesario",
          },
          server: {
            title: "Error del servidor",
            description: "Fallado para obtener el estado de los grupos",
          },
          notFound: {
            title: "No hay ningún desorden",
            description:
              "No hay cluster configurado. Corre primero el inicio del clúster.",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "No podía llegar a un grupo temático",
          },
        },
      },
    },
  },

  deploy: {
    push: {
      post: {
        title: "Despliegue",
        titleShort: "Despliegue",
        description:
          "Aplicar cambios de infraestructura a través de Pulumi (pulumi arriba)",
        container: { title: "Despliegue" },
        fields: {
          stack: {
            label: "Stack",
            description: "Nombre de pila de Pulumi",
            placeholder: "prod",
          },
          skipPreview: {
            label: "Skip Preview",
            description: "Aplicar cambios sin mostrar una vista previa primero",
          },
        },
        response: {
          success: { title: "Operación completada" },
          message: { title: "Mensaje" },
          changes: { title: "Cambios" },
          duration: { title: "Duración ms)" },
        },
        success: {
          title: "Despliegue",
          description: "Infraestructuras desplegadas con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Configuración de despliegue inválida",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso de los administradores necesario",
          },
          server: {
            title: "Despliegue Failed",
            description: "Pulumi falló",
          },
          notFound: {
            title: "No hay ningún desorden",
            description: "No hay cluster configurado",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Ya se está realizando un despliegue",
          },
          network: {
            title: "Error de red",
            description: "No podía llegar a un grupo temático",
          },
        },
      },
    },
    preview: {
      post: {
        title: "Deploy Preview",
        titleShort: "Vista previa",
        description:
          "Vista previa de los cambios de infraestructura sin aplicarlos (previsualización Pulumi)",
        container: { title: "Deploy Preview" },
        fields: {
          stack: {
            label: "Stack",
            description: "Nombre de pila de Pulumi",
            placeholder: "prod",
          },
        },
        response: {
          success: { title: "Operación completada" },
          message: { title: "Mensaje" },
          preview: { title: "Vista previa" },
          duration: { title: "Duración ms)" },
        },
        success: {
          title: "Avance listo",
          description: "Avance generado con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Configuración inválida",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso de los administradores necesario",
          },
          server: {
            title: "Vista previa Failed",
            description: "Previsualización de Pulumi falló",
          },
          notFound: {
            title: "No hay ningún desorden",
            description: "No hay cluster configurado",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "No podía llegar a un grupo temático",
          },
        },
      },
    },
  },

  scale: {
    replicas: {
      post: {
        title: "Escala",
        titleShort: "Escala",
        description: "Escalar un despliegue en el grupo",
        container: { title: "Despliegue de escala" },
        fields: {
          component: {
            label: "Componente",
            description: "Que despliegue a escala",
          },
          replicas: {
            label: "Replicaciones",
            description: "Replicación de objetivos (0 = pausa)",
            placeholder: "2",
          },
        },
        response: {
          success: { title: "Operación completada" },
          message: { title: "Mensaje" },
          previousReplicas: { title: "Replicaciones anteriores" },
          newReplicas: { title: "Nuevas réplicas" },
        },
        success: {
          title: "Escalada",
          description: "Desplazamiento escalado con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de escala inválida",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso de los administradores necesario",
          },
          server: {
            title: "Escale Failed",
            description: "Fallo en el despliegue de escala",
          },
          notFound: {
            title: "Despliegue no encontrado",
            description: "Despliegue no encontrado en grupo",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "No podía llegar a un grupo temático",
          },
        },
      },
    },
  },
};
