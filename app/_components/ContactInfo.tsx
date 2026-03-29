"use client";

import { Smartphone } from "lucide-react";
import { CopyToClipboardButton } from "./CopyToClipboardButton";

interface ContactInfoProps {
  phones: string[];
}

export const ContactInfo = ({ phones }: ContactInfoProps) => {
  return (
    <div className="flex flex-col gap-3">
      {phones.map((phone, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-2.5"
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-6 h-6" />
            <span className="text-sm font-[family-name:var(--font-sans)] text-foreground">
              {phone}
            </span>
          </div>
          <CopyToClipboardButton text={phone} />
        </div>
      ))}
    </div>
  );
};
