"use client";

import type React from "react";

import { useTranslation } from "@/i18n/core/client";

export default function ErrorFallback(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">{t("app.common.error.title")}</h2>
      <p className="mb-6">{t("app.common.error.message")}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t("app.common.error.tryAgain")}
      </button>
    </div>
  );
}
