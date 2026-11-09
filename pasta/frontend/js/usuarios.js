const API = 'http://localhost:3000'; // Tópico 6

// Tópico 17 — Cadastrar com POST
document.getElementById('formCadastro').addEventListener('submit', async (event) => {
  event.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const resposta = await fetch(API + '/usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      },
      body: JSON.stringify({ nome, email, senha })
    });
    if (!resposta.ok) { alert('Não foi possível cadastrar'); return; }
    alert('Cadastro realizado');
    document.getElementById('formCadastro').reset();
    await listarUsuarios();
  } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
  }
});

// Tópico 7 — Listar com GET e criar os botões
async function listarUsuarios() {
  try {
    const resposta = await fetch(API + '/usuario', {
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
    const lista = document.getElementById('listaUsuarios');
    lista.replaceChildren();

    registros.forEach((registro) => {
      const linha = document.createElement('tr');
      const coluna1 = document.createElement('td');
      coluna1.textContent = registro.nome;
      const coluna2 = document.createElement('td');
      coluna2.textContent = registro.email;
      const acoes = document.createElement('td');
      const editar = document.createElement('button');
      editar.type = 'button';
      editar.textContent = 'Editar';
      editar.onclick = () => editarUsuario(registro);
      const excluir = document.createElement('button');
      excluir.type = 'button';
      excluir.textContent = 'Excluir';
      excluir.onclick = () => excluirUsuario(registro.id_usuario);
      acoes.append(editar, ' ', excluir);
      linha.append(coluna1, coluna2, acoes);
      lista.appendChild(linha);
    });
  } catch (erro) {
    alert('Erro ao listar: ' + erro.message);
  }
}

// Tópico 4 — Editar com PUT
async function editarUsuario(registro) {
  const nome = prompt('Nome:', registro.nome);
  if (nome === null) return;
  if (!nome.trim()) { alert('Preencha Nome.'); return; }
  const email = prompt('Email:', registro.email);
  if (email === null) return;
  if (!email.trim()) { alert('Preencha Email.'); return; }

  try {
    const resposta = await fetch(API + '/usuario/' + registro.id_usuario, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      },
      body: JSON.stringify({ nome, email })
    });
    if (!resposta.ok) { alert('Não foi possível editar'); return; }
    alert('Cadastro atualizado');
    await listarUsuarios();
  } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
  }
}

// Tópico 2 — Excluir com DELETE
async function excluirUsuario(id) {
  if (!confirm('Deseja excluir este cadastro?')) return;
  try {
    const resposta = await fetch(API + '/usuario/' + id, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      }
    });
    if (!resposta.ok) { alert('Não foi possível excluir'); return; }
    alert('Cadastro excluído');
    await listarUsuarios();
  } catch (erro) {
    alert('Erro de conexão: ' + erro.message);
  }
}

listarUsuarios(); // Tópico 9 — Carregar a lista ao abrir a página
