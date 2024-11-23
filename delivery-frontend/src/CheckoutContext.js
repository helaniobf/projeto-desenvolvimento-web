import React, { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: "",
        phone: "",
        street: "",
        number: "",
        complement: "",
        district: "",
        city: "",
        state: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("");

    return (
        <CheckoutContext.Provider value={{ deliveryInfo, setDeliveryInfo, paymentMethod, setPaymentMethod }}>
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => {
    return useContext(CheckoutContext);
};
