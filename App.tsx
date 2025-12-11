import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import ElementList from './components/ElementList';
import InfoPanel from './components/InfoPanel';
import MoleculeCanvas from './components/MoleculeCanvas';
import { allItems } from './data';
import { ChemicalItem, ChemicalElement, Language } from './types';
import { translations } from './locales';
import { Thermometer, Play, Pause, AlertTriangle, Globe, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

// --- Error Boundary Component ---
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-400 font-mono flex-col gap-4 p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
          <h2 className="text-xl font-bold text-white">Something went wrong.</h2>
          <p className="max-w-md text-sm bg-zinc-900 p-4 rounded border border-zinc-800 text-left overflow-auto">
            {this.state.error?.message || "Unknown Application Error"}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors mt-4"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Main App Component ---
function AppContent() {
  // Use optional chaining fallback for safety during hot-reload/init
  const [selectedItem, setSelectedItem] = useState<ChemicalItem | undefined>(allItems?.[0]);
  const [temperature, setTemperature] = useState<number>(25); // Slider 0-100
  const [isAnimated, setIsAnimated] = useState<boolean>(true);
  const [lang, setLang] = useState<Language>('EN');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Safety check for translations
  const t = translations[lang] || translations['EN'];

  if (!selectedItem) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-500 font-mono flex-col gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        <span>Initializing Lab Data...</span>
      </div>
    );
  }

  const getStateOfMatter = (tempSliderValue: number, item: ChemicalItem) => {
    // 0-100 slider -> 0-2000K scale
    const tempK = (tempSliderValue || 0) * 20;

    // Type guard for Element
    if (item.type === 'Element') {
      const el = item as ChemicalElement;
      if (el.meltingPoint !== undefined && el.boilingPoint !== undefined) {
         if (tempK < el.meltingPoint) return t.solid;
         if (tempK < el.boilingPoint) return t.liquid;
         return t.gas;
      }
    }
    
    // Default/Fallback Logic
    if (tempK < 273) return t.solid;
    if (tempK < 373) return t.liquid;
    return t.gas;
  };

  const currentState = getStateOfMatter(temperature, selectedItem);
  const tempK = (temperature || 0) * 20;

  const languages: { code: Language; label: string }[] = [
    { code: 'EN', label: 'English' },
    { code: 'FR', label: 'Français' },
    { code: 'ES', label: 'Español' },
    { code: 'DE', label: 'Deutsch' },
    { code: 'JA', label: '日本語' },
    { code: 'PT', label: 'Português' },
    { code: 'IT', label: 'Italiano' },
    { code: 'ZH', label: '中文' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <ElementList 
        onSelect={setSelectedItem} 
        selectedId={selectedItem.id}
        language={lang} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Toolbar / Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 sm:px-6 bg-zinc-950/50 backdrop-blur z-20">
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span className="font-mono text-cyan-500 hidden sm:inline">{t.mode_vis}</span>
            <span className="w-px h-4 bg-zinc-700 hidden sm:block"></span>
            <span className="truncate max-w-[80px] sm:max-w-none font-medium text-zinc-200 sm:text-zinc-400">
              {/* Type Assertion for category safe access */}
              {selectedItem.type === 'Element' ? (selectedItem as ChemicalElement).category : selectedItem.type}
            </span>
          </div>

          {/* Controls Group */}
          <div className="flex items-center gap-2 sm:gap-6">
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all text-xs text-zinc-400 hover:text-white"
              >
                <Globe className="w-3 h-3" />
                <span>{lang}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>
              
              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangMenuOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded shadow-xl py-1 z-20">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={clsx(
                          "w-full text-left px-4 py-2 text-xs hover:bg-zinc-800 transition-colors",
                          lang === l.code ? "text-cyan-400" : "text-zinc-400"
                        )}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Animation Toggle */}
            <button 
                onClick={() => setIsAnimated(!isAnimated)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
                title={isAnimated ? t.simulation_on : t.simulation_paused}
            >
                {isAnimated ? <Pause className="w-3 h-3 text-cyan-400" fill="currentColor" /> : <Play className="w-3 h-3 text-zinc-500 group-hover:text-cyan-400" fill="currentColor" />}
                <span className={`text-[10px] font-bold tracking-wider ${isAnimated ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-cyan-400'} hidden sm:block`}>
                    {isAnimated ? t.simulation_on : t.simulation_paused}
                </span>
            </button>

            {/* Temperature Control */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-400 hidden lg:flex">
                <Thermometer className="w-4 h-4" />
                <span className="text-xs font-mono uppercase">{t.system_energy}</span>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={temperature} 
                    onChange={(e) => setTemperature(parseInt(e.target.value) || 0)}
                    className="w-24 sm:w-32 md:w-48 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
                />
                <div className="flex justify-between w-full text-[10px] font-mono text-cyan-400">
                    <span>{tempK}K</span>
                    <span className="text-zinc-500 hidden sm:inline">{t.state}: <span className="text-zinc-300">{currentState}</span></span>
                </div>
                </div>
            </div>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
          
          {/* Grid Background Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

          <div className="absolute inset-0 p-4 md:p-8 flex items-center justify-center">
             <MoleculeCanvas item={selectedItem} temperature={tempK} isAnimated={isAnimated} language={lang} />
          </div>
        </div>
      </main>

      {/* Info Panel */}
      <InfoPanel item={selectedItem} language={lang} />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}