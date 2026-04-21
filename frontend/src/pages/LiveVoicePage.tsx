import { useState, useRef, useEffect, useCallback } from 'react'
import { useAppContext } from '../context/AppContext'

type LiveState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR';

export default function LiveVoicePage() {
  const { level, activeScenario, setIsLiveMode } = useAppContext()
  const [liveState, setLiveState] = useState<LiveState>('IDLE')
  const [interimText, setInterimText] = useState('')
  const [lastAssistantText, setLastAssistantText] = useState('Hallo! Lass uns anfangen.')
  const [lastTranslation, setLastTranslation] = useState('Olá! Vamos começar.')
  const [micLang, setMicLang] = useState<'de-DE' | 'pt-BR'>('de-DE')
  
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const liveStateRef = useRef(liveState)
  useEffect(() => { liveStateRef.current = liveState }, [liveState])

  const stopAll = useCallback(() => {
    if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch {}
    }
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }
  }, [])

  const startListening = useCallback(() => {
    setLiveState('LISTENING');
    setInterimText('');
    
    // Clear out standard greetings if they haven't talked yet, else we keep the history showing
    if (lastAssistantText === 'Hallo! Lass uns anfangen.') {
      setLastAssistantText('');
      setLastTranslation('');
    }
    
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setLiveState('ERROR');
      return;
    }

    const rec = new SpeechRec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = micLang; // Dynamically use PT or DE

    rec.onresult = (e: any) => {
      let finalTrans = '';
      let intermTrans = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) finalTrans += e.results[i][0].transcript;
        else intermTrans += e.results[i][0].transcript;
      }
      
      if (intermTrans) setInterimText(intermTrans);
      if (finalTrans) {
        rec.stop(); 
        sendPhrase(finalTrans);
      }
    };
    
    rec.onerror = (err: any) => {
        if (err.error === 'aborted' || err.error === 'no-speech') return; 
        console.error("Speech error", err)
    }
    
    rec.onend = () => {
       if (liveStateRef.current === 'LISTENING') {
          try { recognitionRef.current?.start() } catch { }
       }
    }
    
    recognitionRef.current = rec;
    try { rec.start() } catch {}
  }, [micLang, lastAssistantText]) // Restart explicitly watches micLang

  useEffect(() => {
    stopAll()
    startListening()
    return () => stopAll()
  }, [micLang]) // Se mudar o idioma, recarrega o microfone limpo!

  const sendPhrase = async (text: string) => {
    setLiveState('THINKING');
    setInterimText(text); 
    
    try {
      const response = await fetch('http://127.0.0.1:8000/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: text, scenario: activeScenario, level })
      })
      const data = await response.json()
      
      setLastAssistantText(data.german_reply)
      setLastTranslation(data.portuguese_translation)
      
      if (data.audio_base64) {
        setLiveState('SPEAKING');
        const snd = new Audio("data:audio/mp3;base64," + data.audio_base64)
        audioRef.current = snd;
        await snd.play();
        snd.onended = () => {
           startListening();
        }
      } else {
        setTimeout(startListening, 2000)
      }
    } catch(e) {
      console.error(e)
      setLiveState('ERROR')
    }
  }

  const getOrbStateClasses = () => {
    switch (liveState) {
        case 'LISTENING':
            return "scale-100 bg-primary/40 shadow-[0_0_80px_rgba(0,93,172,0.3)] border-4 border-primary animate-[pulse_2s_ease-in-out_infinite]";
        case 'THINKING':
            return "scale-75 bg-tertiary shadow-[0_0_100px_rgba(79,101,130,0.5)] border-4 border-dashed border-white animate-[spin_4s_linear_infinite]";
        case 'SPEAKING':
            return "scale-110 bg-gradient-to-tr from-primary to-primary-container shadow-[0_0_140px_rgba(0,93,172,0.8)] border-none animate-[pulse_0.4s_ease-in-out_infinite_alternate]";
        case 'ERROR':
            return "scale-90 bg-error shadow-[0_0_60px_rgba(186,26,26,0.6)]";
        default:
            return "scale-100 bg-surface-variant";
    }
  }

  const getStatusText = () => {
      if (liveState === 'LISTENING') return "Ouvindo você..."
      if (liveState === 'THINKING') return "Tradução simultânea & IA..."
      if (liveState === 'SPEAKING') return "K.I. Falando..."
      if (liveState === 'ERROR') return "Erro de comunicação. Tente novamente."
      return ""
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#050B14] text-white font-sans overflow-hidden">
        {/* Top minimal bar */}
        <div className="w-full pt-8 pb-4 px-6 flex justify-between items-center z-10">
            <button onClick={() => setIsLiveMode(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md shadow-sm">
                <span className="material-symbols-outlined text-white">close</span>
            </button>
            
            {/* Lang Toggle */}
            <div className="flex bg-white/10 p-1 rounded-full backdrop-blur-md border border-white/10 overflow-hidden shadow-xl">
                 <button onClick={() => setMicLang('pt-BR')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${micLang === 'pt-BR' ? 'bg-primary text-white shadow-sm' : 'text-white/60 hover:text-white'}`}>
                    BR
                 </button>
                 <button onClick={() => setMicLang('de-DE')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${micLang === 'de-DE' ? 'bg-primary text-white shadow-sm' : 'text-white/60 hover:text-white'}`}>
                    DE
                 </button>
            </div>

            <div className="flex flex-col items-end">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">Live Voice</span>
                <span className="text-xs font-medium text-white/50 mt-1 capitalize shadow-sm p-1 px-2 rounded-md bg-black/20">{activeScenario} ({level})</span>
            </div>
        </div>

        {/* Central Orb Area */}
        <div className="flex-1 w-full flex items-center justify-center relative">
            <div className={`absolute w-full h-full opacity-20 -z-10 transition-colors duration-1000 ${liveState === 'LISTENING' ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/50 to-transparent' : liveState === 'SPEAKING' ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-container to-transparent' : ''}`} />
            
            <div className={`w-48 h-48 rounded-full transition-all duration-700 ease-out flex items-center justify-center ${getOrbStateClasses()}`}>
                <div className="w-32 h-32 rounded-full absolute bg-white/10 mix-blend-overlay"></div>
                {liveState === 'SPEAKING' && (
                     <span className="material-symbols-outlined text-6xl text-white/80 animate-pulse">graphic_eq</span>
                )}
            </div>
        </div>

        {/* Text Area (Real-time subtitles) */}
        <div className="h-[40vh] w-full p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/90 to-transparent z-10 pb-12">
            <div className="max-w-3xl mx-auto w-full text-center space-y-3">
                <p className="text-secondary tracking-wider text-[10px] font-bold uppercase animate-pulse mb-4">{getStatusText()}</p>
                
                {liveState === 'LISTENING' && (
                    <p className="text-2xl font-light text-white/90 leading-relaxed italic min-h-[4rem]">
                        {interimText || "..."}
                    </p>
                )}

                {liveState === 'THINKING' && (
                    <p className="text-2xl font-light text-white/40 leading-relaxed">
                        {interimText}
                    </p>
                )}

                {(liveState === 'SPEAKING' || lastAssistantText) && liveState !== 'LISTENING' && liveState !== 'THINKING' && (
                    <div className="animate-fade-in flex flex-col items-center gap-3">
                        <p className="text-3xl sm:text-4xl font-extrabold text-white leading-snug drop-shadow-2xl">
                            {lastAssistantText}
                        </p>
                        {lastTranslation && (
                            <p className="text-lg text-secondary-fixed/90 italic max-w-2xl bg-white/5 py-2 px-6 rounded-2xl backdrop-blur-md border border-white/10">
                                {lastTranslation}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}
