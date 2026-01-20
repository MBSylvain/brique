import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('eleve_data')
    if (!userData) {
      navigate('/')
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('eleve_data')
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bonjour, {user.prenom} !</h1>
            <p className="text-slate-500">Bienvenue sur votre espace de suivi.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Vos Résultats (Aperçu)</h2>
          <pre className="bg-slate-50 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        
        <div className="text-center text-slate-400 mt-12">
          Le tableau de bord complet arrive bientôt...
        </div>
      </div>
    </div>
  )
}
