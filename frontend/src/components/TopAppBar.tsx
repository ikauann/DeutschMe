import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function TopAppBar() {
  const { level, setLevel } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const levels: ('A1' | 'A2' | 'B1' | 'B2' | 'C1')[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">language</span>
          <span className="text-primary font-extrabold tracking-tighter text-2xl">DeutschMe</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-sm font-bold tracking-tight flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            >
              <span className="text-[10px] uppercase opacity-80">Level</span>
              <span>{level}</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-surface-container-lowest shadow-lg rounded-xl overflow-hidden min-w-[80px] border border-outline-variant/20 z-50">
                {levels.map(l => (
                  <button 
                    key={l}
                    onClick={() => { setLevel(l); setDropdownOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm font-semibold hover:bg-surface-container-high transition-colors ${level === l ? 'text-primary' : 'text-on-surface'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setSettingsOpen(true)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors text-outline">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 z-[100] bg-on-surface/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setSettingsOpen(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-outline hover:bg-surface-container-high rounded-full">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <h2 className="text-xl font-bold text-on-surface mb-6">Configurações</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                <span className="font-semibold text-on-surface">Modo Escuro</span>
                <input type="checkbox" className="w-10 h-6 border-none bg-outline-variant rounded-full appearance-none relative checked:bg-primary" />
              </div>
              <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                <span className="font-semibold text-on-surface">Voz da Máquina</span>
                <select className="bg-transparent text-primary font-bold focus:ring-0 px-2 py-1 outline-none text-right">
                  <option>Marilyn (DE)</option>
                  <option>Klaus (DE)</option>
                </select>
              </div>
              <button onClick={() => { alert('Histórico Limpo!'); setSettingsOpen(false) }} className="w-full text-left p-4 bg-error-container text-on-error-container font-semibold rounded-xl flex items-center justify-between">
                Limpar Histórico Local
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
