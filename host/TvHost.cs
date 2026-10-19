// Host nativo ligero: ventana a pantalla completa con WebView2 que sirve la carpeta "app".
// Compila con el csc de .NET Framework 4 que viene en Windows (sin SDK).
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows.Forms;
using Microsoft.Win32;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

[assembly: AssemblyTitle("TV App")]
[assembly: AssemblyVersion("1.0.0.0")]

static class Program
{
    const string AppName = "TvApp";
    const string RunKey = @"Software\Microsoft\Windows\CurrentVersion\Run";

    [STAThread]
    static int Main(string[] args)
    {
        string baseDir = AppDomain.CurrentDomain.BaseDirectory;

        if (Has(args, "--install-startup"))
        {
            using (RegistryKey k = Registry.CurrentUser.OpenSubKey(RunKey, true))
                k.SetValue(AppName, "\"" + Application.ExecutablePath + "\"");
            MessageBox.Show("TV App se iniciara con Windows.", AppName);
            return 0;
        }
        if (Has(args, "--remove-startup"))
        {
            using (RegistryKey k = Registry.CurrentUser.OpenSubKey(RunKey, true))
                k.DeleteValue(AppName, false);
            MessageBox.Show("Inicio automatico desactivado.", AppName);
            return 0;
        }

        bool created;
        using (Mutex mutex = new Mutex(true, "Local\\TvApp.SingleInstance", out created))
        {
            if (!created) return 0; // ya hay una instancia corriendo

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm(baseDir, Has(args, "--windowed")));
        }
        return 0;
    }

    static bool Has(string[] args, string flag)
    {
        foreach (string a in args)
            if (string.Equals(a, flag, StringComparison.OrdinalIgnoreCase)) return true;
        return false;
    }
}

class MainForm : Form
{
    const string Host = "tv.app";
    [DllImport("kernel32.dll")] static extern uint SetThreadExecutionState(uint flags);
    const uint ES_CONTINUOUS = 0x80000000, ES_SYSTEM_REQUIRED = 0x1, ES_DISPLAY_REQUIRED = 0x2;

    readonly string appDir;
    readonly WebView2 web = new WebView2();
    int recoveries;

    public MainForm(string baseDir, bool windowed)
    {
        this.appDir = Path.Combine(baseDir, "app");
        Text = "TV App";
        BackColor = Color.Black;
        KeyPreview = true;
        web.Dock = DockStyle.Fill;
        web.DefaultBackgroundColor = Color.Black;
        Controls.Add(web);
        if (windowed) { Size = new Size(1280, 720); StartPosition = FormStartPosition.CenterScreen; }
        else SetFullscreen(true);
        // Mantiene el equipo y la pantalla encendidos mientras la app corre.
        SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED);
        Load += async delegate { await InitWeb(); };
        Activated += delegate { try { web.Focus(); } catch { } };
        FormClosed += delegate { SetThreadExecutionState(ES_CONTINUOUS); };
    }

    void SetFullscreen(bool on)
    {
        if (on) { FormBorderStyle = FormBorderStyle.None; WindowState = FormWindowState.Normal; Bounds = Screen.FromControl(this).Bounds; }
        else { FormBorderStyle = FormBorderStyle.Sizable; WindowState = FormWindowState.Normal; Size = new Size(1280, 720); }
    }

    async System.Threading.Tasks.Task InitWeb()
    {
        string data = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "TvApp", "webview");
        CoreWebView2EnvironmentOptions opts = new CoreWebView2EnvironmentOptions("--autoplay-policy=no-user-gesture-required");
        CoreWebView2Environment env = await CoreWebView2Environment.CreateAsync(null, data, opts);
        await web.EnsureCoreWebView2Async(env);
        CoreWebView2 core = web.CoreWebView2;
        core.Settings.AreDevToolsEnabled = false;
        core.Settings.AreDefaultContextMenusEnabled = false;
        core.Settings.IsStatusBarEnabled = false;
        core.Settings.IsZoomControlEnabled = false;
        core.Settings.IsBuiltInErrorPageEnabled = false;
        core.SetVirtualHostNameToFolderMapping(Host, appDir, CoreWebView2HostResourceAccessKind.Allow);
        core.WebMessageReceived += OnMessage;
        core.NewWindowRequested += delegate (object s, CoreWebView2NewWindowRequestedEventArgs e) { e.Handled = true; Launch(e.Uri); };
        core.NavigationStarting += delegate (object s, CoreWebView2NavigationStartingEventArgs e)
        {
            // La app solo vive en tv.app; cualquier otra navegacion se abre fuera.
            if (!e.Uri.StartsWith("https://" + Host + "/", StringComparison.OrdinalIgnoreCase)) { e.Cancel = true; Launch(e.Uri); }
        };
        // Si el proceso de render/GPU muere (equipo 24/7), recupera sin intervencion.
        core.ProcessFailed += delegate (object s, CoreWebView2ProcessFailedEventArgs e)
        {
            if (e.ProcessFailedKind == CoreWebView2ProcessFailedKind.BrowserProcessExited) { Restart(); return; }
            if (recoveries++ < 20) BeginInvoke((MethodInvoker)delegate { core.Reload(); });
        };
        core.Navigate("https://" + Host + "/index.html");
        web.Focus();
    }

    void Restart()
    {
        try { Process.Start(Application.ExecutablePath); } catch { }
        Application.Exit();
    }

    void OnMessage(object sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        try
        {
            Dictionary<string, object> m = new JavaScriptSerializer().Deserialize<Dictionary<string, object>>(e.WebMessageAsJson);
            object type; object path;
            if (!m.TryGetValue("type", out type)) return;
            if ((string)type == "launch" && m.TryGetValue("path", out path)) Launch(path as string);
            else if ((string)type == "exit") Close();
        }
        catch { }
    }

    static void Launch(string target)
    {
        if (string.IsNullOrWhiteSpace(target)) return;
        try
        {
            ProcessStartInfo psi = new ProcessStartInfo(target.Trim()) { UseShellExecute = true };
            string dir = null;
            try { if (File.Exists(psi.FileName)) dir = Path.GetDirectoryName(psi.FileName); } catch { }
            if (dir != null) psi.WorkingDirectory = dir;
            Process.Start(psi);
        }
        catch (Exception ex) { MessageBox.Show("No se pudo abrir:\n" + target + "\n\n" + ex.Message, "TV App"); }
    }

    protected override bool ProcessCmdKey(ref Message msg, Keys keyData)
    {
        if (keyData == Keys.F11) { SetFullscreen(FormBorderStyle != FormBorderStyle.None); return true; }
        if (keyData == (Keys.Control | Keys.Shift | Keys.Q)) { Close(); return true; }
        return base.ProcessCmdKey(ref msg, keyData);
    }
}
