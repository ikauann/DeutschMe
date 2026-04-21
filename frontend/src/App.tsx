import { useState } from 'react'
import ChatPage from './pages/ChatPage'
import TipsPage from './pages/TipsPage'
import AnkiPage from './pages/AnkiPage'
import ProfilPage from './pages/ProfilPage'
import LiveVoicePage from './pages/LiveVoicePage'
import TopAppBar from './components/TopAppBar'
import BottomNavBar from './components/BottomNavBar'
import { useAppContext } from './context/AppContext'

function App() {
  const [currentTab, setCurrentTab] = useState('chat')
  const { isLiveMode } = useAppContext()

  if (isLiveMode) {
    return <LiveVoicePage />
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased transition-colors duration-300 flex flex-col items-center">
      <TopAppBar />
      <main className="pt-[80px] w-full max-w-2xl">
        {currentTab === 'lernen' && <TipsPage />}
        {currentTab === 'chat' && <ChatPage />}
        {currentTab === 'fortschritt' && <AnkiPage />}
        {currentTab === 'profil' && <ProfilPage />}
      </main>
      <BottomNavBar currentTab={currentTab} setTab={setCurrentTab} />
    </div>
  )
}

export default App
