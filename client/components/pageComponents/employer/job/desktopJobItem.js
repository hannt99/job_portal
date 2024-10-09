'use client';

import Link from 'next/link';

import { formatVNDate } from '@/utils/formatDateTime';
import setSlug from '@/utils/slugify';

import { AiOutlineDollar } from 'react-icons/ai';
import { IoLocationOutline } from 'react-icons/io5';
// import { FaRegEye } from 'react-icons/fa6';
import { GoPencil } from 'react-icons/go';
import { RiDeleteBin6Line } from 'react-icons/ri';

const DesktopJobItem = (props) => {
    const refactorLocation = (location) => {
        if (location?.length > 1) {
            return `${location?.length} địa điểm`;
        } else {
            return location[0].label;
        }
    };

    return (
        <div className="border-b px-10 py-7 grid grid-cols-7 gap-16">
            <div className="col-span-3 flex items-start gap-5">
                <div className="w-[50px] h-[50px] rounded-lg">
                    <img src={props.companyAvatar} alt="avatar" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1">
                    <h2 className="block w-full text-[1.8rem] font-semibold truncate-2">{props.jobTitle}</h2>
                    <p className="flex items-center flex-wrap gap-7 text-[1.4rem] text-[#808080] mt-5">
                        <span className="items-center gap-3 flex">
                            <AiOutlineDollar className="text-[1.8rem]" />
                            <span className="flex-1">{props.jobSalaryRange}</span>
                        </span>
                        <span className="items-center gap-3 flex">
                            <IoLocationOutline className="text-[1.8rem]" />
                            <span className="flex-1">{refactorLocation(props.jobWorkingLocation)}</span>
                        </span>
                    </p>
                </div>
            </div>
            <div className="col-span-1 flex">
                <Link
                    href={`/employer/all-applicants/${setSlug(props.jobTitle)}?requestId=${props.jobId}`}
                    className="my-auto text-[1.5rem] text-blue-600 underline"
                >
                    <span>{props.jobApplicants?.length}</span> ứng cử
                </Link>
            </div>
            <div className="col-span-1 flex">
                <span className="my-auto text-[1.4rem] text-[#808080]">{formatVNDate(props.jobDeadline)}</span>
            </div>
            <div className="col-span-1 flex">
                <span
                    className={`my-auto text-[1.3rem] ${
                        props.jobStatus === 'Đang tuyển' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                    {props.jobStatus}
                </span>
            </div>
            <div className="col-span-1 flex items-center gap-3">
                {/* <div className="rounded-lg bg-[var(--secondary-color)] p-3 text-[1.8rem] text-[var(--primary-color)]">
                    <FaRegEye />
                </div> */}
                <Link
                    href={`/employer/edit-job?requestId=${props.jobId}`}
                    className="block rounded-lg bg-[var(--secondary-color)] p-3 text-[1.8rem] text-[var(--primary-color)]"
                >
                    <GoPencil />
                </Link>
                <div
                    onClick={props.handleDeleteJob}
                    className="rounded-lg bg-red-200 p-3 text-[1.8rem] text-red-600 cursor-pointer"
                >
                    <RiDeleteBin6Line />
                </div>
            </div>
        </div>
    );
};

export default DesktopJobItem;
