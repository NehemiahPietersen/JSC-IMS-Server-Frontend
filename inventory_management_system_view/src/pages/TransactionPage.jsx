import React, { useState, useEffect } from "react";
import Layout from "../components/Layout"
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import PaginationComponent from "../components/PaginationComponent";
import "../styles/Transaction.css";

const TransactionPage = () => {
    const [ transactions, setTransaction ] = useState([]);
    const [ filter, setFilter ] = useState('');
    const [ valueToSearch, setValueToSearch ] = useState('');
    const [ message, setMessage ] = useState('');

    const navigate = useNavigate();

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

    //TODO add Client Table Row to know from whom and to who products where sold or bought -> Color code Transaction Statuses, add sort by

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

    //handleSearch
    const handleSearch = () => {
        // TODO fix transaction search - add client
        console.log("Search hit");
        setCurrentPage = 1;
        setValueToSearch(filter);
    }

    //Navigate to transaction details
    const navigateToTransactionsDetailsPage = (transactionId) => {
        navigate(`/transactions/${transactionId}`);
    }

    return (
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="transaction-page"> 
                <div className="transaction-header">
                    <h1>Transactions</h1>
                    <div className="transaction-search">
                        <input placeholder="Search Transactions..." 
                        value={filter} 
                        type="text" 
                        onChange={(e) => setFilter(e.target.value)}/>
                        <button onClick={() => handleSearch()}>Search</button>
                    </div>
                </div>


                { transactions &&
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>TYPE</th>
                                <th>STATUS</th>
                                <th>TOTAL PRICE</th>
                                <th># OF PRODUCTS</th>
                                <th>DATE</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.transactionType}</td>
                                    <td>{transaction.transactionStatus}</td>
                                    <td>{transaction.totalPrice}</td>
                                    <td>{transaction.totalProducts}</td>
                                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>

                                    <button className="transaction-button"
                                        onClick={() => navigateToTransactionsDetailsPage(transaction.id)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path d="M12 19c-7 0-11-8-11-8a18 18 0 0 1 22 0c0 0-4 8-11 8z"/>
                                        </svg>
                                        View Details
                                    </button>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>


            {totalPages > 1 && (
                <PaginationComponent 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage} 
                />
            )}
        </Layout>
    );

    
}

export default TransactionPage;
