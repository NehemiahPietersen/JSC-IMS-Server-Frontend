import React, { useState, useEffect } from "react";
import Layout from "../components/Layout"
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Transaction.css";

const TransactionDetailsPage = () => {
    const { transactionId } = useParams();
    const [ transaction, setTransaction ] = useState(null);
    const [ status, setStatus ] = useState("");
    const [ message, setMessage ] = useState("");

    const navigate = useNavigate();

    const showMessage =(msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    };

    useEffect(() => {
        const getTransaction = async() => {
            try {
                const transactionData = await ApiService.getTransactionById(transactionId);

                if(transactionData.status === 200) {
                    setTransaction(transactionData.transaction);
                    setStatus(transactionData.transaction.status);
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error getting Transaction: " + error
                );
            }
        };

        getTransaction();
    }, [transactionId]);

    //update Transaction Status
    const handleTransactionStatusUpdate = async() => {
        try {
            ApiService.updateTransactionStatus(transactionId, status);
            navigate("/transactions");
        } catch (error) {
            showMessage(
                    error.response?.data?.message || "Error updating Transaction: " + error
                );
        }
    };
    
    return(
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="transaction-details-page">
                {transaction && (
                    <>
                        <div className="section-card">
                            <h2>Transaction Information</h2>
                            <p>Type: {transaction.transactionType}</p>
                            <p>Status: {transaction.transactionStatus}</p>
                            <p>Description: {transaction.description}</p>
                            <p>Note: {transaction.note}</p>
                            <p>Total Products: {transaction.totalProducts}</p>
                            <p>Total Price: {transaction.totalPrice.toFixed(2)}</p>
                            <p>Create Date: {new Date(transaction.createdAt).toLocaleString()}</p>

                            {transaction.updatedAt && (
                                <p>Updated At: {new Date(transaction.updatedAt).toLocaleString()}</p>
                            )}
                        </div>

                        {/* Product information in the Transaction */}
                        <div className="section-card">
                            <h2>Product Information</h2>
                            <p>Product Name: {transaction.products.name}</p>
                            <p>SKU: {transaction.products.sku}</p>
                            <p>Price: {transaction.products.price}</p>
                            <p>Description: {transaction.products.description}</p>
                            <p>Stock Quantity: {transaction.products.stockQuantity}</p>

                            {/* TODO: Maybe Add Category to this screen? */}
                        </div>

                        {/* Supplier Information in the Transaction, if there is a supplier */}
                        {transaction.supplier && (
                            <div className="section-card">
                                <h2>Supplier Information</h2>
                                <p>Supplier Name: {transaction.supplier.name}</p>
                                <p>Contact Number: {transaction.products.contactNumber}</p>
                                <p>Email Address: {transaction.products.email}</p>
                            </div>
                        )}

                        {/* User Information in the Transaction */}
                        <div className="section-card">
                            <h2>User Information</h2>
                            <p>Name: {transaction.user.name}</p>
                            <p>Contact Number: {transaction.user.contactNumber}</p>
                            <p>Email Address: {transaction.user.email}</p>
                            <p>Create Date: {new Date(transaction.user.createdAt).toLocaleString()}</p>
                        </div>

                        {/* call update Transaction Status */}
                        <div class="section-card transaction-status-update">
                            <label>Status:</label>
                            <select value={status}
                            onChange={(e) => setStatus(e.target.value)}>
                                <option value="PENDING">Pending</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            <button onClick={() => handleTransactionStatusUpdate()}>Update Status</button>
                        </div>
                    </>
                )}

            </div>
        </Layout>
    )
}

export default TransactionDetailsPage;