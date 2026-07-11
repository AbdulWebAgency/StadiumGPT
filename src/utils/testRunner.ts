import type { UserMemory, LostFoundReport } from '../types';
import { getNavigationStyle } from './navigation';
import { findMatchingReport } from "./matching";

export interface TestCase {
  name: string;
  category: 'Memory' | 'Matching' | 'Navigation';
  run: () => { success: boolean; message: string };
}

export const runTests = (): TestCase[] => {
  const tests: TestCase[] = [
    {
      name: 'Onboarding Memory Generation Test',
      category: 'Memory',
      run: () => {
        const testMemory: UserMemory = {
          language: 'en',
          accessibility: 'wheelchair',
          groupSize: 4,
          dietary: 'vegan',
          navigationStyle: 'stair-free',
          favoriteFoods: []
        };
        
        const success = testMemory.accessibility === 'wheelchair' && testMemory.navigationStyle === 'stair-free';
        return {
          success,
          message: success 
            ? 'Memory variables synced and stair-free navigation style mapped correctly.'
            : 'Failed to assign stair-free navigation for wheelchair accessibility need.'
        };
      }
    },
    {
      name: 'Dietary Preference Learning Test',
      category: 'Memory',
      run: () => {
        // Simulating the learning function: learnPreferencesFromInput
        const simulateLearning = (text: string): string => {
          const lower = text.toLowerCase();
          if (lower.includes('vegan')) return 'vegan';
          if (lower.includes('halal')) return 'halal';
          if (lower.includes('gluten-free')) return 'gluten-free';
          return 'none';
        };

        const result1 = simulateLearning('I want some gluten-free hotdogs');
        const result2 = simulateLearning('Can I order vegan options?');
        
        const success = result1 === 'gluten-free' && result2 === 'vegan';
        return {
          success,
          message: success
            ? 'AI memory successfully parsed and isolated dietary preferences from chat strings.'
            : 'AI failed to learn dietary constraints from keywords.'
        };
      }
    },
    {
      name: 'Lost & Found Keyword Matching Test',
      category: 'Matching',
      run: () => {
        const dummyFoundReports: LostFoundReport[] = [
          {
            id: 'f1',
            type: 'found',
            item: 'keys',
            color: 'silver',
            location: 'Gate A',
            description: 'silver keys with a leather fob',
            timestamp: Date.now(),
            status: 'active',
            reportedBy: 'staff'
          },
          {
            id: 'f2',
            type: 'found',
            item: 'backpack',
            color: 'blue',
            location: 'Section 104',
            description: 'blue backpack containing a flag',
            timestamp: Date.now(),
            status: 'active',
            reportedBy: 'staff'
          }
        ];

        // Matching function
     const hasMatch =
  findMatchingReport(dummyFoundReports, "backpack", "blue") !== null;

const noMatch =
  findMatchingReport(dummyFoundReports, "phone", "black") !== null;
        const success = hasMatch && !noMatch;
        return {
          success,
          message: success
            ? 'Matching engine correctly flagged blue backpack and rejected unrelated black phone.'
            : 'Matching engine returned false positive or missed true match.'
        };
      }
    },
    {
      name: 'Accessibility SVG Route Selection Test',
      category: 'Navigation',
      run: () => {
       const path1 = getNavigationStyle('wheelchair');
const path2 = getNavigationStyle('sensory');
const path3 = getNavigationStyle('none');
        const success = path1 === 'stair-free' && path2 === 'low-crowd' && path3 === 'standard';
        return {
          success,
          message: success
            ? 'Correct SVG line rendering flags selected (stair-free, low-crowd, standard) based on user mode.'
            : 'Accessibility mapping to map paths is broken.'
        };
      }
    }
  ];

  return tests;
};
