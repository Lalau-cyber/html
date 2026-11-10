const API = 'http://localhost:3000'; // Tópico 6

// Tópico 17 — Cadastrar com POST
document.getElementById('formCadastro').addEventListener('submit', async (event) => {
  event.preventDefault();
  const descricao = document.getElementById('descricao').value;
  const data_agendada = document.getElementById('data_agendada').value;
  const status = document.getElementById('status').value;
  const id_veiculo = Number(document.getElementById('id_veiculo').value);
  if (!Number.isInteger(id_veiculo) || id_veiculo <= 0) {
    alert('Confira o ano e o vínculo selecionado.');
    return;
  }

  try {
    const resposta = await fetch(API + '/ordem_de_servico', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      },
      body: JSON.stringify({ descricao, data_agendada, status, id_veiculo })
    });
    if (!resposta.ok) { alert('Não foi possível cadastrar'); return; }
    alert('Cadastro realizado');
    document.getElementById('formCadastro').reset();
    await listarOrdens();
  } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
  }
});

// Tópico 7 — Listar com GET e criar os botões
async function listarOrdens() {
  try {
    const resposta = await fetch(API + '/ordem_de_servico', {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      }
    });
    if (!resposta.ok) { alert('Não foi possível listar'); return; }
    const registros = await resposta.json();
    if (!Array.isArray(registros)) {
      alert('A listagem deve retornar um array.');
      return;
    }
    const lista = document.getElementById('listaOrdens');
    lista.replaceChildren();

    registros.forEach((registro) => {
      const linha = document.createElement('tr');
      const coluna1 = document.createElement('td');
      coluna1.textContent = registro.descricao;
      const coluna2 = document.createElement('td');
      coluna2.textContent = String(registro.data_agendada ?? '').slice(0, 10);
      const coluna3 = document.createElement('td');
      coluna3.textContent = registro.status;
      const coluna4 = document.createElement('td');
      coluna4.textContent = registro.id_veiculo;
      const acoes = document.createElement('td');
      const editar = document.createElement('button');
      editar.type = 'button';
      editar.textContent = 'Editar';
      editar.onclick = () => editarOrdem(registro);
      const excluir = document.createElement('button');
      excluir.type = 'button';
      excluir.textContent = 'Excluir';
      excluir.onclick = () => excluirOrdem(registro.id_ordem_de_servico);
      acoes.append(editar, ' ', excluir);
      linha.append(coluna1, coluna2, coluna3, coluna4, acoes);
      lista.appendChild(linha);
    });
  } catch (erro) {
    alert('Erro ao listar: ' + erro.message);
  }
}

// Tópico 4 — Editar com PUT
async function editarOrdem(registro) {
  const descricao = prompt('Descrição:', registro.descricao);
  if (descricao === null) return;
  if (!descricao.trim()) { alert('Preencha Descrição.'); return; }
  const data_agendada = prompt('Data agendada:', String(registro.data_agendada ?? '').slice(0, 10));
  if (data_agendada === null) return;
  if (!data_agendada.trim()) { alert('Preencha Data agendada.'); return; }
  const status = prompt('Status:', registro.status);
  if (status === null) return;
  if (!status.trim()) { alert('Preencha Status.'); return; }
  const entrada_id_veiculo = prompt('Veículo ID existente:', registro.id_veiculo);
  if (entrada_id_veiculo === null) return;
  const id_veiculo = Number(entrada_id_veiculo);
  if (!Number.isInteger(id_veiculo) || id_veiculo <= 0) {
    alert('Informe um número inteiro positivo.'); return;
  }

  try {
    const resposta = await fetch(API + '/ordem_de_servico/' + registro.id_ordem_de_servico, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      },
      body: JSON.stringify({ descricao, data_agendada, status, id_veiculo })
    });
    if (!resposta.ok) { alert('Não foi possível editar'); return; }
    alert('Cadastro atualizado');
    await listarOrdens();
  } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
  }
}

// Tópico 2 — Excluir com DELETE
async function excluirOrdem(id) {
  if (!confirm('Deseja excluir este cadastro?')) return;
  try {
    const resposta = await fetch(API + '/ordem_de_servico/' + id, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      }
    });
    if (!resposta.ok) { alert('Não foi possível excluir'); return; }
    alert('Cadastro excluído');
    await listarOrdens();
  } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
  }
}

// Tópico 15 — Carregar registros na lista de seleção
async function carregarOpcoes() {
  const selecao = document.getElementById('id_veiculo');
  try {
    const resposta = await fetch(API + '/veiculo', {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      }
    });
    if (!resposta.ok) { alert('Não foi possível carregar veículo'); return; }
    const registros = await resposta.json();
    if (!Array.isArray(registros)) { alert('Resposta inválida'); return; }
    selecao.replaceChildren(new Option('Selecione', ''));
    registros.forEach((registro) => {
      selecao.add(new Option(registro.placa, registro.id_veiculo));
    });
  } catch (erro) {
    alert('Erro ao carregar opções: ' + erro.message);
  }
}

carregarOpcoes(); // Tópico 15

listarOrdens(); // Tópico 9 — Carregar a lista ao abrir a página
