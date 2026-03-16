import {
  PlayCircle,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function VideoSection({ eleaVideo, activeTab }) {
  // 1. Détermination du trimestre actif
  // On transforme l'onglet sélectionné (ex: "T1") en minuscules ("t1") et en nombre (1)
  const currentTabLower = activeTab.toLowerCase();
  const currentTabNumber = parseInt(activeTab.replace("T", ""));

  // On cherche la ligne de données qui correspond au trimestre sélectionné.
  // Si aucune ligne spécifique n'est trouvée (ex: données agrégées), on prend la première disponible.
  const videoDataRow =
    eleaVideo.find((v) => parseInt(v.trimestre) === currentTabNumber) ||
    eleaVideo[0];

  // Si aucune donnée n'est trouvée, on n'affiche rien.
  if (!videoDataRow || !videoDataRow.donnees) {
    return null;
  }

  // 2. Filtrage et nettoyage des données vidéos
  // 'donnees' est un objet { "t1_f0_v1": 9, ... }, on le transforme en tableau pour le filtrer.
  const videosToWork = Object.entries(videoDataRow.donnees)
    .filter(([key, score]) => {
      // On extrait le trimestre éventuellement présent dans le code de la vidéo via une RegEx.
      // Exemple : "t1_f0_v1" -> match[1] contiendra "1".
      const prefixMatch = key.match(/^t([1-3])_/i);
      const keyTrimestre = prefixMatch ? parseInt(prefixMatch[1]) : null;

      // REGLE DE FILTRAGE :
      // A. Si un préfixe (t1_, t2_) est présent, on vérifie qu'il correspond à l'onglet actif.
      if (keyTrimestre !== null && keyTrimestre !== currentTabNumber) {
        return false;
      }

      // B. Si aucun préfixe n'est présent, on s'assure que la ligne de données actuelle
      // correspond bien au trimestre de l'onglet pour éviter les répétitions.
      if (
        keyTrimestre === null &&
        parseInt(videoDataRow.trimestre) !== currentTabNumber
      ) {
        return false;
      }

      // C. Règle métier : On ne garde que les vidéos avec une note < 8 ou non commencées (null).
      // On exclut les QCM de cette section
      if (key.toLowerCase().includes("qcm")) return false;

      return score == "0" || (typeof score === "number" && score < 5); // DECOMMENTER POUR ACTIVER LE FILTRE SUR LES SCORES;
    })
    .map(([key, score]) => {
      // Nettoyage visuel : On retire le préfixe "tX_" du code pour l'affichage (ex: "t1_f0_v1" -> "f0_v1").
      const displayCode = key.replace(/^t[1-3]_/i, "");
      return { code: displayCode, score };
    });

  if (videosToWork.length === 0) {
    return (
      <div className="bg-violet-500/10 border border-indigo-500/20 rounded-[2rem] p-8 text-center">
        <div className="inline-flex p-3 bg-green-500/20 rounded-2xl mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-indigo-500 font-bold  tracking-widest text-xl">
          Toutes les vidéos sont validées !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black text-indigo-500 uppercase flex items-center gap-3">
          <div className="w-2 h-8 bg-indigo-500  rounded-full"></div>
          Vidéos
        </h2>
        <span className="px-4 py-1.5 bg-violet-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-500 uppercase tracking-widest">
          {videosToWork.length}{" "}
          {videosToWork.length > 1 ? "vidéos à valider" : "vidéo à valider"}
        </span>
      </div>
      {/**Rappel des règles de notation */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 relative overflow-hidden group">
        <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Rappel de Notation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
            <p className="text-[11px] font-bold text-white  mb-1">
              Vidéo non vue
            </p>
            <p className="text-sm font-black text-rose-500">-1 point</p>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
            <p className="text-[11px] font-bold text-white mb-1">
              Vidéo non validée (score &lt; 5)
            </p>
            <p className="text-sm font-black text-amber-500">-0,5 point</p>
          </div>
        </div>
      </div>

      {/** Section résultats  */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:grid-cols-5">
        {videosToWork.map((video) => (
          <div
            key={video.code}
            className="group relative bg-slate-900 border border-slate-800 p-5 rounded-[2rem] hover:border-rose-500/30 transition-all overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors"></div>
            {/** Card video */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-lg uppercase font-black text-white leading-none">
                  {video.code}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-black leading-none ${video.score == 0 ? "text-rose-600" : "text-amber-500" /* || (typeof score === 'number' && score < 8) */}`}
                >
                  {/* Score de la vidéo la formule  compare si score est null ou inférieur à 8 */}
                  {video.score != 0 && video.score != null
                    ? `${video.score}/10`
                    : "non vue"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
