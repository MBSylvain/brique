import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Table, List, Calendar, Info, HelpCircle } from 'lucide-react'

export default function GuideStructure() {
    const navigate = useNavigate()

    const sections = [
        {
            title: "Onglet 'Eleves' (Gestion Globale)",
            icon: <List className="w-6 h-6 text-blue-400" />,
            description: "Utilisez cet onglet pour inscrire vos élèves et générer leurs codes secrets.",
            columns: [
                { letter: "A", name: "Nom", desc: "Le nom de famille de l'élève." },
                { letter: "B", name: "Prénom", desc: "Le prénom de l'élève." },
                { letter: "C", name: "Classe", desc: "Le nom de la classe (ex: TG1, TG2). Créée automatiquement si elle n'existe pas." },
                { letter: "D", name: "Niveau", desc: "Le niveau de la classe (ex: Terminale, Première)." },
                { letter: "E", name: "Code Secret", desc: "Laissez cette colonne vide. Le script VBA y inscrira automatiquement le code généré." },
            ],
            note: "Important : Votre Code Professeur doit impérativement être saisi dans la cellule [H1] de cet onglet."
        },
        {
            title: "Onglets 'Notes T1 / T2 / T3'",
            icon: <Table className="w-6 h-6 text-purple-400" />,
            description: "Onglets pour synchroniser les notes par trimestre. Nommez-les précisément (ex: 'Notes T1').",
            columns: [
                { letter: "A", name: "Nom", desc: "Nom de l'élève (doit correspondre à l'onglet Eleves)." },
                { letter: "B", name: "Prénom", desc: "Prénom de l'élève (doit correspondre à l'onglet Eleves)." },
                { letter: "C", name: "Moyenne", desc: "Moyenne générale calculée dans Excel." },
                { letter: "D", name: "QCM", desc: "Note des QCM Flash ou évaluations rapides." },
                { letter: "E", name: "Régularité", desc: "Note globale de régularité dans le travail." },
                { letter: "F", name: "Brique IB", desc: "Nombre de briques 'Indicateurs de Base' validées." },
                { letter: "G", name: "Brique Plus", desc: "Nombre de briques Bonus ou Approfondissement." },
                { letter: "H", name: "Total Briques", desc: "Somme totale des briques." },
                { letter: "I", name: "Apprentissage", desc: "Note d'apprentissage ou de progression." },
                { letter: "J", name: "DST", desc: "Note du dernier Devoir Sur Table." },
                { letter: "K", name: "BB", desc: "Note du Bac Blanc (facultatif, mettez null si vide)." },
                { letter: "L", name: "Classe", desc: "Rappel du nom de la classe pour filtrer les données." },
            ]
        },
        {
            title: "Onglet 'Planning'",
            icon: <Calendar className="w-6 h-6 text-emerald-400" />,
            description: "Suivez l'avancement du programme. Le nom de l'onglet doit contenir le mot 'Planning'.",
            columns: [
                { letter: "A", name: "Nom", desc: "Nom de l'élève." },
                { letter: "B", name: "Prénom", desc: "Prénom de l'élève." },
                { letter: "C - Z", name: "Indicateurs", desc: "24 colonnes successives (Indicateurs mathématiques : COND, REC, DERIV, SIGNE, SG, CV, PYTHON, LIM, GRAPH, CONV, VECT, DTE, LIM_FN, CO, DEN, TRIGO, PLAN, V, BINO, INTEGR, AIRE, INT_PLUS, VA, ED)." },
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 sm:p-12 font-sans selection:bg-indigo-500/30">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <button
                            onClick={() => navigate('/teacher')}
                            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors mb-6 group bg-indigo-500/5 px-4 py-2 rounded-xl border border-indigo-500/10"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Retour au Dashboard
                        </button>
                        <h1 className="text-5xl font-black tracking-tight leading-tight">
                            Structure du <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Fichier Excel</span>
                        </h1>
                        <p className="text-slate-300 text-lg mt-4 max-w-2xl font-medium">
                            Pour garantir une synchronisation sans erreur, veuillez respecter scrupuleusement l'ordre et le contenu des colonnes ci-dessous.
                        </p>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl backdrop-blur-xl">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl">
                            <HelpCircle className="text-indigo-400 w-10 h-10" />
                        </div>
                        <div>
                            <p className="font-black text-white text-lg">Format Requis</p>
                            <p className="text-slate-400 font-medium">Fichier .xlsx ou .xlsm</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-20">
                    {sections.map((section, idx) => (
                        <section key={idx} className="relative">
                            <div className="flex items-center gap-6 mb-8 px-4">
                                <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
                                    {section.icon}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{section.title}</h2>
                                    <p className="text-slate-400 font-medium">{section.description}</p>
                                </div>
                            </div>

                            <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800/60 overflow-hidden backdrop-blur-sm shadow-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-800/40 border-b border-white/5">
                                                <th className="py-6 px-8 text-xs uppercase tracking-widest text-slate-400 font-black border-r border-white/5">COL.</th>
                                                <th className="py-6 px-8 text-xs uppercase tracking-widest text-slate-400 font-black border-r border-white/5">INTITULÉ ATTENDU</th>
                                                <th className="py-6 px-8 text-xs uppercase tracking-widest text-slate-400 font-black">DESCRIPTION ET FORMAT</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {section.columns.map((col, cIdx) => (
                                                <tr key={cIdx} className="hover:bg-indigo-500/5 transition-all group">
                                                    <td className="py-6 px-8 border-r border-white/5 w-24">
                                                        <div className="flex items-center justify-center">
                                                            <span className="bg-slate-800 group-hover:bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-mono font-black border border-white/5 shadow-inner transition-colors">
                                                                {col.letter}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 px-8 border-r border-white/5 min-w-[200px]">
                                                        <span className="text-white font-black text-lg bg-white/5 px-4 py-2 rounded-xl border border-white/10 group-hover:border-indigo-500/30 transition-colors">
                                                            {col.name}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 px-8">
                                                        <p className="text-slate-200 text-base font-medium leading-relaxed group-hover:text-white transition-colors">
                                                            {col.desc}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {section.note && (
                                <div className="mt-8 mx-4 p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl flex items-start gap-4 backdrop-blur-sm">
                                    <div className="p-2 bg-amber-500/20 rounded-xl">
                                        <Info className="text-amber-500 w-6 h-6" />
                                    </div>
                                    <p className="text-amber-200/90 text-base font-bold leading-relaxed">
                                        {section.note}
                                    </p>
                                </div>
                            )}
                        </section>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-24 text-center border-t border-slate-900 pt-12 pb-20">
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">
                        BriqueSuivi © 2026 • Système Expert de Synchronisation
                    </p>
                </div>
            </div>
        </div>
    )
}
