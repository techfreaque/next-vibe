/* eslint-disable oxlint-plugin-i18n/no-literal-string */
import { ButtonsPreview } from "./_components/buttons";
import { FormsPreview } from "./_components/forms";
import { FeedbackPreview } from "./_components/feedback";
import { LayoutsPreview } from "./_components/layouts";
import { NavigationPreview } from "./_components/navigation";
import { OverlaysPreview } from "./_components/overlays";
import { DataDisplayPreview } from "./_components/data-display";
import { AdvancedPreview } from "./_components/advanced";
import { SpecialPreview } from "./_components/special";
import { Separator } from "next-vibe-ui/ui/separator";
import { Toaster } from "next-vibe-ui/ui/sonner";
import { Container } from "next-vibe-ui/ui/container";
import { Div } from "next-vibe-ui/ui/div";
import { H1, Large } from "next-vibe-ui/ui/typography";

export default function DesignTestPage(): JSX.Element {
  return (
    <>
      <Container className="mx-auto py-10 space-y-12">
        <Div className="space-y-2">
          <H1>Vibe UI Component Library</H1>
          <Large className="text-muted-foreground">
            Demo of Vibe UI components
          </Large>
        </Div>

        <Separator />
        <ButtonsPreview />

        <Separator />
        <FormsPreview />

        <Separator />
        <FeedbackPreview />

        <Separator />
        <LayoutsPreview />

        <Separator />
        <NavigationPreview />

        <Separator />
        <OverlaysPreview />

        <Separator />
        <DataDisplayPreview />

        <Separator />
        <AdvancedPreview />

        <Separator />
        <SpecialPreview />
      </Container>
      <Toaster />
    </>
  );
}
