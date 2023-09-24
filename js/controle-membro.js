const URL = 'http://localhost:3400/clientes';
let modoEdicao = false;

let listaMembro = [];

let btnAdicionar = document.getElementById('btn-adicionar');
let tabelaMembro = document.querySelector('table>tbody');
let modalMembro = new bootstrap.Modal(document.getElementById("modal-membro"), {});
let tituloModal = document.querySelector('h4.modal-title');

let btnSalvar = document.getElementById('btn-salvar');
let btnCancelar = document.getElementById('btn-cancelar');

let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('name'),
    sexo: document.getElementById('sexo'),
    telefone: document.getElementById('telefone'),
    cpf: document.getElementById('cpf'),
    email: document.getElementById('email'),
    dataNasc: document.getElementById('dataNasc'),

}

class Membro {
    constructor(obj) {
        obj = obj || {};

        this.id = obj.id;
        this.nome = obj.nome;
        this.cpfOuCnpj = obj.cpfOuCnpj;
        this.email = obj.email;
        this.telefone = obj.telefone;
        this.sexo = obj.sexo;
        this.dataNasc = obj.dataNasc;

    }
}

btnAdicionar.addEventListener('click', () => {
    modoEdicao = false;
    tituloModal.textContent = 'Novo membro'
    limparModalMembro()
    modalMembro.show();
});

btnSalvar.addEventListener('click', () => {

    // 1º capturar membro do modal
    let membro = obterMembroDoModal();
    // 2º se os campos obrigatórios foram preenchidos
    if (!membro.cpfOuCnpj || !membro.email) {
        alert('E-mail e CPF são obrigatórios.')
        return;
    }
    modalMembro.textContent = "";

    // 3º novo cadastro de informações
    if (modoEdicao) {
        atualizarMembroBackend(membro);
    } else {
        adicionarMembroBackend(membro);
    }



});

btnCancelar.addEventListener('click', () => {
    modalMembro.hide();
});

function obterMembroDoModal() {

    return new Membro({
        id: formModal.id.value,
        nome: formModal.nome.value,
        sexo: formModal.sexo.value,
        telefone: formModal.telefone.value,
        cpfOuCnpj: formModal.cpf.value,
        email: formModal.email.value,
        dataNasc: formModal.dataNasc.value,


    })
}

function obterMembro() {

    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization': obterToken()
        }
    })

        .then(response => response.json())
        .then(response => {
            listaMembro = response;
            popularTabela(response);
        })
        .catch()

}

function editarMembro(id) {
    modoEdicao = true;
    tituloModal.textContent = 'Editar membro'

    let membro = listaMembro.find(membro => membro.id == id);
    atualizarModalMembro(membro);
    modalMembro.show();

}

function atualizarModalMembro(membro) {

    formModal.id.value = membro.id;
    formModal.nome.value = membro.nome;
    formModal.sexo.value = membro.sexo;
    formModal.cpf.value = membro.cpfOuCnpj;
    formModal.email.value = membro.email;
    formModal.telefone.value = membro.telefone;
    formModal.dataNasc.value = membro.dataNasc
}

function limparModalMembro() {

    formModal.id.value = "";
    formModal.nome.value = "";
    formModal.sexo.value = "";
    formModal.cpf.value = "";
    formModal.email.value = "";
    formModal.telefone.value = "";
    formModal.dataNasc.value = "";
}

function excluirMembro(id) {
    let membro = listaMembro.find(m => m.id == id);

    Swal.fire({
       
        text: 'Deseja realmente excluir o membro ' + membro.nome + ' ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!'
    })
        .then((result) => {
            if (result.isConfirmed) {
                excluirMembroBackend(membro);
                Swal.fire({
                    icon: 'success',
                    title: 'Membro excluído com sucesso !',
                    showConfirmButton: false,
                    timer: 2500
                })
            }
        })



    // if(confirm('Deseja realmente excluir o membro ' + membro.nome)){


    // }

}

function criarLinhaNaTabela(membro) {


    let tr = document.createElement('tr');

    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdSexo = document.createElement('td');
    let tdTel = document.createElement('td');
    let tdCpf = document.createElement('td');
    let tdEmail = document.createElement('td');
    let tdNasc = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.textContent = membro.id;
    tdNome.textContent = membro.nome;
    tdSexo.textContent = membro.sexo;
    tdTel.textContent = membro.telefone;
    tdCpf.textContent = membro.cpfOuCnpj;
    tdEmail.textContent = membro.email;
    tdNasc.textContent = membro.dataNasc;

    tdAcoes.innerHTML = `<button onclick="editarMembro(${membro.id})" class="btn btn-dark btn-sm mr-3">
                                Editar
                            </button>
                            <button onclick="excluirMembro(${membro.id})" class="btn btn-outline-dark btn-sm mr-3">
                                Excluir
                            </button>`;


    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdSexo);
    tr.appendChild(tdTel);
    tr.appendChild(tdCpf);
    tr.appendChild(tdEmail);
    tr.appendChild(tdNasc);
    tr.appendChild(tdAcoes);

    tabelaMembro.appendChild(tr);



}

function popularTabela(response) {

    tabelaMembro.textContent = "";

    response.forEach(membro => {
        criarLinhaNaTabela(membro);



    });
}

function adicionarMembroBackend(membro) {

    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': obterToken()
        },
        body: JSON.stringify(membro)
    })
        .then(response => response.json())
        .then(response => {
            let novoMembro = new Membro(response);
            listaMembro.push(novoMembro);

            popularTabela(listaMembro);

            modalMembro.textContent = "";
            modalMembro.hide();
            Swal.fire({
                icon: 'success',
                title: 'Membro adicionado com sucesso !',
                showConfirmButton: false,
                timer: 2500
            })

        })
        .catch(error => {
            console.log(error)
        })

}

function atualizarMembroBackend(membro) {

    fetch(`${URL}/${membro.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': obterToken()
        },
        body: JSON.stringify(membro)
    })
        .then(response => response.json())
        .then(() => {

            atualizarMembroNaLista(membro, false);
            modalMembro.hide();
            Swal.fire({
                icon: 'success',
                title: 'Atualizado com sucesso !',
                showConfirmButton: false,
                timer: 2500
            })

        })
        .catch(error => {
            console.log(error)
        })

}

function excluirMembroBackend(membro) {

    fetch(`${URL}/${membro.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': obterToken()
        },
    })
        .then(response => response.json())
        .then(() => {

            atualizarMembroNaLista(membro, true);
            modalMembro.hide();

            

        })
        .catch(error => {
            console.log(error)
        })

}

function atualizarMembroNaLista(membro, removeMembro) {

    let indice = listaMembro.findIndex((m) => m.id == membro.id);

    (removeMembro)
        ? listaMembro.splice(indice, 1)
        : listaMembro.splice(indice, 1, membro);

    popularTabela(listaMembro);

    modalMembro.hide();
}

function obterToken() {
    return localStorage.getItem("token");
}

obterMembro();