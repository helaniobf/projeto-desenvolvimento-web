import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './loginPage';
import CreateUserPage from './createUser';
import ForgotPasswordPage from './forgotPassword';
import ResetPasswordPage from './resetPassword';
import HomePage from './homePage';
import ProductsPage from "./productsPage";
import CategoryPage from './categoryPage';
import AddProductPage from './addProductPage';
import LinkPage from "./linkPage";
import EditProductPage from './editProductPage';
import MenuPage from "./menuPage/menuPage";
import RestaurantPage from "./restaurantPage";
import CartPage from "./cartPage";
import CheckoutPage from "./checkoutPage";
import { CartProvider } from './CartContext';
import { CheckoutProvider } from "./CheckoutContext";
import { ProductProvider } from './ProductContext';
import OrdersPage from "./orderPage/ordersPage";


const App = () => {
    return (
        <ProductProvider>
            <CheckoutProvider>
                <CartProvider> {/* Envolvemos todo o aplicativo com o CartProvider */}
                    <Router>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/createUser" element={<CreateUserPage />} />
                            <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/products/" element={<ProductsPage />} />
                            <Route path="/category" element={<CategoryPage />} />
                            <Route path="/addProduct" element={<AddProductPage />} />
                            <Route path="/deleteProduct" element={<ProductsPage />} />
                            <Route path="/link" element={<LinkPage />} />
                            <Route path="/editProduct/:id" element={<EditProductPage />} />
                            <Route path="/restaurante" element={<RestaurantPage />} />
                            <Route path="/menu/:userId" element={<MenuPage />} />
                            <Route path="/cartPage" element={<CartPage />} />
                            <Route path="/checkoutPage" element={<CheckoutPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                        </Routes>
                    </Router>
                </CartProvider>
            </CheckoutProvider>
        </ProductProvider>
    );
};

export default App;
