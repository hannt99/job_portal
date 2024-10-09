'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
    emailValidator,
    passwordValidator,
    fullNameValidator,
    phoneValidator,
    numberValidatorFrom,
    numberValidatorTo,
    dropListValidator,
} from '@/utils/formValidation';

import Loading from '@/components/common/loading';
import axios from 'axios';
import { socket } from '@/socket';

import { success, error } from '@/utils/toastMessage';

const RegisterEmployer = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [isEmailErr, setIsEmailErr] = useState(false);
    const [emailErrMsg, setEmailErrMsg] = useState({});

    const [password, setPassword] = useState('');
    const [isPasswordErr, setIsPasswordErr] = useState(false);
    const [passwordErrMsg, setPasswordErrMsg] = useState({});

    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordErr, setIsConfirmPasswordErr] = useState(false);
    const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState({});

    const [fullName, setFullName] = useState('');
    const [isFullNameErr, setIsFullNameErr] = useState(false);
    const [fullNameErrMsg, setFullNameErrMsg] = useState({});

    const [phone, setPhone] = useState('');
    const [isPhoneErr, setIsPhoneErr] = useState(false);
    const [phoneErrMsg, setPhoneErrMsg] = useState({});

    const [companyName, setCompanyName] = useState('');
    const [isCompanyNameErr, setIsCompanyNameErr] = useState(false);
    const [companyNameErrMsg, setCompanyNameErrMsg] = useState({});

    const [companySizeFrom, setCompanySizeFrom] = useState(0);
    const [isCompanySizeFromErr, setIsCompanySizeFromErr] = useState(false);
    const [companySizeFromErrMsg, setCompanySizeFromErrMsg] = useState({});

    const [companySizeTo, setCompanySizeTo] = useState(0);
    const [isCompanySizeToErr, setIsCompanySizeToErr] = useState(false);
    const [companySizeToErrMsg, setCompanySizeToErrMsg] = useState({});

    const [position, setPosition] = useState('');
    const [isPositionErr, setIsPositionErr] = useState(false);
    const [positionErrMsg, setPositionErrMsg] = useState({});

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

    const [isChecked, setIsChecked] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        const isEmailValid = emailValidator(email, setIsEmailErr, setEmailErrMsg);
        const isPasswordValid = passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg);
        const isConfirmPasswordValid = passwordValidator(
            confirmPassword,
            password,
            setIsConfirmPasswordErr,
            setConfirmPasswordErrMsg,
        );
        const isFullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        const isPhoneValid = phoneValidator(phone, setIsPhoneErr, setPhoneErrMsg);
        const isCompanyNameValid = fullNameValidator(companyName, setIsCompanyNameErr, setCompanyNameErrMsg);
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
        const isPositionValid = dropListValidator(position, setIsPositionErr, setPositionErrMsg);
        const isProvinceValid = dropListValidator(province, setIsProvinceErr, setProvinceErrMsg);

        if (
            !isEmailValid ||
            !isPasswordValid ||
            !isConfirmPasswordValid ||
            !isFullNameValid ||
            !isPhoneValid ||
            !isCompanyNameValid ||
            !isCompanySizeFromValid ||
            !isCompanySizeToValid ||
            !isPositionValid ||
            !isProvinceValid ||
            !isChecked
        )
            return;

        setIsLoading(true);

        const _province = new Function('return ' + province)();
        const data = {
            email,
            password,
            fullName,
            phone,
            companyName,
            companySize: { from: companySizeFrom, to: companySizeTo },
            position,
            companyAddress: { _province, district },
            role: 0,
        };
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setFullName('');
            setPhone('');
            setCompanyName('');
            setCompanySizeFrom('');
            setCompanySizeTo('');
            setPosition('');
            setProvince('');
            setDistrict('');
            socket.emit('sendNotification', {
                receiverId: res?.data?.adminId,
            });
            setIsLoading(false);
            success(res?.data?.message);
            return router.push('/signin');
        } catch (err) {
            setIsLoading(false);
            return error(err?.response?.data?.message);
        }
    };

    return (
        <div className="relative w-[360px] md:w-[690px] lg:w-[925px] xl:w-[1120px] px-5 md:px-0 grid grid-cols-1 xl:grid-cols-2 z-50">
            <div className="w-full h-fit rounded-lg bg-white px-9 py-8">
                <div className="flex justify-center">
                    <div className="w-[160px] h-auto">
                        <img src="../assets/images/logo.png" alt="logo" className="w-full h-full" />
                    </div>
                </div>
                <form>
                    <div className="mt-7 space-y-7">
                        <h1 className="text-[2rem] font-semibold">Đăng ký tài khoản Nhà tuyển dụng</h1>
                        <div className="space-y-4">
                            <label className="text-[1.5rem] font-semibold">
                                Địa chỉ Email<span className="text-red-600 text-[1.8rem]">*</span>
                            </label>
                            <input
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => emailValidator(email, setIsEmailErr, setEmailErrMsg)}
                                className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                    isEmailErr ? 'border-red-600' : ''
                                }`}
                            />
                            <p className="text-red-600 text-[1.3rem]">{emailErrMsg.email}</p>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[1.5rem] font-semibold">
                                Mật khẩu<span className="text-red-600 text-[1.8rem]">*</span>
                            </label>
                            <input
                                placeholder="Mật khẩu"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() =>
                                    passwordValidator(password, password, setIsPasswordErr, setPasswordErrMsg)
                                }
                                className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                    isPasswordErr ? 'border-red-600' : ''
                                }`}
                            />
                            <p className="text-[1.3rem] text-red-600">{passwordErrMsg.password}</p>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[1.5rem] font-semibold">
                                Xác nhận mật khẩu<span className="text-red-600 text-[1.8rem]">*</span>
                            </label>
                            <input
                                placeholder="Xác nhận mật khẩu"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={() =>
                                    passwordValidator(
                                        confirmPassword,
                                        password,
                                        setIsConfirmPasswordErr,
                                        setConfirmPasswordErrMsg,
                                    )
                                }
                                className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                    isConfirmPasswordErr ? 'border-red-600' : ''
                                }`}
                            />
                            <p className="text-red-600 text-[1.3rem]">{confirmPasswordErrMsg.confirmPassword}</p>
                        </div>
                    </div>
                    <div className="mt-5 space-y-7">
                        <h2 className="text-[2rem] font-semibold">Thông tin nhà tuyển dụng</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-4">
                                <label className="text-[1.5rem] font-semibold">
                                    Họ và tên<span className="text-red-600 text-[1.8rem]">*</span>
                                </label>
                                <input
                                    placeholder="Nguyễn Văn A"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    onBlur={() => fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg)}
                                    className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                        isFullNameErr ? 'border-red-600' : ''
                                    }`}
                                />
                                <p className="text-red-600 text-[1.3rem]">{fullNameErrMsg.fullName}</p>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[1.5rem] font-semibold">
                                    Số điện thoại cá nhân<span className="text-red-600 text-[1.8rem]">*</span>
                                </label>
                                <input
                                    placeholder="0123456789"
                                    type="number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    onBlur={() => phoneValidator(phone, setIsPhoneErr, setPhoneErrMsg)}
                                    className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem] ${
                                        isPhoneErr ? 'border-red-600' : ''
                                    }`}
                                />
                                <p className="text-red-600 text-[1.3rem]">{phoneErrMsg.phone}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[1.5rem] font-semibold">
                                Tên công ty<span className="text-red-600 text-[1.8rem]">*</span>
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
                            <p className="text-red-600 text-[1.3rem]">{companyNameErrMsg.companyName}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-4">
                                <label className="text-[1.5rem] font-semibold">
                                    Quy mô<span className="text-red-600 text-[1.8rem]">*</span>
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
                                        <p className="text-red-600 text-[1.3rem]">{companySizeFromErrMsg.number}</p>
                                    </div>
                                    <div>
                                        <input
                                            placeholder="1-9999"
                                            type="number"
                                            value={companySizeTo}
                                            onChange={(e) => setCompanySizeTo(e.target.value)}
                                            onBlur={() =>
                                                numberValidatorTo(
                                                    companySizeTo,
                                                    companySizeFrom,
                                                    setIsCompanySizeToErr,
                                                    setCompanySizeToErrMsg,
                                                )
                                            }
                                            className={`block w-full outline-[var(--primary-color)] border rounded-lg px-5 py-3 text-[1.5rem ${
                                                isCompanySizeToErr ? 'border-red-600' : ''
                                            }`}
                                        />
                                        <p className="text-red-600 text-[1.3rem]">{companySizeToErrMsg.number}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[1.5rem] font-semibold">
                                    Vị trí công tác<span className="text-red-600 text-[1.8rem]">*</span>
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
                                <p className="text-red-600 text-[1.3rem]">{positionErrMsg.position}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-4">
                                <label className="text-[1.5rem] font-semibold">
                                    Địa điểm làm việc<span className="text-red-600 text-[1.8rem]">*</span>
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
                                            <option
                                                key={index}
                                                value={JSON.stringify({ id: p?.id, name: p?.full_name })}
                                            >
                                                {p?.full_name}
                                            </option>
                                        );
                                    })}
                                </select>
                                <p className="text-red-600 text-[1.3rem]">{provinceErrMsg.province}</p>
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
                    </div>
                    <div className="my-9 space-x-3 flex items-start">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            className="scale-125 accent-[var(--primary-color)]"
                        />
                        <label className="text-[1.5rem] leading-none">
                            Tôi đã đọc và đồng ý với{' '}
                            <Link href="#" className="font-medium text-[var(--primary-color)]">
                                Điều khoản dịch vụ
                            </Link>{' '}
                            và{' '}
                            <Link href="#" className="font-medium text-[var(--primary-color)]">
                                Chính sách bảo mật
                            </Link>{' '}
                            của TimViecNhanh
                        </label>
                    </div>
                    <button
                        onClick={handleRegister}
                        className={`w-full rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] py-3 flex items-center justify-center gap-3 font-medium text-white transition-all ${
                            !isChecked ? 'pointer-events-none opacity-40' : ''
                        }`}
                    >
                        {isLoading && <Loading />}
                        <span>Hoàn tất</span>
                    </button>
                </form>
                <div className="mt-7 space-x-5 text-center">
                    <span className="text-[1.5rem] text-[#aaaaaa]">Bạn đã có tài khoản?</span>
                    <Link
                        href="/signin"
                        className="font-medium text-black hover:text-[var(--primary-color)] transition-all"
                    >
                        Đăng nhập
                    </Link>
                </div>
                <div className="mt-12 text-center text-[1.5rem] font-medium text-[#aaaaaa]">
                    © 2024 TimViecNhanh. Designed by Christopher Wong.
                </div>
            </div>
        </div>
    );
};

export default RegisterEmployer;
