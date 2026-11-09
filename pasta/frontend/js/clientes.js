const API = 'http://localhost:3000'; // Tópico 6

// Tópico 17 — Cadastrar com POST
document.getElementById('formCadastro').addEventListener('submit', async (event) => {
  event.preventDefault();
  const nome = document.getElementById('nome').value;
  const contato = document.getElementById('contato').value;
  const cpf = document.getElementById('cpf').value;

  try {
    const resposta = await fetch(API + '/cliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      },
      body: JSON.stringify({ nome, contato, cpf })
    });
    if (!resposta.ok) { alert('Não foi possível cadastrar'); return; }
    alert('Cadastro realizado');
    document.getElementById('formCadastro').reset();
    await listarClientes();
  } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
  }
});

// Tópico 7 — Listar com GET e criar os botões
async function listarClientes() {
  try {
    const resposta = await fetch(API + '/cliente', {
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
    const lista = document.getElementById('listaClientes');
    lista.replaceChildren();

    registros.forEach((registro) => {
      const linha = document.createElement('tr');
      const coluna1 = document.createElement('td');
      coluna1.textContent = registro.nome;
      const coluna2 = document.createElement('td');
      coluna2.textContent = registro.contato;
      const coluna3 = document.createElement('td');
      coluna3.textContent = registro.cpf;
      const acoes = document.createElement('td');
      const editar = document.createElement('button');
      editar.type = 'button';
      editar.textContent = 'Editar';
      editar.onclick = () => editarCliente(registro);
      const excluir = document.createElement('button');
      excluir.type = 'button';
      excluir.textContent = 'Excluir';
      excluir.onclick = () => excluirCliente(registro.id_cliente);
      acoes.append(editar, ' ', excluir);
      linha.append(coluna1, coluna2, coluna3, acoes);
      lista.appendChild(linha);
    });
  } catch (erro) {
    alert('Erro ao listar: ' + erro.message);
  }
}

// Tópico 4 — Editar com PUT
async function editarCliente(registro) {
  const nome = prompt('Nome:', registro.nome);
  if (nome === null) return;
  if (!nome.trim()) { alert('Preencha Nome.'); return; }
  const contato = prompt('Contato:', registro.contato);
  if (contato === null) return;
  if (!contato.trim()) { alert('Preencha Contato.'); return; }
  const cpf = prompt('CPF:', registro.cpf);
  if (cpf === null) return;
  if (!cpf.trim()) { alert('Preencha CPF.'); return; }

  try {
    const resposta = await fetch(API + '/cliente/' + registro.id_cliente, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      },
      body: JSON.stringify({ nome, contato, cpf })
    });
    if (!resposta.ok) { alert('Não foi possível editar'); return; }
    alert('Cadastro atualizado');
    await listarClientes();
  } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
  }
}

// Tópico 2 — Excluir com DELETE
async function excluirCliente(id) {
  if (!confirm('Deseja excluir este cadastro?')) return;
  try {
    const resposta = await fetch(API + '/cliente/' + id, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      }
    });
    if (!resposta.ok) { alert('Não foi possível excluir'); return; }
    alert('Cadastro excluído');
    await listarClientes();
  } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
  }
}

listarClientes(); // Tópico 9 — Carregar a lista ao abrir a página
