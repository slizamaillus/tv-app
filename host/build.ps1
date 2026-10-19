# Genera release\TvApp\ (TvApp.exe + app\ + DLLs de WebView2). Requiere solo Node y Windows.
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$lib  = Join-Path $PSScriptRoot 'lib'
$out  = Join-Path $root 'release\TvApp'
$ver  = '1.0.2903.40'
$csc  = "$env:WINDIR\Microsoft.NET\Framework64\v4.0.30319\csc.exe"

Set-Location $root
if (-not (Test-Path node_modules)) { npm install; if ($LASTEXITCODE) { throw 'npm install fallo' } }
npm run build; if ($LASTEXITCODE) { throw 'vite build fallo' }

if (-not (Test-Path "$lib\Microsoft.Web.WebView2.Core.dll")) {
  New-Item -ItemType Directory -Force $lib | Out-Null
  $zip = Join-Path $env:TEMP "webview2-$ver.zip"
  Invoke-WebRequest "https://www.nuget.org/api/v2/package/Microsoft.Web.WebView2/$ver" -OutFile $zip
  $tmp = Join-Path $env:TEMP "webview2-$ver"
  Expand-Archive $zip $tmp -Force
  Copy-Item "$tmp\lib\net462\Microsoft.Web.WebView2.Core.dll","$tmp\lib\net462\Microsoft.Web.WebView2.WinForms.dll","$tmp\runtimes\win-x64\native\WebView2Loader.dll" $lib
}

Remove-Item $out -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $out | Out-Null
& $csc /nologo /target:winexe /platform:x64 /optimize+ /out:"$out\TvApp.exe" `
  /r:"$lib\Microsoft.Web.WebView2.Core.dll" /r:"$lib\Microsoft.Web.WebView2.WinForms.dll" `
  /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.Web.Extensions.dll `
  "$PSScriptRoot\TvHost.cs"
if ($LASTEXITCODE) { throw 'csc fallo' }
Copy-Item "$lib\*.dll" $out
Copy-Item (Join-Path $root 'dist') (Join-Path $out 'app') -Recurse
$mb = [math]::Round(((Get-ChildItem $out -Recurse -File | Measure-Object Length -Sum).Sum)/1MB,1)
Write-Host "Listo: $out ($mb MB)"
