'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import checkAuth from '@/utils/checkAuth';
import JobCard from '@/components/common/jobCard';
import Pagination from '@/components/common/pagination';

import axios from 'axios';

import { success } from '@/utils/toastMessage';

import { FaLocationDot, FaPeopleGroup, FaEnvelope, FaPhone, FaMap } from 'react-icons/fa6';
import { BiSolidCategory } from 'react-icons/bi';

const CompanyDetail = () => {
    const [reRender, setRerender] = useState(false);

    const searchParams = useSearchParams();

    // Check if window is defined and retrieve accessToken from localStorage
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // Check authentication status
    const authResult = checkAuth(accessToken);

    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);

    const [company, setCompany] = useState({});
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/company/get/${searchParams.get('requestId')}`,
                );
                const res2 = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/get-all?companyId=${res?.data?.company?._id}&limit=10&page=${page}`,
                );
                setCompany(res?.data?.company);
                setJobs(res2?.data?.jobs);
                setPages(res2?.data?.totalPages);
                return;
            } catch (err) {
                console.log('Error in fetchCompany:', err?.response?.data.message);
                return;
            }
        };
        fetchCompany();
    }, [page, reRender]);

    const isFollow = () => {
        const result = company?.followers?.includes(localStorage?.getItem('userId'));
        return result;
    };

    const handleFollowCompany = async () => {
        if (authResult?.authenticated === false) return alert('Đăng nhập để sử dụng tính năng này');

        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/company/add-follower/${searchParams.get('requestId')}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } },
            );
            setRerender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            console.log('Error in handleFollowCompany:', err?.response?.data.message);
            return;
        }
    };

    const handleUnfollowCompany = async () => {
        if (authResult?.authenticated === false) return alert('Đăng nhập để sử dụng tính năng này');

        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/company/remove-follower/${searchParams.get('requestId')}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } },
            );
            setRerender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            console.log('Error in handleUnfollowCompany:', err?.response?.data.message);
            return;
        }
    };

    return (
        <>
            <div className="w-full md:px-0 flex justify-center px-5">
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
                                    className="w-5 h-5 mr-2.5"
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
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                                <Link
                                    href="/company/company-list"
                                    className="ml-2 inline-flex items-center text-[1.5rem] font-normal text-[var(--primary-color)]"
                                >
                                    Danh sách công ty
                                </Link>
                            </div>
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
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                                <span className="ml-1 md:ml-2 text-[1.5rem] font-normal text-[#808080]">
                                    {company?.companyName}
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] grid grid-cols-1 lg:grid-cols-3 lg:gap-x-10 gap-y-10 px-5 md:px-0 py-14">
                <div className="space-y-8 col-span-2 order-2 lg:order-1">
                    <div className="custom-shadow-v1 rounded-lg bg-white">
                        <h1 className="rounded-t-lg bg-gradient-to-r from-[var(--primary-hover-color)] to-green-300 p-7 py-3 text-[2rem] font-semibold text-white">
                            Về chúng tôi
                        </h1>
                        <div
                            className=" p-7 text-[1.5rem] text-[#808080]"
                            dangerouslySetInnerHTML={{ __html: company?.introduction }}
                        ></div>
                    </div>
                    <div className="space-y-5 custom-shadow-v1 rounded-lg bg-white">
                        <h2 className="rounded-t-lg bg-gradient-to-r from-[var(--primary-hover-color)] to-green-300 p-7 py-3 text-[2rem] font-semibold text-white">
                            Việc làm đang tuyển
                        </h2>
                        <div className="space-y-5 p-7">
                            {jobs?.map((j, index) => {
                                return (
                                    <JobCard
                                        key={index}
                                        id={j?._id}
                                        jobTitle={j?.jobTitle}
                                        jobSalaryRange={j?.jobSalaryRange}
                                        jobWorkingLocation={j?.jobWorkingLocation}
                                        updatedAt={j?.updatedAt}
                                        companyId={company?._id}
                                        companyName={company?.companyName}
                                        companyAvatar={company?.avatar}
                                    />
                                );
                            })}
                            <div className="flex justify-center">
                                <Pagination page={page} pages={pages} changePage={setPage} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-10 col-span-1 order-1 lg:order-2">
                    <div className="space-y-10 custom-shadow-v1 rounded-lg bg-white px-7 py-10">
                        <div className="space-y-3">
                            <div className="flex justify-center">
                                <div className="w-[120px] h-[120px]">
                                    <img
                                        src={company?.avatar}
                                        alt="company avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <h2 className="text-center text-[1.8rem] font-medium">{company?.companyName}</h2>
                            <a
                                href={company?.website}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="block text-center font-medium text-blue-600 underline"
                            >
                                Website công ty
                            </a>
                            <div className="flex justify-center">
                                <button
                                    onClick={isFollow() ? handleUnfollowCompany : handleFollowCompany}
                                    className="rounded-lg bg-[#dddddd] px-20 py-3 font-medium"
                                >
                                    {isFollow() ? <span>&#10003; Đã theo dõi</span> : 'Theo dõi'}
                                </button>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="space-y-10">
                            <p>
                                <span className="flex items-center gap-3 text-[#808080]">
                                    <FaLocationDot />
                                    <span>Địa chỉ:</span>
                                </span>
                                <span className="block text-[1.7rem] font-medium">
                                    {company?.companyAddress?.district +
                                        ', ' +
                                        company?.companyAddress?._province?.name}
                                </span>
                            </p>
                            <p>
                                <span className="flex items-center gap-3 text-[#808080]">
                                    <FaPeopleGroup />
                                    <span>Quy mô:</span>
                                </span>
                                <span className="block text-[1.7rem] font-medium">
                                    {company?.companySize?.from + '-' + company?.companySize?.to + ' nhân viên'}
                                </span>
                            </p>
                            <p>
                                <span className="flex items-center gap-3 text-[#808080]">
                                    <FaEnvelope />
                                    <span>Email:</span>
                                </span>
                                <span className="block text-[1.7rem] font-medium">{company?.companyEmail}</span>
                            </p>
                            <p>
                                <span className="flex items-center gap-3 text-[#808080]">
                                    <FaPhone />
                                    <span>Số điện thoại:</span>
                                </span>
                                <span className="block text-[1.7rem] font-medium">{company?.companyPhone}</span>
                            </p>
                            <p>
                                <span className="flex items-center gap-3 text-[#808080]">
                                    <BiSolidCategory />
                                    <span>Ngành:</span>
                                </span>
                                <span className="block text-[1.7rem] font-medium">{company?.companyCareer}</span>
                            </p>
                        </div>
                    </div>
                    <div className="space-y-7 custom-shadow-v1 rounded-lg bg-white px-7 py-10">
                        <h3 className="flex items-center gap-3">
                            <FaMap className="text-[2rem] text-[var(--primary-color)]" />
                            <span className="font-medium">Xem bản đồ</span>
                        </h3>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d501725.41842091794!2d106.36554998959083!3d10.755292877461148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1718459748065!5m2!1sen!2s"
                            loading="lazy"
                            allowFullScreen=""
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-[300px] md:h-[500px] lg:h-[240px] xl:h-[300px]"
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanyDetail;
