


function rendercarrinho() {
    const cartItemsUl = document.getElementById('cart-items');
    cartItemsUl.innerHTML = '';

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.forEach(item => {
        const cartItemLi = document.createElement('li');
        cartItemLi.classList.add('cart-item');
        cartItemLi.innerHTML = `
        
            <span>${item.id} (x${item.quantidade})</span>
            <span>R$${(item.valor * item.quantidade).toFixed(2)}</span>
            <button onclick="removercarrinho('${item.id}', '${item.categoria}')">Remover</button>
        `;
        cartItemsUl.appendChild(cartItemLi);
    });
}

function removercarrinho(id, categoria) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id && item.categoria === categoria);

    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        rendercarrinho();
    }
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.forEach(item => {
        const { categoria, id, quantidade } = item;

        firebase.firestore().collection(categoria).doc(id).get().then(doc => {
            const produto = doc.data();
            if (produto) {
                const novaQuantidade = produto.quantidade - quantidade;
                return firebase.firestore().collection(categoria).doc(id).update({ quantidade: novaQuantidade });
            }
        }).catch(error => {
            console.error('Erro ao atualizar quantidade:', error);
        });
    });

    alert('Compra finalizada!');
    localStorage.removeItem('cart');
    rendercarrinho();
}
document.getElementById('checkout-btn').addEventListener('click', checkout);

window.onload = rendercarrinho;
