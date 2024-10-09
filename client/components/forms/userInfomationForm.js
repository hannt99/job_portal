'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import { UserAvatarContext } from '../appLayouts/defaultLayout';
import { usePathname } from 'next/navigation';

import FormData from 'form-data';
import { fullNameValidator, dropListValidator, phoneValidator } from '@/utils/formValidation';

import Loading from '@/components/common/loading';

import axios from 'axios';

import { success, error } from '@/utils/toastMessage';

const UserInfomationForm = () => {
    const pathname = usePathname();
    const [reRender, setReRender] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');

    const [fullName, setFullName] = useState('');
    const [isFullNameErr, setIsFullNameErr] = useState(false);
    const [fullNameErrMsg, setFullNameErrMsg] = useState({});

    const [gender, setGender] = useState('');
    const [isGenderErr, setIsGenderErr] = useState(false);
    const [genderErrMsg, setGenderErrMsg] = useState({});

    const [birthDate, setBirthDate] = useState('');

    const [avatar, setAvatar] = useState(false);
    const ref = useRef();
    const { isChangeUserAvatar, setIsChangeUserAvatar } = useContext(UserAvatarContext);

    const [phone, setPhone] = useState('');
    const [isPhoneErr, setIsPhoneErr] = useState(false);
    const [phoneErrMsg, setPhoneErrMsg] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/current-user`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setEmail(res?.data?.currentUser?.email);
                setFullName(res?.data?.currentUser?.fullName);
                setGender(res?.data?.currentUser?.gender);
                setBirthDate(res?.data?.currentUser?.birthDate);
                setAvatar(res?.data?.currentUser?.avatar);
                setPhone(res?.data?.currentUser?.phone);
                return;
            } catch (err) {
                console.log(`Error in fetchUser: ${err}`);
                return;
            }
        };

        fetchUser();
    }, [reRender]);

    const handleChangeAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('avatar', file);
        
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/change-avatar`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            ref.current.value = '';
            setIsChangeUserAvatar(!isChangeUserAvatar);
            setReRender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            console.log(`Error in handleChangeAvatar: ${err}`);
            return error(err?.response?.data?.message);
        }
    };

    const handleUpdateInfo = async () => {
        const isFullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        const isGenderValid = dropListValidator(gender, setIsGenderErr, setGenderErrMsg);
        const isPhoneValid = phoneValidator(phone, setIsPhoneErr, setPhoneErrMsg);

        if (!isFullNameValid || !isGenderValid || !isPhoneValid) return;

        setIsLoading(true);

        const data = {
            fullName,
            gender,
            birthDate,
            phone,
        };
        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            setIsLoading(false);
            setIsChangeUserAvatar(!isChangeUserAvatar);
            setReRender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            setIsLoading(false);
            return error(err?.response?.data?.message);
        }
    };

    return (
        <div className="rounded-lg bg-white p-7">
            <h2 className="border-l-4 border-red-600 pl-4 text-[1.8rem] font-semibold ">Thông tin cá nhân</h2>
            <div
                className={`${
                    pathname?.includes('/employer') ? 'grid' : 'block'
                } mt-10 grid-cols-1 md:grid-cols-2 gap-5`}
            >
                {(pathname?.includes('/employer') || pathname?.includes('/admin')) && (
                    <div className="flex items-center gap-5">
                        <div className="w-[45px] h-[45px] border border-black rounded-full">
                            <img src={avatar} alt="user avatar" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div>
                            <input
                                ref={ref}
                                type="file"
                                name="avatar"
                                id="avatar"
                                className="inputfile"
                                onChange={(e) => handleChangeAvatar(e)}
                            />
                            <label htmlFor="avatar" className="text-[1.5rem] font-medium cursor-pointer hover:underline">
                                Đổi avatar
                            </label>
                        </div>
                    </div>
                )}
                <div className="space-y-4">
                    <label className="text-[1.5rem] font-semibold">
                        Địa chỉ Email<span className="text-[1.8rem] text-red-600">*</span>
                    </label>
                    <div className="cursor-not-allowed">
                        <input
                            placeholder="name@example.com"
                            type="email"
                            value={email}
                            className="block w-full border rounded-lg bg-slate-200 px-5 py-3 text-[1.5rem] pointer-events-none"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                    <label className="text-[1.5rem] font-semibold">
                        Họ và tên<span className="text-[1.8rem] text-red-600">*</span>
                    </label>
                    <input
                        placeholder="Nguyen Văn A"
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
                <div className="space-y-4">
                    <label className="text-[1.5rem] font-semibold">
                        Giới tính<span className="text-[1.8rem] text-red-600">*</span>
                    </label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        onBlur={() => dropListValidator(gender, setIsGenderErr, setGenderErrMsg)}
                        className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                            isGenderErr ? 'border-red-600' : ''
                        }`}
                    >
                        <option value="">-- Giới tính --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                    <p className="text-[1.3rem] text-red-600">{genderErrMsg.gender}</p>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                    <label className="text-[1.5rem] font-semibold">Ngày sinh</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem]"
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[1.5rem] font-semibold">
                        Số điện thoại cá nhân<span className="text-[1.8rem] text-red-600">*</span>
                    </label>
                    <input
                        placeholder="0123456789"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={() => phoneValidator(phone, setIsPhoneErr, setPhoneErrMsg)}
                        className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                            isPhoneErr ? 'border-red-600' : ''
                        }`}
                    />
                    <p className="text-[1.3rem] text-red-600">{phoneErrMsg.phone}</p>
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleUpdateInfo}
                    className="mt-7 w-fit rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] px-16 py-3 flex items-center justify-center gap-3 font-medium text-white transition-all"
                >
                    {isLoading && <Loading />}
                    <span>Lưu</span>
                </button>
            </div>
        </div>
    );
};

export default UserInfomationForm;
