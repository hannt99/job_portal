'use client';

import { useState, useEffect } from 'react';
import RecommendJobCard from '@/components/common/recommendJobCard';
import axios from 'axios';

const JobRecommendItem = () => {
    const [recommendJobs, setRecommendJob] = useState([]);
    useEffect(() => {
        const fetchRecommendJob = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/job/get-recommend-job`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                console.log('res?.data?.recommendJobs: ', res?.data?.recommendJobs);
                setRecommendJob(res?.data?.recommendJobs);
                return;
            } catch (err) {
                console.log('Error in fetchRecommendJob:', err?.response?.data.message);
                return;
            }
        };
        fetchRecommendJob();
    }, []);

    return (
        <>
            {recommendJobs?.length === 0 ? (
                <p className="text-center">Không có việc làm phù hợp</p>
            ) : (
                recommendJobs?.map((rj, index) => {
                    return (
                        <RecommendJobCard
                            key={index}
                            id={rj?._id}
                            jobTitle={rj?.jobTitle}
                            jobSalaryRange={rj?.jobSalaryRange}
                            jobWorkingLocation={rj?.jobWorkingLocation}
                            jobStatus={rj?.jobStatus}
                            updatedAt={rj?.updatedAt}
                            companyId={rj?.companyId?._id}
                            companyName={rj?.companyId?.companyName}
                            companyAvatar={rj?.companyId?.avatar}
                        />
                    );
                })
            )}
        </>
    );
};

export default JobRecommendItem;
