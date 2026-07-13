import { createLayoutWrapperWithImport } from "next-vibe/platforms/react-native/nextjs-compat-wrapper";
export default createLayoutWrapperWithImport(
  () => import("@/app/[locale]/story/layout"),
);
