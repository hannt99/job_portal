'use client';

import { useState, useEffect, useContext } from 'react';
import { UserAvatarContext } from './defaultLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { IoHomeSharp } from 'react-icons/io5';
import { RiArrowDropDownFill, RiLogoutBoxLine  } from 'react-icons/ri';

import Notification from '../common/notification';

import checkAuth from '@/utils/checkAuth';

import axios from 'axios';

import { success, error } from '@/utils/toastMessage';

const HeaderXSidebar = () => {
    const router = useRouter();

    // Check if window is defined and retrieve accessToken from localStorage
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // Check authentication status
    const authResult = checkAuth(accessToken);

    const [currUser, setCurrUser] = useState({});
    const { isChangeUserAvatar } = useContext(UserAvatarContext);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/current-user`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                return setCurrUser(res?.data?.currentUser);
            } catch (err) {
                return error(err?.response?.data?.message);
            }
        };
        fetchUser();
    }, [isChangeUserAvatar]);

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                withCredentials: true,
            });
            localStorage.clear();
            success(res?.data?.message);
            return router.push('/signin');
        } catch (err) {
            return error('Đã xảy ra lỗi');
        }
    };

    return (
        <>
            <div className="w-full min-h-[60px] border bg-white flex items-center justify-between">
                <div></div>
                <div className="flex items-center gap-8">
                    <Notification />
                    <div className="group relative mr-4 flex items-center cursor-pointer">
                        <div className="w-[40px] h-[40px] rounded-full">
                            <img
                                className="w-full h-full rounded-full object-cover"
                                src={currUser?.avatar}
                                alt="user avatar"
                            />
                        </div>
                        <div className="text-[2.4rem]">
                            <RiArrowDropDownFill />
                        </div>
                        <div className="absolute top-[100%] right-0 w-[70px] h-5"></div>
                        <div className="hidden group-hover:block z-[999] absolute top-[100%] right-0 mt-5 w-[200px] shadow-lg rounded-lg transition-all cursor-default">
                            {authResult?.role !== 2 && (
                                <Link
                                    href="/"
                                    className="rounded-t-lg bg-white hover:bg-[var(--secondary-color)] px-6 py-4 flex items-center gap-3 cursor-pointer"
                                >
                                    <div className="w-[30px] h-[30px] rounded-full bg-[#cccccc]/50 flex">
                                        <IoHomeSharp className="m-auto" />
                                    </div>
                                    <span className="whitespace-nowrap">Về trang chủ</span>
                                </Link>
                            )}
                            <div
                                onClick={handleLogout}
                                className="border-t rounded-b-lg bg-white hover:bg-[var(--secondary-color)] px-6 py-4 flex items-center gap-3 cursor-pointer"
                            >
                                <div className="w-[30px] h-[30px] rounded-full bg-[#cccccc]/50 flex">
                                    <RiLogoutBoxLine className="m-auto" />
                                </div>
                                <span className="whitespace-nowrap">Đăng xuất</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderXSidebar;
