import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
    
    static BASE_URL = "https://localhost:5050/api/";
    static ENCRYPTION_KEY = "jsc-inv-mgt-sys";

    //encrypt data using cryptoJS
    static encrypt(data) {
        return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY.toString());
    }

    //decrypt data using cryptoJs
    static decrypt(data) {
        const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY.toString());
        return bytes.toString(CryptoJS.enc.Utf8); //convert what has been decrypted to original string
    }

    //save token with Encryption
    static saveToken(token) {
        const encryptedToken = this.encrypt(token);
        localStorage.setItem("token", encryptedToken);
    }
    
    //save token with Encryption
    static saveToken(token) {
        const encryptedToken = this.encrypt(token);
        localStorage.setItem("token", encryptedToken);
    }

    //retrieve token
    static getToken() {
        const encryptedToken = localStorage.getItem("token");
        if(!encryptedToken) return null;
        return this.decrypt(encryptedToken);
    }

    //save role with Encryption
    static saveRole(role) {
        const encryptedRole = this.encrypt(role);
        localStorage.setItem("role", encryptedRole);
    }

    //retrieve role
    static getToken() {
        const encryptedRole = localStorage.getItem("role");
        if(!encryptedRole) return null;
        return this.decrypt(encryptedRole);
    }

    //user logs out
    static clearAuth() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    //HTTP call to validate HTTP REQ
    static getHeader() {
        const token = this.getToken();
        return {
            Authorization : `${token}` ,
            "Content-type" : "application/json"
        }
    }
    
    /** AUTH && USERS API */
    static async registerUser(registrationUserData) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registrationUserData);
        return response.data;
    }

    static async loginUser(loginUserData) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginUserData);
        return response.data;
    }

    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/users/all`, {
            headers : this.getHeader()
        });
        return response.data;
    }

    static async getUsersById(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/${userId}`, {
            headers : this.getHeader()
        });
        return response.data;
    }

    static async updateUser(userId, dataToUpdate) {
        const response = await axios.put(`${this.BASE_URL}/users/update/${userId}`, dataToUpdate, {
            headers : this.getHeader()
        });
        return response.data;
    }

    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
            headers : this.getHeader()
        });
        return response.data;
    }

    static async getLoggedInUserInfo() {
        const response = await axios.get(`${this.BASE_URL}/users/current`, {
            headers : this.getHeader()
        });
        return response.data;
    }

    /** PRODUCT ENDPOINTS */
    static async addProduct(formData) {

        const response = await axios.post(`${this.BASE_URL}/products/add`, formData, {
            headers : {
                ...this.getHeader(),
                "Content-type" : "multipart/form-data"
            }
        });

        return response.data;
    }

    static async getAllProducts() {
        const response = await axios.get(`${this.BASE_URL}/products/all`, {
            headers : this.getHeader()
        });
        return response.data;
    }

    static async getProductById (productId) {
        const response = await axios.get(`${this.BASE_URL}/products/${productId}`, {
            headers : this.getHeader()
        });
        return response.data;
    }

    static async updateProduct(formData) {
        
        const response = await axios.put(`${this.BASE_URL}/products/update`, formData, {
            headers : {
                ...this.getHeader(),
                "Content-type" : "multipart/form-data"
            }
        });

        return response.data;
    }

    static async deleteProduct(productId) {
        
        const response = await axios.delete(`${this.BASE_URL}/products/delete/${productId}`, {
            headers : this.getHeader()
        });

        return response.data;
    }

    static async searchProduct(searchValue) {
        const response = await axios.get(`${this.BASE_URL}/products/search`, {
            params : {searchValue}
        });
        return response.data;
    }

}