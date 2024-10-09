'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Link from 'next/link';

import JobCard from '@/components/common/jobCard';
import { formatVNTimeAgo, formatVNDateTime } from '@/utils/formatDateTime';
import setSlug from '@/utils/slugify';

import checkAuth from '@/utils/checkAuth';

import { socket } from '@/socket';

import axios from 'axios';

import { success } from '@/utils/toastMessage';

import { BsSuitcaseLg } from 'react-icons/bs';
import { IoLocationOutline, IoBookmarkOutline, IoDocumentText, IoWarning } from 'react-icons/io5';
import { LuClock4 } from 'react-icons/lu';
import { AiOutlineDollar } from 'react-icons/ai';
import { FaRegCalendarTimes } from 'react-icons/fa';
import { BiSolidCategory } from 'react-icons/bi';
import { RiFolderUserFill } from 'react-icons/ri';
import {
    FaArrowRotateLeft,
    FaLocationDot,
    FaEnvelope,
    FaPeopleGroup,
    FaPhone,
    FaFeatherPointed,
    FaXmark,
} from 'react-icons/fa6';
import { CgTimelapse } from 'react-icons/cg';

const JobDetail = () => {
    const [reRender, setRerender] = useState('');

    // Check if window is defined and retrieve accessToken from localStorage
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // Check authentication status
    const authResult = checkAuth(accessToken);

    const searchParams = useSearchParams();

    const [job, setJob] = useState({});
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/get/${searchParams.get('requestId')}`,
                );
                setJob(res?.data?.job);
            } catch (err) {
                console.log('Error in fetchJob: ', err?.response?.data.message || err.message);
                return;
            }
        };
        fetchJob();
    }, [searchParams, reRender]);

    const [relativeJobs, setRelativeJobs] = useState([]);
    useEffect(() => {
        const fetchRelativeJob = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/get-relative-job?jobCareers=${job?.jobCareers}&jobType=${job?.jobType}`,
                );
                setRelativeJobs(res?.data?.relativeJobs);
            } catch (err) {
                console.log('Error in fetchRelativeJob: ', err?.response?.data.message || err.message);
                return;
            }
        };
        fetchRelativeJob();
    }, [job]);

    const [isSave, setIsSave] = useState(false);
    useEffect(() => {
        const isSave = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/job/get-save-job`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                const result = !!res?.data?.allSavedJobs?.find((item) => item?.jobId?._id === job?._id);
                setIsSave(result);
            } catch (err) {
                console.log('Error in isSave: ', err?.response?.data.message || err.message);
                return;
            }
        };
        isSave();
    }, [reRender, job]);

    const [resume, setResume] = useState({});
    const [mainCV, setMainCV] = useState({});
    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resume/get`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setResume(res?.data?.resume);
                const cv = res?.data?.resume?.cv?.find((item) => item?.isMain === true);
                return setMainCV(cv);
            } catch (err) {
                console.log('Error in fetchResume: ', err?.response?.data.message || err.message);
                return;
            }
        };
        fetchResume();
    }, []);

    const [coverLetter, setCoverLetter] = useState('');

    const [openApplyForm, setOpenApplyForm] = useState(false);
    useEffect(() => {
        openApplyForm ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'unset');
    }, [openApplyForm]);

    const [isApplied, setIsApplied] = useState(true);
    useEffect(() => {
        if (job?.jobApplicants?.find((item) => item?.userId === resume?.userId?._id)) {
            return setIsApplied(true);
        } else {
            setIsApplied(false);
        }
    }, [reRender, job, resume]);

    const refactorLocation = (location) => {
        const result = location?.map((item) => item?.label).join(', ');
        return result;
    };

    const handleSaveJob = async () => {
        if (authResult?.authenticated === false) return alert('Đăng nhập để sử dụng tính năng này');

        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/job/save-job`,
                { jobId: searchParams.get('requestId') },
                { headers: { Authorization: `Bearer ${accessToken}` } },
            );
            setRerender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            console.log('Error in handleSaveJob: ', err?.response?.data.message || err.message);
            return;
        }
    };

    const handleUnSaveJob = async () => {
        if (authResult?.authenticated === false) return alert('Đăng nhập để sử dụng tính năng này');

        try {
            console.log('handleUnSaveJob:');
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/job/unsave-job`,
                { jobId: searchParams.get('requestId') },
                { headers: { Authorization: `Bearer ${accessToken}` } },
            );
            setRerender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            console.log('Error in handleUnSaveJob: ', err?.response?.data.message || err.message);
            return;
        }
    };

    const handleOpenApplyForm = () => {
        if (authResult?.authenticated === false) return alert('Đăng nhập để sử dụng tính năng này');
        if (job?.jobStatus === 'Hết hạn nộp') return alert('Việc làm đã hết hạn nộp');
        return setOpenApplyForm(true);
    };

    const handleApplyJob = async () => {
        if (authResult?.authenticated === false) return alert('Đăng nhập để sử dụng tính năng này');

        const data = {
            cvPath: mainCV?.path,
            coverLetter,
        };

        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/job/apply-job/${job?._id}`, data, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            socket.emit('sendNotification', {
                receiverId: res?.data?.receiverId,
            });
            setOpenApplyForm(false);
            setRerender(!reRender);
            return success(res?.data?.message);
        } catch (er) {
            console.log('Error in handleApplyJob: ', err?.response?.data.message || err.message);
            return;
        }
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
                                <Link
                                    href="/job/search-job"
                                    className="ml-2 inline-flex items-center text-[1.5rem] font-normal text-[var(--primary-color)]"
                                >
                                    Tìm việc làm
                                </Link>
                            </div>
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
                                    {job?.jobTitle}
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] px-5 md:px-0 py-14">
                <div className="flex items-center gap-7">
                    <div className="w-[100px] h-[100px]">
                        <img src={job?.companyId?.avatar} alt="company avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-5">
                        <h1 className="text-[2.6rem] font-semibold">{job?.jobTitle}</h1>
                        <ul className="flex items-center flex-wrap gap-7 text-[1.4rem] text-[#808080]">
                            <li className="flex items-center gap-2">
                                <BsSuitcaseLg className="text-[2rem]" />
                                <span>{job?.jobCareers}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <IoLocationOutline className="text-[2rem]" />
                                <span>{refactorLocation(job?.jobWorkingLocation)}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <LuClock4 className="text-[2rem]" />
                                <span>{formatVNTimeAgo(job?.createdAt)}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <AiOutlineDollar className="text-[2rem]" />
                                <span>{job?.jobSalaryRange}</span>
                            </li>
                        </ul>
                        <ul className="flex items-center gap-3 text-[1.3rem] font-medium text-[#808080]">
                            <li className="rounded-full bg-[#d5e3f6] px-7 py-1 text-blue-700 uppercase">
                                {job?.jobType}
                            </li>
                            <li
                                className={`${
                                    job?.jobStatus === 'Đang tuyển'
                                        ? 'bg-[#d9ede3] text-[var(--primary-color)]'
                                        : 'bg-red-200 text-red-600'
                                } rounded-full px-7 py-1 uppercase`}
                            >
                                {job?.jobStatus}
                            </li>
                        </ul>
                    </div>
                </div>
                <div></div>
            </div>
            <div className="w-full h-full bg-white py-14 flex justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-10 lg:gap-x-10 px-5 md:px-0 w-full md:w-[690px] lg:w-[960px] xl:w-[1200px]">
                    <div className="col-span-2 order-2 lg:order-1">
                        <div className="text-[1.5rem]" dangerouslySetInnerHTML={{ __html: job?.jobDesc }}></div>
                        <div className="space-y-5 mt-14">
                            <h2 className="text-[2.4rem] font-semibold">Việc làm liên quan</h2>
                            <div className="space-y-5">
                                {relativeJobs?.length <= 1 ? (
                                    <p className="text-center">Không tìm thấy dữ liệu</p>
                                ) : (
                                    relativeJobs
                                        ?.filter((item) => item?._id !== job?._id)
                                        ?.map((rj, index) => {
                                            return (
                                                <JobCard
                                                    key={index}
                                                    id={rj?._id}
                                                    jobTitle={rj?.jobTitle}
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
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 order-1 lg:order-2 space-y-10">
                        <div className="flex items-stretch gap-4">
                            <button
                                onClick={handleOpenApplyForm}
                                className="rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] py-4 flex-1 font-medium text-white transition-all"
                            >
                                {isApplied ? (
                                    <span className="flex items-center justify-center gap-5">
                                        <FaArrowRotateLeft className="text-[2rem]" />
                                        <span>Ứng tuyển lại</span>
                                    </span>
                                ) : (
                                    'Ứng tuyển'
                                )}
                            </button>
                            <button
                                onClick={isSave ? handleUnSaveJob : handleSaveJob}
                                className={`text-[2.4rem] ${
                                    isSave
                                        ? 'bg-[var(--primary-color)] text-white'
                                        : 'bg-[var(--secondary-color)] text-[var(--primary-color)] '
                                } rounded-lg hover:bg-[var(--primary-color)] p-4 hover:text-white transition-all`}
                            >
                                <IoBookmarkOutline />
                            </button>
                        </div>
                        <div className="bg-[#f4f6fb] p-10 space-y-20 rounded-lg">
                            <div className="space-y-10">
                                <h2 className="text-[1.8rem] font-medium">Thông tin chung</h2>
                                <div className="flex items-start gap-7">
                                    <LuClock4 className="text-[2.6rem] text-[var(--primary-color)]" />
                                    <p>
                                        <span className="block font-medium">Đã đăng</span>
                                        <span className="block text-[1.5rem]">{formatVNTimeAgo(job?.createdAt)}</span>
                                    </p>
                                </div>
                                <div className="flex items-start gap-7">
                                    <FaRegCalendarTimes className="text-[2.6rem] text-[var(--primary-color)]" />
                                    <p>
                                        <span className="block font-medium">Hết hạn</span>
                                        <span className="block text-[1.5rem]">
                                            {formatVNDateTime(job?.jobDeadline)}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-start gap-7">
                                    <IoLocationOutline className="text-[2.6rem] text-[var(--primary-color)]" />
                                    <p>
                                        <span className="block font-medium">Địa điểm</span>
                                        <span className="block text-[1.5rem]">
                                            {refactorLocation(job?.jobWorkingLocation)}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-start gap-7">
                                    <BsSuitcaseLg className="text-[2.6rem] text-[var(--primary-color)]" />
                                    <p>
                                        <span className="block font-medium">Ngành nghề</span>
                                        <span className="block text-[1.5rem]">{job?.jobCareers}</span>
                                    </p>
                                </div>
                                <div className="flex items-start gap-7">
                                    <BiSolidCategory className="text-[2.6rem] text-[var(--primary-color)]" />
                                    <p>
                                        <span className="block font-medium">Hình thức</span>
                                        <span className="block text-[1.5rem]">{job?.jobType}</span>
                                    </p>
                                </div>
                                <div className="flex items-start gap-7">
                                    <CgTimelapse className="text-[2.6rem] text-[var(--primary-color)]" />
                                    <p>
                                        <span className="block font-medium">Kinh nghiệm</span>
                                        <span className="block text-[1.5rem]">{job?.jobExp}</span>
                                    </p>
                                </div>
                                <div className="flex items-start gap-7">
                                    <AiOutlineDollar className="text-[2.6rem] text-[var(--primary-color)]" />
                                    <p>
                                        <span className="block font-medium">Mức lương</span>
                                        <span className="block text-[1.5rem]">{job?.jobSalaryRange}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-10">
                                <h2 className="text-[1.8rem] font-medium">Vị trí</h2>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d501725.41842091794!2d106.36554998959083!3d10.755292877461148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1718459748065!5m2!1sen!2s"
                                    loading="lazy"
                                    allowFullScreen=""
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-[300px] md:h-[500px] lg:h-[240px] xl:h-[300px]"
                                ></iframe>
                            </div>
                            <div className="space-y-10">
                                <h2 className="text-[1.8rem] font-medium">Kỹ năng</h2>
                                <ul className="flex items-center flex-wrap gap-3 text-[1.4rem]">
                                    {job?.jobSkills?.map((js, index) => {
                                        return (
                                            <li key={index} className="shadow-md rounded-md bg-white px-3 py-1">
                                                {js?.label}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-14 rounded-lg bg-[#f4f6fb] p-10">
                            <div className="space-y-3">
                                <div className="flex justify-center">
                                    <div className="w-[120px] h-[120px]">
                                        <img
                                            src={job?.companyId?.avatar}
                                            alt="company avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <Link
                                    href={`/company/${setSlug(job?.companyId?.companyName)}?requestId=${
                                        job?.companyId?._id
                                    }`}
                                    className="block text-center text-[1.8rem] font-medium"
                                >
                                    {job?.companyId?.companyName}
                                </Link>
                                <a
                                    href={job?.companyId?.website}
                                    target="_blank"
                                    className="block text-center font-medium text-blue-600 underline"
                                >
                                    Website công ty
                                </a>
                            </div>
                            <hr></hr>
                            <div className="space-y-10">
                                <p>
                                    <span className="flex items-center gap-3 text-[#808080]">
                                        <FaLocationDot />
                                        <span>Địa chỉ:</span>
                                    </span>
                                    <span className="block text-[1.7rem] font-medium">
                                        {job?.companyId?.companyAddress?.district +
                                            ', ' +
                                            job?.companyId?.companyAddress?._province?.name}
                                    </span>
                                </p>
                                <p>
                                    <span className="flex items-center gap-3 text-[#808080]">
                                        <FaPeopleGroup />
                                        <span>Quy mô:</span>
                                    </span>
                                    <span className="block text-[1.7rem] font-medium">
                                        {job?.companyId?.companySize?.from +
                                            '-' +
                                            job?.companyId?.companySize?.to +
                                            ' nhân viên'}
                                    </span>
                                </p>
                                <p>
                                    <span className="flex items-center gap-3 text-[#808080]">
                                        <FaEnvelope />
                                        <span>Email:</span>
                                    </span>
                                    <span className="block text-[1.7rem] font-medium">
                                        {job?.companyId?.companyEmail}
                                    </span>
                                </p>
                                <p>
                                    <span className="flex items-center gap-3 text-[#808080]">
                                        <FaPhone />
                                        <span>Số điện thoại:</span>
                                    </span>
                                    <span className="block text-[1.7rem] font-medium">
                                        {job?.companyId?.companyPhone}
                                    </span>
                                </p>
                                <p>
                                    <span className="flex items-center gap-3 text-[#808080]">
                                        <BiSolidCategory />
                                        <span>Ngành:</span>
                                    </span>
                                    <span className="block text-[1.7rem] font-medium">
                                        {job?.companyId?.companyCareer}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {openApplyForm && (
                <div
                    onClick={() => setOpenApplyForm(false)}
                    className="flex fixed top-0 left-0 bottom-0 right-0 z-[999] overflow-auto bg-black/30"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="m-auto w-[650px] rounded-lg bg-white px-8 py-6 animate-fadeIn"
                    >
                        <div className="mb-5 border-b-2 border-dashed pb-5 flex items-center">
                            <h2 className="flex-1 truncate text-[2rem] font-bold">
                                Ứng tuyển <span className="text-[var(--primary-color)]">{job?.jobTitle}</span>
                            </h2>
                            <div className="hover:bg-white hover:text-red-500">
                                <FaXmark
                                    onClick={() => setOpenApplyForm(false)}
                                    className="text-[2.4rem] cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="space-y-10">
                            <div className="space-y-3">
                                <h3 className="flex items-end gap-3">
                                    <RiFolderUserFill className="text-[2.4rem] text-[var(--primary-color)]" />
                                    <span className="font-semibold">Chọn CV để ứng tuyển</span>
                                </h3>
                                <div className="space-y-2 border border-[var(--primary-color)] rounded-lg px-6 py-5">
                                    <div className="flex items-start gap-3 text-[var(--primary-color)]">
                                        <span className="flex items-center gap-3 font-medium whitespace-nowrap">
                                            <IoDocumentText className="text-[1.8rem]" />
                                            <span>CV ứng tuyển:</span>
                                        </span>
                                        {mainCV?.path ? (
                                            <a
                                                href={mainCV?.path}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                className="truncate font-bold"
                                            >
                                                {mainCV?.name?.slice(8)}
                                            </a>
                                        ) : (
                                            <p className="font-bold text-red-600">
                                                Vui lòng upload CV hoặc đặt CV chính
                                            </p>
                                        )}
                                    </div>
                                    <p className="space-x-3 text-[1.5rem]">
                                        <span className="text-[#808080]">Họ và tên:</span>
                                        <span className="font-semibold">{resume?.userId?.fullName}</span>
                                    </p>
                                    <p className="space-x-3 text-[1.5rem]">
                                        <span className="text-[#808080]">Email:</span>
                                        <span className="font-semibold">{resume?.userId?.email}</span>
                                    </p>
                                    <p className="space-x-3 text-[1.5rem]">
                                        <span className="text-[#808080]">Số điện thoại:</span>
                                        <span className="font-semibold">{resume?.userId?.phone}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="flex items-end gap-3">
                                    <FaFeatherPointed className="text-[2.4rem] text-[var(--primary-color)]" />
                                    <span className="font-semibold">Thư giới thiệu</span>
                                </h3>
                                <p className="text-[1.45rem] font-medium text-[#808080]">
                                    Một thư giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn
                                    tượng hơn với nhà tuyển dụng.
                                </p>
                                <textarea
                                    placeholder="Viết thư giới thiệu ngắn gọn về bản thân"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    rows="4"
                                    cols="50"
                                    className="block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem]"
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-3 border p-5">
                            <span className="flex items-center gap-2 text-[1.8rem] font-semibold text-red-500">
                                <IoWarning className="text-[2rem]" />
                                <span>Lưu ý:</span>
                            </span>
                            <div className="text-[1.5rem]">
                                <p>
                                    1. Tất cả các bạn hãy luôn cẩn trọng trong quá trình tìm việc và chủ động nghiên cứu
                                    về thông tin công ty, vị trí việc làm trước khi ứng tuyển. Liên hệ qua{' '}
                                    <b className="text-[var(--primary-color)]">timviecnhanh.site@gmail.com</b> nếu cần
                                    hỗ trợ
                                </p>
                                <p>
                                    2. Tìm hiểu thêm kinh nghiệm phòng tránh lừa đảo{' '}
                                    <a
                                        href="https://blog.topcv.vn/huong-dan-tim-viec-an-toan-trong-ky-nguyen-so/"
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="font-bold text-[var(--primary-color)]"
                                    >
                                        tại đây
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                        <div className="mt-7 flex items-start gap-3">
                            <button
                                onClick={handleApplyJob}
                                className={`flex-1 rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] py-3 text-[1.5rem] font-medium text-white ${
                                    mainCV?.path ? '' : 'pointer-events-none opacity-45 '
                                }`}
                            >
                                Nộp hồ sơ
                            </button>
                            <button
                                onClick={() => setOpenApplyForm(false)}
                                className="rounded-lg bg-gray-500 hover:bg-red-500 px-7 py-3 text-[1.5rem] font-medium text-white"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default JobDetail;
