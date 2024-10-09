'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { fullNameValidator, emailValidator, passwordValidator } from '@/utils/formValidation';

import Loading from '@/components/common/loading';
import axios from 'axios';
import { socket } from '@/socket';

import { success, error } from '@/utils/toastMessage';

const RegisterCandidate = () => {
    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [isFullNameErr, setIsFullNameErr] = useState(false);
    const [fullNameErrMsg, setFullNameErrMsg] = useState({});
    
    const [email, setEmail] = useState('');
    const [isEmailErr, setIsEmailErr] = useState(false);
    const [emailErrMsg, setEmailErrMsg] = useState({});

    const [password, setPassword] = useState('');
    const [isPasswordErr, setIsPasswordErr] = useState(false);
    const [passwordErrMsg, setPasswordErrMsg] = useState({});

    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordErr, setIsConfirmPasswordErr] = useState(false);
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState({});

    const [isChecked, setIsChecked] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        const isFullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        const isEmailValid = emailValidator(email, setIsEmailErr, setEmailErrMsg);
        const isPasswordValid = passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg);
        const isConfirmPasswordValid = passwordValidator(
            confirmPassword,
            password,
            setIsConfirmPasswordErr,
            setConfirmPasswordErrMsg,
        );

        if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isChecked) return;

        setIsLoading(true);

        const data = {
            fullName,
            email,
            password,
            role: 1,
        };
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data);
            setFullName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setIsLoading(false);
            socket.emit('sendNotification', {
                receiverId: res?.data?.adminId,
            });
            success(res?.data?.message);
            return router.push('/signin');
        } catch (err) {
            setIsLoading(false);
            return error(err?.response?.data?.message);
        }
    };

    return (
        <div className="relative w-[360px] md:w-[690px] lg:w-[925px] xl:w-[1120px] px-5 md:px-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 z-50">
            <div className="w-full h-fit rounded-lg bg-white px-9 py-8">
                <div className="flex justify-center">
                    <div className="w-[160px] h-auto">
                        <img src="../assets/images/logo.png" alt="logo" className="w-full h-full" />
                    </div>
                </div>
                <h1 className="my-7 text-[2rem] font-semibold">Đăng ký</h1>
                <form>
                    <div className="space-y-4">
                        <label className="text-[1.5rem] font-semibold">
                            Họ và tên<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <input
                            placeholder="Han Nguyen"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onBlur={() => fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg)}
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isFullNameErr ? 'border-red-600' : ''
                            }`}
                        />
                        <p className="text-[1.3rem] text-red-600">{fullNameErrMsg.fullName}</p>
                    </div>
                    <div className="space-y-4 mt-7">
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
                    <div className="space-y-4 mt-7">
                        <label className="text-[1.5rem] font-semibold">
                            Mật khẩu<span className="text-[1.8rem] text-red-600">*</span>
                        </label>
                        <input
                            placeholder="Mật khẩu"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg)}
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isPasswordErr ? 'border-red-600' : ''
                            }`}
                        />
                        <p className="text-[1.3rem] text-red-600">{passwordErrMsg.password}</p>
                    </div>
                    <div className="space-y-4 mt-7">
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
                    <div className="my-9 space-x-3 flex items-start">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            className="accent-[var(--primary-color)] scale-125"
                        />
                        <label className="text-[1.5rem] leading-none">
                            Tôi đã đọc và đồng ý với{' '}
                            <Link href="#" className="text-[var(--primary-color)] font-medium">
                                Điều khoản dịch vụ
                            </Link>{' '}
                            và{' '}
                            <Link href="#" className="text-[var(--primary-color)] font-medium">
                                Chính sách bảo mật
                            </Link>{' '}
                            của TimViecNhanh
                        </label>
                    </div>
                    <button
                        onClick={handleRegister}
                        className={`w-full rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] py-3 text-white font-medium flex items-center justify-center gap-3 transition-all ${
                            !isChecked ? 'pointer-events-none opacity-40' : ''
                        }`}
                    >
                        {isLoading && <Loading />}
                        <span>Đăng ký</span>
                    </button>
                </form>
                <div className="mt-7 space-x-5 text-center">
                    <span className="text-[#aaaaaa] text-[1.5rem]">Bạn đã có tài khoản?</span>
                    <Link
                        href="/signin"
                        className="text-black hover:text-[var(--primary-color)] font-medium transition-all"
                    >
                        Đăng nhập
                    </Link>
                </div>
                <div className="mt-12 text-center text-[1.5rem] font-medium text-[#aaaaaa]">
                    © 2024 TimViecNhanh. Designed by Christopher Wong.
                </div>
            </div>
        </div>
    );
};

export default RegisterCandidate;
