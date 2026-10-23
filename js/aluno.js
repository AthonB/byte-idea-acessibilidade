(function () {
  var M = MA, $ = M.$, esc = M.esc, ico = M.icon;
  var me = null;
  try { me = JSON.parse(sessionStorage.getItem('maisacess:aluno')); } catch (e) {}
  var st = M.read();
  if (!me || !st || st.code !== me.code) { location.replace('index.html'); return; }

  // Conteúdo da aula de demonstração (a legenda é simulada neste protótipo).
  var LINES = ['Bom dia, pessoal. Vamos começar a aula de hoje.', 'Hoje vamos estudar Design Thinking.', 'Design Thinking é uma forma de resolver problemas começando pelas pessoas.', 'O processo tem cinco etapas: empatizar, definir, idear, prototipar e testar.', 'Na primeira etapa, precisamos entender quem vive o problema.', 'Por isso, vamos conversar com usuários antes de propor qualquer solução.', 'Quem quiser, pode registrar dúvidas pelo aplicativo.'];
  var TIMES = ['00:05', '00:12', '00:21', '00:34', '00:46', '01:02', '01:15'];
  var DESC = 'Diagrama com cinco etapas em sequência, da esquerda para a direita: Empatizar, Definir, Idear, Prototipar e Testar. Uma seta de retorno liga o fim ao começo, indicando que o processo pode ser repetido.';
  var RESUMO = 'A aula apresentou o Design Thinking como uma forma de resolver problemas começando pelas pessoas. O processo tem cinco etapas: empatizar, definir, idear, prototipar e testar. Na primeira etapa, o foco é entender quem vive o problema, conversando com usuários antes de propor qualquer solução.';
  var STEPS = ['Empatizar', 'Definir', 'Idear', 'Prototipar', 'Testar'];
  var CONCEPTS = ['Design Thinking'].concat(STEPS);
  var PHRASES = ['Pode repetir a última explicação?', 'Pode falar mais devagar?', 'Tenho uma dúvida sobre este ponto.'];
  var TABS = [['aula', 'Aula', '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 11h4M13 11h4M7 15h6"/>'], ['descrever', 'Descrever', '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'], ['escrever', 'Escrever', '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'], ['revisar', 'Revisar', '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>']];
  var SPK = '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/>';

  var S = { tab: 'aula', rtab: 'resumo', shown: 3, big: !!me.res.grande, draft: '', sent: [], speak: null };
  var main = $('#main');

  function save(fn) { st = M.update(fn, st) || st; }
  function say(text, key) {
    var ok = M.speak(text, function () { S.speak = null; draw(); });
    if (!ok) { M.toast('A voz não está disponível neste navegador.'); return; }
    S.speak = key; draw();
  }
  function listenBtn(act, key, idle) { return '<button class="btn" data-act="' + act + '">' + ico(SPK) + (S.speak === key ? 'Ouvindo…' : idle) + '</button>'; }

  function tabAula() {
    var v = LINES.slice(0, S.shown).slice(-4);
    return '<div class="kick">FALA DO PROFESSOR</div>' + v.map(function (t, i) { return '<p class="cap' + (i === v.length - 1 ? ' now' : '') + '">' + esc(t) + '</p>'; }).join('') +
      '<p class="small muted">Transcrição automática. Pode conter pequenos erros.</p>';
  }
  function tabDescrever() {
    return '<div class="kick">AGORA NO PROJETOR</div><div class="slide" role="img" aria-label="Miniatura do slide atual: diagrama com cinco etapas do Design Thinking"><h2>Etapas do Design Thinking</h2><div class="steps">' +
      STEPS.map(function (n, i) { return '<div class="step"><b>' + (i + 1) + '</b>' + n + '</div>'; }).join('') + '</div></div>' +
      '<span class="pill' + (st.approved ? ' ok' : '') + '">' + (st.approved ? 'Descrição aprovada pelo professor' : 'Descrição gerada por IA · aguardando revisão do professor') + '</span>' +
      '<p class="desc">' + esc(DESC) + '</p>' + listenBtn('listen', 'desc', 'Ouvir descrição') + '<button class="btn ghost" data-act="more">Pedir mais detalhes</button>';
  }
  function tabEscrever() {
    return '<label class="lbl" for="msg">Sua mensagem</label><textarea id="msg" class="field" rows="3">' + esc(S.draft) + '</textarea>' +
      '<div class="kick">FRASES RÁPIDAS</div><div class="chips">' + PHRASES.map(function (t, i) { return '<button class="chip" data-act="chip" data-i="' + i + '">' + esc(t) + '</button>'; }).join('') + '</div>' +
      listenBtn('speakMsg', 'msg', 'Falar em voz alta').replace('Ouvindo…', 'Falando…') + '<button class="btn soft" data-act="send">Enviar ao professor</button>' +
      (S.sent.length ? '<div class="sent"><div class="kick">ENVIADAS</div>' + S.sent.map(function (t) { return '<div>' + esc(t) + '</div>'; }).join('') + '</div>' : '');
  }
  function tabRevisar() {
    var seg = '<div class="seg">' + [['resumo', 'Resumo'], ['transcricao', 'Transcrição'], ['materiais', 'Materiais']].map(function (t) { return '<button data-act="rtab" data-id="' + t[0] + '" aria-pressed="' + (S.rtab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>';
    if (S.rtab === 'resumo') return seg + '<span class="pill">Resumo gerado por IA</span><p class="sum">' + esc(RESUMO) + '</p>' + listenBtn('listenR', 'res', 'Ouvir resumo') + '<div class="kick">CONCEITOS-CHAVE</div><div class="tags">' + CONCEPTS.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>';
    if (S.rtab === 'transcricao') return seg + LINES.map(function (t, i) { return '<div class="tl"><time>' + TIMES[i] + '</time><p>' + esc(t) + '</p></div>'; }).join('') + '<p class="small muted">Transcrição automática. Pode conter pequenos erros.</p>';
    var files = [['transcricao', 'Transcrição completa', 'Texto, pronto para leitor de tela']];
    if (st.shared.m1) files.unshift(['m1', 'Slides da aula', 'PDF, com texto alternativo nas imagens']);
    if (st.shared.m2) files.unshift(['m2', 'Leitura complementar', 'Texto, pronto para leitor de tela']);
    return seg + files.map(function (f) { return '<div class="file"><div><b>' + f[1] + '</b><span>' + f[2] + '</span></div><button data-act="get" data-id="' + f[0] + '">Baixar</button></div>'; }).join('') +
      (st.shared.m1 || st.shared.m2 ? '' : '<p class="small muted">O professor ainda não compartilhou outros materiais.</p>');
  }

  function chrome() {
    $('#title').textContent = st.title;
    $('#status').className = 'live' + (st.ended ? ' off' : '');
    $('#status').innerHTML = (st.ended ? 'Aula encerrada' : '<i aria-hidden="true"></i>Ao vivo') + ' <span>· código ' + esc(st.code) + '</span>';
    $('#banner').hidden = !st.ended;
    $('#big').setAttribute('aria-pressed', S.big); $('#app').className = 'app' + (S.big ? ' big' : '');
    $('#quick').hidden = !(S.tab === 'aula' || S.tab === 'descrever') || st.ended;
    $('#nav').innerHTML = TABS.map(function (t) { return '<button data-act="tab" data-id="' + t[0] + '" aria-current="' + (S.tab === t[0] ? 'page' : 'false') + '"><i>' + ico(t[2], 24) + '</i>' + t[1] + '</button>'; }).join('');
  }
  function draw() {
    var a = document.activeElement, key = a && a.dataset && a.dataset.act, id = a && a.id, i = a && a.dataset && a.dataset.id;
    chrome();
    main.innerHTML = { aula: tabAula, descrever: tabDescrever, escrever: tabEscrever, revisar: tabRevisar }[S.tab]();
    var n = id ? $('#' + id) : key ? $('[data-act="' + key + '"]' + (i ? '[data-id="' + i + '"]' : ''), document) : null;
    if (n && n.focus) n.focus();
  }
  function ask(text) {
    save(function (s) { s.questions.unshift({ id: Date.now(), who: me.name, text: text, t: Date.now(), done: false }); });
  }
  function transcript() {
    var txt = st.title + '\n\n' + LINES.map(function (t, i) { return TIMES[i] + '  ' + t; }).join('\n') + '\n';
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' })); a.download = 'transcricao-aula.txt'; a.click(); URL.revokeObjectURL(a.href);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var a = b.dataset.act, d = b.dataset.id;
    if (a === 'tab') { S.tab = d; draw(); }
    else if (a === 'rtab') { S.rtab = d; draw(); }
    else if (a === 'big') { S.big = !S.big; draw(); }
    else if (a === 'listen') say(DESC, 'desc');
    else if (a === 'listenR') say(RESUMO, 'res');
    else if (a === 'more') { ask('Pode descrever o slide com mais detalhes?'); M.toast('Pedido enviado: uma descrição mais detalhada deste slide.'); }
    else if (a === 'chip') { S.draft = PHRASES[+b.dataset.i]; draw(); }
    else if (a === 'speakMsg') { if (!S.draft.trim()) return M.toast('Escreva uma mensagem primeiro.'); say(S.draft.trim(), 'msg'); }
    else if (a === 'send') { var t = S.draft.trim(); if (!t) return M.toast('Escreva uma mensagem primeiro.'); ask(t); S.sent = [t].concat(S.sent).slice(0, 3); S.draft = ''; draw(); M.toast('Mensagem enviada ao professor.'); }
    else if (a === 'repeat') { save(function (s) { s.counts.repeat++; }); M.toast('Pedido enviado ao professor: repetir a última explicação.'); }
    else if (a === 'slow') { save(function (s) { s.counts.slow++; }); M.toast('Pedido enviado ao professor: falar mais devagar.'); }
    else if (a === 'doubt') { ask('Tenho uma dúvida.'); M.toast('Aviso enviado: você tem uma dúvida. O professor verá no painel.'); }
    else if (a === 'get') { if (d === 'transcricao') transcript(); else M.toast('Download simulado neste protótipo.'); }
  });
  document.addEventListener('input', function (e) { if (e.target.id === 'msg') S.draft = e.target.value; });

  // Presença: o professor vê quantos estudantes estão conectados e quais recursos usam (só números agregados).
  function beat() { save(function (s) { s.students[me.id] = { t: Date.now(), res: me.res }; }); }
  beat(); setInterval(beat, 5000);
  window.addEventListener('pagehide', function () { save(function (s) { delete s.students[me.id]; }); });
  // Legenda simulada: uma nova fala a cada 3,2 s.
  var tm = setInterval(function () { if (S.shown < LINES.length) { S.shown++; if (S.tab === 'aula') draw(); } else clearInterval(tm); }, 3200);
  // O que o professor faz (aprovar descrição, compartilhar material, encerrar) chega aqui.
  M.onChange(function (s) { if (!s || s.code !== me.code) return; st = s; chrome(); if (S.tab === 'descrever' || S.tab === 'revisar') draw(); });
  draw();
})();
