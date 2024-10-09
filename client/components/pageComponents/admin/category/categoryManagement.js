'use client';

import { useState, useEffect } from 'react';

import Pagination from '@/components/common/pagination';

import { MdOutlineEdit, MdDeleteOutline } from 'react-icons/md';

import axios from 'axios';

import { success, error } from '@/utils/toastMessage';

const CategoryManagement = () => {
    const [reRender, setReRender] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/category/get-all?limit=100&page=${page}`,
                );
                setCategories(res?.data?.categories);
                return setPages(res?.data?.totalPages);
            } catch (err) {
                console.log('Error in fetchCategory:', err?.response?.data.message);
                return;
            }
        };
        fetchCategory();
    }, [page, reRender]);

    const handleSubmit = async () => {
        if (!category) return;
        let res;
        try {
            if (!categoryId) {
                res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/category/create`,
                    { category },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                    },
                );
            } else {
                res = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/category/update/${categoryId}`,
                    { category },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                    },
                );
            }
            setCategory('');
            setCategoryId('');
            setIsEdit(false);
            setReRender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            return error(err?.response?.data.message);
        }
    };

    const handleEdit = async (id) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category/get/${id}`);
            setCategoryId(id);
            setCategory(res?.data?.category?.category);
            return setIsEdit(true);
        } catch (err) {
            console.log('Error in handleEdit:', err?.response?.data.message);
            return;
        }
    };

    const handleDelete = async (id) => {
        const confirmMsg = `Bạn có chắc muốn xóa vĩnh viễn ngành nghề này không?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/category/delete/${id}`, {
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
            <h1 className="text-[2.8rem] font-semibold">Quản lý ngành nghề</h1>

            <div className="mt-10 flex items-center gap-5">
                <input
                    placeholder="Nhập tên ngành nghề"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 flex-1 text-[1.5rem]"
                />
                <button
                    onClick={handleSubmit}
                    className="rounded-lg bg-[var(--primary-color)] px-5 py-3 font-medium text-white"
                >
                    {!isEdit || !category ? 'Thêm' : 'Cập nhật'}
                </button>
                {!isEdit ||
                    (category && (
                        <button
                            onClick={() => {
                                setCategoryId(''), setCategory(''), setIsEdit(false);
                            }}
                            className="rounded-lg bg-[#cccccc] px-5 py-3 font-medium text-white"
                        >
                            Hủy
                        </button>
                    ))}
            </div>

            <div className="relative mt-12 overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-left rtl:text-right text-[1.6rem] text-gray-500">
                    <thead className="bg-[rgb(229,241,238)] text-[1.5rem] text-gray-700 uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Ngành nghề
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ngày tạo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Xóa</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.map((c, index) => {
                            return (
                                <tr key={index} className="border-b bg-white hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {c?.category}
                                    </th>
                                    <td className="px-6 py-4">{new Date(c?.createdAt)?.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center gap-5">
                                            <button
                                                onClick={() => handleEdit(c?._id)}
                                                className="text-[2.4rem] font-medium text-green-600 hover:underline"
                                            >
                                                <MdOutlineEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c?._id)}
                                                className="text-[2.4rem] font-medium text-red-600 hover:underline"
                                            >
                                                <MdDeleteOutline />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="flex justify-center">
                    <Pagination page={page} pages={pages} changePage={setPage} />
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;
