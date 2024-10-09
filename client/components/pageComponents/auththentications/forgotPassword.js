'use client';

import { useState } from 'react';
import Link from 'next/link';

import { emailValidator } from '@/utils/formValidation';

import Loading from '@/components/common/loading';
import axios from 'axios';

import { success, error } from '@/utils/toastMessage';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isEmailErr, setIsEmailErr] = useState(false);
    const [emailErrMsg, setEmailErrMsg] = useState({});
    
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMail = async (e) => {
        e.preventDefault();

        const isEmailValid = emailValidator(email, setIsEmailErr, setEmailErrMsg);

        if (!isEmailValid) return;

        setIsLoading(true);

        const data = {
            email,
        };
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, data);
            localStorage.setItem('resetToken', res?.data?.resetToken);
            setEmail('');
            setIsLoading(false);
            return success(res?.data?.message);
        } catch(err) {
            setIsLoading(false);
            return error(err?.response?.data?.message);
        }
    };

    return (
        <div className="z-50 relative w-[360px] md:w-[690px] lg:w-[925px] xl:w-[1120px] px-5 md:px-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <div className="w-full h-fit rounded-lg bg-white px-9 py-8">
                <div className="text-center text-[var(--primary-color)] text-[2.4rem] font-bold tracking-widest">
                    TimViecNhanh
                </div>
                <h1 className="my-7 text-[2rem] font-semibold">Quên mật khẩu</h1>
                <p className="mb-7 text-[#aaaaaa]">
                    Hãy điền địa chỉ email của bạn tại đây. Bạn sẽ nhận được liên kết để tạo mật khẩu mới qua email.
                </p>
                <form>
                    <div className="space-y-4">
                        <label className="text-[1.5rem] font-semibold">
                            Địa chỉ Email<span className="text-red-600 text-[1.8rem]">*</span>
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
                        <p className="text-red-600 text-[1.3rem]">{emailErrMsg.email}</p>
                    </div>
                    <button
                        onClick={handleSendMail}
                        className="mt-7 w-full rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] py-3 font-medium text-white flex items-center justify-center gap-3 transition-all"
                    >
                        {isLoading && <Loading />}
                        <span>Gửi</span>
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

export default ForgotPassword;
