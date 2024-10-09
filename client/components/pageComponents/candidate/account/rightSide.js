'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import { UserAvatarContext } from '@/components/appLayouts/defaultLayout';
import { TbPhotoEdit } from 'react-icons/tb';
import { FaCircleCheck } from 'react-icons/fa6';
import axios from 'axios';
import { success, error } from '@/utils/toastMessage';

const RightSide = () => {
    const [reRender, setReRender] = useState(false);
    const ref = useRef();

    const [avatar, setAvatar] = useState('');
    const [fullName, setFullName] = useState('');
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [isJobSeeking, setIsJobSeeking] = useState(false);

    const { isChangeUserAvatar, setIsChangeUserAvatar } = useContext(UserAvatarContext);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/current-user`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setAvatar(res?.data?.currentUser?.avatar);
                setFullName(res?.data?.currentUser?.fullName);
                setIsProfileVisible(res?.data?.currentUser?.isAppeared);
                setIsJobSeeking(res?.data?.currentUser?.isSeeking);
                return;
            } catch (err) {
                console.log(`Error in fetchUser in RightSide: ${err}`);
                return;
            }
        };

        fetchUser();
    }, [reRender, isChangeUserAvatar]);

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
            console.log(`Error in handleChangeAvatar in RightSide: ${err}`);
            return error(err?.response?.data?.message);
        }
    };

    const handleChangeJobSeekingStatus = async (e) => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/change-job-seeking-status`,
                { isJobSeeking: e.target.checked },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                },
            );
            setReRender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            console.log(`Error in handleChangeJobSeekingStatus in RightSide: ${err}`);
            return;
        }
    };

    const handleChangeProfileVisibility = async (e) => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/change-profile-visibility`,
                { isProfileVisible: e.target.checked },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                },
            );
            setReRender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            console.log(`Error in handleChangeProfileVisibility in RightSide: ${err}`);
            return;
        }
    };

    return (
        <div className="space-y-5 w-full custom-shadow-v1 rounded-lg bg-white p-7">
            <div className="flex items-center gap-7">
                <div className="relative w-[85px] h-[85px] border border-black rounded-full">
                    <img src={avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    <div className="absolute bottom-0 right-0 rounded-full bg-[var(--primary-color)] p-2">
                        <input
                            ref={ref}
                            type="file"
                            name="avatar"
                            id="avatar"
                            className="inputfile"
                            onChange={(e) => handleChangeAvatar(e)}
                        />
                        <label
                            htmlFor="avatar"
                            className="text-[2rem] font-medium text-white cursor-pointer hover:underline"
                        >
                            <TbPhotoEdit />
                        </label>
                    </div>
                </div>
                <div className="flex-1">
                    <span className="text-[1.5rem]">Chào mừng trở lại,</span>
                    <h2 className="text-[1.8rem] font-semibold">{fullName}</h2>
                    <span className="rounded-md bg-[#808080] px-3 py-1.5 text-[1.1rem] text-white">
                        TÀI KHOẢN ĐÃ XÁC THỰC
                    </span>
                </div>
            </div>
            <hr></hr>
            <div className="space-y-5">
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isJobSeeking}
                        onChange={(e) => handleChangeJobSeekingStatus(e)}
                        className="sr-only peer"
                    />
                    <div className="relative w-20 h-10 rounded-full bg-gray-200    after:absolute after:top-[2px] after:start-[2px] after:w-9 after:h-9 after:border after:border-gray-300 after:rounded-full after:bg-white after:content-[''] after:transition-all    peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--secondary-color)] peer peer-checked:bg-[var(--primary-color)] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white"></div>
                    <span className={`ms-3 text-[1.5rem] font-semibold ${isJobSeeking ? 'text-black' : 'text-[#cccccc]'}`}>
                        Đang {isJobSeeking ? 'bật' : 'tắt'} tìm việc
                    </span>
                </label>
                <p className="text-[1.3rem]">
                    Bật tìm việc giúp hồ sơ của bạn nổi bật hơn và được chú ý nhiều hơn trong danh sách tìm kiếm của
                    NTD.
                </p>
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isProfileVisible}
                        onChange={(e) => handleChangeProfileVisibility(e)}
                        className="sr-only peer"
                    />
                    <div className="relative w-20 h-10 rounded-full bg-gray-200    after:absolute after:top-[2px] after:start-[2px] after:w-9 after:h-9 after:border after:border-gray-300 after:rounded-full after:bg-white after:content-[''] after:transition-all    peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--secondary-color)] peer peer-checked:bg-[var(--primary-color)] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white"></div>
                    <span
                        className={`ms-3 text-[1.5rem] font-semibold ${isProfileVisible ? 'text-black' : 'text-[#cccccc]'}`}
                    >
                        Cho phép NTD tìm kiếm hồ sơ
                    </span>
                </label>
                <p className="text-[1.5rem]">Khi có cơ hội việc làm phù hợp, NTD sẽ liên hệ và trao đổi với bạn qua:</p>
                <div className="space-y-2">
                    <p className="flex items-center gap-3">
                        <FaCircleCheck className="text-[var(--primary-color)]" />
                        <span className="text-[1.5rem]">Nhắn tin trực tiếp qua TimViecNhanh</span>
                    </p>
                    <p className="flex items-center gap-3">
                        <FaCircleCheck className="text-[var(--primary-color)]" />
                        <span className="text-[1.5rem]">Email và Số điện thoại của bạn</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RightSide;
