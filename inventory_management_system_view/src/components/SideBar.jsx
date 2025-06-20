import React from "react";
import { Link } from 'react-router-dom';
import ApiService from '../service/ApiService';

const logout = () => {
    ApiService.logout();
}

const SideBar  = () => {
    const isAuth = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();

    return(
        <div className="sidebar">
            <h1 className="ims">JSC</h1>
            <ul className="nav-links">
                {isAuth && (
                    <li><link to="/dashboard">Dashboard</link></li>
                )}
                {isAdmin && (
                    <li><link to="/transactions">Transactions</link></li>
                )}
                {isAdmin && ( 
                    <li><link to="/category">Category</link></li>
                )}
                {isAdmin && ( 
                    <li><link to="/supplier">Supplier</link></li>
                )}
                {isAdmin && ( 
                    <li><link to="/product">Product</link></li>
                )}
                {isAuth && ( 
                    <li><link to="/purchase">Purchase</link></li>
                )}
                {isAuth && ( 
                    <li><link to="/sell">Sell</link></li>
                )}
                {isAuth && ( 
                    <li><link to="/profile">Profile</link></li>
                )}
                
                {isAuth && ( 
                    <li><link onClick={logout} to="/login">Logout</link></li>
                )}
            </ul>
        </div>
    )
};

export default SideBar;