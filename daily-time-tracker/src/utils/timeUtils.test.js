import { addTimes, subtract, secondsToMinutes, formatTime, reset } from "./timeUtils";

describe("Time Utility Functions", () => {
  test("addTimes adds numbers", () => {
    expect(addTimes(2, 3)).toBe(5);
  });

  test("subtract subtracts numbers", () => {
    expect(subtract(5, 3)).toBe(2);
  });

  test("secondsToMinutes converts correctly", () => {
    expect(secondsToMinutes(120)).toBe(2);
  });

  test("formatTime returns minutes:seconds", () => {
    expect(formatTime(125)).toBe("2:05"); 
  });

  test("reset returns 0", () => {
    expect(reset()).toBe(0);
  });
});