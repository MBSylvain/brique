import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import {
    Users,
    LogOut,
    Search,
    Filter,
    GraduationCap,
    ChevronRight,
    Loader2,
    TrendingUp,
    BookOpen
} from 'lucide-react'

export default function TeacherDashboard() {
    const navigate = useNavigate()
    const [teacher, setTeacher] = useState(null)
    const [eleves, setEleves] = useState([])
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterClass, setFilterClass] = useState('All')

    useEffect(() => {
        const staffData = localStorage.getItem('staff_data')
        if (!staffData) {
            navigate('/')
            return
        }
        const parsed = JSON.parse(staffData)
        if (parsed.role !== 'teacher') {
            navigate('/')
            return
        }
        setTeacher(parsed)
        fetchTeacherInfo(parsed.id)
    }, [navigate])

    const fetchTeacherInfo = async (staffId) => {
        try {
            // 1. Get classes assigned to teacher
            const { data: staffClasses, error: classError } = await supabase
                .from('staff_classes')
                .select('classe')
                .eq('staff_id', staffId)

            if (classError) throw classError
            const teacherClasses = staffClasses.map(c => c.classe)
            setClasses(teacherClasses)

            if (teacherClasses.length > 0) {
                // 2. Fetch students for these classes
                const { data, error } = await supabase
                    .from('eleves')
                    .select('*')
                    .in('classe', teacherClasses)
                    .order('nom', { ascending: true })

                if (error) throw error
                setEleves(data || [])
            }
        } catch (err) {
            console.error('Error fetching teacher data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    const filteredEleves = eleves.filter(e => {
        const matchesSearch = (e.nom + ' ' + e.prenom).toLowerCase().includes(searchTerm.toLowerCase())
        const matchesClass = filterClass === 'All' || e.classe === filterClass
        return matchesSearch && matchesClass
    })

    if (!teacher || loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-12">
            {/* Top Bar */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                                <GraduationCap className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">Espace<span className="text-indigo-400">Prof</span></span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white">{teacher.nom}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Professeur</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                            >
                                <LogOut className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Header Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-6">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-tight">Vos Élèves</p>
                            <p className="text-3xl font-black text-white">{eleves.length}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-6">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-tight">Moyenne Classes</p>
                            <p className="text-3xl font-black text-white">
                                {(eleves.reduce((acc, curr) => acc + (curr.moyenne || 0), 0) / (eleves.length || 1)).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-6">
                        <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-tight">Vos Classes</p>
                            <p className="text-3xl font-black text-white">{classes.length}</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] mb-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Chercher un élève..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2">
                            <Filter className="w-5 h-5 text-slate-500" />
                            <select
                                className="bg-transparent text-white focus:outline-none font-bold text-sm min-w-[150px]"
                                value={filterClass}
                                onChange={(e) => setFilterClass(e.target.value)}
                            >
                                <option value="All" className="bg-slate-900">Toutes vos classes</option>
                                {classes.map(c => (
                                    <option key={c} value={c} className="bg-slate-900">{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-800/30 text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-800">
                                    <th className="px-8 py-6">Élève</th>
                                    <th className="px-6 py-6 text-center">Classe</th>
                                    <th className="px-6 py-6 text-center">Trimestre</th>
                                    <th className="px-6 py-6 text-center">Moyenne</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredEleves.map((eleve) => (
                                    <tr key={eleve.id} className="group hover:bg-slate-800/20 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 font-bold border border-slate-700">
                                                    {eleve.nom?.[0]}
                                                </div>
                                                <p className="text-white font-bold">{eleve.nom} {eleve.prenom}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className="text-slate-400 font-bold">{eleve.classe}</span>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className="text-xs font-bold text-slate-500">{eleve.trimestre}</span>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className={`text-lg font-black ${(eleve.moyenne || 0) >= 10 ? 'text-emerald-400' : 'text-rose-400'
                                                }`}>
                                                {eleve.moyenne?.toFixed(2) || '-'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredEleves.length === 0 && (
                        <div className="py-12 text-center text-slate-500">
                            Aucun élève trouvé dans vos classes.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
