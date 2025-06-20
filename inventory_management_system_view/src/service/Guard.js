import React from "react";
import { Navigate, useLocation} from "react-router-dom";
import ApiService from "./ApiService";

// used to protect our authenticated route
export const ProtectedRoute =({element:Component}) => {
    const location = useLocation();
    return ApiService.isAuthenticated() ?  (
        Component
    ) : (
        <Navigate to={"/login"} replace state={{from: location}}/>
    );
};

// used to protect our Admin route
export const AdminRoute =({element:Component}) => {
    const location = useLocation();
    return ApiService.isAdmin() ?  (
        Component
    ) : (
        <Navigate to={"/login"} replace state={{from: location}}/>
    );
};
