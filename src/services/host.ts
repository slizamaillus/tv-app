// Puente con el ejecutable de Windows (host C# + WebView2).
// En el navegador normal (npm run dev) cae al comportamiento web habitual.
type WebView2 = { postMessage: (msg: unknown) => void };

const webview = (): WebView2 | undefined =>
  (window as unknown as { chrome?: { webview?: WebView2 } }).chrome?.webview;

export const isNativeHost = (): boolean => Boolean(webview());

export function launchExternal(path: string): void {
  const host = webview();
  if (host) {
    host.postMessage({ type: 'launch', path });
    return;
  }
  if (/^https?:\/\//i.test(path)) {
    window.open(path, '_blank', 'noopener,noreferrer');
  } else {
    const link = document.createElement('a');
    link.href = path;
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
