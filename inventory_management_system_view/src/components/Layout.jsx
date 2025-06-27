import React from "react";
import SideBar from "./SideBar";
import "../styles/Layout.css";

const Layout = ({ children }) => { 
    return (
        <div className="layout">
            <SideBar />
            <div className="main-content">
                {children} 
            </div>
        </div>
    );
};

export default Layout;