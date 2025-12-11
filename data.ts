
import { ChemicalItem, ChemicalElement, Molecule, Reaction } from './types';

// --- ELEMENTS ---
const elements: ChemicalElement[] = [
  {
    id: 'H',
    type: 'Element',
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    atomicMass: 1.008,
    category: 'Non-metal',
    electronConfiguration: '1s¹',
    electronegativity: 2.20,
    atomicRadius: '53',
    shells: [{ level: 1, count: 1 }],
    color: '#FFFFFF',
    description: 'The lightest element, essential for life and star formation.',
    meltingPoint: 14,
    boilingPoint: 20
  },
  {
    id: 'C',
    type: 'Element',
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    atomicMass: 12.011,
    category: 'Non-metal',
    electronConfiguration: '[He] 2s² 2p²',
    electronegativity: 2.55,
    atomicRadius: '70',
    shells: [{ level: 1, count: 2 }, { level: 2, count: 4 }],
    color: '#9CA3AF', // Gray-400
    description: 'The backbone of organic chemistry and life as we know it.',
    meltingPoint: 3823,
    boilingPoint: 4300
  },
  {
    id: 'N',
    type: 'Element',
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    atomicMass: 14.007,
    category: 'Non-metal',
    electronConfiguration: '[He] 2s² 2p³',
    electronegativity: 3.04,
    atomicRadius: '65',
    shells: [{ level: 1, count: 2 }, { level: 2, count: 5 }],
    color: '#3B82F6', // Blue-500
    description: 'Makes up 78% of Earth’s atmosphere; vital for amino acids.',
    meltingPoint: 63,
    boilingPoint: 77
  },
  {
    id: 'O',
    type: 'Element',
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    atomicMass: 15.999,
    category: 'Non-metal',
    electronConfiguration: '[He] 2s² 2p⁴',
    electronegativity: 3.44,
    atomicRadius: '60',
    shells: [{ level: 1, count: 2 }, { level: 2, count: 6 }],
    color: '#EF4444', // Red-500
    description: 'Highly reactive non-metal and oxidizing agent.',
    meltingPoint: 54,
    boilingPoint: 90
  },
  {
    id: 'Na',
    type: 'Element',
    symbol: 'Na',
    name: 'Sodium',
    atomicNumber: 11,
    atomicMass: 22.990,
    category: 'Alkali Metal',
    electronConfiguration: '[Ne] 3s¹',
    electronegativity: 0.93,
    atomicRadius: '180',
    shells: [{ level: 1, count: 2 }, { level: 2, count: 8 }, { level: 3, count: 1 }],
    color: '#FCD34D', // Yellow-300
    description: 'Soft, silvery-white, highly reactive metal.',
    meltingPoint: 370,
    boilingPoint: 1156
  },
  {
    id: 'Cl',
    type: 'Element',
    symbol: 'Cl',
    name: 'Chlorine',
    atomicNumber: 17,
    atomicMass: 35.45,
    category: 'Halogen',
    electronConfiguration: '[Ne] 3s² 3p⁵',
    electronegativity: 3.16,
    atomicRadius: '100',
    shells: [{ level: 1, count: 2 }, { level: 2, count: 8 }, { level: 3, count: 7 }],
    color: '#A3E635', // Lime-400
    description: 'Yellow-green gas under standard conditions, powerful oxidant.',
    meltingPoint: 171,
    boilingPoint: 239
  },
  {
    id: 'Au',
    type: 'Element',
    symbol: 'Au',
    name: 'Gold',
    atomicNumber: 79,
    atomicMass: 196.97,
    category: 'Transition Metal',
    electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
    electronegativity: 2.54,
    atomicRadius: '135',
    shells: [{ level: 1, count: 2 }, { level: 2, count: 8 }, { level: 3, count: 18 }, { level: 4, count: 32 }, { level: 5, count: 18 }, { level: 6, count: 1 }],
    color: '#F59E0B', // Amber-500
    description: 'Dense, soft, malleable, and ductile metal with a bright yellow luster.',
    meltingPoint: 1337,
    boilingPoint: 3129
  },
  {
    id: 'U',
    type: 'Element',
    symbol: 'U',
    name: 'Uranium',
    atomicNumber: 92,
    atomicMass: 238.03,
    category: 'Actinide',
    electronConfiguration: '[Rn] 5f³ 6d¹ 7s²',
    electronegativity: 1.38,
    atomicRadius: '175',
    shells: [{ level: 1, count: 2 }, { level: 2, count: 8 }, { level: 3, count: 18 }, { level: 4, count: 32 }, { level: 5, count: 21 }, { level: 6, count: 9 }, { level: 7, count: 2 }],
    color: '#10B981', // Emerald-500
    description: 'Silvery-grey metal in the actinide series, weakly radioactive.',
    meltingPoint: 1405,
    boilingPoint: 4404
  }
];

// --- MOLECULES ---
const molecules: Molecule[] = [
  {
    id: 'H2O',
    type: 'Molecule',
    name: 'Water',
    formula: 'H₂O',
    geometry: 'Bent',
    description: 'Universal solvent essential for all known forms of life.',
    atoms: [
      { elementId: 'O', x: 0, y: -10 },
      { elementId: 'H', x: -40, y: 30 },
      { elementId: 'H', x: 40, y: 30 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'single' },
      { from: 0, to: 2, type: 'single' }
    ]
  },
  {
    id: 'O2',
    type: 'Molecule',
    name: 'Oxygen (Diatomic)',
    formula: 'O₂',
    geometry: 'Linear',
    description: 'The form of oxygen humans breathe and is required for combustion.',
    atoms: [
      { elementId: 'O', x: -30, y: 0 },
      { elementId: 'O', x: 30, y: 0 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' }
    ]
  },
  {
    id: 'CO2',
    type: 'Molecule',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    geometry: 'Linear',
    description: 'Trace gas in Earth\'s atmosphere, vital for the carbon cycle.',
    atoms: [
      { elementId: 'C', x: 0, y: 0 },
      { elementId: 'O', x: -60, y: 0 },
      { elementId: 'O', x: 60, y: 0 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'double' }
    ]
  },
  {
    id: 'NaCl',
    type: 'Molecule',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    geometry: 'Face-Centered Cubic',
    description: 'Common salt. Ionic compound consisting of a 1:1 ratio of sodium and chloride ions.',
    atoms: [
      { elementId: 'Na', x: -30, y: 0 },
      { elementId: 'Cl', x: 30, y: 0 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'ionic' }
    ]
  },
  {
    id: 'CH4',
    type: 'Molecule',
    name: 'Methane',
    formula: 'CH₄',
    geometry: 'Tetrahedral',
    description: 'The simplest alkane and the main constituent of natural gas.',
    atoms: [
      { elementId: 'C', x: 0, y: 0 },
      { elementId: 'H', x: 0, y: -50 },
      { elementId: 'H', x: -45, y: 35 },
      { elementId: 'H', x: 45, y: 35 },
    ],
    bonds: [
      { from: 0, to: 1, type: 'single' },
      { from: 0, to: 2, type: 'single' },
      { from: 0, to: 3, type: 'single' }
    ]
  },
  {
    id: 'C6H6',
    type: 'Molecule',
    name: 'Benzene',
    formula: 'C₆H₆',
    geometry: 'Planar Hexagon',
    description: 'Important organic chemical compound with a ring structure.',
    atoms: [
      // Ring
      { elementId: 'C', x: 0, y: -60 },
      { elementId: 'C', x: 52, y: -30 },
      { elementId: 'C', x: 52, y: 30 },
      { elementId: 'C', x: 0, y: 60 },
      { elementId: 'C', x: -52, y: 30 },
      { elementId: 'C', x: -52, y: -30 },
      // Hydrogens
      { elementId: 'H', x: 0, y: -90 },
      { elementId: 'H', x: 78, y: -45 },
      { elementId: 'H', x: 78, y: 45 },
      { elementId: 'H', x: 0, y: 90 },
      { elementId: 'H', x: -78, y: 45 },
      { elementId: 'H', x: -78, y: -45 },
    ],
    bonds: [
      // Carbon Ring
      { from: 0, to: 1, type: 'double' },
      { from: 1, to: 2, type: 'single' },
      { from: 2, to: 3, type: 'double' },
      { from: 3, to: 4, type: 'single' },
      { from: 4, to: 5, type: 'double' },
      { from: 5, to: 0, type: 'single' },
      // Hydrogens
      { from: 0, to: 6, type: 'single' },
      { from: 1, to: 7, type: 'single' },
      { from: 2, to: 8, type: 'single' },
      { from: 3, to: 9, type: 'single' },
      { from: 4, to: 10, type: 'single' },
      { from: 5, to: 11, type: 'single' },
    ]
  },
  {
    id: 'HCl',
    type: 'Molecule',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    geometry: 'Linear',
    description: 'Colorless gas, forms white fumes of hydrochloric acid upon contact with atmospheric water vapor.',
    atoms: [
      { elementId: 'Cl', x: 0, y: 0 },
      { elementId: 'H', x: 40, y: 0 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'single' }
    ]
  },
  {
    id: 'NaOH',
    type: 'Molecule',
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    geometry: 'Linear (Approx)',
    description: 'A highly caustic metallic base and alkali salt.',
    atoms: [
      { elementId: 'Na', x: -40, y: 0 },
      { elementId: 'O', x: 10, y: 0 },
      { elementId: 'H', x: 40, y: 0 }
    ],
    bonds: [
      { from: 0, to: 1, type: 'ionic' },
      { from: 1, to: 2, type: 'single' }
    ]
  }
];

// --- REACTIONS ---
const reactions: Reaction[] = [
  {
    id: 'ionic_bonding',
    type: 'Reaction',
    name: 'Ionic Bonding (Na + Cl)',
    equation: 'Na + Cl → Na⁺ + Cl⁻ → NaCl',
    description: 'Electron transfer from Sodium to Chlorine, creating electrostatic attraction.',
    reactants: ['Na', 'Cl'],
    products: ['NaCl'],
    energyChange: 'Exothermic',
    mechanism: 'transfer'
  },
  {
    id: 'combustion',
    type: 'Reaction',
    name: 'Methane Combustion',
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    description: 'Rapid oxidation of methane producing carbon dioxide, water, and heat energy.',
    reactants: ['CH4', 'O2'],
    products: ['CO2', 'H2O'],
    energyChange: 'Highly Exothermic',
    mechanism: 'break-form'
  },
  {
    id: 'neutralization',
    type: 'Reaction',
    name: 'Neutralization',
    equation: 'HCl + NaOH → NaCl + H₂O',
    description: 'Acid and base react to form salt and water.',
    reactants: ['HCl', 'NaOH'], 
    products: ['NaCl', 'H2O'],
    energyChange: 'Exothermic',
    mechanism: 'break-form'
  },
  {
    id: 'nuclear_decay',
    type: 'Reaction',
    name: 'Alpha Decay',
    equation: '²³⁸U → ²³⁴Th + ⁴He',
    description: 'Uranium nucleus emits an alpha particle (Helium nucleus) to become Thorium.',
    reactants: ['U'],
    products: [], 
    energyChange: 'Nuclear',
    mechanism: 'decay'
  }
];

export const allItems: ChemicalItem[] = [...elements, ...molecules, ...reactions];

export const getElementById = (id: string): ChemicalElement | undefined => 
  elements.find(e => e.id === id);

export const getMoleculeById = (id: string): Molecule | undefined =>
  molecules.find(m => m.id === id);
