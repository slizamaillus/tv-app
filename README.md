# TV App (AetherLauncher)

Lanzador de apps para un portatil conectado a la TV (React + Vite) empaquetado como .exe ligero
(host C# + WebView2, ~5 MB).

## Generar el ejecutable
    npm run exe        # deja todo en release\TvApp\

Ejecuta `release\TvApp\TvApp.exe`. Requiere Windows 10/11 con WebView2 (ya incluido en Windows 11).

## Opciones
- `TvApp.exe --install-startup` / `--remove-startup`: iniciar con Windows.
- `--windowed`: modo ventana para pruebas. F11 alterna pantalla completa; Ctrl+Shift+Q cierra.
- Mantiene el equipo despierto y se recupera si falla WebView2.
- Datos (apps, tema) en `%LOCALAPPDATA%\TvApp`.

## Desarrollo
    npm install && npm run dev
