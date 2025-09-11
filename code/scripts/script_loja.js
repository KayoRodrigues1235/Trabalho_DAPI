document.addEventListener('DOMContentLoaded', function() {
            // Elementos do DOM
            const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
            const carrinhoModal = document.getElementById('carrinho');
            const overlay = document.getElementById('overlay');
            const fecharCarrinhoBtn = document.getElementById('fechar-carrinho');
            const carrinhoItens = document.getElementById('carrinho-itens');
            const carrinhoTotal = document.getElementById('carrinho-total');
            const contadorCarrinho = document.getElementById('contador-carrinho');
            const botoesAdicionar = document.querySelectorAll('.adicionar-carrinho');
            const confirmarCompraBtn = document.getElementById('confirmar-compra');
            const compraConfirmada = document.getElementById('compra-confirmada');
            const fecharConfirmacao = document.getElementById('fechar-confirmacao');
            
            // Carrinho de compras (array)
            let carrinhoItensArray = [];
            
            // Abrir carrinho
            abrirCarrinhoBtn.addEventListener('click', function() {
                carrinhoModal.classList.add('aberto');
                overlay.classList.add('ativo');
            });
            
            // Fechar carrinho
            fecharCarrinhoBtn.addEventListener('click', function() {
                carrinhoModal.classList.remove('aberto');
                overlay.classList.remove('ativo');
            });
            
            overlay.addEventListener('click', function() {
                carrinhoModal.classList.remove('aberto');
                overlay.classList.remove('ativo');
            });
            
            // Adicionar item ao carrinho
            botoesAdicionar.forEach(botao => {
                botao.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const nome = this.dataset.nome;
                    const preco = parseFloat(this.dataset.preco);
                    
                    // Verificar se o item já está no carrinho
                    const itemExistente = carrinhoItensArray.find(item => item.id === id);
                    
                    if (itemExistente) {
                        // Se já existe, aumenta a quantidade
                        itemExistente.quantidade++;
                    } else {
                        // Se não existe, adiciona novo item
                        carrinhoItensArray.push({
                            id,
                            nome,
                            preco,
                            quantidade: 1
                        });
                    }
                    
                    // Atualiza a exibição do carrinho
                    atualizarCarrinho();
                    
                    // Feedback visual
                    const originalText = this.textContent;
                    this.textContent = 'Adicionado!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 1500);
                });
            });
            
            // Atualizar a exibição do carrinho
            function atualizarCarrinho() {
                // Limpa o conteúdo atual
                carrinhoItens.innerHTML = '';
                
                // Atualiza contador
                const totalItens = carrinhoItensArray.reduce((total, item) => total + item.quantidade, 0);
                contadorCarrinho.textContent = totalItens;
                
                // Habilita ou desabilita o botão de confirmar compra
                confirmarCompraBtn.disabled = totalItens === 0;
                
                // Se o carrinho estiver vazio
                if (carrinhoItensArray.length === 0) {
                    carrinhoItens.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio</p>';
                    carrinhoTotal.textContent = 'Total: R$ 0,00';
                    return;
                }
                
                // Adiciona os itens ao carrinho
                let total = 0;
                
                carrinhoItensArray.forEach(item => {
                    const itemTotal = item.preco * item.quantidade;
                    total += itemTotal;
                    
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('carrinho-item');
                    itemElement.innerHTML = `
                        <div class="carrinho-item-info">
                            <div class="carrinho-item-nome">${item.nome}</div>
                            <div class="carrinho-item-preco">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
                            <div class="carrinho-item-quantidade">
                                <button class="diminuir-quantidade" data-id="${item.id}">-</button>
                                <span>${item.quantidade}</span>
                                <button class="aumentar-quantidade" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="remover-item" data-id="${item.id}">Remover</button>
                    `;
                    
                    carrinhoItens.appendChild(itemElement);
                });
                
                // Atualiza o total
                carrinhoTotal.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
                
                // Adiciona eventos aos botões de remover
                document.querySelectorAll('.remover-item').forEach(botao => {
                    botao.addEventListener('click', function() {
                        const id = this.dataset.id;
                        removerItem(id);
                    });
                });
                
                // Adiciona eventos aos botões de quantidade
                document.querySelectorAll('.aumentar-quantidade').forEach(botao => {
                    botao.addEventListener('click', function() {
                        const id = this.dataset.id;
                        alterarQuantidade(id, 1);
                    });
                });
                
                document.querySelectorAll('.diminuir-quantidade').forEach(botao => {
                    botao.addEventListener('click', function() {
                        const id = this.dataset.id;
                        alterarQuantidade(id, -1);
                    });
                });
            }
            
            // Remover item do carrinho
            function removerItem(id) {
                carrinhoItensArray = carrinhoItensArray.filter(item => item.id !== id);
                atualizarCarrinho();
            }
            
            // Alterar quantidade do item
            function alterarQuantidade(id, change) {
                const item = carrinhoItensArray.find(item => item.id === id);
                if (item) {
                    item.quantidade += change;
                    if (item.quantidade <= 0) {
                        removerItem(id);
                    } else {
                        atualizarCarrinho();
                    }
                }
            }
            
            // Confirmar compra
            confirmarCompraBtn.addEventListener('click', function() {
                // Fecha o carrinho
                carrinhoModal.classList.remove('aberto');
                
                overlay.classList.add('ativo');
                compraConfirmada.classList.add('ativo');
            });
            
            // Fechar a mensagem de confirmação
            fecharConfirmacao.addEventListener('click', function() {
                compraConfirmada.classList.remove('ativo');
                overlay.classList.remove('ativo');
                
                // Limpa o carrinho após a compra
                carrinhoItensArray = [];
                atualizarCarrinho();
            });

            // Funções do menu lateral
            window.alternarMenu = function() {
                const tabela = document.getElementById('tabela');
                const visivel = tabela.style.display === 'block';
                tabela.style.display = visivel ? 'none' : 'block';
            }

            window.fecharMenu = function() {
                const tabela = document.getElementById('tabela');
                tabela.style.display = 'none';
            }

            // Menu com varias opições
            document.querySelectorAll('.dropdown .toggle').forEach(btn => {
                const root = btn.closest('.dropdown');

                function toggle() {
                    const isOpen = root.classList.toggle('open');
                    btn.setAttribute('aria-expanded', String(isOpen));
                }

                btn.addEventListener('click', toggle);

                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle();
                    }
                });
            });
        });


function filtrar(categoria) {
    const produtos = document.querySelectorAll('.produto');

    produtos.forEach(produto => {
        // Se o botão for "todos", mostramos todos
        if(categoria === 'todos') {
            produto.style.display = 'block';
        } else {
            // Se o produto tiver a classe da categoria, mostramos; senão escondemos
            if(produto.classList.contains(categoria)) {
                produto.style.display = 'block';
            } else {
                produto.style.display = 'none';
            }
        }
    });
}
