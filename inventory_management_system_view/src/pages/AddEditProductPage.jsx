import React, { useState, useEffect } from "react";
import Layout from "../components/Layout"
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditProductPage = () => {
    const { productId } = useParams('');
    const [ name, setName ] = useState('');
    const [ sku, setSku ] = useState('');
    const [ price, setPrice ] = useState('');
    const [ stockQuantity, setStockQuantity ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ categoryId, setCategoryId ] = useState('');
    const [ imageFile, setImageFile ] = useState('');
    const [ imageUrl, setImageUrl ] = useState('');
    const [ categories, setCategories ] = useState([]);
    const [ isEditing, setIsEditing ] = useState(false);
    const [ message, setMessage ] = useState('');

    const navigate = useNavigate();

    const showMessage =(msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    }

    useEffect(() => {
        const fetchCategories = async() => {
            try {
                const response = await ApiService.getAllCategories();
                const categoryList = response.data?.categoryList || [];
                setCategories(categoryList);
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error getting Categories Array: " + error.message
                );
            }
        };

        const fetchProductById = async() => {
            if(productId) {
                setIsEditing(true);
                try {
                    const productData = await ApiService.getProductById(productId);

                    if(productData.status === 200) {
                        setName(productData.product.name);
                        setSku(productData.product.sku);
                        setPrice(productData.product.price);
                        setStockQuantity(productData.product.stockQuantity);
                        setDescription(productData.product.description);
                        setImageUrl(productData.product.imageUrl);
                        setCategoryId(productData.product.categoryId);
                        setName(productData.product.name);
                        //todo update date of change(s)
                        //todo add validations on price, quantity, files, etc.
                    }else{
                        showMessage(productData.message);
                    }
                    
                } catch (error) {
                    showMessage(
                        error.response?.data?.message || "Error updating Product: " + error
                    );
                }
            }
        };

        fetchCategories();
        if(productId) fetchProductById();
    }, [productId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file)
        const reader = new FileReader();
        reader.onloadend = () => setImageUrl(reader.result); //user imageUrl to preview the image to upload
        reader.readAsDataURL(file);
    }

    const handleOnSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("sku", sku);
        formData.append("price", price);
        formData.append("stockQuantity", stockQuantity);
        formData.append("categoryId", categoryId);
        formData.append("description", description);
        if(imageFile) {
            formData.append("imageFile", imageFile);
        }

        try {
            if(isEditing) {
                formData.append("productId", productId);
                await ApiService.updateProduct(formData);
                showMessage("Product Successfully Updated");
            } else {
                await ApiService.addProduct(formData);
                showMessage("Product Successfully Saved");
            }
            navigate("/product");
        } catch (error) {
            showMessage(
                error.response?.data?.message || "Error Saving Product: " + error
            );
        }
    };

    return(
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="product-form-page">
                <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>
                <form onSubmit={handleOnSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label>Sku</label>
                        <input type="text" value={sku} onChange={(e) => setSku(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label>Stock Quantity</label>
                        <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label>Category</label>

                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                        <option value="">Select a category</option>

                        {categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Product Image</label>
                        <input type="file" onChange={handleImageChange}/>
                        {imageUrl && (
                            <img src={imageUrl} className="image-preview" alt="Image-preview"/>
                        )}
                    </div>

                    <button type="submit">{isEditing ? "Update Product" : "Save New Product"}</button>
                </form>
            </div>
        </Layout>
    )

}

export default AddEditProductPage;
