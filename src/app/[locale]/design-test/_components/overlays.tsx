/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "next-vibe-ui/ui/alert-dialog";
import { Button } from "next-vibe-ui/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "next-vibe-ui/ui/command";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "next-vibe-ui/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "next-vibe-ui/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "next-vibe-ui/ui/hover-card";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Section } from "next-vibe-ui/ui/section";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "next-vibe-ui/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { H2, H3, H4, P, Small } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";

export function OverlaysPreview(): JSX.Element {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Overlay Components</H2>

        <Div className="space-y-6">
          <Div className="space-y-2">
            <H3>Dialog</H3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog component for modal interactions.
                  </DialogDescription>
                </DialogHeader>
                <Div className="space-y-4 py-4">
                  <Div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </Div>
                </Div>
                <DialogFooter>
                  <Button>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Div>

          <Div className="space-y-2">
            <H3>Alert Dialog</H3>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Item</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Div>

          <Div className="space-y-2">
            <H3>Sheet</H3>
            <Div className="flex flex-row gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open Sheet (Right)</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sheet Title</SheetTitle>
                    <SheetDescription>
                      This is a sheet component that slides in from the side.
                    </SheetDescription>
                  </SheetHeader>
                  <Div className="py-4">
                    <P>Sheet content goes here.</P>
                  </Div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open Sheet (Left)</Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Sheet Title</SheetTitle>
                    <SheetDescription>
                      Sheet from the left side.
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </Div>
          </Div>

          <Div className="space-y-2">
            <H3>Drawer</H3>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer Title</DrawerTitle>
                  <DrawerDescription>
                    This is a drawer component that slides up from the bottom.
                  </DrawerDescription>
                </DrawerHeader>
                <Div className="p-4">
                  <P>Drawer content goes here.</P>
                </Div>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Div>

          <Div className="space-y-2">
            <H3>Popover</H3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Div className="space-y-2">
                  <H4>Popover</H4>
                  <Small className="text-muted-foreground">
                    This is a popover component for displaying contextual
                    content.
                  </Small>
                </Div>
              </PopoverContent>
            </Popover>
          </Div>

          <Div className="space-y-2">
            <H3>Hover Card</H3>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">Hover over me</Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <Div className="space-y-1">
                  <H4>Hover Card</H4>
                  <Small>
                    This appears when you hover over the trigger element.
                  </Small>
                </Div>
              </HoverCardContent>
            </HoverCard>
          </Div>

          <Div className="space-y-2">
            <H3>Tooltip</H3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover for tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <P>This is a tooltip</P>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Div>

          <Div className="space-y-2">
            <H3>Dropdown Menu</H3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Billing <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Show Status Bar
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Option 1</DropdownMenuItem>
                    <DropdownMenuItem>Option 2</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value="apple">
                  <DropdownMenuRadioItem value="apple">
                    Apple
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="banana">
                    Banana
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Div>

          <Div className="space-y-2">
            <H3>Context Menu</H3>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
                Right click here
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>
                  Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem disabled>
                  Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuCheckboxItem checked>
                  Show Bookmarks Bar
                </ContextMenuCheckboxItem>
                <ContextMenuSeparator />
                <ContextMenuLabel>People</ContextMenuLabel>
                <ContextMenuRadioGroup value="pedro">
                  <ContextMenuRadioItem value="pedro">
                    Pedro
                  </ContextMenuRadioItem>
                  <ContextMenuRadioItem value="colm">Colm</ContextMenuRadioItem>
                </ContextMenuRadioGroup>
              </ContextMenuContent>
            </ContextMenu>
          </Div>

          <Div className="space-y-2">
            <H3>Command</H3>
            <Div className="space-y-2">
              <Button onClick={() => setCommandOpen(true)}>
                Open Command Dialog
              </Button>
              <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      Calendar <CommandShortcut>⌘C</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      Search Emoji <CommandShortcut>⌘E</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      Calculator <CommandShortcut>⌘K</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Settings">
                    <CommandItem>Profile</CommandItem>
                    <CommandItem>Billing</CommandItem>
                    <CommandItem>Settings</CommandItem>
                  </CommandGroup>
                </CommandList>
              </CommandDialog>

              <Command className="rounded-lg border">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Actions">
                    <CommandItem>New File</CommandItem>
                    <CommandItem>New Folder</CommandItem>
                    <CommandItem>Open File</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </Div>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
