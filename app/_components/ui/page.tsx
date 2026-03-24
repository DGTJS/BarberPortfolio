"use client";

import { Button } from "@/app/_components/ui/button";

interface CopyButtonProps {
  text: string;
}

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-5 space-y-6">{children}</div>;
};

export const PageSectionTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <h2 className="text-xs text-foreground uppercase font-semibold">
      {children}
    </h2>
  );
};

export const PageSection = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-3">{children}</div>;
};

export const PageSectionScroller = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
};
export const CopyButton = ({ text }: CopyButtonProps) => {
  return (
    <Button
      variant="outline"
      className="border-border rounded-[999px] px-4 py-2 h-auto"
      onClick={() => {
        navigator.clipboard.writeText(text);
      }}
    >
      Copiar
    </Button>
  );
};
