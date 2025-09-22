// Funcionalidades de autenticação
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const passwordInput = document.getElementById('register-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    // Alternar entre login e cadastro
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Ativar botão
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar formulário correspondente
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById(`${tab}-form`).classList.add('active');
        });
    });

    // Mostrar/ocultar senha
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Verificar força da senha
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        let message = '';
        let color = '';

        if (password.length > 0) {
            if (password.length < 6) {
                strength = 25;
                message = 'Fraca';
                color = '#ff6b6b';
            } else if (password.length < 8) {
                strength = 50;
                message = 'Média';
                color = '#ffa500';
            } else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
                strength = 100;
                message = 'Forte';
                color = '#4caf50';
            } else {
                strength = 75;
                message = 'Boa';
                color = '#2196f3';
            }
        }

        strengthBar.style.width = strength + '%';
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = message;
        strengthText.style.color = color;
    });

    // Validar confirmação de senha
    document.getElementById('register-confirm-password').addEventListener('input', function() {
        const password = document.getElementById('register-password').value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#f0f0f0';
        }
    });

    // Formatar telefone
    document.getElementById('register-phone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        if (value.length > 0) {
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            if (value.length > 10) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
        }
        
        e.target.value = value;
    });

    // Submit do login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simular login bem-sucedido
        alert('Login realizado com sucesso!');
        window.location.href = 'index.html';
    });

    // Submit do cadastro
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Validações simples
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        
        if (!document.getElementById('accept-terms').checked) {
            alert('Você precisa aceitar os termos de uso!');
            return;
        }
        
        // Simular cadastro bem-sucedido
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
        
        // Voltar para o login
        tabButtons[0].click();
    });

    // Login com redes sociais (simulado)
    document.querySelectorAll('.social-btn').forEach(button => {
        button.addEventListener('click', function() {
            const network = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
            alert(`Login com ${network} seria implementado aqui!`);
        });
    });
});