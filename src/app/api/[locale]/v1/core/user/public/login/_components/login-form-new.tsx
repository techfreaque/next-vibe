"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { EndpointFormRenderer } from "@/app/api/[locale]/v1/core/system/unified-interface/react/widgets/EndpointFormRenderer";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useLogin } from "@/app/api/[locale]/v1/core/user/public/login/hooks";
import type { LoginOptions } from "@/app/api/[locale]/v1/core/user/public/login/repository";
import loginEndpoints from "@/app/api/[locale]/v1/core/user/public/login/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface LoginFormNewProps {
  locale: CountryLanguage;
  loginOptions?: LoginOptions;
}

/**
 * Data-Driven Login Form Component (Minimal JSX)
 *
 * This component demonstrates a fully automatic, data-driven approach.
 * The entire form is rendered from the endpoint definition with minimal JSX.
 *
 * Features:
 * - Automatic field discovery and rendering
 * - Type-safe with full TypeScript inference
 * - Single line of code to render all fields
 * - No manual field configuration
 * - Works with any endpoint
 */
export function LoginFormNew({
  locale,
  loginOptions: initialLoginOptions = {
    allowPasswordAuth: true,
    allowSocialAuth: false,
  },
}: LoginFormNewProps): JSX.Element {
  const { t } = simpleT(locale);
  const logger = createEndpointLogger(true, Date.now(), locale);

  // Use the enhanced login hook
  const loginResult = useLogin(initialLoginOptions, logger);
  const { form, onSubmit, isSubmitting } = loginResult.create || {};
  const { isAccountLocked, loginOptions, alert } = loginResult;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardContent className="mt-6">
          {alert && <FormAlert alert={alert} className="mb-6" />}

          {/*
            Automatic Form Renderer - Everything from Definition
            All fields are automatically discovered and rendered.
            No manual JSX needed for individual fields!
          */}
          <EndpointFormRenderer
            endpoint={loginEndpoints.POST}
            form={form}
            onSubmit={onSubmit}
            locale={locale}
            isSubmitting={
              isSubmitting || isAccountLocked || !loginOptions.allowPasswordAuth
            }
            submitButtonText="app.user.other.login.auth.login.signInButton"
          >
            {/* Additional content (optional) */}
            <Div className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t("app.user.other.login.login.dontHaveAccount")}{" "}
              <Link
                href={`/${locale}/user/signup`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t("app.user.other.login.auth.login.createAccount")}
              </Link>
            </Div>
          </EndpointFormRenderer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
