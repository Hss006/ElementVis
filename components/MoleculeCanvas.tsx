
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChemicalItem, ChemicalElement, Molecule, Reaction, Language } from '../types';
import { getElementById, getMoleculeById } from '../data';
import { translations } from '../locales';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface MoleculeCanvasProps {
  item: ChemicalItem;
  temperature: number;
  isAnimated: boolean;
  language: Language;
}

// --- SUB-COMPONENTS ---

const ElectronOrbit: React.FC<{
  radius: number;
  duration: number; // seconds for full rotation
  electrons: number;
  color: string;
  isAnimated: boolean;
}> = ({ radius, duration, electrons, color, isAnimated }) => {
  // Safeguard against NaN or Infinity
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 5;

  return (
    <motion.g>
      {/* Orbital Path */}
      <circle
        cx={0}
        cy={0}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.2}
      />

      {/* Electrons */}
      {Array.from({ length: electrons }).map((_, i) => (
        <motion.g
          key={i}
          initial={{ rotate: (360 / electrons) * i }}
          animate={isAnimated ? { rotate: (360 / electrons) * i + 360 } : { rotate: (360 / electrons) * i }}
          transition={isAnimated ? {
            repeat: Infinity,
            duration: safeDuration,
            ease: "linear"
          } : { duration: 0 }}
        >
          {/* Invisible Anchor to force rotation around center */}
          <circle cx={0} cy={0} r={radius} stroke="none" fill="none" />

          {/* Actual Electron */}
          <motion.circle
            cx={radius}
            cy={0}
            r={3} // Electron size
            fill="#22d3ee" // Cyan-400
            filter="url(#electronGlow)"
            animate={isAnimated ? {
              r: [3, 4, 3],
              opacity: [0.8, 1, 0.8]
            } : {
              r: 3,
              opacity: 1
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5 // Offset pulsing
            }}
          />
        </motion.g>
      ))}
    </motion.g>
  );
};

const AtomNode: React.FC<{ 
  element: ChemicalElement; 
  x: number; 
  y: number; 
  scale?: number; 
  temperature: number;
  showSymbol?: boolean;
  isAnimated: boolean;
}> = ({ element, x, y, scale = 1, temperature, showSymbol = true, isAnimated }) => {
  
  // Vibration logic based on temperature
  // Safe temperature fallback
  const safeTemp = Number.isFinite(temperature) ? temperature : 300;
  const vibration = (safeTemp / 1000) * 5 + 0.5;

  // Orbit speed modifier: Higher temp = faster speed (lower duration)
  const speedModifier = Math.max(0.1, 1 - (safeTemp / 3000));

  // Stable random animation values to prevent re-render jitter
  const animXDuration = useMemo(() => 0.2 + (Math.random() * 0.1), []);
  const animYDuration = useMemo(() => 0.25 + (Math.random() * 0.1), []);

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={isAnimated ? { 
        opacity: 1, 
        scale: scale,
        x: [x - vibration, x + vibration, x], 
        y: [y - vibration, y + vibration, y]
      } : {
        opacity: 1,
        scale: scale,
        x: x,
        y: y
      }}
      transition={isAnimated ? { 
        scale: { duration: 0.5 },
        x: { repeat: Infinity, duration: animXDuration, repeatType: 'reverse' },
        y: { repeat: Infinity, duration: animYDuration, repeatType: 'reverse' }
      } : { duration: 0.5 }}
    >
      {/* Nucleus Glow */}
      <circle r={10 * scale} fill={element.color} fillOpacity={0.3} filter="url(#glow)" />
      
      {/* Nucleus Core */}
      <circle r={6 * scale} fill={element.color} />
      
      {/* Symbol */}
      {showSymbol && (
        <text 
          y={2} 
          textAnchor="middle" 
          alignmentBaseline="middle" 
          fill="#000" 
          fontSize={6 * scale} 
          fontWeight="bold"
          className="pointer-events-none"
        >
          {element.symbol}
        </text>
      )}

      {/* Electron Shells & Electrons */}
      {element.shells.map((shell, i) => {
        const radius = 15 * scale + (i * 10 * scale);
        // Base speed: inner shells faster visually for effect
        const baseDuration = 5 + i * 2;
        const currentDuration = baseDuration * speedModifier;

        return (
          <ElectronOrbit
            key={i}
            radius={radius}
            duration={currentDuration}
            electrons={shell.count}
            color={element.color}
            isAnimated={isAnimated}
          />
        );
      })}
    </motion.g>
  );
};

const MoleculeView: React.FC<{ molecule: Molecule; temperature: number; isAnimated: boolean }> = ({ molecule, temperature, isAnimated }) => {
  return (
    <g>
      {/* Bonds */}
      {molecule.bonds.map((bond, i) => {
        const fromAtom = molecule.atoms[bond.from];
        const toAtom = molecule.atoms[bond.to];
        
        return (
          <motion.line
            key={i}
            x1={fromAtom.x}
            y1={fromAtom.y}
            x2={toAtom.x}
            y2={toAtom.y}
            stroke="#52525b" // Zinc-600
            strokeWidth={bond.type === 'double' ? 6 : 3}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        );
      })}
      
      {/* Double Bond Spacers (Visual trick) */}
      {molecule.bonds.filter(b => b.type === 'double').map((bond, i) => {
        const fromAtom = molecule.atoms[bond.from];
        const toAtom = molecule.atoms[bond.to];
        return (
           <motion.line
            key={`double-${i}`}
            x1={fromAtom.x}
            y1={fromAtom.y}
            x2={toAtom.x}
            y2={toAtom.y}
            stroke="#09090b" // Zinc-950 (Background color to split the thick line)
            strokeWidth={2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        )
      })}

      {/* Atoms */}
      {molecule.atoms.map((atomPos, i) => {
        const el = getElementById(atomPos.elementId);
        if (!el) return null;
        return (
          <AtomNode 
            key={i} 
            element={el} 
            x={atomPos.x} 
            y={atomPos.y} 
            temperature={temperature}
            isAnimated={isAnimated}
          />
        );
      })}
    </g>
  );
};

const ReactionView: React.FC<{ reaction: Reaction; temperature: number; isAnimated: boolean; language: Language }> = ({ reaction, temperature, isAnimated, language }) => {
  const t = translations[language];

  // --- METHANE COMBUSTION ANIMATION ---
  if (reaction.id === 'combustion') {
    const c = getElementById('C');
    const h = getElementById('H');
    const o = getElementById('O');

    if (!c || !h || !o) return null;

    // We manually construct the scene here for the animation
    return (
      <g>
         {/* --- REACTANTS PHASE (Fade Out) --- */}
         <motion.g
           initial={{ opacity: 1, scale: 1 }}
           animate={isAnimated ? { 
             opacity: [1, 1, 0, 0, 0], 
             scale: [1, 0.8, 0.5, 0, 0],
             x: [0, 50, 0, 0, 0] // Move towards center
           } : { opacity: 1, scale: 1, x: 0 }}
           transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 1] }}
         >
            {/* CH4 (Methane) - Left */}
            <g transform="translate(-100, 0)">
               {/* Bonds */}
               <line x1={0} y1={0} x2={0} y2={-40} stroke="#555" strokeWidth={3} />
               <line x1={0} y1={0} x2={-35} y2={30} stroke="#555" strokeWidth={3} />
               <line x1={0} y1={0} x2={35} y2={30} stroke="#555" strokeWidth={3} />
               <line x1={0} y1={0} x2={0} y2={40} stroke="#555" strokeWidth={3} /> {/* 4th H visualized flat */}
               {/* Atoms */}
               <AtomNode element={c} x={0} y={0} temperature={temperature} isAnimated={isAnimated} scale={0.8} />
               <AtomNode element={h} x={0} y={-40} temperature={temperature} isAnimated={isAnimated} scale={0.6} />
               <AtomNode element={h} x={-35} y={30} temperature={temperature} isAnimated={isAnimated} scale={0.6} />
               <AtomNode element={h} x={35} y={30} temperature={temperature} isAnimated={isAnimated} scale={0.6} />
               <AtomNode element={h} x={0} y={40} temperature={temperature} isAnimated={isAnimated} scale={0.6} />
            </g>

            {/* 2 O2 (Oxygen) - Top/Bottom Left */}
            <g transform="translate(-100, -120)">
               <line x1={-20} y1={0} x2={20} y2={0} stroke="#555" strokeWidth={5} />
               <AtomNode element={o} x={-20} y={0} temperature={temperature} isAnimated={isAnimated} scale={0.7} />
               <AtomNode element={o} x={20} y={0} temperature={temperature} isAnimated={isAnimated} scale={0.7} />
            </g>
             <g transform="translate(-100, 120)">
               <line x1={-20} y1={0} x2={20} y2={0} stroke="#555" strokeWidth={5} />
               <AtomNode element={o} x={-20} y={0} temperature={temperature} isAnimated={isAnimated} scale={0.7} />
               <AtomNode element={o} x={20} y={0} temperature={temperature} isAnimated={isAnimated} scale={0.7} />
            </g>
         </motion.g>

         {/* --- ENERGY EXPLOSION PHASE --- */}
         <motion.circle
            cx={0} cy={0} r={5}
            fill="url(#fireGradient)"
            initial={{ opacity: 0, scale: 0 }}
            animate={isAnimated ? {
              opacity: [0, 0, 1, 0, 0],
              scale: [0, 0, 20, 25, 0]
            } : { opacity: 0 }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.8, 1] }}
         />

         {/* --- PRODUCTS PHASE (Fade In) --- */}
         <motion.g
           initial={{ opacity: 0, scale: 0 }}
           animate={isAnimated ? {
             opacity: [0, 0, 0, 1, 1],
             scale: [0, 0, 0.2, 1, 1],
             x: [0, 0, 0, 50, 50] // Move outwards
           } : { opacity: 0, scale: 0 }} // Hide products if not animated (show reactants)
           transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 0.55, 0.8, 1] }}
         >
            {/* CO2 - Center Right */}
            <g transform="translate(100, 0)">
                <line x1={-40} y1={0} x2={40} y2={0} stroke="#555" strokeWidth={5} />
                <AtomNode element={c} x={0} y={0} temperature={temperature} isAnimated={isAnimated} scale={0.8} />
                <AtomNode element={o} x={-40} y={0} temperature={temperature} isAnimated={isAnimated} scale={0.7} />
                <AtomNode element={o} x={40} y={0} temperature={temperature} isAnimated={isAnimated} scale={0.7} />
            </g>

            {/* 2 H2O - Top/Bottom Right */}
            <g transform="translate(100, -100)">
                <line x1={0} y1={-10} x2={-30} y2={20} stroke="#555" strokeWidth={3} />
                <line x1={0} y1={-10} x2={30} y2={20} stroke="#555" strokeWidth={3} />
                <AtomNode element={o} x={0} y={-10} temperature={temperature} isAnimated={isAnimated} scale={0.7} />
                <AtomNode element={h} x={-30} y={20} temperature={temperature} isAnimated={isAnimated} scale={0.6} />
                <AtomNode element={h} x={30} y={20} temperature={temperature} isAnimated={isAnimated} scale={0.6} />
            </g>
             <g transform="translate(100, 100)">
                <line x1={0} y1={-10} x2={-30} y2={20} stroke="#555" strokeWidth={3} />
                <line x1={0} y1={-10} x2={30} y2={20} stroke="#555" strokeWidth={3} />
                <AtomNode element={o} x={0} y={-10} temperature={temperature} isAnimated={isAnimated} scale={0.7} />
                <AtomNode element={h} x={-30} y={20} temperature={temperature} isAnimated={isAnimated} scale={0.6} />
                <AtomNode element={h} x={30} y={20} temperature={temperature} isAnimated={isAnimated} scale={0.6} />
            </g>
         </motion.g>

         {/* Equation Text */}
         <motion.text
            x={0} y={180}
            textAnchor="middle"
            fill="#ef4444"
            fontSize={14}
            fontFamily="monospace"
            animate={isAnimated ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
         >
            {isAnimated ? `${t.reaction_progress}: ${t.heat_release}` : t.reaction_paused}
         </motion.text>
         
         {/* Define Gradient for Fire */}
         <defs>
            <radialGradient id="fireGradient">
              <stop offset="0%" stopColor="#ffff00" />
              <stop offset="50%" stopColor="#ff9900" />
              <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
            </radialGradient>
         </defs>
      </g>
    );
  }

  // --- IONIC BONDING ANIMATION ---
  if (reaction.id === 'ionic_bonding') {
    const na = getElementById('Na');
    const cl = getElementById('Cl');
    
    // Safety check
    if (!na || !cl) return null;

    return (
      <g>
        {/* Container to center the reaction */}
        <motion.g transform="translate(-100, 0)">
          {/* Sodium Atom */}
          <AtomNode element={na} x={0} y={0} temperature={temperature} isAnimated={isAnimated} />
          
          {/* Chlorine Atom */}
          <g transform="translate(200, 0)">
            <AtomNode element={cl} x={0} y={0} temperature={temperature} isAnimated={isAnimated} />
          </g>

          {/* Electron Transfer Animation */}
          {isAnimated && (
            <motion.circle 
              r={5} 
              fill="#22d3ee"
              filter="url(#electronGlow)"
              initial={{ cx: 45, cy: 0, opacity: 1 }} // Start at Na outer shell (approx)
              animate={{ 
                cx: [45, 100, 155], // Move to Cl outer shell
                cy: [0, -20, 0], // Arc path
                opacity: [1, 1, 0] // Fade out upon arrival (assimilated)
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1
              }}
            />
          )}

          {/* Reaction Text */}
          <motion.text
             x={100}
             y={150}
             textAnchor="middle"
             fill="#22d3ee"
             fontSize={12}
             fontFamily="monospace"
             animate={isAnimated ? { opacity: [0, 1, 0] } : { opacity: 0 }}
             transition={{ duration: 3, repeat: Infinity }}
          >
             {t.electron_transfer}: Na → Cl
          </motion.text>
        </motion.g>
      </g>
    );
  }

  // --- GENERIC REACTION VIEW ---
  return (
    <g>
      {/* Fallback for other reactions (pulsing ring) */}
      <motion.circle
        r={100}
        fill="none"
        stroke="#eab308" // Yellow-500
        strokeWidth={2}
        animate={isAnimated ? { scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <text x={0} y={0} textAnchor="middle" fill="#fff" fontSize={24} fontWeight="bold">
        {reaction.name}
      </text>
      {isAnimated && (
        <text x={0} y={40} textAnchor="middle" fill="#eab308" fontSize={14}>
          {t.reaction_progress}
        </text>
      )}
    </g>
  );
};

// --- MAIN COMPONENT ---

const MoleculeCanvas: React.FC<MoleculeCanvasProps> = ({ item, temperature, isAnimated, language }) => {
  const [zoom, setZoom] = useState(1);
  const baseSize = 600; // Increased base canvas size for larger atoms
  const t = translations[language];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleReset = () => setZoom(1);

  // Default values to prevent NaN
  const safeTemp = Number.isFinite(temperature) ? temperature : 300;

  return (
    <div className="w-full h-full flex items-center justify-center relative group overflow-hidden">
      
      {/* Canvas Label */}
      <div className="absolute top-4 left-4 font-mono text-xs text-zinc-600 pointer-events-none">
        {t.canvas_render}: {item.type.toUpperCase()}
      </div>

      <svg 
        width="100%" 
        height="100%" 
        viewBox={`${-(baseSize/2) / zoom} ${-(baseSize/2) / zoom} ${baseSize / zoom} ${baseSize / zoom}`}
        className="transition-all duration-300 ease-out"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="electronGlow" x="-100%" y="-100%" width="300%" height="300%">
             <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
             <feMerge>
               <feMergeNode in="coloredBlur" />
               <feMergeNode in="SourceGraphic" />
             </feMerge>
          </filter>
        </defs>

        {item.type === 'Element' && (
          <AtomNode 
            element={item as ChemicalElement} 
            x={0} 
            y={0} 
            scale={1.5} 
            temperature={safeTemp}
            isAnimated={isAnimated}
          />
        )}

        {item.type === 'Molecule' && (
          <MoleculeView 
            molecule={item as Molecule} 
            temperature={safeTemp}
            isAnimated={isAnimated}
          />
        )}

        {item.type === 'Reaction' && (
          <ReactionView 
            reaction={item as Reaction} 
            temperature={safeTemp} 
            isAnimated={isAnimated}
            language={language}
          />
        )}
      </svg>

      {/* Temp/State Indicator - Bottom Right */}
      <div className="absolute bottom-4 right-4 text-xs font-mono text-zinc-700 pointer-events-none">
        {t.temp}: {safeTemp}K
      </div>

      {/* Zoom Controls - Bottom Left */}
      <div className="absolute bottom-6 left-6 flex items-center gap-1 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-lg p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handleZoomOut}
          className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <div className="w-12 text-center font-mono text-xs text-zinc-500 select-none cursor-pointer" onClick={handleReset} title="Reset Zoom">
          {Math.round(zoom * 100)}%
        </div>
        <button 
          onClick={handleZoomIn}
          className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
      </div>

    </div>
  );
};

export default MoleculeCanvas;
