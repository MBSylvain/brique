import React from "react";
import { Check, Calendar } from "lucide-react";
import brickImage from "../assets/une_brique.png";

const IBProgression = ({ ibProgression, planning = [] }) => {
  // 1. Vérification initiale : on s'assure que les données existent et ne sont pas vides
  if (!ibProgression || ibProgression.length === 0) {
    return null; // Ne rien afficher si aucune ligne de progression n'est retournée par la base
  }

  // 2. Extraction du JSON contenant les clés/valeurs de l'IB Progression
  // On prend le premier élément du tableau car on s'attend à une seule ligne retournée par élève
  const ibDonnees = Object.fromEntries(
    Object.entries(ibProgression[0]?.donnees || {}).map(([k, v]) => [
      k.split("_")[0].toLowerCase(),
      v,
    ])
  );

  // Fonction utilitaire pour trouver la note sans tenir compte de la casse (ex: "IB2" vs "ib2")
  // La BDD stocke parfois des suffixes (ex: "ib2_rc" au lieu de juste "ib2")
  const trouverNoteIB = (labelRecherche) => {
    if (!labelRecherche) return null;
    return ibDonnees[labelRecherche.toLowerCase()] || null;
  };

  // Helper pour vérifier si un item est validé (note >= 1)
  const isKeyValidated = (label) => {
    const note = trouverNoteIB(label);
    const num = parseFloat(note);
    return !isNaN(num) && num >= 1;
  };

  // 3. Traitement et formatage des données
  // L'objet ressemble à { "ib1": "OK", "ib2": null } qu'on transforme en tableau [{key: "ib1", value: "OK"}]
  const ibList = Object.entries(ibDonnees)
    // On ignore les éléments qui n'ont pas de valeur (ex: non évalués) ou qui sont vides
    .filter(([key, value]) => value !== null && value !== "")
    .map(([key, value]) => ({ key: key.split("_")[0], value }));

  // Si après ce filtrage il n'y a plus aucun élément à afficher, on montre un état "vide" stylisé
  if (ibList.length === 0 && planning.length === 0) {
    return (
      <div className="bg-slate-900/30 rounded-[2rem] p-16 text-center border border-slate-800 border-dashed">
        <p className="text-slate-600 font-bold">Aucune donnée IB disponible</p>
      </div>
    );
  }

  // Groupes de notions pour le planning graphique
  const planningGroups = [
    {
      title: "Suites",
      color: "text-indigo-400",
      items: [
        { displayName: "récurrence", dbKey: "rec", label: "ib2", prevKey: null, nextKey: "cv" },
        { displayName: "convergence", dbKey: "cv", label: "ib6", prevKey: "rec", nextKey: "sg" },
        { displayName: "Suite Géo", dbKey: "sg", label: "ib5", prevKey: "cv", nextKey: "python" },
        { displayName: "Python", dbKey: "python", label: "ib7", prevKey: "sg", nextKey: "lim" },
        { displayName: "Limites", dbKey: "lim", label: "ib7b", prevKey: "python", nextKey: null },
      ],
    },
    {
      title: "Probabilités",
      color: "text-indigo-400",
      items: [
        { displayName: "Proba cond", dbKey: "cond", label: "ib1", prevKey: null, nextKey: "bino" },
        { displayName: "Biniomiale", dbKey: "bino", label: "ib18", prevKey: "cond", nextKey: "va" },
        { displayName: "VA", dbKey: "va", label: "ib22", prevKey: "bino", nextKey: null },
      ],
    },
    {
      title: "Fonctions",
      color: "text-indigo-400",
      items: [
        { displayName: "dériver", dbKey: "deriv", label: "ib3", prevKey: null, nextKey: "signe" },
        { displayName: "signe", dbKey: "signe", label: "ib4", prevKey: "deriv", nextKey: "conv" },
        { displayName: "convexite", dbKey: "conv", label: "ib9", prevKey: "signe", nextKey: "co" },
        { displayName: "continuité", dbKey: "co", label: "ib13", prevKey: "conv", nextKey: "integr" },
        { displayName: "calcul d'intégrales", dbKey: "integr", label: "ib19", prevKey: "co", nextKey: "aire" },
        { displayName: "aire", dbKey: "aire", label: "ib20", prevKey: "integr", nextKey: "ed" },
        { displayName: "equa Diff", dbKey: "ed", label: "ib23", prevKey: "aire", nextKey: "graph" },
        { displayName: "graphique", dbKey: "graph", label: "ib8", prevKey: "ed", nextKey: "lim_fn" },
        { displayName: "limites", dbKey: "lim_fn", label: "ib12", prevKey: "graph", nextKey: "trigo" },
        { displayName: "Fns trigos", dbKey: "trigo", label: "ib15", prevKey: "lim_fn", nextKey: null },
        { displayName: "inégalités", dbKey: "int_plus", label: "ib21", prevKey: "trigo", nextKey: null },
      ],
    },
    {
      title: "Espace",
      color: "text-indigo-400",
      items: [
        { displayName: "droite", dbKey: "dte", label: "ib11", prevKey: null, nextKey: "plan" },
        { displayName: "Equation Plan", dbKey: "plan", label: "ib16", prevKey: "dte", nextKey: "v" },
        { displayName: "volume", dbKey: "v", label: "ib17", prevKey: "plan", nextKey: "vect" },
        { displayName: "vecteurs", dbKey: "vect", label: "ib10", prevKey: "v", nextKey: null },
      ],
    },
  ];

  return (
    <div className="space-y-16">

      {/* --- SECTION PLANNING GRAPHIQUE --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-indigo-500 flex items-center gap-3">
            <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
            Planning Révisions IB
          </h2>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden min-h-[400px]">
          <div className="divide-y divide-slate-900">
            {planning.length > 0 ? (
              <div className="p-8 space-y-10">
                {planningGroups.map((group) => (
                  <div key={group.title} className="space-y-4">
                    <h4 className={`text-[12px] font-black uppercase tracking-[0.2em] ${group.color} opacity-80 px-1`}>
                      {group.title}
                    </h4>
                    <div className="grid grid-cols-2 w-full sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
                      {group.items.map((item) => {
                        // 'value' (planning[0]?.[item.dbKey]) correspond à l'état renseigné dans le planning général (ex: "S1", "S2")
                        const value = planning[0]?.[item.dbKey];

                        // 'ibNote' correspond à la note numérique (0 à 7) récupérée dans ib_progeleve
                        const ibNote = trouverNoteIB(item.label);
                        const numericNote = parseFloat(ibNote);

                        // LOGIQUE DE PROGRESSION (NEXT/PREV KEYS) :
                        // On utilise 'prevKey' et 'nextKey' pour définir l'ordre des chapitres.
                        
                        // 1. Vérifie si le pré-requis (le chapitre précédent défini par 'prevKey') est validé
                        const prevItem = group.items.find((i) => i.dbKey === item.prevKey);
                        const isPrevValidated = !item.prevKey || (prevItem && isKeyValidated(prevItem.label));

                        // 2. Vérifie si le chapitre suivant (défini par 'nextKey') a commencé (a une note)
                        const nextItem = group.items.find((i) => i.dbKey === item.nextKey);
                        const nextNote = nextItem ? trouverNoteIB(nextItem.label) : null;
                        const isNextStarted = nextNote !== null && nextNote !== "";

                        // ÉTATS DE LA NOTION :
                        // isDone : Le chapitre est terminé et acquis (la note est >= 1)
                        const isDone = numericNote >= 1;
                        
                        // isCurrent : Le chapitre est "débloqué" mais pas encore validé (Précédent fini, mais note < 1)
                        const isCurrent = !isDone && isPrevValidated;
                        
                        // isLocked : Le chapitre est bloqué par un cadenas (Le pré-requis précédent n'est pas encore validé)
                        const isLocked = !isPrevValidated;

                        let display;
                        let statusColor = "";
                        let isIBValidated = false;

                        if (isLocked) {
                          display = (
                            <span className="text-rose-500 font-medium italic text-[10px]">
                              🔒
                            </span>
                          );
                          statusColor = "border-rose-500/30 bg-rose-500/5 border-3";
                        } else if (isDone) {
                          isIBValidated = true;
                          display = (
                            <div className="flex flex-col items-center justify-center gap-1">
                              <span className="text-green-400 flex items-center gap-1">
                                {value} <Check className="w-3 h-3 text-green-500" />
                              </span>
                              <div className="text-green-400 flex items-center gap-1">
                                {/* {ibNote} {ibNote > 1 ? "briques" : "brique"} */}
                                {ibNote} <img
                                  src={brickImage}
                                  alt="Brique IB"
                                  style={{ width: 40, height: 40 }}
                                />
                              </div>
                            </div>
                          );
                          statusColor = "border-green-500/30 bg-green-500/5 border-3";
                        } else if (isCurrent) {
                          display = (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-amber-500 font-medium italic text-[10px]">
                                {value} à valider
                              </span>

                            </div>
                          );
                          statusColor = "border-amber-500/30 bg-amber-500/5 border-3";
                        }

                        return (
                          <div
                            key={item.dbKey}
                            className={`bg-slate-900 p-3 rounded-xl border transition-all flex flex-col justify-center gap-1 group hover:scale-105 duration-200 ${statusColor} relative`}
                          >
                            <p className="text-[9px] wrap-break-word text-center font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                              {item.displayName}
                            </p>
                            <p className="text-xs text-center font-bold text-slate-100">
                              {display}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center">
                <Calendar className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-loose">
                  Aucun planning <br /> pour le moment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default IBProgression;