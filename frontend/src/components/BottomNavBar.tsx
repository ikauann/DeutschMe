export default function BottomNavBar({ currentTab, setTab }: { currentTab: string, setTab: (t: string) => void }) {
  const tabs = [
    { id: 'lernen', icon: 'school', label: 'Lernen' },
    { id: 'chat', icon: 'forum', label: 'Chat' },
    { id: 'fortschritt', icon: 'trending_up', label: 'Fortschritt' },
    { id: 'profil', icon: 'person', label: 'Profil' }
  ]

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center bg-surface-container-lowest/10 backdrop-blur-md">
      <nav className="w-full max-w-2xl flex justify-around items-center px-4 pt-3 pb-6 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,93,172,0.06)] rounded-t-3xl border-t border-outline-variant/10">
        {tabs.map(tab => {
        const isActive = currentTab === tab.id
        return (
          <button 
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 ease-out 
              ${isActive ? 'text-primary scale-100 bg-primary/10 rounded-2xl px-5 py-1.5' : 'text-outline scale-95 opacity-70 hover:opacity-100 px-5 py-1.5'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {tab.icon}
            </span>
            <span className="font-sans text-[11px] font-semibold tracking-wide uppercase mt-1">
              {tab.label}
            </span>
          </button>
        )
      })}
      </nav>
    </div>
  )
}
