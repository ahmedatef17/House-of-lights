// Endpoint to create payment
app.post('/create-payment', async (req, res) => {
    try {
        const { amount, currency, integration_id } = req.body;

        // Step 1: Create order
        const orderResponse = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
            amount,
            currency,
            integration_id,
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const orderId = orderResponse.data.id;

        // Step 2: Create payment token
        const paymentTokenResponse = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
            order_id: orderId,
            integration_id: integration_id,
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const paymentKey = paymentTokenResponse.data.token;

        res.json({ status: 'success', payment_key: paymentKey });
    } catch (error) {
        console.error(error);
        res.json({ status: 'error', message: error.message });
    }
});


