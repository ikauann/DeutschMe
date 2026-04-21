import { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'

export default function TipsPage() {
  const { level } = useAppContext()
  const [tipData, setTipData] = useState<{
    title: string; explanation: string; german_example: string; portuguese_example: string; tip?: string;
  } | null>(null)

  useEffect(() => {
    let active = true;
    setTipData(null);
    fetch(`http://127.0.0.1:8000/tips?level=${level}`)
      .then(r => r.json())
      .then(data => {
        if (active) setTipData(data.tip);
      })
      .catch(e => console.error(e));
    return () => { active = false; };
  }, [level])

  return (
    <div className="max-w-screen-md mx-auto px-6 pt-4 space-y-12 pb-32">
      <section className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Dicas de Estudo</h1>
        <p className="text-on-surface-variant text-body-md">Aprimore seu alemão com orientações precisas de gramática e vocabulário técnico selecionado para o seu dia a dia.</p>
      </section>

      {!tipData ? (
        <div className="flex justify-center items-center h-48 border-2 border-dashed border-outline-variant/30 rounded-2xl">
          <span className="text-outline font-medium animate-pulse">A IA está formulando sua dica diária ({level})...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest rounded-full">Dica de IA ({level})</span>
              <span className="text-on-surface-variant text-sm">• Contextual</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-4">{tipData.title}</h2>
            <p className="text-on-surface-variant mb-6 leading-relaxed">
              {tipData.explanation}
            </p>
            <div className="space-y-4">
              <div className="bg-surface-container-low p-4 rounded-xl flex items-start gap-4">
                <span className="material-symbols-outlined text-primary mt-1">school</span>
                <div>
                  <p className="font-bold text-on-surface font-headline">{tipData.german_example}</p>
                  <p className="text-sm text-on-surface-variant italic mt-1">{tipData.portuguese_example}</p>
                </div>
              </div>
            </div>
          </div>
          
          {tipData.tip && (
            <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-8 text-on-primary">
              <span className="material-symbols-outlined mb-6 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <h3 className="text-xl font-bold mb-3">Dica Rápida</h3>
              <p className="text-primary-fixed leading-relaxed text-sm">
                "{tipData.tip}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
