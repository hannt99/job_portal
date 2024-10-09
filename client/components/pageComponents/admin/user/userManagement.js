'use client';

import { useState, useEffect } from 'react';

import { MdDeleteOutline } from 'react-icons/md';

import axios from 'axios';

import { success, error } from '@/utils/toastMessage';

const UserManagement = () => {
    const [reRender, setReRender] = useState(false);

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/get-all`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                return setUsers(res?.data?.users);
            } catch (err) {
                console.log('Error in fetchUser:', err?.response?.data.message);
                return;
            }
        };
        fetchUser();
    }, [reRender]);

    const handleDelete = async (id) => {
        const confirmMsg = `Bạn có chắc muốn xóa vĩnh viễn người dùng này không?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/delete/${id}`, {
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
            <h1 className="text-[2.8rem] font-semibold">Danh sách người dùng</h1>

            <div className="relative mt-12 overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-left rtl:text-right text-[1.6rem] text-gray-500">
                    <thead className="bg-[rgb(229,241,238)] text-[1.5rem] text-gray-700 uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Họ và tên
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Số điện thoại
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Vai trò
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Xóa</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((u, index) => {
                            return (
                                <tr key={index} className="border-b bg-white hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center gap-5">
                                            <div className="w-[40px] h-[40px] rounded-full">
                                                <img
                                                    src={u?.avatar}
                                                    alt="user_avatar"
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                            <span>{u?.fullName}</span>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{u?.email}</td>
                                    <td className="px-6 py-4">{u?.phone}</td>
                                    <td className="px-6 py-4 font-medium">{u?.role === 0 ? 'Employer' : 'Candidate'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(u?._id)}
                                            className="text-[2.4rem] font-medium text-red-600 hover:underline"
                                        >
                                            <MdDeleteOutline />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
