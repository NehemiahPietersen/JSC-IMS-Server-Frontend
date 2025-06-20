import React from "react";
import SideBar from "./SideBar";

const Layout = ({page}) => {
    return(
        <div className="layout">
            <SideBar/>
            <div className="main-content">
                {page}
            </div>
        </div>
    );
};

export default Layout;