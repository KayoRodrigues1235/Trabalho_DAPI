/* -------------------------
   Mini "banco de dados" em JS (localStorage)
   Uso: Apenas para testes/desenvolvimento.
   ------------------------- */

const MINI_DB_KEY = 'mini_bank_cards_v1';

// Retorna array de cartões salvos
function getMiniDB() {
    try {
        const raw = localStorage.getItem(MINI_DB_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (err) {
        console.error('Erro ao ler mini DB', err);
        return [];
    }
}

// Salva array no localStorage
function saveMiniDB(cards) {
    localStorage.setItem(MINI_DB_KEY, JSON.stringify(cards));
}

// Adiciona um cartão ao mini DB
// card = { number: '4242424242424242', cvv: '123', validade: '12/30', nome: 'Fulano' }
function addCardToMiniDB(card) {
    const cards = getMiniDB();
    // armazenamos apenas versão limpa (sem espaços)
    const clean = {
        number: (card.number || '').replace(/\s+/g, ''),
        cvv: (card.cvv || '').replace(/\D/g, ''),
        validade: card.validade || '',
        nome: card.nome || ''
    };
    cards.push(clean);
    saveMiniDB(cards);
    return clean;
}

// Remove todos os cartões (útil para resetar)
function clearMiniDB() {
    localStorage.removeItem(MINI_DB_KEY);
}

// Procura cartão exato no DB (number + cvv + validade)
function findCardInMiniDB(number, cvv, validade) {
    const cleanNumber = (number || '').replace(/\s+/g, '');
    const cleanCvv = (cvv || '').replace(/\D/g, '');
    const cards = getMiniDB();
    return cards.find(c => c.number === cleanNumber && c.cvv === cleanCvv && c.validade === validade) || null;
}

/* -------------------------
   Seed inicial (apenas se DB estiver vazio)
   Um cartão de teste para facilitar (use apenas em dev)
   ------------------------- */
(function seedDB() {
    const existing = getMiniDB();
    if (!existing || existing.length === 0) {
        // Cartão de teste (ex.: número de teste, CVV e validade futura)
        addCardToMiniDB({ number: '4242424242424242', cvv: '123', validade: '12/30', nome: 'Cartão Teste' });
        // Você pode adicionar outros cartões aqui se quiser
        console.log('Mini DB seeded com cartão de teste.');
    }
})();

/* -------------------------
   Validações locais (Luhn, validade, máscara etc.)
   ------------------------- */

// Luhn
function luhnValid(cardNumber) {
    const s = (cardNumber || '').replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    for (let i = s.length - 1; i >= 0; i--) {
        let digit = parseInt(s[i], 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return s.length > 0 && sum % 10 === 0;
}

function validadeValida(valor) {
    if (!/^\d{2}\/\d{2}$/.test(valor)) return false;
    const [mm, aa] = valor.split('/').map(Number);
    if (mm < 1 || mm > 12) return false;
    const agora = new Date();
    const anoAtual = Number(String(agora.getFullYear()).slice(-2));
    if (aa < anoAtual) return false;
    if (aa === anoAtual && mm < (agora.getMonth() + 1)) return false;
    return true;
}

/* -------------------------
   Integração com o seu formulário/pagamento existente
   ------------------------- */

document.getElementById('pagamento').addEventListener('change', function () {
    const div = document.getElementById('pagamento-especifico');
    div.innerHTML = '';

    if (this.value === 'credito' || this.value === 'debito') {
        div.innerHTML = `
            <label for="numero-cartao">Número do Cartão</label>
            <input type="text" id="numero-cartao" name="numero-cartao" maxlength="19" inputmode="numeric" placeholder="1234 5678 9012 3456" required>
            
            <label for="nome-cartao">Nome no Cartão</label>
            <input type="text" id="nome-cartao" name="nome-cartao" required>
            
            <label for="validade-cartao">Validade</label>
            <input type="text" id="validade-cartao" name="validade-cartao" placeholder="MM/AA" maxlength="5" inputmode="numeric" required>
            
            <label for="cvv">CVV</label>
            <input type="text" id="cvv" name="cvv" maxlength="3" inputmode="numeric" required>
        `;
    } else if (this.value === 'pix') {
        div.innerHTML = `
            <p>Chave PIX: <strong>doceria@email.com</strong></p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?data=doceria@email.com&size=150x150" alt="QR Code PIX">
            <p>Escaneie o QR Code para pagar.</p>
        `;
    }

    // Máscara para validade MM/AA
    const validadeInput = document.getElementById("validade-cartao");
    if (validadeInput) {
        validadeInput.addEventListener("input", function () {
            let valor = validadeInput.value.replace(/\D/g, ""); // só números
            if (valor.length > 2) {
                valor = valor.substring(0, 2) + "/" + valor.substring(2, 4);
            }
            validadeInput.value = valor;
        });
    }

    // Máscara simples para número do cartão (agrupa em blocos de 4)
    const numeroInput = document.getElementById('numero-cartao');
    if (numeroInput) {
        numeroInput.addEventListener('input', function () {
            let v = numeroInput.value.replace(/\D/g, '').substring(0, 16);
            v = v.replace(/(.{4})/g, '$1 ').trim();
            numeroInput.value = v;
        });
    }

    // Forçar CVV apenas números
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function () {
            cvvInput.value = cvvInput.value.replace(/\D/g, '').substring(0, 3);
        });
    }
});

// Submit final com validação + verificação no mini DB
document.getElementById('formFinalizacao').addEventListener('submit', function(e) {
    e.preventDefault();

    const tipoPagamento = document.getElementById('pagamento').value;

    if (tipoPagamento === 'credito' || tipoPagamento === 'debito') {
        const numeroRaw = document.getElementById('numero-cartao').value;
        const numero = numeroRaw.replace(/\s+/g, '');
        const validade = document.getElementById('validade-cartao').value;
        const cvv = document.getElementById('cvv').value;

        // Validações locais
        if (!/^\d{13,16}$/.test(numero)) { // aceita 13 a 16 dígitos (vários cartões)
            document.getElementById('mensagem').textContent = "Número do cartão tem tamanho inválido.";
            return;
        }
        if (!luhnValid(numero)) {
            document.getElementById('mensagem').textContent = "Número do cartão inválido (Luhn).";
            return;
        }
        if (!validadeValida(validade)) {
            document.getElementById('mensagem').textContent = "Data de validade inválida.";
            return;
        }
        if (!/^\d{3}$/.test(cvv)) {
            document.getElementById('mensagem').textContent = "CVV inválido.";
            return;
        }

        // Verifica se existe no mini DB (match exato)
        const found = findCardInMiniDB(numero, cvv, validade);
        if (!found) {
            document.getElementById('mensagem').textContent = "Cartão não encontrado no banco de testes.";
            return;
        }
    }

    // Se passou em todas as validações
    document.getElementById('mensagem').textContent = "Pedido realizado com sucesso! Obrigado pela compra.";
    this.reset();
    document.getElementById('pagamento-especifico').innerHTML = '';
});

/* -------------------------
   Funções úteis que você pode chamar no console/debug:
   - addCardToMiniDB({number:'4242...', cvv:'123', validade:'12/30', nome:'Teste'})
   - getMiniDB()
   - clearMiniDB()
   ------------------------- */
