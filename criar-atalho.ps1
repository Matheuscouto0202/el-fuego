$desktop = [Environment]::GetFolderPath('Desktop')
$WS = New-Object -ComObject WScript.Shell
$lnk = $WS.CreateShortcut("$desktop\TAKI SUSHI - Novo.lnk")
$lnk.TargetPath = 'wscript.exe'
$lnk.Arguments = '"C:\Users\mathe\Downloads\NEW TAKI\abrir-taki-new.vbs"'
$lnk.WorkingDirectory = 'C:\Users\mathe\Downloads\NEW TAKI'
$lnk.Description = 'Abre o cardapio digital TAKI SUSHI'
$lnk.Save()
Write-Output 'Atalho criado com sucesso'
