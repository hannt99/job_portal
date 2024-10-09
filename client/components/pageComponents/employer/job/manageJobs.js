'use client';

import { useState, useEffect } from 'react';

import DesktopJobItem from './desktopJobItem';
import MobileJobItem from './mobileJobItem';
import useDebounce from '@/hooks/useDebounce';

import Pagination from '@/components/common/pagination';

import axios from 'axios';

import { success, error } from '@/utils/toastMessage';

const ManageJobs = () => {
    const [reRender, setReRender] = useState(false);

    const [allJobs, setAllJobs] = useState([]);

    const [searchValue, setSearchValue] = useState('');
    const debouncedValue = useDebounce(searchValue, 300);

    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/get-all-by-employer?limit=6&page=${page}&search=${debouncedValue}`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                    },
                );
                setAllJobs(res?.data?.jobs);
                setPages(res?.data?.totalPages);
                return;
            } catch (err) {
                console.log('Error in fetchJobs:', err?.response?.data.message);
                return;
            }
        };
        fetchJobs();
    }, [debouncedValue, page, reRender]);

    const handleDeleteJob = async (id) => {
        const confirmMsg = `Bạn có chắc muốn xóa vĩnh viễn việc làm này không?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/job/delete/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            setReRender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            return error(err?.response?.data?.message);
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-[2.4rem] font-semibold">Quản lý việc làm</h1>
            <div className="mt-10 custom-shadow-v1 bg-white px-9 py-12">
                <div className="mb-10 flex items-center justify-between">
                    <h2 className="border-l-4 border-red-600 pl-4 flex-1 font-medium">Danh sách việc làm</h2>
                    <input
                        placeholder="Tìm kiếm..."
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 flex-1 text-[1.5rem]"
                    />
                </div>
                <div className="hidden xl:block">
                    <div className="bg-[var(--secondary-color)] px-10 py-7 grid grid-cols-7 gap-16 font-medium text-[var(--primary-color)]">
                        <h3 className="col-span-3">Tên công việc</h3>
                        <h3 className="col-span-1">Đơn ứng cử</h3>
                        <h3 className="col-span-1">Ngày hết hạn</h3>
                        <h3 className="col-span-1">Trạng thái</h3>
                        <h3 className="col-span-1">Thao tác</h3>
                    </div>
                    {allJobs?.length === 0 ? (
                        <p className="mt-5 text-center">Chưa tạo việc làm</p>
                    ) : (
                        allJobs?.map((ajs, index) => {
                            return (
                                <DesktopJobItem
                                    key={index}
                                    jobId={ajs?._id}
                                    companyAvatar={ajs?.companyId?.avatar}
                                    jobTitle={ajs?.jobTitle}
                                    jobSalaryRange={ajs?.jobSalaryRange}
                                    jobWorkingLocation={ajs?.jobWorkingLocation}
                                    jobDeadline={ajs?.jobDeadline}
                                    jobStatus={ajs?.jobStatus}
                                    jobApplicants={ajs?.jobApplicants}
                                    handleDeleteJob={() => handleDeleteJob(ajs?._id)}
                                />
                            );
                        })
                    )}
                </div>
                <div className="block xl:hidden">
                    <div className="grid grid-cols-1 gap-5">
                        {allJobs?.length === 0 ? (
                            <p className="text-center mt-5">Chưa tạo việc làm</p>
                        ) : (
                            allJobs?.map((ajs, index) => {
                                return (
                                    <MobileJobItem
                                        key={index}
                                        companyAvatar={ajs?.companyId?.avatar}
                                        jobTitle={ajs?.jobTitle}
                                        jobSalaryRange={ajs?.jobSalaryRange}
                                        jobWorkingLocation={ajs?.jobWorkingLocation}
                                        jobStatus={ajs?.jobStatus}
                                        jobId={ajs?._id}
                                        handleDeleteJob={() => handleDeleteJob(ajs?._id)}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
                <div className="mt-10">
                    <Pagination page={page} pages={pages} changePage={setPage} />
                </div>
            </div>
        </div>
    );
};

export default ManageJobs;
