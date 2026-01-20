Option Explicit

' =========================================================================================
' CONFIGURATION SUPABASE
' Remplacer ces valeurs par celles de votre projet Supabase (Paramètres > API)
' =========================================================================================
Const SUPABASE_URL As String = "https://xciusxowoxlostxxpbjn.supabase.co"
Const SUPABASE_KEY As String = "sb_publishable_118MNXAMxwEwlO5U6foShg_2bE3hufo"

' =========================================================================================
' MACRO PRINCIPALE A LIER AU BOUTON
' =========================================================================================
Sub SynchroniserOngletActif()
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    Dim tableName As String
    
    ' Nettoyer le nom de l'onglet pour la comparaison (minuscules, sans accents simples)
    Dim cleanName As String
    cleanName = LCase(ws.Name)
    cleanName = Replace(cleanName, "é", "e")
    cleanName = Replace(cleanName, "è", "e")
    cleanName = Replace(cleanName, "ê", "e")
    
    ' Détecter la table cible selon le nom de l'onglet
    If InStr(cleanName, "planning") > 0 Then
        tableName = "planning"
        EnvoyerPlanning ws, tableName
    ElseIf InStr(cleanName, "eleves t1") > 0 Then
        tableName = "eleves"
        EnvoyerNotes ws, tableName, "T1"
    ElseIf InStr(cleanName, "eleves t2") > 0 Then
        tableName = "eleves"
        EnvoyerNotes ws, tableName, "T2"
    ElseIf InStr(cleanName, "eleves t3") > 0 Then
        tableName = "eleves"
        EnvoyerNotes ws, tableName, "T3"
    Else
        MsgBox "L'onglet '" & ws.Name & "' n'est pas reconnu." & vbCrLf & _
               "Noms attendus : 'Affichage-ib-planning', 'Affichage eleves T1', etc.", vbExclamation
    End If
End Sub

' =========================================================================================
' FONCTION D'ENVOI POUR LE PLANNING
' =========================================================================================
Sub EnvoyerPlanning(ws As Worksheet, tableName As String)
    Dim lastRow As Long
    Dim i As Long
    Dim jsonBody As String
    Dim httpRequest As Object
    
    ' Trouver la dernière ligne
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    ' Créer l'objet HTTP
    Set httpRequest = CreateObject("MSXML2.XMLHTTP")
    
    ' Boucler sur les lignes de données (à partir de la ligne 3)
    For i = 3 To lastRow
        ' Construire le JSON par étapes pour éviter l'erreur de "nombre de caractères de continuité"
        jsonBody = "{"
        jsonBody = jsonBody & """cond"": """ & EscapeJson(ws.Cells(i, 1).Value) & """, "
        jsonBody = jsonBody & """rec"": """ & EscapeJson(ws.Cells(i, 2).Value) & """, "
        jsonBody = jsonBody & """deriv"": """ & EscapeJson(ws.Cells(i, 3).Value) & """, "
        jsonBody = jsonBody & """signe"": """ & EscapeJson(ws.Cells(i, 4).Value) & """, "
        jsonBody = jsonBody & """sg"": """ & EscapeJson(ws.Cells(i, 5).Value) & """, "
        jsonBody = jsonBody & """cv"": """ & EscapeJson(ws.Cells(i, 6).Value) & """, "
        jsonBody = jsonBody & """python"": """ & EscapeJson(ws.Cells(i, 7).Value) & """, "
        jsonBody = jsonBody & """lim"": """ & EscapeJson(ws.Cells(i, 8).Value) & """, "
        jsonBody = jsonBody & """graph"": """ & EscapeJson(ws.Cells(i, 9).Value) & """, "
        jsonBody = jsonBody & """conv"": """ & EscapeJson(ws.Cells(i, 10).Value) & """, "
        jsonBody = jsonBody & """vect"": """ & EscapeJson(ws.Cells(i, 11).Value) & """, "
        jsonBody = jsonBody & """dte"": """ & EscapeJson(ws.Cells(i, 12).Value) & """, "
        jsonBody = jsonBody & """lim_fn"": """ & EscapeJson(ws.Cells(i, 13).Value) & """, "
        jsonBody = jsonBody & """co"": """ & EscapeJson(ws.Cells(i, 14).Value) & """, "
        jsonBody = jsonBody & """den"": """ & EscapeJson(ws.Cells(i, 15).Value) & """, "
        jsonBody = jsonBody & """trigo"": """ & EscapeJson(ws.Cells(i, 16).Value) & """, "
        jsonBody = jsonBody & """plan"": """ & EscapeJson(ws.Cells(i, 17).Value) & """, "
        jsonBody = jsonBody & """v"": """ & EscapeJson(ws.Cells(i, 18).Value) & """, "
        jsonBody = jsonBody & """bino"": """ & EscapeJson(ws.Cells(i, 19).Value) & """, "
        jsonBody = jsonBody & """integr"": """ & EscapeJson(ws.Cells(i, 20).Value) & """, "
        jsonBody = jsonBody & """aire"": """ & EscapeJson(ws.Cells(i, 21).Value) & """, "
        jsonBody = jsonBody & """int_plus"": """ & EscapeJson(ws.Cells(i, 22).Value) & """, "
        jsonBody = jsonBody & """va"": """ & EscapeJson(ws.Cells(i, 23).Value) & """, "
        jsonBody = jsonBody & """ed"": """ & EscapeJson(ws.Cells(i, 24).Value) & """ "
        jsonBody = jsonBody & "}"
        
        ' Envoyer la requête
        Call SendPostRequest(httpRequest, tableName, jsonBody)
    Next i
    
    MsgBox "Export Planning terminé !", vbInformation
End Sub

' =========================================================================================
' FONCTION D'ENVOI POUR LES NOTES (ELEVES)
' =========================================================================================
Sub EnvoyerNotes(ws As Worksheet, tableName As String, trimestre As String)
    Dim lastRow As Long
    Dim i As Long
    Dim jsonBody As String
    Dim httpRequest As Object
    
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    Set httpRequest = CreateObject("MSXML2.XMLHTTP")
    
    For i = 3 To lastRow
        ' Convertir les valeurs numériques (remplacer virgule par point pour JSON)
        ' Colonnes : 3=Moy, 4=QCM, 5=Reg, 6=BrIB, 7=Br+, 8=TotBr, 9=Appr, 10=DST, 11=BB, 12=MoyDST, 13=Code
        Dim moyenne As String: moyenne = Replace(ws.Cells(i, 3).Value, ",", ".")
        Dim qcm As String: qcm = Replace(ws.Cells(i, 4).Value, ",", ".")
        Dim regularite As String: regularite = Replace(ws.Cells(i, 5).Value, ",", ".")
        Dim brique_ib As String: brique_ib = Replace(ws.Cells(i, 6).Value, ",", ".")
        Dim brique_plus As String: brique_plus = Replace(ws.Cells(i, 7).Value, ",", ".")
        Dim total_briques As String: total_briques = Replace(ws.Cells(i, 8).Value, ",", ".")
        Dim apprentissage As String: apprentissage = Replace(ws.Cells(i, 9).Value, ",", ".")
        Dim dst As String: dst = Replace(ws.Cells(i, 10).Value, ",", ".")
        Dim bb As String: bb = Replace(ws.Cells(i, 11).Value, ",", ".")
        Dim moy_dst As String: moy_dst = Replace(ws.Cells(i, 12).Value, ",", ".")
        Dim code As String: code = ws.Cells(i, 13).Value
        
        jsonBody = "{"
        jsonBody = jsonBody & """trimestre"": """ & trimestre & """, "
        jsonBody = jsonBody & """nom"": """ & EscapeJson(ws.Cells(i, 1).Value) & """, "
        jsonBody = jsonBody & """prenom"": """ & EscapeJson(ws.Cells(i, 2).Value) & """, "
        jsonBody = jsonBody & """moyenne"": " & IIf(IsNumeric(moyenne) And moyenne <> "", moyenne, "null") & ", "
        jsonBody = jsonBody & """qcm"": " & IIf(IsNumeric(qcm) And qcm <> "", qcm, "null") & ", "
        jsonBody = jsonBody & """regularite"": " & IIf(IsNumeric(regularite) And regularite <> "", regularite, "null") & ", "
        jsonBody = jsonBody & """brique_ib"": " & IIf(IsNumeric(brique_ib) And brique_ib <> "", brique_ib, "null") & ", "
        jsonBody = jsonBody & """brique_plus"": " & IIf(IsNumeric(brique_plus) And brique_plus <> "", brique_plus, "null") & ", "
        jsonBody = jsonBody & """total_briques"": " & IIf(IsNumeric(total_briques) And total_briques <> "", total_briques, "null") & ", "
        jsonBody = jsonBody & """apprentissage"": " & IIf(IsNumeric(apprentissage) And apprentissage <> "", apprentissage, "null") & ", "
        jsonBody = jsonBody & """dst"": " & IIf(IsNumeric(dst) And dst <> "", dst, "null") & ", "
        jsonBody = jsonBody & """bb"": " & IIf(IsNumeric(bb) And bb <> "", bb, "null") & ", "
        jsonBody = jsonBody & """moy_dst"": " & IIf(IsNumeric(moy_dst) And moy_dst <> "", moy_dst, "null") & ", "
        jsonBody = jsonBody & """code"": """ & EscapeJson(code) & """ "
        jsonBody = jsonBody & "}"
        
        Call SendPostRequest(httpRequest, tableName, jsonBody)
    Next i
    
    MsgBox "Export Notes (" & trimestre & ") terminé !", vbInformation
End Sub

' =========================================================================================
' UTILITAIRES
' =========================================================================================
Sub SendPostRequest(httpRequest As Object, tableName As String, jsonBody As String)
    Dim url As String
    url = SUPABASE_URL & "/rest/v1/" & tableName
    
    With httpRequest
        .Open "POST", url, False
        .setRequestHeader "Content-Type", "application/json"
        .setRequestHeader "apikey", SUPABASE_KEY
        .setRequestHeader "Authorization", "Bearer " & SUPABASE_KEY
        .setRequestHeader "Prefer", "return=minimal" ' Pour ne pas attendre de réponse lourde
        .send jsonBody
    End With
    
    If httpRequest.Status >= 400 Then
        Debug.Print "Erreur : " & httpRequest.responseText
    End If
End Sub

Function EscapeJson(ByVal txt As Variant) As String
    If IsError(txt) Then EscapeJson = "": Exit Function
    If IsNull(txt) Then EscapeJson = "": Exit Function
    
    Dim tmp As String
    tmp = CStr(txt)
    tmp = Replace(tmp, "\", "\\")
    tmp = Replace(tmp, """", "\""")
    tmp = Replace(tmp, vbCrLf, "\n")
    tmp = Replace(tmp, vbCr, "\n")
    tmp = Replace(tmp, vbLf, "\n")
    EscapeJson = tmp
End Function
