import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { User, Mail, Lock, ArrowRight, Loader2, GraduationCap } from 'lucide-react'

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nom: formData.nom,
            prenom: formData.prenom
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Le profil est créé automatiquement par le Trigger SQL (handle_new_user)
        setSuccess(true)
        setTimeout(() => navigate('/'), 3000)
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Erreur lors de la création du compte.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="glass rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-indigo-500/10 border border-white/10 overflow-hidden">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-0.5 mb-6 shadow-xl shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0f172a] rounded-[1.4rem] flex items-center justify-center">
                <GraduationCap className="text-indigo-400 w-10 h-10" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Créer un profil Professeur</h1>
            <p className="text-slate-400 text-sm">Rejoignez BriqueSuivi pour gérer vos classes</p>
          </div>

          {success ? (
            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-center animate-bounce">
              <p className="font-bold text-lg mb-2">Compte créé avec succès !</p>
              <p className="text-sm">Redirection vers la connexion...</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Nom</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Prénom</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Mot de passe</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Créer mon compte'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/" className="text-indigo-400 text-sm hover:underline font-medium">
              Déjà un compte ? Connectez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
