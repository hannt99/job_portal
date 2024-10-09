'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import CheckRoleRegister from '@/components/common/checkRoleRegister';

import { emailValidator, passwordValidator } from '@/utils/formValidation';

import Loading from '@/components/common/loading';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { success, error } from '@/utils/toastMessage';

const Signin = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [isEmailErr, setIsEmailErr] = useState(false);
    const [emailErrMsg, setEmailErrMsg] = useState({});

    const [password, setPassword] = useState('');
    const [isPasswordErr, setIsPasswordErr] = useState(false);
    const [passwordErrMsg, setPasswordErrMsg] = useState({});

    const [registerOpen, setRegisterOpen] = useState(false);
    useEffect(() => {
        registerOpen && (document.body.style.overflow = 'hidden');
        !registerOpen && (document.body.style.overflow = 'unset');
    }, [registerOpen]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSignin = async (e) => {
        e.preventDefault();

        const isEmailValid = emailValidator(email, setIsEmailErr, setEmailErrMsg);
        const isPasswordValid = passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg);

        if (!isEmailValid || !isPasswordValid) return;

        setIsLoading(true);

        const data = {
            email,
            password,
        };
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, data, {
                withCredentials: true,
            });
            setEmail('');
            setPassword('');
            const decodedToken = jwtDecode(res?.data?.accessToken);
            localStorage.setItem('accessToken', res?.data?.accessToken);
            localStorage.setItem('userId', decodedToken?._id);
            setIsLoading(false);
            success(res?.data?.message);
            if (decodedToken?.role === 2) {
                return router.push('/admin/dashboard');
            } else {
                return router.push('/');
            }
        } catch(err) {
            setIsLoading(false);
            return error(err?.response?.data?.message);
        }
    };

    return (
        <>
            <div className="relative w-[360px] md:w-[690px] lg:w-[925px] xl:w-[1120px] px-5 md:px-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 z-50">
                <div className="w-full h-fit rounded-lg bg-white px-9 py-8">
                    <div className="flex justify-center">
                        <div className="w-[160px] h-auto">
                            <img src="../assets/images/logo.png" alt="logo" className="w-full h-full" />
                        </div>
                    </div>
                    <h1 className="my-7 text-[2rem] font-semibold">Đăng nhập</h1>
                    <form>
                        <div className="space-y-4">
                            <label className="text-[1.5rem] font-semibold">
                                Địa chỉ Email<span className="text-[1.8rem] text-red-600">*</span>
                            </label>
                            <input
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => emailValidator(email, setIsEmailErr, setEmailErrMsg)}
                                className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                    isEmailErr ? 'border-red-600' : ''
                                }`}
                            />
                            <p className="text-[1.3rem] text-red-600">{emailErrMsg.email}</p>
                        </div>
                        <div className="mt-7 space-y-4">
                            <label className="text-[1.5rem] font-semibold">
                                Mật khẩu<span className="text-[1.8rem] text-red-600">*</span>
                            </label>
                            <input
                                placeholder="Mật khẩu"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() =>
                                    passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg)
                                }
                                className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                    isPasswordErr ? 'border-red-600' : ''
                                }`}
                            />
                            <p className="text-[1.3rem] text-red-600">{passwordErrMsg.password}</p>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="block w-full my-5 text-right text-[1.5rem] font-medium text-[#aaaaaa] hover:text-[var(--primary-color)] transition-all"
                        >
                            Quên mật khẩu?
                        </Link>
                        <button
                            onClick={handleSignin}
                            className="w-full rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] py-3 font-medium text-white flex items-center justify-center gap-3 transition-all"
                        >
                            {isLoading && <Loading />}
                            <span>Đăng nhập</span>
                        </button>
                    </form>
                    <div className="mt-7 space-x-5 text-center">
                        <span className="text-[1.5rem] text-[#aaaaaa]">Bạn chưa có tài khoản?</span>
                        <div
                            onClick={() => setRegisterOpen(true)}
                            className="inline font-medium text-black hover:text-[var(--primary-color)] cursor-pointer transition-all"
                        >
                            Đăng ký
                        </div>
                    </div>
                    <div className="mt-12 text-center text-[1.5rem] font-medium text-[#aaaaaa]">
                        © 2024 TimViecNhanh. Designed by Christopher Wong.
                    </div>
                </div>
            </div>
            {registerOpen && <CheckRoleRegister setRegisterOpen={setRegisterOpen} />}
        </>
    );
};

export default Signin;
