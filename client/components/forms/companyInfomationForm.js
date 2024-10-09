'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), {
    ssr: false,
});
import FormData from 'form-data';
import { fullNameValidator, dropListValidator, numberValidatorFrom, numberValidatorTo } from '@/utils/formValidation';

import Loading from '@/components/common/loading';
import axios from 'axios';

import { success, error } from '@/utils/toastMessage';

const CompanyInfomationForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [reRender, setReRender] = useState(false);

    const ref = useRef();

    const [companyName, setCompanyName] = useState('');
    const [isCompanyNameErr, setIsCompanyNameErr] = useState(false);
    const [companyNameErrMsg, setCompanyNameErrMsg] = useState({});

    const [companyEmail, setCompanyEmail] = useState('');

    const [companyPhone, setCompanyPhone] = useState('');

    const [allProvinces, setAllProvinces] = useState([]);
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                setAllProvinces(res?.data?.data);
            } catch (err) {
                console.log(`An error occurred in the fetchProvinces function: ${err?.response}`);
            }
        };

        fetchProvinces();
    }, []);
    const [province, setProvince] = useState('');
    const [isProvinceErr, setIsProvinceErr] = useState(false);
    const [provinceErrMsg, setProvinceErrMsg] = useState({});

    const [allDistricts, setAllDistricts] = useState([]);
    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const _province = new Function('return ' + province)();
                const provinceId = _province?.id;

                const res = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);

                setAllDistricts(res?.data?.data);
            } catch (err) {
                console.log(`An error occurred in the fetchDistricts function: ${err?.response}`);
            }
        };
        fetchDistricts();
    }, [province]);
    const [district, setDistrict] = useState('');

    const [companySizeFrom, setCompanySizeFrom] = useState(Number);
    const [isCompanySizeFromErr, setIsCompanySizeFromErr] = useState(false);
    const [companySizeFromErrMsg, setCompanySizeFromErrMsg] = useState({});

    const [companySizeTo, setCompanySizeTo] = useState(Number);
    const [isCompanySizeToErr, setIsCompanySizeToErr] = useState(false);
    const [companySizeToErrMsg, setCompanySizeToErrMsg] = useState({});

    const [careers, setCareers] = useState([]);
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category/get-all?limit=100&page=1`);
                return setCareers(res?.data?.categories);
            } catch (err) {
                console.log(`An error occurred in the fetchCategory function: ${err?.response?.data?.message}`);
                return;
            }
        };
        fetchCategory();
    }, []);
    const [companyCareer, setCompanyCareer] = useState('');
    const [isCompanyCareerErr, setIsCompanyCareerErr] = useState(false);
    const [companyCareerErrMsg, setCompanyCareerErrMsg] = useState({});

    const [position, setPosition] = useState('');
    const [isPositionErr, setIsPositionErr] = useState(false);
    const [positionErrMsg, setPositionErrMsg] = useState({});

    const [introduction, setIntroduction] = useState('');

    const [avatar, setAvatar] = useState('');

    const [website, setWebsite] = useState('');

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/company/get-by-employer`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                setCompanyName(res?.data?.company?.companyName);
                setCompanyEmail(res?.data?.company?.companyEmail);
                setCompanyPhone(res?.data?.company?.companyPhone);
                setProvince(JSON.stringify(res?.data?.company?.companyAddress?._province));
                setDistrict(res?.data?.company?.companyAddress?.district);
                setCompanySizeFrom(res?.data?.company?.companySize?.from);
                setCompanySizeTo(res?.data?.company?.companySize?.to);
                setCompanyCareer(res?.data?.company?.companyCareer);
                setPosition(res?.data?.company?.position);
                setIntroduction(res?.data?.company?.introduction);
                setAvatar(res?.data?.company?.avatar);
                setWebsite(res?.data?.company?.website);
                return;
            } catch (err) {
                console.log(`An error occurred in the fetchCompany function: ${err?.response?.data?.message}`);
                return;
            }
        };
        fetchCompany();
    }, [reRender]);

    const handleChangeAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('companyAvatar', file);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/company/change-avatar`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            ref.current.value = '';
            setReRender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            console.log(`Error in handleChangeAvatar: ${err}`);
            return error(err?.response?.data?.message);
        }
    };

    const handleUpdateInfo = async () => {
        const isCompanyNameValid = fullNameValidator(companyName, setIsCompanyNameErr, setCompanyNameErrMsg);
        // email

        // sdt

        const isProvinceValid = dropListValidator(province, setIsProvinceErr, setProvinceErrMsg);
        const isCompanySizeFromValid = numberValidatorFrom(
            companySizeFrom,
            setIsCompanySizeFromErr,
            setCompanySizeFromErrMsg,
        );
        const isCompanySizeToValid = numberValidatorTo(
            companySizeTo,
            companySizeFrom,
            setIsCompanySizeToErr,
            setCompanySizeToErrMsg,
        );
        const isCompanyCareerValid = fullNameValidator(companyCareer, setIsCompanyCareerErr, setCompanyCareerErrMsg);
        const isPositionValid = dropListValidator(position, setIsPositionErr, setPositionErrMsg);

        if (
            !isCompanyNameValid ||
            // email
            // sdt
            !isProvinceValid ||
            !isCompanySizeFromValid ||
            !isCompanySizeToValid ||
            !isCompanyCareerValid ||
            !isPositionValid
        ) {
            return;
        }

        setIsLoading(true);

        const _province = new Function('return ' + province)();

        const data = {
            companyName,
            companyEmail,
            companyPhone,
            companyAddress: { _province, district },
            companySize: { from: companySizeFrom, to: companySizeTo },
            companyCareer,
            position,
            introduction,
            website,
        };

        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/company/update`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            setIsLoading(false);
            setReRender(!reRender);
            return success(res?.data?.message);
        } catch (err) {
            setIsLoading(false);
            return error(err?.response?.data?.message);
        }
    };

    return (
        <div className="p-7">
            <h2 className="pl-4 border-l-4 border-red-600 font-semibold text-[1.8rem]">Thông tin công ty</h2>
            <div className="mt-10 grid grid-cols-2 gap-5 ">
                <div className="flex items-center gap-5">
                    <div className="w-[45px] h-[45px] border border-black rounded-full">
                        <img src={avatar} alt="user avatar" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div>
                        <input
                            ref={ref}
                            type="file"
                            name="companyAvatar"
                            id="companyAvatar"
                            className="inputfile"
                            onChange={(e) => handleChangeAvatar(e)}
                        />
                        <label htmlFor="companyAvatar" className="font-medium text-[1.5rem] cursor-pointer hover:underline">
                            Đổi avatar
                        </label>
                    </div>
                </div>
            </div>
            <div className=" mt-5 space-y-4">
                <label className="text-[1.5rem] font-semibold">
                    Tên công ty<span className="text-[1.8rem] text-red-600">*</span>
                </label>
                <input
                    placeholder="Công ty TNHH ABC"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onBlur={() => fullNameValidator(companyName, setIsCompanyNameErr, setCompanyNameErrMsg)}
                    className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                        isCompanyNameErr ? 'border-red-600' : ''
                    }`}
                />
                <p className="text-[1.3rem] text-red-600">{companyNameErrMsg.companyName}</p>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                    <label className="text-[1.5rem] font-semibold">Email</label>
                    <input
                        placeholder="name@example.com"
                        type="email"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        className="block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem]"
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[1.5rem] font-semibold">Số điện thoại</label>
                    <input
                        placeholder="0123456789"
                        type="text"
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                        className="block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem]"
                    />
                </div>
            </div>
            <div className="mt-5 space-y-4">
                <label className="text-[1.5rem] font-semibold">Website</label>
                <input
                    placeholder="https://www.companyname.com"
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem]"
                />
            </div>
            <div className="mt-5 space-y-4">
                <label className="text-[1.5rem] font-semibold">
                    Ngành nghề<span className="text-[1.8rem] text-red-600">*</span>
                </label>
                <select
                    value={companyCareer}
                    onChange={(e) => setCompanyCareer(e.target.value)}
                    onBlur={() => dropListValidator(companyCareer, setIsCompanyCareerErr, setCompanyCareerErrMsg)}
                    className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                        isCompanyCareerErr ? 'border-red-600' : ''
                    }`}
                >
                    <option value="">-- Ngành/nghề --</option>
                    {careers?.map((c, index) => {
                        return (
                            <option key={index} value={c?.category}>
                                {c?.category}
                            </option>
                        );
                    })}
                </select>
                <p className="text-[1.3rem] text-red-600">{companyCareerErrMsg.jobCareer}</p>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                    <label className="text-[1.5rem] font-semibold">
                        Quy mô<span className="text-[1.8rem] text-red-600">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <input
                                placeholder="1-9999"
                                type="number"
                                value={companySizeFrom}
                                onChange={(e) => setCompanySizeFrom(e.target.value)}
                                onBlur={() =>
                                    numberValidatorFrom(
                                        companySizeFrom,
                                        setIsCompanySizeFromErr,
                                        setCompanySizeFromErrMsg,
                                    )
                                }
                                className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                    isCompanySizeFromErr ? 'border-red-600' : ''
                                }`}
                            />
                            <p className="text-[1.3rem] text-red-600">{companySizeFromErrMsg.number}</p>
                        </div>
                        <div>
                            <input
                                placeholder="1-9999"
                                type="number"
                                value={companySizeTo}
                                onChange={(e) => setCompanySizeTo(e.target.value)}
                                onBlur={() =>
                                    numberValidatorTo(
                                        companySizeFrom,
                                        companySizeTo,
                                        setIsCompanySizeToErr,
                                        setCompanySizeToErrMsg,
                                    )
                                }
                                className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                    isCompanySizeToErr ? 'border-red-600' : ''
                                }`}
                            />
                            <p className="text-[1.3rem] text-red-600">{companySizeToErrMsg.number}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-[1.5rem] font-semibold">
                        Vị trí công tác<span className="text-[1.8rem] text-red-600">*</span>
                    </label>
                    <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        onBlur={() => dropListValidator(position, setIsPositionErr, setPositionErrMsg)}
                        className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                            isPositionErr ? 'border-red-600' : ''
                        }`}
                    >
                        <option value="">-- Chức vụ --</option>
                        <option value="Nhân viên">Nhân viên</option>
                        <option value="Trưởng nhóm">Trưởng nhóm</option>
                        <option value="Trưởng phòng">Trưởng phòng</option>
                        <option value="Phó giám đốc">Phó giám đốc</option>
                        <option value="Giám đốc">Giám đốc</option>
                    </select>
                    <p className="text-[1.3rem] text-red-600">{positionErrMsg.position}</p>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                    <label className="text-[1.5rem] font-semibold">
                        Địa điểm làm việc<span className="text-[1.8rem] text-red-600">*</span>
                    </label>
                    <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        onBlur={() => dropListValidator(province, setIsProvinceErr, setProvinceErrMsg)}
                        className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                            isProvinceErr ? 'border-red-600' : ''
                        }`}
                    >
                        <option value="">-- Tỉnh/Thành phố --</option>
                        {allProvinces?.map((p, index) => {
                            return (
                                <option key={index} value={JSON.stringify({ id: p?.id, name: p?.full_name })}>
                                    {p?.full_name}
                                </option>
                            );
                        })}
                    </select>
                    <p className="text-[1.3rem] text-red-600">{provinceErrMsg.province}</p>
                </div>
                <div className="space-y-4">
                    <label className="block pb-0 md:pb-[4px] text-[1.5rem] font-semibold">Quận/huyện</label>
                    <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                            province ? '' : 'pointer-events-none opacity-60'
                        }`}
                    >
                        <option value="">-- Quận/huyện --</option>
                        {allDistricts?.map((d, index) => {
                            return (
                                <option key={index} value={d?.full_name}>
                                    {d?.full_name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className="mt-5 space-y-4">
                <label className="text-[1.5rem] font-semibold">Giới thiệu công ty</label>
                <JoditEditor value={introduction} tabIndex={1} onBlur={(newContent) => setIntroduction(newContent)} />
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleUpdateInfo}
                    className="mt-7 w-fit rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] px-16 py-3 flex items-center justify-center gap-3 font-medium text-white transition-all"
                >
                    {isLoading && <Loading />}
                    <span>Lưu</span>
                </button>
            </div>
        </div>
    );
};

export default CompanyInfomationForm;
