'use client';

import { useState, useRef } from 'react';
import FormData from 'form-data';
import axios from 'axios';
import { success, warning } from '@/utils/toastMessage';

const DragAndDropFile = ({ setReRender }) => {
    const inputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);

    const allowedFileTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/pdf',
        'image/*',
    ];

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            console.log(`e.dataTransfer.files['length']: ${e.dataTransfer.files['length']}`);
            for (let i = 0; i < e.dataTransfer.files['length']; i++) {
                setFiles((prevState) => [...prevState, e.dataTransfer.files[i]]);
            }
        }
    };

    const openFileExplorer = () => {
        inputRef.current.value = '';
        inputRef.current.click();
    };

    const handleChange = (e) => {
        e.preventDefault();
        // console.log('File has been added');
        if (e.target.files && e.target.files[0]) {
            // console.log(e.target.files);
            for (let i = 0; i < e.target.files['length']; i++) {
                setFiles((prevState) => [...prevState, e.target.files[i]]);
            }
        }
    };

    const removeFile = (fileName, idx) => {
        setFiles((files) => files.filter((_, f) => f !== idx));
    };

    const handleSubmitFile = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            warning('Hãy chọn ít nhất 1 CV');
        } else {
            // Client-side file type validation
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileType = file.type;

                if (!allowedFileTypes.includes(fileType) && !fileType.startsWith('image/')) {
                    warning(`Định dạng tập tin không được hỗ trợ: ${file.name}`);
                    return;
                }

                // Check if the file size exceeds 5MB
                if (file.size > MAX_FILE_SIZE) {
                    warning(`Kích thước tập tin vượt quá 5MB: ${file.name}`);
                    return;
                }
            }

            const data = new FormData();
            for (let i = 0; i < files.length; i++) {
                data.append('myCV', files[i]);
            }
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/resume/upload-cv`, data, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setFiles([]);
                setReRender(false);
                return success(res?.data?.message);
            } catch (err) {
                return warning(err?.response?.data?.message);
            }
        }
    };

    return (
        <form
            className={`${
                dragActive ? 'bg-blue-400' : 'bg-blue-100'
            }  w-full min-h-[300px] p-4 text-center flex flex-col items-center justify-center`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onSubmit={(e) => e.preventDefault()}
        >
            {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
            <input
                placeholder="fileInput"
                ref={inputRef}
                type="file"
                accept=".xls, .xlsx, .doc, .docx, .ppt, .pptx, .txt, .pdf, image/*"
                multiple={true}
                className="hidden"
                onChange={handleChange}
            />
            <svg
                className="mb-4 w-12 h-12 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
            >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
            </svg>
            <p className="font-medium">
                Tải lên CV của bạn,{' '}
                <span className="font-bold text-blue-600 cursor-pointer" onClick={openFileExplorer}>
                    <u>Chọn</u>
                </span>{' '}
                hoặc kéo thả
            </p>
            <p className="text-[1.5rem] text-[#808080] mt-4">
                Hỗ trợ định dạng <span className="font-bold">.doc, .docx, .pdf</span> có kích thước dưới{' '}
                <span className="font-bold">5MB</span>
            </p>
            <div className="p-3 flex flex-col items-center">
                {files.map((file, idx) => (
                    <div key={idx} className="space-x-5 flex flex-row">
                        <span>{file.name}</span>
                        <span className="text-red-500 cursor-pointer" onClick={() => removeFile(file.name, idx)}>
                            Xoá
                        </span>
                    </div>
                ))}
            </div>

            <button
                className="mt-3 w-auto rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] p-2"
                onClick={handleSubmitFile}
            >
                <span className="px-14 py-2 font-medium text-white">Tải lên</span>
            </button>
        </form>
    );
};

export default DragAndDropFile;
