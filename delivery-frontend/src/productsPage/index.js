import React, { useState, useEffect } from 'react';
import './stylesProductsPage.css';
import {FaBoxOpen, FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaUserCircle, FaHome, FaSignOutAlt} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import { fetchCategoriesByUser, getProductsByUser, deleteProduct  } from '../fileService';
import { useProduct } from '../ProductContext'; // Importar o contexto

const ProductsPage = () => {
    const navigate = useNavigate();
    const { products, updateProducts } = useProduct(); 
    const [productsState, setProducts] = useState([]); 
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [productNameToDelete, setProductNameToDelete] = useState('');

    const userId = localStorage.getItem('userId');
    console.log("usuario", userId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userId) {
                    const categoriesResponse = await fetchCategoriesByUser(userId);
                    setCategories(categoriesResponse);
                    console.log('Categorias:', categoriesResponse);
    
                    const productsResponse = await getProductsByUser(userId);
                    if (JSON.stringify(products) !== JSON.stringify(productsResponse)) {
                        setProducts(productsResponse);
                        updateProducts(productsResponse);
                        console.log('Produtos:', productsResponse);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados: ", error);
            }
        };
    
        fetchData();
    }, [userId, updateProducts]); 
    

    const handleEditProduct = (id) => {
        navigate(`/editProduct/${id}`);
    };
    const handleDeleteProducts = (id) => {
        const filteredProducts = products.filter(product => product.id !== id);
        setProducts(filteredProducts);
        updateProducts(filteredProducts);
    };

    const handleViewProduct = (product) => {
        alert(`Visualizando Produto: ${product.name}\nDescrição: ${product.description}\nCategoria: ${product.category}`);
    };

    const handleGoToCategories = () => {
        navigate('/category');
    };

    const handleAddProduct = () => {
        navigate('/addProduct');
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const categorizedProducts = categories.reduce((acc, category) => {
        acc[category.name] = filteredProducts.filter(product => product.category === category.name);
        return acc;
    }, {});
    
    const handleDeleteProduct = async (id) => {
    try {
        await deleteProduct(id);
        const filteredProducts = products.filter(product => product.id !== id);
        setProducts(filteredProducts);
        updateProducts(filteredProducts);
        setShowModal(false);
    } catch (error) {
        console.error("Erro ao excluir o produto: ", error);
    }
};


    const openModal = (id, name) => {
        setProductIdToDelete(id);
        setProductNameToDelete(name);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setProductIdToDelete(null);
        setProductNameToDelete('');
    };


    return (
        <div className="products-page-container">
            <header className="page-header">
                <img src="/logo.png" alt="Logo" className="page-logo" />
                <nav className="page-nav">
                    <ul className="nav-list">
                        <li><Link to="/restaurante"><FaUserCircle/> Perfil</Link></li>
                        <li><Link to="/home"><FaHome/> Início</Link></li>
                        <li><Link to="/" className="logout-button"><FaSignOutAlt/> Sair</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="products-page-main">
                <div className="products-page-title">
                    <h1>Gerenciamento de Produtos</h1>
                    <p>Adicione, edite e exclua produtos do seu inventário.</p>
                </div>

                <div className="search-section">
                    <div className="search-bar">
                        <FaSearch className="search-icon"/>
                        <input
                            type="text"
                            placeholder="Pesquisar produtos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="products-actions">
                    <button className="add-category-button" onClick={handleGoToCategories}><FaPlus/> Adicionar Categoria
                    </button>
                    <button className="primary-button" onClick={handleAddProduct}><FaPlus/> Adicionar Produto</button>
                </div>

                <div className="categories-container">
                    {categories.map(category => (
                        <div key={category.id} className="category-container">
                            <h2>{category.name}</h2>
                            <div className="category-products">
                                {categorizedProducts[category.name]?.map(product => (
                                    <div key={product.id} className="product-item">
                                        <img src={`http://localhost:8000/${product.image}`} alt={product.name} class="product-image"/>
                                        <div className="product-info">
                                                <h2 className="product-name">{product.name}</h2>
                                                <p className="product-description">Descrição: {product.description}</p>
                                                <p className="product-price">Preço: R$ {product.price}</p>
                                            </div>
                                        <div className="product-buttons">
                                            <button className="edit-button"
                                                    onClick={() => handleEditProduct(product.id)}>
                                                <FaEdit className="product-icon"/>
                                            </button>
                                            <button className="delete-button"
                                                    onClick={() => openModal(product.id, product.name)}>
                                                <FaTrash className="product-icon"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <hr className="category-divider"/>
                        </div>
                    ))}
                </div>
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Confirmar Exclusão</h2>
                            <p>Você tem certeza que deseja excluir o produto "{productNameToDelete}"?</p>
                            <div class="modal-buttons">
                                <button class="button button-confirm" onClick={() => handleDeleteProduct(productIdToDelete)}>Sim</button>
                                <button class="button button-cancel"  onClick={closeModal}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="page-footer">
                &copy; {new Date().getFullYear()} Delivery Express. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default ProductsPage;
