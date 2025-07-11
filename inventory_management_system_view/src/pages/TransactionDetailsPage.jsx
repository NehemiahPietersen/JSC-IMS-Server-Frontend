import React, { useState, useEffect } from "react";
import Layout from "../components/Layout"
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import PaginationComponent from "../components/PaginationComponent";
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
                    </>
                )}

            </div>
        </Layout>
    )
}

export default TransactionDetailsPage;