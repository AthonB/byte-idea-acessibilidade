# +Acessibilidade

Plataforma de acessibilidade para a sala de aula presencial, desenvolvida para o Sebrae Supernova com a UNICRUZ como piloto.
Site estático (HTML, CSS e JavaScript, sem build), seguindo o protótipo do projeto.

## Telas

| Arquivo | Tela |
|---|---|
| `index.html` | **Entrar na aula**: código da aula + recursos de acessibilidade do estudante |
| `aluno.html` | **App do estudante**: Aula (legenda), Descrever (slides), Escrever (texto vira voz), Revisar (resumo, transcrição, materiais) e avisos ao professor |
| `professor.html` | **Painel do professor**: aula ao vivo, perguntas, materiais, aprovar descrição de slides, encerrar aula |

O **VLibras** (widget gratuito e de código aberto do Governo Federal, `vlibras.gov.br`) está integrado por `js/common.js` usando o script oficial.
Na tela de entrada, o estudante pode marcar **Tradutor para Libras (VLibras)**. Quando selecionado, o widget também fica disponível no app do estudante; no painel do professor, ele permanece disponível. O botão flutuante permite selecionar textos da página para tradução automática para Libras.

A integração cria o ponto de montagem do widget e carrega o script oficial. Se o serviço remoto não carregar, aparece um link de alternativa para abrir o VLibras oficial em outra aba. Portanto, é necessária uma conexão com a internet. O VLibras é um auxílio de acessibilidade e não substitui um intérprete humano em aulas ou eventos.
Documentação oficial: https://vlibras.gov.br/doc/widget/installation/webpageintegration.html

## Como funciona o código da aula

O professor abre `professor.html` e o código da aula aparece no menu (a primeira aula usa `DT-2041`). O estudante digita o código em `index.html`.
Nesta versão de demonstração, professor e estudantes se comunicam pelo `localStorage` do navegador. Por isso **funciona entre abas do mesmo navegador/computador**, e nada é enviado a servidor.
A legenda ao vivo é simulada (texto de exemplo). Para usar em celulares diferentes é preciso um backend (próximo passo).

## Rodar localmente

```
python3 -m http.server 8000
```

Abra http://localhost:8000 (o `localStorage` e o VLibras funcionam melhor via servidor do que abrindo o arquivo direto).

## Publicar

O workflow `.github/workflows/pages.yml` publica o site a cada push na branch `main`. Em **Settings → Pages**, escolha **Source: GitHub Actions**.

## Estrutura

```
index.html  aluno.html  professor.html
css/styles.css
js/common.js    # estado da aula, voz e widget VLibras
js/entrar.js    # tela de entrada
js/aluno.js     # app do estudante
js/professor.js # painel do professor
```

## Próximos passos

- Backend (ex.: Firebase ou Supabase) para sincronizar vários aparelhos.
- Legenda real (API de transcrição) e descrição de slides por IA no lugar do texto de exemplo.
- Se o projeto for usado comercialmente, revisar os termos oficiais de uso do VLibras e avaliar se há necessidade de outros recursos de acessibilidade complementares.

## Créditos

Base inicial do repositório: [MariaEduardaslv/projectAcessibility](https://github.com/MariaEduardaslv/projectAcessibility).
