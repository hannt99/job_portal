'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import DragAndDropFile from '@/components/common/dragAndDropFile';
import RightSide from './rightSide';

import { FacebookShareButton, FacebookIcon } from 'next-share';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import axios from 'axios';

import { error, success } from '@/utils/toastMessage';

const CvManage = () => {
    const [reRender, setReRender] = useState(false);

    const [cvs, setCvs] = useState([]);
    useEffect(() => {
        const fetchCV = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resume/get-all-cv`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                return setCvs(res?.data?.cvs);
            } catch (err) {
                console.log('Error in fetchCV:', err?.response?.data.message);
                return;
            }
        };

        fetchCV();
    }, [reRender]);

    const setMainCV = async (filename) => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/resume/set-main-cv`,
                { filename },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                },
            );
            setReRender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            console.log('Error in setMainCV:', err?.response?.data.message);
            return;
        }
    };

    const handleDeleteCV = async (filename) => {
        const confirmMsg = `Bạn có chắc muốn xóa vĩnh viễn CV này không?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/resume/delete-cv`,
                { filename },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                },
            );
            setReRender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            return error(err?.response?.data?.message);
        }
    };

    return (
        <>
            <div className="w-full px-5 md:px-0 flex justify-center">
                <nav
                    className="mt-5 w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] custom-shadow-v1 rounded-lg bg-[var(--secondary-color)] px-7 py-5 flex"
                    aria-label="Breadcrumb"
                >
                    <ol className="inline-flex space-x-1 md:space-x-3 flex-wrap items-center">
                        <li className="inline-flex items-center">
                            <Link
                                href="/"
                                className="inline-flex items-center text-[1.5rem] font-normal text-[var(--primary-color)]"
                            >
                                <svg
                                    className="mr-2.5 w-5 h-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                </svg>
                                Trang chủ
                            </Link>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg
                                    className="mx-1 w-3 h-3 text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                                <span className="ml-1 md:ml-2 text-[1.5rem] font-normal text-[#808080]">Quản lí CV</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] px-5 md:px-0 py-10 grid grid-cols-1 lg:grid-cols-6 gap-10">
                <div className="space-y-10 lg:col-span-4">
                    <div className="h-fit custom-shadow-v1 rounded-lg">
                        <DragAndDropFile setReRender={() => setReRender(!reRender)} />
                    </div>
                    <div className="space-y-8 h-fit custom-shadow-v1 rounded-lg bg-white p-9">
                        <h1 className="text-[2.2rem] font-semibold">CV đã tải lên</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
                            {cvs?.length === 0 ? (
                                <p className="col-span-2 text-center">Chưa đăng tải CV</p>
                            ) : (
                                cvs?.map((cv, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="relative w-full h-[280px] xl:h-[330px] rounded-lg bg-default-cv hover:scale-105 hover:shadow-lg transition-all"
                                        >
                                            <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-b from-black/5 to-black/75 p-7 flex flex-col justify-between">
                                                <div
                                                    onClick={() => setMainCV(cv?.name)}
                                                    className={`flex items-center self-end gap-2 text-[1.3rem] ${
                                                        cv?.isMain ? 'bg-[#212f3f] text-white' : 'bg-white text-black'
                                                    } rounded-full px-5 py-1 font-medium cursor-pointer hover:scale-105 transition-all`}
                                                >
                                                    <span
                                                        className={`text-[1.8rem] ${
                                                            cv?.isMain ? 'text-yellow-400' : ''
                                                        }`}
                                                    >
                                                        &#9733;
                                                    </span>
                                                    <span>{cv?.isMain ? 'CV chính' : 'Đặt làm CV chính'}</span>
                                                </div>
                                                <div className="space-y-10 text-white">
                                                    <a
                                                        href={cv?.path}
                                                        target="_blank"
                                                        rel="noreferrer noopener"
                                                        className="w-full text-[2.2rem] font-bold break-all truncate-2"
                                                    >
                                                        {cv?.name?.slice(8)}
                                                    </a>
                                                    <div className="flex items-center justify-between">
                                                        <FacebookShareButton url={cv?.path} className="aaa">
                                                            <FacebookIcon size={32} round  className='hover:scale-110 transition-all' />
                                                        </FacebookShareButton>
                                                        <MdOutlineDeleteOutline
                                                            onClick={() => handleDeleteCV(cv?.name)}
                                                            className="text-[2.4rem] cursor-pointer hover:text-[red] hover:scale-110 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit rounded-lg lg:col-span-2">
                    <RightSide />
                </div>
            </div>
        </>
    );
};

export default CvManage;
