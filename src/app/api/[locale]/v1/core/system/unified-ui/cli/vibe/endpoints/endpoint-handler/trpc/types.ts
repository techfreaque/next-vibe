import type { TRPCContext } from "./trpc-context";

export type TrpcHandlerReturnType<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
> = (
  input: TRequestOutput & { urlVariables?: TUrlVariablesOutput },
  ctx: TRPCContext<Record<string, string>, readonly string[]>,
) => Promise<TResponseOutput>;
