import React, { useState, useEffect } from 'react';
import './restaurantPage.css';
import { FaSignOutAlt, FaUserCircle, FaUpload, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Slider } from '@mui/material';
import { saveCompanyInfo, getCompanyByUser } from '../fileService';

const RestaurantPage = () => {
    const [restaurantData, setRestaurantData] = useState({
        name: 'Restaurante',
        address: 'Rua ...',
        phone: '',
        hours: [8, 20],
        description: 'Restaurante ...',
        image: null,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [dragging, setDragging] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await getCompanyByUser(userId);
                const { name, address, contact, opening_hours, description, image } = response.data;
                console.log(response.data)

                setRestaurantData({
                    name: name || '',
                    address: address || '',
                    phone: contact || '',
                    hours: opening_hours ? opening_hours.split(' - ').map(h => parseInt(h, 10)) : [0, 0],
                    description: description || '',
                    image: image || null,
                });

                // Verifica se a imagem existe e cria o preview
                if (image) {
                    setImagePreview(`data:image/png;base64,${image}`);
                } else {
                    setImagePreview('/default-restaurant.jpg');
                }
            } catch (error) {
                console.error('Erro ao buscar informações do restaurante:', error);
            }
        };

        fetchRestaurantData();
    }, [userId]);

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 10) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
        }

        setRestaurantData(prevData => ({ ...prevData, phone: value }));
    };

    const handleHoursChange = (event, newValue) => {
        setRestaurantData(prevData => ({ ...prevData, hours: newValue }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setRestaurantData(prevData => ({ ...prevData, image: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setRestaurantData(prevData => ({ ...prevData, image: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleSave = async () => {
        setIsEditing(false);
        const { name, address, phone, hours, description, image } = restaurantData;

        try {
            await saveCompanyInfo(
                userId,
                name,
                `${hours[0]}:00 - ${hours[1]}:00`,
                address,
                phone,
                description,
                image
            );
            console.log('Informações da empresa salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar informações da empresa:', error);
        }
    };

    return (
        <div className="restaurant-page-container">
            <header className="restaurant-page-header">
                <img src="/logo.png" alt="Logo" className="admin-homepage-logo" />
                <nav className="admin-homepage-nav">
                    <ul className="nav-list">
                        <li><Link to="/restaurante"><FaUserCircle /> Perfil</Link></li>
                        <li><Link to="/home"><FaHome /> Início</Link></li>
                        <li><Link to="/" className="logout-button"><FaSignOutAlt /> Sair</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="restaurant-page-content">
                <div className="restaurant-info">
                    <div className="form-group">
                    <h2>Informações do Restaurante</h2>
                        {isEditing ? (
                            <div
                                className={`image-upload ${dragging ? 'dragging' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input type="file" accept="image/*" onChange={handleImageChange}
                                       style={{ display: 'none' }} id="imageInput" />
                                <label htmlFor="imageInput">
                                    <div className="upload-area">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="imagem" className="restaurant-image-preview" />
                                        ) : (
                                            <FaUpload className="upload-icon" />
                                        )}
                                        <p>{imagePreview ? 'Alterar Imagem' : 'Arraste ou clique para enviar uma imagem'}</p>
                                    </div>
                                </label>
                            </div>
                        ) : (
                            <img src={imagePreview || '/default-restaurant.jpg'} alt="imagem" className="restaurant-image" />
                        )}
                    </div>
                    <form className="restaurant-form">
                        <div className="form-group">
                            <label>Nome do Restaurante:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={restaurantData.name}
                                    onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                                    required
                                />
                            ) : (
                                <p>{restaurantData.name}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Endereço:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={restaurantData.address}
                                    onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
                                    required
                                />
                            ) : (
                                <p>{restaurantData.address}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Telefone:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={restaurantData.phone}
                                    onChange={handlePhoneChange}
                                    maxLength={15}
                                    required
                                />
                            ) : (
                                <p>{restaurantData.phone}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Horário de Funcionamento:</label>
                            {isEditing ? (
                                <div className="slider-container">
                                    <Slider
                                        value={restaurantData.hours}
                                        onChange={handleHoursChange}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={24}
                                        marks={[
                                            { value: 0, label: '00:00' },
                                            { value: 6, label: '06:00' },
                                            { value: 12, label: '12:00' },
                                            { value: 18, label: '18:00' },
                                            { value: 24, label: '24:00' },
                                        ]}
                                    />
                                    <div className="time-range">
                                        <span>{restaurantData.hours[0]}:00</span> - <span>{restaurantData.hours[1]}:00</span>
                                    </div>
                                </div>
                            ) : (
                                <p>{restaurantData.hours[0]}:00 - {restaurantData.hours[1]}:00</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Descrição:</label>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={restaurantData.description}
                                    onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })}
                                    rows="4"
                                />
                            ) : (
                                <p>{restaurantData.description}</p>
                            )}
                        </div>

                        <div className="form-group">
                            {isEditing ? (
                                <>
                                    <button type="button" onClick={handleSave}>Salvar</button>
                                    <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                                </>
                            ) : (
                                <button type="button" onClick={() => setIsEditing(true)}>Editar</button>
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default RestaurantPage;
