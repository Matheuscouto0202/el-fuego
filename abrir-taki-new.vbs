Set oShell = CreateObject("WScript.Shell")
Set oFSO   = CreateObject("Scripting.FileSystemObject")

sPort  = "3002"
sURL   = "http://localhost:" & sPort
sNode  = "C:\nvm4w\nodejs\node.exe"
sServe = "C:\Users\mathe\AppData\Roaming\npm\node_modules\serve\build\main.js"
sOut   = "C:\Users\mathe\Downloads\NEW TAKI\out"

oShell.Run """" & sNode & """ """ & sServe & """ """ & sOut & """ -p " & sPort & " --no-clipboard", 0, False

Dim bPronto, i
bPronto = False
For i = 1 To 15
    WScript.Sleep 1000
    On Error Resume Next
    Dim oHTTP
    Set oHTTP = CreateObject("MSXML2.XMLHTTP")
    oHTTP.Open "GET", sURL, False
    oHTTP.Send
    If Err.Number = 0 Then
        If oHTTP.Status = 200 Then
            bPronto = True
            Exit For
        End If
    End If
    Err.Clear
    On Error GoTo 0
Next

If Not bPronto Then
    MsgBox "Nao foi possivel iniciar o servidor.", vbCritical, "TAKI SUSHI"
    WScript.Quit
End If

Dim sChromeExe
sChromeExe = "C:\Program Files\Google\Chrome\Application\chrome.exe"
If Not oFSO.FileExists(sChromeExe) Then
    sChromeExe = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
End If

If oFSO.FileExists(sChromeExe) Then
    oShell.Run """" & sChromeExe & """ --app=" & sURL & " --window-size=390,844", 1, False
Else
    oShell.Run "start " & sURL, 0, False
End If
