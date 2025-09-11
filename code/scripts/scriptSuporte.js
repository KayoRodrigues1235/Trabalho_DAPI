function enviar(){
    const emails = document.getElementById('email').value;

    event.preventDefault();

        Swal.fire({
        title: 'EMAIL ENVIADO COM SUCESSO',
        text: 'O email foi enviado para '+ emails,
        icon: 'success',
        confirmButtonText: 'OK'
    }).then((result) => {
        if(result.isConfirmed){
            history.back();
        }
    })
}