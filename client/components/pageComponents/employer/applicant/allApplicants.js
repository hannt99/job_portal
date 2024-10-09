'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import ApplicantCard from './applicantCard';

import axios from 'axios';

const AllApplicants = () => {
    const [reRender, setReRender] = useState(false);

    const [allJobs, setAllJobs] = useState([]);
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/get-all-by-employer?limit=100&page=1`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                    },
                );
                setAllJobs(res?.data?.jobs);
                return;
            } catch (err) {
                console.log('Error in fetchJobs:', err?.response?.data.message);
                return;
            }
        };
        fetchJobs();
    }, []);
    // const [jobId, setJobId] = useState('');
    const [jobId, setJobId] = useState('336fb003882f472185c091b9');
    const searchParams = useSearchParams();
    useEffect(() => {
        const paramJobId = searchParams.get('requestId');
        if (paramJobId) {
            setJobId(paramJobId);
            // console.log('after setJobId(paramJobId): ', jobId);
        } else {
            setJobId('336fb003882f472185c091b9'); // Default value
            // console.log('use default jobId: ', jobId);
        }
        // Clear the query parameter from the URL without causing a page reload
        const url_str = window.location.pathname; // Get the current path without query parameters
        const url_arr = url_str.split("/");
        const lastSegment = "/"+url_arr[url_arr.length - 1];
        const newUrl = url_str.replace(lastSegment,'');
        // console.log("newUrl: ", newUrl);
        window.history.replaceState({}, '', newUrl); // Update the URL
    }, []);

    const [allApplicants, setAllApplicants] = useState([]);
    useEffect(() => {
        const fetchApplicant = async () => {
            try {
                console.log('Fetching applicants for jobId: ', jobId);
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/get-applicants-by-job?jobId=${jobId}`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                    },
                );
                setAllApplicants(res?.data?.applicants);
                return;
            } catch (err) {
                console.log('Error in fetchApplicant:', err?.response?.data.message);
                return;
            }
        };
        fetchApplicant();
    }, [jobId, reRender]);

    return (
        <div className="p-10">
            <h1 className="text-[2.4rem] font-semibold">Tất cả ứng viên &#128276;</h1>
            <div className="mt-10 custom-shadow-v1 bg-white px-9 py-12">
                <div className="mb-10 flex items-center justify-between">
                    <h2 className="border-l-4 border-red-600 pl-4 flex-1 font-medium">
                        Danh sách ứng viên theo việc làm
                    </h2>
                    <select
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                        className="block w-[160px] outline-none border rounded-lg bg-[#f1f1f1] py-5 pl-8 pr-16 text-[1.4rem] text-[#808080] truncate"
                    >
                        {/* <option value="">Lọc theo tên</option> */}
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
                    ) : allApplicants?.length === 0 || allApplicants === undefined ? (
                        <p className="col-span-2 text-center">Không tìm thấy ứng viên</p>
                    ) : (
                        allApplicants?.map((ap, index) => {
                            return (
                                <ApplicantCard
                                    key={index}
                                    jobId={jobId}
                                    userId={ap?.userId?._id}
                                    fullName={ap?.userId?.fullName}
                                    avatar={ap?.userId?.avatar}
                                    phone={ap?.userId?.phone}
                                    email={ap?.userId?.email}
                                    cvPath={ap?.cvPath}
                                    coverLetter={ap?.coverLetter}
                                    status={ap?.status}
                                    setReRender={() => setReRender(!reRender)}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllApplicants;
