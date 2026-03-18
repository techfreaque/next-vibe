/**
 * Generate All Repository
 * Orchestrates all generator operations in parallel
 */

/* eslint-disable i18next/no-literal-string */
// CLI output messages don't need internationalization

import "server-only";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  createEndpointLogger,
  type EndpointLogger,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

import type { DirtyFlags, LiveIndex } from "../shared/live-index";
import type endpoints from "./definition";
import { scopedTranslation } from "./i18n";

type RequestType = typeof endpoints.POST.types.RequestOutput;
type GenerateAllResponseType = typeof endpoints.POST.types.ResponseOutput;

/**
 * Generate All Repository Interface
 */
interface GenerateAllRepository {
  generateAll(
    data: RequestType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<BaseResponseType<GenerateAllResponseType>>;
}

/**
 * Generate All Repository Implementation
 */
class GenerateAllRepositoryImpl implements GenerateAllRepository {
  async generateAll(
    data: RequestType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<BaseResponseType<GenerateAllResponseType>> {
    const outputLines: string[] = [];
    let generatorsRun = 0;
    let generatorsSkipped = 0;
    let functionalGeneratorsCompleted = false;

    try {
      // Run all generators in parallel
      const generatorPromises = [];

      // 1. Endpoints Meta Generator - Generate per-locale metadata for tools modal
      if (!data.skipEndpoints) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              const { endpointsMetaGeneratorRepository } =
                await import("../endpoints-meta/repository");

              const { scopedTranslation: endpointsMetaI18n } =
                await import("../endpoints-meta/i18n");
              const { t: subT } = endpointsMetaI18n.scopedT(locale);
              const result =
                await endpointsMetaGeneratorRepository.generateEndpointsMeta(
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
                return "endpoints-meta";
              }
              outputLines.push(
                `❌ Endpoints meta generation failed: ${result.message || "Unknown error"}`,
              );
              return null;
            } catch (error) {
              outputLines.push(
                `❌ Endpoints meta generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      }

      // 1b. Endpoint Generator - Generate endpoint.ts with dynamic imports
      if (!data.skipEndpoints) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              const { endpointGeneratorRepository } =
                await import("../endpoint/repository");

              const { scopedTranslation: endpointI18n } =
                await import("../endpoint/i18n");
              const { t: subT } = endpointI18n.scopedT(locale);
              const result = await endpointGeneratorRepository.generateEndpoint(
                {
                  outputFile:
                    "src/app/api/[locale]/system/generated/endpoint.ts",
                  dryRun: false,
                },
                logger,
                subT,
              );

              if (result.success) {
                generatorsRun++;
                return "endpoint";
              }
              outputLines.push(
                `❌ Endpoint generation failed: ${result.message || "Unknown error"}`,
              );
              return null;
            } catch (error) {
              outputLines.push(
                `❌ Endpoint generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      }

      // 1b. Route Handlers Generator - Generate route-handlers.ts with dynamic imports
      if (!data.skipEndpoints) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              const { routeHandlersGeneratorRepository } =
                await import("../route-handlers/repository");

              const { scopedTranslation: routeHandlersI18n } =
                await import("../route-handlers/i18n");
              const { t: subT } = routeHandlersI18n.scopedT(locale);
              const result =
                await routeHandlersGeneratorRepository.generateRouteHandlers(
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
                return "route-handlers";
              }
              outputLines.push(
                `❌ Route handlers generation failed: ${result.message || "Unknown error"}`,
              );
              return null;
            } catch (error) {
              outputLines.push(
                `❌ Route handlers generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      }

      // 1c. Client Route Handlers Generator - Generate route-handlers-client.ts with dynamic imports
      if (!data.skipEndpoints) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
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
                return "client-route-handlers";
              }
              outputLines.push(
                `❌ Client route handlers generation failed: ${result.message || "Unknown error"}`,
              );
              return null;
            } catch (error) {
              outputLines.push(
                `❌ Client route handlers generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      }

      // 2. Seeds Generator - Generate seed index
      if (!data.skipSeeds) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              const { seedsGeneratorRepository } =
                await import("../seeds/repository");

              const { scopedTranslation: seedsI18n } =
                await import("../seeds/i18n");
              const { t: subT } = seedsI18n.scopedT(locale);
              const result = await seedsGeneratorRepository.generateSeeds(
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
              const { taskIndexGeneratorRepository } =
                await import("../task-index/repository");

              const { scopedTranslation: taskIndexI18n } =
                await import("../task-index/i18n");
              const { t: subT } = taskIndexI18n.scopedT(locale);
              const result =
                await taskIndexGeneratorRepository.generateTaskIndex(
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
            const { skillsIndexGeneratorRepository } =
              await import("../skills-index/repository");

            const { scopedTranslation: skillsIndexI18n } =
              await import("../skills-index/i18n");
            const { t: subT } = skillsIndexI18n.scopedT(locale);
            const result =
              await skillsIndexGeneratorRepository.generateSkillsIndex(
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
            const { promptFragmentsGeneratorRepository } =
              await import("../prompt-fragments/repository");

            const { scopedTranslation: promptFragmentsI18n } =
              await import("../prompt-fragments/i18n");
            const { t: subT } = promptFragmentsI18n.scopedT(locale);
            const result =
              await promptFragmentsGeneratorRepository.generatePromptFragments(
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
              const { generateTrpcRouterRepository } =
                await import("../generate-trpc-router/repository");

              const result =
                await generateTrpcRouterRepository.generateTrpcRouter(
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
            const { emailTemplateGeneratorRepository } =
              await import("../email-templates/repository");

            const { scopedTranslation: emailTemplatesI18n } =
              await import("../email-templates/i18n");
            const { t: subT } = emailTemplatesI18n.scopedT(locale);
            const result =
              await emailTemplateGeneratorRepository.generateEmailTemplates(
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
              const { remoteCapabilitiesGeneratorRepository } =
                await import("../remote-capabilities/repository");
              const { scopedTranslation: remoteCapI18n } =
                await import("../remote-capabilities/i18n");
              const { t: subT } = remoteCapI18n.scopedT(locale);

              const result =
                await remoteCapabilitiesGeneratorRepository.generateRemoteCapabilities(
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
            const { envGeneratorRepository } =
              await import("../env/repository");

            const { scopedTranslation: envI18n } = await import("../env/i18n");
            const { t: subT } = envI18n.scopedT(locale);
            const result = await envGeneratorRepository.generateEnv(
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
            const { envKeysGeneratorRepository } =
              await import("../env-keys/repository");

            const { scopedTranslation: envKeysI18n } =
              await import("../env-keys/i18n");
            const { t: subT } = envKeysI18n.scopedT(locale);
            const result = await envKeysGeneratorRepository.generateEnvKeys(
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
              const { generateTanstackRoutesRepository } =
                await import("../../unified-interface/tanstack-start/generate/repository");

              const result =
                await generateTanstackRoutesRepository.generateInternal();

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

      // 9. Graph Seeds Index Generator
      generatorPromises.push(
        (async (): Promise<string | null> => {
          try {
            const { graphSeedsIndexGeneratorRepository } =
              await import("../graph-seeds-index/repository");

            const result =
              await graphSeedsIndexGeneratorRepository.generateGraphSeedsIndex(
                {
                  outputFile:
                    "src/app/api/[locale]/system/generated/graph-seeds-index.ts",
                  dryRun: false,
                },
                logger,
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

      // Wait for all generators to complete
      const results = await Promise.allSettled(generatorPromises);
      const completedGenerators: string[] = [];

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
          totalGenerators: 11,
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
  async generateDirty(
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
            const { endpointsMetaGeneratorRepository } =
              await import("../endpoints-meta/repository");
            const { scopedTranslation: i18n } =
              await import("../endpoints-meta/i18n");
            const { t } = i18n.scopedT(locale);
            await endpointsMetaGeneratorRepository.generateEndpointsMeta(
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
            const { endpointGeneratorRepository } =
              await import("../endpoint/repository");
            const { scopedTranslation: i18n } =
              await import("../endpoint/i18n");
            const { t } = i18n.scopedT(locale);
            await endpointGeneratorRepository.generateEndpoint(
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
            const { routeHandlersGeneratorRepository } =
              await import("../route-handlers/repository");
            const { scopedTranslation: i18n } =
              await import("../route-handlers/i18n");
            const { t } = i18n.scopedT(locale);
            await routeHandlersGeneratorRepository.generateRouteHandlers(
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
            const { remoteCapabilitiesGeneratorRepository } =
              await import("../remote-capabilities/repository");
            const { scopedTranslation: remoteCapI18n } =
              await import("../remote-capabilities/i18n");
            const { t } = remoteCapI18n.scopedT(locale);
            await remoteCapabilitiesGeneratorRepository.generateRemoteCapabilities(
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
            const { taskIndexGeneratorRepository } =
              await import("../task-index/repository");
            const { scopedTranslation: i18n } =
              await import("../task-index/i18n");
            const { t } = i18n.scopedT(locale);
            await taskIndexGeneratorRepository.generateTaskIndex(
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
            const { emailTemplateGeneratorRepository } =
              await import("../email-templates/repository");
            const { scopedTranslation: i18n } =
              await import("../email-templates/i18n");
            const { t } = i18n.scopedT(locale);
            await emailTemplateGeneratorRepository.generateEmailTemplates(
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
            const { graphSeedsIndexGeneratorRepository } =
              await import("../graph-seeds-index/repository");
            await graphSeedsIndexGeneratorRepository.generateGraphSeedsIndex(
              {
                outputFile:
                  "src/app/api/[locale]/system/generated/graph-seeds-index.ts",
                dryRun: false,
              },
              logger,
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
            const { skillsIndexGeneratorRepository } =
              await import("../skills-index/repository");
            const { scopedTranslation: i18n } =
              await import("../skills-index/i18n");
            const { t } = i18n.scopedT(locale);
            await skillsIndexGeneratorRepository.generateSkillsIndex(
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
            const { promptFragmentsGeneratorRepository } =
              await import("../prompt-fragments/repository");
            const { scopedTranslation: i18n } =
              await import("../prompt-fragments/i18n");
            const { t } = i18n.scopedT(locale);
            await promptFragmentsGeneratorRepository.generatePromptFragments(
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
            const { seedsGeneratorRepository } =
              await import("../seeds/repository");
            const { scopedTranslation: i18n } = await import("../seeds/i18n");
            const { t } = i18n.scopedT(locale);
            await seedsGeneratorRepository.generateSeeds(
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

export const generateAllRepository = new GenerateAllRepositoryImpl();

if (import.meta.main) {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  void generateAllRepository
    .generateAll(
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
