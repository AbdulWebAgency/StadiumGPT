import { describe, it, expect } from "vitest";
import { findMatchingReport } from "./matching";
import type { LostFoundReport } from "../types";

const reports: LostFoundReport[] = [
  {
    id: "1",
    type: "found",
    item: "backpack",
    color: "blue",
    location: "Gate A",
    description: "blue backpack containing a flag",
    timestamp: Date.now(),
    status: "active",
    reportedBy: "staff",
  },
  {
    id: "2",
    type: "found",
    item: "keys",
    color: "silver",
    location: "Gate C",
    description: "silver keys with leather keychain",
    timestamp: Date.now(),
    status: "active",
    reportedBy: "staff",
  },
];

describe("findMatchingReport", () => {
  it("finds a matching backpack", () => {
    expect(findMatchingReport(reports, "backpack", "blue")).not.toBeNull();
  });

  it("returns null for wrong color", () => {
    expect(findMatchingReport(reports, "backpack", "red")).toBeNull();
  });

  it("returns null for wrong item", () => {
    expect(findMatchingReport(reports, "phone", "blue")).toBeNull();
  });

  it("finds matching keys", () => {
    expect(findMatchingReport(reports, "keys", "silver")).not.toBeNull();
  });
});