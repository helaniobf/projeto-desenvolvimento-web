import React, { createContext, useContext, useEffect, useState } from 'react';

// Criação do contexto
const CartContext = createContext();

export const CartProvider = ({ children, userId }) => {
    const [cart, setCart] = useState(() => {
        if (!userId) return [];
        const savedCart = localStorage.getItem(`cart_${userId}`);
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        if (userId) {
            localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
        }
    }, [cart, userId]);

    const addToCart = (product) => {
        const validPrice = parseFloat(product.price);
        if (isNaN(validPrice) || validPrice <= 0) {
            console.error("Preço inválido para o produto:", product);
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, price: validPrice, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity: quantity } : item
            )
        );
    };

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
