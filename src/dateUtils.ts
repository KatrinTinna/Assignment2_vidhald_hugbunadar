import moment from "moment";
import { DATE_UNIT_TYPES } from "./constants";

export function getCurrentYear() {
  return moment().year();
}

export function add(date, amount, type = DATE_UNIT_TYPES.DAYS) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount provided');
  }
  return moment(date).add(amount, type).toDate();
}

export function isWithinRange(date, from, to) {
  if (moment(from).isAfter(to)) {
    throw new Error('Invalid range: from date must be before to date');
  }
  return moment(date).isBetween(from, to);
}

export function isDateBefore(date, compareDate) {
  return moment(date).isBefore(compareDate);
}

export function isSameDay(date, compareDate) {
  return moment(date).isSame(compareDate, 'day');
}

// Simulates fetching holidays from an API
export async function getHolidays(year) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        new Date(year, 0, 1),   // New Year's Day
        new Date(year, 11, 25), // Christmas
        new Date(year, 11, 31), // New Year's Eve
      ]);
    }, 100);
  });
}

export async function isHoliday(date) {
  const holidays = await getHolidays(date.getFullYear());
  return holidays.some(holiday => isSameDay(date, holiday));
}
