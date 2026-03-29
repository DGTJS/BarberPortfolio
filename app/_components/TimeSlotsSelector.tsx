"use client";

import { Button } from "@/app/_components/ui/button";
import { useMemo } from "react";
import { Separator } from "./ui/separator";

interface TimeSlotsSelectorProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  isVisible: boolean;
  selectedDate?: Date;
  availableTimeSlots?: {
    data?: string[];
  };
}

function getTimeMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getMinTimeMinutes(date?: Date): number | null {
  if (!date) return null;
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  if (!isToday) return null;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const remainder = currentMinutes % 30;
  if (remainder === 0) {
    return currentMinutes + 30;
  }
  return currentMinutes + (30 - remainder);
}

export function TimeSlotsSelector({
  selectedTime,
  availableTimeSlots,
  onSelectTime,
  isVisible,
  selectedDate,
}: TimeSlotsSelectorProps) {
  const minMinutes = useMemo(
    () => getMinTimeMinutes(selectedDate),
    [selectedDate],
  );

  if (!isVisible) return null;

  const filteredSlots = availableTimeSlots?.data?.filter((time) => {
    if (minMinutes === null) return true;
    return getTimeMinutes(time) >= minMinutes;
  });

  return (
    <>
      <div className="px-5">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max flex-nowrap items-center gap-3">
            {filteredSlots?.map((time: string) => (
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
      <Separator className="bg-muted-foreground/20" />
    </>
  );
}
