import type { AccessibilityNeeds, NavigationStyle } from "../types";

export const getNavigationStyle = (
  accessibility: AccessibilityNeeds
): NavigationStyle => {
  switch (accessibility) {
    case "wheelchair":
    case "stroller":
      return "stair-free";

    case "sensory":
      return "low-crowd";

    default:
      return "standard";
  }
};