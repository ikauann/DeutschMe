import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppContext } from '../context/AppContext'

export default function ProfilPage() {
  const { level } = useAppContext()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/profile/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(e => console.error(e))
  }, [])

  return (
    <div className="max-w-screen-md mx-auto px-6 pt-8 pb-32">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Seu Perfil</h1>
          <p className="text-on-surface-variant text-body-md">Acompanhe seu progresso real no app.</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-2xl shadow-sm">
          {level}
        </div>
      </div>

      {!stats ? (
        <div className="flex justify-center items-center h-48 border-2 border-dashed border-outline-variant/30 rounded-2xl">
          <span className="text-outline font-medium animate-pulse">Carregando suas estatísticas do banco...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-tertiary">local_fire_department</span>
                <h3 className="font-bold text-lg">Ofensiva Atual</h3>
              </div>
              <p className="text-4xl font-extrabold text-on-surface">{stats.streak_days} Dias</p>
              <p className="text-sm text-outline mt-2">Continue estudando todos os dias!</p>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary">school</span>
                <h3 className="font-bold text-lg">Interações Glovais</h3>
              </div>
              <p className="text-4xl font-extrabold text-on-surface">{stats.total_messages}</p>
              <p className="text-sm text-outline mt-2">Mensagens trocadas com o Tutor</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <h3 className="font-bold text-lg mb-6">Atividade da Semana</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.week_activity}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#717783'}} dy={10} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f2f4f7'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="active" fill="#005dac" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
