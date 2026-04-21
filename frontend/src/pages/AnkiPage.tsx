import { useState } from 'react'

export default function AnkiPage() {
  const [selected, setSelected] = useState<number[]>([1, 3])
  const [downloading, setDownloading] = useState(false)
  
  const vocabList = [
    { id: 1, term: 'der Bahnhof', translation: 'a estação de trem', level: 'A1', context: 'Ich fahre zum Bahnhof.' },
    { id: 2, term: 'vielleicht', translation: 'talvez', level: 'A2', context: 'Vielleicht gehen wir morgen ins Kino.' },
    { id: 3, term: 'die Herausforderung', translation: 'o desafio', level: 'B2', context: 'Das ist eine große Herausforderung.' }
  ]

  const toggle = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleExport = async () => {
    if (selected.length === 0) return;
    setDownloading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/anki/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocab_ids: selected.map(String) })
      });
      if (!response.ok) throw new Error("Erro de rede");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'deutschme_deck.apkg';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch(e) {
      alert("Erro na comunicação com o servidor. O uvicorn está ligado?");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-screen-md mx-auto px-6 pt-8 pb-32">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Exportar para o Anki</h1>
        <p className="text-on-surface-variant text-body-md">Selecione as palavras aprendidas recentemente em seus chats para criar um deck de estudos real baixável.</p>
      </div>

      <div className="space-y-3">
        {vocabList.map(v => (
          <label key={v.id} className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl cursor-pointer hover:shadow-sm border border-outline-variant/10 transition-all group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={selected.includes(v.id)} 
                onChange={() => toggle(v.id)}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" 
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg text-primary tracking-tight">{v.term}</span>
                <span className="text-xs font-medium text-outline-variant uppercase tracking-widest">{v.level}</span>
              </div>
              <span className="text-on-surface-variant text-sm block">{v.translation}</span>
              <div className="mt-2 py-2 px-3 bg-surface-container-low rounded-lg border-l-2 border-primary/30">
                <p className="text-xs font-medium text-on-surface italic">"{v.context}"</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="fixed bottom-[88px] left-0 w-full px-6 py-4 bg-gradient-to-t from-surface via-surface/95 to-transparent z-40">
        <div className="max-w-screen-md mx-auto">
          <button 
            onClick={handleExport}
            disabled={downloading || selected.length === 0}
            className={`w-full py-4 px-6 ${downloading ? 'bg-outline-variant text-surface cursor-wait' : 'bg-gradient-to-br from-primary to-primary-container text-on-primary active:scale-95'} font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-transform duration-150`}
          >
            <span className="material-symbols-outlined">download</span>
            <span>{downloading ? 'Gerando Pacote...' : 'Exportar Selecionados (.apkg)'}</span>
            {!downloading && <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-auto">{selected.length} itens</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
