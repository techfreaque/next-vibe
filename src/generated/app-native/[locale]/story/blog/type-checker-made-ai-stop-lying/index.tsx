import { createPageWrapperWithImport } from "@/app/api/[locale]/system/platforms/react-native/nextjs-compat-wrapper";
export default createPageWrapperWithImport(
  () =>
    import("@/app/[locale]/story/blog/type-checker-made-ai-stop-lying/page"),
);
