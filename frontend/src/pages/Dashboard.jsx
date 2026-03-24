import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import brickImage from "../assets/briques.png";
import {
  Power,
  GraduationCap,
  Calendar,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";

import DarkModeToggle from "../components/DarkModeToggle";
import VideoSection from "../components/VideoSection";
import QcmSection from "../components/QcmSection";
import IbProgressionSection from "../components/Ibprogression";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [planning, setPlanning] = useState([]);
  const [activeTab, setActiveTab] = useState("T1");
  const [loading, setLoading] = useState(true);
  const [eleaVideo, setEleaVideo] = useState([]);
  const [qcm, setQcm] = useState([]);
  const [ibProgression, setIBProgression] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("eleve_data");
    if (!userData) {
      navigate("/");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchData(parsedUser);
  }, [navigate]);

  async function fetchData(userData) {
    setLoading(true);
    try {
      // 1. Récupérer les notes de l'élève (plusieurs trimestres possibles)
      const { data: notesData, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .eq("eleve_id", userData.id);

      if (notesError) throw notesError;

      // Transformer le JSONB 'donnees' pour l'affichage à plat si nécessaire
      const flattenedNotes =
        notesData?.map((n) => ({
          ...n.donnees,
          trimestre: `T${n.trimestre}`,
          id: n.id,
        })) || [];

      setNotes(flattenedNotes);

      // 2. Récupérer le planning
      const { data: planningData, error: planningError } = await supabase
        .from("planning")
        .select("*")
        .eq("eleve_id", userData.id)
        .single(); // Un seul planning par élève

      if (planningError && planningError.code !== "PGRST116")
        throw planningError;
      setPlanning(planningData?.indicateurs ? [planningData.indicateurs] : []);

      // 3. Récupérer les données vidéos
      const { data: eleaVideoData, error: eleaVideoError } = await supabase
        .from("eleas_video")
        .select("*")
        .eq("eleve_id", userData.id);

      if (eleaVideoError) throw eleaVideoError;
      setEleaVideo(eleaVideoData || []);

      // 4. Récupérer les données QCM depuis sa propre table
      const { data: qcmData, error: qcmError } = await supabase
        .from("qcm")
        .select("*")
        .eq("eleve_id", userData.id);

      if (qcmError) throw qcmError;
      setQcm(qcmData || []);

      // 5. Récupération les données IB progression depuis sa propre table
      const { data: ibProgressionData, error: ibProgressionError } =
        await supabase.from("ib_progeleve").select("*").eq("eleve_id", userData.id);

      if (ibProgressionError) throw ibProgressionError;
      setIBProgression(ibProgressionData);

      console.log("QCM data:", qcmData);
      console.log("IB Progression data:", ibProgressionData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const currentNotes = notes.find((n) => n.trimestre === activeTab);

  if (!user) return null;


  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header Premium */}
      <nav className="glass sticky top-0 z-30 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 group cursor-default">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                <GraduationCap className="text-white w-7 h-7" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 block leading-none">
                  Brique<span className="text-indigo-600">Suivi</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                  Espace Élève
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/*<DarkModeToggle />*/}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
              >
                <Power size={18} />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-indigo-600 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl shadow-indigo-200">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-5xl font-black mb-4 leading-tight">
              Ravi de vous revoir{" "}
              <span className="text-indigo-200">{user.prenom} </span> !
            </h1>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 mr-10 mb-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Global Stats Overview (Brief) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover-lift">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              Trimestre Actuel
            </p>
            <p className="text-xl font-black text-slate-900">{activeTab}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover-lift">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              Moyenne Générale
            </p>
            <p className="text-2xl font-black text-indigo-600">
              {currentNotes?.moyenne ?? "--"}
            </p>
          </div>
        </div>

        {/* Tabs for Trimestres */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 p-1.5 bg-slate-200/50 rounded-2xl w-fit border border-slate-200/50">
            {["T1", "T2", "T3"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                  ? "bg-white text-indigo-600 shadow-xl shadow-indigo-500/10"
                  : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                Trimestre {tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Notes Section (2/3) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black text-indigo-500 uppercase flex items-center gap-3">
                  <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                  Résultats
                </h2>
              </div>

              {loading ? (
                <div className="bg-white rounded-[2rem] p-20 text-center border border-slate-100">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                    Analyse des données...
                  </p>
                </div>
              ) : currentNotes ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    {
                      label: "Moyenne",
                      value: currentNotes.moyenne,
                      icon: "📊",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="bg-white p-4 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between min-h-[110px] sm:min-h-[120px]"
                    >
                      <div className="flex flex-col items-center mb-4">
                        <span className="text-2xl mb-2">{row.icon}</span>
                        <div className="h-1 w-6 bg-slate-100 rounded-full group-hover:bg-indigo-100 transition-colors"></div>
                      </div>
                      <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {row.label}
                      </p>
                      <p className="text-xl font-black text-slate-900 text-center">
                        {row.value ?? (
                          <span className="text-slate-300">--</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 border-dashed">
                  <p className="text-slate-400 font-bold">
                    Aucune donnée disponible pour cette période.
                  </p>
                </div>
              )}

              {loading ? (
                <div className="bg-white rounded-[2rem] p-20 text-center border border-slate-100">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                    Analyse des données...
                  </p>
                </div>
              ) : currentNotes ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { label: "QCM", value: currentNotes.qcm, icon: "⚡" },

                    {
                      label: "Régularité",
                      value: currentNotes.regularite,
                      icon: "📅",
                    },
                    { label: "DST", value: currentNotes.dst, icon: "📝" },
                    { label: "Bac Blanc", value: currentNotes.bb, icon: "🎓" },
                    {
                      label: "Apprentissage",
                      value: currentNotes.apprentissage,
                      icon: "📈",
                    },

                    {
                      label: "Total Briques",
                      value: currentNotes.total_briques,
                      icon: "🧱",
                    },

                    {
                      label: "Brique IB",
                      value: currentNotes.brique_ib,
                      icon: (
                        <img
                          src={brickImage}
                          alt="Brique IB"
                          style={{ width: 50, height: 50 }}
                        />
                      ),
                    },
                    {
                      label: "Brique +",
                      value: currentNotes.brique_plus,
                      icon: "➕",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="bg-white p-4 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between min-h-[110px] sm:min-h-[120px]"
                    >
                      <div className="flex flex-col items-center mb-4">
                        <span className="text-2xl mb-2">{row.icon}</span>
                        <div className="h-1 w-6 bg-slate-100 rounded-full group-hover:bg-indigo-100 transition-colors"></div>
                      </div>
                      <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {row.label}
                      </p>
                      <p className="text-xl font-black text-slate-900 text-center">
                        {row.value ?? (
                          <span className="text-slate-300">--</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 border-dashed">
                  <p className="text-slate-400 font-bold">
                    Aucune donnée disponible pour cette période.
                  </p>
                </div>
              )}
            </div>

            {/* Planning Section */}
            <IbProgressionSection
              ibProgression={ibProgression}
              planning={planning}
              activeTab={activeTab}
            />
          </div>

          {/* Section Vidéos ELEAS */}
          <div className="mt-10 space-y-10">
            <VideoSection eleaVideo={eleaVideo} activeTab={activeTab} />
            <QcmSection qcmData={qcm} activeTab={activeTab} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto p-10 mt-10 text-center border-t border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
          Révise Tes Maths &copy; 2026
        </p>
      </footer>
    </div>
  );
}
