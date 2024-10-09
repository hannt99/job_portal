'use client';

import { useState, useEffect } from 'react';

import LineChart from './lineChart';
import PieChart from './pieChart';

import { FaRegUser, FaRegBell, FaXmark } from 'react-icons/fa6';
import { IoDocumentTextOutline, IoBriefcaseOutline } from 'react-icons/io5';
import { BiCategory } from 'react-icons/bi';

import { formatVNTimeAgo } from '@/utils/formatDateTime';

import axios from 'axios';

const Dashboard = () => {
    const [reRender, setReRender] = useState(false);

    const [users, setUsers] = useState({
        employers: 0,
        candidates: 0,
    });
    const [categories, setCategories] = useState(0);
    const [jobs, setJobs] = useState(0);
    const [notifications, setNotifications] = useState([]);
    
    const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
    const [filterYear, setFilterYear] = useState(2024);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/get-admin-dashboard`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setUsers({
                    employers: res?.data?.employers,
                    candidates: res?.data?.candidates,
                });
                setCategories(res?.data?.categories);
                setJobs(res?.data?.jobs);
                setNotifications(res?.data?.notifications);
            } catch (err) {
                console.log('Error in fetchDashboard:', err?.response?.data.message);
                return;
            }
        };

        fetchDashboard();
    }, [reRender]);

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notification/delete/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            return setReRender(!reRender);
        } catch (err) {
            console.log('Error in handleDelete:', err?.response?.data.message);
            return;
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-[2.4rem] font-semibold">Bảng tin!</h1>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-11">
                <div className="w-full custom-shadow-v1 rounded-lg bg-white p-10 flex items-center justify-between">
                    <div className="w-[70px] h-[70px] rounded-lg bg-blue-100 flex">
                        <FaRegUser className="m-auto text-[4rem] text-blue-700" />
                    </div>
                    <div className="text-right">
                        <span className="block text-[2.8rem] font-semibold text-blue-700">
                            {users?.employers + users?.candidates}
                        </span>
                        <span className="block text-[1.4rem]">Người dùng</span>
                    </div>
                </div>
                <div className="w-full custom-shadow-v1 rounded-lg bg-white p-10 flex items-center justify-between">
                    <div className="w-[70px] h-[70px] rounded-lg bg-red-100 flex">
                        <IoDocumentTextOutline className="m-auto text-[4rem] text-red-700" />
                    </div>
                    <div className="text-right">
                        <span className="block text-[2.8rem] font-semibold text-red-700">{jobs}</span>
                        <span className="block text-[1.4rem]">Việc làm</span>
                    </div>
                </div>
                <div className="w-full custom-shadow-v1 rounded-lg bg-white p-10 flex items-center justify-between">
                    <div className="w-[70px] h-[70px] rounded-lg bg-orange-100 flex">
                        <BiCategory className="m-auto text-[4rem] text-orange-400" />
                    </div>
                    <div className="text-right">
                        <span className="block text-[2.8rem] font-semibold text-orange-400">{categories}</span>
                        <span className="block text-[1.4rem]">Ngành nghề</span>
                    </div>
                </div>
                <div className="w-full custom-shadow-v1 rounded-lg bg-white p-10 flex items-center justify-between">
                    <div className="w-[70px] h-[70px] rounded-lg bg-green-100 flex">
                        <FaRegBell className="m-auto text-[4rem] text-green-700" />
                    </div>
                    <div className="text-right">
                        <span className="block text-[2.8rem] font-semibold text-green-700">
                            {notifications?.length}
                        </span>
                        <span className="block text-[1.4rem]">Thông báo</span>
                    </div>
                </div>
            </div>
            <div className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="space-y-10 h-fit xl:col-span-2">
                    <div className="space-y-3 custom-shadow-v1 rounded-lg bg-white p-10">
                        <div className="flex justify-end">
                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="block w-[100px] outline-none border rounded-lg bg-[#f1f1f1] px-8 py-5 text-[1.4rem] text-[#808080]"
                            >
                                {years?.map((y, index) => {
                                    return (
                                        <option key={index} value={y}>
                                            {y}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <LineChart year={filterYear} />
                    </div>
                    <div className="custom-shadow-v1 rounded-lg bg-white p-10">
                        <PieChart employers={users?.employers} candidates={users?.candidates} />
                    </div>
                </div>
                <div className="xl:col-span-1 min-h-fit max-h-[430px] custom-shadow-v1 rounded-lg bg-white p-10">
                    <h2 className="text-[1.8rem] font-semibold">Thông báo</h2>
                    <ul className="space-y-5 mt-10 w-full h-full overflow-y-auto no-scrollbar">
                        {notifications?.length === 0 ? (
                            <p className="text-center">Không có thông báo</p>
                        ) : (
                            notifications?.map((noti, index) => {
                                return (
                                    <li
                                        key={index}
                                        className="group/item-list relative w-full py-3 flex items-center gap-5"
                                    >
                                        <div className="w-[35px] h-[35px] rounded-full bg-blue-100 flex">
                                            <IoBriefcaseOutline className="m-auto text-[1.8rem] text-blue-700"/>
                                        </div>
                                        <div className="space-y-1 w-full flex-1">
                                            <p title={noti?.notification} className="truncate-1">
                                                {noti?.notification}
                                            </p>
                                            <p className="text-[1.3rem] text-[#808080]">
                                                {formatVNTimeAgo(noti?.createdAt)}
                                            </p>
                                        </div>
                                        <div
                                            onClick={() => handleDelete(noti?._id)}
                                            className="hidden group-hover/item-list:flex absolute top-[50%] translate-y-[-50%] right-0 w-[30px] h-[30px] custom-shadow-v2 rounded-full bg-white text-[1.8rem] leading-none cursor-pointer"
                                        >
                                            <FaXmark className="m-auto" />
                                        </div>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
