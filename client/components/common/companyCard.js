'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import setSlug from '@/utils/slugify';

import axios from 'axios';

import { success } from '@/utils/toastMessage';

import { CiLocationOn } from 'react-icons/ci';

const CompanyCard = (props) => {
    const [company, setCompany] = useState({});
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/company/get/${props.id}`);
                setCompany(res?.data?.company);
                return;
            } catch (err) {
                console.log(`An error occurred in the fetchCompany function: ${err}`);
                return;
            }
        };
        fetchCompany();
    }, []);

    const isFollow = () => {
        const result = company?.followers?.includes(localStorage?.getItem('userId'));
        return result;
    };

    const handleFollowCompany = async () => {
        const res = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/company/add-follower/${props.id}`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } },
        );
        if (res?.data?.code === 200) {
            props.setReRender(false);
            return success(res?.data?.message);
        } else {
            return;
        }
    };

    const handleUnfollowCompany = async () => {
        const res = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/company/remove-follower/${props.id}`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } },
        );
        if (res?.data?.code === 200) {
            props.setReRender(false);
            return success(res?.data?.message);
        } else {
            return;
        }
    };

    return (
        <div className="flex flex-col items-center justify-between bg-white custom-shadow-v1 w-full min-h-[330px] rounded-lg px-10 py-7">
            <div className="flex flex-col items-center">
                <div className="w-[120px] h-[120px] rounded-full">
                    <img
                        src={props.companyAvatar}
                        alt="company avatar"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <Link
                    href={`/company/${setSlug(props.companyName)}?requestId=${props.id}`}
                    className="text-[1.8rem] text-center font-semibold mt-5 hover:text-[var(--primary-color)] transition-all"
                >
                    {props.companyName}
                </Link>
                <p className="flex items-center gap-2 mt-3">
                    <CiLocationOn className="text-[2rem]" />{' '}
                    <span className="text-[1.4rem] text-[#808080]">{props.companyAddress}</span>
                </p>
            </div>
            {props.isFollowBtn ? (
                <div className="flex justify-center">
                    <button
                        onClick={isFollow() ? handleUnfollowCompany : handleFollowCompany}
                        className="rounded-lg bg-[#dddddd] px-20 py-3 font-medium"
                    >
                        {isFollow() ? <span>&#10003; Đã theo dõi</span> : 'Theo dõi'}
                    </button>
                </div>
            ) : (
                <div className="block mt-12 w-full rounded-full bg-[var(--secondary-color)] py-5 text-center font-medium text-[var(--primary-color)]">
                    {props.allOpenJobs} vị trí đang tuyển
                </div>
            )}
        </div>
    );
};

export default CompanyCard;
