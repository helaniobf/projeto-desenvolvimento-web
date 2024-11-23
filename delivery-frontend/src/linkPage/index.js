import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {FaUserCircle, FaCog, FaSignOutAlt, FaClipboard, FaBoxOpen, FaHome} from 'react-icons/fa';
import './linkpage.css';

const LinkPage = () => {
    const [menuLink, setMenuLink] = useState('');
    const [copied, setCopied] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            const generatedLink = `${window.location.origin}/menu/${userId}`;
            setMenuLink(generatedLink);
        }
    }, [userId]);

    const handleCopyLink = () => {
        if (menuLink) {
            navigator.clipboard.writeText(menuLink)
                .then(() => setCopied(true))
                .catch(err => console.error('Erro ao copiar o link: ', err));
        }
    };

    return (
        <div className="create-link-page">
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

            <main className="create-link-main">
                <div className="form-container">
                    <h1>Link do Cardápio</h1>
                    <form className="create-link-form">
                        <div className="link-display">
                            <input
                                type="text"
                                value={menuLink}
                                readOnly
                                className="link-input"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="create-link-button"
                        >
                            <FaClipboard /> {copied ? 'Link Copiado!' : 'Copiar Link'}
                        </button>
                    </form>
                </div>
            </main>

            <footer className="admin-homepage-footer">
                <p>&copy; 2024 Delivery Express | Todos os direitos reservados </p>
            </footer>
        </div>
    );
};

export default LinkPage;
