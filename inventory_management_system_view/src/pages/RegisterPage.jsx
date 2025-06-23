import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

const RegisterPage = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [message, setMessage] = useState('')

    const navigate = useNavigate(); //instance of Navigate

    const handleRegister = async(e) => {
        e.preventDefault();
        try {
            const registerData = {name:name, email:email, password:password, contactNumber:contactNumber};
            await ApiService.registerUser(registerData);
            setMessage("Registration completed successfully");
            navigate("/login");
        } catch (error) {
            showMessage(error.response?.data?.message || "Error registering the user. " + error)
            console.log("ERROR: " + error);
        }
    }

    const showMessage =(msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    }

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleRegister}>
                <input type="text"
                placeholder="Name"
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required />

                <input type="text"
                placeholder="Email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required />

                <input type="text"
                placeholder="Contact Number"
                value={contactNumber} 
                onChange={(e) => setContactNumber(e.target.value)}
                required />

                <input type="text"
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required />

                <button type="submit">Register</button>
            </form>

            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    )
};

export default RegisterPage;
