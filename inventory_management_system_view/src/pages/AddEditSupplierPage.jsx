import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddEditProduct.css"

const AddEditSupplierPage = () => {
    const { supplierId } = useParams("");
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ contactNumber, setContactNumber ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ isEditing, setIsEditing ] = useState(false);
    
    const navigate = useNavigate();

    const showMessage =(msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    }


    useEffect(() => {
        if(supplierId) {
            setIsEditing(true);

            const fetchSupplier = async() => {
                try {
                    const res = await ApiService.getSupplierById(supplierId);
                    if(res.status === 200) {
                        setName(res.supplier.name)
                        setEmail(res.supplier.email)
                        setContactNumber(res.supplier.contactNumber)
                        setAddress(res.supplier.address)
                    }
                } catch (error) {
                    showMessage(
                        error.response?.data?.message || "Error getting Supplier by ID: " + error
                    );
                };
            };

            fetchSupplier();
        };
    }, [supplierId]);

    //handle form submission
    const handleSubmit = async(e) => {
        e.preventDefault();
        const supplierData = {name, email, contactNumber, address};
        try {
            if(isEditing) {
                await ApiService.updateSupplier(supplierId, supplierData);
                showMessage("Supplier Updated Successfully");
                navigate("/supplier");
            } else {
                await ApiService.addSupplier(supplierData);
                navigate("/supplier");
            }
        } catch (error) {
            showMessage(
                        error.response?.data?.message || "Error updating Supplier by ID: " + error
                    );
        }
    }

    return (
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="supplier-form-page">
                <h1>{isEditing ? "Edit Supplier" : "Add Supplier"}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Supplier Name</label>
                        <input value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        required />
                    </div>

                    <div className="form-group">
                        <label>Supplier Email Address</label>
                        <input value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        required />
                    </div>

                    <div className="form-group">
                        <label>Contact Info</label>
                        <input value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        type="text"
                        required />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"/>
                    </div>
                    <button type="submit">{isEditing ? "Edit Supplier" : "Add Supplier"}</button>
                </form>
            </div>
        </Layout>
    )
}

export default AddEditSupplierPage;
