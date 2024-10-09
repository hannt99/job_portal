'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SaveJobCard from './saveJobCard';
import RightSide from './rightSide';
import axios from 'axios';

const JobSave = () => {
    const [sort, setSort] = useState('');
    
    const [saveJobs, setSaveJobs] = useState([]);
    useEffect(() => {
        const fetchSaveJob = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/job/get-save-job`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setSaveJobs(
                    res?.data?.allSavedJobs.sort(function (a, b) {
                        if (sort === 'asc' || sort === '')
                            return new Date(Number(b.saveTime)) - new Date(Number(a.saveTime));
                        if (sort === 'desc') return new Date(Number(a.saveTime)) - new Date(Number(b.saveTime));
                    }),
                );
                return;
            } catch (err) {
                console.log(`An error occurred in the fetchSaveJob function: ${err}`);
                return;
            }
        };
        fetchSaveJob();
    }, [sort]);

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
                                    Việc làm đã lưu
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-10 lg:gap-x-10 px-5 md:px-0 w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] py-14">
                <div className="col-span-4 h-fit custom-shadow-v1 rounded-lg bg-white p-7">
                    <div className="flex items-center justify-between">
                        <h2>
                            <b>{saveJobs?.length}</b> việc làm đã lưu
                        </h2>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="block w-[120px] outline-none border rounded-lg bg-[#f1f1f1] px-8 py-5 text-[1.4rem] text-[#808080]"
                        >
                            <option value="">Mặc định</option>
                            <option value="asc">Mới nhất</option>
                            <option value="desc">Cũ nhất</option>
                        </select>
                    </div>
                    <div className="space-y-8 py-5">
                        {saveJobs?.length === 0 ? (
                            <p className="text-center">Chưa lưu việc làm</p>
                        ) : (
                            saveJobs?.map((sj, index) => {
                                return (
                                    <SaveJobCard
                                        key={index}
                                        id={sj?.jobId?._id}
                                        jobTitle={sj?.jobId?.jobTitle}
                                        jobSalaryRange={sj?.jobId?.jobSalaryRange}
                                        jobWorkingLocation={sj?.jobId?.jobWorkingLocation}
                                        updatedAt={sj?.jobId?.updatedAt}
                                        companyId={sj?.jobId?.companyId?._id}
                                        companyName={sj?.jobId?.companyId?.companyName}
                                        companyAvatar={sj?.jobId?.companyId?.avatar}
                                        saveTime={Number(sj?.saveTime)}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
                <div className="space-y-10 col-span-2">
                    <RightSide />
                </div>
            </div>
        </>
    );
};

export default JobSave;
