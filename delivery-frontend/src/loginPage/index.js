import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../fileService';
import './login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [remainingTime, setRemainingTime] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [remainingTime]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await login(username, password);

            if (response.success) {
                setMessage('Login realizado com sucesso!');
                localStorage.setItem('username', response.username);
                localStorage.setItem('userId', response.userId);
                navigate('/home');
            } else if (response.remaining_time !== undefined) {
                setRemainingTime(response.remaining_time);
                setMessage(`Conta bloqueada.`);
            } else {
                if (response.message.includes('Usuário não encontrado')) {
                    setMessage('Usuário não encontrado. Verifique o nome de usuário e tente novamente.');
                } else if (response.message.includes('Senha incorreta')) {
                    setMessage('Senha incorreta. Verifique sua senha e tente novamente.');
                } else {
                    setMessage(response.message || 'Falha no login. Tente novamente.');
                }
            }
        } catch (error) {
            setMessage('Ocorreu um erro durante o login.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-box">
                    <img src="/logo.png" alt="Logo" className="login-logo" />
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group-login">
                            <label htmlFor="username"><FaUser /> Usuário</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Digite seu usuário"
                            />
                        </div>
                        <div className="form-group-login">
                            <label htmlFor="password"><FaLock /> Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Digite sua senha"
                            />
                        </div>
                        <button
                            type="submit"
                            className="login-button"
                            disabled={remainingTime > 0}
                        >
                            {remainingTime > 0
                                ? `Tente novamente em ${formatTime(remainingTime)}`
                                : 'Entrar'}
                        </button>
                    </form>
                    {message && <p className="login-message">{message}</p>}
                    <div className="return-login">
                        <p>Não tem uma conta? <Link to="/createUser">Criar conta</Link></p>
                        <p><Link to="/forgotPassword">Esqueci minha senha</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
