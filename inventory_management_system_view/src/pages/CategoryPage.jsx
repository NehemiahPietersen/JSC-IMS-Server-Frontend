import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";

const CategoryPage = () => {
    
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const showMessage =(msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    }

    //fetch categories from Backend service
    useEffect(() => {
        const getCategories = async() => {
            try {
                const res = await ApiService.getAllCategories();
                if(res.status === 200) {
                    setCategories(res.categories);
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error showing category: " + error
                );
            };
        };

        getCategories();
    }, []);

    //add category
    const addCategory = async() => {
        if(!categoryName) {
            showMessage("Category name is needed");
            return;
        }

        try {
            await ApiService.addCategory({name: categoryName});
            showMessage("Category Successfully added");
            setCategoryName(""); //clear input
            window.location.reload(); //reload page
        } catch (error) {
            showMessage(
                    error.response?.data?.message || "Error adding category: " + error
                );
        }
    };

    //edit category
    const editCategory = async() => {
        try {
            await ApiService.updateCategory(editingCategoryId, {name: categoryName});
            showMessage("Category Successfully Updated");
            setIsEditing(false);
            setCategoryName("");
            window.Location.reload();
        } catch (error) {
            showMessage(
                    error.response?.data?.message || "Error editing category: " + error
                );
        }
    }

    //button to call edit category method
    const handleEditCategory = (category) => {
        setIsEditing(true);
        setEditingCategoryId(category.id);
        setCategoryName(category.name);
    }

    //delete category
    const handleDeleteCategory = async (categoryId) => {
        if(window.confirm("Are you sure you want to delete this category?")) {
            try {
                await ApiService.deleteCategory(categoryId);
                showMessage("Category Successfully deleted");
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error deleting category: " + error
                );
            }
        }
    }

    return(
        <Layout>
            {message && <div className="message"></div>}
            <div className="category-page">
                <div className="category-header">
                    <h1>Categories</h1>
                    <div className="add-cat">
                        <input type="text"
                        value={categoryName}
                        placeholder="Category Name"
                        onChange={(e) => setCategoryName(e.target.value)}
                        />

                        {!isEditing ? (
                            <button type="button" onClick={addCategory}>Add Category</button>
                        ):(
                            <button type="button" onClick={editCategory}>Edit Category</button>
                        )}
                    </div>
                </div>

                { categories && 
                    <ul className="category-list">
                        {categories.map((category) => 1 (
                            <li className="category-item" key={category.id}>
                                <span>{category.name}</span>
                                
                                <div className="category-actions">
                                    <button onClick={() => handleEditCategory(category)}>Edit</button>
                                    <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                }
            </div>
        </Layout>
    )
}

export default CategoryPage;
