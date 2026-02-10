/**
 * Custom Widgets for Favorite Edit and View
 */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Span } from "next-vibe-ui/ui/span";
import { useState } from "react";

import { NO_CHARACTER_ID } from "@/app/api/[locale]/agent/chat/characters/config";
import { ModelSelector } from "@/app/api/[locale]/agent/models/components/model-selector";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type { ModelSelectionSimple } from "../../../models/components/types";
import { useCharacter } from "../../characters/[id]/hooks";
import type definitionPatch from "./definition";
import type { FavoriteUpdateResponseOutput } from "./definition";

/**
 * Props for PATCH custom widget
 */
interface PatchWidgetProps {
  field: {
    value: FavoriteUpdateResponseOutput | null | undefined;
  } & (typeof definitionPatch.PATCH)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for favorite editing
 */
export function FavoriteEditContainer({
  field,
}: PatchWidgetProps): React.JSX.Element {
  const children = field.children;
  const form = useWidgetForm();
  const t = useWidgetTranslation();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const router = useRouter();
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const characterId = form?.watch("characterId");
  const isNoCharacter = characterId === NO_CHARACTER_ID;
  const isPublic = user.isPublic;

  const favoriteModelSelection: ModelSelectionSimple | undefined =
    form?.watch("modelSelection");

  const characterEndpoint = useCharacter(characterId ?? "", user, logger);
  const characterData = characterEndpoint.read?.data;

  const handleCustomizeCharacter = async (): Promise<void> => {
    if (!characterId || isNoCharacter) {
      return;
    }

    // Check if user is logged in
    if (isPublic) {
      // Show signup prompt for public users
      setShowSignupPrompt(true);
    } else {
      // Navigate to character edit for authenticated users
      const characterDefinitions =
        await import("../../characters/[id]/definition");

      navigation.push(characterDefinitions.default.PATCH, {
        urlPathParams: { id: characterId },
        getEndpoint: characterDefinitions.default.GET,
        popNavigationOnSuccess: 1,
        prefillFromGet: true,
      });
    }
  };

  const handleSignup = (): void => {
    router.push(`/${locale}/user/signup`);
  };

  const handleLogin = (): void => {
    router.push(`/${locale}/user/login`);
  };

  // Show signup prompt if public user clicked customize character
  if (isPublic && showSignupPrompt) {
    return (
      <Div className="flex flex-col gap-0">
        {/* Top Actions: Back */}
        <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => setShowSignupPrompt(false)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("app.api.agent.chat.favorites.id.patch.signupPrompt.backButton")}
          </Button>
        </Div>

        {/* Signup Prompt */}
        <Div className="overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
          <Div className="max-w-md mx-auto flex flex-col gap-6 text-center">
            <Div className="text-xl font-semibold">
              {t("app.api.agent.chat.favorites.id.patch.signupPrompt.title")}
            </Div>
            <Div className="text-muted-foreground">
              {t(
                "app.api.agent.chat.favorites.id.patch.signupPrompt.description",
              )}
            </Div>

            {/* CTA Buttons */}
            <Div className="flex flex-col gap-3 mt-4">
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={handleSignup}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {t(
                  "app.api.agent.chat.favorites.id.patch.signupPrompt.signupButton",
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleLogin}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                {t(
                  "app.api.agent.chat.favorites.id.patch.signupPrompt.loginButton",
                )}
              </Button>
            </Div>
          </Div>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back, Delete, Submit */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        <NavigateButtonWidget
          field={{
            icon: "arrow-left",
            variant: "outline",
          }}
        />
        <NavigateButtonWidget field={children.deleteButton} />
        <SubmitButtonWidget
          field={{
            text: "app.api.agent.chat.favorites.id.patch.submitButton.label",
            loadingText:
              "app.api.agent.chat.favorites.id.patch.submitButton.loadingText",
            icon: "save",
            variant: "primary",
          }}
        />
      </Div>

      {/* Scrollable Form Container */}
      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
        <FormAlertWidget field={{}} />

        <AlertWidget
          fieldName="success"
          field={withValue(children.success, field.value?.success, null)}
        />

        <Div className="flex flex-col gap-4">
          {/* Character Info Card with Editable Icon integrated */}
          {!isNoCharacter && (
            <Div className="flex flex-col gap-3">
              <Div className="flex items-start gap-4 p-6 rounded-xl border bg-card transition-colors">
                {/* Editable Icon Field in icon position */}
                <Div className="flex-shrink-0">
                  <IconFieldWidget
                    fieldName="icon"
                    field={withValue(
                      children.icon,
                      characterData?.icon || "sparkles",
                      null,
                    )}
                  />
                </Div>

                {/* Character Content */}
                <Div className="flex-1 min-w-0 space-y-2">
                  <Div className="flex items-baseline gap-2 flex-wrap">
                    <Span className="text-lg font-semibold text-foreground">
                      {characterData?.name ? (
                        t(characterData.name)
                      ) : (
                        <Skeleton className="h-6 w-48" />
                      )}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {characterData?.tagline ? (
                        t(characterData.tagline)
                      ) : (
                        <Skeleton className="h-4 w-64" />
                      )}
                    </Span>
                  </Div>
                  <Div className="text-sm text-foreground/80">
                    {characterData?.description ? (
                      t(characterData.description)
                    ) : (
                      <>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </>
                    )}
                  </Div>
                </Div>
              </Div>

              {/* Customize Character Button */}
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={handleCustomizeCharacter}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                {t(
                  "app.api.agent.chat.favorites.id.patch.customizeCharacterButton.label",
                )}
              </Button>
            </Div>
          )}

          <SelectFieldWidget fieldName="voice" field={children.voice} />
          {form && (
            <ModelSelector
              modelSelection={favoriteModelSelection}
              onChange={(selection) =>
                form.setValue("modelSelection", selection)
              }
              characterModelSelection={
                isNoCharacter ? undefined : characterData?.modelSelection
              }
              t={t}
            />
          )}
        </Div>
      </Div>
    </Div>
  );
}
