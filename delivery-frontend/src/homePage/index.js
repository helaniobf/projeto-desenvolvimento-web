import React, { useState, useEffect } from 'react';
import './homePage.css';
import {
    FaUserCircle,
    FaCog,
    FaSignOutAlt,
    FaInfoCircle,
    FaBoxOpen,
    FaStore,
    FaLink,
    FaHome,
    FaClipboardList
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getProductsByUser } from '../fileService'; 

const AdminHomePage = () => {
    const [menuLink, setMenuLink] = useState('');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate(); 

    useEffect(() => {
        if (userId) {
            const generatedLink = `${window.location.origin}/menu/${userId}`;
            setMenuLink(generatedLink);
        }
    }, [userId]);

    const handleViewStore = async () => {
        try {
            const products = await getProductsByUser(userId); 
          
            navigate(`/menu/${userId}`, { state: { products } });
        } catch (error) {
            console.error('Erro ao carregar produtos: ', error);
            
        }
    };

    return (
        <div className="admin-homepage-container">
            <header className="admin-homepage-header">
                <img src="/logo.png" alt="Logo" className="admin-homepage-logo" />
                <nav className="admin-homepage-nav">
                    <ul className="nav-list">
                        <li><Link to="/restaurante"><FaUserCircle/> Perfil</Link></li>
                        <li><Link to="/home"><FaHome/> Início</Link></li>
                        <li><Link to="/" className="logout-button"><FaSignOutAlt/> Sair</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="admin-homepage-main">
                <section className="admin-homepage-grid">
                    <div className="admin-homepage-card" id="restaurant-info">
                        <h2><FaInfoCircle/> Informações do Restaurante</h2>
                        <p>Atualize os detalhes do restaurante como endereço e horário de funcionamento.</p>
                        <Link to="/restaurante">
                            <button className="action-button">Atualizar Informações</button>
                        </Link>
                    </div>

                    <div className="admin-homepage-card" id="manage-products">
                        <h2><FaBoxOpen /> Gerenciar Produtos</h2>
                        <p>Adicione, edite ou remova produtos disponíveis para venda.</p>
                        <Link to="/products">
                            <button className="action-button">Gerenciar Produtos</button>
                        </Link>
                    </div>

                    <div className="admin-homepage-card" id="view-store">
                        <h2><FaStore /> Visualizar Loja</h2>
                        <p>Veja uma pré-visualização da loja online.</p>
                        <button
                            className="action-button"
                            onClick={handleViewStore} 
                        >
                            Visualizar Loja
                        </button>
                    </div>
                    <div className="admin-homepage-card" id="generate-link">
                        <h2><FaLink /> Gerar Link de Compartilhamento</h2>
                        <p>Crie um link para compartilhar a loja com clientes.</p>
                        <Link to="/link">
                            <button className="action-button">Gerar Link</button>
                        </Link>
                    </div>
                    <div className="admin-homepage-card" id="view-orders">
                        <h2><FaClipboardList /> Visualizar Pedidos</h2>
                        <p>Veja os pedidos feitos pelos clientes na loja online.</p>
                        <Link to="/orders">
                            <button className="action-button">Visualizar Pedidos</button>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="admin-homepage-footer">
                <p>&copy; 2024 Delivery Express | Todos os direitos reservados</p>
            </footer>
        </div>
    );
};

export default AdminHomePage;
