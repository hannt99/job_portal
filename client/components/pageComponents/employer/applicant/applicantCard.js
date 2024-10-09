import { useState } from 'react';

import { FaEnvelope, FaPhone, FaCheck, FaRegCircleXmark, FaFeatherPointed } from 'react-icons/fa6';

import axios from 'axios';

import { socket } from '@/socket';

import { success } from '@/utils/toastMessage';

const ApplicantCard = (props) => {
    const [openCoverLetter, setOpenCoverLetter] = useState(false);

    const handleDecideApply = async (status, userId) => {
        const data = {
            status,
            userId,
        };
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/job/decide-applicant/${props.jobId}`,
                data,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                },
            );
            socket.emit('sendNotification', {
                receiverId: res?.data?.receiverId,
            });
            props.setReRender(false);
            return success(res?.data?.message);
        } catch (err) {
            console.log('Error in handleDecideApply:', err?.response?.data.message);
            return;
        }
    };

    return (
        <div>
            <div className="border-b p-5 flex flex-col md:flex-row items-center md:items-start gap-5">
                <div className="w-[100px] h-[100px] md:w-[70px] md:h-[70px] border border-black rounded-full">
                    <img src={props?.avatar} alt="user avatar" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-[2rem] font-medium">{props?.fullName}</h2>
                    <div className="block md:flex flex-wrap items-center gap-5">
                        <p className="flex items-center justify-center gap-2 text-[#808080]">
                            <FaEnvelope />
                            <span>{props?.email}</span>
                        </p>
                        <p className="flex items-center justify-center gap-2 text-[#808080]">
                            <FaPhone />
                            <span>{props?.phone}</span>
                        </p>
                    </div>
                    <div className="mt-5 flex items-center gap-8">
                        <a
                            href={props?.cvPath}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="block text-blue-700 underline"
                        >
                            CV ứng viên
                        </a>
                        <div
                            onClick={() => setOpenCoverLetter(!openCoverLetter)}
                            className="font-medium hover:underline cursor-pointer"
                        >
                            Thư giới thiệu
                        </div>
                    </div>
                    {props?.status === 'Đã ứng tuyển' ? (
                        <div className="mt-5 flex items-center justify-center md:justify-start gap-5">
                            <div
                                onClick={() => handleDecideApply('Phù hợp', props?.userId)}
                                className="rounded-lg bg-[var(--secondary-color)] p-3 text-[1.8rem] text-[var(--primary-color)] cursor-pointer"
                            >
                                <FaCheck />
                            </div>
                            <div
                                onClick={() => handleDecideApply('Chưa phù hợp', props?.userId)}
                                className="rounded-lg bg-red-200 p-3 text-[1.8rem] text-red-600 cursor-pointer"
                            >
                                <FaRegCircleXmark />
                            </div>
                        </div>
                    ) : (
                        <p className="mt-5 text-[#808080] space-x-2">
                            <span>Trạng thái:</span>
                            <span
                                className={`font-medium ${
                                    props?.status === 'Phù hợp' ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {props?.status}
                            </span>
                        </p>
                    )}
                </div>
            </div>
            {openCoverLetter && (
                <div className="mt-5">
                    <h3 className="flex items-center gap-3">
                        <FaFeatherPointed className="text-[2rem] text-[var(--primary-color)]" />
                        <span className="font-semibold">Thư giới thiệu</span>
                    </h3>
                    <p className="mt-3 border-2 border-dashed rounded-lg p-3 text-[1.5rem] text-[#808080] whitespace-pre-wrap">
                        {props?.coverLetter}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ApplicantCard;
