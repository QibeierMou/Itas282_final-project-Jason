import { describe, it, expect } from "vitest";
import { addTimes,subtract,secondsToMinutes,formatTime,reset } from "./timeUtils";

describe("Time Utility Functions", () => {

  it("adds two numbers", () => {
    expect(addTimes(5, 5)).toBe(10);
  });

  it("subtracts two numbers", () => {
    expect(subtract(10, 5)).toBe(6);
  });

  it("converts seconds to minutes", () => {
    expect(secondsToMinutes(120)).toBe(2);
  });

  it("formats seconds into minutes and seconds", () => {
    expect(formatTime(125)).toBe("2:5");
  });

  it("resets value to 0", () => {
    expect(reset()).toBe(0);
  });

});