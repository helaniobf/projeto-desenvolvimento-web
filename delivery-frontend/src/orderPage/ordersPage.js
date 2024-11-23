import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';
import './ordersPage.css';
import {FaBoxOpen, FaHome, FaSignOutAlt, FaUserCircle} from "react-icons/fa"; // Importação do arquivo CSS

const OrdersPage = () => {
    const { restaurantId } = useParams(); // Captura o ID do restaurante da URL
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:8000/orders/?restaurant_id=${restaurantId}`);
                if (!response.ok) throw new Error('Erro ao buscar pedidos.');
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError('Não foi possível carregar os pedidos. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [restaurantId]);

    if (loading) return <div className="loading">Carregando pedidos...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!orders || orders.length === 0) return <div className="no-orders">Não há pedidos disponíveis.</div>;

    return (
        <div className="orderpage-container">
            <header className="admin-homepage-header">
                <img src="/logo.png" alt="Logo" className="admin-homepage-logo" />
                <nav className="admin-homepage-nav">
                    <ul className="nav-list">
                        <li><Link to="/restaurante"><FaUserCircle /> Perfil</Link></li>
                        <li><Link to="/home"><FaHome /> Início</Link></li>
                        <li><Link to="/" className="logout-button"><FaSignOutAlt /> Sair</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="orderpage-main">
                <div className="orderpage-card">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <h2>Pedido #{order.id}</h2>
                            <div className="order-info">
                                <p><strong>Cliente:</strong> {order.customer_name || 'Não informado'}</p>
                                <p><strong>Endereço:</strong> {order.address || 'Não informado'}</p>
                                <p><strong>Telefone:</strong> {order.phone || 'Não informado'}</p>
                                <p><strong>Observação:</strong> {order.observation || 'Nenhuma observação'}</p>
                                <p><strong>Total:</strong> R${parseFloat(order.total_price).toFixed(2)}</p>
                                <p><strong>Método de Pagamento:</strong> {order.payment_method || 'Não informado'}</p>
                            </div>
                            <div className="order-items">
                                <h3>Itens do Pedido:</h3>
                                <ul>
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item, index) => (
                                            <li key={index}>
                                                Produto: {item.product_name} - Quantidade: {item.quantity} - Preço: R${parseFloat(item.price).toFixed(2)}
                                            </li>
                                        ))
                                    ) : (
                                        <li>Sem itens no pedido.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="orderpage-footer">
                &copy; 2024 Delivery Express | Todos os direitos reservados
            </footer>
        </div>
    );
};

export default OrdersPage;
