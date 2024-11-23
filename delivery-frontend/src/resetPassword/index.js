import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './reset.css';
import { FaLock } from 'react-icons/fa';
import { changePassword } from '../fileService'; 

const ResetPasswordPage = () => {
    const {token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('As senhas não correspondem.');
            setMessageType('error');
            return;
        }

        try {
            const response = await changePassword(token, newPassword); 
            if (response.success) {
                setMessage('Senha alterada com sucesso!');
                setMessageType('success');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    navigate('/'); 
                }, 3000);
            } else {
                setMessage(response.message || 'Ocorreu um erro ao alterar a senha.');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Ocorreu um erro ao alterar a senha. Tente novamente mais tarde.');
            setMessageType('error');
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-box">
                <img src="/logo.png" alt="Logo" className="reset-logo" />
                <h1 className="reset-title">Alterar Senha</h1>
                <form onSubmit={handleSubmit} className="reset-form">
                    <div className="form-group">
                        <label htmlFor="new-password"><FaLock /> Nova Senha</label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Digite sua nova senha"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password"><FaLock /> Confirmar Senha</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Confirme sua nova senha"
                        />
                    </div>
                    <button type="submit" className="reset-button">Alterar Senha</button>
                </form>
                {message && (
                    <p className={`reset-message ${messageType}`}>
                        {message}
                    </p>
                )}
                <div className="back-login">
                    <p>Voltar ao login? <Link to="/">Ir para Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
