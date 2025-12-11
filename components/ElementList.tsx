
import React from 'react';
import { allItems } from '../data';
import { ChemicalItem, Language } from '../types';
import { translations } from '../locales';
import { FlaskConical, Atom, Flame } from 'lucide-react';
import clsx from 'clsx';

interface ElementListProps {
  onSelect: (item: ChemicalItem) => void;
  selectedId: string;
  language: Language;
}

interface ListItemProps {
  item: ChemicalItem;
  label: string; // Dynamic translated label
  icon: any;
  onSelect: (item: ChemicalItem) => void;
  selectedId: string;
}

const ListItem: React.FC<ListItemProps> = ({ item, label, icon: Icon, onSelect, selectedId }) => (
  <button
    onClick={() => onSelect(item)}
    className={clsx(
      "w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-all border-l-2",
      selectedId === item.id 
        ? "bg-zinc-800/50 border-cyan-500 text-cyan-100" 
        : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
    )}
  >
    <Icon className={clsx("w-4 h-4", selectedId === item.id ? "text-cyan-400" : "text-zinc-600")} />
    <span>{label}</span>
  </button>
);

const ElementList: React.FC<ElementListProps> = ({ onSelect, selectedId, language }) => {
  const elements = allItems.filter(i => i.type === 'Element');
  const molecules = allItems.filter(i => i.type === 'Molecule');
  const reactions = allItems.filter(i => i.type === 'Reaction');
  
  const t = translations[language];

  const getLabel = (item: ChemicalItem) => t[item.id] || item.name;

  return (
    <div className="w-full md:w-64 bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col h-48 md:h-full flex-shrink-0">
      <div className="p-4 md:p-6 border-b border-zinc-800">
        <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
          <FlaskConical className="text-cyan-400" /> {t.app_title}
        </h1>
        <p className="text-xs text-zinc-500 mt-1 hidden md:block">{t.subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="py-2 md:py-4">
          <h3 className="px-4 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">{t.periodic_table}</h3>
          {elements.map(e => <ListItem key={e.id} item={e} label={getLabel(e)} icon={Atom} onSelect={onSelect} selectedId={selectedId} />)}
        </div>

        <div className="py-2 md:py-4 border-t border-zinc-800">
          <h3 className="px-4 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">{t.compounds}</h3>
          {molecules.map(m => <ListItem key={m.id} item={m} label={getLabel(m)} icon={FlaskConical} onSelect={onSelect} selectedId={selectedId} />)}
        </div>

        <div className="py-2 md:py-4 border-t border-zinc-800">
          <h3 className="px-4 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">{t.reactions}</h3>
          {reactions.map(r => <ListItem key={r.id} item={r} label={getLabel(r)} icon={Flame} onSelect={onSelect} selectedId={selectedId} />)}
        </div>
      </div>

      <div className="p-2 md:p-4 border-t border-zinc-800 text-[10px] text-zinc-600 text-center hidden md:block">
        {t.data_sources}<br/>
        v1.2.0
      </div>
    </div>
  );
};

export default ElementList;
