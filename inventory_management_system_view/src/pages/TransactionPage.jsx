import React, { useState, useEffect } from "react";
import Layout from "../components/Layout"
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const TransactionPage = () => {
    const [ transaction, setTransaction ] = useState([]);
    const [ filter, setFilter ] = useState('');
    const [ valueToSearch, setValueToSearch ] = useState('');
    const [ message, setMessage ] = useState('');

    //pagination set-up
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(0);
    const itemsPerPage = 12;

    const showMessage =(msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    };

    useEffect(() => {
        const getTransactions = async() => {
            try {
                const transactionData = await ApiService.getAllTransactions(valueToSearch);

                if(transactionData.status === 200) {
                    setTotalPages(Math.ceil(transactionData.transactionList.length / itemsPerPage));

                    setTransaction(
                        transactionData.transactionList.slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                        )
                    )
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error getting Transactions: " + error
                );
            }
        };

        getTransactions();
    }, [currentPage, valueToSearch]);

    // todo handle Search method, navigate to Transaction details page, and return view
}

export default TransactionPage;
