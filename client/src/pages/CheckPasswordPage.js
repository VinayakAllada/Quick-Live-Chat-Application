import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';

const CheckPasswordPage = () => {

    const [data, setData] = useState({
        password: ""
    });
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!location?.state?.name) {
            navigate('/email');
        }
    }, []);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const CHECK_PASSWORD_URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

        try {
            const response = await axios({
                method: 'post',
                url: CHECK_PASSWORD_URL,
                data: {
                    userId: location?.state?._id,
                    password: data.password
                },
                withCredentials: true
            });
            toast.success(response.data.message);

            if (response.data.success) {
                dispatch(setToken(response?.data?.token));
                localStorage.setItem('token', response?.data?.token);
                setData({
                    password: ""
                });
                navigate("/", { state: { _id: location?.state?._id, name: location?.state?.name, profile_pic: location?.state?.profile_pic } });
            }

        } catch (error) {
            toast.error(error?.response?.data?.message);
            console.log("error", error);
        }
    };

    return (
        <div className='mt-5'>
            <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
                <div className='w-fit mx-auto mb-2 flex justify-center flex-col'>
                    <Avatar
                        width={70}
                        height={70}
                        name={location?.state?.name}
                        imageUrl={location?.state?.profile_pic}
                    />
                </div>
                <h2 className='font-semibold text-lg mt-1 mx-auto w-fit'>{location?.state?.name}</h2>
                <h2 className='w-fit mx-auto'>Welcome to Quick Chat!</h2>

                <form className='grid gap-4 mt-2' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='password'>Password:</label>
                        <input
                            type='password'
                            id="password"
                            name="password"
                            placeholder='Enter your password'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data.password}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button
                        className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-3 font-bold text-white leading-relaxed tracking-wide'
                    >
                        Login
                    </button>
                </form>

                <p className='my-3 text-center'>
                    <Link to={"/forgot-password"} state={{ _id: location?.state?._id, name: location?.state?.name, profile_pic: location?.state?.profile_pic }} className='hover:text-primary font-semibold'>Forgot Password?</Link>
                </p>
            </div>
        </div>
    );
};

export default CheckPasswordPage;
