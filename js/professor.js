(function () {
  var M = MA, $ = M.$, esc = M.esc, ico = M.icon;
  var st = M.read() || M.novaAula('DT-2041');
  var view = 'live';
  var DESC = 'Diagrama com cinco etapas em sequência, da esquerda para a direita: Empatizar, Definir, Idear, Prototipar e Testar. Uma seta de retorno liga o fim ao começo, indicando que o processo pode ser repetido.';
  var NAV = [['live', 'Aula ao vivo', '<circle cx="12" cy="12" r="2.5"/><path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9"/>'], ['perguntas', 'Perguntas', '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'], ['materiais', 'Materiais', '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>']];
  var MATS = [['m1', 'Slides da aula (PDF)', 'Com texto alternativo nas imagens'], ['m2', 'Leitura complementar', 'Texto, pronto para leitor de tela']];

  function save(fn) { st = M.update(fn, st) || st; draw(); }
  function online() { var n = Date.now(); return Object.keys(st.students).map(function (k) { return st.students[k]; }).filter(function (s) { return n - s.t < 15000; }); }
  function open() { return st.questions.filter(function (q) { return !q.done; }).length; }
  function when(t) { var m = Math.floor((Date.now() - t) / 60000); return m < 1 ? 'agora' : 'há ' + m + ' min'; }

  function live(on) {
    var tiles = [['Estudantes conectados', on.length], ['Perguntas abertas', open()], ['Pedidos para repetir', st.counts.repeat], ['Pedidos para ir mais devagar', st.counts.slow]];
    var res = [['Legenda em tempo real', 'legenda'], ['Descrição por áudio', 'descricao'], ['Escrever e falar', 'escrever']];
    return '<div class="tiles">' + tiles.map(function (t) { return '<div class="tile"><b>' + t[1] + '</b><span>' + t[0] + '</span></div>'; }).join('') + '</div>' +
      '<div class="cols"><div class="card"><h2>Slide atual · Diagrama das 5 etapas</h2><span class="pill">Descrição gerada por IA</span><p class="desc" style="font-size:18px;line-height:1.5">' + esc(DESC) + '</p>' +
      '<button class="btn ' + (st.approved ? 'ok' : '') + '" data-act="approve" aria-pressed="' + st.approved + '">' + (st.approved ? 'Descrição aprovada' : 'Aprovar descrição') + '</button>' +
      '<p class="small muted">Você revisa a descrição antes de ela chegar aos estudantes.</p></div>' +
      '<div class="card"><h2>Recursos ativos na turma</h2>' + res.map(function (r) {
        var n = on.filter(function (s) { return s.res && s.res[r[1]]; }).length;
        return '<div><div class="bl"><span>' + r[0] + '</span><span>' + n + '</span></div><div class="bar"><i style="width:' + (on.length ? Math.round(n / on.length * 100) : 0) + '%"></i></div></div>';
      }).join('') + '<p class="small muted">Números agregados. O painel não mostra o perfil de cada estudante.</p></div></div>';
  }
  function perguntas() {
    return '<div class="card"><h2>Perguntas da turma</h2>' + (st.questions.length ? st.questions.map(function (q) {
      return '<div class="q' + (q.done ? ' done' : '') + '"><div class="av" aria-hidden="true">' + esc(q.who.charAt(0).toUpperCase()) + '</div><div><b>' + esc(q.who) + '</b> <span class="small muted">' + when(q.t) + '</span><p>' + esc(q.text) + '</p></div>' +
        '<button class="btn ' + (q.done ? 'ok' : 'soft') + '" data-act="done" data-id="' + q.id + '" aria-pressed="' + q.done + '">' + (q.done ? 'Respondida' : 'Marcar como respondida') + '</button></div>';
    }).join('') : '<p class="muted">Nenhuma pergunta ainda. Quando um estudante escrever, ela aparece aqui.</p>') + '</div>';
  }
  function materiais() {
    return '<div class="card"><h2>Materiais da aula</h2>' + MATS.map(function (m) {
      var d = !!st.shared[m[0]];
      return '<div class="q"><div style="flex:1"><b>' + m[1] + '</b><p class="small muted">' + m[2] + '</p></div><button class="btn ' + (d ? 'ok' : 'soft') + '" data-act="share" data-id="' + m[0] + '" aria-pressed="' + d + '">' + (d ? 'Compartilhado' : 'Compartilhar') + '</button></div>';
    }).join('') + '</div>';
  }

  function draw() {
    var on = online(), a = document.activeElement, key = a && a.dataset && a.dataset.act, id = a && a.dataset && a.dataset.id;
    $('#code').textContent = st.code;
    $('#end').textContent = st.ended ? 'Aula encerrada' : 'Encerrar aula'; $('#end').disabled = st.ended;
    $('#nav').innerHTML = NAV.map(function (n) {
      return '<button data-act="view" data-id="' + n[0] + '" aria-current="' + (view === n[0] ? 'page' : 'false') + '">' + ico(n[2]) + n[1] + (n[0] === 'perguntas' && open() ? '<span class="badge">' + open() + '</span>' : '') + '</button>';
    }).join('');
    $('#pmain').innerHTML = '<div class="stack" style="gap:6px"><h1>' + esc(st.title) + '</h1><p class="live' + (st.ended ? ' off' : '') + '">' + (st.ended ? 'Aula encerrada' : '<i aria-hidden="true"></i>Ao vivo · ' + on.length + (on.length === 1 ? ' estudante conectado' : ' estudantes conectados')) + '</p></div>' +
      (st.ended ? '<div class="banner" role="status" style="margin:0">Aula encerrada. O resumo e a transcrição já estão disponíveis para os estudantes.</div>' : '') +
      '<p class="small muted">Para testar, abra <b>index.html</b> em outra aba deste navegador e entre com o código <b>' + esc(st.code) + '</b>.</p>' +
      { live: function () { return live(on); }, perguntas: perguntas, materiais: materiais }[view]();
    var n = key ? $('[data-act="' + key + '"]' + (id ? '[data-id="' + id + '"]' : '')) : null; if (n && n.focus) n.focus();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var a = b.dataset.act, d = b.dataset.id;
    if (a === 'view') { view = d; draw(); }
    else if (a === 'approve') save(function (s) { s.approved = !s.approved; });
    else if (a === 'share') save(function (s) { s.shared[d] = !s.shared[d]; });
    else if (a === 'done') save(function (s) { s.questions.forEach(function (q) { if (String(q.id) === d) q.done = !q.done; }); });
    else if (a === 'end') save(function (s) { s.ended = true; });
    else if (a === 'new') { if (confirm('Começar uma nova aula? As perguntas e pedidos atuais serão apagados.')) { st = M.novaAula(); draw(); } }
  });
  M.onChange(function (s) { if (s) { st = s; draw(); } });
  setInterval(function () { if (view === 'live') draw(); }, 5000); // atualiza quem está conectado
  draw();
})();
