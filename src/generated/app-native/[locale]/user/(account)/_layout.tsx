import { createLayoutWrapperWithImport } from "@/app/api/[locale]/system/platforms/react-native/nextjs-compat-wrapper";
export default createLayoutWrapperWithImport(
  () => import("@/app/[locale]/user\(account)/layout"),
);
