// Utilidades compartilhadas + estado da aula + widget VLibras.
// O estado da aula fica no localStorage: professor e estudantes se falam
// entre abas/janelas do MESMO navegador (demonstração, sem servidor).
(function () {
  var KEY = 'maisacess:aula';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return MAP[c]; }); };
  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function novaAula(code) {
    var s = { code: code || 'DT-' + (1000 + Math.floor(Math.random() * 9000)), title: 'Introdução ao Design Thinking',
      ended: false, approved: false, shared: {}, questions: [], counts: { repeat: 0, slow: 0 }, students: {} };
    write(s); return s;
  }
  function update(fn, fallback) { var s = read() || fallback; if (!s) return null; fn(s); write(s); return s; }
  function onChange(cb) { window.addEventListener('storage', function (e) { if (e.key === KEY) cb(read()); }); }
  var tt;
  function toast(msg) { var n = $('#toast'); if (!n) return; n.textContent = msg; n.hidden = false; clearTimeout(tt); tt = setTimeout(function () { n.hidden = true; }, 3500); }
  function speak(text, done) {
    try {
      var y = window.speechSynthesis;
      if (!y || typeof SpeechSynthesisUtterance === 'undefined') return false;
      y.cancel(); var u = new SpeechSynthesisUtterance(text); u.lang = 'pt-BR'; u.onend = u.onerror = done; y.speak(u); return true;
    } catch (e) { return false; }
  }
  function icon(p, n) { return '<svg aria-hidden="true" width="' + (n || 22) + '" height="' + (n || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  // O VLibras é gratuito e oficial (https://vlibras.gov.br).
  // Na tela do estudante, respeita a preferência salva na entrada da aula.
  // Nas telas de entrada e do professor, permanece disponível para ajudar na navegação.
  function deveCarregarVLibras() {
    var pagina = (location.pathname.split('/').pop() || '').toLowerCase();
    if (pagina !== 'aluno.html') return true;
    try {
      var aluno = JSON.parse(sessionStorage.getItem('maisacess:aluno'));
      return !(aluno && aluno.res && aluno.res.libras === false);
    } catch (e) {
      return true;
    }
  }
  function fallbackVLibras() {
    if (document.querySelector('.vlibras-fallback')) return;
    var link = document.createElement('a');
    link.className = 'vlibras-fallback';
    link.href = 'https://vlibras.gov.br/app/';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Abrir VLibras';
    link.setAttribute('aria-label', 'Abrir o site oficial do VLibras em uma nova aba');
    document.body.appendChild(link);
  }
  function vlibras() {
    if (!deveCarregarVLibras()) return;

    // O contêiner torna o ponto de montagem explícito e mantém compatibilidade
    // com versões do widget que não criam o botão automaticamente.
    if (!document.querySelector('[vw]')) {
      var mount = document.createElement('div');
      mount.innerHTML = '<div vw class="enabled"><div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div></div>';
      document.body.appendChild(mount.firstElementChild);
    }

    // Evita adicionar o script duas vezes na mesma página.
    if (document.querySelector('script[data-ma-vlibras]')) return;
    var s = document.createElement('script');
    s.dataset.maVlibras = 'true';
    s.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    s.async = true;
    s.onload = function () {
      try {
        // O script atual pode se inicializar sozinho. Se não tiver criado o botão,
        // inicializamos explicitamente, pois o script foi inserido após o HTML.
        if (window.VLibrasWidget && window.VLibrasWidget.initBtn) return;
        if (window.VLibras && typeof window.VLibras.Widget === 'function') {
          new window.VLibras.Widget({ rootPath: 'https://vlibras.gov.br/app', avatar: 'icaro', position: 'R' });
        }
        if (!(window.VLibrasWidget && window.VLibrasWidget.initBtn)) {
          window.setTimeout(function () {
            if (!(window.VLibrasWidget && window.VLibrasWidget.initBtn)) fallbackVLibras();
          }, 2500);
        }
      } catch (e) {
        console.warn('Não foi possível inicializar o widget VLibras.', e);
        fallbackVLibras();
      }
    };
    s.onerror = function () {
      console.warn('Não foi possível carregar o widget VLibras. Verifique a conexão com a internet.');
      fallbackVLibras();
    };
    document.body.appendChild(s);
  }
  window.MA = { $: $, $$: $$, esc: esc, read: read, write: write, novaAula: novaAula, update: update, onChange: onChange, toast: toast, speak: speak, icon: icon };
  vlibras();
})();
