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
  } 
  // === NOUVEL ONGLET QCM ===
  else if (sheetName.startsWith("QCM")) {
    EnvoyerQCM(sheet, profCode);
  }
   else {
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
// ENVOI ELEA VIDÉO - RÉCUPÉRATION DE TOUTES LES COLONNES
// =========================================================================================
function EnvoyerELEAVideo(sheet, profCode) {
  const data = sheet.getDataRange().getValues();
  
  // Ligne 1 : en-têtes de trimestre (T1, T2, T3) - optionnel
  // Ligne 2 : sous-titres (S1-V1, F0-V1, etc.) - optionnel
  
  // Déterminer le trimestre
  const sheetName = sheet.getName();
  let trimestre = 1;
  if (sheetName === "T2") trimestre = 2;
  else if (sheetName === "T3") trimestre = 3;
  
  Logger.log("=== DÉBUT SYNCHRONISATION ELEA VIDÉO ===");
  Logger.log("Onglet: " + sheetName);
  Logger.log("Trimestre: " + trimestre);
  
  let compteur = 0;
  
  // Parcourir toutes les lignes à partir de la ligne 3 (index 2)
  for (let i = 2; i < data.length; i++) {
    const prenom = data[i][0] ? data[i][0].toString().trim() : "";  // Colonne A
    const nom = data[i][1] ? data[i][1].toString().trim() : "";     // Colonne B
    
    if (prenom === "" || nom === "") continue;
    
    // Construction de l'objet donnees avec TOUTES les colonnes
    const donnees = {};
    
    // Parcourir TOUTES les colonnes à partir de C (index 2) jusqu'à la fin
    for (let j = 2; j < data[i].length; j++) {
      // Créer une clé simple : col_C, col_D, col_E, etc.
      const colonneLettre = indexToColumnLetter(j);
      const cle = `col_${colonneLettre}`;
      
      // Récupérer la valeur (garder même les valeurs vides)
      const valeur = data[i][j];
      
      // Stocker la valeur (convertir en nombre si possible)
      donnees[cle] = ToNum(valeur);
    }
    
    // LOG : nombre de colonnes pour cet élève
    Logger.log(`Élève ${compteur + 1}: ${nom} ${prenom} - ${Object.keys(donnees).length} colonnes`);
    
    // Afficher les 5 premières colonnes en exemple
    const premieresColonnes = Object.entries(donnees).slice(0, 5);
    Logger.log("  Exemple: " + JSON.stringify(Object.fromEntries(premieresColonnes)));
    
    const jsonBody = {
      p_nom: EscapeJson(nom),
      p_prenom: EscapeJson(prenom),
      p_trimestre: trimestre,
      p_code_professeur: profCode,
      p_donnees: donnees  // Toutes les colonnes
    };
    
    // Envoyer à Supabase
    SendRpcRequest("sync_eleas_video_excel", jsonBody);
    compteur++;
  }
  
  Logger.log(`=== SYNCHRONISATION TERMINÉE: ${compteur} élèves ===`);
  
  SpreadsheetApp.getUi().alert(
    `Export ELEA Vidéo terminé !\n` +
    `${compteur} élèves synchronisés\n` +
    `Trimestre ${trimestre}`
  );
}

// =========================================================================================
// ENVOI QCM - RÉCUPÉRATION DE TOUTES LES COLONNES
// =========================================================================================
function EnvoyerQCM(sheet, profCode) {
  const data = sheet.getDataRange().getValues();
  
  Logger.log("=== DÉBUT SYNCHRONISATION QCM ===");
  
  let compteur = 0;
  
  // Parcourir toutes les lignes à partir de la ligne 3 (index 2)
  for (let i = 2; i < data.length; i++) {
    const prenom = data[i][0] ? data[i][0].toString().trim() : "";  // Colonne A
    const nom = data[i][1] ? data[i][1].toString().trim() : "";     // Colonne B
    
    if (prenom === "" || nom === "") continue;
    
    // Construction de l'objet donnees avec TOUTES les colonnes
    const donnees = {};
    
    // Parcourir TOUTES les colonnes à partir de C (index 2) jusqu'à la fin
    for (let j = 2; j < data[i].length; j++) {
      const colonneLettre = indexToColumnLetter(j);
      const cle = `col_${colonneLettre}`;
      const valeur = data[i][j];
      donnees[cle] = ToNum(valeur);
    }
    
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
  
  Logger.log(`=== SYNCHRONISATION TERMINÉE: ${compteur} élèves ===`);
  
  SpreadsheetApp.getUi().alert(
    `Export QCM terminé !\n` +
    `${compteur} élèves synchronisés`
  );
}

// Fonction utilitaire pour convertir un index en lettre de colonne (0=A, 1=B, ...)
function indexToColumnLetter(index) {
  let temp, letter = '';
  while (index >= 0) {
    temp = index % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
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