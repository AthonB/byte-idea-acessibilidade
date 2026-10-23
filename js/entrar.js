(function () {
  var M = MA, err = M.$('#err'), inp = M.$('#codigo');
  M.$('#f').addEventListener('submit', function (e) {
    e.preventDefault();
    var code = inp.value.trim().toUpperCase().replace(/\s+/g, '');
    var st = M.read();
    if (!st && code === 'DT-2041') st = M.novaAula('DT-2041'); // aula de demonstração
    if (!st || st.code !== code) {
      err.textContent = 'Não encontramos uma aula com esse código. Confira o código que o professor mostrou na sala.';
      err.hidden = false; inp.focus(); return;
    }
    var res = {};
    M.$$('input[name=res]').forEach(function (i) { res[i.value] = i.checked; });
    var me = { code: code, id: 's' + Date.now().toString(36) + Math.floor(Math.random() * 1e4), name: M.$('#nome').value.trim() || 'Estudante', res: res };
    try { sessionStorage.setItem('maisacess:aluno', JSON.stringify(me)); } catch (x) {}
    location.href = 'aluno.html';
  });
})();
