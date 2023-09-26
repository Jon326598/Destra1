function direcionarTelaControle() {
    Swal.fire({
            // position: 'top-end',
            icon: 'success',
            title: 'Login efetuado com sucesso!',
            showConfirmButton: false,
            timer: 2000
        })

    setTimeout(() => {

        window.open('controle-membro.html', '_self')
    }, 3000)
  
}





