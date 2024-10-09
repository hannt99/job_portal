'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { IoSearchOutline } from 'react-icons/io5';
import { CiLocationOn, CiViewList, CiDesktop } from 'react-icons/ci';
import { LiaPencilRulerSolid, LiaHandPointer } from 'react-icons/lia';
import { FaFileUpload } from 'react-icons/fa';

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Aos from 'aos';
import 'aos/dist/aos.css';

import CompanyCard from '@/components/common/companyCard';
import JobCard from '@/components/common/jobCard';

import axios from 'axios';

export default function Home() {
    const [jobKeyword, setJobKeyword] = useState('');

    const [allProvinces, setAllProvinces] = useState([]);
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                setAllProvinces(res?.data?.data);
            } catch (err) {
                console.log(`An error occurred in the fetchProvinces function: ${err}`);
                return;
            }
        };

        fetchProvinces();
    }, []);
    const [province, setProvince] = useState('');

    const [topCompanies, setTopCompanies] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/company/get-all?sort=-followers&limit=20&page=1`,
                );
                const res2 = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/get-all?jobStatus=Đang tuyển&limit=100&page=1`,
                );
                setTopCompanies(res?.data?.companies);
                setAllJobs(res2?.data?.jobs);
                return;
            } catch (err) {
                console.log(`fetchCompany error: ${err}`);
                return;
            }
        };
        fetchCompany();
    }, []);

    const [featJobs, setFeatJobs] = useState([]);
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/job/get-all?sort=-jobApplicants&limit=6&page=1`,
                );
                setFeatJobs(res?.data?.jobs);
                return;
            } catch (err) {
                console.log(`fetchJob error: ${err}`);
                return;
            }
        };
        fetchJob();
    }, []);

    useEffect(() => {
        Aos.init({ duration: 1200 });
    }, []);

    return (
        <>
            <div className="relative h-screen lg:h-fit xl:h-screen w-full bg-[#f8ede8] md:py-0 lg:py-36 xl:py-0 grid grid-cols-3">
                <div></div>
                <div className="hidden lg:block w-auto h-full overflow-hidden col-span-2 animate-fadeInFromR">
                    <img
                        src="../assets/images/home-bg.webp"
                        alt="home bg"
                        className="w-full h-full object-contain translate-x-24"
                    />
                </div>
                <div className="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center">
                    <div className="w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] px-5 md:px-0">
                        <div className="w-full lg:w-[55%] animate-fadeInFromB">
                            <h1 className="text-[2.4rem] md:text-[4.5rem] font-semibold tracking-wide">
                                Tham gia và Khám phá hàng ngàn cơ hội việc làm
                            </h1>
                            <p className="mt-2 text-[1.4rem] text-[#808080]">
                                Tìm việc làm, ứng viên và cơ hội nghề nghiệp
                            </p>
                            <div className="mt-16 border rounded-lg bg-white p-5 grid grid-cols-1 md:grid-cols-5 gap-y-3">
                                <div className="relative md:border-r col-span-2">
                                    <input
                                        placeholder="Tên việc làm"
                                        type="text"
                                        value={jobKeyword}
                                        onChange={(e) => setJobKeyword(e.target.value)}
                                        className={`block w-full outline-none rounded-lg py-5 pl-5 pr-16 text-[1.5rem]`}
                                    />
                                    <IoSearchOutline className="absolute top-[50%] translate-y-[-50%] right-0 mr-5 text-[2rem]" />
                                </div>
                                <div className="relative md:border-l col-span-2">
                                    <select
                                        value={province}
                                        onChange={(e) => setProvince(e.target.value)}
                                        className={`block w-full outline-none rounded-lg bg-white hover:bg-[#f9f9fb] px-5 py-5 text-[1.5rem] cursor-pointer`}
                                    >
                                        <option value="">-- Tỉnh/Thành phố --</option>
                                        {allProvinces?.map((p, index) => {
                                            return (
                                                <option key={index} value={p?.name}>
                                                    {p?.name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <CiLocationOn className="absolute top-[50%] translate-y-[-50%] right-0 mr-5 bg-white text-[2rem]" />
                                </div>
                                <Link
                                    href={`/job/search-job?k=${jobKeyword}&p=${province}`}
                                    className="block rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] py-5 text-center text-white"
                                >
                                    Tìm kiếm
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full bg-white flex justify-center">
                <div className="w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] px-5 md:px-0 py-20">
                    <h2 className="w-full flex items-center gap-6">
                        <span className="block h-[2px] bg-[#f71616] flex-1 opacity-30"></span>
                        <span className="text-[2rem] md:text-[2.4rem] font-semibold tracking-wider">
                            CÁC CÔNG TY HÀNG ĐẦU
                        </span>
                        <span className="block h-[2px] bg-[#f71616] flex-1 opacity-30"></span>
                    </h2>
                    <div className="mt-10" data-aos="fade-up">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation={{
                                prevEl: '.swiper-button-prev',
                                nextEl: '.swiper-button-next',
                            }}
                            pagination={{
                                dynamicBullets: true,
                                clickable: true,
                            }}
                            // onSwiper={(swiper) => console.log(swiper)}
                            // onSlideChange={() => console.log('slide change')}
                            rewind={true}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 20,
                                },
                            }}
                            className="mySwiper"
                        >
                            {topCompanies?.map((tc, index) => {
                                const jobs = allJobs?.filter((aj) => aj?.companyId?._id === tc?._id);
                                return (
                                    <SwiperSlide key={index}>
                                        <CompanyCard
                                            key={index}
                                            id={tc?._id}
                                            companyName={tc?.companyName}
                                            companyAddress={tc?.companyAddress?._province?.name}
                                            companyAvatar={tc?.avatar}
                                            allOpenJobs={jobs?.length}
                                        />
                                    </SwiperSlide>
                                );
                            })}
                            <div className="swiper-button-prev">&lt;</div>
                            <div className="swiper-button-next">&gt;</div>
                        </Swiper>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] px-5 md:px-0 py-20">
                <h2 className="w-full flex items-center gap-6">
                    <span className="block h-[2px] bg-[#f71616] opacity-30 flex-1"></span>
                    <span className="text-[2rem] md:text-[2.4rem] font-semibold tracking-wider">VIỆC LÀM NỔI BẬT</span>
                    <span className="block h-[2px] bg-[#f71616] opacity-30 flex-1"></span>
                </h2>
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5" data-aos="fade-up">
                    {featJobs?.map((fj, index) => {
                        return (
                            <JobCard
                                key={index}
                                id={fj?._id}
                                jobTitle={fj?.jobTitle}
                                jobSalaryRange={fj?.jobSalaryRange}
                                jobWorkingLocation={fj?.jobWorkingLocation}
                                updatedAt={fj?.updatedAt}
                                companyId={fj?.companyId?._id}
                                companyName={fj?.companyId?.companyName}
                                companyAvatar={fj?.companyId?.avatar}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="w-full bg-white flex justify-center">
                <div className="w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] px-5 md:px-0 py-20">
                    <h2 className="w-full flex items-center gap-6">
                        <span className="block h-[2px] bg-[#f71616] opacity-30 flex-1"></span>
                        <span className="text-[2rem] md:text-[2.4rem] font-semibold tracking-wider">
                            Cách chúng tôi hoạt động
                        </span>
                        <span className="block h-[2px] bg-[#f71616] opacity-30 flex-1"></span>
                    </h2>
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" data-aos="fade-up">
                        <div className="w-full flex flex-col items-center gap-10">
                            <div className="w-[120px] h-[120px] custom-shadow-v2 rounded-full hover:bg-[var(--primary-color)] text-[var(--primary-color)] hover:text-white flex">
                                <LiaPencilRulerSolid className="m-auto text-[5rem]" />
                            </div>
                            <h2 className="font-semibold">Đăng ký tài khoản</h2>
                            <p className="text-center text-[1.3rem] text-[#808080]">
                                The latest design trends meet hand-crafted templates in Sassio Collection.
                            </p>
                        </div>
                        <div className="w-full flex flex-col items-center gap-10">
                            <div className="w-[120px] h-[120px] custom-shadow-v2 rounded-full hover:bg-[var(--primary-color)] text-[var(--primary-color)] hover:text-white flex">
                                <CiViewList className="m-auto text-[5rem]" />
                            </div>
                            <h2 className="font-semibold">Tạo hồ sơ việc làm</h2>
                            <p className="text-center text-[1.3rem] text-[#808080]">
                                The latest design trends meet hand-crafted templates in Sassio Collection.
                            </p>
                        </div>
                        <div className="w-full flex flex-col items-center gap-10">
                            <div className="w-[120px] h-[120px] custom-shadow-v2 rounded-full hover:bg-[var(--primary-color)] text-[var(--primary-color)] hover:text-white flex">
                                <CiDesktop className="m-auto text-[5rem]" />
                            </div>
                            <h2 className="font-semibold">Đăng tải CV của bạn</h2>
                            <p className="text-center text-[1.3rem] text-[#808080]">
                                The latest design trends meet hand-crafted templates in Sassio Collection.
                            </p>
                        </div>
                        <div className="w-full flex flex-col items-center gap-10">
                            <div className="w-[120px] h-[120px] custom-shadow-v2 rounded-full hover:bg-[var(--primary-color)] text-[var(--primary-color)] hover:text-white flex">
                                <LiaHandPointer className="m-auto text-[5rem]" />
                            </div>
                            <h2 className="font-semibold">Tìm cơ hội việc làm</h2>
                            <p className="text-center text-[1.3rem] text-[#808080]">
                                The latest design trends meet hand-crafted templates in Sassio Collection.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-[690px] lg:w-[960px] xl:w-[1200px] px-5 md:px-0 py-20">
                <div className="w-full min-h-[460px] rounded-[3rem] bg-home grid grid-cols-1 xl:grid-cols-2 gap-10">
                    <div className="space-y-10 p-20 flex flex-col justify-center" data-aos="fade-right">
                        <div className="space-y-10">
                            <h2 className="text-[3.6rem] font-semibold text-white">
                                Muốn Tăng Cơ Hội Việc Làm Của Bạn, Hãy Upload CV Của Bạn Tại Đây
                            </h2>
                            <p className="text-[1.4rem] font-medium text-white ">
                                Hãy tạo 1 CV thật ấn tượng để có thể thu hút các nhà tuyển dụng cũng như tăng cơ hội tìm
                                được việc làm chất lượng nhé!
                            </p>
                        </div>
                        <Link
                            href="/account/cv-manage"
                            className="w-fit px-16 py-5 rounded-xl bg-white flex items-center gap-3"
                        >
                            <FaFileUpload />
                            <span>Upload CV</span>
                        </Link>
                    </div>
                    <div className="overflow-hidden">
                        <div className="w-full h-auto pt-10" data-aos="fade-left">
                            <img src="../assets/images/home-img.webp" alt="home-img" className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
