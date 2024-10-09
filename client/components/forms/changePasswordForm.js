'use client';

import { useState } from 'react';

import { passwordValidator } from '@/utils/formValidation';

import Loading from '@/components/common/loading';

import axios from 'axios';

import { success, error } from '@/utils/toastMessage';

const ChangePasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [isOldPasswordErr, setIsOldPasswordErr] = useState(false);
    const [oldPasswordErrMsg, setOldPasswordErrMsg] = useState({});

    const [newPassword, setNewPassword] = useState('');
    const [isNewPasswordErr, setIsNewPasswordErr] = useState(false);
    const [newPasswordErrMsg, setNewPasswordErrMsg] = useState({});

    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordErr, setIsConfirmPasswordErr] = useState(false);
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState({});

    const handleChangePassword = async () => {
        const isOldPasswordValid = passwordValidator(
            oldPassword,
            oldPassword,
            setIsOldPasswordErr,
            setOldPasswordErrMsg,
        );
        const isNewPasswordValid = passwordValidator(
            newPassword,
            newPassword,
            setIsNewPasswordErr,
            setNewPasswordErrMsg,
        );
        const isConfirmPasswordValid = passwordValidator(
            confirmPassword,
            newPassword,
            setIsConfirmPasswordErr,
            setConfirmPasswordErrMsg,
        );

        if (!isOldPasswordValid || !isNewPasswordValid || !isConfirmPasswordValid) return;

        setIsLoading(true);

        const data = {
            oldPassword,
            newPassword,
        };
        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/change-password`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsLoading(false);
            return success(res?.data?.message);
        } catch (err) {
            setIsLoading(false);
            return error(err?.response?.data?.message);
        }
    };

    return (
        <div className="p-7">
            <h2 className="border-l-4 border-red-600 pl-4 font-semibold text-[1.8rem]">Đổi mật khẩu</h2>
            <div className="mt-6 border p-5">
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3">
                    <label className="text-[1.5rem] font-semibold whitespace-nowrap">
                        Mật khẩu cũ<span className="text-[1.8rem] text-red-600">*</span>
                    </label>
                    <div className="md:col-span-2">
                        <input
                            placeholder="Mật khẩu cũ"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            onBlur={() =>
                                passwordValidator(oldPassword, oldPassword, setIsOldPasswordErr, setOldPasswordErrMsg)
                            }
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isOldPasswordErr ? 'border-red-600' : ''
                            }`}
                        />
                        <p className="text-[1.3rem] text-red-600">{oldPasswordErrMsg.oldPassword}</p>
                    </div>
                </div>
                <div className="mt-7 grid grid-cols-2 md:grid-cols-3">
                    <label className="text-[1.5rem] font-semibold whitespace-nowrap">
                        Mật khẩu mới<span className="text-[1.8rem] text-red-600">*</span>
                    </label>
                    <div className="md:col-span-2">
                        <input
                            placeholder="Mật khẩu mới"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onBlur={() =>
                                passwordValidator(newPassword, newPassword, setIsNewPasswordErr, setNewPasswordErrMsg)
                            }
                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                isNewPasswordErr ? 'border-red-600' : ''
                            }`}
                        />
                        <p className="text-[1.3rem] text-red-600">{newPasswordErrMsg.newPassword}</p>
                    </div>
                </div>
                <div className="mt-7 grid grid-cols-2 md:grid-cols-3">
                    <label className="text-[1.5rem] font-semibold whitespace-nowrap">
                        Xác nhận mật khẩu<span className="text-[1.8rem] text-red-600">*</span>
                    </label>
                    <div className="md:col-span-2">
                        <input
                            placeholder="Xác nhận mật khẩu"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() =>
                                passwordValidator(
                                    confirmPassword,
                                    newPassword,
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
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleChangePassword}
                        className="mt-7 w-fit rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] px-16 py-3 font-medium text-white flex items-center justify-center gap-3 transition-all"
                    >
                        {isLoading && <Loading />}
                        <span>Lưu</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ChangePasswordForm;
