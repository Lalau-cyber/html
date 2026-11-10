const API = 'http//:localhost:3000';

document.getElementById('formCadastro').addEventListener('submit', async (event) => {
 event.preventDefault();
 const placa = document.getElementById('placa').value;
 const modelo = document.getElementById('modelo').value;
 const ano = Number(document.getElementById('ano').value);
 const id_cliente = Number(document.getElementById('id_cliente').value);
 if(!number. isInteger(ano) || ano <= 0 || !Number.isInteger(id_cliente) || id_cliente <= 0){
     alert('confira o ano e o vínculo selecionao');
return;
}

 try {
 const resposta = await fetch(API + '/veiculo', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 Authorization: 'Bearer ' + sessionStorage.getItem('token')
 },
 body: JSON.stringify({ placa, modelo, ano, id_cliente })
 });

 if (!resposta.ok) { alert('Não foi possível cadastrar'); return; }
    alert('Cadastro realizado');
    document.getElementById('formCadastro').reset();
 await listarVeiculos();
 } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
 }
});

// Tópico 7 — Listar com GET e criar os botões
async function listarVeiculos() {
  try {
    const resposta = await fetch(API + '/veiculo', {
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
    const lista = document.getElementById('listaVeiculos');
    lista.replaceChildren();

    registros.forEach((registro) => {
      const linha = document.createElement('tr');
      const coluna1 = document.createElement('td');
      coluna1.textContent = registro.placa;
      const coluna2 = document.createElement('td');
      coluna2.textContent = registro.modelo;
      const coluna3 = document.createElement('td');
      coluna3.textContent = registro.ano;
      const coluna4 = document.createElement('td');
      coluna4.textContent = registro.id_cliente;
      const acoes = document.createElement('td');
      const editar = document.createElement('button');
      editar.type = 'button';
      editar.textContent = 'Editar';
      editar.onclick = () => editarVeiculo(registro);
      const excluir = document.createElement('button');
      excluir.type = 'button';
      excluir.textContent = 'Excluir';
      excluir.onclick = () => excluirVeiculo(registro.id_veiculo);
      acoes.append(editar, ' ', excluir);
      linha.append(coluna1, coluna2, coluna3, coluna4, acoes);
      lista.appendChild(linha);
    });
  } catch (erro) {
    alert('Erro ao listar: ' + erro.message);
  }
}

// Tópico 4 — Editar com PUT
async function editarVeiculo(registro) {
  const placa = prompt('Placa:', registro.placa);
  if (placa === null) return;
  if (!placa.trim()) { alert('Preencha Placa.'); return; }
  const modelo = prompt('Modelo:', registro.modelo);
  if (modelo === null) return;
  if (!modelo.trim()) { alert('Preencha Modelo.'); return; }
  const entrada_ano = prompt('Ano:', registro.ano);
  if (entrada_ano === null) return;
  const ano = Number(entrada_ano);
  if (!Number.isInteger(ano) || ano <= 0) {
    alert('Informe um número inteiro positivo.'); return;
  }
  const entrada_id_cliente = prompt('Cliente ID existente:', registro.id_cliente);
  if (entrada_id_cliente === null) return;
  const id_cliente = Number(entrada_id_cliente);
  if (!Number.isInteger(id_cliente) || id_cliente <= 0) {
    alert('Informe um número inteiro positivo.'); return;
  }

  try {
    const resposta = await fetch(API + '/veiculo/' + registro.id_veiculo, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      },
      body: JSON.stringify({ placa, modelo, ano, id_cliente })
    });
    if (!resposta.ok) { alert('Não foi possível editar'); return; }
    alert('Cadastro atualizado');
    await listarVeiculos();
  } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
  }
}

// Tópico 2 — Excluir com DELETE
async function excluirVeiculo(id) {
  if (!confirm('Deseja excluir este cadastro?')) return;
  try {
    const resposta = await fetch(API + '/veiculo/' + id, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      }
    });
    if (!resposta.ok) { alert('Não foi possível excluir'); return; }
    alert('Cadastro excluído');
    await listarVeiculos();
  } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
  }
}

async function carregarOpcoes() {
 const selecao = document.getElementById('id_cliente');
 try {
    const resposta = await fetch(API + '/cliente', {
    headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') }
    });
        if (!resposta.ok) {
        throw new Error('Não foi possível carregar as opções.');
        }
    const registros = await resposta.json();
        if (!Array.isArray(registros)) {
        throw new Error('A resposta deve ser um array.');
        }
        selecao.replaceChildren(new Option('Selecione', ''));
        registros.forEach((registro) => {
        const opcao = new Option(registro.nome, registro.id_cliente);
        selecao.add(opcao);
        });
 } catch (erro) {
    alert(erro.message);
 }
}
carregarOpcoes();
listarVeiculos()
