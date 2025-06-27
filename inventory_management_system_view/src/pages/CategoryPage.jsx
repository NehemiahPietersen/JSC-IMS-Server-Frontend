import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";

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
    const fetchCategories = async () => {
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
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Add category
    const addCategory = async() => {
        if(!categoryName) {
            showMessage("Category name is needed");
            return;
        }

        try {
            await ApiService.createCategory({name: categoryName});
            showMessage("Category successfully added");
            setCategoryName("");
            fetchCategories(); // Refresh the list
        } catch (error) {
            showMessage(
                error.response?.data?.message || "Error adding category: " + error
            );
        }
    };

    // Edit category
    const editCategory = async() => {
        try {
            await ApiService.updateCategory(editingCategoryId, {name: categoryName});
            showMessage("Category successfully updated");
            setIsEditing(false);
            setCategoryName("");
            fetchCategories(); // Refresh the list
        } catch (error) {
            showMessage(
                error.response?.data?.message || "Error editing category: " + error
            );
        }
    }

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
                fetchCategories(); // Refresh the list
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error deleting category: " + error
                );
            }
        }
    }

    return(
        <Layout page={
            <div className="category-page">
                {message && <div className="message">{message}</div>}
                <div className="category-header">
                    <h1>Categories</h1>
                    <div className="add-cat">
                        <input 
                            type="text"
                            value={categoryName}
                            placeholder="Category Name"
                            onChange={(e) => setCategoryName(e.target.value)}
                        />

                        {!isEditing ? (
                            <button type="button" onClick={addCategory}>Add Category</button>
                        ) : (
                            <button type="button" onClick={editCategory}>Update Category</button>
                        )}
                    </div>
                </div>

                {categories.length > 0 && (
                    <ul className="category-list">
                        {categories.map((category) => (
                            <li className="category-item" key={category.id}>
                                <span>{category.name}</span>
                                <div className="category-actions">
                                    <button onClick={() => handleEditCategory(category)}>Edit</button>
                                    <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        } />
    )
}

export default CategoryPage;
