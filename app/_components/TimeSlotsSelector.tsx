"use client";

import { Button } from "@/app/_components/ui/button";
import { buildTimeSlots } from "@/app/_utils/format";
import { useMemo } from "react";

interface TimeSlotsSelectorProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  isVisible: boolean;
}

export function TimeSlotsSelector({
  selectedTime,
  onSelectTime,
  isVisible,
}: TimeSlotsSelectorProps) {
  const timeSlots = useMemo(() => buildTimeSlots(), []);

  if (!isVisible) return null;

  return (
    <div className="px-5">
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max flex-nowrap items-center gap-3">
          {timeSlots.map((time) => (
            <Button
              key={time}
              type="button"
              variant={selectedTime === time ? "default" : "outline"}
              className="h-auto rounded-full px-4 py-2 border-accent-foreground"
              onClick={() => onSelectTime(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
