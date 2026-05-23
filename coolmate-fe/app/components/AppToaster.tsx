"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "font-sans border border-outline-variant shadow-lg",
          title: "font-headline font-bold text-sm",
          description: "text-xs text-on-surface-variant",
        },
      }}
    />
  );
}
