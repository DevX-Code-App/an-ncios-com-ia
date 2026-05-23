// DevX Code — runtime errors → parent iframe (postMessage) ou React Native WebView
/* eslint-disable no-console */
(function devxPreviewBridge() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__DEVX_PREVIEW_BRIDGE_V5__) return;
  window.__DEVX_PREVIEW_BRIDGE_V5__ = true;
  try { console.info('[devx-preview-bridge] v5 active'); } catch (e) { /* ignore */ }

  // ---- viewport fix --------------------------------------------------------
  // Expo Web serve <meta viewport> sem 'viewport-fit=cover' por default, e o
  // root do RN Web fica com 'height: 100vh'. Em iframes/responsive mode isso
  // empurra a bottom tab bar pra fora do viewport visível e ela aparece
  // cortada. Garantimos o viewport meta correto e forçamos '100dvh' no root.
  try {
    var existing = document.querySelector('meta[name="viewport"]');
    var WANT = 'width=device-width, initial-scale=1, viewport-fit=cover';
    if (existing) {
      var content = existing.getAttribute('content') || '';
      if (!/viewport-fit\s*=\s*cover/i.test(content)) {
        existing.setAttribute('content', WANT);
      }
    } else {
      var meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      meta.setAttribute('content', WANT);
      (document.head || document.documentElement).appendChild(meta);
    }
    if (!document.getElementById('devx-viewport-fix')) {
      var style = document.createElement('style');
      style.id = 'devx-viewport-fix';
      style.textContent = [
        'html,body,#root,#__next,[data-reactroot]{',
        '  height:100dvh !important;',
        '  min-height:100dvh !important;',
        '  margin:0;padding:0;',
        '}',
        '@supports not (height: 100dvh){',
        '  html,body,#root,#__next,[data-reactroot]{',
        '    height:100vh !important;min-height:100vh !important;',
        '  }',
        '}'
      ].join('');
      (document.head || document.documentElement).appendChild(style);
    }
  } catch (e) { /* ignore */ }
  // -------------------------------------------------------------------------

  var lastPost = 0;
  function post(payload) {
    try {
      var now = Date.now();
      if (payload && payload.type === 'console-react-error') {
        if (now - lastPost < 500) return;
      }
      lastPost = now;
      var body = Object.assign({ source: 'devx-preview' }, payload);
      if (window.parent !== window) {
        window.parent.postMessage(body, '*');
      } else if (
        window.ReactNativeWebView &&
        typeof window.ReactNativeWebView.postMessage === 'function'
      ) {
        window.ReactNativeWebView.postMessage(JSON.stringify(body));
      }
    } catch (e) {
      /* ignore */
    }
  }

  // Sinaliza ao parent que estamos vivos e qual versão. Permite ao parent
  // saber se um workspace antigo ainda tem bridge pré-screenshot rodando.
  try { post({ type: 'bridge-ready', version: 'v4' }); } catch (e) { /* ignore */ }

  window.addEventListener('error', function (ev) {
    // Preferir ev.error: no WebView (WKWebView) ev.message costuma ser só "Script error." sem detalhe.
    var msg =
      (ev.error && ev.error.message) ||
      ev.message ||
      (ev.error ? String(ev.error) : '') ||
      'Erro desconhecido';
    var stack = ev.error && ev.error.stack ? String(ev.error.stack) : undefined;
    var s = String(msg).trim();
    if (/^script error.?$/i.test(s) && !stack) {
      return;
    }
    post({
      type: 'runtime-error',
      message: s,
      stack: stack,
      filename: ev.filename,
      lineno: ev.lineno,
      colno: ev.colno,
    });
  });

  window.addEventListener('unhandledrejection', function (ev) {
    var r = ev.reason;
    var msg = r && r.message ? String(r.message) : String(r);
    var stack = r && r.stack ? String(r.stack) : undefined;
    post({ type: 'unhandled-rejection', message: msg, stack: stack });
  });

  var origError = console.error;
  console.error = function () {
    origError.apply(console, arguments);
    try {
      var text = Array.prototype.slice.call(arguments).map(function (a) {
        if (typeof a === 'string') return a;
        if (a && a.message) return a.message + (a.stack ? '\n' + a.stack : '');
        try {
          return JSON.stringify(a);
        } catch (e) {
          return String(a);
        }
      }).join(' ');
      if (
        /Element type is invalid|not a valid|Warning:\s*React|Uncaught Error|ReferenceError|TypeError|SyntaxError|Invariant Violation|Cannot find native module|native module|Module not found|requireNativeModule|ExpoSQLite|expo-/i.test(
          text,
        )
      ) {
        post({ type: 'console-react-error', message: text.slice(0, 12000) });
      }
    } catch (e) {
      /* ignore */
    }
  };

  // Captura de screenshot via comando do parent: o parent não consegue ler
  // 'iframe.contentDocument' por causa de same-origin policy (web em www.*,
  // iframe em api.*), então delegamos a captura pro próprio iframe — aqui
  // dentro o DOM é same-origin. html2canvas é carregado on-demand de CDN
  // pra não inflar o bundle do app do user.
  var html2canvasPromise = null;
  function loadHtml2Canvas() {
    if (html2canvasPromise) return html2canvasPromise;
    html2canvasPromise = new Promise(function (resolve, reject) {
      if (window.html2canvas) return resolve(window.html2canvas);
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.onload = function () {
        if (window.html2canvas) resolve(window.html2canvas);
        else reject(new Error('html2canvas missing after load'));
      };
      s.onerror = function () { reject(new Error('html2canvas CDN load failed')); };
      document.head.appendChild(s);
    });
    return html2canvasPromise;
  }

  window.addEventListener('message', function (ev) {
    var d = ev.data;
    if (!d || d.source !== 'devx-preview-cmd') return;
    if (d.cmd !== 'capture-screenshot') return;
    var reqId = d.reqId;
    function respond(payload) {
      post(Object.assign({ type: 'screenshot-result', reqId: reqId }, payload));
    }
    loadHtml2Canvas()
      .then(function (h2c) {
        var target = document.documentElement || document.body;
        if (!target) throw new Error('no document target');
        return h2c(target, {
          useCORS: true,
          backgroundColor: null,
          logging: false,
          windowWidth: window.innerWidth || target.scrollWidth,
          windowHeight: window.innerHeight || target.scrollHeight,
        });
      })
      .then(function (canvas) {
        var dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        respond({ ok: true, dataUrl: dataUrl });
      })
      .catch(function (err) {
        respond({ ok: false, error: (err && err.message) || String(err) });
      });
  });
})();
