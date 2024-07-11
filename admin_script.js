class Usuario {
  constructor() {
    this.arrayAdmin = this.getCadList();
    this.listarTabela(); // Listar tabela ao iniciar
  }

  lerValores() {
    let nome = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();

    if (nome === '' || email === '') {
      alert('Preencha os dois campos obrigatórios');
      return null;
    }

    if (!this.validarEmail(email)) {
      alert('Por favor, insira um e-mail válido.');
      return null;
    }

    let cadastro = {
      nome_admin: nome,
      email_admin: email,
      date: new Date().toLocaleString()
    };

    return cadastro;
  }

  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  adicionarArray(cadastro) {
    this.arrayAdmin.push(cadastro);
    this.saveToLocalStorage();
  }

  cadastrarUsuario(event) {
    event.preventDefault();

    let cadastro = this.lerValores();

    if (cadastro === null) {
      return;
    }

    if (this.arrayAdmin.some(admin => admin.email_admin === cadastro.email_admin)) {
      alert('E-mail já cadastrado.');
      return;
    }

    this.adicionarArray(cadastro);
    this.listarTabela();
    this.limparName();
    this.limparEmail();
  }

  listarTabela() {
    let tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    this.arrayAdmin.forEach((admin, index) => {
      let tr = tbody.insertRow();

      let td_date = tr.insertCell();
      let td_nome = tr.insertCell();
      let td_email = tr.insertCell();
      let td_acoes = tr.insertCell();

      td_date.innerText = admin.date;
      td_nome.innerText = admin.nome_admin;
      td_email.innerText = admin.email_admin;

      td_date.classList.add('center');
      td_nome.classList.add('center');
      td_email.classList.add('center');
      td_acoes.classList.add('center');

      let icon = document.createElement('i');
      icon.classList.add('fa-solid', 'fa-circle-xmark', 'icon');
      icon.addEventListener('click', () => this.excluirUsuario(index));
      td_acoes.appendChild(icon);
    });
  }

  limparName() {
    document.getElementById('name').value = '';
  }

  limparEmail() {
    document.getElementById('email').value = '';
  }

  excluirUsuario(index) {
    this.arrayAdmin.splice(index, 1);
    this.saveToLocalStorage(); // Salvar alterações no localStorage
    this.listarTabela();
  }

  excluirLista() {
    this.arrayAdmin = [];
    this.saveToLocalStorage();
    this.listarTabela();
  }

  pesquisarUsuario(campo) {
    const inputId = `search${campo.charAt(0).toUpperCase() + campo.slice(1)}`;
    const valor = document.getElementById(inputId).value.toLowerCase().trim();

    if (valor === '') {
      alert('Por favor, digite um valor para pesquisar.');
      this.listarTabela();
      return;
    }

    let foundIndex = null;
    this.arrayAdmin.forEach((admin, index) => {
      if ((campo === 'name' && admin.nome_admin.toLowerCase().includes(valor)) ||
          (campo === 'email' && admin.email_admin.toLowerCase().includes(valor))) {
        foundIndex = index;
      }
    });

    if (foundIndex !== null) {
      this.marcarLinhaEncontrada(foundIndex);
    } else {
      alert('Nenhum usuário encontrado com esse critério de pesquisa.');
      this.listarTabela();
    }

    // Limpar campos de pesquisa após a operação
    document.getElementById(inputId).value = '';
  }

  marcarLinhaEncontrada(index) {
    let tbody = document.getElementById('tbody');
    let rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
      rows[i].classList.remove('destacado');
    }

    rows[index].classList.add('destacado');
  }

  excluirUsuarioEncontrado() {
    let tbody = document.getElementById('tbody');
    let highlightedRow = tbody.querySelector('.destacado');

    if (highlightedRow) {
      let index = Array.from(tbody.children).indexOf(highlightedRow);
      this.arrayAdmin.splice(index, 1);
      this.saveToLocalStorage(); // Salvar alterações no localStorage
      this.listarTabela();
    } else {
      alert('Nenhum usuário selecionado para exclusão.');
    }

    // Limpar campos de pesquisa após a operação
    this.limparName();
    this.limparEmail();
  }

  saveToLocalStorage() {
    localStorage.setItem('arrayAdmin', JSON.stringify(this.arrayAdmin));
  }

  getCadList() {
    return JSON.parse(localStorage.getItem('arrayAdmin')) || [];
  }
}

var usuario = new Usuario();
