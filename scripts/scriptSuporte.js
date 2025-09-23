function enviar(event){
    event.preventDefault(); // impede o envio do form

    const emails = document.getElementById('email').value.trim(); 
    const duvida = document.getElementById('duvidas').value.trim();

    // Validação do campo de email
    if(emails === ""){
        Swal.fire({
            title: 'ERRO',
            text: 'Por favor, insira um email válido!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return; // para a execução aqui
    }

    // Validação da dúvida
    if(duvida === ""){
        Swal.fire({
            title: 'ERRO',
            text: 'Por favor, escreva sua dúvida!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Se passar das validações, mostra sucesso
    Swal.fire({
        title: 'EMAIL ENVIADO COM SUCESSO',
        text: 'O email foi enviado para ' + emails,
        icon: 'success',
        confirmButtonText: 'OK'
    }).then((result) => {
        if(result.isConfirmed){
            history.back();
        }
    });
}
