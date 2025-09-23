document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.querySelectorAll('.cart-item');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartContainer = document.querySelector('.cart-container');
    const cartCount = document.querySelector('.cart-count');
    
    function checkEmptyCart() {
        if (cartItems.length === 0) {
            cartContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
        }
    }
    
    function updateQuantity(button, change) {
        const quantityElement = button.parentElement.querySelector('.quantity');
        let quantity = parseInt(quantityElement.textContent);
        quantity += change;
        
        if (quantity < 1) quantity = 1;
        
        quantityElement.textContent = quantity;
        updateItemTotal(button.parentElement.parentElement);
        updateCartTotal();
    }

    function updateItemTotal(item) {
        const price = parseFloat(item.querySelector('.item-price').textContent.replace('R$ ', '').replace(',', '.'));
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        const totalElement = item.querySelector('.item-total span');
        
        const total = price * quantity;
        totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    function updateCartTotal() {
        const itemTotals = document.querySelectorAll('.item-total span');
        let subtotal = 0;
        
        itemTotals.forEach(totalElement => {
            subtotal += parseFloat(totalElement.textContent.replace('R$ ', '').replace(',', '.'));
        });
        
        const delivery = 15.00;
        const total = subtotal + delivery;
        
        document.querySelector('.summary-line:nth-child(2) span:last-child').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        document.querySelector('.summary-line.total span:last-child').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    function removeItem(button) {
        const item = button.parentElement;
        item.remove();

        const currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount - 1;
        
        updateCartTotal();
        checkEmptyCart();
    }
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(btn, 1));
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(btn, -1));
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => removeItem(btn));
    });

    document.querySelector('.checkout-btn').addEventListener('click', function() {
        alert('Compra finalizada com sucesso! Obrigado pela preferência!');
    });

    updateCartTotal();
    checkEmptyCart();
});