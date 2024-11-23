import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const useProduct = () => {
    return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const updateProducts = (newProducts) => {
        if (JSON.stringify(products) !== JSON.stringify(newProducts)) {
            setProducts(newProducts);
        }
    };

    return (
        <ProductContext.Provider value={{ products, updateProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

