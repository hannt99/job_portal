'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApplyJobCard from './applyJobCard';
import RightSide from './rightSide';
import axios from 'axios';

const JobApply = () => {
    const [filter, setFilter] = useState('Đã ứng tuyển');
    const [userId, setUserId] = useState('');
    const [allAppliedJobs, setAllAppliedJobs] = useState([]);
    useEffect(() => {
        const fetchAppliedJob = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/job/get-applied-job`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setUserId(res?.data?.userId);
                const appliedJobs = res?.data?.jobs?.filter((j) =>
                    j?.jobApplicants?.find(
                        (item2) => item2?.userId?.toString() === res?.data?.userId && item2?.status === filter,
                    ),
                );
                return setAllAppliedJobs(appliedJobs);
            } catch (err) {
                console.log(`An error occurred in the fetchAppliedJob function: ${err}`);
                return;
            }
        };
        fetchAppliedJob();
    }, [filter]);

    const getApplyInfo = (array) => {
        const result = array?.find((item) => item?.userId?.toString() === userId);
        return result;
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
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                                <span className="ml-1 md:ml-2 text-[1.5rem] font-normal text-[#808080]">
                                    Việc làm đã ứng tuyển
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-10 lg:gap-x-10 py-14 px-5 md:px-0 w-full md:w-[690px] lg:w-[960px] xl:w-[1200px]">
                <div className="col-span-4 bg-white p-7 rounded-lg custom-shadow-v1 h-fit">
                    <div className="flex items-center justify-between">
                        <h2>
                            <b>{allAppliedJobs?.length}</b> việc làm <span className="lowercase">{filter}</span>
                        </h2>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="block w-[160px] outline-none border rounded-lg px-8 py-5 bg-[#f1f1f1] text-[1.4rem] text-[#808080]"
                        >
                            <option value="Đã ứng tuyển">Đã ứng tuyển</option>
                            <option value="Phù hợp">Phù hợp</option>
                            <option value="Chưa phù hợp">Chưa phù hợp</option>
                        </select>
                    </div>
                    <div className="space-y-8 col-span-2 py-5">
                        {allAppliedJobs?.length === 0 ? (
                            <p className="text-center ">Không tìm thấy dữ liệu</p>
                        ) : (
                            allAppliedJobs?.map((ap, index) => {
                                return (
                                    <ApplyJobCard
                                        key={index}
                                        id={ap?._id}
                                        jobTitle={ap?.jobTitle}
                                        companyId={ap?.companyId?._id}
                                        companyName={ap?.companyId?.companyName}
                                        companyAvatar={ap?.companyId?.avatar}
                                        appliedTime={getApplyInfo(ap?.jobApplicants)?.appliedTime}
                                        applyStatus={getApplyInfo(ap?.jobApplicants)?.status}
                                        cvPath={getApplyInfo(ap?.jobApplicants)?.cvPath}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
                <div className="col-span-2 space-y-10">
                    <RightSide />
                </div>
            </div>
        </>
    );
};

export default JobApply;
