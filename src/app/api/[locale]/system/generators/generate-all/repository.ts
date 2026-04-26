/**
 * Generate All Repository
 * Orchestrates all generator operations in parallel
 */

// CLI output messages don't need internationalization

import "server-only";

import {
  type ResponseType as BaseResponseType,
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

import type { DirtyFlags, LiveIndex } from "../shared/live-index";
import type {
  GenerateAllRequestOutput,
  GenerateAllResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Generate All Repository Implementation
 */
export class GenerateAllRepository {
  static async generateAll(
    data: GenerateAllRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<BaseResponseType<GenerateAllResponseOutput>> {
    const outputLines: string[] = [];
    let generatorsRun = 0;
    let generatorsSkipped = 0;
    let functionalGeneratorsCompleted = false;

    try {
      // Definition-scanning generators (endpoints-meta, endpoint, route-handlers,
      // client-routes-index) must run SEQUENTIALLY to avoid Bun TDZ race conditions.
      // When multiple generators scan definition files in parallel, they can all try
      // to initialize the same ESM module simultaneously, causing "Cannot access
      // 'default' before initialization" errors. Running them sequentially ensures
      // each module is fully initialized in Bun's cache before the next scan starts.
      const defScanResults: (string | null)[] = [];

      // 1. Endpoints Meta Generator - Generate per-locale metadata for tools modal
      if (!data.skipEndpoints) {
        try {
          const { EndpointsMetaGeneratorRepository } =
            await import("../endpoints-meta/repository");

          const { scopedTranslation: endpointsMetaI18n } =
            await import("../endpoints-meta/i18n");
          const { t: subT } = endpointsMetaI18n.scopedT(locale);
          const result =
            await EndpointsMetaGeneratorRepository.generateEndpointsMeta(
              {
                outputDir:
                  "src/app/api/[locale]/system/generated/endpoints-meta",
                dryRun: false,
              },
              logger,
              subT,
            );

          if (result.success) {
            generatorsRun++;
            defScanResults.push("endpoints-meta");
          } else {
            outputLines.push(
              `❌ Endpoints meta generation failed: ${result.message || "Unknown error"}`,
            );
            defScanResults.push(null);
          }
        } catch (error) {
          outputLines.push(
            `❌ Endpoints meta generator failed: ${parseError(error).message}`,
          );
          defScanResults.push(null);
        }
      }

      // 1b. Endpoint Generator - Generate endpoint.ts with dynamic imports
      if (!data.skipEndpoints) {
        try {
          const { EndpointGeneratorRepository } =
            await import("../endpoint/repository");

          const { scopedTranslation: endpointI18n } =
            await import("../endpoint/i18n");
          const { t: subT } = endpointI18n.scopedT(locale);
          const result = await EndpointGeneratorRepository.generateEndpoint(
            {
              outputFile: "src/app/api/[locale]/system/generated/endpoint.ts",
              dryRun: false,
            },
            logger,
            subT,
          );

          if (result.success) {
            generatorsRun++;
            defScanResults.push("endpoint");
          } else {
            outputLines.push(
              `❌ Endpoint generation failed: ${result.message || "Unknown error"}`,
            );
            defScanResults.push(null);
          }
        } catch (error) {
          outputLines.push(
            `❌ Endpoint generator failed: ${parseError(error).message}`,
          );
          defScanResults.push(null);
        }
      }

      // 1b. Route Handlers Generator - Generate route-handlers.ts with dynamic imports
      if (!data.skipEndpoints) {
        try {
          const { RouteHandlersGeneratorRepository } =
            await import("../route-handlers/repository");

          const { scopedTranslation: routeHandlersI18n } =
            await import("../route-handlers/i18n");
          const { t: subT } = routeHandlersI18n.scopedT(locale);
          const result =
            await RouteHandlersGeneratorRepository.generateRouteHandlers(
              {
                outputFile:
                  "src/app/api/[locale]/system/generated/route-handlers.ts",
                dryRun: false,
              },
              logger,
              subT,
            );

          if (result.success) {
            generatorsRun++;
            defScanResults.push("route-handlers");
          } else {
            outputLines.push(
              `❌ Route handlers generation failed: ${result.message || "Unknown error"}`,
            );
            defScanResults.push(null);
          }
        } catch (error) {
          outputLines.push(
            `❌ Route handlers generator failed: ${parseError(error).message}`,
          );
          defScanResults.push(null);
        }
      }

      // 1c. Client Route Handlers Generator - Generate route-handlers-client.ts with dynamic imports
      if (!data.skipEndpoints) {
        try {
          const { ClientRoutesIndexGeneratorRepository } =
            await import("../client-routes-index/repository");

          const { scopedTranslation: clientRoutesI18n } =
            await import("../client-routes-index/i18n");
          const { t: subT } = clientRoutesI18n.scopedT(locale);
          const result =
            await ClientRoutesIndexGeneratorRepository.generateClientRoutesIndex(
              {
                outputFile:
                  "src/app/api/[locale]/system/generated/route-handlers-client.ts",
                dryRun: false,
              },
              logger,
              subT,
            );

          if (result.success) {
            generatorsRun++;
            defScanResults.push("client-route-handlers");
          } else {
            outputLines.push(
              `❌ Client route handlers generation failed: ${result.message || "Unknown error"}`,
            );
            defScanResults.push(null);
          }
        } catch (error) {
          outputLines.push(
            `❌ Client route handlers generator failed: ${parseError(error).message}`,
          );
          defScanResults.push(null);
        }
      }

      // Remaining generators run in parallel (they don't scan definition files,
      // or if they do, all definitions are now cached from the sequential phase above).
      const generatorPromises = [];

      // 2. Seeds Generator - Generate seed index
      if (!data.skipSeeds) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              const { SeedsGeneratorRepository } =
                await import("../seeds/repository");

              const { scopedTranslation: seedsI18n } =
                await import("../seeds/i18n");
              const { t: subT } = seedsI18n.scopedT(locale);
              const result = await SeedsGeneratorRepository.generateSeeds(
                {
                  outputDir: "src/app/api/[locale]/system/generated",
                  includeTestData: true,
                  includeProdData: true,
                  dryRun: false,
                },
                logger,
                subT,
              );

              if (result.success) {
                generatorsRun++;
                return "seeds";
              }
              outputLines.push(
                `❌ Seeds generator failed: ${result.message || "Unknown error"}`,
              );
              return null;
            } catch (error) {
              outputLines.push(
                `❌ Seeds generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      } else {
        generatorsSkipped++;
      }

      // 3. Task Index Generator - Enhanced with better error handling
      if (!data.skipTaskIndex) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              const { TaskIndexGeneratorRepository } =
                await import("../task-index/repository");

              const { scopedTranslation: taskIndexI18n } =
                await import("../task-index/i18n");
              const { t: subT } = taskIndexI18n.scopedT(locale);
              const result =
                await TaskIndexGeneratorRepository.generateTaskIndex(
                  {
                    outputFile:
                      "src/app/api/[locale]/system/generated/tasks-index.ts",
                    dryRun: false,
                  },
                  logger,
                  subT,
                );

              if (result.success) {
                generatorsRun++;
                return "task-index";
              }
              outputLines.push(
                `❌ Task index generation failed: ${result.message || "Unknown error"}`,
              );
              return null;
            } catch (error) {
              outputLines.push(
                `❌ Task index generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      } else {
        outputLines.push("⏭️  Task index generation skipped");
        generatorsSkipped++;
      }

      // 3b. Skills Index Generator
      generatorPromises.push(
        (async (): Promise<string | null> => {
          try {
            const { SkillsIndexGeneratorRepository } =
              await import("../skills-index/repository");

            const { scopedTranslation: skillsIndexI18n } =
              await import("../skills-index/i18n");
            const { t: subT } = skillsIndexI18n.scopedT(locale);
            const result =
              await SkillsIndexGeneratorRepository.generateSkillsIndex(
                {
                  outputFile:
                    "src/app/api/[locale]/system/generated/skills-index.ts",
                  dryRun: false,
                },
                logger,
                subT,
              );

            if (result.success) {
              generatorsRun++;
              return "skills-index";
            }
            outputLines.push(
              `❌ Skills index generation failed: ${result.message || "Unknown error"}`,
            );
            return null;
          } catch (error) {
            outputLines.push(
              `❌ Skills index generator failed: ${parseError(error).message}`,
            );
            return null;
          }
        })(),
      );

      // 3c. Prompt Fragments Generator
      generatorPromises.push(
        (async (): Promise<string | null> => {
          try {
            const { PromptFragmentsGeneratorRepository } =
              await import("../prompt-fragments/repository");

            const { scopedTranslation: promptFragmentsI18n } =
              await import("../prompt-fragments/i18n");
            const { t: subT } = promptFragmentsI18n.scopedT(locale);
            const result =
              await PromptFragmentsGeneratorRepository.generatePromptFragments(
                {
                  outputFile:
                    "src/app/api/[locale]/system/generated/prompt-fragments.ts",
                  dryRun: false,
                },
                logger,
                subT,
              );

            if (result.success) {
              generatorsRun++;
              return "prompt-fragments";
            }
            outputLines.push(
              `❌ Prompt fragments generation failed: ${result.message || "Unknown error"}`,
            );
            return null;
          } catch (error) {
            outputLines.push(
              `❌ Prompt fragments generator failed: ${parseError(error).message}`,
            );
            return null;
          }
        })(),
      );

      // 4. tRPC Router Generator
      if (data.enableTrpc) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              const { GenerateTrpcRouterRepository } =
                await import("../generate-trpc-router/repository");

              const result =
                await GenerateTrpcRouterRepository.generateTrpcRouter(
                  {
                    apiDir: "src/app/api",
                    outputFile:
                      "src/app/api/[locale]/system/unified-interface/trpc/[...trpc]/router.ts",
                    includeWarnings: false,
                    excludePatterns: [],
                  },
                  logger,
                  locale,
                );

              if (result.success && result.data) {
                generatorsRun++;
                return "trpc-router";
              }
              outputLines.push(
                `❌ tRPC router generation failed: ${result.errorType?.errorKey || "Unknown error"}`,
              );
              return null;
            } catch (error) {
              outputLines.push(
                `❌ tRPC router generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      } else {
        outputLines.push("⏭️  tRPC router generation skipped");
        generatorsSkipped++;
      }

      // 5. Email Templates Generator
      generatorPromises.push(
        (async (): Promise<string | null> => {
          try {
            const { EmailTemplateGeneratorRepository } =
              await import("../email-templates/repository");

            const { scopedTranslation: emailTemplatesI18n } =
              await import("../email-templates/i18n");
            const { t: subT } = emailTemplatesI18n.scopedT(locale);
            const result =
              await EmailTemplateGeneratorRepository.generateEmailTemplates(
                {
                  outputFile:
                    "src/app/api/[locale]/messenger/registry/generated.ts",
                  dryRun: false,
                },
                logger,
                subT,
              );

            if (result.success) {
              generatorsRun++;
              return "email-templates";
            }
            outputLines.push(
              `❌ Email templates generation failed: ${result.message || "Unknown error"}`,
            );
            return null;
          } catch (error) {
            outputLines.push(
              `❌ Email templates generator failed: ${parseError(error).message}`,
            );
            return null;
          }
        })(),
      );

      // 6. Remote Capabilities Generator
      if (!data.skipEndpoints) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              const { RemoteCapabilitiesGeneratorRepository } =
                await import("../remote-capabilities/repository");
              const { scopedTranslation: remoteCapI18n } =
                await import("../remote-capabilities/i18n");
              const { t: subT } = remoteCapI18n.scopedT(locale);

              const result =
                await RemoteCapabilitiesGeneratorRepository.generateRemoteCapabilities(
                  {
                    outputDir:
                      "src/app/api/[locale]/system/generated/remote-capabilities",
                    dryRun: false,
                  },
                  logger,
                  subT,
                );

              if (result.success) {
                generatorsRun++;
                return "remote-capabilities";
              }
              outputLines.push(
                `❌ Remote capabilities generation failed: ${result.message || "Unknown error"}`,
              );
              return null;
            } catch (error) {
              outputLines.push(
                `❌ Remote capabilities generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      }

      // 7. Env Generator
      generatorPromises.push(
        (async (): Promise<string | null> => {
          try {
            const { EnvGeneratorRepository } =
              await import("../env/repository");

            const { scopedTranslation: envI18n } = await import("../env/i18n");
            const { t: subT } = envI18n.scopedT(locale);
            const result = await EnvGeneratorRepository.generateEnv(
              {
                outputDir: "src/app/api/[locale]/system/generated",
                verbose: false,
                dryRun: false,
              },
              logger,
              subT,
            );

            if (result.success) {
              generatorsRun++;
              return "env";
            }
            outputLines.push(
              `❌ Env generation failed: ${result.message || "Unknown error"}`,
            );
            return null;
          } catch (error) {
            outputLines.push(
              `❌ Env generator failed: ${parseError(error).message}`,
            );
            return null;
          }
        })(),
      );

      // 7b. Env Keys Generator
      generatorPromises.push(
        (async (): Promise<string | null> => {
          try {
            const { EnvKeysGeneratorRepository } =
              await import("../env-keys/repository");

            const { scopedTranslation: envKeysI18n } =
              await import("../env-keys/i18n");
            const { t: subT } = envKeysI18n.scopedT(locale);
            const result = await EnvKeysGeneratorRepository.generateEnvKeys(
              {
                outputFile: "src/app/api/[locale]/system/generated/env-keys.ts",
                dryRun: false,
              },
              logger,
              subT,
            );

            if (result.success) {
              generatorsRun++;
              return "env-keys";
            }
            outputLines.push(
              `❌ Env keys generation failed: ${result.message || "Unknown error"}`,
            );
            return null;
          } catch (error) {
            outputLines.push(
              `❌ Env keys generator failed: ${parseError(error).message}`,
            );
            return null;
          }
        })(),
      );

      // 8b. TanStack Routes Generator
      if (!data.skipTanstack) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              const { GenerateTanstackRoutesRepository } = await import(
                /* turbopackIgnore: true */ /* webpackIgnore: true */ "../../unified-interface/tanstack-start/generate/repository"
              );

              const result =
                await GenerateTanstackRoutesRepository.generateInternal();

              if (result.success) {
                generatorsRun++;
                return "tanstack-routes";
              }
              outputLines.push(
                `❌ TanStack routes generation failed: ${result.message || "Unknown error"}`,
              );
              return null;
            } catch (error) {
              outputLines.push(
                `❌ TanStack routes generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      } else {
        outputLines.push("⏭️  TanStack routes generation skipped");
        generatorsSkipped++;
      }

      // 9. Agent Docs Generator (CLAUDE.md + AGENTS.md from vibe-coder skill)
      generatorPromises.push(
        (async (): Promise<string | null> => {
          try {
            const { AgentDocsGeneratorRepository } =
              await import("../agent-docs/repository");

            const result =
              await AgentDocsGeneratorRepository.generateAgentDocs(logger);

            if (result.success) {
              generatorsRun++;
              return "agent-docs";
            }
            outputLines.push(
              `❌ Agent docs generation failed: ${result.message || "Unknown error"}`,
            );
            return null;
          } catch (error) {
            outputLines.push(
              `❌ Agent docs generator failed: ${parseError(error).message}`,
            );
            return null;
          }
        })(),
      );

      // 10. Graph Seeds Index Generator
      generatorPromises.push(
        (async (): Promise<string | null> => {
          try {
            const { GraphSeedsIndexGeneratorRepository } =
              await import("../graph-seeds-index/repository");

            const result =
              await GraphSeedsIndexGeneratorRepository.generateGraphSeedsIndex(
                {
                  outputFile:
                    "src/app/api/[locale]/system/generated/graph-seeds-index.ts",
                  dryRun: false,
                },
                logger,
                locale,
              );

            if (result.success) {
              generatorsRun++;
              return "graph-seeds-index";
            }
            outputLines.push(
              `❌ Graph seeds index generation failed: ${result.message}`,
            );
            return null;
          } catch (error) {
            outputLines.push(
              `❌ Graph seeds index generator failed: ${parseError(error).message}`,
            );
            return null;
          }
        })(),
      );

      // 11. Skill Embeddings Generator (pre-compute embeddings for built-in skills)
      generatorPromises.push(
        (async (): Promise<string | null> => {
          try {
            const { SkillEmbeddingsGeneratorRepository } =
              await import("../skill-embeddings/repository");

            const result =
              await SkillEmbeddingsGeneratorRepository.generateSkillEmbeddings(
                logger,
              );

            if (result.success) {
              generatorsRun++;
              return "skill-embeddings";
            }
            outputLines.push(
              `❌ Skill embeddings generation failed: ${result.message || "Unknown error"}`,
            );
            return null;
          } catch (error) {
            outputLines.push(
              `❌ Skill embeddings generator failed: ${parseError(error).message}`,
            );
            return null;
          }
        })(),
      );

      // 12. Cortex Seeds Embeddings Generator (pre-compute embeddings for all cortex seeds)
      generatorPromises.push(
        (async (): Promise<string | null> => {
          try {
            const { CortexTemplatesEmbeddingsGeneratorRepository } =
              await import("../cortex-templates/repository");

            const result =
              await CortexTemplatesEmbeddingsGeneratorRepository.generateCortexTemplateEmbeddings(
                logger,
              );

            if (result.success) {
              generatorsRun++;
              return "cortex-seeds";
            }
            outputLines.push(
              `❌ Cortex seeds embeddings generation failed: ${result.message || "Unknown error"}`,
            );
            return null;
          } catch (error) {
            outputLines.push(
              `❌ Cortex seeds embeddings generator failed: ${parseError(error).message}`,
            );
            return null;
          }
        })(),
      );

      // Wait for parallel generators to complete
      const results = await Promise.allSettled(generatorPromises);
      const completedGenerators: string[] = defScanResults.filter(
        (r): r is string => r !== null,
      );

      for (const result of results) {
        if (result.status === "fulfilled" && result.value !== null) {
          completedGenerators.push(result.value);
        }
      }

      functionalGeneratorsCompleted = completedGenerators.length > 0;

      return success({
        success: true,
        generationCompleted: true,
        output: outputLines.join("\n"),
        generationStats: {
          totalGenerators: 13,
          generatorsRun,
          generatorsSkipped,
          outputDirectory:
            data.outputDir || "src/app/api/[locale]/system/generated",
          functionalGeneratorsCompleted,
        },
      });
    } catch (error) {
      // Generation failed
      const errorMessage = parseError(error);
      outputLines.push(`❌ Generation failed: ${errorMessage}`);
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage.message },
      });
    }
  }

  /**
   * Run only the generators whose dirty flags are set, using the live index.
   * Used by the dev watcher for surgical, efficient regeneration.
   */
  static async generateDirty(
    dirty: DirtyFlags,
    liveIndex: LiveIndex,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    const generatorPromises: Promise<void>[] = [];
    const ran: string[] = [];
    const skipped: string[] = [];

    // Endpoint generators (endpoints-meta, endpoint, route-handlers, client-routes)
    if (dirty.endpoints) {
      generatorPromises.push(
        (async (): Promise<void> => {
          try {
            const { EndpointsMetaGeneratorRepository } =
              await import("../endpoints-meta/repository");
            const { scopedTranslation: i18n } =
              await import("../endpoints-meta/i18n");
            const { t } = i18n.scopedT(locale);
            await EndpointsMetaGeneratorRepository.generateEndpointsMeta(
              {
                outputDir:
                  "src/app/api/[locale]/system/generated/endpoints-meta",
                dryRun: false,
              },
              logger,
              t,
              liveIndex,
            );
            ran.push("endpoints-meta");
          } catch (error) {
            logger.error(
              "endpoints-meta failed",
              new Error(parseError(error).message),
            );
          }
        })(),
        (async (): Promise<void> => {
          try {
            const { EndpointGeneratorRepository } =
              await import("../endpoint/repository");
            const { scopedTranslation: i18n } =
              await import("../endpoint/i18n");
            const { t } = i18n.scopedT(locale);
            await EndpointGeneratorRepository.generateEndpoint(
              {
                outputFile: "src/app/api/[locale]/system/generated/endpoint.ts",
                dryRun: false,
              },
              logger,
              t,
              liveIndex,
            );
            ran.push("endpoint");
          } catch (error) {
            logger.error(
              "endpoint failed",
              new Error(parseError(error).message),
            );
          }
        })(),
        (async (): Promise<void> => {
          try {
            const { RouteHandlersGeneratorRepository } =
              await import("../route-handlers/repository");
            const { scopedTranslation: i18n } =
              await import("../route-handlers/i18n");
            const { t } = i18n.scopedT(locale);
            await RouteHandlersGeneratorRepository.generateRouteHandlers(
              {
                outputFile:
                  "src/app/api/[locale]/system/generated/route-handlers.ts",
                dryRun: false,
              },
              logger,
              t,
              liveIndex,
            );
            ran.push("route-handlers");
          } catch (error) {
            logger.error(
              "route-handlers failed",
              new Error(parseError(error).message),
            );
          }
        })(),
        (async (): Promise<void> => {
          try {
            const { RemoteCapabilitiesGeneratorRepository } =
              await import("../remote-capabilities/repository");
            const { scopedTranslation: remoteCapI18n } =
              await import("../remote-capabilities/i18n");
            const { t } = remoteCapI18n.scopedT(locale);
            await RemoteCapabilitiesGeneratorRepository.generateRemoteCapabilities(
              {
                outputDir:
                  "src/app/api/[locale]/system/generated/remote-capabilities",
                dryRun: false,
              },
              logger,
              t,
            );
            ran.push("remote-capabilities");
          } catch (error) {
            logger.error(
              "remote-capabilities failed",
              new Error(parseError(error).message),
            );
          }
        })(),
      );
    } else {
      skipped.push(
        "endpoints-index",
        "endpoint",
        "route-handlers",
        "remote-capabilities",
      );
    }

    if (dirty.clientRoutes) {
      generatorPromises.push(
        (async (): Promise<void> => {
          try {
            const { ClientRoutesIndexGeneratorRepository } =
              await import("../client-routes-index/repository");
            const { scopedTranslation: i18n } =
              await import("../client-routes-index/i18n");
            const { t } = i18n.scopedT(locale);
            await ClientRoutesIndexGeneratorRepository.generateClientRoutesIndex(
              {
                outputFile:
                  "src/app/api/[locale]/system/generated/route-handlers-client.ts",
                dryRun: false,
              },
              logger,
              t,
              liveIndex,
            );
            ran.push("client-routes");
          } catch (error) {
            logger.error(
              "client-routes failed",
              new Error(parseError(error).message),
            );
          }
        })(),
      );
    } else {
      skipped.push("client-routes");
    }

    if (dirty.taskIndex) {
      generatorPromises.push(
        (async (): Promise<void> => {
          try {
            const { TaskIndexGeneratorRepository } =
              await import("../task-index/repository");
            const { scopedTranslation: i18n } =
              await import("../task-index/i18n");
            const { t } = i18n.scopedT(locale);
            await TaskIndexGeneratorRepository.generateTaskIndex(
              {
                outputFile:
                  "src/app/api/[locale]/system/generated/tasks-index.ts",
                dryRun: false,
              },
              logger,
              t,
              liveIndex,
            );
            ran.push("task-index");
          } catch (error) {
            logger.error(
              "task-index failed",
              new Error(parseError(error).message),
            );
          }
        })(),
      );
    } else {
      skipped.push("task-index");
    }

    if (dirty.emailTemplates) {
      generatorPromises.push(
        (async (): Promise<void> => {
          try {
            const { EmailTemplateGeneratorRepository } =
              await import("../email-templates/repository");
            const { scopedTranslation: i18n } =
              await import("../email-templates/i18n");
            const { t } = i18n.scopedT(locale);
            await EmailTemplateGeneratorRepository.generateEmailTemplates(
              {
                outputFile:
                  "src/app/api/[locale]/messenger/registry/generated.ts",
                dryRun: false,
              },
              logger,
              t,
              liveIndex,
            );
            ran.push("email-templates");
          } catch (error) {
            logger.error(
              "email-templates failed",
              new Error(parseError(error).message),
            );
          }
        })(),
      );
    } else {
      skipped.push("email-templates");
    }

    if (dirty.graphSeedsIndex) {
      generatorPromises.push(
        (async (): Promise<void> => {
          try {
            const { GraphSeedsIndexGeneratorRepository } =
              await import("../graph-seeds-index/repository");
            await GraphSeedsIndexGeneratorRepository.generateGraphSeedsIndex(
              {
                outputFile:
                  "src/app/api/[locale]/system/generated/graph-seeds-index.ts",
                dryRun: false,
              },
              logger,
              locale,
              liveIndex,
            );
            ran.push("graph-seeds-index");
          } catch (error) {
            logger.error(
              "graph-seeds-index failed",
              new Error(parseError(error).message),
            );
          }
        })(),
      );
    } else {
      skipped.push("graph-seeds-index");
    }

    if (dirty.skillsIndex) {
      generatorPromises.push(
        (async (): Promise<void> => {
          try {
            const { SkillsIndexGeneratorRepository } =
              await import("../skills-index/repository");
            const { scopedTranslation: i18n } =
              await import("../skills-index/i18n");
            const { t } = i18n.scopedT(locale);
            await SkillsIndexGeneratorRepository.generateSkillsIndex(
              {
                outputFile:
                  "src/app/api/[locale]/system/generated/skills-index.ts",
                dryRun: false,
              },
              logger,
              t,
              liveIndex,
            );
            ran.push("skills-index");
          } catch (error) {
            logger.error(
              "skills-index failed",
              new Error(parseError(error).message),
            );
          }
        })(),
      );
    } else {
      skipped.push("skills-index");
    }

    if (dirty.promptFragments) {
      generatorPromises.push(
        (async (): Promise<void> => {
          try {
            const { PromptFragmentsGeneratorRepository } =
              await import("../prompt-fragments/repository");
            const { scopedTranslation: i18n } =
              await import("../prompt-fragments/i18n");
            const { t } = i18n.scopedT(locale);
            await PromptFragmentsGeneratorRepository.generatePromptFragments(
              {
                outputFile:
                  "src/app/api/[locale]/system/generated/prompt-fragments.ts",
                dryRun: false,
              },
              logger,
              t,
              liveIndex,
            );
            ran.push("prompt-fragments");
          } catch (error) {
            logger.error(
              "prompt-fragments failed",
              new Error(parseError(error).message),
            );
          }
        })(),
      );
    } else {
      skipped.push("prompt-fragments");
    }

    // Seeds: only run when dirty.seeds AND explicitly not skipped
    // (seeds are expensive DB-related, only on startup)
    if (dirty.seeds) {
      generatorPromises.push(
        (async (): Promise<void> => {
          try {
            const { SeedsGeneratorRepository } =
              await import("../seeds/repository");
            const { scopedTranslation: i18n } = await import("../seeds/i18n");
            const { t } = i18n.scopedT(locale);
            await SeedsGeneratorRepository.generateSeeds(
              {
                outputDir: "src/app/api/[locale]/system/generated",
                includeTestData: true,
                includeProdData: true,
                dryRun: false,
              },
              logger,
              t,
              liveIndex,
            );
            ran.push("seeds");
          } catch (error) {
            logger.error("seeds failed", new Error(parseError(error).message));
          }
        })(),
      );
    } else {
      skipped.push("seeds");
    }

    await Promise.allSettled(generatorPromises);

    logger.debug(
      `✅ generateDirty: ran [${ran.join(", ")}], skipped [${skipped.join(", ")}]`,
    );
  }
}

if (import.meta.main) {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  void GenerateAllRepository.generateAll(
    {
      skipEndpoints: false,
      skipSeeds: false,
      skipTaskIndex: false,
      enableTrpc: false,
      skipTanstack: false,
      verbose: false,
      outputDir: "src/app/api/[locale]/system/generated",
    },
    logger,
    defaultLocale,
  )
    .then((result) => {
      if (!result.success) {
        // oxlint-disable-next-line no-console
        console.error(`❌ Generation failed: ${result.message}`);
        process.exitCode = 1;
      }
      return undefined;
    })
    .catch((error) => {
      logger.error("❌ Generation failed:", error);
    });
}
