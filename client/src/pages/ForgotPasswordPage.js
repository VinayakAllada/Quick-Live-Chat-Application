import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
    const [data, setData] = useState({
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();
    const location = useLocation();

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

        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const FORGOT_PASSWORD_URL = `${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`;

        try {
            const response = await axios.post(FORGOT_PASSWORD_URL, {
                userId: location?.state?._id,
                password: data.password
            });
            toast.success(response.data.message);

            if (response.data.success) {
                setData({
                    password: "",
                    confirmPassword: ""
                });
                navigate("/email");
            }

        } catch (error) {
            const errorMessage = error?.response?.data?.error || "Error resetting password";
            toast.error(errorMessage);
            console.error("Error resetting password:", errorMessage);
        }
    };

    return (
        <div className='mt-5'>
            <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
                <h2 className='w-fit mx-auto'>Reset Password</h2>

                <form className='grid gap-4 mt-2' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='password'>New Password:</label>
                        <input
                            type='password'
                            id="password"
                            name="password"
                            placeholder='Enter your new password'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data.password}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor='confirmPassword'>Confirm Password:</label>
                        <input
                            type='password'
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder='Confirm your new password'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data.confirmPassword}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button
                        className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-3 font-bold text-white leading-relaxed tracking-wide'
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
