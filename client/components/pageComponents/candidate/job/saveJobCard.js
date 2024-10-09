'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { formatVNTimeAgo, formatVNDateTime } from '@/utils/formatDateTime';
import setSlug from '@/utils/slugify';

import axios from 'axios';

import { success } from '@/utils/toastMessage';

import { AiOutlineDollar } from 'react-icons/ai';
import { IoLocationOutline, IoBookmark, IoBookmarkOutline } from 'react-icons/io5';
import { MdUpdate } from 'react-icons/md';

const SaveJobCard = (props) => {
    const [reRender, setRerender] = useState('');

    const [isSave, setIsSave] = useState(false);
    useEffect(() => {
        const isSave = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/job/get-save-job`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            const result = !!res?.data?.allSavedJobs?.find((item) => item?.jobId?._id === props.id);
            setIsSave(result);
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
        if (!localStorage.getItem('accessToken')) return alert('Đăng nhập để sử dụng tính năng này');
        const res = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/job/save-job`,
            { jobId: id },
            { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } },
        );
        if (res?.data?.code === 200) {
            setRerender(!reRender);
            return success(res?.data?.message);
        } else {
            return;
        }
    };

    const handleUnSaveJob = async (id) => {
        if (!localStorage.getItem('accessToken')) return alert('Đăng nhập để sử dụng tính năng này');
        const res = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/job/unsave-job`,
            { jobId: id },
            { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } },
        );
        if (res?.data?.code === 200) {
            setRerender(!reRender);
            return success(res?.data?.message);
        } else {
            return;
        }
    };

    return (
        <div className="relative w-full h-fit md:h-[240px] custom-shadow-v1 hover:ring-2 hover:ring-[var(--primary-color)] border rounded-lg bg-white px-7 py-5 md:px-12 md:py-10 flex flex-col justify-between">
            <div className="flex items-start gap-5">
                <div className="w-[80px] h-[80px] md:w-[110px] md:h-[110px] border border-black rounded-lg">
                    <img src={props.companyAvatar} alt="job card" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1 h-full flex flex-col justify-between">
                    <div className="pr-3">
                        <Link
                            href={`/job/${setSlug(props.jobTitle)}?requestId=${props.id}`}
                            className="text-[1.8rem] leading-8 font-semibold hover:text-[var(--primary-color)] truncate-1 md:truncate-2"
                        >
                            {props.jobTitle}
                        </Link>
                        <Link
                            href={`/company/${setSlug(props.companyName)}?requestId=${props.companyId}`}
                            className="mt-2 text-[1.5rem] truncate-1"
                        >
                            {props.companyName}
                        </Link>
                    </div>
                    <p className="text-[1.4rem] mt-3">Đã lưu: {formatVNDateTime(props.saveTime)}</p>
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
                </div>
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
            <div className="flex justify-end">
                <Link
                    href={`/job/${setSlug(props.jobTitle)}?requestId=${props.id}`}
                    className="block text-[1.4rem] text-white font-medium bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] px-7 py-2.5 rounded-lg mt-5 md:mt-0"
                >
                    Ứng tuyển
                </Link>
            </div>
        </div>
    );
};

export default SaveJobCard;
