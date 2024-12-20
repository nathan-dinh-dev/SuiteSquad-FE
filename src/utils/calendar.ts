import { DateRange } from "react-day-picker";
import { Booking } from "@/utils/types";

export const defaultSelected: DateRange = {
  from: undefined,
  to: undefined,
};

export const generateBlockedPeriods = ({
  bookings,
  today,
}: {
  bookings: Booking[];
  today: Date;
}) => {
  today.setHours(0, 0, 0, 0); // Set the time to 00:00:00.000

  const disabledDays: DateRange[] = [
    ...bookings.map((booking) => ({
      from: booking.checkIn,
      to: booking.checkOut,
    })),
    {
      from: new Date(0), // This is 01 January 1970 00:00:00 UTC.
      to: new Date(today.getTime() - 24 * 60 * 60 * 1000), // This is yesterday.
    },
  ];
  return disabledDays;
};

export const generateDateRange = (range: DateRange | undefined): string[] => {
  if (!range || !range.from || !range.to) return [];

  const currentDate = new Date(range.from); // Changed to `const`
  const endDate = new Date(range.to);
  const dateRange: string[] = [];

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    dateRange.push(dateString);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateRange;
};

export const generateDisabledDates = (
  disabledDays: DateRange[]
): { [key: string]: boolean } => {
  if (disabledDays.length === 0) return {};

  const disabledDates: { [key: string]: boolean } = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0); // set time to 00:00:00 to compare only the date part

  disabledDays.forEach((range) => {
    if (!range.from || !range.to) return;

    const currentDate = new Date(range.from); // Changed to `const`
    const endDate = new Date(range.to);

    while (currentDate <= endDate) {
      if (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      const dateString = currentDate.toISOString().split("T")[0];
      disabledDates[dateString] = true;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return disabledDates;
};

export function calculateDaysBetween({
  checkIn,
  checkOut,
}: {
  checkIn: Date | string;
  checkOut: Date | string;
}) {
  // Ensure checkIn and checkOut are Date objects
  const checkInDate = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
  const checkOutDate =
    typeof checkOut === "string" ? new Date(checkOut) : checkOut;

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    throw new Error("Invalid date format for checkIn or checkOut.");
  }

  // Calculate the difference in milliseconds
  const diffInMs = Math.abs(checkOutDate.getTime() - checkInDate.getTime());

  // Convert the difference in milliseconds to days
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays;
}
