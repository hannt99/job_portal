'use client';

import { useState, useEffect, useContext } from 'react';
import { UserAvatarContext } from './defaultLayout';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { IoSearchOutline, IoHeartOutline, IoCheckboxOutline, IoDocumentText, IoNotifications } from 'react-icons/io5';
import { BsSuitcaseLg, BsFire } from 'react-icons/bs';
import { RiLockPasswordFill, RiLogoutBoxLine, RiArrowDropDownFill, RiShieldUserFill } from 'react-icons/ri';
import { TbWorldUpload } from 'react-icons/tb';
import { FaBars, FaXmark, FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import { PiBuildingThin } from 'react-icons/pi';

import CheckRoleRegister from '../common/checkRoleRegister';
import Notification from '../common/notification';

import checkAuth from '@/utils/checkAuth';

import axios from 'axios';

import { success, error } from '@/utils/toastMessage';

const Header = () => {
    const pathname = usePathname();
    const router = useRouter();

    // Check if window is defined and retrieve accessToken from localStorage
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // Check authentication status
    const authResult = checkAuth(accessToken);

    const [currUser, setCurrUser] = useState({});
    const { isChangeUserAvatar } = useContext(UserAvatarContext);
    useEffect(() => {
        if (authResult?.authenticated === false) return;
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/current-user`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                return setCurrUser(res?.data?.currentUser);
            } catch (err) {
                return error(err?.response?.data?.message);
            }
        };
        fetchUser();
    }, [isChangeUserAvatar]);

    const [navOpen, setNavOpen] = useState(false);
    useEffect(() => {
        navOpen ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'unset');
    }, [navOpen]);
    const [navUserOpen, setNavUserOpen] = useState(false);
    const [navJobOpen, setNavJobOpen] = useState(false);
    const [navCompanyOpen, setNavCompanyOpen] = useState(false);

    const [registerOpen, setRegisterOpen] = useState(false);
    useEffect(() => {
        registerOpen && (document.body.style.overflow = 'hidden');
        !registerOpen && (document.body.style.overflow = 'unset');
    }, [registerOpen]);

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                withCredentials: true,
            });
            // res?.data?.code == 200
            localStorage.clear();
            router.push('/signin');
            return success(res?.data?.message);
        } catch (err) {
            // res?.data?.code != 200
            return error('Đã xảy ra lỗi');
        }
    };

    return (
        <>
            <div className="w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] h-[60px] flex items-center justify-between px-5 md:px-0">
                <div className="h-full flex items-center gap-20">
                    <div className="w-auto h-full py-2">
                        <a href="/">
                            <img src="../assets/images/logo.png" alt="logo" className="w-full h-full" />
                        </a>
                    </div>
                    <ul className="h-full hidden lg:flex items-center text-[1.5rem] font-semibold tracking-wide">
                        <li className="group relative h-full">
                            <div
                                className={`h-full px-4 flex items-center hover:text-[var(--primary-color)] cursor-pointer transition-all ${
                                    pathname?.includes('/job') ? 'text-[var(--primary-color)]' : ''
                                }`}
                            >
                                Việc làm
                            </div>
                            <ul className="hidden group-hover:block z-[999] absolute top-[calc(100%-8px)] left-0 space-y-3 w-[400px] custom-shadow-v1 border-t-4 border-[var(--primary-hover-color)] rounded-lg bg-white text-[1.5rem] p-6 arrow-top">
                                <li
                                    className={`hover:text-[var(--primary-color)] ${
                                        pathname?.includes('/search-job') ? 'text-[var(--primary-color)]' : ''
                                    }`}
                                >
                                    <Link
                                        href="/job/search-job"
                                        className="rounded-lg bg-[var(--secondary-color)] p-5 flex items-center gap-5"
                                    >
                                        <IoSearchOutline className="text-[2rem] text-[var(--primary-color)]" />
                                        <span>Tìm việc làm</span>
                                    </Link>
                                </li>
                                {authResult?.authenticated === true && (
                                    <>
                                        <li>
                                            <hr></hr>
                                        </li>
                                        <li
                                            className={`hover:text-[var(--primary-color)] ${
                                                pathname?.includes('/applied-job') ? 'text-[var(--primary-color)]' : ''
                                            }`}
                                        >
                                            <Link
                                                href="/job/applied-job"
                                                className="rounded-lg bg-[var(--secondary-color)] p-5 flex items-center gap-5"
                                            >
                                                <BsSuitcaseLg className="text-[2rem] text-[var(--primary-color)]" />
                                                <span>Việc làm đã ứng tuyển</span>
                                                <BsFire className="text-[2rem] text-orange-600" />
                                            </Link>
                                        </li>
                                        <li
                                            className={`hover:text-[var(--primary-color)] ${
                                                pathname?.includes('/saved-job') ? 'text-[var(--primary-color)]' : ''
                                            }`}
                                        >
                                            <Link
                                                href="/job/saved-job"
                                                className="rounded-lg bg-[var(--secondary-color)] p-5 flex items-center gap-5"
                                            >
                                                <IoHeartOutline className="text-[2rem] text-[var(--primary-color)]" />
                                                <span>Việc làm đã lưu</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <hr></hr>
                                        </li>
                                        <li
                                            className={`hover:text-[var(--primary-color)] ${
                                                pathname?.includes('/recommend-job')
                                                    ? 'text-[var(--primary-color)]'
                                                    : ''
                                            }`}
                                        >
                                            <Link
                                                href="/job/recommend-job"
                                                className="rounded-lg bg-[var(--secondary-color)] p-5 flex items-center gap-5"
                                            >
                                                <IoCheckboxOutline className="text-[2rem] text-[var(--primary-color)]" />
                                                <span>Gợi ý việc làm</span>
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </li>
                        <li className="group relative h-full">
                            <div
                                className={`h-full px-4 flex items-center hover:text-[var(--primary-color)] cursor-pointer transition-all ${
                                    pathname?.includes('/company') ? 'text-[var(--primary-color)]' : ''
                                }`}
                            >
                                Công ty
                            </div>
                            <ul className="hidden group-hover:block z-[999] absolute top-[calc(100%-8px)] left-0 space-y-3 w-[400px] custom-shadow-v1 border-t-4 border-[var(--primary-hover-color)] rounded-lg bg-white text-[1.5rem] p-6 arrow-top">
                                <li
                                    className={`hover:text-[var(--primary-color)] ${
                                        pathname?.includes('/company-list') ? 'text-[var(--primary-color)]' : ''
                                    }`}
                                >
                                    <Link
                                        href="/company/company-list"
                                        className="rounded-lg bg-[var(--secondary-color)] p-5 flex items-center gap-5"
                                    >
                                        <IoSearchOutline className="text-[2rem] text-[var(--primary-color)]" />
                                        <span>Danh sách công ty</span>
                                    </Link>
                                </li>
                                {authResult?.authenticated === true && (
                                    <>
                                        <li>
                                            <hr></hr>
                                        </li>
                                        <li
                                            className={`hover:text-[var(--primary-color)] ${
                                                pathname?.includes('/followed-company')
                                                    ? 'text-[var(--primary-color)]'
                                                    : ''
                                            }`}
                                        >
                                            <Link
                                                href="/company/followed-company"
                                                className="rounded-lg bg-[var(--secondary-color)] p-5 flex items-center gap-5"
                                            >
                                                <PiBuildingThin className="text-[2rem] text-[var(--primary-color)]" />
                                                <span>Công ty đã theo dõi</span>
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </li>
                        {/* <li className="h-full">
                            <Link
                                href="#"
                                className="h-full px-4 flex items-center hover:text-[var(--primary-color)] transition-all"
                            >
                                Công cụ
                            </Link>
                        </li> */}
                    </ul>
                </div>
                <div className="flex items-center gap-3">
                    {authResult?.authenticated === true && <Notification />}
                    {authResult?.authenticated === false && (
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                href="/signin"
                                className="block rounded-full bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] px-7 py-3 text-[1.4rem] font-bold text-[var(--primary-color)] hover:text-white transition-all"
                            >
                                Đăng nhập
                            </Link>
                            <div
                                onClick={() => setRegisterOpen(true)}
                                className="rounded-full bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] px-7 py-3 text-[1.4rem] font-bold text-white cursor-pointer transition-all"
                            >
                                Đăng ký
                            </div>
                        </div>
                    )}
                    {authResult?.authenticated === true && (
                        <div className="hidden lg:flex items-center gap-10">
                            {authResult?.role === 0 && (
                                <Link
                                    href="/employer/dashboard"
                                    className="hidden md:block font-semibold text-[1.4rem] hover:underline"
                                >
                                    Đăng tuyển ngay
                                </Link>
                            )}
                            <div className="group relative flex items-center mr-4 cursor-pointer">
                                <div className="w-[40px] h-[40px] border border-black rounded-full">
                                    <img
                                        className="w-full h-full object-cover rounded-full"
                                        src={currUser?.avatar}
                                        alt="user avatar"
                                    />
                                </div>
                                <div className="text-[2.4rem]">
                                    <RiArrowDropDownFill />
                                </div>
                                <div className="hidden group-hover:block z-[999] absolute top-[100%] right-0 w-[300px] rounded-lg transition-all cursor-default">
                                    <ul className="bg-white shadow-md border border-[#cccccc]/30 rounded-lg pb-3">
                                        <li className="rounded-lg px-6 py-4">
                                            <Link
                                                href="/account/setting-user-information"
                                                className="block shadow-md border border-[#cccccc]/30 rounded-lg px-5"
                                            >
                                                <div className="w-full py-3 flex items-center gap-3">
                                                    <div className="w-[36px] h-[36px]">
                                                        <img
                                                            src={currUser?.avatar}
                                                            alt="user avatar"
                                                            className="w-full h-full border border-black rounded-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="max-w-[156px] truncate text-[1.3rem] font-semibold">
                                                        {currUser?.fullName}
                                                    </span>
                                                </div>
                                                <div className="border-t py-3 text-[1.3rem] font-semibold">
                                                    Xem thông tin cá nhân
                                                </div>
                                            </Link>
                                        </li>
                                        {authResult?.role === 0 && (
                                            <li className="block md:hidden">
                                                <Link
                                                    href="/employer/dashboard"
                                                    className="mx-3 rounded-lg hover:bg-[var(--secondary-color)] px-6 py-4 flex items-center gap-3 hover:text-[var(--primary-color)] cursor-pointer"
                                                >
                                                    <div className="w-[30px] h-[30px] rounded-full bg-[#cccccc]/50 flex">
                                                        <TbWorldUpload className="m-auto" />
                                                    </div>
                                                    <span className="whitespace-nowrap">Đăng tuyển ngay</span>
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <Link
                                                href="/account/cv-manage"
                                                className="mx-3 rounded-lg hover:bg-[var(--secondary-color)] px-6 py-4 flex items-center gap-3 hover:text-[var(--primary-color)] cursor-pointer"
                                            >
                                                <div className="w-[30px] h-[30px] rounded-full bg-[#cccccc]/50 flex">
                                                    <IoDocumentText className="m-auto" />
                                                </div>
                                                <span className="whitespace-nowrap">Quản lý CV</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/account/change-password"
                                                className="mx-3 rounded-lg hover:bg-[var(--secondary-color)] px-6 py-4 flex items-center gap-3 hover:text-[var(--primary-color)] cursor-pointer"
                                            >
                                                <div className="w-[30px] h-[30px] rounded-full bg-[#cccccc]/50 flex">
                                                    <RiLockPasswordFill className="m-auto" />
                                                </div>
                                                <span className="whitespace-nowrap">Đối mật khẩu</span>
                                            </Link>
                                        </li>
                                        <li
                                            onClick={handleLogout}
                                            className="mx-3 rounded-lg hover:bg-[var(--secondary-color)] px-6 py-4 flex items-center gap-3 hover:text-[var(--primary-color)] cursor-pointer"
                                        >
                                            <div className="w-[30px] h-[30px] rounded-full bg-[#cccccc]/50 flex">
                                                <RiLogoutBoxLine className="m-auto" />
                                            </div>
                                            <span className="whitespace-nowrap">Đăng xuất</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    <div
                        onClick={() => setNavOpen(true)}
                        className="block lg:hidden rounded-full bg-[var(--secondary-color)] p-3 text-[2.6rem] text-[var(--primary-color)]"
                    >
                        <FaBars />
                    </div>
                </div>
            </div>

            {/* Mobile nav */}
            <div
                onClick={() => setNavOpen(false)}
                className={!navOpen ? 'invisible' : 'fixed top-0 left-0 bottom-0 right-0 z-[999] bg-black/45'}
            >
                <ul
                    onClick={(e) => e.stopPropagation()}
                    className={
                        navOpen
                            ? 'absolute top-0 left-0       z-[999] w-[80%] md:w-[65%] overflow-auto h-screen shadow-md bg-white pt-10 text-[1.4rem] font-semibold text-[#808080] uppercase tracking-wider opacity-100 transition-all duration-700'
                            : 'absolute top-0 left-[-100%] z-[999] w-[80%] md:w-[65%] overflow-auto h-screen shadow-md bg-white pt-10 text-[1.4rem] font-semibold text-[#808080] uppercase tracking-wider opacity-0   transition-all duration-700'
                    }
                >
                    <li className="block lg:hidden">
                        {authResult?.authenticated === false && (
                            <div className="mb-5 flex items-center justify-center gap-3">
                                <Link
                                    href="/signin"
                                    className="block rounded-full bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] px-7 py-3 text-[1.4rem] font-bold text-[var(--primary-color)] hover:text-white transition-all"
                                >
                                    Đăng nhập
                                </Link>
                                <div
                                    onClick={() => setRegisterOpen(true)}
                                    className="rounded-full bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] px-7 py-3 text-[1.4rem] font-bold text-white cursor-pointer transition-all"
                                >
                                    Đăng ký
                                </div>
                            </div>
                        )}
                        {authResult?.authenticated === true && (
                            <div
                                onClick={() => setNavUserOpen(!navUserOpen)}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center gap-3 pl-10 py-7">
                                    <div className="w-[40px] h-[40px] border border-black rounded-full">
                                        <img
                                            className="w-full h-full object-cover rounded-full"
                                            src={currUser?.avatar}
                                            alt="user avatar"
                                        />
                                    </div>
                                    <p>
                                        <span className="block text-[var(--primary-color)]">{currUser?.fullName}</span>
                                        <span className="block lowercase font-medium text-[#808080] text-[1.4rem]">
                                            {currUser?.email}
                                        </span>
                                    </p>
                                </div>
                                <div className="text-[2rem] px-10 cursor-pointer">
                                    {!navUserOpen ? <FaAngleDown /> : <FaAngleUp />}
                                </div>
                            </div>
                        )}
                        <ul className={navUserOpen ? 'block' : 'hidden'}>
                            <li onClick={() => setNavOpen(false)}>
                                <Link
                                    href="/account/setting-user-information"
                                    className="flex items-center gap-3 px-6 py-4 hover:bg-[var(--secondary-color)] hover:text-[var(--primary-color)] rounded-lg mx-3 cursor-pointer"
                                >
                                    <div className="flex w-[30px] h-[30px] bg-[#cccccc]/50 rounded-full">
                                        <RiShieldUserFill className="m-auto" />
                                    </div>
                                    <span className="whitespace-nowrap">Xem thông tin cá nhân</span>
                                </Link>
                            </li>
                            {authResult?.role === 0 && (
                                <li className="block lg:hidden">
                                    <Link
                                        href="/employer/dashboard"
                                        className="flex items-center gap-3 px-6 py-4 hover:bg-[var(--secondary-color)] hover:text-[var(--primary-color)] rounded-lg mx-3 cursor-pointer"
                                    >
                                        <div className="flex w-[30px] h-[30px] bg-[#cccccc]/50 rounded-full">
                                            <TbWorldUpload className="m-auto" />
                                        </div>
                                        <span className="whitespace-nowrap">Đăng tuyển ngay</span>
                                    </Link>
                                </li>
                            )}
                            <li onClick={() => setNavOpen(false)}>
                                <Link
                                    href="/account/cv-manage"
                                    className="flex items-center gap-3 px-6 py-4 hover:bg-[var(--secondary-color)] hover:text-[var(--primary-color)] rounded-lg mx-3 cursor-pointer"
                                >
                                    <div className="flex w-[30px] h-[30px] bg-[#cccccc]/50 rounded-full">
                                        <IoDocumentText className="m-auto" />
                                    </div>
                                    <span className="whitespace-nowrap">Quản lý CV</span>
                                </Link>
                            </li>
                            <li onClick={() => setNavOpen(false)}>
                                <Link
                                    href="/account/change-password"
                                    className="flex items-center gap-3 px-6 py-4 hover:bg-[var(--secondary-color)] hover:text-[var(--primary-color)] rounded-lg mx-3 cursor-pointer"
                                >
                                    <div className="flex w-[30px] h-[30px] bg-[#cccccc]/50 rounded-full">
                                        <RiLockPasswordFill className="m-auto" />
                                    </div>
                                    <span className="whitespace-nowrap">Đối mật khẩu</span>
                                </Link>
                            </li>
                            <li
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-6 py-4 hover:bg-[var(--secondary-color)] hover:text-[var(--primary-color)] rounded-lg mx-3 cursor-pointer"
                            >
                                <div className="flex w-[30px] h-[30px] bg-[#cccccc]/50 rounded-full">
                                    <RiLogoutBoxLine className="m-auto" />
                                </div>
                                <span className="whitespace-nowrap">Đăng xuất</span>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <div
                            onClick={() => setNavJobOpen(!navJobOpen)}
                            className={`border-t border-[#cccccc]/[0.3] hover:text-[var(--primary-color)] flex items-center justify-between ${
                                pathname?.includes('/job') ? 'text-[var(--primary-color)]' : ''
                            }`}
                        >
                            <div className="py-7 pl-10 flex-1 cursor-pointer transition-all">Việc làm</div>
                            <div className="px-10  text-[2rem] cursor-pointer">
                                {!navJobOpen ? <FaAngleDown /> : <FaAngleUp />}
                            </div>
                        </div>
                        <ul className={navJobOpen ? 'block' : 'hidden'}>
                            <li
                                onClick={() => setNavOpen(false)}
                                className={`p-3 hover:text-[var(--primary-color)] ${
                                    pathname?.includes('/search-job') ? 'text-[var(--primary-color)]' : ''
                                }`}
                            >
                                <Link
                                    href="/job/search-job"
                                    className="rounded-lg bg-[var(--secondary-color)] p-5 flex items-center gap-5"
                                >
                                    <IoSearchOutline className="text-[2rem] text-[var(--primary-color)]" />
                                    <span>Tìm việc làm</span>
                                </Link>
                            </li>
                            {authResult?.authenticated === true && (
                                <>
                                    <li>
                                        <hr></hr>
                                    </li>
                                    <li
                                        onClick={() => setNavOpen(false)}
                                        className={`p-3 hover:text-[var(--primary-color)] ${
                                            pathname?.includes('/applied-job') ? 'text-[var(--primary-color)]' : ''
                                        }`}
                                    >
                                        <Link
                                            href="/job/applied-job"
                                            className="flex items-center gap-5 p-5 bg-[var(--secondary-color)] rounded-lg"
                                        >
                                            <BsSuitcaseLg className="text-[2rem] text-[var(--primary-color)]" />
                                            <span>Việc làm đã ứng tuyển</span>
                                            <BsFire className="text-[2rem] text-orange-600" />
                                        </Link>
                                    </li>
                                    <li
                                        onClick={() => setNavOpen(false)}
                                        className={`p-3 hover:text-[var(--primary-color)] ${
                                            pathname?.includes('/saved-job') ? 'text-[var(--primary-color)]' : ''
                                        }`}
                                    >
                                        <Link
                                            href="/job/saved-job"
                                            className="flex items-center gap-5 p-5 bg-[var(--secondary-color)] rounded-lg"
                                        >
                                            <IoHeartOutline className="text-[2rem] text-[var(--primary-color)]" />
                                            <span>Việc làm đã lưu</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <hr></hr>
                                    </li>
                                    <li
                                        onClick={() => setNavOpen(false)}
                                        className={`p-3 hover:text-[var(--primary-color)] ${
                                            pathname?.includes('/recommend-job') ? 'text-[var(--primary-color)]' : ''
                                        }`}
                                    >
                                        <Link
                                            href="/job/recommend-job"
                                            className="flex items-center gap-5 p-5 bg-[var(--secondary-color)] rounded-lg"
                                        >
                                            <IoCheckboxOutline className="text-[2rem] text-[var(--primary-color)]" />
                                            <span>Gợi ý việc làm</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </li>
                    <li>
                        <div
                            onClick={() => setNavCompanyOpen(!navCompanyOpen)}
                            className={`border-t border-[#cccccc]/[0.3] hover:text-[var(--primary-color)] flex items-center justify-between ${
                                pathname?.includes('/company') ? 'text-[var(--primary-color)]' : ''
                            }`}
                        >
                            <div className="pl-10 py-7 flex-1 cursor-pointer transition-all">Công ty</div>
                            <div className="px-10 text-[2rem] cursor-pointer">
                                {!navCompanyOpen ? <FaAngleDown /> : <FaAngleUp />}
                            </div>
                        </div>
                        <ul className={navCompanyOpen ? 'block' : 'hidden'}>
                            <li
                                onClick={() => setNavOpen(false)}
                                className={`p-3 hover:text-[var(--primary-color)] ${
                                    pathname?.includes('/company-list') ? 'text-[var(--primary-color)]' : ''
                                }`}
                            >
                                <Link
                                    href="/company/company-list"
                                    className="rounded-lg bg-[var(--secondary-color)] p-5 flex items-center gap-5"
                                >
                                    <IoSearchOutline className="text-[2rem] text-[var(--primary-color)]" />
                                    <span>Danh sách công ty</span>
                                </Link>
                            </li>
                            {authResult?.authenticated === true && (
                                <>
                                    <li>
                                        <hr></hr>
                                    </li>
                                    <li
                                        onClick={() => setNavOpen(false)}
                                        className={`p-3 hover:text-[var(--primary-color)] ${
                                            pathname?.includes('/followed-company') ? 'text-[var(--primary-color)]' : ''
                                        }`}
                                    >
                                        <Link
                                            href="/company/followed-company"
                                            className="flex items-center gap-5 p-5 bg-[var(--secondary-color)] rounded-lg"
                                        >
                                            <IoHeartOutline className="text-[2rem] text-[var(--primary-color)]" />
                                            <span>Công ty đã theo dõi</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </li>
                    {/* <li>
                        <Link
                            href="#"
                            className="block border-t border-[#cccccc]/[0.3] px-10 py-7 hover:text-[var(--primary-color)] transition-all"
                        >
                            Công cụ
                        </Link>
                    </li> */}
                </ul>
                <div className="absolute top-0 right-0 p-5 text-[3rem] text-[#cccccc] cursor-pointer">
                    <FaXmark />
                </div>
            </div>
            {/* End */}
            {registerOpen && <CheckRoleRegister setRegisterOpen={setRegisterOpen} />}
        </>
    );
};

export default Header;
