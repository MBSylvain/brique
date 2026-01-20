import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { User, Lock, ArrowRight, Loader2, GraduationCap } from 'lucide-react'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ nom: '', code: '' })
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Rechercher l'élève dans la table avec Nom + Code
      const { data, error } = await supabase
        .from('eleves')
        .select('*')
        .ilike('nom', formData.nom.trim())
        .eq('code', formData.code.trim())
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        // Connexion réussie
        localStorage.setItem('eleve_data', JSON.stringify(data[0]))
        navigate('/dashboard')
      } else {
        setError('Nom ou Code incorrect. Veuillez réessayer.')
      }
    } catch (err) {
      console.error(err)
      setError('Erreur de connexion. Réessayez plus tard.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="glass rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-indigo-500/10 border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-0.5 mb-6 shadow-xl shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0f172a] rounded-[1.4rem] flex items-center justify-center">
                <GraduationCap className="text-indigo-400 w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
              Brique<span className="text-indigo-400">Suivi</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg">
              Portail Élève
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 ml-1">Nom de famille</label>
              <div className="group relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Dupont"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-lg"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 ml-1">Code Secret</label>
              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-lg tracking-[0.5em]"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-3 animate-shake">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover-lift overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" /> Connexion...
                  </>
                ) : (
                  <>
                    Accéder à mon espace <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              Suivi des notes & Planning
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
