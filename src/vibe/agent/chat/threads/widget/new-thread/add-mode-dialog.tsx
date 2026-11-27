"use client";

/**
 * "Add a mode" from the new-thread spotlight.
 *
 * Opens the existing favorite-create endpoint UI (the same form the chat
 * selector's "Add variant" pushes), prefilled with the companion's current
 * mode. Saving creates a personal mode (a favorite with its own model) that
 * works for every skill, system companions included, and for guests (their
 * favorites live in this browser). The new mode is selected right away.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "next-vibe/ui/components/dialog";
import {
  useWidgetLogger,
  useWidgetPlatform,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { UseEndpointOptions } from "next-vibe/unified-ui/hooks/endpoint-types";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import type { JSX } from "react";
import { useMemo } from "react";

import { getBestChatModel } from "../../../../ai-stream/models";
import { useProviderAvailability } from "../../../../env-availability-store";
import { AddModeProvider } from "../../../../skills/favorites/create/add-mode-context";
import favoriteCreateDefinition from "../../../../skills/favorites/create/definition";
import type { VoiceModelSelection } from "../../../../text-to-speech/models";
import { ChatSettingsRepositoryClient } from "../../../settings/repository-client";
import { scopedTranslation } from "../../i18n";

export interface AddModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: CountryLanguage;
  /** Composite id of the mode the new one starts from (`skill__variant`). */
  skillId: string;
  companionName: string;
  icon: IconKey;
  voiceModelSelection: VoiceModelSelection | null;
}

export function AddModeDialog({
  open,
  onOpenChange,
  locale,
  skillId,
  companionName,
  icon,
  voiceModelSelection,
}: AddModeDialogProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const platform = useWidgetPlatform();
  const availability = useProviderAvailability();

  const endpointOptions = useMemo(
    (): UseEndpointOptions<typeof favoriteCreateDefinition> => ({
      create: {
        initialState: {
          skillId,
          icon,
          voiceModelSelection,
          modelSelection: null,
        },
        formOptions: { persistForm: false },
        mutationOptions: {
          onSuccess: async ({ responseData, requestData }): Promise<void> => {
            onOpenChange(false);
            const model = requestData.modelSelection
              ? getBestChatModel(requestData.modelSelection, user, availability)
              : null;
            await ChatSettingsRepositoryClient.selectFavorite({
              favoriteId: responseData.id,
              modelId: model?.id ?? null,
              skillId: requestData.skillId ?? skillId,
              logger,
              locale,
              user,
            });
          },
        },
      },
    }),
    [
      skillId,
      icon,
      voiceModelSelection,
      onOpenChange,
      user,
      availability,
      logger,
      locale,
    ],
  );

  // The form's "back" and "use without saving" pop the stack: here that
  // means closing the dialog.
  const navigationOverride = useMemo(
    () => ({
      pop: (): void => onOpenChange(false),
      canGoBack: false,
    }),
    [onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* The only scroll container: the embedded form leaves scrolling
          to it (AddModeProvider) and pins its actions to the top. */}
      <DialogContent className="max-h-[90dvh] gap-0 overflow-y-auto p-0 sm:max-w-[520px]">
        <DialogHeader className="shrink-0 px-4 pb-0 pt-4 text-left">
          <DialogTitle>
            {t("widget.emptyState.spotlight.addMode.dialogTitle", {
              name: companionName,
            })}
          </DialogTitle>
          <DialogDescription>
            {t("widget.emptyState.spotlight.addMode.dialogDescription", {
              name: companionName,
            })}
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <AddModeProvider value>
            <EndpointsPage
              endpoint={favoriteCreateDefinition}
              locale={locale}
              user={user}
              logger={logger}
              platform={platform}
              endpointOptions={endpointOptions}
              navigationOverride={navigationOverride}
            />
          </AddModeProvider>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
