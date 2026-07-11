import { describe, it, expect } from "vitest";
import { getNavigationStyle } from "./navigation";

describe("getNavigationStyle", () => {
  it("returns stair-free for wheelchair users", () => {
    expect(getNavigationStyle("wheelchair")).toBe("stair-free");
  });

  it("returns stair-free for stroller users", () => {
    expect(getNavigationStyle("stroller")).toBe("stair-free");
  });

  it("returns low-crowd for sensory users", () => {
    expect(getNavigationStyle("sensory")).toBe("low-crowd");
  });

  it("returns standard navigation when no accessibility needs exist", () => {
    expect(getNavigationStyle("none")).toBe("standard");
  });
});