import React, { useState, useEffect } from "react";
import Layout from "../components/Layout"
import ApiService from "../service/ApiService";
import "../styles/Profile.css"

const ProfilePage = () => {
    const [ user, setUser ] = useState(null);
    const [ message, setMessage ] = useState('');

    const showMessage =(msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    };

    useEffect(() => {
        const fetchUserInfo = async() => {
            try {
                const userInfo = await ApiService.getLoggedInUserInfo();
                setUser(userInfo);
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error getting User Info: " + error
                )
            }
        }

        fetchUserInfo();
    }, []);

    return(
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="profile-page">
                {user && (
                    <div className="profile-card">
                        <h1>Welcome, {user.name} </h1>

                        {/* NAME */}
                        <div className="profile-info">
                            <div className="profile-item">
                                <label>Name: </label>
                                <span>{user.name}</span>
                            </div>

                            {/* EMAIL */}
                            <div className="profile-item">
                                <label>Email Address: </label>
                                <span>{user.email}</span>
                            </div>

                            {/* PHONE NUMBER */}
                            <div className="profile-item">
                                <label>Phone Number: </label>
                                <span>{user.contactNumber}</span>
                            </div>

                            {/* ROLE */}
                            <div className="profile-item">
                                <label>Role: </label>
                                <span className={`role-${user.role}`}>{user.role}</span>
                            </div>

                            {/* TODO: add change password field, set up only for ADMIN */}

                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )

}

export default ProfilePage;
