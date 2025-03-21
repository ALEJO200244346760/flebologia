// cobrar.jsx
import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Cargar la clave pública de Stripe
const stripePromise = loadStripe('tu_clave_publica_de_stripe');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        const cardElement = elements.getElement(CardElement);

        // Hacer la petición al backend para obtener el clientSecret
        try {
            const response = await fetch('/crear-pago', { method: 'POST' });
            const { clientSecret } = await response.json();

            // Confirmar el pago con el clientSecret
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                setErrorMessage(error.message);
                setPaymentSuccess(false);
            } else if (paymentIntent.status === 'succeeded') {
                setPaymentSuccess(true);
                setErrorMessage(null);
            }
        } catch (error) {
            setErrorMessage('Hubo un problema con el pago. Intenta de nuevo más tarde.');
            setPaymentSuccess(false);
        }

        setIsProcessing(false);
    };

    return (
        <div>
            <h2>Realiza tu pago</h2>
            <form onSubmit={handleSubmit}>
                <CardElement />
                <button type="submit" disabled={!stripe || isProcessing}>
                    {isProcessing ? 'Procesando...' : 'Pagar $10'}
                </button>
            </form>

            {paymentSuccess && <div>¡Pago exitoso!</div>}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
    );
};

const Cobrar = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default Cobrar;
