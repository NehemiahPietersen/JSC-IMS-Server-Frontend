import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminRoute, ProtectedRoute } from "./service/Guard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>

        {/* ADMIN ROUTES */}
        <Route path="/category" element={<AdminRoute element={<CategoryPage/>}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
