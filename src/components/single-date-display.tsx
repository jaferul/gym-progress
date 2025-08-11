import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export const SingleDateDisplay = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
    />
  );
};
