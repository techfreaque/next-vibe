/**
 * Re-export barrel for the TanStack Start Next.js-compat wrapper.
 *
 * Generated API route files (src/app-tanstack/routes/api.*.ts) import
 * `wrapNextApiRoute` from `../nextjs-compat-wrapper`, i.e. this path. The
 * implementation lives under the migrated system package
 * (system/platforms/tanstack-start/nextjs-compat-wrapper). This barrel keeps the
 * generated route imports resolvable without regenerating every route file.
 */
export {
  type NextApiModule,
  type NextApiRouteContext,
  type NextLayoutProps,
  type NextPageProps,
  runPageLoader,
  toNextParams,
  wrapNextApiRoute,
} from "next-vibe/platforms/tanstack-start/nextjs-compat-wrapper";
