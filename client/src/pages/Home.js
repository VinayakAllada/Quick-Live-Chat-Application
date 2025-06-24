import React, { useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { logout, setOnlineUser, setSocketConnection, setUser } from "../redux/userSlice"
import Sidebar from "../components/Sidebar"
import logo from "../assets/logo2.jpg"
import io from "socket.io-client";

const Home = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();

    const fetchUserDetails = async () => {
        try {
            const USER_DETAILS_URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
            const response = await axios({

                url: USER_DETAILS_URL,
                withCredentials: true
            })

            dispatch(setUser(response.data.data))

            if (response.data.data.logout) {
                dispatch(logout())
                navigate("/email")
            }

            // console.log("Current user details:", response)

        } catch (error) {
            console.log("Error:", error)
        }
    }
    useEffect(() => {
        fetchUserDetails()
    }, [])

    // Socket Connection
    useEffect(()=>{
        const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
            auth : {
                token : localStorage.getItem('token')
            }
        })

        socketConnection.on('onlineUser',(data)=>{
            // console.log("data",data)
            dispatch(setOnlineUser(data))
        })

        dispatch(setSocketConnection(socketConnection))

        return ()=>{
            socketConnection.disconnect()
        }

    },[])

    const basePath = location.pathname === "/"

    return (
        <div className="grid grid-cols-[300px,1fr] h-screen max-h-screen">
            <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
                <Sidebar />
            </section>

            <section className={`${basePath && 'hidden'}`}>
                <Outlet />
            </section>

            <div className={`justify-center items-center flex-col gap-2 lg-hidden ${!basePath ? "hidden" : "lg:flex"}`}>
                <div>
                   <img src={logo} width={200} alt="logo"/>
                </div>
                <p className="text-lg mt-2 text-slate-500">Select user to send message</p>
            </div>

        </div>
    )
}

export default Home