const API = 'http://localhost:3000'; // Tópico 6
// Tópico 21 — Enviar login e guardar o token

document.getElementById('formLogin').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

 try {
    const resposta = await fetch(API + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
    });
    if (!resposta.ok)
     { alert('Não foi possível entrar');
      return; }

    const dados = await resposta.json();

    if (!dados.token)
     { alert('Token não retornado'); 
     return; }
     
    sessionStorage.setItem('token', dados.token);
    window.location.href = 'index.html';
    } catch (erro) {
 alert('Erro de conexão: ' + erro.message);
 }
});