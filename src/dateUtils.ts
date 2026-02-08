import { getYear, add as dateFnsAdd, isAfter, isBefore, isSameDay as dateFnsIsSameDay } from "date-fns";
import { DATE_UNIT_TYPES } from "./constants";

export function getCurrentYear(): number {
  return getYear(new Date());
}

export function add(date: Date, amount: number, type: DATE_UNIT_TYPES = DATE_UNIT_TYPES.DAYS): Date {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount provided');
  }
  return dateFnsAdd(date, { [type]: amount });
}

export function isWithinRange(date: Date, from: Date, to: Date): boolean {
  if (isAfter(from, to)) {
    throw new Error('Invalid range: from date must be before to date');
  }
  return isAfter(date, from) && isBefore(date, to);
}

export function isDateBefore(date: Date, compareDate: Date): boolean {
  return isBefore(date, compareDate);
}

export function isSameDay(date: Date, compareDate: Date): boolean {
  return dateFnsIsSameDay(date, compareDate);
}

// Simulates fetching holidays from an API
export async function getHolidays(year: number): Promise<Date[]> {
  return new Promise<Date[]>((resolve) => {
    setTimeout(() => {
      resolve([
        new Date(year, 0, 1),   // New Year's Day
        new Date(year, 11, 25), // Christmas
        new Date(year, 11, 31), // New Year's Eve
      ]);
    }, 100);
  });
}

export async function isHoliday(date: Date): Promise<boolean> {
  const holidays = await getHolidays(date.getFullYear());
  return holidays.some((holiday: Date) => isSameDay(date, holiday));
}
