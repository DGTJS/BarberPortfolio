"use client";

import { Button } from "@/app/_components/ui/button";

interface TimeSlotsSelectorProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  isVisible: boolean;
  availableTimeSlots?: {
    data?: string[];
  };
}

export function TimeSlotsSelector({
  selectedTime,
  availableTimeSlots,
  onSelectTime,
  isVisible,
}: TimeSlotsSelectorProps) {
  if (!isVisible) return null;

  return (
    <div className="px-5">
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max flex-nowrap items-center gap-3">
          {availableTimeSlots?.data?.map((time: string) => (
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
