let email = document.getElementById('email');
let senha = document.getElementById('senha');
let btnentrar = document.getElementById('btn-entrar');

btnentrar.addEventListener('click', () =>{

    // 1º pegar o email digitado
    let userEmail = email.value;
    // 2º pegar a senha digitada
    let userSenha = senha.value;
    // 3º validar email e senha digitados
        if(!userEmail || !userSenha){
    // 4º se incorreto retornar mensagem de senha ou usuário incorreto
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Os campos de email e senha são obrigatórios!',
        // footer: '<a href="">Why do I have this issue?</a>',
        
      })
        // alert("Os campos de email e senha são obrigatórios");
        return;
    }
    
    // 5º aqui precisamos enviar o email e senha ao backend para saber se o usuário pode acessar o sistema
     autenticar(userEmail, userSenha);
    // 6º se estiver coreto liberar acersso a página de cadastro
});

function autenticar(email, senha){
    const urlBase = `http://localhost:3400`;

    fetch(`${urlBase}/login`,{
        method:'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({email, senha})
    })
    .then(response => response = response.json())
    .then(response => {
        if(!!response.mensagem){
            alert(response.mensagem);
            return;
        }else{

            alert("Usuário autenticado com sucesso");

            salvarToken(response.token);
            salvarUsuario(response.usuario);


            mostrarLoading();
            setTimeout(() => {

                window.open('controle-membro.html', '_self')
            }, 1000)
            
        }
    });
}

function mostrarLoading(){
    const divLoading = document.querySelector('#loading');
    divLoading.style.display='block';

    const divBoxLogin = document.querySelector('div.box-login')
    divBoxLogin.style.display = 'none';

}