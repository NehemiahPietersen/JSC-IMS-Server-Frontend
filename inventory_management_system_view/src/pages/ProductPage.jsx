import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../components/PaginationComponent";
import "../styles/Product.css"

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [ message, setMessage ] = useState('');

    const navigate = useNavigate();

    //Pagination component
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(0);
    const itemsPerPage = 12;
    // todo give user option to say view how many items per page they want

    const showMessage =(msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    }

    useEffect(() => {
        const getProducts = async() => {
            try {
                const productData = await ApiService.getAllProducts();
                console.log("API Response:", productData);  // Add this line
                if(productData.status === 200) {
                    setTotalPages(Math.ceil(productData.productList.length / itemsPerPage));
                    setProducts(
                        productData.productList.slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                        )
                    );
                    console.log("Products to display:", productData.productList.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                    ));  // Add this line
                }   
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error getting supplier: " + error
                );
            }
        }
        getProducts();
    }, [currentPage]);

    //delete product
    const handleDeleteProduct = async(productId) => {
        if(window.confirm("Are you sure you want to delete this Product?")) {
            try {
                await ApiService.deleteProduct(productId);
                showMessage("Product successfully deleted");
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error deleting product: " + error
                );
            }
        }
    };

    return (
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="products-page">
                <div className="product-header">
                    <h1>Products</h1>
                    <button className="add-prod-button" onClick={() => navigate("/add-product")}>
                        Add Product
                    </button>
                </div>
                
                <div className="product-list">
                    {products.map((product) => (
                        <div key={product.id} className="product-item">
                            <img
                            className="product-image"
                            src={product.imageUrl}
                            alt={product.name}
                            />
                            
                            <div className="product-info">
                                <h3 className="name">{product.name}</h3>
                                <p className="sku">SKU: {product.sku}</p>
                                <p className="price">Price: ${product.price}</p>
                                <p className={`quantity ${product.stockQuantity === 0 ? 'out-of-stock' : product.stockQuantity < 5 ? 'low-stock' : 'in-stock'}`}>
                                    Quantity: {product.stockQuantity}
                                </p>
                            </div>

                            <div className="product-actions">
                                <button 
                                    className="edit-btn" 
                                    onClick={() => navigate(`/edit-product/${product.id}`)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDeleteProduct(product.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <PaginationComponent 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage} 
                    />
                )}
            </div>
        </Layout>
    );
}

export default ProductPage;
