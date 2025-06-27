// import React, { useState, useEffect } from "react";
// import Layout from "../components/Layout";
// import ApiService from "../service/ApiService";
// import { useNavigate } from "react-router-dom";

// const SupplierPage = () => {
//     const [suppliers, setSuppliers] = useState([]);
//     const [message, setMessage] = useState([]);
//     const navigate = useNavigate();

//     const showMessage =(msg) => {
//         setMessage(msg);
//         setTimeout(() => {
//             setMessage("")
//         }, 4000);
//     }

//     useEffect(() => {
//         const getSuppliers = async() =>  {
//             try {
//                 const res = await ApiService.getAllSuppliers();
//                 if (res.status === 200) {
//                     setSuppliers(res.suppliers);
//                 } else {
//                     showMessage(res.message);
//                 }
//             } catch (error) {
//                 showMessage(
//                     error.response?.data?.message || "Error getting supplier: " + error
//                 );
//             }
//         }

//         getSuppliers();
//     });

//     //deleting a supplier
//     const handleDeleteSupplier = async(supplierId) => {
//         try {
//             if (window.confirm("Are you sure you want to delete this supplier?")) {
//                 await ApiService.deleteSupplier(supplierId);
//                 window.location.reload();
//             }
//         } catch (error) {
//             showMessage(
//                         error.response?.data?.message || "Error Deleting supplier: " + error
//                     );
//         }
//     }

//     return (
//         <Layout>
//             {message && <div className="message">{message}</div>}
//             <div className="supplier-page">
//                 <div className="supplier-header">
//                     <h1>Suppliers</h1>
//                     <div className="add-supp">
//                         <button onClick={() => navigate("/add-supplier")}>Add Supplier</button>
//                     </div>
//                 </div>
//             </div>

//             {suppliers &&
//             <ul className="supplier-list">
//                 {suppliers.map((supplier) => (
//                     <li className="supplier-item" key={supplier.id}>
//                         <span>{supplier.name}</span>
//                         <div className="supplier-actions">
//                             <button onClick={() => navigate(`/edit-supplier/${supplier.id}`)}>Edit</button>
//                             <button onClick={() => handleDeleteSupplier(supplier.id)}>Delete</button>
//                         </div>
//                     </li>
//                 ))}
//             </ul>}
//         </Layout>
//     )
// }

// export default SupplierPage;

/** TESTING */
import React, { useState, useEffect } from "react";
import ApiService from "../service/ApiService";

const SupplierPageTest = () => {
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ApiService.getAllSuppliers();
                console.log("TEST Response:", response);
                if (response && response.supplierList) {
                    setSuppliers(response.supplierList);
                }
            } catch (error) {
                console.error("TEST Error:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Suppliers Test Page</h1>
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                <h3>Raw Data:</h3>
                <pre>{JSON.stringify(suppliers, null, 2)}</pre>
            </div>

            {suppliers.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Supplier List:</h3>
                    <ul>
                        {suppliers.map(supplier => (
                            <li key={supplier.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #eee' }}>
                                {supplier.name} - {supplier.email}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SupplierPageTest;

