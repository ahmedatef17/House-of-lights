document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartDisplay = document.createElement('div');
    cartDisplay.id = 'cartDisplay';
    document.body.appendChild(cartDisplay);

    // Function to update the cart display
    function updateCartDisplay() {
        cartDisplay.innerHTML = '<h2>Your Cart</h2>';
        if (cart.length === 0) {
            cartDisplay.innerHTML += '<p>No items in cart.</p>';
        } else {
            cart.forEach(item => {
                cartDisplay.innerHTML += `<p>${item.product} - ${item.price} EGP</p>`;
            });
            const total = cart.reduce((total, item) => total + parseFloat(item.price), 0);
            cartDisplay.innerHTML += `<strong>Total: ${total} EGP</strong>`;
        }
    }

    // Add product to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const price = button.getAttribute('data-price');
            cart.push({ product, price });
            alert(`${product} has been added to your cart.`);
            updateCartDisplay(); // Update the cart display
        });
    });

    // Handle payment form submission
    document.getElementById('paymentForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        if (paymentMethod === 'paymob') {
            const orderData = {
                amount: cart.reduce((total, item) => total + parseFloat(item.price), 0) * 100, // convert to piasters
                currency: 'EGP',
                integration_id: '4856247', // Paymob Integration ID
            };

            // Call server to create payment
            const response = await fetch('/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (result.status === 'success') {
                // Redirect to Paymob iframe for payment
                window.location.href = `https://accept.paymob.com/api/acceptance/iframes/875125?payment_token=${result.payment_key}`;
            } else {
                alert('Payment failed: ' + result.message);
            }
        } else {
            alert('Order placed successfully with Cash on Delivery!');
            cart.length = 0; // Clear cart after placing the order
            updateCartDisplay(); // Update cart display
        }
    });
});
