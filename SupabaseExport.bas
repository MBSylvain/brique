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
    
    ' Détecter la table cible selon le nom de l'onglet
    Select Case ws.Name
        Case "Affichage-ib-planning"
            tableName = "planning"
            EnvoyerPlanning ws, tableName
            
        Case "Affichage eleves T1"
            tableName = "eleves"
            EnvoyerNotes ws, tableName, "T1"
            
        Case "Affichage eleves T2"
            tableName = "eleves"
            EnvoyerNotes ws, tableName, "T2"
            
        Case "Affichage eleves T3"
            tableName = "eleves"
            EnvoyerNotes ws, tableName, "T3"
            
        Case Else
            MsgBox "Cet onglet n'est pas configuré pour l'export.", vbExclamation
    End Select
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
        ' Construire le JSON
        ' Attention : les noms des champs doivent correspondre EXACTEMENT à ceux de la base de données
        jsonBody = "{" & _
            """cond"": """ & EscapeJson(ws.Cells(i, 1).Value) & """, " & _
            """rec"": """ & EscapeJson(ws.Cells(i, 2).Value) & """, " & _
            """deriv"": """ & EscapeJson(ws.Cells(i, 3).Value) & """, " & _
            """signe"": """ & EscapeJson(ws.Cells(i, 4).Value) & """, " & _
            """sg"": """ & EscapeJson(ws.Cells(i, 5).Value) & """, " & _
            """cv"": """ & EscapeJson(ws.Cells(i, 6).Value) & """, " & _
            """python"": """ & EscapeJson(ws.Cells(i, 7).Value) & """, " & _
            """lim"": """ & EscapeJson(ws.Cells(i, 8).Value) & """, " & _
            """graph"": """ & EscapeJson(ws.Cells(i, 9).Value) & """, " & _
            """conv"": """ & EscapeJson(ws.Cells(i, 10).Value) & """, " & _
            """vect"": """ & EscapeJson(ws.Cells(i, 11).Value) & """, " & _
            """dte"": """ & EscapeJson(ws.Cells(i, 12).Value) & """, " & _
            """lim_fn"": """ & EscapeJson(ws.Cells(i, 13).Value) & """, " & _
            """co"": """ & EscapeJson(ws.Cells(i, 14).Value) & """, " & _
            """den"": """ & EscapeJson(ws.Cells(i, 15).Value) & """, " & _
            """trigo"": """ & EscapeJson(ws.Cells(i, 16).Value) & """, " & _
            """plan"": """ & EscapeJson(ws.Cells(i, 17).Value) & """, " & _
            """v"": """ & EscapeJson(ws.Cells(i, 18).Value) & """, " & _
            """bino"": """ & EscapeJson(ws.Cells(i, 19).Value) & """, " & _
            """integr"": """ & EscapeJson(ws.Cells(i, 20).Value) & """, " & _
            """aire"": """ & EscapeJson(ws.Cells(i, 21).Value) & """, " & _
            """int_plus"": """ & EscapeJson(ws.Cells(i, 22).Value) & """, " & _
            """va"": """ & EscapeJson(ws.Cells(i, 23).Value) & """, " & _
            """ed"": """ & EscapeJson(ws.Cells(i, 24).Value) & """ " & _
        "}"
        
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
        ' Colonnes : 3=Moy, 4=QCM, 5=Reg, 6=BrIB, 7=Br+, 8=TotBr, 9=Appr, 10=DST, 11=BB, 12=MoyDST
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
        
        jsonBody = "{" & _
            """trimestre"": """ & trimestre & """, " & _
            """nom"": """ & EscapeJson(ws.Cells(i, 1).Value) & """, " & _
            """prenom"": """ & EscapeJson(ws.Cells(i, 2).Value) & """, " & _
            """moyenne"": " & IIf(IsNumeric(moyenne) And moyenne <> "", moyenne, "null") & ", " & _
            """qcm"": " & IIf(IsNumeric(qcm) And qcm <> "", qcm, "null") & ", " & _
            """regularite"": " & IIf(IsNumeric(regularite) And regularite <> "", regularite, "null") & ", " & _
            """brique_ib"": " & IIf(IsNumeric(brique_ib) And brique_ib <> "", brique_ib, "null") & ", " & _
            """brique_plus"": " & IIf(IsNumeric(brique_plus) And brique_plus <> "", brique_plus, "null") & ", " & _
            """total_briques"": " & IIf(IsNumeric(total_briques) And total_briques <> "", total_briques, "null") & ", " & _
            """apprentissage"": " & IIf(IsNumeric(apprentissage) And apprentissage <> "", apprentissage, "null") & ", " & _
            """dst"": " & IIf(IsNumeric(dst) And dst <> "", dst, "null") & ", " & _
            """bb"": " & IIf(IsNumeric(bb) And bb <> "", bb, "null") & ", " & _
            """moy_dst"": " & IIf(IsNumeric(moy_dst) And moy_dst <> "", moy_dst, "null") & " " & _
            "}"
        
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
