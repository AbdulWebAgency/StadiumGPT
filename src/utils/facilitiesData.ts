import type { Facility } from '../types';

export const facilities: Facility[] = [
  {
    id: 'fac_food_1',
    name: 'Green Kick Burger',
    type: 'food',
    location: 'Concourse Level, Section 112',
    gate: 'A',
    details: 'Halal, Vegan, Vegetarian & Gluten-Free options available. Serves organic soft drinks.',
    wheelchairAccessible: true,
    strollerFriendly: true,
    sensoryFriendly: false,
    crowdLevel: 'low'
  },
  {
    id: 'fac_food_2',
    name: 'Copa Hotdogs & Pretzels',
    type: 'food',
    location: 'Upper Level, Section 234',
    gate: 'B',
    details: 'Traditional stadium hotdogs, salted pretzels, nachos, and beers. Access involves steep stairs.',
    wheelchairAccessible: false,
    strollerFriendly: false,
    sensoryFriendly: false,
    crowdLevel: 'high'
  },
  {
    id: 'fac_water_1',
    name: 'Hydration Station A',
    type: 'water',
    location: 'Concourse Level, Section 102 (Near Gate A Entrance)',
    gate: 'A',
    details: 'Free drinking water refilling fountain. ADA height-compliant sensor faucet.',
    wheelchairAccessible: true,
    strollerFriendly: true,
    sensoryFriendly: true,
    crowdLevel: 'low'
  },
  {
    id: 'fac_water_2',
    name: 'Hydration Station B',
    type: 'water',
    location: 'Upper Level, Section 224',
    gate: 'D',
    details: 'Hydration fountain. Escalator access only.',
    wheelchairAccessible: false,
    strollerFriendly: false,
    sensoryFriendly: false,
    crowdLevel: 'medium'
  },
  {
    id: 'fac_rest_1',
    name: 'Section 104 Family Restrooms',
    type: 'restroom',
    location: 'Concourse Level, Section 104',
    gate: 'A',
    details: 'All-gender family units, automated hand-washing stations, infant changing tables, wide ADA doorways.',
    wheelchairAccessible: true,
    strollerFriendly: true,
    sensoryFriendly: true,
    crowdLevel: 'medium'
  },
  {
    id: 'fac_rest_2',
    name: 'Section 212 Restrooms',
    type: 'restroom',
    location: 'Upper Level, Section 212',
    gate: 'B',
    details: 'Standard gendered public restrooms. Escalator or stairs access only.',
    wheelchairAccessible: false,
    strollerFriendly: false,
    sensoryFriendly: false,
    crowdLevel: 'low'
  },
  {
    id: 'fac_quiet_1',
    name: 'Section 140 Sensory Room & Quiet Zone',
    type: 'quiet',
    location: 'Concourse Level, Section 140',
    gate: 'C',
    details: 'Soundproofed decompression suite, soft dimming lights, sensory bags (ear protectors, fidget tools), stroller storage.',
    wheelchairAccessible: true,
    strollerFriendly: true,
    sensoryFriendly: true,
    crowdLevel: 'low'
  },
  {
    id: 'fac_med_1',
    name: 'Section 101 Medical & First Aid Station',
    type: 'medical',
    location: 'Concourse Level, Section 101 (Direct exit to Gate A)',
    gate: 'A',
    details: 'Emergency clinic, defibrillators, wheelchair transfers, trauma team, paramedic coordination.',
    wheelchairAccessible: true,
    strollerFriendly: true,
    sensoryFriendly: false,
    crowdLevel: 'low'
  }
];
