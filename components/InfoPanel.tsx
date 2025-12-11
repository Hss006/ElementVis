
import React from 'react';
import { ChemicalItem, ChemicalElement, Molecule, Reaction, Language } from '../types';
import { translations } from '../locales';
import { Atom, Activity, Zap, Beaker } from 'lucide-react';

interface InfoPanelProps {
  item: ChemicalItem;
  language: Language;
}

const DetailRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
    <span className="text-zinc-500 text-sm font-mono">{label}</span>
    <span className="text-zinc-200 text-sm font-medium">{value || '-'}</span>
  </div>
);

const InfoPanel: React.FC<InfoPanelProps> = ({ item, language }) => {
  const t = translations[language];
  const displayName = t[item.id] || item.name;

  return (
    <div className="h-48 md:h-full bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800 p-4 md:p-6 overflow-y-auto w-full md:w-80 flex-shrink-0">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          {item.type === 'Element' && <Atom className="w-4 h-4 text-cyan-400" />}
          {item.type === 'Molecule' && <Beaker className="w-4 h-4 text-emerald-400" />}
          {item.type === 'Reaction' && <Zap className="w-4 h-4 text-amber-400" />}
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{item.type}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{displayName}</h2>
        {item.type === 'Element' && (
          <div className="text-4xl font-mono font-bold text-zinc-700 opacity-50 absolute top-6 right-6 select-none hidden md:block">
            {(item as ChemicalElement).symbol}
          </div>
        )}
        <p className="text-zinc-400 text-sm leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="space-y-6">
        {/* Element Specifics */}
        {item.type === 'Element' && (() => {
          const el = item as ChemicalElement;
          return (
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
              <h3 className="text-cyan-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                <Activity className="w-3 h-3" /> {t.atomic_props}
              </h3>
              <DetailRow label={t.atomic_number} value={el.atomicNumber} />
              <DetailRow label={t.atomic_mass} value={el.atomicMass} />
              <DetailRow label={t.category} value={el.category} />
              <DetailRow label={t.config} value={el.electronConfiguration} />
              <DetailRow label={t.electronegativity} value={el.electronegativity} />
              <DetailRow label={t.radius} value={`${el.atomicRadius} pm`} />
            </div>
          );
        })()}

        {/* Molecule Specifics */}
        {item.type === 'Molecule' && (() => {
          const mol = item as Molecule;
          return (
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
              <h3 className="text-emerald-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                <Beaker className="w-3 h-3" /> {t.molecular_data}
              </h3>
              <DetailRow label={t.formula} value={mol.formula} />
              <DetailRow label={t.geometry} value={mol.geometry} />
              <DetailRow label={t.atom_count} value={mol.atoms.length} />
              <DetailRow label={t.bond_types} value={mol.bonds.map(b => b.type).join(', ')} />
            </div>
          );
        })()}

        {/* Reaction Specifics */}
        {item.type === 'Reaction' && (() => {
          const rxn = item as Reaction;
          return (
            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
              <h3 className="text-amber-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3" /> {t.reaction_dynamics}
              </h3>
              <div className="p-3 bg-zinc-900 rounded mb-3 border border-zinc-800 font-mono text-center text-sm text-amber-100">
                {rxn.equation}
              </div>
              <DetailRow label={t.type} value={rxn.mechanism} />
              <DetailRow label={t.thermodynamics} value={rxn.energyChange} />
              <DetailRow label={t.reactants} value={rxn.reactants.join(', ')} />
              <DetailRow label={t.products} value={rxn.products.join(', ')} />
            </div>
          );
        })()}

        <div className="p-4 rounded bg-blue-900/10 border border-blue-800/50">
          <h4 className="text-blue-400 text-xs font-bold uppercase mb-1">{t.vis_guide_title}</h4>
          <p className="text-xs text-blue-200/70">
            {t.vis_guide_text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
