import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Table, List, Calendar, Info, HelpCircle, Copy, Check, Code } from 'lucide-react'

export default function GuideStructure() {
    const navigate = useNavigate()
    const [copied, setCopied] = useState(false)

    const vbaCode = `Option Explicit

' =========================================================================================
' CONFIGURATION SUPABASE
' =========================================================================================
Const SUPABASE_URL As String = "https://xciusxowoxlostxxpbjn.supabase.co"
Const SUPABASE_KEY As String = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaXVzeG93b3hsb3N0eHhwYmpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODkxNTg3OCwiZXhwIjoyMDg0NDkxODc4fQ.b3Y5PKHKMD_fkHhE3KkMmZBuFDyVWoseLVIFn5RB6VQ"

' =========================================================================================
' MACRO PRINCIPALE
' =========================================================================================
Sub SynchroniserOngletActif()
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    Dim cleanName As String
    cleanName = LCase(ws.Name)
    cleanName = Replace(cleanName, "é", "e")
    
    Dim profCode As String
    profCode = GetTeacherCode()
    If profCode = "" Then Exit Sub
    
    If InStr(cleanName, "planning") > 0 Then
        Call EnvoyerPlanning(ws, profCode)
    ElseIf InStr(cleanName, "notes") > 0 Or (InStr(cleanName, "eleve") > 0 And InStr(cleanName, "t") > 0) Then
        Dim trim As Integer
        If InStr(cleanName, "t1") > 0 Then trim = 1 Else If InStr(cleanName, "t2") > 0 Then trim = 2 Else If InStr(cleanName, "t3") > 0 Then trim = 3 Else trim = 0
        
        If trim > 0 Then
            Call EnvoyerNotes(ws, trim, profCode)
        Else
            MsgBox "L'onglet doit contenir T1, T2 ou T3 (ex: 'Notes T1').", vbExclamation
        End If
    ElseIf InStr(cleanName, "eleve") > 0 Then
        Call EnvoyerListeEleves(ws, profCode)
    Else
        MsgBox "Onglet non reconnu.", vbExclamation
    End If
End Sub

' ... [Code complet disponible ci-dessous] ...`;

    const fullVbaCode = `Option Explicit

' =========================================================================================
' CONFIGURATION SUPABASE
' =========================================================================================
Const SUPABASE_URL As String = "https://xciusxowoxlostxxpbjn.supabase.co"
Const SUPABASE_KEY As String = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaXVzeG93b3hsb3N0eHhwYmpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODkxNTg3OCwiZXhwIjoyMDg0NDkxODc4fQ.b3Y5PKHKMD_fkHhE3KkMmZBuFDyVWoseLVIFn5RB6VQ"

Sub SynchroniserOngletActif()
    Dim ws As Worksheet
    Set ws = ActiveSheet
    Dim cleanName As String
    cleanName = LCase(ws.Name)
    cleanName = Replace(cleanName, "é", "e")
    Dim profCode As String
    profCode = GetTeacherCode()
    If profCode = "" Then Exit Sub
    If InStr(cleanName, "planning") > 0 Then
        Call EnvoyerPlanning(ws, profCode)
    ElseIf InStr(cleanName, "notes") > 0 Or (InStr(cleanName, "eleve") > 0 And InStr(cleanName, "t") > 0) Then
        Dim trim As Integer
        If InStr(cleanName, "t1") > 0 Then trim = 1 Else If InStr(cleanName, "t2") > 0 Then trim = 2 Else If InStr(cleanName, "t3") > 0 Then trim = 3 Else trim = 0
        If trim > 0 Then
            Call EnvoyerNotes(ws, trim, profCode)
        Else
            MsgBox "Pour les notes, l'onglet doit contenir T1, T2 ou T3 (ex: 'Notes T1').", vbExclamation
        End If
    ElseIf InStr(cleanName, "eleve") > 0 Then
        Call EnvoyerListeEleves(ws, profCode)
    Else
        MsgBox "L'onglet '" & ws.Name & "' n'est pas reconnu."
    End If
End Sub

Sub EnvoyerPlanning(ws As Worksheet, profCode As String)
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

Sub EnvoyerNotes(ws As Worksheet, trim As Integer, profCode As String)
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

Sub EnvoyerListeEleves(ws As Worksheet, profCode As String)
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
            If response <> "" Then ws.Cells(i, 5).Value = Replace(response, """", "")
        End If
    Next i
    MsgBox "Synchronisation terminée !", vbInformation
End Sub

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
        If .Status >= 400 Then SendRpcWithResponse = "" Else SendRpcWithResponse = .responseText
    End With
End Function

Function GetTeacherCode() As String
    On Error Resume Next
    Dim code As String
    code = Sheets("Eleves").Range("H1").Value
    if code = "" Then code = Sheets("Eleve").Range("H1").Value
    GetTeacherCode = code
End Function

Function ToNum(val As Variant) As String
    If IsNumeric(val) And val <> "" Then ToNum = Replace(CStr(val), ",", ".") Else ToNum = "null"
End Function

Function EscapeJson(ByVal txt As Variant) As String
    Dim tmp As String
    tmp = CStr(txt)
    tmp = Replace(tmp, "\", "\\")
    tmp = Replace(tmp, """", "\""")
    EscapeJson = tmp
End Function`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullVbaCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const sections = [
        {
            title: "Onglet 'Eleves' (Gestion Globale)",
            icon: <List className="w-6 h-6 text-blue-400" />,
            description: "Utilisez cet onglet pour inscrire vos élèves et générer leurs codes secrets.",
            columns: [
                { letter: "A", name: "Nom", desc: "Le nom de famille de l'élève." },
                { letter: "B", name: "Prénom", desc: "Le prénom de l'élève." },
                { letter: "C", name: "Classe", desc: "Le nom de la classe (ex: TG1, TG2). Créée automatiquement si elle n'existe pas." },
                { letter: "D", name: "Niveau", desc: "Le niveau de la classe (ex: Terminale, Première)." },
                { letter: "E", name: "Code Secret", desc: "Laissez cette colonne vide. Le script VBA y inscrira automatiquement le code généré." },
            ],
            note: "Important : Votre Code Professeur doit impérativement être saisi dans la cellule [H1] de cet onglet."
        },
        {
            title: "Onglets 'Notes T1 / T2 / T3'",
            icon: <Table className="w-6 h-6 text-purple-400" />,
            description: "Onglets pour synchroniser les notes par trimestre. Nommez-les précisément (ex: 'Notes T1').",
            columns: [
                { letter: "A", name: "Nom", desc: "Nom de l'élève (doit correspondre à l'onglet Eleves)." },
                { letter: "B", name: "Prénom", desc: "Prénom de l'élève (doit correspondre à l'onglet Eleves)." },
                { letter: "C", name: "Moyenne", desc: "Moyenne générale calculée dans Excel." },
                { letter: "D", name: "QCM", desc: "Note des QCM Flash ou évaluations rapides." },
                { letter: "E", name: "Régularité", desc: "Note globale de régularité dans le travail." },
                { letter: "F", name: "Brique IB", desc: "Nombre de briques 'Indicateurs de Base' validées." },
                { letter: "G", name: "Brique Plus", desc: "Nombre de briques Bonus ou Approfondissement." },
                { letter: "H", name: "Total Briques", desc: "Somme totale des briques." },
                { letter: "I", name: "Apprentissage", desc: "Note d'apprentissage ou de progression." },
                { letter: "J", name: "DST", desc: "Note du dernier Devoir Sur Table." },
                { letter: "K", name: "BB", desc: "Note du Bac Blanc (facultatif, mettez null si vide)." },
                { letter: "L", name: "Classe", desc: "Rappel du nom de la classe pour filtrer les données." },
            ]
        },
        {
            title: "Onglet 'Planning'",
            icon: <Calendar className="w-6 h-6 text-emerald-400" />,
            description: "Suivez l'avancement du programme. Le nom de l'onglet doit contenir le mot 'Planning'.",
            columns: [
                { letter: "A", name: "Nom", desc: "Nom de l'élève." },
                { letter: "B", name: "Prénom", desc: "Prénom de l'élève." },
                { letter: "C - Z", name: "Indicateurs", desc: "24 colonnes successives (Indicateurs mathématiques : COND, REC, DERIV, SIGNE, SG, CV, PYTHON, LIM, GRAPH, CONV, VECT, DTE, LIM_FN, CO, DEN, TRIGO, PLAN, V, BINO, INTEGR, AIRE, INT_PLUS, VA, ED)." },
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 sm:p-12 font-sans selection:bg-indigo-500/30">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <button
                            onClick={() => navigate('/teacher')}
                            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors mb-6 group bg-indigo-500/5 px-4 py-2 rounded-xl border border-indigo-500/10"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Retour au Dashboard
                        </button>
                        <h1 className="text-5xl font-black tracking-tight leading-tight">
                            Structure du <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Fichier Excel</span>
                        </h1>
                        <p className="text-slate-300 text-lg mt-4 max-w-2xl font-medium">
                            Pour garantir une synchronisation sans erreur, veuillez respecter scrupuleusement l'ordre et le contenu des colonnes ci-dessous.
                        </p>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl backdrop-blur-xl">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl">
                            <HelpCircle className="text-indigo-400 w-10 h-10" />
                        </div>
                        <div>
                            <p className="font-black text-white text-lg">Format Requis</p>
                            <p className="text-slate-400 font-medium">Fichier .xlsx ou .xlsm</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-20">
                    {sections.map((section, idx) => (
                        <section key={idx} className="relative">
                            <div className="flex items-center gap-6 mb-8 px-4">
                                <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
                                    {section.icon}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{section.title}</h2>
                                    <p className="text-slate-400 font-medium">{section.description}</p>
                                </div>
                            </div>

                            <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800/60 overflow-hidden backdrop-blur-sm shadow-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-800/40 border-b border-white/5">
                                                <th className="py-6 px-8 text-xs uppercase tracking-widest text-slate-400 font-black border-r border-white/5">COL.</th>
                                                <th className="py-6 px-8 text-xs uppercase tracking-widest text-slate-400 font-black border-r border-white/5">INTITULÉ ATTENDU</th>
                                                <th className="py-6 px-8 text-xs uppercase tracking-widest text-slate-400 font-black">DESCRIPTION ET FORMAT</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {section.columns.map((col, cIdx) => (
                                                <tr key={cIdx} className="hover:bg-indigo-500/5 transition-all group">
                                                    <td className="py-6 px-8 border-r border-white/5 w-24">
                                                        <div className="flex items-center justify-center">
                                                            <span className="bg-slate-800 group-hover:bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-mono font-black border border-white/5 shadow-inner transition-colors">
                                                                {col.letter}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 px-8 border-r border-white/5 min-w-[200px]">
                                                        <span className="text-white font-black text-lg bg-white/5 px-4 py-2 rounded-xl border border-white/10 group-hover:border-indigo-500/30 transition-colors">
                                                            {col.name}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 px-8">
                                                        <p className="text-slate-200 text-base font-medium leading-relaxed group-hover:text-white transition-colors">
                                                            {col.desc}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {section.note && (
                                <div className="mt-8 mx-4 p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl flex items-start gap-4 backdrop-blur-sm">
                                    <div className="p-2 bg-amber-500/20 rounded-xl">
                                        <Info className="text-amber-500 w-6 h-6" />
                                    </div>
                                    <p className="text-amber-200/90 text-base font-bold leading-relaxed">
                                        {section.note}
                                    </p>
                                </div>
                            )}
                        </section>
                    ))}

                    {/* New Section: Script VBA */}
                    <section className="relative scroll-mt-24" id="vba-code">
                        <div className="flex items-center gap-6 mb-8 px-4">
                            <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
                                <Code className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tight">Script VBA Complet</h2>
                                <p className="text-slate-400 font-medium">Copiez ce code dans un module VBA Excel pour activer la synchronisation.</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl group">
                            <div className="flex items-center justify-between px-8 py-4 bg-slate-800/50 border-b border-white/5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-indigo-600/20"
                                >
                                    {copied ? <><Check className="w-4 h-4" /> Copié !</> : <><Copy className="w-4 h-4" /> Copier le code</>}
                                </button>
                            </div>
                            <div className="p-8 max-h-[500px] overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed bg-[#020617]/50">
                                <pre className="text-indigo-200/90 whitespace-pre">
                                    {fullVbaCode}
                                </pre>
                            </div>
                        </div>

                        <div className="mt-8 mx-4 p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl flex items-start gap-4">
                            <div className="p-2 bg-indigo-500/20 rounded-xl">
                                <Info className="text-indigo-400 w-6 h-6" />
                            </div>
                            <div className="text-indigo-200/90 text-sm font-medium space-y-2">
                                <p className="font-bold text-white">Instructions d'installation :</p>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Dans Excel, faites [ALT + F11] pour ouvrir l'éditeur VBA.</li>
                                    <li>Menu [Insertion] &#10141; [Module].</li>
                                    <li>Collez le code ci-dessus dans la fenêtre qui vient de s'ouvrir.</li>
                                    <li>Refermez l'éditeur.</li>
                                    <li>Créez un bouton sur votre feuille et affectez-lui la macro "SynchroniserOngletActif".</li>
                                </ol>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-24 text-center border-t border-slate-900 pt-12 pb-20">
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">
                        BriqueSuivi © 2026 • Système Expert de Synchronisation • v2.1
                    </p>
                </div>
            </div>
        </div>
    )
}
