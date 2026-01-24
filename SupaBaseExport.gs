// =========================================================================================
// CONFIGURATION SUPABASE
// =========================================================================================
const SUPABASE_URL = "https://xciusxowoxlostxxpbjn.supabase.co";
// Note : Le script utilise votre SERVICE_ROLE_KEY pour les maj (à garder secret)
const SUPABASE_KEY = "sb_publishable_118MNXAMxwEwlO5U6foShg_2bE3hufo";

// =========================================================================================
// MACRO PRINCIPALE
// =========================================================================================
function SynchroniserOngletActif() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const sheetName = sheet.getName();

  // 1. Vérification du Code Professeur
  const profCode = GetTeacherCode();
  if (!profCode) return;

  // 2. Détection du type d'onglet selon les nouveaux noms
  if (sheetName === "Révision-IB") {
    EnvoyerPlanning(sheet, profCode);
  } else if (["T1", "T2", "T3"].includes(sheetName)) {
    // Détection du trimestre selon le nom exact de l'onglet
    let trim = 0;
    if (sheetName === "T1") trim = 1;
    else if (sheetName === "T2") trim = 2;
    else if (sheetName === "T3") trim = 3;
    EnvoyerNotes(sheet, trim, profCode);
  } else if (sheetName.toLowerCase().includes("eleve")) {
    EnvoyerListeEleves(sheet, profCode);
  } else {
    SpreadsheetApp.getUi().alert(
      "L'onglet '" +
        sheetName +
        "' n'est pas reconnu.\nNoms valides : 'Révision-IB', 'T1', 'T2', 'T3', ou 'Eleve/Eleves'."
    );
  }
}

// =========================================================================================
// ENVOI DU PLANNING
// =========================================================================================
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
// GESTION DES ELEVES (Création automatique et récupération des codes)
// =========================================================================================
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