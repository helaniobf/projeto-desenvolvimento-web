import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useCheckout } from '../CheckoutContext';
import "./checkoutPage.css";
import axios from "axios";

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, setCart } = useCart();
    const { deliveryInfo, setDeliveryInfo, paymentMethod, setPaymentMethod } = useCheckout();

    const [currentStep, setCurrentStep] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const observation = location.state?.observation || "";

    const validateDeliveryInfo = () => {
        const { fullName, phone, street, number, district, city, state } = deliveryInfo;
        if (!fullName || !phone || !street || !number || !district || !city || !state) {
            setError("Por favor, preencha todos os campos obrigatórios.");
            return false;
        }
        setError("");
        return true;
    };

    const validatePaymentMethod = () => {
        if (!paymentMethod) {
            setError("Por favor, selecione uma forma de pagamento.");
            return false;
        }
        setError("");
        return true;
    };

    const formatPhoneNumber = (phone) => {
        // Remove todos os caracteres não numéricos
        let cleaned = phone.replace(/\D/g, '');
        
        // Limita o número de caracteres para 11 (considerando DD e número)
        if (cleaned.length > 11) {
            cleaned = cleaned.slice(0, 11);
        }
    
        // Aplica a máscara para o formato (XX) XXXXX-XXXX
        if (cleaned.length <= 2) {
            return `(${cleaned}`;
        } else if (cleaned.length <= 6) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
        }
    };
    

    const finalizeOrder = async () => {
        const orderData = {
            customer_name: deliveryInfo.fullName,
            observation: observation,
            total_price: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
            items: cart.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            address: {
                street: deliveryInfo.street,
                number: deliveryInfo.number,
                complement: deliveryInfo.complement,
                district: deliveryInfo.district,
                city: deliveryInfo.city, 
                state: deliveryInfo.state,
            },
            payment_method: paymentMethod,
            phone: deliveryInfo.phone,
        };
    
        try {
            const response = await axios.post("http://localhost:8000/orders/create/", orderData);
            console.log("Pedido enviado com sucesso:", response.data);
    
            // Esvaziar o carrinho e resetar informações de entrega após o pedido ser finalizado com sucesso
            setCart([]);
            setDeliveryInfo({
                fullName: "",
                phone: "",
                street: "",
                number: "",
                complement: "",
                district: "",
                city: "",
                state: ""
            });
            setPaymentMethod("");
    
            setIsModalOpen(true); // Abrir modal de sucesso
        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            setError("Erro ao processar o pedido. Tente novamente.");
        }
    };
    

    const closeModal = () => {
        setIsModalOpen(false);
        setCart([]);
        setDeliveryInfo({
            fullName: "",
            phone: "",
            street: "",
            number: "",
            complement: "",
            district: "",
            city: "",
            state: ""
        });
        setPaymentMethod("");
        navigate("/menu/:userId");
    };

    return (
        <div className="checkout-page-container">
            {currentStep === 1 && (
                <div className="delivery-info">
                    <h2>Informações de Entrega</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form>
                        <input type="text" placeholder="Nome completo" value={deliveryInfo.fullName} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Telefone" value={deliveryInfo.phone} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: formatPhoneNumber(e.target.value) })} className="input-field" />
                        <input type="text" placeholder="Rua" value={deliveryInfo.street} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, street: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Número" value={deliveryInfo.number} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, number: e.target.value.replace(/[^0-9]/g, '') })} className="input-field" />
                        <input type="text" placeholder="Complemento" value={deliveryInfo.complement} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, complement: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Bairro" value={deliveryInfo.district} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, district: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Cidade" value={deliveryInfo.city} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Estado" value={deliveryInfo.state} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })} className="input-field" />
                        <button type="button" onClick={() => validateDeliveryInfo() && setCurrentStep(2)} className="next-step-button">Próximo</button>
                    </form>
                </div>
            )}

            {currentStep === 2 && (
                <div className="payment-method">
                    <h2>Forma de Pagamento</h2>
                    {error && <p className="error-message">{error}</p>}
                    <label className="payment-option">
                        <input type="radio" name="paymentMethod" value="Cartão" checked={paymentMethod === "Cartão"} onChange={(e) => setPaymentMethod(e.target.value)} />
                        Cartão
                    </label>
                    <label className="payment-option">
                        <input type="radio" name="paymentMethod" value="Pix" checked={paymentMethod === "Pix"} onChange={(e) => setPaymentMethod(e.target.value)} />
                        Pix
                    </label>
                    <label className="payment-option">
                        <input type="radio" name="paymentMethod" value="Dinheiro" checked={paymentMethod === "Dinheiro"} onChange={(e) => setPaymentMethod(e.target.value)} />
                        Dinheiro
                    </label>
                    <button type="button" onClick={() => validatePaymentMethod() && setCurrentStep(3)} className="next-step-button">Próximo</button>
                </div>
            )}

            {currentStep === 3 && (
                <div className="order-summary">
                    <h2>Resumo do Pedido</h2>
                    <h3>Itens:</h3>
                    <ul>
                        {cart.map(item => (
                            <li key={item.id}>
                                {item.name} - {item.quantity} x R$ {parseFloat(item.price).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <h3>Observação:</h3>
                    <p>{observation}</p>
                    <h3>Endereço:</h3>
                    <p>{deliveryInfo.street}, {deliveryInfo.number}, {deliveryInfo.complement}</p>
                    <p>{deliveryInfo.district} - {deliveryInfo.city}/{deliveryInfo.state}</p>
                    <p>Telefone: {deliveryInfo.phone}</p>
                    <h3>Forma de Pagamento:</h3>
                    <p>{paymentMethod}</p>
                    <div className="buttons-container">
                        <button type="button" onClick={finalizeOrder} className="finalize-button">Finalizar Compra</button>
                        <button type="button" onClick={() => navigate('/cartPage')} className="edit-order-button">Alterar Pedido</button>
                        <button 
                            type="button" 
                            onClick={() => {
                                setCart([]);
                                setDeliveryInfo({
                                    fullName: "",
                                    phone: "",
                                    street: "",
                                    number: "",
                                    complement: "",
                                    district: "",
                                    city: "",
                                    state: ""
                                });
                                setPaymentMethod("");
                                navigate('/menu/:userId');
                            }} 
                            className="cancel-order-button">
                            Cancelar Pedido
                        </button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>&times;</button>
                        <h2>Pedido realizado com sucesso!</h2>
                        <p>Obrigado pela sua compra!</p>
                        <button className="close-modal-button" onClick={closeModal}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
