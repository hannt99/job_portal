'use client';

import { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa6';
import axios from 'axios';

const ApplicantRecommend = () => {
    const [allJobs, setAllJobs] = useState([]);
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/job/get-active-job-by-employer`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setAllJobs(res?.data?.activeJobs);
                return;
            } catch (err) {
                console.log('Error in fetchJobs:', err?.response?.data.message);
                return;
            }
        };
        fetchJobs();
    }, []);
    const [jobId, setJobId] = useState('336fb003882f472185c091b9');

    const [allRecommendCV, setAllRecommendCV] = useState([]);
    useEffect(() => {
        // if (!jobId) return;
        const fetchCVs = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resume/recommend-cv?jobId=${jobId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setAllRecommendCV(res?.data?.resumes);
                return;
            } catch (err) {
                console.log('Error in fetchCVs:', err?.response?.data.message);
                return;
            }
        };
        fetchCVs();
    }, [jobId]);

    return (
        <div className="p-10">
            <h1 className="text-[2.4rem] font-semibold">Gợi ý ứng viên &#128276;</h1>
            <div className="mt-10 custom-shadow-v1 bg-white px-9 py-12">
                <div className="mb-10 flex items-center justify-between">
                    <h2 className="border-l-4 border-red-600 pl-4 flex-1 font-medium">Danh sách gợi ý</h2>
                    <select
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                        className="block w-[160px] outline-none border rounded-lg bg-[#f1f1f1] py-5 pl-8 pr-16 text-[1.4rem] text-[#808080] truncate"
                    >
                        <option value="336fb003882f472185c091b9">Lọc theo tên</option>
                        {allJobs?.map((aj, index) => {
                            return (
                                <option key={index} value={aj?._id}>
                                    {aj?.jobTitle}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">
                    {jobId === '336fb003882f472185c091b9' ? (
                        <p className="col-span-2 text-center font-medium text-red-600">
                            Lưu ý: Lọc dữ liệu theo từng việc làm
                        </p>
                    ) : allRecommendCV?.length === 0 ? (
                        <p className="col-span-2 text-center">Không tìm thấy gợi ý</p>
                    ) : (
                        allRecommendCV?.map((ar, index) => {
                            return (
                                <div
                                    key={index}
                                    className="border-b p-5 flex flex-col md:flex-row items-center md:items-start gap-5"
                                >
                                    <div className="w-[100px] h-[100px] md:w-[70px] md:h-[70px] border border-black rounded-full">
                                        <img
                                            src={ar?.userId?.avatar}
                                            alt="user avatar"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h2 className="text-[2rem] font-medium">{ar?.userId?.fullName}</h2>
                                        <div className="block md:flex flex-wrap items-center gap-5">
                                            <p className="flex items-center justify-center gap-2 text-[#808080]">
                                                <FaEnvelope />
                                                <span>{ar?.userId?.email}</span>
                                            </p>
                                            <p className="flex items-center justify-center gap-2 text-[#808080]">
                                                <FaPhone />
                                                <span>{ar?.userId?.phone}</span>
                                            </p>
                                        </div>
                                        <a
                                            href={ar?.cv?.find((item) => item?.isMain === true)?.path}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="block mt-5 text-blue-700 underline"
                                        >
                                            CV ứng viên
                                        </a>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicantRecommend;
