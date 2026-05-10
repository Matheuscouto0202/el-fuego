# Como abrir qualquer site localmente (sem terminal)

Padrão usado em todos os projetos de site desta máquina.

---

## Ferramentas necessárias (instalar uma vez)

```
npm install -g serve
```

Caminhos desta máquina:
- Node.js: `C:\nvm4w\nodejs\node.exe`
- Serve:   `C:\Users\mathe\AppData\Roaming\npm\node_modules\serve\build\main.js`

---

## Como funciona

1. O site é compilado em HTML/CSS/JS estáticos (pasta `out/`)
2. O `serve` entrega esses arquivos como um servidor web local
3. O VBS inicia tudo silenciosamente e abre o Chrome — sem terminal aparecer

---

## Passo a passo para um projeto NOVO

### 1. Configurar o Next.js para exportação estática

No arquivo `next.config.js` do projeto:
```js
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  trailingSlash: false,
}
module.exports = nextConfig
```

### 2. Compilar o site (fazer uma vez, e após cada mudança)

No terminal, dentro da pasta do projeto:
```
npx next build
```
Isso gera a pasta `out/` com os arquivos estáticos.

### 3. Criar o arquivo VBS launcher

Criar um arquivo `abrir-[nome].vbs` na raiz do projeto com o conteúdo abaixo.
Substituir `[CAMINHO DA PASTA OUT]` pelo caminho real (ex: `C:\MEU PROJETO\out`).
Substituir `[NOME]` pelo nome do projeto.
Substituir `[PORTA]` pela porta (3000, 3001, 3002... — porta diferente por projeto).

```vbs
Set oShell = CreateObject("WScript.Shell")
Set oFSO   = CreateObject("Scripting.FileSystemObject")

sPort  = "[PORTA]"
sURL   = "http://localhost:" & sPort
sNode  = "C:\nvm4w\nodejs\node.exe"
sServe = "C:\Users\mathe\AppData\Roaming\npm\node_modules\serve\build\main.js"
sOut   = "[CAMINHO DA PASTA OUT]"

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
    MsgBox "Nao foi possivel iniciar o servidor.", vbCritical, "[NOME]"
    WScript.Quit
End If

Dim sChromeExe
sChromeExe = "C:\Program Files\Google\Chrome\Application\chrome.exe"
If Not oFSO.FileExists(sChromeExe) Then
    sChromeExe = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
End If

If oFSO.FileExists(sChromeExe) Then
    oShell.Run """" & sChromeExe & """ --app=" & sURL & " --window-size=1280,800", 1, False
Else
    oShell.Run "start " & sURL, 0, False
End If
```

### 4. Criar atalho na Área de Trabalho

Abrir o PowerShell e rodar (substituindo os valores):
```powershell
$desktop = [Environment]::GetFolderPath('Desktop')
$WS = New-Object -ComObject WScript.Shell
$lnk = $WS.CreateShortcut("$desktop\[NOME DO SITE].lnk")
$lnk.TargetPath = 'wscript.exe'
$lnk.Arguments = '"[CAMINHO DO PROJETO]\abrir-[nome].vbs"'
$lnk.WorkingDirectory = '[CAMINHO DO PROJETO]'
$lnk.Description = 'Abre o site [NOME]'
$lnk.Save()
```

---

## Acesso pelo celular (mesmo Wi-Fi)

IP desta máquina: `192.168.1.16`

Acessar no celular: `http://192.168.1.16:[PORTA]`

Liberar o firewall (uma vez por projeto):
```powershell
New-NetFirewallRule -DisplayName "[NOME] Celular" -Direction Inbound -Protocol TCP -LocalPort [PORTA] -Action Allow
```

---

## Projetos cadastrados

| Projeto         | Pasta                | Porta | VBS                          |
|-----------------|----------------------|-------|------------------------------|
| ANOVA Site        | C:\ANOVA SITE\out                              | 3000  | C:\ANOVA SITE\abrir-anova.vbs                              |
| Cardapio DG       | C:\Users\mathe\Downloads\Cardapio DG\out       | 3001  | C:\Users\mathe\Downloads\Cardapio DG\abrir-cardapio.vbs   |
| Taki Sushi (novo) | C:\Users\mathe\Downloads\NEW TAKI\out          | 3002  | C:\Users\mathe\Downloads\NEW TAKI\abrir-taki-new.vbs      |
| Taki Sushi        | C:\Users\mathe\Downloads\TAKI SUSHI CARD\out   | 3003  | C:\Users\mathe\Downloads\TAKI SUSHI CARD\abrir-cardapio.vbs |

---

## Regras importantes

- NUNCA usar `next start` ou `next dev` como launcher — lentos e instáveis
- Após qualquer mudança de código: rodar `npx next build` para atualizar `out/`
- Cada projeto usa uma porta diferente (3000, 3001, 3002...)
- API routes do Next.js NÃO funcionam em static export — usar Supabase client direto
