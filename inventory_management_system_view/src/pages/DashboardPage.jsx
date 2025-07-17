import React, { useState, useEffect } from "react";
import ApiService from "../service/ApiService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer  } from "recharts";
import Layout from "../components/Layout";
import "../styles/Dashboard.css"

const DashboardPage = () => {
    const [ message, setMessage ] = useState('');
    const [ selectedMonth, setSelectedMonth ] = useState(new Date().getMonth() +1);
    const [ selectedYear, setSelectedYear ] = useState(new Date().getFullYear());
    const [ selectedData, setSelectedData ] = useState("amount");
    
    //stores and sets Transaction data for the formatted Chart
    const [ transactionData, setTransactionData ] = useState({});

    const showMessage =(msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    }
    
    useEffect(() => {
        const fetchData = async() => {
            try {
                const transactionDataResponse = await ApiService.getAllTransactions();
                if(transactionDataResponse.status === 200) {
                    setTransactionData(
                        transformTransactionData(
                            transactionDataResponse.transactionList,
                            selectedMonth,
                            selectedYear
                        )
                    )
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error displaying Chart: " + error
                );
            }
        }

        fetchData();
    }, [selectedMonth, selectedYear, selectedData]);

    const transformTransactionData = (transactions, month, year) => {
        const dailyData = {};

        //get number of days
        const daysInMonth = new Date(year, month, 0).getDate();

        //initialize each day in the month with default values
        for(let day = 1; day <= daysInMonth; day++) {
            dailyData[day] = {
                day,
                count: 0,
                quantity: 0,
                amount: 0
            };
        }

        //process each transaction to accumulate daily counts, quantity and amount
        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.createdAt);
            const transactionMonth = transactionDate.getMonth() + 1;
            const transactionYear = transactionDate.getFullYear();

            //if transaction date falls in month && year
            if(transactionMonth === month && transactionYear === year){
                const day = transactionDate.getDate();
                dailyData[day].count += 1;
                dailyData[day].quantity += transaction.totalProducts;
                dailyData[day].amount += transaction.totalPrice;
            }
        });

        //return daily object for chart
        return Object.values(dailyData);
    };

    //event handler for month change
    const handleMonthOnChange = (e) => {
        setSelectedMonth(parseInt(e.target.value, 10));
    }

    //event handler for year change
    const handleYearOnChange = (e) => {
        setSelectedYear(parseInt(e.target.value, 10));
    }

    return(
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="dashboard-page">
                {/* Display the buttons */}
                <div className="button-group">
                    <button className={selectedData === "count" ? "active" : ""} onClick={() => setSelectedData("count")}>
                        Total No of Transactions
                    </button>
                    <button className={selectedData === "quantity" ? "active" : ""} onClick={() => setSelectedData("quantity")}>
                        Product Quantity
                    </button>
                    <button className={selectedData === "amount" ? "active" : ""} onClick={() => setSelectedData("amount")}>
                        Amount
                    </button>
                </div>

                {/* Display selection */}
                <div className="dashboard-content">
                    <div className="filter-selection">
                        <label>Select Month</label>
                        <select id="month-select" value={selectedMonth} onChange={handleMonthOnChange}>
                            {Array.from({length:12}, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString("default", {month : "long"})}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="year-select">Select Year:</label>
                        <select id="year-select" value={selectedYear} onChange={handleYearOnChange}>
                            {Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return ( 
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Display the Chart */}
                    <div className="chart-section">
                        <div className="chart-container">
                            <h3>Daily Transactions</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={transactionData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="day" label={{value: "Day", position: "insideBottomRight", offset: -5}}/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line type={"monotone"}
                                    dataKey={selectedData}
                                    stroke="#008080"
                                    fillOpacity={0.3}
                                    fill="#008080"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default DashboardPage;
