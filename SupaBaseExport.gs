// =========================================================================================
// CONFIGURATION SUPABASE
// =========================================================================================
const SUPABASE_URL = "https://xciusxowoxlostxxpbjn.supabase.co";
// Note : Le script utilise votre SERVICE_ROLE_KEY pour les maj (à garder secret)
const SUPABASE_KEY = "sb_publishable_118MNXAMxwEwlO5U6foShg_2bE3hufo";

// =========================================================================================
// MACRO PRINCIPALE
// =========================================================================================
/**
 * Personnalisation des noms d'onglets détectés :
 * - Modifie la condition sur sheetName ci-dessous pour ajouter ou changer les noms d'onglets reconnus.
 *   Exemple : if (sheetName === "MonPlanning") { ... }
 * - Pour les onglets de notes, ajoute ou remplace les valeurs dans le tableau ["T1", "T2", "T3"]
 *
 * Personnalisation des colonnes traitées :
 * - Dans chaque fonction (EnvoyerPlanning, EnvoyerNotes, EnvoyerListeEleves), adapte les indices de colonnes (data[i][X])
 *   pour correspondre à la structure de tes onglets (A=0, B=1, C=2, etc.).
 * - Tu peux aussi ajouter/supprimer des champs dans les objets jsonBody selon tes besoins.
 */
function SynchroniserOngletActif() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const sheetName = sheet.getName();

  // 1. Vérification du Code Professeur
  const profCode = GetTeacherCode();
  if (!profCode) return;

  // 2. Détection du type d'onglet selon les noms personnalisés
  // Personnalise ici les noms d'onglets reconnus :
  if (sheetName === "Révisions-IB") {
    EnvoyerPlanning(sheet, profCode);
  } else if (["T1", "T2", "T3"].includes(sheetName)) {
    // Ajoute ici d'autres noms d'onglets de notes si besoin
    let trim = 0;
    if (sheetName === "T1") trim = 1;
    else if (sheetName === "T2") trim = 2;
    else if (sheetName === "T3") trim = 3;
    EnvoyerNotes(sheet, trim, profCode);
  } else if (sheetName.toLowerCase().includes("eleve")) {
    // Tu peux remplacer "eleve" par un autre mot-clé si besoin
    EnvoyerListeEleves(sheet, profCode);
  }
  // === NOUVEL ONGLET ELEA VIDÉO ===
  else if (sheetName === "ELEA Vidéo") {
    EnvoyerELEAVideo(sheet, profCode);
  } else if (sheetName === "QCM") {
    EnvoyerQCM(sheet, profCode);
   }else {
    SpreadsheetApp.getUi().alert(
      "L'onglet '" +
        sheetName +
        "' n'est pas reconnu.\nModifie le script pour ajouter tes propres noms d'onglets si besoin."
    );
  }
}

// =========================================================================================
// ENVOI DU PLANNING
// =========================================================================================
//
// Personnalise ici les colonnes à traiter pour l'onglet Planning :
// data[i][0] = colonne A, data[i][1] = colonne B, etc.
// Ajoute, retire ou adapte les champs selon la structure de ton onglet.
function EnvoyerPlanning(sheet, profCode) {
  const data = sheet.getDataRange().getValues();
  for (let i = 2; i < data.length; i++) {
    if (data[i][0] !== "") {
      const jsonBody = {
        p_nom: EscapeJson(data[i][0]),
        p_prenom: EscapeJson(data[i][1]),
        p_code_professeur: profCode,
        p_indicateurs: {
          cond: EscapeJson(data[i][2]),
          rec: EscapeJson(data[i][3]),
          deriv: EscapeJson(data[i][4]),
          signe: EscapeJson(data[i][5]),
          sg: EscapeJson(data[i][6]),
          cv: EscapeJson(data[i][7]),
          python: EscapeJson(data[i][8]),
          lim: EscapeJson(data[i][9]),
          graph: EscapeJson(data[i][10]),
          conv: EscapeJson(data[i][11]),
          vect: EscapeJson(data[i][12]),
          dte: EscapeJson(data[i][13]),
          lim_fn: EscapeJson(data[i][14]),
          co: EscapeJson(data[i][15]),
          den: EscapeJson(data[i][16]),
          trigo: EscapeJson(data[i][17]),
          plan: EscapeJson(data[i][18]),
          v: EscapeJson(data[i][19]),
          bino: EscapeJson(data[i][20]),
          integr: EscapeJson(data[i][21]),
          aire: EscapeJson(data[i][22]),
          int_plus: EscapeJson(data[i][23]),
          va: EscapeJson(data[i][24]),
          ed: EscapeJson(data[i][25]),
        },
      };
      SendRpcRequest("sync_planning_excel", jsonBody);
    }
  }
  SpreadsheetApp.getUi().alert("Export Planning terminé !");
}

// =========================================================================================
// ENVOI DES NOTES
// =========================================================================================
//
// Personnalise ici les colonnes à traiter pour les onglets de notes :
// data[i][0] = colonne A, data[i][1] = colonne B, etc.
// Adapte les champs selon la structure de tes onglets de notes.
function EnvoyerNotes(sheet, trim, profCode) {
  const data = sheet.getDataRange().getValues();
  for (let i = 2; i < data.length; i++) {
    if (data[i][0] !== "") {
      const jsonBody = {
        p_nom: EscapeJson(data[i][0]),
        p_prenom: EscapeJson(data[i][1]),
        p_trimestre: trim,
        p_code_professeur: profCode,
        p_donnees: {
          moyenne: ToNum(data[i][2]),
          qcm: ToNum(data[i][3]),
          regularite: ToNum(data[i][4]),
          brique_ib: ToNum(data[i][5]),
          brique_plus: ToNum(data[i][6]),
          total_briques: ToNum(data[i][7]),
          apprentissage: ToNum(data[i][8]),
          dst: ToNum(data[i][9]),
          bb: ToNum(data[i][10]),
          classe: EscapeJson(data[i][11]),
        },
      };
      SendRpcRequest("sync_notes_excel", jsonBody);
    }
  }
  SpreadsheetApp.getUi().alert("Export Notes (T" + trim + ") terminé !");
}

// =========================================================================================
// ENVOI ELEA VIDÉO - AVEC TRIMESTRE (ligne 1) + SOUS-TITRES (ligne 2)
// =========================================================================================
function EnvoyerELEAVideo(sheet, profCode) {
  const data = sheet.getDataRange().getValues();
  
  // Ligne 1 : en-têtes de trimestre (T1, T2, T3)
  const trimestreHeaders = data[1];
  
  // Ligne 2 : sous-titres (S1-V1, F0-V1, etc.)
  const subHeaders = data[2];
  
  Logger.log("=== DÉBUT SYNCHRONISATION ELEA VIDÉO ===");
  Logger.log("Onglet: " + sheet.getName());
  
  let compteur = 0;
  let totalColonnes = 0;
  
  // Parcourir toutes les lignes à partir de la ligne 3 (index 2)
  for (let i = 2; i < data.length; i++) {
    const prenom = data[i][0] ? data[i][0].toString().trim() : "";  // Colonne A
    const nom = data[i][1] ? data[i][1].toString().trim() : "";     // Colonne B
    
    if (prenom === "" || nom === "") continue;
    
    // Construction de l'objet donnees avec TOUTES les colonnes
    const donnees = {};
    let nbColonnes = 0;
    
    // Parcourir TOUTES les colonnes à partir de C (index 2)
    for (let j = 2; j < data[i].length; j++) {
      
      // 1. Récupérer le trimestre (ligne 1)
      const trimestre = trimestreHeaders[j] ? trimestreHeaders[j].toString().trim() : "";
      
      // 2. Récupérer le sous-titre (ligne 2)
      const sousTitre = subHeaders[j] ? subHeaders[j].toString().trim() : "";
      
      // Ne traiter que si on a les deux informations
      if (trimestre && sousTitre) {
        
        // Nettoyer le trimestre (T1 -> t1, T2 -> t2)
        const trimestreClean = trimestre
          .replace(/\s+/g, '_')
          .replace(/-/g, '_')
          .toLowerCase();
        
        // Nettoyer le sous-titre (S1-V1 -> s1_v1, F0-V1 -> f0_v1)
        const sousTitreClean = sousTitre
          .replace(/\s+/g, '_')
          .replace(/-/g, '_')
          .toLowerCase();
        
        // Construire la clé finale: t1_s1_v1
        const cle = `${trimestreClean}_${sousTitreClean}`;
        
        // Récupérer la valeur
        const valeur = data[i][j];
        
        // Stocker la valeur
        donnees[cle] = ToNum(valeur);
        nbColonnes++;
      }
    }
    
    totalColonnes += nbColonnes;
    
    // LOG pour vérifier
    Logger.log(`Élève ${compteur + 1}: ${nom} ${prenom} - ${nbColonnes} indicateurs`);
    
    // Afficher les 5 premières clés en exemple
    const premieresCles = Object.keys(donnees).slice(0, 5);
    Logger.log("  Exemple: " + JSON.stringify(premieresCles));
    
    const jsonBody = {
      p_nom: EscapeJson(nom),
      p_prenom: EscapeJson(prenom),
      p_code_professeur: profCode,
      p_donnees: donnees
    };
    
    // Envoyer à Supabase
    SendRpcRequest("sync_eleas_video_excel", jsonBody);
    compteur++;
  }
  
  Logger.log("=== RÉCAPITULATIF ===");
  Logger.log(`Total élèves: ${compteur}`);
  Logger.log(`Total indicateurs: ${totalColonnes}`);
  Logger.log(`Moyenne: ${(totalColonnes / compteur).toFixed(1)} indicateurs/élève`);
  
  SpreadsheetApp.getUi().alert(
    `Export ELEA Vidéo terminé !\n` +
    `${compteur} élèves synchronisés\n` +
    `${totalColonnes} indicateurs au total`
  );
}

// =========================================================================================
// ENVOI QCM - AVEC TRIMESTRE + SOUS-TITRES (à partir de la colonne F)
// =========================================================================================
function EnvoyerQCM(sheet, profCode) {
  const data = sheet.getDataRange().getValues();
  
  // Identifier les lignes importantes
  // Ligne 5 (index 4) : trimestres (T1, T2, T3)
  // Ligne 4 (index 3) : sous-titres (QCM1, QCM2, ...)
  // Ligne 6 et + (index 5+) : données élèves
  
  // Vérifier qu'on a assez de lignes
  if (data.length < 6) {
    SpreadsheetApp.getUi().alert("L'onglet QCM n'a pas assez de données !");
    return;
  }
  
  // Ligne des trimestres (index 4)
  const trimestreHeaders = data[2];
  
  // Ligne des sous-titres (index 3)
  const subHeaders = data[1];
  
  Logger.log("=== DÉBUT SYNCHRONISATION QCM ===");
  Logger.log("Onglet: " + sheet.getName());
  
  let compteur = 0;
  let totalIndicateurs = 0;
  
  // Commencer à la colonne F (index 5)
  const COLONNE_DEPART = 5; // F = index 5 (A=0, B=1, C=2, D=3, E=4, F=5)
  
  // Parcourir toutes les lignes à partir de la ligne 6 (index 5)
  for (let i = 3; i < data.length; i++) {
    
    // Les colonnes A à E contiennent des informations sur l'élève
    // A (index 0) : Prénom ou Nom ?
    // B (index 1) : ?
    // C (index 2) : ?
    // D (index 3) : ?
    // E (index 4) : ?
    
    // À adapter selon la structure réelle de votre onglet QCM
    const nom = data[i][0] ? data[i][0].toString().trim() : "";  // Colonne A
    const prenom = data[i][1] ? data[i][1].toString().trim() : "";     // Colonne B
    
    // Si pas de nom/prénom, on passe
    if (prenom === "" && nom === "") continue;
    
    // Construction de l'objet donnees
    const donnees = {};
    let nbIndicateurs = 0;
    
    // Parcourir les colonnes à partir de F (index 5)
    for (let j = COLONNE_DEPART; j < data[i].length; j++) {
      
      // Récupérer le trimestre (ligne 5, index 4)
      const trimestre = trimestreHeaders[j] ? trimestreHeaders[j].toString().trim() : "";
      
      // Récupérer le sous-titre (ligne 4, index 3)
      const sousTitre = subHeaders[j] ? subHeaders[j].toString().trim() : "";
      
      // Ne traiter que si on a les deux informations
      if (trimestre && sousTitre) {
        
        // Nettoyer le trimestre (T1 -> t1, T2 -> t2)
        const trimestreClean = trimestre
          .replace(/\s+/g, '_')
          .replace(/-/g, '_')
          .toLowerCase();
        
        // Nettoyer le sous-titre (QCM1 -> qcm1, QCM2 -> qcm2)
        const sousTitreClean = sousTitre
          .replace(/\s+/g, '_')
          .replace(/-/g, '_')
          .toLowerCase();
        
        // Construire la clé finale: t1_qcm1, t2_qcm15, etc.
        const cle = `${trimestreClean}_${sousTitreClean}`;
        
        // Récupérer la valeur
        const valeur = data[i][j];
        
        // Stocker la valeur
        donnees[cle] = ToNum(valeur);
        nbIndicateurs++;
      }
    }
    
    totalIndicateurs += nbIndicateurs;
    
    // LOG pour vérifier
    Logger.log(`Élève ${compteur + 1}: ${nom} ${prenom} - ${nbIndicateurs} QCM`);
    
    // Afficher les 5 premières clés en exemple
    const premieresCles = Object.keys(donnees).slice(0, 5);
    Logger.log("  Exemple: " + JSON.stringify(premieresCles));
    
    const jsonBody = {
      p_nom: EscapeJson(nom),
      p_prenom: EscapeJson(prenom),
      p_code_professeur: profCode,
      p_donnees: donnees
    };
    
    // Envoyer à Supabase
    SendRpcRequest("sync_qcm_excel", jsonBody);
    compteur++;
  }
  
  Logger.log("=== RÉCAPITULATIF QCM ===");
  Logger.log(`Total élèves: ${compteur}`);
  Logger.log(`Total indicateurs QCM: ${totalIndicateurs}`);
  Logger.log(`Moyenne: ${(totalIndicateurs / compteur).toFixed(1)} QCM/élève`);
  
  SpreadsheetApp.getUi().alert(
    `Export QCM terminé !\n` +
    `${compteur} élèves synchronisés\n` +
    `${totalIndicateurs} QCM au total`
  );
}




// =========================================================================================
// GESTION DES ELEVES (Création automatique et récupération des codes)
// =========================================================================================
//
// Personnalise ici les colonnes à traiter pour l'onglet Eleves :
// data[i][0] = colonne A, data[i][1] = colonne B, etc.
// Adapte les champs selon la structure de ton onglet Eleves.
function EnvoyerListeEleves(sheet, profCode) {
  const data = sheet.getDataRange().getValues();
  for (let i = 2; i < data.length; i++) {
    if (data[i][0] !== "") {
      const jsonBody = {
        p_nom: EscapeJson(data[i][0]),
        p_prenom: EscapeJson(data[i][1]),
        p_classe_nom: EscapeJson(data[i][2]),
        p_niveau: EscapeJson(data[i][3]),
        p_code_professeur: profCode,
      };
      const response = SendRpcWithResponse("sync_eleves_liste_excel", jsonBody);
      if (response) {
        sheet.getRange(i + 1, 5).setValue(response.replace(/"/g, "")); // Colonne E
      }
    }
  }
  SpreadsheetApp.getUi().alert("Synchronisation de la liste des élèves terminée !");
}

// =========================================================================================
// UTILITAIRES Réseau
// =========================================================================================
function SendRpcRequest(funcName, jsonBody) {
  SendRpcWithResponse(funcName, jsonBody);
}

function SendRpcWithResponse(funcName, jsonBody) {
  const url = SUPABASE_URL + "/rest/v1/rpc/" + funcName;
  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
    },
    payload: JSON.stringify(jsonBody),
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() >= 400) {
    Logger.log("Erreur RPC (" + funcName + "): " + response.getContentText());
    return "";
  } else {
    return response.getContentText();
  }
}

// =========================================================================================
// UTILITAIRES
// =========================================================================================
function GetTeacherCode() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let code = "";
  try {
    code = ss.getSheetByName("Eleves").getRange("H1").getValue();
  } catch (e) {}
  if (!code) {
    try {
      code = ss.getSheetByName("Eleve").getRange("H1").getValue();
    } catch (e) {}
  }
  if (!code) {
    const activeSheet = ss.getActiveSheet();
    if (activeSheet.getName().toLowerCase().includes("eleve")) {
      code = activeSheet.getRange("H1").getValue();
    }
  }
  if (!code) {
    SpreadsheetApp.getUi().alert(
      "ERREUR : Le Code Professeur est absent de la cellule [H1] de l'onglet 'Eleves' ou 'Eleve'."
    );
    return "";
  }
  return code;
}

function ToNum(val) {
  if (typeof val === "number" && !isNaN(val)) {
    return val;
  }
  if (typeof val === "string" && val.trim() !== "" && !isNaN(Number(val.replace(",", ".")))) {
    return Number(val.replace(",", "."));
  }
  return null;
}

function EscapeJson(txt) {
  if (txt === null || txt === undefined) return "";
  let tmp = String(txt);
  tmp = tmp.replace(/\\/g, "\\\\");
  tmp = tmp.replace(/"/g, "\\\"");
  tmp = tmp.replace(/\r\n|\r|\n/g, "\\n");
  return tmp;
}