import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCurrentYear, add, isWithinRange, isDateBefore, isSameDay, getHolidays, isHoliday } from '../dateUtils';
import { DATE_UNIT_TYPES } from '../constants';

describe("getCurrentYear", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the current year", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 5, 15));
    expect(getCurrentYear()).toBe(2025);
  });

  it("should return correct year at the start of a new year", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2030, 0, 1, 0, 0, 0));
    expect(getCurrentYear()).toBe(2030);
  });

  it("should return correct year at the end of a year", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 11, 31, 23, 59, 59));
    expect(getCurrentYear()).toBe(2024);
  });
});

describe("add", () => {
  it("should add days by default", () => {
    const date = new Date(2025, 0, 1);
    const result = add(date, 5);
    expect(result).toEqual(new Date(2025, 0, 6));
  });

  it("should add seconds when specified", () => {
    const date = new Date(2025, 0, 1, 12, 0, 0);
    const result = add(date, 30, DATE_UNIT_TYPES.SECONDS);
    expect(result).toEqual(new Date(2025, 0, 1, 12, 0, 30));
  });

  it("should add minutes when specified", () => {
    const date = new Date(2025, 0, 1, 12, 0, 0);
    const result = add(date, 45, DATE_UNIT_TYPES.MINUTES);
    expect(result).toEqual(new Date(2025, 0, 1, 12, 45, 0));
  });

  it("should add weeks when specified", () => {
    const date = new Date(2025, 0, 1);
    const result = add(date, 2, DATE_UNIT_TYPES.WEEKS);
    expect(result).toEqual(new Date(2025, 0, 15));
  });

  it("should add months when specified", () => {
    const date = new Date(2025, 0, 15);
    const result = add(date, 2, DATE_UNIT_TYPES.MONTHS);
    expect(result).toEqual(new Date(2025, 2, 15));
  });

  it("should add years when specified", () => {
    const date = new Date(2025, 5, 1);
    const result = add(date, 3, DATE_UNIT_TYPES.YEARS);
    expect(result).toEqual(new Date(2028, 5, 1));
  });

  it("should handle negative amounts (subtraction)", () => {
    const date = new Date(2025, 0, 10);
    const result = add(date, -3);
    expect(result).toEqual(new Date(2025, 0, 7));
  });

  it("should handle adding zero", () => {
    const date = new Date(2025, 3, 15);
    const result = add(date, 0);
    expect(result).toEqual(new Date(2025, 3, 15));
  });

  it("should throw an error for an invalid date", () => {
    expect(() => add(new Date("invalid"), 5)).toThrow('Invalid date provided');
  });

  it("should throw an error when date is not a Date object", () => {
    expect(() => add("2025-01-01" as any, 5)).toThrow('Invalid date provided');
  });

  it("should throw an error for an invalid amount", () => {
    expect(() => add(new Date(2025, 0, 1), NaN)).toThrow('Invalid amount provided');
  });

  it("should throw an error when amount is not a number", () => {
    expect(() => add(new Date(2025, 0, 1), "5" as any)).toThrow('Invalid amount provided');
  });

  // Edge cases: boundary crossings
  it("should cross into a new year when adding seconds at year boundary", () => {
    const date = new Date(2025, 11, 31, 23, 59, 57); // 3 seconds before midnight
    const result = add(date, 3, DATE_UNIT_TYPES.SECONDS);
    expect(result).toEqual(new Date(2026, 0, 1, 0, 0, 0));
  });

  it("should cross into a new day when adding minutes at midnight boundary", () => {
    const date = new Date(2025, 0, 1, 23, 55, 0); // 5 minutes before midnight
    const result = add(date, 10, DATE_UNIT_TYPES.MINUTES);
    expect(result).toEqual(new Date(2025, 0, 2, 0, 5, 0));
  });

  it("should cross into a new month when adding days at month boundary", () => {
    const date = new Date(2025, 0, 31); // Jan 31
    const result = add(date, 1);
    expect(result).toEqual(new Date(2025, 1, 1)); // Feb 1
  });

  it("should handle adding a month to Jan 31 (month with fewer days)", () => {
    const date = new Date(2025, 0, 31); // Jan 31
    const result = add(date, 1, DATE_UNIT_TYPES.MONTHS);
    // moment clamps to end of February
    expect(result).toEqual(new Date(2025, 1, 28));
  });

  it("should handle leap year when adding one day to Feb 28", () => {
    const date = new Date(2024, 1, 28); // Feb 28, 2024 (leap year)
    const result = add(date, 1);
    expect(result).toEqual(new Date(2024, 1, 29)); // Feb 29
  });

  it("should handle non-leap year when adding one day to Feb 28", () => {
    const date = new Date(2025, 1, 28); // Feb 28, 2025 (not a leap year)
    const result = add(date, 1);
    expect(result).toEqual(new Date(2025, 2, 1)); // Mar 1
  });

  it("should clamp when subtracting a month from Mar 31 (non-leap year)", () => {
    const date = new Date(2025, 2, 31); // Mar 31, 2025
    const result = add(date, -1, DATE_UNIT_TYPES.MONTHS);
    expect(result).toEqual(new Date(2025, 1, 28)); // Feb 28
  });

  it("should clamp when subtracting a month from Mar 31 (leap year)", () => {
    const date = new Date(2024, 2, 31); // Mar 31, 2024
    const result = add(date, -1, DATE_UNIT_TYPES.MONTHS);
    expect(result).toEqual(new Date(2024, 1, 29)); // Feb 29
  });

  it("should clamp when subtracting a year from Feb 29 (leap day)", () => {
    const date = new Date(2024, 1, 29); // Feb 29, 2024
    const result = add(date, -1, DATE_UNIT_TYPES.YEARS);
    expect(result).toEqual(new Date(2023, 1, 28)); // Feb 28, 2023
  });

  it("should handle subtracting across year boundary", () => {
    const date = new Date(2025, 0, 1, 0, 0, 0); // midnight Jan 1
    const result = add(date, -1, DATE_UNIT_TYPES.SECONDS);
    expect(result).toEqual(new Date(2024, 11, 31, 23, 59, 59));
  });
});

describe("isWithinRange", () => {
  const from = new Date(2025, 0, 10);
  const to = new Date(2025, 0, 20);

  it("should return true when date is within the range", () => {
    expect(isWithinRange(new Date(2025, 0, 15), from, to)).toBe(true);
  });

  it("should return false when date is before the range", () => {
    expect(isWithinRange(new Date(2025, 0, 5), from, to)).toBe(false);
  });

  it("should return false when date is after the range", () => {
    expect(isWithinRange(new Date(2025, 0, 25), from, to)).toBe(false);
  });

  it("should return false when date equals the from boundary (exclusive)", () => {
    expect(isWithinRange(new Date(2025, 0, 10), from, to)).toBe(false);
  });

  it("should return false when date equals the to boundary (exclusive)", () => {
    expect(isWithinRange(new Date(2025, 0, 20), from, to)).toBe(false);
  });

  it("should throw an error when from date is after to date", () => {
    expect(() => isWithinRange(new Date(2025, 0, 15), to, from)).toThrow(
      'Invalid range: from date must be before to date'
    );
  });

  it("should work across month boundaries", () => {
    const monthFrom = new Date(2025, 0, 28);
    const monthTo = new Date(2025, 1, 5);
    expect(isWithinRange(new Date(2025, 1, 1), monthFrom, monthTo)).toBe(true);
  });

  it("should work across year boundaries", () => {
    const yearFrom = new Date(2024, 11, 28);
    const yearTo = new Date(2025, 0, 5);
    expect(isWithinRange(new Date(2025, 0, 1), yearFrom, yearTo)).toBe(true);
  });

  it("should return false when from and to are the same date", () => {
    const same = new Date(2025, 0, 15);
    expect(isWithinRange(new Date(2025, 0, 15), same, same)).toBe(false);
  });

  it("should compare at time-level precision within the same day", () => {
    const timeFrom = new Date(2025, 0, 15, 8, 0, 0);
    const timeTo = new Date(2025, 0, 15, 22, 0, 0);
    expect(isWithinRange(new Date(2025, 0, 15, 12, 0, 0), timeFrom, timeTo)).toBe(true);
  });
});

describe("isDateBefore", () => {
  it("should return true when date is before compareDate", () => {
    expect(isDateBefore(new Date(2025, 0, 1), new Date(2025, 0, 10))).toBe(true);
  });

  it("should return false when date is after compareDate", () => {
    expect(isDateBefore(new Date(2025, 0, 10), new Date(2025, 0, 1))).toBe(false);
  });

  it("should return false when dates are the same", () => {
    expect(isDateBefore(new Date(2025, 0, 15), new Date(2025, 0, 15))).toBe(false);
  });

  it("should compare at time-level precision", () => {
    const earlier = new Date(2025, 0, 15, 10, 0, 0);
    const later = new Date(2025, 0, 15, 10, 0, 1);
    expect(isDateBefore(earlier, later)).toBe(true);
  });

  it("should work across year boundaries", () => {
    expect(isDateBefore(new Date(2024, 11, 31), new Date(2025, 0, 1))).toBe(true);
  });

  it("should return true for same day with earlier time (millisecond precision)", () => {
    const midnight = new Date(2025, 0, 15, 0, 0, 0);
    const oneSecondLater = new Date(2025, 0, 15, 0, 0, 1);
    expect(isDateBefore(midnight, oneSecondLater)).toBe(true);
  });
});

describe("isSameDay", () => {
  it("should return true for the same date and time", () => {
    const date = new Date(2025, 0, 15, 12, 0, 0);
    expect(isSameDay(date, new Date(2025, 0, 15, 12, 0, 0))).toBe(true);
  });

  it("should return true for same day with different times", () => {
    const morning = new Date(2025, 0, 15, 8, 0, 0);
    const evening = new Date(2025, 0, 15, 20, 30, 0);
    expect(isSameDay(morning, evening)).toBe(true);
  });

  it("should return true for midnight vs end of day on the same date", () => {
    const startOfDay = new Date(2025, 0, 15, 0, 0, 0);
    const endOfDay = new Date(2025, 0, 15, 23, 59, 59);
    expect(isSameDay(startOfDay, endOfDay)).toBe(true);
  });

  it("should return false for different days", () => {
    expect(isSameDay(new Date(2025, 0, 15), new Date(2025, 0, 16))).toBe(false);
  });

  it("should return false for adjacent days at midnight boundary", () => {
    const endOfDay = new Date(2025, 0, 15, 23, 59, 59);
    const startOfNextDay = new Date(2025, 0, 16, 0, 0, 0);
    expect(isSameDay(endOfDay, startOfNextDay)).toBe(false);
  });

  it("should return false for same day and month but different year", () => {
    expect(isSameDay(new Date(2025, 0, 15), new Date(2024, 0, 15))).toBe(false);
  });

  it("should return false for same day number but different month", () => {
    expect(isSameDay(new Date(2025, 0, 15), new Date(2025, 1, 15))).toBe(false);
  });

  it("should return false across year boundary (Dec 31 vs Jan 1)", () => {
    expect(isSameDay(new Date(2024, 11, 31), new Date(2025, 0, 1))).toBe(false);
  });
});

describe("getHolidays", () => {
  it("should return an array of holidays", async () => {
    const holidays = await getHolidays(2025);
    expect(Array.isArray(holidays)).toBe(true);
    expect(holidays).toHaveLength(3);
  });

  it("should return New Year's Day, Christmas, and New Year's Eve", async () => {
    const holidays = await getHolidays(2025);
    expect(holidays).toEqual([
      new Date(2025, 0, 1),   // New Year's Day
      new Date(2025, 11, 25), // Christmas
      new Date(2025, 11, 31), // New Year's Eve
    ]);
  });

  it("should return holidays for the correct year", async () => {
    const holidays = await getHolidays(2030);
    expect(holidays).toEqual([
      new Date(2030, 0, 1),
      new Date(2030, 11, 25),
      new Date(2030, 11, 31),
    ]);
  });

  it("should return Date objects", async () => {
    const holidays = await getHolidays(2025) as Date[];
    holidays.forEach((holiday: Date) => {
      expect(holiday).toBeInstanceOf(Date);
    });
  });

  it("should handle concurrent calls with different years correctly", async () => {
    const [holidays2025, holidays2030] = await Promise.all([
      getHolidays(2025),
      getHolidays(2030),
    ]);
    expect(holidays2025).toEqual([
      new Date(2025, 0, 1),
      new Date(2025, 11, 25),
      new Date(2025, 11, 31),
    ]);
    expect(holidays2030).toEqual([
      new Date(2030, 0, 1),
      new Date(2030, 11, 25),
      new Date(2030, 11, 31),
    ]);
  });
});

describe("isHoliday", () => {
  it("should return true for New Year's Day", async () => {
    expect(await isHoliday(new Date(2025, 0, 1))).toBe(true);
  });

  it("should return true for Christmas", async () => {
    expect(await isHoliday(new Date(2025, 11, 25))).toBe(true);
  });

  it("should return true for New Year's Eve", async () => {
    expect(await isHoliday(new Date(2025, 11, 31))).toBe(true);
  });

  it("should return false for a regular day", async () => {
    expect(await isHoliday(new Date(2025, 5, 15))).toBe(false);
  });

  it("should return true regardless of time on a holiday", async () => {
    expect(await isHoliday(new Date(2025, 11, 25, 18, 30, 0))).toBe(true);
  });

  it("should return false for the day before a holiday", async () => {
    expect(await isHoliday(new Date(2025, 11, 24))).toBe(false);
  });

  it("should return false for the day after a holiday", async () => {
    expect(await isHoliday(new Date(2025, 0, 2))).toBe(false);
  });

  it("should check holidays against the correct year", async () => {
    expect(await isHoliday(new Date(2030, 0, 1))).toBe(true);
    expect(await isHoliday(new Date(2030, 5, 15))).toBe(false);
  });
});
