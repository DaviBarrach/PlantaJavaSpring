// ============================================================
//  Meu Jardim - frontend do CRUD de plantas
//  Conversa com o backend Spring (PlantaController, rota /planta)
// ============================================================

// Endereço do backend.
// '' = mesmo endereço da página (use quando o front estiver dentro do Spring).
// Se abrir o index.html separado, troque por 'http://localhost:8080'.
const API = '';

// Guarda a última lista carregada e o id da planta que está sendo editada
let todas = [];
let editandoId = null; // null = cadastrando uma nova planta

// Elementos da página
const form = document.getElementById('form');
const lista = document.getElementById('lista');
const mensagem = document.getElementById('mensagem');

// Ícone de cada porte
const iconePorte = { Pequeno: '🌱', 'Médio': '🌿', Grande: '🌳' };

// Ícones desenhados (SVG) dos botões e chips dos cards
const ICONE_GOTA = '<svg viewBox="0 0 24 24"><path d="M12 3c3.5 4.4 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.5-6.6 6-11z"/></svg>';
const ICONE_EDITAR = '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m14 6 4 4"/></svg>';
const ICONE_LIXO = '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';


// ------------------------------------------------------------
//  Funções que falam com o backend (uma para cada endpoint)
// ------------------------------------------------------------

// Função auxiliar: faz a requisição e devolve o JSON (se houver)
async function chamar(url, opcoes) {
  const resposta = await fetch(API + url, opcoes);
  if (!resposta.ok) throw new Error('Erro ' + resposta.status);
  const texto = await resposta.text();           // POST, PUT e DELETE voltam sem corpo
  return texto ? JSON.parse(texto) : null;
}

// GET /planta/todas -> lista todas
function listarPlantas() {
  return chamar('/planta/todas');
}

// GET /planta?classificacao=... -> busca uma
function buscarPlanta(classificacao) {
  return chamar('/planta?classificacao=' + encodeURIComponent(classificacao));
}

// POST /planta -> cadastra
function cadastrarPlanta(planta) {
  return chamar('/planta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(planta),
  });
}

// PUT /planta?id=... -> atualiza
function atualizarPlanta(id, planta) {
  return chamar('/planta?id=' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(planta),
  });
}

// DELETE /planta?classificacao=... -> exclui
function excluirPlanta(classificacao) {
  return chamar('/planta?classificacao=' + encodeURIComponent(classificacao), {
    method: 'DELETE',
  });
}


// ------------------------------------------------------------
//  Mostrar coisas na tela
// ------------------------------------------------------------

// Evita que um texto digitado quebre o HTML
function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// Mostra uma mensagem acima da lista (tipo: 'ok', 'aviso' ou 'erro')
function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo;
  mensagem.hidden = !texto;
}

// Desenha os cards das plantas
function mostrarPlantas(plantas) {
  lista.innerHTML = '';

  if (plantas.length === 0) {
    lista.innerHTML = '<p class="vazio">🌱 Nenhuma planta por aqui ainda. Cadastre a primeira logo abaixo!</p>';
    return;
  }

  plantas.forEach((planta) => {
    const card = document.createElement('div');
    card.className = 'card';

    // O desenho da miniatura muda conforme o id (são 6 desenhos: img/planta-1.svg ... planta-6.svg)
    const desenho = 'img/planta-' + (planta.id % 6 + 1) + '.svg';

    card.innerHTML = `
      <img class="miniatura" src="${desenho}" alt="">
      <div class="info">
        <h3>${escapar(planta.nome)}</h3>
        <p class="classificacao">${escapar(planta.classificacao)}</p>
        <div class="chips">
          <span class="chip verde-claro">${iconePorte[planta.porte] || '🌿'} ${escapar(planta.porte)}</span>
          <span class="chip azul">${ICONE_GOTA} ${planta.gostaAgua ? 'Gosta de água' : 'Prefere pouca água'}</span>
        </div>
        <div class="botoes">
          <button class="editar">${ICONE_EDITAR} Editar</button>
          <button class="excluir">${ICONE_LIXO} Excluir</button>
        </div>
      </div>
    `;

    card.querySelector('.editar').addEventListener('click', () => editar(planta));
    card.querySelector('.excluir').addEventListener('click', () => excluir(planta));
    lista.appendChild(card);
  });
}


// ------------------------------------------------------------
//  Ações do usuário
// ------------------------------------------------------------

// Carrega e mostra todas as plantas
async function carregarTodas() {
  try {
    todas = await listarPlantas();
    mostrarPlantas(todas);
  } catch (erro) {
    lista.innerHTML = '';
    mostrarMensagem('Não foi possível falar com o servidor. Confira se o Spring e o banco de dados estão rodando.', 'erro');
  }
}

// Botão "Buscar"
document.getElementById('form-busca').addEventListener('submit', async (e) => {
  e.preventDefault();
  const classificacao = document.getElementById('busca').value.trim();
  if (!classificacao) { mostrarMensagem('', ''); return mostrarPlantas(todas); }

  try {
    const planta = await buscarPlanta(classificacao);
    mostrarMensagem('', '');
    mostrarPlantas([planta]);
  } catch (erro) {
    // O backend dá erro tanto se não achar quanto se houver mais de uma
    const iguais = todas.filter((p) => p.classificacao === classificacao);
    if (iguais.length > 1) {
      mostrarMensagem('Há ' + iguais.length + ' plantas com essa classificação:', 'aviso');
      mostrarPlantas(iguais);
    } else {
      mostrarMensagem('Nenhuma planta encontrada com a classificação "' + classificacao + '".', 'aviso');
      mostrarPlantas([]);
    }
  }
});

// Botão "Ver todas"
document.getElementById('btn-todas').addEventListener('click', () => {
  document.getElementById('busca').value = '';
  mostrarMensagem('', '');
  carregarTodas();
});

// Botão "Cadastrar planta" / "Salvar alterações" (envio do formulário)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Monta o objeto exatamente como o backend espera
  const planta = {
    nome: document.getElementById('nome').value.trim(),
    classificacao: document.getElementById('classificacao').value.trim(),
    porte: document.getElementById('porte').value,
    gostaAgua: document.getElementById('gostaAgua').checked,
  };

  try {
    if (editandoId === null) {
      await cadastrarPlanta(planta);        // POST
      mostrarMensagem('Planta cadastrada com sucesso! 🌸', 'ok');
    } else {
      await atualizarPlanta(editandoId, planta);   // PUT
      mostrarMensagem('Planta atualizada com sucesso! 🌼', 'ok');
    }
  } catch (erro) {
    return mostrarMensagem('Não foi possível salvar. Tente novamente.', 'erro');
  }

  const eraEdicao = editandoId !== null;
  const id = editandoId;
  limparFormulario();
  document.getElementById('busca').value = '';
  await carregarTodas();

  // O backend só muda "gosta de água" de não para sim, nunca de sim para não.
  if (eraEdicao && !planta.gostaAgua) {
    const atual = todas.find((p) => p.id === id);
    if (atual && atual.gostaAgua) {
      mostrarMensagem('Atualizada, mas "Gosta de água" continuou marcado: o backend não permite desmarcar.', 'aviso');
    }
  }
});

// Botão "Editar" do card: coloca os dados no formulário
function editar(planta) {
  editandoId = planta.id;
  document.getElementById('nome').value = planta.nome;
  document.getElementById('classificacao').value = planta.classificacao;
  document.getElementById('porte').value = planta.porte;
  document.getElementById('gostaAgua').checked = planta.gostaAgua;

  document.getElementById('titulo-form').textContent = 'Editar planta';
  document.getElementById('subtitulo-form').textContent = 'Altere os dados e salve as mudanças.';
  document.getElementById('txt-salvar').textContent = 'Salvar alterações';
  document.getElementById('btn-cancelar').hidden = false;
  form.scrollIntoView({ behavior: 'smooth' });
}

// Botão "Cancelar edição"
document.getElementById('btn-cancelar').addEventListener('click', limparFormulario);

// Volta o formulário ao modo "nova planta"
function limparFormulario() {
  editandoId = null;
  form.reset();
  document.getElementById('titulo-form').textContent = 'Nova planta';
  document.getElementById('subtitulo-form').textContent = 'Adicione uma nova planta ao seu jardim!';
  document.getElementById('txt-salvar').textContent = 'Cadastrar planta';
  document.getElementById('btn-cancelar').hidden = true;
}

// Botão "Excluir" do card
async function excluir(planta) {
  // O backend exclui pela classificação, então pode apagar mais de uma planta
  const iguais = todas.filter((p) => p.classificacao === planta.classificacao).length;
  let pergunta = 'Excluir "' + planta.nome + '"?';
  if (iguais > 1) {
    pergunta += '\n\nATENÇÃO: existem ' + iguais + ' plantas com a classificação "' +
      planta.classificacao + '" e todas serão excluídas.';
  }
  if (!confirm(pergunta)) return;

  try {
    await excluirPlanta(planta.classificacao);
    mostrarMensagem('Planta excluída.', 'ok');
    await carregarTodas();
  } catch (erro) {
    mostrarMensagem('Não foi possível excluir. Tente novamente.', 'erro');
  }
}

// Ao abrir a página, carrega as plantas
carregarTodas();
