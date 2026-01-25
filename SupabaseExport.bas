Option Explicit

' =========================================================================================
' CONFIGURATION SUPABASE
' =========================================================================================
Const SUPABASE_URL As String = "https://xciusxowoxlostxxpbjn.supabase.co"
' Note : Le script utilise votre SERVICE_ROLE_KEY pour les maj (à garder secret)
Const SUPABASE_KEY As String = "sb_publishable_118MNXAMxwEwlO5U6foShg_2bE3hufo"

' Emplacement du code professeur : Cellule [H1] de l'onglet 'Eleves'
' =========================================================================================

' =========================================================================================
' MACRO PRINCIPALE
' =========================================================================================
Sub SynchroniserOngletActif()
    ' ==============================
    ' Personnalisation des noms d'onglets détectés :
    ' - Modifie les conditions If/InStr ci-dessous pour ajouter ou changer les noms d'onglets reconnus.
    '   Exemple : If InStr(cleanName, "mononglet") > 0 Then ...
    ' - Pour les onglets de notes, adapte la détection du trimestre (T1, T2, T3) selon tes besoins.
    ' ==============================
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    Dim cleanName As String
    cleanName = LCase(ws.Name)
    cleanName = Replace(cleanName, "é", "e")
    
    ' 1. Vérification du Code Professeur
    Dim profCode As String
    profCode = GetTeacherCode()
    If profCode = "" Then Exit Sub
    
    ' 2. Détection du type d'onglet
    If InStr(cleanName, "planning") > 0 Then
        Call EnvoyerPlanning(ws, profCode)
    ElseIf InStr(cleanName, "notes") > 0 Or (InStr(cleanName, "eleve") > 0 And InStr(cleanName, "t") > 0) Then
        ' Détection du trimestre (T1, T2 ou T3)
        Dim trim As Integer
        If InStr(cleanName, "t1") > 0 Then trim = 1 Else If InStr(cleanName, "t2") > 0 Then trim = 2 Else If InStr(cleanName, "t3") > 0 Then trim = 3 Else trim = 0
        
        If trim > 0 Then
            Call EnvoyerNotes(ws, trim, profCode)
        Else
            MsgBox "Pour les notes, l'onglet doit contenir T1, T2 ou T3 (ex: 'Notes T1').", vbExclamation
        End If
    ElseIf InStr(cleanName, "eleve") > 0 Then
        ' Onglet de gestion globale (sans trimestre)
        Call EnvoyerListeEleves(ws, profCode)
    Else
        MsgBox "L'onglet '" & ws.Name & "' n'est pas reconnu." & vbCrLf & _
               "Noms valides : 'Planning', 'Notes T1/T2/T3', ou 'Eleve/Eleves'.", vbExclamation
    End If
End Sub

' =========================================================================================
' ENVOI DU PLANNING
' =========================================================================================
Sub EnvoyerPlanning(ws As Worksheet, profCode As String)
    ' ==============================
    ' Personnalisation des colonnes traitées pour l''onglet Planning :
    ' - Adapte les indices ws.Cells(i, X) pour correspondre à la structure de ton onglet (A=1, B=2, ...).
    ' - Ajoute, retire ou adapte les champs du jsonBody selon les colonnes présentes dans ta feuille.
    ' ==============================
    Dim lastRow As Long, i As Long
    Dim jsonBody As String
    Dim httpRequest As Object
    Set httpRequest = CreateObject("MSXML2.XMLHTTP")
    
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    For i = 3 To lastRow
        If ws.Cells(i, 1).Value <> "" Then
            jsonBody = "{"
            jsonBody = jsonBody & """p_nom"": """ & EscapeJson(ws.Cells(i, 1).Value) & """, "
            jsonBody = jsonBody & """p_prenom"": """ & EscapeJson(ws.Cells(i, 2).Value) & """, "
            jsonBody = jsonBody & """p_code_professeur"": """ & profCode & """, "
            jsonBody = jsonBody & """p_indicateurs"": {"
            jsonBody = jsonBody & """cond"": """ & EscapeJson(ws.Cells(i, 3).Value) & """, "
            jsonBody = jsonBody & """rec"": """ & EscapeJson(ws.Cells(i, 4).Value) & """, "
            jsonBody = jsonBody & """deriv"": """ & EscapeJson(ws.Cells(i, 5).Value) & """, "
            jsonBody = jsonBody & """signe"": """ & EscapeJson(ws.Cells(i, 6).Value) & """, "
            jsonBody = jsonBody & """sg"": """ & EscapeJson(ws.Cells(i, 7).Value) & """, "
            jsonBody = jsonBody & """cv"": """ & EscapeJson(ws.Cells(i, 8).Value) & """, "
            jsonBody = jsonBody & """python"": """ & EscapeJson(ws.Cells(i, 9).Value) & """, "
            jsonBody = jsonBody & """lim"": """ & EscapeJson(ws.Cells(i, 10).Value) & """, "
            jsonBody = jsonBody & """graph"": """ & EscapeJson(ws.Cells(i, 11).Value) & """, "
            jsonBody = jsonBody & """conv"": """ & EscapeJson(ws.Cells(i, 12).Value) & """, "
            jsonBody = jsonBody & """vect"": """ & EscapeJson(ws.Cells(i, 13).Value) & """, "
            jsonBody = jsonBody & """dte"": """ & EscapeJson(ws.Cells(i, 14).Value) & """, "
            jsonBody = jsonBody & """lim_fn"": """ & EscapeJson(ws.Cells(i, 15).Value) & """, "
            jsonBody = jsonBody & """co"": """ & EscapeJson(ws.Cells(i, 16).Value) & """, "
            jsonBody = jsonBody & """den"": """ & EscapeJson(ws.Cells(i, 17).Value) & """, "
            jsonBody = jsonBody & """trigo"": """ & EscapeJson(ws.Cells(i, 18).Value) & """, "
            jsonBody = jsonBody & """plan"": """ & EscapeJson(ws.Cells(i, 19).Value) & """, "
            jsonBody = jsonBody & """v"": """ & EscapeJson(ws.Cells(i, 20).Value) & """, "
            jsonBody = jsonBody & """bino"": """ & EscapeJson(ws.Cells(i, 21).Value) & """, "
            jsonBody = jsonBody & """integr"": """ & EscapeJson(ws.Cells(i, 22).Value) & """, "
            jsonBody = jsonBody & """aire"": """ & EscapeJson(ws.Cells(i, 23).Value) & """, "
            jsonBody = jsonBody & """int_plus"": """ & EscapeJson(ws.Cells(i, 24).Value) & """, "
            jsonBody = jsonBody & """va"": """ & EscapeJson(ws.Cells(i, 25).Value) & """, "
            jsonBody = jsonBody & """ed"": """ & EscapeJson(ws.Cells(i, 26).Value) & """"
            jsonBody = jsonBody & "}"
            jsonBody = jsonBody & "}"
            
            Call SendRpcRequest(httpRequest, "sync_planning_excel", jsonBody)
        End If
    Next i
    MsgBox "Export Planning terminé !", vbInformation
End Sub

' =========================================================================================
' ENVOI DES NOTES
' =========================================================================================
Sub EnvoyerNotes(ws As Worksheet, trim As Integer, profCode As String)
    ' ==============================
    ' Personnalisation des colonnes traitées pour les onglets de notes :
    ' - Adapte les indices ws.Cells(i, X) pour correspondre à la structure de ton onglet (A=1, B=2, ...).
    ' - Ajoute, retire ou adapte les champs du jsonBody selon les colonnes présentes dans ta feuille de notes.
    ' ==============================
    Dim lastRow As Long, i As Long
    Dim jsonBody As String
    Dim httpRequest As Object
    Set httpRequest = CreateObject("MSXML2.XMLHTTP")
    
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    For i = 3 To lastRow
        If ws.Cells(i, 1).Value <> "" Then
            jsonBody = "{"
            jsonBody = jsonBody & """p_nom"": """ & EscapeJson(ws.Cells(i, 1).Value) & """, "
            jsonBody = jsonBody & """p_prenom"": """ & EscapeJson(ws.Cells(i, 2).Value) & """, "
            jsonBody = jsonBody & """p_trimestre"": " & trim & ", "
            jsonBody = jsonBody & """p_code_professeur"": """ & profCode & """, "
            jsonBody = jsonBody & """p_donnees"": {"
            jsonBody = jsonBody & """moyenne"": " & ToNum(ws.Cells(i, 3).Value) & ", "
            jsonBody = jsonBody & """qcm"": " & ToNum(ws.Cells(i, 4).Value) & ", "
            jsonBody = jsonBody & """regularite"": " & ToNum(ws.Cells(i, 5).Value) & ", "
            jsonBody = jsonBody & """brique_ib"": " & ToNum(ws.Cells(i, 6).Value) & ", "
            jsonBody = jsonBody & """brique_plus"": " & ToNum(ws.Cells(i, 7).Value) & ", "
            jsonBody = jsonBody & """total_briques"": " & ToNum(ws.Cells(i, 8).Value) & ", "
            jsonBody = jsonBody & """apprentissage"": " & ToNum(ws.Cells(i, 9).Value) & ", "
            jsonBody = jsonBody & """dst"": " & ToNum(ws.Cells(i, 10).Value) & ", "
            jsonBody = jsonBody & """bb"": " & ToNum(ws.Cells(i, 11).Value) & ", "
            jsonBody = jsonBody & """classe"": """ & EscapeJson(ws.Cells(i, 12).Value) & """"
            jsonBody = jsonBody & "}"
            jsonBody = jsonBody & "}"
            
            Call SendRpcRequest(httpRequest, "sync_notes_excel", jsonBody)
        End If
    Next i
    MsgBox "Export Notes (T" & trim & ") terminé !", vbInformation
End Sub

' =========================================================================================
' GESTION DES ELEVES (Création automatique et récupération des codes)
' =========================================================================================
Sub EnvoyerListeEleves(ws As Worksheet, profCode As String)
    ' ==============================
    ' Personnalisation des colonnes traitées pour l''onglet Eleves :
    ' - Adapte les indices ws.Cells(i, X) pour correspondre à la structure de ton onglet (A=1, B=2, ...).
    ' - Ajoute, retire ou adapte les champs du jsonBody selon les colonnes présentes dans ta feuille Eleves.
    ' ==============================
    Dim lastRow As Long, i As Long
    Dim jsonBody As String
    Dim httpRequest As Object
    Set httpRequest = CreateObject("MSXML2.XMLHTTP")
    
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    For i = 3 To lastRow
        If ws.Cells(i, 1).Value <> "" Then
            jsonBody = "{"
            jsonBody = jsonBody & """p_nom"": """ & EscapeJson(ws.Cells(i, 1).Value) & """, "
            jsonBody = jsonBody & """p_prenom"": """ & EscapeJson(ws.Cells(i, 2).Value) & """, "
            jsonBody = jsonBody & """p_classe_nom"": """ & EscapeJson(ws.Cells(i, 3).Value) & """, "
            jsonBody = jsonBody & """p_niveau"": """ & EscapeJson(ws.Cells(i, 4).Value) & """, "
            jsonBody = jsonBody & """p_code_professeur"": """ & profCode & """"
            jsonBody = jsonBody & "}"
            
            Dim response As String
            response = SendRpcWithResponse(httpRequest, "sync_eleves_liste_excel", jsonBody)
            
            If response <> "" Then
                ws.Cells(i, 5).Value = Replace(response, """", "") ' Remplir le Code Secret
            End If
        End If
    Next i
    MsgBox "Synchronisation de la liste des élèves terminée !", vbInformation
End Sub

' =========================================================================================
' UTILITAIRES Réseau
' =========================================================================================
Sub SendRpcRequest(httpRequest As Object, funcName As String, jsonBody As String)
    Call SendRpcWithResponse(httpRequest, funcName, jsonBody)
End Sub

Function SendRpcWithResponse(httpRequest As Object, funcName As String, jsonBody As String) As String
    Dim url As String
    url = SUPABASE_URL & "/rest/v1/rpc/" & funcName
    
    With httpRequest
        .Open "POST", url, False
        .setRequestHeader "Content-Type", "application/json"
        .setRequestHeader "apikey", SUPABASE_KEY
        .setRequestHeader "Authorization", "Bearer " & SUPABASE_KEY
        .send jsonBody
        
        If .Status >= 400 Then
            Debug.Print "Erreur RPC (" & funcName & "): " & .responseText
            SendRpcWithResponse = ""
        Else
            SendRpcWithResponse = .responseText
        End If
    End With
End Function

Function GetTeacherCode() As String
    On Error Resume Next
    Dim code As String
    
    ' Essaye 'Eleves' puis 'Eleve'
    code = Sheets("Eleves").Range("H1").Value
    If code = "" Then code = Sheets("Eleve").Range("H1").Value
    
    ' Si on est déjà sur l'onglet, essayer aussi la cellule H1 de la feuille active
    If code = "" And InStr(LCase(ActiveSheet.Name), "eleve") > 0 Then
        code = ActiveSheet.Range("H1").Value
    End If
    On Error GoTo 0
    
    If code = "" Then
        MsgBox "ERREUR : Le Code Professeur est absent de la cellule [H1] de l'onglet 'Eleves' ou 'Eleve'.", vbCritical
        GetTeacherCode = ""
    Else
        GetTeacherCode = code
    End If
End Function

Function ToNum(val As Variant) As String
    If IsNumeric(val) And val <> "" Then
        ToNum = Replace(CStr(val), ",", ".")
    Else
        ToNum = "null"
    End If
End Function

Function EscapeJson(ByVal txt As Variant) As String
    If IsError(txt) Or IsNull(txt) Then EscapeJson = "": Exit Function
    Dim tmp As String
    tmp = CStr(txt)
    tmp = Replace(tmp, "\", "\\")
    tmp = Replace(tmp, """", "\""")
    tmp = Replace(tmp, vbCrLf, "\n")
    tmp = Replace(tmp, vbCr, "\n")
    tmp = Replace(tmp, vbLf, "\n")
    EscapeJson = tmp
End Function
