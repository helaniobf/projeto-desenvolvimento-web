import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './create.css';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { createUser } from '../fileService';

const CreateUserPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await createUser(username, email, password);
            setMessage('Usuário criado com sucesso!');
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (error) {
            setMessage('Ocorreu um erro ao criar o usuário.');
        }
    };

    return (
        <div className="create-container">
            <div className="create-box">
                <img src="/logo.png" alt="Logo" className="create-logo" /> {}
                <h1 className="create-title">Criar Conta</h1>
                <form onSubmit={handleSubmit} className="create-form-create">
                    <div className="form-group-create">
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
                    <div className="form-group-create">
                        <label htmlFor="email"><FaEnvelope /> Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Digite seu email"
                        />
                    </div>
                    <div className="form-group-create">
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
                    <button type="submit" className="create-button">Criar Conta</button>
                </form>
                {message && <p className="create-message">{message}</p>}
                <div className="return-login">
                    <p>Já tem uma conta? <Link to="/">Voltar ao login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default CreateUserPage;
