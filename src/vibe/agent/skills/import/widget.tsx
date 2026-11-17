/**
 * Custom Widget for Skill Import
 * Link + visibility form; after import, a result card with the credit line
 * and a button that opens the new character.
 */

"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Image } from "next-vibe/ui/components/image";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { UrlFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/url-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useCallback, useMemo } from "react";

import { resolveMediaSrc } from "../../chat/storage/media-src";
import type definition from "./definition";
import type { SkillImportPostResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

function ImportResult({
  result,
}: {
  result: SkillImportPostResponseOutput;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const platform = t(result.platform);

  const openSkill = useCallback(async (): Promise<void> => {
    const skillDetailDef = await import("../[id]/definition");
    navigation.push(skillDetailDef.default.GET, {
      urlPathParams: { id: result.id },
    });
  }, [navigation, result.id]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 text-sm font-medium text-success">
        <CheckCircle className="h-4 w-4 shrink-0" />
        <Span>
          {result.alreadyImported
            ? t("post.result.alreadyImported", { name: result.name })
            : t("post.result.imported", { name: result.name })}
        </Span>
      </Div>

      <Div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
        <Span className="inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background">
          {result.avatarUrl ? (
            <Image
              src={resolveMediaSrc(result.avatarUrl)}
              alt={result.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon icon="theater" className="h-6 w-6 text-muted-foreground" />
          )}
        </Span>
        <Div className="flex min-w-0 flex-col gap-0.5">
          <Span className="truncate font-semibold">{result.name}</Span>
          <Link
            href={result.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-xs text-muted-foreground hover:text-foreground"
          >
            {result.creatorName
              ? t("post.result.credit", {
                  creator: result.creatorName,
                  platform,
                })
              : t("post.result.creditUnknown", { platform })}
          </Link>
          {result.importedFields.length > 0 && (
            <Span className="text-xs text-muted-foreground">
              {t("post.result.fieldsList", {
                fields: result.importedFields
                  .map((name) => t(`post.fields.${name}`))
                  .join(", "),
              })}
            </Span>
          )}
        </Div>
      </Div>

      <Button onClick={openSkill} className="self-end">
        {t("post.result.openSkill")}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Div>
  );
}

export function SkillImportContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const emptyField = useMemo(() => ({}), []);

  if (data?.id) {
    return <ImportResult result={data} />;
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex flex-row gap-2">
        <NavigateButtonWidget field={children.backButton} />
        <SubmitButtonWidget<typeof definition.POST>
          field={children.submitButton}
        />
      </Div>

      <Div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <Span>{t("post.intro")}</Span>
        <Span className="text-xs">{t("post.supported")}</Span>
      </Div>

      <FormAlertWidget field={emptyField} />

      <UrlFieldWidget fieldName="url" field={children.url} />
      <SelectFieldWidget fieldName="visibility" field={children.visibility} />
    </Div>
  );
}
