
export type ItemType = 'Element' | 'Molecule' | 'Reaction';

export type Language = 'EN' | 'FR' | 'ES' | 'DE' | 'JA' | 'PT' | 'IT' | 'ZH';

export interface ElectronShell {
  level: number;
  count: number;
}

export interface ChemicalElement {
  id: string;
  type: 'Element';
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  category: string; // e.g., Alkali Metal, Noble Gas
  electronConfiguration: string;
  electronegativity?: number;
  atomicRadius?: string; // in pm
  shells: ElectronShell[];
  color: string; // Hex color for CPK or thematic
  description: string;
  meltingPoint?: number; // Kelvin
  boilingPoint?: number; // Kelvin
}

export interface AtomPosition {
  elementId: string;
  x: number;
  y: number;
  scale?: number;
}

export interface Molecule {
  id: string;
  type: 'Molecule';
  name: string;
  formula: string;
  atoms: AtomPosition[];
  bonds: { from: number; to: number; type: 'single' | 'double' | 'ionic' }[]; // Indices in the atoms array
  description: string;
  geometry: string; // e.g., Linear, Bent
}

export interface Reaction {
  id: string;
  type: 'Reaction';
  name: string;
  equation: string;
  description: string;
  reactants: string[]; // IDs of elements/molecules
  products: string[]; // IDs
  energyChange: string; // e.g., Exothermic
  mechanism: 'transfer' | 'break-form' | 'decay';
}

export type ChemicalItem = ChemicalElement | Molecule | Reaction;
