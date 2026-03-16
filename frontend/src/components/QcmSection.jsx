import {
  ClipboardCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function QcmSection({ qcmData, activeTab }) {
  // 1. Détermination du trimestre actif
  const currentTabNumber = parseInt(activeTab.replace("T", ""));

  // La structure dans la BDD est un objet avec un champ 'donnees' (jsonb)
  const qcmRow =
    Array.isArray(qcmData) && qcmData.length > 0 ? qcmData[0] : null;

  if (!qcmRow || !qcmRow.donnees) {
    return null;
  }

  // 2. Filtrage et nettoyage des données QCM
  const qcmsToWork = Object.entries(qcmRow.donnees)
    .filter(([key, score]) => {
      // Analyse du préfixe (ex: "t1_qcm1")
      const prefixMatch = key.toLowerCase().match(/^t([1-3])_/i);
      const keyTrimestre = prefixMatch ? parseInt(prefixMatch[1]) : null;

      // Uniquement le trimestre actif
      if (keyTrimestre !== null && keyTrimestre !== currentTabNumber) {
        return false;
      }

      // S'assurer que c'est bien un QCM
      if (!key.toLowerCase().includes("qcm")) {
        return false;
      }

      // Règle de filtrage : score < 8, ou "0" pour les non faits
      return score == "0" || (typeof score === "number" && score < 8); //* à décommenter pour activer le filtre sur les scores
    })
    .map(([key, score]) => {
      // Nettoyage visuel (ex: "t1_qcm1" -> "QCM 1")
      const displayCode = key
        .replace(/^t[1-3]_/i, "")
        .toUpperCase()
        .replace("QCM", "QCM ");
      return { code: displayCode, score };
    });

  if (qcmsToWork.length === 0) {
    return (
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] p-8 text-center">
        <div className="inline-flex p-3 bg-green-500/20 rounded-2xl mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-indigo-500 font-bold  tracking-widest text-xl">
          Tous les QCM sont validés !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section QCM */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black text-indigo-500 flex items-center gap-3">
          <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
          QCM
        </h2>
        <span className="px-4 py-1.5 bg-violet-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-500 uppercase tracking-widest">
          {qcmsToWork.length}{" "}
          {qcmsToWork.length > 1 ? "QCM à valider" : "QCM à valider"}
        </span>
      </div>

      {/* Rappel des règles de notation */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 relative overflow-hidden group">
        <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Rappel de Notation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
            <p className="text-[11px] font-bold text-white  mb-1">
              QCM non fait
            </p>
            <p className="text-sm font-black text-rose-500">-3 points</p>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
            <p className="text-[11px] font-bold text-white uppercase mb-1">
              QCM &lt; 5
            </p>
            <p className="text-sm font-black text-amber-500">-2 points</p>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
            <p className="text-[11px] font-bold text-white uppercase mb-1">
              5 &le; QCM &lt; 8
            </p>
            <p className="text-sm font-black text-violet-400">-1 point</p>
          </div>
        </div>
      </div>

      {/* Liste des QCM */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:grid-cols-6">
        {qcmsToWork.map((qcm) => (
          <div
            key={qcm.code}
            className="group relative bg-slate-900 border border-slate-800 p-5 rounded-[2rem] hover:border-indigo-500/30 transition-all overflow-hidden"
          >
            {/* Pattern de fond */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors"></div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-lg font-black text-white leading-none">
                  {qcm.code}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-black leading-none ${qcm.score == 0 ? "text-rose-500" : qcm.score < 5 ? "text-amber-500" : "text-violet-400"}`}
                >
                  {qcm.score != 0 ? `${qcm.score}/10` : "non fait"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
