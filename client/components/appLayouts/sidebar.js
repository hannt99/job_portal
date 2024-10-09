'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { AiOutlineHome } from 'react-icons/ai';
import { IoCreateOutline, IoSettingsOutline } from 'react-icons/io5';
import { CiBoxList } from 'react-icons/ci';
import { MdOutlineRecommend } from 'react-icons/md';
import { IoPeopleOutline } from 'react-icons/io5';

const Sidebar = ({ setToggleSidebar }) => {
    const pathName = usePathname();

    return (
        <div className="flex flex-col w-full h-full custom-shadow-v1 select-none">
            <div className="flex justify-center pt-3">
                <a href="/" className="w-[160px] h-auto">
                    <img src="../../assets/images/logo.png" alt="logo" className="w-full h-full" />
                </a>
            </div>
            <div className="flex-1">
                {pathName?.includes('/employer') ? (
                    <ul className="flex flex-col gap-4 p-5 text-[1.4rem] font-medium text-[#888888]">
                        <li onClick={() => setToggleSidebar(false)}>
                            <Link
                                href={'/employer/dashboard'}
                                className={
                                    pathName === '/employer/dashboard'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <AiOutlineHome />
                                </span>
                                <span>Bảng tin</span>
                            </Link>
                        </li>
                        <li onClick={() => setToggleSidebar(false)}>
                            <Link
                                href={'/employer/create-job'}
                                className={
                                    pathName === '/employer/create-job'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <IoCreateOutline />
                                </span>
                                <span>Thêm việc làm mới</span>
                            </Link>
                        </li>
                        <li onClick={() => setToggleSidebar(false)}>
                            <Link
                                href={'/employer/manage-jobs'}
                                className={
                                    pathName === '/employer/manage-jobs'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <CiBoxList />
                                </span>
                                <span>Quản lý việc làm</span>
                            </Link>
                        </li>
                        <li onClick={() => setToggleSidebar(false)}>
                            <Link
                                href={'/employer/all-applicants/default'}
                                className={
                                    pathName === '/employer/all-applicants'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <IoPeopleOutline />
                                </span>
                                <span>Tất cả ứng viên</span>
                            </Link>
                        </li>
                        <li onClick={() => setToggleSidebar(false)}>
                            <Link
                                href={'/employer/recommendation'}
                                className={
                                    pathName === '/employer/recommendation'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <MdOutlineRecommend />
                                </span>
                                <span>Gợi ý ứng viên</span>
                            </Link>
                        </li>
                        <li onClick={() => setToggleSidebar(false)}>
                            <Link
                                href={'/employer/account/setting'}
                                className={
                                    pathName === '/employer/account/setting'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <IoSettingsOutline />
                                </span>
                                <span>Cài đặt tài khoản</span>
                            </Link>
                        </li>
                    </ul>
                ) : (
                    // Admin
                    <ul className="flex flex-col gap-4 p-5 text-[1.4rem] font-medium text-[#888888]">
                        <li>
                            <Link
                                href={'/admin/dashboard'}
                                className={
                                    pathName === '/admin/dashboard'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <AiOutlineHome />
                                </span>
                                <span>Bảng tin</span>
                            </Link>
                        </li>
                        <li onClick={() => setToggleSidebar(false)}>
                            <Link
                                href={'/admin/position-manage'}
                                className={
                                    pathName === '/admin/position-manage'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <IoCreateOutline />
                                </span>
                                <span>Quản lý vị trí tuyển dụng</span>
                            </Link>
                        </li>
                        <li onClick={() => setToggleSidebar(false)}>
                            <Link
                                href={'/admin/category-manage'}
                                className={
                                    pathName === '/admin/category-manage'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <CiBoxList />
                                </span>
                                <span>Quản lý ngành nghề</span>
                            </Link>
                        </li>
                        <li onClick={() => setToggleSidebar(false)}>
                            <Link
                                href={'/admin/skill-manage'}
                                className={
                                    pathName === '/admin/skill-manage'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <MdOutlineRecommend />
                                </span>
                                <span>Quản lý kỹ năng</span>
                            </Link>
                        </li>
                        <li onClick={() => setToggleSidebar(false)}>
                            <Link
                                href={'/admin/user-manage'}
                                className={
                                    pathName === '/admin/user-manage'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <IoPeopleOutline />
                                </span>
                                <span>Quản lý người dùng</span>
                            </Link>
                        </li>
                        <li onClick={() => setToggleSidebar(false)}>
                            <Link
                                href={'/admin/account/setting'}
                                className={
                                    pathName === '/admin/account/setting'
                                        ? 'rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5 text-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all duration-500'
                                        : 'rounded-lg                             hover:bg-[var(--secondary-color)] px-5 py-5 flex items-center gap-5                             hover:text-[var(--primary-color)] transition-all duration-500'
                                }
                            >
                                <span className="text-[2.4rem]">
                                    <IoSettingsOutline />
                                </span>
                                <span>Cài đặt tài khoản</span>
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
