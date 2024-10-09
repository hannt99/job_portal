'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import JobCard from '@/components/common/jobCard';
import Pagination from '@/components/common/pagination';

import useDebounce from '@/hooks/useDebounce';

// import { escape } from 'validator';

import axios from 'axios';

import { FaFilter, FaWpforms } from 'react-icons/fa';
import { IoSearchOutline } from 'react-icons/io5';
import { CiLocationOn } from 'react-icons/ci';
import { BsSuitcaseLg } from 'react-icons/bs';
import { CgTimelapse } from 'react-icons/cg';
import { AiOutlineDollar } from 'react-icons/ai';

const JobSearch = () => {
    const [openFilter, setOpenFilter] = useState(false);

    const [jobKeyword, setJobKeyword] = useState('');
    const debouncedValue = useDebounce(jobKeyword, 300);

    const searchParams = useSearchParams();
    useEffect(() => {
        searchParams.size !== 0 && setJobKeyword(decodeURIComponent(searchParams.get('k')) || '');
        searchParams.size !== 0 && setJobWorkingLocation(decodeURIComponent(searchParams.get('p')) || '');
        searchParams.size !== 0 && window.history.replaceState(null, '', '/job/search-job');
    }, [searchParams.size]);

    const [careers, setCareers] = useState([]);
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category/get-all?limit=100`);

                const categories = res?.data?.categories || [];
                // Map categories to the desired format
                const careerOptions = categories.map((ct) => ({
                    label: ct.category,
                    value: ct.category,
                }));
                setCareers(careerOptions);
            } catch (err) {
                console.log('Error in fetchCategory:', err?.response?.data.message || err.message);
                return;
            }
        };
        fetchCategory();
    }, []);
    const [jobCareer, setJobCareer] = useState('');

    const exps = ['Chưa có kinh nghiệm', 'Dưới 1 năm', '1 năm', '2 năm', '3 năm', '4 năm', '5 năm', 'Trên 5 năm'];
    const [jobExp, setJobExp] = useState('');

    const salaryRanges = [
        'Dưới 10 triệu',
        '15 - 20 triệu',
        '20 - 25 triệu',
        '25 - 30 triệu',
        '30 - 50 triệu',
        'Trên 50 triệu',
        'Thỏa thuận',
    ];
    const [jobSalaryRange, setJobSalaryRange] = useState('');

    const jobTypes = ['Freelancer', 'Part time', 'Full time', 'Thời vụ'];
    const [jobType, setJobType] = useState('');

    const [allJobWorkingLocation, setAllJobWorkingLocation] = useState([]);
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                setAllJobWorkingLocation(res?.data?.data);
            } catch (err) {}
        };
        fetchProvinces();
    }, []);
    const [jobWorkingLocation, setJobWorkingLocation] = useState('');

    const [sort, setSort] = useState('-updatedAt');
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);

    const [allJobs, setAllJobs] = useState([]);
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/get-all?search=${debouncedValue}&jobCareers=${jobCareer}&jobExp=${jobExp}&jobSalaryRange=${jobSalaryRange}&jobType=${jobType}&jobWorkingLocation=${jobWorkingLocation}&sort=${sort}&limit=10&page=${page}`,
                );
                setAllJobs(res?.data?.jobs);
                setPages(res?.data?.totalPages);
                return;
            } catch (err) {
                console.log('Error in fetchJob:', err?.response?.data.message || err.message);
                return;
            }
        };
        fetchJob();
    }, [debouncedValue, jobCareer, jobExp, jobSalaryRange, jobType, jobWorkingLocation, sort, page]);

    const handleRemoveFilter = () => {
        setJobKeyword('');
        setJobCareer('');
        setJobExp('');
        setJobSalaryRange('');
        setJobType('');
        setJobWorkingLocation('');
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
                                    className="mx-1 w-3 h-3 text-gray-400 "
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                                <span className="ml-1 md:ml-2 text-[1.5rem] font-normal text-[#808080]">
                                    Tìm việc làm
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="w-full flex justify-center">
                <div className="w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] px-5 md:px-0 py-20 grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="space-y-8 xl:col-span-1">
                        {openFilter && (
                            <div
                                onClick={() => setOpenFilter(!openFilter)}
                                className="flex items-center justify-center gap-2 xl:hidden w-[120px] rounded-lg bg-red-500 px-8 py-5 font-medium text-white cursor-pointer"
                            >
                                <FaFilter />
                                <span>Bộ lọc</span>
                            </div>
                        )}

                        {openFilter && (
                            <div className="block xl:hidden space-y-10 border rounded-3xl bg-[var(--secondary-color)] p-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-x-5 gap-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[1.8rem] font-semibold">Từ khóa</label>
                                        <div className="relative">
                                            <input
                                                placeholder="Tên việc làm"
                                                type="text"
                                                value={jobKeyword}
                                                onChange={(e) => setJobKeyword(e.target.value)}
                                                className="block w-full outline-none border rounded-lg py-5 pl-20 pr-8 text-[1.5rem]"
                                            />
                                            <IoSearchOutline className="absolute top-[50%] translate-y-[-50%] left-[18px] text-[2.2rem]" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[1.8rem] font-semibold">Địa điểm làm việc</label>
                                        <div className="relative">
                                            <select
                                                value={jobWorkingLocation}
                                                onChange={(e) => setJobWorkingLocation(e.target.value)}
                                                className="block w-full outline-none border rounded-lg bg-white py-5 pl-20 pr-8 text-[1.5rem]"
                                            >
                                                <option value="">Tất cả tỉnh/thành phố</option>
                                                {allJobWorkingLocation?.map((p, index) => {
                                                    return (
                                                        <option key={index} value={p?.name}>
                                                            {p?.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <CiLocationOn className="absolute top-[50%] translate-y-[-50%] left-[18px] text-[2.2rem]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-x-5 gap-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[1.8rem] font-semibold">Ngành nghề</label>
                                        <div className="relative">
                                            <select
                                                value={jobCareer}
                                                onChange={(e) => setJobCareer(e.target.value)}
                                                className="block w-full outline-none border rounded-lg bg-white py-5 pl-20 pr-8 text-[1.5rem]"
                                            >
                                                <option value="">Tất cả ngành nghề</option>
                                                {careers?.map((cr, index) => {
                                                    return (
                                                        <option key={index} value={cr?.value}>
                                                            {cr?.label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <BsSuitcaseLg className="absolute top-[50%] translate-y-[-50%] left-[18px] text-[2.2rem]" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[1.8rem] font-semibold">Hình thức</label>
                                        <div className="relative">
                                            <select
                                                value={jobType}
                                                onChange={(e) => setJobType(e.target.value)}
                                                className="block w-full outline-none border rounded-lg bg-white py-5 pl-20 pr-8 text-[1.5rem]"
                                            >
                                                <option value="">Tất cả hình thức</option>
                                                {jobTypes?.map((jt, index) => {
                                                    return (
                                                        <option key={index} value={jt}>
                                                            {jt}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <FaWpforms className="absolute top-[50%] translate-y-[-50%] left-[18px] text-[2.2rem]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-x-5 gap-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[1.8rem] font-semibold">Kinh nghiệm</label>
                                        <div className="relative">
                                            <select
                                                value={jobExp}
                                                onChange={(e) => setJobExp(e.target.value)}
                                                className="block w-full outline-none border rounded-lg bg-white py-5 pl-20 pr-8 text-[1.5rem]"
                                            >
                                                <option value="">Tất cả kinh nghiệm</option>
                                                {exps?.map((je, index) => {
                                                    return (
                                                        <option key={index} value={je}>
                                                            {je}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <CgTimelapse className="absolute top-[50%] translate-y-[-50%] left-[18px] text-[2.2rem]" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[1.8rem] font-semibold">Mức lương</label>
                                        <div className="relative">
                                            <select
                                                value={jobSalaryRange}
                                                onChange={(e) => setJobSalaryRange(e.target.value)}
                                                className="block w-full outline-none border rounded-lg bg-white py-5 pl-20 pr-8 text-[1.5rem]"
                                            >
                                                <option value="">Tất cả mức lương</option>
                                                {salaryRanges?.map((jsr, index) => {
                                                    return (
                                                        <option key={index} value={jsr}>
                                                            {jsr}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <AiOutlineDollar className="absolute top-[50%] translate-y-[-50%] left-[18px] text-[2.2rem]" />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRemoveFilter}
                                    className="block w-full rounded-lg bg-red-600 hover:bg-red-700 py-3 text-center font-medium text-white"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}
                        <div className="hidden xl:block space-y-10 border rounded-3xl bg-[var(--secondary-color)] p-10">
                            <div className="space-y-4">
                                <label className="text-[1.8rem] font-semibold">Từ khóa</label>
                                <div className="relative">
                                    <input
                                        placeholder="Tên việc làm hoặc công ty"
                                        type="text"
                                        value={jobKeyword}
                                        onChange={(e) => setJobKeyword(e.target.value)}
                                        className="block w-full outline-none border rounded-lg py-5 pl-20 pr-8 text-[1.5rem]"
                                    />
                                    <IoSearchOutline className="absolute top-[50%] translate-y-[-50%] left-[18px] text-[2.2rem]" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[1.8rem] font-semibold">Địa điểm làm việc</label>
                                <div className="relative">
                                    <select
                                        value={jobWorkingLocation}
                                        onChange={(e) => setJobWorkingLocation(e.target.value)}
                                        className="block w-full outline-none border rounded-lg bg-white py-5 pl-20 pr-8 text-[1.5rem]"
                                    >
                                        <option value="">Tất cả tỉnh/thành phố</option>
                                        {allJobWorkingLocation?.map((p, index) => {
                                            return (
                                                <option key={index} value={p?.name}>
                                                    {p?.name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <CiLocationOn className="absolute top-[50%] translate-y-[-50%] left-[18px] text-[2.2rem]" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[1.8rem] font-semibold">Ngành nghề</label>
                                <div className="relative">
                                    <select
                                        value={jobCareer}
                                        onChange={(e) => setJobCareer(e.target.value)}
                                        className="block w-full outline-none border rounded-lg bg-white py-5 pl-20 pr-8 text-[1.5rem]"
                                    >
                                        <option value="">Tất cả ngành nghề</option>
                                        {careers?.map((c, index) => {
                                            return (
                                                <option key={index} value={c?.value}>
                                                    {c?.label}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <BsSuitcaseLg className="absolute top-[50%] translate-y-[-50%] left-[18px] text-[2.2rem]" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[1.8rem] font-semibold">Hình thức</label>
                                {jobTypes?.map((jt, index) => {
                                    return (
                                        <div key={index} className="flex item-center gap-3">
                                            <input
                                                type="radio"
                                                checked={jobType === jt}
                                                onChange={() => setJobType(jt)}
                                            />
                                            <label
                                                className={`text-[1.5rem] ${
                                                    jobType === jt ? 'text-black' : 'text-[#808080]'
                                                }`}
                                            >
                                                {jt}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="space-y-4">
                                <label className="text-[1.8rem] font-semibold">Kinh nghiệm</label>
                                {exps?.map((ex, index) => {
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                checked={jobExp === ex}
                                                onChange={() => setJobExp(ex)}
                                            />
                                            <label
                                                className={`text-[1.5rem] ${
                                                    jobExp === ex ? 'text-black' : 'text-[#808080]'
                                                }`}
                                            >
                                                {ex}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="space-y-4">
                                <label className="text-[1.8rem] font-semibold">Mức lương</label>
                                {salaryRanges?.map((sr, index) => {
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                checked={jobSalaryRange === sr}
                                                onChange={() => setJobSalaryRange(sr)}
                                            />
                                            <label
                                                className={`text-[1.5rem] ${
                                                    jobSalaryRange === sr ? 'text-black' : 'text-[#808080]'
                                                }`}
                                            >
                                                {sr}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                onClick={handleRemoveFilter}
                                className="block w-full rounded-lg bg-red-600 hover:bg-red-700 py-3 text-center font-medium text-white"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>

                        <div className="hidden xl:grid grid-cols-3 bg-[var(--secondary-color)] rounded-3xl border">
                            <div className="col-span-2 p-10 space-y-7">
                                <h2 className="text-[1.8rem] font-semibold">Bạn là nhà tuyển dụng?</h2>
                                <p className="text-[1.4rem] text-[#808080]">
                                    Bạn đang muốn tìm kiếm nhân sự giỏi cho công ty? Hãy đăng ký ngay!
                                </p>
                                <Link
                                    href="/signin"
                                    className="block w-fit rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] px-16 py-5 text-center font-medium text-white"
                                >
                                    Đăng ký ngay
                                </Link>
                            </div>
                            <div className="w-full h-full bg-ads"></div>
                        </div>
                    </div>
                    <div className="xl:col-span-2">
                        <div className="mb-14 flex justify-between">
                            {!openFilter && (
                                <div
                                    onClick={() => setOpenFilter(!openFilter)}
                                    className="flex items-center justify-center gap-2 xl:hidden w-[120px] rounded-lg bg-red-500 px-8 py-5 font-medium text-white cursor-pointer"
                                >
                                    <FaFilter />
                                    <span>Bộ lọc</span>
                                </div>
                            )}
                            <div></div>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="block w-[120px] outline-none border rounded-lg bg-[#f1f1f1] px-8 py-5 text-[1.4rem] text-[#808080]"
                            >
                                <option value="-updatedAt">Mặc định</option>
                                <option value="-createdAt">Mới nhất</option>
                                <option value="createdAt">Cũ nhất</option>
                            </select>
                        </div>
                        <div className="space-y-8">
                            {allJobs?.length === 0 ? (
                                <p className="text-center">Không tìm thấy dữ liệu</p>
                            ) : (
                                allJobs?.map((aj, index) => {
                                    return (
                                        <JobCard
                                            key={index}
                                            id={aj?._id}
                                            companyId={aj?.companyId?._id}
                                            companyName={aj?.companyId?.companyName}
                                            companyAvatar={aj?.companyId?.avatar}
                                            jobTitle={aj?.jobTitle}
                                            jobSalaryRange={aj?.jobSalaryRange}
                                            jobWorkingLocation={aj?.jobWorkingLocation}
                                            updatedAt={aj?.updatedAt}
                                        />
                                    );
                                })
                            )}
                            <div className="flex justify-center">
                                <Pagination page={page} pages={pages} changePage={setPage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JobSearch;
