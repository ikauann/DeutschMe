import { useState, useRef, useEffect, useCallback } from 'react'
import { useAppContext } from '../context/AppContext'

// Definindo tipos do Web Speech globalmente caso TS reclame
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ChatPage() {
  const { level, activeScenario, setActiveScenario, setIsLiveMode } = useAppContext()
  const [inputText, setInputText] = useState('')
  const [scenarios, setScenarios] = useState(['Daily de Data Engineering', 'Carros Elétricos', 'Calls de Valorant'])
  const [chatMemory, setChatMemory] = useState<Record<string, any[]>>({})
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Estados do Voice Recognition
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const recognitionRef = useRef<any>(null)

  const messages = chatMemory[activeScenario] || [{ id: 1, role: 'ai', text: `Lass uns über ${activeScenario} sprechen!`, translation: `Vamos conversar sobre ${activeScenario}!` }]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, interimText])

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;
    
    setInputText('')
    setSuggestions([])

    const currentHistory = chatMemory[activeScenario] || [{ id: 1, role: 'ai', text: `Lass uns über ${activeScenario} sprechen!`, translation: `Vamos conversar sobre ${activeScenario}!` }];
    const newMsg = { id: Date.now(), role: 'user', text: textToSend }
    
    setChatMemory(prev => ({
      ...prev,
      [activeScenario]: [...currentHistory, newMsg]
    }))

    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: textToSend, scenario: activeScenario, level })
      })
      const data = await response.json()
      
      const aiReply = { 
        id: Date.now()+1, 
        role: 'ai', 
        text: data.german_reply, 
        translation: data.portuguese_translation,
        feedback: data.grammar_feedback,
        audio: data.audio_base64
      }

      setChatMemory(prev => ({
        ...prev,
        [activeScenario]: [...currentHistory, newMsg, aiReply]
      }))

      if (data.audio_base64) {
        const audio = new Audio("data:audio/mp3;base64," + data.audio_base64)
        audio.play().catch(e => console.error("Autoplay blocker prevented playing audio", e))
      }
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Memoizing function to avoid stale closures in event listeners
  const sendFromSpeech = useCallback((text: string) => {
    handleSend(text);
  }, [activeScenario, level, chatMemory]);

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'de-DE'; // Always transcribe German!

      rec.onresult = (event: any) => {
        let finalTrans = '';
        let intermTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            intermTrans += event.results[i][0].transcript;
          }
        }
        
        if (intermTrans) {
          setInterimText(intermTrans);
        }
        
        if (finalTrans) {
          setInterimText('');
          // Pausa gravação, envia automático para IA! Experiencia fluida.
          rec.stop();
          setIsListening(false);
          sendFromSpeech(finalTrans);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        setInterimText('');
      }

      rec.onerror = (e: any) => {
        console.error("Mic Error:", e.error);
        setIsListening(false);
        setInterimText('');
      }

      recognitionRef.current = rec;
    }
  }, [sendFromSpeech]);

  const loadSuggestions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/chat/suggestions?scenario=${encodeURIComponent(activeScenario)}&level=${level}`)
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const addScenario = () => {
    const newSc = prompt("Sobre o que você quer conversar? (Ex: Entrevista, Viagem de trem)")
    if (newSc && newSc.trim()) {
      setScenarios(prev => [newSc.trim(), ...prev])
      setActiveScenario(newSc.trim())
    }
  }

  const playAudio = (b64: string) => {
    if (!b64) return;
    const audio = new Audio("data:audio/mp3;base64," + b64)
    audio.play()
  }

  const toggleListen = () => {
    if (!recognitionRef.current) return alert("Seu navegador não suporta a transcrição contínua.");
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimText('');
    } else {
      setInterimText('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-48">
      {/* Context Selector */}
      <section className="mb-8 pt-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 flex items-center justify-between">
            <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest pl-1">Cenário Interativo</h2>
            <button onClick={addScenario} className="text-primary hover:bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          <button onClick={() => setIsLiveMode(true)} className="bg-gradient-to-r from-primary to-tertiary text-on-primary font-bold px-4 py-1.5 rounded-full shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-sm">call</span> Voice Mode
          </button>
        </div>
        <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-4 px-4 mask-fade-right">
          {scenarios.map(sc => (
            <button key={sc} onClick={() => {setActiveScenario(sc); setSuggestions([])}} className={`flex-none px-5 py-2.5 rounded-full text-sm flex items-center gap-2 transition-all ${activeScenario === sc ? 'bg-primary text-on-primary font-semibold shadow-md shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant font-medium hover:bg-surface-container-highest'}`}>
              <span className="material-symbols-outlined text-sm">{sc.includes('Carro') ? 'ev_station' : sc.includes('Valorant') ? 'sports_esports' : sc.includes('Entrevista') ? 'work' : 'chat'}</span>
              {sc}
            </button>
          ))}
        </div>
      </section>

      {/* Chat View */}
      <div className="space-y-6">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col gap-2 max-w-[85%] group ${msg.role === 'user' ? 'items-end ml-auto' : 'items-start'}`}>
            <div className={`rounded-2xl p-5 shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-tr-none' : 'bg-surface-container-high text-on-surface border-l-4 border-primary rounded-tl-none'}`}>
              <div className="flex items-start justify-between gap-4">
                <p className="font-semibold leading-relaxed text-lg">{msg.text}</p>
                {msg.role === 'ai' && msg.audio && (
                  <button onClick={() => playAudio(msg.audio)} className="text-primary mt-1 hover:bg-primary/10 rounded-full p-2 transition-colors flex-shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span>
                  </button>
                )}
              </div>
              {msg.translation && (
                <>
                  <div className="h-[1px] w-full bg-outline-variant/30 my-3"></div>
                  <p className={`${msg.role === 'user' ? 'text-primary-fixed' : 'text-on-surface-variant'} text-sm leading-relaxed italic`}>
                    {msg.translation}
                  </p>
                </>
              )}
              {msg.feedback && (
                <div className="mt-3 bg-error-container/40 border border-error/20 p-2 text-xs text-on-surface-variant rounded-md flex items-start gap-2">
                  <span className="material-symbols-outlined text-error text-[14px] mt-0.5">error</span>
                  <span>{msg.feedback}</span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-outline px-2 uppercase font-bold tracking-widest">
              {msg.role === 'ai' ? 'K.I. DeutschMe' : 'Gesendet'}
            </span>
          </div>
        ))}

        {/* Live Captioning Bubble for Speech Recognition */}
        {isListening && (
          <div className="flex flex-col gap-2 max-w-[85%] items-end ml-auto">
            <div className="bg-surface-container-lowest border-2 border-primary/40 rounded-2xl p-4 shadow-xl rounded-tr-none min-w-[200px] flex gap-3 items-center backdrop-blur-md">
              <span className="material-symbols-outlined text-error animate-pulse">mic</span>
              <p className="font-medium text-on-surface text-lg flex-1 italic opacity-80">
                {interimText || "Ouvindo atentamente (Em alemão)..."}
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 max-w-[85%]">
            <div className="bg-surface-container-high p-4 rounded-2xl rounded-tl-none border-l-4 border-primary">
              <span className="text-outline text-sm animate-pulse flex items-center gap-2">
                 <span className="material-symbols-outlined spin text-xs">sync</span>
                 K.I. Pensando na resposta...
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-[80px] left-0 w-full z-40 bg-gradient-to-t from-surface via-surface/90 to-transparent">
        <div className="max-w-2xl mx-auto px-4 w-full">
          {/* Suggestions Tool */}
          <div className="mb-3 flex overflow-x-auto gap-2 no-scrollbar py-2">
            {suggestions.length === 0 && !isListening ? (
               <button onClick={loadSuggestions} className="bg-surface-container-highest text-on-surface-variant px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 border border-outline-variant/20 hover:bg-surface-variant transition-colors">
                 <span className="material-symbols-outlined text-[14px] text-tertiary">lightbulb</span> Sugerir Resposta
               </button>
            ) : (
              suggestions.map((sug, i) => (
                <button key={i} onClick={() => handleSend(sug)} className="whitespace-nowrap bg-tertiary-container text-on-tertiary-container px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:brightness-95 transition-all text-left truncate max-w-[200px]">
                  {sug}
                </button>
              ))
            )}
          </div>
          
          <div className="bg-surface-container-lowest/90 backdrop-blur-xl shadow-2xl rounded-3xl p-2 flex items-center gap-2 border border-outline-variant/10 mb-2">
            <button onClick={toggleListen} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-colors ${isListening ? 'bg-error text-surface animate-pulse' : 'text-primary hover:bg-primary/10'}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{isListening ? 'stop' : 'mic'}</span>
            </button>
            <input 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline py-4 px-2 text-base outline-none" 
              placeholder={isListening ? "Parar para enviar..." : "Escreva em alemão..." }
              type="text"
              disabled={isListening}
            />
            <button onClick={() => handleSend()} disabled={loading || isListening} className={`w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg transition-transform duration-200 ${(loading || isListening) ? 'bg-outline-variant text-surface' : 'bg-primary text-on-primary active:scale-90 shadow-primary/30'}`}>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
