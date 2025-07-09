import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";

const SellPage = () => {
    const [ products, setProducts ] = useState([]); 
    const [ productId, setProductId ] = useState(''); 
    const [ description, setDescription ] = useState(''); 
    const [ note, setNote ] = useState(''); 
    const [ quantity, setQuantity ] = useState(''); 
    const [ message, setMessage ] = useState(''); 

    const showMessage =(msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    };

    const resetForm = () => {
        setProductId("");
        setQuantity("");
        setDescription("");
        setNote("");
    }

    useEffect(() => {
        const fetchProducts = async() => {
            try {
                const productData = await ApiService.getAllProducts();
                setProducts(productData.productList);
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error getting Products: " + error
                );
            }
        };

        fetchProducts();
    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!productId || !quantity) {
            showMessage("Please fill in the required fields");
            return;
        }

        const body = {
            productId,
            quantity: parseInt(quantity),
            description,
            note
        };

        try {
            const response = await ApiService.sellProduct(body);
            showMessage(response.message);
            resetForm();
        } catch (error) {
            showMessage(
                error.response?.data?.message || "Error selling Products: " + error
            );
        }
    };

    return(
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="sell-form-page">
                <h1>Sell Inventory</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Product</label>
                        <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
                            <option value="">Select a product</option>
                            {products?.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Stock Quantity</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required/>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Note</label>
                        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
                    </div>

                    <button type="submit">Sell Products</button>
                </form>
            </div>
        </Layout>
    )
}

export default SellPage;