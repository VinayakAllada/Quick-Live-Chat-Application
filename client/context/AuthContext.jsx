//It refers to a context object that is used to manage authentication
//state and provide authentication-related functions throughout a React application.
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast'
import {io} from 'socket.io-client'

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser ] = useState(null);
    const [onlineUsers, setOnlineUsers ] = useState([]);
    const [socket, setSocket ] = useState(null);


    // Check if user is authenticated and if so, set the user data and 
    // connect the socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get('/api/auth/check');
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            } else {
                setAuthUser(null);
                setToken(null);
                localStorage.removeItem('token');
                if (socket) socket.disconnect();
            }
        } catch (error) {
            setAuthUser(null);
            setToken(null);
            localStorage.removeItem('token');
            if (socket) socket.disconnect();
            toast.error("Session expired. Please login again.");
        }
    };

    // Login function to handle user authentication and socket connection

    const login = async (state, credentials) => {
        try{
            const {data} = await axios.post(`/api/auth/${state}`, credentials)
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common['token'] = data.token;
                setToken(data.token);
                localStorage.setItem('token', data.token);
                toast.success(data.message);
            }
            else{
            toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }


    // Logout function to handle user logout and socket disconnection

    const logout = async () => {
        localStorage.removeItem('token');
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common['token'] = null;
        toast.success('Logged out successfully');
        if (socket) socket.disconnect();

    }


    // Update profile function to handle user profile updates

    const updateProfile = async (body) => {
        try{
            const {data} = await axios.put('/api/auth/update-profile', body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully")
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    // Connect socket function to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if (!userData) return;
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        const newSocket = io(backendURL, {
            query: {
                userId: userData._id,
            }
        });
        setSocket(newSocket);

        newSocket.on('getOnlineUsers', (userIds) => {
            setOnlineUsers(userIds);
            console.log("Received online users:", userIds);
        });
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['token'] = token;
        }
        checkAuth();

        // Cleanup socket on unmount
        return () => {
            if (socket) socket.disconnect();
        };
        // eslint-disable-next-line
    }, []);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}