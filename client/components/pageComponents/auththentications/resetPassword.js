'use client';

import { useState } from 'react';
import Link from 'next/link';

import { passwordValidator } from '@/utils/formValidation';

import Loading from '@/components/common/loading';
import axios from 'axios';

import { success, error } from '@/utils/toastMessage';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [isPasswordErr, setIsPasswordErr] = useState(false);
    const [passwordErrMsg, setPasswordErrMsg] = useState({});

    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordErr, setIsConfirmPasswordErr] = useState(false);
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const isPasswordValid = passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg);
        const isConfirmPasswordValid = passwordValidator(
            confirmPassword,
            password,
            setIsConfirmPasswordErr,
            setConfirmPasswordErrMsg,
        );

        if (!isPasswordValid || !isConfirmPasswordValid) return;

        setIsLoading(true);

        // let resetToken = localStorage.getItem('resetToken');
        let resetToken;
        // Check if window is defined (to avoid errors during server-side rendering)
        if (typeof window !== 'undefined') {
            // Get the URL parameters
            const urlParams = new URLSearchParams(window.location.search);

            // Get the value of the 'token' parameter
            resetToken = urlParams.get('token');
        }

        const data = {
            token: resetToken,
            password,
        };

        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, data);
            localStorage.removeItem('resetToken');
            setPassword('');
            setConfirmPassword('');
            setIsLoading(false);
            return success(res?.data?.message);
        } catch (err) {
            setIsLoading(false);
            return error(err?.response?.data?.message);
        }
    };

    return (
        <div className="relative z-50 w-[360px] md:w-[690px] lg:w-[925px] xl:w-[1120px] px-5 md:px-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <div className="w-full h-fit rounded-lg bg-white px-9 py-8">
                <div className="text-center text-[2.4rem] font-bold text-[var(--primary-color)] tracking-widest">
                    TimViecNhanh
                </div>
                <h1 className="my-7 text-[2rem] font-semibold">Đặt lại mật khẩu</h1>
                <form>
                    <div className="mt-7 space-y-4">
                        <label className="text-[1.5rem] font-semibold">
                            Mật khẩu mới<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <input
                            placeholder="Mật khẩu mới"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg)}
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isPasswordErr ? 'border-red-600' : ''
                            }`}
                        />
                        <p className="text-[1.3rem] text-red-600">{passwordErrMsg.newPassword}</p>
                    </div>
                    <div className="mt-7 space-y-4">
                        <label className="text-[1.5rem] font-semibold">
                            Xác nhận mật khẩu<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <input
                            placeholder="Xác nhận mật khẩu"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() =>
                                passwordValidator(
                                    confirmPassword,
                                    password,
                                    setIsConfirmPasswordErr,
                                    setConfirmPasswordErrMsg,
                                )
                            }
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isConfirmPasswordErr ? 'border-red-600' : ''
                            }`}
                        />
                        <p className="text-[1.3rem] text-red-600">{confirmPasswordErrMsg.confirmPassword}</p>
                    </div>
                    <button
                        onClick={handleResetPassword}
                        className="mt-7 w-full rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] py-3 font-medium text-white flex items-center justify-center gap-3 transition-all"
                    >
                        {isLoading && <Loading />}
                        <span>Đặt lại</span>
                    </button>
                </form>
                <Link
                    href="/signin"
                    className="block mt-7 text-right font-medium text-[#aaaaaa] hover:underline transition-all"
                >
                    Quay lại đăng nhập
                </Link>
                <div className="mt-12 text-center text-[1.5rem] font-medium text-[#aaaaaa]">
                    © 2024 TimViecNhanh. Designed by Christopher Wong.
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
