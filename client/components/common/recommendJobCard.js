'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';

import { formatVNTimeAgo } from '@/utils/formatDateTime';
import setSlug from '@/utils/slugify';

import axios from 'axios';

import { success } from '@/utils/toastMessage';

import { AiOutlineDollar } from 'react-icons/ai';
import { IoLocationOutline, IoBookmarkOutline, IoBookmark } from 'react-icons/io5';
import { MdUpdate } from 'react-icons/md';

const RecommendJobCard = (props) => {
    const [reRender, setRerender] = useState('');

    // Check if window is defined and retrieve accessToken from localStorage
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const [isSave, setIsSave] = useState(false);
    useEffect(() => {
        const isSave = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/job/get-save-job`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const result = !!res?.data?.allSavedJobs?.find((sj) => sj?.jobId?._id === props.id);
                setIsSave(result);
            } catch (err) {
                console.log('Error in isSave:', err?.response?.data.message);
                return;
            }
        };
        isSave();
    }, [reRender]);

    const refactorLocation = (location) => {
        if (location?.length > 1) {
            return `${location?.length} địa điểm`;
        } else {
            return location[0]?.label;
        }
    };

    const handleSaveJob = async (id) => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/job/save-job`,
                { jobId: id },
                { headers: { Authorization: `Bearer ${accessToken}` } },
            );
            setRerender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            console.log('Error in handleSaveJob:', err?.response?.data.message);
            return;
        }
    };

    const handleUnSaveJob = async (id) => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/job/unsave-job`,
                { jobId: id },
                { headers: { Authorization: `Bearer ${accessToken}` } },
            );
            setRerender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            console.log('Error in handleUnSaveJob:', err?.response?.data.message);
            return;
        }
    };

    return (
        <div className="relative w-full h-fit custom-shadow-v1 hover:ring-2 hover:ring-[var(--primary-color)] border rounded-lg bg-white px-7 py-5">
            <div className="flex items-start gap-5">
                <div className="w-[70px] h-[70px] border border-black rounded-lg">
                    <img src={props.companyAvatar} alt="job card" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="pr-3 flex-1">
                    <Link
                        href={`/job/${setSlug(props.jobTitle)}?requestId=${props.id}`}
                        className="truncate-1 text-[1.8rem] leading-8 font-semibold hover:text-[var(--primary-color)]"
                    >
                        {props.jobTitle}
                    </Link>
                    <Link
                        href={`/company/${setSlug(props.companyName)}?requestId=${props.companyId}`}
                        className="mt-2 truncate-1 text-[1.5rem]"
                    >
                        {props.companyName}
                    </Link>
                </div>
            </div>
            <div className="mt-5 text-[1.3rem] font-medium text-[#808080] flex flex-wrap gap-3">
                <p className="rounded-md flex items-center gap-1">
                    <AiOutlineDollar className="text-[1.8rem]" />
                    <span>{props.jobSalaryRange}</span>
                </p>
                <p className="rounded-md flex items-center gap-1">
                    <IoLocationOutline className="text-[1.8rem]" />
                    <span>{refactorLocation(props.jobWorkingLocation)}</span>
                </p>
                <p className="rounded-md flex items-center gap-1">
                    <MdUpdate className="text-[1.8rem]" />
                    <span>{formatVNTimeAgo(props.updatedAt)}</span>
                </p>
            </div>
            {isSave ? (
                <div className="bg-[white] text-[var(--primary-color)]">
                    <IoBookmark
                        onClick={() => handleUnSaveJob(props.id)}
                        className="absolute top-5 right-5 text-[2.4rem] cursor-pointer"
                    />
                </div>
            ) : (
                <div>
                    <IoBookmarkOutline
                        onClick={() => handleSaveJob(props.id)}
                        className="absolute top-5 right-5 text-[2.4rem] cursor-pointer"
                    />
                </div>
            )}
        </div>
    );
};

export default RecommendJobCard;
