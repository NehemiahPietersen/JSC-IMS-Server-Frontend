import React, { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import "../styles/Category.css"

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    }

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const res = await ApiService.getAllCategories();
            if(res.data.status === 200) {
                setCategories(res.data.categoryList);
            }
        } catch (error) {
            showMessage(
                error.response?.data?.message || "Error loading categories: " + error
            );
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Handle form submission (both add and edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!categoryName) {
            showMessage("Category name is needed");
            return;
        }

        try {
            if(isEditing) {
                await ApiService.updateCategory(editingCategoryId, {name: categoryName});
                showMessage("Category successfully updated");
            } else {
                await ApiService.createCategory({name: categoryName});
                showMessage("Category successfully added");
            }
            
            setCategoryName("");
            setIsEditing(false);
            setEditingCategoryId(null);
            fetchCategories();
        } catch (error) {
            showMessage(
                error.response?.data?.message || 
                `Error ${isEditing ? 'updating' : 'adding'} category: ` + error
            );
        }
    };

    // Handle edit button
    const handleEditCategory = (category) => {
        setIsEditing(true);
        setEditingCategoryId(category.id);
        setCategoryName(category.name);
    }

    // Delete category
    const handleDeleteCategory = async (categoryId) => {
        if(window.confirm("Are you sure you want to delete this category?")) {
            try {
                await ApiService.deleteCategory(categoryId);
                showMessage("Category successfully deleted");
                fetchCategories();
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error deleting category: " + error
                );
            }
        }
    }

    return (
        <Layout>
            <div className="category-page">
                {message && <div className="message">{message}</div>}
                
                <div className="category-header">
                    <h1>Categories</h1>
                    <form className="add-cat" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Enter category name"
                        />
                        <button type="submit">
                            {isEditing ? "Update Category" : "Add Category"}
                        </button>
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={() => {
                                    setIsEditing(false);
                                    setCategoryName("");
                                    setEditingCategoryId(null);
                                }}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                <ul className="category-list">
                    {categories.map((category) => (
                        <li key={category.id} className="category-item">
                            <span>{category.name}</span>
                            <div className="category-actions">
                                <button onClick={() => handleEditCategory(category)}>Edit</button>
                                <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
}

export default CategoryPage;