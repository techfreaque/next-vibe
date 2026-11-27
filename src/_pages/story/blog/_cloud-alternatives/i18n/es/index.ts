import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  rules: {
    checked:
      "Leído en la documentación y las políticas oficiales de cada proveedor el {{date}}. En el móvil, desplázate hacia los lados.",
    columns: {
      name: "Servicio",
      defaults: "Filtro por defecto",
      off: "Desactivarlo",
      models: "Modelos sin censura",
      weights: "Tus propios pesos",
      rules: "Reglas de contenido que se mantienen",
    },
    rows: {
      azure: {
        defaults: "Activo en todos los modelos salvo Whisper.",
        off: "Solo con aprobación. Los clientes pueden relajarlo hasta High only. El control total exige una solicitud, abierta solo a clientes gestionados por un equipo de cuenta de Microsoft o de un programa elegible.",
        models: "No encontramos ninguno en el catálogo.",
        weights: "No comprobado para esta guía.",
        rules:
          "El Code of Conduct prohíbe el contenido sexualmente explícito y los chatbots eróticos o románticos, con los filtros activados o no.",
      },
      bedrock: {
        defaults:
          "Sin filtro de Bedrock salvo que adjuntes un Guardrail. La detección de CSAM siempre está activa.",
        off: "Omite el ID del guardrail. Los rechazos propios del modelo se mantienen.",
        models: "Ninguno en el catálogo.",
        weights:
          "Custom Model Import: arquitecturas Llama, Mistral, Qwen y gpt-oss, facturado por minuto y Custom Model Unit.",
        rules:
          "La Responsible AI Policy prohíbe eludir los filtros de seguridad y las imágenes sexuales no consentidas.",
      },
      vertex: {
        defaults:
          "Desactivado por defecto en gemini-3.5-flash y posteriores. Los daños principales siguen bloqueados.",
        off: "Pon los umbrales en OFF. Los rechazos entrenados de Gemini se mantienen.",
        models: "Ninguno en la lista de modelos abiertos.",
        weights:
          "Autodespliegue desde Model Garden en contenedores vLLM o TGI.",
        rules:
          "La Prohibited Use Policy prohíbe el contenido sexualmente explícito y eludir los filtros de seguridad.",
      },
      together: {
        defaults:
          "No hay ningún interruptor de filtro documentado en las páginas que leímos.",
        off: "No aplica.",
        models: "Ninguno en la lista serverless.",
        weights:
          "Endpoints dedicados desde $5.49 por hora de H100. Lo que subas debe ser un fine-tune de una arquitectura compatible.",
        rules: "Los términos prohíben el contenido obsceno y la pornografía.",
      },
      us: {
        defaults:
          "Tú eliges el modelo: convencional, abierto o sin censura. Sin capa de filtro encima.",
        off: "Elige un modelo sin censura y confirma una vez que tienes 18 años o más.",
        models: "{{uncensored}} activos ahora mismo.",
        weights: "No compatible. Servimos un catálogo seleccionado.",
        rules:
          "Los modelos sin censura se desbloquean tras un consentimiento 18+ único. Los términos del proveedor del modelo siguen vigentes.",
      },
    },
    sourceLabels: {
      filters: "{{name}}: docs de filtros",
      access: "{{name}}: reglas de acceso",
      policy: "{{name}}: política de uso",
      privacy: "{{name}}: tratamiento de datos",
      pricing: "{{name}}: precios",
      import: "{{name}}: pesos propios",
    },
    sourcesTitle: "Fuentes",
  },
  prices: {
    columns: {
      model: "Modelo",
      provider: "Proveedor",
      input: "Entrada / 1M",
      output: "Salida / 1M",
    },
    us: "{{appName}}",
    live: "precio en vivo",
    source: "fuente",
    note: "USD por 1M de tokens. Precios de la competencia leídos el {{date}} en sus listas públicas de modelos. El nuestro se lee en vivo de nuestro registro, con nuestro margen del {{markup}}% incluido. Donde hay configurada una ruta más barata, la usamos y el precio mostrado la sigue.",
  },
  alts: {
    heading: "{{number}}. {{name}}",
    strength: "Lo mejor:",
    catch: "La pega:",
    sources: "Fuentes:",
    versusLink: "{{appName}} vs {{name}}: comparación completa",
    openRouter: {
      what: "Pasarela con 477 modelos detrás de una sola clave. Sin margen sobre la inferencia, comisión del 5.5% al comprar créditos (5% con cripto).",
      strength:
        "Trae tus propias claves de proveedor, gratis hasta $25,000 al mes, enrutamiento zero data retention por petición, pagos en USDC.",
      catch:
        "17 modelos de roleplay o ajustados sin censura, ningún id con abliterated o uncensored en el nombre. Ningún endpoint Anthropic Messages en el resumen de su API.",
    },
    venice: {
      what: "App de chat más una API compatible con OpenAI. Fine-tunes propios Venice Uncensored 1.2 ($0.20 / $0.90) y Venice Role Play Uncensored, junto a modelos GLM, DeepSeek, Gemma y Qwen abliterados.",
      strength:
        "Imagen, vídeo, voz y música en la misma API. Opciones de modelos cifrados y en TEE. Pago por petición desde un monedero USDC con x402, sin cuenta.",
      catch:
        "Sin endpoint Anthropic Messages nativo, Claude Code necesita un proxy local. Los términos prohíben revender el acceso. El plan gratuito: 10 prompts de texto al día.",
    },
    nanoGpt: {
      what: "Pasarela de pago por uso con 610 modelos, unos 54 de ellos ids abliterated o sin censura.",
      strength:
        "Chat completions de OpenAI, Responses y Anthropic Messages. Bitcoin y Monero, sin cuenta, reventa de pago por uso permitida.",
      catch:
        "Un catálogo ruidoso, con muchos ids sin censura casi duplicados. El producto está pensado primero como pasarela.",
    },
    openUncensored: {
      what: "Router de API para pesos abliterados: 58 modelos de texto, 20 de imagen y 3 de vídeo con una clave de prepago. Tu clave es tu cuenta.",
      strength:
        "Sin comisión sobre los precios de los proveedores. GLM 5.3 Flash Uncensored desde $0.12 / $0.50. Formatos OpenAI, Responses y Anthropic en una sola base URL.",
      catch:
        "Sin plan gratuito, no menciona cripto, conserva metadatos de las peticiones hasta dos años. Sin chat web, solo una app de escritorio.",
    },
    refuseless: {
      what: "Host solo de API de pesos abiertos sin rechazos: cuatro modelos abliterados con 1M de contexto, más algunos estándar.",
      strength:
        "DeepSeek V4.1 Flash abliterated a $0.12 / $0.45 y GLM 5.3 Flash abliterated a $0.12 / $0.50. Chat completions, Responses, Anthropic Messages y embeddings.",
      catch:
        "Sin interfaz de chat. Sus páginas de privacidad y términos bloquearon nuestro lector, así que léelas tú antes de lanzar.",
    },
    abliterationHosts: {
      what: "Dos APIs abliterated más. NEAR AI Cloud ejecuta los modelos en enclaves de hardware: Qwen 3.8 27B Abliterated a $0.04 / $1.35. abliteration.ai vende marcas abliterados propias desde $1 / $2.",
      strength:
        "NEAR: sin solicitud, sin verificación de identidad, atestación verificable. abliteration.ai: prompts procesados en memoria y no almacenados por defecto, región UE, formatos OpenAI y Anthropic.",
      catch:
        "Catálogos pequeños. NEAR no menciona ningún formato Anthropic. abliteration.ai cuesta más que Refuseless o NEAR por pesos parecidos.",
    },
    togetherFireworks: {
      what: "Nubes de inferencia rápidas para modelos abiertos estándar. Together sirve 24 modelos de chat serverless, ninguno sin censura. Fireworks lista modelos Dolphin, Hermes y Dobby Unhinged, con el estado serverless sin confirmar.",
      strength:
        "Together: OpenAI, Responses y Anthropic Messages, zero data retention en autoservicio. Fireworks: sin registro de prompts por defecto en modelos abiertos, hasta 6,000 peticiones por minuto.",
      catch:
        "Los términos de Together prohíben el contenido obsceno y la pornografía. Fireworks te obliga a garantizar que tu entrada no contiene desnudos ni contenido sexualmente sugerente.",
    },
    selfHost: {
      what: "Ejecuta tú mismo pesos abliterados. Ollama y LM Studio en una estación de trabajo, vLLM o TGI en tus propias GPU. Todos hablan el formato OpenAI chat completions.",
      strength:
        "Tus prompts nunca salen de tus máquinas. Cualquier modelo abliterado en GGUF o safetensors que puedas descargar. El uso local no cuesta nada más allá del hardware.",
      catch:
        "Tú te encargas de las GPU, las actualizaciones y la disponibilidad. Los modelos de tamaño frontier necesitan hardware de centro de datos.",
    },
  },
};
