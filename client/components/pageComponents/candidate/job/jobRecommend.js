'use client';

import { useState, useEffect } from 'react';
import RightSide from '../account/rightSide';
import Link from 'next/link';
import axios from 'axios';
import RecommendJobCard from '@/components/common/recommendJobCard';
import Pagination from '@/components/common/pagination';

const JobRecommend = () => {
    const [recommendJobs, setRecommendJob] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    useEffect(() => {
        const fetchRecommendJob = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/get-recommend-job?page=${page}&limit=10`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                    },
                );
                setRecommendJob(res?.data?.recommendJobs);
                setPages(res?.data?.totalPages);
            } catch (err) {
                return;
            }
        };
        fetchRecommendJob();
    }, [page]);

    return (
        <>
            <div className="w-full flex justify-center px-5 md:px-0">
                <nav
                    className="flex bg-[var(--secondary-color)] px-7 py-5 w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] rounded-lg custom-shadow-v1 mt-5"
                    aria-label="Breadcrumb"
                >
                    <ol className="inline-flex flex-wrap items-center space-x-1 md:space-x-3">
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
                                    className="w-3 h-3 text-gray-400 mx-1"
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
                                <span className="ml-1 text-[1.5rem] font-normal text-[#808080] md:ml-2">
                                    Gợi ý việc làm
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-10 lg:gap-x-10 px-5 md:px-0 w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] py-14">
                <div className="col-span-4 bg-white p-7 rounded-lg custom-shadow-v1 h-fit">
                    <h2>
                        <b>{recommendJobs?.length}</b> việc làm phù hợp với yêu cầu của bạn
                    </h2>
                    <div className="py-5 space-y-8">
                        {recommendJobs?.length === 0 ? (
                            <p className="text-center">Không có việc làm phù hợp</p>
                        ) : (
                            recommendJobs?.map((rj, index) => {
                                return (
                                    <RecommendJobCard
                                        key={index}
                                        id={rj?._id}
                                        jobTitle={rj?.jobTitle}
                                        jobStatus={rj?.jobStatus}
                                        jobSalaryRange={rj?.jobSalaryRange}
                                        jobWorkingLocation={rj?.jobWorkingLocation}
                                        updatedAt={rj?.updatedAt}
                                        companyId={rj?.companyId?._id}
                                        companyName={rj?.companyId?.companyName}
                                        companyAvatar={rj?.companyId?.avatar}
                                    />
                                );
                            })
                        )}
                        <div className="flex justify-center">
                            <Pagination page={page} pages={pages} changePage={setPage} />
                        </div>
                    </div>
                </div>
                <div className="col-span-2 space-y-10">
                    <RightSide />
                </div>
            </div>
        </>
    );
};

export default JobRecommend;
