import { FaXmark } from 'react-icons/fa6';
import Link from 'next/link';

const CheckRoleRegister = ({ setRegisterOpen }) => {
    return (
        <div
            onClick={() => setRegisterOpen(false)}
            className="fixed top-0 right-0 bottom-0 left-0 z-[999] overflow-auto bg-black/30 py-5 flex"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-[calc(100%-48px)] md:w-[700px] lg:w-[800px] m-auto border rounded-3xl bg-white animate-fadeIn"
            >
                <div className="pt-20 pb-8 text-center">
                    <p className="text-[2rem] font-semibold">Chào bạn,</p>
                    <p className="px-10 md:px-0 text-[1.5rem] text-[#aaaaaa]">
                        Bạn hãy dành ra vài giây để xác nhận thông tin dưới đây nhé! &#128276;
                    </p>
                </div>
                <div className="pt-9 pb-20 px-10 md:px-16 border-t rounded-3xl">
                    <p className="px-0 md:px-40 text-center text-[1.5rem] md:text-[1.7rem] font-medium">
                        Để tối ưu tốt nhất cho trải nghiệm của bạn với TimViecNhanh, vui lòng lựa chọn nhóm phù hợp nhất
                        với bạn.
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-3 gap-y-10">
                        <div className="w-full h-full flex flex-col items-center">
                            <div className="w-[140px] md:w-[320px] h-auto">
                                <img
                                    src="../assets/images/employer.png"
                                    alt="employer"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <Link
                                href="/register/employer"
                                className="block mt-5 rounded-full bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] px-5 md:px-10 py-3 text-[1.2rem] md:text-[1.3rem] text-white whitespace-nowrap transition-all"
                            >
                                Tôi là nhà tuyển dụng
                            </Link>
                        </div>
                        <div className="w-full h-full flex flex-col items-center">
                            <div className="w-[140px] md:w-[320px] h-auto">
                                <img
                                    src="../assets/images/candidate.png"
                                    alt="candidate"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <Link
                                href="/register/candidate"
                                className="block mt-5 rounded-full bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] px-5 md:px-10 py-3 text-[1.2rem] md:text-[1.3rem] text-white whitespace-nowrap transition-all"
                            >
                                Tôi là ứng cử viên
                            </Link>
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => setRegisterOpen(false)}
                    className="block md:hidden absolute top-0 right-0 p-5 text-[2.4rem] cursor-pointer"
                >
                    <FaXmark />
                </div>
            </div>
        </div>
    );
};

export default CheckRoleRegister;
