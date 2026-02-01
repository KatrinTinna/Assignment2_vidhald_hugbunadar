# Assignment 2 - Unit Testing & Library Migration

Learn unit testing best practices including mocking, async testing, and error handling. Then practice safe library migration using your tests as a safety net.

**Group size:** 1 person

---

## Prerequisites

- Complete Week 3 in-class exercise (TDD with Vitest)
- [Bun](https://bun.sh/) version 1.3 or later installed

## Setup

1. Select "Use this Template" to create your own repository
2. Run `bun install`

## Commands

- `npm run test` - Run test suite
- `npm run test:coverage` - Run tests with coverage report

---

## The Assignment

### Task 1: Write Unit Tests (Commit 1)

Start by examining `src/dateUtils.ts` to understand the functions. Then write comprehensive tests in `src/__tests__/dateUtils.test.ts`.

**Functions to test:**

| Function | Description | Testing Notes |
|----------|-------------|---------------|
| `getCurrentYear()` | Returns current year | Time-dependent - use techniques from Week 3 to make tests deterministic |
| `add(date, amount, type)` | Adds time to a date | Has error handling for invalid inputs |
| `isWithinRange(date, from, to)` | Checks if date is between two dates | Has error handling for invalid range |
| `isDateBefore(date, compareDate)` | Checks if date is before another | - |
| `isSameDay(date, compareDate)` | Checks if two dates are the same day | - |
| `getHolidays(year)` | Async: returns holiday dates for a year | Async function |
| `isHoliday(date)` | Async: checks if date is a holiday | Async function |

**Things to consider:**
- How do you test functions that depend on the current time?
- How do you test that functions throw the correct errors?
- How do you test async functions?
- What edge cases should you cover? (boundary dates, negative numbers, different unit types)

**Commit your changes with a descriptive message.**

---

### Task 2: Add TypeScript Types (Commit 2)

Add type annotations to all function parameters and return types in `src/dateUtils.ts`.

**Commit your changes.**

---

### Task 3: Migrate to date-fns (Commit 3)

Replace the deprecated `moment` library with `date-fns`. Find equivalent functions in the [date-fns documentation](https://date-fns.org/docs/Getting-Started).

**Important:** Do NOT modify your tests! If your tests are well-written, they should all pass after migration. This demonstrates that tests act as a contract - the implementation can change as long as the behavior stays the same.

**Commit your changes.**

---

## Handin

1. Add me (arnif) as a contributor to your GitHub repo
2. Ensure you have at least 3 commits (one per task)
3. Submit the GitHub repo link to Canvas

## Tips

- Run `npm run test:coverage` to check your test coverage
- Use descriptive test names that explain the expected behavior
- Review what you learned in Week 3 about testing async code and mocking
