"use client";

import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyToClipboardButtonProps {
  text: string;
}

export const CopyToClipboardButton = ({ text }: CopyToClipboardButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      toast.success("Copiado com sucesso");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar:", err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-2 cursor-pointer"
    >
      <Copy className="h-4 w-4" />
      {copied ? "Copiado!" : "Copiar"}
    </Button>
  );
};
