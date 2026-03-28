"use client";

import Image from "next/image";
import { formatDuration } from "@/app/_utils/format";
import { categories } from "../_data/categories";
import { Badge } from "./ui/badge";

interface PopularServiceItemProps {
  service: {
    name: string;
    imageUrl: string;
    DurationTimeServiceSeconds: number;
    barbershop: {
      name: string;
    };
  };
}

function getCategoryIcon(serviceName: string): string | null {
  const normalized = serviceName.toLowerCase();
  const category = categories.find((c) =>
    normalized.includes(c.search.toLowerCase()),
  );
  return category?.icon ?? null;
}

export function PopularServiceItem({ service }: PopularServiceItemProps) {
  const categoryIcon = getCategoryIcon(service.name);

  return (
    <div className="relative min-w-[290px] min-h-[200px] rounded-[10px] overflow-hidden">
      <Image
        src={service.imageUrl || "/MapCard.png"}
        alt={service.name}
        fill
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 47%, rgba(0,0,0,1) 100%)",
        }}
      />
      <span className="text-[12px] font-medium text-sidebar-primary-foreground">
        {service.barbershop.name}
      </span>
    </div>
  );
}
